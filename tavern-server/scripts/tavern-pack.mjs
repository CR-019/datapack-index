#!/usr/bin/env node
/**
 * 目录 → 可投稿的 zip（§9.5）。
 *
 *   npm run pack -- <目录> [输出.zip]
 *
 * 产出特点：条目按路径排序、时间戳固定 → 同样输入得到**逐字节相同**的 zip；
 * 自动跳过 .DS_Store / __MACOSX 之类的平台垃圾；写出前用读取器复检路径安全性。
 */

import fs from "node:fs";
import path from "node:path";

import { ArchiveError, packDirectory } from "../src/archive.mjs";

const [source, destination] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!source) {
  process.stderr.write("用法：npm run pack -- <目录> [输出.zip]\n");
  process.exit(1);
}

const directory = path.resolve(source);
const out = path.resolve(destination ?? `${path.basename(directory)}.zip`);

try {
  const { buffer, paths } = packDirectory(directory);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buffer);

  process.stdout.write(
    `\n✔ 已打包\n\n` +
    `   来源   ${directory}\n` +
    `   输出   ${out}\n` +
    `   体积   ${(buffer.length / 1024).toFixed(1)} KB\n` +
    `   条目   ${paths.length}\n\n` +
    paths.map((entry) => `     · ${entry}\n`).join("") +
    `\n   提示：这个 zip 可以直接提交给 POST /v1/submissions（字段名 archive）。\n\n`,
  );
} catch (error) {
  if (error instanceof ArchiveError) {
    process.stderr.write(`✖ ${error.message}（${error.code}）\n`);
    process.exit(1);
  }
  throw error;
}
