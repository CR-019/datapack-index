import crypto from "node:crypto";

import { config, nowIso } from "./config.mjs";
import { q } from "./db.mjs";

/* ── 令牌 ── */

/** Crockford base32（去掉易混的 I/L/O/U），32 字符 = 160 bit 熵 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function generateToken() {
  const bytes = crypto.randomBytes(20);
  let bits = 0n;
  for (const byte of bytes) bits = (bits << 8n) | BigInt(byte);
  let output = "";
  for (let i = 31; i >= 0; i -= 1) output += ALPHABET[Number((bits >> BigInt(i * 5)) & 31n)];
  return output;
}

/** 只存 sha256(token + pepper)，明文永不落库（ADR-004） */
export function hashToken(token) {
  return crypto.createHash("sha256").update(`${token}${config.tokenPepper}`).digest("hex");
}

export function generateSessionId() {
  return crypto.randomBytes(32).toString("base64url");
}

function timingSafeEqualHex(a, b) {
  const bufA = Buffer.from(String(a), "hex");
  const bufB = Buffer.from(String(b), "hex");
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/* ── 失败限流（按 pin + IP，指数退避；原型用内存表） ── */

const failures = new Map();

export function rateLimitState(key) {
  const entry = failures.get(key);
  if (!entry) return { locked: false };
  const now = Date.now();
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { locked: true, retryAfterMs: entry.lockedUntil - now };
  }
  if (now - entry.last > config.rateLimit.windowMs) {
    failures.delete(key);
    return { locked: false };
  }
  return { locked: false };
}

export function recordFailure(key) {
  const entry = failures.get(key) ?? { count: 0, last: 0, lockedUntil: 0 };
  const now = Date.now();
  if (now - entry.last > config.rateLimit.windowMs) entry.count = 0;
  entry.count += 1;
  entry.last = now;
  if (entry.count >= config.rateLimit.maxFailures) {
    entry.lockedUntil = now + config.rateLimit.lockMs * 2 ** (entry.count - config.rateLimit.maxFailures);
  }
  failures.set(key, entry);
  return entry;
}

export function clearFailures(key) {
  failures.delete(key);
}

/* ── 验证：pin + token → 会话 ── */

/**
 * 成功返回 { account, token }，失败返回 null。
 * 无论 pin 不存在还是 token 不匹配都返回 null —— 调用方必须给出**统一错误信息**，
 * 否则错误信息本身就成了"这个 pin 存不存在"的探测器（§7.4 ②）。
 */
export function authenticate(db, pin, token) {
  if (typeof pin !== "string" || typeof token !== "string" || !pin || !token) return null;

  const account = q.get(db, "SELECT * FROM accounts WHERE pin = ?", pin);
  if (!account || account.status !== "active") {
    // 仍然跑一次哈希，抹平响应时间差异
    hashToken(token);
    return null;
  }

  const candidate = hashToken(token);
  const tokens = q.all(db, "SELECT * FROM tokens WHERE account_id = ? AND revoked_at IS NULL", account.id);
  for (const row of tokens) {
    if (timingSafeEqualHex(row.hash, candidate)) {
      q.run(db, "UPDATE tokens SET last_used_at = ? WHERE id = ?", nowIso(), row.id);
      return { account, token: row };
    }
  }
  return null;
}

/* ── 会话 ── */

export function createSession(db, accountId, tokenId) {
  const id = generateSessionId();
  const created = nowIso();
  const expires = nowIso(config.sessionTtlDays * 24 * 60 * 60 * 1000);
  q.run(
    db,
    "INSERT INTO sessions (id, account_id, token_id, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)",
    id, accountId, tokenId ?? null, created, expires, created,
  );
  return { id, expiresAt: expires };
}

export function readSession(db, sessionId) {
  if (!sessionId) return null;
  const session = q.get(db, "SELECT * FROM sessions WHERE id = ?", sessionId);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    q.run(db, "DELETE FROM sessions WHERE id = ?", sessionId);
    return null;
  }
  const account = q.get(db, "SELECT * FROM accounts WHERE id = ?", session.account_id);
  if (!account || account.status !== "active") return null;
  // 令牌被吊销 → 其派生会话立即失效（§7.4 ②）
  if (session.token_id) {
    const token = q.get(db, "SELECT * FROM tokens WHERE id = ?", session.token_id);
    if (!token || token.revoked_at) {
      q.run(db, "DELETE FROM sessions WHERE id = ?", sessionId);
      return null;
    }
  }
  q.run(db, "UPDATE sessions SET last_seen_at = ? WHERE id = ?", nowIso(), sessionId);
  return { account, session };
}

export function destroySession(db, sessionId) {
  q.run(db, "DELETE FROM sessions WHERE id = ?", sessionId);
}

/** 吊销令牌 → 连带清除其派生会话 */
export function revokeToken(db, tokenId) {
  q.run(db, "UPDATE tokens SET revoked_at = ? WHERE id = ?", nowIso(), tokenId);
  q.run(db, "DELETE FROM sessions WHERE token_id = ?", tokenId);
}

/* ── 审计 ── */

export function audit(db, { actorId = null, tokenId = null, action, target = null, diff = null, reason = null }) {
  q.run(
    db,
    "INSERT INTO audit_log (actor_id, token_id, action, target, diff_json, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    actorId, tokenId, action, target, diff ? JSON.stringify(diff) : null, reason, nowIso(),
  );
}

/** 权限判定：由 maintains 边说话，不由身份类型说话（ADR-005） */
export function canEdit(db, accountId, nodeId) {
  const account = q.get(db, "SELECT role FROM accounts WHERE id = ?", accountId);
  if (!account) return false;
  if (account.role === "staff") return true;
  const edge = q.get(
    db,
    "SELECT 1 AS ok FROM edges WHERE from_id = ? AND rel = 'maintains' AND to_id = ?",
    accountId, nodeId,
  );
  return Boolean(edge);
}
