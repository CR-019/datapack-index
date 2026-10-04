-- 酒馆看板 · 初始 schema
-- 对应设计文档《酒馆看板 · 需求与设计说明书》§16 附录 B
--
-- 分域原则（ADR-008）：
--   公开域 = nodes / edges        → 快照与公开接口只读这两张表
--   流程域 = revisions / assets
--   私有域 = accounts / tokens / sessions / recovery_codes → 永不导出

PRAGMA foreign_keys = ON;

-- ─────────────────────────── 公开域 ───────────────────────────

CREATE TABLE IF NOT EXISTS nodes (
  id                    TEXT PRIMARY KEY,
  kind                  TEXT NOT NULL CHECK (kind IN ('project','event','index','tag','person','team')),
  profile_json          TEXT NOT NULL,          -- 只存公开 profile
  published_revision_id TEXT,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_nodes_kind ON nodes(kind);

CREATE TABLE IF NOT EXISTS edges (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  from_id    TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  rel        TEXT NOT NULL CHECK (rel IN ('parent','includes','related','depends','submitted','authored','maintains','member')),
  to_id      TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  ord        INTEGER,
  role       TEXT,        -- 仅 maintains: owner | editor
  char       TEXT,        -- 仅 authored: 署名角色
  since      TEXT,
  until      TEXT,
  status     TEXT,
  note       TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (from_id, rel, to_id)
);
CREATE INDEX IF NOT EXISTS idx_edges_from ON edges(from_id, rel);
CREATE INDEX IF NOT EXISTS idx_edges_to   ON edges(to_id, rel);

-- ─────────────────────────── 流程域 ───────────────────────────

CREATE TABLE IF NOT EXISTS revisions (
  id               TEXT PRIMARY KEY,
  node_id          TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  author_id        TEXT,                        -- 提交者（主体节点 id）
  base_revision_id TEXT,                        -- 乐观锁基线
  snapshot_json    TEXT NOT NULL,
  status           TEXT NOT NULL CHECK (status IN ('pending','published','rejected','superseded')),
  review_note      TEXT,
  created_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_revisions_node   ON revisions(node_id, created_at);
CREATE INDEX IF NOT EXISTS idx_revisions_status ON revisions(status, created_at);

CREATE TABLE IF NOT EXISTS assets (
  id          TEXT PRIMARY KEY,
  node_id     TEXT NOT NULL,
  revision_id TEXT REFERENCES revisions(id) ON DELETE CASCADE,
  path        TEXT NOT NULL,                    -- pending 与 published 物理前缀分离
  sha256      TEXT NOT NULL,
  size        INTEGER NOT NULL,
  mime        TEXT,
  visibility  TEXT NOT NULL CHECK (visibility IN ('pending','published')),
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assets_sha    ON assets(sha256);
CREATE INDEX IF NOT EXISTS idx_assets_rev    ON assets(revision_id, visibility);

-- ─────────────────────────── 私有域（永不导出） ───────────────────────────

CREATE TABLE IF NOT EXISTS accounts (
  id          TEXT PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
  pin         TEXT NOT NULL UNIQUE,             -- 用户名，唯一且不可变
  role        TEXT NOT NULL CHECK (role IN ('staff','author','bot')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  email       TEXT,
  totp_secret TEXT,                             -- 可选强化
  notes       TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tokens (
  id           TEXT PRIMARY KEY,
  account_id   TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,
  hash         TEXT NOT NULL UNIQUE,            -- sha256(token + pepper)，只存哈希
  created_at   TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_tokens_account ON tokens(account_id, revoked_at);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  account_id   TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_id     TEXT REFERENCES tokens(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL,
  expires_at   TEXT NOT NULL,
  last_seen_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_account ON sessions(account_id);

CREATE TABLE IF NOT EXISTS recovery_codes (
  id         TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  hash       TEXT NOT NULL,
  used_at    TEXT
);

CREATE TABLE IF NOT EXISTS applications (
  id          TEXT PRIMARY KEY,
  applicant   TEXT NOT NULL,
  contact     TEXT NOT NULL,
  claim_target TEXT,                            -- 想认领的作者档案或项目
  evidence    TEXT,                             -- GitHub / B站 等核对材料
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'submitted'
              CHECK (status IN ('submitted','approved','rejected','activated','expired')),
  review_note TEXT,
  reviewed_by TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status, created_at);

CREATE TABLE IF NOT EXISTS invitations (
  id             TEXT PRIMARY KEY,
  application_id TEXT REFERENCES applications(id) ON DELETE SET NULL,
  node_id        TEXT NOT NULL,
  token_hash     TEXT NOT NULL,                 -- 一次性激活链接的哈希
  expires_at     TEXT NOT NULL,
  used_at        TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id   TEXT,
  token_id   TEXT,
  action     TEXT NOT NULL,
  target     TEXT,
  diff_json  TEXT,
  reason     TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor   ON audit_log(actor_id, created_at);

-- ─────────────────────────── 标签 ───────────────────────────

CREATE TABLE IF NOT EXISTS tag_aliases (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  alias            TEXT NOT NULL UNIQUE,
  canonical_tag_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  created_by       TEXT,
  created_at       TEXT NOT NULL
);

-- 派生表：可由 nodes.tags + tag_aliases 随时重算，删除无损失
CREATE TABLE IF NOT EXISTS tag_members (
  tag_id      TEXT NOT NULL,
  node_id     TEXT NOT NULL,
  computed_at TEXT NOT NULL,
  PRIMARY KEY (tag_id, node_id)
);

-- 迁移记录
CREATE TABLE IF NOT EXISTS schema_migrations (
  id         TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
