<template>
	<div class="tv-page">
		<TavernNav :crumbs="[{ label: '全部条目', href: allUrl }]" />

		<header class="tv-hero">
			<div class="tv-hero-main">
				<h1 class="tv-title">酒馆看板</h1>
				<p class="tv-subtitle">
					香草图书馆「酒馆」数据后端的只读看板：搜索条目，按类型 / 标签 / 游戏版本 / 状态筛选，
					点进卡片可以看条目详情、维护者与署名作者。所有筛选条件都写进 URL，链接可以直接分享。
				</p>
			</div>
			<ul v-if="stats.length" class="tv-stats">
				<li v-for="stat in stats" :key="stat.label" class="tv-stat">
					<span class="tv-stat-value">{{ stat.value }}</span>
					<span class="tv-stat-label">{{ stat.label }}</span>
				</li>
			</ul>
		</header>

		<div class="tv-toolbar" role="search">
			<div class="tv-search">
				<svg class="tv-search-icon" viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
					<path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
				<label class="tv-sr-only" for="tavern-search">搜索条目</label>
				<input
					id="tavern-search"
					v-model="filters.q"
					class="tv-search-input"
					type="search"
					placeholder="搜索名称、简介、标签、id 或仓库坐标…"
					aria-label="搜索条目：支持名称、简介、标签、条目 id 与仓库坐标"
					autocomplete="off"
					@keydown.enter.prevent="flushUrl"
				/>
				<button
					v-if="filters.q"
					class="tv-search-clear"
					type="button"
					aria-label="清空搜索关键字"
					@click="filters.q = ''"
				>×</button>
			</div>

			<label class="tv-sr-only" for="tavern-sort">排序方式</label>
			<select id="tavern-sort" v-model="filters.sort" class="tv-select" aria-label="排序方式">
				<option value="default">默认排序（项目优先）</option>
				<option value="title">按名称排序</option>
				<option value="updated">最近更新优先</option>
			</select>

			<button
				class="tv-btn tv-facet-toggle"
				type="button"
				:aria-expanded="facetsCollapsed ? 'false' : 'true'"
				aria-controls="tavern-facets"
				@click="facetsCollapsed = !facetsCollapsed"
			>
				筛选<span v-if="activeFacetCount">（{{ activeFacetCount }}）</span>
			</button>

			<button class="tv-btn" type="button" :disabled="!hasActiveFilters" aria-label="清空全部筛选条件" @click="clearFilters">
				清空筛选
			</button>

			<button class="tv-btn" type="button" aria-label="重新从酒馆后端加载数据" :disabled="loading" @click="reload">
				刷新数据
			</button>
		</div>

		<div class="tv-layout">
			<aside id="tavern-facets" class="tv-side" :data-collapsed="facetsCollapsed ? 'true' : 'false'" aria-label="筛选条件">
				<FacetGroup
					title="条目类型"
					aria-label="按条目类型筛选"
					hint="可多选"
					:options="kindOptions"
					:selected="filters.kinds"
					@toggle="toggleFacet('kinds', $event)"
				/>
				<FacetGroup
					v-if="stateOptions.length"
					title="状态"
					aria-label="按状态筛选"
					hint="可多选"
					:options="stateOptions"
					:selected="filters.states"
					@toggle="toggleFacet('states', $event)"
				/>
				<FacetGroup
					v-if="gameOptions.length"
					title="游戏版本"
					aria-label="按 Minecraft 版本筛选"
					hint="单选，命中区间内即算支持"
					:options="gameOptions"
					:selected="filters.game ? [filters.game] : []"
					:max-visible="8"
					@toggle="toggleFacet('game', $event)"
				/>
				<FacetGroup
					title="标签"
					aria-label="按标签筛选"
					hint="可多选（同时满足）"
					searchable
					scrollable
					search-label="搜索标签"
					search-placeholder="筛选标签…"
					:options="tagOptions"
					:selected="filters.tags"
					:max-visible="12"
					@toggle="toggleFacet('tags', $event)"
				/>
			</aside>

			<main class="tv-main">
				<div v-if="activeChips.length" class="tv-result-head">
					<span class="tv-result-count">已选条件：</span>
					<ul class="tv-chips">
						<li v-for="chip in activeChips" :key="`${chip.facet}-${chip.key}`">
							<button class="tv-chip is-active" type="button" :aria-label="`移除筛选条件 ${chip.label}`" @click="removeChip(chip)">
								{{ chip.label }} <span aria-hidden="true">×</span>
							</button>
						</li>
					</ul>
				</div>

				<StateBlock
					:loading="loading"
					:error="error"
					:empty="!loading && !error && !filtered.length"
					:loading-text="loadingText"
					:empty-title="hasActiveFilters ? '没有符合条件的条目' : '酒馆里还没有条目'"
					:empty-text="hasActiveFilters ? '换个关键字，或者放宽筛选条件试试。' : '后端返回的条目集合是空的。'"
					@retry="reload"
				>
					<template #actions>
						<button v-if="hasActiveFilters" class="tv-btn" type="button" @click="clearFilters">清空全部筛选</button>
					</template>
				</StateBlock>

				<template v-if="!loading && !error && filtered.length">
					<div class="tv-result-head">
						<span class="tv-result-count" role="status" aria-live="polite">
							显示 <strong>{{ visibleNodes.length }}</strong> / 共 <strong>{{ filtered.length }}</strong> 条
							<span v-if="datasetTotal !== filtered.length" class="tv-muted">（全部 {{ datasetTotal }} 条）</span>
						</span>
						<span class="tv-muted">点卡片标题查看详情</span>
					</div>

					<ul class="tv-grid">
						<NodeCard v-for="node in visibleNodes" :key="node.id" :node="node" :tag-ids="tagIdMap" />
					</ul>

					<div v-if="visibleNodes.length < filtered.length" class="tv-more-row">
						<button class="tv-btn tv-btn--primary" type="button" @click="loadMore">
							加载更多（还剩 {{ filtered.length - visibleNodes.length }} 条）
						</button>
					</div>
					<p v-else class="tv-more-row">已经到底啦，共 {{ filtered.length }} 条。</p>
				</template>

				<section v-if="timeline.length && !loading && !error" class="tv-timeline" aria-label="最近收录">
					<h2>最近收录</h2>
					<ul>
						<li v-for="entry in timeline" :key="`${entry.id}-${entry.at}`">
							<time :datetime="entry.at">{{ shortDate(entry.at) }}</time>
							<a :href="timelineUrl(entry)" @click="onTimelineClick($event, entry)">{{ entry.title }}</a>
						</li>
					</ul>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import FacetGroup from "./FacetGroup.vue";
