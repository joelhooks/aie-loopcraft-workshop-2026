---
name: grill-with-docs
description: Interview the plan one sharp question at a time, inspect local docs before asking, and save clear decisions back into the right repo docs.
disable-model-invocation: true
---

# Grill With Docs

Use this skill when the project needs clearer intent before product behavior or architecture changes.

This is a local adaptation of Matt Pocock's `grill-me` pattern from `mattpocock/skills`: be relentless, ask one good question at a time, and help the user sharpen the plan instead of guessing.

## Before asking

Inspect the repo first. Prefer these files when they exist:

- `VISION.md`
- `AGENTS.md`
- `README.md`
- local docs under `docs/`
- nearby issue, plan, or decision notes

If a file can answer the question, read it instead of asking the user.

## How to run the grill

1. State the current assumption in one sentence.
2. Ask exactly one question.
3. Include a recommended answer, clearly labeled, so the user can accept, reject, or edit it.
4. Wait for the user's answer before asking the next question.
5. When a decision becomes clear, save it in the right place:
   - `VISION.md` for product intent, boundaries, stop points, and non-goals.
   - `AGENTS.md` for operational rules future agents must follow.
   - `README.md` or `docs/` for user-facing setup or usage notes.

Keep the skill small. Do not create PRDs, issue workflows, ADR systems, or implementation scaffolding unless the user explicitly asks for that next.
