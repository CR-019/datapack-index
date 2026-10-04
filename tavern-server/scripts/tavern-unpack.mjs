#!/usr/bin/env node
/**
 * zip → 项目目录（§9.5）。
 *
 *   npm run unpack -- <投稿.zip> [目标目录]
 *
 * 与摄取流水线共用同一套归一化：清平台垃圾、折叠多余的顶层目录、
 * 拒绝路径穿越与符号链接。落盘的目录就是后端实际会看到的项目形态，
 * 因此可以直接进仓库（tavern/archive/<slug>/）。
 */

import fs from "node:fs";
import path from "node:path";

import { ArchiveError, unpackToDirectory } from "../src/archive.mjs";
import { buildProject } from "../src/ingest.mjs";
import { ZipError } from "../src/zip.mjs";

const [source, destination] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!source) {
  process.stderr.write("用法：npm run unpack -- <投稿.zip> [目标目录]\n");
  process.exit(1);
}

const zipPath = path.resolve(source);
if (!fs.existsSync(zipPath)) {
  process.stderr.write(`✖ 找不到文件：${zipPath}\n`);
  process.exit(1);
}

const out = path.resolve(destination ?? `${path.basename(zipPath, ".zip")}-unpacked`);

try {
  const buffer = fs.readFileSync(zipPath);
  const result = unpackToDirectory(buffer, out);

  // 顺手做一次内容校验，让作者立刻知道这个包后端会不会收
  // （buildProject 收的是文件数组，不是 { files } 包装 —— 这里踩过一次）
  const extractedFiles = result.files.map((relative) => ({
    path: relative,
    data: fs.readFileSync(path.join(out, relative)),
  }));
  const { errors, warnings } = buildProject(extractedFiles);

  process.stdout.write(
    `\n✔ 已解包\n\n` +
    `   来源   ${zipPath}（${(buffer.length / 1024).toFixed(1)} KB）\n` +
    `   输出   ${out}\n` +
    `   文件   ${result.files.length}\n` +
    (result.foldedRoot ? `   折叠   ${result.foldedRoot}/\n` : "") +
    (result.dropped.length ? `   丢弃   ${result.dropped.length} 个平台垃圾文件\n` : "") +
    result.files.map((entry) => `     · ${entry}\n`).join("") +
    "\n",
  );

  if (warnings.length) {
    process.stdout.write(`   提示：\n${warnings.map((item) => `     - ${item.message}\n`).join("")}\n`);
  }
  if (errors.length) {
    process.stdout.write(`   ⚠️ 内容校验未通过（${errors.length} 项），后端会拒收：\n${errors.map((item) => `     - ${item.message}\n`).join("")}\n\n`);
    process.exitCode = 2;
  } else {
    process.stdout.write("   内容校验通过，可以直接投稿。\n\n");
  }
} catch (error) {
  if (error instanceof ZipError || error instanceof ArchiveError) {
    process.stderr.write(`✖ ${error.message}（${error.code}）\n`);
    process.exit(1);
  }
  throw error;
}
