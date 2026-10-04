#!/usr/bin/env node
/** 清空本地数据库（仅开发用，避免误删生产库：路径必须是默认的 tavern-server/data） */

import fs from "node:fs";
import path from "node:path";

import { SERVER_ROOT, config } from "../src/config.mjs";

const expected = path.join(SERVER_ROOT, "data");
if (!path.resolve(config.dbPath).startsWith(expected)) {
  process.stderr.write(`✖ 拒绝执行：TAVERN_DB 不在默认目录内（${config.dbPath}）\n`);
  process.exit(1);
}

let removed = 0;
for (const suffix of ["", "-wal", "-shm"]) {
  const file = `${config.dbPath}${suffix}`;
  if (!fs.existsSync(file)) continue;
  try {
    fs.rmSync(file);
    removed += 1;
  } catch (error) {
    if (error.code === "EBUSY" || error.code === "EPERM") {
      process.stderr.write(`✖ 无法删除 ${file}：文件被占用。\n  请先停掉正在运行的服务（npm run dev）再重置。\n`);
      process.exit(1);
    }
    throw error;
  }
}

process.stdout.write(removed ? `✔ 已删除 ${removed} 个数据库文件\n` : "· 没有找到数据库文件\n");
