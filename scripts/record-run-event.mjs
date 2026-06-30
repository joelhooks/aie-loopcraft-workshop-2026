#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const allowedTypes = new Set([
  "lesson_started",
  "prompt_sent",
  "milestone",
  "teaching_moment",
  "friction",
  "checkpoint",
  "learning_goal",
  "support_fade",
  "next_stretch",
  "receipt",
  "note",
]);

function usage(exitCode = 0) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(`Loopcraft run recorder

Usage:
  pnpm run record:event -- --type milestone --lesson 03 --note "Lakebed matched the local check"
  pnpm run record:event -- --type friction --lesson 03 --note "Browser localhost pointed at the wrong machine" --source docs/host-container-urls.md
  pnpm run record:summary

Options:
  --run <id>        Recording id. Defaults to LOOPCRAFT_RUN_ID or run-008.
  --type <type>     ${[...allowedTypes].join(" | ")}
  --lesson <id>     Lesson id or number, for example 03 or lakebed-projection.
  --note <text>     Short human note.
  --source <path>   File, URL, receipt, or command that backs the note.
  --tags <csv>      Optional comma-separated tags.
  --summary         Print a summary instead of appending an event.
`);
  process.exit(exitCode);
}

function readArgs(argv) {
  const args = {
    run: process.env.LOOPCRAFT_RUN_ID || "run-008",
    tags: [],
    summary: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      usage(0);
    }

    if (arg === "--summary") {
      args.summary = true;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`${arg} needs a value`);
    }

    if (arg === "--run") args.run = next;
    else if (arg === "--type") args.type = next;
    else if (arg === "--lesson") args.lesson = next;
    else if (arg === "--note") args.note = next;
    else if (arg === "--source") args.source = next;
    else if (arg === "--tags") args.tags = next.split(",").map((tag) => tag.trim()).filter(Boolean);
    else throw new Error(`Unknown option: ${arg}`);

    index += 1;
  }

  return args;
}

function pathsForRun(run) {
  const dir = join("recordings", run);
  return {
    dir,
    eventsPath: join(dir, "events.jsonl"),
    latestPath: join(dir, "latest.json"),
  };
}

function readEvents(eventsPath) {
  if (!existsSync(eventsPath)) {
    return [];
  }

  return readFileSync(eventsPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function summarize(run) {
  const { eventsPath } = pathsForRun(run);
  const events = readEvents(eventsPath);
  const byType = events.reduce((counts, event) => {
    counts[event.type] = (counts[event.type] || 0) + 1;
    return counts;
  }, {});
  const byLesson = events.reduce((counts, event) => {
    const lesson = event.lesson || "none";
    counts[lesson] = (counts[lesson] || 0) + 1;
    return counts;
  }, {});

  return {
    run,
    eventsPath,
    eventCount: events.length,
    byType,
    byLesson,
    latest: events.at(-1) || null,
  };
}

try {
  const args = readArgs(process.argv.slice(2));

  if (args.summary) {
    console.log(JSON.stringify(summarize(args.run), null, 2));
    process.exit(0);
  }

  if (!args.type || !allowedTypes.has(args.type)) {
    throw new Error(`--type is required and must be one of: ${[...allowedTypes].join(", ")}`);
  }

  if (!args.note) {
    throw new Error("--note is required");
  }

  const { dir, eventsPath, latestPath } = pathsForRun(args.run);
  mkdirSync(dir, { recursive: true });

  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    recordedAt: new Date().toISOString(),
    run: args.run,
    type: args.type,
    lesson: args.lesson,
    note: args.note,
    source: args.source,
    tags: args.tags,
  };

  writeFileSync(eventsPath, `${JSON.stringify(event)}\n`, { flag: "a" });
  writeFileSync(latestPath, `${JSON.stringify({ latest: event, summary: summarize(args.run) }, null, 2)}\n`);
  console.log(JSON.stringify(event, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  usage(64);
}
