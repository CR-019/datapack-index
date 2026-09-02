import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("Vite config does not collapse every component stylesheet into base.css", () => {
	const config = fs.readFileSync(path.join(import.meta.dirname, "..", ".vitepress", "config.mts"), "utf8");
	assert.doesNotMatch(config, /assetFileNames[\s\S]{0,500}base\.\[ext\]/);
});

test("wheel runtime uses the generated static fallback without restoring the old formatter database", () => {
	const root = path.join(import.meta.dirname, "..", ".vitepress", "vue", "wheel");
	const runtime = fs.readFileSync(path.join(root, "mcfpmPackages.mjs"), "utf8");
	assert.match(runtime, /wheel-static-index\.json/);
	assert.doesNotMatch(runtime, /formatters\.json|datapack_formatters_cache/);
	assert.equal(fs.existsSync(path.join(import.meta.dirname, "..", "public", "formatters.json")), false);
	const fallback = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "public", "wheel-static-index.json"), "utf8"));
	assert.equal(fallback.schema, 1);
	assert.equal(fallback.items.length, 55);
	const repositoryEntries = fallback.items.filter((item) => item.githubRepository);
	assert.equal(repositoryEntries.length, 53);
	for (const item of repositoryEntries) {
		assert.equal(item.projectUrl, `https://github.com/${item.githubRepository}`);
	}
});
