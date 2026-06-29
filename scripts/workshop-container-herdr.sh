#!/usr/bin/env bash
set -euo pipefail

session_name="${HERDR_SESSION:-aie-loopcraft-workshop-2026}"
user_id="$(id -u)"
group_id="$(id -g)"

ensure_writable_dir() {
  local dir="$1"

  if command -v sudo >/dev/null 2>&1; then
    sudo mkdir -p "${dir}"
    if [[ ! -w "${dir}" ]]; then
      sudo chown -R "${user_id}:${group_id}" "${dir}"
    fi
  else
    mkdir -p "${dir}"
  fi
}

ensure_writable_dir /home/workshop/.config/herdr
ensure_writable_dir /home/workshop/.local/share/pnpm/store
mkdir -p /home/workshop/.pi/agent/extensions /home/workshop/.pi/agent/sessions

if ! herdr integration install pi >/tmp/herdr-pi-integration.log 2>&1; then
  cat /tmp/herdr-pi-integration.log >&2
  exit 1
fi

exec herdr --session "${session_name}"
