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

`pnpm run workshop` starts Herdr inside the Docker container. It does not use host Herdr. It also prints the connection report for the host-published Lakebed UI and bridge.

If your browser is not running on the Docker host, do not open bare `localhost:3000` and hope. Run this from a host shell and use the printed SSH/Tailnet/Funnel URL shape:

```sh
pnpm run workshop:ui-url
```

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

Detailed setup, no-pnpm commands, GHCR troubleshooting, local builds, and the full no-Docker local setup path live in [`docs/setup.md`](docs/setup.md) and [`docs/full-setup-without-docker.md`](docs/full-setup-without-docker.md).

## What you will build

By the end, you will have a small local loop that can read issue events, decide what is ready or blocked, stop for approval, write receipts, show state in Lakebed, and run through Pi and Herdr controls.

The repo starts prepared, not finished. The product loop is still yours to build.

## Lesson path

1. [Set the rules before the first line of code](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/01-tour-vision-repo/)
2. [Make bad input fail loudly](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/02-reliability-floor/)
3. [Make the queue visible and traceable](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/03-lakebed-projection/)
4. [Operate the check, and always know its state](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/04-pi-herdr-control/)
5. [Claim work without letting the agent touch your code](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/05-safe-dispatch/)
6. [Let the loop create work — and stop itself](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/06-bounded-gardener/)
7. [Get a second opinion without giving up the repo](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/07-specialist-review/)
8. [Shadow the next decision before you trust it](https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/08-supervisor-runtime/)

Lesson source lives in `web/src/routes/lessons/NN-*/+page.svx`; pasteable starter prompts in `web/static/lessons/NN-*/prompt.txt`.

Lessons are step-by-step checkpoints. Issues are the product data you build toward.

## Repo map

```txt
agents/skills/loopcraft-ta       local guide skill for the workshop
agents/skills/grill-with-docs    guided vision/session questions
.agent_sources/                  source mirrors for Effect, XState, pi-subagents
.pi/extensions/loop-workshop.ts  Pi helper commands for status and Lesson 01
.pi/agents/                      scout/reviewer definitions for later lessons
lessons/                         pointer to the published lesson pages
surface/lakebed/                 local projection surface shell
scripts/loop-daemon-stub.mjs     temporary status daemon
scripts/record-run-event.mjs     lightweight 008 run recorder
web/                             published workshop site source
```

## 008 run recorder

For a recording-aware pass, capture short run events instead of reconstructing the lesson from memory:

```sh
pnpm run record:event -- --type milestone --lesson 03 --note "Lakebed matched the local check" --source receipts/lakebed-compare-latest.json
pnpm run record:summary
```

See [`docs/loopcraft-008-run-recorder.md`](docs/loopcraft-008-run-recorder.md).

## Public boundary

No secrets. No raw transcripts. No private machine paths. No hidden auth. If a tool needs auth, sign into it locally or inside the container.
