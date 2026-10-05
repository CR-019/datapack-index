import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import test from "node:test";

import { createSession, hashToken } from "../src/auth.mjs";
import { config, nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { isPublicRead } from "../src/http.mjs";
import { HttpError, buildRouter } from "../src/routes.mjs";

/**
 * 凭证签发链路的行为测试（走真路由，不走函数直调）。
 *
 * 为什么非要在路由这一层验：签发是**"谁能调、明文去哪了"**这两件事的合体 ——
 * 函数直调既看不出越权（`requireStaff` 在路由里），也看不出响应体里带了什么。
 * 而这两处恰好是最难靠人工点页面发现的问题：漏了越权就是"任何作者都能给自己
 * 发一个工作组账号"，漏了明文就是"令牌进了浏览器缓存/审计表"。
 */

/* ───────── 脚手架：临时库 + 工作组会话 ───────── */

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-cred-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();
  const cookies = {};

  for (const [id, role, pin] of [["person:Staff", "staff", "staff"], ["person:Author", "author", "author"]]) {
    const revisionId = `seed_${id}_1`;
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?, 'person', ?, ?, ?, ?)",
      id, JSON.stringify({ name: pin, i18n: { zh: { title: pin } }, facets: { state: "active" } }), revisionId, now, now);
    q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?, ?, '{}', 'published', ?)", revisionId, id, now);
    q.run(db, "INSERT INTO accounts (id, pin, role, status, created_at) VALUES (?, ?, ?, 'active', ?)", id, pin, role, now);
    const tokenId = `tok_${pin}`;
    q.run(db, "INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES (?, ?, '测试', ?, ?)",
      tokenId, id, hashToken(`plain-${pin}`), now);
    const session = createSession(db, id, tokenId);
    cookies[role] = `${config.sessionCookie}=${session.id}`;
  }

  return {
    db, cookies,
    cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); },
  };
}

/** 假 req：`readBody` 要的是一个真流，所以不能只给个普通对象。 */
function fakeRequest({ method = "GET", cookie = "", body, headers = {} } = {}) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  const req = Readable.from(chunks);
  req.method = method;
  req.headers = { ...(cookie ? { cookie } : {}), ...headers };
  req.socket = { remoteAddress: "203.0.113.9" };
  return req;
}

async function call(db, method, target, { cookie = "", body, headers = {} } = {}) {
  const router = buildRouter(db);
  const url = new URL(target, "http://localhost");
  const matched = router.match(method, url.pathname);
  assert.ok(matched?.handler, `${method} ${target} 没有匹配的 handler`);

  const captured = { status: null, headers: null, payload: null };
  const res = {
    writeHead: (status, responseHeaders) => { captured.status = status; captured.headers = responseHeaders; },
    end: (payload) => { captured.payload = payload; },
  };

  try {
    await matched.handler({
      req: fakeRequest({ method, cookie, body, headers }),
      res, url, params: matched.params, db,
    });
  } catch (error) {
    // 与 server.mjs 的错误映射保持一致：领域错误自带状态码（CredentialError），
    // 只认 HttpError 会把"pin 撞车"这类正常拒绝当成测试脚手架抛异常，
    // 于是测试红了、而真正要验的那条拒绝路径一次都没走到。
    if (!(error instanceof HttpError) && typeof error?.status !== "number") throw error;
    captured.status = error.status;
    captured.payload = JSON.stringify({ error: error.code ?? "invalid_request", message: error.message });
  }
  return { ...captured, body: captured.payload ? JSON.parse(captured.payload) : null };
}

const cookieFrom = (headers) => String(headers?.["Set-Cookie"] ?? "").match(/^([^=]+=[^;]+)/)?.[1] ?? "";

const issueBody = { pin: "newbie", name: "新来的", kind: "person", role: "author", label: "阿罗的笔记本" };

/* ───────── 链路：签发 → 登录 ───────── */

