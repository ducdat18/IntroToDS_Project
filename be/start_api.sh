#!/bin/bash

echo "🎵 Starting Music Management API..."
echo "========================================"

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if model exists
if [ ! -f "./checkpoints/best.pt" ]; then
    echo "⚠️  Warning: Model checkpoint not found at ./checkpoints/best.pt"

# Check if Docker services are running
if ! docker compose ps | grep -q "Up"; then
    echo "⚠️  Warning: Docker services may not be running."
    echo "Run './start_services.sh' first to start MinIO and PostgreSQL."
fi

echo ""
echo "🚀 Starting FastAPI server..."
echo "  - API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - ReDoc: http://localhost:8000/redoc"
echo "========================================"
echo ""

# Start the FastAPI server (output to console, no log file)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

