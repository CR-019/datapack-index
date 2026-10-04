#!/usr/bin/env node
/**
 * 导出 L1 元数据快照（设计文档 §10.1）。
 *
 *   npm run snapshot            # 写到 public/tavern-snapshot.json（站点静态兜底）
 *   npm run snapshot -- --out x.json
 *   npm run snapshot:check      # 校验仓库里的快照与当前代码+数据是否一致（CI 用）
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
import { COMPOSITION_KINDS, findCompositionViolations } from "../src/timeline.mjs";

function argOf(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const checkMode = process.argv.includes("--check");
const out = argOf("out", path.join(REPO_ROOT, "public", "tavern-snapshot.json"));
const db = openDatabase();

// 自检 ①（不变量 16）：`parent` 边只能表达"组成"。
//
// 不变量 13 的实现是"没有 parent 边 = 进看板列表"，它成立的前提是 parent
// **只**表示组成。前提一破，后果是条目**静默消失**——不报错，只是看板上少了
// 几件作品，看起来像数据丢了（实测过：给参赛作品建 parent 边，219 → 218）。
// 所以在这里先扫一遍，而不是等有人发现东西不见了。
const compositionViolations = findCompositionViolations(db);
if (compositionViolations.length) {
  process.stderr.write(
    `✖ 有 parent 边指向了不该作为"组成部分"的 kind（不变量 16 / 设计 §5.4.1）\n` +
    `   允许的 kind：${[...COMPOSITION_KINDS].join(", ")}\n\n` +
    compositionViolations.slice(0, 10).map((row) =>
      `   ${row.id}（kind=${row.kind}） -parent-> ${row.parentId}\n`).join("") +
    `\n   parent 表示"组成"（该节点不是独立条目，因此不进看板）。\n` +
    `   集合成员关系（参赛、入集）请改用 includes，否则那些条目已经从看板上消失了。\n`,
  );
  db.close();
  process.exit(1);
}

// 校验模式：直接沿用仓库里那份的 generatedAt，把唯一的时间波动抹平，
// 从而可以做**逐字节**比对（比"忽略某字段再比"更严格，也更好解释）
const committed = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : null;
const committedAt = committed ? /"generatedAt":\s*"([^"]+)"/.exec(committed)?.[1] : null;
const generatedAt = committedAt ?? nowIso();

const snapshot = buildSnapshot(db, { generatedAt });

// 自检 ②：绝不把私域字段写出去
const forbidden = findForbiddenKeys(snapshot);
if (forbidden.length) {
  process.stderr.write(`✖ 快照里出现了不该有的键：${forbidden.slice(0, 10).join(", ")}\n`);
  db.close();
  process.exit(1);
}

const text = serializeSnapshot(snapshot);

if (checkMode) {
  if (!committed) {
    process.stderr.write(`✖ 仓库里没有快照文件：${out}\n   先跑 npm run snapshot 生成一份。\n`);
    db.close();
    process.exit(1);
  }

  // ⚠️ 比较前把行尾归一化。
  //
  // 生成器写的是 LF，但 git 的 `core.autocrlf=true`（Windows 上很常见）会在
  // checkout 时把仓库里那份改写成 CRLF。于是逐字节比较**必然失败**，而失败
  // 报告会打印两行看起来一模一样的内容（CR 不可见）——"快照已过期"和眼前
  // 的证据自相矛盾，只能靠猜。这类"只在本地失败、CI 全绿"的假警报最耗人。
  // 行尾不是快照的内容，比较它没有意义。
  const committedText = committed.replace(/\r\n/g, "\n");
  if (committedText === text) {
    process.stdout.write(`✔ 快照与当前代码/数据一致（${snapshot.nodes.length} 节点，${(Buffer.byteLength(text) / 1024).toFixed(1)} KB）\n`);
    db.close();
    process.exit(0);
  }

  const left = committedText.split("\n");
  const right = text.split("\n");
  const differences = [];
  for (let index = 0; index < Math.max(left.length, right.length) && differences.length < 5; index += 1) {
    if (left[index] !== right[index]) differences.push({ line: index + 1, committed: left[index], fresh: right[index] });
  }
  process.stderr.write(
    `\n✖ 仓库里的快照已经过期（重新生成后跑 npm run snapshot 并提交）\n\n` +
    `   行数：${left.length}（仓库）vs ${right.length}（当前）\n\n` +
    differences.map((diff) =>
      `   第 ${diff.line} 行:\n     仓库: ${String(diff.committed).slice(0, 140)}\n     当前: ${String(diff.fresh).slice(0, 140)}\n`,
    ).join("") +
    "\n",
  );
  db.close();
  process.exit(1);
}

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
