/**
 * zip ↔ 目录：双向可逆工具（设计文档 §9.5）。
 *
 * 为什么这个性质重要：
 *   zip 是**输入形态**，仓库归档目录是**同一个形态**。任何一份归档都能重新打包成
 *   可投稿的 zip，任何 zip 也能直接落进仓库。否则每次同步都要做一次有损翻译，
 *   而"模板演进"就会变成不可控的事。
 *
 *   CI 里的 round-trip 断言是这套约定的保险丝：模板改版时它会立刻告诉你
 *   旧包还能不能读。详见 tests/archive.test.mjs。
 *
 * 实现上刻意与摄取流水线共用同一套归一化（清平台垃圾 + 折叠项目根），
 * 所以 unpack 出来的目录 = 后端实际会看到的项目形态。
 */

import fs from "node:fs";
import path from "node:path";

import { foldProjectRoot, isPlatformJunk, normalizeFiles } from "./ingest.mjs";
import { extractZip, looksLikeZip } from "./zip.mjs";
import { writeZip } from "./zip-write.mjs";

export class ArchiveError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ArchiveError";
    this.code = code;
  }
}

const MAX_DEPTH = 12;

/** 递归读取目录，返回 [{ path, data }]，路径统一为正斜杠且相对给定根 */
export function readDirectory(dir, { includeJunk = false } = {}) {
  const root = path.resolve(dir);
  if (!fs.existsSync(root)) throw new ArchiveError("not_found", `目录不存在：${dir}`);
  if (!fs.statSync(root).isDirectory()) throw new ArchiveError("not_a_directory", `不是目录：${dir}`);

  const files = [];
  const walk = (current, depth) => {
    if (depth > MAX_DEPTH) throw new ArchiveError("too_deep", `目录层级过深（> ${MAX_DEPTH}）：${current}`);
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const relative = path.relative(root, full).split(path.sep).join("/");
      if (!includeJunk && isPlatformJunk(relative)) continue;
      if (entry.isSymbolicLink()) throw new ArchiveError("symlink", `拒绝打包符号链接：${relative}`);
      if (entry.isDirectory()) {
        walk(full, depth + 1);
        continue;
      }
      if (!entry.isFile()) continue;
      files.push({ path: relative, data: fs.readFileSync(full) });
    }
  };
  walk(root, 0);

  if (!files.length) throw new ArchiveError("empty", `目录里没有可打包的文件：${dir}`);
  return files;
}

/**
 * 目录 → zip。
 * 自动跳过平台垃圾（.DS_Store 等），产出确定性字节。
 */
export function packDirectory(dir, { mtime, compress = true } = {}) {
  const files = readDirectory(dir);
  return {
    buffer: writeZip(files, { ...(mtime ? { mtime } : {}), compress }),
    fileCount: files.length,
    paths: files.map((file) => file.path),
  };
}

/**
 * zip → 目录。
 * 校验 + 归一化（与摄取流水线同源）后落盘；返回写出的文件清单与丢弃记录。
 */
export function unpackToDirectory(buffer, targetDir) {
  if (!Buffer.isBuffer(buffer) || !looksLikeZip(buffer)) {
    throw new ArchiveError("not_a_zip", "输入不是 zip 压缩包");
  }

  const extracted = extractZip(buffer);
  const { kept, dropped } = normalizeFiles(extracted.files);
  const { files, foldedRoot } = foldProjectRoot(kept);

  const root = path.resolve(targetDir);
  fs.mkdirSync(root, { recursive: true });
  const written = [];

  for (const file of files) {
    const destination = path.resolve(root, file.path);
    // 第二道防线：即使 zip 读取器漏了，也绝不让写出越过目标目录
    if (destination !== root && !destination.startsWith(root + path.sep)) {
      throw new ArchiveError("escapes_target", `条目会写到目标目录之外：${file.path}`);
    }
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, file.data);
    written.push(file.path);
  }

  return {
    files: written.sort(),
    dropped: dropped.map((entry) => entry.path),
    foldedRoot,
    stats: extracted.stats,
  };
}

/**
 * 语义等价判定：比较两组 { path, data } 的文件集合。
 * 用于 round-trip 断言 —— 路径与内容都要一致。
 */
export function filesAreEquivalent(left, right) {
  if (left.length !== right.length) return { equal: false, reason: `文件数不同：${left.length} vs ${right.length}` };
  const byPath = new Map(right.map((file) => [file.path, file.data]));
  const normalize = (data) => (Buffer.isBuffer(data) ? data : Buffer.from(data ?? ""));
  for (const file of left) {
    if (!byPath.has(file.path)) return { equal: false, reason: `右侧缺少：${file.path}` };
    if (!normalize(file.data).equals(normalize(byPath.get(file.path)))) {
      return { equal: false, reason: `内容不同：${file.path}` };
    }
  }
  return { equal: true, reason: "" };
}
