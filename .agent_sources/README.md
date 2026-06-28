# Agent source mirrors

This directory holds source-backed references that agents must inspect before writing library-heavy Effect, XState, or pi-subagents code.

These mirrors are preloaded for the workshop. Do not spend Lesson 01 setting up subtrees or fetching source. Refreshing these mirrors is follow-up maintenance, not learner-path work.

Mirrors are maintained as squashed git subtrees, not submodules or loose local clones.

## Effect

- Upstream: `https://github.com/Effect-TS/effect.git`
- Mirrored ref: `main` at `cfa2bbf7f290e88e2c57480eb9b2d7b058389cda`
- Local path: `.agent_sources/effect`
- Refresh command: `git subtree pull --prefix=.agent_sources/effect https://github.com/Effect-TS/effect.git main --squash`

## XState

- Upstream: `https://github.com/statelyai/xstate.git`
- Mirrored ref: `main` at `229d976c149601c256303d80ab2689d52ef4d714`
- Local path: `.agent_sources/xstate`
- Refresh command: `git subtree pull --prefix=.agent_sources/xstate https://github.com/statelyai/xstate.git main --squash`

## pi-subagents

- Upstream: `https://github.com/nicobailon/pi-subagents.git`
- Mirrored ref: `v0.31.0` at `e4f06282d0c95856b36b7ec2893f4fd294ebfefe`
- Local path: `.agent_sources/pi-subagents`
- Refresh command: `git subtree pull --prefix=.agent_sources/pi-subagents https://github.com/nicobailon/pi-subagents.git v0.31.0 --squash`

Use this mirror before installing or integrating `pi-subagents`. In particular, inspect `src/agents/agents.ts`, `test/unit/agent-disabled.test.ts`, and the README sections for builtin overrides, project agents, and `subagents.disableBuiltins`.

The installed package versions are recorded in `package.json`. If the installed version and mirrored ref drift in a way that affects implementation, record the reason in this file or an ADR before changing library-heavy code.
