import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import zlib from "node:zlib";

import { ArchiveError, filesAreEquivalent, packDirectory, readDirectory, unpackToDirectory } from "../src/archive.mjs";
import { buildProject, ingestZip } from "../src/ingest.mjs";
import { extractZip, parseZip } from "../src/zip.mjs";
import { buildZip, textEntry } from "./helpers/zip-writer.mjs";

/* ───────── 脚手架 ───────── */

function tempDir(label = "tavern-archive-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), label));
}

const PROJECT_MD = [
  "---",
  "template: 1",
  "name: 往返测试项目",
  "summary: 用来验证 pack/unpack 的双向可逆",
  "tags: [UI, 展示实体]",
  "gameversion: [1.21.9]",
  "---",
  "# 往返测试",
  "",
  "正文里有中文与 emoji 🎈。",
].join("\n");

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(512, 7)]);

function makeProjectDir(root, { junk = false, nested = false } = {}) {
  const dir = nested ? path.join(root, "我的项目") : root;
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  fs.mkdirSync(path.join(dir, "recruit"), { recursive: true });
  fs.writeFileSync(path.join(dir, "project.md"), PROJECT_MD, "utf8");
  fs.writeFileSync(path.join(dir, "assets", "cover.png"), PNG);
  fs.writeFileSync(path.join(dir, "assets", "截图.png"), PNG.subarray(0, 100));
  fs.writeFileSync(path.join(dir, "relations.json"), JSON.stringify({ related: ["project:other"] }), "utf8");
  fs.writeFileSync(path.join(dir, "recruit", "shader.md"), "---\nrole: 着色器\n---\n负责着色器。", "utf8");
  if (junk) {
    fs.writeFileSync(path.join(dir, ".DS_Store"), "junk");
    fs.mkdirSync(path.join(dir, "__MACOSX"), { recursive: true });
    fs.writeFileSync(path.join(dir, "__MACOSX", "._project.md"), "junk");
  }
  return dir;
}

/* ───────── 双向可逆（本文件存在的理由） ───────── */

