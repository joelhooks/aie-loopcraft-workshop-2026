# YouTube chapters + description — uC6slhCTXlA

Full Workshop Building Durable Autonomous Agents using Pi, XState, and Effect
(93:48, published 2026-07). Derived from a turbo Whisper pass on the published
audio; every timestamp anchored to a transcript segment start.

## Chapters (paste into description)

0:00 Intro: Loopcraft and the workshop setup
2:25 Starting Pi inside the Docker container
4:31 Designing the looping issue resolver
10:16 Choosing XState v5 and Effect v4, prompting the starter
15:17 Why Pi: a minimal harness you own
19:35 Reviewing the generated scaffold
24:53 Architecture summary page with Lakebed
30:43 Matt Pocock skills and the vision.md concept
36:37 Grilling session: defining the vision
46:54 Daemon architecture and spec/ticket skills
55:38 Agent loop pane: one agent prompting another
1:01:22 Watching the build: compaction, tests, lint enforcement
1:07:59 Building the Loopcraft Pi extension and monitor
1:15:32 Lakebed issue tracker UI
1:21:07 Kanban board live: running the loop end to end
1:31:49 Wrap-up: bugs, next steps, takeaways

## Description (paste above the chapters)

I built Loopcraft in a few hours, on camera: an agent that loops over a
project's issues and resolves them autonomously. Not a demo repo — the whole
thing gets designed, scaffolded, argued with, and shipped to a live Kanban
board during the workshop, bugs included.

What you'll see:

- Pi as the agent harness — a minimal loop you own instead of rent, running
  GPT-5.5 through a Codex subscription inside a Docker workshop container
- Planning before prompting: TLDraw sketches, a grilling session with Matt
  Pocock's Wayfinder skill, and a vision.md that acts as guardrails for the
  looping agent
- Event sourcing with Effect v4 and Effect Schema, ports-and-adapters so the
  JSONL issue store can become GitHub Issues or Linear later
- Multi-agent orchestration in herdr: an operator pane and an agent-loop
  pane, where one Pi session literally types prompts into another
- Enforcement that actually bites: OXLint with Ultracite, Lefthook hooks,
  and an agent that tries to eslint-disable its way past a complexity rule
  before fixing it properly
- A live issue tracker UI on Lakebed, built by the loop it tracks

It has bugs. It is not complete. It is interesting — and it's the shape of
the thing.

Workshop repo: https://github.com/joelhooks/aie-loopcraft-workshop-2026
(confirmed from the repo's origin remote — verify it's public before pasting)

## Notes for Joel

- No Q&A found in the transcript — it's a solo screencast throughout, so no
  Q&A chapter.
- The transcript says "Loopcraft" consistently; title says "durable
  autonomous agents" — description uses both.
- Wrap-up admission at 1:32:53 ("the XState machine didn't really come into
  play here") is left out of the description on purpose — the title promises
  XState; the chapters route viewers honestly via "Wrap-up: bugs, next
  steps, takeaways".
- Repo URL confirmed from origin remote; check the repo is public before
  the link goes in the description.