test("★ 管理员签发出来的 pin+token，本人立刻能拿它换会话", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    assert.equal(issued.status, 201, JSON.stringify(issued.body));
    assert.equal(issued.body.subject.id, "person:新来的");
    assert.equal(issued.body.subject.pin, "newbie");
    assert.equal(issued.body.claimed, false);
    assert.match(issued.body.token.plaintext, /^[0-9A-HJKMNP-TV-Z]{32}$/, "明文令牌是 32 位 Crockford base32");
    assert.equal(issued.headers["Cache-Control"], "no-store", "明文令牌的响应绝不能被缓存");

    // 本人拿着这对凭证登录 —— 这就是"用户填写 pin+token"那一步
    const login = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    assert.equal(login.status, 200, JSON.stringify(login.body));
    assert.equal(login.body.account.pin, "newbie");
    assert.equal(login.body.account.role, "author");

    const me = await call(db, "GET", "/v1/me", { cookie: cookieFrom(login.headers) });
    assert.equal(me.status, 200);
    assert.equal(me.body.account.id, "person:新来的");

    // 新建的主体必须**已上架**，否则公开面根本看不到这个作者（bootstrap 踩过同一个坑）
    const profile = await call(db, "GET", "/v1/authors/person:%E6%96%B0%E6%9D%A5%E7%9A%84");
    assert.equal(profile.status, 200, "签发的作者在公开面立刻可见");
  } finally {
    cleanup();
  }
});

test("★ 明文令牌只出现一次：库里只有哈希，审计里一个字都没有", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    const plaintext = issued.body.token.plaintext;

    const row = q.get(db, "SELECT * FROM tokens WHERE id = ?", issued.body.token.id);
    assert.equal(row.hash, hashToken(plaintext), "库里存的是 sha256(token+pepper)，能对上");
    assert.notEqual(row.hash, plaintext);

    // 整库扫一遍明文：任何一张表里出现它都算泄露
    const tables = q.all(db, "SELECT name FROM sqlite_master WHERE type = 'table'").map((entry) => entry.name);
    for (const table of tables) {
      const dump = JSON.stringify(q.all(db, `SELECT * FROM ${table}`));
      assert.ok(!dump.includes(plaintext), `${table} 表里出现了明文令牌`);
    }

    // 管理台响应里也不许有哈希/明文：它会被截图、被复制粘贴、被浏览器缓存
    const console_ = await call(db, "GET", "/v1/credentials", { cookie: cookies.staff });
    const text = JSON.stringify(console_.body);
    assert.ok(!text.includes(plaintext), "管理台不该回明文令牌");
    assert.ok(!/"hash"/.test(text), "管理台不该回令牌哈希");
    assert.ok(!/[0-9a-f]{64}/.test(text), "响应里不该出现任何 64 位十六进制串（哈希的形状）");
  } finally {
    cleanup();
  }
});

/* ───────── 越权矩阵 ───────── */

test("★ 签发、列表、吊销三处都只认工作组", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const anonymousIssue = await call(db, "POST", "/v1/authors", { body: issueBody });
    assert.equal(anonymousIssue.status, 401, "匿名不能签发");

    const authorIssue = await call(db, "POST", "/v1/authors", { cookie: cookies.author, body: issueBody });
    assert.equal(authorIssue.status, 403, "作者不能给自己签发凭证");
    assert.match(authorIssue.body.message, /工作组/);

    const authorList = await call(db, "GET", "/v1/credentials", { cookie: cookies.author });
    assert.equal(authorList.status, 403, "作者看不到别人的账户列表");
    assert.equal((await call(db, "GET", "/v1/credentials")).status, 401);

    const authorIssue2 = await call(db, "POST", "/v1/credentials/person:Staff/tokens", { cookie: cookies.author, body: {} });
    assert.equal(authorIssue2.status, 403, "作者不能给任何人补发令牌");

    const authorRevoke = await call(db, "DELETE", "/v1/credentials/person:Staff/tokens/tok_staff", { cookie: cookies.author });
    assert.equal(authorRevoke.status, 403, "作者不能吊销任何令牌");

    // 越权失败必须**什么都没发生**
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM accounts").c, 2);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE revoked_at IS NOT NULL").c, 0);
  } finally {
    cleanup();
  }
});

/* ───────── 输入与冲突 ───────── */

test("pin 撞车被拒，且不区分大小写（否则会出现两个看起来一样的身份）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const taken = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: { pin: "STAFF", name: "冒名者" } });
    assert.equal(taken.status, 409);
    assert.equal(taken.body.error, "pin_taken");
    assert.match(taken.body.message, /不区分大小写/);
  } finally {
    cleanup();
  }
});

