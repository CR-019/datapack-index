/**
 * 零依赖 ZIP 读取器。
 *
 * 只实现"读 + 安全校验"：ZIP 解包是本项目**最大的攻击面**（SECURITY.md），
 * 所以这里的每一条检查都对应一类真实攻击：
 *
 *   · 路径穿越（zip slip）    → checkEntryPath()
 *   · 符号链接逃逸            → isSymlink()
 *   · 压缩炸弹（zip bomb）    → 压缩比 + 解压上限 + inflate 输出上限
 *   · 越界读取 / 畸形结构      → 边界检查、签名校验、zip64 明确拒绝
 *   · 加密包 / 未知压缩算法    → 直接拒绝，不猜
 *   · 大小写重名（落盘冲突）   → 大小写不敏感的重复检测
 *
 * 不解压到磁盘、不做平台垃圾过滤——那是 ingest 层的事。这里只产出内存中的文件列表。
 */

import zlib from "node:zlib";

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_EOCD = 0x06054b50;
const SIG_ZIP64_EOCD = 0x06064b50;
const SIG_ZIP64_LOCATOR = 0x07064b50;

const METHOD_STORED = 0;
const METHOD_DEFLATE = 8;

const FLAG_ENCRYPTED = 0x0001;
const FLAG_UTF8 = 0x0800;

/** 默认限额，与设计文档 §9.2 一致 */
export const ZIP_LIMITS = Object.freeze({
  maxArchiveBytes: 20 * 1024 * 1024,
  maxEntries: 200,
  maxEntryBytes: 20 * 1024 * 1024,
  maxTotalBytes: 100 * 1024 * 1024,
  maxCompressionRatio: 100,
  maxNameBytes: 255,
});

export class ZipError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ZipError";
    this.code = code;
  }
}

const fail = (code, message) => {
  throw new ZipError(code, message);
};

/* ───────────────────────── 名称与路径 ───────────────────────── */

/** 末位未设置 UTF-8 标志时，中文 Windows 工具通常写的是 GBK；按此回退 */
function decodeName(bytes, flags) {
  if (flags & FLAG_UTF8) return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  try {
    return new TextDecoder("gbk", { fatal: false }).decode(bytes);
  } catch {
    return Buffer.from(bytes).toString("latin1");
  }
}

const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

/**
 * 规范化并校验条目路径。返回归一化后的相对路径（正斜杠）。
 * 拒绝一切"离开解压根"或"在 Windows 上会变成特殊设备"的名字。
 */
export function checkEntryPath(rawName) {
  const name = String(rawName);
  if (!name) fail("empty_name", "条目名为空");
  if (name.length > ZIP_LIMITS.maxNameBytes) fail("name_too_long", `条目名过长：${name.slice(0, 40)}…`);
  if (name.includes("\0")) fail("nul_in_name", "条目名含 NUL 字符");

  // 反斜杠统一成正斜杠（Windows 压缩工具常见）
  const slashed = name.replaceAll("\\", "/");

  if (slashed.startsWith("/")) fail("absolute_path", `拒绝绝对路径：${name}`);
  if (/^[A-Za-z]:/.test(slashed)) fail("drive_letter", `拒绝盘符路径：${name}`);

  const segments = slashed.split("/").filter((segment) => segment !== "" && segment !== ".");
  if (segments.some((segment) => segment === "..")) fail("path_traversal", `拒绝路径穿越：${name}`);
  if (segments.some((segment) => WINDOWS_RESERVED.test(segment))) {
    fail("reserved_name", `拒绝 Windows 保留名：${name}`);
  }
  if (!segments.length) fail("empty_name", `条目名归一化后为空：${name}`);

  return { path: segments.join("/"), isDirectory: /\/$/.test(slashed) };
}

/** Unix 模式下 S_IFLNK；symlink 条目是 zip slip 的常见变体 */
export function isSymlink(entry) {
  const madeByUnix = (entry.versionMadeBy >> 8) === 3;
  if (!madeByUnix) return false;
  const mode = (entry.externalAttrs >>> 16) & 0xffff;
  return (mode & 0xf000) === 0xa000;
}

/* ───────────────────────── 结构解析 ───────────────────────── */

function findEocd(buf) {
  const min = Math.max(0, buf.length - (0xffff + 22));
  for (let offset = buf.length - 22; offset >= min; offset -= 1) {
    if (buf.readUInt32LE(offset) !== SIG_EOCD) continue;
    // zip64 定位器紧邻 EOCD 之前出现 → 明确拒绝，而不是误解析
    if (offset >= 20 && buf.readUInt32LE(offset - 20) === SIG_ZIP64_LOCATOR) {
      fail("zip64_unsupported", "不支持 zip64 格式的压缩包");
    }
    return offset;
  }
  fail("not_a_zip", "找不到 ZIP 结尾记录（EOCD），可能不是 zip 或文件已损坏");
}

