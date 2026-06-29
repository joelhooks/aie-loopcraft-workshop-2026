# 06 · Let cleanup propose one follow-up

## Challenge

Let the checker propose one maintenance event, then prove it stops when the repo or queue is not safe to touch.

## What we're trying to build

This cleanup command is not a tiny product agent. Its job is to look for a short list of maintenance signals and create at most one issue event.

If the repo is dirty, the checker is running, or a matching follow-up already exists, it should print the reason and exit.

## What you should see

- A dry-run cleanup command prints the issue event it would write without changing files.
- Apply mode can write one fully formed maintenance event when every stop check passes.
- Dirty repo, duplicate follow-up, running loop process, approval-required work, and input-required work stop the command visibly.
- `receipts/gardener-dry-run.json` or the agreed receipt path records what it saw, what it proposed, and why it stopped.

## Starter prompt

```txt
Add a cleanup command that can propose at most one maintenance issue event. Start with explicit allowed maintenance types and printed stop messages. Dry-run must show the event it would write; apply may write one fully formed event only when every stop check passes. Refuse to run when jj status is dirty, the loop process is running, the queue already has a matching follow-up, an event needs approval, or an event needs more input. Save a receipt with inspected files, proposed event id, written event id if any, and the printed stop message.
```

## Build / operate

Add a maintenance helper with hard stops:

- dry-run and apply modes;
- exact stop messages;
- duplicate prevention;
- one saved receipt.

## Step checklist

1. **Define allowed maintenance.** Name the specific facts the cleanup command may turn into events. Everything else is out of scope.
2. **Add stop checks first.** Refuse to run when `jj status` is not clean, the loop process is running, a matching follow-up already exists, an event is waiting for approval, an event asks for more input, or changed files are outside the allowed paths.
3. **Run dry-run before apply.** Dry-run prints the event it would write. Apply writes only one safe event and records a receipt.
4. **Prove duplicate protection.** Run the command twice and show the second run refuses to recreate the same follow-up.

## Observe

Run dry-run, one allowed apply, and a duplicate second run. Inspect the event it would write or did write and the exact message it printed when it stopped.

## Receipt template

- `mode`: dry-run or apply
- `inputsSeen`: files/events inspected
- `proposedEvents`: event ids or summaries
- `writtenEvents`: event ids, if any
- `stopMessages`: exact messages printed when the command refused to run
- `duplicateCheck`: result of second run
- `nextAction`: approve, fix input, or leave it alone

## Discuss

This command can create work, so stopping is part of the feature. A refused run should still leave useful evidence.

## Checkpoint

The cleanup command can propose or write one useful maintenance event and can explain why it refused the next one.

## Small drill

Read one printed stop message and say what you would do next: approve, fix the input, or leave it alone.

## Next lesson

Ask a reviewer for read-only help instead of expanding cleanup into a catch-all agent.

## Why this step exists

This step keeps cleanup from touching the repo freely. It has one job, a short allowed-file list, hard stop checks, and a saved receipt every time it runs.