test("认领既有主体：认领不改它一个字；已认领的再签就报错而不是造第二个身份", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const now = nowIso();
    // 种子里那类"有档案、没账号"的作者（80 位既有作者就是这种）
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES ('person:Alumopper','person',?,?,?)",
      JSON.stringify({ name: "Alumopper", i18n: { zh: { title: "Alumopper" } }, socialLinks: { github: "Alumopper" } }), now, now);
    const before = q.get(db, "SELECT profile_json FROM nodes WHERE id = 'person:Alumopper'").profile_json;

    const claimed = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: { pin: "alumopper", name: "Alumopper" } });
    assert.equal(claimed.status, 201, JSON.stringify(claimed.body));
    assert.equal(claimed.body.claimed, true, "识别成「认领」而不是「新建」");
    assert.equal(q.get(db, "SELECT profile_json FROM nodes WHERE id = 'person:Alumopper'").profile_json, before, "既有 profile 一个字都不该动");
    assert.ok(q.get(db, "SELECT published_revision_id FROM nodes WHERE id = 'person:Alumopper'").published_revision_id, "认领后主体要可见");

    const again = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: { pin: "alumopper2", name: "Alumopper" } });
    assert.equal(again.status, 409);
    assert.equal(again.body.error, "already_claimed");
    assert.match(again.body.message, /签发新令牌/, "错误信息要指路：补发走另一条路径");
  } finally {
    cleanup();
  }
});

test("参数校验：pin 形状、主体类型、角色、标签长度各有一条可读的拒绝", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const cases = [
      [{ pin: "有中文", name: "x" }, "bad_pin"],
      [{ pin: "a", name: "x" }, "bad_pin"],
      [{ pin: "okpin", name: "x", kind: "project" }, "invalid_kind"],
      [{ pin: "okpin", name: "x", role: "bot" }, "invalid_role"],
      [{ pin: "okpin", name: "x", label: "长".repeat(65) }, "bad_label"],
      // 显示名同时是节点 id 的一部分：超长要报错，不能静默截断（否则"签发的到底是谁"说不清）
      [{ pin: "okpin", name: "名".repeat(65) }, "bad_name"],
    ];
    for (const [body, code] of cases) {
      const result = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body });
      assert.equal(result.status, 400, `${JSON.stringify(body)} 应该被拒`);
      assert.equal(result.body.error, code);
    }
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM accounts").c, 2, "被拒的请求不该留下半个账号");
  } finally {
    cleanup();
  }
});

test("不认识的字段要报错，而不是静默忽略（调用方会以为自己打开了某个开关）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const result = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: { ...issueBody, force: true } });
    assert.equal(result.status, 400);
    assert.equal(result.body.error, "unsupported_field");
  } finally {
    cleanup();
  }
});

/* ───────── 吊销 ───────── */

test("★ 吊销立即生效，并且连带掐掉由它派生的会话", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    const login = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    const userCookie = cookieFrom(login.headers);
    assert.equal((await call(db, "GET", "/v1/me", { cookie: userCookie })).status, 200, "先确认登录是有效的");

    const revoked = await call(db, "DELETE", `/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens/${issued.body.token.id}`, { cookie: cookies.staff });
    assert.equal(revoked.status, 200, JSON.stringify(revoked.body));
    assert.equal(revoked.body.killedSessions, 1, "应该报出掐掉了几个会话");

    assert.equal((await call(db, "GET", "/v1/me", { cookie: userCookie })).status, 401, "已建立的会话必须立刻失效（§7.4 ②）");
    const retry = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    assert.equal(retry.status, 401, "再用这枚令牌登录也不行");

    const twice = await call(db, "DELETE", `/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens/${issued.body.token.id}`, { cookie: cookies.staff });
    assert.equal(twice.status, 409);
    assert.equal(twice.body.error, "already_revoked");
  } finally {
    cleanup();
  }
});

