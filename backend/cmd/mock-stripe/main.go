package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
)

var (
	grpcPort = flag.Int("grpc-port", 50055, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	if err := server.RunWithShutdown(srv, "mock-stripe"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
