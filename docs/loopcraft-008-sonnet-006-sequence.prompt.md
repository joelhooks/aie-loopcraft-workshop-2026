# Sonnet background task: Run 006 → 008 build sequence

You are Claude Code Sonnet 5 running read-only analysis for Joel.

## Task

Analyze the available Loopcraft Run 006 receipts and produce `docs/loopcraft-008-from-006-build-sequence.md` as a Markdown plan for rebuilding Lesson 008 from scratch.

The plan should be in the spirit of *Ten Steps to Complex Learning* / 4C-ID, but do not turn it into instructional-design sludge. Use plain language and tie every step to the actual build.

## Available receipts to inspect

Primary curated source:

- `/Users/joel/Code/joelhooks/loopcraft-in-pi/docs/prompt-slides.jsonl`
  - focus on `run-006-*` entries, plus the run-004/run-005 lead-in if needed
  - especially orders 42-51 and any tool/eval entries around transcript/capture

Current 008 planning receipts:

- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/docs/loopcraft-008-build-events.jsonl`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/docs/loopcraft-008-claude-plan.md`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/docs/loopcraft-008-sonnet-plan.md`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/scripts/capture-008-event.mjs`

Current lesson/source shape:

- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/web/src/routes/lessons/08-supervisor-runtime/+page.svx`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/web/src/routes/lessons/02-reliability-floor/+page.svx`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/docs/tooling.md`
- `/Users/joel/Code/joelhooks/aie-loopcraft-workshop-2026/package.json`

If you can locate raw local transcript receipts for Run 006 safely, use them only as evidence. Do not quote hidden reasoning, secrets, or raw private transcript chunks. Prefer curated prompt-slide notes.

## 10 Steps to Complex Learning source facts to use carefully

Use these only as design inspiration unless you verify more source detail:

- 4C/ID has four components: learning tasks, supportive information, procedural information, and part-task practice.
- The 4th-edition chapter list names steps as: Design Learning Tasks, Design Performance Assessments, Sequence Learning Tasks, Design Supportive Information, Analyze Cognitive Strategies, Analyze Mental Models, Design Procedural Information, Analyze Cognitive Rules, Analyze Prerequisite Knowledge, Design Part-Task Practice.
- The point is integrated whole-task learning, simple-to-complex sequencing, support that fades, just-in-time procedural help, and repeated practice for routines that need automaticity.

## Output shape

Write a single Markdown artifact to stdout. The shell will redirect stdout to:

`docs/loopcraft-008-from-006-build-sequence.md`

Use this structure:

1. `# Loopcraft 008 from Run 006: build sequence`
2. `## What Run 006 taught us` — concise, receipt-backed.
3. `## Design spine` — map whole task / supportive info / procedural info / part-task practice to 008.
4. `## The build sequence` — 10 numbered build steps. Each step must include:
   - learner-visible move
   - instructor capture move
   - code/doc artifact to create or change
   - validation/receipt
   - support level: high / medium / low / faded
   - what not to build yet
5. `## Pause points for Joel` — where rationale must be captured long-form before compressing.
6. `## First three commits` — exact commit-sized checkpoints.
7. `## Risks` — what could make 008 repeat the 006 capture failure.

Hard rules:

- Be direct and skeptical.
- Do not invent Joel's rationale. Mark `needs_joel_rationale` where missing.
- Do not leak private paths into learner-facing copy; paths are fine in this internal plan receipts section.
- Use “step”, “checkpoint”, “move”, “guardrail”, “capability” — avoid “slice”.
- Treat capture as part of the build, not a post-hoc summary.
- Keep it useful enough that we can implement from it next.
