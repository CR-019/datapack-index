<template>
	<!--
		渲染条件（把两条要求调和成一条规则）：
		  · 后端**有阶段能力**（带 stages 键，或有必有字段 facets.phases）→ 渲染，没有阶段时给明确空态；
		  · 后端**还没上这一版**（两个都没有）→ 整块不渲染，不留空壳。
	-->
	<section v-if="supported" class="tv-panel tv-stages" aria-labelledby="tavern-stage-strip">
		<h2 id="tavern-stage-strip">阶段条</h2>

		<p v-if="stages.length" class="tv-stage-headline">
			<span class="tv-stage-headline-label">当前阶段</span>
			<template v-if="phases.length">
				<template v-for="(phase, index) in phases" :key="phase">
					<span v-if="index" class="tv-stage-headline-sep" aria-hidden="true">·</span>
					<span class="tv-badge tv-badge--phase">{{ phase }}</span>
				</template>
			</template>
			<span v-else class="tv-stage-headline-empty">
				{{ gaps.length ? "当前无进行中的阶段（正处在两段之间的空档里）" : "当前无进行中的阶段" }}
			</span>
			<span class="tv-muted tv-stage-headline-note">
				共 {{ stages.length }} 个阶段{{ phases.length > 1 ? `，其中 ${phases.length} 段并列` : "" }}
			</span>
		</p>

		<p v-else class="tv-stage-empty" role="status">
			<span class="tv-stage-empty-icon" aria-hidden="true">🗓</span>
			暂无阶段记录 —— 这个条目还没有划分时间段（阶段的窗口由维护者填写，画在这里会变成一条时间带）。
		</p>

		<div v-if="bands.length" class="tv-stage-chart">
			<p class="tv-sr-only" :id="hintId">
				阶段时间带：按时间比例横向排列，纵向不同行表示阶段在时间上并列重叠；空白处表示还没有阶段覆盖的时间。
				每一段都可以用键盘聚焦并按回车展开详情。
			</p>

			<div class="tv-stage-axis" aria-hidden="true">
				<span
					v-for="tick in ticks"
					:key="tick.key"
					class="tv-stage-tick"
					:class="[`is-${tick.kind}`, `is-align-${tick.align}`]"
					:style="{ left: `${tick.left}%` }"
				>
					<span class="tv-stage-tick-label">{{ tick.label }}</span>
				</span>
			</div>

			<div
				class="tv-stage-lanes"
				:style="{ height: `${laneCount * 34 - 4}px` }"
				role="group"
				:aria-label="chartLabel"
				:aria-describedby="hintId"
			>
				<button
					v-for="band in bands"
					:key="band.key"
					type="button"
					class="tv-stage-block"
					:class="[`is-${band.phase || 'unknown'}`, { 'is-open': isOpen(band.key) }]"
					:style="{ left: `${band.left}%`, width: `${band.width}%`, top: `${band.lane * 34}px` }"
					:title="band.tooltip"
					:aria-expanded="isOpen(band.key) ? 'true' : 'false'"
					:aria-controls="detailId(band.key)"
					@click="toggle(band.key)"
				>
					<span class="tv-stage-block-name">{{ band.name }}</span>
					<span class="tv-stage-block-range">{{ band.rangeText }}</span>
				</button>

				<span class="tv-stage-now-line" :style="{ left: `${nowLeft}%` }" aria-hidden="true" />
			</div>

			<div class="tv-stage-gaprow" aria-hidden="true">
				<span
					v-for="gap in gaps"
					:key="gap.key"
					class="tv-stage-gap"
					:style="{ left: `${gap.left}%`, width: `${gap.width}%` }"
				/>
			</div>
		</div>

		<p v-if="bands.length" class="tv-muted tv-stage-gapnote">
			<template v-if="gaps.length">
				阶段之间留有 {{ gaps.length }} 段空档（空白就是没有阶段覆盖的时间，不硬接）：
				{{ gaps.map((gap) => gap.text).join("；") }}
			</template>
			<template v-else>
				各阶段的窗口首尾相接或互相重叠，没有空档。
			</template>
		</p>

		<p v-if="stages.length && !bands.length" class="tv-muted">
			这些阶段都没有可用的时间窗，所以画不成时间带 —— 详情见下面的列表。
		</p>

		<template v-if="stages.length">
			<h3 class="tv-stage-list-title">全部阶段（按窗口起点升序）</h3>
			<ul class="tv-stage-list">
			<li
				v-for="item in entries"
				:key="item.key"
				class="tv-stage-item"
				:class="[`is-${item.phase || 'unknown'}`, { 'is-open': isOpen(item.key) }]"
			>
				<button
					type="button"
					class="tv-stage-item-head"
					:aria-expanded="isOpen(item.key) ? 'true' : 'false'"
					:aria-controls="detailId(item.key)"
					@click="toggle(item.key)"
				>
					<span class="tv-phase-badge" :class="`is-${item.phase || 'unknown'}`">{{ phaseLabel(item.phase) }}</span>
					<span class="tv-stage-item-name">{{ item.name }}</span>
					<span class="tv-stage-item-range">{{ item.rangeText }}</span>
					<span v-if="item.spanText" class="tv-stage-item-span">{{ item.spanText }}</span>
					<span class="tv-stage-item-caret" aria-hidden="true">▾</span>
				</button>

				<!-- 窄屏下时间带会隐藏，这块迷你刻度让每段的位置/长度仍然看得见 -->
				<div v-if="!item.windowMissing" class="tv-stage-mini" aria-hidden="true">
					<span class="tv-stage-mini-track" />
					<span class="tv-stage-mini-fill" :style="{ left: `${item.left}%`, width: `${item.width}%` }" />
					<span class="tv-stage-mini-now" :style="{ left: `${nowLeft}%` }" />
				</div>

				<div v-show="isOpen(item.key)" :id="detailId(item.key)" class="tv-stage-detail">
					<p v-if="item.summary">{{ item.summary }}</p>
					<p v-else class="tv-muted">这一段还没有写简介。</p>

					<p v-if="item.windowMissing" class="tv-muted">
						它没有记录时间窗（不变量 14 要求阶段必须有窗口），因此既画不到时间带上，也算不进"当前阶段"。
					</p>

					<dl v-else class="tv-kv tv-stage-kv">
						<div><dt>窗口</dt><dd>{{ item.rangeText }}</dd></div>
						<div v-if="item.spanText"><dt>时长</dt><dd>{{ item.spanText }}</dd></div>
						<div><dt>相位</dt><dd>{{ phaseLabel(item.phase) }}<template v-if="item.openEnded">（窗口没有结束时间，按"至今"画）</template></dd></div>
						<div v-if="item.stage.id"><dt>阶段 id</dt><dd><code>{{ item.stage.id }}</code></dd></div>
					</dl>

					<div v-if="item.recruit.length" class="tv-stage-recruit">
						<h4>这一段的招募</h4>
						<ul class="tv-stage-recruit-list">
							<li v-for="(recruit, index) in item.recruit" :key="`${item.key}-recruit-${index}`">
								<span class="tv-badge tv-badge--recruit" :class="`is-${recruit.status || 'open'}`">
									{{ recruitStatusLabel(recruit.status) || "招募" }}
								</span>
								<strong>{{ recruit.role || recruit.title || "岗位未写" }}</strong>
								<span v-if="skillsText(recruit)" class="tv-muted">{{ skillsText(recruit) }}</span>
								<span v-if="headcountText(recruit)" class="tv-muted">招 {{ headcountText(recruit) }}</span>
								<span v-if="recruit.deadline" class="tv-muted">截止 {{ formatDate(recruit.deadline) }}</span>
							</li>
						</ul>
					</div>
				</div>
			</li>
			</ul>
		</template>
	</section>
