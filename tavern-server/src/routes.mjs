import { config, nowIso } from "./config.mjs";
import { q } from "./db.mjs";
import { PUBLIC_CORS, clientIp, parseCookies, readBody, readJson, sendJson, serializeCookie } from "./http.mjs";
import { createRouter } from "./http.mjs";
import { audit, authenticate, clearFailures, createSession, destroySession, rateLimitState, readSession, recordFailure } from "./auth.mjs";
import { parseMultipart, requireFile } from "./multipart.mjs";
import { ZIP_LIMITS } from "./zip.mjs";
import { ingestZip } from "./ingest.mjs";
import { normalizeSlug, pendingQueue, reviewRevision, saveSubmission, storeInbox } from "./submissions.mjs";
import {
  buildStatus,
  buildTimeline,
  clampLimit,
  decodeCursor,
  findAuthor,
  findPublishedNode,
  findTag,
  listPublishedAuthors,
  listPublishedNodes,
  listTags,
  publicNode,
  tagMembers,
} from "./read-model.mjs";

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const KINDS = new Set(["project", "event", "index", "tag", "person", "team"]);

export function buildRouter(db) {
  const router = createRouter();
  const cookieName = config.sessionCookie;

  const currentSession = (req) => readSession(db, parseCookies(req)[cookieName]);

  const requireSession = (req) => {
    const ctx = currentSession(req);
    if (!ctx) throw new HttpError(401, "unauthenticated", "未登录或会话已失效");
    return ctx;
  };

  const assertKind = (kind) => {
    if (kind && !KINDS.has(kind)) throw new HttpError(400, "invalid_kind", `未知的 kind：${kind}`);
  };

  /* ───────────────── 健康与状态（公开） ───────────────── */

  router.get("/healthz", ({ res }) => {
    const nodeCount = q.get(db, `SELECT COUNT(*) AS c FROM nodes`).c;
    sendJson(res, 200, {
      ok: true,
      generatedAt: nowIso(),
      nodeCount,
      servingPreviousSnapshot: false,
    }, { ...PUBLIC_CORS, "Cache-Control": "no-store" });
  });

  router.get("/v1/status", ({ req, res }) => {
    const payload = buildStatus(db);
    // 私域计数只对工作组可见 —— 而且这条查询刻意放在路由里、不进读模型，
    // 以保持 read-model.mjs 的表级白名单（只碰 nodes / edges / tag_members）
    const ctx = currentSession(req);
    if (ctx?.account.role === "staff") {
      payload.private = {
        accounts: q.get(db, "SELECT COUNT(*) AS c FROM accounts").c,
        activeTokens: q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE revoked_at IS NULL").c,
      };
    }
    sendJson(res, 200, payload, { ...PUBLIC_CORS, "Cache-Control": "public, max-age=30" });
  });

  /* ───────────────── 节点（公开只读，仅已发布） ───────────────── */

  router.get("/v1/nodes", ({ res, url }) => {
    const kind = url.searchParams.get("kind");
    assertKind(kind);
    const result = listPublishedNodes(db, {
      kind,
      tag: url.searchParams.get("tag"),
      state: url.searchParams.get("state"),
      search: url.searchParams.get("q"),
      limit: clampLimit(url.searchParams.get("limit")),
      offset: decodeCursor(url.searchParams.get("cursor")),
    });
    sendJson(res, 200, { schema: 1, ...result }, { ...PUBLIC_CORS, "Cache-Control": "public, max-age=60" });
  });

  router.get("/v1/nodes/:id", ({ res, params }) => {
    const node = findPublishedNode(db, params.id, { withEdges: true });
    if (!node) throw new HttpError(404, "not_found", "条目不存在或尚未上架");
    sendJson(res, 200, { schema: 1, node }, PUBLIC_CORS);
  });

  router.get("/v1/nodes/:id/edges", ({ res, params }) => {
    const node = findPublishedNode(db, params.id, { withEdges: true });
    if (!node) throw new HttpError(404, "not_found", "条目不存在或尚未上架");
    sendJson(res, 200, { schema: 1, id: node.id, edges: node.edges, incoming: node.incoming }, PUBLIC_CORS);
  });

  /* ───────────────── 作者（公开 profile） ───────────────── */

  router.get("/v1/authors", ({ res, url }) => {
    const result = listPublishedAuthors(db, {
      limit: clampLimit(url.searchParams.get("limit")),
      offset: decodeCursor(url.searchParams.get("cursor")),
    });
    sendJson(res, 200, { schema: 1, ...result }, PUBLIC_CORS);
  });

  router.get("/v1/authors/:id", ({ res, params }) => {
    const payload = findAuthor(db, params.id);
    if (!payload) throw new HttpError(404, "not_found", "作者不存在");
    sendJson(res, 200, { schema: 1, ...payload }, PUBLIC_CORS);
  });

  /* ───────────────── 标签（成员由查询算出 + 物化） ───────────────── */

  router.get("/v1/tags", ({ res }) => {
    const items = listTags(db);
    sendJson(res, 200, { schema: 1, items, total: items.length }, { ...PUBLIC_CORS, "Cache-Control": "public, max-age=300" });
  });

  router.get("/v1/tags/:id", ({ res, params }) => {
    const tag = findTag(db, params.id);
    if (!tag) throw new HttpError(404, "not_found", "标签不存在");
    sendJson(res, 200, { schema: 1, tag }, { ...PUBLIC_CORS, "Cache-Control": "public, max-age=300" });
  });

  router.get("/v1/tags/:id/members", ({ res, params }) => {
    const tag = findTag(db, params.id);
    if (!tag) throw new HttpError(404, "not_found", "标签不存在");
    sendJson(res, 200, { schema: 1, tag, items: tagMembers(db, params.id) }, PUBLIC_CORS);
  });

  /* ───────────────── 时间轴 ───────────────── */

  router.get("/v1/timeline", ({ res, url }) => {
    const { source, items } = buildTimeline(db, { limit: clampLimit(url.searchParams.get("limit")) });
    sendJson(res, 200, { schema: 1, source, items }, PUBLIC_CORS);
  });

  /* ───────────────── 认证：pin + token → 会话 ───────────────── */

  router.post("/v1/auth/session", async ({ req, res }) => {
    const body = await readJson(req, 64 * 1024);
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!pin || !token) throw new HttpError(400, "invalid_request", "请提供 pin 与 token");

    const key = `${pin}|${clientIp(req)}`;
    const gate = rateLimitState(key);
    if (gate.locked) {
      throw new HttpError(429, "too_many_attempts", `尝试过于频繁，请 ${Math.ceil(gate.retryAfterMs / 1000)} 秒后再试`);
    }

    const result = authenticate(db, pin, token);
    if (!result) {
      const state = recordFailure(key);
      audit(db, { action: "auth.failed", target: pin, reason: "凭证不匹配" });
      // 统一错误信息：不区分"pin 不存在"与"token 错"
      throw new HttpError(401, "invalid_credentials", `pin 或 token 不正确（第 ${state.count} 次失败）`);
    }

    clearFailures(key);
    const session = createSession(db, result.account.id, result.token.id);
    audit(db, { actorId: result.account.id, tokenId: result.token.id, action: "auth.session.created", target: result.account.pin });

    sendJson(res, 200, {
      ok: true,
      account: { id: result.account.id, pin: result.account.pin, role: result.account.role },
      expiresAt: session.expiresAt,
    }, {
      "Set-Cookie": serializeCookie(cookieName, session.id, {
        maxAge: config.sessionTtlDays * 24 * 60 * 60,
        // 生产（HTTPS）必须为 true，否则会话 cookie 会随明文 HTTP 泄露
        secure: config.sessionSecure,
      }),
      "Cache-Control": "no-store",
    });
  });

  router.delete("/v1/auth/session", ({ req, res }) => {
    const sessionId = parseCookies(req)[cookieName];
    if (sessionId) destroySession(db, sessionId);
    sendJson(res, 200, { ok: true }, {
      "Set-Cookie": serializeCookie(cookieName, "", { maxAge: 0, secure: config.sessionSecure }),
      "Cache-Control": "no-store",
    });
  });

  router.get("/v1/me", ({ req, res }) => {
    const ctx = requireSession(req);
    const maintained = q.all(
      db,
      "SELECT to_id AS id, role FROM edges WHERE from_id = ? AND rel = 'maintains' ORDER BY to_id",
      ctx.account.id,
    );
    sendJson(res, 200, {
      schema: 1,
      account: { id: ctx.account.id, pin: ctx.account.pin, role: ctx.account.role },
      permissions: { isStaff: ctx.account.role === "staff" },
      maintained,
      session: { expiresAt: ctx.session.expires_at },
    }, { "Cache-Control": "no-store" });
  });

  /* ───────────────── 投稿：multipart zip → 待审修订 ───────────────── */

  router.post("/v1/submissions", async ({ req, res }) => {
    const ctx = requireSession(req);
    if (!["author", "staff"].includes(ctx.account.role)) {
      throw new HttpError(403, "forbidden", "当前账号没有投稿权限");
    }

    // 收包：只读一次，边读边算体积上限（zip 上限 + 表单字段余量）
    const raw = await readBody(req, ZIP_LIMITS.maxArchiveBytes + 1024 * 1024);
    const parsed = parseMultipart(raw, req.headers["content-type"]);
    const archive = requireFile(parsed, "archive");

    if (!/zip/i.test(archive.contentType) && !/\.zip$/i.test(archive.filename ?? "")) {
      throw new HttpError(415, "unsupported_media_type", "投稿文件必须是 .zip 压缩包");
    }

    const ingested = ingestZip(archive.data);
    if (ingested.errors.length) {
      return sendJson(res, 422, {
        error: "validation_failed",
        message: "压缩包内容有问题，请逐条修正后重新提交",
        errors: ingested.errors,
        warnings: ingested.warnings,
      });
    }

    const slug = normalizeSlug(parsed.fields.slug, ingested.project.name);
    const inbox = storeInbox(archive.data);

    const saved = saveSubmission(db, {
      accountId: ctx.account.id,
      project: ingested.project,
      slug,
      zipSha256: inbox.sha256,
      zipPath: inbox.path,
      warnings: ingested.warnings,
    });

    sendJson(res, 201, {
      ok: true,
      status: "pending",
      nodeId: saved.nodeId,
      revisionId: saved.revisionId,
      slug: saved.slug,
      message: "投稿已收到，正在等待工作组审核。审核通过前只有你和工作组能看到。",
      warnings: ingested.warnings,
      stats: ingested.stats,
    }, { "Cache-Control": "no-store" });
  });

  /* ───────────────── 审核（仅工作组） ───────────────── */

  const requireStaff = (req) => {
    const ctx = requireSession(req);
    if (ctx.account.role !== "staff") throw new HttpError(403, "forbidden", "只有工作组成员可以执行审核操作");
    return ctx;
  };

  router.get("/v1/reviews/queue", ({ req, res }) => {
    requireStaff(req);
    const items = pendingQueue(db);
    sendJson(res, 200, {
      schema: 1,
      items,
      total: items.length,
      oldestWaitingHours: items.length ? items[items.length - 1].waitingHours : 0,
    }, { "Cache-Control": "no-store" });
  });

  router.post("/v1/reviews/:revisionId", async ({ req, res, params }) => {
    const ctx = requireStaff(req);
    const body = await readJson(req, 64 * 1024);
    const result = reviewRevision(db, {
      revisionId: params.revisionId,
      action: String(body.action ?? ""),
      note: typeof body.note === "string" ? body.note.trim() : null,
      reviewerId: ctx.account.id,
    });
    sendJson(res, 200, { ok: true, ...result }, { "Cache-Control": "no-store" });
  });

  return router;
}
