<script lang="ts">
  interface Props {
    fields: string[];
  }

  const { fields }: Props = $props();
</script>

{#if fields.length}
  <ul class="lesson-proof-list lesson-proof-fields">
    {#each fields as field}
      <li>{field}</li>
    {/each}
  </ul>
{:else}
  <p class="lesson-proof-empty">Save the file changed, command run, output seen, stop condition, and receipt path for this step.</p>
{/if}
