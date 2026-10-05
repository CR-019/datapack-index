/**
 * 凭证签发与吊销（设计 §7.4 ②③ / FR-13 / FR-16）
 * =============================================================================
 * 系统**没有公开注册**：所有身份都来自人工签发。所以"令牌怎么安全地交到人手上"
 * 与"人员离开怎么办"必须是一条真接口，而不是"维护者手工往数据库插一行"——
 * 后者是本项目最可能的运维事故源头（设计 §7.4 开头就点了这件事）。
 *
 * 三条贯穿本文件的不变式：
 *   · **明文只出现一次**：只有本模块的返回值里有明文；库里只有 `sha256(token+pepper)`，
 *     返回值之外任何地方（审计、日志、错误信息）都不许出现它。
 *   · **每一笔都留痕**：建主体 / 签发 / 吊销都写 `audit_log`（谁、何时、对谁、为什么）。
 *   · **吊销立即生效**：连带删除由该令牌派生的会话（`auth.revokeToken` 已实现，
 *     这里绝不另写一份删除逻辑——两份实现就是两个会漂移的真相）。
 *
 * ⚠️ 本模块只被 `routes.mjs` 的 **staff 路由**调用。它碰的是私有域表
 * （accounts / tokens / sessions / audit_log），那些表不在读模型的公开白名单里
 * （ADR-011）——所以它绝不能出现在任何公开读路径上。
 */

import crypto from "node:crypto";

import { audit, generateToken, hashToken, revokeToken } from "./auth.mjs";
import { nowIso } from "./config.mjs";
import { q } from "./db.mjs";

export class CredentialError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "CredentialError";
    this.status = status;
    this.code = code;
  }
}

/** pin 形状（与 scripts/bootstrap.mjs 同一套规则：ASCII，便于命令行输入与抄写） */
export const PIN_PATTERN = /^[A-Za-z0-9._-]{2,32}$/;
/** 主体类型：只有人能持凭证（`team` 是"一个 pin = N 枚令牌"的那支，见 ADR-004） */
export const SUBJECT_KINDS = ["person", "team"];
/** 能持凭证的角色。staff 也走同一条签发流程（bootstrap 的报错就是这么指的） */
export const ISSUABLE_ROLES = ["author", "staff"];
/** 账号状态：`suspended` 是"这个人现在不能进系统"（与吊销令牌分开的一档） */
export const ACCOUNT_STATUSES = ["active", "suspended"];

const MAX_NAME_LENGTH = 64;
const MAX_LABEL_LENGTH = 64;

/** 令牌条数上限：设计待决问题 #12 未定，所以先不设上限，但把口子留在一处。 */
const MAX_TOKENS_PER_ACCOUNT = 12;

function normalizePin(raw) {
  const pin = String(raw ?? "").trim();
  if (!pin) throw new CredentialError(400, "invalid_request", "请提供 pin（用户名）");
  if (!PIN_PATTERN.test(pin)) {
    throw new CredentialError(400, "bad_pin", "pin 需为 2–32 位 [A-Za-z0-9._-]（建议 ASCII，便于命令行输入与抄写）");
  }
  return pin;
}

function normalizeLabel(raw, fallback) {
  const label = String(raw ?? "").trim();
  if (!label) return fallback;
  if (Array.from(label).length > MAX_LABEL_LENGTH) {
    throw new CredentialError(400, "bad_label", `令牌标签最长 ${MAX_LABEL_LENGTH} 个字符`);
  }
  return label;
}

/**
 * pin 查重**不区分大小写**。
 *
 * 登录查询是精确匹配（`WHERE pin = ?`），所以「Cases」与「cases」在库里是两行、
 * 都能登录 —— 这正是问题：签发人以为自己补发了一枚令牌，实际造了一个新身份，
 * 而且两个身份看起来一模一样（审核、审计里分不清谁是谁）。
 * 别处（bootstrap）仍是精确匹配，这里收紧不影响既有账号。
 */
