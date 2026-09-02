#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import fg from "fast-glob";
import matter from "gray-matter";

const root = process.cwd();
const outputPath = path.join(root, "public", "wheel-static-index.json");
const contentOutputPath = path.join(root, "public", "wheel-static-content.json");

function strings(value) {
	if (Array.isArray(value)) return value.filter((entry) => typeof entry === "string" && entry.trim()).map((entry) => entry.trim());
	return typeof value === "string" && value.trim() ? [value.trim()] : [];
}

function authorName(key) {
	if (!key || key.includes("/") || key.includes("\\")) return key;
	const authorPath = path.join(root, "public", "authors", `${key}.json`);
	if (!fs.existsSync(authorPath)) return key;
	try {
		const author = JSON.parse(fs.readFileSync(authorPath, "utf8"));
		return typeof author.name === "string" && author.name.trim() ? author.name.trim() : key;
	} catch {
		return key;
	}
}

function authors(value) {
	const values = Array.isArray(value) ? value : value == null ? [] : [value];
	return values.flatMap((entry) => {
		if (typeof entry === "string" && entry.trim()) return [{ name: authorName(entry.trim()) }];
		if (!entry || typeof entry !== "object" || typeof entry.name !== "string" || !entry.name.trim()) return [];
		return [{ ...entry, name: authorName(entry.name.trim()) }];
	});
}

function githubRepository(value) {
	if (typeof value !== "string" || value.length > 200) return null;
	const repository = value.trim();
	const parts = repository.split("/");
	const validPart = /^[A-Za-z0-9_.-]+$/;
	return parts.length === 2 && parts.every((part) => validPart.test(part) && part !== "." && part !== "..") ? repository : null;
}

function staticPage(relativePath) {
	const parsed = matter(fs.readFileSync(path.join(root, relativePath), "utf8"));
	const data = parsed.data || {};
	const name = typeof data.name === "string" && data.name.trim()
		? data.name.trim()
		: path.posix.basename(relativePath, ".md");
	const description = typeof data.description === "string" ? data.description.trim() : "";
	const cardAuthors = authors(data.author);
	const semanticTags = strings(data.tags);
	const gameVersions = strings(data.gameversion);
	const repository = githubRepository(data.repo);
	const legacyPath = `/${relativePath.replace(/\.md$/i, ".html")}`;
	const englishSource = path.join(root, "en", relativePath);
	if (!fs.existsSync(englishSource)) {
		throw new Error(`Static wheel page is missing its English route: en/${relativePath}`);
	}
	const englishParsed = matter(fs.readFileSync(englishSource, "utf8"));
	const englishData = englishParsed.data || {};
	const englishName = typeof englishData.name === "string" && englishData.name.trim()
		? englishData.name.trim()
		: name;
	const englishDescription = typeof englishData.description === "string"
		? englishData.description.trim()
		: description;
	const englishTags = strings(englishData.tags);
	const englishPath = `/en/${relativePath.replace(/\.md$/i, ".html")}`;
	const card = {
		id: `static:${relativePath}`,
		name,
		description,
		tokens: [name, description, ...cardAuthors.map((author) => author.name), ...semanticTags, ...gameVersions, repository || ""].join(" "),
		englishName,
		englishDescription,
		englishTokens: [englishName, englishDescription, ...cardAuthors.map((author) => author.name), ...englishTags, ...gameVersions, repository || ""].join(" "),
		tags: [],
		path: legacyPath,
		englishPath,
		legacyPath,
		cover: typeof data.cover === "string" && data.cover ? data.cover : null,
		gameversion: gameVersions,
		author: cardAuthors,
		githubRepository: repository,
		projectUrl: repository ? `https://github.com/${repository}` : null,
		packageVersion: typeof data.version === "string" || typeof data.version === "number" ? String(data.version) : null,
		static: true,
	};
	const markdown = parsed.content
		.replace(/^\s*<InfoCard\s*\/>\s*/i, "")
		.trim();
	const englishMarkdown = englishParsed.content
		.replace(/^\s*<InfoCard\s*\/>\s*/i, "")
		.trim();
	return {
		card,
		content: {
			legacyPath,
			englishPath,
			name,
			description,
			englishName,
			englishDescription,
			englishTags,
			githubRepository: repository,
			markdown,
			englishMarkdown,
		},
	};
}

const files = await fg("wheel/resources/**/*.md", { cwd: root, onlyFiles: true });
const pages = files.map((file) => staticPage(file.replaceAll("\\", "/")));
const items = pages.map((page) => page.card)
	.sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));
const content = pages.map((page) => page.content)
	.sort((left, right) => left.legacyPath.localeCompare(right.legacyPath));

function writeJson(target, value) {
	const output = `${JSON.stringify(value)}\n`;
	fs.mkdirSync(path.dirname(target), { recursive: true });
	const temporary = `${target}.${process.pid}.tmp`;
	fs.writeFileSync(temporary, output, { encoding: "utf8", mode: 0o644 });
	fs.renameSync(temporary, target);
}

writeJson(outputPath, { schema: 1, items });
writeJson(contentOutputPath, { schema: 1, items: content });
process.stdout.write(`Wrote ${items.length} static wheel definitions and source documents.\n`);
