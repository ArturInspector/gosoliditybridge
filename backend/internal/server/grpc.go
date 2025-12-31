package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	"google.golang.org/grpc/health/grpc_health_v1"
)

type GRPCServer struct {
	Server       *grpc.Server
	healthServer *health.Server
	port         int
}

func NewGRPCServer(port int) *GRPCServer {
	grpcServer := grpc.NewServer()
	healthServer := health.NewServer()

	// health instead
	grpc_health_v1.RegisterHealthServer(grpcServer, healthServer)
	healthServer.SetServingStatus("", grpc_health_v1.HealthCheckResponse_SERVING)

	return &GRPCServer{
		Server:       grpcServer,
		healthServer: healthServer,
		port:         port,
	}
}

func (s *GRPCServer) Start() error {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", s.port))
	if err != nil {
		return fmt.Errorf("failed to listen on: %d: %w", s.port, err)
	}
	go func() {
		log.Printf("grpc listening on :%d", s.port)
		if err := s.Server.Serve(listener); err != nil {
			log.Fatalf("failed to serve gRPC: %v", err)
		}
	}()

	return nil
}

func (s *GRPCServer) GracefulStop(ctx context.Context) error {
	s.healthServer.SetServingStatus("", grpc_health_v1.HealthCheckResponse_NOT_SERVING)
	stopped := make(chan struct{})

	go func() {
		s.Server.GracefulStop()
		close(stopped)
	}()

	select {
	case <-stopped:
		return nil
	case <-ctx.Done():
		s.Server.Stop()
		return ctx.Err()
	}
}

func WaitForShutdown() os.Signal {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	return <-sigChan
}

func RunWithShutdown(srv *GRPCServer, serviceName string) error {
	if err := srv.Start(); err != nil {
		return err
	}

	sig := WaitForShutdown()
	log.Printf("signal: %v", sig)
	log.Printf("shutting down %s...", serviceName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.GracefulStop(ctx); err != nil {
		return fmt.Errorf("shutdown error: %w", err)
	}

	log.Printf("%s shutdown complete", serviceName)
	return nil
}
