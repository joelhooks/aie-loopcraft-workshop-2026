# 07 · Ask for review without handing over the repo

## Challenge

Ask a small reviewer for help without letting another agent edit the app files.

## What we're trying to build

A reviewer is useful when your main script decides what to ask, writes the input file, saves the review note, and waits for you before changing anything.

It is dangerous when it becomes a second implementation path. This lesson keeps the reviewer read-only until you approve what happens next.

## What you should see

- A role contract says what the reviewer may read, produce, and refuse.
- An input file is generated from issue state and acceptance criteria.
- The reviewer run or saved fake output writes a review note, not product changes.
- A receipt links issue id, input file path, review output path, model/tool used, changed files, and next decision.

## Starter prompt

```txt
Add one read-only reviewer path controlled by the main script. Create a small input file from the issue and acceptance criteria, run or fake the reviewer, save its output, and write a receipt that links the issue, input file, output file, changed files, and next decision. By default, the reviewer must not edit product files.
```

## Build / operate

Add a read-only review path:

- role contract;
- input file shape;
- saved review output;
- a command that runs the reviewer or a saved fake reviewer output for this step;
- receipt linking issue, input file, review output, changed files, and next decision.

## Step checklist

1. **Pick one role.** Use scout or reviewer first. Do not add implementer as the default role.
2. **Generate an input file.** Create a small file from issue state, relevant files, constraints, and acceptance criteria.
3. **Run or fake read-only help.** Save the review output under a predictable path. Do not let it edit product files.
4. **Review before action.** Compare the review output to the issue and record what you can approve, reject, or ask next.

## Observe

Inspect the review output and compare it to the issue acceptance criteria. Confirm product files did not change.

## Receipt template

- `issueId`: issue reviewed
- `role`: scout or reviewer
- `inputPath`: reviewer input file saved
- `outputPath`: review output saved
- `changedFiles`: should be none
- `decisionNeeded`: approve / reject / ask more
- `nextAllowedAction`: what may happen after review

## Discuss

A second agent is useful only when your main script chooses the role, writes the input file, saves the output file, and stops before any file changes.

## Checkpoint

One review note exists, is linked to one issue, and did not change product files.

## Small drill

Classify a request as scout, reviewer, implementer, or do-not-run, then explain why.

## Next lesson

Next, make one supervisor step decide what happens after the review.

## Why this step exists

This step shows how to ask for help without losing ownership. The reviewer contributes evidence; the checker shows evidence and you still decide.
