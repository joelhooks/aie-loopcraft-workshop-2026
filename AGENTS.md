# Agent Notes

You are in the Loopcraft workshop project.

Build the local issue-progress loop in this folder. Do not manage anything outside this project folder.

## Lesson boundary

Lessons are the path. Issue events are the project data we are building toward.

Start with Lesson 01 (run `/loop-lesson-01` in Pi, or read `web/static/lessons/01-tour-vision-repo/prompt.txt`; full lesson at <https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/01-tour-vision-repo/>): create `VISION.md` and the first repo boundaries only. Lesson 02 creates the local issue-event queue and first checks. Do not jump ahead to Lakebed code, dispatch, schedulers, GitHub, Linear, or background workers.

## Standing habits

- Inspect the repo before editing: `git status --short` and `git log --oneline --max-count=5`.
- Keep changes small and visible.
- Use the local `loopcraft-ta` skill when available.
- Explain the evidence before claiming progress.
- Run the checks that exist. If no checks exist yet, say that plainly.
- See `docs/tooling.md` for the toolchain and guardrail rationale (you build these checks in Lesson 02).
- Commit useful checkpoints.

## Host/container visibility

Default to the host URL model before debugging UI code. The container serves Lakebed and the bridge; Docker publishes ports onto the host; browsers, SSH forwarding, Tailnet, and public tunnels connect to the host.

`localhost` depends on where it is used: inside Docker it is the container, in an SSH shell it is the Docker host, in your laptop browser it is your laptop, and on a phone it is the phone.

For a blank or unreachable UI, first check `docs/host-container-urls.md` and run `bash scripts/workshop-ui-url.sh` from the host. Do not run Tailnet/Funnel commands inside Docker. Do not patch Lakebed until the host-published `3000` UI and `8787` bridge path has been checked.

## Boundaries

- Keep `VISION.md` human-owned. Ask before changing strategic intent once it exists.
- Keep this file short and operational.
- Do not put planning notes or old-run archaeology here.
- Do not add external auth or services until the local loop proves the shape.
