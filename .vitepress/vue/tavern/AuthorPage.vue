<template>
	<div class="tv-page">
		<TavernNav :crumbs="[{ label: '全部条目', href: allUrl }, { label: displayName || '作者' }]" />

		<StateBlock
			:loading="loading"
			:error="error"
			:empty="!loading && !error && !currentId"
			loading-text="正在读取作者信息…"
			error-title="读取作者失败"
			empty-title="没有指定要看的作者"
			empty-text="地址里缺少 id 参数，例如 /tavern/a?id=person:Alumopper。"
			@retry="loadFromUrl"
		>
			<template #actions>
				<a class="tv-btn" :href="allUrl">去全部条目里找</a>
			</template>
		</StateBlock>

		<template v-if="currentId && !loading && !error">
			<header class="tv-detail-hero">
				<div class="tv-hero-thumb">
					<img v-if="avatar" :src="avatar" :alt="`${displayName} 的头像`" @error="avatarFailed = true" />
					<span v-else class="tv-thumb-placeholder" :style="thumbStyle" aria-hidden="true">{{ initials }}</span>
				</div>
				<div class="tv-hero-body">
					<div class="tv-title-row">
						<h1>{{ displayName }}</h1>
						<span class="tv-badge tv-badge--kind">作者</span>
						<span v-if="stateText" class="tv-badge tv-badge--state">{{ stateText }}</span>
					</div>
					<p class="tv-slug">{{ currentId }}</p>
					<p class="tv-lede">
						在酒馆后端维护 <strong>{{ maintained.length }}</strong> 个条目，署名 <strong>{{ authored.length }}</strong> 个条目<template v-if="members.length">，另有 <strong>{{ members.length }}</strong> 个成员关系</template>。
					</p>
					<div v-if="socialLinks.length" class="tv-state-actions" style="justify-content: flex-start; margin-top: 14px">
						<a
							v-for="link in socialLinks"
							:key="link.url"
							class="tv-btn"
							:href="link.url"
							target="_blank"
							rel="noopener noreferrer"
						>{{ link.name || link.url }}</a>
					</div>
				</div>
			</header>

			<section v-if="maintained.length" class="tv-panel" style="margin-top: 22px">
				<h2 class="tv-section-title">TA 维护的条目（{{ maintained.length }}）</h2>
				<ul class="tv-grid">
					<NodeCard
						v-for="entry in maintained"
						:key="`maintained-${entry.id}`"
						:node="nodeFor(entry)"
						:footer-override="`维护角色：${roleLabel(entry.role)}`"
					/>
				</ul>
			</section>

			<section v-if="authored.length" class="tv-panel" style="margin-top: 18px">
				<h2 class="tv-section-title">TA 署名的条目（{{ authored.length }}）</h2>
				<ul class="tv-grid">
					<NodeCard
						v-for="entry in authored"
						:key="`authored-${entry.id}`"
						:node="nodeFor(entry)"
						:footer-override="`署名：${entry.char || '作者'}`"
					/>
				</ul>
			</section>

			<section v-if="members.length" class="tv-panel" style="margin-top: 18px">
				<h2 class="tv-section-title">成员关系（{{ members.length }}）</h2>
				<ul class="tv-rel-list">
					<li v-for="member in members" :key="`member-${member.id || member.name}`" class="tv-rel-item">
						<a :href="memberHref(member)" @click="onLink($event)">{{ member.title || member.name || member.id }}</a>
						<span v-if="member.role || member.char" class="tv-rel-role">{{ member.role || member.char }}</span>
					</li>
				</ul>
			</section>

			<section v-if="!maintained.length && !authored.length" class="tv-panel" style="margin-top: 22px">
				<h2 class="tv-section-title">还没有关联条目</h2>
				<p class="tv-muted">酒馆后端里这个作者暂时没有 maintains / authored 边。</p>
			</section>

			<section class="tv-panel" style="margin-top: 18px">
				<h2 class="tv-section-title">原始数据</h2>
				<ul class="tv-links">
					<li><a :href="rawUrl" target="_blank" rel="noopener noreferrer">GET /v1/authors/{{ currentId }}</a></li>
					<li><a :href="nodePageUrl" @click="onLink($event)">以条目形式查看（含关系边）</a></li>
				</ul>
			</section>
		</template>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";

