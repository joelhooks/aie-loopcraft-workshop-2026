# Loopcraft 008 setup punch list

This is the concrete fix list for turning the prepared 007-style rig into an 008-ready, recording-aware workshop harness.

## Done gates

- [x] `pnpm run workshop` prints the host/container/browser connection model before entering Herdr.
- [x] `pnpm run workshop:ui-url` prints host-local URLs, bridge health, SSH forwarding guidance, Tailnet/Funnel commands, and the explicit `?bridge=...` Lakebed URL shape.
- [x] Pi guidance knows the topology in `.pi/APPEND_SYSTEM.md`.
- [x] Claude guidance knows the topology in `CLAUDE.md`.
- [x] Codex guidance exists in `.codex/instructions.md`.
- [x] The local Loopcraft TA skill explains the topology and when to check URLs before code.
- [x] Lesson 03 asks for host-visible Lakebed/bridge receipts before judging projection code.
- [x] Lesson 04 asks for host-visible Pi/Herdr/Lakebed/bridge receipts before judging control-plane code.
- [x] Public agent docs tell browser/coding agents not to treat bare `localhost:3000` as universal.
- [x] The Pi workshop widget is dynamic: it reads `VISION.md`, issue-event files, and latest check receipts to show the next move.
- [x] A lightweight run recorder exists for lesson flow, milestones, teaching moments, friction, learning goals, support fade, and next-stretch notes.

## Connection model to preserve

```txt
container serves Lakebed :3000 and bridge :8787
  -> Docker publishes those ports onto the host with --service-ports
  -> browser uses a host URL, SSH forward, Tailnet Serve, Funnel, or another host-side tunnel
```

`localhost` means the machine where it is used. That is the whole trap.

## Recorder path

Use the recorder during 008-style runs:

```sh
pnpm run record:event -- --type lesson_started --lesson 03 --note "Started Lakebed projection pass"
pnpm run record:event -- --type friction --lesson 03 --note "Browser localhost pointed at the wrong machine" --source docs/host-container-urls.md
pnpm run record:event -- --type milestone --lesson 03 --note "Lakebed cards matched the local check receipt" --source receipts/lakebed-compare-latest.json
pnpm run record:summary
```

Events are written to `recordings/run-008/events.jsonl` by default. Set `LOOPCRAFT_RUN_ID` or pass `--run <id>` for another run.

## Validation gate

Before calling this setup done, run:

```sh
bash -n scripts/workshop-ui-url.sh
bash -n scripts/start-workshop-herdr.sh
git diff --check
pi-notes brain check
docker exec loopcraft-lakebed zsh -lc 'cd /workspace && pnpm run check'
```

Host `pnpm run check` may be blocked when host `node_modules` is Linux/container-shaped and pnpm wants a TTY to purge it. Use the Docker check as the reliable validation path for this repo state.

## Latest validation receipt

2026-06-30 checkpoint:

- `bash -n scripts/workshop-ui-url.sh` passed.
- `bash -n scripts/start-workshop-herdr.sh` passed.
- `node --check scripts/record-run-event.mjs` passed.
- `node --check scripts/loop-daemon-stub.mjs` passed.
- `git diff --check` passed.
- `pi-notes brain check` passed.
- Direct recorder smoke with `node scripts/record-run-event.mjs --run validation-smoke ...` passed, then the temporary `recordings/validation-smoke` folder was removed.
- Docker check passed: `docker exec loopcraft-lakebed zsh -lc 'cd /workspace && pnpm run lakebed:compare && pnpm run check'`.
- Host web check/build passed: `cd web && bun run check && bun run build`.

Known noise: `bun run build` reports upstream Hugeicons/Rolldown annotation warnings from `node_modules/@hugeicons/core-free-icons`, but the build completes.

Claude review pass:

- Ran `claude -p --model opus` for a read-only staged-diff review against `origin/main`.
- Applied the two blocking recommendations: dropped the deleted lesson markdown twins and kept the upstream narrative `promptContext` lines in the surviving `.svx` lesson files.
- Reconciled the learner-facing tooling mismatch by separating the current 008 scaffold commands from the full `tsgo` / Oxlint / Oxfmt / Ultracite reliability-floor target in `docs/tooling.md`.
- Added the missing `receipt` and `note` recorder event types to the local TA skill guidance.
