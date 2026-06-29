<script lang="ts">
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import FeedbackExportGate from "$lib/feedback-export-gate.svelte";
  import FeedbackSection from "$lib/feedback-section.svelte";
  import { isFeedbackEnabled, withFeedback } from "$lib/feedback";
  import LessonNavigation from "$lib/lesson-navigation.svelte";
  import ReportLayout from "$lib/ReportLayout.svelte";
  import WorkshopNav from "$lib/workshop-nav.svelte";
  import { site, type Lesson } from "$lib/workshop-data";

  interface Props {
    lesson: Lesson;
    children: Snippet;
  }

  const { lesson, children }: Props = $props();
  const feedbackEnabled = $derived(isFeedbackEnabled(page.url));
  const href = $derived((value: string) => withFeedback(value, feedbackEnabled));
  const pageUrl = $derived(`${site.url}${lesson.href.replace(/^\//, "")}`);
</script>

<svelte:head>
  <title>{lesson.number} · {lesson.title} · {site.title}</title>
  <meta name="description" content={lesson.challenge} />
</svelte:head>

<ReportLayout>
  <WorkshopNav current={lesson.id} />

  <p class="eyebrow"><span class="mascot">🧪</span><span class="eyebrow-stack"><span>Lesson {lesson.number}</span><span>{site.title}</span></span></p>
  <h1>{lesson.title}</h1>

  <FeedbackSection id={`lesson-${lesson.id}-lead`}>
    <p class="lead">{lesson.challenge}</p>
  </FeedbackSection>

  <LessonNavigation {lesson} />

  {@render children()}

  <FeedbackExportGate run={`lesson-${lesson.id}`} slug={`${site.slug}-${lesson.id}`} url={pageUrl} version={site.version} />

  <LessonNavigation {lesson} />

  <footer>
    <a href={href("/lessons/")}>All lessons</a> · <a href={href("/glossary/")}>Glossary</a> · <a href={site.repo}>Public repo</a>
  </footer>
</ReportLayout>
