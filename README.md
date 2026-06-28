# Loopcraft Blank Project

This is a blank workspace for building a tool step by step.

It starts with almost no toolchain on purpose. Add the low-level guardrails visibly instead of hiding them in the template.

Expected early setup sequence:

1. choose `pnpm` and create the package shape;
2. add TypeScript, `tsgo`, `oxlint`, `oxfmt`, Ultracite, and Git/Lefthook in one visible foundation pass;
3. install a local `grill-with-docs` skill from Matt Pocock's `grill-me` pattern;
4. use the grill to write `VISION.md` as the repo compass for future agents and humans: what the tool is for, safe boundaries, stop points, and non-goals;
5. build the local spine quickly: issue fixture → review packet → agent review result → summary;
6. make the same safe command repeat on a learner Mac with a LaunchAgent path;
7. add a notification sink: local outbox first, Discord webhook only if setup is easy;
8. attach GitHub or Linear only when auth is boring enough not to steal the hour.

Use Git for history while learning. Keep checkpoints useful, but do not turn every tiny step into a ceremony.
