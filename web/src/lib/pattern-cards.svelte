<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  interface PatternReceipt {
    href: string;
    label: string;
  }

  interface PatternItem {
    id: string;
    receipts: PatternReceipt[];
    title: string;
    why: string;
  }

  interface Props {
    items: PatternItem[];
    label?: string;
    storagePrefix?: string;
  }

  const {
    items,
    label = "Pattern cards",
    storagePrefix = "tufte-mdsvx-feedback:",
  }: Props = $props();

  let feedback = $state<Record<string, string>>({});
  let hydrated = $state(false);

  function storageKey(id: string) {
    return `${storagePrefix}pattern:${id}`;
  }

  onMount(() => {
    const stored: Record<string, string> = {};
    for (const item of items) {
      stored[item.id] = localStorage.getItem(storageKey(item.id)) ?? "";
    }
    feedback = stored;
    hydrated = true;
  });

  $effect(() => {
    if (!browser || !hydrated) return;
    for (const item of items) {
      const note = feedback[item.id] ?? "";
      if (note.trim()) {
        localStorage.setItem(storageKey(item.id), note);
      } else {
        localStorage.removeItem(storageKey(item.id));
      }
    }
  });
</script>

<section class="pattern-cards" aria-label={label}>
  {#each items as item}
    <article class="pattern-card">
      <h3>{item.title}</h3>
      <div class="pattern-card-receipts" aria-label="Receipts">
        <span>Receipt</span>
        {#each item.receipts as receipt}
          <a href={receipt.href}><code>{receipt.label}</code></a>
        {/each}
      </div>
      <p>{item.why}</p>
      <label class="pattern-card-feedback" for={`pattern-feedback-${item.id}`}>
        <span>Feedback for this card</span>
        <textarea
          id={`pattern-feedback-${item.id}`}
          placeholder="What should this card say differently?"
          value={feedback[item.id] ?? ""}
          oninput={(event) => {
            feedback[item.id] = event.currentTarget.value;
          }}
        ></textarea>
      </label>
    </article>
  {/each}
</section>
