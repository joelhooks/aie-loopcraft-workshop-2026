<script lang="ts">
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import type { IconSvgElement } from "@hugeicons/svelte";
  import { AlertCircleIcon, ChatEditIcon, CopyCheckIcon, SparklesIcon } from "@hugeicons/core-free-icons";

  type Tool = {
    name: string;
    text: string;
    icon: "spark" | "chat" | "guard" | "check";
  };

  export let tools: Tool[] = [];

  const icons: Record<Tool["icon"], IconSvgElement> = {
    spark: SparklesIcon,
    chat: ChatEditIcon,
    guard: AlertCircleIcon,
    check: CopyCheckIcon,
  };
</script>

<div class="tool-grid">
  {#each tools as tool}
    <section>
      <HugeiconsIcon icon={icons[tool.icon]} size={22} strokeWidth={1.8} />
      <h3>{tool.name}</h3>
      <p>{tool.text}</p>
    </section>
  {/each}
</div>
