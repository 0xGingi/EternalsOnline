#!/bin/bash

echo "Stopping all containers..."
docker compose down

echo "Cleaning up Docker system..."
docker system prune -f
docker volume prune -f

echo "Removing old images..."
docker compose rm -f

echo "Building new images..."
docker compose build --no-cache

echo "Starting all services..."
docker compose --profile all up -d

echo "Showing logs..."
docker compose logs -f