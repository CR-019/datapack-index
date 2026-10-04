import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { BackupError, createBackup, pruneBackups, restoreBundle, verifyBundle } from "../src/backup.mjs";
import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-backup-"));
  const dataDir = path.join(root, "data");
  fs.mkdirSync(path.join(dataDir, "inbox"), { recursive: true });
  const db = openDatabase(path.join(dataDir, "tavern.db"));
  const now = nowIso();

  q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES ('person:A','person','{}',?,?)", now, now);
  q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES ('project:X','project','{}','rev1',?,?)", now, now);
  q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('person:A','maintains','project:X',?)", now);
  q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES ('rev1','project:X','{}','published',?)", now);
  q.run(db, "INSERT INTO accounts (id, pin, role, status, created_at) VALUES ('person:A','a','author','active',?)", now);
  q.run(db, "INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES ('t1','person:A','本机','hash',?)", now);

  // 投稿原件：内容寻址的 zip
  fs.writeFileSync(path.join(dataDir, "inbox", "deadbeef.zip"), Buffer.from("PK\u0003\u0004fake"));
  // 快照文件
  const snapshotPath = path.join(root, "tavern-snapshot.json");
  fs.writeFileSync(snapshotPath, '{"schema":1,"nodes":[]}\n', "utf8");

  return {
    root, dataDir, db, snapshotPath,
    cleanup() {
      db.close();
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

const backup = (ctx, destDir, extra = {}) =>
  createBackup({ db: ctx.db, dataDir: ctx.dataDir, destDir, snapshotPath: ctx.snapshotPath, ...extra });

/* ───────── 备份 ───────── */

test("备份产出数据库 + 投稿原件 + 快照 + 清单", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle, manifest } = backup(ctx, dest);

    assert.ok(fs.existsSync(path.join(bundle, "tavern.db")));
    assert.ok(fs.existsSync(path.join(bundle, "inbox", "deadbeef.zip")));
    assert.ok(fs.existsSync(path.join(bundle, "snapshot", "tavern-snapshot.json")));
    assert.ok(fs.existsSync(path.join(bundle, "MANIFEST.json")));
    assert.equal(manifest.counts.nodes, 2);
    assert.equal(manifest.counts.publishedNodes, 1);
    assert.equal(manifest.counts.tokens, 1, "令牌必须一并备份，否则恢复后所有人要重发");
    assert.equal(manifest.inboxFiles, 1);
    assert.equal(manifest.snapshotIncluded, true);
    assert.ok(manifest.files["tavern.db"].sha256.length === 64);
  } finally {
    ctx.cleanup();
  }
});

test("备份的数据库是**一致快照**（VACUUM INTO，而不是复制文件）", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle } = backup(ctx, dest);
    const copy = openDatabase(path.join(bundle, "tavern.db"));
    try {
      assert.equal(q.get(copy, "PRAGMA integrity_check").integrity_check, "ok");
      assert.equal(q.get(copy, "SELECT COUNT(*) AS c FROM nodes").c, 2);
    } finally {
      copy.close();
    }
  } finally {
    ctx.cleanup();
  }
});

test("verifyBundle 能发现被篡改或缺失的文件", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle } = backup(ctx, dest);
    assert.equal(verifyBundle(bundle).ok, true);

    fs.writeFileSync(path.join(bundle, "inbox", "deadbeef.zip"), "tampered");
    const tampered = verifyBundle(bundle);
    assert.equal(tampered.ok, false);
    assert.match(tampered.problems[0].reason, /不符/);

    fs.rmSync(path.join(bundle, "snapshot", "tavern-snapshot.json"));
    assert.match(verifyBundle(bundle).problems.map((p) => p.reason).join(), /缺失/);
  } finally {
    ctx.cleanup();
  }
});

/* ───────── 恢复与演练 ───────── */

test("★ 恢复演练：还原到临时目录、完整性 ok、计数与清单一致", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle, manifest } = backup(ctx, dest);
    const target = path.join(ctx.root, "drill");

    const result = restoreBundle(bundle, target);
    assert.equal(result.integrity, "ok");
    assert.equal(result.healthy, true, `演练未通过：${result.mismatches.join("；")}`);
    assert.deepEqual(result.counts, manifest.counts);
    assert.equal(result.inboxFiles, 1);
    assert.equal(result.snapshotRestored, true);
    assert.ok(fs.existsSync(path.join(target, "tavern.db")));
    assert.ok(fs.existsSync(path.join(target, "inbox", "deadbeef.zip")));
  } finally {
    ctx.cleanup();
  }
});

test("校验不通过的备份拒绝恢复（而不是还原出一半）", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle } = backup(ctx, dest);
    fs.writeFileSync(path.join(bundle, "inbox", "deadbeef.zip"), "tampered");
    assert.throws(
      () => restoreBundle(bundle, path.join(ctx.root, "drill")),
      (error) => error instanceof BackupError && error.code === "verify_failed",
    );
  } finally {
    ctx.cleanup();
  }
});

test("目标目录非空时拒绝覆盖，除非显式 force", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    const { bundle } = backup(ctx, dest);
    const target = path.join(ctx.root, "occupied");
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "别动我.txt"), "x");

    assert.throws(() => restoreBundle(bundle, target), (error) => error.code === "target_not_empty");
    const forced = restoreBundle(bundle, target, { force: true });
    assert.equal(forced.integrity, "ok");
    assert.ok(fs.existsSync(path.join(target, "别动我.txt")), "force 只覆盖同名文件，不该清空目录");
  } finally {
    ctx.cleanup();
  }
});

test("缺清单的目录不是备份", () => {
  const ctx = setup();
  try {
    const empty = path.join(ctx.root, "not-a-backup");
    fs.mkdirSync(empty, { recursive: true });
    assert.throws(() => verifyBundle(empty), (error) => error.code === "no_manifest");
  } finally {
    ctx.cleanup();
  }
});

/* ───────── 轮换 ───────── */

test("pruneBackups 保留最近 N 份（服务器磁盘很小，这不是可选项）", () => {
  const ctx = setup();
  try {
    const dest = path.join(ctx.root, "backups");
    fs.mkdirSync(dest, { recursive: true });
    for (const name of ["tavern-20260101-000000", "tavern-20260102-000000", "tavern-20260103-000000"]) {
      fs.mkdirSync(path.join(dest, name));
    }
    fs.mkdirSync(path.join(dest, "unrelated-dir")); // 不该被当备份删掉

    const result = pruneBackups(dest, 2);
    assert.deepEqual(result.removed, ["tavern-20260101-000000"]);
    assert.equal(result.kept, 2);
    assert.ok(fs.existsSync(path.join(dest, "unrelated-dir")));
  } finally {
    ctx.cleanup();
  }
});
