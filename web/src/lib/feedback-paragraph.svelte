<script lang="ts">
  import { browser } from "$app/environment";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import type { IconSvgElement } from "@hugeicons/svelte";
  import {
    AlertCircleIcon,
    ChatEditIcon,
    ConfusedIcon,
    SparklesIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
  } from "@hugeicons/core-free-icons";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    id: string;
    note?: string;
    storagePrefix?: string;
  }

  type Reaction = "good" | "sharp" | "important" | "confusing" | "off" | "";

  const reactions: Array<{
    id: Exclude<Reaction, "">;
    label: string;
    icon: IconSvgElement;
  }> = [
    { id: "good", label: "good", icon: ThumbsUpIcon },
    { id: "sharp", label: "sharp", icon: SparklesIcon },
    { id: "important", label: "important", icon: AlertCircleIcon },
    { id: "confusing", label: "confusing", icon: ConfusedIcon },
    { id: "off", label: "off", icon: ThumbsDownIcon },
  ];

  const {
    children,
    id,
    note,
    storagePrefix = "tufte-mdsvx-feedback:",
  }: Props = $props();
  const storageKey = $derived(`${storagePrefix}${id}`);
  let drawerOpen = $state(false);
  let reaction = $state<Reaction>("");
  let steering = $state("");
  let hydrated = $state(false);

  onMount(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { reaction?: Reaction; vote?: Reaction; steering?: string };
        reaction = parsed.reaction ?? parsed.vote ?? "";
        steering = parsed.steering ?? "";
      } catch {
        // Ignore stale local prototype feedback.
      }
    }
    hydrated = true;
  });

  $effect(() => {
    if (!browser || !hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ reaction, steering }));
  });
</script>

<section class="feedback-paragraph" data-paragraph-id={id} data-feedback-section-id={id}>
  <div class="paragraph-copy">
    {@render children()}
  </div>
  <div class="feedback-bar" aria-label={`Section feedback for ${id}`}>
    <button
      type="button"
      class="feedback-toggle"
      class:active={drawerOpen}
      aria-expanded={drawerOpen}
      onclick={() => (drawerOpen = !drawerOpen)}
    >
      <HugeiconsIcon icon={ChatEditIcon} size={14} strokeWidth={1.8} />
      <span>steer</span>
    </button>

    <div class="reaction-row" aria-label="Section reactions">
      {#each reactions as item}
        <button
          type="button"
          class:active={reaction === item.id}
          aria-label={item.label}
          aria-pressed={reaction === item.id}
          title={item.label}
          onclick={() => (reaction = reaction === item.id ? "" : item.id)}
        >
          <HugeiconsIcon icon={item.icon} size={15} strokeWidth={1.8} />
        </button>
      {/each}
    </div>

    {#if drawerOpen}
      <div class="drawer-body">
        {#if note}
          <p class="agent-note">{note}</p>
        {/if}
        <textarea bind:value={steering} placeholder="What should the next version do differently?"></textarea>
      </div>
    {/if}
  </div>
</section>
