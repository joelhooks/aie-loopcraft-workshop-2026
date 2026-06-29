<script lang="ts">
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Copy01Icon, CopyCheckIcon } from "@hugeicons/core-free-icons";

  interface Props {
    id: string;
    text: string;
    label?: string;
    copyLabel?: string;
    copiedLabel?: string;
  }

  const {
    id,
    text,
    label = "Starter prompt",
    copyLabel = "Copy starter prompt",
    copiedLabel = "Copied",
  }: Props = $props();

  const labelId = $derived(`${id}-label`);
  const codeId = $derived(`${id}-code`);
  let copied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  function fallbackCopy(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand("copy");
    textarea.remove();

    if (!didCopy) {
      throw new Error("Copy command failed");
    }
  }

  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }

    copied = true;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied = false), 3000);
  }
</script>

<div class="prompt-block" aria-labelledby={labelId}>
  <div class="prompt-block-header">
    <p class="prompt-block-label" id={labelId}>{label}</p>
    <button
      type="button"
      class="prompt-copy-button"
      aria-controls={codeId}
      aria-label={copied ? "Prompt copied to clipboard" : copyLabel}
      onclick={copyPrompt}
    >
      <HugeiconsIcon icon={copied ? CopyCheckIcon : Copy01Icon} size={16} strokeWidth={1.8} />
      <span>{copied ? copiedLabel : copyLabel}</span>
    </button>
  </div>
  <pre class="prompt-block-body" id={codeId}><code>{text}</code></pre>
</div>
