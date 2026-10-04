#!/usr/bin/env node
/**
 * 秘密扫描 CLI：检查**被 git 跟踪的文件**里有没有凭证泄露。
 *
 * 为什么必须有：本仓库是公开的，而 git 历史是永久的 —— 一旦某次提交带上了
 * 一枚令牌或胡椒，删掉也不等于没泄露，只能作废重发。
 *
 *   npm run check:secrets
 *
 * 局限（诚实说明）：只扫当前工作树的已跟踪文件。历史提交请另用工具：
 *   gitleaks detect --no-banner
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { MAX_FILE_BYTES, SKIP_PATH, TEXT_EXT, scanText } from "../src/scan-secrets.mjs";

const ROOT = process.cwd();

/**
 * 同时扫**已跟踪**与**未跟踪但未被忽略**的文件 —— 后者才是关键：
 * 秘密往往在提交之前就写进了新文件，如果只扫 git ls-files，
 * 新目录（比如刚写的 tavern-server/）会整片漏掉，扫描就成了空转。
 */
function filesToScan() {
  const run = (args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).split("\0").filter(Boolean);
  const tracked = run(["ls-files", "-z"]);
  const untracked = run(["ls-files", "-z", "--others", "--exclude-standard"]);
  return [...new Set([...tracked, ...untracked])];
}

const files = filesToScan().filter((file) => {
  if (SKIP_PATH.some((pattern) => pattern.test(file))) return false;
  if (!TEXT_EXT.has(path.extname(file).toLowerCase())) return false;
  try {
    return fs.statSync(path.join(ROOT, file)).size <= MAX_FILE_BYTES;
  } catch {
    return false;
  }
});

const hits = [];
for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(path.join(ROOT, file), "utf8");
  } catch {
    continue;
  }
  hits.push(...scanText(text, file));
}

if (hits.length) {
  process.stderr.write(`\n✖ 发现 ${hits.length} 处疑似秘密（公开仓库里等于已泄露）：\n\n`);
  for (const hit of hits) {
    process.stderr.write(`  ${hit.file}:${hit.line}  [${hit.rule}] ${hit.why}\n      ${hit.excerpt}\n`);
  }
  process.stderr.write(
    "\n处理方式：\n" +
    "  1) 立刻作废该凭证并重发（改历史提交没有意义，它已经公开过）\n" +
    "  2) 移到环境变量 / GitHub Secrets（.env 已被 gitignore）\n" +
    "  3) 若是误报，在 src/scan-secrets.mjs 的 ALLOW 里加白名单并写明理由\n\n",
  );
  process.exit(1);
}

process.stdout.write(`✔ 秘密扫描通过（已跟踪文本文件 ${files.length} 个，无命中）\n`);
