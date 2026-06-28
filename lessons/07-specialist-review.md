# Lesson 07: Add specialist review carefully

## Challenge

Ask a small specialist agent for help without giving a generic agent swarm the keys.

## Starter prompt

```txt
Add a loop-owned specialist review seam. Define one non-mutating scout/reviewer role, produce a work packet from issue state, run or simulate the specialist, and save the artifact. Do not let the specialist mutate product state by default.
```

## Build / operate

Expected work:

- loop-owned specialist role definition
- work packet shape
- read-only scout/reviewer artifact
- runtime seam that can later use pi-subagents or another provider
- receipt linking issue, packet, and artifact

## Observe

Inspect the specialist artifact and compare it to the issue acceptance criteria.

## Discuss

Multi-agent review is leverage only when the loop owns roles, artifacts, and stop rules.

## Checkpoint

One specialist artifact exists, and it did not mutate product state.

## Small drill

Classify a specialist request as scout, reviewer, implementer, or “do not run.”

## Fade for next lesson

Next lesson moves decision ownership into an explicit supervisor runtime.

## Run-06 scar

Joel preferred small task-oriented specialists over an omnibus super-agent. The specialist is useful because it is narrow.
