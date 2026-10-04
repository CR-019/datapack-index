/**
 * 酒馆看板 · 数据访问层（唯一取数出口）
 * =============================================================================
 * 设计目标：把「数据从哪来」和「页面怎么渲染」彻底分开，方便以后把活动后端换成
 * 静态兜底 JSON —— 只需要改这个文件。
 *
 * 数据源优先级：
 *   1. 活动后端（API_BASE，默认 http://127.0.0.1:9878，可用 window.__TAVERN_API_BASE__ 覆盖）
 *   2. 静态快照（SNAPSHOT_URLS，目前为空数组；生成 public/tavern-snapshot.json 后登记即可）
 *   3. 都没有 → 抛出 TavernApiError，页面显示人类可读的中文错误提示
 *
 * 本模块不 import 任何 UI 框架（不依赖 vue / vitepress），可以单独在 Node 里跑测试。
 */

/* ------------------------------------------------------------------ 配置 */

const DEFAULT_API_BASE = "http://127.0.0.1:9878";

function resolveApiBase() {
	if (typeof window !== "undefined" && typeof window.__TAVERN_API_BASE__ === "string" && window.__TAVERN_API_BASE__.trim()) {
		return window.__TAVERN_API_BASE__.trim().replace(/\/+$/, "");
	}
	return DEFAULT_API_BASE;
}

/** 活动后端基址（前端所有请求都从这里出发；换成静态兜底时改这一个常量即可）。 */
export const API_BASE = resolveApiBase();

/** 站点基路径（VitePress base），用于拼站内链接与 public 资源。 */
const BASE_URL = (import.meta.env && import.meta.env.BASE_URL) || "/";

/** 站内路径 → 带 base 的绝对路径；已是 http(s) 的原样返回。 */
export function withSiteBase(path) {
	const value = String(path == null ? "" : path);
	if (/^https?:\/\//i.test(value)) return value;
	const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
	if (!value) return `${base}/`;
	return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

/**
 * 静态兜底快照地址。快照约定为单个 JSON：
 *   { schema, generatedAt, status, nodes: [...], tags: [...], timeline: [...] }
 * 活动后端不可用时会自动降级到它。
 *
 * ⚠️ 必须定义在 BASE_URL / withSiteBase **之后**：模块顶层的求值顺序是自上而下的，
 * 放在前面会命中暂时性死区（"Cannot access 'BASE_URL' before initialization"），
 * 而且是**构建期就炸**，不是运行期。
 *
 * 由后端 `npm run snapshot` 生成到 public/tavern-snapshot.json。
 */
export const SNAPSHOT_URLS = [
	withSiteBase("/tavern-snapshot.json"),
];

/* ------------------------------------------------------------- 错误处理 */

/** 看板统一错误类型：message 已是给用户看的中文文案。 */
export class TavernApiError extends Error {
	constructor(message, { status = 0, url = "", cause = null, kind = "unknown" } = {}) {
		super(message);
		this.name = "TavernApiError";
		this.status = status;
		this.url = url;
		this.kind = kind;
		this.cause = cause;
	}
}

function describeFailure(error, path) {
	const url = `${API_BASE}${path}`;
	if (error instanceof TavernApiError) return error;
	if (error && error.name === "AbortError") {
		return new TavernApiError("请求酒馆后端超时。后端可能正在启动或负载过高，请稍后重试。", { url, kind: "timeout", cause: error });
	}
	if (error && error.status) {
		const status = error.status;
		if (status === 404) return new TavernApiError("酒馆后端里找不到这条数据（HTTP 404）。链接可能已失效。", { status, url, kind: "not-found", cause: error });
		if (status >= 500) return new TavernApiError(`酒馆后端出错了（HTTP ${status}）。请稍后重试，或查看后端日志。`, { status, url, kind: "server", cause: error });
		return new TavernApiError(`酒馆后端拒绝了这次请求（HTTP ${status}）。`, { status, url, kind: "client", cause: error });
	}
	return new TavernApiError(
		`无法连接酒馆后端（${API_BASE}）。请确认 tavern-server 正在运行，然后重试。`,
		{ url, kind: "network", cause: error },
	);
}

/* ------------------------------------------------------------ 请求底座 */

const DEFAULT_TTL = 60_000;
const responseCache = new Map();
const inflight = new Map();
let snapshotPromise = null;

function readCache(key, ttl) {
	const entry = responseCache.get(key);
	if (!entry) return undefined;
	if (ttl > 0 && Date.now() - entry.at > ttl) {
		responseCache.delete(key);
		return undefined;
	}
	return entry.value;
}

function writeCache(key, value) {
	responseCache.set(key, { at: Date.now(), value });
	return value;
}

/** 清空内存缓存（调试/手动刷新用）。 */
export function clearTavernCache() {
	responseCache.clear();
	inflight.clear();
	snapshotPromise = null;
}

async function requestJson(url, { timeoutMs = 12_000 } = {}) {
	const controller = typeof AbortController === "function" ? new AbortController() : null;
	const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: { accept: "application/json" },
			signal: controller ? controller.signal : undefined,
		});
		if (!response.ok) {
			const error = new Error(`HTTP ${response.status}`);
			error.status = response.status;
			throw error;
		}
		return await response.json();
	} finally {
		if (timer) clearTimeout(timer);
	}
}

