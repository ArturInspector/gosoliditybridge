PROTO_DIR=proto
GEN_DIR=gen/go

PROTO_FILES=$(PROTO_DIR)/payment.proto \
            $(PROTO_DIR)/validation.proto \
            $(PROTO_DIR)/processor.proto \
            $(PROTO_DIR)/ledger.proto \
            $(PROTO_DIR)/notification.proto \
            $(PROTO_DIR)/gateway.proto \
            $(PROTO_DIR)/auth.proto 

.PHONY: proto clean

proto:
	mkdir -p $(GEN_DIR)
	protoc \
		--proto_path=$(PROTO_DIR) \
		--go_out=$(GEN_DIR) \
		--go-grpc_out=$(GEN_DIR) \
		$(PROTO_FILES)

clean:
	rm -rf $(GEN_DIR)
