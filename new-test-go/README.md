
Server akan berjalan di port 3000.

### API Endpoints

#### 1. Health Check
```
GET /health
```

#### 2. Produce Message
```
POST /produce
Content-Type: application/json

{
  "topic": "test-topic",
  "message": "Hello Kafka!"
}
```

#### 3. Start Consumer
```
POST /consume
Content-Type: application/json

{
  "topic": "test-topic",
  "consumer_group": "my-consumer-group"
}
```

### Testing dengan cURL

#### Produce message:
```bash
curl -X POST http://localhost:3000/produce \
  -H "Content-Type: application/json" \
  -d '{"topic": "test-topic", "message": "Hello from producer!"}'
```

#### Start consumer:
```bash
curl -X POST http://localhost:3000/consume \
  -H "Content-Type: application/json" \
  -d '{"topic": "test-topic", "consumer_group": "test-group"}'
```