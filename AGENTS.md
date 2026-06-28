# Agent Notes

You are in the Loopcraft 07 learner rig.

Build the local issue-progress loop in this folder. Do not manage the course, parent repo, slides, or teacher Brain.

## Current rule

Lessons are the rails. Issues are the product substrate we are building toward.

Start with Lesson 01 in `lessons/01-loop-contract.md`: create the loop contract and first local issue-event queue. Do not jump ahead to dispatch, schedulers, GitHub, Linear, or background workers.

## Standing habits

- Inspect the repo before editing: `git status --short` and `git log --oneline --max-count=5`.
- Keep changes small and visible.
- Use the local `loopcraft-ta` skill when available.
- Explain the evidence before claiming progress.
- Run the checks that exist. If no checks exist yet, say that plainly.
- Commit useful checkpoints.

## Prepared context

- Source mirrors are already in `.agent_sources`; do not spend workshop time setting up subtrees.
- Matt Pocock skills are already available through `.agents/skills` and `.claude/skills`.
- Pi has a small helper extension in `.pi/extensions/loop-workshop.ts`.
- Lakebed has a capsule shell in `surface/lakebed`.

## Boundaries

- Keep `VISION.md` operator-owned. Ask before changing strategic intent once it exists.
- Keep this file short and operational.
- Do not put lesson planning, teacher notes, or run-06 archaeology here.
- Do not add external auth or services until the local loop proves the shape.
