import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const lessonOnePrompt = `/skill:grill-with-docs

Help me define a small local issue-progress loop before we write code.

Read README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time. Capture what the loop should do, what it may change, what needs human approval, and what we are not building yet. Write the answers into VISION.md. Update AGENTS.md or README.md only if we agree on a clear repo rule. Do not create issue events, checks, Lakebed code, dispatch, or product code yet.`;

type LoopcraftSnapshot = {
  phase: string;
  next: string;
  eventFile?: string;
  eventCount: number;
  receipt?: string;
  latest?: string;
};

function countEvents(filePath: string | undefined) {
  if (!filePath || !existsSync(filePath)) {
    return 0;
  }

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function readJson(pathName: string) {
  if (!existsSync(pathName)) {
    return undefined;
  }

  try {
    return JSON.parse(readFileSync(pathName, "utf8")) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function readLoopcraftSnapshot(): LoopcraftSnapshot {
  const eventFile = existsSync("data/issue-events.jsonl")
    ? "data/issue-events.jsonl"
    : existsSync("issues.jsonl")
      ? "issues.jsonl"
      : undefined;
  const eventCount = countEvents(eventFile);
  const receiptPath = "receipts/loop-check-latest.json";
  const receipt = readJson(receiptPath);
  const classifications = Array.isArray(receipt?.classifications)
    ? (receipt.classifications as Array<Record<string, unknown>>)
    : [];
  const latest = classifications.find((item) => item.status === "ready") ?? classifications[0];

  if (!existsSync("VISION.md")) {
    return {
      phase: "Lesson 01 · vision and boundaries",
      next: "Use /loop-lesson-01, then write VISION.md before product code.",
      eventCount,
    };
  }

  if (!eventFile) {
    return {
      phase: "Lesson 02 · create local issue events",
      next: "Add the first issue-event queue, checks, tests, and one receipt.",
      eventCount,
    };
  }

  if (!receipt) {
    return {
      phase: "Lesson 02 · check receipt missing",
      next: "Run pnpm run loop:check or /loop-check-now, then inspect receipts/loop-check-latest.json.",
      eventFile,
      eventCount,
    };
  }

  return {
    phase: "Loop visible · checks have receipts",
    next: "Compare Pi, Herdr, Lakebed, and receipt output before moving to the next lesson.",
    eventFile,
    eventCount,
    receipt: receiptPath,
    latest: latest ? `${latest.issueId ?? "issue"} ${latest.status ?? "unknown"}` : undefined,
  };
}

function truncateLine(line: string, width: number) {
  if (width <= 1 || line.length <= width) {
    return line;
  }

  return `${line.slice(0, width - 1)}…`;
}

function loopcraftWidgetLines(width: number) {
  const snapshot = readLoopcraftSnapshot();
  const lines = [
    `Loopcraft · ${snapshot.phase}`,
    `Next: ${snapshot.next}`,
    snapshot.eventFile
      ? `Events: ${snapshot.eventFile} (${snapshot.eventCount})`
      : "Events: not created yet",
    snapshot.receipt ? `Receipt: ${snapshot.receipt}` : "Receipt: waiting for first check",
    snapshot.latest ? `Latest: ${snapshot.latest}` : "Latest: none yet",
    "Host URLs: run pnpm run workshop:ui-url from the host shell.",
    "Bridge pane: node scripts/loop-daemon-stub.mjs",
    "Commands: /loop-lesson-01 · /loop-status · /loop-check-now",
    "Recorder: pnpm run record:event -- --type milestone --lesson 01 --note \"...\"",
  ];

  return lines.map((line) => truncateLine(line, width));
}

function loopcraftStatusText() {
  const snapshot = readLoopcraftSnapshot();
  return `Loopcraft: ${snapshot.phase}`;
}

function refreshLoopcraftUi(ctx: { ui: { setStatus: Function; setWidget: Function } }) {
  ctx.ui.setStatus("loopcraft", loopcraftStatusText());
  ctx.ui.setWidget("loopcraft", () => ({
    render: (width: number) => loopcraftWidgetLines(width),
    invalidate: () => {},
  }));
}

const DEFAULT_META_TERMS = [
  "hour cut",
  "hour-cut",
  "cut seam",
  "system seam",
  "run-06",
  "run 06",
  "scar",
  "fossil",
  "teacher",
  "instructor",
  "learner-facing",
  "workshop design",
  "course-design",
  "backstage",
  "the learner",
  "learner workspace",
  "operator pane",
  "operator surface",
  "operator controls",
  "operator cockpit",
];

const TEXT_EXTENSIONS = new Set([".md", ".mdx", ".svx", ".svelte", ".ts", ".txt", ".svg"]);
const SKIP_DIRS = new Set([".git", "node_modules", "build", ".svelte-kit", "dist", ".turbo"]);

type CopyScope = "site" | "lessons" | "docs" | "all";

type CopyEditParams = {
  action: "audit" | "replace" | "list";
  scope?: CopyScope;
  file?: string;
  terms?: string[];
  oldText?: string;
  newText?: string;
  caseSensitive?: boolean;
  dryRun?: boolean;
  maxMatches?: number;
};

type CopyMatch = {
  path: string;
  line: number;
  term: string;
  text: string;
};

type ReplaceResult = {
  path: string;
  count: number;
};

const copyEditParams = {
  type: "object",
  additionalProperties: false,
  required: ["action"],
  properties: {
    action: {
      type: "string",
      enum: ["audit", "replace", "list"],
      description: "What to do: audit meta-language, replace exact text, or list editable files.",
    },
    scope: {
      type: "string",
      enum: ["site", "lessons", "docs", "all"],
      description: "Which public files to inspect. Defaults to site.",
    },
    file: { type: "string", description: "Optional single file path, relative to the repo root." },
    terms: {
      type: "array",
      items: { type: "string" },
      description: "Audit terms. Defaults to common internal/meta wording.",
    },
    oldText: { type: "string", description: "Exact text to replace for action=replace." },
    newText: { type: "string", description: "Replacement text for action=replace." },
    caseSensitive: { type: "boolean", description: "Use case-sensitive audit matching. Defaults to false." },
    dryRun: { type: "boolean", description: "For replace, report replacements without writing. Defaults to true." },
    maxMatches: { type: "number", description: "Maximum audit matches to return. Defaults to 120." },
  },
} as const;

export default function loopWorkshop(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    refreshLoopcraftUi(ctx);
  });

  pi.on("turn_end", async (_event, ctx) => {
    refreshLoopcraftUi(ctx);
  });

  pi.registerCommand("loop-workshop-status", {
    description: "Show the Loopcraft learner rig status.",
    handler: async (_args, ctx) => {
      refreshLoopcraftUi(ctx);
      ctx.ui.notify(loopcraftStatusText(), "info");
    },
  });

  pi.registerCommand("loop-lesson-01", {
    description: "Prefill the Lesson 01 vision and boundary-setting prompt.",
    handler: async (_args, ctx) => {
      ctx.ui.setEditorText(lessonOnePrompt);
      ctx.ui.notify("Lesson 01 prompt loaded. Review, then send it.", "info");
    },
  });

  pi.registerCommand("loop-status", {
    description: "Show the latest local checker status.",
    handler: async (_args, ctx) => {
      const output = execFileSync("pnpm", ["run", "-s", "loop:status"], {
        cwd: process.cwd(),
        encoding: "utf8",
      }).trim();
      ctx.ui.setWidget("loop-status", output.split("\n"));
      ctx.ui.notify("Loop status refreshed from receipts/loop-check-latest.json.", "info");
    },
  });

  pi.registerCommand("loop-check-now", {
    description: "Run the local checker now, then show status.",
    handler: async (_args, ctx) => {
      const checkOutput = execFileSync("pnpm", ["run", "-s", "loop:check"], {
        cwd: process.cwd(),
        encoding: "utf8",
      }).trim();
      const statusOutput = execFileSync("pnpm", ["run", "-s", "loop:status"], {
        cwd: process.cwd(),
        encoding: "utf8",
      }).trim();
      ctx.ui.setWidget("loop-check-now", [
        "check-now",
        ...statusOutput.split("\n"),
        "---",
        ...checkOutput.split("\n").slice(0, 8),
      ]);
      ctx.ui.notify("Local checker ran and wrote receipts/loop-check-latest.json.", "info");
    },
  });

  pi.registerCommand("loop-copy-audit", {
    description: "Scan public workshop copy for internal/meta wording.",
    handler: async (args, ctx) => {
      const terms = args.trim()
        ? args.split(",").map((term) => term.trim()).filter(Boolean)
        : undefined;
      const result = auditCopy({ action: "audit", scope: "site", terms, maxMatches: 8 });
      const lines = result.matches.length
        ? result.matches.map((match) => `${match.path}:${match.line} ${match.term} — ${match.text}`)
        : ["No default meta-language matches in public site copy."];

      ctx.ui.setWidget("loop-copy-audit", lines);
      ctx.ui.notify(`Loop copy audit: ${result.totalMatches} match${result.totalMatches === 1 ? "" : "es"}.`, result.totalMatches ? "warning" : "info");
    },
  });

  pi.registerTool({
    name: "loopcraft_copy_edit",
    label: "Loopcraft Copy Edit",
    description: "Audit and edit Loopcraft public lesson/site copy without writing one-off search scripts.",
    promptSnippet: "Audit learner-visible Loopcraft copy for internal/meta language or perform exact text replacements across lesson/site files.",
    promptGuidelines: [
      "Use loopcraft_copy_edit when cleaning workshop or lesson copy for internal/meta wording.",
      "Run action=audit before broad replacements.",
      "Use action=replace with dryRun=true first unless the replacement is tiny and obvious.",
      "Prefer changing visible learner copy to direct 'you/we' wording instead of instructor labels.",
    ],
    parameters: copyEditParams,
    async execute(_toolCallId, params: CopyEditParams) {
      if (params.action === "list") {
        const files = collectCopyFiles(params.scope ?? "site", params.file);
        return textResult(`Editable ${params.scope ?? "site"} files: ${files.length}`, { action: params.action, files });
      }

      if (params.action === "audit") {
        const result = auditCopy(params);
        const preview = result.matches.length
          ? result.matches.map((match) => `${match.path}:${match.line} [${match.term}] ${match.text}`).join("\n")
          : "No matches for the selected terms.";
        return textResult(`Loopcraft copy audit found ${result.totalMatches} match${result.totalMatches === 1 ? "" : "es"}.\n${preview}`, result);
      }

      const result = replaceCopy(params);
      const verb = result.dryRun ? "would replace" : "replaced";
      const preview = result.changedFiles.length
        ? result.changedFiles.map((file) => `${file.path}: ${file.count}`).join("\n")
        : "No files matched the exact oldText.";
      return textResult(`Loopcraft copy edit ${verb} ${result.totalReplacements} occurrence${result.totalReplacements === 1 ? "" : "s"}.\n${preview}`, result);
    },
  });
}

function textResult(text: string, details: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text }],
    details,
  };
}

