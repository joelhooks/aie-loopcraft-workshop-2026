import { Schema } from "effect";
import { readFileSync } from "node:fs";

export const ISSUE_EVENT_FILE = "data/issue-events.jsonl";

const IssueStatus = Schema.Literal(
  "ready",
  "approval-required",
  "input-required",
);
const Approval = Schema.Literal("not-required", "required", "pre-approved");

export const IssueEventSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  issueId: Schema.NonEmptyString,
  type: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  status: IssueStatus,
  acceptanceCriteria: Schema.Array(Schema.NonEmptyString),
  approval: Approval,
  summary: Schema.NonEmptyString,
});

export type IssueEvent = Schema.Schema.Type<typeof IssueEventSchema>;

const decodeIssueEvent = Schema.decodeUnknownSync(IssueEventSchema);

export type LoadedIssueEvents = {
  file: string;
  events: IssueEvent[];
};

export function loadIssueEvents(file = ISSUE_EVENT_FILE): LoadedIssueEvents {
  const raw = readFileSync(file, "utf8");
  const rows = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    file,
    events: rows.map((row, index) => {
      let parsed: unknown;

      try {
        parsed = JSON.parse(row);
      } catch (error) {
        throw new Error(
          `Invalid JSON in ${file} on line ${index + 1}: ${String(error)}`,
        );
      }

      try {
        return decodeIssueEvent(parsed);
      } catch (error) {
        throw new Error(
          `Invalid issue event in ${file} on line ${index + 1}: ${String(error)}`,
        );
      }
    }),
  };
}
