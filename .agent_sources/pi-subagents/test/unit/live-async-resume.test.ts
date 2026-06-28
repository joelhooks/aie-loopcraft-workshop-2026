import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { describe, it } from "node:test";
import {
	ASYNC_RESUME_INTERRUPT_SIGNAL,
	interruptLiveAsyncResumeTarget,
	resolveAsyncResumeTarget,
} from "../../src/runs/background/async-resume.ts";

function writeJson(filePath: string, value: object): void {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

describe("live async resume interrupt", () => {
	it("interrupts a resolved live async child before the caller sends a follow-up", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "pi-live-async-resume-"));
		try {
			const asyncRoot = path.join(root, "runs");
			const resultsDir = path.join(root, "results");
			const asyncDir = path.join(asyncRoot, "run-live");
			writeJson(path.join(asyncDir, "status.json"), {
				runId: "run-live",
				mode: "single",
				state: "running",
				pid: process.pid,
				cwd: root,
				startedAt: 100,
				lastUpdate: Date.now(),
				steps: [{ agent: "worker", status: "running", startedAt: 100 }],
			});
			const target = resolveAsyncResumeTarget({ id: "run-live" }, { asyncDirRoot: asyncRoot, resultsDir });
			assert.equal(target.kind, "live");

			const kills: Array<{ pid: number; signal?: NodeJS.Signals | 0 }> = [];
			const state = {
				asyncJobs: new Map([["run-live", {
					asyncId: "run-live",
					asyncDir,
					status: "running" as const,
					pid: process.pid,
					activityState: "needs_attention" as const,
					updatedAt: 100,
				}]]),
			};

			const result = interruptLiveAsyncResumeTarget({
				target,
				state,
				now: () => 1234,
				kill: (pid, signal) => {
					kills.push({ pid, signal });
					return true;
				},
			});

			assert.deepEqual(result, { ok: true, asyncId: "run-live" });
			assert.deepEqual(kills, [{ pid: process.pid, signal: ASYNC_RESUME_INTERRUPT_SIGNAL }]);
			assert.equal(state.asyncJobs.get("run-live")?.activityState, undefined);
			assert.equal(state.asyncJobs.get("run-live")?.updatedAt, 1234);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});
});
