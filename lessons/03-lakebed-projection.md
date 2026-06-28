# Lesson 03: Project issue state into Lakebed

## Challenge

Add Lakebed as the operator surface while keeping the loop core behind a provider boundary.

## Starter prompt

```txt
Use the local issue events and loop check from the previous lessons. Add a Lakebed provider/projection path: the core should read issue events through an adapter, and Lakebed should show list, board, and event views. Keep JSONL/local files testable.
```

## Build / operate

Expected work:

- `IssueStore` or equivalent provider port
- local JSONL adapter remains the test path
- Lakebed `/api/issue-events` read/write seam
- list/Kanban/event viewer shell connected to the same facts

## Observe

Compare the local issue-event file and Lakebed event view. The UI should explain the same state the loop check sees.

## Discuss

Lakebed is the projection, not the domain model. A useful UI explains state movement from append-only facts.

## Checkpoint

One issue appears in the correct Lakebed lane, and the event viewer explains why.

## Small drill

Pick one card and trace it back to the event that put it there.

## Fade for next lesson

Next lesson starts controlling the loop from Pi and Herdr instead of only inspecting files/UI.

## Run-06 scar

Joel chose the Lakebed endpoint over a DB dump. The seam matters because providers speak their own API; the core validates before trusting them.
