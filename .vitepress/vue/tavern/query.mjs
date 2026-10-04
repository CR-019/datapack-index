/**
 * 酒馆看板 · 查询参数（URL query）助手
 * =============================================================================
 * VitePress 没有动态路由，所以详情页统一走 ?id=... 的形式（沿用站内 /wheel/package?package= 的先例）。
 * 这里集中处理三件事：
 *   1. 从 location.search 读筛选状态（刷新 / 分享链接后能还原）
 *   2. 把筛选状态写回 URL（用 replaceState，不刷屏历史记录）
 *   3. 同路径只换 query 的站内跳转（VitePress 路由只认 path，同 path 跳转不会重新挂载组件，
 *      这里用 pushState + 合成 popstate 通知已挂载的页面重新读取 query）
 */

function currentParams() {
	if (typeof window === "undefined") return new URLSearchParams();
	return new URLSearchParams(window.location.search || "");
}

/** 读取单个参数。 */
export function readParam(key, fallback = "") {
	const value = currentParams().get(key);
	return value == null ? fallback : value;
}

/** 读取可重复参数（?tag=a&tag=b）。 */
export function readParamList(key) {
	return currentParams().getAll(key).filter(Boolean);
}

/**
 * 把筛选状态写进 URL。
 * @param {object} patch 值可以是 string / number / boolean / string[] / null
 *        null / 空串 / 空数组 → 从 URL 中移除该键
 * @param {object} options { replace = true }
 */
export function writeParams(patch, { replace = true } = {}) {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	for (const [key, value] of Object.entries(patch || {})) {
		url.searchParams.delete(key);
		const values = Array.isArray(value) ? value : [value];
		for (const entry of values) {
			if (entry == null || entry === "" || entry === false) continue;
			if (entry === true) {
				url.searchParams.append(key, "1");
				continue;
			}
			url.searchParams.append(key, String(entry));
		}
	}
	const next = `${url.pathname}${url.search}${url.hash}`;
	const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	if (next === current) return;
	if (replace) window.history.replaceState(null, "", next);
	else window.history.pushState(null, "", next);
}

/**
 * 订阅 query 变化：浏览器前进/后退（真实 popstate）+ 同路径跳转（合成 popstate）。
 * 返回取消订阅函数。
 */
export function onQueryChange(handler) {
	if (typeof window === "undefined") return () => {};
	const listener = () => handler();
	window.addEventListener("popstate", listener);
	return () => window.removeEventListener("popstate", listener);
}

/** 页面内导航：同路径只换 query 时自己处理，跨路径交给 VitePress 的 SPA 路由。 */
export function navigateWithinPage(event, href) {
	if (typeof window === "undefined" || !href) return;
	const target = new URL(href, window.location.href);
	if (target.pathname !== window.location.pathname) return; // 交给 VitePress
	if (event) event.preventDefault();
	window.history.pushState(null, "", `${target.pathname}${target.search}${target.hash}`);
	window.dispatchEvent(new PopStateEvent("popstate"));
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/** 生成 `<a>` 的点击处理器（同路径 query 跳转用）。 */
export function linkClickHandler(href) {
	return (event) => navigateWithinPage(event, typeof href === "function" ? href() : href);
}

/** 简单防抖。 */
export function debounce(fn, delay = 200) {
	let timer = null;
	const wrapped = (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			fn(...args);
		}, delay);
	};
	wrapped.cancel = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};
	return wrapped;
}
