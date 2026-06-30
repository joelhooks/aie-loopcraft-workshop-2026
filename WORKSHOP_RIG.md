# Workshop Rig

This repo is prepared so you can start on the important work instead of install/debugging sludge.

## Start path

Use Docker Compose. The normal start command opens Herdr inside the workshop container, not on your host machine:

```sh
pnpm run workshop
```

No-pnpm version:

```sh
docker compose pull workshop
docker compose run --rm workshop zsh -lc 'cd /workspace && herdr integration install pi && herdr --session aie-loopcraft-workshop-2026'
```

Herdr opens the Loopcraft workspace at `/workspace`. Pi is installed in the container. Start `pi` from a Herdr pane, sign into your provider if prompted, and use `/loop-lesson-01` to load the first prompt.

Detailed setup, image troubleshooting, local build, and host-machine fallback live in `docs/setup.md`. Complete no-Docker local setup instructions live in `docs/full-setup-without-docker.md`.

## Pieces

### Pi

Pi is the agent shell you use for this workshop. It should help you prompt the next small pass, inspect evidence, and control the loop.

Project-local helper:

```txt
/loop-workshop-status
/loop-lesson-01
```

### Herdr

Herdr gives us a two-pane workspace once the lesson asks for it:

- Pi pane: chat and prompts
- runtime pane: daemon or status output

This rig does not pre-create those panes. In Herdr, start Pi when you are ready. When the lesson calls for a side pane, split a pane and run:

```sh
node scripts/loop-daemon-stub.mjs
```

Until the real loop daemon exists, that scaffold process exposes `GET /health`, `GET /status`, `POST /check-now`, and `GET /events` on port `8787`. It watches for `data/issue-events.jsonl` or `issues.jsonl` so the issue-event lesson has something visible to wake up.

The Docker path publishes the UI ports through the host. The container serves the app; the host owns reachable URLs:

```txt
http://localhost:3000   # local UI on the Docker host
http://localhost:8787   # local loop bridge on the Docker host
```

This remains true without Tailnet. If you are SSH'd into the host, your shell can check those URLs, but a browser on your laptop still needs SSH port forwarding or a host-side tunnel. See `docs/host-container-urls.md`.

For a tailnet URL, start the workshop first, then run this on the host machine:

```sh
bash scripts/workshop-ui-url.sh --serve
```

Do not try to create the public or tailnet tunnel from inside the container.

Fallback helpers:

```sh
pnpm run workshop:shell
pnpm run workshop:pi
pnpm run workshop:herdr
pnpm run workshop:daemon
```

Local image rebuild:

```sh
pnpm run workshop:build
```

### Lakebed

Lakebed is the projection view. It should show the same issue facts in list, board, and event views.

The capsule shell lives at:

```txt
surface/lakebed
```

The lesson path should use Lakebed once the local issue events exist. Do not make Lakebed the domain model; keep it as provider/projection.

### Persistence

The workshop container persists tool state through Docker named volumes:

```txt
workshop-pi
workshop-claude
workshop-codex
workshop-opencode
workshop-herdr
pnpm-store
```

Project state belongs in this nested Git repo. Runtime receipts and generated files should be inspectable and committed when they become useful evidence.

To reset tool state, run:

```sh
docker compose down --volumes
```

That deletes local container auth/state for this Compose project.

## Big lifts already done

- Source mirrors are preloaded in `.agent_sources`.
- Local guide skills are wired for Pi and Claude Code.
- Lakebed capsule shell is present.
- Pi helper extension is present.
- Loop-owned scout/reviewer definitions are present in `.pi/agents` for the later specialist lesson.

## Big lifts intentionally not done

- No final loop implementation yet.
- No product guardrail scripts yet; the root `package.json` is only workshop orchestration until Lesson 02 adds product checks.
- No `VISION.md` yet; Lesson 01 creates it through `grill-with-docs`.
- No `issues.jsonl` yet; Lesson 02 creates the first issue-event queue.
- No external tracker/auth setup.
- No launchd scheduling yet.

Those are lesson work, not scaffold work.
