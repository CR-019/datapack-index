<template>
	<!--
		赛事 banner：主页上唯一"整行"的条目。
		为什么给整行、给封面、给阶段条 —— 赛事是主页上唯一**有时间窗、会过期**的东西，
		卡片网格会把它的紧迫感抹平（和 58 个作品长得一样）。版面本身就在说「这件事有时限」。
	-->
	<article class="tv-ev" :class="[`is-${phase}`, { 'is-open': openKey }]">
		<div class="tv-ev-cover" :style="coverStyle">
			<span class="tv-ev-kind">{{ year }} · 赛事</span>
			<span class="tv-ev-mark" aria-hidden="true">{{ initials }}</span>
			<img v-if="cover && !coverFailed" class="tv-ev-img" :src="cover" alt="" loading="lazy" @error="coverFailed = true" />
		</div>

		<div class="tv-ev-main">
			<div class="tv-ev-top">
				<h3 class="tv-ev-title"><a :href="detailUrl">{{ title }}</a></h3>
				<span class="tv-badge" :class="phaseBadgeClass">{{ phaseText }}</span>
				<span v-if="countdown" class="tv-ev-countdown">{{ countdown }}</span>
			</div>

			<p v-if="summary" class="tv-ev-summary">{{ summary }}</p>

			<p class="tv-ev-meta">
				<span v-if="windowText">{{ windowText }}</span>
				<span v-if="deadlineText">截稿 {{ deadlineText }}</span>
				<span v-if="hostText">主办：{{ hostText }}</span>
			</p>

			<!-- 阶段条：与站点其它地方的「阶段」是同一份几何（chart.mjs） -->
			<div v-if="stages.length" class="tv-ev-stage">
				<p class="tv-ev-stagehead">
					<span class="tv-muted">阶段</span>
					<span v-for="phaseName in currentPhases" :key="phaseName" class="tv-badge tv-badge--phase">{{ phaseName }}</span>
					<span v-if="!currentPhases.length" class="tv-badge tv-badge--dim">当前没有进行中的阶段（处在两段之间的空档里）</span>
					<span class="tv-muted">共 {{ stages.length }} 段{{ currentPhases.length > 1 ? `，其中 ${currentPhases.length} 段并列` : "" }}</span>
				</p>

				<div class="tv-stage-chart tv-ev-chart">
					<div class="tv-stage-lanes" :style="{ height: `${laneCount * 34}px` }">
						<button
							v-for="band in bands"
							:key="band.key"
							type="button"
							class="tv-stage-block"
							:class="[`is-${band.phase || 'unknown'}`, { 'is-open': openKey === band.key }]"
							:style="{ left: `${band.left}%`, width: `${band.width}%`, top: `${band.lane * 34}px` }"
							:title="band.tooltip"
							:aria-expanded="openKey === band.key ? 'true' : 'false'"
							@click="toggle(band.key)"
						>
							<span class="tv-stage-block-name">{{ band.name }}</span>
							<span class="tv-stage-block-range">{{ band.rangeText }}</span>
						</button>
						<div v-if="nowLeft != null" class="tv-nowline" :style="{ left: `${nowLeft}%` }" aria-hidden="true">
							<span class="tv-nowline-label">今天</span>
						</div>
					</div>
					<div class="tv-chart-ticks">
						<span style="left: 0">{{ rangeStart }}</span>
						<span style="left: 100%">{{ rangeEnd }}</span>
					</div>
				</div>

				<div v-if="openedBand" class="tv-stage-detail">
					<p>
						<strong>{{ openedBand.name }}</strong>
						· {{ stagePhaseText(openedBand.phase) }}
						· {{ openedBand.rangeText }}（{{ openedBand.spanText }}）
					</p>
					<p>{{ openedBand.stage.summary || "（这一段没有写说明）" }}</p>
					<p v-if="openedBand.recruit.length" class="tv-muted">
						这段自己的招募：{{ openedBand.recruit.map((role) => `${role.role}${roleCount(role)}`).join("、") }}
					</p>
				</div>
			</div>

			<!-- 没有阶段：当前相位靠时间窗派生，也要说清是哪来的 -->
			<p v-else class="tv-ev-derived">
				还没有划分阶段。当前相位由时间窗派生：<strong>{{ currentPhases.join(" · ") || "无" }}</strong>
				<template v-if="deadlineText">（报名截止 {{ deadlineText }}）</template>
				—— 赛事刚发布就能有一个说得通的「当前阶段」，不必等维护者补阶段。
			</p>

			<!-- 参赛作品墙 -->
			<div class="tv-ev-works">
				<p class="tv-ev-workshead">
					<span class="tv-muted">参赛作品</span>
					<span v-if="works.length" class="tv-muted">{{ works.length }} 件</span>
				</p>
				<div v-if="works.length" class="tv-works-row">
					<a v-for="work in works" :key="work.id" class="tv-work" :href="work.url">
						<span class="tv-work-ini" aria-hidden="true">{{ initialsOf(work.title) }}</span>
						<span class="tv-work-text">
							<span class="tv-work-title">{{ work.title }}</span>
							<span class="tv-work-by">{{ work.by || work.id }}<template v-if="work.char"> · {{ work.char }}</template></span>
						</span>
					</a>
				</div>
				<p v-else-if="worksLoaded" class="tv-muted">还没有作品。</p>
				<p v-else class="tv-muted">作品列表暂时取不到（详情接口没回应），这不代表赛事没有作品。</p>
			</div>

			<div class="tv-ev-foot">
				<span class="tv-ev-roles">
					队友：
					<template v-if="recruitRoles.length">
						<span
							v-for="role in recruitRoles"
							:key="role.role"
							class="tv-badge"
							:class="role.status === 'open' ? 'tv-badge--open' : 'tv-badge--dim'"
						>{{ role.role }}{{ roleCount(role) }} · {{ recruitStatusLabel(role.status) }}</span>
					</template>
					<span v-else class="tv-muted">没有在招的队友</span>
				</span>

				<span v-if="feed.length" class="tv-ev-feed">
					<span v-for="entry in feed" :key="`${entry.at}-${entry.title}`">
						<i>{{ shortDate(entry.at) }}</i> {{ entry.title }}
					</span>
				</span>

				<a class="tv-ev-go" :href="detailUrl">进入赛事页 →</a>
			</div>
		</div>
	</article>
