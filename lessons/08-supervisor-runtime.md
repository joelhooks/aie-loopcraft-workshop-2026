# Lesson 08: Shadow the supervisor runtime

## Challenge

Move loop decision ownership from bridge glue toward an explicit supervisor/actor runtime, but keep it in shadow mode first.

## Starter prompt

```txt
Add the smallest supervisor runtime shadow. The bridge should still drive the visible loop, but a supervisor actor should make the same decision in parallel and write a comparison receipt. Include one recovery drill.
```

## Build / operate

Expected work:

- feature flag or mode: off / shadow / on
- supervisor decision function or actor
- per-issue lifecycle shape
- comparison receipt between bridge decision and supervisor decision
- one recovery drill test

## Observe

Run the same input through the bridge path and supervisor path. Inspect whether the decisions agree.

## Discuss

The top of the leverage arrow is not magic. It is the same facts, guards, events, and receipts with better lifecycle ownership.

## Checkpoint

A shadow receipt proves the supervisor agrees with the bridge on one happy-path decision, and a recovery drill proves the shape survives restart or stale state.

## Small drill

For one issue, name which actor should own the next decision.

## Fade after the hour

After the workshop, the follow-up path can deepen worktrees, launchd scheduling, provider adapters, and real specialist dispatch.

## Run-06 scar

Run 06 eventually asked whether dynamic execution machines existed, then worked ISS-059 through ISS-068 one by one. The lesson version only shows the seam and receipt.
