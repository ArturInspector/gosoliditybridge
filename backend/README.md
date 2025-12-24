Go, gRPC (protobuf) repository
for mock-exchange service.


Architecture:

/proto
  payment.proto
  validation.proto
  transaction.proto
  ledger.proto
  notification.proto
  processor.proto
  validator.proto
  gateway.proto
  stripe.proto
  ledger.proto
  notification.proto
  processor.proto
  validator.proto
  gateway.proto
  stripe.proto

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
