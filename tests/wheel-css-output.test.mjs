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
	const content = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "public", "wheel-static-content.json"), "utf8"));
	assert.equal(content.schema, 1);
	assert.equal(content.items.length, fallback.items.length);
	const nbtTree = content.items.find((item) => item.legacyPath === "/wheel/resources/ChestMinecartGUI.html");
	assert.match(nbtTree.markdown, /<div class="nbttree">/);
	assert.match(nbtTree.markdown, /<node type="compound"/);
	assert.doesNotMatch(nbtTree.markdown, /<InfoCard/);
});

test("runtime documentation inherits the library's native Markdown styles", () => {
	const packagePage = fs.readFileSync(path.join(import.meta.dirname, "..", ".vitepress", "vue", "wheel", "PackagePage.vue"), "utf8");
	assert.doesNotMatch(packagePage, /\.package-markdown\s*:deep/);
	assert.doesNotMatch(packagePage, /\.package-sidebar\s*\{[^}]*position:\s*sticky/);
});
