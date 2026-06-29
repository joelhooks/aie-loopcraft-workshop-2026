<script lang="ts">
  import PromptBlock from "$lib/prompt-block.svelte";

  export type ExplorationPrompt = {
    label: string;
    text: string;
  };

  interface Props {
    lessonId: string;
    prompts: ExplorationPrompt[];
  }

  const { lessonId, prompts }: Props = $props();
</script>

<div class="exploration-prompts">
  <p class="exploration-prompts-intro">Use these when you want to ask an agent for a narrower pass instead of handing it the whole lesson.</p>
  {#each prompts as prompt, index}
    <PromptBlock
      id={`lesson-${lessonId}-exploration-${index + 1}`}
      label={prompt.label}
      text={prompt.text}
      copyLabel="Copy prompt"
      copiedLabel="Copied"
    />
  {/each}
</div>
