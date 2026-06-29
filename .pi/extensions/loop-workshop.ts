import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const lessonOnePrompt = `/skill:grill-with-docs

Help me define a small local issue-progress loop before we write code.

Read README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time. Capture what the loop should do, what it may change, what needs human approval, and what we are not building yet. Write the answers into VISION.md. Update AGENTS.md or README.md only if we agree on a clear repo rule. Do not create issue events, checks, Lakebed code, dispatch, or product code yet.`;

const widgetLines = [
  "Loopcraft · ready for Lesson 01",
  "1. Tour the rig + define vision",
  "2. Build the reliability floor",
  "3. Project events into Lakebed",
  "4. Control the loop from Pi + Herdr",
  "Side pane: node scripts/loop-daemon-stub.mjs",
  "Use /loop-lesson-01 to prefill the starter prompt.",
  "Tool: loopcraft_copy_edit audits/replaces public lesson copy.",
];

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
    ctx.ui.setStatus("loopcraft", "lesson 01 ready");
    ctx.ui.setWidget("loopcraft", widgetLines);
  });

  pi.registerCommand("loop-workshop-status", {
    description: "Show the Loopcraft learner rig status.",
    handler: async (_args, ctx) => {
      ctx.ui.setStatus("loopcraft", "lesson 01 ready");
      ctx.ui.setWidget("loopcraft", widgetLines);
      ctx.ui.notify("Loopcraft scaffold is ready for Lesson 01.", "info");
    },
  });

  pi.registerCommand("loop-lesson-01", {
    description: "Prefill the Lesson 01 vision and boundary-setting prompt.",
    handler: async (_args, ctx) => {
      ctx.ui.setEditorText(lessonOnePrompt);
      ctx.ui.notify("Lesson 01 prompt loaded. Review, then send it.", "info");
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
