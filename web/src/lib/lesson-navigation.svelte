<script lang="ts">
  import { getAdjacentLesson, lessons, type Lesson } from "./workshop-data";

  export let lesson: Lesson;

  $: adjacent = getAdjacentLesson(lesson.id);
</script>

<nav class="lesson-pagination" aria-label="Lesson pagination">
  <div>
    {#if adjacent.previous}
      <span>Previous</span>
      <a href={adjacent.previous.href}>{adjacent.previous.number}. {adjacent.previous.shortTitle}</a>
    {:else}
      <span>Start here</span>
      <a href="/">Workshop overview</a>
    {/if}
  </div>

  <a class="all-lessons-link" href="/lessons/">All lessons</a>

  <div class="next-lesson">
    {#if adjacent.next}
      <span>Next</span>
      <a href={adjacent.next.href}>{adjacent.next.number}. {adjacent.next.shortTitle}</a>
    {:else}
      <span>After the hour</span>
      <a href={lessons[0].href}>Replay from Lesson 01</a>
    {/if}
  </div>
</nav>
