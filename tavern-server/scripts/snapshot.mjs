#!/usr/bin/env node
/**
 * 导出 L1 元数据快照（设计文档 §10.1）。
 *
 *   npm run snapshot                 # 写到 public/tavern-snapshot.json（站点静态兜底）
 *   npm run snapshot -- --out x.json # 写到别处
 *
 * 为什么要有它：
 *   · 后端不可用时，前端自动回退到这份快照（api.mjs 的 SNAPSHOT_URLS）
 *   · 仓库里的快照同时是"跑路成本"的保障 —— 后端全挂也能重建只读看板
 *
 * ⚠️ 表级白名单（ADR-008）：本脚本只通过 read-model 取数，
 * 而 read-model 只查 nodes / edges / tag_members。私有数据不是被过滤掉，
 * 是从来没有进入过导出路径。写完还会做一次敏感字段自检，命中即失败。
 */

import fs from "node:fs";
import path from "node:path";

import { REPO_ROOT, config, nowIso } from "../src/config.mjs";
import { openDatabase } from "../src/db.mjs";
import { buildSnapshot, findForbiddenKeys, serializeSnapshot } from "../src/read-model.mjs";

function argOf(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const out = argOf("out", path.join(REPO_ROOT, "public", "tavern-snapshot.json"));
const db = openDatabase();

const generatedAt = nowIso();
const snapshot = buildSnapshot(db, { generatedAt });

// 自检：绝不把私域字段写出去
const forbidden = findForbiddenKeys(snapshot);
if (forbidden.length) {
  process.stderr.write(`✖ 快照里出现了不该有的键：${forbidden.slice(0, 10).join(", ")}\n`);
  db.close();
  process.exit(1);
}

const text = serializeSnapshot(snapshot);

// 原子写：先写临时文件再 rename，避免读者看到写了一半的 JSON
fs.mkdirSync(path.dirname(out), { recursive: true });
const temporary = `${out}.${process.pid}.tmp`;
fs.writeFileSync(temporary, text, "utf8");
fs.renameSync(temporary, out);

process.stdout.write(
  `\n✔ L1 快照已导出\n\n` +
  `   文件      ${out}\n` +
  `   体积      ${(Buffer.byteLength(text) / 1024).toFixed(1)} KB\n` +
  `   节点      ${snapshot.nodes.length}（已发布）\n` +
  `   边        ${snapshot.edges.length}\n` +
  `   标签      ${snapshot.tags.length}（零成员已过滤）\n` +
  `   标签成员   ${Object.values(snapshot.tagMembers).reduce((sum, list) => sum + list.length, 0)}\n` +
  `   时间轴    ${snapshot.timeline.length}\n` +
  `   私域字段   0（已自检）\n\n`,
);

db.close();
