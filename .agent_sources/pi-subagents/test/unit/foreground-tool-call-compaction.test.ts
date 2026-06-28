import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compactForegroundResult, extractToolArgsPreview } from "../../src/shared/utils.ts";
import { formatToolCall } from "../../src/shared/formatters.ts";

describe("foreground tool-call compaction", () => {
	it("stores compact tool-call summaries instead of raw message payloads", () => {
		const result = compactForegroundResult({
			agent: "tester",
			task: "run checks",
			exitCode: 0,
			messages: [{
				role: "assistant",
				content: [{
					type: "toolCall",
					name: "write",
					arguments: {
						path: "/tmp/report.md",
						content: "x".repeat(50_000),
					},
				}],
			}],
			usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0, turns: 0 },
		});

		assert.equal(result.messages, undefined);
		assert.deepEqual(result.toolCalls, [{
			text: "write /tmp/report.md",
			expandedText: "write /tmp/report.md",
		}]);
	});

	it("keeps expanded generic tool-call previews bounded", () => {
		const collapsed = formatToolCall("custom", { payload: "x".repeat(500) });
		const expanded = formatToolCall("custom", { payload: "x".repeat(500) }, true);

		assert.ok(expanded.length > collapsed.length);
		assert.ok(expanded.length < 200);
	});

	it("does not keep an empty toolCalls array after compaction", () => {
		const result = compactForegroundResult({
			agent: "tester",
			task: "run checks",
			exitCode: 0,
			messages: [],
			usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0, turns: 0 },
		});

		assert.equal(result.toolCalls, undefined);
	});

	it("formats array-based web search previews clearly", () => {
		assert.equal(
			extractToolArgsPreview({
				queries: ["Chrome native messaging manifest path macOS", "Chromium native messaging path macOS"],
				workflow: "none",
			}),
			"Chrome native messaging manifest path macOS (+1 more)",
		);
	});

	it("formats fetch_content urls clearly", () => {
		assert.equal(
			extractToolArgsPreview({
				urls: ["https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging", "https://example.com/backup"],
			}),
			"https://developer.chrome.com/docs/extensions/develop/conc...",
		);
	});

	it("falls back to generic array previews", () => {
		assert.equal(
			extractToolArgsPreview({ ids: ["run-a", "run-b", "run-c"] }),
			"ids=run-a (+2 more)",
		);
	});
});
