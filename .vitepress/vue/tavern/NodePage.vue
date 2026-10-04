<template>
	<div class="tv-page">
		<TavernNav :crumbs="crumbs" />

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !node"
			loading-text="正在读取条目详情…"
			error-title="读取条目失败"
			empty-title="没有指定要看的条目"
			empty-text="地址里缺少 id 参数，例如 /tavern/p?id=project:Floating_UI。"
			@retry="loadFromUrl"
		>
			<template #actions>
				<a class="tv-btn" :href="allUrl">去全部条目里找</a>
			</template>
		</StateBlock>

		<template v-if="node && !loading && !error">
			<header class="tv-detail-hero">
				<div class="tv-hero-thumb" aria-hidden="true">
					<img v-if="thumb" :src="thumb" alt="" @error="thumbFailed = true" />
					<span v-else>{{ initials }}</span>
				</div>
				<div class="tv-hero-body">
					<div class="tv-title-row">
						<h1>{{ title }}</h1>
						<span class="tv-badge tv-badge--kind">{{ kindText }}</span>
						<span v-if="stateText" class="tv-badge tv-badge--state">{{ stateText }}</span>
					</div>
					<p class="tv-slug">{{ node.id }}</p>
					<p v-if="summary" class="tv-lede">{{ summary }}</p>

					<div class="tv-badges" style="margin-top: 12px">
						<span v-for="game in games" :key="`game-${game}`" class="tv-badge tv-badge--game" :title="`支持的 Minecraft 版本：${game}`">
							MC {{ game }}
						</span>
						<a
							v-for="tag in tags"
							:key="`tag-${tag}`"
							class="tv-badge"
							:href="tagUrl(tag)"
							:style="tagStyle(tag)"
							:aria-label="`查看标签 ${tag}`"
							@click="onLink($event)"
						>{{ tag }}</a>
					</div>

					<div v-if="primaryActions.length" class="tv-state-actions" style="justify-content: flex-start; margin-top: 16px">
						<a
							v-for="action in primaryActions"
							:key="action.href"
							class="tv-btn"
							:href="action.href"
							@click="onLink($event)"
						>{{ action.label }}</a>
					</div>
				</div>
			</header>

			<div class="tv-detail-grid">
				<div class="tv-col">
					<section class="tv-panel" aria-labelledby="tavern-node-body">
						<h2 id="tavern-node-body">条目正文</h2>
						<p>
							酒馆后端目前为这个条目保存的是结构化元数据（标题、简介、标签、游戏版本、关系边）与它的发布修订号
							<code>{{ node.publishedRevisionId || "—" }}</code>；正文（README / 使用文档）还没有同步进来看板。
						</p>
						<p>
							本期看板是<strong>只读视图</strong>：不提供登录、编辑或投稿入口。等后端的文档同步与静态兜底快照就绪后，
							这里会直接渲染条目正文。
						</p>
						<p v-if="node.repo" class="tv-muted">
							仓库坐标：<code>{{ node.repo }}</code>
						</p>
					</section>

					<!-- 阶段条与事件流（ADR-010 / ADR-009）：数据缺失时两个组件各自整块不渲染 -->
					<StageStrip :node="node" />

					<EventFeed :node-id="node.id" :initial-events="initialEvents" />

					<section class="tv-panel" aria-labelledby="tavern-node-rel">
						<h2 id="tavern-node-rel">关系</h2>
						<div v-if="relationGroups.length" class="tv-rel-groups">
							<div v-for="group in relationGroups" :key="group.key" class="tv-rel-group">
								<h3>
									{{ group.label }}
									<span class="tv-rel-count">{{ group.items.length }} 个</span>
								</h3>
								<ul class="tv-rel-list">
									<li v-for="item in group.items" :key="`${group.key}-${item.id}`" class="tv-rel-item">
										<img v-if="item.avatar" :src="item.avatar" alt="" loading="lazy" />
										<a :href="item.href" :aria-label="`查看 ${item.title}`" @click="onLink($event)">{{ item.title }}</a>
										<span v-if="item.note" class="tv-rel-role">{{ item.note }}</span>
									</li>
								</ul>
							</div>
						</div>
						<p v-else class="tv-muted">这条目在酒馆后端暂时没有关联关系。</p>
					</section>
				</div>

				<div class="tv-col">
					<section class="tv-panel" aria-labelledby="tavern-node-info">
						<h2 id="tavern-node-info">条目信息</h2>
						<dl class="tv-kv">
							<div><dt>类型</dt><dd>{{ kindText }}</dd></div>
							<div><dt>id</dt><dd><code>{{ node.id }}</code></dd></div>
							<div v-if="stateText"><dt>状态</dt><dd>{{ stateText }}</dd></div>
							<!-- 当前阶段是集合：并列时用 · 串起来，空集合也是一个正常状态（两段之间的空档） -->
							<div v-if="phases.length"><dt>当前阶段</dt><dd>{{ phases.join(" · ") }}</dd></div>
							<div v-else-if="stageCount"><dt>当前阶段</dt><dd>无进行中的阶段</dd></div>
							<div v-if="stageCount"><dt>阶段</dt><dd>{{ stageCount }} 段</dd></div>
							<div v-if="games.length"><dt>游戏版本</dt><dd>{{ games.join("、") }}</dd></div>
							<div v-if="node.repo"><dt>仓库</dt><dd>{{ node.repo }}</dd></div>
							<div v-if="updated"><dt>最近更新</dt><dd>{{ updated }}</dd></div>
						</dl>
					</section>

					<section v-if="links.length" class="tv-panel" aria-labelledby="tavern-node-links">
						<h2 id="tavern-node-links">相关链接</h2>
						<ul class="tv-links">
							<li v-for="link in links" :key="link.url">
								<a :href="linkHref(link)" :target="isExternal(link.url) ? '_blank' : undefined" :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined">
									{{ link.label || link.url }}
								</a>
							</li>
						</ul>
					</section>

					<section v-if="repoUrl" class="tv-panel">
						<h2>仓库</h2>
						<ul class="tv-links">
							<li><a :href="repoUrl" target="_blank" rel="noopener noreferrer">{{ node.repo }}</a></li>
						</ul>
					</section>

					<section class="tv-panel">
						<h2>原始数据</h2>
						<p class="tv-muted">看板的所有数据都来自酒馆后端的公开只读接口。</p>
						<ul class="tv-links">
							<li><a :href="rawUrl" target="_blank" rel="noopener noreferrer">GET /v1/nodes/{{ node.id }}</a></li>
						</ul>
					</section>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";

