/**
 * 事件流：时间线的真相源（设计文档 ADR-009）。
 *
 * 三条不变量，任何一条破了这个模型就白做：
 *   1. **事件是已发生的事实**：`at ≤ now`（未来的时间点属于 `facets.time`）
 *   2. **事件不可改，只能追加或作废**（`voided_at`）
 *   3. **`facets.state` 是事件的投影**：唯一入口是 recomputeState()，
 *      任何地方都不许直接写 profile_json.facets.state
 *
 * 与修订（revisions）刻意分开：修订是"内容快照 + 审核单元"，事件是"事实 + 零审核"。
 * 共用一张表会让事件被迫排队审核，或让修订失去审核意义（理由同 ADR-008 分表）。
 */

import crypto from "node:crypto";

import { nowIso } from "./config.mjs";
import { q } from "./db.mjs";

export const EVENT_KINDS = new Set(["state", "milestone", "recruit", "relation", "note"]);
export const LIFECYCLE_STATES = new Set(["draft", "active", "paused", "done", "archived"]);
export const RECRUIT_STATUSES = new Set(["open", "filled", "closed"]);
export const EVENT_SOURCES = new Set(["manual", "derived", "import"]);
export const MAX_TITLE_LENGTH = 80;

/** 容忍一点时钟偏差：客户端的 at 允许比服务器时间晚这么久 */
const CLOCK_SKEW_MS = 120_000;

export class EventError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "EventError";
    this.status = status;
    this.code = code;
  }
}

const STATE_LABELS = {
  draft: "草稿",
  active: "进行中",
  paused: "暂停",
  done: "已完结",
  archived: "已归档",
};

const RECRUIT_LABELS = { open: "招募中", filled: "已招满", closed: "已关闭" };

export const lifecycleLabel = (state) => STATE_LABELS[state] ?? state;
export const recruitLabel = (status) => RECRUIT_LABELS[status] ?? status;

/* ───────────────── 追加 ───────────────── */

function assertNodeExists(db, nodeId) {
  if (!q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", nodeId)) {
    throw new EventError(404, "node_not_found", `条目不存在：${nodeId}`);
  }
}

/**
 * 追加一条事件，并重算状态投影。
 * @param {{ db, nodeId, kind, title, at?, status?, body?, actorId?, source?, visibility?, allowBody? }} input
 */