function parseCentralDirectory(buf, limits) {
  const eocd = findEocd(buf);
  const diskNumber = buf.readUInt16LE(eocd + 4);
  const centralDisk = buf.readUInt16LE(eocd + 6);
  const entryCount = buf.readUInt16LE(eocd + 10);
  const centralSize = buf.readUInt32LE(eocd + 12);
  const centralOffset = buf.readUInt32LE(eocd + 16);

  if (diskNumber !== 0 || centralDisk !== 0) fail("multidisk", "不支持分卷压缩包");
  if (entryCount === 0xffff || centralOffset === 0xffffffff) fail("zip64_unsupported", "不支持 zip64 格式的压缩包");
  if (entryCount > limits.maxEntries) {
    fail("too_many_entries", `压缩包内文件过多：${entryCount} > ${limits.maxEntries}`);
  }
  if (centralOffset + centralSize > buf.length) fail("truncated", "中央目录越界，文件不完整");
  if (centralOffset >= eocd) {
    // 数据区与中央目录重叠通常意味着结构被刻意构造
    if (centralOffset + centralSize > eocd) fail("overlapping_sections", "中央目录与文件末尾记录重叠");
  }

  const entries = [];
  let cursor = centralOffset;
  const seen = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (cursor + 46 > buf.length) fail("truncated", "中央目录条目被截断");
    if (buf.readUInt32LE(cursor) !== SIG_CENTRAL) fail("bad_central_header", `中央目录条目签名错误（第 ${index + 1} 个）`);

    const versionMadeBy = buf.readUInt16LE(cursor + 4);
    const flags = buf.readUInt16LE(cursor + 8);
    const method = buf.readUInt16LE(cursor + 10);
    const crc32 = buf.readUInt32LE(cursor + 16);
    const compressedSize = buf.readUInt32LE(cursor + 20);
    const uncompressedSize = buf.readUInt32LE(cursor + 24);
    const nameLength = buf.readUInt16LE(cursor + 28);
    const extraLength = buf.readUInt16LE(cursor + 30);
    const commentLength = buf.readUInt16LE(cursor + 32);
    const externalAttrs = buf.readUInt32LE(cursor + 38);
    const localOffset = buf.readUInt32LE(cursor + 42);

    if (crc32 === 0xffffffff || compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) {
      fail("zip64_unsupported", "不支持 zip64 格式的压缩包");
    }

    const nameBytes = buf.subarray(cursor + 46, cursor + 46 + nameLength);
    const rawName = decodeName(nameBytes, flags);
    const { path, isDirectory } = checkEntryPath(rawName);

    const entry = {
      index,
      rawName,
      path,
      isDirectory: isDirectory || (externalAttrs & 0x10) !== 0,
      method,
      flags,
      crc32,
      compressedSize,
      uncompressedSize,
      localOffset,
      versionMadeBy,
      externalAttrs,
    };

    // ── 安全闸门 ──
    if (flags & FLAG_ENCRYPTED) fail("encrypted", `拒绝加密条目：${path}`);
    if (isSymlink(entry)) fail("symlink", `拒绝符号链接条目：${path}`);
    if (![METHOD_STORED, METHOD_DEFLATE].includes(method)) fail("unsupported_method", `不支持的压缩算法（method=${method}）：${path}`);
    if (uncompressedSize > limits.maxEntryBytes) fail("entry_too_large", `单文件过大：${path}（${uncompressedSize} 字节）`);
    if (compressedSize > 0 && uncompressedSize / compressedSize > limits.maxCompressionRatio) {
      fail("compression_ratio", `压缩比异常（疑似压缩炸弹）：${path}（${Math.round(uncompressedSize / compressedSize)}:1）`);
    }

    const key = path.toLowerCase();
    if (seen.has(key)) fail("duplicate_name", `大小写重名的条目（落盘会冲突）：${seen.get(key)} 与 ${path}`);
    seen.set(key, path);

    // 数据区必须落在中央目录之前，防止读到别的结构
    const dataStart = entry.localOffset + 30;
    if (dataStart > centralOffset) fail("bad_offset", `条目数据偏移越界：${path}`);
    if (dataStart + compressedSize > centralOffset) fail("bad_offset", `条目数据长度越界：${path}`);

    entries.push(entry);
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  const totalUncompressed = entries.reduce((sum, entry) => sum + entry.uncompressedSize, 0);
  if (totalUncompressed > limits.maxTotalBytes) {
    fail("total_too_large", `解压后总量超限：${(totalUncompressed / 1024 / 1024).toFixed(1)} MB > ${limits.maxTotalBytes / 1024 / 1024} MB`);
  }

  return entries;
}

