# 08 · Run the supervisor beside the current check

## Challenge

Run a small supervisor beside the current check. It should say the next state and why, but the current code still makes the real decision.

## What we're trying to build

By now the checker can read event files, build the issue summary, add page controls, preview work, clean up old receipts, and ask for review.

The last move is to show which code decides the next state. First the supervisor only compares answers. Later, after the receipts match, it can make the real choice.

## What you should see

- A small state machine, XState actor, or one small function returns the next issue state.
- The supervisor decision runs beside the current check/write path, but does not take over.
- A comparison receipt shows where the two paths agree or disagree.
- One recovery drill proves stale/running/failed state is handled deliberately.

## Starter prompt

```txt
Run the supervisor beside the current local check and GitHub-write code. Save a receipt that shows the input, the current code's answer, the supervisor's answer, whether they match, and one stale/failed/interrupted recovery case. Keep the current code in charge; the supervisor must not write to GitHub yet.
```

## Build / operate

Add the supervisor without handing it the keys:

- `off` / `shadow` / `on` mode;
- a state machine, XState actor, or one small function that returns the next state;
- comparison receipt;
- one recovery drill.

## Step checklist

1. **Name the states.** Model states such as idle, checking, waiting-for-input, waiting-for-approval, claimed, dispatched, failed, and stopped.
2. **Run beside the current path.** Keep the current path in charge. The supervisor makes the same decision in parallel and records its answer.
3. **Compare decisions.** Write a receipt that includes input event, current decision, supervisor decision, agreement, and reason.
4. **Drill recovery.** Simulate stale, failed, or interrupted work and show the supervisor's next state.

## Observe

Run the same input through the current path and the supervisor path. Inspect whether decisions agree and what the recovery drill reports.

## Receipt template

- `mode`: off / shadow / on
- `inputEvent`: event or issue inspected
- `currentDecision`: current path result
- `supervisorDecision`: supervisor result
- `agreement`: yes / no plus reason
- `recoveryDrill`: scenario and result
- `nextAction`: keep comparing, fix mismatch, or promote later

## Discuss

There is no new magic here: use the same event, checks, decision, and receipt. The only new thing is a clear owner for the next state.

## Checkpoint

A comparison receipt proves the supervisor agrees on one normal decision, and a recovery drill handles one bad state on purpose.

## Small drill

For one issue, name the current state, the event that moves it, and which code owns the next decision.

## Next step

Do not add parallel worktrees, timers, provider switching, or real reviewer launches until the comparison receipts keep matching.

## Why this step exists

This step makes the checker safer to grow: every next state, stop, recovery, and receipt is visible.
