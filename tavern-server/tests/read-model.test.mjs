import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { buildSnapshot, buildStatus, buildTimeline, findForbiddenKeys, findPublishedNode, listPublishedNodes, listTags, materializedTagMembers, serializeSnapshot } from "../src/read-model.mjs";
import { reviewRevision, saveSubmission } from "../src/submissions.mjs";

/* ───────── 脚手架 ───────── */

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-snap-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();
  q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES ('person:Author','person',?,?,?)",
    JSON.stringify({ name: "Author" }), now, now);
  // 故意在私域表里留下 email / notes / token hash，用来验证它们绝不会出现在快照里
  q.run(
    db,
    "INSERT INTO accounts (id, pin, role, status, email, notes, created_at) VALUES ('person:Author','author','author','active','secret@example.com','内部备注',?)",
    now,
  );
  q.run(db, "INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES ('tok1','person:Author','测试','deadbeef',?)", now);
  return { db, dir, cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}

const project = (name, tags = ["UI"]) => ({
  template: 1, kind: "project", name, summary: `${name} 的简介`, tags,
  gameversion: ["1.21.9"], repo: null, license: null, links: [], cover: null, time: null,
  i18n: { zh: { title: name, summary: `${name} 的简介`, body: `# ${name}` } },
  recruit: [], relations: { requests: [], related: [], depends: [] },
  assets: [{ path: "assets/cover.png", sha256: "c".repeat(64), size: 10, mime: "image/png" }],
});

function publishOne(db, name, tags) {
  const saved = saveSubmission(db, {
    accountId: "person:Author", project: project(name, tags), slug: name.toLowerCase(),
    zipSha256: "d".repeat(64), zipPath: "/tmp/x.zip",
  });
  reviewRevision(db, { revisionId: saved.revisionId, action: "approve", reviewerId: "person:Author" });
  return saved;
}

/* ───────── 快照形状（必须与前端约定一致） ───────── */

test("快照形状符合前端约定：{schema, generatedAt, status, nodes, tags, timeline}", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    const snapshot = buildSnapshot(db);
    assert.equal(snapshot.schema, 1);
    assert.ok(typeof snapshot.generatedAt === "string" && snapshot.generatedAt.length > 10);
    assert.ok(snapshot.status && typeof snapshot.status === "object", "缺少 status（前端 fetchStatus 靠它兜底）");
    assert.ok(Array.isArray(snapshot.nodes), "缺少 nodes");
    assert.ok(Array.isArray(snapshot.tags), "缺少 tags");
    assert.ok(Array.isArray(snapshot.timeline), "缺少 timeline");

    // status 的形状必须与 /v1/status 一致
    assert.equal(snapshot.status.schema, 1);
    assert.equal(typeof snapshot.status.nodes.published, "number");
    assert.ok(snapshot.status.nodes.byKind);

    // tags 项的形状：{id,title,members}（前端按这三个字段渲染）
    const tag = snapshot.tags.find((entry) => entry.id === "tag:ui");
    assert.ok(tag, "UI 标签应出现在 tags 里");
    assert.deepEqual(Object.keys(tag).sort(), ["id", "members", "title"]);
  } finally {
    cleanup();
  }
});

test("节点带边，便于详情页离线可用", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    const node = buildSnapshot(db).nodes.find((entry) => entry.id === "project:alpha");
    assert.ok(Array.isArray(node.incoming), "详情页需要 incoming（维护者/署名者）");
    assert.equal(node.incoming[0].rel, "maintains");
  } finally {
    cleanup();
  }
});

/* ───────── 不变式：只含已发布 ───────── */

test("未上架的条目不出现在快照里", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    // 再提交一个但不审核
    saveSubmission(db, {
      accountId: "person:Author", project: project("Beta"), slug: "beta",
      zipSha256: "e".repeat(64), zipPath: "/tmp/y.zip",
    });
    const snapshot = buildSnapshot(db);
    assert.ok(snapshot.nodes.some((node) => node.id === "project:alpha"));
    assert.ok(!snapshot.nodes.some((node) => node.id === "project:beta"), "未上架条目不得进入快照");
  } finally {
    cleanup();
  }
});

