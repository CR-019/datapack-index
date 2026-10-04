/**
 * 备份与恢复（设计文档 §11.4）。
 *
 * 为什么这件事比看上去重要：后端是**唯一真源**之后，服务器磁盘就等于全部投稿
 * 与全部身份。设计文档把"只有本机一份"列为不可接受，所以这里做三件事：
 *
 *   1. **一致性快照**：用 SQLite 的 `VACUUM INTO` 取库（等价于 .backup，在线安全），
 *      不是简单复制文件（WAL 模式下复制会拿到损坏或过期的库）。
 *   2. **清单与校验**：每个文件记 sha256，恢复前先验证 —— 备份不可验证等于没有备份。
 *   3. **恢复演练**：restore 默认只做**演练**（还原到临时目录并跑完整性检查），
 *      覆盖线上数据必须显式 --force。没演练过的备份不算备份。
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { nowIso } from "./config.mjs";
import { openDatabase, q } from "./db.mjs";

export class BackupError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "BackupError";
    this.code = code;
  }
}

export const MANIFEST_NAME = "MANIFEST.json";

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function copyTree(source, target) {
  if (!fs.existsSync(source)) return 0;
  let count = 0;
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) {
      count += copyTree(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
      count += 1;
    }
  }
  return count;
}

function stamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}

/**
 * 生成一份备份包。
 * @param {{ db, dataDir: string, destDir: string, snapshotPath?: string, label?: string }} input
 */
export function createBackup({ db, dataDir, destDir, snapshotPath = null, label = null }) {
  const bundle = path.join(destDir, `tavern-${stamp()}`);
  if (fs.existsSync(bundle)) throw new BackupError("exists", `备份目录已存在：${bundle}`);
  fs.mkdirSync(bundle, { recursive: true });

  // ① 数据库：VACUUM INTO 产出的是**一致**的副本（WAL 下直接 copy 文件会坏）
  const dbFile = path.join(bundle, "tavern.db");
  db.exec(`VACUUM INTO '${dbFile.replaceAll("'", "''")}'`);

  // ② 投稿原件（内容寻址的 inbox）—— 作者当初提交的那个包，争议时是证据
  const inboxDir = path.join(dataDir, "inbox");
  const inboxCount = copyTree(inboxDir, path.join(bundle, "inbox"));

  // ③ L1 快照（如果存在）
  let snapshotCopied = false;
  if (snapshotPath && fs.existsSync(snapshotPath)) {
    fs.mkdirSync(path.join(bundle, "snapshot"), { recursive: true });
    fs.copyFileSync(snapshotPath, path.join(bundle, "snapshot", path.basename(snapshotPath)));
    snapshotCopied = true;
  }

  // ④ 记账：数量和几条关键计数，恢复后要能对上
  const counts = {
    nodes: q.get(db, "SELECT COUNT(*) AS c FROM nodes").c,
    publishedNodes: q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE published_revision_id IS NOT NULL").c,
    edges: q.get(db, "SELECT COUNT(*) AS c FROM edges").c,
    revisions: q.get(db, "SELECT COUNT(*) AS c FROM revisions").c,
    accounts: q.get(db, "SELECT COUNT(*) AS c FROM accounts").c,
    tokens: q.get(db, "SELECT COUNT(*) AS c FROM tokens").c,
  };

  const manifest = {
    schema: 1,
    createdAt: nowIso(),
    label,
    counts,
    inboxFiles: inboxCount,
    snapshotIncluded: snapshotCopied,
    files: {},
  };

  const record = (relative) => {
    const full = path.join(bundle, relative);
    manifest.files[relative] = { sha256: sha256File(full), size: fs.statSync(full).size };
  };
  record("tavern.db");
  for (const name of fs.existsSync(path.join(bundle, "inbox")) ? fs.readdirSync(path.join(bundle, "inbox")) : []) {
    const full = path.join(bundle, "inbox", name);
    if (fs.statSync(full).isFile()) record(path.join("inbox", name));
  }
  if (snapshotCopied) {
    record(path.join("snapshot", path.basename(snapshotPath)));
  }

  fs.writeFileSync(path.join(bundle, MANIFEST_NAME), `${JSON.stringify(manifest, null, 1)}\n`, "utf8");
  return { bundle, manifest };
}