function findPinConflict(db, pin, { exceptAccountId = null } = {}) {
  return q.get(
    db,
    `SELECT id, pin FROM accounts WHERE lower(pin) = lower(?) ${exceptAccountId ? "AND id <> ?" : ""} LIMIT 1`,
    ...(exceptAccountId ? [pin, exceptAccountId] : [pin]),
  );
}

function activeTokenCount(db, accountId) {
  return q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE account_id = ? AND revoked_at IS NULL", accountId).c;
}

/**
 * 签发一枚新令牌。
 * @returns {{ id:string, label:string, plaintext:string, createdAt:string }}
 *   `plaintext` 是**唯一一次**明文出现的地方，调用方必须只回给签发人。
 */
export function issueToken(db, { accountId, label = null, actorId, reason = "工作组签发", withinTransaction = false, ignoreLimit = false }) {
  const account = q.get(db, "SELECT id, pin, role, status FROM accounts WHERE id = ?", accountId);
  if (!account) throw new CredentialError(404, "account_not_found", `主体 ${accountId} 没有账号，无法签发令牌`);
  if (account.status !== "active") {
    throw new CredentialError(409, "account_suspended", `账号「${account.pin}」已停用，先恢复再签发`);
  }
  // `ignoreLimit` 只给轮换用：它一次吊销一枚，净增为 0（见 rotateCredential 的注释）
  if (!ignoreLimit && activeTokenCount(db, accountId) >= MAX_TOKENS_PER_ACCOUNT) {
    throw new CredentialError(
      409, "too_many_tokens",
      `「${account.pin}」已有 ${MAX_TOKENS_PER_ACCOUNT} 枚有效令牌 —— 先吊销不再使用的，再签发新的（数量上限见设计 §14 待决 #12）`,
    );
  }

  const plaintext = generateToken();
  const now = nowIso();
  const id = `tok_${Date.now().toString(36)}_${crypto.randomBytes(4).toString("hex")}`;
  // 只归一化一次：`label` 同时进库、进审计、进返回值，三处必须一模一样
  const tokenLabel = normalizeLabel(label, "工作组签发");

  const run = () => {
    q.run(
      db,
      "INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES (?, ?, ?, ?, ?)",
      id, accountId, tokenLabel, hashToken(plaintext), now,
    );
    // ⚠️ 审计里写 token id 与标签，**绝不写明文**（审计表会进备份、进运维视野）
    audit(db, {
      actorId, action: "token.issued", target: account.pin,
      reason: `${reason}：token=${id} label=${tokenLabel}`,
    });
  };

  if (withinTransaction) run();
  else {
    db.exec("BEGIN");
    try { run(); db.exec("COMMIT"); } catch (error) { db.exec("ROLLBACK"); throw error; }
  }

  return { id, label: tokenLabel, plaintext, createdAt: now, accountId, pin: account.pin, role: account.role };
}

/**
 * 建主体 + 账号 + 首枚令牌（一条链路走完）。
 *
 * 与 `scripts/bootstrap.mjs` 同一条认领规则（§7.4 ⑤）：
 *   · 节点不存在 → 新建 person/team 节点并发布一条初始修订（否则公开面读不到这个主体）
 *   · 节点已存在且无账号 → **认领**它（保留既有 profile 与边，只补账号）—— 种子导入后这是常态
 *   · 节点已存在且有账号 → 拒绝（那是"补发令牌"，该走 issueToken，不该造第二个身份）
 */
