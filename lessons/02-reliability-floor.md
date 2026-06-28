# Lesson 02: Build the reliability floor

## Challenge

Turn the vision from Lesson 01 into the first issue-event queue and a typed, testable local loop check.

## Starter prompt

```txt
Use VISION.md from Lesson 01. Create the first local issue-event queue, then build the smallest reliability floor: package scripts, strict TypeScript, Effect schemas for issue events, an explicit loop-check classifier, tests, and a receipt for one check run. Keep it local and explain the evidence.
```

## Build / operate

Expected additions:

- `issues.jsonl` or `data/issue-events.jsonl` with ready / approval-required / input-required events
- `package.json` upgraded with product scripts for typecheck, lint, format, test, and check, while preserving the workshop scripts
- strict TypeScript config using the prepared source guidance
- fast lint/format guardrails
- `src/issue-events.ts`
- `src/loop-check.ts`
- one or two tests that prove external behavior
- first receipt/run-log output

## Observe

Run the checks that now exist. Then run the loop check against the local issue events and inspect the receipt.

## Discuss

This is the down-for-reliability move: fast strict guardrails, typed boundaries, explicit state, and evidence before leverage.

## Checkpoint

The loop can classify work as ready, approval-required, or input-required without editing product code or calling an external tracker.

## Small drill

For one receipt, identify inputs read, stop reason, and next allowed action.

## Fade for next lesson

Next lesson keeps the same core and adds a provider/projection surface without changing the domain model.

## Run-06 scar

Joel stopped early to ask whether the Effect pattern was idiomatic. That question matters because this layer sets the code style that every later agent follows.
