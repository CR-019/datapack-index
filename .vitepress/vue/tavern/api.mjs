/**
 * 酒馆看板 · 数据访问层（唯一取数出口）
 * =============================================================================
 * 设计目标：把「数据从哪来」和「页面怎么渲染」彻底分开，方便以后把活动后端换成
 * 静态兜底 JSON —— 只需要改这个文件。
 *
 * 数据源优先级：
 *   1. 活动后端（API_BASE，默认 http://127.0.0.1:9878）
 *      两种覆盖方式，**脚本注入优先于查询串**：
 *        · `window.__TAVERN_API_BASE__ = "..."`（headless 测试在页面跑起来前注入，
 *          它比 URL 更能代表"这次测试要打哪个后端"）
 *        · `?api=http://127.0.0.1:9880`（人用：本地同时跑着主库/演示库/走查库时
 *          对照着看一眼，不必开控制台）；首次读到时记进 sessionStorage，
 *          否则一次站内跳转就会把它丢掉、静默换回默认后端。`?api=default` 清除。
 *   2. 静态快照（SNAPSHOT_URLS = 站点基路径下的 /tavern-snapshot.json，
 *      由 `npm run snapshot` 生成并提交，连不上后端时整站照常可读）
 *   3. 都没有 → 抛出 TavernApiError，页面显示人类可读的中文错误提示
 *
 * 本模块不 import 任何 UI 框架（不依赖 vue / vitepress），可以单独在 Node 里跑测试。
 */

/* ------------------------------------------------------------------ 配置 */

const DEFAULT_API_BASE = "http://127.0.0.1:9878";

/** 覆盖值的记忆键。用它是因为 `?api=` **活不过一次站内跳转**（见下）。 */
const API_BASE_STORE_KEY = "tavern:api-base";

const safeSession = {
	get(key) {
		try { return window.sessionStorage.getItem(key); } catch { return null; }
	},
	set(key, value) {
		try { window.sessionStorage.setItem(key, value); } catch { /* 隐私模式下会抛，忽略即可 */ }
	},
	remove(key) {
		try { window.sessionStorage.removeItem(key); } catch { /* 同上 */ }
	},
};

const httpOnly = (value) => {
	const text = String(value ?? "").trim();
	return /^https?:\/\//i.test(text) ? text.replace(/\/+$/, "") : null;
};

/**
 * 基址解析顺序：`window.__TAVERN_API_BASE__` → 查询串 `?api=` → 记住的值 → 默认值。
 *
 * 为什么查询串排在"记住的值"**前面**：查询串是本次访问的明确意图。反过来
 * （先看记忆）会导致第一次 `?api=9882` 之后就再也切不动——连 `?api=default`
 * 都清不掉，因为代码根本走不到读查询串那一步。
 *
 * 为什么要 sessionStorage 记一笔：**`?api=` 活不过一次跳转**。
 * `navigateWithinPage()` 在跨路径时把导航交给 VitePress 的 SPA 路由，
 * URL 整个换掉，查询串里的 `api` 就没了；而这个常量只在模块加载时算一次。
 * 结果是从看板点进任何一个条目，数据源会**静默换回默认后端** ——
 * 页面上看就是"数据突然变了"，最难查的那种。所以读到就记下来，
 * 本次标签页内后续页面（此时查询串已丢）继续沿用。`?api=default` 清除。
 *
 * 只接受 http(s)，避免 `javascript:` 之类的花样。
 */
