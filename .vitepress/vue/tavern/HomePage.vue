<template>
	<div class="tv-page tv-home">
		<!--
			主页不摆面包屑：它就是根，「酒馆看板 / 看板」这种自我指涉只是噪声。
			但 StaleNotice 必须留下 —— 后端挂了、数据来自离线快照时，
			读者有权知道自己看的不是最新的（设计文档 §11.2）。
		-->
		<StaleNotice />

		<!--
			Hero 与搜索行照前置馆（wheel）的搜索页布局：居中、大号粗标题、
			一枚像素图标、胶囊搜索框 + 蓝色主按钮。看板是门户，这一屏就是它的门脸。
		-->
		<header class="tv-home-hero">
			<img class="tv-home-logo" :src="logoUrl" alt="" width="84" height="84" />
			<h1 class="tv-home-title">酒馆看板</h1>

			<ul v-if="!loading && !error" class="tv-home-stats">
				<li v-for="stat in stats" :key="stat.label" class="tv-home-stat">
					<span class="tv-home-stat-value">{{ stat.value }}</span>
					<span class="tv-home-stat-label">{{ stat.label }}</span>
				</li>
			</ul>

			<!-- 搜索：主页只留入口，筛选器在「全部条目」 -->
			<form class="tv-home-searchrow" role="search" @submit.prevent="goSearch">
				<label class="tv-sr-only" for="tavern-home-search">搜索条目</label>
				<div class="tv-home-searchbox">
					<svg class="tv-search-icon" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
						<path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
					</svg>
					<input
						id="tavern-home-search"
						v-model="keyword"
						class="tv-home-searchinput"
						type="search"
						placeholder="搜索作品、赛事、作者、标签…"
						autocomplete="off"
					/>
					<button v-if="keyword" class="tv-search-clear" type="button" aria-label="清空搜索关键字" @click="keyword = ''">×</button>
				</div>
				<button class="tv-home-go" type="submit">搜索</button>
				<a class="tv-home-secondary" :href="allUrl">全部条目</a>
			</form>

			<p class="tv-home-hint">
				类型 / 标签 / 游戏版本 / 状态这些筛选在<a :href="allUrl">全部条目</a>里，
				条件都写进 URL，链接可以直接分享。
			</p>
		</header>

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !nodes.length"
			loading-text="正在从酒馆后端取数…"
			error-title="读取看板失败"
			empty-title="酒馆里还没有条目"
			empty-text="后端返回的条目集合是空的。"
			@retry="reload"
		/>

		<template v-if="!loading && !error && nodes.length">
			<!-- ───────────────────── 区块一：进行中的赛事 ───────────────────── -->
			<section class="tv-home-sec" aria-labelledby="tv-home-events">
				<div class="tv-home-sechead">
					<h2 id="tv-home-events">进行中的赛事</h2>
					<span class="tv-home-count">{{ eventCountText }}</span>
					<a class="tv-home-more" :href="eventsUrl">全部赛事 →</a>
				</div>

				<div v-if="!liveEvents.length" class="tv-home-empty">
					<p><strong>当前没有进行中的赛事。</strong>
						<template v-if="nextEvent">
							最近一场是 <a :href="eventUrl(nextEvent.node)">{{ eventTitle(nextEvent.node) }}</a>，
							{{ eventWindowText(nextEvent.node, "start") }} 开始。
						</template>
						<template v-else-if="pastEvents.length">{{ pastEvents.length }} 个赛事已经结束。</template>
					</p>
					<p class="tv-muted">
						空态是刻意保留的：区块标题不消失，读者才知道「是现在没有」，而不是「这个站没有赛事功能」。
					</p>
				</div>

				<EventBanner
					v-for="item in liveEvents"
					:key="item.node.id"
					:node="item.node"
					:detail="item.detail"
					:works="item.works"
					:works-loaded="item.worksLoaded"
					:feed="item.feed"
					:published="nodeIndex"
					phase="live"
					:now="now"
				/>

				<template v-if="soonEvents.length">
					<h3 class="tv-home-group">即将开始 <span>还没到时间窗，先把日子占上</span></h3>
					<EventBanner
						v-for="item in soonEvents"
						:key="item.node.id"
						:node="item.node"
						:detail="item.detail"
						:works="item.works"
						:works-loaded="item.worksLoaded"
						:feed="item.feed"
						:published="nodeIndex"
						phase="soon"
						:now="now"
					/>
				</template>

				<div v-if="recentlyEnded.length" class="tv-home-ended">
					<strong>刚结束</strong>
					<span v-for="item in recentlyEnded" :key="item.node.id" class="tv-ended-item">
						<a :href="eventUrl(item.node)">{{ eventTitle(item.node) }}</a>
						<time>{{ eventWindowText(item.node, "end") }} 收尾</time>
						<span v-if="item.works.length" class="tv-muted">参赛作品 {{ item.works.length }} 件</span>
					</span>
				</div>
			</section>

			<!-- ───────────────────── 区块二：正在招队友 ───────────────────── -->
			<section class="tv-home-sec" aria-labelledby="tv-home-recruit">
				<div class="tv-home-sechead">
					<h2 id="tv-home-recruit">正在招队友</h2>
					<span class="tv-home-count">{{ recruitCountText }}</span>
					<a class="tv-home-more" :href="allUrl">按标签浏览 →</a>
				</div>

				<div v-if="recruiters.length" class="tv-grid tv-home-grid">
					<HomeProjectCard
						v-for="item in recruiters"
						:key="item.node.id"
						:node="item.node"
						:detail="item.detail"
						:feed="item.feed"
						:published="nodeIndex"
						:tag-ids="tagIdMap"
						mode="recruit"
						:now="now"
					/>
				</div>
				<div v-else class="tv-home-empty">
					<p><strong>现在没有在招队友的作品。</strong></p>
					<p class="tv-muted">过了截止日会自动从这里消失（纯计算，不用审核，也不用谁去下架）。</p>
				</div>
			</section>

			<!-- ───────────────────── 区块三：正在做的作品 ───────────────────── -->
			<section class="tv-home-sec" aria-labelledby="tv-home-doing">
				<div class="tv-home-sechead">
					<h2 id="tv-home-doing">正在做的作品</h2>
					<span class="tv-home-count">{{ doingCountText }}</span>
					<a class="tv-home-more" :href="allUrl">全部作品 →</a>
				</div>

				<div v-if="doing.length" class="tv-grid tv-home-grid">
					<HomeProjectCard
						v-for="item in doing"
						:key="item.node.id"
						:node="item.node"
						:detail="item.detail"
						:feed="item.feed"
						:published="nodeIndex"
						:tag-ids="tagIdMap"
						mode="doing"
						:now="now"
					/>
				</div>
				<div v-else-if="allActiveAreRecruiting" class="tv-home-empty">
					<p><strong>有动静的作品都已经在上面「正在招队友」里列着了。</strong>
						它们此刻的重点是找人，阶段与动态都写在各自的卡片上。
						等它们招满了人、或者记下新的进展，就会回到这一块。</p>
				</div>
				<template v-else-if="doingFallback.length">
					<div class="tv-home-empty">
						<p><strong>还没有作品声明「正在做什么」。</strong>
							下面这些是按最近更新排的前 {{ doingFallback.length }} 个作品 ——
							它们还没有阶段，也没有事件记录，所以严格说不算「有动静」。</p>
					</div>
					<div class="tv-grid tv-home-grid">
						<HomeProjectCard
							v-for="item in doingFallback"
							:key="item.node.id"
							:node="item.node"
							:detail="item.detail"
							:feed="item.feed"
							:published="nodeIndex"
							:tag-ids="tagIdMap"
							mode="doing"
							:now="now"
						/>
					</div>
				</template>
				<div v-else class="tv-home-empty">
					<p><strong>这个时间点上，没有任何作品声明了阶段或近期动态。</strong></p>
					<p class="tv-muted">
						这不是「没有作品」，而是「没有作品说自己正在做什么」 ——
						那些作品仍然在库里，只是没填阶段、没记事件。
					</p>
				</div>
			</section>

			<!-- ───────────────────────── 底部三栏 ───────────────────────── -->
			<div class="tv-home-cols">
				<section class="tv-panel" aria-labelledby="tv-home-feed">
					<h2 id="tv-home-feed">最近动态</h2>
					<ul v-if="feedItems.length" class="tv-home-feedlist">
						<li v-for="entry in feedItems" :key="`${entry.at}-${entry.id}-${entry.title}`">
							<time :datetime="entry.at">{{ shortDate(entry.at) }}</time>
							<span class="tv-home-feedkind">{{ eventKindLabel(entry.rel) }}</span>
							<span>
								{{ entry.title }}
								<a v-if="entry.ownerUrl" class="tv-home-feedowner" :href="entry.ownerUrl">· {{ entry.ownerTitle }}</a>
							</span>
						</li>
					</ul>
					<p v-else class="tv-muted">
						还没有动态。事件流只记<strong>已经发生</strong>的事（立项、招满、发版、获奖），
						计划里的日期属于阶段的时间窗，不算事件。
					</p>
				</section>

				<section class="tv-panel" aria-labelledby="tv-home-tags">
					<h2 id="tv-home-tags">按标签逛</h2>
					<div v-if="topTags.length" class="tv-home-tagcloud">
						<a v-for="tag in topTags" :key="tag.id" :href="tagHref(tag.id)" :class="{ 'is-big': tag.big }">
							{{ tag.title }} <span>{{ tag.members }}</span>
						</a>
					</div>
					<p v-else class="tv-muted">标签列表暂时取不到（后端不可用时这一块会空着）。</p>
				</section>

				<section class="tv-panel" aria-labelledby="tv-home-more-links">
					<h2 id="tv-home-more-links">其他地方</h2>
					<ul class="tv-home-links">
						<li><a :href="allUrl">全部条目</a> <span>· 搜索、筛选、按类型分组</span></li>
						<li><a :href="tagsUrl">标签总览</a> <span>· 标签页是自动生成的查询页</span></li>
						<li><a :href="authorsUrl">作者名录</a> <span>· 个人与团队</span></li>
						<li><a :href="contributeUrl">投稿 / 认领作品</a> <span>· 需要工作组签发的凭证</span></li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import EventBanner from "./EventBanner.vue";
