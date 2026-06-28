import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	buildModelCandidates,
	isRetryableModelFailure,
	resolveModelCandidate,
	resolveSubagentModelOverride,
} from "../../src/runs/shared/model-fallback.ts";

describe("model fallback helpers", () => {
	const availableModels = [
		{ provider: "openai", id: "gpt-5-mini", fullId: "openai/gpt-5-mini" },
		{ provider: "anthropic", id: "claude-sonnet-4", fullId: "anthropic/claude-sonnet-4" },
	];

	it("keeps explicit provider/model ids unchanged", () => {
		assert.equal(resolveModelCandidate("openai/gpt-5-mini", availableModels), "openai/gpt-5-mini");
	});

	it("resolves a bare id when there is exactly one registry match", () => {
		assert.equal(resolveModelCandidate("gpt-5-mini", availableModels), "openai/gpt-5-mini");
	});

	it("preserves thinking suffix when resolving a bare id", () => {
		assert.equal(resolveModelCandidate("gpt-5-mini:high", availableModels), "openai/gpt-5-mini:high");
	});

	it("leaves ambiguous bare ids untouched", () => {
		const ambiguous = [
			...availableModels,
			{ provider: "github-copilot", id: "gpt-5-mini", fullId: "github-copilot/gpt-5-mini" },
		];
		assert.equal(resolveModelCandidate("gpt-5-mini", ambiguous), "gpt-5-mini");
	});

	it("prefers the current provider when an ambiguous bare id exists there", () => {
		const ambiguous = [
			...availableModels,
			{ provider: "github-copilot", id: "gpt-5-mini", fullId: "github-copilot/gpt-5-mini" },
		];
		assert.equal(resolveModelCandidate("gpt-5-mini", ambiguous, "github-copilot"), "github-copilot/gpt-5-mini");
	});

	it("falls back to the unique registry match when the current provider does not offer the model", () => {
		assert.equal(resolveModelCandidate("claude-sonnet-4", availableModels, "github-copilot"), "anthropic/claude-sonnet-4");
	});

	it("builds a deduplicated ordered candidate list", () => {
		assert.deepEqual(
			buildModelCandidates("gpt-5-mini", ["openai/gpt-5-mini", "anthropic/claude-sonnet-4", "gpt-5-mini"], availableModels),
			["openai/gpt-5-mini", "anthropic/claude-sonnet-4"],
		);
	});

	it("applies the current provider preference to fallback candidates too", () => {
		const ambiguous = [
			...availableModels,
			{ provider: "github-copilot", id: "gpt-5-mini", fullId: "github-copilot/gpt-5-mini" },
		];
		assert.deepEqual(
			buildModelCandidates("gpt-5-mini", ["gpt-5-mini", "anthropic/claude-sonnet-4"], ambiguous, "github-copilot"),
			["github-copilot/gpt-5-mini", "anthropic/claude-sonnet-4"],
		);
	});

	it("detects retryable provider/model failures", () => {
		assert.equal(isRetryableModelFailure("rate limit exceeded for provider"), true);
		assert.equal(isRetryableModelFailure("model unavailable"), true);
		assert.equal(isRetryableModelFailure("authentication failed"), true);
	});

	it("does not treat ordinary task/tool failures as retryable model failures", () => {
		assert.equal(isRetryableModelFailure("bash failed (exit 1): command not found"), false);
		assert.equal(isRetryableModelFailure("read failed (exit 1): no such file or directory"), false);
		assert.equal(isRetryableModelFailure(undefined), false);
	});
});

describe("resolveSubagentModelOverride (cross-session inherit, issue #266)", () => {
	const availableModels = [
		{ provider: "openai", id: "gpt-5-mini", fullId: "openai/gpt-5-mini" },
		{ provider: "anthropic", id: "claude-sonnet-4", fullId: "anthropic/claude-sonnet-4" },
	];
	const parentModel = { provider: "deepseek", id: "deepseek-v4-flash" };

	it("inherits the parent session model when no model is requested", () => {
		// The crux of the bug: an undefined model must NOT collapse to `undefined`
		// (which leaves the child to read the shared global settings.json), but
		// must pin the parent session's in-memory provider/id.
		assert.equal(
			resolveSubagentModelOverride(undefined, parentModel, availableModels),
			"deepseek/deepseek-v4-flash",
		);
	});

	it("inherits the parent session model when the model is the \"inherit\" sentinel", () => {
		assert.equal(
			resolveSubagentModelOverride("inherit", parentModel, availableModels),
			"deepseek/deepseek-v4-flash",
		);
	});

	it("inherits the parent session model when the agent config sets model: false (delegate)", () => {
		assert.equal(
			resolveSubagentModelOverride(false, parentModel, availableModels),
			"deepseek/deepseek-v4-flash",
		);
	});

	it("treats an empty or whitespace-only model as inherit", () => {
		assert.equal(resolveSubagentModelOverride("", parentModel, availableModels), "deepseek/deepseek-v4-flash");
		assert.equal(resolveSubagentModelOverride("   ", parentModel, availableModels), "deepseek/deepseek-v4-flash");
	});

	it("trims surrounding whitespace from the \"inherit\" sentinel", () => {
		assert.equal(resolveSubagentModelOverride("  inherit  ", parentModel, availableModels), "deepseek/deepseek-v4-flash");
	});

	it("keeps an explicit provider/id model unchanged", () => {
		assert.equal(
			resolveSubagentModelOverride("anthropic/claude-sonnet-4", parentModel, availableModels),
			"anthropic/claude-sonnet-4",
		);
	});

	it("resolves an explicit bare id against the registry, not the parent", () => {
		assert.equal(
			resolveSubagentModelOverride("gpt-5-mini", parentModel, availableModels),
			"openai/gpt-5-mini",
		);
	});

	it("returns undefined when inheriting but no parent model is known", () => {
		// No parent session model available: fall back to the prior behavior of
		// emitting no override rather than inventing an invalid one.
		assert.equal(resolveSubagentModelOverride(undefined, undefined, availableModels), undefined);
		assert.equal(resolveSubagentModelOverride("inherit", undefined, availableModels), undefined);
		assert.equal(resolveSubagentModelOverride(false, undefined, availableModels), undefined);
	});

	it("never emits the literal \"inherit\" string as a model", () => {
		// Regression guard: the old resolveModelCandidate returned \"inherit\" verbatim
		// (no registry match), which the child rejected and silently fell back to
		// the global default.
		assert.notEqual(resolveSubagentModelOverride("inherit", parentModel, availableModels), "inherit");
		assert.notEqual(resolveSubagentModelOverride("inherit", undefined, availableModels), "inherit");
	});
});
