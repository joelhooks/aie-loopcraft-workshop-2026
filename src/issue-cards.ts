import { type IssueEvent, loadIssueEvents } from "./issue-events.js";
import { classifyIssue, type IssueClassification } from "./loop-check.js";

export type IssueCardStatus = "ready" | "approval_required" | "needs_input";

export type IssueCard = {
  issueId: string;
  title: string;
  status: IssueCardStatus;
  reason: string;
  stopReason: string | null;
  nextAllowedAction: string;
  refusedAction: string;
  eventCount: number;
  events: Array<{
    eventId: string;
    type: string;
    summary: string;
  }>;
};

function cardStatus(status: IssueEvent["status"]): IssueCardStatus {
  if (status === "approval-required") {
    return "approval_required";
  }

  if (status === "input-required") {
    return "needs_input";
  }

  return "ready";
}

function cardFromEvent(
  event: IssueEvent,
  classification: IssueClassification,
): IssueCard {
  return {
    issueId: event.issueId,
    title: event.title,
    status: cardStatus(event.status),
    reason: classification.reason,
    stopReason: classification.stopReason,
    nextAllowedAction: classification.nextAllowedAction,
    refusedAction: classification.refusedAction,
    eventCount: 1,
    events: [
      {
        eventId: event.id,
        type: event.type,
        summary: event.summary,
      },
    ],
  };
}

export function readIssueCards(file?: string): {
  fileRead: string;
  cards: IssueCard[];
} {
  const loaded = loadIssueEvents(file);

  return {
    fileRead: loaded.file,
    cards: loaded.events.map((event) =>
      cardFromEvent(event, classifyIssue(event)),
    ),
  };
}
