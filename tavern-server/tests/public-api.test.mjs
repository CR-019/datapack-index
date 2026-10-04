import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { HttpError, buildRouter } from "../src/routes.mjs";

/**
 * 公开接口的**行为**测试（不是单元测试）。
 *
 * 为什么需要这一层：`countEvents` 漏了 visibility 过滤、公开事件带出 actorId
 * 这两个问题，单元测试全绿——因为它们出在"哪个函数被怎样调用"上，而不是
 * 函数本身。只有把请求真的走一遍路由才看得见。
 *
 * 这里不真起 HTTP 服务：直接拿 router.match() 的 handler，配一对假的 req/res。
 * 轻，但覆盖的正是出事的那一层。
 */

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-api-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();

  const publish = (id, kind, profile) => {
    const revisionId = `seed_${id}_1`;
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
      id, kind, JSON.stringify(profile), revisionId, now, now);
    q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?,?,?,'published',?)",
      revisionId, id, JSON.stringify(profile), now);
  };

  publish("project:pub", "project", { i18n: { zh: { title: "公开条目" } }, tags: [], facets: { state: "active" } });
  publish("stage:pub-1", "stage", {
    name: "一期", i18n: { zh: { title: "一期" } }, facets: { time: { start: "2026-01-01", end: "2026-12-31" } },
  });
  q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('stage:pub-1','parent','project:pub',?)", now);

  // 两条公开 + 一条内部：内部那条的存在本身都不该被公开面感知到
  for (const [id, title, visibility] of [["evt-1", "公开一", "public"], ["evt-2", "公开二", "public"], ["evt-3", "内部的", "internal"]]) {
    q.run(db, "INSERT INTO node_events (id, node_id, kind, at, title, source, visibility, created_at) VALUES (?,?,'milestone',?,?,'manual',?,?)",
      id, "project:pub", now, title, visibility, now);
  }

  return { db, dir, cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}

/** 调一次 handler，返回 { status, headers, body } */
async function call(db, method, target, { req = {}, body = null } = {}) {
  const router = buildRouter(db);
  const url = new URL(target, "http://localhost");
  const matched = router.match(method, url.pathname);
  assert.ok(matched?.handler, `${method} ${target} 没有匹配的 handler`);

  const captured = { status: null, headers: null, payload: null };
  const res = {
    writeHead: (status, headers) => { captured.status = status; captured.headers = headers; },
    end: (payload) => { captured.payload = payload; },
  };

  try {
    await matched.handler({ req: { headers: {}, socket: { remoteAddress: "203.0.113.9" }, ...req }, res, url, params: matched.params, body });
  } catch (error) {
    if (!(error instanceof HttpError)) throw error;
    captured.status = error.status;
    captured.payload = JSON.stringify({ error: error.code, message: error.message });
  }

  return { ...captured, body: captured.payload ? JSON.parse(captured.payload) : null };
}

/* ───────── 形状与口径 ───────── */

test("★ 公开的事件接口：total 与 items 口径一致，内部事件连数量都不泄露", async () => {
  const { db, cleanup } = setup();
  try {
    const result = await call(db, "GET", "/v1/nodes/project:pub/events");
    assert.equal(result.status, 200);
    assert.equal(result.body.total, 2, "total 只能数公开事件");
    assert.equal(result.body.items.length, 2);
    assert.ok(!JSON.stringify(result.body).includes("内部的"), "内部事件的内容不该出现");
  } finally {
    cleanup();
  }
});

test("★ 公开的事件接口不带 actorId 等审计字段", async () => {
  const { db, cleanup } = setup();
  try {
    const result = await call(db, "GET", "/v1/nodes/project:pub/events");
    const event = result.body.items[0];
    assert.ok(!("actorId" in event) && !("actor_id" in event));
    assert.deepEqual(
      Object.keys(event).sort(),
      ["at", "body", "id", "kind", "nodeId", "source", "status", "title"],
    );
  } finally {
    cleanup();
  }
});

test("公开接口带通配 CORS（静态站跨源读要靠它）", async () => {
  const { db, cleanup } = setup();
  try {
    const result = await call(db, "GET", "/v1/nodes/project:pub/events");
    assert.equal(result.headers["Access-Control-Allow-Origin"], "*");
  } finally {
    cleanup();
  }
});

/* ───────── kind 过滤 ───────── */

test("看板列表不显示阶段；按 stage 过滤时给出可读的原因而不是「未知的 kind」", async () => {
  const { db, cleanup } = setup();
  try {
    const list = await call(db, "GET", "/v1/nodes");
    assert.ok(list.body.items.some((node) => node.id === "project:pub"));
    assert.ok(!list.body.items.some((node) => node.kind === "stage"), "不变量 13：阶段不进列表");

    // stage 是合法 kind，不该被报成"未知"——那会让人以为自己拼错了
    const filtered = await call(db, "GET", "/v1/nodes?kind=stage");
    assert.equal(filtered.status, 400);
    assert.equal(filtered.body.error, "stage_not_listable");
    assert.match(filtered.body.message, /不变量 13/);

    // 真正未知的 kind 才说未知，并且把可选项列出来
    const bogus = await call(db, "GET", "/v1/nodes?kind=widget");
    assert.equal(bogus.body.error, "invalid_kind");
    assert.match(bogus.body.message, /project/);
  } finally {
    cleanup();
  }
});

test("阶段不进看板列表，但挂在宿主条目的详情里（含派生 phases）", async () => {
  const { db, cleanup } = setup();
  try {
    const detail = await call(db, "GET", "/v1/nodes/project:pub");
    assert.equal(detail.status, 200);
    assert.deepEqual(detail.body.node.facets.phases, ["一期"]);
    assert.deepEqual(detail.body.node.stages.map((stage) => stage.id), ["stage:pub-1"]);
    assert.equal(detail.body.node.stages[0].phase, "current");
  } finally {
    cleanup();
  }
});

test("未上架的条目在公开接口里是 404（不变量 8）", async () => {
  const { db, cleanup } = setup();
  try {
    const now = nowIso();
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES ('project:draft','project','{}',?,?)", now, now);
    const result = await call(db, "GET", "/v1/nodes/project:draft");
    assert.equal(result.status, 404);
  } finally {
    cleanup();
  }
});
