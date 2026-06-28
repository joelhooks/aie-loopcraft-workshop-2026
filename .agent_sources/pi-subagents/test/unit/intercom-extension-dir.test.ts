import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { diagnoseIntercomBridge, INTERCOM_EXTENSION_DIR_ENV } from "../../src/intercom/intercom-bridge.ts";

let tempDir = "";
let agentDir = "";
const saved: Record<string, string | undefined> = {};
const MANAGED_ENV = ["PI_CODING_AGENT_DIR", INTERCOM_EXTENSION_DIR_ENV];

describe("PI_INTERCOM_EXTENSION_DIR override", () => {
	beforeEach(() => {
		for (const key of MANAGED_ENV) saved[key] = process.env[key];
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-intercom-ext-dir-"));
		// Point the agent dir at an empty temp dir so the default
		// `<agentDir>/extensions/pi-intercom` location does not exist.
		agentDir = path.join(tempDir, "agent");
		fs.mkdirSync(agentDir, { recursive: true });
		process.env.PI_CODING_AGENT_DIR = agentDir;
		delete process.env[INTERCOM_EXTENSION_DIR_ENV];
	});

	afterEach(() => {
		for (const key of MANAGED_ENV) {
			if (saved[key] === undefined) delete process.env[key];
			else process.env[key] = saved[key];
		}
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	it("resolves the bridge extension dir from the env var", () => {
		const storeIntercom = path.join(tempDir, "store", "node_modules", "pi-intercom");
		fs.mkdirSync(storeIntercom, { recursive: true });
		process.env[INTERCOM_EXTENSION_DIR_ENV] = storeIntercom;

		const diagnostic = diagnoseIntercomBridge({
			config: { mode: "always" },
			context: "fresh",
			orchestratorTarget: "main",
		});
		assert.equal(diagnostic.extensionDir, path.resolve(storeIntercom));
	});

	it("falls back to the default agent-dir location when the env var is unset", () => {
		const defaultDir = path.join(agentDir, "extensions", "pi-intercom");
		fs.mkdirSync(defaultDir, { recursive: true });

		const diagnostic = diagnoseIntercomBridge({
			config: { mode: "always" },
			context: "fresh",
			orchestratorTarget: "main",
		});
		assert.equal(diagnostic.extensionDir, path.resolve(defaultDir));
	});

	it("prefers an explicit input.extensionDir over the env var", () => {
		const envDir = path.join(tempDir, "env-intercom");
		const explicitDir = path.join(tempDir, "explicit-intercom");
		fs.mkdirSync(envDir, { recursive: true });
		fs.mkdirSync(explicitDir, { recursive: true });
		process.env[INTERCOM_EXTENSION_DIR_ENV] = envDir;

		const diagnostic = diagnoseIntercomBridge({
			config: { mode: "always" },
			context: "fresh",
			orchestratorTarget: "main",
			extensionDir: explicitDir,
		});
		assert.equal(diagnostic.extensionDir, path.resolve(explicitDir));
	});
});
