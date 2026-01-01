#!/bin/bash
set -e

echo "🚀 GoSolidityBridge Demo"
echo "========================"
echo ""

echo "📦 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 8

echo ""
echo "✅ Checking health..."
curl -s http://localhost:8080/health | jq '.' || curl -s http://localhost:8080/health

echo ""
echo "📊 Services status:"
docker-compose ps

echo ""
echo "✨ All services running!"
echo "   Grafana: http://localhost:3001 (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo ""
echo "🛑 To stop: docker-compose down"