</template>

<script setup>
import { computed, ref } from "vue";
import { useData } from "vitepress";

import { stringToBadgeColors } from "../../scripts/badgeColor";
import { DAY, percentOf, stageBands, stageDomain } from "./chart.mjs";
import {
	assetHref,
	formatDate,
	linkForNode,
	nodeCurrentPhases,
	nodeRecruit,
	nodeStages,
	nodeSummary,
	nodeTitle,
	nodeWindow,
	recruitStatusLabel,
	stagePhaseLabel,
	windowPhaseLabel,
} from "./api.mjs";

const props = defineProps({
	/** 归一化过的赛事节点（列表接口给的字段） */
	node: { type: Object, required: true },
	/** `fetchNode` 拿到的详情（阶段、边）；缺失时退化成列表字段 */
	detail: { type: Object, default: null },
	/** 参赛作品（主页把 includes 边翻成标题后传进来） */
	works: { type: Array, default: () => [] },
	/** 详情取到了吗 —— 区分"真的没有作品"与"没取到" */
	worksLoaded: { type: Boolean, default: true },
	/** 这个赛事最近的动态（来自 /v1/timeline） */
	feed: { type: Array, default: () => [] },
	/** 已上架条目索引（id → 节点）；边指向未上架节点时用它挡掉，避免露出裸 id */
	published: { type: Map, default: null },
	/** 粗粒度相位 live / soon / past（由主页算好传进来，子组件不自己算时钟） */
	phase: { type: String, default: "live" },
	/** 本次渲染的统一"现在"（避免同一次交互里各处时钟不一致） */
	now: { type: Number, default: () => Date.now() },
});

const { isDark } = useData();
const coverFailed = ref(false);
const openKey = ref("");

const title = computed(() => nodeTitle(props.node));
const summary = computed(() => nodeSummary(props.node));
const initials = computed(() => {
	const text = title.value.replace(/[（(].*?[)）]/g, "").trim();
	if (!text) return "赛";
	return /^[\x00-\x7F]+$/.test(text) ? text.slice(0, 2).toUpperCase() : text.slice(0, 2);
});
const cover = computed(() => assetHref(props.node.cover));
/**
 * 没有封面图时用**彩色首字占位**，颜色由标题哈希出来 —— 与前置馆的
 * `ResultCard` / 本站 `NodeCard` 是同一套派生色（同一个标题永远同一个颜色，
 * 所以同一个赛事在哪儿都是那个色）。比灰色方块好看，也比它更有信息量。
 */
const coverStyle = computed(() => {
	// 文字色必须按当前主题的底色算：同一套派生色在亮色下是深色字、暗色下必须翻成浅色字，
	// 否则淡色块上的深色字在暗色模式里就糊成一团（前置馆的占位图在暗色下正是这个问题）。
	const surface = isDark && isDark.value ? "#1b1b1f" : "#ffffff";
	const colors = stringToBadgeColors(title.value, surface);
	return {
		background: `linear-gradient(135deg, ${colors.background}, ${colors.border})`,
		color: colors.text,
	};
});
const detailUrl = computed(() => linkForNode(props.node));
const year = computed(() => {
	const window = nodeWindow(props.node);
	return window && window.start != null ? new Date(window.start).getFullYear() : "";
});