/** 只解析结构（不解压），用于预检 */
export function parseZip(buf, limits = ZIP_LIMITS) {
  if (!Buffer.isBuffer(buf)) fail("not_buffer", "输入不是 Buffer");
  if (buf.length < 22) fail("too_small", "文件太小，不可能是 zip");
  if (buf.length > limits.maxArchiveBytes) {
    fail("archive_too_large", `压缩包过大：${(buf.length / 1024 / 1024).toFixed(1)} MB > ${limits.maxArchiveBytes / 1024 / 1024} MB`);
  }
  const entries = parseCentralDirectory(buf, limits);
  return {
    entries,
    fileCount: entries.filter((entry) => !entry.isDirectory).length,
    directoryCount: entries.filter((entry) => entry.isDirectory).length,
    totalUncompressed: entries.reduce((sum, entry) => sum + entry.uncompressedSize, 0),
  };
}

/* ───────────────────────── 解压 ───────────────────────── */

function readEntryData(buf, entry, limits) {
  const localOffset = entry.localOffset;
  if (localOffset + 30 > buf.length) fail("truncated", `本地头越界：${entry.path}`);
  if (buf.readUInt32LE(localOffset) !== SIG_LOCAL) fail("bad_local_header", `本地文件头签名错误：${entry.path}`);

  const nameLength = buf.readUInt16LE(localOffset + 26);
  const extraLength = buf.readUInt16LE(localOffset + 28);
  const dataStart = localOffset + 30 + nameLength + extraLength;
  const dataEnd = dataStart + entry.compressedSize;
  if (dataEnd > buf.length) fail("truncated", `条目数据越界：${entry.path}`);

  const raw = buf.subarray(dataStart, dataEnd);
  let data;
  if (entry.method === METHOD_STORED) {
    data = Buffer.from(raw);
  } else {
    try {
      // maxOutputLength 是关键的第二道防线：声明的大小可能撒谎
      data = zlib.inflateRawSync(raw, { maxOutputLength: Math.min(limits.maxEntryBytes, entry.uncompressedSize + 1) });
    } catch (error) {
      // Node 在输出超限时抛 RangeError { code: 'ERR_BUFFER_TOO_LARGE',
      // message: 'Cannot create a Buffer larger than N bytes' }
      const overLimit =
        error?.code === "ERR_BUFFER_TOO_LARGE" ||
        /maxOutputLength|output length|larger than/i.test(String(error?.message ?? ""));
      if (overLimit) fail("bomb_suspected", `解压输出超过声明大小（疑似压缩炸弹）：${entry.path}`);
      fail("inflate_failed", `解压失败：${entry.path}`);
    }
  }

  if (data.length !== entry.uncompressedSize) {
    fail("size_mismatch", `解压后大小与声明不符：${entry.path}（${data.length} ≠ ${entry.uncompressedSize}）`);
  }
  if (zlib.crc32(data) !== entry.crc32) {
    fail("crc_mismatch", `CRC 校验失败（文件已损坏或被篡改）：${entry.path}`);
  }
  return data;
}

/**
 * 解压全部文件到内存。
 * 返回 { files, directories, stats }；files 里只含普通文件。
 */
export function extractZip(buf, limits = ZIP_LIMITS) {
  const parsed = parseZip(buf, limits);
  const files = [];
  let totalBytes = 0;

  for (const entry of parsed.entries) {
    if (entry.isDirectory) continue;
    const data = readEntryData(buf, entry, limits);
    totalBytes += data.length;
    if (totalBytes > limits.maxTotalBytes) {
      fail("total_too_large", `解压后总量超限：${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
    }
    files.push({ path: entry.path, data, size: data.length, crc32: entry.crc32 });
  }

  return {
    files,
    directories: parsed.entries.filter((entry) => entry.isDirectory).map((entry) => entry.path),
    stats: {
      entryCount: parsed.entries.length,
      fileCount: files.length,
      totalBytes,
      archiveBytes: buf.length,
    },
  };
}

/** 供上层判断"是不是 zip"（不抛异常） */
export function looksLikeZip(buf) {
  return Buffer.isBuffer(buf) && buf.length >= 4 && buf.readUInt32LE(0) === SIG_LOCAL;
}

export const ZIP_SIGNATURES = { SIG_LOCAL, SIG_CENTRAL, SIG_EOCD, SIG_ZIP64_EOCD, SIG_ZIP64_LOCATOR };
