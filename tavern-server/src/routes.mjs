import { config, nowIso } from "./config.mjs";
import { q } from "./db.mjs";
import { PUBLIC_CORS, clientIp, parseCookies, readBody, readJson, sendJson, serializeCookie } from "./http.mjs";
import { createRouter } from "./http.mjs";
import { audit, authenticate, canEdit, clearFailures, createSession, destroySession, rateLimitState, readSession, recordFailure } from "./auth.mjs";
import { countEvents, listEvents } from "./events.mjs";
import { applyConvergentChange } from "./changes.mjs";
import { createStage, deleteStage } from "./stages.mjs";
import { createSubject, credentialConsole, issueToken, revokeCredential, rotateCredential, setAccountStatus } from "./credentials.mjs";
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

/**
 * 审计里的"为什么"：可以不给（那就用默认文案），但不能要多少给多少 ——
 * 这条字符串会落进 `audit_log.reason`、进备份、进运维视野，不是输入框。
 */
function auditReason(raw, fallback) {
  const text = typeof raw === "string" ? raw.trim() : "";
  return text ? Array.from(text).slice(0, 200).join("") : fallback;
}

export function buildRouter(db) {
  const router = createRouter();
  const cookieName = config.sessionCookie;

  const currentSession = (req) => readSession(db, parseCookies(req)[cookieName]);

  const requireSession = (req) => {
    const ctx = currentSession(req);
    if (!ctx) throw new HttpError(401, "unauthenticated", "未登录或会话已失效");
    return ctx;
  };

  // 工作组专属动作（审核、凭证签发）共用这一道门。放在最前面只是为了聚拢身份判定：
  // 这些 handler 都在 `buildRouter` 返回之后才被调用，所以把它们写在前面或后面
  // 在运行期没有区别 —— 别把顺序当成必要条件。
  const requireStaff = (req) => {
    const ctx = requireSession(req);
    if (ctx.account.role !== "staff") throw new HttpError(403, "forbidden", "只有工作组成员可以执行这个操作");
    return ctx;
  };

  const assertKind = (kind) => {
    if (!kind || KINDS.has(kind)) return;
    // `stage` 是合法 kind，但它不是看板条目（不变量 13）——如果只说"未知的 kind"，
    // 调用方会以为是自己拼错了，然后去翻文档确认 stage 到底存不存在。直接说清楚。
    if (kind === "stage") {
      throw new HttpError(
        400,
        "stage_not_listable",
        "阶段不进看板列表（不变量 13）——它挂在宿主条目的详情里，请读 /v1/nodes/:id 的 stages 字段",
      );
    }
    throw new HttpError(400, "invalid_kind", `未知的 kind：${kind}（可用：${[...KINDS].join(" / ")}）`);
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

  /* ───────────────── 凭证签发与吊销（仅工作组，§7.4 / FR-13 / FR-16） ─────────────────
   *
   * 系统没有公开注册，所有身份都源自这里。三条路径的分工：
   *   · `POST /v1/authors`          —— 建**主体**（设计 §12 的接口表就是这条路径）：
   *                                    主体节点 + 账号 + 首枚令牌，一次签发完
   *   · `POST …/:id/tokens`         —— 给已有主体补发一枚令牌（换设备、多人共用一个 pin）
   *   · `DELETE …/:id/tokens/:tid`  —— 吊销，**立即**失效（连带其派生会话）
   *   · `POST …/:id/tokens/:tid/rotate` —— 轮换：补发新的 + 吊销旧的一步到位
   *   · `POST …/:id/status`         —— 停用 / 恢复账号（`suspended`，与吊销令牌分开的一档）
   *
   * 为什么是 `/v1/authors` 而不是 `/v1/credentials`：被创建的东西是**主体**
   * （person/team 节点，公开面看得见），令牌只是它的附属物；设计文档 §12 的接口表
   * 也是这么列的。而读它们（含令牌元数据）走 `/v1/credentials` —— 那是私有域视图，
   * 不该挂在公开的 `/v1/authors` 集合上。
   *
   * ⚠️ 返回体里的 `token.plaintext` 是**明文令牌唯一一次出现的地方**（ADR-004）。
   *    所以这里必须 `no-store`：否则明文会进浏览器缓存/代理缓存。
   */

  router.get("/v1/credentials", ({ req, res }) => {
    requireStaff(req);
    sendJson(res, 200, credentialConsole(db), { "Cache-Control": "no-store" });
  });

  router.post("/v1/authors", async ({ req, res }) => {
    const ctx = requireStaff(req);
    const body = await readJson(req, 64 * 1024);
    const forced = typeof body.force === "boolean" ? body.force : null;
    if (forced !== null) {
      // 这一条不是矫情：签发接口收到不认识的字段时**静默忽略**，会让调用方以为自己
      // 打开了某个开关（比如"强制覆盖已认领的主体"），而实际什么都没发生。
      throw new HttpError(400, "unsupported_field", "签发接口不支持 force：覆盖已认领的主体只能由人在本机决定（见 scripts/bootstrap.mjs）");
    }
    const created = createSubject(db, {
      pin: body.pin,
      name: body.name,
      kind: body.kind,
      role: body.role,
      label: body.label,
      email: body.email,
      actorId: ctx.account.id,
      reason: auditReason(body.reason, "工作组在管理台签发"),
    });
    sendJson(res, 201, {
      ok: true,
      ...created,
      message: created.claimed
        ? "已认领既有主体并签发凭证 —— 明文令牌只显示这一次，请立刻交给本人并让他自己保存。"
        : "主体与凭证都已创建 —— 明文令牌只显示这一次，请立刻交给本人并让他自己保存。",
    }, { "Cache-Control": "no-store" });
  });

  router.post("/v1/credentials/:id/tokens", async ({ req, res, params }) => {
    const ctx = requireStaff(req);
    const body = await readJson(req, 64 * 1024);
    const issued = issueToken(db, {
      accountId: params.id,
      label: body.label,
      actorId: ctx.account.id,
      reason: auditReason(body.reason, "工作组在管理台补发"),
    });
    sendJson(res, 201, {
      ok: true,
      subject: { id: issued.accountId, pin: issued.pin, role: issued.role },
      token: issued,
      message: "新令牌已签发 —— 明文只显示这一次。旧令牌不受影响，如需停用请单独吊销。",
    }, { "Cache-Control": "no-store" });
  });

  router.delete("/v1/credentials/:id/tokens/:tokenId", ({ req, res, params, url }) => {
    const ctx = requireStaff(req);
    const revoked = revokeCredential(db, {
      accountId: params.id,
      tokenId: params.tokenId,
      actorId: ctx.account.id,
      reason: auditReason(url.searchParams.get("reason"), "工作组在管理台吊销"),
    });
    sendJson(res, 200, {
      ok: true,
      ...revoked,
      message: `已吊销「${revoked.label}」，其派生会话（${revoked.killedSessions} 个）同时失效。`,
    }, { "Cache-Control": "no-store" });
  });

  /* 轮换 = 补发 + 吊销旧的，一步到位（给"旧凭证已泄露，必须立刻作废"这类收尾用）。
   * 默认仍是两步走：先补发、确认本人能用，再吊销旧的 —— 见 credentials.mjs 里的注释。 */
  router.post("/v1/credentials/:id/tokens/:tokenId/rotate", async ({ req, res, params }) => {
    const ctx = requireStaff(req);
    const body = await readJson(req, 64 * 1024);
    const rotated = rotateCredential(db, {
      accountId: params.id,
      tokenId: params.tokenId,
      label: body.label,
      actorId: ctx.account.id,
      reason: auditReason(body.reason, "工作组在管理台轮换"),
    });
    sendJson(res, 201, {
      ok: true,
      ...rotated,
      message: `已轮换：旧令牌（${rotated.revokedLabel}）作废，其派生会话（${rotated.killedSessions} 个）同时失效 —— 请立刻把新明文交给本人，否则他登不进来。`,
    }, { "Cache-Control": "no-store" });
  });

  /* 停用 / 恢复账号（与吊销令牌分开的一档：人离开了，作品还在） */
  router.post("/v1/credentials/:id/status", async ({ req, res, params }) => {
    const ctx = requireStaff(req);
    const body = await readJson(req, 64 * 1024);
    const changed = setAccountStatus(db, {
      accountId: params.id,
      status: body.status,
      actorId: ctx.account.id,
      reason: auditReason(body.reason, "工作组在管理台操作"),
    });
    sendJson(res, 200, {
      ok: true,
      ...changed,
      message: changed.status === "suspended"
        ? `账号「${changed.pin}」已停用：名下的会话（${changed.killedSessions} 个）已清除，令牌保留 —— 恢复即可继续用。已上架的内容不受影响。`
        : `账号「${changed.pin}」已恢复：他自己重新登录即可（令牌一直保留着，不需要重新签发）。`,
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

  /* ───────────────── 时间线：事件流（ADR-009） ───────────────── */

  router.get("/v1/nodes/:id/events", ({ res, url, params }) => {
    const node = findPublishedNode(db, params.id, { withEdges: false });
    if (!node) throw new HttpError(404, "not_found", "条目不存在或尚未上架");
    const limit = clampLimit(url.searchParams.get("limit"), 20, 100);
    sendJson(res, 200, {
      schema: 1,
      items: listEvents(db, params.id, { limit }),
      total: countEvents(db, params.id),
    }, PUBLIC_CORS);
  });

  /* ───────────────── 收敛型修改：直通 + 自动追写事件（ADR-009） ───────────────── */

  const requireMaintainer = (req, nodeId) => {
    const ctx = requireSession(req);
    if (!canEdit(db, ctx.account.id, nodeId)) {
      throw new HttpError(403, "forbidden", "你不是该条目的维护者");
    }
    return ctx;
  };

  router.patch("/v1/nodes/:id", async ({ req, res, params }) => {
    if (!q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", params.id)) {
      throw new HttpError(404, "not_found", "条目不存在");
    }
    const ctx = requireMaintainer(req, params.id);
    const body = await readJson(req, 256 * 1024);
    const result = applyConvergentChange(db, { nodeId: params.id, actorId: ctx.account.id, patch: body });
    sendJson(res, 200, {
      ok: true,
      ...result,
      message: "已生效（收敛型修改直通），并自动记入时间线",
    }, { "Cache-Control": "no-store" });
  });

  /* ───────────────── 阶段：子节点式时间切片（ADR-010） ───────────────── */

  router.post("/v1/nodes/:id/stages", async ({ req, res, params }) => {
    if (!q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = ?", params.id)) {
      throw new HttpError(404, "not_found", "条目不存在");
    }
    const ctx = requireMaintainer(req, params.id);
    const body = await readJson(req, 64 * 1024);
    const result = createStage(db, {
      parentId: params.id,
      actorId: ctx.account.id,
      name: body.name,
      start: body.start ?? body.time?.start,
      end: body.end ?? body.time?.end,
      summary: body.summary ?? null,
      slug: body.slug ?? null,
    });
    const node = findPublishedNode(db, params.id);
    sendJson(res, 201, {
      ok: true,
      ...result,
      phases: node?.facets?.phases ?? [],
      message: "阶段已创建（名称与时间窗属事实，直通生效；补充正文请走待审修订）",
    }, { "Cache-Control": "no-store" });
  });

  router.delete("/v1/nodes/:parentId/stages/:stageId", ({ req, res, params }) => {
    const ctx = requireMaintainer(req, params.parentId);
    const result = deleteStage(db, { stageId: params.stageId, actorId: ctx.account.id });
    sendJson(res, 200, { ok: true, ...result }, { "Cache-Control": "no-store" });
  });

  return router;
}
