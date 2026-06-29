# Loopcraft workshop shell
# Kept deliberately small: fast startup, useful completion, no surprise course magic.

export EDITOR="${EDITOR:-nano}"
export VISUAL="${VISUAL:-$EDITOR}"
export PAGER="${PAGER:-less}"
export LESS="${LESS:--FRX}"

# Project-local completions generated/copied by scripts/setup-workshop-shell.sh.
fpath=("$HOME/.zsh/completions" $fpath)

# Oh My Zsh is in the published image. If someone is on an older image, fall back
# to stock zsh completion instead of breaking the workshop shell.
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="${ZSH_CUSTOM:-$ZSH/custom}"
ZSH_THEME=""
DISABLE_AUTO_UPDATE="true"
COMPLETION_WAITING_DOTS="true"
HYPHEN_INSENSITIVE="true"

if [[ -d "$ZSH" && -o interactive && -t 0 && -t 1 ]]; then
  plugins=(git)
  for plugin in npm node pnpm docker docker-compose zsh-autosuggestions zsh-syntax-highlighting; do
    if [[ -d "$ZSH/plugins/$plugin" || -d "$ZSH_CUSTOM/plugins/$plugin" ]]; then
      plugins+=("$plugin")
    fi
  done
  source "$ZSH/oh-my-zsh.sh"
else
  autoload -Uz compinit
  compinit -d "$HOME/.zcompdump"
fi

# fzf and Atuin are installed in the published image; keep both optional for
# older images so a plain `git pull && pnpm run workshop` still improves what it can.
for fzf_file in \
  /usr/share/doc/fzf/examples/key-bindings.zsh \
  /usr/share/doc/fzf/examples/completion.zsh; do
  [[ -r "$fzf_file" ]] && source "$fzf_file"
done

if command -v atuin >/dev/null 2>&1 && [[ -o interactive && -t 0 && -t 1 ]]; then
  eval "$(atuin init zsh --disable-ai)"
fi

# Starship owns the prompt; Oh My Zsh only handles shell niceties.
if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
fi

alias ll='ls -lah'
alias gs='git status --short --branch'
alias gd='git diff'
alias gl='git log --oneline --decorate --graph --max-count=12'
alias h='herdr'
alias hs='herdr status'
alias hw='herdr workspace list'
alias ht='herdr tab list'
alias p='pnpm'
alias px='pnpm exec'

cd /workspace
