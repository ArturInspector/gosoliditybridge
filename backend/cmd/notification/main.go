package main

import (
	"flag"
	"log"

	"gosoliditybridge/backend/internal/server"
	// TODO: Register notification service
	// notificationpb "gosoliditybridge/backend/gen/go/notification"
	// "gosoliditybridge/backend/services/notification"
)

var (
	grpcPort = flag.Int("grpc-port", 50056, "gRPC server port")
)

func main() {
	flag.Parse()

	srv := server.NewGRPCServer(*grpcPort)

	// TODO: Register notification service
	// notificationpb.RegisterNotificationServer(srv.Server, &notification.Server{})

	if err := server.RunWithShutdown(srv, "notification"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
