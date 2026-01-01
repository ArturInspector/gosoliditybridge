# API Reference

## Gateway Service

### gRPC Endpoints

#### HealthCheck
```protobuf
rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
```

Check service health status.

#### CreatePayment
```protobuf
rpc CreatePayment(CreatePaymentRequest) returns (CreatePaymentResponse);
```

Create a new payment request.

### HTTP Endpoints

#### GET /health
Health check endpoint.

**Response:**
```
200 OK
OK
```

#### GET /metrics
Prometheus metrics endpoint.

## Processor Service

### gRPC Endpoints

#### ProcessPayment
```protobuf
rpc ProcessPayment(ProcessPaymentRequest) returns (ProcessPaymentResponse);
```

Process a payment through validation and ledger update.

**Request:**
```protobuf
message ProcessPaymentRequest {
  string payment_id = 1;
  string user_id = 2;
  int64 amount = 3;
  string currency = 4;
}
```

**Response:**
```protobuf
message ProcessPaymentResponse {
  bool success = 1;
  string transaction_id = 2;
  string error_message = 3;
}
```

## Validator Service

### gRPC Endpoints

#### ValidatePayment
```protobuf
rpc ValidatePayment(ValidatePaymentRequest) returns (ValidatePaymentResponse);
```

Validate payment request.

**Request:**
```protobuf
message ValidatePaymentRequest {
  string user_id = 1;
  int64 amount = 2;
  string currency = 3;
}
```

**Response:**
```protobuf
message ValidatePaymentResponse {
  bool valid = 1;
  string reason = 2;
}
```

## Ledger Service

### gRPC Endpoints

#### GetBalance
```protobuf
rpc GetBalance(GetBalanceRequest) returns (GetBalanceResponse);
```

Get account balance.

#### UpdateBalance
```protobuf
rpc UpdateBalance(UpdateBalanceRequest) returns (UpdateBalanceResponse);
```

Update account balance (atomic operation).

#### GetTransactionHistory
```protobuf
rpc GetTransactionHistory(GetTransactionHistoryRequest) returns (GetTransactionHistoryResponse);
```

Get transaction history for an account.

## Mock-Stripe Service

### gRPC Endpoints

#### CreatePaymentIntent
```protobuf
rpc CreatePaymentIntent(CreatePaymentIntentRequest) returns (CreatePaymentIntentResponse);
```

Create a mock payment intent.

#### ConfirmPayment
```protobuf
rpc ConfirmPayment(ConfirmPaymentRequest) returns (ConfirmPaymentResponse);
```

Confirm a payment (mock implementation).

## Notification Service

### gRPC Endpoints

#### SendNotification
```protobuf
rpc SendNotification(SendNotificationRequest) returns (SendNotificationResponse);
```

Send notification asynchronously.

**Request:**
```protobuf
message SendNotificationRequest {
  string user_id = 1;
  NotificationType type = 2;
  string message = 3;
}
```

## Error Handling

All gRPC services return standard gRPC status codes:

- `OK`: Success
- `INVALID_ARGUMENT`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `INTERNAL`: Internal server error
- `UNAVAILABLE`: Service unavailable

## Rate Limiting

Gateway service implements rate limiting:
- Default: 100 requests per minute per client
- Configurable via environment variables

## Authentication

Currently services use simple API keys. Future versions will support JWT tokens.

See `proto/auth.proto` for authentication methods.






