import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { preserveLocaleQuery } from "../.vitepress/vue/localeLinks.mjs";

const root = path.join(import.meta.dirname, "..");

test("English home routes Wheel Search to the English Wheel", () => {
	const home = fs.readFileSync(path.join(root, "en", "index.md"), "utf8");
	assert.match(home, /text: Wheel Search\s+link: \/en\/wheel\//);
});

test("Wheel uses the requested terminology and corresponding-page language routing", () => {
	const config = fs.readFileSync(path.join(root, ".vitepress", "config.mts"), "utf8");
	const wheelComponents = ["SearchBox.vue", "AllPage.vue", "PackagePage.vue", "InfoCard.vue"]
		.map((name) => fs.readFileSync(path.join(root, ".vitepress", "vue", "wheel", name), "utf8"))
		.join("\n");
	assert.match(config, /\{ text: "Wheel", link: "\/en\/wheel\/" \}/);
	assert.match(config, /i18nRouting: true/);
	assert.doesNotMatch(wheelComponents, /Prerequisite Library/i);
});

test("locale switching preserves the current package and list query", () => {
	assert.equal(
		preserveLocaleQuery(
			"https://example.test/datapack-index/wheel/package?package=org.example%3Ademo&version=1.2.3",
			"/datapack-index/en/wheel/package.html",
			"/datapack-index/",
		),
		"/datapack-index/en/wheel/package.html?package=org.example%3Ademo&version=1.2.3",
	);
	assert.equal(
		preserveLocaleQuery(
			"https://example.test/datapack-index/en/wheel/all?page=3",
			"/datapack-index/wheel/all.html",
			"/datapack-index/",
		),
		"/datapack-index/wheel/all.html?page=3",
	);
	assert.equal(
		preserveLocaleQuery(
			"https://example.test/datapack-index/wheel/all?page=3",
			"/datapack-index/en/index.html",
			"/datapack-index/",
		),
		"/datapack-index/en/index.html",
	);
});
