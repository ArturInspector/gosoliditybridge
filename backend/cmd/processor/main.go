package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
	// TODO: Register processor service
	// processorpb "gosoliditybridge/backend/gen/go/processor"
	// "gosoliditybridge/backend/services/processor"
)

var (
	grpcPort = flag.Int("grpc-port", 50052, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	// TODO: Register processor service
	// processorpb.RegisterProcessorServer(srv.Server, &processor.Server{})

	if err := server.RunWithShutdown(srv, "processor"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
