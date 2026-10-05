<template>
	<li class="tv-card" :data-kind="node.kind">
		<div class="tv-card-head">
			<div class="tv-card-thumb" aria-hidden="true">
				<img v-if="thumb" :src="thumb" alt="" loading="lazy" @error="thumbFailed = true" />
				<span v-else class="tv-thumb-placeholder" :style="thumbStyle">{{ initials }}</span>
			</div>
			<div class="tv-card-titlewrap">
				<h3 class="tv-card-title">
					<a
						:href="detailUrl"
						:title="title"
						:aria-label="`查看 ${title} 的详情`"
						@click="onNavigate"
					>{{ title }}</a>
				</h3>
				<p class="tv-card-slug">{{ node.id }}</p>
			</div>
		</div>

		<p v-if="summary" class="tv-card-summary">{{ summary }}</p>

		<div class="tv-badges">
			<span v-if="showKind" class="tv-badge tv-badge--kind">{{ kindText }}</span>
			<span v-if="stateText" class="tv-badge tv-badge--state">{{ stateText }}</span>
			<span v-for="game in games" :key="`game-${game}`" class="tv-badge tv-badge--game" :title="`支持的 Minecraft 版本：${game}`">{{ game }}</span>
			<a
				v-for="tag in tags"
				:key="`tag-${tag}`"
				class="tv-badge"
				:href="tagUrl(tag)"
				:style="tagStyle(tag)"
				:aria-label="`查看标签 ${tag}`"
				@click="onNavigate"
			>{{ tag }}</a>
		</div>

		<div class="tv-card-foot">
			<span>{{ footerText }}</span>
			<a :href="detailUrl" :aria-label="`打开 ${title}`" @click="onNavigate">查看详情 →</a>
		</div>
	</li>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";

import { stringToBadgeColors } from "../../scripts/badgeColor";
import {
	assetHref,
	formatDate,
	kindLabel,
	linkForNode,
	nodeAvatar,
	nodeGames,
	nodeSummary,
	nodeState,
	nodeTags,
	nodeTitle,
	slugOf,
	stateLabel,
	tagHref,
} from "./api.mjs";
import { navigateWithinPage } from "./query.mjs";

const props = defineProps({
	node: { type: Object, required: true },
	showKind: { type: Boolean, default: true },
	/** 覆盖底部的说明文字（例如标签页里显示角色） */
	footerOverride: { type: String, default: "" },
	/** 标签标题 → 标签 id 的映射（看板从 /v1/tags 拿到后传下来，缺省时按 id 约定推导） */
	tagIds: { type: Object, default: () => ({}) },
});

const { isDark } = useData();
const thumbFailed = ref(false);

const title = computed(() => nodeTitle(props.node));
const summary = computed(() => nodeSummary(props.node));
const tags = computed(() => nodeTags(props.node));
const games = computed(() => nodeGames(props.node));
const kindText = computed(() => kindLabel(props.node.kind));
const stateText = computed(() => stateLabel(nodeState(props.node)));
const detailUrl = computed(() => linkForNode(props.node));
const initials = computed(() => String(title.value).trim().slice(0, 2).toUpperCase());

/** 无封面时的彩色首字占位（与主页卡片、前置馆占位图同一套派生色）。 */
const thumbStyle = computed(() => {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(title.value, surface);
	return {
		background: `linear-gradient(135deg, ${colors.background}, ${colors.border})`,
		color: colors.text,
	};
});
const thumb = computed(() => (thumbFailed.value ? "" : assetHref(nodeAvatar(props.node))));

const footerText = computed(() => {
	if (props.footerOverride) return props.footerOverride;
	const updated = formatDate(props.node.updatedAt);
	if (props.node.repo) return updated ? `${props.node.repo} · ${updated}` : props.node.repo;
	if (props.node.tags && props.node.tags.length && props.node.kind === "tag") return "标签";
	return updated ? `更新于 ${updated}` : slugOf(props.node.id);
});

watch(() => props.node && props.node.id, () => {
	thumbFailed.value = false;
});

function tagUrl(tag) {
	// 标签页按 tag id 打开；有 /v1/tags 的映射就用精确 id，否则按后端约定 tag:<小写标题> 推导
	const mapped = props.tagIds && props.tagIds[tag];
	return tagHref(mapped || `tag:${String(tag).trim().toLowerCase()}`);
}

function tagStyle(tag) {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(String(tag), surface);
	return { background: colors.background, border: `1px solid ${colors.border}`, color: colors.text };
}

function onNavigate(event) {
	navigateWithinPage(event, event.currentTarget.getAttribute("href"));
}
</script>
