The plan is written. Here's the summary before I hand it back to you for approval:

---

**Plan: Loopcraft 008 from scratch**

**What the plan covers:**

1. **Capture first** — `scripts/capture-008-event.mjs` already exists with 2 events logged. The missing piece is a `capture:check` gate that validates checkpoint events exist per SHA, wired into `pnpm run check`. Without a gate, capture is a habit and 006 repeats.

2. **7 architecture decisions to log as events before any TypeScript** — IssueEvent shape, incumbent checker contract, lifecycle states, recovery semantics, agreement definition, Effect boundary, no-writes contract as a type.

3. **Typed scaffold (shape only, no behavior)** — Effect schemas for `IssueEvent`/`Decision`/`CompareReceipt`, XState machine with guards stubbed to `false`, candidate that returns `{ state: "abstain" }`. Everything typechecks; nothing decides anything yet.

4. **8 commits, each gated by a prior `checkpoint` event** — starting with tracking the existing untracked files, ending with the compare harness + recovery drill + actual receipt output.

5. **5 hard stops for you:**
   - Lifecycle state names and transitions (become XState state IDs — wrong names propagate everywhere)
   - Recovery policy (stale vs failed vs interrupted — encodes domain responsibility)
   - Agreement definition (determines when 008 "works")
   - Incumbent checker: real or stub (changes what the lesson proves)
   - Effect boundary (which IO surface it owns in 008)

6. **What not to build yet** — no GitHub/API writes, no real dispatch, no queue/scheduler, no agent review loop, no UI changes, no worktree isolation. Only output: a `CompareReceipt` written locally and logged via the capture tool.

---

One question before proceeding: **Is the incumbent checker for 008 a real implementation carried from earlier lessons, or a hardcoded stub?** This affects commit 6 and what the receipt actually proves. If it's a stub, the lesson is self-contained but synthetic. If it's real, we need the event file and check command from lessons 02-06 to exist on this branch first.
