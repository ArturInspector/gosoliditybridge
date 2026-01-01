package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
	// validationpb "gosoliditybridge/backend/gen/go/validation"
	// "gosoliditybridge/backend/services/validator"
)

var (
	grpcPort = flag.Int("grpc-port", 50053, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	// validationpb.RegisterValidatorServer(srv.Server, &validator.Server{})

	if err := server.RunWithShutdown(srv, "validator"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
