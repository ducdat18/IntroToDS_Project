#!/bin/bash

# Ensure we are in the directory where the script is located
cd "$(dirname "$0")"

echo "🛑 Stopping Music Management Services..."
echo "========================================"

docker compose down

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "💡 To remove all data volumes, run:"
echo "   docker compose down -v"
echo ""