test("★ 最后一枚工作组凭证不许吊销（否则谁也进不来了）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const last = await call(db, "DELETE", "/v1/credentials/person:Staff/tokens/tok_staff", { cookie: cookies.staff });
    assert.equal(last.status, 409);
    assert.equal(last.body.error, "last_staff_credential");
    assert.match(last.body.message, /没有任何|没人能|进不来|找回/, "要说清后果与出路");
    assert.equal(q.get(db, "SELECT revoked_at FROM tokens WHERE id = 'tok_staff'").revoked_at, null, "被拒的吊销不能留下半吊子状态");

    // 先补发一枚，就可以吊销旧的了 —— 这正是"换设备/人员离职"的常规动作
    const issued = await call(db, "POST", "/v1/credentials/person:Staff/tokens", { cookie: cookies.staff, body: { label: "新笔记本" } });
    assert.equal(issued.status, 201);
    const ok = await call(db, "DELETE", "/v1/credentials/person:Staff/tokens/tok_staff", { cookie: cookies.staff });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE revoked_at IS NULL AND account_id = 'person:Staff'").c, 1);
  } finally {
    cleanup();
  }
});

/* ───────── 管理台一屏 ───────── */

test("管理台一屏：主体、令牌状态、stats 与「谁签发了谁」的审计尾巴", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    await call(db, "DELETE", `/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens/${issued.body.token.id}`, { cookie: cookies.staff });

    const console_ = await call(db, "GET", "/v1/credentials", { cookie: cookies.staff });
    assert.equal(console_.status, 200);
    assert.equal(console_.headers["Cache-Control"], "no-store");

    const subject = console_.body.subjects.find((entry) => entry.pin === "newbie");
    assert.ok(subject, "新主体出现在管理台");
    assert.equal(subject.role, "author");
    assert.equal(subject.kind, "person");
    assert.equal(subject.tokens.length, 1);
    assert.ok(subject.tokens[0].revokedAt, "吊销状态要看得见");
    assert.ok(subject.tokens[0].lastUsedAt, "用过一次要留痕（异常使用的第一手线索）");

    assert.deepEqual(console_.body.stats, { subjects: 3, activeTokens: 2, revokedTokens: 1, staffActiveTokens: 1, suspendedSubjects: 0 });

    const actions = console_.body.trail.map((entry) => entry.action);
    assert.ok(actions.includes("account.created"), "建主体留痕");
    assert.ok(actions.includes("token.issued"), "签发留痕");
    assert.ok(actions.includes("token.revoked"), "吊销留痕");
    assert.equal(console_.body.trail[0].actor, "staff", "审计要能回答「谁签发的」");
  } finally {
    cleanup();
  }
});

/* ───────── 通配 CORS 的范围 ───────── */

test("★ 通配 CORS 只给公开只读面：写接口与私域路径一律没有", () => {
  const get = { method: "GET", headers: {} };
  const post = { method: "POST", headers: {} };

  // 公开只读面照旧（静态站跨源读就靠它）
  assert.equal(isPublicRead(get, "/v1/nodes"), true);
  assert.equal(isPublicRead(get, "/v1/authors"), true);
  assert.equal(isPublicRead({ method: "HEAD", headers: {} }, "/v1/timeline"), true);

  // 写接口：不论路径在不在私域前缀里，都不给
  assert.equal(isPublicRead(post, "/v1/submissions"), false);
  assert.equal(isPublicRead({ method: "PATCH", headers: {} }, "/v1/nodes/project:x"), false);
  assert.equal(isPublicRead(post, "/v1/authors"), false, "签发接口写在公开路径上，靠方法把它挡住");

  // 身份与私域面：即使 GET 也不给
  assert.equal(isPublicRead(get, "/v1/me"), false);
  assert.equal(isPublicRead(get, "/v1/credentials"), false);
  assert.equal(isPublicRead(get, "/v1/auth/session"), false);

  // 预检问的是"我接下来要发 POST，你允许吗" —— 对写方法不答应
  assert.equal(isPublicRead({ method: "OPTIONS", headers: { "access-control-request-method": "POST" } }, "/v1/nodes"), false);
  assert.equal(isPublicRead({ method: "OPTIONS", headers: { "access-control-request-method": "GET" } }, "/v1/nodes"), true);
  // 没带这个头的裸 OPTIONS 按只读处理（不透露任何东西，只是回 204）
  assert.equal(isPublicRead({ method: "OPTIONS", headers: {} }, "/v1/nodes"), true);
});

