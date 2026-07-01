# Loopcraft 008 from Run 006: build sequence

## What Run 006 taught us

Run 006 worked. The problem is we can't teach from it because we didn't capture *why* while building.

Specific receipts:

- **The grill-before-code move paid off.** Starting with `/skill:grill-with-docs` clarified intent before any TypeScript existed. 008 must preserve this sequence — decision → doc → code — not flip it.
- **Skill dependency was invisible until too late.** `grill-with-docs` is a wrapper; it calls `grilling` and `domain-modeling` which weren't installed. The learner hit a dead end before the first real move. 008 needs a dependency-audit checkpoint before any skill invocation.
- **The launcher was silently crippling the learner.** `--no-context-files --no-skills --no-extensions` meant installed project skills didn't load. The fix was `exec pi` from the learner repo. This is a subtle footgun that cost a full debugging round with no captured rationale.
- **Run 006 build order**: grill → decisions into docs → typed architecture → behavior. The Opus and Sonnet passes for 008 independently re-derived the same sequence. That convergence is evidence the order is right.
- **What we don't have from 006**: the rationale for lifecycle state names, the stale/failed/interrupted recovery policy, and where Effect is actually load-bearing vs. ceremony. Those decisions were made but not written down. They're the biggest reconstruction risk.

---

## Design spine

| 4C/ID component | 008 mapping |
|---|---|
| **Whole task** | Build a local issue gardener: one safe manual command, launchd repeats it, local outbox receives receipts. Learner builds the full thing, not isolated pieces. |
| **Supportive information** | Conceptual framing for Effect Schema boundaries, XState lifecycle modeling, and the compare-only harness. Loaded *before* the learner writes any behavior. The `grill-with-docs` session is the primary delivery mechanism. |
| **Procedural information** | Just-in-time: "run this command now," "add this field now." Delivered as capture-annotated prompts at each step. Never front-loaded. |
| **Part-task practice** | XState: learner builds the state machine skeleton repeatedly against synthetic events before any real issue data. Typing the schema independently before integrating. Both capabilities need automaticity before the full loop runs. |

Support fades: steps 1–4 are high support (instructor shows the move), steps 5–7 are medium (learner drives with a guardrail), steps 8–10 are low/faded (learner chooses the next move, instructor captures the rationale).

---

## The build sequence

### Step 1 — Capture rail first

**Learner-visible move**: Run `scripts/capture-008-event.mjs` with a `rationale` event. Confirm the JSONL file appears.

**Instructor capture move**: Record *why the capture rail exists before any code*. `needs_joel_rationale`: what specific failure in 006 made this the first commit, not an afterthought?

**Artifact**: `scripts/capture-008-event.mjs`, `docs/loopcraft-008-build-events.jsonl`, entry type schema documented in comments.

**Validation**: JSONL file exists, `jq '.[0].kind'` returns a valid type, file is gitignored or committed per decision.

**Support level**: High — instructor sets this up before the learner session; it's invisible infrastructure.

**What not to build yet**: No schema types, no XState, no issue fetching. The capture rail is a notebook, not a gatekeeper.

---

### Step 2 — Skill audit and launcher health check

**Learner-visible move**: Confirm `exec pi` launches correctly from the scenario repo. Confirm that installed project skills are visible. Run `npx skills add mattpocock/skills -y` and verify `grilling`, `domain-modeling`, and `grill-with-docs` all have `SKILL.md` files.

**Instructor capture move**: Capture a `guardrail` event: "skill dependency must be verified before first grill session." Log the 006 footgun (wrapper skill missing deps) as a `teaching-moment` event.

**Artifact**: `scripts/start-learner-pi.sh` using `exec pi`. Skill files present in `.agents/skills/`.

**Validation**: `ls .agents/skills/grilling/SKILL.md .agents/skills/domain-modeling/SKILL.md .agents/skills/grill-with-docs/SKILL.md` — all three exist.

**Support level**: High — instructor writes the launcher fix; learner follows the install command.

**What not to build yet**: No product behavior, no schema, no TypeScript.

---

### Step 3 — Grill the gardener

**Learner-visible move**: `/skill:grill-with-docs` — grill the issue gardener before any code. Learner answers one sharp question at a time. Decisions get written into docs as they clarify.

**Instructor capture move**: Capture each decision as a `decision` event immediately. Do not wait until the session ends. Key decisions to force: What is the single manual command? What is the outbox shape? What counts as a stale issue?

**Artifact**: A short `VISION.md` update or `docs/decisions.md` entry for each resolved question.

**Validation**: At least three decisions written into a doc file before the session ends. No unresolved question about the manual command shape.

