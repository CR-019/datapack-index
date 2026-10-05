<template>
	<!--
		作品卡片：主页「正在招队友」与「正在做的作品」两块共用。
		同一张卡片、两种重心：
		  · mode="recruit" → 队友行是主角（谁在找什么样的人）；
		  · mode="doing"   → 阶段条与最近动态是主角。
		列表接口**不带阶段**（为省掉 N+1），所以阶段条要的 stages 由主页按需取详情后传进来；
		取不到就退化成"未划分"，而不是假装有阶段。
	-->
	<article class="tv-card tv-home-card" :data-kind="node.kind">
		<div class="tv-card-head">
			<div class="tv-card-thumb" aria-hidden="true">
				<img v-if="thumb" :src="thumb" alt="" loading="lazy" @error="thumbFailed = true" />
				<span v-else class="tv-thumb-placeholder" :style="thumbStyle">{{ initials }}</span>
			</div>
			<div class="tv-card-titlewrap">
				<h3 class="tv-card-title">
					<a :href="detailUrl" :title="title">{{ title }}</a>
				</h3>
				<p class="tv-card-slug">{{ node.id }}</p>
			</div>
		</div>

		<p v-if="summary" class="tv-card-summary">{{ summary }}</p>

		<!-- 招队友：只有 recruit 模式渲染 -->
		<div v-if="mode === 'recruit'" class="tv-home-roles">
			<p class="tv-home-label">想找的队友</p>
			<div v-for="role in openRoles" :key="`open-${role.role}`" class="tv-role is-open">
				<span class="tv-role-name">{{ role.role }}</span>
				<span class="tv-badge tv-badge--open">还在招</span>
				<span class="tv-role-want">{{ wantText(role) }}</span>
				<span class="tv-role-meta">{{ deadlineText(role) }}</span>
				<span v-if="currentStageText" class="tv-role-stage">阶段：{{ currentStageText }}</span>
			</div>
			<div v-for="role in closedRoles" :key="`closed-${role.role}`" class="tv-role">
				<span class="tv-role-name">{{ role.role }}</span>
				<span class="tv-badge tv-badge--dim">{{ recruitStatusLabel(role.status) }}</span>
				<span class="tv-role-want">{{ role.headcount ? `${role.headcount} 位` : "" }}</span>
				<span class="tv-role-meta">{{ role.status === "filled" ? "人够了，谢谢" : "" }}</span>
			</div>
		</div>

		<!-- 阶段条（迷你版；几何与详情页的阶段条同源） -->
		<div class="tv-home-stage">
			<p class="tv-home-label">
				阶段：{{ stages.length ? (currentStageText || "当前处在两段之间的空档里") : "未划分" }}
			</p>
			<div v-if="bands.length" class="tv-mini" :style="{ height: `${laneCount * 28 - 4}px` }">
				<span
					v-for="band in bands"
					:key="band.key"
					class="tv-mini-block"
					:class="`is-${band.phase || 'unknown'}`"
					:style="{ left: `${band.left}%`, width: `${band.width}%`, top: `${band.lane * 28}px` }"
					:title="band.tooltip"
				>{{ band.name }}</span>
			</div>
			<div v-else class="tv-mini">
				<span class="tv-mini-block is-unknown">没有阶段记录</span>
			</div>
			<p v-if="rangeText" class="tv-muted tv-mini-range">{{ rangeText }}</p>
		</div>

		<!-- 最近动态 -->
		<div class="tv-home-feed">
			<span class="tv-home-label">最近动态</span>
			<ul v-if="feed.length">
				<li v-for="entry in feed" :key="`${entry.at}-${entry.title}`">
					<i>{{ shortDate(entry.at) }}</i>
					<span>{{ entry.title }}</span>
				</li>
			</ul>
			<span v-else class="tv-muted"> 无事件记录</span>
		</div>

		<div class="tv-badges">
			<span v-for="phase in currentPhases" :key="`phase-${phase}`" class="tv-badge tv-badge--phase">{{ phase }}</span>
			<span v-if="stateText" class="tv-badge tv-badge--state">{{ stateText }}</span>
			<span v-for="game in games" :key="`game-${game}`" class="tv-badge tv-badge--game">{{ game }}</span>
			<a
				v-for="tag in tags"
				:key="`tag-${tag}`"
				class="tv-badge"
				:href="tagUrl(tag)"
				:style="tagStyle(tag)"
			>{{ tag }}</a>
		</div>

		<div class="tv-card-foot">
			<span>{{ kindText }}<template v-if="byText"> · {{ byText }}</template></span>
			<a :href="detailUrl">查看详情 →</a>
		</div>
	</article>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";

import { stringToBadgeColors } from "../../scripts/badgeColor";
import { stageBands, stageDomain } from "./chart.mjs";
import {
	assetHref,
	closedRecruitRoles,
	formatDate,
	kindLabel,
	linkForNode,
	nodeAvatar,
	nodeCurrentPhases,
	nodeGames,
	nodeState,
	nodeStages,
	nodeSummary,
	nodeTags,
	nodeTitle,
	openRecruitRoles,
	recruitStatusLabel,
	relativeTime,
	stateLabel,
	tagHref,
} from "./api.mjs";

