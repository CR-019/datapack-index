export const PACKAGE_API_BASE = "https://package.afox.moe/v1/packages";
export const PACKAGE_PAGE_PATH = "/wheel/package";

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
	const display = displaySummary(item.display);
	const sourceLabel = sources.includes("nexus") ? "Nexus" : "Maven Central";
	const displayName = display?.name || artifactName;
	const authors = display?.authors?.length ? display.authors : [{ name: group }];
	const semanticTags = display?.tags ?? [];
	const tags = [sourceLabel];
	const gameVersions = display?.gameVersions?.length ? display.gameVersions : [`Mcfpm ${latestVersion}`];
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
	};
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
