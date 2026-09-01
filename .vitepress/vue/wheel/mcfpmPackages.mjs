export const PACKAGE_API_BASE = "https://package.afox.moe/v1/packages";

function requireString(value, field) {
	if (typeof value !== "string" || !value || value.length > 512) {
		throw new Error(`Mcfpm API package has an invalid ${field}`);
	}
	return value;
}

function requireStringArray(value, field) {
	if (!Array.isArray(value) || value.length > 100 || value.some((entry) => typeof entry !== "string")) {
		throw new Error(`Mcfpm API package has an invalid ${field}`);
	}
	return value;
}

export function mapMcfpmPackage(item, apiBase = PACKAGE_API_BASE) {
	if (!item || typeof item !== "object") throw new Error("Mcfpm API package is not an object");
	const group = requireString(item.group, "group");
	const name = requireString(item.name, "name");
	const coordinate = requireString(item.coordinate, "coordinate");
	const latestVersion = requireString(item.latestVersion, "latestVersion");
	if (coordinate !== `${group}:${name}`) throw new Error("Mcfpm API package coordinate does not match");
	const sources = requireStringArray(item.sources, "sources");
	const types = requireStringArray(item.types, "types");
	const licenses = requireStringArray(item.licenses, "licenses");
	const trust = item.trust === "reviewed" ? "Reviewed" : "Community";
	const sourceLabels = sources.map((source) => source === "nexus" ? "Nexus" : "Maven Central");
	const tags = ["Mcfpm", trust, ...sourceLabels, ...types].slice(0, 8);
	const detailUrl = `${apiBase}/${encodeURIComponent(group)}/${encodeURIComponent(name)}`;
	return {
		id: `mcfpm:${coordinate}`,
		coordinate,
		name,
		description: typeof item.description === "string" && item.description
			? item.description
			: `${coordinate} · Mcfpm package`,
		tokens: [coordinate, name, latestVersion, ...sources, ...types, ...licenses].join(" "),
		tags,
		path: detailUrl,
		external: true,
		cover: null,
		gameversion: [`Mcfpm ${latestVersion}`],
		author: [{ name: group }],
		latestVersion,
		source: sources,
		trust: item.trust,
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
		if (!response || !response.ok) {
			throw new Error(`Mcfpm package API returned HTTP ${response?.status ?? "unknown"}`);
		}
		const payload = await response.json();
		if (!payload || !Array.isArray(payload.items)) throw new Error("Mcfpm package API returned invalid data");
		packages.push(...payload.items.map((item) => mapMcfpmPackage(item, apiBase)));
		cursor = payload.nextCursor;
		if (cursor == null) return packages;
		if (typeof cursor !== "string" || !cursor || seenCursors.has(cursor)) {
			throw new Error("Mcfpm package API returned an invalid pagination cursor");
		}
		seenCursors.add(cursor);
	}
	throw new Error("Mcfpm package API pagination exceeded the safety limit");
}
