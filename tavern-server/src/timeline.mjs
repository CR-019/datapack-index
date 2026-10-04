/**
 * 阶段与派生字段（设计文档 ADR-010）。
 *
 * 本文件只做**推导**，不写任何数据：
 *   · `stage` 是子节点实体（有窗口、有正文），由作者维护
 *   · `facets.phases` 是**投影**（取所有窗口包含 now 的 stage），不落库、不写事件
 *   · 阶段允许**并列**（窗口可重叠）也允许**空隙**，所以 phases 是集合且可以为空
 *
 * 「能算出来的就别维护」——与"标签成员是查询算出来的"（§5.1.2）同一条道理。
 */

import { parseProfile, q } from "./db.mjs";

/** 阶段可能的取值（派生，不落库） */
export const STAGE_PHASES = ["past", "current", "future"];

/**
 * 解析时间边界。
 * date-only（`2026-11-30`）在作为**结束**时应覆盖整天，
 * 否则"一天的赛事"会在当天 00:00 就结束 —— 这个坑很隐蔽。
 */
export function parseBoundary(value, { endOfDay = false } = {}) {
  if (typeof value !== "string" || !value.trim()) return null;
  const text = value.trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(text);
  const parsed = Date.parse(dateOnly ? `${text}T00:00:00.000Z` : text);
  if (Number.isNaN(parsed)) return null;
  return dateOnly && endOfDay ? parsed + 86_400_000 - 1 : parsed;
}

/* ───────────────── 阶段（子节点） ───────────────── */

/** 某节点是否有父节点（不变量 13 用它把子节点排除出看板列表） */
export function hasParent(db, nodeId) {
  return Boolean(q.get(db, "SELECT 1 AS ok FROM edges WHERE from_id = ? AND rel = 'parent' LIMIT 1", nodeId));
}

export function parentIdOf(db, nodeId) {
  // ⚠️ `to` 是 SQLite 保留字，别名必须加双引号（不加会报 "near to: syntax error"）
  const row = q.get(db, "SELECT to_id AS \"to\" FROM edges WHERE from_id = ? AND rel = 'parent' LIMIT 1", nodeId);
  return row?.to ?? null;
}

export function childrenOf(db, parentId) {
  return q.all(db, "SELECT from_id AS id FROM edges WHERE to_id = ? AND rel = 'parent' ORDER BY from_id", parentId).map((row) => row.id);
}

/** 单个阶段的派生状态：看 now 落在窗口哪一侧 */
export function stagePhaseOf(stage, now = new Date()) {
  const time = stage.facets?.time ?? stage.profile?.facets?.time ?? null;
  const start = parseBoundary(time?.start);
  const end = parseBoundary(time?.end, { endOfDay: true });
  if (start == null && end == null) return null;
  const at = now.getTime();
  if (start != null && at < start) return "future";
  if (end != null && at > end) return "past";
  return "current";
}

/**
 * 阶段的标准成型（**唯一**一份）。
 *
 * 实时 API 走 `listStages`、快照走 `allStages`，两条路径都必须经过这里。
 * 之前两边各写各的：一个按窗口起点排序、一个按 id 排，一个给 stage 也派生了
 * `facets.phases`（阶段没有阶段）。结果就是**同一个项目在线看见的阶段条顺序，
 * 离线后会变**——这类漂移不会报错，只会让人以为数据错了。
 *
 * 入参的每一行都必须带 `parentId`（`parseProfile` 是白名单投影，不会透传列）。
 */
export function shapeStages(rows, { now = new Date() } = {}) {
  return rows
    .map((row) => {
      const node = parseProfile(row);
      return { ...node, parentId: row.parentId, phase: stagePhaseOf(node, now) };
    })
    .sort((left, right) => {
      const leftStart = parseBoundary(left.facets?.time?.start) ?? Number.POSITIVE_INFINITY;
      const rightStart = parseBoundary(right.facets?.time?.start) ?? Number.POSITIVE_INFINITY;
      return leftStart - rightStart || left.id.localeCompare(right.id, "en");
    });
}

/** 某父节点的全部阶段（按窗口起点升序；无窗口的排在最后） */
export function listStages(db, parentId, { now = new Date(), includeUnpublished = false } = {}) {
  const rows = q.all(
    db,
    `SELECT n.* FROM edges e JOIN nodes n ON n.id = e.from_id
     WHERE e.to_id = ? AND e.rel = 'parent' AND n.kind = 'stage'
       ${includeUnpublished ? "" : "AND n.published_revision_id IS NOT NULL"}
     ORDER BY n.id`,
    parentId,
  );

  return shapeStages(rows.map((row) => ({ ...row, parentId })), { now });
}

/* ───────────────── phases 投影 ───────────────── */

/** 赛事按窗口推导的当前阶段（没有 stage 子节点时的回退规则） */
export function eventPhasesOf(node, now = new Date()) {
  const time = node.facets?.time ?? null;
  const start = parseBoundary(time?.start);
  const end = parseBoundary(time?.end, { endOfDay: true });
  if (start == null || end == null) return [];

  const at = now.getTime();
  if (at < start) return ["筹备中"];
  const deadline = parseBoundary(time?.deadline, { endOfDay: true });
  if (deadline != null && at <= deadline) return ["报名中"];
  if (at <= end) return ["进行中"];
  return ["已结束"];
}

/** 还在招人吗（招募在窗口内且状态为 open） */
export function openRecruitRoles(node, now = new Date()) {
  const at = now.getTime();
  return (node.recruit ?? [])
    .filter((entry) => (entry.status ?? "open") === "open")
    .filter((entry) => {
      const deadline = parseBoundary(entry.deadline, { endOfDay: true });
      return deadline == null || at <= deadline;
    })
    .map((entry) => entry.role)
    .filter(Boolean);
}

/**
 * 当前阶段（集合，0..N）。
 * 优先用 stage 子节点；没有 stage 时按 kind 规则回退。
 */
export function derivePhases(db, node, { now = new Date() } = {}) {
  const stages = listStages(db, node.id, { now });
  if (stages.length) {
    // 并列阶段会同时命中多个 → 返回集合；处在空隙里 → 空数组
    return stages.filter((stage) => stage.phase === "current").map((stage) => stage.name ?? stage.i18n?.zh?.title ?? stage.id);
  }

  const phases = [];
  if (node.kind === "event") phases.push(...eventPhasesOf(node, now));
  if (openRecruitRoles(node, now).length) phases.push("招募中");
  return phases;
}

/** 给节点挂上派生字段（公开读模型与快照都用它，保证两处一致） */
export function withDerivedFacets(db, node, { now = new Date() } = {}) {
  const phases = derivePhases(db, node, { now });
  return { ...node, facets: { ...(node.facets ?? {}), phases } };
}