</template>

<script setup>
/**
 * 阶段条（ADR-010 的招牌视图）
 * =============================================================================
 * 三条硬约束直接决定实现，缺一条都会把真实场景排除掉：
 *   1. **并列可以有**（不变量 14：v2 开发与社区运营同时进行是真实需求）→ 不假设"同一时刻只有一段"，
 *      用区间图贪心着色把阶段分行：能塞进已有行就复用，塞不进就新开一行。行数 = 最大重叠深度。
 *   2. **空隙可以有**（项目中断几个月再继续）→ 所有块的 left/width 都按**同一个时间域**算百分比，
 *      没被任何阶段覆盖的时间就是空白；再额外把空隙单独标出来（虚线段 + 文字），
 *      绝不为了"好看"把相邻阶段拉长接上。
 *   3. **`facets.phases` 是集合、可为空** → 标题行按集合渲染（多个用 `·` 并列）；空集合 =
 *      "当前无进行中的阶段"，是正常状态而不是错误。
 *
 * 时间域取 `[min(阶段起点, now), max(阶段终点, now)]` —— 把"现在"包进域里，now 标记才永远画得出来
 * （项目早就收尾时，一眼看出"最后一段结束到现在有多久"）。
 *
 * 数据契约（与后端锁定的那版一致）：
 *   · 阶段来自**节点内嵌的 `node.stages`**，在线 / 离线同形；没有阶段的节点干脆没有这个键；
 *   · 顺序由后端算好（窗口起点升序、无窗口最后），前端**不重排**；
 *   · `phase` 也是后端算好的（past/current/future），"当前"高亮走 `facets.phases` 集合，
 *     不拿客户端时钟去比时间窗（假数据的时间窗是 2026 年的，时钟只会对错）；
 *   · `facets.phases` 必有、可为空数组 —— 空集合是正常状态（正处在两段之间的空档里）。
 *
 * 不用任何图表库：纯 CSS 百分比定位。窗口缺一端时按"至今"画。
 */
