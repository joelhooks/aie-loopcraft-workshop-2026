# Agent instructions for `web/`

This is the public Wzrrd site for the Loopcraft workshop learner repo.

## Mission

Keep the workshop page useful as a learner-facing guide:

1. explain the current lesson path;
2. show the prepared rig honestly;
3. keep receipts public-safe;
4. publish the static build to the `aie-loopcraft-workshop-2026` Wzrrd slug.

## Hard rules

- No secrets, tokens, private paths, raw transcripts, customer data, or private operational details.
- Keep the public slug as `aie-loopcraft-workshop-2026` unless Joel explicitly changes the public URL.
- Increment `site.version` in `src/lib/workshop-data.ts` when paragraph text, lesson data, routes, or diagram assets materially change.
- Keep lesson navigation in sync with `lessons` in `src/lib/workshop-data.ts`.
- Commit D2 sources and generated SVGs together.
- Run `bun run check && bun run build` before publishing or claiming the site works.
- Publish `build/`, not source files:

```sh
wzrrd publish --file ./build --slug aie-loopcraft-workshop-2026
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
