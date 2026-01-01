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

type ShutdownFunc func(ctx context.Context) error

func WaitForShutdown() os.Signal {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	return <-sigChan
}

func ShutdownAll(shutdownFuncs []ShutdownFunc, timeout time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	errors := make(chan error, len(shutdownFuncs))
	for _, fn := range shutdownFuncs {
		go func(fn ShutdownFunc) {
			errors <- fn(ctx)
		}(fn)
	}

	var lastErr error
	for i := 0; i < len(shutdownFuncs); i++ {
		if err := <-errors; err != nil && err != context.DeadlineExceeded {
			lastErr = err
		}
	}
	return lastErr
}

// RunWithShutdown runs server with optional additional shutdown functions
func RunWithShutdown(srv *GRPCServer, serviceName string, additionalShutdown ...ShutdownFunc) error {
	if err := srv.Start(); err != nil {
		return err
	}

	sig := WaitForShutdown()
	log.Printf("signal: %v", sig)
	log.Printf("shutting down %s...", serviceName)

	allShutdown := append([]ShutdownFunc{srv.GracefulStop}, additionalShutdown...)
	if err := ShutdownAll(allShutdown, 5*time.Second); err != nil {
		return fmt.Errorf("shutdown error: %w", err)
	}

	log.Printf("%s shutdown complete", serviceName)
	return nil
}
