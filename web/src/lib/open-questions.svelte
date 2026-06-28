<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  export interface OpenQuestion {
    id: string;
    prompt: string;
    answer?: string;
    hint?: string;
    placeholder?: string;
  }

  interface Props {
    questions: OpenQuestion[];
    storagePrefix?: string;
  }

  const {
    questions,
    storagePrefix = "tufte-mdsvx-feedback:",
  }: Props = $props();

  let answers = $state<Record<string, string>>({});
  let hydrated = $state(false);

  function storageKey(id: string) {
    return `${storagePrefix}question:${id}`;
  }

  onMount(() => {
    const stored: Record<string, string> = {};
    for (const question of questions) {
      stored[question.id] = localStorage.getItem(storageKey(question.id)) ?? question.answer ?? "";
    }
    answers = stored;
    hydrated = true;
  });

  $effect(() => {
    if (!browser || !hydrated) return;
    for (const question of questions) {
      const answer = answers[question.id] ?? "";
      if (answer.trim()) {
        localStorage.setItem(storageKey(question.id), answer);
      } else {
        localStorage.removeItem(storageKey(question.id));
      }
    }
  });
</script>

<div class="open-question-grid">
  {#each questions as question, index}
    <section class="open-question-card">
      <label for={`open-question-${question.id}`}>
        <span class="open-question-number">{String(index + 1).padStart(2, "0")}</span>
        <span>{question.prompt}</span>
      </label>
      {#if question.hint}
        <p>{question.hint}</p>
      {/if}
      <textarea
        id={`open-question-${question.id}`}
        placeholder={question.placeholder ?? "Type the answer you want the next draft to preserve…"}
        value={answers[question.id] ?? ""}
        oninput={(event) => {
          answers[question.id] = event.currentTarget.value;
        }}
      ></textarea>
    </section>
  {/each}
</div>
