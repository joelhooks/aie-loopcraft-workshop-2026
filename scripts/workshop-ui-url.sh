#!/usr/bin/env bash
set -euo pipefail

ui_port="${LOOPCRAFT_UI_PORT:-3000}"
bridge_port="${LOOPCRAFT_BRIDGE_PORT:-8787}"
host_bind="${LOOPCRAFT_HOST_BIND:-127.0.0.1}"
ui_tailnet_port="${LOOPCRAFT_UI_TAILSCALE_PORT:-8445}"
bridge_tailnet_port="${LOOPCRAFT_BRIDGE_TAILSCALE_PORT:-8446}"
mode="${1:-print}"
share_command="serve"

if [[ "${mode}" == "--public" || "${LOOPCRAFT_PUBLIC:-0}" == "1" ]]; then
  share_command="funnel"
  mode="--serve"
fi

print_visibility_model() {
  cat <<EOF

Visibility model:
  container serves -> Docker publishes on the host -> browser opens a host URL.

Localhost depends on where it is used:
  inside Docker: this container
  in a shell on the Docker host: the host
  in your laptop browser while SSH'd into a host: your laptop
  on a phone: the phone

Host bind: ${host_bind}
If you are SSH'd into this host, use SSH port forwarding or a host-side tunnel before opening the UI from another machine.
EOF
}

if [[ "${mode}" != "print" && "${mode}" != "--serve" ]]; then
  cat >&2 <<'EOF'
Usage:
  bash scripts/workshop-ui-url.sh
  bash scripts/workshop-ui-url.sh --serve
  LOOPCRAFT_PUBLIC=1 bash scripts/workshop-ui-url.sh --serve

Run this from the host machine after the Docker workshop computer is started.
EOF
  exit 64
fi

if [[ -f /.dockerenv ]]; then
  cat >&2 <<'EOF'
This helper belongs on the host machine, not inside the workshop container.

The container serves the UI and loop bridge. The host owns localhost, SSH forwarding, Tailnet, and public URLs.
Exit the container or open a second host shell, then run:

  bash scripts/workshop-ui-url.sh
  bash scripts/workshop-ui-url.sh --serve
EOF
  exit 1
fi

local_ui="http://localhost:${ui_port}"
local_bridge="http://localhost:${bridge_port}"
encoded_local_bridge="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "${local_bridge}")"
local_ui_with_bridge="${local_ui}/?bridge=${encoded_local_bridge}"

printf 'Loopcraft connection report\n'
printf '===========================\n'
printf 'Local Lakebed UI on the Docker host: %s\n' "${local_ui}"
printf 'Local Lakebed UI with explicit bridge: %s\n' "${local_ui_with_bridge}"
printf 'Local bridge health on the Docker host: %s/health\n' "${local_bridge}"

if [[ -n "${SSH_CONNECTION:-}" || -n "${SSH_CLIENT:-}" ]]; then
  echo "SSH session detected: your laptop browser is not this host. Forward both ports or run a host-side Tailnet/Funnel tunnel."
fi

if command -v curl >/dev/null 2>&1; then
  if curl -fsS --max-time 1 "${local_bridge}/health" >/dev/null 2>&1; then
    echo "Bridge check: reachable"
  else
    echo "Bridge check: not reachable yet. Start the status pane with: node scripts/loop-daemon-stub.mjs"
  fi
fi

if [[ "${mode}" != "--serve" ]]; then
  print_visibility_model
  cat <<EOF

Tailnet URL command:
  bash scripts/workshop-ui-url.sh --serve

Public URL command, if Tailscale Funnel is enabled:
  LOOPCRAFT_PUBLIC=1 bash scripts/workshop-ui-url.sh --serve

Run the tunnel from the host. Do not try to create the tunnel from inside Docker.
For plain SSH access without Tailnet, forward both ports from your laptop:
  ssh -L ${ui_port}:localhost:${ui_port} -L ${bridge_port}:localhost:${bridge_port} USER@HOST

After forwarding, open this from the laptop browser:
  ${local_ui_with_bridge}
EOF
  exit 0
fi

if ! command -v tailscale >/dev/null 2>&1; then
  cat >&2 <<EOF
Tailscale CLI was not found on this host.

Use the local URL above from a browser on the host, forward both ports over SSH, install/sign into Tailscale, or run another host-side tunnel against ports ${ui_port} and ${bridge_port}.
EOF
  exit 127
fi

dns_name="$({ tailscale status --json 2>/dev/null || true; } | node -e 'const fs = require("node:fs"); const input = fs.readFileSync(0, "utf8").trim(); if (!input) process.exit(0); const data = JSON.parse(input); const dns = data?.Self?.DNSName || ""; process.stdout.write(dns.replace(/\.$/, ""));')"

if [[ -z "${dns_name}" ]]; then
  cat >&2 <<'EOF'
Tailscale is installed, but this machine does not appear to have a Tailnet DNS name.

Run `tailscale status` and make sure this host is signed in.
EOF
  exit 1
fi

echo "Configuring Tailscale ${share_command} from host ports ${ui_port} and ${bridge_port}..."
tailscale "${share_command}" --bg --yes --https="${ui_tailnet_port}" "${ui_port}"
tailscale "${share_command}" --bg --yes --https="${bridge_tailnet_port}" "${bridge_port}"

bridge_url="https://${dns_name}:${bridge_tailnet_port}"
encoded_bridge="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "${bridge_url}")"
ui_url="https://${dns_name}:${ui_tailnet_port}/?bridge=${encoded_bridge}"

cat <<EOF

Lakebed UI URL:
  ${ui_url}

Bridge health:
  ${bridge_url}/health

Why the query string exists:
  the UI runs on one host-side URL, while the loop bridge runs on another.
  The ?bridge=... value keeps the browser from guessing an unreachable Docker-internal address.
  If you are SSH'd into the host, the same rule applies: your local browser needs a host-side bridge URL too.
EOF
