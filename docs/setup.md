# Setup

The normal path is Docker Compose plus Herdr inside the container. Host Herdr is not required.

Use the host-machine path only if you already have the tools installed and want to manage the environment yourself.

## Prereqs

Recommended Docker path:

- Git
- Docker Desktop or OrbStack with Docker Compose
- pnpm 11+ for `pnpm run workshop`

Optional for troubleshooting:

- GitHub CLI, only if GHCR reports the image as private

Host-machine path adds:

- Node 22+
- Bun, for the workshop site scripts
- Pi
- Herdr
- Claude Code, Codex, and OpenCode if you want the comparison agent shells

## Happy path: Docker + Herdr

Clone the repo:

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026
```

Enable pnpm through Corepack if needed:

```sh
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

Start the workshop computer:

```sh
pnpm run workshop
```

That command runs `scripts/start-workshop-herdr.sh`. It pulls the workshop image when needed, starts the Compose service, installs the Herdr Pi integration inside the container, and opens a Herdr session named `aie-loopcraft-workshop-2026` from `/workspace`.

When Herdr opens:

1. Start `pi` from a Herdr pane.
2. Sign into your provider if Pi asks.
3. Use `/loop-lesson-01` to load the Lesson 01 starter prompt.
4. When a lesson asks for the status process, split a Herdr pane and run:

```sh
node scripts/loop-daemon-stub.mjs
```

This does not pre-create Pi or daemon panes. Herdr gives you the workspace; you start the panes when the lesson asks for them.

## No-pnpm Docker commands

If you do not want host pnpm, use Docker Compose directly:

```sh
docker compose pull workshop
docker compose run --rm workshop zsh -lc 'cd /workspace && herdr integration install pi && herdr --session aie-loopcraft-workshop-2026'
```

If you already have a local image and want to skip the pull behavior in the script:

```sh
LOOPCRAFT_SKIP_PULL=1 bash scripts/start-workshop-herdr.sh
```

## GHCR private-image troubleshooting

Published image:

```txt
ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest
```

Package page:

```txt
https://github.com/users/joelhooks/packages/container/package/aie-loopcraft-workshop-2026
```

If Docker says the package is private or unauthorized, authenticate to GitHub Packages:

```sh
gh auth refresh -h github.com -s read:packages
gh auth token | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
pnpm run workshop
```

If pull still fails during the workshop, build locally instead.

## Local image build

Build the image from this repo:

```sh
pnpm run workshop:build
pnpm run workshop
```

No-pnpm version:

```sh
docker compose build workshop
LOOPCRAFT_SKIP_PULL=1 bash scripts/start-workshop-herdr.sh
```

Quick smoke test for the published image:

```sh
docker run --rm ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest \
  zsh -lc 'pi --version && codex --version && opencode --version && herdr --version'
```

## Fallback terminal mode

Use this if Herdr is not cooperating but Docker works. This keeps the work inside the container and avoids requiring host Herdr.

Terminal 1:

```sh
docker compose run --rm --name loopcraft-workshop workshop zsh
```

Inside that shell, start Pi when you are ready:

```sh
pi
```

Terminal 2, while Terminal 1 is still running:

```sh
docker exec -it loopcraft-workshop zsh -lc 'cd /workspace && node scripts/loop-daemon-stub.mjs'
```

If you only need a container shell or Pi:

```sh
pnpm run workshop:shell
pnpm run workshop:pi
```

The daemon helper is mainly for host-machine fallback:

```sh
pnpm run workshop:daemon
```

## Docker state and reset

The Compose file mounts this repo into `/workspace` and stores tool state in Docker named volumes:

- Pi: `workshop-pi`
- Claude Code: `workshop-claude`
- Codex: `workshop-codex`
- OpenCode: `workshop-opencode`
- Herdr: `workshop-herdr`
- pnpm store: `pnpm-store`

Auth is not baked into the image. Sign into each tool inside the container if you need it.

To reset the container state, stop first and remove the named volumes:

```sh
docker compose down --volumes
```

That deletes local container auth/state for this Compose project, so do it deliberately.

## Host-machine path

Use this only if you already have the tools installed and do not want the Docker workshop computer.

Start from a fresh clone:

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026
```

Install or verify the host tools you plan to use:

- Node 22+
- pnpm 11+
- Bun, for the workshop site scripts
- Pi
- Herdr, if you want the same two-pane shape without Docker
- Claude Code, Codex, and OpenCode if you want the optional comparison agent shells

Start Pi from the repo root:

```sh
pi
```

In another terminal, start the temporary status daemon:

```sh
node scripts/loop-daemon-stub.mjs
```

For the site source:

```sh
pnpm run web:install
pnpm run web:check
pnpm run web:build
pnpm run web:publish
```

The site is MDSvX-driven. Root, lesson index, and lesson pages live in `web/src/routes/**/*.svx`; shared lesson data lives in `web/src/lib/workshop-data.ts`.

## What not to do

Do not put secrets in the repo. Do not commit raw transcripts. Do not skip the visible setup steps in the lessons: the point is to build the guardrails in front of people, not hide them in template magic.
