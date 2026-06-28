# Issue Progress Loop Workshop

This is the on-rails Loopcraft learner rig.

We are not pretending this starts from nothing. The heavy sources and harness pieces are already here so the hour can focus on the useful moves: prompting the loop into existence, making it reliable, putting it on a visible surface, and letting it start progressing work through its own issue queue.

## What is already prepared

- Local Loopcraft TA skill: `agents/skills/loopcraft-ta`
- Matt Pocock skill capsule in `.agents/skills` and `.claude/skills`
- Source mirrors in `.agent_sources`:
  - Effect
  - XState
  - pi-subagents
- Pi project config and a tiny Lesson 01 helper extension in `.pi/extensions/loop-workshop.ts`
- Lakebed capsule shell in `surface/lakebed`
- Lesson guide in `lessons/`
- Public Wzrrd workshop site source in `web/`

## What is not built yet

The loop itself is still yours to build.

Lesson 01 starts with a tour, a `grill-with-docs` vision session, and minimal repo setup. Later lessons add the first issue-event queue, reliability floor, Lakebed projection, Pi/Herdr control, safe dispatch, maintenance, specialists, and supervisor runtime shadowing.

Lessons are the rails. Issues are the product substrate we are building toward.

## Start Lesson 01

From this folder in Pi:

```txt
/loop-lesson-01
```

That command fills the editor with the starter prompt. Read it, adjust it if needed, then send it.

If the command is not loaded yet, reload Pi extensions or paste this prompt manually:

```txt
/skill:grill-with-docs

Tour this prepared Loopcraft repo with me before we build product behavior.

Inspect README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, .pi/extensions/loop-workshop.ts, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time to define the product vision, operator boundaries, stop rules, and first repo setup choices. Write the decisions into VISION.md. Update AGENTS.md or README.md only when a repo rule or command is clear. Create only the minimal repo setup needed for the next lesson. Do not build the loop yet.
```

## Useful files

- `lessons/01-tour-vision-repo.md` — first guided challenge
- `WORKSHOP_RIG.md` — how Pi, Herdr, Lakebed, and persistence fit together
- `agents/skills/loopcraft-ta/SKILL.md` — local guide context
- `.agent_sources/README.md` — source mirrors already staged
- `surface/lakebed/README.md` — operator surface capsule
- `web/README.md` — Wzrrd workshop site build/publish notes

## Expected end state

By the end of the hour, the loop should be able to read its own issue events, classify work, show state in Lakebed, run through Pi/Herdr controls, claim or maintain one safe unit of work, and leave evidence for every move.
