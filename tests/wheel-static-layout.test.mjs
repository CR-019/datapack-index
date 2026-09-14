import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { staticWheelPageLayout } from "../.vitepress/wheelPageLayout.mjs";

const root = path.join(import.meta.dirname, "..");

test("uses the shared static package layout only for Wheel resource documents", () => {
	assert.equal(staticWheelPageLayout("wheel/resources/demo.md", { wheel: true }), "StaticPackagePage");
	assert.equal(staticWheelPageLayout("en\\wheel\\resources\\demo.md", { wheel: true }), "StaticPackagePage");
	assert.equal(staticWheelPageLayout("wheel/package.md", { wheel: true }), null);
	assert.equal(staticWheelPageLayout("wheel/resources/demo.md", { wheel: false }), null);
	assert.equal(staticWheelPageLayout("index/demo.md", { wheel: true }), null);
});

test("static and dynamic package pages share one layout stylesheet", () => {
	const wheelRoot = path.join(root, ".vitepress", "vue", "wheel");
	const dynamicPage = fs.readFileSync(path.join(wheelRoot, "PackagePage.vue"), "utf8");
	const staticPage = fs.readFileSync(path.join(wheelRoot, "StaticPackagePage.vue"), "utf8");
	assert.match(dynamicPage, /<style scoped src="\.\/packagePage\.css"><\/style>/);
	assert.match(staticPage, /<style scoped src="\.\/packagePage\.css"><\/style>/);
	assert.match(staticPage, /<Content\s*\/>/);
	assert.match(staticPage, /notPublishedTitle/);
	assert.match(staticPage, /<RepoCard/);
	assert.doesNotMatch(staticPage, /installCommand|navigator\.clipboard|class="command-row"|<select/);
});

test("VitePress assigns and registers the static package layout", () => {
	const config = fs.readFileSync(path.join(root, ".vitepress", "config.mts"), "utf8");
	const theme = fs.readFileSync(path.join(root, ".vitepress", "theme", "index.ts"), "utf8");
	const infoCard = fs.readFileSync(path.join(root, ".vitepress", "vue", "wheel", "InfoCard.vue"), "utf8");
	assert.match(config, /transformPageData\(pageData\)/);
	assert.match(config, /staticWheelPageLayout\(pageData\.relativePath, pageData\.frontmatter\)/);
	assert.match(theme, /app\.component\('StaticPackagePage', StaticPackagePage\)/);
	assert.match(infoCard, /isStaticPackageLayout/);
});