/** 粗粒度相位：以时间窗为准（有阶段时 facets.phases 给的是阶段名，判不了"是不是结束了"） */
const phase = computed(() => (["live", "soon", "past"].includes(props.phase) ? props.phase : "live"));
const phaseText = computed(() => windowPhaseLabel(phase.value) || "进行中");
const phaseBadgeClass = computed(() => ({
	live: "tv-badge--live",
	soon: "tv-badge--soon",
	past: "tv-badge--dim",
}[phase.value]));

const window = computed(() => nodeWindow(props.node));
const windowText = computed(() => {
	const value = window.value;
	if (!value) return "";
	const start = value.start != null ? formatDate(value.start) : "未定";
	const end = value.end != null ? formatDate(value.end) : "未定";
	return `${start} → ${end}`;
});
const deadlineText = computed(() => (window.value && window.value.deadline != null ? formatDate(window.value.deadline) : ""));

const hostText = computed(() => {
	const detail = props.detail;
	const node = detail && detail.node ? detail.node : props.node;
	const incoming = Array.isArray(node.incoming) ? node.incoming : [];
	// 主办方 = 维护者（maintains 是权力），没有才退到署名（authored 是荣誉）。
	// 只认已上架节点：边可以指向未上架的主体，那种情况下宁可不写，也不显示裸 id。
	const [first] = incoming.filter((edge) => edge
		&& (edge.rel === "maintains" || edge.rel === "authored")
		&& (!props.published || props.published.has(edge.from)));
	if (!first) return "";
	if (!props.published) return first.from;          // 没传索引（理论上不会）→ 保持旧行为
	const host = props.published.get(first.from);
	return host ? nodeTitle(host) : "";
});

/** 倒计时：优先给可行动的那个日期（报名/投稿截止 → 赛事结束）。 */
const countdown = computed(() => {
	const value = window.value;
	if (!value) return "";
	const now = props.now;
	if (phase.value === "soon" && value.start != null) {
		return `距开始 ${Math.max(0, Math.ceil((value.start - now) / DAY))} 天`;
	}
	if (phase.value !== "live") return "";
	if (value.deadline != null && now <= value.deadline) {
		return `距报名/投稿截止 ${Math.max(0, Math.ceil((value.deadline - now) / DAY))} 天`;
	}
	if (value.end != null) return `距结束 ${Math.max(0, Math.ceil((value.end - now) / DAY))} 天`;
	return "";
});

/* --------------------------------------------------------------- 阶段条 */

const stages = computed(() => (props.detail ? props.detail.stages : nodeStages(props.node)));
const bands = computed(() => stageBands(stages.value, { now: props.now }));
const laneCount = computed(() => bands.value.reduce((max, band) => Math.max(max, band.laneCount), 1));
const domain = computed(() => stageDomain(stages.value, props.now));
const nowLeft = computed(() => (domain.value ? percentOf(props.now, domain.value) : null));
const rangeStart = computed(() => (domain.value ? formatDate(domain.value.min) : ""));
const rangeEnd = computed(() => (domain.value ? formatDate(domain.value.max) : ""));
const openedBand = computed(() => bands.value.find((band) => band.key === openKey.value) || null);

/** 当前阶段：以 `facets.phases` 为准（后端推导好、可并列、可为空）。 */
const currentPhases = computed(() => {
	const declared = nodeCurrentPhases(props.node, props.now);
	if (declared.length) return declared;
	// 没有阶段（或正处在空档）时，退化成"按时间窗派生的赛事相位"，
	// 与后端 eventPhasesOf() 同规则 —— 别让 banner 上出现一句空话。
	const value = window.value;
	if (!value || value.start == null || value.end == null) return [];
	if (props.now < value.start) return ["筹备中"];
	if (props.now > value.end) return ["已结束"];
	if (value.deadline != null && props.now <= value.deadline) return ["报名中"];
	return ["进行中"];
});

function toggle(key) {
	openKey.value = openKey.value === key ? "" : key;
}

function stagePhaseText(value) {
	return stagePhaseLabel(value) || "时间未定";
}

/* --------------------------------------------------------------- 其它 */

const recruitRoles = computed(() => nodeRecruit(props.node));

function roleCount(role) {
	return role && role.headcount ? ` ×${role.headcount}` : "";
}

function shortDate(value) {
	const formatted = formatDate(value);
	return formatted ? formatted.slice(5) : "";
}

function initialsOf(text) {
	const value = String(text || "").replace(/[（(].*?[)）]/g, "").trim();
	if (!value) return "作";
	return /^[\x00-\x7F]+$/.test(value) ? value.slice(0, 2).toUpperCase() : value.slice(0, 2);
}
</script>
