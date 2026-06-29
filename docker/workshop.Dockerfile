# syntax=docker/dockerfile:1.7

FROM node:22-bookworm

LABEL org.opencontainers.image.source="https://github.com/joelhooks/aie-loopcraft-workshop-2026"
LABEL org.opencontainers.image.description="AI Engineer Loopcraft Workshop 2026 workshop computer"

ARG PI_VERSION=0.80.2
ARG CLAUDE_CODE_VERSION=2.1.195
ARG CODEX_VERSION=0.142.3
ARG OPENCODE_VERSION=1.17.11
ARG HERDR_VERSION=0.7.1
ARG STARSHIP_VERSION=1.25.1
ARG ATUIN_VERSION=18.16.1
ARG OH_MY_ZSH_REF=65749801cf4c3b1f3c79a20001909d72dadd307f
ARG ZSH_AUTOSUGGESTIONS_REF=85919cd1ffa7d2d5412f6d3fe437ebdbeeec4fc5
ARG ZSH_SYNTAX_HIGHLIGHTING_REF=1d85c692615a25fe2293bdd44b34c217d5d2bf04
ARG TARGETARCH
ARG USERNAME=workshop
ARG USER_UID=1001
ARG USER_GID=1001

ENV DEBIAN_FRONTEND=noninteractive
ENV PNPM_HOME=/home/${USERNAME}/.local/share/pnpm
ENV NPM_CONFIG_STORE_DIR=/home/${USERNAME}/.local/share/pnpm/store
ENV PATH=/home/${USERNAME}/.local/share/pnpm:/home/${USERNAME}/.npm-global/bin:/home/${USERNAME}/.local/bin:/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin
ENV SHELL=/usr/bin/zsh
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    fzf \
    git \
    jq \
    less \
    nano \
    locales \
    openssh-client \
    ripgrep \
    sudo \
    unzip \
    zsh \
  && rm -rf /var/lib/apt/lists/* \
  && sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
  && locale-gen

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

RUN groupadd --gid ${USER_GID} ${USERNAME} \
  && useradd --uid ${USER_UID} --gid ${USER_GID} -m -s /usr/bin/zsh ${USERNAME} \
  && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
  && chmod 0440 /etc/sudoers.d/${USERNAME}

RUN corepack enable \
  && corepack prepare pnpm@11.9.0 --activate \
  && npm install -g --ignore-scripts @earendil-works/pi-coding-agent@${PI_VERSION} \
  && npm install -g \
    @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} \
    @openai/codex@${CODEX_VERSION} \
    opencode-ai@${OPENCODE_VERSION} \
  && case "${TARGETARCH:-$(dpkg --print-architecture)}" in \
    amd64) herdr_arch="x86_64" ;; \
    arm64) herdr_arch="aarch64" ;; \
    *) echo "Unsupported Herdr architecture: ${TARGETARCH:-$(dpkg --print-architecture)}" >&2; exit 1 ;; \
  esac \
  && curl -fsSL -o /usr/local/bin/herdr "https://github.com/ogulcancelik/herdr/releases/download/v${HERDR_VERSION}/herdr-linux-${herdr_arch}" \
  && chmod +x /usr/local/bin/herdr \
  && herdr --version

RUN case "${TARGETARCH:-$(dpkg --print-architecture)}" in \
    amd64) starship_target="x86_64-unknown-linux-gnu" ;; \
    arm64) starship_target="aarch64-unknown-linux-musl" ;; \
    *) echo "Unsupported Starship architecture: ${TARGETARCH:-$(dpkg --print-architecture)}" >&2; exit 1 ;; \
  esac \
  && curl -fsSL -o /tmp/starship.tar.gz "https://github.com/starship/starship/releases/download/v${STARSHIP_VERSION}/starship-${starship_target}.tar.gz" \
  && tar -xzf /tmp/starship.tar.gz -C /usr/local/bin starship \
  && chmod +x /usr/local/bin/starship \
  && rm /tmp/starship.tar.gz \
  && starship --version

RUN case "${TARGETARCH:-$(dpkg --print-architecture)}" in \
    amd64) atuin_target="x86_64-unknown-linux-musl" ;; \
    arm64) atuin_target="aarch64-unknown-linux-musl" ;; \
    *) echo "Unsupported Atuin architecture: ${TARGETARCH:-$(dpkg --print-architecture)}" >&2; exit 1 ;; \
  esac \
  && cd /tmp \
  && atuin_archive="atuin-${atuin_target}.tar.gz" \
  && curl -fsSLO "https://github.com/atuinsh/atuin/releases/download/v${ATUIN_VERSION}/${atuin_archive}" \
  && curl -fsSLO "https://github.com/atuinsh/atuin/releases/download/v${ATUIN_VERSION}/${atuin_archive}.sha256" \
  && sha256sum -c "${atuin_archive}.sha256" \
  && tar -xzf "${atuin_archive}" \
  && install -m 0755 "atuin-${atuin_target}/atuin" /usr/local/bin/atuin \
  && rm -rf "${atuin_archive}" "${atuin_archive}.sha256" "atuin-${atuin_target}" \
  && atuin --version

USER ${USERNAME}
WORKDIR /workspace

RUN install_git_ref() { \
    repo="$1"; ref="$2"; dest="$3"; \
    mkdir -p "${dest}"; \
    git -C "${dest}" init -q; \
    git -C "${dest}" remote add origin "${repo}"; \
    git -C "${dest}" fetch --depth=1 origin "${ref}"; \
    git -C "${dest}" checkout -q FETCH_HEAD; \
  }; \
  install_git_ref https://github.com/ohmyzsh/ohmyzsh.git "${OH_MY_ZSH_REF}" /home/${USERNAME}/.oh-my-zsh; \
  install_git_ref https://github.com/zsh-users/zsh-autosuggestions.git "${ZSH_AUTOSUGGESTIONS_REF}" /home/${USERNAME}/.oh-my-zsh/custom/plugins/zsh-autosuggestions; \
  install_git_ref https://github.com/zsh-users/zsh-syntax-highlighting.git "${ZSH_SYNTAX_HIGHLIGHTING_REF}" /home/${USERNAME}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting

COPY --chown=workshop:workshop docker/workshop.zshrc /home/workshop/.zshrc
COPY --chown=workshop:workshop docker/zsh-completions/ /home/workshop/.zsh/completions/

RUN mkdir -p /home/${USERNAME}/.cache /home/${USERNAME}/.config/atuin /home/${USERNAME}/.config/herdr /home/${USERNAME}/.local/bin /home/${USERNAME}/.local/share/opencode /home/${USERNAME}/.local/share/pnpm/store /home/${USERNAME}/.local/state /home/${USERNAME}/.pi/agent/extensions /home/${USERNAME}/.pi/agent/sessions /home/${USERNAME}/.claude /home/${USERNAME}/.codex /home/${USERNAME}/.opencode \
  && starship preset pure-preset -o /home/${USERNAME}/.config/starship.toml \
  && pnpm config set store-dir /home/${USERNAME}/.local/share/pnpm/store --location=user \
  && codex completion zsh > /home/${USERNAME}/.zsh/completions/_codex \
  && pnpm completion zsh > /home/${USERNAME}/.zsh/completions/_pnpm \
  && atuin gen-completions --shell zsh > /home/${USERNAME}/.zsh/completions/_atuin \
  && printf '%s\n' 'auto_sync = false' 'update_check = false' 'style = "compact"' 'inline_height = 20' 'show_preview = true' 'enter_accept = true' > /home/${USERNAME}/.config/atuin/config.toml

CMD ["zsh"]
