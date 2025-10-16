package main

import (
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func getKafkaConfig() kafka.ConfigMap {
	config := kafka.ConfigMap{
		"bootstrap.servers": getEnv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
	}

	if saslMechanism := getEnv("KAFKA_SASL_MECHANISM", ""); saslMechanism != "" {
		config["security.protocol"] = getEnv("KAFKA_SECURITY_PROTOCOL", "SASL_SSL")
		config["sasl.mechanism"] = saslMechanism
		config["sasl.username"] = getEnv("KAFKA_SASL_USERNAME", "")
		config["sasl.password"] = getEnv("KAFKA_SASL_PASSWORD", "")
	}

	return config
}

func getConsumerConfig(groupID string) kafka.ConfigMap {
	config := getKafkaConfig()
	config["group.id"] = groupID
	config["auto.offset.reset"] = getEnv("KAFKA_AUTO_OFFSET_RESET", "earliest")
	config["enable.auto.commit"] = getEnv("KAFKA_ENABLE_AUTO_COMMIT", "true")

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}