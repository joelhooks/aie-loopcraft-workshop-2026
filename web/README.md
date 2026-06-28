# Loopcraft workshop site

This is the Wzrrd/SvelteKit site for the public learner repo.

It started from the teacher-surface review page, but this is now the public workshop site: the root describes the workshop, and each lesson has its own MDSvX page with navigation.

## Slug

```txt
aie-loopcraft-workshop-2026
```

Published URL:

```txt
https://aie-loopcraft-workshop-2026.wzrrd.sh/
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
wzrrd publish --file ./build --slug aie-loopcraft-workshop-2026
```

The slug matches the public repo name so the site and source are easy to pair.

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