import NodeCard from "./NodeCard.vue";
import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import {
	KIND_ORDER,
	allHref,
	filterNodes,
	facetCounts,
	fetchAllNodes,
	fetchStatus,
	fetchTags,
	fetchTimeline,
	formatDate,
	gameVersionOptions,
	kindLabel,
	kindOf,
	linkForNode,
	nodeState,
	nodeTags,
	stateLabel,
} from "./api.mjs";
import { debounce, navigateWithinPage, onQueryChange, readParam, readParamList, writeParams } from "./query.mjs";

const PAGE_SIZE = 24;

const nodes = ref([]);
const status = ref(null);
const tags = ref([]);
const timeline = ref([]);
const loading = ref(true);
const error = ref("");
const progress = ref("");
const facetsCollapsed = ref(false);
const tagIdMap = ref({});

const filters = reactive({
	q: "",
	kinds: [],
	tags: [],
	game: "",
	states: [],
	sort: "default",
	size: PAGE_SIZE,
});

const allUrl = computed(() => allHref());

/* --------------------------------------------------------- URL ⇄ 状态 */

function readFromUrl() {
	filters.q = readParam("q");
	filters.kinds = readParamList("kind");
	filters.tags = readParamList("tag");
	filters.game = readParam("game");
	filters.states = readParamList("state");
	const sort = readParam("sort", "default");
	filters.sort = ["default", "title", "updated"].includes(sort) ? sort : "default";
	const size = Number(readParam("n", String(PAGE_SIZE)));
	filters.size = Number.isFinite(size) && size > PAGE_SIZE ? Math.floor(size) : PAGE_SIZE;
}

