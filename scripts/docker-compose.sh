#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  cat >&2 <<'EOF'
Docker is required for the workshop container path.

Install Docker Desktop or OrbStack, reopen your terminal, then retry:

  pnpm run workshop

More details: docs/setup.md
EOF
  exit 127
fi

if docker compose version >/dev/null 2>&1; then
  exec docker compose "$@"
fi

if command -v docker-compose >/dev/null 2>&1; then
  exec docker-compose "$@"
fi

cat >&2 <<'EOF'
Docker Compose is required, but this machine does not have a Compose command available.

Pi checked both supported command shapes:

  docker compose version      # Docker Compose v2 plugin
  docker-compose version      # legacy standalone Compose

Fix options:

- Install or update Docker Desktop / OrbStack so `docker compose version` works.
- Or install the Docker Compose plugin for your Docker engine.
- Or install legacy `docker-compose` if that is the package your OS provides.

After installing Compose, reopen your terminal and retry:

  pnpm run workshop

More details: docs/setup.md
EOF
exit 127
