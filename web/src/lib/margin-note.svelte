<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    id: string;
    number: string;
  }

  const { children, id, number }: Props = $props();
  const noteId = $derived(`note-${id}`);
  const refId = $derived(`ref-${id}`);
</script>

<sup class="footnote-ref" id={refId}><a href={`#${noteId}`}>{number}</a></sup>
<span class="margin-note" id={noteId}>
  <span class="margin-note-number">{number}</span>
  {@render children()}
</span>
