/**
 * 公开读模型（唯一实现）。
 *
 * 实时 API（routes.mjs）与静态快照导出（buildSnapshot）都从这里取数 ——
 * 两份实现迟早会漂移，一份实现则"快照 ≡ API 输出"成为可测试的不变量。
 *
 * ⚠️ **表级白名单（ADR-008）**：本文件只允许查询
 *   nodes / edges / tag_members
 * 这三张表。账户、令牌、会话、申请、审计等私域表一律不得出现在这里 ——
 * tests/read-model.test.mjs 会做源码级断言来钉死这条约束。
 * 私有数据不是被"过滤掉"，而是**从来没有进入过导出路径**。
 */

import { nowIso } from "./config.mjs";
import { PUBLISHED_ONLY, parseProfile, q } from "./db.mjs";

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

/** 快照与 API 里都绝不允许出现的键（第二道防线，给 CI 的敏感字段扫描用） */
export const FORBIDDEN_KEYS = new Set([
  "account", "accounts", "token", "tokens", "tokenhash", "hash", "email",
  "totp", "totpsecret", "recoverycodes", "session", "sessions", "pin",
  "notes", "sourcepath", "sourcepath", "applications", "invitations", "auditlog", "audit_log",
]);

export const encodeCursor = (offset) => Buffer.from(String(offset), "utf8").toString("base64url");

export function decodeCursor(cursor) {
  if (!cursor) return 0;
  const value = Number(Buffer.from(String(cursor), "base64url").toString("utf8"));
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

export function clampLimit(raw, fallback = DEFAULT_LIMIT, max = MAX_LIMIT) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.floor(value), max);
}

const title = (profile) => profile?.i18n?.zh?.title ?? profile?.i18n?.en?.title ?? null;

/* ───────────────── 节点 ───────────────── */

/** 公开节点视图：profile 本身即公开数据，这里只做投影与补边 */
export function publicNode(db, row, { withEdges = false } = {}) {
  const node = parseProfile(row);
  if (withEdges) {
    node.edges = q.all(
      db,
      "SELECT rel, to_id AS \"to\", ord, role, char, since, until, status, note FROM edges WHERE from_id = ? ORDER BY rel, ord, to_id",
      row.id,
    );
    node.incoming = q.all(
      db,
      "SELECT rel, from_id AS \"from\", ord, role, char, since, until, status, note FROM edges WHERE to_id = ? ORDER BY rel, ord, from_id",
      row.id,
    );
  }
  return node;
}

export function findPublishedNode(db, id, { withEdges = true } = {}) {
  const row = q.get(db, `SELECT n.* FROM nodes n WHERE n.id = ? AND ${PUBLISHED_ONLY}`, id);
  return row ? publicNode(db, row, { withEdges }) : null;
}

/**
 * 已发布节点列表。
 * @param {{ kind?:string, tag?:string, state?:string, q?:string, limit?:number, offset?:number }} filter
 */
export function listPublishedNodes(db, { kind, tag, state, search, limit = DEFAULT_LIMIT, offset = 0 } = {}) {
  const where = [PUBLISHED_ONLY];
  const params = [];
  if (kind) { where.push("n.kind = ?"); params.push(kind); }
  if (tag) { where.push("n.id IN (SELECT node_id FROM tag_members WHERE tag_id = ?)"); params.push(tag); }
  if (state) { where.push("json_extract(n.profile_json, '$.facets.state') = ?"); params.push(state); }
  if (search) { where.push("n.profile_json LIKE ?"); params.push(`%${search}%`); }

  const clause = where.join(" AND ");
  const total = q.get(db, `SELECT COUNT(*) AS c FROM nodes n WHERE ${clause}`, ...params).c;
  const rows = q.all(
    db,
    `SELECT n.* FROM nodes n WHERE ${clause} ORDER BY n.updated_at DESC, n.id LIMIT ? OFFSET ?`,
    ...params, limit, offset,
  );
  return {
    items: rows.map((row) => publicNode(db, row)),
    total,
    limit,
    nextCursor: offset + limit < total ? encodeCursor(offset + limit) : null,
  };
}

/** 快照用：全部已发布节点（含边，便于详情页离线可用） */
export function allPublishedNodes(db) {
  const rows = q.all(
    db,
    `SELECT n.* FROM nodes n WHERE ${PUBLISHED_ONLY} ORDER BY n.id`,
  );
  return rows.map((row) => publicNode(db, row, { withEdges: true }));
}

export function listAllEdges(db) {
  return q.all(
    db,
    `SELECT e.from_id AS "from", e.rel, e.to_id AS "to", e.ord, e.role, e.char, e.since, e.until, e.status, e.note
     FROM edges e
     JOIN nodes a ON a.id = e.from_id AND a.published_revision_id IS NOT NULL
     JOIN nodes b ON b.id = e.to_id AND b.published_revision_id IS NOT NULL
     ORDER BY e.from_id, e.rel, e.to_id`,
  );
}

