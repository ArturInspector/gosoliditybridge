PROTO_DIR=proto
GEN_DIR=gen/go

PROTO_FILES=$(PROTO_DIR)/payment.proto \
            $(PROTO_DIR)/validation.proto \
            $(PROTO_DIR)/processor.proto \
            $(PROTO_DIR)/ledger.proto \
            $(PROTO_DIR)/notification.proto \
            $(PROTO_DIR)/gateway.proto \
            $(PROTO_DIR)/auth.proto

.PHONY: proto clean check-deps install-deps test build compose-up compose-down compose-logs


install-deps:
	@echo "Installing protoc-gen-go..."
	@go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	@echo "Installing protoc-gen-go-grpc..."
	@go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	@echo "Done! Make sure $(shell go env GOPATH)/bin is in your PATH"

check-deps:
	@which protoc > /dev/null || (echo "Error: protoc not found. Install: https://grpc.io/docs/protoc-installation/" && exit 1)
	@GOPATH_BIN=$$(go env GOPATH)/bin; \
	if [ ! -f "$$GOPATH_BIN/protoc-gen-go" ]; then \
		echo "Error: protoc-gen-go not found in $$GOPATH_BIN"; \
		echo "Run: make install-deps"; \
		exit 1; \
	fi
	@GOPATH_BIN=$$(go env GOPATH)/bin; \
	if [ ! -f "$$GOPATH_BIN/protoc-gen-go-grpc" ]; then \
		echo "Error: protoc-gen-go-grpc not found in $$GOPATH_BIN"; \
		echo "Run: make install-deps"; \
		exit 1; \
	fi

proto: check-deps
	mkdir -p $(GEN_DIR)
	@GOPATH_BIN=$$(go env GOPATH)/bin; \
	PATH="$$GOPATH_BIN:$$PATH" protoc \
		--proto_path=. \
		--proto_path=$(PROTO_DIR) \
		--go_out=. \
		--go-grpc_out=. \
		$(PROTO_FILES)

test: proto
	@echo "Running tests..."
	@go test -v -race -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

build: proto
	@echo "Building all services..."
	@mkdir -p bin
	@go build -o bin/gateway ./cmd/gateway
	@go build -o bin/processor ./cmd/processor
	@go build -o bin/validator ./cmd/validator
	@go build -o bin/ledger ./cmd/ledger
	@go build -o bin/mock-stripe ./cmd/mock-stripe
	@go build -o bin/notification ./cmd/notification
	@echo "Binaries built in bin/ directory"

compose-up:
	@echo "Starting docker-compose stack..."
	@cd .. && docker-compose up -d

compose-down:
	@echo "Stopping docker-compose stack..."
	@cd .. && docker-compose down

compose-logs:
	@cd .. && docker-compose logs -f

clean:
	rm -rf $(GEN_DIR)
	rm -rf bin/
	rm -f coverage.out coverage.html