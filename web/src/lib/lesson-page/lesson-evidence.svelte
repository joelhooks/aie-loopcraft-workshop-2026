<script lang="ts">
  interface Props {
    items: string[];
  }

  const { items }: Props = $props();
</script>

<ul class="lesson-evidence-list">
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
