# Implementation Roadmap

A roadmap for implementing the mock exchange platform microservices—a journey through dependencies and complexity, where each service is both a destination and a stepping stone toward the whole.

ALWAYS WRITE CODE ITERATIVELY AND FEW!

## Architecture Overview

```
[ Client ]
    |
    v
[ API Gateway ]
    |
    +---> [ Auth ]
    |
    +---> [ Mock-Stripe ] ---> [ Validator ] ---> [ Processor ] ---> [ Ledger ]
                                    |                    |                |
                                    v                    v                v
                              [ Notification ]      [ Audit ]       [ Audit ]
```

## Implementation Phases

### Phase 0: Foundation (Day 1, Morning)

**Proto Definitions** — the contracts that bind all services together.

- [ ] Define `payment.proto` (PaymentIntent, PaymentMethod, Charge, Refund)
- [ ] Define `validation.proto` (ValidationRequest, ValidationResult)
- [ ] Define `processor.proto` (ProcessPaymentRequest, ProcessingStatus)
- [ ] Define `ledger.proto` (Account, Balance, TransactionEntry)
- [ ] Define `notification.proto` (NotificationRequest, NotificationType)
- [ ] Define `gateway.proto` (aggregated endpoints for frontend)
- [ ] Define `auth.proto` (AuthenticateRequest, Token)
- [ ] Define `audit.proto` (AuditEvent, LogEntry)
- [ ] Set up `Makefile` for proto code generation
- [ ] Generate Go code from proto files

**Deliverable**: All proto files defined, Go code generated, compilation verified.

---

### Phase 1: Core Services (Day 1, Afternoon)

Services that stand alone, their existence untroubled by the complexity of others.

#### 1.1 Ledger Service

The foundation of truth—where balances live and transactions are recorded.

- [ ] Create service structure: `/backend/services/ledger/`
- [ ] Implement `ledger.proto` gRPC server
- [ ] Design data models (in-memory for MVP, or SQLite/Postgres)
- [ ] Implement `GetBalance` RPC
- [ ] Implement `UpdateBalance` RPC (with transaction safety)
- [ ] Implement `GetTransactionHistory` RPC
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile

**Dependencies**: None  
**Complexity**: Medium (requires transaction handling)  
**Estimated Time**: 2-3 hours

#### 1.2 Mock-Stripe Service

A mirror of Stripe's essence, returning deterministic responses—simple yet necessary.

- [ ] Create service structure: `/backend/services/mock-stripe/`
- [ ] Implement `payment.proto` gRPC server
- [ ] Implement `CreatePaymentIntent` RPC (returns mock intent ID)
- [ ] Implement `ConfirmPayment` RPC (returns success/failure based on test scenarios)
- [ ] Implement `GetPaymentMethod` RPC (mock card details)
- [ ] Add payment failure simulation (configurable failure rate)
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile

**Dependencies**: None  
**Complexity**: Low (stateless mock)  
**Estimated Time**: 1-2 hours

#### 1.3 Validator Service

The gatekeeper—fast, stateless, absolute in its judgments.

- [ ] Create service structure: `/backend/services/validator/`
- [ ] Implement `validation.proto` gRPC server
- [ ] Implement `ValidatePayment` RPC
  - Amount limit checks
  - Basic fraud heuristics (repeated patterns, velocity)
  - Currency validation
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile

**Dependencies**: None  
**Complexity**: Low-Medium (business logic for validation)  
**Estimated Time**: 1-2 hours

---

### Phase 2: Orchestration Layer (Day 1, Evening)

Services that coordinate the dance between others, orchestrating the flow of money and messages.

#### 2.1 Processor Service

The conductor—receives, validates, processes, and updates, all while maintaining idempotency.

- [ ] Create service structure: `/backend/services/processor/`
- [ ] Implement `processor.proto` gRPC server
- [ ] Create gRPC clients for Validator and Ledger services
- [ ] Implement `ProcessPayment` RPC:
  1. Call Validator service
  2. If valid, call Ledger to update balance
  3. Return processing status
- [ ] Add idempotency handling (track processed payment IDs)
- [ ] Add retry logic for transient failures
- [ ] Add structured JSON logging with trace IDs
- [ ] Add gRPC health checks
- [ ] Write unit tests and integration tests
- [ ] Create Dockerfile

**Dependencies**: Validator, Ledger  
**Complexity**: Medium-High (orchestration, error handling, idempotency)  
**Estimated Time**: 2-3 hours

#### 2.2 Notification Service

The messenger—fires and forgets, never blocking the critical path.

- [ ] Create service structure: `/backend/services/notification/`
- [ ] Implement `notification.proto` gRPC server
- [ ] Implement `SendNotification` RPC (email, webhook simulation)
- [ ] Add worker pool pattern for async sending
- [ ] Add retry logic with exponential backoff
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile

**Dependencies**: None (called by Processor)  
**Complexity**: Medium (async processing, worker pools)  
**Estimated Time**: 1-2 hours

---

### Phase 3: Gateway & Integration (Day 2, Morning)

