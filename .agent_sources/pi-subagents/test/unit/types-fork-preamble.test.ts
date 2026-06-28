import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_FORK_PREAMBLE, wrapForkTask } from "../../src/shared/types.ts";

describe("wrapForkTask", () => {
	it("wraps task with default preamble", () => {
		const wrapped = wrapForkTask("analyze diff");
		assert.match(wrapped, new RegExp(`^${DEFAULT_FORK_PREAMBLE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
		assert.match(wrapped, /\n\nTask:\nanalyze diff$/);
	});

	it("returns task unchanged when disabled", () => {
		const task = "analyze diff";
		assert.equal(wrapForkTask(task, false), task);
	});

	it("is idempotent for already wrapped tasks", () => {
		const once = wrapForkTask("analyze diff");
		const twice = wrapForkTask(once);
		assert.equal(twice, once);
	});
});
