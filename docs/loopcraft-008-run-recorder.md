# Loopcraft 008 run recorder

The recorder is a small JSONL trail for improving the workshop from a real run. It should capture the moments that change the lesson, not every token or terminal scrollback.

## Command

```sh
pnpm run record:event -- --type milestone --lesson 03 --note "Lakebed matched the local check" --source receipts/lakebed-compare-latest.json
pnpm run record:summary
```

Default output:

```txt
recordings/run-008/events.jsonl
recordings/run-008/latest.json
```

Use a different run id when needed:

```sh
LOOPCRAFT_RUN_ID=run-008-dress-rehearsal pnpm run record:event -- --type lesson_started --lesson 01 --note "Started the first full pass"
```

## Event types

| Type | Use it when |
| --- | --- |
| `lesson_started` | A lesson/pass begins. Capture the starting context. |
| `prompt_sent` | A starter prompt or important follow-up prompt is used. |
| `milestone` | A visible capability starts working. |
| `teaching_moment` | A tool, guardrail, or choice gets a plain-language reason. |
| `friction` | A command, URL, concept, or state confused the person or agent. |
| `checkpoint` | A proof gate is reached: command, receipt, screenshot, or comparison. |
| `learning_goal` | The person should now be able to do something unaided. |
| `support_fade` | A scaffold can be removed or made less explicit on the next pass. |
| `next_stretch` | The next doable challenge just beyond the current comfort zone. |
| `receipt` | A durable artifact should be linked into the run trail. |
| `note` | A small observation that does not fit the other types. |

## Good recording examples

```sh
pnpm run record:event -- \
  --type teaching_moment \
  --lesson 02 \
  --note "Fast checks keep feedback inside the agent loop; strict checks stop hand-wavy progress" \
  --source agents/skills/loopcraft-ta/SKILL.md \
  --tags guardrails,checks
```

```sh
pnpm run record:event -- \
  --type friction \
  --lesson 03 \
  --note "The browser was on a laptop, so localhost:3000 pointed at the wrong machine" \
  --source docs/host-container-urls.md \
  --tags topology,lakebed
```

```sh
pnpm run record:event -- \
  --type next_stretch \
  --lesson 04 \
  --note "After Pi can run check-now, ask for one stale-status recovery drill without giving the exact command"
```

## Rules

- Do not record raw transcripts, secrets, tokens, or private machine paths.
- Prefer source pointers over pasted blobs.
- Record friction while it is fresh. That is the useful stuff.
- Keep notes short enough to scan while planning the next pass.
- Summaries can be public; raw recordings should be reviewed before publishing.
