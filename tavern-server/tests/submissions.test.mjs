import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nowIso } from "../src/config.mjs";
import { PUBLISHED_ONLY, openDatabase, parseProfile, q } from "../src/db.mjs";
import { reviewRevision, saveSubmission, slugify } from "../src/submissions.mjs";

/* ───────── 测试脚手架：临时库 + 一个作者账号 ───────── */

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-sub-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();

  for (const [id, role] of [["person:Staff", "staff"], ["person:Author", "author"], ["person:Stranger", "author"]]) {
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'person', ?, ?, ?)",
      id, JSON.stringify({ name: id.split(":")[1] }), now, now);
    q.run(db, "INSERT INTO accounts (id, pin, role, status, created_at) VALUES (?, ?, ?, 'active', ?)",
      id, id.split(":")[1].toLowerCase(), role, now);
  }

  return {
    db,
    cleanup() {
      db.close();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

function fakeProject({ name = "测试项目", summary = "第一版简介", tags = ["UI"], body = "第一版正文" } = {}) {
  return {
    template: 1,
    kind: "project",
    name,
    summary,
    tags,
    gameversion: ["1.21.9"],
    repo: null,
    license: null,
    links: [],
    cover: null,
    time: null,
    i18n: { zh: { title: name, summary, body } },
    recruit: [],
    relations: { requests: [], related: [], depends: [] },
    assets: [{ path: "assets/cover.png", sha256: "a".repeat(64), size: 100, mime: "image/png" }],
  };
}

const submit = (db, accountId, project, slug = "demo") =>
  saveSubmission(db, { accountId, project, slug, zipSha256: "b".repeat(64), zipPath: "/tmp/x.zip" });

/** 与路由同源的公开读取：只认已发布修订 */
const readPublic = (db, id) => {
  const row = q.get(db, `SELECT n.* FROM nodes n WHERE n.id = ? AND ${PUBLISHED_ONLY}`, id);
  return row ? parseProfile(row) : null;
};

const publish = (db, revisionId, reviewerId = "person:Staff") =>
  reviewRevision(db, { revisionId, action: "approve", reviewerId, note: "看起来没问题" });

/* ───────── 不变量 8：公开面只展示已发布修订 ───────── */

test("首次投稿：未上架时公开面看不到", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId } = submit(db, "person:Author", fakeProject());
    assert.equal(readPublic(db, nodeId), null, "未上架的条目不该被公开读到");
  } finally {
    cleanup();
  }
});

test("上架后公开可见，且内容是已发布的那一版", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId, revisionId } = submit(db, "person:Author", fakeProject());
    publish(db, revisionId);
    const node = readPublic(db, nodeId);
    assert.ok(node, "上架后应当可见");
    assert.equal(node.i18n.zh.summary, "第一版简介");
    assert.equal(node.facets.state, "active");
  } finally {
    cleanup();
  }
});

test("★ 提交新修订时，公开面必须仍显示旧版（未审内容不得泄露）", () => {
  const { db, cleanup } = setup();
  try {
    const first = submit(db, "person:Author", fakeProject());
    publish(db, first.revisionId);

    // 同一维护者提交第二版
    const second = submit(db, "person:Author", fakeProject({ name: "测试项目", summary: "第二版简介（未审）", body: "第二版正文" }));
    assert.notEqual(second.revisionId, first.revisionId);

    const publicNode = readPublic(db, second.nodeId);
    assert.ok(publicNode, "已上架条目应当仍然可见");
    assert.equal(
      publicNode.i18n.zh.summary,
      "第一版简介",
      "公开面显示的是未审核的新内容 —— 违反不变量 8（未审内容外泄）",
    );
    assert.equal(publicNode.publishedRevisionId, first.revisionId, "发布指针不该被投稿动作移动");
  } finally {
    cleanup();
  }
});

test("审核通过新修订后，公开面才切到新版；旧修订标记为 superseded", () => {
  const { db, cleanup } = setup();
  try {
    const first = submit(db, "person:Author", fakeProject());
    publish(db, first.revisionId);
    const second = submit(db, "person:Author", fakeProject({ summary: "第二版简介" }));
    publish(db, second.revisionId);

    assert.equal(readPublic(db, second.nodeId).i18n.zh.summary, "第二版简介");
    assert.equal(q.get(db, "SELECT status FROM revisions WHERE id = ?", first.revisionId).status, "superseded");
  } finally {
    cleanup();
  }
});

test("驳回新修订后，公开面保持旧版且指针不动", () => {
  const { db, cleanup } = setup();
  try {
    const first = submit(db, "person:Author", fakeProject());
    publish(db, first.revisionId);
    const second = submit(db, "person:Author", fakeProject({ summary: "会被驳回的第二版" }));
    reviewRevision(db, { revisionId: second.revisionId, action: "reject", note: "封面不合格", reviewerId: "person:Staff" });

    const node = readPublic(db, second.nodeId);
    assert.equal(node.i18n.zh.summary, "第一版简介");
    assert.equal(node.publishedRevisionId, first.revisionId);
    assert.equal(q.get(db, "SELECT status FROM revisions WHERE id = ?", second.revisionId).status, "rejected");
  } finally {
    cleanup();
  }
});

/* ───────── 权限与并发 ───────── */

test("非维护者不能向已存在条目投稿（403）", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId } = submit(db, "person:Author", fakeProject());
    assert.throws(
      () => submit(db, "person:Stranger", fakeProject(), "demo"),
      (error) => error.status === 403 && error.code === "not_maintainer",
    );
    assert.equal(nodeId, "project:demo");
  } finally {
    cleanup();
  }
});

