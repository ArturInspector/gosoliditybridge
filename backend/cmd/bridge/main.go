package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"

	"gosoliditybridge/backend/internal/server"
)

var (
	grpcPort = flag.Int("grpc-port", 50051, "gRPC server port")
	httpPort = flag.Int("http-port", 8080, "http port")
)

func main() {
	flag.Parse()

	grpcSrv := server.NewGRPCServer(*grpcPort)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", *httpPort),
		Handler: mux,
	}

	go func() {
		log.Printf("HTTP server listening on :%d", *httpPort)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	if err := server.RunWithShutdown(
		grpcSrv,
		"bridge",
		func(ctx context.Context) error { return httpServer.Shutdown(ctx) },
	); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
