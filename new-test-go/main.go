package main

import (
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Message struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

type ProduceRequest struct {
	Topic   string `json:"topic"`
	Message string `json:"message"`
}

type ConsumerConfig struct {
	Topic         string `json:"topic"`
	ConsumerGroup string `json:"consumer_group"`
}

var (
	kafkaProducer *kafka.Producer
)

func initKafkaProducer() error {
	kafkaConfig := getKafkaConfig()
	var err error
	kafkaProducer, err = kafka.NewProducer(&kafkaConfig)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	app.Use(cors.New())
	app.Use(logger.New())

	if err := initKafkaProducer(); err != nil {
		log.Fatal("Failed to initialize Kafka producer:", err)
	}

	defer kafkaProducer.Close()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Kafka Producer & Consumer Demo",
			"endpoints": fiber.Map{
				"producer": "POST /produce",
				"consumer": "POST /consume",
				"health":   "GET /health",
			},
		})
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "healthy",
			"kafka":  "connected",
		})
	})

	app.Post("/produce", produceMessage)
	app.Post("/consume", startConsumer)

	go func() {
		for e := range kafkaProducer.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					log.Printf("Delivery failed: %v\n", ev.TopicPartition)
				} else {
					log.Printf("Delivered message to %v\n", ev.TopicPartition)
				}
			}
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		log.Println("Gracefully shutting down...")
		app.Shutdown()
	}()

	log.Printf("Server starting on port 3009")
	log.Fatal(app.Listen(":3009"))
}

func produceMessage(c *fiber.Ctx) error {
	var req ProduceRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Topic == "" || req.Message == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Topic and message are required",
		})
	}

	message := Message{
		ID:        generateID(),
		Content:   req.Message,
		Timestamp: time.Now(),
	}

	messageJSON, err := json.Marshal(message)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to marshal message",
		})
	}

	err = kafkaProducer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &req.Topic, Partition: kafka.PartitionAny},
		Value:          messageJSON,
		Key:            []byte(message.ID),
	}, nil)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to produce message: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":    "success",
		"message":   "Message sent to Kafka",
		"messageId": message.ID,
		"topic":     req.Topic,
	})
}

func startConsumer(c *fiber.Ctx) error {
	var config ConsumerConfig
	if err := c.BodyParser(&config); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if config.Topic == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Topic is required",
		})
	}

	if config.ConsumerGroup == "" {
		config.ConsumerGroup = "default-group"
	}

	consumerConfig := getConsumerConfig(config.ConsumerGroup)

	consumer, err := kafka.NewConsumer(&consumerConfig)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create consumer: " + err.Error(),
		})
	}

	err = consumer.SubscribeTopics([]string{config.Topic}, nil)
	if err != nil {
		consumer.Close()
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to subscribe to topic: " + err.Error(),
		})
	}

	go func() {
		defer consumer.Close()

		for {
			msg, err := consumer.ReadMessage(100 * time.Millisecond)
			if err != nil {
				if err.(kafka.Error).Code() != kafka.ErrTimedOut {
					log.Printf("Consumer error: %v\n", err)
				}
				continue
			}

			var message Message
			if err := json.Unmarshal(msg.Value, &message); err != nil {
				log.Printf("Failed to unmarshal message: %v\n", err)
				continue
			}

			log.Printf("Consumed message: %s from topic %s (partition %d, offset %d)\n",
				message.Content, *msg.TopicPartition.Topic, msg.TopicPartition.Partition, msg.TopicPartition.Offset)
		}
	}()

	return c.JSON(fiber.Map{
		"status":        "success",
		"message":       "Consumer started",
		"topic":         config.Topic,
		"consumerGroup": config.ConsumerGroup,
	})
}

func generateID() string {
	return time.Now().Format("20060102150405") + "-" + time.Now().Format("000")
}
