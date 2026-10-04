#!/usr/bin/env node
/**
 * 引导：创建第一个工作组（staff）账号。
 *
 * 只能在服务器本机执行；不接受任何远程调用路径（§7.4 ①）。
 * 明文令牌只显示一次，库里只留 sha256(token + pepper)。
 *
 *   npm run bootstrap -- --pin cr019 --name CR_019 --label "服务器引导"
 *   （不带 --pin 时交互式询问）
 */

import { createInterface } from "node:readline/promises";

import { config, nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { generateToken, hashToken } from "../src/auth.mjs";

function argOf(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const db = openDatabase();

const existingStaff = q.get(db, "SELECT id, pin FROM accounts WHERE role = 'staff' LIMIT 1");
if (existingStaff && !process.argv.includes("--force")) {
  process.stderr.write(
    `✖ 已存在工作组账号「${existingStaff.pin}」（${existingStaff.id}）。\n` +
    "  重复引导会制造第二个不受控的管理员。确需新增请由已有 staff 走签发流程，\n" +
    "  或在明确知情时加 --force。\n",
  );
  process.exit(1);
}

let pin = argOf("pin");
let name = argOf("name");
const label = argOf("label") ?? "服务器引导";
const email = argOf("email") ?? null;

if (!pin) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  pin = (await rl.question("pin（用户名，建议 ASCII，如 cr019）：")).trim();
  if (!name) name = (await rl.question("显示名（可中文，如 CR_019）：")).trim();
  rl.close();
}

if (!pin || !/^[A-Za-z0-9._-]{2,32}$/.test(pin)) {
  process.stderr.write("✖ pin 需为 2–32 位 [A-Za-z0-9._-]\n");
  process.exit(1);
}
if (q.get(db, "SELECT 1 AS ok FROM accounts WHERE pin = ?", pin)) {
  process.stderr.write(`✖ pin「${pin}」已被占用\n`);
  process.exit(1);
}

const displayName = name?.trim() || pin;
/** 节点 id 一律带类型前缀（kind:slug）——不同实体类型会重名，见 README「命名空间」 */
const nodeId = `person:${displayName}`;
const token = generateToken();
const timestamp = nowIso();

/**
 * 两种情形（§7.4 ⑤「认领」）：
 *   · 节点不存在 → 新建 person 节点
 *   · 节点已存在且无账户 → 认领它（保留既有 profile 与边，只补账户）——种子导入后这是常态
 *   · 节点已存在且有账户 → 拒绝
 */
const existingNode = q.get(db, "SELECT * FROM nodes WHERE id = ?", nodeId);
const claimed = Boolean(existingNode);

if (claimed && !["person", "team"].includes(existingNode.kind)) {
  process.stderr.write(`✖ 「${nodeId}」已存在，但它是 ${existingNode.kind} 节点，不能作为主体账号。请换一个显示名。\n`);
  process.exit(1);
}
if (claimed && q.get(db, "SELECT 1 AS ok FROM accounts WHERE id = ?", nodeId)) {
  process.stderr.write(`✖ 「${nodeId}」已被认领过（已有账号）。\n`);
  process.exit(1);
}

db.exec("BEGIN");
try {
  if (!claimed) {
    // 主体节点（person）—— 身份与展示共用同一张表（ADR-005）
    q.run(
      db,
      "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'person', ?, ?, ?)",
      nodeId,
      JSON.stringify({
        name: displayName,
        i18n: { zh: { title: displayName } },
        facets: { state: "active" },
      }),
      timestamp, timestamp,
    );
    q.run(
      db,
      "INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, created_at) VALUES (?, ?, ?, ?, 'published', ?)",
      `seed_${nodeId}_1`, nodeId, nodeId, JSON.stringify({ name: displayName }), timestamp,
    );
    q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", `seed_${nodeId}_1`, nodeId);
  } else if (!existingNode.published_revision_id) {
    // 认领了一个尚未发布的节点 → 补一个已发布修订，使其可见
    q.run(
      db,
      "INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, created_at) VALUES (?, ?, ?, ?, 'published', ?)",
      `claim_${nodeId}_1`, nodeId, nodeId, existingNode.profile_json, timestamp,
    );
    q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", `claim_${nodeId}_1`, nodeId);
  }

  q.run(
    db,
    "INSERT INTO accounts (id, pin, role, status, email, notes, created_at) VALUES (?, ?, 'staff', 'active', ?, NULL, ?)",
    nodeId, pin, email, timestamp,
  );

  q.run(
    db,
    "INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES (?, ?, ?, ?, ?)",
    `tok_${Date.now().toString(36)}`, nodeId, label, hashToken(token), timestamp,
  );

  q.run(
    db,
    "INSERT INTO audit_log (actor_id, action, target, reason, created_at) VALUES (?, ?, ?, ?, ?)",
    nodeId,
    claimed ? "account.bootstrap.claim" : "account.bootstrap",
    pin,
    claimed ? "服务器本机引导并认领既有作者档案" : "服务器本机引导",
    timestamp,
  );
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

process.stdout.write(
  `\n✔ 工作组账号已创建${claimed ? "（认领了既有作者档案，原有条目归属保持不变）" : ""}\n\n` +
  `   pin    : \x1b[1m${pin}\x1b[0m\n` +
  `   token  : \x1b[1m${token}\x1b[0m\n\n` +
  `   ⚠️  token 只显示这一次，库里只存哈希，无法找回。\n` +
  `      丢失后需另一位 staff 签发新令牌并吊销旧的。\n\n` +
  `   验证：\n` +
  `   curl -i -X POST http://${config.host}:${config.port}/v1/auth/session \\\n` +
  `     -H 'Content-Type: application/json' \\\n` +
  `     -d '{"pin":"${pin}","token":"${token}"}'\n\n`,
);

db.close();
