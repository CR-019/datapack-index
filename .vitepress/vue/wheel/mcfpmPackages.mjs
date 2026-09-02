export const PACKAGE_API_BASE = "https://package.afox.moe/v1/packages";
export const PACKAGE_PAGE_PATH = "/wheel/package";
export const STATIC_INDEX_URL = "/datapack-index/wheel-static-index.json";

function requireString(value, field, maximum = 512) {
	if (typeof value !== "string" || !value || value.length > maximum) {
		throw new Error(`Mcfpm API package has an invalid ${field}`);
	}
	return value;
}

function stringArray(value, field, maximum = 100) {
	if (!Array.isArray(value) || value.length > maximum || value.some((entry) => typeof entry !== "string")) {
		throw new Error(`Mcfpm API package has an invalid ${field}`);
	}
	return value;
}

function displaySummary(value) {
	if (value == null) return null;
	if (typeof value !== "object" || Array.isArray(value)) throw new Error("Mcfpm API package has invalid display metadata");
	const authors = Array.isArray(value.authors)
		? value.authors
			.filter((author) => author && typeof author.name === "string" && author.name)
			.slice(0, 20)
			.map((author) => ({ name: author.name, avatarUrl: author.avatarUrl ?? null, links: author.links ?? [] }))
		: [];
	return {
		name: typeof value.name === "string" && value.name ? value.name : null,
		description: typeof value.description === "string" && value.description ? value.description : null,
		coverUrl: typeof value.coverUrl === "string" ? value.coverUrl : null,
		authors,
		tags: Array.isArray(value.tags) ? value.tags.filter((tag) => typeof tag === "string").slice(0, 64) : [],
		gameVersions: Array.isArray(value.gameVersions)
			? value.gameVersions.filter((version) => typeof version === "string").slice(0, 64)
			: [],
		projectUrl: typeof value.projectUrl === "string" ? value.projectUrl : null,
		legacyPath: typeof value.legacyPath === "string" ? value.legacyPath : null,
	};
}

export function packagePageUrl(coordinate, version = null) {
	const query = new URLSearchParams({ package: coordinate });
	if (version) query.set("version", version);
	return `${PACKAGE_PAGE_PATH}?${query}`;
}

export function mapMcfpmPackage(item) {
	if (!item || typeof item !== "object") throw new Error("Mcfpm API package is not an object");
	const group = requireString(item.group, "group");
	const artifactName = requireString(item.name, "name");
	const coordinate = requireString(item.coordinate, "coordinate");
	const latestVersion = requireString(item.latestVersion, "latestVersion");
	if (coordinate !== `${group}:${artifactName}`) throw new Error("Mcfpm API package coordinate does not match");
	const sources = stringArray(item.sources, "sources");
	const types = stringArray(item.types, "types");
	const licenses = stringArray(item.licenses, "licenses");
	const minecraftRequirements = item.minecraftRequirements == null
		? []
		: stringArray(item.minecraftRequirements, "minecraftRequirements");
	const display = displaySummary(item.display);
	const sourceLabel = sources.includes("nexus") ? "Nexus" : "Maven Central";
	const displayName = display?.name || artifactName;
	const authors = display?.authors?.length ? display.authors : [{ name: group }];
	const semanticTags = display?.tags ?? [];
	const tags = [sourceLabel];
	const gameVersions = display?.gameVersions?.length ? display.gameVersions : minecraftRequirements;
	return {
		id: `mcfpm:${coordinate}`,
		coordinate,
		name: displayName,
		description: display?.description || item.description || `${coordinate} 的 Mcfpm 软件包`,
		tokens: [coordinate, displayName, latestVersion, ...authors.map((author) => author.name), ...semanticTags, ...tags, ...gameVersions, ...licenses].join(" "),
		tags,
		path: packagePageUrl(coordinate),
		external: false,
		cover: display?.coverUrl || null,
		gameversion: gameVersions,
		author: authors,
		latestVersion,
		source: sources,
		trust: item.trust,
		licenses,
		legacyPath: display?.legacyPath || null,
	};
}

export function packageRepositoryPageUrl(coordinate, version) {
	const separator = coordinate.indexOf(":");
	if (separator < 1 || !version || typeof version.version !== "string") return null;
	const group = coordinate.slice(0, separator);
	const name = coordinate.slice(separator + 1);
	if (version.source === "central") {
		return `https://central.sonatype.com/artifact/${encodeURIComponent(group)}/${encodeURIComponent(name)}/${encodeURIComponent(version.version)}`;
	}
	if (version.source !== "nexus" || typeof version.repositoryUrl !== "string") return null;
	let repository;
	try {
		repository = new URL(version.repositoryUrl);
	} catch {
		return null;
	}
	if (repository.protocol !== "https:") return null;
	const match = repository.pathname.match(/\/repository\/([^/]+)\/?$/);
	if (!match) return repository.toString();
	const artifactPath = `${group.replaceAll(".", "/")}/${name}/${version.version}`;
	return `${repository.origin}/#browse/browse:${encodeURIComponent(match[1])}:${encodeURIComponent(artifactPath)}`;
}

export function githubRepositoryFromUrl(value) {
	if (typeof value !== "string" || !value) return null;
	let url;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== "https:") return null;
	const hostname = url.hostname.toLowerCase();
	if (!["github.com", "www.github.com", "codeload.github.com", "raw.githubusercontent.com"].includes(hostname)) return null;
	const parts = url.pathname.split("/").filter(Boolean);
	if (parts.length < 2) return null;
	let owner;
	let repository;
	try {
		owner = decodeURIComponent(parts[0]);
		repository = decodeURIComponent(parts[1]).replace(/\.git$/i, "");
	} catch {
		return null;
	}
	return githubRepositoryName(`${owner}/${repository}`);
}

