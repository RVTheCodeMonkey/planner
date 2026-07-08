#!/usr/bin/env bash
set -euo pipefail

echo "=== Creating shared network (if needed) ==="
newgrp docker <<'EOF'
docker network inspect web &>/dev/null || docker network create web

echo "=== Building and starting planner stack ==="
cd /home/raf/docker/planner
docker compose build --no-cache
docker compose up -d

echo "=== Restarting wbgt (Caddy) to pick up Caddyfile changes ==="
docker compose -f ../wbgt/docker-compose.yaml up -d wbgt

echo "=== Done ==="
echo "planner.corebase.be now routes /api/* and /ws to the API server"
EOF