async function readSnapshot() {
	if (!SNAPSHOT_URLS.length) return null;
	if (!snapshotPromise) {
		snapshotPromise = (async () => {
			for (const url of SNAPSHOT_URLS) {
				try {
					const data = await requestJson(url, { timeoutMs: 8_000 });
					if (data && typeof data === "object") {
						snapshotGeneratedAt = typeof data.generatedAt === "string" ? data.generatedAt : null;
						return data;
					}
				} catch (error) {
					console.warn("[tavern] 静态快照不可用", url, error);
				}
			}
			return null;
		})();
	}
	return snapshotPromise;
}

/* ------------------------------------------------- 降级状态（供 UI 提示） */

/**
 * 回退到静态快照时置位。
 * 设计文档 §11.2 是硬要求：**降级时 UI 必须明确提示"数据可能不是最新"**，
 * 只打 console.warn 不算 —— 读者无从知道自己看到的是旧数据。
 */
let snapshotFallback = null;
let snapshotGeneratedAt = null;
const fallbackListeners = new Set();

function markSnapshotFallback(path) {
	if (snapshotFallback) return; // 只记第一次，避免重复通知
	snapshotFallback = { path, at: new Date().toISOString(), generatedAt: snapshotGeneratedAt };
	for (const listener of fallbackListeners) {
		try {
			listener(snapshotFallback);
		} catch (error) {
			console.warn("[tavern] 降级状态监听者出错", error);
		}
	}
}

/** 订阅"已降级到静态快照"。若当前已处于降级态，会立即回调一次。返回取消订阅函数。 */
export function onSnapshotFallback(listener) {
	fallbackListeners.add(listener);
	if (snapshotFallback) listener(snapshotFallback);
	return () => fallbackListeners.delete(listener);
}

/** 当前降级状态；未降级时为 null */
export function snapshotFallbackState() {
	return snapshotFallback;
}

/**
 * 取数主入口：先打活动后端，失败后尝试静态快照，最后抛 TavernApiError。
 * @param {string} path 形如 "/v1/nodes?kind=project"
 * @param {object} options { ttl, timeoutMs, snapshot } snapshot(data) → 从快照里取等价数据
 */
async function load(path, { ttl = DEFAULT_TTL, timeoutMs, snapshot = null } = {}) {
	const key = `${API_BASE}${path}`;
	const cached = readCache(key, ttl);
	if (cached !== undefined) return cached;
	if (inflight.has(key)) return inflight.get(key);

	const task = (async () => {
		try {
			const data = await requestJson(`${API_BASE}${path}`, { timeoutMs });
			return writeCache(key, data);
		} catch (error) {
			const fallback = await readSnapshot();
			if (fallback && typeof snapshot === "function") {
				const value = snapshot(fallback);
				if (value !== undefined && value !== null) {
					console.warn(`[tavern] 活动后端不可用，已回退到静态快照：${path}`);
					markSnapshotFallback(path);
					return writeCache(key, value);
				}
			}
			throw describeFailure(error, path);
		} finally {
			inflight.delete(key);
		}
	})();

	inflight.set(key, task);
	return task;
}

/* --------------------------------------------------------- 类型归一化 */

export const KIND_LABELS = { project: "项目", person: "作者", tag: "标签" };
export const KIND_ORDER = ["project", "person", "tag"];
export const STATE_LABELS = { active: "活跃", archived: "已归档", draft: "草稿", deprecated: "已废弃" };

