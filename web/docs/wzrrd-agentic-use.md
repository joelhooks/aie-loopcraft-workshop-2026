# Agentic wzrrd use

This is the playbook for agents turning this template into a shareable wzrrd review page.

## 1. Decide the page job

Before editing, write one sentence for the page job:

```text
This page helps <audience> decide/understand/review <thing>.
```

If the page job is vague, ask. Otherwise the page turns into pretty fog.

## 2. Build from receipts

Collect the smallest useful receipt set:

- source files or docs
- command outputs
- screenshots
- links
- logs
- issue/PR references
- human decisions

Use receipts to support claims. Do not paste huge raw evidence into the main prose.

## 3. Write the narrative first

Order the report like this:

1. lede: what matters and why;
2. current state;
3. evidence and receipts;
4. tradeoffs or risks;
5. next action.

The report can use components, but the prose owns the page.

## 4. Add paragraph feedback

Wrap paragraphs that a reviewer may correct:

```svelte
<FeedbackParagraph id="decision-ask" storagePrefix={feedbackStoragePrefix} note="What proof this paragraph depends on.">
  <p>The decision ask goes here.</p>
</FeedbackParagraph>
```

Rules:

- ids are stable slugs;
- no generated counters;
- one paragraph per wrapper;
- notes are private-ish steering hints visible on the page, so keep them safe;
- update `feedbackParagraphs` when ids change.

## 5. Exportable feedback contract

The bottom copy button exports:

```json
{
  "type": "tufte_mdsvx_feedback",
  "ref": { "slug": "...", "version": "...", "run": "...", "url": "..." },
  "items": [{ "p": "paragraph-id", "r": "important", "s": "steering text" }]
}
```

When a human pastes this payload back:

- match by `ref` first;
- match paragraphs by `p`;
- apply `s` as steering;
- treat `r` as priority/sentiment;
- increment `pageRef.version` after edits.

## 6. Publish safely

Run:

```bash
bun run check
bun run build
wzrrd publish --file ./build --slug <slug> --expires-in 7d
```

Before sharing the URL, inspect the page for:

- phone readability;
- broken diagrams;
- private data leakage;
- localhost links;
- stale metadata;
- missing title/description.

## 7. Handoff format

Final answer should include:

```text
URL: https://<slug>.wzrrd.sh/
Files changed: ...
Checks: bun run check, bun run build
Notes: warnings or risks
```
