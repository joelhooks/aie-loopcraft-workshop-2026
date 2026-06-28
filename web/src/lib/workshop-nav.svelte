<script lang="ts">
  import { lessons, site } from "./workshop-data";

  export let current: string | undefined = undefined;
</script>

<nav class="workshop-nav" aria-label="Workshop navigation">
  <a class:active={current === "home"} href="/">Workshop</a>
  <a class:active={current === "lessons"} href="/lessons/">Lessons</a>
  <a href={site.repo}>Repo</a>
</nav>

<nav class="lesson-strip" aria-label="Lesson shortcuts">
  {#each lessons as lesson}
    <a class:active={current === lesson.id} href={lesson.href} title={lesson.title}>{lesson.number}</a>
  {/each}
</nav>