/* ───────────────── 作者 ───────────────── */

export function listPublishedAuthors(db, { limit = DEFAULT_LIMIT, offset = 0 } = {}) {
  const total = q.get(db, `SELECT COUNT(*) AS c FROM nodes n WHERE n.kind IN ('person','team') AND ${PUBLISHED_ONLY}`).c;
  const rows = q.all(
    db,
    `SELECT n.* FROM nodes n WHERE n.kind IN ('person','team') AND ${PUBLISHED_ONLY}
     ORDER BY json_extract(n.profile_json, '$.name'), n.id LIMIT ? OFFSET ?`,
    limit, offset,
  );
  return {
    items: rows.map((row) => publicNode(db, row)),
    total,
    limit,
    nextCursor: offset + limit < total ? encodeCursor(offset + limit) : null,
  };
}

export function findAuthor(db, id) {
  const row = q.get(db, `SELECT n.* FROM nodes n WHERE n.id = ? AND n.kind IN ('person','team') AND ${PUBLISHED_ONLY}`, id);
  if (!row) return null;
  const related = (rel) => q.all(
    db,
    `SELECT e.to_id AS id, e.role, e.char, n.profile_json FROM edges e JOIN nodes n ON n.id = e.to_id
     WHERE e.from_id = ? AND e.rel = ? AND n.published_revision_id IS NOT NULL ORDER BY e.to_id`,
    id, rel,
  ).map((entry) => ({
    id: entry.id,
    role: entry.role ?? null,
    char: entry.char ?? null,
    title: title(JSON.parse(entry.profile_json)),
  }));
  return {
    author: publicNode(db, row),
    maintained: related("maintains"),
    authored: related("authored"),
    members: q.all(db, "SELECT to_id AS id FROM edges WHERE from_id = ? AND rel = 'member' ORDER BY to_id", id).map((row2) => row2.id),
  };
}

/* ───────────────── 标签 ───────────────── */

/** 零成员标签不进公开列表（§5.1.2） */
export function listTags(db) {
  return q.all(
    db,
    `SELECT t.id, t.profile_json, COUNT(m.node_id) AS members
     FROM nodes t LEFT JOIN tag_members m ON m.tag_id = t.id
     WHERE t.kind = 'tag' AND t.published_revision_id IS NOT NULL
     GROUP BY t.id HAVING members > 0 ORDER BY members DESC, t.id`,
  ).map((row) => ({ id: row.id, title: title(JSON.parse(row.profile_json)) ?? row.id, members: row.members }));
}

export function findTag(db, id) {
  const row = q.get(db, `SELECT n.* FROM nodes n WHERE n.id = ? AND n.kind = 'tag' AND ${PUBLISHED_ONLY}`, id);
  if (!row) return null;
  const members = q.get(db, "SELECT COUNT(*) AS c FROM tag_members WHERE tag_id = ?", id).c;
  return { ...publicNode(db, row), memberCount: members };
}

export function tagMembers(db, tagId) {
  return q.all(
    db,
    `SELECT n.* FROM tag_members m JOIN nodes n ON n.id = m.node_id
     WHERE m.tag_id = ? AND n.published_revision_id IS NOT NULL ORDER BY n.updated_at DESC, n.id`,
    tagId,
  ).map((row) => publicNode(db, row));
}

/** 物化标签成员（供静态兜底页使用） */
export function materializedTagMembers(db) {
  const rows = q.all(
    db,
    `SELECT m.tag_id AS tagId, m.node_id AS nodeId
     FROM tag_members m
     JOIN nodes t ON t.id = m.tag_id AND t.published_revision_id IS NOT NULL
     JOIN nodes n ON n.id = m.node_id AND n.published_revision_id IS NOT NULL
     ORDER BY m.tag_id, m.node_id`,
  );
  const grouped = {};
  for (const row of rows) (grouped[row.tagId] ??= []).push(row.nodeId);
  return grouped;
}

/* ───────────────── 状态与时间轴 ───────────────── */

export function buildStatus(db, { generatedAt = nowIso() } = {}) {
  const byKind = Object.fromEntries(q.all(db, "SELECT kind, COUNT(*) AS c FROM nodes GROUP BY kind").map((row) => [row.kind, row.c]));
  const byRel = Object.fromEntries(q.all(db, "SELECT rel, COUNT(*) AS c FROM edges GROUP BY rel").map((row) => [row.rel, row.c]));
  const revisions = Object.fromEntries(q.all(db, "SELECT status, COUNT(*) AS c FROM revisions GROUP BY status").map((row) => [row.status, row.c]));
  const published = q.get(db, `SELECT COUNT(*) AS c FROM nodes n WHERE ${PUBLISHED_ONLY}`).c;

  return {
    schema: 1,
    generatedAt,
    nodes: {
      total: Object.values(byKind).reduce((sum, value) => sum + value, 0),
      byKind,
      published,
    },
    edges: byRel,
    revisions,
    sources: { storage: "sqlite", snapshot: "pending" },
  };
}