function auditCopy(params: CopyEditParams) {
  const scope = params.scope ?? "site";
  const terms = params.terms?.length ? params.terms : DEFAULT_META_TERMS;
  const caseSensitive = params.caseSensitive ?? false;
  const maxMatches = params.maxMatches ?? 120;
  const files = collectCopyFiles(scope, params.file);
  const matches: CopyMatch[] = [];

  for (const relativePath of files) {
    const text = readRepoFile(relativePath);
    const lines = text.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const haystack = caseSensitive ? line : line.toLowerCase();

      for (const term of terms) {
        const needle = caseSensitive ? term : term.toLowerCase();
        if (haystack.includes(needle)) {
          matches.push({
            path: relativePath,
            line: index + 1,
            term,
            text: compactLine(line),
          });
          break;
        }
      }

      if (matches.length >= maxMatches) {
        return { action: "audit", scope, terms, filesScanned: files.length, totalMatches: matches.length, truncated: true, matches };
      }
    }
  }

  return { action: "audit", scope, terms, filesScanned: files.length, totalMatches: matches.length, truncated: false, matches };
}

function replaceCopy(params: CopyEditParams) {
  const scope = params.scope ?? "site";
  const oldText = params.oldText ?? "";
  const newText = params.newText ?? "";
  const dryRun = params.dryRun ?? true;

  if (oldText.length < 3) {
    throw new Error("action=replace requires oldText with at least 3 characters.");
  }

  const files = collectCopyFiles(scope, params.file);
  const changedFiles: ReplaceResult[] = [];
  let totalReplacements = 0;

  for (const relativePath of files) {
    const text = readRepoFile(relativePath);
    const count = text.split(oldText).length - 1;

    if (!count) continue;

    totalReplacements += count;
    changedFiles.push({ path: relativePath, count });

    if (!dryRun) {
      writeRepoFile(relativePath, text.split(oldText).join(newText));
    }
  }

  return { action: "replace", scope, dryRun, totalReplacements, changedFiles };
}