import { computed, ref } from "vue";

import {
	formatDate,
	formatDuration,
	nodeCurrentPhases,
	nodePhasesDeclared,
	nodeStages,
	nodeStagesDeclared,
	recruitStatusLabel,
	stagePhaseLabel,
} from "./api.mjs";

const DAY = 86_400_000;

const props = defineProps({
	node: { type: Object, default: null },
});

/** 实例创建时取一次"现在"，避免同一次交互里 now 抖动导致时间带重排。 */
const now = ref(Date.now());
const openKeys = ref([]);

const stages = computed(() => nodeStages(props.node));
// 「当前阶段」以 **facets.phases** 为准（后端推导好、必有字段，可并列、可为空）。
// 客户端时钟不可信：假数据的时间窗是 2026 年的，拿 now 比窗口只会得到错的高亮。
const phases = computed(() => nodeCurrentPhases(props.node));
/**
 * 后端有阶段能力吗？有就渲染（没有阶段时给明确空态），没有才整块不渲染（向后兼容）。
 * ⚠️ 归一化后的节点上 `stages` 一定是数组，所以不能直接看键是否存在 ——
 * 以归一化时记下的 `stagesDeclared` 为准（原始节点才回退到"看键"）。
 */
const supported = computed(() => {
	const node = props.node;
	if (!node) return false;
	const declared = typeof node.stagesDeclared === "boolean" ? node.stagesDeclared : nodeStagesDeclared(node);
	return declared || nodePhasesDeclared(node);
});

/** 有时间窗的（能画上时间带）/ 没有时间窗的（只进列表）。 */
const placed = computed(() => stages.value.filter((stage) => stage.window));

/** 阶段在列表与时间带之间的同一个身份键。 */
function stageKey(stage) {
	return stage.id || `name:${stage.name}`;
}

function percent(time, space) {
	if (!space || !space.span) return 0;
	const value = ((time - space.min) / space.span) * 100;
	return Math.max(0, Math.min(100, value));
}

/** 共享时间域：所有阶段的并集 ∪ {now}；单日窗口时撑开一天，避免除零。 */
const domain = computed(() => {
	const list = placed.value;
	if (!list.length) return null;
	let min = Infinity;
	let max = -Infinity;
	for (const stage of list) {
		const start = stage.window.start != null ? stage.window.start : stage.window.end;
		const end = stage.window.end != null ? stage.window.end : now.value;
		min = Math.min(min, start, end);
		max = Math.max(max, start, end);
	}
	min = Math.min(min, now.value);
	max = Math.max(max, now.value);
	if (max - min < DAY) {
		min -= DAY / 2;
		max += DAY / 2;
	}
	return { min, max, span: max - min };
});

const bands = computed(() => {
	const space = domain.value;
	if (!space) return [];
	const nowMs = now.value;
	const items = placed.value.map((stage) => {
		const openEnded = stage.window.end == null;
		const start = stage.window.start != null ? stage.window.start : stage.window.end;
		const end = Math.max(openEnded ? nowMs : stage.window.end, start);
		return { stage, start, end, openEnded };
	});
	// 起点升序 → 区间图贪心着色：能塞进"已经空出来的行"就复用，否则新开一行。
	// 行数就是最大重叠深度，于是并列阶段天然各占一行，首尾相接的阶段共用一行。
	items.sort((a, b) => a.start - b.start || a.end - b.end);
	const laneEnds = [];
	for (const item of items) {
		let lane = laneEnds.findIndex((value) => value <= item.start);
		if (lane === -1) {
			lane = laneEnds.length;
			laneEnds.push(item.end);
		} else {
			laneEnds[lane] = item.end;
		}
		item.lane = lane;
	}
	const laneCount = Math.max(1, laneEnds.length);
	return items.map((item) => {
		const left = percent(item.start, space);
		const right = percent(item.end, space);
		const stage = item.stage;
		const rangeText = item.openEnded
			? `${formatDate(item.start)} → 至今`
			: `${formatDate(item.start)} → ${formatDate(item.end)}`;
		return {
			key: stageKey(stage),
			stage,
			name: stage.name,
			phase: stage.phase,
			lane: item.lane,
			left,
			width: Math.max(right - left, 0.8),
			rangeText,
			spanText: formatDuration(item.end - item.start),
			start: item.start,
			end: item.end,
			openEnded: item.openEnded,
			laneCount,
			tooltip: `${stage.name}｜${stagePhaseLabel(stage.phase) || "相位未知"}｜${rangeText}`,
		};
	});
});

