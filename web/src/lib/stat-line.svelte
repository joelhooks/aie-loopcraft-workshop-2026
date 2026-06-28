<script lang="ts">
  interface Props {
    items: { label: string; value: string }[];
  }

  const { items = [] }: Props = $props();
</script>

<dl class="stat-line" aria-label="Site summary">
  {#each items as item}
    <div>
      <dt>{item.label}</dt>
      <dd>{item.value}</dd>
    </div>
  {/each}
</dl>
