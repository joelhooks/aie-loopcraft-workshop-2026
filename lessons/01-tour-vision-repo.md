# Lesson 01: Tour the repo and write the rules

## Challenge

Tell Pi what this project is allowed to do before it writes code.

We are building a local issue checker. It will read a few issue events, decide what is ready, stop when approval or input is missing, and write down what happened. This lesson names the goal, the allowed files, and the stop points before any product code exists.

The goal is not to build the checker yet. The goal is to leave `VISION.md` and any repo rule worth keeping.

## What we're trying to build

The first version should answer three plain questions:

- which issue is ready;
- which issue needs approval;
- which issue needs more input.

Later lessons add commands, a Lakebed view, Pi/Herdr status, and safe claim steps. Right now, write the human judgment that tells the checker when to move and when to stop.

## Starter prompt

Paste this into Pi, or use `/loop-lesson-01` if it is available.

If `/skill:grill-with-docs` is unavailable, copy the prompt and do the same thing manually: inspect first, ask one question at a time, and save the decisions.

```txt
/skill:grill-with-docs

Help me define a small local issue checker before we write code.

Read README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time. Capture what the checker should do, which files it may edit, what needs approval, what is out of scope, and when it must stop. Write the answers into VISION.md. Update AGENTS.md or README.md only if we agree on a clear repo rule. Do not create issue events, checks, UI code, background workers, external tracker setup, or product code yet. End by reporting the VISION.md sections changed and confirming no event, check, UI, or product files were created.
```

## Build / operate

Expected files by the end of this lesson:

- `VISION.md` — what the checker is for, which files it may edit, what needs approval, and non-goals
- `AGENTS.md` — updated only if the question session produces a clear rule for future agents
- `README.md` — updated only if a clear command or repo rule becomes worth keeping

Do not create issue events, check commands, Lakebed code, claim commands, or product code yet.

## Tour path

Before asking Pi to edit, point at the files it should understand:

- `README.md` — current project promise and first-run notes
- `AGENTS.md` — rules the agent must follow
- `WORKSHOP_RIG.md` — starter files and intentionally unfinished pieces
- `lessons/` — the steps for this project
- `agents/skills/loopcraft-ta` — local guide context
- `agents/skills/grill-with-docs` — the skill that asks questions before writing
- `surface/lakebed` — where issue state will become visible later

## Observe

After the pass, inspect:

- what `VISION.md` says the checker is for;
- which files `VISION.md` says the checker may edit;
- what requires approval or more input;
- what is out of scope;
- whether `AGENTS.md` and `README.md` changes are rules or commands, not lesson notes.

## Discuss

This step gives Pi the goal and file boundaries before it edits. The checker will only be useful if it knows when to stop.

## Checkpoint

You can answer:

- What are we building?
- Which files can the checker edit?
- What requires human approval?
- What is not in scope?
- What waits until Lesson 02?

## Small drill

Read one sentence from `VISION.md` and classify it:

```txt
This sentence is goal / allowed file / approval point / non-goal / stop rule.
```

## Next lesson

Next lesson turns the vision into a local event file, a check command, tests, and one saved receipt.

## Why this step exists

Agents behave better when the rules are written down before implementation starts. Name the approvals and stop points first, then add code.