import HomeProjectCard from "./HomeProjectCard.vue";
import StaleNotice from "./StaleNotice.vue";
import StateBlock from "./StateBlock.vue";
import "./tavern.css";

import { DAY } from "./chart.mjs";

import {
	eventKindLabel,
	fetchAllNodes,
	fetchNodeBriefs,
	fetchTags,
	fetchTimeline,
	formatDate,
	kindOf,
	linkForNode,
	nodeCurrentPhases,
	nodeTitle,
	nodeWindow,
	openRecruitRoles,
	recentActivity,
	tagHref,
	tagsHref,
	TAVERN_PATHS,
	withSiteBase,
	allHref,
	windowPhase,
} from "./api.mjs";

/** 每块最多铺几张卡片 —— 主页是门户，不是清单；剩下的交给「全部作品」。 */
const MAX_CARDS = 6;
/** 「有动静」的时间窗：多久没动静就不算在做了。 */
const ACTIVITY_DAYS = 60;
const ACTIVITY_WINDOW = ACTIVITY_DAYS * DAY;
/** 「刚结束」保留多久（再久就进往届，主页不再提）。 */
const ENDED_WINDOW = 150 * DAY;

const nodes = ref([]);
const briefs = ref(new Map());
const timeline = ref([]);
const tags = ref([]);
const loading = ref(true);
const error = ref("");
const keyword = ref("");
/** 一次渲染用同一个"现在"，避免各处时钟不一致（子组件都收这个值）。 */
const now = ref(Date.now());