import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import StageStrip from "./StageStrip.vue";
import EventFeed from "./EventFeed.vue";
import "./tavern.css";

import { stringToBadgeColors } from "../../scripts/badgeColor";
import {
	API_BASE,
	allHref,
	assetHref,
	authorHref,
	fetchNode,
	fetchNodeIndex,
	formatDate,
	kindLabel,
	kindOf,
	nodeAvatar,
	nodeCurrentPhases,
	nodeGames,
	nodeLinks,
	nodeStages,
	nodeSummary,
	nodeState,
	nodeTags,
	nodeTitle,
	slugOf,
	stateLabel,
	tagHref,
	withSiteBase,
} from "./api.mjs";
import { navigateWithinPage, onQueryChange, readParam } from "./query.mjs";

const { isDark } = useData();

const node = ref(null);
const initialEvents = ref([]);
const nodeIndex = ref(new Map());
const loading = ref(true);
const error = ref("");
const thumbFailed = ref(false);
const currentId = ref("");
let restoreTitle = "";

const allUrl = computed(() => allHref());
const title = computed(() => nodeTitle(node.value));
const summary = computed(() => nodeSummary(node.value));
const tags = computed(() => nodeTags(node.value));
const games = computed(() => nodeGames(node.value));
const links = computed(() => nodeLinks(node.value));
const kindText = computed(() => kindLabel(node.value && node.value.kind));
const stateText = computed(() => stateLabel(nodeState(node.value)));
const updated = computed(() => formatDate(node.value && node.value.updatedAt));
/** 当前阶段是**集合**（ADR-010）：0..N 段并列，可能为空。 */
const phases = computed(() => nodeCurrentPhases(node.value));
const stageCount = computed(() => nodeStages(node.value).length);
const initials = computed(() => String(title.value).trim().slice(0, 2).toUpperCase());
const thumb = computed(() => (thumbFailed.value ? "" : assetHref(nodeAvatar(node.value))));
const repoUrl = computed(() => (node.value && node.value.repo ? `https://github.com/${node.value.repo}` : ""));
const rawUrl = computed(() => (node.value ? `${API_BASE}/v1/nodes/${encodeURIComponent(node.value.id)}` : ""));

const crumbs = computed(() => [
	{ label: "全部条目", href: allHref() },
	{ label: title.value || "条目详情" },
]);