/* ───────── 停用 / 恢复 ───────── */

test("★ 停用账号：名下会话当场清空、登不进来；恢复之后原令牌直接可用（不用重签）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    const login = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    const userCookie = cookieFrom(login.headers);
    assert.equal((await call(db, "GET", "/v1/me", { cookie: userCookie })).status, 200);

    const step = await call(db, "POST", "/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/status", {
      cookie: cookies.staff, body: { status: "suspended", reason: "走查：离职" },
    });
    assert.equal(step.status, 200, JSON.stringify(step.body));
    assert.equal(step.body.killedSessions, 1, "应该报出清掉了几个会话");
    assert.match(step.body.message, /令牌保留/, "回执要说清：令牌没动，恢复即可用");

    assert.equal((await call(db, "GET", "/v1/me", { cookie: userCookie })).status, 401, "★ 已建立的会话当场失效");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM sessions WHERE account_id = 'person:新来的'").c, 0, "会话行也清掉了，不留永远认不领的行");
    assert.equal(
      (await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } })).status,
      401,
      "★ 停用后连登录都不行（与「令牌错」给同一条信息，不额外泄露账号状态）",
    );
    const blocked = await call(db, "POST", "/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens", { cookie: cookies.staff, body: {} });
    assert.equal(blocked.status, 409, "停用期间也不该能补发令牌");
    assert.equal(blocked.body.error, "account_suspended");

    const again = await call(db, "POST", "/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/status", { cookie: cookies.staff, body: { status: "suspended" } });
    assert.equal(again.status, 409, "重复停用要报「已经是」而不是静默成功");
    assert.equal(again.body.error, "no_change");

    const back = await call(db, "POST", "/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/status", { cookie: cookies.staff, body: { status: "active", reason: "走查：回来了" } });
    assert.equal(back.status, 200);
    const relogin = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    assert.equal(relogin.status, 200, "★ 恢复后**原来那枚令牌**就能用（不需要重新签发、重新交付）");
    assert.equal(q.get(db, "SELECT revoked_at FROM tokens WHERE id = ?", issued.body.token.id).revoked_at, null, "停用期间也没动令牌");

    const actions = (await call(db, "GET", "/v1/credentials", { cookie: cookies.staff })).body.trail.map((entry) => entry.action);
    assert.ok(actions.includes("account.suspended") && actions.includes("account.reactivated"), "停用与恢复都留痕");
  } finally {
    cleanup();
  }
});

test("★ 不许停用最后一个有效的工作组成员（那等于把整个工作组关在门外）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const refused = await call(db, "POST", "/v1/credentials/person:Staff/status", { cookie: cookies.staff, body: { status: "suspended" } });
    assert.equal(refused.status, 409);
    assert.equal(refused.body.error, "last_staff_account");
    assert.equal(q.get(db, "SELECT status FROM accounts WHERE id = 'person:Staff'").status, "active", "被拒的操作不能留下半吊子状态");

    // 先启用第二位工作组同事，就可以停用自己了（换人值班是正常操作）
    const second = await call(db, "POST", "/v1/authors", {
      cookie: cookies.staff, body: { pin: "staff2", name: "第二位管理员", role: "staff" },
    });
    assert.equal(second.status, 201, JSON.stringify(second.body));
    const ok = await call(db, "POST", "/v1/credentials/person:Staff/status", { cookie: cookies.staff, body: { status: "suspended", reason: "走查：换班" } });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM accounts WHERE role = 'staff' AND status = 'active'").c, 1);

    const newStaff = await call(db, "POST", "/v1/auth/session", { body: { pin: "staff2", token: second.body.token.plaintext } });
    assert.equal(newStaff.status, 200, "接手的人能进来");
  } finally {
    cleanup();
  }
});

/* ───────── 轮换 ───────── */

