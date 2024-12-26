#!/bin/bash

echo "Stopping all containers..."
docker compose --profile all down

echo "Cleaning up Docker system..."
docker system prune -f
docker volume prune -f

echo "Removing old images..."
docker compose --profile all rm -f

echo "Building new images..."
docker compose --profile all build --no-cache

echo "Starting all services..."
docker compose --profile all up -d

echo "Showing logs..."
docker compose --profile all logs -f