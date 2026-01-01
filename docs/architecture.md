# Architecture Overview

## System Architecture

GoSolidityBridge is a microservices-based payment processing system that bridges off-chain payments to on-chain transactions.

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP/gRPC
       ▼
┌─────────────────┐
│  API Gateway    │ ← Aggregates all services
└──────┬──────────┘
       │
   ┌───┴───┬──────────┬──────────────┐
   │       │          │              │
   ▼       ▼          ▼              ▼
┌─────┐ ┌──────┐  ┌─────────┐  ┌────────┐
│ Auth│ │Mock- │  │Processor│  │ Ledger │
└─────┘ │Stripe│  └────┬────┘  └────┬───┘
        └──┬───┘       │            │
           │           │            │
           ▼           ▼            ▼
      ┌────────┐  ┌──────────┐  ┌──────────┐
      │Validator│  │Notification│ │  Metrics  │
      └────────┘  └──────────┘  └──────────┘
```

## Services

### Gateway Service
- **Port**: 50051 (gRPC), 8080 (HTTP)
- **Purpose**: API gateway aggregating all services
- **Responsibilities**:
  - Route client requests to appropriate services
  - Rate limiting
  - Request/response logging
  - Health checks

### Processor Service
- **Port**: 50052 (gRPC)
- **Purpose**: Orchestrates payment processing flow
- **Responsibilities**:
  - Coordinate validator and ledger services
  - Handle idempotency
  - Retry logic
  - Error handling

### Validator Service
- **Port**: 50053 (gRPC)
- **Purpose**: Validates payment requests
- **Responsibilities**:
  - Amount limit checks
  - Fraud detection heuristics
  - Currency validation
  - Velocity checks

### Ledger Service
- **Port**: 50054 (gRPC)
- **Purpose**: Maintains account balances and transaction history
- **Responsibilities**:
  - Balance management
  - Transaction recording
  - Transaction safety (ACID guarantees)

### Mock-Stripe Service
- **Port**: 50055 (gRPC)
- **Purpose**: Simulates Stripe payment processing
- **Responsibilities**:
  - Payment intent creation
  - Payment confirmation
  - Configurable failure scenarios

### Notification Service
- **Port**: 50056 (gRPC)
- **Purpose**: Sends notifications asynchronously
- **Responsibilities**:
  - Email notifications
  - Webhook notifications
  - Async processing (fire and forget)

## Technology Stack

- **Language**: Go 1.25+
- **Communication**: gRPC (Protobuf)
- **Containerization**: Docker
- **Orchestration**: Docker Compose (local), Docker Swarm (production)
- **Monitoring**: Prometheus + Grafana
- **Security**: gosec, nancy, slither

## Data Flow

### Payment Processing Flow

1. Client sends payment request to Gateway
2. Gateway calls Mock-Stripe to create payment intent
3. Gateway calls Processor with payment details
4. Processor calls Validator to validate payment
5. If valid, Processor calls Ledger to update balance
6. Processor triggers Notification service (async)
7. Gateway returns response to client

### Key Design Principles

- **Stateless services** where possible
- **Idempotency** for all payment operations
- **Async notifications** to avoid blocking critical path
- **Health checks** for all services
- **Structured logging** with correlation IDs
- **Metrics** for observability

## Deployment

### Local Development

```bash
docker-compose up
```

### Production (Docker Swarm)

```bash
docker stack deploy -c swarm.yml gosoliditybridge
```

## Monitoring

- **Prometheus**: Metrics collection (port 9090)
- **Grafana**: Visualization (port 3001)
- **Health Endpoints**: `/health` on each service

## Security Considerations

- Services communicate over internal network
- No direct database access from gateway
- Input validation at validator service
- Rate limiting at gateway
- Security scanning in CI/CD pipeline






