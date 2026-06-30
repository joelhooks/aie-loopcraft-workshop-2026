import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  ISSUE_EVENT_FILE,
  type IssueEvent,
  loadIssueEvents,
} from "./issue-events.js";

export type IssueClassification = {
  issueId: string;
  title: string;
  status: IssueEvent["status"];
  reason: string;
  stopReason: string | null;
  nextAllowedAction: string;
  refusedAction: string;
};

export type CheckResult = {
  fileRead: string;
  eventCount: number;
  classifications: IssueClassification[];
};

export function classifyIssue(event: IssueEvent): IssueClassification {
  if (event.status === "ready") {
    return {
      issueId: event.issueId,
      title: event.title,
      status: event.status,
      reason: event.summary,
      stopReason: null,
      nextAllowedAction:
        "Run the local check again or prepare a human-reviewed next step.",
      refusedAction:
        "Do not change product code, call external trackers, schedule work, or dispatch agents yet.",
    };
  }

  if (event.status === "approval-required") {
    return {
      issueId: event.issueId,
      title: event.title,
      status: event.status,
      reason: event.summary,
      stopReason: "Human approval is required before this issue can move.",
      nextAllowedAction:
        "Ask the human to approve, reject, or narrow the work.",
      refusedAction: "Do not treat this issue as ready or change files for it.",
    };
  }

  return {
    issueId: event.issueId,
    title: event.title,
    status: event.status,
    reason: event.summary,
    stopReason: "More input is required before this issue can move.",
    nextAllowedAction: "Ask for missing acceptance criteria or clearer scope.",
    refusedAction:
      "Do not guess the missing requirements or start implementation.",
  };
}

export function runCheck(file = ISSUE_EVENT_FILE): CheckResult {
  const loaded = loadIssueEvents(file);

  return {
    fileRead: loaded.file,
    eventCount: loaded.events.length,
    classifications: loaded.events.map(classifyIssue),
  };
}

export function writeReceipt(result: CheckResult): string {
  mkdirSync("receipts", { recursive: true });
  const path = join("receipts", "loop-check-latest.json");
  writeFileSync(
    path,
    `${JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        lastCommand: "pnpm run loop:check",
        ...result,
      },
      null,
      2,
    )}\n`,
  );
  return path;
}

export function formatCheck(result: CheckResult, receiptPath: string): string {
  const lines = [
    `fileRead: ${result.fileRead}`,
    `eventCount: ${result.eventCount}`,
    "classifications:",
  ];

  for (const item of result.classifications) {
    lines.push(`- ${item.issueId} [${item.status}] ${item.title}`);
    lines.push(`  reason: ${item.reason}`);
    lines.push(`  stopReason: ${item.stopReason ?? "none"}`);
    lines.push(`  nextAllowedAction: ${item.nextAllowedAction}`);
    lines.push(`  refusedAction: ${item.refusedAction}`);
  }

  lines.push(`receipt: ${receiptPath}`);
  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const file = process.argv[2] ?? ISSUE_EVENT_FILE;
    const result = runCheck(file);
    const receiptPath = writeReceipt(result);
    console.log(formatCheck(result, receiptPath));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
