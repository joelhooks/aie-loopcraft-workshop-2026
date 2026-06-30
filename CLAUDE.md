# Claude Code Instructions

@AGENTS.md

Use the local Loopcraft TA skill from `.claude/skills` when available.

Before debugging Lakebed or bridge code, use the host/container URL model in `AGENTS.md`: run `bash scripts/workshop-ui-url.sh` from the Docker host, then verify the host-published UI `3000` and bridge `8787` path. Do not treat bare `localhost:3000` as a universal browser URL.
