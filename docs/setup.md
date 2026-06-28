# Setup

Use Docker Compose if you want the workshop computer. Use your host if you already have the tools and do not mind doing the setup yourself.

## Docker Compose path

This is the recommended path for a live workshop. It keeps the tool versions boring and avoids leaking anyone's local machine setup into the lesson.

Build the container:

```sh
pnpm run workshop:build
```

Open a shell in the workshop computer:

```sh
pnpm run workshop:shell
```

Start Pi inside the container:

```sh
pnpm run workshop:pi
```

Start Herdr inside the container:

```sh
pnpm run workshop:herdr
```

Run the temporary status daemon from a second shell or Herdr pane:

```sh
pnpm run workshop:daemon
```

The Compose file mounts this repo into `/workspace` and stores harness state in Docker volumes:

- Pi: `workshop-pi`
- Claude Code: `workshop-claude`
- Codex: `workshop-codex`
- OpenCode: `workshop-opencode`
- Herdr: `workshop-herdr`
- pnpm store: `pnpm-store`

Auth is not baked into the image. Sign into each harness inside the container if you need it.

## Host path

Use this if you already have the tools installed.

Required:

- Node 22+
- pnpm 11+
- Bun, for the workshop site scripts
- Git
- Pi
- Herdr
- Docker only if you want to compare with the container path

Helpful during later lessons:

- Claude Code
- Codex
- OpenCode
- Effect source mirror in `.agent_sources/effect`
- XState source mirror in `.agent_sources/xstate`
- pi-subagents source mirror in `.agent_sources/pi-subagents`

Start from the repo root:

```sh
pi
```

In another terminal:

```sh
node scripts/loop-daemon-stub.mjs
```

For the site:

```sh
pnpm run web:install
pnpm run web:check
pnpm run web:build
pnpm run web:publish
```

## What not to do

Do not put secrets in the repo. Do not commit raw transcripts. Do not skip the visible setup steps in the lessons: the point is to build the guardrails in front of people, not hide them in template magic.
