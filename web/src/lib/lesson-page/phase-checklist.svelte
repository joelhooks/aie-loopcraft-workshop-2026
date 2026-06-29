<script lang="ts">
  import { onMount } from "svelte";
  import { site } from "$lib/workshop-data";

  type PhaseItem = string | {
    id?: string;
    text: string;
  };

  type Phase = {
    id?: string;
    title: string;
    items: PhaseItem[];
  };

  interface Props {
    lessonId: string;
    phases: Phase[];
  }

  const { lessonId, phases }: Props = $props();

  let completedItems = $state<Record<string, boolean>>({});

  const checklistItems = $derived(
    phases.flatMap((phase, phaseIndex) =>
      phase.items.map((item, itemIndex) => ({
        id: itemId(phase, item, phaseIndex, itemIndex),
        inputId: `lesson-check-${lessonId}-${itemId(phase, item, phaseIndex, itemIndex)}`,
        text: itemText(item),
      }))
    )
  );
  const completedCount = $derived(checklistItems.filter((item) => completedItems[item.id]).length);

  onMount(() => {
    const restored: Record<string, boolean> = {};

    for (const item of checklistItems) {
      restored[item.id] = readItem(item.id);
    }

    completedItems = restored;
  });

  function itemText(item: PhaseItem) {
    return typeof item === "string" ? item : item.text;
  }

  function itemId(phase: Phase, item: PhaseItem, phaseIndex: number, itemIndex: number) {
    if (typeof item !== "string" && item.id) return item.id;
    const phaseId = phase.id ?? `phase-${phaseIndex + 1}`;
    return `${phaseId}-item-${itemIndex + 1}`;
  }

  function storageKey(itemId: string) {
    return `loopcraft:${site.version}:lesson:${lessonId}:item:${itemId}`;
  }

  function readItem(itemId: string) {
    try {
      return localStorage.getItem(storageKey(itemId)) === "done";
    } catch {
      return false;
    }
  }

  function setItem(itemId: string, checked: boolean) {
    completedItems = { ...completedItems, [itemId]: checked };

    try {
      if (checked) {
        localStorage.setItem(storageKey(itemId), "done");
      } else {
        localStorage.removeItem(storageKey(itemId));
      }
    } catch {
      // Completion state is nice-to-have. The checklist still works without storage.
    }
  }

  function handleChange(event: Event, itemId: string) {
    setItem(itemId, (event.currentTarget as HTMLInputElement).checked);
  }

  function resetLesson() {
    const cleared: Record<string, boolean> = {};

    for (const item of checklistItems) {
      cleared[item.id] = false;
      try {
        localStorage.removeItem(storageKey(item.id));
      } catch {
        // Keep resetting visible state even if storage is blocked.
      }
    }

    completedItems = cleared;
  }
</script>

<div class="lesson-checklist" aria-live="polite">
  <div class="lesson-checklist-header">
    <p class="lesson-checklist-progress">{completedCount}/{checklistItems.length} done</p>
    <button type="button" class="lesson-checklist-reset" onclick={resetLesson}>Reset this lesson</button>
  </div>

  <div class="lesson-phase-grid">
    {#each phases as phase, phaseIndex}
      <section class="lesson-phase-card">
        <h3>{phase.title}</h3>
        <ul class="lesson-checklist-items">
          {#each phase.items as item, itemIndex}
            {@const id = itemId(phase, item, phaseIndex, itemIndex)}
            {@const inputId = `lesson-check-${lessonId}-${id}`}
            <li class:complete={completedItems[id]}>
              <input
                id={inputId}
                type="checkbox"
                checked={completedItems[id] ?? false}
                onchange={(event) => handleChange(event, id)}
              />
              <label for={inputId}>{itemText(item)}</label>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>