const allUrl = computed(() => allHref());
const tagsUrl = computed(() => tagsHref());
const authorsUrl = computed(() => withSiteBase("/tavern/a"));
const contributeUrl = computed(() => withSiteBase("/CONTRIBUTING"));
const eventsUrl = computed(() => allHref({ kind: "event" }));
/**
 * 头图沿用前置馆的做法：拿一枚 Minecraft 物品图标当 logo（前置馆是「矿车+箱子」，
 * 酒馆用「甜浆果炖」——一样是像素物品图，尺寸也对得上）。
 * 这是全站唯一一处"装饰性"资源，换掉只是一行。
 */
const logoUrl = computed(() => withSiteBase("/icons/sweetbarry_stew.png"));

const nodeIndex = computed(() => new Map(nodes.value.map((node) => [node.id, node])));
const tagIdMap = computed(() => {
	const map = {};
	for (const tag of tags.value) map[tag.title] = tag.id;
	return map;
});

function titleOf(id) {
	const node = nodeIndex.value.get(id);
	return node ? nodeTitle(node) : id;
}

/* --------------------------------------------------------------- 动态 */

/** 真动态 = 事件流（时间线里的 created 那些是"什么时候进库的"，不是作品的活动）。 */
const activity = computed(() => recentActivity(timeline.value));

