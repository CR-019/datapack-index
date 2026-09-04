const STATIC_WHEEL_PAGE = /^(?:en\/)?wheel\/resources\/.+\.md$/i;

export function staticWheelPageLayout(relativePath, frontmatter = {}) {
	const normalizedPath = String(relativePath || "").replaceAll("\\", "/");
	return frontmatter?.wheel === true && STATIC_WHEEL_PAGE.test(normalizedPath)
		? "StaticPackagePage"
		: null;
}
