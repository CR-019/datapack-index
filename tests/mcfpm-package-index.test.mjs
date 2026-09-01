import assert from "node:assert/strict";
import test from "node:test";

import { fetchMcfpmPackages, mapMcfpmPackage } from "../.vitepress/vue/wheel/mcfpmPackages.mjs";


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
};


test("maps a package summary to an external library card", () => {
	const card = mapMcfpmPackage(PACKAGE, "https://packages.example/v1/packages");
	assert.equal(card.id, "mcfpm:org.example:demo");
	assert.equal(card.path, "https://packages.example/v1/packages/org.example/demo");
	assert.equal(card.external, true);
	assert.deepEqual(card.author, [{ name: "org.example" }]);
	assert.ok(card.tags.includes("Reviewed"));
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
