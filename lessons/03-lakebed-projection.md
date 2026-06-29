# 03 · Show issue events in Lakebed

## Challenge

Read the same local event file from Lesson 02 and show the queue in Lakebed.

## What we're trying to build

Lesson 02 gave the checker a local event file, tests, and a receipt. Now make those facts visible. Lakebed should show the same ready, approval-required, and input-required work the local check sees.

If Lakebed disagrees with the check output, fix the Lakebed view, not the event file.

## What you should see

- The local event parser/check still runs without Lakebed.
- Lakebed can read the same issue events through one small endpoint or module.
- List, board, and event views show status, stop reason, and next action for each issue.
- A receipt records the event file checked, the Lakebed route opened, and any mismatch found.

## Starter prompt

```txt
Use the local events and check command from Lesson 02. Add the smallest endpoint or module that reads the same event file and returns issue cards for Lakebed. Show list, board, and event views with status, stop reason, and next action. Run the local check, open the Lakebed route, compare the results, and save a receipt. If the view disagrees with the check output, fix the view path, not the event file. Do not add writes, schedulers, external trackers, or background workers yet.
```

## Build / operate

Add the smallest Lakebed read path:

- the local event loader stays in charge;
- one endpoint or module returns issue cards;
- list, board, and event history show clear stop reasons;
- the Lakebed cards can be compared against the local check.

## Step checklist

1. **Keep the file in charge.** Do not move issue decisions into the UI. Reuse the event loader/parser from Lesson 02 or wrap it with one small module.
2. **Return issue cards.** Add the smallest endpoint or module Lakebed needs to read issue id, title, status, stop reason, next action, and recent events.
3. **Render useful views.** Show a list, board columns, and event history that explain why each issue has its current status.
4. **Compare and save evidence.** Run the local check, open the Lakebed view, compare counts/statuses, and save a receipt for the comparison.

## Observe

Run the local check, open Lakebed, and compare event count, statuses, stop reasons, and next action. The screen should make the same decision the command made.

## Receipt template

- `eventFile`: local event file used
- `localCheck`: command and result
- `lakebedRoute`: route or screen inspected
- `issueCounts`: command vs Lakebed counts
- `mismatches`: any card/event disagreement
- `nextAllowedAction`: what you can inspect or fix next

## Discuss

A useful view is not new evidence. It is a window into the event file the checker already trusts. That keeps the screen useful: you can point to the event behind every card.

## Checkpoint

One issue appears in the correct Lakebed column, the event view explains why, and a receipt proves Lakebed matched the local check.

## Small drill

Pick one card, name the event that created its current status, and say what you can do next.

## Next lesson

Control the checker from Pi and Herdr instead of only reading files and UI state.

## Why this step exists

This step teaches the checker to show its work. If you cannot trace a card back to an event, you cannot debug the system.
