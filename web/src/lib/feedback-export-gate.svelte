<script lang="ts">
  import { page } from "$app/state";
  import { feedbackStoragePrefix, isFeedbackEnabled } from "./feedback";
  import FeedbackExport from "./feedback-export.svelte";

  interface LessonExport {
    id: string;
    title: string;
  }

  interface PatternExport {
    id: string;
    title: string;
  }

  interface QuestionExport {
    id: string;
    prompt: string;
  }

  interface Props {
    paragraphs: string[];
    run: string;
    slug: string;
    url: string;
    version: string;
    lessons?: LessonExport[];
    patterns?: PatternExport[];
    questions?: QuestionExport[];
  }

  const {
    paragraphs,
    run,
    slug,
    url,
    version,
    lessons = [],
    patterns = [],
    questions = [],
  }: Props = $props();
  const enabled = $derived(isFeedbackEnabled(page.url));
</script>

{#if enabled}
  <div class="feedback-mode-banner">
    <strong>Feedback mode is on.</strong>
    Use the steer/reaction controls on each section, then copy the JSON below back into Pi.
  </div>
  <FeedbackExport
    {paragraphs}
    {run}
    {slug}
    {url}
    {version}
    {lessons}
    {patterns}
    {questions}
    storagePrefix={feedbackStoragePrefix}
  />
{/if}
