import assert from "node:assert/strict";
import * as path from "node:path";
import { describe, it } from "node:test";
import type { AgentConfig } from "../../src/agents/agents.ts";
import { buildAsyncRunnerSteps } from "../../src/runs/background/async-execution.ts";

function makeAgent(name: string): AgentConfig {
	return {
		name,
		description: `${name} agent`,
		systemPrompt: "Do work",
		systemPromptMode: "replace",
		inheritProjectContext: false,
		inheritSkills: false,
		source: "project",
		filePath: `/tmp/${name}.md`,
	};
}

describe("async permission forwarding session identity", () => {
	it("uses the parent session id for permission forwarding instead of the async status identity", () => {
		const currentSessionId = path.join("/tmp", "parent-session.jsonl");
		const built = buildAsyncRunnerSteps("run-abc", {
			chain: [{ agent: "worker", task: "Do work" }],
			agents: [makeAgent("worker")],
			ctx: {
				pi: {} as never,
				cwd: "/tmp/project",
				currentSessionId,
				parentSessionId: "session-abc123",
			},
			maxSubagentDepth: 1,
			asyncDir: "/tmp/async-run",
		});

		assert.ok(!("error" in built));
		const step = built.steps[0];
		assert.ok(step && !("parallel" in step));
		assert.equal(step.parentSessionId, "session-abc123");
	});
});
