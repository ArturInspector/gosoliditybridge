package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
	// TODO: Register ledger service
	// ledgerpb "gosoliditybridge/backend/gen/go/ledger"
	// "gosoliditybridge/backend/services/ledger"
)

var (
	grpcPort = flag.Int("grpc-port", 50054, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	// TODO: Register ledger service
	// ledgerpb.RegisterLedgerServer(srv.Server, &ledger.Server{})

	if err := server.RunWithShutdown(srv, "ledger"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
