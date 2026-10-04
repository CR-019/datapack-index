#!/usr/bin/env node
/**
 * 种子数据：把图书馆既有资产导入酒馆看板，让模型一跑起来就是真实数据。
 *
 *   1) public/authors/*.json   → person 节点（作者，展示面 + 署名面）
 *   2) wheel/resources/*.md    → project 节点 + authored / maintains 边
 *   3) 上面出现的标签           → tag 节点 + tag_members 物化（§5.1.2）
 *
 * 只做**单向读取**主仓库，不反向依赖其代码 —— 这样将来把 tavern-server
 * 拆成独立项目只需要一次 `mv`（见 README「为什么先不拆仓库」）。
 */

import fs from "node:fs";
import path from "node:path";

import { REPO_ROOT, config } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";

const AUTHORS_DIR = path.join(REPO_ROOT, "public", "authors");
const WHEEL_DIR = path.join(REPO_ROOT, "wheel", "resources");

/* ───────────────── 极简 frontmatter 解析（够用即可，不引入 YAML 依赖） ───────────────── */

function unquote(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseInlineList(value) {
  const inner = value.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((item) => unquote(item)).filter(Boolean);
}

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return null;

  const data = { author: [] };
  let inAuthor = false;
  let listKey = null;
  let currentAuthor = null;

  for (const raw of match[1].split(/\r?\n/)) {
    if (!raw.trim()) continue;
    const indented = /^\s/.test(raw);

    if (!indented) {
      listKey = null;
      const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(raw.trim());
      if (!kv) continue;
      const [, key, value] = kv;
      inAuthor = key === "author";
      if (inAuthor) continue;
      if (value.trim() === "") { listKey = key; data[key] = []; continue; }
      data[key] = unquote(value);
      continue;
    }

    const item = /^\s*-\s*(.*)$/.exec(raw);
    if (inAuthor) {
      const nameMatch = /^\s*name\s*:\s*(.*)$/.exec(raw);
      const charMatch = /^\s*char\s*:\s*(.*)$/.exec(raw);
      if (nameMatch) {
        currentAuthor = { name: unquote(nameMatch[1]) };
        data.author.push(currentAuthor);
      } else if (charMatch && currentAuthor) {
        currentAuthor.char = unquote(charMatch[1]);
      }
      continue;
    }
    if (listKey && item) {
      const value = unquote(item[1]);
      if (value) data[listKey].push(value);
    }
  }

  // 行内数组形式
  for (const key of ["tags", "gameversion"]) {
    if (typeof data[key] === "string") data[key] = parseInlineList(data[key]);
  }
  return data;
}

/* ───────────────── 写入 ───────────────── */

/**
 * 固定的种子时间戳。
 *
 * 为什么不用 now()：种子数据要能**复现**，否则由它导出的 L1 快照每次都不同，
 * 仓库里的快照就无法核对（CI 里那条 `git diff --exit-code` 会永远失败）。
 * 需要真实时间时可用 TAVERN_SEED_TIME 覆盖。
 */
const SEED_TIME = process.env.TAVERN_SEED_TIME ?? "2026-01-01T00:00:00.000Z";

function publishNode(db, { id, kind, profile, authorId = null }) {
  const ts = SEED_TIME;
  q.run(
    db,
    `INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, profile_json = excluded.profile_json, updated_at = excluded.updated_at`,
    id, kind, JSON.stringify(profile), ts, ts,
  );
  const revisionId = `seed_${id}_1`;
  q.run(
    db,
    `INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, created_at) VALUES (?, ?, ?, ?, 'published', ?)
     ON CONFLICT(id) DO UPDATE SET snapshot_json = excluded.snapshot_json`,
    revisionId, id, authorId, JSON.stringify(profile), ts,
  );
  q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", revisionId, id);
}

function addEdge(db, { from, rel, to, ord = null, role = null, char = null, since = null, status = null, note = null }) {
  q.run(
    db,
    `INSERT INTO edges (from_id, rel, to_id, ord, role, char, since, status, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(from_id, rel, to_id) DO UPDATE SET
       ord = excluded.ord, role = excluded.role, char = excluded.char, since = excluded.since, note = excluded.note`,
    from, rel, to, ord, role, char, since, status, note, SEED_TIME,
  );
}

/* ───────────────── 主流程 ───────────────── */

if (!fs.existsSync(AUTHORS_DIR) || !fs.existsSync(WHEEL_DIR)) {
  process.stderr.write(
    `✖ 找不到既有数据目录。\n  authors: ${AUTHORS_DIR}\n  wheel:   ${WHEEL_DIR}\n` +
    "  若主仓库不在上一级目录，请设置 TAVERN_REPO_ROOT 指向 datapack-index 根目录。\n",
  );
  process.exit(1);
}

const db = openDatabase();
const stats = { authors: 0, authorSkipped: 0, projects: 0, wheelSkipped: 0, authoredEdges: 0, maintainsEdges: 0, tags: 0, memberships: 0 };

/** 标签规范化：大小写不敏感去重，保留首次出现的写法（§5.1.2 防线 4 的最小实现） */
const tagByKey = new Map();
const tagCollisions = new Set();

