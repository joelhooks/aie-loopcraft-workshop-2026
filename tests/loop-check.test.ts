import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCheck } from "../src/loop-check.js";

function fixtureFile(name: string, contents: string): string {
  const dir = join(tmpdir(), "loopcraft-tests");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, contents);
  return path;
}

describe("local loop check", () => {
  test("classifies ready, approval-required, and input-required rows", () => {
    const result = runCheck("data/issue-events.jsonl");

    expect(result.fileRead).toBe("data/issue-events.jsonl");
    expect(result.eventCount).toBe(3);
    expect(result.classifications.map((item) => item.status)).toEqual([
      "ready",
      "approval-required",
      "input-required",
    ]);
    expect(result.classifications[1]?.stopReason).toContain("Human approval");
    expect(result.classifications[2]?.refusedAction).toContain("Do not guess");
  });

  test("fails loudly on bad JSON", () => {
    const path = fixtureFile("bad-json.jsonl", "{bad json}\n");

    expect(() => runCheck(path)).toThrow(/Invalid JSON.*line 1/);
  });

  test("fails loudly on schema errors", () => {
    const path = fixtureFile(
      "bad-schema.jsonl",
      `${JSON.stringify({ id: "evt-bad", issueId: "ISSUE-BAD" })}\n`,
    );

    expect(() => runCheck(path)).toThrow(/Invalid issue event.*line 1/);
  });
});