export function appendEvent(db, {
  nodeId,
  kind,
  title,
  at = null,
  status = null,
  body = null,
  actorId = null,
  source = "manual",
  visibility = "public",
  allowBody = false,
}) {
  assertNodeExists(db, nodeId);

  if (!EVENT_KINDS.has(kind)) {
    throw new EventError(400, "bad_event_kind", `未知的事件类型：${kind}（允许：${[...EVENT_KINDS].join(" / ")}）`);
  }
  const cleanTitle = typeof title === "string" ? title.trim() : "";
  if (!cleanTitle) throw new EventError(400, "missing_title", "事件必须有一句话标题");
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new EventError(400, "title_too_long", `标题过长（${cleanTitle.length} > ${MAX_TITLE_LENGTH} 字）`);
  }
  if (!EVENT_SOURCES.has(source)) throw new EventError(400, "bad_source", `未知来源：${source}`);
  if (!["public", "internal"].includes(visibility)) throw new EventError(400, "bad_visibility", `未知可见性：${visibility}`);

  // 不变量 1：事件是已发生的事实
  // ⚠️ 必须先 Date.parse 判合法再构造 Date：`new Date("乱码").toISOString()` 会抛
  // RangeError（不是返回无效日期），于是"可读的 400"会变成"500 内部错误"。
  let atIso = nowIso();
  if (at) {
    const parsed = Date.parse(at);
    if (Number.isNaN(parsed)) throw new EventError(400, "bad_time", `事件时间无法解析：${at}`);
    atIso = new Date(parsed).toISOString();
  }
  if (Date.parse(atIso) > Date.now() + CLOCK_SKEW_MS) {
    throw new EventError(400, "future_event", "事件必须是**已发生**的事实；计划中的时间点请写进 time 窗口");
  }

  // 不变量 2 的配套：正文属"内容"，要走待审修订（ADR-009 与审批的关系）
  const cleanBody = typeof body === "string" && body.trim() ? body.trim() : null;
  if (cleanBody && !allowBody) {
    throw new EventError(
      400,
      "body_needs_review",
      "事件的标题属事实可直通，但长描述属内容——请把它放进待审修订，而不是直接写进事件",
    );
  }

  if (status != null) {
    if (kind === "state" && !LIFECYCLE_STATES.has(status)) {
      throw new EventError(400, "bad_status", `state 事件的状态只能是 ${[...LIFECYCLE_STATES].join(" / ")}`);
    }
    if (kind === "recruit" && !RECRUIT_STATUSES.has(status)) {
      throw new EventError(400, "bad_status", `recruit 事件的状态只能是 ${[...RECRUIT_STATUSES].join(" / ")}`);
    }
  }

  const id = `evt_${crypto.randomBytes(10).toString("hex")}`;
  q.run(
    db,
    `INSERT INTO node_events (id, node_id, kind, at, status, title, body, actor_id, source, visibility, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, nodeId, kind, atIso, status, cleanTitle, cleanBody, actorId, source, visibility, nowIso(),
  );

  // 投影：state 事件是 facets.state 的唯一来源
  if (kind === "state" && status) recomputeState(db, nodeId);

  return q.get(db, "SELECT * FROM node_events WHERE id = ?", id);
}

/** 直通路径：只允许一句话事实，不允许正文（正文属内容，见 appendEvent 的校验） */
export function appendFact(db, input) {
  return appendEvent(db, { ...input, allowBody: false });
}

/* ───────────────── 查询 ───────────────── */

/**
 * 事件查询的过滤条件（**唯一**一份，list 与 count 必须共用）。
 *
 * 之前 countEvents 只过滤了 `voided_at`，漏了 `visibility`：公开接口于是变成
 * `items` 里 4 条、`total` 里 5 条——计数本身把"存在一条内部事件"泄了出去。
 * 与当年 `/v1/status` 匿名暴露账户数是同一类问题：**看不见内容不等于看不见数量**。
 */
function eventFilter({ includeInternal = false, includeVoided = false } = {}) {
  const where = ["node_id = ?"];
  if (!includeInternal) where.push("visibility = 'public'");
  if (!includeVoided) where.push("voided_at IS NULL");
  return where.join(" AND ");
}

/**
 * 事件列表。
 *
 * ⚠️ **故意不返回 `actor_id`**（设计文档 §6.6 把它定义为审计字段："谁记录的"）。
 * 审计属于 staff 侧；公开面暴露它等于把「这条是哪个账户改的」发出去，而且快照里
 * 本来就没有这个字段——留着只会让在线/离线两种形状对不上。
 */
export function listEvents(db, nodeId, { limit = 20, includeInternal = false, includeVoided = false } = {}) {
  return q.all(
    db,
    `SELECT id, node_id AS nodeId, kind, at, status, title, body, source
     FROM node_events WHERE ${eventFilter({ includeInternal, includeVoided })}
     ORDER BY at DESC, created_at DESC, id DESC LIMIT ?`,
    nodeId, limit,
  );
}

/** 与 listEvents 必须给出一致的口径：同一个 `total` 下的 items 才是完整的 */
export function countEvents(db, nodeId, { includeInternal = false, includeVoided = false } = {}) {
  return q.get(
    db,
    `SELECT COUNT(*) AS c FROM node_events WHERE ${eventFilter({ includeInternal, includeVoided })}`,
    nodeId,
  ).c;
}

/* ───────────────── 作废（不变量 2：不可改，只能作废） ───────────────── */

export function voidEvent(db, { eventId, actorId = null, reason = null }) {
  const event = q.get(db, "SELECT * FROM node_events WHERE id = ?", eventId);
  if (!event) throw new EventError(404, "event_not_found", `事件不存在：${eventId}`);
  if (event.voided_at) throw new EventError(409, "already_voided", "该事件已经作废过了");

  q.run(db, "UPDATE node_events SET voided_at = ? WHERE id = ?", nowIso(), eventId);
  if (event.kind === "state") recomputeState(db, event.node_id);

  q.run(
    db,
    "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, 'event.voided', ?, ?, ?)",
    actorId, eventId, reason ?? `作废事件：${event.title}`, nowIso(),
  );
  return { eventId, nodeId: event.node_id };
}

/* ───────────────── 状态投影（不变量 3） ───────────────── */

/** 由事件推导出的生命周期状态；没有 state 事件时按"是否已上架"给默认值 */
export function currentStateOf(db, nodeId) {
  const latest = q.get(
    db,
    `SELECT status FROM node_events
     WHERE node_id = ? AND kind = 'state' AND voided_at IS NULL AND status IS NOT NULL
     ORDER BY at DESC, created_at DESC, id DESC LIMIT 1`,
    nodeId,
  );
  if (latest?.status) return latest.status;

  const node = q.get(db, "SELECT published_revision_id FROM nodes WHERE id = ?", nodeId);
  return node?.published_revision_id ? "active" : "draft";
}

/**
 * 重算并写回 `facets.state`。
 * ⚠️ 这是**唯一**允许写 `facets.state` 的地方 —— 直接写会产生两套真相（ADR-009）。
 */
export function recomputeState(db, nodeId) {
  const node = q.get(db, "SELECT profile_json FROM nodes WHERE id = ?", nodeId);
  if (!node) throw new EventError(404, "node_not_found", `条目不存在：${nodeId}`);

  const state = currentStateOf(db, nodeId);
  const profile = JSON.parse(node.profile_json);
  if (profile.facets?.state === state) return state;

  profile.facets = { ...(profile.facets ?? {}), state };
  q.run(db, "UPDATE nodes SET profile_json = ? WHERE id = ?", JSON.stringify(profile), nodeId);
  return state;
}
