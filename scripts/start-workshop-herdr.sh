#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

session_name="${LOOPCRAFT_HERDR_SESSION:-aie-loopcraft-workshop-2026}"
image="${LOOPCRAFT_WORKSHOP_IMAGE:-ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest}"
compose=(bash scripts/docker-compose.sh)

"${compose[@]}" version >/dev/null

if [[ "${LOOPCRAFT_SKIP_PULL:-0}" != "1" ]]; then
  if docker image inspect "${image}" >/dev/null 2>&1; then
    echo "Checking for a newer workshop image..."
    if ! "${compose[@]}" pull workshop; then
      echo "Could not pull a newer image. Continuing with the local image already on this machine." >&2
    fi
  else
    echo "Pulling the Loopcraft workshop image..."
    if ! "${compose[@]}" pull workshop; then
      cat >&2 <<'EOF'
Could not pull the workshop image. Building it locally instead.

This is slower than pulling the prebuilt image, but it keeps the workshop moving when GHCR is private, unavailable, or blocked by network policy.
EOF
      if ! "${compose[@]}" build workshop; then
        cat >&2 <<'EOF'
Local image build failed.

Common fixes:
- Make sure Docker Desktop or OrbStack is running.
- Make sure Docker Compose works: docker compose version OR docker-compose version.
- If GHCR says the package is private and you want the faster pull path, authenticate with GitHub Packages.

More details: docs/setup.md
EOF
        exit 1
      fi
    fi
  fi
fi

echo "Starting Herdr inside the Loopcraft workshop container..."
echo "Herdr session: ${session_name}"

exec "${compose[@]}" run --rm \
  -e HERDR_SESSION="${session_name}" \
  workshop \
  zsh -lc 'cd /workspace && mkdir -p /home/workshop/.pi/agent/extensions /home/workshop/.pi/agent/sessions && herdr integration install pi >/tmp/herdr-pi-integration.log 2>&1 || { cat /tmp/herdr-pi-integration.log >&2; exit 1; }; herdr --session "$HERDR_SESSION"'