import { stringToBadgeColors } from "../../scripts/badgeColor";
import NodeCard from "./NodeCard.vue";
import StateBlock from "./StateBlock.vue";
import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import {
	API_BASE,
	allHref,
	assetHref,
	fetchAuthor,
	fetchNodeIndex,
	kindOf,
	nameOfAuthor,
	nodeAvatar,
	nodeState,
	stateLabel,
	withSiteBase,
} from "./api.mjs";
import { navigateWithinPage, onQueryChange, readParam } from "./query.mjs";

const author = ref(null);
const maintained = ref([]);
const authored = ref([]);
const members = ref([]);
const nodeIndex = ref(new Map());
const currentId = ref("");
const loading = ref(true);
const error = ref("");
const avatarFailed = ref(false);
let restoreTitle = "";

const ROLE_LABELS = { owner: "所有者", maintainer: "维护者", contributor: "贡献者", member: "成员" };

const allUrl = computed(() => allHref());
const displayName = computed(() => nameOfAuthor(author.value) || currentId.value.replace(/^person:/, ""));
const initials = computed(() => String(displayName.value).trim().slice(0, 2).toUpperCase());

const { isDark } = useData();

/** 没有头像时的彩色首字占位（与卡片缩略图同一套派生色）。 */
const thumbStyle = computed(() => {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(displayName.value, surface);
	return {
		background: `linear-gradient(135deg, ${colors.background}, ${colors.border})`,
		color: colors.text,
	};
});
const avatar = computed(() => (avatarFailed.value ? "" : assetHref(nodeAvatar(author.value))));
const stateText = computed(() => stateLabel(nodeState(author.value)));
const socialLinks = computed(() => {
	const links = author.value && Array.isArray(author.value.socialLinks) ? author.value.socialLinks : [];
	return links.filter((link) => link && link.url);
});
const rawUrl = computed(() => (currentId.value ? `${API_BASE}/v1/authors/${encodeURIComponent(currentId.value)}` : ""));
const nodePageUrl = computed(() => withSiteBase(`/tavern/p?id=${encodeURIComponent(currentId.value)}`));

/** 作者接口只给 id/标题，用全量条目索引补齐标签、版本、简介；索引缺失时降级为最小条目。 */
function nodeFor(entry) {
	const found = nodeIndex.value.get(entry.id);
	if (found) return found;
	return {
		id: entry.id,
		kind: kindOf(entry.id),
		i18n: { zh: { title: entry.title || entry.id } },
		tags: [],
		facets: {},
	};
}

function roleLabel(role) {
	if (!role) return "维护者";
	return ROLE_LABELS[role] || role;
}

function memberHref(member) {
	const id = member.id || "";
	return withSiteBase(`/tavern/p?id=${encodeURIComponent(id)}`);
}

function onLink(event) {
	navigateWithinPage(event, event.currentTarget.getAttribute("href"));
}

async function loadFromUrl() {
	const id = readParam("id").trim();
	currentId.value = id;
	avatarFailed.value = false;
	if (!id) {
		author.value = null;
		loading.value = false;
		error.value = "";
		return;
	}
	loading.value = true;
	error.value = "";
	try {
		const data = await fetchAuthor(id);
		author.value = data.author;
		maintained.value = data.maintained;
		authored.value = data.authored;
		members.value = data.members;
		if (typeof document !== "undefined") document.title = `${displayName.value} · 作者 | 酒馆看板`;
	} catch (caught) {
		author.value = null;
		maintained.value = [];
		authored.value = [];
		members.value = [];
		error.value = caught && caught.message ? caught.message : String(caught);
		console.warn("[tavern] 作者信息加载失败", caught);
	} finally {
		loading.value = false;
	}
}

let stopQueryWatch = null;

onMounted(() => {
	restoreTitle = document.title;
	stopQueryWatch = onQueryChange(() => { void loadFromUrl(); });
	void fetchNodeIndex().then((index) => { nodeIndex.value = index; });
	void loadFromUrl();
});

onBeforeUnmount(() => {
	if (stopQueryWatch) stopQueryWatch();
	if (restoreTitle) document.title = restoreTitle;
});
</script>