test("标签成员被物化，且只含已发布节点", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha", ["UI", "展示实体"]);
    saveSubmission(db, {
      accountId: "person:Author", project: project("Beta", ["UI"]), slug: "beta",
      zipSha256: "f".repeat(64), zipPath: "/tmp/z.zip",
    });
    const members = materializedTagMembers(db);
    assert.deepEqual(members["tag:ui"], ["project:alpha"], "未上架的 Beta 不该出现在标签成员里");
    assert.deepEqual(members["tag:展示实体"], ["project:alpha"]);
  } finally {
    cleanup();
  }
});

/* ───────── 表级白名单：私有数据不进导出路径 ───────── */

test("快照里不含任何私域字段（email / notes / hash / pin / token…）", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    const snapshot = buildSnapshot(db);
    const text = serializeSnapshot(snapshot);

    // 数据库里确实有这些私密值，所以这条断言是有意义的
    const account = q.get(db, "SELECT email, notes FROM accounts WHERE id = 'person:Author'");
    assert.equal(account.email, "secret@example.com");

    assert.deepEqual(findForbiddenKeys(snapshot), [], "快照里出现了私域键");
    for (const leaked of ["secret@example.com", "内部备注", "deadbeef", "person:Author"]) {
      // person:Author 是作者节点 id，属于公开数据 —— 只断言前三个真正私密的值
      if (leaked === "person:Author") continue;
      assert.ok(!text.includes(leaked), `快照泄露了私密值：${leaked}`);
    }
  } finally {
    cleanup();
  }
});

test("read-model 的源码里不得**查询**私域表（结构级保证）", async () => {
  const fsMod = await import("node:fs");
  const pathMod = await import("node:path");
  const file = pathMod.join(import.meta.dirname, "..", "src", "read-model.mjs");
  const source = fsMod.readFileSync(file, "utf8");

  // 注意：只断言"没有被查询"，而不是"没有出现" ——
  // 因为 FORBIDDEN_KEYS 白名单里本来就要列出这些名字（如 applications / audit_log），
  // 那是防御性常量，不是数据访问。
  const PRIVATE_TABLES = ["accounts", "tokens", "sessions", "recovery_codes", "applications", "invitations", "audit_log"];
  for (const table of PRIVATE_TABLES) {
    const queried = new RegExp(`\\b(from|join|into|update|delete\\s+from)\\s+${table}\\b`, "i").test(source);
    assert.ok(!queried, `read-model.mjs 查询了私域表 ${table} —— 违反 ADR-008 的表级白名单`);
  }

  // 正向断言：白名单里的四张表确实在被查（否则上面那些断言会因"什么都没查"而空转）
  assert.ok(/\bfrom\s+nodes\b/i.test(source), "应当查询 nodes");
  assert.ok(/\bfrom\s+edges\b/i.test(source) || /\bjoin\s+edges\b/i.test(source), "应当查询 edges");
  assert.ok(/\btag_members\b/i.test(source), "应当查询 tag_members");
  assert.ok(/\bfrom\s+node_events\b/i.test(source), "应当查询 node_events（时间线要读事件流，ADR-009）");

  // 事件表虽然进了白名单，但**必须过滤 visibility**：内部事件不许外泄
  assert.ok(
    /visibility\s*=\s*'public'/i.test(source),
    "读 node_events 必须限定 visibility = 'public'，否则内部事件会进公开面与快照",
  );
});

test("findForbiddenKeys 能识嵌套与数组里的私域键", () => {
  const found = findForbiddenKeys({ nodes: [{ id: "x", account: { token: "y" } }], tags: [{ email: "z" }] });
  assert.deepEqual(found.sort(), ["nodes[0].account", "nodes[0].account.token", "tags[0].email"]);
  assert.deepEqual(findForbiddenKeys({ nodes: [{ id: "x", i18n: { zh: { title: "t" } } }] }), []);
});

/* ───────── 确定性与可重算 ───────── */