const feedByNode = computed(() => {
	const map = new Map();
	for (const entry of activity.value) {
		if (!map.has(entry.id)) map.set(entry.id, []);
		const list = map.get(entry.id);
		if (list.length < 3) list.push(entry);
	}
	return map;
});

/** 近期有动静的条目 id（60 天内） */
const activeIds = computed(() => {
	const set = new Set();
	for (const entry of activity.value) {
		const at = Date.parse(entry.at);
		if (Number.isFinite(at) && now.value - at <= ACTIVITY_WINDOW) set.add(entry.id);
	}
	return set;
});

const feedItems = computed(() => activity.value.slice(0, 8).map((entry) => {
	const node = nodeIndex.value.get(entry.id);
	return {
		...entry,
		ownerTitle: node ? nodeTitle(node) : "",
		ownerUrl: node ? linkForNode(node) : "",
	};
}));

/* --------------------------------------------------------------- 赛事 */

const eventNodes = computed(() => nodes.value.filter((node) => kindOf(node) === "event"));

function decorate(node) {
	const detail = briefs.value.get(node.id) || null;
	const raw = detail && detail.node ? detail.node : node;
	const edges = Array.isArray(raw.edges) ? raw.edges : [];
	/*
	 * ⚠️ 收录边只是"边"，它可能指向一个**未上架**的节点（下面夹具库就是这么造的）。
	 * 公开面只有已上架条目：拿不到节点就不画这一块 —— 绝不能退化成显示裸 id，
	 * 那等于把"存在一个未上架的 xxx"泄露出去，链接还会 404。
	 */
	const works = edges
		.filter((edge) => edge && edge.rel === "includes")
		.map((edge) => {
			const workNode = nodeIndex.value.get(edge.to);
			if (!workNode) return null;
			const workDetail = briefs.value.get(edge.to);
			const workRaw = workDetail && workDetail.node ? workDetail.node : workNode;
			const authored = workRaw && Array.isArray(workRaw.incoming)
				? workRaw.incoming.filter((item) => item && item.rel === "authored" && nodeIndex.value.has(item.from))
				: [];
			const [first] = authored;
			return {
				id: edge.to,
				title: nodeTitle(workNode),
				by: first ? titleOf(first.from) : "",
				char: first && first.char ? first.char : (edge.char || ""),
				url: linkForNode(workNode),
			};
		})
		.filter(Boolean);
	return {
		node,
		detail,
		works,
		// 详情没取到 ≠ 这个赛事没有作品。渲染层要能把这两种情况分开说。
		worksLoaded: Boolean(detail),
		feed: feedByNode.value.get(node.id) || [],
	};
}

const decoratedEvents = computed(() => eventNodes.value.map(decorate));
const liveEvents = computed(() => decoratedEvents.value.filter((item) => windowPhase(item.node, now.value) === "live"));
const soonEvents = computed(() => decoratedEvents.value.filter((item) => windowPhase(item.node, now.value) === "soon"));
const pastEvents = computed(() => decoratedEvents.value.filter((item) => windowPhase(item.node, now.value) === "past"));

