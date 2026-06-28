import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { describe, it } from "node:test";
import { pathToFileURL } from "node:url";
import { resolve } from "../support/ts-loader.mjs";

describe("ts-loader", () => {
	it("rewrites .js imports when the parent path contains spaces", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "pi-ts-loader space "));
		const parentDir = path.join(root, "folder with spaces");
		fs.mkdirSync(parentDir, { recursive: true });
		fs.writeFileSync(path.join(parentDir, "target.ts"), "export const value = 1;\n", "utf-8");

		try {
			let resolvedSpecifier: string | undefined;
			const result = resolve(
				"./target.js",
				{ parentURL: pathToFileURL(path.join(parentDir, "entry.mjs")).href },
				(specifier: string) => {
					resolvedSpecifier = specifier;
					return { url: pathToFileURL(path.resolve(parentDir, specifier)).href };
				},
			);

			assert.equal(resolvedSpecifier, "./target.ts");
			assert.equal(result.url, pathToFileURL(path.join(parentDir, "target.ts")).href);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});
});
