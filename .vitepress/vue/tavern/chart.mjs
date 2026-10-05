/**
 * 阶段时间带的几何计算（三处共用：StageStrip / 赛事 banner / 作品卡片）
 * =============================================================================
 * 为什么单独成模块：主页的赛事 banner 要画一条**迷你**阶段带，而 StageStrip 里
 * 已经有一条完整的。两处各写一份必然漂移 —— 同一份数据在两个页面画出不同的
 * 高亮，是那种没人报、但谁看谁觉得不对的 bug。所以把「时间域 → 分道 → 百分比」
 * 这段纯计算抽出来，渲染各画各的。
 *
 * 三条与设计对齐的规则（ADR-010）：
 *   · 窗口**允许重叠** → 并列阶段上下分道（区间图贪心着色），不能假设同时只有一段；
 *   · 窗口**允许空隙** → 这里不做首尾相接的补全，空白就是空白（空隙由调用方自己算）；
 *   · 时间域**把 now 并进去** → 「今天」永远在视野内，否则整条带子会画成过去时。
 */

import { formatDate, formatDuration, stagePhaseLabel } from "./api.mjs";

export const DAY = 86_400_000;

/** 阶段在列表与时间带之间的同一个身份键。 */
export function stageKey(stage) {
	return stage.id || `name:${stage.name}`;
}

/** 只有带时间窗的阶段才画得上带子（没有窗口的只进列表）。 */
export function placeableStages(stages) {
	return (Array.isArray(stages) ? stages : []).filter((stage) => stage && stage.window);
}

/** 时间 → 百分比（夹在 0..100）。 */
export function percentOf(time, domain) {
	if (!domain || !domain.span) return 0;
	const value = ((time - domain.min) / domain.span) * 100;
	return Math.max(0, Math.min(100, value));
}

/**
 * 共享时间域：所有阶段的并集 ∪ {now}；单日窗口时撑开一天，避免除零。
 * @returns {{min:number,max:number,span:number}|null}
 */
export function stageDomain(stages, now = Date.now()) {
	const list = placeableStages(stages);
	if (!list.length) return null;
	let min = Infinity;
	let max = -Infinity;
	for (const stage of list) {
		const start = stage.window.start != null ? stage.window.start : stage.window.end;
		const end = stage.window.end != null ? stage.window.end : now;
		min = Math.min(min, start, end);
		max = Math.max(max, start, end);
	}
	min = Math.min(min, now);
	max = Math.max(max, now);
	if (max - min < DAY) {
		min -= DAY / 2;
		max += DAY / 2;
	}
	return { min, max, span: max - min };
}

/**
 * 把阶段排成带子：按起点升序做区间图贪心着色，能塞进"已经空出来的行"就复用，
 * 否则新开一行。行数就是最大重叠深度 —— 并列阶段天然各占一行，首尾相接的共用一行。
 *
 * @param {Array} stages `nodeStages()` 归一化过的阶段（带 window / phase / name）
 * @param {object} options { now }
 * @returns {Array} 每一项：{ key, stage, name, phase, lane, laneCount, left, width,
 *                   rangeText, spanText, start, end, openEnded, tooltip }
 */
export function stageBands(stages, { now = Date.now() } = {}) {
	const space = stageDomain(stages, now);
	if (!space) return [];

	const items = placeableStages(stages).map((stage) => {
		const openEnded = stage.window.end == null;
		const start = stage.window.start != null ? stage.window.start : stage.window.end;
		const end = Math.max(openEnded ? now : stage.window.end, start);
		return { stage, start, end, openEnded };
	});

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
		const left = percentOf(item.start, space);
		const right = percentOf(item.end, space);
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
}

/**
 * 空隙：把阶段区间并起来后的补集（只算阶段之间真正的洞，两端不算）。
 * 首尾相接（甚至同一天）不当作空档 —— 那不叫"停过"。
 */
export function stageGaps(bands, domain, { now = Date.now() } = {}) {
	if (!domain) return [];
	void now;
	const merged = [];
	for (const span of [...bands].sort((a, b) => a.start - b.start)) {
		const last = merged[merged.length - 1];
		if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
		else merged.push({ start: span.start, end: span.end });
	}
	const result = [];
	for (let index = 0; index < merged.length - 1; index += 1) {
		const start = merged[index].end;
		const end = merged[index + 1].start;
		if (end - start < DAY) continue;
		result.push({
			key: `${Math.round(start / DAY)}-${Math.round(end / DAY)}`,
			left: percentOf(start, domain),
			width: Math.max(percentOf(end, domain) - percentOf(start, domain), 0.4),
			text: `${formatDate(start)} → ${formatDate(end)}（${formatDuration(end - start)}）`,
		});
	}
	return result;
}
