import assert from "node:assert/strict";
import test from "node:test";

import {
	STATIC_INDEX_URL,
	fetchEnglishGitHubReadme,
	fetchPackageCards,
	fetchMcfpmPackage,
	fetchMcfpmPackages,
	fetchStaticPackageContent,
	fetchStaticPackageDocument,
	filterPackageCards,
	githubRepositoryFromUrl,
	githubRepositoryTitle,
	isPredominantlyEnglishMarkdown,
	localizePackageCards,
	localizedPackagePath,
	mapMcfpmPackage,
	mapStaticPackage,
	mergePackageCards,
	packageRepositoryPageUrl,
	sortPackageCards,
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
	minecraftRequirements: ["1.21+"],
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
	assert.deepEqual(card.gameversion, ["1.21"]);
});


test("uses only Minecraft requirements for the card version badge", () => {
	const withoutSite = { ...PACKAGE, display: null, minecraftRequirements: ["1.20.5~1.21.8"] };
	assert.deepEqual(mapMcfpmPackage(withoutSite).gameversion, ["1.20.5~1.21.8"]);
	assert.deepEqual(mapMcfpmPackage({ ...withoutSite, minecraftRequirements: [] }).gameversion, []);
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


test("fetches a package detail and filters cards", async () => {
	const detail = { ...PACKAGE, versions: [{ version: "1.2.3", source: "nexus" }] };
	const fetchImpl = async () => ({ ok: true, status: 200, json: async () => detail });
	assert.equal((await fetchMcfpmPackage("org.example:demo", fetchImpl, "https://packages.example/v1/packages")).coordinate, PACKAGE.coordinate);
	const card = mapMcfpmPackage(PACKAGE);
	assert.match(card.tokens, /工具/);
	assert.deepEqual(filterPackageCards([card], "Example 1.21"), [card]);
	assert.deepEqual(filterPackageCards([card], "missing"), []);
});


test("loads the original static document for a migrated package", async () => {
	const markdown = '<div class="nbttree">\n\n<node type="compound" name="root" />\n</div>';
	const englishMarkdown = "# English documentation";
	const fetchImpl = async () => ({
		ok: true,
		status: 200,
		json: async () => ({
			schema: 1,
			items: [{
				legacyPath: "/wheel/resources/demo.html",
				englishPath: "/en/wheel/resources/demo.html",
				name: "演示前置",
				englishName: "Demo Wheel",
				englishDescription: "English summary",
				englishTags: ["library"],
				githubRepository: "Example/demo-repository",
				markdown,
				englishMarkdown,
			}],
		}),
	});
	assert.equal(await fetchStaticPackageContent("/wheel/resources/demo.html", fetchImpl), markdown);
	assert.deepEqual(
		await fetchStaticPackageDocument("/wheel/resources/demo.html", "en-US", fetchImpl),
		{
			markdown: englishMarkdown,
			name: "demo-repository",
			description: "English summary",
			documentPath: "/en/wheel/resources/demo.html",
			tags: ["library"],
			githubRepository: "Example/demo-repository",
		},
	);
	await assert.rejects(() => fetchStaticPackageContent("/../secret.html", fetchImpl), /path is invalid/);
	await assert.rejects(() => fetchStaticPackageContent("/wheel/resources/missing.html", fetchImpl), /not found/);
});


test("merges static definitions as a fallback and removes migrated duplicates", () => {
	const dynamic = mapMcfpmPackage({
		...PACKAGE,
		display: { ...PACKAGE.display, legacyPath: "/wheel/resources/demo.html" },
	});
	const duplicate = mapStaticPackage({
		id: "static:demo",
		name: "Legacy demo",
		englishName: "English demo",
		englishDescription: "English legacy summary",
		englishTokens: "English demo summary",
		description: "legacy",
		tokens: "Legacy demo",
		tags: [],
		path: "/wheel/resources/demo.html",
		englishPath: "/en/wheel/resources/demo.html",
		cover: null,
		gameversion: ["1.20"],
		author: [{ name: "Legacy" }],
		githubRepository: "Legacy/example",
		static: true,
	});
	const fallback = mapStaticPackage({ ...duplicate, id: "static:other", name: "Other", path: "/wheel/resources/other.html", englishPath: null });
	const merged = mergePackageCards([dynamic], [duplicate, fallback]);
	assert.equal(merged.length, 2);
	assert.equal(merged.filter((item) => item.legacyPath === "/wheel/resources/demo.html").length, 1);
	assert.equal(merged.find((item) => item.legacyPath === "/wheel/resources/demo.html").englishDescription, "English legacy summary");
	assert.deepEqual(fallback.tags, []);
	assert.equal(fallback.githubRepository, "Legacy/example");
	assert.equal(fallback.projectUrl, "https://github.com/Legacy/example");
	assert.equal(localizedPackagePath(dynamic, "en-US"), "/en/wheel/package?package=org.example%3Ademo");
	assert.equal(localizedPackagePath(dynamic, { value: "en-US" }), "/en/wheel/package?package=org.example%3Ademo");
	assert.equal(localizedPackagePath(duplicate, "en-US"), "/en/wheel/resources/demo.html");
	assert.equal(localizedPackagePath(fallback, "en-US"), "/en/wheel/resources/other.html");
	assert.equal(localizedPackagePath(dynamic, "zh-CN"), dynamic.path);
});


test("uses GitHub repository names without translating titles and groups English titles first", () => {
	const cards = [
		{ id: "zh-y", name: "中文乙", englishName: "Translated Y", englishDescription: "Y summary", tokens: "中文" },
		{ id: "z", name: "原名 Z", githubRepository: "Example/Zoo", englishName: "Translated Zoo", englishDescription: "Z summary", englishTokens: "Zoo" },
		{ id: "zh-j", name: "中文甲", englishName: "Translated J", englishDescription: "J summary", tokens: "中文" },
		{ id: "a", name: "原名 A", githubRepository: "Example/alpha", englishName: "Translated Alpha", englishDescription: "A summary", englishTokens: "alpha" },
	];
	const localized = localizePackageCards(cards, "en-US");
	assert.deepEqual(localized.map((item) => item.name), ["alpha", "Zoo", "中文甲", "中文乙"]);
	assert.deepEqual(localized.map((item) => item.description), ["A summary", "Z summary", "J summary", "Y summary"]);
	assert.deepEqual(sortPackageCards([
		{ id: "z", name: "Zoo" },
		{ id: "zh", name: "中文工具" },
		{ id: "a", name: "alpha" },
	], "en-US").map((item) => item.id), ["a", "z", "zh"]);
	assert.equal(githubRepositoryTitle("Example/repository-name"), "repository-name");
	assert.equal(githubRepositoryTitle("invalid"), null);
});


test("uses an English GitHub README and rejects a Chinese README", async () => {
	const english = "# Demo\n\nThis package provides useful tools for Minecraft data pack authors.";
	const chinese = "# 演示\n\n这个前置为数据包作者提供实用工具。";
	assert.equal(isPredominantlyEnglishMarkdown(english), true);
	assert.equal(isPredominantlyEnglishMarkdown(chinese), false);
	const responseFor = (markdown) => async (url) => {
		assert.equal(url, "https://api.github.test/repos/Example/Demo/readme");
		return {
			ok: true,
			status: 200,
			json: async () => ({
				encoding: "base64",
				content: Buffer.from(markdown, "utf8").toString("base64"),
				html_url: "https://github.com/Example/Demo/blob/main/README.md",
			}),
		};
	};
	assert.deepEqual(
		await fetchEnglishGitHubReadme("Example/Demo", responseFor(english), "https://api.github.test"),
		{ markdown: english, documentPath: "https://github.com/Example/Demo/blob/main/README.md" },
	);
	assert.equal(await fetchEnglishGitHubReadme("Example/Demo", responseFor(chinese), "https://api.github.test"), null);
});


test("keeps static definitions available when the dynamic API is unavailable", async () => {
	const fetchImpl = async (url) => {
		if (String(url).startsWith("https://packages.example/")) {
			return { ok: false, status: 503 };
		}
		return {
			ok: true,
			status: 200,
			json: async () => ({
				schema: 1,
				items: [{
					id: "static:available",
					name: "Available",
					description: "Static fallback",
					tokens: "Available",
					path: "/wheel/resources/available.html",
					cover: null,
					gameversion: ["1.21"],
					author: [{ name: "Example" }],
					static: true,
				}],
			}),
		};
	};
	const cards = await fetchPackageCards(
		fetchImpl,
		"https://packages.example/v1/packages",
		"/datapack-index/wheel-static-index.json",
	);
	assert.equal(cards.length, 1);
	assert.equal(cards[0].id, "static:available");
});

test("restores the static catalog from session cache after returning to the listing", async () => {
	const values = new Map();
	const storage = {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => values.set(key, value),
	};
	let staticAvailable = true;
	const fetchImpl = async (url) => {
		if (String(url).startsWith("https://packages.example/")) {
			return { ok: true, status: 200, json: async () => ({ items: [PACKAGE], nextCursor: null }) };
		}
		if (!staticAvailable) return { ok: false, status: 503 };
		return {
			ok: true,
			status: 200,
			json: async () => ({
				schema: 1,
				items: [{
					id: "static:cached",
					name: "Cached static page",
					description: "Static fallback",
					tokens: "Cached static page",
					path: "/wheel/resources/cached.html",
					englishPath: "/en/wheel/resources/cached.html",
					cover: null,
					gameversion: ["1.21"],
					author: [{ name: "Example" }],
					static: true,
				}],
			}),
		};
	};

	const first = await fetchPackageCards(fetchImpl, "https://packages.example/v1/packages", STATIC_INDEX_URL, storage);
	staticAvailable = false;
	const afterReturn = await fetchPackageCards(fetchImpl, "https://packages.example/v1/packages", STATIC_INDEX_URL, storage);
	assert.ok(first.some((item) => item.id === "static:cached"));
	assert.ok(afterReturn.some((item) => item.id === "static:cached"));
});


test("builds repository browser links for Nexus and Maven Central", () => {
	assert.equal(
		packageRepositoryPageUrl("org.example:demo", {
			version: "1.2.3",
			source: "nexus",
			repositoryUrl: "https://nexus.example/repository/maven-releases/",
		}),
		"https://nexus.example/#browse/browse:maven-releases:org%2Fexample%2Fdemo%2F1.2.3",
	);
	assert.equal(
		packageRepositoryPageUrl("org.example:demo", { version: "1.2.3", source: "central" }),
		"https://central.sonatype.com/artifact/org.example/demo/1.2.3",
	);
});


test("extracts GitHub repositories from project and archive URLs", () => {
	assert.equal(githubRepositoryFromUrl("https://github.com/Bybycyann/BetterCustomTools"), "Bybycyann/BetterCustomTools");
	assert.equal(githubRepositoryFromUrl("https://github.com/example/demo/archive/refs/tags/v1.0.0.zip"), "example/demo");
	assert.equal(githubRepositoryFromUrl("https://codeload.github.com/example/demo/zip/abc123"), "example/demo");
	assert.equal(githubRepositoryFromUrl("https://raw.githubusercontent.com/example/demo/main/pack.mcmeta"), "example/demo");
});


test("rejects unsafe or malformed GitHub repository URLs", () => {
	assert.equal(githubRepositoryFromUrl("http://github.com/example/demo"), null);
	assert.equal(githubRepositoryFromUrl("https://github.com.evil.example/example/demo"), null);
	assert.equal(githubRepositoryFromUrl("https://github.com/example"), null);
	assert.equal(githubRepositoryFromUrl("https://github.com/example/%2Fdemo"), null);
	assert.equal(githubRepositoryFromUrl("https://github.com/example/.."), null);
});
