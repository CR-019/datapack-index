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

  for (const file of files) {
    if (applied.has(file)) continue;
    db.exec(fs.readFileSync(path.join(dir, file), "utf8"));
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(file, nowIso());
    process.stdout.write(`[migrate] applied ${file}\n`);
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
