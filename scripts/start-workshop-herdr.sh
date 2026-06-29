#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

session_name="${LOOPCRAFT_HERDR_SESSION:-aie-loopcraft-workshop-2026}"
image="${LOOPCRAFT_WORKSHOP_IMAGE:-ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for the workshop container path." >&2
  echo "Install Docker Desktop or OrbStack, then retry: pnpm run workshop" >&2
  exit 127
fi

if [[ "${LOOPCRAFT_SKIP_PULL:-0}" != "1" ]]; then
  if docker image inspect "${image}" >/dev/null 2>&1; then
    echo "Checking for a newer workshop image..."
    if ! docker compose pull workshop; then
      echo "Could not pull a newer image. Continuing with the local image already on this machine." >&2
    fi
  else
    echo "Pulling the Loopcraft workshop image..."
    if ! docker compose pull workshop; then
      cat >&2 <<'EOF'
Could not pull the workshop image.

Common fixes:
- If GHCR says the package is private, authenticate with GitHub Packages.
- If you need to work offline or the image is unavailable, run: pnpm run workshop:build
- After a local build, retry this command.

More details: docs/setup.md
EOF
      exit 1
    fi
  fi
fi

echo "Starting Herdr inside the Loopcraft workshop container..."
echo "Herdr session: ${session_name}"

exec docker compose run --rm \
  -e HERDR_SESSION="${session_name}" \
  workshop \
  zsh -lc 'cd /workspace && herdr integration install pi >/tmp/herdr-pi-integration.log 2>&1 || { cat /tmp/herdr-pi-integration.log >&2; exit 1; }; herdr --session "$HERDR_SESSION"'
