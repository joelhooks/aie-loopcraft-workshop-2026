export const site = {
  slug: "aie-loopcraft-workshop-2026",
  title: "AI Engineer Loopcraft Workshop 2026",
  url: "https://aie-loopcraft-workshop-2026.wzrrd.sh/",
  repo: "https://github.com/joelhooks/aie-loopcraft-workshop-2026",
  version: "0.8.11",
};

export type Lesson = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  href: string;
  challenge: string;
};

export const lessons: Lesson[] = [
  {
    "id": "tour-vision-repo",
    "number": "01",
    "title": "Tour the repo and set the course",
    "shortTitle": "Tour + vision",
    "href": "/lessons/01-tour-vision-repo/",
    "challenge": "Use Pi plus grill-with-docs to write VISION.md: what the local issue checker should do, which files it may edit, and when it must stop."
  },
  {
    "id": "reliability-floor",
    "number": "02",
    "title": "Make bad input fail loudly",
    "shortTitle": "Bad input fails",
    "href": "/lessons/02-reliability-floor/",
    "challenge": "Turn VISION.md into one local event file, one check command, tests, and a saved receipt from a real run."
  },
  {
    "id": "lakebed-projection",
    "number": "03",
    "title": "Show issue events in Lakebed",
    "shortTitle": "Lakebed view",
    "href": "/lessons/03-lakebed-projection/",
    "challenge": "Read the same local event file from Lesson 02 and show matching issue cards in Lakebed."
  },
  {
    "id": "pi-herdr-control",
    "number": "04",
    "title": "See and control the check from Pi and Herdr",
    "shortTitle": "Pi/Herdr status",
    "href": "/lessons/04-pi-herdr-control/",
    "challenge": "Add a visible way to ask for status, run the local check, and see what happened."
  },
  {
    "id": "safe-dispatch",
    "number": "05",
    "title": "Claim one ready issue without changing product files",
    "shortTitle": "Claim + dry-run",
    "href": "/lessons/05-safe-dispatch/",
    "challenge": "Pick one ready issue, write a claim, run a dry-run, and prove no product files changed."
  },
  {
    "id": "bounded-gardener",
    "number": "06",
    "title": "Let cleanup propose one follow-up",
    "shortTitle": "Cleanup guard",
    "href": "/lessons/06-bounded-gardener/",
    "challenge": "Let the checker propose one maintenance event, then prove it stops when the repo or queue is not safe to touch."
  },
  {
    "id": "specialist-review",
    "number": "07",
    "title": "Ask for review without handing over the repo",
    "shortTitle": "Read-only review",
    "href": "/lessons/07-specialist-review/",
    "challenge": "Ask a small reviewer for help without letting another agent edit the app files."
  },
  {
    "id": "supervisor-runtime",
    "number": "08",
    "title": "Run the supervisor beside the current check",
    "shortTitle": "Supervisor check",
    "href": "/lessons/08-supervisor-runtime/",
    "challenge": "Use the same event file and check command while a small TypeScript decision check says the next state and reason. The current checker still decides."
  }
];

export const stats = [
  { label: "Lessons", value: "8" },
  { label: "Repo", value: "public" },
  { label: "Status", value: "Pi + Herdr" },
  { label: "View", value: "Lakebed" },
];

export function getLesson(id: string): Lesson {
  const lesson = lessons.find((candidate) => candidate.id === id);

  if (!lesson) {
    throw new Error(`Unknown lesson: ${id}`);
  }

  return lesson;
}

export function getAdjacentLesson(id: string) {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return {
    index,
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}
