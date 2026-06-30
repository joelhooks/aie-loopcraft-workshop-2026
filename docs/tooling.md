# Tooling foundation

This is the fast, strict check surface the loop relies on before it starts
changing product code. You build it in Lesson 02 (the reliability floor); after
that, every pass runs against it.

The rig ships with the source mirrors and workshop scaffolding, but the product
check commands below are yours to add — do not assume they already exist. When no
check exists yet, say so plainly and add it.

## Commands in this 008 scaffold

This checkpoint wires the smallest local receipt path the current rig actually
runs:

- `pnpm run typecheck` — strict TypeScript with no emit.
- `pnpm run test` — Vitest tests for the issue-event check and Lakebed card projection.
- `pnpm run loop:check` — reads local issue events, classifies them, and writes a receipt.
- `pnpm run lakebed:compare` — compares the local check output with the Lakebed card projection.
- `pnpm run format` — Prettier check for the current TypeScript/config seed files.
- `pnpm run check` — typecheck, tests, and the local loop check in one gate.

Keep the workshop web scripts intact alongside these commands.

## Full reliability-floor target

Lesson 02 should still explain the faster/stricter guardrail stack before adding
it. The target guardrails are:

- TypeScript 7 native preview through `tsgo`, no emit.
- Oxlint with the Ultracite core preset.
- Oxfmt with the Ultracite formatter preset.
- `ultracite:check` over source and config paths.
- Vitest tests running TypeScript directly.
- One `check` command that runs typecheck, lint, format check, and tests.

Later passes add the issue-event and runtime surface (typed issue writes, the
bridge daemon, the supervisor-runtime flag). Document those when you build them;
do not pre-wire them here.

## Rationale

The loop will ask agents to read issues, make judgments, and eventually edit
code. Fast checks keep feedback inside that loop. Strict checks stop the agent
from hand-waving past vague types, inconsistent formatting, or sloppy imports.

- `oxlint` / `oxfmt`: speed choices. Linting and formatting should be cheap enough
  to run constantly and boring enough that the agent just complies.
- Ultracite: strict automatic rules. Heavier than a human workflow wants, but
  agents benefit from hard gates that force consistency.
- `tsgo` (TypeScript 7 native preview): a speed choice with release-risk attached.
  It may change before a stable release, so update `@typescript/native-preview`
  deliberately and run the full check suite after.
- strict, Matt Pocock-style `tsconfig`: a correctness choice for strong,
  idiomatic types. Use his current TSConfig guidance rather than inventing
  settings.

Effect and XState are product boundaries, not dependency trophies:

- **Effect** parses issue events into typed values and turns bad input into
  structured errors instead of hand-rolled object checks. It lands at the
  reliability floor (Lesson 02).
- **XState** models the loop's lifecycle — gates, stop reasons, claims, dispatch,
  recovery — as explicit states and transitions instead of hidden booleans. It
  lands when the loop has a real lifecycle to model (Lesson 08).

When writing Effect or XState code, read the local source mirrors under
`.agent_sources/effect` and `.agent_sources/xstate` first so the work is
source-backed and idiomatic instead of guessed from memory.
