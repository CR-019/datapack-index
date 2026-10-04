import assert from "node:assert/strict";
import test from "node:test";
import zlib from "node:zlib";

import { ZipError, ZIP_LIMITS, checkEntryPath, extractZip, isSymlink, looksLikeZip, parseZip } from "../src/zip.mjs";

/* ───────── 测试用 ZIP 写入器 ─────────
   自己造包（而不是用真压缩工具）才能刻意构造恶意结构：穿越路径、符号链接、
   谎报大小、篡改 CRC、大小写重名……这些都是必须被拦下的输入。 */

function buildZip(entries, { versionMadeBy = 0x031e } = {}) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.isBuffer(entry.name) ? entry.name : Buffer.from(entry.name, "utf8");
    const raw = entry.data ?? Buffer.alloc(0);
    const method = entry.method ?? 0;
    const payload = method === 8 ? zlib.deflateRawSync(raw) : raw;
    const crc = zlib.crc32(raw);
    const compressedSize = entry.declaredCompressedSize ?? payload.length;
    const uncompressedSize = entry.declaredSize ?? raw.length;
    const flags = entry.flags ?? 0;
    const externalAttrs = entry.externalAttrs ?? 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressedSize, 18);
    local.writeUInt32LE(uncompressedSize, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, payload);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(versionMadeBy, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(flags, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt32LE(entry.declaredCrc ?? crc, 16);
    central.writeUInt32LE(compressedSize, 20);
    central.writeUInt32LE(uncompressedSize, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(externalAttrs, 38);
    central.writeUInt32LE(entry.overrideLocalOffset ?? offset, 42);
    centrals.push(central, nameBuf);

    offset += local.length + nameBuf.length + payload.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, centralBuf, eocd]);
}

const expectZipError = (code, fn) => {
  try {
    fn();
    assert.fail(`期望抛出 ${code}，但没有报错`);
  } catch (error) {
    assert.ok(error instanceof ZipError, `期望 ZipError，实际是 ${error?.name}: ${error?.message}`);
    assert.equal(error.code, code, `期望错误码 ${code}，实际 ${error.code}（${error.message}）`);
  }
};

/* ───────── 正常路径 ───────── */

test("正常 zip：解析结构、解压、CRC 校验通过", () => {
  const zip = buildZip([
    { name: "project.md", data: Buffer.from("# 标题\n正文", "utf8") },
    { name: "assets/cover.png", data: Buffer.from([0x89, 0x50, 0x4e, 0x47]), method: 8 },
    { name: "recruit/", data: Buffer.alloc(0) },
  ]);

  const parsed = parseZip(zip);
  assert.equal(parsed.entries.length, 3);
  assert.equal(parsed.fileCount, 2);
  assert.equal(parsed.directoryCount, 1);

  const { files, directories, stats } = extractZip(zip);
  assert.deepEqual(files.map((file) => file.path), ["project.md", "assets/cover.png"]);
  assert.equal(files[0].data.toString("utf8"), "# 标题\n正文");
  assert.deepEqual([...files[1].data], [0x89, 0x50, 0x4e, 0x47]);
  assert.deepEqual(directories, ["recruit"]);
  assert.equal(stats.fileCount, 2);
});

test("反斜杠路径被归一成正斜杠", () => {
  const zip = buildZip([{ name: "assets\\img.png", data: Buffer.from("x") }]);
  const { files } = extractZip(zip);
  assert.equal(files[0].path, "assets/img.png");
});

test("点号段被归一化，不产生穿越", () => {
  const zip = buildZip([{ name: "./a/./b.txt", data: Buffer.from("x") }]);
  assert.equal(extractZip(zip).files[0].path, "a/b.txt");
});

test("未设置 UTF-8 标志时按 GBK 解码文件名（中文 Windows 压缩工具的常见情况）", () => {
  const gbkName = Buffer.concat([Buffer.from([0xb2, 0xe2, 0xca, 0xd4]), Buffer.from(".md", "utf8")]); // "测试.md"
  const zip = buildZip([{ name: gbkName, data: Buffer.from("x"), flags: 0 }]);
  const { files } = extractZip(zip);
  assert.equal(files[0].path, "测试.md");
});