**Support level**: High — instructor models what a sharp answer looks like; learner answers, instructor types.

**What not to build yet**: No TypeScript, no XState states, no Effect. Decisions only.

---

### Step 4 — Effect Schema boundaries, typed only

**Learner-visible move**: Define the core domain types as Effect Schema: `Issue`, `CheckResult`, `Outbox` entry. No runtime behavior. Types are the whole artifact.

**Instructor capture move**: Capture an `architecture` event for each boundary decision: "why Effect Schema here vs. plain TypeScript interface?" `needs_joel_rationale`: Is Effect Schema load-bearing here, or is it ceremony the 008 build is preserving for pedagogical consistency?

**Artifact**: `src/schema.ts` with Effect Schema definitions. No imports from anywhere else yet.

**Validation**: `tsc --noEmit` passes. No other files import from `src/schema.ts` yet.

**Support level**: High — instructor types first draft; learner adds one field.

**What not to build yet**: No XState, no fetchers, no checkers, no side effects.

---

### Step 5 — XState skeleton: states and transitions, no actions

**Learner-visible move**: Define the lifecycle state machine in XState. States only: `idle`, `checking`, `done`, `failed`, `interrupted` (or whatever the 006-derived names are). Transitions but no actions, no guards yet.

**Instructor capture move**: Capture `decision` events for every state name and every transition. This is the step most likely to produce undocumented decisions. Capture the stale/failed/interrupted recovery policy explicitly — this was an open question going into 008.

**Artifact**: `src/machine.ts` — XState machine definition. No side effects wired.

**Validation**: Machine typechecks. `createActor(machine).start()` can be called in a throwaway script without crashing.

**Support level**: Medium — instructor shows state/transition syntax; learner names the states.

**What not to build yet**: No actions, no context updates, no Effect integration.

---

### Step 6 — Compare-only harness with synthetic events

**Learner-visible move**: Write a test harness that feeds synthetic `Issue` events through the state machine and asserts on final state. No real GitHub data. Candidate checker abstains (returns `undefined` or `noOpinion`) by default.

**Instructor capture move**: Capture a `teaching-moment` event: "compare-only means the harness can run safely in CI before any real behavior exists." Capture what "abstain" means in this domain — `needs_joel_rationale`: is abstain a real domain concept or a harness convenience?

**Artifact**: `src/harness.ts` or `src/__tests__/machine.test.ts`. Fake issues, fake checker, real state machine.

**Validation**: Tests pass. Harness does not make any network calls. `candidate.check()` returns `undefined` for all inputs.

**Support level**: Medium — instructor writes one test; learner writes two more.

**What not to build yet**: No real checker logic, no incumbent comparison, no GitHub fetch.

---

### Step 7 — Incumbent stub: real interface, fake data

**Learner-visible move**: Define the `Incumbent` interface that the checker will eventually call. Implement a stub that returns hardcoded fake data.

**Instructor capture move**: Capture the `architecture` event for the incumbent contract. Capture an open `question` event: "When does the incumbent become real? Before or after the checker logic passes the harness?"

**Artifact**: `src/incumbent.ts` — interface + stub implementation.

**Validation**: The harness from Step 6 can import and use `IncumbentStub` without changes to test assertions.

**Support level**: Medium — learner writes the interface after seeing one example.

**What not to build yet**: No real GitHub API calls, no Effect services wired, no agreement logic.

---

### Step 8 — First real capability: fetch one issue

**Learner-visible move**: Replace the stub with a real Effect service that fetches one issue from GitHub. Wire it into the state machine via a service call. Run against a real (but low-stakes) repo.

**Instructor capture move**: Capture a `checkpoint` event: "first real side effect is in." Capture a `friction` event for anything surprising about Effect service wiring — this is where 006 decisions about Effect-as-load-bearing vs. ceremony should surface.

**Artifact**: `src/github-service.ts` implementing the incumbent interface using Effect. Updated machine wiring.

**Validation**: Running the manual command fetches one real issue and transitions the machine to `done`. JSONL receipt written.

**Support level**: Low — learner drives; instructor observes and captures.

**What not to build yet**: No launchd, no Discord webhook, no batch fetching.

---

### Step 9 — Agreement definition and one checker

**Learner-visible move**: Define what "agreement" means (from the grill decisions in Step 3). Implement one real checker that can agree, disagree, or abstain. Run it through the harness.

**Instructor capture move**: Capture the `decision` event for the agreement definition. This is the highest-risk step for undocumented rationale. If the agreement definition is fuzzy, stop and grill before coding.

