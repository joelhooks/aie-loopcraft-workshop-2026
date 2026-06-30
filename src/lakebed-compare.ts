import { mkdirSync, writeFileSync } from "node:fs";
import { runCheck } from "./loop-check.js";
import { readIssueCards } from "./issue-cards.js";

const check = runCheck();
const projection = readIssueCards();
const checkStatuses = new Map(
  check.classifications.map((item) => [
    item.issueId,
    item.status === "approval-required"
      ? "approval_required"
      : item.status === "input-required"
        ? "needs_input"
        : "ready",
  ]),
);
const mismatches = projection.cards
  .map((card) => ({
    issueId: card.issueId,
    checkStatus: checkStatuses.get(card.issueId),
    lakebedCardStatus: card.status,
  }))
  .filter((item) => item.checkStatus !== item.lakebedCardStatus);

const receipt = {
  checkedAt: new Date().toISOString(),
  eventFile: check.fileRead,
  localCheck: {
    command: "pnpm run loop:check",
    eventCount: check.eventCount,
    statuses: Object.fromEntries(
      check.classifications.map((item) => [item.issueId, item.status]),
    ),
  },
  lakebedRoute:
    "Host-visible Lakebed URL from bash scripts/workshop-ui-url.sh; bridge endpoint http://127.0.0.1:8787/issue-cards when run on the Docker host",
  issueCounts: {
    localCheck: check.eventCount,
    lakebedCards: projection.cards.length,
  },
  mismatches,
  nextAllowedAction:
    mismatches.length === 0
      ? "Open the host-visible Lakebed URL and inspect the local issue file projection."
      : "Fix the Lakebed projection path, not the event file.",
};

mkdirSync("receipts", { recursive: true });
writeFileSync(
  "receipts/lakebed-compare-latest.json",
  `${JSON.stringify(receipt, null, 2)}\n`,
);
console.log(JSON.stringify(receipt, null, 2));