test("同一份数据两次导出结果完全一致（避免无意义 diff）", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    publishOne(db, "Beta");
    const at = "2026-10-04T00:00:00.000Z";
    assert.equal(serializeSnapshot(buildSnapshot(db, { generatedAt: at })), serializeSnapshot(buildSnapshot(db, { generatedAt: at })));
  } finally {
    cleanup();
  }
});

test("快照内容与实时 API 的读模型一致（同一实现，不会漂移）", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    const snapshot = buildSnapshot(db);
    const api = listPublishedNodes(db, { limit: 200 });
    assert.deepEqual(snapshot.nodes.map((node) => node.id).sort(), api.items.map((node) => node.id).sort());
    assert.deepEqual(snapshot.tags.map((tag) => tag.id), listTags(db).map((tag) => tag.id));
    assert.equal(snapshot.status.nodes.published, buildStatus(db).nodes.published);
    assert.deepEqual(snapshot.timeline, buildTimeline(db, { limit: 40 }).items);
  } finally {
    cleanup();
  }
});

test("已发布节点数 = 快照节点数（不变量 8 的全局校验）", () => {
  const { db, cleanup } = setup();
  try {
    publishOne(db, "Alpha");
    publishOne(db, "Beta");
    saveSubmission(db, {
      accountId: "person:Author", project: project("Gamma"), slug: "gamma",
      zipSha256: "a".repeat(63) + "b", zipPath: "/tmp/g.zip",
    });
    const published = q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE published_revision_id IS NOT NULL").c;
    assert.equal(buildSnapshot(db).nodes.length, published);
  } finally {
    cleanup();
  }
});

/* ───────── 不变量 13：列表只显示顶层条目 ───────── */

test("★ 看板列表不显示阶段（否则一个项目的三个阶段会被读成三个项目）", () => {
  const { db, cleanup } = setup();
  try {
    const now = nowIso();
    const project = publishOne(db, "WithStages");
    // 手工挂两个阶段子节点
    for (const [id, name] of [["stage:withstages-v1", "第一期"], ["stage:withstages-v2", "第二期"]]) {
      q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?, 'stage', ?, ?, ?, ?)",
        id, JSON.stringify({ name, i18n: { zh: { title: name } }, facets: { time: { start: "2026-01-01", end: "2026-12-31" } } }), `seed_${id}_1`, now, now);
      q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?, ?, '{}', 'published', ?)", `seed_${id}_1`, id, now);
      q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES (?, 'parent', ?, ?)", id, project.nodeId, now);
    }

    const list = listPublishedNodes(db, { limit: 50 });
    assert.ok(list.items.some((node) => node.id === project.nodeId), "顶层项目要在列表里");
    assert.ok(!list.items.some((node) => node.kind === "stage"), "阶段不该出现在看板列表里");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE kind='stage' AND published_revision_id IS NOT NULL").c, 2, "阶段本身仍然存在且已发布");

    // 详情页仍要能拿到阶段与派生 phases
    const detail = findPublishedNode(db, project.nodeId, { now: new Date("2026-06-01T00:00:00Z") });
    assert.equal(detail.stages.length, 2);
    assert.deepEqual(detail.facets.phases, ["第一期", "第二期"], "两个窗口都包含 now → 并列阶段");
    // 直接按 id 访问阶段本身也可以（只是不在列表里）
    assert.ok(findPublishedNode(db, "stage:withstages-v1"));
  } finally {
    cleanup();
  }
});

