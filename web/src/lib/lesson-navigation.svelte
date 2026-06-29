<script lang="ts">
  import { page } from "$app/state";
  import { isFeedbackEnabled, withFeedback } from "./feedback";
  import { getAdjacentLesson, lessons, type Lesson } from "./workshop-data";

  interface Props {
    lesson: Lesson;
  }

  const { lesson }: Props = $props();
  const adjacent = $derived(getAdjacentLesson(lesson.id));
  const feedbackEnabled = $derived(isFeedbackEnabled(page.url));
  const href = $derived((value: string) => withFeedback(value, feedbackEnabled));
</script>

<nav class="lesson-pagination" aria-label="Lesson pagination">
  <div>
    {#if adjacent.previous}
      <span>Previous</span>
      <a href={href(adjacent.previous.href)}>{adjacent.previous.number}. {adjacent.previous.shortTitle}</a>
    {:else}
      <span>Start here</span>
      <a href={href("/")}>Workshop overview</a>
    {/if}
  </div>

  <a class="all-lessons-link" href={href("/lessons/")}>All lessons</a>

  <div class="next-lesson">
    {#if adjacent.next}
      <span>Next</span>
      <a href={href(adjacent.next.href)}>{adjacent.next.number}. {adjacent.next.shortTitle}</a>
    {:else}
      <span>After the hour</span>
      <a href={href(lessons[0].href)}>Replay from Lesson 01</a>
    {/if}
  </div>
</nav>
