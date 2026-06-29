# 05 · Claim one ready issue without changing files

## Challenge

Pick one ready issue, write a claim, run a dry-run, and prove no product files changed.

## What we're trying to build

This is where people get sloppy. A ready issue is not permission to let an unsupervised agent change files in the repo.

First, the script must check that the issue is ready, write the claim, run only a dry-run or memory-mode step, and save evidence. Only after that can a future lesson decide what real work should look like.

## What you should see

- A rule check says whether an issue may be claimed and why.
- A claim event is written before any work attempt.
- The run stays in dry-run or memory mode and does not change product files.
- The receipt links the rule decision, claim event, dry-run result, refused actions, and next action.

## Starter prompt

```txt
Use one ready issue from the local check. Add rules that say yes/no for the selected issue, write a claim event before any work attempt, run only in dry-run or memory mode, and save a receipt that links the rule decision, claim event, dry-run result, refused actions, and next action. Prove zero product files changed. Do not call an LLM API, GitHub API, or any network service yet.
```

## Build / operate

Add the first safe work path:

- rules that say yes/no for the selected issue;
- a claim event;
- dry-run or memory-mode output;
- a receipt that shows what happened and what did not happen.

Keep the run small enough to inspect.

## Step checklist

1. **Choose one ready issue.** Use the Lesson 02/03 check output. Do not pick approval-required or input-required work.
2. **Add rules and claim.** Only `ready` issues can be claimed. `approval-required` and `input-required` issues must say no and explain why. Record a claim event before the dry-run can start.
3. **Run dry-run only.** The result may describe intended work, not edit product files.
4. **Inspect the trail.** Open the events file before and after the claim, then compare the new claim line with the receipt.

## Observe

Inspect the events file before and after the claim. Then inspect the receipt and confirm no product files changed.

## Receipt template

- `issueId`: ready issue selected
- `decision`: claim allowed / refused plus reason
- `claimEvent`: event id or file offset
- `mode`: dry-run or memory
- `changedFiles`: should be none
- `receiptPath`: saved receipt
- `nextAllowedAction`: decision after dry-run

## Discuss

“Just run an agent” is the trap. Start with ownership: which issue may be claimed, what mode may run, what must be refused, and what receipt proves it.

## Checkpoint

One ready issue has a yes/no decision, claim event, dry-run result, and receipt with no hidden file changes.

## Small drill

For a candidate issue, say whether it can be claimed, what would be refused, and what evidence you need before real work.

## Next lesson

Let a cleanup helper draft issue events, but still do not let it change product files.

## Why this step exists

This step separates decision from execution. The checker earns the right to ask for work by proving it can refuse work first.
