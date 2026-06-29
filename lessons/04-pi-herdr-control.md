# 04 · See and control the check from Pi and Herdr

## Challenge

Add a visible way to ask for status, run the local check, and see what happened.

## What we're trying to build

The checker now has local events, tests, receipts, and a Lakebed view. The next problem is operation: can you see whether the check is running, stale, waiting, or done?

This lesson keeps the status path small and visible before any real claim step exists.

## What you should see

- A named Herdr pane runs the status process, watcher, or check script.
- A status command reports `state`, `checkedAt`, `lastCommand`, `lastReceipt`, and `waitingReason`.
- Pi exposes a small command or prompt that can inspect status and run the local check.
- Pi output, Herdr output, Lakebed state, and the latest receipt name the same issue and latest check.

## Starter prompt

```txt
Add the smallest local status path for the checker. Keep Herdr visible with a Pi pane and a status/check pane. Add status output with state, checkedAt, lastCommand, lastReceipt, and waitingReason. Add a Pi command or prompt that can inspect status and run the local check. Prove Pi output, Herdr output, Lakebed state, and the receipt name the same issue and latest check. Do not add claim commands or background scheduling yet.
```

## Build / operate

Replace hidden terminal state with visible status:

- a named Herdr pane;
- a local status/check command;
- Pi controls;
- receipts that point back to the same issue facts.

## Step checklist

1. **Make state visible.** Start with the status process, watcher, or check script. Name the pane and keep logs visible in Herdr.
2. **Add stable status output.** Return `state`, `checkedAt`, `lastCommand`, `lastReceipt`, and `waitingReason` as JSON or a stable text shape.
3. **Wire Pi controls.** Add the smallest Pi command or prompt path for status and check-now. Do not add claim commands yet.
4. **Compare the outputs.** Run one check from Pi, watch Herdr output, inspect the receipt, and compare Lakebed state.

## Observe

Run a check from Pi and watch the side pane. Then inspect the latest status, Lakebed view, and receipt to make sure they agree.

## Receipt template

- `herdrPane`: pane name and command
- `statusCommand`: command and output shape
- `piCommand`: command or prompt used
- `latestReceipt`: path inspected
- `outputAgreement`: Pi / Herdr / Lakebed / receipt comparison
- `waitingReason`: what blocks movement, if anything

## Discuss

Before an agent runs anything on its own, you need one place to ask: is it running, stale, waiting, or done? Pi gives the request path; Herdr keeps the process visible; receipts keep both honest.

## Checkpoint

You can start, inspect, and rerun the local check from Pi while Herdr shows what happened and the latest receipt proves it.

## Small drill

Pretend the status is stale. Name the first three places you inspect before running anything else.

## Next lesson

Run one ready issue through this status/check path without changing product files.

## Why this step exists

This step turns a pile of commands into something you can operate. If the process is invisible, you will miss when it is stale, stuck, or waiting for input.
