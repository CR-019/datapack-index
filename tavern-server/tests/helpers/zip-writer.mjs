/**
 * 测试用 ZIP 写入器。
 *
 * 自己造包（而不是用真压缩工具）才能**刻意构造恶意结构**：
 * 穿越路径、符号链接、谎报大小、篡改 CRC、大小写重名……
 * 这些都是必须被拦下的输入，用真工具很难稳定复现。
 */

import zlib from "node:zlib";

export function buildZip(entries, { versionMadeBy = 0x031e } = {}) {
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

/** 从多行字符串构造文件条目，便于测试里写模板 */
export function textEntry(name, text) {
  return { name, data: Buffer.from(text, "utf8") };
}