/** 校验备份包：清单存在、每个文件都能对上 sha256 */
export function verifyBundle(bundleDir) {
  const manifestPath = path.join(bundleDir, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) throw new BackupError("no_manifest", `缺少 ${MANIFEST_NAME}：${bundleDir}`);

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    throw new BackupError("bad_manifest", `${MANIFEST_NAME} 不是合法 JSON`);
  }

  const problems = [];
  for (const [relative, expected] of Object.entries(manifest.files ?? {})) {
    const full = path.join(bundleDir, relative);
    if (!fs.existsSync(full)) {
      problems.push({ file: relative, reason: "缺失" });
      continue;
    }
    const actual = sha256File(full);
    if (actual !== expected.sha256) problems.push({ file: relative, reason: "内容与清单不符（可能损坏）" });
  }

  return { ok: problems.length === 0, problems, manifest };
}

/**
 * 恢复。默认是**演练**：还原到目标目录（默认临时目录）并跑完整性检查，
 * 不会碰线上数据。要覆盖线上必须 force。
 */
export function restoreBundle(bundleDir, targetDir, { force = false, drill = null } = {}) {
  const verified = verifyBundle(bundleDir);
  if (!verified.ok) {
    throw new BackupError("verify_failed", `备份校验未通过：${verified.problems.map((p) => `${p.file}（${p.reason}）`).join("；")}`);
  }

  const target = path.resolve(targetDir);
  const existing = fs.existsSync(target) ? fs.readdirSync(target) : [];
  if (existing.length && !force) {
    throw new BackupError("target_not_empty", `目标目录非空：${target}（确认要覆盖请加 --force）`);
  }

  fs.mkdirSync(target, { recursive: true });
  const dbTarget = path.join(target, "tavern.db");
  if (fs.existsSync(dbTarget)) fs.rmSync(dbTarget);
  fs.copyFileSync(path.join(bundleDir, "tavern.db"), dbTarget);

  const inboxCount = copyTree(path.join(bundleDir, "inbox"), path.join(target, "inbox"));
  const snapshotDir = path.join(bundleDir, "snapshot");
  let snapshotRestored = false;
  if (fs.existsSync(snapshotDir)) {
    fs.mkdirSync(path.join(target, "snapshot"), { recursive: true });
    copyTree(snapshotDir, path.join(target, "snapshot"));
    snapshotRestored = true;
  }

  // 演练检查：打开的库要能过完整性检查，且计数与清单一致
  const db = openDatabase(dbTarget);
  let integrity;
  try {
    integrity = q.get(db, "PRAGMA integrity_check").integrity_check;
    const counts = {
      nodes: q.get(db, "SELECT COUNT(*) AS c FROM nodes").c,
      publishedNodes: q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE published_revision_id IS NOT NULL").c,
      edges: q.get(db, "SELECT COUNT(*) AS c FROM edges").c,
      revisions: q.get(db, "SELECT COUNT(*) AS c FROM revisions").c,
      accounts: q.get(db, "SELECT COUNT(*) AS c FROM accounts").c,
      tokens: q.get(db, "SELECT COUNT(*) AS c FROM tokens").c,
    };
    const mismatches = Object.entries(verified.manifest.counts ?? {})
      .filter(([key, value]) => counts[key] !== value)
      .map(([key, value]) => `${key}: 清单 ${value} vs 恢复后 ${counts[key]}`);

    return {
      target,
      integrity,
      healthy: integrity === "ok" && mismatches.length === 0,
      mismatches,
      counts,
      expected: verified.manifest.counts,
      inboxFiles: inboxCount,
      snapshotRestored,
      createdAt: verified.manifest.createdAt,
      drill: drill ?? target !== path.resolve(process.env.TAVERN_DATA_DIR ?? "")
    };
  } finally {
    db.close();
  }
}

/** 保留最近 N 份备份，其余删除（服务器磁盘很小，这一步不是可选项） */
export function pruneBackups(destDir, keep = 30) {
  if (!fs.existsSync(destDir)) return { removed: [] };
  const bundles = fs
    .readdirSync(destDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("tavern-"))
    .map((entry) => entry.name)
    .sort(); // 名字含时间戳，字典序即时间序
  const removed = bundles.slice(0, Math.max(0, bundles.length - keep));
  for (const name of removed) fs.rmSync(path.join(destDir, name), { recursive: true, force: true });
  return { removed, kept: bundles.length - removed.length };
}
