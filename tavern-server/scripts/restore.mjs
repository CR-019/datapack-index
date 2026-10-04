#!/usr/bin/env node
/**
 * 从备份恢复，并且**默认只做演练**（§11.4）。
 *
 *   npm run restore -- <备份目录>                 # 演练：还原到临时目录并做完整性检查
 *   npm run restore -- <备份目录> --to /tmp/x     # 演练到指定目录
 *   npm run restore -- <备份目录> --to <数据目录> --force   # 真恢复（覆盖线上，需显式确认）
 *
 * 为什么默认是演练：没演练过的备份不算备份。真恢复必须显式 --force，
 * 而且要先把当前数据备份走 —— 这个脚本会检查这一点。
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { BackupError, restoreBundle, verifyBundle } from "../src/backup.mjs";
import { config } from "../src/config.mjs";

function argOf(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const bundle = process.argv.slice(2).filter((arg) => !arg.startsWith("--"))[0];
if (!bundle) {
  process.stderr.write("用法：npm run restore -- <备份目录> [--to <目标目录>] [--force]\n");
  process.exit(1);
}

const bundleDir = path.resolve(bundle);
if (!fs.existsSync(bundleDir)) {
  process.stderr.write(`✖ 备份目录不存在：${bundleDir}\n`);
  process.exit(1);
}

const force = process.argv.includes("--force");
const dataDir = path.dirname(path.resolve(config.dbPath));
const requested = argOf("to");
const target = requested ? path.resolve(requested) : fs.mkdtempSync(path.join(os.tmpdir(), "tavern-restore-"));
const live = path.resolve(target) === dataDir;

if (live && !force) {
  process.stderr.write(
    `✖ 目标就是线上数据目录（${dataDir}）。\n` +
    `  这是恢复演练；真要覆盖线上，请加 --force，并且**先备份当前数据**：\n` +
    `    npm run backup -- --dest /mnt/offsite/tavern\n`,
  );
  process.exit(1);
}

try {
  const verified = verifyBundle(bundleDir);
  process.stdout.write(
    `\n备份清单\n` +
    `   创建于   ${verified.manifest.createdAt}\n` +
    `   文件     ${Object.keys(verified.manifest.files).length} 个，校验 ${verified.ok ? "✓ 通过" : "✗ 未通过"}\n` +
    (verified.problems.length ? verified.problems.map((p) => `     - ${p.file}：${p.reason}\n`).join("") : ""),
  );

  const result = restoreBundle(bundleDir, target, { force });

  process.stdout.write(
    `\n${live ? "✔ 已覆盖线上数据（--force）" : "✔ 恢复演练完成（未触碰线上数据）"}\n\n` +
    `   还原到   ${result.target}\n` +
    `   完整性   PRAGMA integrity_check = ${result.integrity}\n` +
    `   计数     节点 ${result.counts.nodes}（已发布 ${result.counts.publishedNodes}）· 边 ${result.counts.edges} · 修订 ${result.counts.revisions}\n` +
    `   私域     账户 ${result.counts.accounts} · 令牌 ${result.counts.tokens}\n` +
    `   投稿原件 ${result.inboxFiles} 个 · 快照 ${result.snapshotRestored ? "已还原" : "无"}\n` +
    (result.mismatches.length
      ? `\n   ⚠️ 与清单不符：\n${result.mismatches.map((line) => `     - ${line}\n`).join("")}`
      : `   记账     与清单一致 ✓\n`),
  );

  if (!live) {
    process.stdout.write(
      `\n   真恢复的话（确认无误后）：\n` +
      `     1) npm run backup -- --dest /mnt/offsite/tavern   # 先兜住当前数据\n` +
      `     2) npm run restore -- ${path.relative(process.cwd(), bundleDir)} --to ${dataDir} --force\n` +
      `     3) systemctl restart tavern-api\n`,
    );
  }
  process.stdout.write("\n");

  if (!result.healthy) process.exitCode = 1;
} catch (error) {
  if (error instanceof BackupError) {
    process.stderr.write(`✖ ${error.message}（${error.code}）\n`);
    process.exit(1);
  }
  throw error;
}
