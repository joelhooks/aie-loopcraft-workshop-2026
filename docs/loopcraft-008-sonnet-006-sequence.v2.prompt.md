# Sonnet background task v2: Run 006 → 008 build sequence

You are Claude Code Sonnet 5. Output ONLY the requested Markdown document. Do not ask follow-up questions. Do not attempt to access files outside the prompt. Use the embedded receipts below as your Run 006 evidence.

## Task

Produce `# Loopcraft 008 from Run 006: build sequence` as a Markdown plan for rebuilding Lesson 008 from scratch.

The plan should be in the spirit of *Ten Steps to Complex Learning* / 4C-ID, but do not turn it into instructional-design sludge. Use plain language and tie every step to the actual build.

## 4C/ID facts to use carefully

- 4C/ID has four components: learning tasks, supportive information, procedural information, and part-task practice.
- The 4th-edition chapter list names steps as: Design Learning Tasks, Design Performance Assessments, Sequence Learning Tasks, Design Supportive Information, Analyze Cognitive Strategies, Analyze Mental Models, Design Procedural Information, Analyze Cognitive Rules, Analyze Prerequisite Knowledge, Design Part-Task Practice.
- The point is integrated whole-task learning, simple-to-complex sequencing, support that fades, just-in-time procedural help, and repeated practice for routines that need automaticity.

## Current 008 facts from local planning receipts

- 008 is being rebuilt from scratch on branch `loopcraft-008-from-scratch`.
- The first thing already added is a capture rail: `scripts/capture-008-event.mjs` writing `docs/loopcraft-008-build-events.jsonl`.
- Current captured event types include rationale, decision, guardrail, architecture, teaching-moment, friction, prompt, checkpoint, question, receipt.
- Joel's explicit rationale: 006 turned out well, but the lessons/rationale were not captured; 008 must capture while building.
- Opus and Sonnet planning passes both converged on: capture gate first, typed architecture before behavior, Effect Schema boundaries, XState skeleton, compare-only harness, candidate can abstain, no product behavior too early.
- Open decisions before TypeScript behavior: lifecycle states/transitions, stale/failed/interrupted recovery policy, agreement definition, incumbent real vs stub, where Effect is load-bearing versus ceremony.

## Embedded Run 006 curated receipts from loopcraft-in-pi/docs/prompt-slides.jsonl

