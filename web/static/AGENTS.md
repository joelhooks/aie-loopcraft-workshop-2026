# Public agent instructions for the Loopcraft workshop

These instructions are for stock coding/browser agents helping someone from the public workshop site or cloned public repo.

## Purpose

Help them build a local issue-progress loop one step at a time. The loop eventually reads local issue events, classifies work, stops when approval or input is needed, writes receipts, shows state, and only later adds dispatch.

## Main path

Use the Docker workshop computer unless the person running the workshop explicitly chooses the host-machine path. If they choose the host-machine path, follow `/appendix/full-setup-without-docker/` or `docs/full-setup-without-docker.md` end to end before lesson work starts.

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm run workshop
```

`pnpm run workshop` starts Herdr inside the Docker container. Do not require host Herdr.

When Herdr opens, start `pi` in a pane if they want Pi. Sign in only through the normal local/container auth flow.

## Read before editing

For setup and public guidance:

- `/glossary/` on the public site when a term is unclear
- `/appendix/full-setup-without-docker/` when Docker is not being used
- `README.md`
- `docs/setup.md`
- `docs/full-setup-without-docker.md` when Docker is not being used
- `lessons/README.md` — index pointing to the published lessons
- `web/static/lessons/01-tour-vision-repo/prompt.txt` — Lesson 01 starter prompt

For local agent guidance when present:

- `agents/skills/loopcraft-ta/SKILL.md`
- `agents/skills/grill-with-docs/SKILL.md`

Do not use private parent-repo instructions, raw transcripts, secrets, or unpublished local paths.

## Lesson order

1. Define the vision and stop rules in `VISION.md`.
2. Add the first local issue events, checks, tests, and receipt.
3. Project the same facts into Lakebed.
4. Add Pi and Herdr controls.
5. Make dispatch safe.
6. Add a bounded gardener.
7. Add specialist review.
8. Shadow the supervisor runtime.

Stay inside the current lesson. Do not build future lessons early.

## Lesson 01 boundaries

Allowed:

- create or update `VISION.md`;
- update `AGENTS.md` or `README.md` only when the person running the workshop agrees to a clear repo rule or useful command;
- optionally add a small decision note if the choice would surprise a future reader.

Not allowed yet:

- issue-event files;
- schemas, classifiers, checks, tests, or product code;
- Lakebed projection;
- background workers, schedulers, dispatch, or external issue APIs.

Done means they can answer:

- what are we building;
- what may the loop change;
- what requires approval;
- what is out of scope;
- what waits until Lesson 02.

## Lesson 02 boundaries

Allowed:

- local issue-event examples;
- strict TypeScript and fast guardrails;
- an Effect-backed schema if the project has the source mirror available;
- a small classifier/check command;
- tests for outside behavior;
- one receipt from a real check run.

Not allowed yet:

- external tracker auth or APIs;
- dispatch;
- scheduler/background work;
- Lakebed work from Lesson 03.

Done means a fresh reader can run the local check and understand the event file read, classifications, stop reasons, next allowed action, refused action, and commands run.

## Evidence rules

Every agent pass should report:

- files changed;
- commands run;
- check output or receipt path;
- what remains blocked;
- where the pass stopped.

Prefer small, inspectable changes. If the next move would cross into a later lesson, stop and ask.

## Public boundary

No secrets. No raw transcripts. No private machine paths. No hidden auth. No fake MCP, OAuth, or API claims. If a public route or capability is not present, say it is not present.
