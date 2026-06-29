<script lang="ts">
  import FeedbackExportGate from "./feedback-export-gate.svelte";
  import FeedbackMode from "./feedback-mode.svelte";
  import LessonNavigation from "./lesson-navigation.svelte";
  import ReportLayout from "./ReportLayout.svelte";
  import WorkshopNav from "./workshop-nav.svelte";
  import { site, type Lesson } from "./workshop-data";

  interface Props {
    lesson: Lesson;
  }

  const { lesson }: Props = $props();
  const prefix = $derived(`lesson-${lesson.id}`);
  const feedbackParagraphs = $derived([
    `${prefix}-lead`,
    `${prefix}-starter-prompt`,
    `${prefix}-build-operate`,
    `${prefix}-observe`,
    `${prefix}-discuss`,
    `${prefix}-checkpoint`,
    `${prefix}-drill`,
    `${prefix}-next`,
    `${prefix}-receipt`,
  ]);
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

  <FeedbackMode id={`${prefix}-lead`} note="Does this challenge frame the lesson outcome clearly enough?">
    <p class="lead">{lesson.challenge}</p>
  </FeedbackMode>

  <LessonNavigation {lesson} />

  <h2>Starter prompt</h2>

  <FeedbackMode id={`${prefix}-starter-prompt`} note="Is this prompt copyable and specific enough for a learner to run?">
    <pre><code>{lesson.starterPrompt}</code></pre>
  </FeedbackMode>

  <h2>Build / operate</h2>

  <FeedbackMode id={`${prefix}-build-operate`} note="Does this name the visible work without hiding setup magic?">
    <p>{lesson.buildOperate}</p>
  </FeedbackMode>

  <h2>Observe</h2>

  <FeedbackMode id={`${prefix}-observe`} note="Does this tell the learner what evidence to inspect?">
    <p>{lesson.observe}</p>
  </FeedbackMode>

  <h2>Discuss</h2>

  <FeedbackMode id={`${prefix}-discuss`} note="Does this preserve the reason behind the step?">
    <p>{lesson.discuss}</p>
  </FeedbackMode>

  <h2>Checkpoint</h2>

  <FeedbackMode id={`${prefix}-checkpoint`} note="Is the checkpoint concrete enough to stop or continue?">
    <p>{lesson.checkpoint}</p>
  </FeedbackMode>

  <h2>Small drill</h2>

  <FeedbackMode id={`${prefix}-drill`} note="Is this small enough to do during the lesson?">
    <p>{lesson.drill}</p>
  </FeedbackMode>

  <h2>Next</h2>

  <FeedbackMode id={`${prefix}-next`} note="Does this bridge cleanly into the next lesson?">
    <p>{lesson.next}</p>
  </FeedbackMode>

  <h2>Run-06 scar</h2>

  <FeedbackMode id={`${prefix}-receipt`} note="Does this scar explain why the lesson exists without dragging in private transcript detail?">
    <p>{lesson.receipt}</p>
  </FeedbackMode>

  <FeedbackExportGate paragraphs={feedbackParagraphs} run={`lesson-${lesson.id}`} slug={`${site.slug}-${lesson.id}`} url={pageUrl} version={site.version} />

  <LessonNavigation {lesson} />

  <footer>
    <a href="/lessons/">All lessons</a> · <a href={site.repo}>Public repo</a>
  </footer>
</ReportLayout>