The face of the system—where all services converge and clients meet the architecture.

#### 3.1 Gateway Service

The aggregator—receives requests, routes them, and presents a unified front.

- [ ] Create service structure: `/backend/services/gateway/`
- [ ] Implement `gateway.proto` gRPC server (or HTTP gateway with gRPC backend)
- [ ] Create gRPC clients for all downstream services:
  - Mock-Stripe
  - Processor
  - Ledger
- [ ] Implement aggregated endpoints:
  - `CreatePayment` (calls Mock-Stripe → Processor)
  - `GetBalance` (calls Ledger)
  - `GetPaymentStatus` (calls Processor/Mock-Stripe)
- [ ] Add request rate limiting
- [ ] Add request/response logging with correlation IDs
- [ ] Add gRPC interceptors for logging
- [ ] Add gRPC health checks
- [ ] Write integration tests
- [ ] Create Dockerfile

**Dependencies**: Mock-Stripe, Processor, Ledger  
**Complexity**: High (orchestration, error aggregation, rate limiting)  
**Estimated Time**: 2-3 hours

#### 3.2 Auth Service (Optional but Recommended)

The guardian—verifies identity before allowing passage.

- [ ] Create service structure: `/backend/services/auth/`
- [ ] Implement `auth.proto` gRPC server
- [ ] Implement `Authenticate` RPC (simple token-based for MVP)
- [ ] Implement `ValidateToken` RPC
- [ ] Add JWT token generation/validation
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile
- [ ] Integrate with Gateway service (gRPC interceptor)

**Dependencies**: None (used by Gateway)  
**Complexity**: Medium (JWT handling)  
**Estimated Time**: 1-2 hours

#### 3.3 Audit Service (Optional but Recommended)

The chronicler—silently records all that transpires.

- [ ] Create service structure: `/backend/services/audit/`
- [ ] Implement `audit.proto` gRPC server
- [ ] Implement `LogEvent` RPC (async, non-blocking)
- [ ] Add event batching for performance
- [ ] Design audit event schema (payment events, balance changes, etc.)
- [ ] Add structured JSON logging
- [ ] Add gRPC health checks
- [ ] Write unit tests
- [ ] Create Dockerfile
- [ ] Integrate audit calls into Processor and Ledger services

**Dependencies**: None (called by other services)  
**Complexity**: Low-Medium (async logging, batching)  
**Estimated Time**: 1-2 hours

---

### Phase 4: Infrastructure & Deployment (Day 2, Afternoon)

Bringing it all together—containers, networks, and the orchestration that makes them sing.

- [ ] Create `docker-compose.yml` for local development
  - All services with proper networking
  - Health checks
  - Environment variables
- [ ] Create `swarm.yml` for Docker Swarm deployment
  - Service definitions
  - Networks
  - Configs and secrets
  - Replicas configuration
- [ ] Create `Makefile` with common commands:
  - `make proto` - generate proto code
  - `make build` - build all services
  - `make test` - run tests
  - `make compose-up` - start local stack
  - `make compose-down` - stop local stack
- [ ] Add `.env.example` with configuration template
- [ ] Create integration test script (end-to-end payment flow)
- [ ] Document service discovery (Docker Swarm service names)
- [ ] Document port assignments for each service

**Deliverable**: Complete deployment setup, all services running in Docker Swarm.

---

## Testing Strategy

For each service:

1. **Unit Tests**: Test business logic in isolation
2. **Integration Tests**: Test gRPC client-server interactions
3. **End-to-End Tests**: Test full payment flow through Gateway

Key test scenarios:
- Successful payment flow
- Payment validation failures
- Service unavailability (circuit breaker behavior)
- Duplicate payment handling (idempotency)
- Concurrent payment processing

---

## Estimated Timeline

- **Phase 0 (Proto)**: 2-3 hours
- **Phase 1 (Core Services)**: 4-7 hours
- **Phase 2 (Orchestration)**: 3-5 hours
- **Phase 3 (Gateway & Integration)**: 4-7 hours
- **Phase 4 (Infrastructure)**: 2-3 hours

**Total**: ~15-25 hours (2-3 days for MVP)

---

## Implementation Notes

- **Start with the simplest, most independent services** (Ledger, Mock-Stripe, Validator)
- **Test each service in isolation** before moving to integration
- **Use Docker Compose early** to test service interactions locally
- **Log everything** with structured JSON for Docker Swarm aggregation
- **Handle errors gracefully**—failures should be logged, not crash services
- **Keep services stateless where possible**—easier to scale and reason about
- **Idempotency is critical** for payment processing—design for it from the start

---

## Success Criteria

The system is complete when:

1. All services compile and start successfully
2. Full payment flow works: Gateway → Mock-Stripe → Validator → Processor → Ledger
3. Notifications are sent asynchronously
4. All services can be deployed to Docker Swarm
5. Health checks pass for all services
6. Logs are aggregated and searchable
7. Basic error scenarios are handled (service down, validation failure, etc.)

The path is clear, the dependencies mapped. Now, the work begins.

