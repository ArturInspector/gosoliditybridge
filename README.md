# GoSolidityBridge

> Microservices payment bridge in Go + gRPC. Works in one command: `docker-compose up`

## Try It Now

```bash
git clone https://github.com/ArturInspector/gosoliditybridge.git
cd gosoliditybridge
docker-compose up -d

# Check all services are up
curl http://localhost:8080/health

# Open monitoring
open http://localhost:3001  # Grafana (admin/admin)
```

All 7 services boot in ~5 seconds. Grafana comes with pre-configured dashboards.

## What It Does

- 7 microservices: Gateway → Mock-Stripe → Validator → Processor → Ledger → Notification + Metrics
- gRPC with Protobuf (generates code for 12 languages)
- Prometheus + Grafana monitoring (pre-configured dashboards)
- ECDSA cryptographic signatures for payment attestations
- All services boot in < 5 seconds via docker-compose

## Technical Stack

**Backend:**
- Go 1.21+ (clean, readable code)
- gRPC + Protobuf (type-safe, cross-language)
- ECDSA signatures (crypto/ecdsa)
- Graceful shutdown with context cancellation

**Infrastructure:**
- Docker Compose (7 services, 1 network)
- Prometheus metrics (all services expose :9090/metrics)
- Grafana dashboards (pre-configured)
- Health checks on all services

**Why Go?** Readable even for Java devs. Why gRPC? Protobuf generates code for Python/Java/TypeScript/etc.

## What I Built

**7 Microservices in Go:**
- Gateway (HTTP/gRPC entry point)
- Mock-Stripe (payment simulator for demo)
- Validator (signature verification)
- Processor (business logic)
- Ledger (transaction storage)
- Notification (webhooks)
- Metrics exporter

**Infrastructure Code:**
- docker-compose.yml (142 lines, all services + monitoring)
- Prometheus config with scrape targets
- Grafana datasources + dashboards (pre-loaded)
- Health checks for all services

**Protobuf Schemas:**
- 7 .proto files → generates Go code
- Type-safe service contracts
- Can generate client code for Python/Java/TypeScript/etc.

**Why Mock-Stripe?** 
Real Stripe needs API keys and webhooks. Mock lets anyone `docker-compose up` without signups. For production, swap 1 service.

## Development

```bash
# Generate Protobuf code (requires protoc)
cd backend
make proto

# Run all services
docker-compose up

# Logs for specific service
docker-compose logs -f gateway
```

See [docs/development.md](docs/development.md) for detailed setup.

## Files & Structure

```
backend/
├── proto/           # 7 Protobuf schemas
├── gen/go/          # Generated Go code
├── cmd/             # 7 main.go entrypoints
├── services/        # 7 Dockerfiles
└── internal/server/ # Shared gRPC server logic

docker-compose.yml   # All services + Prometheus + Grafana
monitoring/
├── prometheus.yml   # Scrape config
└── grafana/         # Datasources + dashboards
```

## License

MIT - see [LICENSE](LICENSE)

---

**Questions?** Open an issue or email artur@example.com
