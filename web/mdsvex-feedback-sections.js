/**
 * Tiny MDSvX source preprocessor that wraps top-level <h2> sections in
 * FeedbackSection components. This keeps feedback mode section-level without
 * polluting the lesson copy with wrapper components around every block.
 */
export function feedbackSectionsPreprocess() {
  return {
    name: "feedback-sections-preprocess",
    markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return { code: content };

      const prefix = feedbackPrefixFromPath(filename);
      if (!prefix) return { code: content };
      if (!content.includes("<h2>")) return { code: content };

      const lines = content.split("\n");
      const used = new Map();
      const output = [];
      let open = false;

      for (const line of lines) {
        if (open && isSectionBoundary(line)) {
          output.push("</FeedbackSection>");
          open = false;
        }

        const title = h2Title(line);
        if (title) {
          if (open) output.push("</FeedbackSection>");
          output.push(`<FeedbackSection id=${JSON.stringify(sectionId(prefix, title, used))}>`);
          open = true;
        }

        output.push(line);
      }

      if (open) output.push("</FeedbackSection>");
      return { code: output.join("\n") };
    },
  };
}

function feedbackPrefixFromPath(path) {
  const normalized = path.replaceAll("\\\\", "/");

  if (normalized.endsWith("/src/routes/+page.svx")) return "home";
  if (normalized.endsWith("/src/routes/lessons/+page.svx")) return "lesson-index";

  const lessonMatch = normalized.match(/\/src\/routes\/lessons\/(\d{2})-([^/]+)\/\+page\.svx$/);
  if (lessonMatch) return `lesson-${lessonMatch[2]}`;

  return undefined;
}

function isSectionBoundary(line) {
  return /^\s*(<FeedbackExportGate\b|<footer\b|<\/LessonShell>|<\/ReportLayout>|<style\b)/.test(line);
}

function h2Title(line) {
  const match = line.match(/^\s*<h2(?:\s[^>]*)?>(.*?)<\/h2>\s*$/is);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, "").trim();
}

function sectionId(prefix, title, used) {
  const baseSlug = sectionAliases[slugify(prefix)]?.[slugify(title)] ?? slugify(title);
  const base = `${prefix}-${baseSlug}`;
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const lessonSectionAliases = {
  "what-were-trying-to-build": "prompt-context",
  "what-you-should-see": "what-you-should-see",
  "starter-prompt": "starter-prompt",
  "build-operate": "build-operate",
  "build-checklist": "phase-checklist",
  "exploration-prompts": "exploration-prompts",
  "phase-checklist": "phase-checklist",
  "proof-to-save": "receipt-template",
  "done-when": "checkpoint",
  "why-it-matters": "receipt",
  "try-this": "drill",
  "observe": "observe",
  "receipt-template": "receipt-template",
  "discuss": "discuss",
  "checkpoint": "checkpoint",
  "small-drill": "drill",
  "next": "next",
  "fade-after-the-workshop": "next",
  "why-this-step-exists": "receipt",
};

const sectionAliases = {
  home: {
    "agent-quickstart": "agent-quickstart",
    "system-map": "system-map",
    "get-started": "get-started",
    "tools-we-use": "tools",
    "lesson-path": "lesson-path",
    "repo-map": "repo-map",
  },
  "lesson-index": {
    "all-lessons": "all-lessons",
  },
  "lesson-tour-vision-repo": lessonSectionAliases,
  "lesson-reliability-floor": lessonSectionAliases,
  "lesson-lakebed-projection": lessonSectionAliases,
  "lesson-pi-herdr-control": lessonSectionAliases,
  "lesson-safe-dispatch": lessonSectionAliases,
  "lesson-bounded-gardener": lessonSectionAliases,
  "lesson-specialist-review": lessonSectionAliases,
  "lesson-supervisor-runtime": lessonSectionAliases,
};