test("★ round-trip：unpack(pack(dir)) 与 dir 语义等价", () => {
  const root = tempDir();
  try {
    // 注意：解包目录必须放在**被压缩目录之外**，否则 readDirectory 会把
    // 解包产物也数进去（这坑我第一次就踩了）
    const source = makeProjectDir(path.join(root, "src"));
    const { buffer } = packDirectory(source);
    const target = path.join(root, "out");
    unpackToDirectory(buffer, target);

    const before = readDirectory(source).map((file) => ({ path: file.path, data: file.data }));
    const after = readDirectory(target).map((file) => ({ path: file.path, data: file.data }));

    const verdict = filesAreEquivalent(before, after);
    assert.ok(verdict.equal, `往返后不一致：${verdict.reason}`);
    assert.deepEqual(after.map((file) => file.path), ["assets/cover.png", "assets/截图.png", "project.md", "recruit/shader.md", "relations.json"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("★ 二次往返也稳定：pack(unpack(pack(dir))) 与 pack(dir) 逐字节相同", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const first = packDirectory(source).buffer;

    const middle = path.join(root, "middle");
    unpackToDirectory(first, middle);
    const second = packDirectory(middle).buffer;

    assert.ok(first.equals(second), "二次打包的字节不同 —— 说明打包不确定或往返有损");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("★ pack 产出的 zip 必须能被摄取流水线直接接受（后端零错误）", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const { buffer } = packDirectory(source);
    const result = ingestZip(buffer);
    assert.deepEqual(result.errors, [], "pack 出来的包后端竟然不收，双向可逆就名不副实");
    assert.equal(result.project.name, "往返测试项目");
    assert.deepEqual(result.project.tags, ["UI", "展示实体"]);
    assert.equal(result.project.assets.length, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

/* ───────── 确定性 ───────── */

test("打包确定性：同样输入产出逐字节相同的 zip", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    assert.ok(packDirectory(source).buffer.equals(packDirectory(source).buffer));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("条目顺序按路径排序（与磁盘遍历顺序无关）", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const parsed = parseZip(packDirectory(source).buffer);
    const names = parsed.entries.map((entry) => entry.path);
    assert.deepEqual(names, [...names].sort((left, right) => left.localeCompare(right, "en")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

/* ───────── 压缩策略 ───────── */

test("文本走 deflate、已压缩素材走 store（压不小就不压）", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const parsed = parseZip(packDirectory(source).buffer);
    const byName = Object.fromEntries(parsed.entries.map((entry) => [entry.path, entry]));

    assert.equal(byName["project.md"].method, 8, "文本应当 deflate");
    assert.ok(byName["project.md"].compressedSize < byName["project.md"].uncompressedSize, "文本应当真的变小");
    assert.equal(byName["assets/cover.png"].method, 0, "png 不该再压");
    // 真实数据校验：CRC 必须对得上
    const { files } = extractZip(packDirectory(source).buffer);
    assert.equal(zlib.crc32(files.find((file) => file.path === "project.md").data), byName["project.md"].crc32);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

/* ───────── 归一化：平台垃圾与嵌套目录 ───────── */

test("打包时跳过平台垃圾（.DS_Store / __MACOSX）", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root, { junk: true });
    const { paths } = packDirectory(source);
    assert.ok(!paths.some((entry) => /__MACOSX|\.DS_Store/.test(entry)), `垃圾进了包：${paths.join(", ")}`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("解包时丢弃平台垃圾并折叠多余顶层目录", () => {
  const root = tempDir();
  try {
    const dir = makeProjectDir(root, { junk: true, nested: true });
    assert.ok(dir.endsWith("我的项目"));
    // 用原始 zip 走一遍（含垃圾），确认解包侧也会清
    const buffer = buildZip([
      textEntry("我的项目/project.md", PROJECT_MD),
      textEntry("我的项目/.DS_Store", "junk"),
      textEntry("__MACOSX/._project.md", "junk"),
    ]);
    const target = path.join(root, "out");
    const result = unpackToDirectory(buffer, target);
    assert.deepEqual(result.files, ["project.md"], "折叠后应只剩 project.md");
    assert.equal(result.foldedRoot, "我的项目");
    assert.equal(result.dropped.length, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

/* ───────── 安全：拒绝危险输入 ───────── */

test("解包拒绝路径穿越（zip slip）", () => {
  const root = tempDir();
  try {
    const evil = buildZip([textEntry("../evil.txt", "pwned"), textEntry("project.md", PROJECT_MD)]);
    assert.throws(
      () => unpackToDirectory(evil, path.join(root, "out")),
      (error) => error.code === "path_traversal",
    );
    assert.ok(!fs.existsSync(path.join(root, "evil.txt")), "穿越文件不该被写出去");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("打包拒绝符号链接", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const link = path.join(source, "assets", "link.png");
    try {
      fs.symlinkSync(PNG.toString("base64"), link);
    } catch {
      return; // Windows 无权限创建符号链接时跳过（不是被测代码的问题）
    }
    fs.rmSync(link, { force: true });
    fs.symlinkSync(path.join(source, "assets", "cover.png"), link);
    assert.throws(() => packDirectory(source), (error) => error instanceof ArchiveError && error.code === "symlink");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("空目录与不存在的目录给出可读错误", () => {
  const root = tempDir();
  try {
    assert.throws(() => packDirectory(path.join(root, "nope")), (error) => error.code === "not_found");
    const empty = path.join(root, "empty");
    fs.mkdirSync(empty);
    assert.throws(() => packDirectory(empty), (error) => error.code === "empty");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("非 zip 输入被拒绝", () => {
  const root = tempDir();
  try {
    assert.throws(() => unpackToDirectory(Buffer.from("不是 zip"), path.join(root, "x")), (error) => error.code === "not_a_zip");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

/* ───────── 辅助 ───────── */

test("filesAreEquivalent 能识别文件数与内容差异", () => {
  const a = [{ path: "a.md", data: Buffer.from("1") }, { path: "b.md", data: Buffer.from("2") }];
  assert.equal(filesAreEquivalent(a, a).equal, true);
  assert.match(filesAreEquivalent(a, [a[0]]).reason, /文件数不同/);
  assert.match(filesAreEquivalent(a, [{ path: "a.md", data: Buffer.from("x") }, a[1]]).reason, /内容不同/);
  assert.match(filesAreEquivalent(a, [{ path: "c.md", data: Buffer.from("1") }, a[1]]).reason, /右侧缺少/);
});

test("中文文件名往返后保持正确（UTF-8 标志与解码）", () => {
  const root = tempDir();
  try {
    const source = makeProjectDir(root);
    const { buffer } = packDirectory(source);
    const parsed = parseZip(buffer);
    assert.ok(parsed.entries.some((entry) => entry.path === "assets/截图.png"), "中文名应当原样保留");
    const target = path.join(root, "out");
    unpackToDirectory(buffer, target);
    assert.ok(fs.existsSync(path.join(target, "assets", "截图.png")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