export function createSubject(db, { pin, name = null, kind = "person", role = "author", label = null, email = null, actorId, reason = "工作组签发" }) {
  const normalizedPin = normalizePin(pin);
  const subjectKind = String(kind ?? "person").trim() || "person";
  if (!SUBJECT_KINDS.includes(subjectKind)) {
    throw new CredentialError(400, "invalid_kind", `主体类型只能是 ${SUBJECT_KINDS.join(" / ")}（作者、团队走投稿管线的是条目，不是身份）`);
  }
  const subjectRole = String(role ?? "author").trim() || "author";
  if (!ISSUABLE_ROLES.includes(subjectRole)) {
    throw new CredentialError(400, "invalid_role", `角色只能是 ${ISSUABLE_ROLES.join(" / ")}（bot 不对人签发）`);
  }

  /*
   * 显示名同时是节点 id 的一部分（`person:显示名`），所以超长要**报错**而不是截断：
   * 静默截断会让"我签发的到底是谁"和界面上填的名字不一致，而这种偏差在库里
   * 看起来完全正常 —— 事后没人能说清是不是同一个主体。
   */
  const displayName = String(name ?? "").trim() || normalizedPin;
  if (Array.from(displayName).length > MAX_NAME_LENGTH) {
    throw new CredentialError(400, "bad_name", `显示名最长 ${MAX_NAME_LENGTH} 个字符（它同时是主体 id 的一部分，如 person:显示名）`);
  }
  /** 节点 id 一律带类型前缀（kind:slug），与 bootstrap 完全一致 —— 同名不同类不许撞车 */
  const nodeId = `${subjectKind}:${displayName}`;

  const conflict = findPinConflict(db, normalizedPin);
  if (conflict) {
    throw new CredentialError(409, "pin_taken", `pin「${normalizedPin}」已被「${conflict.id}」占用（pin 不区分大小写，且不可变）`);
  }

  const existingNode = q.get(db, "SELECT * FROM nodes WHERE id = ?", nodeId);
  if (existingNode && !SUBJECT_KINDS.includes(existingNode.kind)) {
    throw new CredentialError(
      400, "subject_kind_conflict",
      `「${nodeId}」已存在，但它是 ${existingNode.kind} 节点，不能作为主体账号 —— 换一个显示名，或把类型改成团队`,
    );
  }
  if (existingNode && q.get(db, "SELECT 1 AS ok FROM accounts WHERE id = ?", nodeId)) {
    throw new CredentialError(
      409, "already_claimed",
      `「${nodeId}」已被认领过（已有账号）—— 补发令牌请用「签发新令牌」，不要新建第二个身份`,
    );
  }

  const now = nowIso();
  const claimed = Boolean(existingNode);
  const tokenLabel = normalizeLabel(label, "首次签发");

  db.exec("BEGIN");
  try {
    if (!claimed) {
      q.run(
        db,
        "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        nodeId, subjectKind,
        JSON.stringify({ name: displayName, i18n: { zh: { title: displayName } }, facets: { state: "active" } }),
        now, now,
      );
      /*
       * ⚠️ 必须同时补一条 published 修订并把 published_revision_id 指过去。
       * 少了这一步，主体是"存在但未上架"的：公开面的作者页 404，而签发人完全
       * 看不出哪里不对（库里明明有这一行）。bootstrap 早就踩过同一个坑。
       */
      const revisionId = `seed_${nodeId}_1`;
      q.run(
        db,
        "INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, created_at) VALUES (?, ?, ?, ?, 'published', ?)",
        revisionId, nodeId, nodeId, JSON.stringify({ name: displayName }), now,
      );
      q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", revisionId, nodeId);
    } else if (!existingNode.published_revision_id) {
      // 认领了一个尚未发布的节点 → 补一条已发布修订，使其可见（内容用既有 profile，不改一个字）
      const revisionId = `claim_${nodeId}_1`;
      q.run(
        db,
        "INSERT INTO revisions (id, node_id, author_id, snapshot_json, status, created_at) VALUES (?, ?, ?, ?, 'published', ?)",
        revisionId, nodeId, nodeId, existingNode.profile_json, now,
      );
      q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", revisionId, nodeId);
    }

    q.run(
      db,
      "INSERT INTO accounts (id, pin, role, status, email, notes, created_at) VALUES (?, ?, ?, 'active', ?, NULL, ?)",
      nodeId, normalizedPin, subjectRole, email ? String(email).trim() : null, now,
    );

    audit(db, {
      actorId, action: claimed ? "account.created.claim" : "account.created", target: normalizedPin,
      reason: `${reason}：${nodeId} role=${subjectRole}${claimed ? "（认领既有主体，原有条目归属不变）" : ""}`,
    });

    const token = issueToken(db, { accountId: nodeId, label: tokenLabel, actorId, reason, withinTransaction: true });
    db.exec("COMMIT");

    return {
      subject: { id: nodeId, pin: normalizedPin, role: subjectRole, kind: subjectKind, title: displayName },
      claimed,
      token,
    };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/**
 * 吊销一枚令牌（连带清掉由它派生的会话 → 立刻失效，§7.4 ②）。
 *
 * 那条"最后一枚工作组凭证"的守门是刻意的：把最后一枚 staff 令牌吊销掉，
 * 整个工作组就**谁也进不来了**（没有密码找回，只能上服务器跑 bootstrap，
 * 而 bootstrap 见到已有 staff 还会拒绝）。所以宁可当场拒绝，让人先签发新的。
 */
export function revokeCredential(db, { accountId, tokenId, actorId, reason = "工作组吊销" }) {
  const token = q.get(db, "SELECT * FROM tokens WHERE id = ? AND account_id = ?", tokenId, accountId);
  if (!token) throw new CredentialError(404, "token_not_found", "令牌不存在，或不属于这个主体");
  if (token.revoked_at) throw new CredentialError(409, "already_revoked", "这枚令牌已经吊销过了");

  const account = q.get(db, "SELECT id, pin, role FROM accounts WHERE id = ?", accountId);
  if (!account) throw new CredentialError(404, "account_not_found", "主体没有账号");

  if (account.role === "staff") {
    const remaining = q.get(
      db,
      `SELECT COUNT(*) AS c FROM tokens t JOIN accounts a ON a.id = t.account_id
       WHERE a.role = 'staff' AND a.status = 'active' AND t.revoked_at IS NULL AND t.id <> ?`,
      tokenId,
    ).c;
    if (remaining === 0) {
      throw new CredentialError(
        409, "last_staff_credential",
        "这是最后一枚有效的工作组凭证 —— 吊销后没人能再登录管理看板（且没有密码找回）。请先签发一枚新的，再吊销这枚。",
      );
    }
  }

  const now = nowIso();
  db.exec("BEGIN");
  try {
    const killedSessions = q.get(db, "SELECT COUNT(*) AS c FROM sessions WHERE token_id = ?", tokenId).c;
    // 复用 auth.mjs 的那一份实现：吊销 + 删派生会话（绝不在这里另写一套删除）
    revokeToken(db, tokenId);
    audit(db, {
      actorId, action: "token.revoked", target: account.pin,
      reason: `${reason}：token=${token.id} label=${token.label} 连带清除 ${killedSessions} 个会话`,
    });
    db.exec("COMMIT");
    return { tokenId: token.id, accountId: account.id, pin: account.pin, label: token.label, revokedAt: now, killedSessions };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/* ───────────────── 账号状态：停用与恢复 ───────────────── */

/**
 * 停用 / 恢复一个账号（`accounts.status`）。
 *
 * 为什么"停用"必须是独立于吊销令牌的一档：**人离开了，作品还在**。
 * 吊销令牌是"收回这一枚写权限"，账号与主体节点都还在（他还能重新登录吗？不能，
 * 但只要有别的令牌就行）；而停用是"这个人现在不能进系统"，与手里有几枚令牌无关 ——
 * 恢复时也只需要改一个字段，不必重新签发、重新交付凭证。
 *
 * 两条刻意的语义：
 *   · 停用**立即**让名下所有会话失效 —— 认证层本来就会因为 `status != 'active'`
 *     拒绝（`readSession`），这里再顺手把会话行删掉：既让意图写明白，也不留一堆
 *     永远不会被认领的行。注意**不动令牌**，所以恢复是瞬时的。
 *   · 拒绝停用**最后一个有效的工作组成员**：那等于把整个工作组关在门外，而且
 *     这次连"用另一枚令牌登录"的退路都没有（账号级封锁）。要停先加人。
 */
export function setAccountStatus(db, { accountId, status, actorId, reason = "工作组操作" }) {
  const target = String(status ?? "").trim();
  if (!ACCOUNT_STATUSES.includes(target)) {
    throw new CredentialError(400, "bad_status", `status 只能是 ${ACCOUNT_STATUSES.join(" / ")}`);
  }

  const account = q.get(db, "SELECT id, pin, role, status FROM accounts WHERE id = ?", accountId);
  if (!account) throw new CredentialError(404, "account_not_found", `主体 ${accountId} 没有账号`);
  if (account.status === target) {
    throw new CredentialError(409, "no_change", `账号「${account.pin}」已经是 ${target} 了`);
  }

  if (target === "suspended" && account.role === "staff") {
    const remaining = q.get(
      db,
      "SELECT COUNT(*) AS c FROM accounts WHERE role = 'staff' AND status = 'active' AND id <> ?",
      accountId,
    ).c;
    if (remaining === 0) {
      throw new CredentialError(
        409, "last_staff_account",
        "这是最后一个有效的工作组成员 —— 停用之后没人能进后台把它恢复回来。请先启用或签发另一位工作组同事。",
      );
    }
  }

  const now = nowIso();
  db.exec("BEGIN");
  try {
    const killedSessions = q.get(db, "SELECT COUNT(*) AS c FROM sessions WHERE account_id = ?", accountId).c;
    q.run(db, "UPDATE accounts SET status = ? WHERE id = ?", target, accountId);
    if (target === "suspended") q.run(db, "DELETE FROM sessions WHERE account_id = ?", accountId);
    audit(db, {
      actorId,
      action: target === "suspended" ? "account.suspended" : "account.reactivated",
      target: account.pin,
      reason: target === "suspended"
        ? `${reason}：清除 ${killedSessions} 个会话（令牌保留，恢复即可用）`
        : `${reason}：账号恢复为 active`,
    });
    db.exec("COMMIT");
    return { accountId: account.id, pin: account.pin, role: account.role, status: target, at: now, killedSessions };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/* ───────────────── 轮换：补发新的 + 吊销旧的，一步到位 ───────────────── */

/**
 * 轮换一枚令牌：签发一枚新的，同时吊销旧的。
 *
 * 与"先补发、再吊销"两步走的关系：两步是**默认**做法，因为它把风险留在人手上 ——
 * 新凭证还没交到本人手上就吊销旧的，他当场下线（正在填的投稿会提交失败）。
 * 轮换是给"确认已经交接到位、或旧凭证已经泄露必须立刻作废"这种收尾场景用的，
 * 所以界面上必须把这件事在确认框里说清楚。
 *
 * 两个实现细节：
 *   · **先签新的再吊销旧的**，顺序不能反。反过来的话，轮换"最后一枚工作组令牌"
 *     会撞上 `revokeCredential` 的守门而被拒 —— 而轮换恰恰是最不该被拒的那种操作。
 *   · 令牌条数上限在轮换时要**放行**：净增为 0（签发一枚、吊销一枚）。
 *     否则一个已经用满 12 枚的账号就永远轮换不了，只能先手动吊销 —— 多一步无谓操作。
 *   · 这里用 `auth.revokeToken` 而不是 `revokeCredential`：后者的守门会自己开事务，
 *     套在本函数的事务里就是"不能在事务里再开事务"。（守门本身在轮换下也永远为假。）
 */
export function rotateCredential(db, { accountId, tokenId, label = null, actorId, reason = "工作组轮换" }) {
  const old = q.get(db, "SELECT * FROM tokens WHERE id = ? AND account_id = ?", tokenId, accountId);
  if (!old) throw new CredentialError(404, "token_not_found", "令牌不存在，或不属于这个主体");
  if (old.revoked_at) throw new CredentialError(409, "already_revoked", "这枚令牌已经吊销过了，直接签发新的即可");

  const account = q.get(db, "SELECT id, pin, role, status FROM accounts WHERE id = ?", accountId);
  if (!account) throw new CredentialError(404, "account_not_found", "主体没有账号");

  db.exec("BEGIN");
  try {
    const issued = issueToken(db, {
      accountId,
      label: label ?? old.label,
      actorId,
      reason,
      withinTransaction: true,
      ignoreLimit: true,
    });
    const killedSessions = q.get(db, "SELECT COUNT(*) AS c FROM sessions WHERE token_id = ?", tokenId).c;
    revokeToken(db, old.id);
    audit(db, {
      actorId, action: "token.rotated", target: account.pin,
      reason: `${reason}：${old.id}（${old.label}）→ ${issued.id}（${issued.label}），连带清除 ${killedSessions} 个会话`,
    });
    db.exec("COMMIT");
    return {
      subject: { id: account.id, pin: account.pin, role: account.role },
      token: issued,
      revokedTokenId: old.id,
      revokedLabel: old.label,
      killedSessions,
    };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/* ───────────────── 管理台一屏数据 ───────────────── */

/**
 * 凭证管理台要的那一屏。
 *
 * ⚠️ **绝不 select `tokens.hash`**：管理台是给人看的页面，哈希一旦进了响应体，
 *    它就会进浏览器缓存、进截图、进复制粘贴。断言这一点的测试在
 *    `tests/credentials.test.mjs`（"响应里不出现 hash"）。
 */
export function credentialConsole(db, { auditLimit = 20 } = {}) {
  const subjects = q.all(
    db,
    `SELECT a.id, a.pin, a.role, a.status, a.created_at AS createdAt, a.email,
            n.kind AS kind, json_extract(n.profile_json, '$.i18n.zh.title') AS title
     FROM accounts a LEFT JOIN nodes n ON n.id = a.id
     ORDER BY CASE a.role WHEN 'staff' THEN 0 ELSE 1 END, a.created_at`,
  ).map((row) => ({ ...row, tokens: [] }));

  const byId = new Map(subjects.map((subject) => [subject.id, subject]));
  const tokens = q.all(
    db,
    `SELECT id, account_id AS accountId, label, created_at AS createdAt,
            last_used_at AS lastUsedAt, revoked_at AS revokedAt
     FROM tokens ORDER BY created_at DESC`,
  );
  for (const token of tokens) {
    const owner = byId.get(token.accountId);
    // 账号行没了（理论上被外键挡住）却还有令牌：宁可显示成孤儿，也不要静默吞掉
    if (owner) owner.tokens.push(token);
  }

  const stats = {
    subjects: subjects.length,
    activeTokens: tokens.filter((token) => !token.revokedAt).length,
    revokedTokens: tokens.filter((token) => token.revokedAt).length,
    staffActiveTokens: tokens.filter((token) => !token.revokedAt && byId.get(token.accountId)?.role === "staff").length,
    suspendedSubjects: subjects.filter((subject) => subject.status !== "active").length,
  };

  // "谁签发了谁"必须可查（§7.4 ⑦）：管理台直接把最近的凭证类审计摆出来
  const trail = q.all(
    db,
    `SELECT l.created_at AS at, l.action, l.target, l.reason, l.actor_id AS actorId,
            COALESCE(a.pin, l.actor_id) AS actor
     FROM audit_log l LEFT JOIN accounts a ON a.id = l.actor_id
     WHERE l.action IN ('account.created', 'account.created.claim', 'account.suspended', 'account.reactivated',
                        'token.issued', 'token.rotated', 'token.revoked', 'auth.failed')
     ORDER BY l.created_at DESC, l.id DESC LIMIT ?`,
    auditLimit,
  );

  return { schema: 1, generatedAt: nowIso(), subjects, stats, trail };
}
