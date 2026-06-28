<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  export interface LessonPassItem {
    id: string;
    title: string;
    challenge: string;
    starterPrompt: string;
    buildOperate: string;
    observe: string;
    discuss: string;
    checkpoint: string;
    drill: string;
    next: string;
    receipt: string;
  }

  interface Props {
    lessons: LessonPassItem[];
    storagePrefix?: string;
  }

  const {
    lessons,
    storagePrefix = "tufte-mdsvx-feedback:",
  }: Props = $props();

  let notes = $state<Record<string, string>>({});
  let hydrated = $state(false);

  function storageKey(id: string) {
    return `${storagePrefix}lesson:${id}`;
  }

  onMount(() => {
    const stored: Record<string, string> = {};
    for (const lesson of lessons) {
      stored[lesson.id] = localStorage.getItem(storageKey(lesson.id)) ?? "";
    }
    notes = stored;
    hydrated = true;
  });

  $effect(() => {
    if (!browser || !hydrated) return;
    for (const lesson of lessons) {
      const note = notes[lesson.id] ?? "";
      if (note.trim()) {
        localStorage.setItem(storageKey(lesson.id), note);
      } else {
        localStorage.removeItem(storageKey(lesson.id));
      }
    }
  });
</script>

<section class="lesson-pass" aria-label="Lesson pass">
  {#each lessons as lesson, index}
    <article class="lesson-card">
      <p class="lesson-kicker">Lesson {String(index + 1).padStart(2, "0")}</p>
      <h3>{lesson.title}</h3>
      <dl>
        <div>
          <dt>Challenge</dt>
          <dd>{lesson.challenge}</dd>
        </div>
        <div>
          <dt>Prompt</dt>
          <dd>{lesson.starterPrompt}</dd>
        </div>
        <div>
          <dt>Build/operate</dt>
          <dd>{lesson.buildOperate}</dd>
        </div>
        <div>
          <dt>Observe</dt>
          <dd>{lesson.observe}</dd>
        </div>
        <div>
          <dt>Discuss</dt>
          <dd>{lesson.discuss}</dd>
        </div>
        <div>
          <dt>Checkpoint</dt>
          <dd>{lesson.checkpoint}</dd>
        </div>
        <div>
          <dt>Drill</dt>
          <dd>{lesson.drill}</dd>
        </div>
        <div>
          <dt>Next</dt>
          <dd>{lesson.next}</dd>
        </div>
        <div>
          <dt>Run-06 receipt</dt>
          <dd>{lesson.receipt}</dd>
        </div>
      </dl>
      <label class="lesson-notes" for={`lesson-notes-${lesson.id}`}>
        <span>Test notes for this lesson</span>
        <textarea
          id={`lesson-notes-${lesson.id}`}
          placeholder="What felt clear, slow, missing, or worth cutting when you work this lesson?"
          value={notes[lesson.id] ?? ""}
          oninput={(event) => {
            notes[lesson.id] = event.currentTarget.value;
          }}
        ></textarea>
      </label>
    </article>
  {/each}
</section>
