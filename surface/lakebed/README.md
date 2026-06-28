# Lakebed Issue Loop Surface

This capsule is a spike for using Lakebed as the first real provider for the local issue-progress loop's issue store and operator control surface.

Run locally:

```sh
npx lakebed dev
```

## What this spike proves

- Lakebed can store canonical issue events in its database.
- Lakebed can project current issue state for a human-facing operator surface.
- The first operator action is approval: approving an `approval_required` issue appends an `issue.updated` event with `approval: "pre-approved"` and `status: "ready"`.
- The Effect/XState loop core is not imported into the capsule.
- Capsule shared code is plain TypeScript and does not import Effect, XState, Node built-ins, or repo core modules.

## Intentional boundary

Lakebed is the target provider for this spike, not the domain model.

The intended architecture is:

```txt
Lakebed capsule
  owns UI, database schema, mutations, queries, and realtime-ish operator state

LakebedIssueStore adapter
  translates Lakebed issue events into the core IssueStore port

Effect/XState core
  validates provider data, projects trusted state, runs the loop lifecycle, and writes receipts
```

## Adapter seam

The capsule exposes issue events through local HTTP endpoints:

- `GET /api/issue-events` returns core-shaped issue events from Lakebed storage.
- `POST /api/issue-events` appends one issue event or an array of issue events into Lakebed storage.

The repo core uses the read endpoint through `LakebedIssueStore`. The write endpoint lets local tooling publish approved issue batches into Lakebed without scraping `db dump` output or importing core modules into the capsule.

Do not import `src/loop-check.ts`, Effect schemas, or Node file code into the capsule. Providers speak their natural API; adapters translate; the core validates before trusting provider data.
