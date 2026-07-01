Grounded. Here's the state of the world before I plan against it:

- **The repo is the workshop content repo**, not a built loop. `web/` is the Svelte lesson site, `lessons/` are svx, `.agent_sources/{effect,xstate}` hold the reference docs the lesson tells you to read. There is **no TypeScript loop project, no event file, no checker yet** — `package.json` is workshop/web tooling only.
- **Capture already exists and is good**: `scripts/capture-008-event.mjs` (typed vocabulary of 10 event types, secret-guard, 2000-char cap, `--summary`) plus one `rationale` event in `docs/loopcraft-008-build-events.jsonl`. **Both are untracked.**
- **Lesson 08 = supervisor-runtime**, and its prompt is narrow: add an **XState candidate machine** that returns `{nextState, reason}` for *one* issue, run it **compare-only beside the existing checker**, save a receipt (`inputEvent, currentDecision, candidateDecision, agreement, reason`) plus one stale/failed/interrupted recovery case. **No writes** to GitHub/APIs/files/timers/worktrees.

That last point matters: the lesson assumes "the event file and check command from earlier lessons" exist. On this fresh branch they don't. So a faithful 008 needs a thin incumbent to shadow before the candidate has anything to compare against.

---

## The plan

### 1. Capture system — install (really, commit) first

You already built the right tool. Don't reinvent it. Two real gaps:

- **It's untracked and unenforced.** A capture script nobody is forced to run fails *exactly* like 006. Intentions already lost that fight once. The fix is a forcing function, not better discipline: **capture gates the checkpoint.** Concretely — every checkpoint commit must be preceded by at least one `checkpoint` event whose `receipts[]` include the prior git SHA + the command output that proves the claim. Wire it as a `pnpm capture:check` that fails if `HEAD`'s work has no corresponding event, and run it before each commit. (Optional pre-commit hook later; don't over-build it now.)
- **Receipts must point at artifacts, not vibes** — git SHAs, `file:line`, saved command output paths. The script already has `--receipt`; the discipline is "no receipt → not a real claim."

Add one small thing: a **render step** (`jsonl → docs/008-build-log.md`) so the trail is reviewable and *becomes* the lesson narrative. That's the artifact 006 was missing.

Keep `actor` honest: `teacher` (Joel's meaning) vs `agent` (what I inferred). When I capture a `decision`, it should be flagged agent-authored so you can audit where I invented vs where you decided.

### 2. Architecture facts to capture *before* code (each = a `decision`/`architecture` event)

These are the things an agent will silently invent if you don't pin them:

1. **What an `IssueEvent` is** — the domain object's shape and which fields drive a decision.
2. **What "the checker / current decision" is** — the incumbent's output contract (`{state, reason}`). If it's a stub, say so explicitly, because then the comparison is partly theater and we should know that.
3. **The issue lifecycle states + transitions** — the XState model itself. This is *your* domain (open/in-progress/blocked/stale/failed/interrupted/done?), not mine to guess.
4. **Recovery semantics** — what stale/failed/interrupted *mean* and the correct next state for each.
5. **"Agreement" definition** — exact match? state-only? does `reason` count? This silently determines whether every receipt says "agree."
6. **Where Effect earns its place vs ceremony** — IO boundary + typed errors yes; full layer/runtime cathedral for a node CLI, no.
7. **The guardrail as a type, not a comment** — candidate consumes a read-only capability set; "no writes" is a *compile error*, not a runtime check.

### 3. Typed architecture (Effect + XState), no business behavior

Define contracts that typecheck and run returning **`abstain`**, before any real transition logic exists:

- `IssueEvent` and `Decision = { state, reason }` as **Effect Schema**, branded ids, `state` a literal union matching the XState state values.
- **XState machine**: states + events + transitions + typestate fully declared; **guards/actions stubbed to return `abstain`/`unknown`**. The shape is real; the judgment is empty.
- **Effect services as interfaces only**: `EventStore` (read jsonl), `Clock` (for stale), `ReceiptSink` (write receipts). Layers deferred. The candidate's Effect requirements include **no write capability** — so a write attempt won't compile. That's the guardrail.
- **Compare harness**: pure `compare(current, candidate) -> Receipt`, `Receipt` schema'd.
- Result: the whole thing runs, emits a receipt that says "candidate abstained, current in charge, agreement=n/a" — *before* you've encoded a single real transition. Behavior lands later, deliberately.

### 4. First 6–8 commits

1. `chore: track capture tooling + first rationale event` — make capture real before anything else uses it.
2. `feat: capture:check gate + jsonl→build-log renderer` — the forcing function.
3. `docs: capture architecture decisions as events` — the §2 list, with pause points marked unresolved.
4. `chore: strict TS + Effect/XState scaffold` — tsconfig strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), vitest; empty typecheck passes.
5. `feat: IssueEvent + Decision schemas` (no logic) + decision event.
6. `feat: incumbent checker returning {state, reason}` — the thing we shadow (stub allowed, declared as stub).
7. `feat: XState candidate skeleton` — states/transitions/typestate, guards stubbed to abstain.
8. `feat: compare-only harness + one agreement receipt + one recovery case` + checkpoint event with receipts.

### 5. Pause for Joel — do not let me invent meaning

Hard stops where I should ask, not assume:

- **The lifecycle states and their transitions** (§2.3) — this is the whole machine; if I invent it the lesson teaches my guess.
- **Recovery policy** for stale/failed/interrupted (§2.4) — product judgment, not mechanics.
- **The definition of "agreement"** (§2.5) — quietly determines whether the comparison means anything.
- **Whether the incumbent checker is a real decision or a stub** — if stub, we both agree the comparison is scaffolding, on the record.
- **Where Effect is load-bearing vs ceremony** (§2.6) — your call on the boundary.
- **VISION.md** stays human-owned; I won't touch strategic intent. If 008 implies a VISION change, I'll flag it, not edit it.

### 6. What NOT to build yet

Straight from the lesson boundary + your "guardrails before product behavior":

- **No writes from the candidate**: GitHub, Linear, APIs, product files, timers, parallel worktrees, schedulers, background/daemon workers, dispatch.
- **No promotion** — candidate stays shadow/compare-only. It never takes authority in 008.
- **No Effect over-engineering** — no full layer/runtime cathedral, no streaming, no concurrency for a CLI.
- **No batch/multi-issue** — one issue, per the prompt.
- **No persistence/db/Lakebed projection**, no real transition heuristics until the states are your-approved.

---

The one thing I'm skeptical of: capture is currently a *habit*, and habits already lost to 006. Commits #1–2 exist specifically to convert it into a *gate*. If you don't want the gate, then we're betting on willpower again — and we have a data point on how that goes.

Want me to start with commit #1 (track the capture tooling + the gate), or do you want to resolve the §5 pause points — especially the lifecycle states — before I scaffold anything?