const props = defineProps({
	/** 归一化过的条目（列表接口字段） */
	node: { type: Object, required: true },
	/** "recruit" = 招队友重心；"doing" = 进展重心 */
	mode: { type: String, default: "doing" },
	/** `fetchNode` 的结果（阶段、边都在里面）；取不到时传 null */
	detail: { type: Object, default: null },
	/** 已上架条目索引（id → 节点）；边指向未上架节点时用它挡掉，避免露出裸 id */
	published: { type: Map, default: null },
	/** 这个条目最近的动态（来自 /v1/timeline） */
	feed: { type: Array, default: () => [] },
	/** 本次渲染的统一"现在" */
	now: { type: Number, default: () => Date.now() },
	/** 标签标题 → 标签 id（与 NodeCard 同一套约定） */
	tagIds: { type: Object, default: () => ({}) },
});

const { isDark } = useData();
const thumbFailed = ref(false);

const title = computed(() => nodeTitle(props.node));
const summary = computed(() => nodeSummary(props.node));
const detailUrl = computed(() => linkForNode(props.node));
const kindText = computed(() => kindLabel(props.node.kind));
const stateText = computed(() => stateLabel(nodeState(props.node)));
const thumb = computed(() => (thumbFailed.value ? "" : assetHref(nodeAvatar(props.node))));
const games = computed(() => nodeGames(props.node));
const tags = computed(() => nodeTags(props.node));
const initials = computed(() => String(title.value).trim().slice(0, 2).toUpperCase());

/** 无封面时的彩色首字占位：与前置馆 ResultCard 同一套派生色。 */
const thumbStyle = computed(() => {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(title.value, surface);
	return {
		background: `linear-gradient(135deg, ${colors.background}, ${colors.border})`,
		color: colors.text,
	};
});

/** 署名作者：列表接口不给边，只有取了详情才有（取不到就不写，不编造）。 */
const byText = computed(() => {
	const node = props.detail && props.detail.node ? props.detail.node : props.node;
	const incoming = Array.isArray(node.incoming) ? node.incoming : [];
	// 只认已上架节点：未上架的署名主体不显示（连裸 id 也不显示）
	const [first] = incoming.filter((edge) => edge
		&& edge.rel === "authored"
		&& (!props.published || props.published.has(edge.from)));
	if (!first) return "";
	const author = props.published ? props.published.get(first.from) : null;
	const name = author ? nodeTitle(author) : first.from;
	const [char] = incoming.filter((edge) => edge && edge.rel === "authored" && edge.char);
	return char ? `${name}（${char.char}）` : name;
});

const openRoles = computed(() => openRecruitRoles(props.node, props.now));
const closedRoles = computed(() => closedRecruitRoles(props.node));

const stages = computed(() => {
	if (props.detail && Array.isArray(props.detail.stages)) return props.detail.stages;
	return nodeStages(props.node);
});
const bands = computed(() => stageBands(stages.value, { now: props.now }));
const laneCount = computed(() => bands.value.reduce((max, band) => Math.max(max, band.laneCount), 1));
const domain = computed(() => stageDomain(stages.value, props.now));
const rangeText = computed(() => (domain.value ? `${formatDate(domain.value.min)} → ${formatDate(domain.value.max)}` : ""));
const currentPhases = computed(() => nodeCurrentPhases(props.node, props.now));
const currentStageText = computed(() => currentPhases.value.join(" · "));

watch(() => props.node && props.node.id, () => {
	thumbFailed.value = false;
});

function wantText(role) {
	const head = role.headcount ? `想找 ${role.headcount} 位` : "";
	const skills = Array.isArray(role.skills) ? role.skills.filter(Boolean) : [];
	const need = skills.length ? `要会 ${skills.join(" / ")}` : "";
	return [head, need].filter(Boolean).join(" · ");
}

function deadlineText(role) {
	if (!role.deadline) return "长期有效";
	const raw = String(role.deadline);
	const at = Date.parse(raw.length <= 10 ? `${raw}T23:59:59` : raw);
	if (!Number.isFinite(at)) return "";
	const relative = relativeTime(at, props.now);
	return `截止 ${formatDate(at)}${relative ? `（${relative}）` : ""}`;
}

function shortDate(value) {
	const formatted = formatDate(value);
	return formatted ? formatted.slice(5) : "";
}

function tagUrl(tag) {
	const mapped = props.tagIds && props.tagIds[tag];
	return tagHref(mapped || `tag:${String(tag).trim().toLowerCase()}`);
}

function tagStyle(tag) {
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(String(tag), surface);
	return { background: colors.background, border: `1px solid ${colors.border}`, color: colors.text };
}
</script>