```json
{
  "id": "run-006-launchd-try-created",
  "order": 48,
  "kind": "teacher-setup",
  "title": "Run 006 starts with grill-with-docs",
  "observation": "The intended new scenario did not exist when the launch command ran. Created `examples/issue-checker-06-launchd-try` from the latest template, then updated the scenario guidance so the first stop is installing `grill-with-docs` before guardrail setup or product behavior.",
  "scenario": "examples/issue-checker-06-launchd-try",
  "commits": [
    "084e4c1 chore: start from Loopcraft template",
    "62e8804 docs: start with grill skill install",
    "e8064b5 chore: install grill-with-docs skill",
    "aed14c7 chore: install Matt Pocock skills"
  ],
  "prompt": "Install Matt Pocock’s `grill-with-docs` skill.\n\nRun:\n\nnpx skills add mattpocock/skills --skill grill-with-docs -y\n\nThen check what changed and tell me where the skill was installed.\n\nNo app behavior yet.",
  "why": "This run tests the whiteboard stack: foundations pull down toward reliability; workflows pull up toward leverage. `grill-with-docs` is the first workflow move because it clarifies before code and banks decisions into docs.",
  "tags": [
    "run-006",
    "scenario",
    "grill-with-docs",
    "launchd",
    "workflow"
  ],
  "outcome": "Joel installed the full Matt Pocock skill package with `npx skills add mattpocock/skills -y`; scenario commit aed14c7 captures the installed project skills.",
  "next_prompt": "/skill:grill-with-docs\n\nGrill the issue gardener before we add product behavior.\n\nRead the repo docs first. The target is a Mac-local issue gardener: one safe manual command, then launchd repeats that command, with a local outbox or Discord webhook for receipts.\n\nAsk me one sharp question at a time. Recommend an answer. When a decision gets clear, save it in the right doc."
}
```
```json
{
  "id": "run-006-launcher-skill-root-fix",
  "order": 49,
  "kind": "bug-fix",
  "title": "Learner Pi should not be crippled",
  "observation": "The learner launcher had been passing --no-context-files, --no-skills, --no-extensions, and --no-prompt-templates, which made /reload and installed project skills confusing in a Pi workshop.",
  "decision": "Launch ordinary Pi from inside the learner repo with `exec pi`. The clean-room boundary comes from cwd and local files, not disabling Pi features.",
  "files": [
    "scripts/start-learner-pi.sh"
  ],
  "why": "Learners should experience Pi, not a deliberately crippled subset. Project skills installed by npx skills add should load through normal Pi project discovery.",
  "tags": [
    "run-006",
    "pi",
    "skills",
    "launcher",
    "clean-room"
  ],
  "note": "Matt Pocock skills are now installed in the scenario via npx skills add mattpocock/skills -y."
}
```
```json
{
  "id": "run-006-grill-dependency-finding",
  "order": 50,
  "kind": "review-finding",
  "title": "Matt grill-with-docs needs its called skills",
  "observation": "`npx skills add mattpocock/skills --skill grill-with-docs -y` installs only a tiny wrapper: “Run a `/grilling` session, using the `/domain-modeling` skill.” It does not install those called skills.",
  "decision": "Next prompt should install only `grilling` and `domain-modeling`, not the entire Matt skill garden, then commit the skill install.",
  "prompt": "`grill-with-docs` installed, but it is a wrapper around two skills we do not have yet.\n\nInstall only the missing skills it calls:\n\nnpx skills add mattpocock/skills --skill grilling domain-modeling -y\n\nThen check what changed. Confirm these exist:\n- `.agents/skills/grill-with-docs/SKILL.md`\n- `.agents/skills/grilling/SKILL.md`\n- `.agents/skills/domain-modeling/SKILL.md`\n\nCommit the skill install as one checkpoint.\n\nNo app behavior yet.",
  "tags": [
    "run-006",
    "skills",
    "matt-pocock",
    "grill-with-docs",
    "dependency"
  ],
  "resolution": "Joel chose to install the whole Matt Pocock skill package. Scenario commit aed14c7 captures the package install.",
  "next_prompt": "/skill:grill-with-docs\n\nGrill the issue gardener before we add product behavior.\n\nRead the repo docs first. The target is a Mac-local issue gardener: one safe manual command, then launchd repeats that command, with a local outbox or Discord webhook for receipts.\n\nAsk me one sharp question at a time. Recommend an answer. When a decision gets clear, save it in the right doc."
}
```
```json
{
  "id": "run-006-start-grill-prompt",
  "order": 51,
  "kind": "learner-prompt",
  "title": "Start the issue gardener grill",
  "prompt": "/skill:grill-with-docs\n\nGrill the issue gardener before we add product behavior.\n\nRead the repo docs first. The target is a Mac-local issue gardener: one safe manual command, then launchd repeats that command, with a local outbox or Discord webhook for receipts.\n\nAsk me one sharp question at a time. Recommend an answer. When a decision gets clear, save it in the right doc.",
  "why": "Now that Matt Pocock skills are installed and the learner launcher uses normal Pi, the next move is the first workflow loop: clarify intent before behavior and bank decisions into repo docs.",
  "tags": [
    "run-006",
    "grill",
    "vision",
    "workflow"
  ]
}
```

## Output shape

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
- Use “step”, “checkpoint”, “move”, “guardrail”, “capability” — avoid “slice”.
- Treat capture as part of the build, not a post-hoc summary.
- Keep it useful enough that we can implement from it next.
