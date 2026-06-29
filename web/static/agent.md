# Start guide for coding and browser agents

You are helping someone run the AI Engineer Loopcraft Workshop 2026 from the public site.

Your job is to keep them moving through the public workshop path without inventing private setup, skipping visible steps, or building future lessons early.

## First move

Read these public instructions first. These are real served paths on this site:

1. `/llms.txt` — short machine-readable index of this site
2. `/AGENTS.md` — public repo rules for agents
3. `/glossary/` — plain-language terms linked back to the lessons
4. `/lessons/01-tour-vision-repo/` — first lesson page
5. `/lessons/01-tour-vision-repo/prompt.txt` — pasteable Lesson 01 starter prompt

Setup, fallback paths, and troubleshooting live in the repo at `docs/setup.md`
(viewable at `https://github.com/joelhooks/aie-loopcraft-workshop-2026/blob/main/docs/setup.md`).
There is no `/docs/` route on this site, so read setup from the repo, not a guessed URL.

If you are working in a cloned repo, read these files too:

- `README.md`
- `docs/setup.md`
- `WORKSHOP_RIG.md` — what is prepared and intentionally unfinished
- `lessons/01-tour-vision-repo.md`
- `lessons/02-reliability-floor.md`
- `agents/skills/loopcraft-ta/SKILL.md` if present
- `agents/skills/grill-with-docs/SKILL.md` if present

## Clone and run the workshop computer

Use Docker as the main path:

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm run workshop
```

What this does:

- starts Herdr inside the Docker container;
- opens the workshop workspace at `/workspace` inside the container;
- leaves Pi for the person running the workshop to start in a Herdr pane;
- does not require host Herdr.

When Herdr opens, start `pi` in a pane. If Pi asks for auth, the person running the workshop signs in inside the container. Then use `/loop-lesson-01` if available, or paste the Lesson 01 prompt below.

## Lesson 01 prompt fallback

Use this if `/loop-lesson-01` or the `grill-with-docs` skill is unavailable. If a skill command is unavailable, behave manually: ask one question at a time, capture the answers, and write only the agreed files.

```txt
/skill:grill-with-docs

Help me define a small local issue-progress loop before we write code.

Read README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time. Capture what the loop should do, what it may change, what needs human approval, and what we are not building yet. Write the answers into VISION.md. Update AGENTS.md or README.md only if we agree on a clear repo rule. Do not create issue events, checks, Lakebed code, dispatch, or product code yet.
```

This prompt matches the Lesson 01 page and `lessons/01-tour-vision-repo.md` in the repo. The same text is served at `/lessons/01-tour-vision-repo/prompt.txt` if you would rather fetch than paste.

## Allowed changes by lesson

### Lesson 01

Allowed:

- create or update `VISION.md`;
- update `AGENTS.md` only for a clear repo rule the person running the workshop agreed to;
- update `README.md` only for a clear command someone should run or a repo rule worth keeping;
- optionally add `docs/decisions/0001-loop-vision.md` if the decision would surprise a future reader.

Stop before:

- creating issue events;
- adding checks, schemas, tests, or product code;
- wiring Lakebed;
- adding background workers, schedulers, dispatch, or external issue APIs.

Evidence to leave:

- what the loop is for;
- what it may change;
- what requires approval or more input;
- what is out of scope;
- what waits until Lesson 02.

### Lesson 02

Allowed:

- add a local issue-event file such as `issues.jsonl` or `data/issue-events.jsonl`;
- add product scripts while preserving workshop scripts;
- add strict TypeScript config, lint/format/test/check commands, schemas, a small classifier, tests, and one receipt from a real check run.

Stop before:

- external tracker APIs or auth;
- scheduling or dispatch;
- Lakebed projection work from Lesson 03;
- vague checks that only print `looks good`.

Evidence to leave:

- exact commands run;
- event file read;
- count and classification of events;
- ready, approval-required, and input-required items;
- stop reasons;
- next allowed action;
- refused action.

## General stop rules

- Do not use private machine paths, hidden local setup, raw transcripts, or secrets.
- Do not claim the public site exposes MCP, OAuth, or an API unless the checked public route actually exists.
- Do not skip Docker setup by assuming host Herdr, host Pi, or host auth.
- Do not edit future lessons early.
- Do not convert the workshop into a finished template. Guardrails should be added step by step.
- If a command fails because auth is missing, stop and ask the person running the workshop to sign in. Do not paste tokens into files.

## Focused checks

Run the checks the current lesson actually introduces, from the repo root:

- Lesson 01 adds no commands. Verify by inspection: `VISION.md` exists and no issue events, checks, or product code were created.
- Lesson 02 adds the first product checks. Run the typecheck, test, and loop-check scripts that lesson tells you to add, then inspect the receipt.

`pnpm run web:check` checks the published workshop site only. Run it only if you edited files under `web/`, not as part of normal lesson work.

Report back with:

- files changed;
- commands run and whether they passed;
- evidence produced;
- blockers or risks;
- whether you stopped before future-lesson work.