export function kindOf(nodeOrId) {
	if (nodeOrId && typeof nodeOrId === "object" && nodeOrId.kind) return nodeOrId.kind;
	const id = typeof nodeOrId === "string" ? nodeOrId : nodeOrId && nodeOrId.id;
	return String(id || "").split(":")[0] || "";
}

export function kindLabel(kind) {
	return KIND_LABELS[kind] || kind || "条目";
}

export function stateLabel(state) {
	if (!state) return "";
	return STATE_LABELS[state] || state;
}

/** 条目 id 去掉 kind: 前缀后的部分（兜底标题用）。 */
export function slugOf(id) {
	return String(id || "").split(":").slice(1).join(":") || String(id || "");
}

export function nodeTitle(node) {
	if (!node) return "未命名条目";
	const zh = node.i18n && node.i18n.zh;
	const en = node.i18n && node.i18n.en;
	return (zh && (zh.title || zh.summary)) || (en && en.title) || node.name || node.title || slugOf(node.id);
}

export function nodeSummary(node) {
	if (!node) return "";
	const zh = node.i18n && node.i18n.zh;
	const en = node.i18n && node.i18n.en;
	return (zh && zh.summary) || (en && en.summary) || node.summary || "";
}

/** 作者节点的显示名（作者接口返回的 name 优先，其次 i18n 标题）。 */
export function nameOfAuthor(author) {
	if (!author) return "";
	return author.name || (author.i18n && author.i18n.zh && author.i18n.zh.title) || author.id || "";
}

export function nodeTags(node) {
	return Array.isArray(node && node.tags) ? node.tags.filter((tag) => typeof tag === "string" && tag.trim()) : [];
}

export function nodeGames(node) {
	const game = node && node.facets && node.facets.game;
	return Array.isArray(game) ? game.filter((entry) => typeof entry === "string" && entry.trim()) : [];
}

export function nodeLinks(node) {
	return Array.isArray(node && node.links) ? node.links.filter((link) => link && link.url) : [];
}

export function nodeState(node) {
	return (node && node.facets && node.facets.state) || "";
}

