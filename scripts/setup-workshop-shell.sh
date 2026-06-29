#!/usr/bin/env bash
set -euo pipefail

home="${HOME:-/home/workshop}"
completion_dir="${home}/.zsh/completions"

mkdir -p \
  "${completion_dir}" \
  "${home}/.config/atuin" \
  "${home}/.local/share" \
  "${home}/.local/state" \
  "${home}/.cache"

if [[ -f docker/workshop.zshrc ]]; then
  cp docker/workshop.zshrc "${home}/.zshrc"
fi

if [[ -d docker/zsh-completions ]]; then
  cp docker/zsh-completions/_* "${completion_dir}/" 2>/dev/null || true
fi

if command -v codex >/dev/null 2>&1; then
  codex completion zsh >"${completion_dir}/_codex" 2>/dev/null || true
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm completion zsh >"${completion_dir}/_pnpm" 2>/dev/null || true
fi

if command -v atuin >/dev/null 2>&1; then
  atuin gen-completions --shell zsh >"${completion_dir}/_atuin" 2>/dev/null || true

  if [[ ! -f "${home}/.config/atuin/config.toml" ]]; then
    cat >"${home}/.config/atuin/config.toml" <<'EOF'
# Local-first workshop history. Sync can be enabled manually with `atuin login`.
auto_sync = false
update_check = false
style = "compact"
inline_height = 20
show_preview = true
enter_accept = true
EOF
  fi
fi

chmod -R u+rwX "${home}/.zsh" "${home}/.config/atuin" "${home}/.local" "${home}/.cache" 2>/dev/null || true
