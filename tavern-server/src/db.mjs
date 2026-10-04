import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { SERVER_ROOT, config, nowIso } from "./config.mjs";

/**
 * 打开数据库并执行待应用的迁移。
 * 用 Node 24 内置的 node:sqlite —— 零原生依赖（不需要 better-sqlite3 的构建步骤）。
 */
export function openDatabase(dbPath = config.dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  applyMigrations(db);
  return db;
}

export function applyMigrations(db) {
  const dir = path.join(SERVER_ROOT, "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL);");
  const applied = new Set(db.prepare("SELECT id FROM schema_migrations").all().map((row) => row.id));
  const pending = files.filter((file) => !applied.has(file));
  if (!pending.length) return;

  // ⚠️ 迁移期间**关闭外键强制**：放宽 CHECK 之类的变更需要重建表，
  // 而 DROP TABLE nodes 在外键开着时会按 ON DELETE CASCADE 静默删掉子表数据。
  // PRAGMA foreign_keys 在事务内是空操作，所以必须在执行迁移文件之前设置。
  db.exec("PRAGMA foreign_keys = OFF;");
  try {
    for (const file of pending) {
      db.exec(fs.readFileSync(path.join(dir, file), "utf8"));
      db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(file, nowIso());
      process.stdout.write(`[migrate] applied ${file}\n`);
    }
  } finally {
    db.exec("PRAGMA foreign_keys = ON;");
  }

  // 迁移后自检：外键违规就拒绝启动，而不是带着坏数据继续跑
  const violations = db.prepare("PRAGMA foreign_key_check").all();
  if (violations.length) {
    const sample = violations.slice(0, 5).map((row) => `${row.table}(${row.rowid}) → ${row.parent}`).join("；");
    throw new Error(`迁移后检测到 ${violations.length} 处外键违规，拒绝启动：${sample}`);
  }
}

/* ── 便捷包装（保持调用点简短） ── */

export const q = {
  all: (db, sql, ...params) => db.prepare(sql).all(...params),
  get: (db, sql, ...params) => db.prepare(sql).get(...params),
  run: (db, sql, ...params) => db.prepare(sql).run(...params),
};

export function parseProfile(row) {
  if (!row) return null;
  const profile = JSON.parse(row.profile_json);
  return { id: row.id, kind: row.kind, ...profile, publishedRevisionId: row.published_revision_id, updatedAt: row.updated_at };
}

/** 公开接口只能看到"已发布修订"非空的节点（§5.5 不变量 8） */
export const PUBLISHED_ONLY = "n.published_revision_id IS NOT NULL";
