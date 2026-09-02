function localeNeutralPath(pathname, baseUrl) {
	const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	if (!pathname.startsWith(base)) return null;
	let relative = pathname.slice(base.length);
	if (relative.startsWith("en/")) relative = relative.slice(3);
	return relative
		.replace(/(?:^|\/)index\.html$/, "")
		.replace(/\.html$/, "")
		.replace(/\/+$/, "");
}

export function preserveLocaleQuery(currentHref, targetHref, baseUrl = "/") {
	let current;
	let target;
	try {
		current = new URL(currentHref);
		target = new URL(targetHref, current);
	} catch {
		return targetHref;
	}
	if (!current.search || current.origin !== target.origin) return targetHref;
	const currentPath = localeNeutralPath(current.pathname, baseUrl);
	const targetPath = localeNeutralPath(target.pathname, baseUrl);
	if (currentPath === null || currentPath !== targetPath) return targetHref;
	target.search = current.search;
	return `${target.pathname}${target.search}${target.hash}`;
}
