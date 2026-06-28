# Lesson 06: Add a bounded gardener

## Challenge

Let the loop propose or apply maintenance events, then prove it stops visibly when it should.

## Starter prompt

```txt
Add a bounded gardener pass. It may propose or apply fully formed issue events, but it must stop for ready work, approval-required work, input-required work, active runtime, duplicate follow-up, or dirty state. Write a receipt that explains what happened.
```

## Build / operate

Expected work:

- gardener dry-run
- controlled apply path
- fully formed issue events
- stop reasons
- duplicate prevention
- maintenance receipt or snapshot

## Observe

Run the gardener once in dry-run and once in the allowed happy path. Inspect the event it would write or did write.

## Discuss

Maintenance is agentic behavior. It is safe only when it writes explicit events and stops visibly.

## Checkpoint

The gardener can create/propose one useful event and can also explain why it stopped.

## Small drill

Read a gardener stop reason and name the operator’s next action.

## Fade for next lesson

Next lesson asks a specialist for read-only help instead of expanding the gardener.

## Run-06 scar

Run 06 hit two perfect scars: the agent dirtied its own worktree, and the gardener kept recreating an obsolete follow-up. These are why stop reasons and duplicate checks exist.