test("★ 轮换：新令牌立即可用，旧令牌与它的会话当场作废", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const issued = await call(db, "POST", "/v1/authors", { cookie: cookies.staff, body: issueBody });
    const phone = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    const laptop = await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } });
    assert.equal((await call(db, "GET", "/v1/me", { cookie: cookieFrom(laptop.headers) })).status, 200);

    const rotated = await call(db, "POST", `/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens/${issued.body.token.id}/rotate`, {
      cookie: cookies.staff, body: { reason: "走查：手机丢了" },
    });
    assert.equal(rotated.status, 201, JSON.stringify(rotated.body));
    assert.equal(rotated.body.revokedTokenId, issued.body.token.id);
    assert.equal(rotated.body.token.label, "阿罗的笔记本", "默认沿用旧令牌的标签（就是同一台设备在换）");
    assert.equal(rotated.body.killedSessions, 2, "两台设备的会话都该断");
    assert.match(rotated.body.message, /立刻把新明文交给本人/, "回执必须提醒：旧凭证已经不能用了");

    assert.equal((await call(db, "GET", "/v1/me", { cookie: cookieFrom(phone.headers) })).status, 401, "★ 旧会话立刻失效");
    assert.equal((await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: issued.body.token.plaintext } })).status, 401, "★ 旧令牌登不进来");
    assert.equal((await call(db, "POST", "/v1/auth/session", { body: { pin: "newbie", token: rotated.body.token.plaintext } })).status, 200, "★ 新令牌立即可用");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE account_id = 'person:新来的' AND revoked_at IS NULL").c, 1, "有效令牌数不变（净增为 0）");

    const again = await call(db, "POST", `/v1/credentials/person:%E6%96%B0%E6%9D%A5%E7%9A%84/tokens/${issued.body.token.id}/rotate`, { cookie: cookies.staff, body: {} });
    assert.equal(again.status, 409, "轮换一枚已经作废的令牌要报错，而不是又发一枚出来");
    assert.equal(again.body.error, "already_revoked");

    const actions = (await call(db, "GET", "/v1/credentials", { cookie: cookies.staff })).body.trail.map((entry) => entry.action);
    assert.ok(actions.includes("token.rotated"), "轮换留痕（新旧 token id 都写在 reason 里）");
  } finally {
    cleanup();
  }
});

test("★ 轮换最后一枚工作组令牌是允许的（这一步恰恰最不该被守门拦住）", async () => {
  const { db, cookies, cleanup } = setup();
  try {
    const rotated = await call(db, "POST", "/v1/credentials/person:Staff/tokens/tok_staff/rotate", {
      cookie: cookies.staff, body: { label: "新笔记本" },
    });
    assert.equal(rotated.status, 201, JSON.stringify(rotated.body));
    const login = await call(db, "POST", "/v1/auth/session", { body: { pin: "staff", token: rotated.body.token.plaintext } });
    assert.equal(login.status, 200, "轮换出来的新工作组令牌能登录");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE account_id = 'person:Staff' AND revoked_at IS NULL").c, 1);
  } finally {
    cleanup();
  }
});

test("轮换不受令牌条数上限影响（净增为 0，否则用满的账号就永远换不了）", async () => {
  const { db, cookies, cleanup } = setup();
  const activeCount = () => q.get(db, "SELECT COUNT(*) AS c FROM tokens WHERE account_id = 'person:Author' AND revoked_at IS NULL").c;
  try {
    /*
     * 一直签发到撞上限为止（不写死"12 枚"：夹具自己就带一枚 author 令牌，
     * 写死数字的测试会在夹具变一次之后红在一个与断言无关的地方）。
     */
    let last = null;
    let issued = 0;
    for (let index = 0; index < 30; index += 1) {
      const result = await call(db, "POST", "/v1/credentials/person:Author/tokens", { cookie: cookies.staff, body: { label: `凑数 ${index}` } });
      if (result.status !== 201) {
        assert.equal(result.body.error, "too_many_tokens", "撞上限时的错误码要可读");
        break;
      }
      last = result;
      issued += 1;
    }
    assert.ok(issued >= 5 && last, `先签满（发了 ${issued} 枚）`);
    const before = activeCount();

    const rotated = await call(db, "POST", `/v1/credentials/person:Author/tokens/${last.body.token.id}/rotate`, { cookie: cookies.staff, body: {} });
    assert.equal(rotated.status, 201, JSON.stringify(rotated.body));
    assert.equal(activeCount(), before, "轮换净增为 0：用满的账号照样换得了");
    assert.notEqual(rotated.body.token.id, last.body.token.id, "换出来的是一枚新令牌");
  } finally {
    cleanup();
  }
});
