/**
 * 阶段（`kind=stage`）：项目自身的时间切片（设计文档 ADR-010）。
 *
 * 结构上它就是**子节点**：复用 parent 边、时间窗、正文、招募、修订、i18n、权限，
 * 零新机制。三条专属校验无处安放，所以给了它独立的 kind：
 *   ① 必须有 parent 且父节点是 project/event
 *   ② 必须有时间窗
 *   ③ 不接收成员、也不能再套阶段（不变量 14/15）
 *
 * 按 ADR-010：**阶段的名称与时间窗属事实/结构 → 直通生效**；正文属内容 → 走待审修订。
 * 本文件的 createStage 只处理前者（名称 + 窗口 + 可选 summary），**不写事件**（阶段可推导）。
 */

import crypto from "node:crypto";

import { nowIso } from "./config.mjs";
import { q } from "./db.mjs";
import { parseBoundary } from "./timeline.mjs";

export const STAGE_PARENT_KINDS = new Set(["project", "event"]);
export const MAX_STAGE_NAME = 60;
export const MAX_STAGE_SUMMARY = 200;

export class StageError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "StageError";
    this.status = status;
    this.code = code;
  }
}

const slugifyName = (name) => {
  const ascii = String(name ?? "").normalize("NFKD").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  return ascii && /[a-z0-9]/.test(ascii) ? ascii : crypto.createHash("sha1").update(String(name ?? "")).digest("hex").slice(0, 8);
};

/** `stage:<父级 slug>-<阶段 slug>`：同一项目下唯一，跨项目也不会撞 */
export function stageIdFor(parentId, name) {
  const parentSlug = String(parentId).includes(":") ? String(parentId).split(":").slice(1).join(":") : String(parentId);
  return `stage:${parentSlug}-${slugifyName(name)}`;
}

/**
 * 建一个阶段（直通生效）。
 * @param {{ db, parentId, actorId, name, start, end, summary?, slug? }} input
 */
export function createStage(db, { parentId, actorId, name, start, end, summary = null, slug = null }) {
  const parent = q.get(db, "SELECT * FROM nodes WHERE id = ?", parentId);
  if (!parent) throw new StageError(404, "parent_not_found", `父节点不存在：${parentId}`);

  // 不变量 15：阶段不能再套阶段
  if (parent.kind === "stage") {
    throw new StageError(400, "nested_stage", "阶段不能再有阶段子节点——嵌套窗口会让「当前阶段」失去唯一解");
  }
  if (!STAGE_PARENT_KINDS.has(parent.kind)) {
    throw new StageError(400, "bad_parent_kind", `只有 project / event 能有阶段，${parentId} 是 ${parent.kind}`);
  }
  if (!parent.published_revision_id) {
    throw new StageError(409, "parent_not_published", "父条目尚未上架，先让它上架再加阶段");
  }

  const cleanName = String(name ?? "").trim();
  if (!cleanName) throw new StageError(400, "missing_name", "阶段需要一个名字（如「v1.0 开发期」）");
  if (cleanName.length > MAX_STAGE_NAME) {
    throw new StageError(400, "name_too_long", `阶段名过长（${cleanName.length} > ${MAX_STAGE_NAME} 字）`);
  }

  // 不变量 14：必须有时间窗
  const startAt = parseBoundary(start);
  const endAt = parseBoundary(end, { endOfDay: true });
  if (startAt == null || endAt == null) {
    throw new StageError(400, "missing_window", "阶段必须有 start 与 end（这就是它和普通子项目的区别）");
  }
  if (endAt < startAt) throw new StageError(400, "bad_window", "阶段的 end 不能早于 start");

  const cleanSummary = typeof summary === "string" && summary.trim() ? summary.trim() : null;
  if (cleanSummary && cleanSummary.length > MAX_STAGE_SUMMARY) {
    throw new StageError(400, "summary_too_long", `阶段简介过长（${cleanSummary.length} > ${MAX_STAGE_SUMMARY} 字）`);
  }

  const id = slug ? `stage:${slug}` : stageIdFor(parentId, cleanName);
  if (q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", id)) {
    throw new StageError(409, "stage_exists", `阶段 id 已被占用：${id}（换个名字，或用 slug 指定）`);
  }

  const now = nowIso();
  const profile = {
    name: cleanName,
    i18n: { zh: { title: cleanName, ...(cleanSummary ? { summary: cleanSummary } : {}) } },
    facets: { time: { start: String(start).trim(), end: String(end).trim(), deadline: null }, state: "active" },
    recruit: [],
  };
  const revisionId = `seed_${id}_1`;

  db.exec("BEGIN");
  try {
    q.run(
      db,
      "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'stage', ?, ?, ?)",
      id, JSON.stringify(profile), now, now,
    );
    // 名称与窗口属事实/结构 → 直通：直接产出一条已发布修订，不进审核队列
    q.run(
      db,
      `INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, review_note, created_at)
       VALUES (?, ?, ?, ?, 'published', ?, ?)`,
      revisionId, id, actorId, JSON.stringify({ project: profile }), "阶段创建（名称与窗口属事实，直通）", now,
    );
    q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", revisionId, id);

    // parent 边的方向：**从子指向父**（每个子节点至多一个 parent，符合不变量 4）
    q.run(
      db,
      "INSERT INTO edges (from_id, rel, to_id, role, char, created_at) VALUES (?, 'parent', ?, NULL, NULL, ?)",
      id, parentId, now,
    );

    q.run(
      db,
      "INSERT INTO audit_log (actor_id, action, target, diff_json, reason, created_at) VALUES (?, 'stage.created', ?, ?, ?, ?)",
      actorId, id, JSON.stringify({ parentId, start, end }), cleanName, now,
    );

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return { stageId: id, parentId, revisionId, name: cleanName, window: { start, end } };
}

/** 删阶段（同样是结构变更，直通；相关事件与边一并清掉） */
export function deleteStage(db, { stageId, actorId }) {
  const stage = q.get(db, "SELECT * FROM nodes WHERE id = ? AND kind = 'stage'", stageId);
  if (!stage) throw new StageError(404, "stage_not_found", `阶段不存在：${stageId}`);

  db.exec("BEGIN");
  try {
    q.run(db, "DELETE FROM edges WHERE from_id = ? OR to_id = ?", stageId, stageId);
    q.run(db, "DELETE FROM revisions WHERE node_id = ?", stageId);
    q.run(db, "DELETE FROM assets WHERE node_id = ?", stageId);
    q.run(db, "DELETE FROM nodes WHERE id = ?", stageId);
    q.run(
      db,
      "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, 'stage.deleted', ?, ?, ?)",
      actorId, stageId, "删除阶段", nowIso(),
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return { stageId };
}
