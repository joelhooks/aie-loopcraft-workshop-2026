# Setup

The normal path is Docker Compose plus Herdr inside the container. Host Herdr is not required.

Use the host-machine path only if you already have the tools installed and want to manage the environment yourself.

## Prereqs

Recommended Docker path:

- Git
- Docker Desktop or OrbStack with Docker Compose
- pnpm 11+ for `pnpm run workshop`

Check Docker Compose before the workshop:

```sh
docker compose version
```

If that fails but `docker-compose version` works, the repo helper scripts will use legacy `docker-compose` automatically. If both fail, install/update Docker Desktop, OrbStack, or the Docker Compose plugin before running the workshop.

Optional for troubleshooting:

- GitHub CLI, only if GHCR reports the image as private

Host-machine path adds:

- Node 22+
- Bun, for the workshop site scripts
- Pi
- Herdr
- Claude Code, Codex, and OpenCode if you want the comparison agent shells

## Fast-track prerequisite: Docker Compose

The fast track starts inside the Docker workshop computer. Before cloning or running the start command, confirm one of these works:

```sh
docker compose version
# or
docker-compose version
```

If both fail, install or update Docker Desktop / OrbStack first. Host Herdr is not required, but Docker Compose is.

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

That command runs `scripts/start-workshop-herdr.sh`. It pulls the workshop image when possible, builds it locally if the pull is unauthorized or unavailable, starts the Compose service, installs the Herdr Pi integration inside the container, and opens a Herdr session named `aie-loopcraft-workshop-2026` from `/workspace`.

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

If you do not want host pnpm, use the repo scripts directly:

```sh
bash scripts/docker-compose.sh pull workshop
bash scripts/start-workshop-herdr.sh
```

`scripts/docker-compose.sh` tries `docker compose` first and falls back to legacy `docker-compose` when that is what the machine has.

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

If Docker says the package is private or unauthorized, the start script now falls back to a local image build. If you want the faster prebuilt-image path, authenticate to GitHub Packages:

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
bash scripts/docker-compose.sh build workshop
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
bash scripts/docker-compose.sh run --rm --name loopcraft-workshop workshop zsh
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
bash scripts/docker-compose.sh down --volumes
```

That deletes local container auth/state for this Compose project, so do it deliberately.

## Full setup without Docker

Use this only if you explicitly want to manage the host machine yourself instead of using the Docker workshop computer.

The complete local-machine checklist and agent instructions live in:

- [`docs/full-setup-without-docker.md`](full-setup-without-docker.md)
- Published appendix: `https://aie-loopcraft-workshop-2026.wzrrd.sh/appendix/full-setup-without-docker/`

Short version:

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026

# after installing/verifying Git, Node 22+, pnpm, Bun, Pi, and optionally Herdr
herdr integration install pi
herdr --session aie-loopcraft-workshop-2026
```

If Herdr is the blocker, use two terminals from the repo root:

```sh
pi
node scripts/loop-daemon-stub.mjs
```

For the site source:

```sh
pnpm run web:install
pnpm run web:check
pnpm run web:build
```

The local path changes how tools run. It does not change the lesson order: Lesson 01 still creates `VISION.md`, and Lesson 02 still creates the first local issue events and checks.

## What not to do

Do not put secrets in the repo. Do not commit raw transcripts. Do not skip the visible setup steps in the lessons: the point is to build the guardrails in front of people, not hide them in template magic.