/* ───────── 路径穿越（zip slip） ───────── */

test("拒绝路径穿越：../", () => {
  expectZipError("path_traversal", () => parseZip(buildZip([{ name: "../evil.txt", data: Buffer.from("x") }])));
});

test("拒绝路径穿越：深层的 ../", () => {
  expectZipError("path_traversal", () => parseZip(buildZip([{ name: "assets/../../evil.txt", data: Buffer.from("x") }])));
});

test("拒绝反斜杠形式的穿越：..\\", () => {
  expectZipError("path_traversal", () => parseZip(buildZip([{ name: "..\\evil.txt", data: Buffer.from("x") }])));
});

test("拒绝绝对路径", () => {
  expectZipError("absolute_path", () => parseZip(buildZip([{ name: "/etc/passwd", data: Buffer.from("x") }])));
});

test("拒绝 Windows 盘符路径", () => {
  expectZipError("drive_letter", () => parseZip(buildZip([{ name: "C:/Windows/x", data: Buffer.from("x") }])));
});

test("拒绝 Windows 保留设备名", () => {
  expectZipError("reserved_name", () => parseZip(buildZip([{ name: "CON.txt", data: Buffer.from("x") }])));
});

test("拒绝名字里的 NUL 字符", () => {
  expectZipError("nul_in_name", () => checkEntryPath("a\0b.txt"));
});

test("checkEntryPath 单独可用（供上层复检）", () => {
  assert.deepEqual(checkEntryPath("assets/a.png"), { path: "assets/a.png", isDirectory: false });
  assert.deepEqual(checkEntryPath("dir/"), { path: "dir", isDirectory: true });
  assert.throws(() => checkEntryPath(".."), (error) => error.code === "path_traversal");
});

/* ───────── 符号链接与加密 ───────── */

test("拒绝符号链接条目（zip slip 的变体）", () => {
  const symlinkAttrs = (0xa1ff << 16) >>> 0; // unix S_IFLNK | 0777
  expectZipError(
    "symlink",
    () => parseZip(buildZip([{ name: "link", data: Buffer.from("/etc/passwd"), externalAttrs: symlinkAttrs }])),
  );
});

test("isSymlink 只在 unix 制作方下判定", () => {
  const unixEntry = { versionMadeBy: 0x031e, externalAttrs: (0xa1ff << 16) >>> 0 };
  const dosEntry = { versionMadeBy: 0x0014, externalAttrs: (0xa1ff << 16) >>> 0 };
  assert.equal(isSymlink(unixEntry), true);
  assert.equal(isSymlink(dosEntry), false, "DOS 制作方不应按 unix 模式位判定");
});

test("拒绝加密条目", () => {
  expectZipError("encrypted", () => parseZip(buildZip([{ name: "a.txt", data: Buffer.from("x"), flags: 0x0001 }])));
});

/* ───────── 压缩炸弹 ───────── */

test("拒绝压缩比异常的条目（真实的压缩炸弹形态：1MB 全零压到 1KB）", () => {
  const bomb = buildZip([{ name: "bomb.bin", data: Buffer.alloc(1024 * 1024, 0x61), method: 8 }]);
  // 先确认这确实是个高压缩比包（否则测试就失去意义）
  const parsed = (() => {
    try {
      return parseZip(bomb);
    } catch (error) {
      return error;
    }
  })();
  assert.ok(parsed instanceof ZipError, "高压缩比包必须被拒绝");
  assert.equal(parsed.code, "compression_ratio", `期望 compression_ratio，实际 ${parsed.code}：${parsed.message}`);
});

test("声明大小撒谎时，inflate 输出上限会拦下（第二道防线）", () => {
  const zip = buildZip([{ name: "bomb.bin", data: Buffer.from("a".repeat(100_000)), method: 8, declaredSize: 100 }]);
  expectZipError("bomb_suspected", () => extractZip(zip));
});

