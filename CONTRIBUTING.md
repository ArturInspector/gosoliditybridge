# Contributing to GoSolidityBridge

Thank you for your interest in contributing! We welcome contributions from developers of all skill levels.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gosoliditybridge.git
   cd gosoliditybridge
   ```

3. **Set up development environment**:
   ```bash
   cd backend
   make install-deps
   make proto
   make test
   ```

## Development Workflow

### Code Style

- Follow Go code style conventions
- Run `gofmt -s -w .` before committing
- Run `go vet ./...` to check for issues
- Use `golangci-lint` for additional checks

### Testing

- Write tests for all new features
- Run `make test` to execute all tests
- Aim for >80% code coverage
- Include integration tests for service interactions

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add payment validation logic
fix: resolve race condition in ledger
docs: update API documentation
refactor: simplify processor service
```

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them

3. **Ensure all checks pass**:
   - Tests pass (`make test`)
   - Linting passes (`golangci-lint run`)
   - Code is formatted (`gofmt`)

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

6. **Wait for review** - we'll review and provide feedback

## Project Structure

```
backend/
  cmd/              # Service entry points
    gateway/
    processor/
    validator/
    ledger/
    mock-stripe/
    notification/
  services/         # Service implementations
  proto/            # Protobuf definitions
  gen/go/           # Generated Go code (gitignored)
```

## Protobuf Changes

When modifying `.proto` files:

1. Make your changes to the proto files
2. Run `make proto` to regenerate Go code
3. Commit both `.proto` files and generated code
4. Update documentation if API changes

## Adding New Services

1. Create service directory in `services/`
2. Create cmd entry point in `cmd/`
3. Add Dockerfile in `services/`
4. Update `docker-compose.yml`
5. Add tests
6. Update documentation

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues first to avoid duplicates
- Join discussions for design questions

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing! 🎉

