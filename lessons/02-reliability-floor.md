# Lesson 02: Make bad input fail loudly

## Challenge

Turn `VISION.md` into one local event file and one check command you can trust.

You are starting with a vision document and a repo that can explain the checker, but cannot prove much yet. By the end of this lesson, the repo should have local issue events, a strict check command, tests, and a receipt from one real run.

This matters because agents get slippery fast when inputs, decisions, stop messages, and next actions are only implied. We want the command to show what it read, what it decided, why it stopped, and what is safe to do next.

## Starter prompt

```txt
Use VISION.md from Lesson 01. Create issues.jsonl or data/issue-events.jsonl with ready, approval-required, and input-required examples. Add the smallest local check command that validates every row, fails loudly on bad input, prints the file read, event count, classifications, stop reasons, next allowed action, and refused action. Add tests, run the commands from the repo root, and save one receipt from real output. Keep it local; do not add auth, external issue APIs, GitHub writes, schedulers, or background workers yet.
```

## Build / operate

Work in small passes. Do not turn this into the whole product. The goal is one boring local path that can be run, checked, and trusted.

Start with the local issue events. Create either `issues.jsonl` or `data/issue-events.jsonl` and include examples for the first three states the checker must recognize:

- ready to work;
- approval required;
- input required.

Then add the smallest code and command path that can read those events and classify them. Expect to add or update:

- `package.json` product scripts for typecheck, lint, format, test, and check, while preserving the workshop start scripts;
- a strict TypeScript config;
- fast lint/format checks that catch messy edits before a reviewer has to read them;
- `src/issue-events.ts` for the event schema and parser;
- `src/loop-check.ts` for the check command behavior;
- one or two tests that prove the outside behavior, not every internal branch;
- one receipt or run log from an actual check.

When you add a check, name why it exists. The point is not “because this repo likes tools.” The point is speed plus strictness: catch sloppy edits before the agent acts on bad or unclear input.

Common roadblocks:

- Do not replace the workshop scripts while adding product scripts.
- Keep the tracker local for now. No external issue API, auth, or scheduler yet.
- If the schema design gets fuzzy, stop and inspect the Effect source mirror before inventing a pattern.
- If a check only prints “looks good,” make it more useful. A future reader should see the inputs, classification, stop message, and next allowed action.

## Observe

Run the commands you just added. At minimum, prove that typecheck, tests, and the local issue check all run from the repo root.

Then inspect the check receipt. It should answer plain questions:

- Which event file did the command read?
- How many events did it classify?
- Which items are ready, waiting for approval, or missing input?
- What should happen next?
- What should the command refuse to do without more information?

If the receipt does not help you answer those questions quickly, tighten the output before moving on.

## Discuss

Before the agent does more work, make it read one local file, validate each row, print the decision, and stop when approval or missing input blocks the next step.

Good signs:

- bad input fails loudly;
- approval-required work does not get treated as ready;
- missing input produces a clear stop message;
- the receipt is useful to a human, not just a machine.

## Checkpoint

You are done with this lesson when a fresh reader can run the local check and understand the result without asking you what happened.

The checker should classify work as ready, approval-required, or input-required without editing product code and without calling an external tracker. The repo should also have enough checks that the next agent pass has less room to wander.

## Small drill

Pick one receipt and explain it out loud:

1. What input was read?
2. What decision did the checker make?
3. What stop message, if any, did it report?
4. What is the next allowed action?
5. What action is not allowed yet?

If any answer is vague, update the check output or receipt format until it is clear.

## What this unlocks next

Next lesson shows the same local events in Lakebed. Keep the JSONL events as the evidence; Lakebed is only the view.

## Why this step exists

A checker that cannot classify its first local events is not ready to claim work, run on a timer, call outside services, or ask another agent for help. Keep it small until the basic promise is true: read the facts, make the decision, leave evidence, and stop when it should.
