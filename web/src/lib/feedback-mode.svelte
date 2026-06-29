<script lang="ts">
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { feedbackStoragePrefix, isFeedbackEnabled } from "./feedback";
  import FeedbackParagraph from "./feedback-paragraph.svelte";

  interface Props {
    children: Snippet;
    id: string;
    note?: string;
  }

  const { children, id, note }: Props = $props();
  const enabled = $derived(isFeedbackEnabled(page.url));
</script>

{#if enabled}
  <FeedbackParagraph {id} {note} storagePrefix={feedbackStoragePrefix}>
    {@render children()}
  </FeedbackParagraph>
{:else}
  {@render children()}
{/if}
