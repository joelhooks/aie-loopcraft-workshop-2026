# syntax=docker/dockerfile:1.7

FROM node:22-bookworm

ARG PI_VERSION=0.79.10
ARG CLAUDE_CODE_VERSION=2.1.185
ARG CODEX_VERSION=0.141.0
ARG OPENCODE_VERSION=1.17.9
ARG HERDR_VERSION=0.7.1
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
    git \
    jq \
    less \
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
  && corepack prepare pnpm@11.1.2 --activate \
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

RUN curl -fsSL https://starship.rs/install.sh | sh -s -- --yes --bin-dir /usr/local/bin

USER ${USERNAME}
WORKDIR /workspace

RUN mkdir -p /home/${USERNAME}/.config /home/${USERNAME}/.local/bin /home/${USERNAME}/.pi/agent/sessions /home/${USERNAME}/.claude /home/${USERNAME}/.codex /home/${USERNAME}/.opencode \
  && starship preset pure-preset -o /home/${USERNAME}/.config/starship.toml \
  && pnpm config set store-dir /home/${USERNAME}/.local/share/pnpm/store --location=user \
  && printf '%s\n' 'eval "$(starship init zsh)"' 'cd /workspace' > /home/${USERNAME}/.zshrc

CMD ["zsh"]
