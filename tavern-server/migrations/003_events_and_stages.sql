-- 003：事件流（ADR-009）+ 阶段 kind（ADR-010）
--
-- ⚠️ 本文件会在**外键强制关闭**的状态下执行（见 db.mjs 的 applyMigrations）。
--    原因：放宽 nodes.kind 的 CHECK 必须重建表，而 DROP TABLE nodes 在外键开着时
--    会按 ON DELETE CASCADE 把 edges / revisions / accounts 等子表数据一起删掉。
--    迁移跑完后 db.mjs 会执行 PRAGMA foreign_key_check，有违规就拒绝启动。

BEGIN;

-- ───────── ① 事件流：时间线的真相源（ADR-009） ─────────
--
-- 事件是**已发生的事实**，不是内容：
--   · 不可修改，只能追加或作废（voided_at）
--   · at 不得晚于现在（未来的时间点属于 facets.time）
--   · kind='state' 的事件是 facets.state 投影的唯一来源
--   · visibility 预留内部事件的位置（设计文档 §14 待决问题 22）

CREATE TABLE IF NOT EXISTS node_events (
  id         TEXT PRIMARY KEY,
  node_id    TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('state','milestone','recruit','relation','note')),
  at         TEXT NOT NULL,
  status     TEXT,
  title      TEXT NOT NULL,
  body       TEXT,
  actor_id   TEXT,
  source     TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','derived','import')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','internal')),
  voided_at  TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_node   ON node_events(node_id, at DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_public ON node_events(visibility, at DESC);

-- ───────── ② 放宽 nodes.kind，接受 'stage'（ADR-010） ─────────

CREATE TABLE nodes_new (
  id                    TEXT PRIMARY KEY,
  kind                  TEXT NOT NULL CHECK (kind IN ('project','event','index','tag','person','team','stage')),
  profile_json          TEXT NOT NULL,
  published_revision_id TEXT,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);

INSERT INTO nodes_new (id, kind, profile_json, published_revision_id, created_at, updated_at)
SELECT id, kind, profile_json, published_revision_id, created_at, updated_at FROM nodes;

DROP TABLE nodes;
ALTER TABLE nodes_new RENAME TO nodes;

CREATE INDEX IF NOT EXISTS idx_nodes_kind ON nodes(kind);

COMMIT;