function collectCopyFiles(scope: CopyScope, singleFile?: string) {
  if (singleFile) {
    const relativePath = toSafeRelativePath(singleFile);
    assertTextFile(relativePath);
    return [relativePath];
  }

  const files = new Set<string>();
  const addFile = (relativePath: string) => {
    if (!existsSync(repoPath(relativePath))) return;
    assertTextFile(relativePath);
    files.add(relativePath);
  };
  const addDir = (relativePath: string) => {
    if (!existsSync(repoPath(relativePath))) return;
    for (const file of walkTextFiles(relativePath)) files.add(file);
  };

  if (scope === "site" || scope === "all") {
    addDir("web/src/routes");
    addFile("web/src/lib/workshop-data.ts");
    addDir("web/static");
  }

  if (scope === "lessons" || scope === "all") {
    addDir("lessons");
  }

  if (scope === "docs" || scope === "all") {
    addFile("README.md");
    addFile("AGENTS.md");
    addFile("WORKSHOP_RIG.md");
    addFile("docs/setup.md");
  }

  return [...files].sort();
}

function walkTextFiles(relativeDir: string): string[] {
  const absoluteDir = repoPath(relativeDir);
  const entries = readdirSync(absoluteDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(...walkTextFiles(relativePath));
      }
      continue;
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(relativePath);
    }
  }

  return files;
}

function readRepoFile(relativePath: string) {
  return readFileSync(repoPath(relativePath), "utf8");
}

function writeRepoFile(relativePath: string, text: string) {
  writeFileSync(repoPath(relativePath), text, "utf8");
}

function repoPath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

function toSafeRelativePath(inputPath: string) {
  const root = process.cwd();
  const absolutePath = path.resolve(root, inputPath);
  const relativePath = path.relative(root, absolutePath).split(path.sep).join(path.posix.sep);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to read outside repo root: ${inputPath}`);
  }

  return relativePath;
}

function assertTextFile(relativePath: string) {
  const absolutePath = repoPath(relativePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${relativePath}`);
  }

  if (!statSync(absolutePath).isFile()) {
    throw new Error(`Not a file: ${relativePath}`);
  }

  if (!TEXT_EXTENSIONS.has(path.extname(relativePath))) {
    throw new Error(`Not an editable text copy file: ${relativePath}`);
  }
}

function compactLine(line: string) {
  return line.trim().replace(/\s+/g, " ").slice(0, 240);
}