**Artifact**: `src/checker.ts` — one real checker. Updated harness with agreement assertions.

**Validation**: Harness shows at least one agree case, one disagree case, one abstain case. All pass.

**Support level**: Low — learner owns this step.

**What not to build yet**: No launchd, no outbox delivery, no UI.

---

### Step 10 — launchd plist and outbox delivery

**Learner-visible move**: Write the launchd plist. Wire the outbox to write a JSONL receipt (or send a Discord webhook). Run the full loop: launchd fires → fetch → check → outbox.

**Instructor capture move**: Capture a `checkpoint` event for the first end-to-end run. Capture a `receipt` event with the actual JSONL output. Capture a `guardrail` event for launchd safety (what stops it from hammering GitHub rate limits?).

**Artifact**: `launchd/com.loopcraft.issue-gardener.plist`. Updated outbox handler.

**Validation**: `launchctl load` and `launchctl start` produce a receipt in the outbox. No errors in system log.

**Support level**: Faded — instructor is available but learner builds it.

**What not to build yet**: No web UI, no multi-repo support, no Linear integration.

---

## Pause points for Joel

These are places where a mid-session pause and long-form capture is required before compressing. Do not skip.

1. **After Step 3 (grill session)**: Before writing any TypeScript, Joel must confirm the single manual command shape and the outbox contract in plain English. If these are fuzzy, the XState skeleton will be wrong.

2. **Before Step 5 (XState skeleton)**: The lifecycle state names and the stale/failed/interrupted recovery policy were open decisions going into 008. These must be resolved and written down before the machine is defined, not after. `needs_joel_rationale`: What exactly failed or was unclear about the 006 recovery policy?

3. **Before Step 7 (incumbent real vs stub)**: `needs_joel_rationale`: In 006, when did the incumbent go from stub to real? Was that the right moment? What would have broken if it happened earlier or later?

4. **After Step 9 (agreement definition)**: The agreement definition is the conceptual core of the whole gardener. If it changes after Step 9, the checker and harness both need rework. Capture it precisely enough that it can be re-derived from the doc without re-grilling.

---

## First three commits

**Commit 1**: `feat: capture rail and event schema`
- `scripts/capture-008-event.mjs` functional
- `docs/loopcraft-008-build-events.jsonl` present (empty or with first rationale event)
- Event type list documented in the script header
- Nothing else

**Commit 2**: `chore: learner launcher and skill audit`
- `scripts/start-learner-pi.sh` using `exec pi`
- All three Matt Pocock skills present and verified
- A `guardrail` capture event documenting the launcher fix and the skill dependency trap from 006

**Commit 3**: `docs: grill decisions and Effect Schema boundaries`
- Post-grill decisions written into `docs/decisions.md` or `VISION.md`
- `src/schema.ts` with Effect Schema types (no behavior)
- At least one `decision` capture event per grill resolution
- `tsc --noEmit` passes

---

## Risks

**1. Capture fatigue kills the rationale.** The capture rail exists, but if capturing feels like extra work, it won't happen in the moment. In 006, decisions were made and not written. 008 will repeat this if capture is not part of each step's definition of done — not a post-step summary.

**2. Open decisions get coded around, not resolved.** The stale/failed/interrupted recovery policy and the agreement definition are currently open. If the build starts without resolving them, the machine will encode an implicit decision that nobody can reconstruct later. See Pause Points 1 and 2.

**3. Effect ceremony vs. load-bearing is unresolved.** Both planning passes flagged this. If Effect is wiring sugar here, a learner who doesn't have Effect expertise will hit a wall at Step 4 with no good explanation for why the complexity exists. `needs_joel_rationale`: Is Effect Schema in Step 4 a teaching target or just consistency with the existing stack?

**4. The grill session produces fuzzy decisions.** `grill-with-docs` is only as sharp as the questions. If the outbox contract comes out of the grill as "some kind of JSONL or maybe Discord" the downstream steps will drift. The Step 3 pause point exists to prevent this, but it requires instructor discipline.

**5. Harness gets skipped because it feels redundant.** Step 6 (compare-only harness with synthetic events) is the highest pedagogical value step and the one most likely to be skipped as the learner gets excited to wire real data. If the harness is skipped, there's no safe test bed for the agreement logic in Step 9, and the first real failure will happen in production.

**6. launchd rate-limit footgun has no guardrail yet.** Step 10 wires launchd. If the plist interval is wrong, it will hammer GitHub's API. The Step 10 guardrail capture event should include the specific interval decision and the rate-limit math. This was presumably resolved in 006 but is not in the receipts.
