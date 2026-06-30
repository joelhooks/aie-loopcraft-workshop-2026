# Vision

## What the first loop should do

The first version reads a local issue-event file, classifies each issue as `ready`, `approval-required`, or `input-required`, prints the reason for that classification, names the next allowed action, and writes a receipt from each run.

## Files the first loop may change

For Lesson 02, the loop may create or change only the local issue-event file, product check code, test files, package/check config, and receipts/run logs needed to prove the check ran.

It may not change app/product behavior files, Lakebed code, dispatch code, agent definitions, auth, scheduler config, or external tracker setup without human approval.

## Tools for the first local check

Use TypeScript for the checker, Effect Schema for parsing and validating issue events, a small test runner for outside-behavior tests, and fast repo checks for typecheck, lint, and format.

Keep the first data source as `data/issue-events.jsonl` or `issues.jsonl`, and save receipts as plain JSON under `receipts/`.

## Stop and approval rules

The loop must stop and ask before doing anything else when an issue lacks acceptance criteria, asks for product/code changes outside the allowed files, needs approval, needs more input, has conflicting events, has invalid JSON/schema data, or when the worktree is dirty in a way the loop did not cause.

The receipt should say exactly why it stopped and what human decision is needed.

## Not building yet

The first version does not change product code, call external trackers, run agents, schedule itself, update Lakebed, add GitHub/Linear API calls, add schedulers, or add background workers.
