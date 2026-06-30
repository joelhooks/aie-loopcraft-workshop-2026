import { existsSync, readFileSync } from "node:fs";
import { type CheckResult } from "./loop-check.js";

const DEFAULT_RECEIPT = "receipts/loop-check-latest.json";

type CheckReceipt = CheckResult & {
  checkedAt: string;
  lastCommand?: string;
};

export type LoopStatus = {
  state: string;
  checkedAt: string;
  lastCommand: string;
  lastReceipt: string;
  waitingReason: string;
  latestCheck: {
    issueId: string;
    status: string;
    title: string;
  } | null;
  issueCount: number;
};

function readReceipt(path = DEFAULT_RECEIPT): CheckReceipt | null {
  if (!existsSync(path)) {
    return null;
  }

  return JSON.parse(readFileSync(path, "utf8")) as CheckReceipt;
}

export function getLoopStatus(receiptPath = DEFAULT_RECEIPT): LoopStatus {
  const receipt = readReceipt(receiptPath);

  if (!receipt) {
    return {
      state: "waiting_for_first_check",
      checkedAt: "never",
      lastCommand: "pnpm run loop:check",
      lastReceipt: receiptPath,
      waitingReason:
        "Run pnpm run loop:check before trusting local issue state.",
      latestCheck: null,
      issueCount: 0,
    };
  }

  const ready = receipt.classifications.find((item) => item.status === "ready");
  const waiting = receipt.classifications.find((item) => item.stopReason);
  const latest = ready ?? receipt.classifications.at(0) ?? null;

  return {
    state: ready ? "ready_with_local_guardrails" : "waiting_for_human_input",
    checkedAt: receipt.checkedAt,
    lastCommand: receipt.lastCommand ?? "pnpm run loop:check",
    lastReceipt: receiptPath,
    waitingReason: waiting
      ? `${waiting.issueId}: ${waiting.stopReason}`
      : "No waiting issue in the latest local check.",
    latestCheck: latest
      ? {
          issueId: latest.issueId,
          status: latest.status,
          title: latest.title,
        }
      : null,
    issueCount: receipt.eventCount,
  };
}

export function formatStatus(status: LoopStatus): string {
  return [
    `state: ${status.state}`,
    `checkedAt: ${status.checkedAt}`,
    `lastCommand: ${status.lastCommand}`,
    `lastReceipt: ${status.lastReceipt}`,
    `waitingReason: ${status.waitingReason}`,
    `latestCheck: ${status.latestCheck ? `${status.latestCheck.issueId} [${status.latestCheck.status}] ${status.latestCheck.title}` : "none"}`,
    `issueCount: ${status.issueCount}`,
  ].join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(formatStatus(getLoopStatus(process.argv[2])));
}