const nextEvent = computed(() => soonEvents.value[0] || null);

const recentlyEnded = computed(() => pastEvents.value
	.filter((item) => {
		const window = nodeWindow(item.node);
		return window && window.end != null && now.value - window.end <= ENDED_WINDOW;
	})
	.sort((a, b) => {
		const left = nodeWindow(a.node);
		const right = nodeWindow(b.node);
		return (right ? right.end : 0) - (left ? left.end : 0);
	}));

const eventCountText = computed(() => {
	if (liveEvents.value.length) {
		return soonEvents.value.length
			? `${liveEvents.value.length} 个进行中 · ${soonEvents.value.length} 个即将开始`
			: `${liveEvents.value.length} 个进行中`;
	}
	return soonEvents.value.length ? `0 个进行中 · ${soonEvents.value.length} 个即将开始` : "0 个";
});

function eventUrl(node) {
	return linkForNode(node);
}

function eventTitle(node) {
	return nodeTitle(node);
}

function eventWindowText(node, side) {
	const window = nodeWindow(node);
	if (!window) return "时间未定";
	const value = side === "start" ? window.start : window.end;
	return value == null ? "时间未定" : formatDate(value);
}

/* ------------------------------------------------- 招队友 / 正在做的作品 */

const projectNodes = computed(() => nodes.value.filter((node) => kindOf(node) === "project"));

function isRecruiting(node) {
	return openRecruitRoles(node, now.value).length > 0;
}

/** 「有动静」= 有正在进行的阶段 ∪ 还在招队友 ∪ 近期有事件。 */
function isActive(node) {
	if (nodeCurrentPhases(node, now.value).length) return true;
	if (isRecruiting(node)) return true;
	return activeIds.value.has(node.id);
}

function toCard(node) {
	return {
		node,
		detail: briefs.value.get(node.id) || null,
		feed: feedByNode.value.get(node.id) || [],
	};
}

const recruitNodes = computed(() => projectNodes.value.filter(isRecruiting));
const recruiters = computed(() => recruitNodes.value.slice(0, MAX_CARDS).map(toCard));
const openRoleCount = computed(() => recruitNodes.value.reduce((total, node) => total + openRecruitRoles(node, now.value).length, 0));

const activeProjects = computed(() => projectNodes.value.filter(isActive));
const doing = computed(() => activeProjects.value
	.filter((node) => !isRecruiting(node))          // 已经在上面「正在招队友」出现过的，这里不重复占位
	.slice(0, MAX_CARDS)
	.map(toCard));

/**
 * 「有动静」一个都没有时的兜底：按最近更新排几个作品。
 *
 * 为什么需要它：主库里的作品**全是导入时的 active**，既没有阶段也没有事件 ——
 * 严格按设计，主页会连着两个空块。那不算看板坏了，但读者第一眼会以为坏了。
 * 所以退一步给「最近更新的作品」，并明说它们还没声明阶段（不假装它们"在动"）。
 *
 * ⚠️ 触发条件是「一个活跃作品都没有」，不是「这一块没东西可列」——
 * 后者还可能是因为活跃作品全都在上面「正在招队友」里出现过了，那种情况该说清楚，
 * 而不是顺手退化成"最近更新"（那就把同一批卡片又列了一遍，还说了句假话）。
 */
const doingFallback = computed(() => {
	if (activeProjects.value.length) return [];
	return [...projectNodes.value]
		.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
		.slice(0, MAX_CARDS)
		.map(toCard);
});

/** 有活跃作品，但全都已经在上面「正在招队友」里列过了。 */
const allActiveAreRecruiting = computed(() => doing.value.length === 0 && activeProjects.value.length > 0);

const recruitCountText = computed(() => (recruitNodes.value.length
	? `${recruitNodes.value.length} 个作品 · ${openRoleCount.value} 个位置`
	: "0 个"));

