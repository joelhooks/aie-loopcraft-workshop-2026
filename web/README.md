# Loopcraft workshop site

This is the Wzrrd/SvelteKit site for the public learner repo.

It is copied from the teacher-surface hour-cut page so the workshop page can now live with the workshop code instead of depending on the parent repo.

## Slug

```txt
loopcraft-hour-cut
```

Published URL:

```txt
https://loopcraft-hour-cut.wzrrd.sh/
```

## Develop

```sh
cd web
bun install
bun run check
bun run build
```

## Publish

```sh
cd web
bun run check
bun run build
wzrrd publish --file ./build --slug loopcraft-hour-cut --expires-in 7d
```

Use the same slug while we migrate the source of truth into this public repo.

## Main files

```txt
src/routes/+page.svx   # page copy and lesson data
src/lib/*.svelte       # report components
src/app.css            # visual theme
static/*.svg           # generated diagrams
static/*.d2            # diagram sources
```

## Public boundary

Do not publish raw transcripts, private notes, secrets, customer data, machine-local paths, or private repo details. Link only to public-safe receipts.
