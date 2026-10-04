<template>
	<div class="tv-page">
		<TavernNav :crumbs="[{ label: '全部条目' }]" />

		<header class="tv-hero">
			<div class="tv-hero-main">
				<h1 class="tv-title">全部条目</h1>
				<p class="tv-subtitle">
					把酒馆后端里的{{ datasetTotal ? ` ${datasetTotal} 条` : "" }}条目按类型摊开：项目、作者、标签。
					想按标签 / 游戏版本筛选请回 <a :href="boardUrl">酒馆看板</a>。
				</p>
			</div>
			<ul v-if="!loading && !error" class="tv-stats">
				<li v-for="group in groups" :key="`stat-${group.kind}`" class="tv-stat">
					<span class="tv-stat-value">{{ group.total }}</span>
					<span class="tv-stat-label">{{ group.label }}</span>
				</li>
			</ul>
		</header>

		<div class="tv-toolbar" role="search">
			<div class="tv-search">
				<svg class="tv-search-icon" viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
					<path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
				<label class="tv-sr-only" for="tavern-all-search">搜索全部条目</label>
				<input
					id="tavern-all-search"
					v-model="keyword"
					class="tv-search-input"
					type="search"
					placeholder="搜索名称、简介、标签、id 或仓库坐标…"
					aria-label="搜索全部条目"
					autocomplete="off"
				/>
				<button v-if="keyword" class="tv-search-clear" type="button" aria-label="清空搜索关键字" @click="keyword = ''">×</button>
			</div>
			<button class="tv-btn" type="button" :disabled="loading" aria-label="重新加载全部条目" @click="reload">刷新数据</button>
			<a class="tv-btn" :href="boardUrl">回看板</a>
		</div>

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !visibleGroups.length"
			loading-text="正在读取全部条目…"
			error-title="读取条目失败"
			:empty-title="keyword ? '没有匹配的条目' : '酒馆里还没有条目'"
			:empty-text="keyword ? '换个关键字试试。' : '后端返回的条目集合是空的。'"
			@retry="reload"
		>
			<template #actions>
				<button v-if="keyword" class="tv-btn" type="button" @click="keyword = ''">清空搜索</button>
			</template>
		</StateBlock>

		<template v-for="group in visibleGroups" :key="group.kind">
			<section class="tv-panel" style="margin-top: 20px" :aria-label="`${group.label}列表`">
				<div class="tv-result-head">
					<h2 class="tv-section-title" style="margin: 0">{{ group.label }}（{{ group.nodes.length }}）</h2>
					<button
						v-if="group.nodes.length > GROUP_LIMIT"
						class="tv-btn"
						type="button"
						:aria-expanded="expanded[group.kind] ? 'true' : 'false'"
						@click="toggleGroup(group.kind)"
					>
						{{ expanded[group.kind] ? "收起" : `显示全部 ${group.nodes.length} 条` }}
					</button>
				</div>
				<ul class="tv-grid">
					<NodeCard v-for="node in group.shown" :key="node.id" :node="node" />
				</ul>
			</section>
		</template>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import NodeCard from "./NodeCard.vue";
import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import {
	KIND_ORDER,
	boardHref,
	fetchAllNodes,
	filterNodes,
	kindLabel,
} from "./api.mjs";
import { debounce, readParam, writeParams } from "./query.mjs";

const GROUP_LIMIT = 12;

const nodes = ref([]);
const loading = ref(true);
const error = ref("");
const keyword = ref("");
const datasetTotal = ref(0);
const expanded = reactive({});

const boardUrl = computed(() => boardHref());

const matched = computed(() => (keyword.value.trim() ? filterNodes(nodes.value, { q: keyword.value, sort: "title" }) : nodes.value));

const groups = computed(() => KIND_ORDER
	.map((kind) => ({
		kind,
		label: kindLabel(kind),
		total: nodes.value.filter((node) => node.kind === kind).length,
		nodes: matched.value.filter((node) => node.kind === kind),
	}))
	.filter((group) => group.total > 0));

const visibleGroups = computed(() => groups.value
	.map((group) => ({
		...group,
		shown: expanded[group.kind] ? group.nodes : group.nodes.slice(0, GROUP_LIMIT),
	}))
	.filter((group) => group.shown.length));

const scheduleUrlSync = debounce(() => writeParams({ q: keyword.value.trim() }, { replace: true }), 250);

function toggleGroup(kind) {
	expanded[kind] = !expanded[kind];
}

async function reload() {
	loading.value = true;
	error.value = "";
	try {
		const dataset = await fetchAllNodes();
		nodes.value = dataset.items;
		datasetTotal.value = dataset.total || dataset.items.length;
	} catch (caught) {
		nodes.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 全部条目加载失败", caught);
	} finally {
		loading.value = false;
	}
}

watch(keyword, scheduleUrlSync);

onMounted(() => {
	keyword.value = readParam("q");
	void reload();
});

onBeforeUnmount(() => scheduleUrlSync.cancel());
</script>
