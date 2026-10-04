/**
 * 投稿与审核的存储逻辑（设计文档 §7.2 / §9.4 / ADR-006）。
 *
 * 两条不变式贯穿本文件：
 *   · **公开面只认 published 修订** —— 新建的节点 published_revision_id 为空，
 *     因此在审核通过之前，公开接口一律看不到它（§5.5 不变量 8）。
 *   · **素材按"内容寻址的原始包"留存** —— 原始 zip 存 inbox/<sha256>.zip，
 *     修订只记录 sha256；未审素材不会出现在任何公开路径下（§5.5 不变量 10）。
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { canEdit } from "./auth.mjs";
import { config, nowIso } from "./config.mjs";
import { q } from "./db.mjs";

export class SubmissionError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "SubmissionError";
    this.status = status;
    this.code = code;
  }
}

/* ───────────────── slug 与 inbox ───────────────── */

/**
 * 生成 slug。设计上 slug 由表单给出，但作者可能不填，所以要有可用的回退。
 * 中文名（如「浮空界面」）无法直接转 ASCII，退回到内容哈希后缀 ——
 * 稳定、可预测，且不依赖拼音库。
 */
export function slugify(name) {
  const ascii = String(name ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  if (ascii && /[a-z0-9]/.test(ascii)) return ascii;
  const digest = crypto.createHash("sha1").update(String(name ?? "")).digest("hex").slice(0, 8);
  return `p-${digest}`;
}

export function normalizeSlug(raw, fallbackName) {
  const text = String(raw ?? "").trim();
  if (!text) return slugify(fallbackName);
  const cleaned = text.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
  if (!cleaned) throw new SubmissionError(400, "bad_slug", `slug「${text}」不含可用字符（只允许 a-z 0-9 -）`);
  return cleaned;
}

/** 原始包按内容寻址落盘；同一份包重复上传不会占第二份空间 */
export function storeInbox(buffer) {
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  fs.mkdirSync(config.inboxDir, { recursive: true });
  const file = path.join(config.inboxDir, `${sha256}.zip`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, buffer, { mode: 0o600 });
  return { sha256, path: file };
}

/* ───────────────── 投稿 ───────────────── */

function revisionIdFor(sha256) {
  return `rev_${sha256.slice(0, 16)}_${Date.now().toString(36)}`;
}

/** 节点公开 profile：不含正文（正文属于修订快照） */
function profileOf(project) {
  return {
    i18n: project.i18n,
    tags: project.tags,
    facets: { game: project.gameversion, state: "draft" },
    links: project.links,
    repo: project.repo,
    license: project.license,
    cover: project.cover,
    time: project.time,
    recruit: project.recruit.map((entry) => ({ ...entry, body: undefined })),
  };
}

/**
 * 建立或更新一条投稿，产出一条 pending 修订。
 * 同一 slug 重复投稿 = 新修订（乐观锁基线为当前已发布修订）。
 */
export function saveSubmission(db, { accountId, project, slug, zipSha256, zipPath, warnings = [] }) {
  const nodeId = `project:${slug}`;
  const now = nowIso();
  const existing = q.get(db, "SELECT * FROM nodes WHERE id = ?", nodeId);

  if (existing && !canEdit(db, accountId, nodeId)) {
    throw new SubmissionError(403, "not_maintainer", `条目 ${nodeId} 已存在，且你不具备维护权限`);
  }

  db.exec("BEGIN");
  try {
    if (!existing) {
      // 新建节点：profile 先落库，但 published_revision_id 仍为空，
      // 所以公开面读不到它（§5.5 不变量 8）。
      q.run(
        db,
        "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        nodeId, project.kind, JSON.stringify(profileOf(project)), now, now,
      );
      // 作者自动成为维护者 —— 权限由 maintains 边说话（ADR-005）
      q.run(
        db,
        "INSERT INTO edges (from_id, rel, to_id, role, created_at) VALUES (?, 'maintains', ?, 'owner', ?)",
        accountId, nodeId, now,
      );
    }
    // ⚠️ 已存在的节点：**绝不**在这里改 nodes.profile_json。
    // 那是公开面唯一读取的字段，投稿动作一旦写它，未审核的内容就会立刻
    // 出现在公开页（真发生过：tests/submissions.test.mjs 里那条 ★ 用例）。
    // 公开 profile 只在 reviewRevision 的上架分支里更新。

    const revisionId = revisionIdFor(zipSha256);
    q.run(
      db,
      `INSERT INTO revisions (id, node_id, author_id, base_revision_id, snapshot_json, status, created_at, source_path, source_sha256)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      revisionId,
      nodeId,
      accountId,
      existing?.published_revision_id ?? null,
      JSON.stringify({ project, warnings }),
      now,
      zipPath,
      zipSha256,
    );

    for (const asset of project.assets) {
      q.run(
        db,
        `INSERT INTO assets (id, node_id, revision_id, path, sha256, size, mime, visibility, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        `as_${crypto.randomBytes(8).toString("hex")}`,
        nodeId, revisionId, asset.path, asset.sha256, asset.size, asset.mime, now,
      );
    }

    q.run(
      db,
      "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, 'submission.created', ?, ?, ?)",
      accountId, nodeId, `revision=${revisionId} zip=${zipSha256.slice(0, 12)}`, now,
    );

    db.exec("COMMIT");
    return { nodeId, revisionId, slug };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/* ───────────────── 审核 ───────────────── */

export function pendingQueue(db, { limit = 50 } = {}) {
  return q.all(
    db,
    `SELECT r.id AS revisionId, r.node_id AS nodeId, r.author_id AS authorId, r.created_at AS createdAt,
            r.source_sha256 AS zipSha, n.kind AS kind,
            json_extract(n.profile_json, '$.i18n.zh.title') AS title
     FROM revisions r JOIN nodes n ON n.id = r.node_id
     WHERE r.status = 'pending'
     ORDER BY r.created_at ASC LIMIT ?`,
    limit,
  ).map((row) => ({
    ...row,
    waitingHours: Math.round((Date.now() - new Date(row.createdAt).getTime()) / 36e5),
  }));
}

/** 上架时把标签落到实处：新建缺失的标签节点 + 物化 tag_members（§5.1.2） */
function applyTags(db, nodeId, tags) {
  const now = nowIso();
  for (const raw of tags ?? []) {
    const text = String(raw).trim();
    if (!text) continue;
    const tagId = `tag:${text.toLowerCase()}`;
    const existing = q.get(db, "SELECT id, published_revision_id FROM nodes WHERE id = ?", tagId);
    if (!existing) {
      q.run(
        db,
        "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'tag', ?, ?, ?)",
        tagId, JSON.stringify({ i18n: { zh: { title: text } }, rules: { mode: "query", expr: `tags ⊇ ${text}` } }), now, now,
      );
      const tagRevisionId = `seed_${tagId}_1`;
      q.run(
        db,
        "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?, ?, ?, 'published', ?)",
        tagRevisionId, tagId, JSON.stringify({ i18n: { zh: { title: text } } }), now,
      );
      q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", tagRevisionId, tagId);
    }
    q.run(
      db,
      "INSERT OR REPLACE INTO tag_members (tag_id, node_id, computed_at) VALUES (?, ?, ?)",
      tagId, nodeId, now,
    );
  }
}

/** 低风险的弱关系直接生效；`requests`（加入他人集合）留给集合维护者审 */
function applyWeakRelations(db, nodeId, relations) {
  const now = nowIso();
  for (const [rel, targets] of [["related", relations.related], ["depends", relations.depends]]) {
    for (const target of targets ?? []) {
      const exists = q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", target);
      if (!exists) continue;
      q.run(
        db,
        "INSERT OR IGNORE INTO edges (from_id, rel, to_id, created_at) VALUES (?, ?, ?, ?)",
        nodeId, rel, target, now,
      );
    }
  }
}

/**
 * 审核一条修订。
 * @param {{ revisionId:string, action:'approve'|'reject', note?:string, reviewerId:string }} input
 */
export function reviewRevision(db, { revisionId, action, note = null, reviewerId }) {
  if (!["approve", "reject"].includes(action)) {
    throw new SubmissionError(400, "bad_action", "action 只能是 approve 或 reject");
  }
  const revision = q.get(db, "SELECT * FROM revisions WHERE id = ?", revisionId);
  if (!revision) throw new SubmissionError(404, "revision_not_found", "修订不存在");
  if (revision.status !== "pending") {
    throw new SubmissionError(409, "not_pending", `该修订已经是 ${revision.status} 状态`);
  }

  const node = q.get(db, "SELECT * FROM nodes WHERE id = ?", revision.node_id);
  if (!node) throw new SubmissionError(404, "node_not_found", "条目不存在");

  const now = nowIso();
  const snapshot = JSON.parse(revision.snapshot_json);
  const project = snapshot.project ?? {};

  db.exec("BEGIN");
  try {
    if (action === "reject") {
      q.run(db, "UPDATE revisions SET status = 'rejected', review_note = ? WHERE id = ?", note, revisionId);
      q.run(
        db,
        "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, 'revision.rejected', ?, ?, ?)",
        reviewerId, revision.node_id, note ?? "未填写理由", now,
      );
      db.exec("COMMIT");
      return { status: "rejected", nodeId: revision.node_id };
    }

    // ── 上架 ──
    if (node.published_revision_id && node.published_revision_id !== revisionId) {
      q.run(db, "UPDATE revisions SET status = 'superseded' WHERE id = ?", node.published_revision_id);
    }
    q.run(db, "UPDATE revisions SET status = 'published', review_note = ? WHERE id = ?", note, revisionId);
    q.run(
      db,
      "UPDATE nodes SET published_revision_id = ?, profile_json = ?, updated_at = ? WHERE id = ?",
      revisionId,
      JSON.stringify({ ...profileOf(project), facets: { ...profileOf(project).facets, state: "active" } }),
      now,
      revision.node_id,
    );
    q.run(db, "UPDATE assets SET visibility = 'published' WHERE revision_id = ?", revisionId);
    applyTags(db, revision.node_id, project.tags);
    applyWeakRelations(db, revision.node_id, project.relations ?? {});
    q.run(
      db,
      "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, 'revision.published', ?, ?, ?)",
      reviewerId, revision.node_id, note ?? "上架", now,
    );

    db.exec("COMMIT");
    return { status: "published", nodeId: revision.node_id, revisionId };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
