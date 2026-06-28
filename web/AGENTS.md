# Agent instructions for `web/`

This is the public Wzrrd site for the Loopcraft workshop learner repo.

## Mission

Keep the workshop page useful as a learner-facing guide:

1. explain the current lesson path;
2. show the prepared rig honestly;
3. keep receipts public-safe;
4. publish the static build to the `loopcraft-hour-cut` Wzrrd slug.

## Hard rules

- No secrets, tokens, private paths, raw transcripts, customer data, or private operational details.
- Keep `pageRef.slug` as `loopcraft-hour-cut` unless Joel explicitly changes the public URL.
- Increment `pageRef.version` when paragraph text, lesson data, or diagram assets materially change.
- Keep `feedbackParagraphs` synced with exported `FeedbackParagraph` ids.
- Commit D2 sources and generated SVGs together.
- Run `bun run check && bun run build` before publishing or claiming the site works.
- Publish `build/`, not source files:

```sh
wzrrd publish --file ./build --slug loopcraft-hour-cut --expires-in 7d
```

## Design taste

Use plain prose, a few strong diagrams, and receipts near the claims. Avoid dashboard soup, badge lasagna, giant card grids, and fake metrics.

## Files

```txt
src/routes/+page.svx
src/app.css
src/lib/*.svelte
static/*.d2
static/*.svg
```
