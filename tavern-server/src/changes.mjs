/**
 * 收敛型修改：直通生效，但**不丢历史**（设计文档 ADR-006 阀门 1 + ADR-009）。
 *
 * 这是 ADR-009 最关键的一笔：收敛型修改之所以能直通，是因为它**风险朝"少说"一侧**
 * （关招募、标记完结、下架都属于"撤回信息"）。那就该在直通的同时**自动追加一条事件**——
 * 于是"零审核成本"和"完整历史"不再互斥。
 *
 * 同时按 ADR-006 的承诺**记一条修订**（内容快照），以便回滚：
 *   · 事件 = 语义时间线（"何时招满"）
 *   · 修订 = 内容快照（"回到那一刻长什么样"）
 * 两者职责不同，都要有。
 *
 * 本文件**只接受收敛型字段**。扩张型（新增内容、改宣传语、换链接）一律拒绝，
 * 并指回去走投稿/待审修订——边界清晰比"猜作者想干什么"重要。
 */

import crypto from "node:crypto";

import { q } from "./db.mjs";
import { nowIso } from "./config.mjs";
import { appendFact, lifecycleLabel, recruitLabel, recomputeState } from "./events.mjs";

/** 收敛型允许改的字段（白名单，不是黑名单） */
export const CONVERGENT_FIELDS = new Set(["state", "recruit", "note"]);

export class ChangeError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "ChangeError";
    this.status = status;
    this.code = code;
  }
}

function loadNode(db, nodeId) {
  const node = q.get(db, "SELECT * FROM nodes WHERE id = ?", nodeId);
  if (!node) throw new ChangeError(404, "node_not_found", `条目不存在：${nodeId}`);
  if (!node.published_revision_id) {
    throw new ChangeError(409, "not_published", "该条目尚未上架；未上架的条目请走投稿/待审修订流程");
  }
  return node;
}

/**
 * 记一条"收敛型修订"：更新公开 profile 并移动发布指针，旧修订标记 superseded。
 * 目的只有一个 —— **可回滚**。
 */
function createConvergentRevision(db, { nodeId, profile, previousRevisionId, actorId, note }) {
  const now = nowIso();
  const revisionId = `rev_conv_${crypto.randomBytes(8).toString("hex")}`;

  if (previousRevisionId) {
    q.run(db, "UPDATE revisions SET status = 'superseded' WHERE id = ? AND status = 'published'", previousRevisionId);
  }
  q.run(
    db,
    `INSERT INTO revisions (id, node_id, author_id, base_revision_id, snapshot_json, status, review_note, created_at)
     VALUES (?, ?, ?, ?, ?, 'published', ?, ?)`,
    revisionId, nodeId, actorId, previousRevisionId,
    JSON.stringify({ convergent: true, profile, note: note ?? null }),
    note ?? "收敛型修改（直通）", now,
  );
  q.run(db, "UPDATE nodes SET profile_json = ?, published_revision_id = ?, updated_at = ? WHERE id = ?",
    JSON.stringify(profile), revisionId, now, nodeId);
  return revisionId;
}

/**
 * 应用一次收敛型修改。
 * @param {{ db, nodeId, actorId, patch: { state?, recruit?: Array<{role,status}>, note? } }} input
 */
export function applyConvergentChange(db, { nodeId, actorId, patch }) {
  const node = loadNode(db, nodeId);
  const profile = JSON.parse(node.profile_json ?? "{}");
  const note = typeof patch.note === "string" ? patch.note.trim() : null;

  // 白名单：不认识的字段直接拒绝，并说清该走哪条路
  const unknown = Object.keys(patch).filter((key) => !CONVERGENT_FIELDS.has(key));
  if (unknown.length) {
    throw new ChangeError(
      400,
      "not_convergent",
      `这些字段不属于收敛型修改（不能直通）：${unknown.join(", ")}。` +
      "新增内容、修改文案、变更链接等请走投稿/待审修订，让工作组过一眼。",
    );
  }

  const events = [];
  const changes = [];

  db.exec("BEGIN");
  try {
    /* ① 生命周期状态 */
    if (patch.state != null) {
      const target = String(patch.state);
      const current = recomputeState(db, nodeId);
      if (target === current) {
        throw new ChangeError(409, "no_change", `状态已经是「${lifecycleLabel(current)}」`);
      }
      events.push(appendFact(db, {
        nodeId,
        kind: "state",
        status: target,
        title: `状态：${lifecycleLabel(current)} → ${lifecycleLabel(target)}`,
        actorId,
      }));
      changes.push({ field: "state", from: current, to: target });
      // appendFact 内部已重算投影；这里同步内存中的 profile 以便写修订
      profile.facets = { ...(profile.facets ?? {}), state: target };
    }

    /* ② 招募状态（"招满了"是最典型的收敛型修改） */
    if (patch.recruit != null) {
      if (!Array.isArray(patch.recruit)) {
        throw new ChangeError(400, "bad_recruit", "recruit 必须是数组：[{role, status}]");
      }
      const list = Array.isArray(profile.recruit) ? profile.recruit : [];
      for (const change of patch.recruit) {
        const role = typeof change?.role === "string" ? change.role.trim() : "";
        const status = typeof change?.status === "string" ? change.status : "";
        if (!role || !status) throw new ChangeError(400, "bad_recruit", "recruit 项需要 role 与 status");

        const entry = list.find((item) => item?.role === role);
        if (!entry) {
          throw new ChangeError(404, "role_not_found", `该条目没有「${role}」这个招募岗位（现有：${list.map((item) => item.role).join("、") || "无"}）`);
        }
        if ((entry.status ?? "open") === status) {
          throw new ChangeError(409, "no_change", `「${role}」已经是 ${recruitLabel(status)}`);
        }

        entry.status = status;
        events.push(appendFact(db, {
          nodeId,
          kind: "recruit",
          status,
          title: `招募「${role}」${recruitLabel(status)}`,
          actorId,
        }));
        changes.push({ field: `recruit:${role}`, from: entry.status, to: status });
      }
      profile.recruit = list;
    }

    if (!changes.length) throw new ChangeError(400, "no_change", "没有需要生效的改动");

    /* ③ 记修订以便回滚（ADR-006 的承诺"记修订、可回滚"） */
    const revisionId = createConvergentRevision(db, {
      nodeId,
      profile,
      previousRevisionId: node.published_revision_id,
      actorId,
      note,
    });

    q.run(
      db,
      "INSERT INTO audit_log (actor_id, action, target, diff_json, reason, created_at) VALUES (?, 'node.convergent-change', ?, ?, ?, ?)",
      actorId, nodeId, JSON.stringify(changes), note ?? "收敛型修改（直通）", nowIso(),
    );

    db.exec("COMMIT");
    return {
      nodeId,
      revisionId,
      changes,
      events: events.map((event) => ({ id: event.id, kind: event.kind, status: event.status, title: event.title, at: event.at })),
      state: recomputeState(db, nodeId),
    };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