test("同一 slug 重复投稿不会新建节点，而是追加修订", () => {
  const { db, cleanup } = setup();
  try {
    const first = submit(db, "person:Author", fakeProject());
    const second = submit(db, "person:Author", fakeProject());
    assert.equal(first.nodeId, second.nodeId);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE id = ?", first.nodeId).c, 1);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM revisions WHERE node_id = ?", first.nodeId).c, 2);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM edges WHERE rel='maintains' AND to_id = ?", first.nodeId).c, 1);
  } finally {
    cleanup();
  }
});

test("★ 同一毫秒内用同一份包连续投稿，修订 id 不得碰撞", () => {
  const { db, cleanup } = setup();
  try {
    // 曾经：id = 内容哈希前 16 位 + 毫秒 → 同一毫秒内完全相同，撞主键
    const ids = [];
    for (let index = 0; index < 20; index += 1) {
      ids.push(submit(db, "person:Author", fakeProject({ summary: `第 ${index} 版` })).revisionId);
    }
    assert.equal(new Set(ids).size, ids.length, "修订 id 出现重复");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM revisions").c, 20);
  } finally {
    cleanup();
  }
});

test("slugify 对中文名回退到稳定哈希（不依赖拼音库）", () => {
  assert.equal(slugify("Floating UI Plus"), "floating-ui-plus");
  const a = slugify("浮空界面");
  const b = slugify("浮空界面");
  assert.match(a, /^p-[0-9a-f]{8}$/);
  assert.equal(a, b, "同名必须得到同样的 slug");
  assert.notEqual(a, slugify("另一个名字"));
});

/* ───────── 素材与标签的可见性转换 ───────── */

test("素材可见性随审核转换：pending → published", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId, revisionId } = submit(db, "person:Author", fakeProject());
    assert.equal(q.get(db, "SELECT visibility FROM assets WHERE node_id = ?", nodeId).visibility, "pending");
    publish(db, revisionId);
    assert.equal(q.get(db, "SELECT visibility FROM assets WHERE node_id = ?", nodeId).visibility, "published");
  } finally {
    cleanup();
  }
});

test("标签成员只在审核通过时才物化（未审不改公开标签）", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId, revisionId } = submit(db, "person:Author", fakeProject({ tags: ["UI"] }));
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tag_members WHERE node_id = ?", nodeId).c, 0, "未上架不该进标签");
    publish(db, revisionId);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM tag_members WHERE node_id = ?", nodeId).c, 1);
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM nodes WHERE id = 'tag:ui'").c, 1, "上架时应自动建立标签节点");
  } finally {
    cleanup();
  }
});

test("审核是一次性的：已处理的修订不能被再次审核", () => {
  const { db, cleanup } = setup();
  try {
    const { revisionId } = submit(db, "person:Author", fakeProject());
    publish(db, revisionId);
    assert.throws(
      () => publish(db, revisionId),
      (error) => error.status === 409 && error.code === "not_pending",
    );
  } finally {
    cleanup();
  }
});

test("平台字段不会被写进公开 profile（防御性）", () => {
  const { db, cleanup } = setup();
  try {
    const { nodeId, revisionId } = submit(db, "person:Author", fakeProject());
    publish(db, revisionId);
    const node = readPublic(db, nodeId);
    for (const key of ["account", "accounts", "token", "email", "notes"]) {
      assert.ok(!(key in node), `公开 profile 不该含 ${key}`);
    }
  } finally {
    cleanup();
  }
});

/* ───────── 不变量 1：id 必须与 kind 一致 ───────── */

test("★ 投稿的 id 前缀跟着 kind 走（曾写死 project:，与 kind:event 自相矛盾）", () => {
  const { db, cleanup } = setup();
  try {
    // 设计 §9.1 明确允许 frontmatter 写 kind: event / index，不只是 project
    const { nodeId } = submit(db, "person:Author", {
      ...fakeProject({ name: "秋季创作赛" }),
      kind: "event",
      time: { start: "2026-09-01", end: "2026-12-31" },
    });

    // 曾经这里产出 project:xxx 而 kind=event：之后任何人按 event:xxx 引用它
    // （relations.json 的 to、includes/parent 边的目标）都会 FOREIGN KEY 失败，
    // 而报错只说"外键约束失败"，完全不提真正原因是 id 撒谎了。
    assert.ok(nodeId.startsWith("event:"), `id 前缀应与 kind 一致，实际 ${nodeId}`);
    assert.equal(q.get(db, "SELECT kind FROM nodes WHERE id = ?", nodeId).kind, "event");
    // 默认 slug 是 "demo"：真正要保证的是别人能按 event:<slug> 引用到它 ——
    // 那才是 FK 失败那天的实际诉求
    assert.equal(nodeId, "event:demo");
    assert.ok(q.get(db, "SELECT 1 AS ok FROM nodes WHERE id = 'event:demo'"));
  } finally {
    cleanup();
  }
});

test("★ 全库不得出现 id 前缀与 kind 不一致的节点（不变量 1 的全局校验）", () => {
  const { db, cleanup } = setup();
  try {
    submit(db, "person:Author", fakeProject(), "普通项目");
    submit(db, "person:Author", { ...fakeProject({ name: "合集" }), kind: "index" }, "合集");
    submit(db, "person:Author", { ...fakeProject({ name: "赛事" }), kind: "event", time: { start: "2026-01-01", end: "2026-02-01" } }, "赛事");

    const bad = q.all(db, "SELECT id, kind FROM nodes").filter((row) => row.id.split(":")[0] !== row.kind);
    assert.deepEqual(bad, [], `这些节点的 id 前缀与 kind 不一致：${JSON.stringify(bad)}`);
  } finally {
    cleanup();
  }
});
