<template>
	<div class="tv-page">
		<TavernNav :crumbs="[{ label: '全部标签' }]" />

		<header class="tv-hero">
			<div class="tv-hero-main">
				<h1 class="tv-title">标签总览</h1>
				<p class="tv-subtitle">
					酒馆后端里零成员的标签已经被过滤掉了，下面{{ tags.length ? `共 ${tags.length} 个标签` : "是全部标签" }}，
					按成员数从多到少排列。点标签可以看它的成员条目。
				</p>
			</div>
			<ul v-if="tags.length" class="tv-stats">
				<li class="tv-stat"><span class="tv-stat-value">{{ tags.length }}</span><span class="tv-stat-label">标签</span></li>
				<li class="tv-stat"><span class="tv-stat-value">{{ maxMembers }}</span><span class="tv-stat-label">最多成员</span></li>
			</ul>
		</header>

		<div class="tv-toolbar" role="search">
			<div class="tv-search">
				<svg class="tv-search-icon" viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
					<path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
				<label class="tv-sr-only" for="tavern-tag-search">搜索标签</label>
				<input
					id="tavern-tag-search"
					v-model="keyword"
					class="tv-search-input"
					type="search"
					placeholder="搜索标签名…"
					aria-label="搜索标签名"
					autocomplete="off"
				/>
				<button v-if="keyword" class="tv-search-clear" type="button" aria-label="清空标签搜索" @click="keyword = ''">×</button>
			</div>

			<label class="tv-sr-only" for="tavern-tag-sort">标签排序方式</label>
			<select id="tavern-tag-sort" v-model="sort" class="tv-select" aria-label="标签排序方式">
				<option value="members">成员数从多到少</option>
				<option value="title">按名称排序</option>
			</select>

			<button class="tv-btn" type="button" :disabled="loading" aria-label="重新加载标签列表" @click="reload">刷新数据</button>
		</div>

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !visibleTags.length"
			loading-text="正在读取标签列表…"
			error-title="读取标签失败"
			:empty-title="keyword ? '没有匹配的标签' : '酒馆里还没有标签'"
			:empty-text="keyword ? '换个关键字试试。' : '后端返回的标签集合是空的。'"
			@retry="reload"
		/>

		<template v-if="!loading && !error && visibleTags.length">
			<p class="tv-result-head" role="status" aria-live="polite">
				<span class="tv-result-count">显示 <strong>{{ visibleTags.length }}</strong> / 共 <strong>{{ tags.length }}</strong> 个标签</span>
			</p>
			<ul class="tv-tag-grid">
				<li v-for="tag in visibleTags" :key="tag.id">
					<a
						class="tv-tag-card"
						:href="tagUrl(tag.id)"
						:aria-label="`查看标签 ${tag.title} 的 ${tag.members} 个成员`"
						@click="onLink($event)"
					>
						<span class="tv-tag-card-title">{{ tag.title }}</span>
						<span class="tv-tag-bar" :style="{ width: `${barWidth(tag)}%` }" aria-hidden="true"></span>
						<span class="tv-tag-card-foot">
							<span>{{ tag.members }} 个成员条目</span>
							<span aria-hidden="true">→</span>
						</span>
					</a>
				</li>
			</ul>
		</template>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import { fetchTags, tagHref } from "./api.mjs";
import { debounce, navigateWithinPage, readParam, writeParams } from "./query.mjs";

const tags = ref([]);
const loading = ref(true);
const error = ref("");
const keyword = ref("");
const sort = ref("members");

const maxMembers = computed(() => tags.value.reduce((max, tag) => Math.max(max, tag.members), 0) || 1);

const visibleTags = computed(() => {
	const needle = keyword.value.trim().toLowerCase();
	const list = needle ? tags.value.filter((tag) => tag.title.toLowerCase().includes(needle)) : [...tags.value];
	if (sort.value === "title") return list.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN", { numeric: true }));
	return list.sort((a, b) => b.members - a.members || a.title.localeCompare(b.title, "zh-Hans-CN"));
});

const scheduleUrlSync = debounce(() => writeParams({ q: keyword.value.trim(), sort: sort.value === "members" ? "" : sort.value }, { replace: true }), 250);

async function reload() {
	loading.value = true;
	error.value = "";
	try {
		const data = await fetchTags();
		tags.value = data.items;
	} catch (caught) {
		tags.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 标签列表加载失败", caught);
	} finally {
		loading.value = false;
	}
}

function barWidth(tag) {
	return Math.max(6, Math.round((tag.members / maxMembers.value) * 100));
}

function tagUrl(id) {
	return tagHref(id);
}

function onLink(event) {
	navigateWithinPage(event, event.currentTarget.getAttribute("href"));
}

watch(keyword, scheduleUrlSync);
watch(sort, scheduleUrlSync);

onMounted(() => {
	keyword.value = readParam("q");
	const requestedSort = readParam("sort");
	sort.value = requestedSort === "title" ? "title" : "members";
	void reload();
});

onBeforeUnmount(() => scheduleUrlSync.cancel());
</script>