export function nodeAvatar(node) {
	const value = node && (node.avatar || (node.i18n && node.i18n.zh && node.i18n.zh.avatar));
	return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function formatDate(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	const pad = (number) => String(number).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/* -------------------------------------------------------- 游戏版本处理 */

/**
 * facets.game 里是自由文本（"1.21.9"、"1.21~26.3"、"1.20.2+"、"~1.20.4"、"1.14.4-1.18.2"），
 * 这里把它解析成 [min, max] 区间，再按版本号做包含判断。
 */
export function parseVersion(value) {
	const match = String(value == null ? "" : value).trim().match(/^(\d+(?:\.\d+)*)$/);
	return match ? match[1].split(".").map((part) => Number(part)) : null;
}

export function compareVersions(left, right) {
	const a = Array.isArray(left) ? left : parseVersion(left);
	const b = Array.isArray(right) ? right : parseVersion(right);
	if (!a || !b) return 0;
	const length = Math.max(a.length, b.length);
	for (let index = 0; index < length; index += 1) {
		const delta = (a[index] || 0) - (b[index] || 0);
		if (delta) return delta > 0 ? 1 : -1;
	}
	return 0;
}

/** "1.21~26.3" → { min, max }；无法解析返回 null。 */
export function parseVersionSpec(spec) {
	const raw = String(spec == null ? "" : spec).trim();
	if (!raw) return null;
	if (raw.startsWith("~")) {
		const max = parseVersion(raw.slice(1));
		return max ? { min: null, max } : null;
	}
	if (raw.endsWith("+")) {
		const min = parseVersion(raw.slice(0, -1));
		return min ? { min, max: null } : null;
	}
	const parts = raw.split(/\s*[~-]\s*/).filter(Boolean);
	if (parts.length === 1) {
		const only = parseVersion(parts[0]);
		return only ? { min: only, max: only } : null;
	}
	const first = parseVersion(parts[0]);
	const last = parseVersion(parts[parts.length - 1]);
	if (!first || !last) return null;
	return compareVersions(first, last) <= 0 ? { min: first, max: last } : { min: last, max: first };
}

/** 条目是否声明支持某个 Minecraft 版本号（版本号取 facets.game 区间内的任意一点）。 */
export function nodeSupportsGameVersion(node, version) {
	const target = parseVersion(version);
	if (!target) return true;
	const specs = nodeGames(node);
	if (!specs.length) return false;
	return specs.some((spec) => {
		const range = parseVersionSpec(spec);
		if (!range) return false;
		if (range.min && compareVersions(target, range.min) < 0) return false;
		if (range.max && compareVersions(target, range.max) > 0) return false;
		return true;
	});
}

/** 从条目集合里抽出可选的游戏版本号（含区间端点），按版本倒序，附带命中条数。 */
export function gameVersionOptions(items, { minCount = 1 } = {}) {
	const tokens = new Map();
	for (const node of items) {
		for (const spec of nodeGames(node)) {
			for (const token of String(spec).match(/\d+(?:\.\d+)*/g) || []) tokens.set(token, true);
		}
	}
	const annotated = items.filter((node) => nodeGames(node).length);
	return [...tokens.keys()]
		.map((value) => ({ value, total: annotated.filter((node) => nodeSupportsGameVersion(node, value)).length }))
		.filter((option) => option.total >= minCount)
		.sort((a, b) => compareVersions(b.value, a.value));
}

/* ---------------------------------------------------------------- 过滤 */

function matchesQuery(node, needle) {
	const haystack = [
		nodeTitle(node),
		nodeSummary(node),
		node.id,
		node.repo,
		node.name,
		...nodeTags(node),
		...nodeGames(node),
	]
		.filter(Boolean)
		.join("\n")
		.toLowerCase();
	return haystack.includes(needle);
}

/**
 * 标签匹配：分面里存的是 tags 节点的 id（tag:ui），而条目自带的 tags 是原文标题（UI），
 * 所以两种形式都接受（id 与标题都按小写比较）。
 */
function hasTag(node, tag) {
	if (!tag) return true;
	const needle = String(tag).trim().toLowerCase();
	return nodeTags(node).some((entry) => {
		const title = entry.trim().toLowerCase();
		return title === needle || `tag:${title}` === needle;
	});
}

/**
 * 客户端过滤：所有分面 + 关键字一次算完（数据量很小，全部拉下来过滤更跟手）。
 * @param {Array} items 条目集合
 * @param {object} filters { q, kinds, tags, game, states, sort }
 */
export function filterNodes(items, { q = "", kinds = [], tags = [], game = "", states = [], sort = "default" } = {}) {
	const needle = String(q || "").trim().toLowerCase();
	const kindList = Array.isArray(kinds) ? kinds.filter(Boolean) : [];
	const tagList = Array.isArray(tags) ? tags.filter(Boolean) : [];
	const stateList = Array.isArray(states) ? states.filter(Boolean) : [];

	const matched = (Array.isArray(items) ? items : []).filter((node) => {
		if (kindList.length && !kindList.includes(kindOf(node))) return false;
		if (stateList.length && !stateList.includes(nodeState(node))) return false;
		if (game && !nodeSupportsGameVersion(node, game)) return false;
		if (tagList.length && !tagList.every((tag) => hasTag(node, tag))) return false;
		if (needle && !matchesQuery(node, needle)) return false;
		return true;
	});

	return sortNodes(matched, sort);
}

export function sortNodes(items, sort = "default") {
	const list = [...items];
	const byTitle = (a, b) => nodeTitle(a).localeCompare(nodeTitle(b), "zh-Hans-CN", { numeric: true });
	if (sort === "title") return list.sort(byTitle);
	if (sort === "updated") {
		return list.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")) || byTitle(a, b));
	}
	return list.sort((a, b) => {
		const orderDelta = KIND_ORDER.indexOf(kindOf(a)) - KIND_ORDER.indexOf(kindOf(b));
		return orderDelta || byTitle(a, b);
	});
}

/** 分面计数：统计「在其它筛选条件下」还能命中多少条（标准的联动计数）。 */
export function facetCounts(items, filters, { kinds = [], tags = [], states = [] } = {}) {
	const rest = { ...filters };
	const result = { kind: {}, state: {}, tag: {} };
	for (const kind of kinds.length ? kinds : KIND_ORDER) {
		result.kind[kind] = filterNodes(items, { ...rest, kinds: [kind], sort: "default" }).length;
	}
	for (const state of states) {
		result.state[state] = filterNodes(items, { ...rest, states: [state], sort: "default" }).length;
	}
	for (const tag of tags) {
		result.tag[tag] = filterNodes(items, { ...rest, tags: [tag], sort: "default" }).length;
	}
	return result;
}

/* ---------------------------------------------------------------- 路由 */

export const TAVERN_PATHS = {
	board: "/tavern/",
	node: "/tavern/p",
	tags: "/tavern/tags",
	tag: "/tavern/tag",
	author: "/tavern/a",
	all: "/tavern/all",
};

function hrefWithQuery(path, params) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params || {})) {
		if (value == null || value === "") continue;
		search.set(key, String(value));
	}
	const query = search.toString();
	return `${path}${query ? `?${query}` : ""}`;
}

