FROM golang:1.25-alpine AS builder

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy proto files and generate code
COPY proto/ ./proto/
COPY Makefile ./
RUN make install-deps && make proto

# Copy source code
COPY cmd/notification ./cmd/notification
COPY services/notification ./services/notification
COPY gen ./gen

# Build
WORKDIR /build
RUN CGO_ENABLED=0 GOOS=linux go build -o /notification ./cmd/notification

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /notification .

EXPOSE 50056 2117

CMD ["./notification"]






