#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const eventFile = path.join(process.cwd(), "docs", "loopcraft-008-build-events.jsonl");
const allowedTypes = new Set([
  "rationale",
  "decision",
  "guardrail",
  "architecture",
  "teaching-moment",
  "friction",
  "prompt",
  "checkpoint",
  "question",
  "receipt",
]);

function parseArgs(argv) {
  const args = { receipts: [], tags: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--summary") args.summary = true;
    else if (arg === "--type") args.type = argv[++i];
    else if (arg === "--lesson") args.lesson = argv[++i];
    else if (arg === "--title") args.title = argv[++i];
    else if (arg === "--note") args.note = argv[++i];
    else if (arg === "--source") args.source = argv[++i];
    else if (arg === "--actor") args.actor = argv[++i];
    else if (arg === "--receipt") args.receipts.push(argv[++i]);
    else if (arg === "--tag") args.tags.push(argv[++i]);
    else if (arg === "--tags") args.tags.push(...argv[++i].split(",").map((tag) => tag.trim()).filter(Boolean));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

async function readEvents() {
  try {
    const text = await readFile(eventFile, "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((line, index) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          throw new Error(`Invalid JSONL at ${eventFile}:${index + 1}: ${error.message}`);
        }
      });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function summarize(events) {
  const counts = new Map();
  for (const event of events) counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
  const latest = events.at(-1);
  return {
    eventFile: path.relative(process.cwd(), eventFile),
    eventCount: events.length,
    counts: Object.fromEntries([...counts.entries()].sort()),
    latest: latest
      ? {
          capturedAt: latest.capturedAt,
          type: latest.type,
          lesson: latest.lesson,
          title: latest.title,
          note: latest.note,
        }
      : null,
  };
}

function validateEvent(args) {
  if (!args.type || !allowedTypes.has(args.type)) {
    throw new Error(`--type is required and must be one of: ${[...allowedTypes].join(", ")}`);
  }
  if (!args.note) throw new Error("--note is required");
  if (args.note.length > 2000) throw new Error("--note must stay under 2000 characters; summarize, do not paste transcripts");
  if (args.note.match(/api[_-]?key|secret|token|password/i)) {
    throw new Error("Refusing likely secret-bearing note. Summarize without secrets.");
  }
  return {
    capturedAt: new Date().toISOString(),
    type: args.type,
    actor: args.actor ?? "teacher",
    lesson: args.lesson ?? null,
    title: args.title ?? null,
    note: args.note,
    source: args.source ?? null,
    receipts: args.receipts,
    tags: args.tags,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const events = await readEvents();
  if (args.summary) {
    console.log(JSON.stringify(summarize(events), null, 2));
    return;
  }

  const event = validateEvent(args);
  await mkdir(path.dirname(eventFile), { recursive: true });
  await writeFile(eventFile, `${events.map((entry) => JSON.stringify(entry)).join("\n")}${events.length ? "\n" : ""}${JSON.stringify(event)}\n`);
  console.log(JSON.stringify({ ok: true, eventFile: path.relative(process.cwd(), eventFile), event }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
