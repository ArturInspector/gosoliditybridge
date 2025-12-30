# Development Guide

## Prerequisites

- Go 1.25 or later
- Docker and Docker Compose
- Protocol Buffers compiler (`protoc`)
- Make

## Setup

### 1. Install Dependencies

```bash
cd backend
make install-deps
```

This installs:
- `protoc-gen-go`
- `protoc-gen-go-grpc`

### 2. Generate Protobuf Code

```bash
make proto
```

This generates Go code from `.proto` files in `gen/go/`.

### 3. Run Tests

```bash
make test
```

### 4. Build Services

```bash
make build
```

Binaries will be in `bin/` directory.

## Running Services Locally

### Using Docker Compose

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Running Individual Services

```bash
# Gateway
./bin/gateway -grpc-port 50051 -http-port 8080

# Processor
./bin/processor -grpc-port 50052

# Validator
./bin/validator -grpc-port 50053

# Ledger
./bin/ledger -grpc-port 50054

# Mock-Stripe
./bin/mock-stripe -grpc-port 50055

# Notification
./bin/notification -grpc-port 50056
```

## Development Workflow

### Adding a New Service Method

1. Update the `.proto` file (e.g., `proto/processor.proto`)
2. Run `make proto` to regenerate code
3. Implement the method in the service
4. Add tests
5. Update documentation

### Example: Adding a Method

**1. Update `proto/processor.proto`:**

```protobuf
service Processor {
  rpc ProcessPayment(ProcessPaymentRequest) returns (ProcessPaymentResponse);
  rpc NewMethod(NewMethodRequest) returns (NewMethodResponse); // New
}
```

**2. Generate code:**

```bash
make proto
```

**3. Implement in `services/processor/server.go`:**

```go
func (s *Server) NewMethod(ctx context.Context, req *processorpb.NewMethodRequest) (*processorpb.NewMethodResponse, error) {
    // Implementation
    return &processorpb.NewMethodResponse{}, nil
}
```

**4. Add tests:**

```go
func TestNewMethod(t *testing.T) {
    // Test implementation
}
```

## Testing

### Unit Tests

```bash
go test ./services/processor/...
```

### Integration Tests

```bash
go test -tags=integration ./...
```

### Coverage

```bash
make test
open coverage.html
```

## Debugging

### View Service Logs

```bash
docker-compose logs -f gateway
docker-compose logs -f processor
```

### gRPC Debugging

Use [grpcurl](https://github.com/fullstorydev/grpcurl):

```bash
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 Gateway.HealthCheck
```

### Prometheus Metrics

Access metrics at: `http://localhost:2112/metrics` (for gateway)

### Grafana Dashboards

Access at: `http://localhost:3001` (admin/admin)

## Common Tasks

### Clean Build Artifacts

```bash
make clean
```

### Update Dependencies

```bash
go get -u ./...
go mod tidy
```

### Format Code

```bash
gofmt -s -w .
```

### Lint Code

```bash
golangci-lint run ./...
```

## Project Structure

```
backend/
├── cmd/              # Service entry points
│   ├── gateway/
│   ├── processor/
│   └── ...
├── services/         # Service implementations
│   ├── gateway/
│   ├── processor/
│   └── ...
├── proto/            # Protobuf definitions
├── gen/go/           # Generated code (gitignored)
├── Makefile          # Build commands
└── go.mod            # Go dependencies
```

## Best Practices

1. **Always run `make proto` after changing `.proto` files**
2. **Write tests before implementing features**
3. **Keep services stateless**
4. **Use structured logging**
5. **Add metrics for observability**
6. **Handle errors gracefully**
7. **Document public APIs**

## Troubleshooting

### "protoc not found"
Install Protocol Buffers: https://grpc.io/docs/protoc-installation/

### "protoc-gen-go not found"
Run `make install-deps`

### Port already in use
Change port in docker-compose.yml or use different port flag

### Generated code errors
Delete `gen/` directory and run `make proto` again