test("拒绝单文件过大", () => {
  expectZipError(
    "entry_too_large",
    () => parseZip(buildZip([{ name: "big.bin", data: Buffer.from("x"), declaredSize: ZIP_LIMITS.maxEntryBytes + 1, declaredCompressedSize: ZIP_LIMITS.maxEntryBytes + 1 }])),
  );
});

test("拒绝解压后总量超限（用收紧的限额触发同一段代码）", () => {
  const oneMb = Buffer.alloc(1024 * 1024, 0x61);
  const zip = buildZip([
    { name: "a.bin", data: oneMb },
    { name: "b.bin", data: oneMb },
    { name: "c.bin", data: oneMb },
  ]);
  expectZipError("total_too_large", () =>
    parseZip(zip, { ...ZIP_LIMITS, maxEntryBytes: 2 * 1024 * 1024, maxTotalBytes: 2 * 1024 * 1024 }),
  );
});

test("拒绝条目数超限", () => {
  const many = Array.from({ length: ZIP_LIMITS.maxEntries + 1 }, (_, index) => ({ name: `f${index}.txt`, data: Buffer.from("x") }));
  expectZipError("too_many_entries", () => parseZip(buildZip(many)));
});

test("拒绝压缩包本身过大", () => {
  const zip = buildZip([{ name: "a.txt", data: Buffer.from("x") }]);
  expectZipError("archive_too_large", () => parseZip(zip, { ...ZIP_LIMITS, maxArchiveBytes: 10 }));
});

/* ───────── 完整性与结构 ───────── */

test("CRC 不匹配时报错（文件被篡改）", () => {
  const zip = buildZip([{ name: "a.txt", data: Buffer.from("hello world") }]);
  const corrupted = Buffer.from(zip);
  corrupted[30 + "a.txt".length] ^= 0xff; // 改数据区一个字节
  expectZipError("crc_mismatch", () => extractZip(corrupted));
});

test("声明大小与实际不符时报错", () => {
  const zip = buildZip([{ name: "a.txt", data: Buffer.from("hello"), declaredSize: 6 }]);
  expectZipError("size_mismatch", () => extractZip(zip));
});

test("大小写重名的条目被拒绝（落盘会冲突）", () => {
  expectZipError(
    "duplicate_name",
    () => parseZip(buildZip([
      { name: "Cover.png", data: Buffer.from("x") },
      { name: "cover.png", data: Buffer.from("y") },
    ])),
  );
});

test("不支持的压缩算法被拒绝，而不是猜", () => {
  expectZipError("unsupported_method", () => parseZip(buildZip([{ name: "a.txt", data: Buffer.from("x"), method: 12 }])));
});

test("拒绝分卷压缩包", () => {
  const zip = buildZip([{ name: "a.txt", data: Buffer.from("x") }]);
  const multi = Buffer.from(zip);
  multi.writeUInt16LE(1, multi.length - 22 + 4); // EOCD: 本磁盘号 = 1
  expectZipError("multidisk", () => parseZip(multi));
});

test("不是 zip 时给出可读错误", () => {
  expectZipError("not_a_zip", () => parseZip(Buffer.from("这不是一个 zip 文件，只是一段普通文本而已……")));
  expectZipError("too_small", () => parseZip(Buffer.from([1, 2, 3])));
});

test("本地头签名损坏时报错", () => {
  const zip = buildZip([{ name: "a.txt", data: Buffer.from("x") }]);
  const broken = Buffer.from(zip);
  broken.writeUInt32LE(0xdeadbeef, 0);
  expectZipError("bad_local_header", () => extractZip(broken));
});

test("条目数据偏移越界时报错", () => {
  expectZipError(
    "bad_offset",
    () => parseZip(buildZip([{ name: "a.txt", data: Buffer.from("x"), overrideLocalOffset: 0xfffff0 }])),
  );
});

test("looksLikeZip 用于快速判型", () => {
  assert.equal(looksLikeZip(buildZip([{ name: "a.txt", data: Buffer.from("x") }])), true);
  assert.equal(looksLikeZip(Buffer.from("PK")), false);
  assert.equal(looksLikeZip(null), false);
});
