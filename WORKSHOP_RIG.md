# Workshop Rig

This repo is prepared so the hour starts on the important work instead of install/debugging sludge.

## Surfaces

### Pi

Pi is the operator harness. It should help you prompt the next small pass, inspect evidence, and control the loop.

Project-local helper:

```txt
/loop-workshop-status
/loop-lesson-01
```

### Herdr

Herdr gives us the two-pane workshop surface:

- left/operator pane: Pi
- right/runtime pane: daemon or status output

Until the real loop daemon exists, use the scaffold status process in the side pane:

```sh
node scripts/loop-daemon-stub.mjs
```

It exposes `GET /health`, `GET /status`, `POST /check-now`, and `GET /events` on port `8787`. It watches for `data/issue-events.jsonl` or `issues.jsonl` so the issue-event lesson has something visible to wake up.

From this public repo, use Docker Compose:

```sh
pnpm run workshop:build
pnpm run workshop:pi
```

For a shell or Herdr session:

```sh
pnpm run workshop:shell
pnpm run workshop:herdr
```

### Lakebed

Lakebed is the operator projection surface. It should show the same issue facts in list, board, and event views.

The capsule shell lives at:

```txt
surface/lakebed
```

The lesson path should use Lakebed once the local issue events exist. Do not make Lakebed the domain model; keep it as provider/projection.

### Persistence

The workshop container persists user harness state through parent-mounted folders:

```txt
.workshop/home/.pi
.workshop/home/.claude
.workshop/home/.codex
.workshop/home/.opencode
.workshop/home/.config/herdr
.workshop/pi-sessions
```

Project state belongs in this nested Git repo. Runtime receipts and generated files should be inspectable and committed when they become useful evidence.

## Big lifts already done

- Source mirrors are preloaded in `.agent_sources`.
- Matt Pocock skills are preloaded.
- Pi/Claude skill symlinks are wired.
- Lakebed capsule shell is present.
- Pi helper extension is present.
- Loop-owned scout/reviewer subagent definitions are present in `.pi/agents` for the later specialist lesson.

## Big lifts intentionally not done

- No final loop implementation yet.
- No product guardrail scripts yet; the root `package.json` is only workshop orchestration until Lesson 02 adds product checks.
- No `VISION.md` yet; Lesson 01 creates it through `grill-with-docs`.
- No `issues.jsonl` yet; Lesson 02 creates the first issue-event queue.
- No external tracker/auth setup.
- No launchd scheduling yet.

Those are lesson work, not scaffold work.
