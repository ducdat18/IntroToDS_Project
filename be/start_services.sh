#!/bin/bash

# Ensure we are in the directory where the script is located
cd "$(dirname "$0")"

echo "🚀 Starting Music Management Services..."
echo "========================================"

# Start Docker Compose services
echo "📦 Starting MinIO and PostgreSQL with Docker Compose..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
echo ""
echo "🔍 Checking service status..."
docker compose ps

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📊 Service URLs:"
echo "  - MinIO Console: http://localhost:9001"
echo "  - MinIO API: http://localhost:9000"
echo "  - PostgreSQL: localhost:5433"
echo ""
echo "KEY: Default Credentials:"
echo "  MinIO:"
echo "    Username: minioadmin"
echo "    Password: minioadmin123"
echo ""
echo "  PostgreSQL:"
echo "    Database: music_metadata"
echo "    Username: musicapp"
echo "    Password: musicapp123"
echo ""
echo "💡 To start the API server, run:"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "   Or use: ./start_api.sh"
echo ""

