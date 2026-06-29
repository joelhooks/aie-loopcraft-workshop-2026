<script lang="ts">
  import { page } from "$app/state";
  import { isFeedbackEnabled, withFeedback } from "./feedback";
  import { lessons, site } from "./workshop-data";

  interface Props {
    current?: string;
  }

  const { current = undefined }: Props = $props();
  const feedbackEnabled = $derived(isFeedbackEnabled(page.url));
  const href = $derived((value: string) => withFeedback(value, feedbackEnabled));
</script>

<nav class="workshop-nav" aria-label="Workshop navigation">
  <a class:active={current === "home"} href={href("/")}>Workshop</a>
  <a class:active={current === "lessons"} href={href("/lessons/")}>Lessons</a>
  <a href={site.repo}>Repo</a>
</nav>

<nav class="lesson-strip" aria-label="Lesson shortcuts">
  {#each lessons as lesson}
    <a class:active={current === lesson.id} href={href(lesson.href)} title={lesson.title}>{lesson.number}</a>
  {/each}
</nav>
