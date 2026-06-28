# AI Engineer Loopcraft Workshop 2026

Build a local issue-progress loop you can trust.

This is a hands-on workshop about developing loop systems with a customized Pi harness. We use Pi, Herdr, Lakebed, typed issue events, receipts, and a small local repo to make agent work visible instead of magical.

## Outcome

By the end, you will have a small local loop that can:

- read its own issue events;
- decide what is ready, blocked, or missing input;
- stop for approval when it should;
- write receipts for every move;
- show state in Lakebed;
- run through Pi and Herdr controls;
- climb toward safe dispatch, bounded maintenance, specialist review, and supervisor runtime shadowing.

The repo starts prepared, not finished. The harness and source mirrors are here. The product loop is still yours to build.

## Start fast

Recommended container path:

```sh
pnpm run workshop:pull
pnpm run workshop:pi
```

Build locally instead of pulling:

```sh
pnpm run workshop:build
```

Published image:

```txt
ghcr.io/joelhooks/aie-loopcraft-workshop-2026:latest
```

In a second pane:

```sh
pnpm run workshop:daemon
```

Host path if you already have the tools:

```sh
pi
node scripts/loop-daemon-stub.mjs
```

Full setup notes live in [`docs/setup.md`](docs/setup.md).

## Tools we use

### Pi

Pi is the operator harness. We use it to prompt the next move, inspect evidence, and add small local controls.

### Herdr

Herdr gives us the two-pane workshop shape: one pane for Pi, one pane for runtime/status output.

### Docker Compose

Docker Compose is the recommended workshop computer. It keeps tool versions boring and keeps auth out of the image.

### Lakebed

Lakebed is the operator surface. It should project issue facts into list, board, and event views. It is not the domain model.

### Effect

Effect is the boundary tool. We use schemas and structured errors so sloppy issue input is hard to ignore.

### XState

XState is the lifecycle tool. We use it when the loop has real states, gates, retries, and recovery paths.

### pi-subagents

pi-subagents gives us bounded specialist help. Scouts and reviewers produce artifacts; they do not get the keys by default.

### Claude Code, Codex, and OpenCode

These are available in the workshop computer as optional comparison harnesses. Pi is the main teaching surface.

### Guardrails

pnpm, TypeScript, tsgo, oxlint, oxfmt, Ultracite, tests, and hooks are introduced as lesson work. They are speed and strictness choices for keeping the agent loop honest.

### Matt Pocock skills

Matt's workshop shape is the reference for the site: clear landing page, step-by-step lessons, and practical prompts. The core work here is Loopcraft: developing reliable loop systems through Pi.

## Lesson path

1. [Tour the rig and set the course](lessons/01-tour-vision-repo.md)
2. [Build the reliability floor](lessons/02-reliability-floor.md)
3. [Project issue state into Lakebed](lessons/03-lakebed-projection.md)
4. [Control the loop from Pi and Herdr](lessons/04-pi-herdr-control.md)
5. [Make dispatch safe](lessons/05-safe-dispatch.md)
6. [Add a bounded gardener](lessons/06-bounded-gardener.md)
7. [Add specialist review carefully](lessons/07-specialist-review.md)
8. [Shadow the supervisor runtime](lessons/08-supervisor-runtime.md)

Lessons are rails. Issues are the product substrate we build toward.

## Workshop site

```sh
pnpm run web:install
pnpm run web:check
pnpm run web:build
pnpm run web:publish
```

Published site:

```txt
https://aie-loopcraft-workshop-2026.wzrrd.sh/
```

## Repo map

```txt
agents/skills/loopcraft-ta       local guide skill
agents/skills/grill-with-docs    vision/session grilling skill
.agent_sources/                  source mirrors for Effect, XState, pi-subagents
.pi/extensions/loop-workshop.ts  Pi helper commands
.pi/agents/                      loop-owned scout/reviewer definitions
lessons/                         lesson rails
surface/lakebed/                 Lakebed capsule shell
scripts/loop-daemon-stub.mjs     temporary status daemon
web/                             Wzrrd workshop site
```

## Public boundary

No secrets. No raw transcripts. No private machine paths. No hidden auth. If a tool needs auth, sign into it locally or inside the container.