function queryPatch() {
	return {
		q: filters.q.trim(),
		kind: filters.kinds,
		tag: filters.tags,
		game: filters.game,
		state: filters.states,
		sort: filters.sort === "default" ? "" : filters.sort,
		n: filters.size > PAGE_SIZE ? filters.size : "",
	};
}

const scheduleUrlSync = debounce(() => writeParams(queryPatch(), { replace: true }), 250);

function flushUrl() {
	scheduleUrlSync.cancel();
	writeParams(queryPatch(), { replace: true });
}

watch(() => filters.q, () => {
	if (filters.size !== PAGE_SIZE) filters.size = PAGE_SIZE;
	scheduleUrlSync();
});

watch(() => filters.sort, () => flushUrl());

/* ------------------------------------------------------------ 取数 */

async function reload() {
	loading.value = true;
	error.value = "";
	progress.value = "";
	try {
		const dataset = await fetchAllNodes({
			onProgress: (loaded, total) => {
				progress.value = total ? `已加载 ${loaded}/${total} 条…` : `已加载 ${loaded} 条…`;
			},
		});
		nodes.value = dataset.items;
		progress.value = "";
	} catch (caught) {
		nodes.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 条目列表加载失败", caught);
	} finally {
		loading.value = false;
	}
}

async function loadSecondary() {
	const [statusResult, tagsResult, timelineResult] = await Promise.allSettled([
		fetchStatus(),
		fetchTags(),
		fetchTimeline({ limit: 8 }),
	]);
	if (statusResult.status === "fulfilled") status.value = statusResult.value;
	else console.warn("[tavern] /v1/status 不可用", statusResult.reason);
	if (tagsResult.status === "fulfilled") {
		tags.value = tagsResult.value.items;
		const map = {};
		for (const tag of tagsResult.value.items) map[tag.title] = tag.id;
		tagIdMap.value = map;
	} else {
		console.warn("[tavern] /v1/tags 不可用，标签分面退化为使用条目自带的标签文本", tagsResult.reason);
	}
	if (timelineResult.status === "fulfilled") timeline.value = timelineResult.value.items;
	else console.warn("[tavern] /v1/timeline 不可用", timelineResult.reason);
}

/* ---------------------------------------------------------- 分面数据 */

const stats = computed(() => {
	const value = status.value;
	if (!value || !value.nodes) return [];
	const byKind = value.nodes.byKind || {};
	return [
		{ label: "条目", value: value.nodes.total || 0 },
		{ label: "项目", value: byKind.project || 0 },
		{ label: "作者", value: byKind.person || 0 },
		{ label: "标签", value: byKind.tag || 0 },
	];
});

const filterPayload = computed(() => ({
	q: filters.q,
	kinds: filters.kinds,
	tags: filters.tags,
	game: filters.game,
	states: filters.states,
	sort: filters.sort,
}));

const filtered = computed(() => filterNodes(nodes.value, filterPayload.value));
const visibleNodes = computed(() => filtered.value.slice(0, filters.size));
const datasetTotal = computed(() => nodes.value.length);

const availableStates = computed(() => {
	const seen = new Set();
	for (const node of nodes.value) {
		const state = nodeState(node);
		if (state) seen.add(state);
	}
	return [...seen].sort();
});

