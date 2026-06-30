import { describe, expect, test } from "vitest";
import { readIssueCards } from "../src/issue-cards.js";

describe("Lakebed issue cards", () => {
  test("projects the local issue event file into cards", () => {
    const projection = readIssueCards("data/issue-events.jsonl");

    expect(projection.fileRead).toBe("data/issue-events.jsonl");
    expect(projection.cards.map((card) => [card.issueId, card.status])).toEqual(
      [
        ["ISSUE-001", "ready"],
        ["ISSUE-002", "approval_required"],
        ["ISSUE-003", "needs_input"],
      ],
    );
    expect(projection.cards[0]?.nextAllowedAction).toContain("local check");
    expect(projection.cards[2]?.stopReason).toContain("More input");
  });
});
