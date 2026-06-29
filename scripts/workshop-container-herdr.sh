#!/usr/bin/env bash
set -euo pipefail

session_name="${HERDR_SESSION:-aie-loopcraft-workshop-2026}"
workspace_label="${HERDR_WORKSPACE_LABEL:-Loopcraft Workshop}"
tab_label="${HERDR_TAB_LABEL:-Start Here}"
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

wait_for_herdr_server() {
  for _ in {1..25}; do
    if herdr --session "${session_name}" status --json 2>/dev/null | jq -e '.server.running == true' >/dev/null; then
      return 0
    fi
    sleep 0.2
  done

  return 1
}

start_herdr_server() {
  if herdr --session "${session_name}" status --json 2>/dev/null | jq -e '.server.running == true' >/dev/null; then
    return 0
  fi

  herdr --session "${session_name}" server >/tmp/herdr-server-bootstrap.log 2>&1 &
  if wait_for_herdr_server; then
    return 0
  fi

  cat /tmp/herdr-server-bootstrap.log >&2 || true
  return 1
}

name_herdr_surface() {
  local workspace_id
  workspace_id="$(herdr --session "${session_name}" workspace list | jq -r '.result.workspaces[0].workspace_id // empty')"

  if [[ -z "${workspace_id}" ]]; then
    workspace_id="$(herdr --session "${session_name}" workspace create --cwd /workspace --label "${workspace_label}" --focus | jq -r '.result.workspace.workspace_id')"
  else
    herdr --session "${session_name}" workspace rename "${workspace_id}" "${workspace_label}" >/dev/null
    herdr --session "${session_name}" workspace focus "${workspace_id}" >/dev/null
  fi

  local tab_id
  tab_id="$(herdr --session "${session_name}" tab list --workspace "${workspace_id}" | jq -r '.result.tabs[0].tab_id // empty')"

  if [[ -z "${tab_id}" ]]; then
    herdr --session "${session_name}" tab create --workspace "${workspace_id}" --cwd /workspace --label "${tab_label}" --focus >/dev/null
  else
    herdr --session "${session_name}" tab rename "${tab_id}" "${tab_label}" >/dev/null
    herdr --session "${session_name}" tab focus "${tab_id}" >/dev/null
  fi
}

ensure_writable_dir /home/workshop/.cache
ensure_writable_dir /home/workshop/.config/herdr
ensure_writable_dir /home/workshop/.local/share
ensure_writable_dir /home/workshop/.local/share/pnpm/store
ensure_writable_dir /home/workshop/.local/state
mkdir -p /home/workshop/.pi/agent/extensions /home/workshop/.pi/agent/sessions

if [[ -x scripts/setup-workshop-shell.sh ]]; then
  bash scripts/setup-workshop-shell.sh
fi

if ! herdr integration install pi >/tmp/herdr-pi-integration.log 2>&1; then
  cat /tmp/herdr-pi-integration.log >&2
  exit 1
fi

if ! start_herdr_server; then
  echo "Herdr server did not become ready for session: ${session_name}" >&2
  exit 1
fi

if ! name_herdr_surface; then
  echo "Could not name the initial Herdr workspace/tab. Continuing anyway." >&2
fi

exec herdr --session "${session_name}"