/** 标签分面的候选项（不含计数，避免与 facetCounts 互相依赖）。 */
const tagBaseOptions = computed(() => {
	if (tags.value.length) {
		return [...tags.value]
			.sort((a, b) => b.members - a.members || a.title.localeCompare(b.title, "zh-Hans-CN"))
			.map((tag) => ({ key: tag.id, label: tag.title }));
	}
	const tally = new Map();
	for (const node of nodes.value) {
		for (const tag of nodeTags(node)) tally.set(tag, (tally.get(tag) || 0) + 1);
	}
	return [...tally.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
		.map(([title]) => ({ key: `tag:${title.toLowerCase()}`, label: title }));
});

/** 类型 / 状态的联动计数（统计时排除自身的分面）。 */
const kindStateCounts = computed(() => facetCounts(nodes.value, filterPayload.value, {
	kinds: KIND_ORDER,
	states: availableStates.value,
}));

/** 标签计数：在其它筛选条件都生效的前提下，再叠加该标签还能命中多少条。 */
const tagCounts = computed(() => {
	const rest = filterPayload.value;
	const result = {};
	for (const option of tagBaseOptions.value) {
		result[option.key] = filterNodes(nodes.value, { ...rest, tags: [option.key], sort: "default" }).length;
	}
	return result;
});

const kindOptions = computed(() => KIND_ORDER.map((kind) => ({
	key: kind,
	label: kindLabel(kind),
	count: kindStateCounts.value.kind[kind] || 0,
})));

const stateOptions = computed(() => availableStates.value.map((state) => ({
	key: state,
	label: stateLabel(state),
	count: kindStateCounts.value.state[state] || 0,
})));

const gameOptions = computed(() => gameVersionOptions(nodes.value).map((option) => ({
	key: option.value,
	label: option.value,
	count: option.total,
})));

const tagOptions = computed(() => tagBaseOptions.value.map((option) => ({
	...option,
	count: tagCounts.value[option.key] || 0,
})));

const tagLabelMap = computed(() => {
	const map = new Map();
	for (const tag of tags.value) map.set(tag.id, tag.title);
	return map;
});

/* ---------------------------------------------------------- 交互逻辑 */

const activeFacetCount = computed(() =>
	filters.kinds.length + filters.tags.length + filters.states.length + (filters.game ? 1 : 0),
);

const hasActiveFilters = computed(() => activeFacetCount.value > 0 || Boolean(filters.q.trim()));

const activeChips = computed(() => {
	const chips = [];
	for (const kind of filters.kinds) chips.push({ facet: "kinds", key: kind, label: `类型：${kindLabel(kind)}` });
	for (const state of filters.states) chips.push({ facet: "states", key: state, label: `状态：${stateLabel(state)}` });
	if (filters.game) chips.push({ facet: "game", key: filters.game, label: `版本：${filters.game}` });
	for (const tag of filters.tags) {
		chips.push({ facet: "tags", key: tag, label: `标签：${tagLabelMap.value.get(tag) || tag.replace(/^tag:/, "")}` });
	}
	return chips;
});

const loadingText = computed(() => (progress.value ? `正在从酒馆后端取数…${progress.value}` : "正在从酒馆后端取数…"));

function resetSize() {
	filters.size = PAGE_SIZE;
}

function toggleFacet(facet, key) {
	if (facet === "game") {
		filters.game = filters.game === key ? "" : key;
	} else {
		const list = filters[facet];
		const index = list.indexOf(key);
		if (index >= 0) list.splice(index, 1);
		else list.push(key);
	}
	resetSize();
	flushUrl();
}

function removeChip(chip) {
	if (chip.facet === "game") {
		filters.game = "";
	} else {
		const list = filters[chip.facet];
		const index = list.indexOf(chip.key);
		if (index >= 0) list.splice(index, 1);
	}
	resetSize();
	flushUrl();
}

function clearFilters() {
	filters.q = "";
	filters.kinds = [];
	filters.tags = [];
	filters.game = "";
	filters.states = [];
	resetSize();
	flushUrl();
	if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadMore() {
	filters.size += PAGE_SIZE;
	writeParams(queryPatch(), { replace: false });
}

function shortDate(value) {
	const formatted = formatDate(value);
	return formatted ? formatted.slice(5) : "";
}

function timelineUrl(entry) {
	return linkForNode({ id: entry.id, kind: kindOf(entry.id) });
}

function onTimelineClick(event, entry) {
	navigateWithinPage(event, timelineUrl(entry));
}

/* ------------------------------------------------------------ 生命周期 */

let stopQueryWatch = null;

onMounted(() => {
	readFromUrl();
	if (typeof window !== "undefined") facetsCollapsed.value = window.innerWidth <= 960;
	stopQueryWatch = onQueryChange(() => readFromUrl());
	void loadSecondary();
	void reload();
});

onBeforeUnmount(() => {
	if (stopQueryWatch) stopQueryWatch();
	scheduleUrlSync.cancel();
});
</script>