export function boardHref(params) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.board, params));
}

export function allHref(params) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.all, params));
}

export function tagsHref(params) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.tags, params));
}

export function nodeHref(id) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.node, { id }));
}

export function tagHref(id) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.tag, { id }));
}

export function authorHref(id) {
	return withSiteBase(hrefWithQuery(TAVERN_PATHS.author, { id }));
}

/** 按条目类型给出「点进去看详情」的地址：项目→条目页，作者→作者页，标签→标签页。 */
export function linkForNode(node) {
	const kind = kindOf(node);
	const id = node && node.id;
	if (kind === "person") return authorHref(id);
	if (kind === "tag") return tagHref(id);
	return nodeHref(id);
}

/** 作者头像等 public 资源地址。 */
export function assetHref(value) {
	if (typeof value !== "string" || !value.trim()) return "";
	const url = value.trim();
	if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
	return withSiteBase(url);
}

/* -------------------------------------------------------------- 接口层 */

function normalizeNode(node) {
	if (!node || typeof node !== "object") return null;
	return {
		...node,
		kind: node.kind || kindOf(node.id),
		tags: nodeTags(node),
		facets: node.facets && typeof node.facets === "object" ? node.facets : {},
		links: nodeLinks(node),
		i18n: node.i18n && typeof node.i18n === "object" ? node.i18n : {},
	};
}

function normalizeItems(items) {
	return (Array.isArray(items) ? items : []).map(normalizeNode).filter(Boolean);
}

/** GET /v1/status → 计数统计。 */
export function fetchStatus() {
	return load("/v1/status", { ttl: 30_000, snapshot: (data) => (data && data.status) || undefined });
}

/** GET /v1/nodes → { items, total, limit, nextCursor } */
export function fetchNodes({ kind, tag, state, q, limit = 200, cursor } = {}) {
	const search = new URLSearchParams();
	if (kind) search.set("kind", kind);
	if (tag) search.set("tag", tag);
	if (state) search.set("state", state);
	if (q) search.set("q", q);
	if (limit) search.set("limit", String(limit));
	if (cursor) search.set("cursor", cursor);
	const path = `/v1/nodes${search.toString() ? `?${search}` : ""}`;
	return load(path, {
		timeoutMs: 20_000,
		snapshot: (data) => {
			const items = normalizeItems(data.nodes);
			if (!items.length) return undefined;
			const filtered = filterNodes(items, { kinds: kind ? [kind] : [], tags: tag ? [tag] : [], states: state ? [state] : [], q });
			return { schema: data.schema || 1, items: filtered, total: filtered.length, limit: filtered.length, nextCursor: null };
		},
	}).then((data) => ({
		schema: data.schema || 1,
		items: normalizeItems(data.items),
		total: Number(data.total) || 0,
		limit: Number(data.limit) || 0,
		nextCursor: data.nextCursor || null,
	}));
}

/**
 * 拉取全部条目（后端单页上限 200，这里顺着 cursor 翻完）。
 * 看板的搜索/分面全部在这份本地数据上做，所以只需要在进页面时取一次。
 */
export async function fetchAllNodes({ pageSize = 200, maxPages = 12, onProgress } = {}) {
	const collected = [];
	let cursor = null;
	let total = 0;
	for (let page = 0; page < maxPages; page += 1) {
		const result = await fetchNodes({ limit: pageSize, cursor });
		total = result.total || total;
		collected.push(...result.items);
		if (typeof onProgress === "function") onProgress(collected.length, total);
		if (!result.nextCursor || !result.items.length) break;
		cursor = result.nextCursor;
	}
	return { items: collected, total };
}