function canonicalTag(raw) {
  const text = String(raw).trim().normalize("NFC");
  if (!text) return null;
  const key = text.toLowerCase();
  if (!tagByKey.has(key)) tagByKey.set(key, text);
  else if (tagByKey.get(key) !== text) tagCollisions.add(`${tagByKey.get(key)} / ${text}`);
  return tagByKey.get(key);
}

db.exec("BEGIN");
try {
  /* ① 作者 → person 节点 */
  const authorFiles = fs.readdirSync(AUTHORS_DIR).filter((file) => file.endsWith(".json")).sort();
  for (const file of authorFiles) {
    const key = file.replace(/\.json$/, "");
    let profile;
    try {
      profile = JSON.parse(fs.readFileSync(path.join(AUTHORS_DIR, file), "utf8"));
    } catch {
      stats.authorSkipped += 1;
      continue;
    }
    if (!profile?.name) { stats.authorSkipped += 1; continue; }

    publishNode(db, {
      id: `person:${key}`,
      kind: "person",
      profile: {
        name: profile.name,
        avatar: profile.avatar ?? null,
        socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [],
        i18n: { zh: { title: profile.name } },
        facets: { state: "active" },
      },
    });
    stats.authors += 1;
  }

  /* ② 前置馆条目 → project 节点 + 边 */
  const wheelFiles = fs.readdirSync(WHEEL_DIR).filter((file) => file.endsWith(".md")).sort();
  for (const file of wheelFiles) {
    const slug = file.replace(/\.md$/, "");
    const data = parseFrontmatter(fs.readFileSync(path.join(WHEEL_DIR, file), "utf8"));
    if (!data?.name) { stats.wheelSkipped += 1; continue; }

    // 去重：既有数据里确实存在重复标签（如 wheel/resources/TL_lite.md 的 ["对话框","对话框","动画"]）
    const tags = [...new Set((data.tags ?? []).map(canonicalTag).filter(Boolean).map((tag) => tag.toLowerCase()))]
      .map((key) => tagByKey.get(key));
    const gameversion = data.gameversion ?? [];

    publishNode(db, {
      id: `project:${slug}`,
      kind: "project",
      profile: {
        i18n: { zh: { title: data.name, summary: data.description ?? "" } },
        tags,
        facets: { game: gameversion, state: "active" },
        links: [{ label: "前置馆页面", url: `/wheel/resources/${slug}.html` }],
        repo: data.repo ?? null,
      },
    });
    stats.projects += 1;

    const authors = (data.author ?? []).filter((entry) => entry?.name);
    authors.forEach((entry, index) => {
      const authorId = `person:${entry.name}`;
      if (!q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", authorId)) return; // 作者档案缺失，跳过
      addEdge(db, { from: authorId, rel: "authored", to: `project:${slug}`, char: entry.char ?? "作者", ord: index + 1 });
      stats.authoredEdges += 1;
      if (index === 0) {
        // 首个作者默认拥有维护权，满足"每个已发布条目至少一条 maintains 边"（§5.5 不变量 11）
        addEdge(db, { from: authorId, rel: "maintains", to: `project:${slug}`, role: "owner" });
        stats.maintainsEdges += 1;
      }
    });
  }

  /* ③ 标签节点 + 成员物化 */
  for (const [key, text] of tagByKey) {
    const tagId = `tag:${key}`;
    publishNode(db, {
      id: tagId,
      kind: "tag",
      profile: { i18n: { zh: { title: text } }, rules: { mode: "query", expr: `tags ⊇ ${text}` } },
    });
    stats.tags += 1;
  }

  const projects = q.all(db, "SELECT id, profile_json FROM nodes WHERE kind = 'project'");
  // 注意：project.id 已含 project: 前缀
  for (const project of projects) {
    const profile = JSON.parse(project.profile_json);
    for (const tag of profile.tags ?? []) {
      const tagId = `tag:${String(tag).toLowerCase()}`;
      q.run(
        db,
        "INSERT OR REPLACE INTO tag_members (tag_id, node_id, computed_at) VALUES (?, ?, ?)",
        tagId, project.id, SEED_TIME,
      );
      stats.memberships += 1;
    }
  }

  q.run(
    db,
    "INSERT INTO audit_log (action, target, reason, created_at) VALUES ('seed.import', ?, ?, ?)",
    REPO_ROOT,
    `authors=${stats.authors} projects=${stats.projects}`,
    SEED_TIME,
  );

  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

process.stdout.write(
  `\n✔ 种子数据导入完成\n\n` +
  `   作者（person）      ${stats.authors}${stats.authorSkipped ? `（跳过 ${stats.authorSkipped}）` : ""}\n` +
  `   条目（project）     ${stats.projects}${stats.wheelSkipped ? `（跳过 ${stats.wheelSkipped}）` : ""}\n` +
  `   authored 边         ${stats.authoredEdges}\n` +
  `   maintains 边        ${stats.maintainsEdges}\n` +
  `   标签（tag）         ${stats.tags}\n` +
  `   标签成员（物化）     ${stats.memberships}\n` +
  (tagCollisions.size
    ? `\n   ⚠️ 大小写冲突的标签 ${tagCollisions.size} 组（正是 §5.1.2 要防的污染，建议后续并入同一标签）：\n` +
      [...tagCollisions].slice(0, 8).map((line) => `      · ${line}\n`).join("")
    : "") +
  `\n   看看结果：curl -s 'http://${config.host}:${config.port}/v1/status'\n\n`,
);

db.close();
