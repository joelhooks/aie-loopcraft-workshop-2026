<script lang="ts">
  import { browser } from "$app/environment";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Copy01Icon, CopyCheckIcon } from "@hugeicons/core-free-icons";
  import { onMount } from "svelte";

  interface StoredFeedback {
    reaction?: string;
    steering?: string;
    vote?: string;
  }

  interface QuestionExport {
    id: string;
    prompt: string;
  }

  interface PatternExport {
    id: string;
    title: string;
  }

  interface LessonExport {
    id: string;
    title: string;
  }

  interface Props {
    paragraphs: string[];
    run: string;
    slug: string;
    url: string;
    version: string;
    lessons?: LessonExport[];
    patterns?: PatternExport[];
    questions?: QuestionExport[];
    storagePrefix?: string;
    type?: string;
  }

  const {
    paragraphs,
    run,
    slug,
    url,
    version,
    lessons = [],
    patterns = [],
    questions = [],
    storagePrefix = "tufte-mdsvx-feedback:",
    type = "tufte_mdsvx_feedback",
  }: Props = $props();
  let copied = $state(false);
  let copiedCount = $state(0);
  let copyButton: HTMLButtonElement;

  function readFeedback(paragraph: string) {
    if (!browser) return null;
    const raw = localStorage.getItem(`${storagePrefix}${paragraph}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as StoredFeedback;
      const reaction = (parsed.reaction ?? parsed.vote ?? "").trim();
      const steering = (parsed.steering ?? "").trim();
      if (!reaction && !steering) return null;
      return {
        p: paragraph,
        ...(reaction ? { r: reaction } : {}),
        ...(steering ? { s: steering } : {}),
      };
    } catch {
      return null;
    }
  }

  function readAnswer(question: QuestionExport) {
    if (!browser) return null;
    const answer = (localStorage.getItem(`${storagePrefix}question:${question.id}`) ?? "").trim();
    if (!answer) return null;
    return {
      q: question.id,
      prompt: question.prompt,
      a: answer,
    };
  }

  function readPatternFeedback(pattern: PatternExport) {
    if (!browser) return null;
    const note = (localStorage.getItem(`${storagePrefix}pattern:${pattern.id}`) ?? "").trim();
    if (!note) return null;
    return {
      pattern: pattern.id,
      title: pattern.title,
      feedback: note,
    };
  }

  function readLessonNotes(lesson: LessonExport) {
    if (!browser) return null;
    const note = (localStorage.getItem(`${storagePrefix}lesson:${lesson.id}`) ?? "").trim();
    if (!note) return null;
    return {
      lesson: lesson.id,
      title: lesson.title,
      notes: note,
    };
  }

  function buildPayload() {
    const items = paragraphs.map(readFeedback).filter(Boolean);
    const answers = questions.map(readAnswer).filter(Boolean);
    const patternFeedback = patterns.map(readPatternFeedback).filter(Boolean);
    const lessonNotes = lessons.map(readLessonNotes).filter(Boolean);
    return {
      type,
      ref: { slug, version, run, url },
      items,
      answers,
      patternFeedback,
      lessonNotes,
    };
  }

  async function copyText(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copiedWithSelection = document.execCommand("copy");
    textarea.remove();
    if (copiedWithSelection) return;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  }

  function copyFeedback() {
    const payload = buildPayload();
    copiedCount = payload.items.length + payload.answers.length + payload.patternFeedback.length + payload.lessonNotes.length;
    copied = true;
    void copyText(JSON.stringify(payload)).catch(() => {});
    window.setTimeout(() => (copied = false), 6000);
  }

  onMount(() => {
    copyButton.addEventListener("click", copyFeedback);
    return () => copyButton.removeEventListener("click", copyFeedback);
  });
</script>

<div class="feedback-export">
  <div>
    <p class="feedback-export-title">Feedback export</p>
    <p class="feedback-export-copy">Copies compact JSON keyed by page version, paragraph id, lesson notes, card feedback, and open-question answer. Paste it back to an agent and it can apply the notes without guessing.</p>
  </div>
  <button type="button" bind:this={copyButton}>
    <HugeiconsIcon icon={copied ? CopyCheckIcon : Copy01Icon} size={16} strokeWidth={1.8} />
    <span>{copied ? `copied ${copiedCount}` : "copy feedback"}</span>
  </button>
</div>
