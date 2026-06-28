# Lesson 01: Prompt the loop contract into existence

## Challenge

Create the first product intent and issue-event queue for a local issue-progress loop.

The goal is not to build the whole loop yet. The goal is to define what the loop is allowed to see, when it may progress work, when it must stop, and what evidence it should leave.

## Starter prompt

Paste or use `/loop-lesson-01` in Pi:

```txt
We are building a local issue-progress loop.

Lesson 01: prompt the loop contract into existence.

Do the next small pass only: clarify the loop, write the first product intent, and create the first local issue-event queue with ready / approval-required / input-required gates. Keep it local, leave receipts, and explain the evidence before moving on.
```

## Build / operate

Expected files by the end of this lesson:

- `VISION.md` — what this loop is for, safe boundaries, stop points, and non-goals
- `issues.jsonl` or `data/issue-events.jsonl` — the first append-only issue events
- optionally `docs/decisions/0001-loop-contract.md` — only if the design needs a short decision note

## Observe

Open the issue-event file and identify at least one issue in each class:

- ready or pre-approved
- approval required
- input required

## Discuss

Before autonomy, we need a contract: owner, inputs, gates, stop reasons, and receipts. This is the foundation that later lets the loop build itself without pretending the model can just “be careful.”

## Checkpoint

You can answer:

- What is the loop allowed to change?
- What must stop for a human?
- Where are the first issue events recorded?
- What evidence did Pi leave for this pass?

## Small drill

Read one issue event out loud as a state transition:

```txt
This event says <issue> moved/started as <state> because <reason/policy>.
```

## Fade for next lesson

Next lesson removes some prompt support. You will ask Pi to turn this issue-event shape into a typed, testable loop check.

## Run-06 scar

Run 06 worked because Joel named the gates early: pre-approved work may progress; ambiguous or risky work stops. The issue queue became the system’s own substrate instead of a TODO list on the side.
