<script lang="ts">
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import type { IconSvgElement } from "@hugeicons/svelte";
  import { AlertCircleIcon, ChatEditIcon, CopyCheckIcon, SparklesIcon } from "@hugeicons/core-free-icons";

  type Tool = {
    name: string;
    summary: string;
    doesHere: string;
    touchWhen: string;
    links?: { label: string; href: string }[];
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
    <section class="tool-card">
      <div class="tool-card-heading">
        <HugeiconsIcon icon={icons[tool.icon]} size={22} strokeWidth={1.8} />
        <h3>{tool.name}</h3>
      </div>

      <p class="tool-summary">{tool.summary}</p>

      <dl>
        <div>
          <dt>What it does here</dt>
          <dd>{tool.doesHere}</dd>
        </div>
        <div>
          <dt>When you touch it</dt>
          <dd>{tool.touchWhen}</dd>
        </div>
      </dl>

      {#if tool.links?.length}
        <div class="tool-links" aria-label={`${tool.name} links`}>
          {#each tool.links as link}
            <a href={link.href}>{link.label}</a>
          {/each}
        </div>
      {/if}
    </section>
  {/each}
</div>

<style>
  .tool-grid {
    display: grid;
    gap: 14px;
    margin: 22px 0 10px;
  }

  .tool-card {
    background: #fffdf8;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px;
  }

  .tool-card-heading {
    align-items: center;
    display: flex;
    gap: 9px;
    margin-bottom: 8px;
  }

  .tool-card-heading :global(svg) {
    color: var(--accent);
    flex: 0 0 auto;
  }

  .tool-card h3 {
    margin: 0;
  }

  .tool-summary {
    color: var(--text);
    font-size: 16px;
    line-height: 1.45;
    margin: 0 0 12px;
  }

  dl {
    display: grid;
    gap: 10px;
    margin: 0;
  }

  dl div {
    display: grid;
    gap: 2px;
  }

  dt {
    color: var(--text-faint);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    line-height: 1.3;
    text-transform: uppercase;
  }

  dd {
    color: var(--text-dim);
    font-size: 15px;
    line-height: 1.45;
    margin: 0;
  }

  .tool-links {
    display: flex;
    flex-wrap: wrap;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 800;
    gap: 8px 12px;
    margin-top: 13px;
  }

  .tool-links a {
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    display: inline-flex;
    padding: 5px 9px;
    text-decoration: none;
  }

  .tool-links a:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fffdf8;
  }
</style>