function githubRepositoryName(value) {
	if (typeof value !== "string" || value.length > 200) return null;
	const parts = value.split("/");
	const validPart = /^[A-Za-z0-9_.-]+$/;
	return parts.length === 2 && parts.every((part) => validPart.test(part) && part !== "." && part !== "..") ? value : null;
}

export function mapStaticPackage(item) {
	if (!item || typeof item !== "object" || item.static !== true) throw new Error("Static wheel entry is invalid");
	const name = requireString(item.name, "static name");
	const path = requireString(item.path, "static path");
	if (!path.startsWith("/wheel/resources/") || !path.endsWith(".html") || path.includes("..")) {
		throw new Error("Static wheel entry has an invalid path");
	}
	const author = Array.isArray(item.author)
		? item.author.filter((entry) => entry && typeof entry.name === "string" && entry.name).slice(0, 20)
		: [];
	const gameVersions = stringArray(item.gameversion || [], "static gameversion");
	const githubRepository = githubRepositoryName(item.githubRepository);
	return {
		id: requireString(item.id, "static id"),
		name,
		description: typeof item.description === "string" ? item.description : "",
		tokens: typeof item.tokens === "string" ? item.tokens : "",
		tags: [],
		path,
		external: false,
		cover: typeof item.cover === "string" ? item.cover : null,
		gameversion: gameVersions,
		author,
		githubRepository,
		projectUrl: githubRepository ? `https://github.com/${githubRepository}` : null,
		static: true,
		legacyPath: path,
	};
}

export async function fetchStaticPackages(fetchImpl = fetch, staticIndexUrl = STATIC_INDEX_URL) {
	const response = await fetchImpl(staticIndexUrl, { headers: { Accept: "application/json" } });
	if (!response?.ok) throw new Error(`Static wheel index returned HTTP ${response?.status ?? "unknown"}`);
	const payload = await response.json();
	if (!payload || payload.schema !== 1 || !Array.isArray(payload.items)) throw new Error("Static wheel index returned invalid data");
	return payload.items.map(mapStaticPackage);
}

export function mergePackageCards(dynamicPackages, staticPackages) {
	const dynamicLegacyPaths = new Set(dynamicPackages.map((item) => item.legacyPath).filter(Boolean));
	return [
		...dynamicPackages,
		...staticPackages.filter((item) => !dynamicLegacyPaths.has(item.legacyPath)),
	].sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));
}

export async function fetchPackageCards(
	fetchImpl = fetch,
	apiBase = PACKAGE_API_BASE,
	staticIndexUrl = STATIC_INDEX_URL,
) {
	const [dynamic, staticEntries] = await Promise.allSettled([
		fetchMcfpmPackages(fetchImpl, apiBase),
		fetchStaticPackages(fetchImpl, staticIndexUrl),
	]);
	if (dynamic.status === "rejected" && staticEntries.status === "rejected") {
		throw new AggregateError([dynamic.reason, staticEntries.reason], "Dynamic and static package indexes are unavailable");
	}
	return mergePackageCards(
		dynamic.status === "fulfilled" ? dynamic.value : [],
		staticEntries.status === "fulfilled" ? staticEntries.value : [],
	);
}

export async function fetchMcfpmPackages(fetchImpl = fetch, apiBase = PACKAGE_API_BASE) {
	const packages = [];
	const seenCursors = new Set();
	let cursor = null;
	for (let page = 0; page < 100; page += 1) {
		const url = new URL(apiBase);
		url.searchParams.set("limit", "100");
		if (cursor) url.searchParams.set("cursor", cursor);
		const response = await fetchImpl(url.toString(), { headers: { Accept: "application/json" } });
		if (!response?.ok) throw new Error(`Mcfpm package API returned HTTP ${response?.status ?? "unknown"}`);
		const payload = await response.json();
		if (!payload || !Array.isArray(payload.items)) throw new Error("Mcfpm package API returned invalid data");
		packages.push(...payload.items.map(mapMcfpmPackage));
		cursor = payload.nextCursor;
		if (cursor == null) return packages;
		if (typeof cursor !== "string" || !cursor || seenCursors.has(cursor)) {
			throw new Error("Mcfpm package API returned an invalid pagination cursor");
		}
		seenCursors.add(cursor);
	}
	throw new Error("Mcfpm package API pagination exceeded the safety limit");
}

export async function fetchMcfpmPackage(coordinate, fetchImpl = fetch, apiBase = PACKAGE_API_BASE) {
	const separator = coordinate.indexOf(":");
	if (separator < 1 || separator === coordinate.length - 1) throw new Error("软件包坐标无效");
	const group = coordinate.slice(0, separator);
	const name = coordinate.slice(separator + 1);
	const url = `${apiBase}/${encodeURIComponent(group)}/${encodeURIComponent(name)}`;
	const response = await fetchImpl(url, { headers: { Accept: "application/json" } });
	if (!response?.ok) throw new Error(response?.status === 404 ? "没有找到这个软件包" : `软件包 API 返回 HTTP ${response?.status ?? "unknown"}`);
	const payload = await response.json();
	if (!payload || payload.coordinate !== coordinate || !Array.isArray(payload.versions) || !payload.versions.length) {
		throw new Error("软件包 API 返回了无效数据");
	}
	return payload;
}

export function filterPackageCards(items, query) {
	const terms = String(query || "").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];
	return items.filter((item) => {
		const searchable = `${item.tokens || ""} ${item.name || ""} ${item.description || ""}`.toLocaleLowerCase();
		return terms.every((term) => searchable.includes(term));
	});
}
