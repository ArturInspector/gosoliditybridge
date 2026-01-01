package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
	// TODO: Register gateway service
	// gatewaypb "gosoliditybridge/backend/gen/go/gateway"
	// "gosoliditybridge/backend/services/gateway"
)

var (
	grpcPort = flag.Int("grpc-port", 50051, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	// todo
	if err := server.RunWithShutdown(srv, "gateway"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