/**
 * 「有动静」的计数。**把"其余都没声明"一起写进徽章**：
 * 原来这件事由区块下面那段说明承担，说明段删掉后信息不能跟着丢 ——
 * 否则读者会以为库里就这么多作品（实际是 58 个里只有个别填了阶段/事件）。
 */
const doingCountText = computed(() => {
	const shown = doing.value.length + recruitNodes.value.length;
	const quiet = Math.max(0, projectNodes.value.length - shown);
	return quiet ? `${shown} 个有动静 · ${quiet} 个未声明` : `${shown} 个有动静`;
});

const topTags = computed(() => [...tags.value]
	.sort((a, b) => b.members - a.members || a.title.localeCompare(b.title, "zh-Hans-CN"))
	.slice(0, 12)
	.map((tag, index) => ({ ...tag, big: index < 3 })));

const stats = computed(() => [
	{ label: "进行中赛事", value: liveEvents.value.length },
	{ label: "在招队友", value: openRoleCount.value },
	{ label: "有动静的作品", value: activeProjects.value.length },
	{ label: "收录条目", value: nodes.value.length },
]);

/* --------------------------------------------------------------- 取数 */

async function reload() {
	loading.value = true;
	error.value = "";
	now.value = Date.now();
	try {
		const [dataset, timelineResult, tagsResult] = await Promise.all([
			fetchAllNodes(),
			fetchTimeline({ limit: 60 }).catch((caught) => {
				console.warn("[tavern] /v1/timeline 不可用，动态与「有动静」判据会退化", caught);
				return { items: [] };
			}),
			fetchTags().catch((caught) => {
				console.warn("[tavern] /v1/tags 不可用", caught);
				return { items: [] };
			}),
		]);
		nodes.value = dataset.items;
		timeline.value = timelineResult.items;
		tags.value = tagsResult.items;

		/*
		 * 详情（阶段 / 边）只有详情接口给，列表接口刻意不带（避免 N+1）。
		 * 主页只对**要画阶段条的那些**取详情：赛事全取、卡片取前几张。
		 * 两轮：先赛事与卡片，再赛事底下的参赛作品（要它们的署名边）。
		 */
		const wanted = [
			...eventNodes.value.map((node) => node.id),
			...recruiters.value.map((item) => item.node.id),
			...doing.value.map((item) => item.node.id),
		];
		const first = await fetchNodeBriefs(wanted);

		const workIds = [];
		for (const node of eventNodes.value) {
			const detail = first.get(node.id);
			const raw = detail && detail.node ? detail.node : null;
			if (!raw || !Array.isArray(raw.edges)) continue;
			for (const edge of raw.edges) if (edge && edge.rel === "includes") workIds.push(edge.to);
		}
		const second = workIds.length ? await fetchNodeBriefs(workIds) : new Map();

		briefs.value = new Map([...first, ...second]);
	} catch (caught) {
		nodes.value = [];
		briefs.value = new Map();
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 看板主页取数失败", caught);
	} finally {
		loading.value = false;
	}
}

function goSearch() {
	const value = keyword.value.trim();
	window.location.assign(allHref(value ? { q: value } : {}));
}

function shortDate(value) {
	const formatted = formatDate(value);
	return formatted ? formatted.slice(5) : "";
}

/**
 * 旧主页把筛选条件写在 `/tavern/` 上（`?tag=ui` 之类），分享出去的链接不能失效：
 * 带筛选参数的访问一律转去「全部条目」，**原样带着查询串**（含 `?api=` 后端覆盖）。
 */
function redirectLegacyFilters() {
	if (typeof window === "undefined") return false;
	const params = new URLSearchParams(window.location.search || "");
	const filterKeys = ["q", "kind", "tag", "game", "state", "sort", "n"];
	if (!filterKeys.some((key) => params.has(key))) return false;
	const target = new URL(withSiteBase(TAVERN_PATHS.all), window.location.href);
	target.search = window.location.search;
	window.location.replace(target.href);
	return true;
}

onMounted(() => {
	if (redirectLegacyFilters()) return;
	void reload();
});
</script>
