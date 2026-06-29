<script lang="ts">
  interface Props {
    have: string[];
    add: string[];
    stop: string[];
    exampleTitle?: string;
    example?: string;
  }

  const { have, add, stop, exampleTitle = "Tiny shape", example }: Props = $props();
</script>

<div class="lesson-scaffold">
  <div class="lesson-scaffold-grid">
    <section>
      <h3>You already have</h3>
      <ul>
        {#each have as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3>Add now</h3>
      <ul>
        {#each add as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3>Stop before</h3>
      <ul>
        {#each stop as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>
  </div>

  {#if example}
    <section class="lesson-scaffold-example">
      <h3>{exampleTitle}</h3>
      <pre><code>{example}</code></pre>
    </section>
  {/if}
</div>

<style>
  .lesson-scaffold {
    display: grid;
    gap: 14px;
    margin: 16px 0 28px;
  }

  .lesson-scaffold-grid {
    display: grid;
    gap: 12px;
  }

  .lesson-scaffold section {
    background: #fffdf8;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
  }

  .lesson-scaffold h3 {
    color: var(--text);
    margin: 0 0 10px;
  }

  .lesson-scaffold ul {
    color: var(--text-dim);
    display: grid;
    font-family: var(--font-sans);
    font-size: 14px;
    gap: 8px;
    line-height: 1.45;
    margin: 0;
    padding-left: 18px;
  }

  .lesson-scaffold-example pre {
    margin-bottom: 0;
  }

  @media (min-width: 820px) {
    .lesson-scaffold-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
