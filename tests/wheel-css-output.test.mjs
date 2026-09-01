import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("Vite config does not collapse every component stylesheet into base.css", () => {
	const config = fs.readFileSync(path.join(import.meta.dirname, "..", ".vitepress", "config.mts"), "utf8");
	assert.doesNotMatch(config, /assetFileNames[\s\S]{0,500}base\.\[ext\]/);
});

test("wheel runtime no longer references the generated static formatter database", () => {
	const root = path.join(import.meta.dirname, "..", ".vitepress", "vue", "wheel");
	for (const file of ["SearchBox.vue", "AllPage.vue", "mcfpmPackages.mjs", "PackagePage.vue"]) {
		const content = fs.readFileSync(path.join(root, file), "utf8");
		assert.doesNotMatch(content, /formatters\.json|datapack_formatters_cache/);
	}
	assert.equal(fs.existsSync(path.join(import.meta.dirname, "..", "public", "formatters.json")), false);
});