test("快照包含 stages 与 events，且 nodes 只含顶层", () => {
  const { db, cleanup } = setup();
  try {
    const now = nowIso();
    const project = publishOne(db, "SnapWithStage");
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES ('stage:s1','stage',?, 'seed_stage:s1_1', ?, ?)",
      JSON.stringify({ name: "一期", i18n: { zh: { title: "一期" } }, facets: { time: { start: "2026-01-01", end: "2026-12-31" } } }), now, now);
    q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES ('seed_stage:s1_1','stage:s1','{}','published',?)", now);
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('stage:s1','parent',?,?)", project.nodeId, now);
    q.run(db, "INSERT INTO node_events (id, node_id, kind, at, title, source, visibility, created_at) VALUES ('evt1', ?, 'milestone', ?, '发布 v1.0', 'manual', 'public', ?)",
      project.nodeId, now, now);
    q.run(db, "INSERT INTO node_events (id, node_id, kind, at, title, source, visibility, created_at) VALUES ('evt2', ?, 'note', ?, '内部记录', 'manual', 'internal', ?)",
      project.nodeId, now, now);

    const snapshot = buildSnapshot(db);
    assert.ok(snapshot.stages.some((stage) => stage.id === "stage:s1" && stage.parentId === project.nodeId));
    // 只断言"内部事件不在里面"，不再逐项比对整张表：`publishOne` 走的是真实审核路径，
    // 而按 ADR-009，上架本身会追加一条 milestone（"内容更新"）—— 那是**该出现**的事件。
    const eventIds = snapshot.events.map((event) => event.id);
    assert.ok(eventIds.includes("evt1"), "手工事件应在快照里");
    assert.ok(!eventIds.includes("evt2"), "内部事件不进快照");
    assert.equal(snapshot.events.find((event) => event.id === "evt1").title, "发布 v1.0");
    assert.ok(
      snapshot.events.some((event) => event.title === "内容更新" && event.source === "derived"),
      "上架应自动补一条 milestone 事件（ADR-009 / §6.6 事件对照表）",
    );
    assert.ok(!snapshot.nodes.some((node) => node.kind === "stage"), "快照的 nodes 只含顶层");
    assert.ok(snapshot.timeline.some((item) => item.title === "发布 v1.0"), "时间轴应含事件");
  } finally {
    cleanup();
  }
});

test("★ 快照里节点内嵌的 stages 与实时 API 同形（前端不必写两条分支）", () => {
  const { db, cleanup } = setup();
  try {
    const now = nowIso();
    const project = publishOne(db, "ParityStages");
    const other = publishOne(db, "NoStages");
    for (const [id, name, start] of [["stage:par-a", "第一期", "2026-01-01"], ["stage:par-b", "第二期", "2026-02-01"]]) {
      q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?, 'stage', ?, ?, ?, ?)",
        id, JSON.stringify({ name, i18n: { zh: { title: name } }, facets: { time: { start, end: "2026-12-31" } } }), `seed_${id}_1`, now, now);
      q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?, ?, '{}', 'published', ?)", `seed_${id}_1`, id, now);
      q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES (?, 'parent', ?, ?)", id, project.nodeId, now);
    }

    const at = new Date("2026-06-01T00:00:00Z");
    const snapshot = buildSnapshot(db, { generatedAt: at.toISOString() });
    const inSnapshot = snapshot.nodes.find((node) => node.id === project.nodeId);
    const live = findPublishedNode(db, project.nodeId, { now: at });

    // 同一份数据，两种读法必须给出同样的阶段数组——否则前端离线/在线要分叉
    assert.deepEqual(inSnapshot.stages, live.stages, "快照内嵌 stages 必须与实时 API 完全一致");
    assert.deepEqual(
      inSnapshot.stages.map((stage) => stage.id),
      snapshot.stages.filter((stage) => stage.parentId === project.nodeId).map((stage) => stage.id),
      "内嵌那份与顶层 stages 数组（按 parentId 过滤）必须指向同一批阶段",
    );
    assert.deepEqual(inSnapshot.stages.map((stage) => stage.phase), ["current", "current"], "两个窗口都包含 now → 并列");

    // 没有阶段的节点在两边都**不带** stages 键（消费方统一 `?? []` 即可）
    assert.ok(!("stages" in (snapshot.nodes.find((node) => node.id === other.nodeId))), "无阶段的节点不该凭空多出 stages 键");
    assert.ok(!("stages" in findPublishedNode(db, other.nodeId, { now: at })));
    assert.deepEqual(findPublishedNode(db, project.nodeId, { now: at }).facets.phases, ["第一期", "第二期"]);
  } finally {
    cleanup();
  }
});
