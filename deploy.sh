#!/usr/bin/env bash
set -euo pipefail

echo "=== Creating shared network (if needed) ==="
docker network inspect web &>/dev/null || docker network create web

echo "=== Building planner image ==="
docker compose build

echo "=== Starting planner container ==="
docker compose up -d

echo "=== Restarting wbgt (Caddy) to pick up Caddyfile changes ==="
docker compose -f ../wbgt/docker-compose.yaml restart wbgt

echo "=== Done ==="
echo "planner.corebase.be should now route to the planner container."
