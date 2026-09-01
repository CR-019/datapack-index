import assert from "node:assert/strict";
import test from "node:test";

import {
	fetchMcfpmPackage,
	fetchMcfpmPackages,
	filterPackageCards,
	mapMcfpmPackage,
} from "../.vitepress/vue/wheel/mcfpmPackages.mjs";


const PACKAGE = {
	coordinate: "org.example:demo",
	group: "org.example",
	name: "demo",
	latestVersion: "1.2.3",
	trust: "reviewed",
	sources: ["nexus"],
	types: ["minecraft.datapack"],
	licenses: ["MIT"],
	description: null,
	display: {
		name: "演示前置",
		description: "来自动态索引的介绍",
		coverUrl: "https://example.test/cover.png",
		authors: [{ name: "Example", avatarUrl: null, links: [] }],
		tags: ["工具"],
		gameVersions: ["1.21"],
		projectUrl: "https://example.test/project",
		legacyPath: null,
	},
};


test("maps a package summary to an internal dynamic library page", () => {
	const card = mapMcfpmPackage(PACKAGE);
	assert.equal(card.id, "mcfpm:org.example:demo");
	assert.equal(card.path, "/wheel/package?package=org.example%3Ademo");
	assert.equal(card.external, false);
	assert.equal(card.name, "演示前置");
	assert.deepEqual(card.author, [{ name: "Example", avatarUrl: null, links: [] }]);
	assert.deepEqual(card.tags, ["Nexus"]);
});


test("fetches all bounded API pages", async () => {
	const requested = [];
	const pages = [
		{ items: [PACKAGE], nextCursor: "page-2" },
		{ items: [{ ...PACKAGE, coordinate: "org.example:other", name: "other" }], nextCursor: null },
	];
	const fetchImpl = async (url) => {
		requested.push(url);
		return { ok: true, status: 200, json: async () => pages.shift() };
	};
	const result = await fetchMcfpmPackages(fetchImpl, "https://packages.example/v1/packages");
	assert.equal(result.length, 2);
	assert.match(requested[1], /cursor=page-2/);
});


test("rejects a mismatched API coordinate", () => {
	assert.throws(() => mapMcfpmPackage({ ...PACKAGE, coordinate: "org.example:other" }), /does not match/);
});


test("fetches a package detail and filters cards without the static formatter database", async () => {
	const detail = { ...PACKAGE, versions: [{ version: "1.2.3", source: "nexus" }] };
	const fetchImpl = async () => ({ ok: true, status: 200, json: async () => detail });
	assert.equal((await fetchMcfpmPackage("org.example:demo", fetchImpl, "https://packages.example/v1/packages")).coordinate, PACKAGE.coordinate);
	const card = mapMcfpmPackage(PACKAGE);
	assert.match(card.tokens, /工具/);
	assert.deepEqual(filterPackageCards([card], "Example 1.21"), [card]);
	assert.deepEqual(filterPackageCards([card], "missing"), []);
});
