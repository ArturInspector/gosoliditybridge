Go, gRPC (protobuf) repository
for mock-exchange service.


Architecture:

/proto
  payment.proto
  validation.proto

/services
  /gateway
  /mock-stripe
  /validator
  /processor
  /ledger
  /notification

/infra
  docker-compose.yml
  swarm.yml

Documentation:
../docs/
