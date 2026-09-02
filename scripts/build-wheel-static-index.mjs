#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import fg from "fast-glob";
import matter from "gray-matter";

const root = process.cwd();
const outputPath = path.join(root, "public", "wheel-static-index.json");

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

function staticCard(relativePath) {
	const parsed = matter(fs.readFileSync(path.join(root, relativePath), "utf8"));
	const data = parsed.data || {};
	const name = typeof data.name === "string" && data.name.trim()
		? data.name.trim()
		: path.posix.basename(relativePath, ".md");
	const description = typeof data.description === "string" ? data.description.trim() : "";
	const cardAuthors = authors(data.author);
	const semanticTags = strings(data.tags);
	const gameVersions = strings(data.gameversion);
	const legacyPath = `/${relativePath.replace(/\.md$/i, ".html")}`;
	return {
		id: `static:${relativePath}`,
		name,
		description,
		tokens: [name, description, ...cardAuthors.map((author) => author.name), ...semanticTags, ...gameVersions, data.repo || ""].join(" "),
		tags: [],
		path: legacyPath,
		legacyPath,
		cover: typeof data.cover === "string" && data.cover ? data.cover : null,
		gameversion: gameVersions,
		author: cardAuthors,
		packageVersion: typeof data.version === "string" || typeof data.version === "number" ? String(data.version) : null,
		static: true,
	};
}

const files = await fg("wheel/resources/**/*.md", { cwd: root, onlyFiles: true });
const items = files.map((file) => staticCard(file.replaceAll("\\", "/")))
	.sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));
const output = `${JSON.stringify({ schema: 1, items })}\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const temporary = `${outputPath}.${process.pid}.tmp`;
fs.writeFileSync(temporary, output, { encoding: "utf8", mode: 0o644 });
fs.renameSync(temporary, outputPath);
process.stdout.write(`Wrote ${items.length} static wheel definitions to ${path.relative(root, outputPath)}.\n`);
