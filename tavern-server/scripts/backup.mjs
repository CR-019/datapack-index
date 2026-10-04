#!/usr/bin/env node
/**
 * 生成备份包（§11.4）。
 *
 *   npm run backup                       # 写到 data/backups/
 *   npm run backup -- --dest /mnt/backup # 写到异地挂载点（推荐）
 *   npm run backup -- --keep 30          # 保留最近 30 份
 *
 * ⚠️ 默认目标 data/backups 与数据在**同一块盘** —— 那只防误删，不防磁盘故障。
 *    生产必须让 --dest 指向异地（对象存储挂载 / 另一台机器），
 *    或在 cron 里再跑一次 rclone/rsync 把这里的东西推出去。
 */

import fs from "node:fs";
import path from "node:path";

import { SERVER_ROOT, config } from "../src/config.mjs";
import { createBackup, pruneBackups } from "../src/backup.mjs";
import { openDatabase } from "../src/db.mjs";

function argOf(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const destDir = path.resolve(argOf("dest", path.join(SERVER_ROOT, "data", "backups")));
const keep = Number(argOf("keep", "30"));
const snapshotPath = path.resolve(argOf("snapshot", path.join(SERVER_ROOT, "..", "public", "tavern-snapshot.json")));

if (!fs.existsSync(config.dbPath)) {
  process.stderr.write(`✖ 找不到数据库：${config.dbPath}\n`);
  process.exit(1);
}

const db = openDatabase();
try {
  const { bundle, manifest } = createBackup({
    db,
    dataDir: path.dirname(config.dbPath),
    destDir,
    snapshotPath,
    label: argOf("label"),
  });
  const size = (function total(dir) {
    let sum = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      sum += entry.isDirectory() ? total(full) : fs.statSync(full).size;
    }
    return sum;
  })(bundle);

  process.stdout.write(
    `\n✔ 备份完成\n\n` +
    `   目录     ${bundle}\n` +
    `   体积     ${(size / 1024 / 1024).toFixed(2)} MB\n` +
    `   数据库   节点 ${manifest.counts.nodes}（已发布 ${manifest.counts.publishedNodes}）· 边 ${manifest.counts.edges} · 修订 ${manifest.counts.revisions}\n` +
    `   私域     账户 ${manifest.counts.accounts} · 令牌 ${manifest.counts.tokens}（一并备份——否则恢复后所有人要重发令牌）\n` +
    `   投稿原件 ${manifest.inboxFiles} 个\n` +
    `   快照     ${manifest.snapshotIncluded ? "已包含" : "未找到，跳过"}\n` +
    `   校验     已写入 ${path.basename(bundle)}/MANIFEST.json\n`,
  );

  const pruned = pruneBackups(destDir, Number.isFinite(keep) ? keep : 30);
  if (pruned.removed.length) {
    process.stdout.write(`   清理     删除 ${pruned.removed.length} 份旧备份，保留 ${pruned.kept} 份\n`);
  }

  if (path.resolve(destDir).startsWith(path.resolve(path.dirname(config.dbPath)))) {
    process.stdout.write(
      `\n   ⚠️ 备份目标与数据在同一目录树内，只防误删、不防磁盘故障。\n` +
      `      生产请让 --dest 指向异地，例如：\n` +
      `        npm run backup -- --dest /mnt/offsite/tavern\n` +
      `        rclone copy /mnt/offsite/tavern remote:tavern-backup\n`,
    );
  }
  process.stdout.write("\n");
} finally {
  db.close();
}
