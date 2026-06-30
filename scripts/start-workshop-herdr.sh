#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

session_name="${LOOPCRAFT_HERDR_SESSION:-aie-loopcraft-workshop-2026}"
workspace_label="${LOOPCRAFT_HERDR_WORKSPACE_LABEL:-Loopcraft Workshop}"
tab_label="${LOOPCRAFT_HERDR_TAB_LABEL:-Start Here}"
image="${LOOPCRAFT_WORKSHOP_IMAGE:-ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest}"
ui_port="${LOOPCRAFT_UI_PORT:-3000}"
bridge_port="${LOOPCRAFT_BRIDGE_PORT:-8787}"
host_bind="${LOOPCRAFT_HOST_BIND:-127.0.0.1}"
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

cat <<EOF

Loopcraft workshop connection report
-----------------------------------
Herdr session:   ${session_name}
Workspace label: ${workspace_label}
Start tab:       ${tab_label}
Docker image:    ${image}

What starts now:
  - Herdr opens inside the workshop container.
  - Lakebed serves inside the container on :3000.
  - The loop bridge serves inside the container on :8787.
  - Docker publishes those ports onto the host with --service-ports.

Host URLs, for a browser on the Docker host or an SSH-forwarded laptop:
  Lakebed UI:     http://localhost:${ui_port}
  Bridge health:  http://localhost:${bridge_port}/health
  Host bind:      ${host_bind}

If your browser is not on the Docker host, do not trust bare localhost.
Use one host-side adapter before opening the UI:
  SSH forwarding: ssh -L ${ui_port}:localhost:${ui_port} -L ${bridge_port}:localhost:${bridge_port} USER@HOST
  Tailnet/local:  bash scripts/workshop-ui-url.sh --serve
  Public Funnel:  LOOPCRAFT_PUBLIC=1 bash scripts/workshop-ui-url.sh --serve

Run URL helpers from a host shell, not inside Docker:
  pnpm run workshop:ui-url

EOF

exec "${compose[@]}" run --rm --service-ports \
  -e HERDR_SESSION="${session_name}" \
  -e HERDR_WORKSPACE_LABEL="${workspace_label}" \
  -e HERDR_TAB_LABEL="${tab_label}" \
  workshop \
  zsh -lc 'cd /workspace && bash scripts/workshop-container-herdr.sh'
