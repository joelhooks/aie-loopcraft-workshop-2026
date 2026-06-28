# Lesson 05: Make dispatch safe

## Challenge

Progress one ready issue through policy, claim, dry-run dispatch, and a receipt before any implementation agent edits code.

## Starter prompt

```txt
Use the ready issue from the loop check. Add the smallest safe dispatch seam: policy decides eligibility, the loop claims the issue first, dispatch runs in dry-run or memory mode, and the result writes a receipt. Do not allow hidden implementation edits yet.
```

## Build / operate

Expected work:

- policy classification for work that may progress
- claim event before dispatch
- runtime adapter seam
- dry-run or memory runtime
- dispatch receipt

## Observe

Inspect the issue event stream before and after claim. Then inspect the dispatch receipt.

## Discuss

“Just run an agent” is the trap. Ownership and policy come first. Dispatch is leverage only when it leaves evidence.

## Checkpoint

One ready issue has a claim and dispatch receipt, with no hidden mutation.

## Small drill

For a candidate issue, say whether it is claimable and why.

## Fade for next lesson

Next lesson lets a bounded maintenance helper write issue events.

## Run-06 scar

Approval-required work led to the branch/worktree thought: present work and next steps before asking the operator to approve progression.
