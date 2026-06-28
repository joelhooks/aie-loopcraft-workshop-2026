# Lesson 01: Tour the rig, define the vision, set up the repo

## Challenge

Start by understanding the prepared workshop rig instead of pretending this repo is empty.

Then run a short `grill-with-docs` session to define what this issue-progress loop is for, what it may change, when it must stop, and what repo setup is needed before product behavior begins.

The goal is not to build the loop yet. The goal is to set the course and leave a repo baseline the rest of the lessons can trust.

## Starter prompt

Paste or use `/loop-lesson-01` in Pi:

```txt
/skill:grill-with-docs

Tour this prepared Loopcraft repo with me before we build product behavior.

Inspect README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, .pi/extensions/loop-workshop.ts, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time to define the product vision, operator boundaries, stop rules, and first repo setup choices. Write the decisions into VISION.md. Update AGENTS.md or README.md only when a repo rule or command is clear. Create only the minimal repo setup needed for the next lesson. Do not build the loop yet.
```

## Build / operate

Expected files by the end of this lesson:

- `VISION.md` — product intent, safe boundaries, stop points, and non-goals
- `package.json` — minimal project identity and package manager metadata only; guardrail scripts come next
- `AGENTS.md` — updated only if the grill session produces a clear operating rule
- optionally `docs/decisions/0001-loop-vision.md` — only if there is a decision that would surprise a future reader

## Tour path

Before asking Pi to edit, point at the prepared surfaces:

- `README.md` — what is already prepared and what is not built yet
- `WORKSHOP_RIG.md` — Pi, Herdr, Lakebed, persistence, and intentionally missing pieces
- `lessons/` — the rails for this hour
- `.pi/extensions/loop-workshop.ts` — helper commands for the operator pane
- `agents/skills/loopcraft-ta` — local guide context
- `agents/skills/grill-with-docs` — decision-grilling skill for vision and repo rules
- `surface/lakebed` — operator projection shell

## Observe

After the pass, inspect:

- what `VISION.md` says the loop is for;
- what `VISION.md` says the loop must not do;
- what repo setup exists and what is intentionally deferred;
- whether `AGENTS.md` contains only operational rules, not lesson notes.

## Discuss

The first move is orientation plus decision capture. We are not asking an agent to improvise a product from vibes. We tour the surfaces, grill the intent, write down the boundaries, and set up only enough repo shape for the reliability lesson.

## Checkpoint

You can answer:

- What are we building?
- What is the loop allowed to change?
- What must stop for a human?
- What repo setup exists now?
- What setup is deliberately waiting for Lesson 02?

## Small drill

Read one sentence from `VISION.md` and classify it:

```txt
This sentence is product intent / safety boundary / non-goal / next setup need.
```

## Fade for next lesson

Next lesson removes the tour support. You will ask Pi to turn the vision into a typed, testable local issue-event check with fast guardrails.

## Run-06 scar

Run 06 worked because the gates were named before autonomy got fancy: pre-approved work may progress; ambiguous or risky work stops. Run 07 keeps that scar, but starts with a guided tour and `grill-with-docs` so the repo has a clear course before implementation begins.