const laneCount = computed(() => bands.value.reduce((max, band) => Math.max(max, band.laneCount), 1));
const nowLeft = computed(() => {
	const space = domain.value;
	return space ? Math.max(0, Math.min(100, percent(now.value, space))) : 0;
});

/** 空隙：把阶段区间并起来后的补集（只算阶段之间真正的洞，两端不算）。 */
const gaps = computed(() => {
	const space = domain.value;
	if (!space) return [];
	const merged = [];
	for (const span of [...bands.value].sort((a, b) => a.start - b.start)) {
		const last = merged[merged.length - 1];
		if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
		else merged.push({ start: span.start, end: span.end });
	}
	const result = [];
	for (let index = 0; index < merged.length - 1; index += 1) {
		const start = merged[index].end;
		const end = merged[index + 1].start;
		if (end - start < DAY) continue; // 首尾相接（甚至同一天）不当作空档
		result.push({
			key: `${Math.round(start / DAY)}-${Math.round(end / DAY)}`,
			left: percent(start, space),
			width: Math.max(percent(end, space) - percent(start, space), 0.4),
			text: `${formatDate(start)} → ${formatDate(end)}（${formatDuration(end - start)}）`,
		});
	}
	return result;
});

/** 刻度：各阶段窗口边界 + "现在"；同一天只留一个，"现在"优先。 */
const ticks = computed(() => {
	const space = domain.value;
	if (!space) return [];
	const times = [];
	const seen = new Set();
	const push = (time, isNow) => {
		const key = Math.round(time / DAY);
		if (seen.has(key)) return;
		seen.add(key);
		times.push({ time, isNow });
	};
	push(now.value, true);
	for (const band of bands.value) {
		push(band.start, false);
		push(band.end, false);
	}
	times.sort((a, b) => a.time - b.time);
	const full = times.length <= 7; // 刻度多的时候缩到"年-月"，免得标签互相压
	return times.map((tick) => {
		const left = percent(tick.time, space);
		return {
			key: `${tick.isNow ? "now" : "tick"}-${Math.round(tick.time / DAY)}`,
			kind: tick.isNow ? "now" : "boundary",
			left,
			align: left < 6 ? "start" : left > 94 ? "end" : "center",
			label: tick.isNow ? "现在" : full ? formatDate(tick.time) : formatDate(tick.time).slice(0, 7),
		};
	});
});

/**
 * 列表项 = 阶段的**后端顺序**（窗口起点升序、无窗口的排最后，前端不重排），
 * 每一项再挂上时间带里的几何（画不上带的就没有 left/width）。
 */
const entries = computed(() => {
	const byKey = new Map(bands.value.map((band) => [band.key, band]));
	return stages.value.map((stage) => {
		const key = stageKey(stage);
		const band = byKey.get(key);
		const base = { key, name: stage.name, phase: stage.phase, summary: stage.summary, recruit: stage.recruit, stage };
		if (band) {
			return {
				...base,
				rangeText: band.rangeText,
				spanText: band.spanText,
				left: band.left,
				width: band.width,
				openEnded: band.openEnded,
				windowMissing: false,
			};
		}
		return { ...base, rangeText: "未记录时间窗", spanText: "", left: 0, width: 0, openEnded: false, windowMissing: true };
	});
});

const hintId = "tv-stage-hint";
const chartLabel = computed(() => {
	const parts = [`阶段时间带，共 ${bands.value.length} 段`];
	parts.push(phases.value.length ? `当前阶段：${phases.value.join("、")}` : "当前没有进行中的阶段");
	if (gaps.value.length) parts.push(`${gaps.value.length} 段空档`);
	return parts.join("；");
});

function detailId(key) {
	return `tv-stage-detail-${String(key).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function isOpen(key) {
	return openKeys.value.includes(key);
}

function toggle(key) {
	openKeys.value = isOpen(key) ? openKeys.value.filter((entry) => entry !== key) : [...openKeys.value, key];
}

function phaseLabel(phase) {
	return stagePhaseLabel(phase) || "时间未定";
}

function skillsText(recruit) {
	const skills = Array.isArray(recruit.skills) ? recruit.skills.filter(Boolean) : [];
	return skills.length ? `需要：${skills.join("、")}` : "";
}

function headcountText(recruit) {
	const value = recruit.headcount;
	if (value == null || value === "") return "";
	return String(value);
}
</script>