/** GET /v1/nodes/:id → { node, ... }（含 edges 出边 / incoming 入边） */
export async function fetchNode(id) {
	const data = await load(`/v1/nodes/${encodeURIComponent(id)}`, {
		snapshot: (snapshotData) => {
			const node = normalizeItems(snapshotData.nodes).find((entry) => entry.id === id);
			return node ? { schema: snapshotData.schema || 1, node } : undefined;
		},
	});
	const node = normalizeNode(data.node);
	if (!node) {
		throw new TavernApiError(`酒馆后端没有返回条目「${id}」的数据。`, { kind: "not-found" });
	}
	return { ...data, node };
}

/**
 * 全量条目索引（id → 条目），用于把关系边里的 id 翻译成标题。
 * 失败时返回空 Map —— 关系区会退化成只显示 id，不影响主体信息。
 */
export async function fetchNodeIndex() {
	const key = `${API_BASE}/__index`;
	const cached = readCache(key, 5 * 60_000);
	if (cached !== undefined) return cached;
	try {
		const { items } = await fetchAllNodes();
		const index = new Map(items.map((node) => [node.id, node]));
		return writeCache(key, index);
	} catch (error) {
		console.warn("[tavern] 条目索引获取失败，关系区将退化为显示 id", error);
		const empty = new Map();
		return writeCache(key, empty);
	}
}

/** GET /v1/authors/:id → { author, maintained[], authored[], members[] } */
export async function fetchAuthor(id) {
	const data = await load(`/v1/authors/${encodeURIComponent(id)}`);
	if (!data || !data.author) {
		throw new TavernApiError(`找不到作者「${id}」。`, { kind: "not-found" });
	}
	return {
		author: normalizeNode(data.author),
		maintained: Array.isArray(data.maintained) ? data.maintained : [],
		authored: Array.isArray(data.authored) ? data.authored : [],
		members: Array.isArray(data.members) ? data.members : [],
	};
}

/** GET /v1/tags → { items: [{ id, title, members }] } */
export async function fetchTags() {
	const data = await load("/v1/tags", {
		ttl: 60_000,
		snapshot: (snapshotData) => {
			const items = Array.isArray(snapshotData.tags) ? snapshotData.tags : null;
			return items ? { schema: snapshotData.schema || 1, items, total: items.length } : undefined;
		},
	});
	const items = (Array.isArray(data.items) ? data.items : [])
		.map((tag) => ({
			id: tag.id,
			title: tag.title || slugOf(tag.id),
			members: Number(tag.members) || 0,
		}))
		.filter((tag) => tag.id);
	return { items, total: Number(data.total) || items.length };
}

/** GET /v1/tags/:id/members → { tag, items[] }（注意：标签没有单独的详情端点，详情随成员接口一起返回） */
export async function fetchTagMembers(id) {
	const data = await load(`/v1/tags/${encodeURIComponent(id)}/members`);
	return {
		tag: normalizeNode(data.tag) || { id, kind: "tag", i18n: { zh: { title: slugOf(id) } } },
		items: normalizeItems(data.items),
	};
}

/** GET /v1/timeline?limit= → { source, items: [{ at, rel, id, title }] } */
export async function fetchTimeline({ limit = 8 } = {}) {
	const data = await load(`/v1/timeline?limit=${encodeURIComponent(limit)}`, {
		ttl: 30_000,
		snapshot: (snapshotData) => {
			const items = Array.isArray(snapshotData.timeline) ? snapshotData.timeline.slice(0, limit) : null;
			return items ? { schema: snapshotData.schema || 1, source: "snapshot", items } : undefined;
		},
	});
	return {
		source: data.source || "",
		items: (Array.isArray(data.items) ? data.items : []).filter((entry) => entry && entry.id),
	};
}

/** 条目/作者/标签统一入口：按 id 前缀决定打哪个接口。 */
export function fetchEntity(id) {
	const kind = kindOf(id);
	if (kind === "person") return fetchAuthor(id).then((data) => ({ kind, ...data }));
	if (kind === "tag") return fetchTagMembers(id).then((data) => ({ kind, ...data }));
	return fetchNode(id).then((data) => ({ kind: kindOf(data.node), ...data }));
}
