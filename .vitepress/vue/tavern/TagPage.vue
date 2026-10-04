<template>
	<div class="tv-page">
		<TavernNav :crumbs="[{ label: '全部标签', href: tagsUrl }, { label: tagTitle || '标签成员' }]" />

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !currentId"
			loading-text="正在读取标签成员…"
			error-title="读取标签失败"
			empty-title="没有指定要看的标签"
			empty-text="地址里缺少 id 参数，例如 /tavern/tag?id=tag:ui。"
			@retry="loadFromUrl"
		>
			<template #actions>
				<a class="tv-btn" :href="tagsUrl">去看全部标签</a>
			</template>
		</StateBlock>

		<template v-if="currentId && !loading && !error">
			<header class="tv-hero">
				<div class="tv-hero-main">
					<div class="tv-title-row">
						<h1 class="tv-title">{{ tagTitle }}</h1>
						<span class="tv-badge tv-badge--kind">标签</span>
					</div>
					<p class="tv-slug">{{ currentId }}</p>
					<p v-if="ruleExpr" class="tv-lede">标签规则：<code>{{ ruleExpr }}</code></p>
					<p class="tv-lede">
						共收录 <strong>{{ members.length }}</strong> 个成员条目。
					</p>
				</div>
				<div class="tv-state-actions" style="margin: 0">
					<a class="tv-btn" :href="boardUrl">在酒馆看板中筛选这个标签 →</a>
				</div>
			</header>

			<div class="tv-layout" style="margin-top: 20px">
				<aside class="tv-side" aria-label="标签成员筛选">
					<FacetGroup
						v-if="kindOptions.length > 1"
						title="成员类型"
						aria-label="按成员类型筛选"
						hint="可多选"
						:options="kindOptions"
						:selected="kinds"
						@toggle="toggleKind"
					/>
					<section class="tv-facet" aria-label="标签信息">
						<h2 class="tv-facet-title">标签信息</h2>
						<dl class="tv-kv">
							<div><dt>id</dt><dd><code>{{ currentId }}</code></dd></div>
							<div v-if="ruleMode"><dt>规则类型</dt><dd>{{ ruleMode }}</dd></div>
							<div v-if="updated"><dt>最近更新</dt><dd>{{ updated }}</dd></div>
						</dl>
					</section>
				</aside>

				<main class="tv-main">
					<div class="tv-result-head">
						<span class="tv-result-count" role="status" aria-live="polite">
							显示 <strong>{{ visibleMembers.length }}</strong> / 共 <strong>{{ members.length }}</strong> 个成员
						</span>
					</div>

					<StateBlock
						v-if="!visibleMembers.length"
						:empty="true"
						empty-title="这个标签下没有符合条件的成员"
						empty-text="试着清掉成员类型的筛选。"
					>
						<template #actions>
							<button v-if="kinds.length" class="tv-btn" type="button" @click="kinds = []">清空类型筛选</button>
						</template>
					</StateBlock>

					<ul v-else class="tv-grid">
						<NodeCard v-for="member in visibleMembers" :key="member.id" :node="member" />
					</ul>
				</main>
			</div>
		</template>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import FacetGroup from "./FacetGroup.vue";
import NodeCard from "./NodeCard.vue";
import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import {
	TAVERN_PATHS,
	boardHref,
	fetchTagMembers,
	formatDate,
	kindLabel,
	kindOf,
	withSiteBase,
} from "./api.mjs";
import { onQueryChange, readParam, readParamList, writeParams } from "./query.mjs";

const tag = ref(null);
const members = ref([]);
const currentId = ref("");
const loading = ref(true);
const error = ref("");
const kinds = ref([]);
let restoreTitle = "";

const tagsUrl = computed(() => withSiteBase(TAVERN_PATHS.tags));
const tagTitle = computed(() => {
	if (tag.value) {
		const zh = tag.value.i18n && tag.value.i18n.zh;
		return (zh && zh.title) || tag.value.id || currentId.value;
	}
	return currentId.value.replace(/^tag:/, "");
});
const ruleExpr = computed(() => (tag.value && tag.value.rules && tag.value.rules.expr) || "");
const ruleMode = computed(() => (tag.value && tag.value.rules && tag.value.rules.mode) || "");
const updated = computed(() => formatDate(tag.value && tag.value.updatedAt));
const boardUrl = computed(() => boardHref({ tag: currentId.value }));

const kindOptions = computed(() => {
	const tally = new Map();
	for (const member of members.value) {
		const kind = kindOf(member);
		tally.set(kind, (tally.get(kind) || 0) + 1);
	}
	return [...tally.entries()].map(([kind, count]) => ({ key: kind, label: kindLabel(kind), count }));
});

const visibleMembers = computed(() => (kinds.value.length ? members.value.filter((member) => kinds.value.includes(kindOf(member))) : members.value));

function toggleKind(key) {
	const index = kinds.value.indexOf(key);
	if (index >= 0) kinds.value.splice(index, 1);
	else kinds.value.push(key);
	writeParams({ kind: kinds.value }, { replace: true });
}

async function loadFromUrl() {
	const id = readParam("id").trim();
	currentId.value = id;
	kinds.value = readParamList("kind");
	if (!id) {
		tag.value = null;
		members.value = [];
		loading.value = false;
		error.value = "";
		return;
	}
	loading.value = true;
	error.value = "";
	try {
		const data = await fetchTagMembers(id);
		tag.value = data.tag;
		members.value = data.items;
		if (typeof document !== "undefined") document.title = `${tagTitle.value} · 标签 | 酒馆看板`;
	} catch (caught) {
		tag.value = null;
		members.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 标签成员加载失败", caught);
	} finally {
		loading.value = false;
	}
}

let stopQueryWatch = null;

onMounted(() => {
	restoreTitle = document.title;
	stopQueryWatch = onQueryChange(() => { void loadFromUrl(); });
	void loadFromUrl();
});

onBeforeUnmount(() => {
	if (stopQueryWatch) stopQueryWatch();
	if (restoreTitle) document.title = restoreTitle;
});
</script>
