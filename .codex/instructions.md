# Codex Instructions

Read `AGENTS.md` before editing. Stay inside this project folder and follow the current lesson boundary.

Use the host/container/browser URL model before debugging UI code:

- the container serves Lakebed on `:3000` and the loop bridge on `:8787`;
- Docker publishes those ports onto the host only when the workshop uses `--service-ports`;
- a browser on a laptop or phone does not share the Docker host's `localhost`;
- SSH, Tailnet Serve, Funnel, and other tunnels must run from the host side.

For a blank Lakebed page, bridge failure, or stale browser state, run this from the Docker host before changing code:

```sh
bash scripts/workshop-ui-url.sh
```

Do not run Tailnet/Funnel commands inside Docker. Do not patch Lakebed until the host-published UI and bridge path has been checked.