export function buildTimeline(db, { limit = DEFAULT_LIMIT } = {}) {
  const edges = q.all(
    db,
    `SELECT e.since AS at, e.rel, e.status, e.to_id AS id, n.profile_json
     FROM edges e JOIN nodes n ON n.id = e.to_id
     WHERE e.since IS NOT NULL AND n.published_revision_id IS NOT NULL
     ORDER BY e.since DESC LIMIT ?`,
    limit,
  ).map((row) => ({ at: row.at, rel: row.rel, status: row.status, id: row.id, title: title(JSON.parse(row.profile_json)) }));

  if (edges.length) return { source: "edges", items: edges };

  const created = q.all(
    db,
    // 加 id 作为次序打断：种子里所有 created_at 相同（固定时间戳），
    // 只按时间排序时 SQLite 的返回顺序是未定义的，快照就不可复现了
    `SELECT n.created_at AS at, n.id, n.profile_json FROM nodes n
     WHERE ${PUBLISHED_ONLY} ORDER BY n.created_at DESC, n.id LIMIT ?`,
    limit,
  ).map((row) => ({ at: row.at, rel: "created", status: null, id: row.id, title: title(JSON.parse(row.profile_json)) }));

  return { source: "created_at", items: created };
}

/* ───────────────── L1 快照 ───────────────── */

/**
 * 组装 L1 元数据快照。
 * 形状与前端 `.vitepress/vue/tavern/api.mjs` 约定一致：
 *   { schema, generatedAt, status, nodes, tags, timeline, tagMembers, edges }
 */
export function buildSnapshot(db, { generatedAt = nowIso(), timelineLimit = 40 } = {}) {
  const status = buildStatus(db, { generatedAt });
  status.sources = { storage: "sqlite", snapshot: "generated" };
  return {
    schema: 1,
    generatedAt,
    status,
    nodes: allPublishedNodes(db),
    edges: listAllEdges(db),
    tags: listTags(db),
    tagMembers: materializedTagMembers(db),
    timeline: buildTimeline(db, { limit: timelineLimit }).items,
  };
}

/** 递归找出不该出现的键（给 CI 的敏感字段扫描用，也是自检） */
export function findForbiddenKeys(value, pathPrefix = "") {
  const found = [];
  const walk = (node, prefix) => {
    if (Array.isArray(node)) {
      node.forEach((entry, index) => walk(entry, `${prefix}[${index}]`));
      return;
    }
    if (!node || typeof node !== "object") return;
    for (const [key, child] of Object.entries(node)) {
      const lower = key.toLowerCase();
      const path = prefix ? `${prefix}.${key}` : key;
      if (FORBIDDEN_KEYS.has(lower)) found.push(path);
      walk(child, path);
    }
  };
  walk(value, pathPrefix);
  return found;
}

/**
 * 稳定序列化：**一行一个元素**，避免无意义的 diff（§10.5）。
 *
 * 为什么不用 `JSON.stringify(x, null, 1)`：
 * 那样每个数组元素、每个键都占一行，这份快照会膨胀到 1 万多行，
 * 每次同步产生的 diff 巨大且无法阅读。改成"一个节点/一条边/一个标签一行"后，
 * diff 会精确指到变化的那几条记录，而文件本身也只有几百行。
 */
export function serializeSnapshot(snapshot) {
  const lines = [];
  lines.push("{");
  lines.push(` "schema": ${JSON.stringify(snapshot.schema)},`);
  lines.push(` "generatedAt": ${JSON.stringify(snapshot.generatedAt)},`);
  lines.push(` "status": ${JSON.stringify(snapshot.status)},`);

  const arrayBlock = (key, items) => {
    if (!items.length) {
      lines.push(` ${JSON.stringify(key)}: [],`);
      return;
    }
    lines.push(` ${JSON.stringify(key)}: [`);
    items.forEach((item, index) => {
      const comma = index === items.length - 1 ? "" : ","; // 末项不能有逗号，否则不是合法 JSON
      lines.push(`  ${JSON.stringify(item)}${comma}`);
    });
    lines.push(" ],");
  };

  arrayBlock("nodes", snapshot.nodes);
  arrayBlock("edges", snapshot.edges);
  arrayBlock("tags", snapshot.tags);
  arrayBlock("timeline", snapshot.timeline);

  // tagMembers 是 { 标签 id: [节点 id...] }，一个标签一行
  const members = Object.entries(snapshot.tagMembers ?? {});
  if (!members.length) {
    lines.push(' "tagMembers": {}');
  } else {
    lines.push(' "tagMembers": {');
    members.forEach(([tagId, ids], index) => {
      const comma = index === members.length - 1 ? "" : ",";
      lines.push(`  ${JSON.stringify(tagId)}: ${JSON.stringify(ids)}${comma}`);
    });
    lines.push(" }");
  }

  lines.push("}");
  return `${lines.join("\n")}\n`;
}
