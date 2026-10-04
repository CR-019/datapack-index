/**
 * 零依赖 ZIP 写入器（与 zip.mjs 读取器对称）。
 *
 * 两个刻意的设计：
 *   · **确定性**：条目按路径排序、时间戳固定 → 同样的输入产出**逐字节相同**的 zip。
 *     否则 round-trip 测试与内容哈希都失去意义。
 *   · **对称校验**：写出前用读取器的 checkEntryPath 复检每个条目名 ——
 *     我们不但不读危险路径，也绝不*产出*危险路径。
 */

import zlib from "node:zlib";

import { checkEntryPath } from "./zip.mjs";

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_EOCD = 0x06054b50;

const METHOD_STORED = 0;
const METHOD_DEFLATE = 8;
const FLAG_UTF8 = 0x0800;

/** 已经是压缩格式的素材再 deflate 纯属浪费 CPU（图省不了几个字节） */
const PRE_COMPRESSED = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".zip", ".gz", ".webp"]);

/** 固定时间戳 → 可复现的产物（ZIP 的 DOS 时间只有 2 秒精度） */
export const FIXED_MTIME = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));

function dosDateTime(date) {
  const year = Math.max(1980, date.getUTCFullYear());
  return {
    dosDate: (((year - 1980) & 0x7f) << 9) | (((date.getUTCMonth() + 1) & 0x0f) << 5) | (date.getUTCDate() & 0x1f),
    dosTime: ((date.getUTCHours() & 0x1f) << 11) | ((date.getUTCMinutes() & 0x3f) << 5) | (Math.floor(date.getUTCSeconds() / 2) & 0x1f),
  };
}

function extensionOf(filePath) {
  const match = /\.([A-Za-z0-9]+)$/.exec(filePath);
  return match ? `.${match[1].toLowerCase()}` : "";
}

/**
 * 打包成 zip。
 * @param {Array<{path:string, data:Buffer}>} files
 * @param {{ mtime?: Date, compress?: boolean }} options
 * @returns {Buffer}
 */
export function writeZip(files, { mtime = FIXED_MTIME, compress = true } = {}) {
  if (!Array.isArray(files) || !files.length) {
    throw new Error("writeZip：至少要有一个文件");
  }

  const { dosDate, dosTime } = dosDateTime(mtime);
  // 排序保证确定性
  const ordered = [...files].sort((left, right) => left.path.localeCompare(right.path, "en"));

  const seen = new Set();
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const file of ordered) {
    const { path: safePath } = checkEntryPath(file.path); // 复用读取器的路径校验
    const key = safePath.toLowerCase();
    if (seen.has(key)) throw new Error(`writeZip：条目名重复（大小写不敏感）：${safePath}`);
    seen.add(key);

    const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data ?? "");
    const nameBuf = Buffer.from(safePath, "utf8");
    const skipCompression = !compress || PRE_COMPRESSED.has(extensionOf(safePath));
    const deflated = skipCompression ? null : zlib.deflateRawSync(data, { level: 9 });
    // 压不小就不压（既省体积也省解压开销）
    const useDeflate = deflated !== null && deflated.length < data.length;
    const method = useDeflate ? METHOD_DEFLATE : METHOD_STORED;
    const payload = useDeflate ? deflated : data;
    const crc = zlib.crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(SIG_LOCAL, 0);
    local.writeUInt16LE(20, 4);              // version needed
    local.writeUInt16LE(FLAG_UTF8, 6);       // 文件名是 UTF-8
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(payload.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);              // extra length
    locals.push(local, nameBuf, payload);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(SIG_CENTRAL, 0);
    central.writeUInt16LE(0x031e, 4);        // version made by: unix 3.0（不写符号链接位）
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(FLAG_UTF8, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(payload.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30);            // extra
    central.writeUInt16LE(0, 32);            // comment
    central.writeUInt16LE(0, 34);            // disk start
    central.writeUInt16LE(0, 36);            // internal attrs
    central.writeUInt32LE(0, 38);            // external attrs：全 0（不是目录、不是符号链接）
    central.writeUInt32LE(offset, 42);       // local header offset
    centrals.push(central, nameBuf);

    offset += local.length + nameBuf.length + payload.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(SIG_EOCD, 0);
  eocd.writeUInt16LE(0, 4);                  // 本磁盘号
  eocd.writeUInt16LE(0, 6);                  // 中央目录起始磁盘
  eocd.writeUInt16LE(ordered.length, 8);     // 本磁盘条目数
  eocd.writeUInt16LE(ordered.length, 10);    // 总条目数
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);            // 中央目录偏移
  eocd.writeUInt16LE(0, 20);                 // 注释长度

  return Buffer.concat([...locals, centralBuf, eocd]);
}