const primaryActions = computed(() => {
	const kind = kindOf(node.value);
	if (kind === "person") return [{ label: "查看 TA 的作者页 →", href: authorHref(node.value.id) }];
	if (kind === "tag") return [{ label: "查看这个标签的成员 →", href: tagHref(node.value.id) }];
	return [];
});

/** 入边（别人 → 我）：维护者 / 署名作者；出边（我 → 别人）：我维护的 / 我署名的。 */
function relationLabel(rel, direction) {
	const table = {
		maintains: direction === "in" ? "维护者" : "TA 维护的项目",
		authored: direction === "in" ? "署名作者" : "TA 署名的项目",
		member: direction === "in" ? "成员" : "所属",
		tagged: direction === "in" ? "被打上该标签" : "标签",
	};
	return table[rel] || `${rel}（${direction === "in" ? "入边" : "出边"}）`;
}

function resolve(id) {
	const found = nodeIndex.value.get(id);
	if (found) {
		return {
			id,
			title: nodeTitle(found),
			avatar: assetHref(nodeAvatar(found)),
			kind: kindOf(found),
		};
	}
	return { id, title: slugOf(id), avatar: "", kind: kindOf(id) };
}

function hrefFor(resolved) {
	if (resolved.kind === "person") return authorHref(resolved.id);
	if (resolved.kind === "tag") return tagHref(resolved.id);
	return withSiteBase(`/tavern/p?id=${encodeURIComponent(resolved.id)}`);
}

function buildGroups(edges, direction) {
	if (!Array.isArray(edges) || !edges.length) return [];
	const grouped = new Map();
	for (const edge of edges) {
		const rel = edge.rel || "related";
		const id = direction === "in" ? edge.from : edge.to;
		if (!id) continue;
		if (!grouped.has(rel)) grouped.set(rel, []);
		const resolved = resolve(id);
		const note = edge.role || edge.char || edge.note || "";
		grouped.get(rel).push({ ...resolved, href: hrefFor(resolved), note });
	}
	return [...grouped.entries()].map(([rel, items]) => ({
		key: `${direction}-${rel}`,
		label: relationLabel(rel, direction),
		items,
	}));
}

const relationGroups = computed(() => {
	const current = node.value;
	if (!current) return [];
	// 出边 + 入边，同一 rel 下按方向分组展示
	return [...buildGroups(current.incoming, "in"), ...buildGroups(current.edges, "out")];
});

function tagUrl(tag) {
	const found = nodeIndex.value.get(`tag:${String(tag).trim().toLowerCase()}`);
	return tagHref(found ? found.id : `tag:${String(tag).trim().toLowerCase()}`);
}

function tagStyle(tag) {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(String(tag), surface);
	return { background: colors.background, border: `1px solid ${colors.border}`, color: colors.text };
}

function isExternal(url) {
	return /^https?:\/\//i.test(String(url || ""));
}

function linkHref(link) {
	const url = String(link.url || "");
	if (/^https?:\/\//i.test(url)) return url;
	// 站内链接（例如 /wheel/resources/xxx.html）补上站点 base
	return withSiteBase(url);
}

function onLink(event) {
	navigateWithinPage(event, event.currentTarget.getAttribute("href"));
}

async function loadFromUrl() {
	const id = readParam("id").trim();
	currentId.value = id;
	thumbFailed.value = false;
	if (!id) {
		node.value = null;
		loading.value = false;
		error.value = "";
		return;
	}
	loading.value = true;
	error.value = "";
	try {
		const detail = await fetchNode(id);
		node.value = detail.node;
		initialEvents.value = detail.events || [];
		if (typeof document !== "undefined") document.title = `${nodeTitle(detail.node)} | 酒馆看板`;
	} catch (caught) {
		node.value = null;
		initialEvents.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 条目详情加载失败", caught);
	} finally {
		loading.value = false;
	}
	if (!nodeIndex.value.size) {
		// 关系边里只有 id，用全量索引翻译成标题（失败时退化为显示 id，不阻塞主体信息）
		void fetchNodeIndex().then((index) => {
			if (currentId.value === id) nodeIndex.value = index;
		});
	}
}

let stopQueryWatch = null;

onMounted(() => {
	restoreTitle = document.title;
	stopQueryWatch = onQueryChange(() => {
		void loadFromUrl();
	});
	void fetchNodeIndex().then((index) => { nodeIndex.value = index; });
	void loadFromUrl();
});

onBeforeUnmount(() => {
	if (stopQueryWatch) stopQueryWatch();
	if (restoreTitle) document.title = restoreTitle;
});
</script>
