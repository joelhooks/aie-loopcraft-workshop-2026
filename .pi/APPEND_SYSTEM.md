# Loopcraft local Pi behavior

This repo is the public workshop project. Keep visible copy direct and useful for the person building the loop. Do not leak backstage wording into the site, lesson pages, prompts, README, or public agent docs.

## Core design principle: glossary as appendix

Keep a public glossary appendix at `/glossary/` for terms that carry workshop meaning: tools, guardrails, loop states, receipts, dispatch, gardener work, specialist review, and supervisor runtime.

When a lesson or public doc introduces a term that might slow someone down:

1. define it in plain language in the glossary;
2. link the term's glossary entry back to the lesson where it matters most;
3. link the lesson/public page back to `/glossary/` when the term becomes important enough to pause on;
4. keep definitions concrete: what it means here, when to use it, and what evidence it should leave.

Do not turn the glossary into theory soup. If a term does not help someone run, inspect, decide, or stop the loop, leave it out.

## Broad lesson editing

When the ask touches home plus multiple lessons, do **not** grind through everything serially in one giant pass.

Use parallel subagents for broad read/review work:

1. First inspect available subagents with the subagent list command/tool.
2. Split work by non-overlapping areas, for example:
   - home page and public agent docs;
   - lessons 01-02;
   - lessons 03-05;
   - lessons 06-08.
3. Prefer fresh-context read-only scouts/reviewers. Ask each child for exact path, line, quote, why it is a problem, and proposed replacement.
4. Keep one writer in the parent session. Do not let multiple agents edit the same files at once.
5. For actual copy edits, prefer the project agent `loop.lesson-editor` only after assigning exact files. One lesson editor owns one lesson/file group; no overlapping edits.
6. Synthesize the findings, apply the smallest useful edits, then run the site checks.

Good review child prompt shape:

```txt
Review only these files: web/src/routes/lessons/03-lakebed-projection/+page.svx and lessons/03-lakebed-projection.md.
Find copy that sounds like backstage workshop planning instead of direct guidance for the person building the loop.
Return exact path, line, quote, and a suggested replacement. Do not edit files.
```

Good lesson-editor prompt shape:

```txt
Edit only these files: web/src/routes/lessons/03-lakebed-projection/+page.svx and lessons/03-lakebed-projection.md.
Remove backstage/meta language and make the lesson read as direct guidance for the person building the loop. Preserve feedback IDs, prompt blocks, receipt/checkpoint structure, and technical intent. Run a narrow meta-language search on those files and `pnpm run web:check` after editing.
```

## Copy editing tool

Use the local Pi tool instead of writing throwaway scripts for broad copy audits and exact replacements.

Tool: `loopcraft_copy_edit`

Common calls:

```json
{ "action": "audit", "scope": "site" }
```

```json
{ "action": "audit", "scope": "all", "terms": ["hour cut", "seam", "run-06", "teacher", "learner-facing", "operator surface"] }
```

```json
{ "action": "replace", "scope": "site", "oldText": "Hour-cut system seam", "newText": "Visible local loop", "dryRun": true }
```

If the dry run is right, rerun with `"dryRun": false`.

Slash command for a quick visible scan:

```txt
/loop-copy-audit
```

The tool intentionally scans public copy surfaces:

- `web/src/routes/**`
- `web/src/lib/workshop-data.ts`
- `web/static/**`
- `lessons/**` when `scope` is `lessons` or `all`
- `README.md`, `AGENTS.md`, `WORKSHOP_RIG.md`, and `docs/setup.md` when `scope` is `docs` or `all`

## Copy cleanup rule

Prefer direct `you/we/this project` wording. Replace backstage language with what the person can do, inspect, decide, or run.

Avoid visible terms like:

- hour cut;
- seam, when it means internal workshop design rather than a real code boundary;
- Run 06, scar, fossil, past-run archaeology;
- teacher, instructor, learner-facing, workshop design;
- operator surface/cockpit/pane when plain `Pi pane`, `view`, `controls`, or `you` works better.

## Validation after site edits

After meaningful site or lesson edits, run:

```sh
pnpm run web:check
pnpm run web:build
```

For copy-cleanup claims, also run an audit/search before saying it is fixed:

```sh
rg -n -i "hour cut|hour-cut|run-06|run 06|scar|fossil|teacher|instructor|learner-facing|workshop design|course-design" web/src/routes web/src/lib web/static lessons README.md WORKSHOP_RIG.md docs/setup.md AGENTS.md
```