function resolveApiBase() {
	if (typeof window === "undefined") return DEFAULT_API_BASE;

	// 1) 脚本注入（headless 测试在页面脚本跑起来之前注入，优先级最高）
	if (typeof window.__TAVERN_API_BASE__ === "string" && window.__TAVERN_API_BASE__.trim()) {
		return window.__TAVERN_API_BASE__.trim().replace(/\/+$/, "");
	}

	// 2) 查询串（显式意图；读到就记下来，供跳转后的页面复用）
	try {
		const raw = new URLSearchParams(window.location.search).get("api");
		if (raw != null) {
			if (raw.trim().toLowerCase() === "default") {
				safeSession.remove(API_BASE_STORE_KEY);
				return DEFAULT_API_BASE;
			}
			const resolved = httpOnly(raw);
			if (resolved) {
				safeSession.set(API_BASE_STORE_KEY, resolved);
				return resolved;
			}
		}
	} catch {
		/* URL 解析失败就用默认值，不值得为此让整页取数挂掉 */
	}

	// 3) 本次会话记住的覆盖值（跳转后查询串已丢，靠它续上）
	return safeSession.get(API_BASE_STORE_KEY) || DEFAULT_API_BASE;
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
// 生命周期枚举（§6.1，与后端 LIFECYCLE_STATES 逐字一致）：draft / active / paused / done / archived。
// `active` 统一译作"进行中"（后端自动生成的事件标题是"状态：进行中 → 暂停"，两边得对得上）。
// 其余几个键不会出现在当前数据里，只作历史 / 别名兜底。
export const STATE_LABELS = {
	draft: "草稿",
	active: "进行中",
	paused: "暂停",
	done: "已完结",
	archived: "已归档",
	recruiting: "招募中",
	finished: "已完结",
	deprecated: "已废弃",
};

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

/* ------------------------------------------------------- 阶段（ADR-010） */
/*
 * 阶段是 `kind=stage` 的子节点：自带时间窗、可以有招募、可以有正文（§5.1 形态表）。
 * 两条设计约束（不变量 14/15）直接决定这里怎么写：
 *   · **窗口允许重叠** → 因此阶段条要能并列显示，不能假设"同一时刻只有一个阶段"；
 *   · **阶段之间允许空隙** → 因此不能把相邻阶段硬接起来，空白就是空白；
 *   · `facets.phases` 是**集合**且**可为空** → 因此界面上永远是"0..N 个"，不是单值。
 */

export const STAGE_PHASE_LABELS = { past: "已结束", current: "进行中", future: "未开始" };
export const STAGE_PHASE_ORDER = ["past", "current", "future"];

export function stagePhaseLabel(phase) {
	if (!phase) return "";
	return STAGE_PHASE_LABELS[phase] || String(phase);
}

/** 阶段的时间窗：{ start, end }（毫秒，某一端可以为 null）。两端都不可用返回 null。 */
export function stageWindow(stage) {
	const time = (stage && stage.facets && stage.facets.time) || (stage && stage.time) || {};
	const start = parseTime(time.start);
	const end = parseTime(time.end);
	const hasStart = Number.isFinite(start);
	const hasEnd = Number.isFinite(end);
	if (!hasStart && !hasEnd) return null;
	return { start: hasStart ? start : null, end: hasEnd ? end : null };
}

/**
 * 阶段的相位。**服务端已经算好并给出 `phase`，直接用它**（在线/离线同形）。
 * 只在字段缺失时才自己推：先看 `facets.phases` 里有没有它（后端保证这个字段必有），
 * 最后才退化成"客户端时钟落在窗口哪一侧"——注意假数据的时间窗是 2026 年的，
 * 客户端时钟比时间窗更不可信，所以它排在最后。
 */
export function stagePhase(stage, now = Date.now(), declaredPhases = []) {
	const declared = stage && typeof stage.phase === "string" ? stage.phase.trim() : "";
	if (STAGE_PHASE_ORDER.includes(declared)) return declared;
	const name = stage ? nodeTitle(stage) : "";
	if (name && Array.isArray(declaredPhases) && declaredPhases.includes(name)) return "current";
	const window = stageWindow(stage);
	if (!window) return "";
	if (window.start != null && now < window.start) return "future";
	if (window.end != null && now > window.end) return "past";
	return "current";
}

/** 阶段的招募（§6.5 结构，可以挂在任意 kind 上）。 */
export function nodeRecruit(node) {
	const raw = node && node.recruit;
	return (Array.isArray(raw) ? raw : []).filter((entry) => entry && typeof entry === "object");
}

export const RECRUIT_STATUS_LABELS = { open: "招募中", filled: "已招满", closed: "已关闭" };

export function recruitStatusLabel(status) {
	if (!status) return "";
	return RECRUIT_STATUS_LABELS[status] || String(status);
}

/** 单个阶段归一化：补上 name / window / phase / recruit，渲染层就不用到处判空。 */
export function normalizeStage(stage, { declaredPhases = [], now = Date.now() } = {}) {
	if (!stage || typeof stage !== "object") return null;
	return {
		...stage,
		id: String(stage.id || ""),
		kind: stage.kind || "stage",
		name: nodeTitle(stage),
		summary: nodeSummary(stage),
		window: stageWindow(stage),
		phase: stagePhase(stage, now, declaredPhases),
		recruit: nodeRecruit(stage),
	};
}

/**
 * 条目下的阶段列表。**保持后端给的顺序**：`phase` 与排序都由后端算好
 * （窗口起点升序，无窗口的排最后），前端再排一次只会让在线 / 离线两条路径漂移。
 * 没有 `stages` 键（后端对"没有阶段的节点"就是不给这个键）时返回空数组。
 */
export function nodeStages(node) {
	const raw = node && node.stages;
	if (!Array.isArray(raw)) return [];
	const declaredPhases = nodePhases(node);
	return raw.map((stage) => normalizeStage(stage, { declaredPhases })).filter(Boolean);
}

/** 「这个节点带了 stages 键吗」——用来区分"没有阶段"与"后端还没上这一版"。 */
export function nodeStagesDeclared(node) {
	return Boolean(node) && Object.prototype.hasOwnProperty.call(node, "stages") && node.stages !== undefined;
}

/** `facets.phases` 原始字段是否是数组（用来区分"字段缺失"与"服务端明确说当前没有阶段"）。 */
export function nodePhasesDeclared(node) {
	return Array.isArray(node && node.facets && node.facets.phases);
}

/** `facets.phases`（集合，0..N，去重去空）—— 不加"当前阶段"这类单值措辞。 */
export function nodePhases(node) {
	const raw = node && node.facets && node.facets.phases;
	const list = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
	const seen = new Set();
	const result = [];
	for (const entry of list) {
		const text = String(entry == null ? "" : entry).trim();
		if (!text || seen.has(text)) continue;
		seen.add(text);
		result.push(text);
	}
	return result;
}

/**
 * 界面上真正要显示的"当前阶段"集合：
 *   · 服务端给了 `facets.phases`（哪怕是空数组）→ 以它为准（空数组 = 正处在两段之间的空隙）；
 *   · 字段缺失（后端还没上线这一版）→ 从 stage 子节点的窗口自己算，算不出来就是空集合。
 */
export function nodeCurrentPhases(node, now = Date.now()) {
	if (nodePhasesDeclared(node)) return nodePhases(node);
	return nodeStages(node)
		.filter((stage) => stagePhase(stage, now) === "current")
		.map((stage) => stage.name)
		.filter(Boolean);
}

/* -------------------------------------------------- 事件（ADR-009 / §6.6） */

export const EVENT_KIND_LABELS = {
	state: "状态",
	milestone: "里程碑",
	recruit: "招募",
	relation: "关系",
	note: "记录",
};
export const EVENT_KIND_ORDER = ["state", "milestone", "recruit", "relation", "note"];
export const EVENT_SOURCE_LABELS = { manual: "手工记录", derived: "系统自动", import: "导入" };

export function eventKindLabel(kind) {
	if (!kind) return "事件";
	return EVENT_KIND_LABELS[kind] || String(kind);
}

export function eventSourceLabel(source) {
	if (!source) return "";
	return EVENT_SOURCE_LABELS[source] || String(source);
}

/** 事件 `status` 的中文（state 类走生命周期词表，recruit 类走招募词表）。 */
export function eventStatusLabel(event) {
	const status = event && event.status;
	if (!status) return "";
	if (event.kind === "recruit") return recruitStatusLabel(status);
	return stateLabel(status);
}

export function normalizeEvent(event) {
	if (!event || typeof event !== "object") return null;
	const at = event.at || event.createdAt || event.created_at || "";
	const title = typeof event.title === "string" ? event.title : "";
	return {
		...event,
		id: String(event.id || `${at}#${title}`),
		kind: event.kind || "note",
		at,
		title,
		body: typeof event.body === "string" ? event.body : "",
		status: event.status == null ? null : event.status,
		source: event.source || "",
	};
}

/** 事件倒序（最新在前）。同一时刻的事件保持后端给的相对顺序，不额外打乱。 */
export function sortEventsDesc(items) {
	return [...(Array.isArray(items) ? items : [])].sort((a, b) => {
		const left = parseTime(a && a.at);
		const right = parseTime(b && b.at);
		const hasLeft = Number.isFinite(left);
		const hasRight = Number.isFinite(right);
		if (!hasLeft && !hasRight) return 0;
		if (!hasLeft) return 1; // 没有时间的排到最后，不冒充"最新"
		if (!hasRight) return -1;
		return right - left;
	});
}

export function formatDate(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	const pad = (number) => String(number).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/* --------------------------------------------------------- 时间工具 */

/**
 * 把日期 / 时间戳字符串解析成毫秒时间戳。
 * 接受 `2026-01-01`（date，按 UTC 零点解析）与 `2026-09-14T10:00:00.000Z`（datetime）。
 * 解析不出来返回 NaN —— 调用方一律按"这段没有时间"处理，不要抛错。
 */
export function parseTime(value) {
	if (value == null || value === "") return NaN;
	if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
	if (value instanceof Date) return value.getTime();
	const text = String(value).trim();
	if (!text) return NaN;
	const parsed = Date.parse(text);
	return Number.isNaN(parsed) ? NaN : parsed;
}

/** `2026-09-14 18:00`（本地时区）；无法解析时原样返回。 */
export function formatDateTime(value) {
	const time = parseTime(value);
	if (!Number.isFinite(time)) return value == null ? "" : String(value);
	const date = new Date(time);
	const pad = (number) => String(number).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 相对时间（"3 天前" / "刚刚" / "2 个月后"）；无法解析返回空串。 */
export function relativeTime(value, now = Date.now()) {
	const time = parseTime(value);
	if (!Number.isFinite(time)) return "";
	const delta = now - time;
	const abs = Math.abs(delta);
	const minute = 60_000;
	const hour = 60 * minute;
	const day = 24 * hour;
	if (abs < minute) return "刚刚";
	let text;
	if (abs < hour) text = `${Math.floor(abs / minute)} 分钟`;
	else if (abs < day) text = `${Math.floor(abs / hour)} 小时`;
	else if (abs < 30 * day) text = `${Math.floor(abs / day)} 天`;
	else if (abs < 365 * day) text = `${Math.max(1, Math.round(abs / (30.44 * day)))} 个月`;
	else text = `${(abs / (365.25 * day)).toFixed(1).replace(/\.0$/, "")} 年`;
	return delta < 0 ? `${text}后` : `${text}前`;
}

/** 时长（"46 天" / "3 个月" / "1.5 年"）。 */
export function formatDuration(milliseconds) {
	const abs = Math.abs(Number(milliseconds));
	if (!Number.isFinite(abs)) return "";
	const day = 86_400_000;
	const days = Math.round(abs / day);
	if (days < 1) return "不足 1 天";
	if (days < 60) return `${days} 天`;
	const months = Math.round(days / 30.44);
	if (months < 24) return `${months} 个月`;
	return `${(days / 365.25).toFixed(1).replace(/\.0$/, "")} 年`;
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
		// 阶段是子节点（ADR-010），并且**内嵌在节点上**（在线 / 离线同形）。
		// 归一化后 `stages` 一定是数组，所以"后端到底有没有给这个键"必须在这里先记下来：
		// 调用方显式传了 stagesDeclared 就用它的（fetchNode 会传），否则看原始对象的键。
		stagesDeclared: typeof node.stagesDeclared === "boolean" ? node.stagesDeclared : nodeStagesDeclared(node),
		stages: nodeStages(node),
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

/**
 * GET /v1/nodes/:id → { node, ... }（含 edges 出边 / incoming 入边）
 *
 * 阶段与事件是本次新增的两个维度（ADR-009 / ADR-010）。**阶段的渲染入口是 `node.stages`**
 * （在线 / 离线同形：快照里每个 node 也内嵌了自己的 stages），所以这里不按顶层 `stages[].parentId`
 * 去 join —— 顶层数组只用于整体遍历。返回值上的 `events` 只在快照兜底分支里有值
 * （活动后端走 `/v1/nodes/:id/events` 子资源，由 `fetchNodeEvents` 负责）。
 * 两者缺失时都是空数组，渲染层据此决定"明确空态"还是"整块不渲染"。
 */
export async function fetchNode(id) {
	const data = await load(`/v1/nodes/${encodeURIComponent(id)}`, {
		snapshot: (snapshotData) => {
			const rawNodes = Array.isArray(snapshotData.nodes) ? snapshotData.nodes : [];
			const rawStages = Array.isArray(snapshotData.stages) ? snapshotData.stages : [];
			// id 也可能是某个阶段（直接访问 stage 详情页）——快照的 nodes 里没有它，就在顶层 stages 里找。
			const raw = rawNodes.find((entry) => entry && entry.id === id) || rawStages.find((entry) => entry && entry.id === id);
			if (!raw) return undefined;
			// 阶段优先取**节点内嵌**的那份（在线 / 离线同形）；只有老快照没内嵌 stages 时才回退到顶层 join。
			const stages = Array.isArray(raw.stages) ? raw.stages : rawStages.filter((entry) => entry && entry.parentId === id);
			const events = (Array.isArray(snapshotData.events) ? snapshotData.events : [])
				.filter((entry) => entry && entry.nodeId === id)
				.map(normalizeEvent)
				.filter(Boolean);
			return {
				schema: snapshotData.schema || 1,
				node: {
					...raw,
					stages,
					// 快照里"这个节点带没带 stages 键"同样要如实记下来（老快照可能只有顶层数组）
					stagesDeclared: Array.isArray(raw.stages) || stages.length > 0,
				},
				stages,
				events,
				source: "snapshot",
			};
		},
	});
	if (!data || !data.node) {
		throw new TavernApiError(`酒馆后端没有返回条目「${id}」的数据。`, { kind: "not-found" });
	}
	// 阶段既可能挂在 node 上（契约形状），也可能被后端平铺在响应顶层 —— 两种都认。
	const rawStages = Array.isArray(data.stages)
		? data.stages
		: Array.isArray(data.node.stages)
			? data.node.stages
			: [];
	// 「后端给了 stages 键吗」要在补默认值**之前**判断，否则渲染层分不清
	// "这个条目暂无阶段"（要明确空态）与"后端还没上这一版"（整块不渲染）。
	const stagesDeclared = Array.isArray(data.stages) || Array.isArray(data.node.stages);
	const node = normalizeNode({ ...data.node, stages: rawStages, stagesDeclared });
	if (!node) {
		throw new TavernApiError(`酒馆后端没有返回条目「${id}」的数据。`, { kind: "not-found" });
	}
	return {
		...data,
		node,
		stages: node.stages,
		events: (Array.isArray(data.events) ? data.events : []).map(normalizeEvent).filter(Boolean),
		source: data.source || "",
	};
}

/**
 * GET /v1/nodes/:id/events?limit= → { items: [...] }
 * 事件流是时间线的真相源（ADR-009）：只读、倒序展示、不做筛选以外的加工。
 * 后端还没有这个端点时（HTTP 404）会抛 kind="not-found" 的 TavernApiError，
 * 渲染层据此静默不渲染 —— 不报错、也不留空壳。
 * @param {string} id 条目 id
 * @param {object} options { limit } 本次要拿多少条（从最新往回数）
 */
export async function fetchNodeEvents(id, { limit = 20 } = {}) {
	const size = Math.max(1, Math.min(200, Number(limit) || 20));
	const data = await load(`/v1/nodes/${encodeURIComponent(id)}/events?limit=${size}`, {
		ttl: 45_000,
		snapshot: (snapshotData) => {
			const all = Array.isArray(snapshotData.events) ? snapshotData.events : null;
			if (!all) return undefined;
			const items = sortEventsDesc(all.filter((entry) => entry && entry.nodeId === id).map(normalizeEvent).filter(Boolean));
			return { schema: snapshotData.schema || 1, source: "snapshot", items, total: items.length, limit: size };
		},
	});
	const items = sortEventsDesc((Array.isArray(data.items) ? data.items : []).map(normalizeEvent).filter(Boolean));
	return {
		source: data.source || "",
		items,
		total: Number(data.total) || items.length,
		limit: size,
	};
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
	const data = await load(`/v1/authors/${encodeURIComponent(id)}`, {
		snapshot: (snapshotData) => {
			// 后端不可用时从快照重建作者页：快照顶层带全量 edges，
			// 足以算出 TA 维护/署名/所属团队的条目。
			const all = normalizeItems(snapshotData.nodes);
			const author = all.find((entry) => entry.id === id && (entry.kind === "person" || entry.kind === "team"));
			if (!author) return undefined;
			const edges = Array.isArray(snapshotData.edges) ? snapshotData.edges : [];
			const collect = (rel) => edges
				.filter((edge) => edge && edge.from === id && edge.rel === rel)
				.map((edge) => {
					const target = all.find((entry) => entry.id === edge.to);
					return { id: edge.to, role: edge.role ?? null, char: edge.char ?? null, title: target ? nodeTitle(target) : null };
				});
			return {
				schema: snapshotData.schema || 1,
				author,
				maintained: collect("maintains"),
				authored: collect("authored"),
				members: edges.filter((edge) => edge && edge.from === id && edge.rel === "member").map((edge) => edge.to),
			};
		},
	});
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
	const data = await load(`/v1/tags/${encodeURIComponent(id)}/members`, {
		snapshot: (snapshotData) => {
			// 后端不可用时从快照重建：快照里物化了 tagMembers（标签 id → 成员 id 列表），
			// 详情对象则从 nodes / tags 里取回 —— 否则标签页在后端停机时只能报错。
			const ids = snapshotData.tagMembers && snapshotData.tagMembers[id];
			if (!Array.isArray(ids)) return undefined;
			const all = normalizeItems(snapshotData.nodes);
			const items = ids.map((nodeId) => all.find((entry) => entry.id === nodeId)).filter(Boolean);
			const summary = (Array.isArray(snapshotData.tags) ? snapshotData.tags : []).find((entry) => entry.id === id);
			const tag = summary
				? {
					id: summary.id,
					kind: "tag",
					i18n: { zh: { title: summary.title } },
					memberCount: summary.members,
				}
				: { id, kind: "tag", i18n: { zh: { title: slugOf(id) } } };
			return { schema: snapshotData.schema || 1, tag, items };
		},
	});
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
