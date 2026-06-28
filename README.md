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

## What is not built yet

The loop itself is still yours to build.

Lesson 01 starts by creating the product intent and first issue-event queue. Later lessons add the reliability floor, Lakebed projection, Pi/Herdr control, safe dispatch, maintenance, specialists, and supervisor runtime shadowing.

Lessons are the rails. Issues are the product substrate we are building toward.

## Start Lesson 01

From this folder in Pi:

```txt
/loop-lesson-01
```

That command fills the editor with the starter prompt. Read it, adjust it if needed, then send it.

If the command is not loaded yet, reload Pi extensions or paste this prompt manually:

```txt
We are building a local issue-progress loop.

Lesson 01: prompt the loop contract into existence.

Do the next small pass only: clarify the loop, write the first product intent, and create the first local issue-event queue with ready / approval-required / input-required gates. Keep it local, leave receipts, and explain the evidence before moving on.
```

## Useful files

- `lessons/01-loop-contract.md` — first guided challenge
- `WORKSHOP_RIG.md` — how Pi, Herdr, Lakebed, and persistence fit together
- `agents/skills/loopcraft-ta/SKILL.md` — local guide context
- `.agent_sources/README.md` — source mirrors already staged
- `surface/lakebed/README.md` — operator surface capsule

## Expected end state

By the end of the hour, the loop should be able to read its own issue events, classify work, show state in Lakebed, run through Pi/Herdr controls, claim or maintain one safe unit of work, and leave evidence for every move.
