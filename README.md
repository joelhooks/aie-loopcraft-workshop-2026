# AI Engineer Loopcraft Workshop 2026

Build a local issue-progress loop you can trust.

This repo gives you a small project and a Docker-based workshop computer with Pi, Herdr, Lakebed, typed issue events, receipts, and the source mirrors used during the lessons. The loop is not finished for you. You will build the useful parts in the open.

## Start here

Prereqs:

- Git
- Docker Desktop or OrbStack with Docker Compose (`docker compose version` or `docker-compose version`)
- pnpm 11+ for the short command below

> **Fast track requires Docker Compose.** Before running the start command, make sure either `docker compose version` or `docker-compose version` works. If both fail, install or update Docker Desktop / OrbStack first.

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm run workshop
```

`pnpm run workshop` starts Herdr inside the Docker container. It does not use host Herdr.

When Herdr opens:

1. You are in the Loopcraft workspace at `/workspace`.
2. Pi is installed in the container. Start `pi` from a Herdr pane when you are ready.
3. Sign into your provider if Pi asks.
4. Use `/loop-lesson-01` to load the first prompt, then open Lesson 01:

```txt
https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/01-tour-vision-repo/
```

When a lesson asks for the runtime/status pane, split a Herdr pane and run:

```sh
node scripts/loop-daemon-stub.mjs
```

Detailed setup, no-pnpm commands, GHCR troubleshooting, local builds, and host-machine fallback live in [`docs/setup.md`](docs/setup.md).

## What you will build

By the end, you will have a small local loop that can read issue events, decide what is ready or blocked, stop for approval, write receipts, show state in Lakebed, and run through Pi and Herdr controls.

The repo starts prepared, not finished. The product loop is still yours to build.

## Lesson path

1. [Tour the rig and set the course](lessons/01-tour-vision-repo.md)
2. [Build the reliability floor](lessons/02-reliability-floor.md)
3. [Project issue state into Lakebed](lessons/03-lakebed-projection.md)
4. [Control the loop from Pi and Herdr](lessons/04-pi-herdr-control.md)
5. [Make dispatch safe](lessons/05-safe-dispatch.md)
6. [Add a bounded gardener](lessons/06-bounded-gardener.md)
7. [Add specialist review carefully](lessons/07-specialist-review.md)
8. [Shadow the supervisor runtime](lessons/08-supervisor-runtime.md)

Lessons are step-by-step checkpoints. Issues are the product data you build toward.

## Repo map

```txt
agents/skills/loopcraft-ta       local guide skill for the workshop
agents/skills/grill-with-docs    guided vision/session questions
.agent_sources/                  source mirrors for Effect, XState, pi-subagents
.pi/extensions/loop-workshop.ts  Pi helper commands for status and Lesson 01
.pi/agents/                      scout/reviewer definitions for later lessons
lessons/                         step-by-step lesson pages
surface/lakebed/                 local projection surface shell
scripts/loop-daemon-stub.mjs     temporary status daemon
web/                             published workshop site source
```

## Public boundary

No secrets. No raw transcripts. No private machine paths. No hidden auth. If a tool needs auth, sign into it locally or inside the container.
