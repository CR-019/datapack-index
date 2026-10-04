import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { EventError, appendEvent, appendFact, countEvents, currentStateOf, listEvents, recomputeState, voidEvent } from "../src/events.mjs";

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-events-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();
  // 一个已上架的条目 + 一个未上架的
  for (const [id, published] of [["project:pub", "rev_pub"], ["project:draft", null]]) {
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?, 'project', ?, ?, ?, ?)",
      id, JSON.stringify({ i18n: { zh: { title: id } }, facets: { state: "active" } }), published, now, now);
  }
  q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES ('rev_pub','project:pub','{}','published',?)", now);
  return { db, dir, cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}

const titleOf = (event) => event.title;

/* ───────── 追加与校验 ───────── */

test("追加事件并读回（倒序）", () => {
  const { db, cleanup } = setup();
  try {
    appendFact(db, { nodeId: "project:pub", kind: "milestone", title: "发布 v1.0", at: "2026-03-01T00:00:00.000Z" });
    appendFact(db, { nodeId: "project:pub", kind: "note", title: "换了个渲染方案", at: "2026-05-01T00:00:00.000Z" });

    const items = listEvents(db, "project:pub");
    assert.equal(items.length, 2);
    assert.equal(items[0].title, "换了个渲染方案", "应按时间倒序");
    assert.equal(items[1].title, "发布 v1.0");
    assert.equal(countEvents(db, "project:pub"), 2);
  } finally {
    cleanup();
  }
});

test("★ 不变量：事件必须是已发生的事实（拒绝未来时间）", () => {
  const { db, cleanup } = setup();
  try {
    const future = new Date(Date.now() + 7 * 86_400_000).toISOString();
    assert.throws(
      () => appendFact(db, { nodeId: "project:pub", kind: "milestone", title: "计划发布", at: future }),
      (error) => error instanceof EventError && error.code === "future_event",
    );
    // 容忍一点时钟偏差
    const almostNow = new Date(Date.now() + 5_000).toISOString();
    assert.doesNotThrow(() => appendFact(db, { nodeId: "project:pub", kind: "note", title: "刚刚", at: almostNow }));
  } finally {
    cleanup();
  }
});

test("★ 不变量：标题属事实可直通，长描述属内容必须走修订", () => {
  const { db, cleanup } = setup();
  try {
    assert.throws(
      () => appendFact(db, { nodeId: "project:pub", kind: "milestone", title: "发布 v1.0", body: "这是一大段宣传文字……" }),
      (error) => error.code === "body_needs_review",
    );
    // 审核通过的路径可以带正文
    const event = appendEvent(db, { nodeId: "project:pub", kind: "milestone", title: "发布 v1.0", body: "正文", allowBody: true, source: "derived" });
    assert.equal(event.body, "正文");
  } finally {
    cleanup();
  }
});

test("校验：类型、标题必填与长度、来源、可见性、状态取值", () => {
  const { db, cleanup } = setup();
  try {
    const cases = [
      [{ kind: "nope", title: "x" }, "bad_event_kind"],
      [{ kind: "note", title: "   " }, "missing_title"],
      [{ kind: "note", title: "很".repeat(81) }, "title_too_long"],
      [{ kind: "note", title: "x", source: "weird" }, "bad_source"],
      [{ kind: "note", title: "x", visibility: "secret" }, "bad_visibility"],
      [{ kind: "state", title: "x", status: "flying" }, "bad_status"],
      [{ kind: "recruit", title: "x", status: "maybe" }, "bad_status"],
      [{ kind: "note", title: "x", at: "不是时间" }, "bad_time"],
    ];
    for (const [input, code] of cases) {
      assert.throws(
        () => appendFact(db, { nodeId: "project:pub", ...input }),
        (error) => error.code === code,
        `期望 ${code}，输入 ${JSON.stringify(input)}`,
      );
    }
    assert.throws(() => appendFact(db, { nodeId: "project:不存在", kind: "note", title: "x" }), (error) => error.code === "node_not_found");
  } finally {
    cleanup();
  }
});

/* ───────── 状态投影（不变量 3） ───────── */

test("★ state 事件是 facets.state 的唯一来源（追加即改投影）", () => {
  const { db, cleanup } = setup();
  try {
    const readState = () => JSON.parse(q.get(db, "SELECT profile_json FROM nodes WHERE id='project:pub'").profile_json).facets.state;
    assert.equal(readState(), "active", "初始由已上架推出 active");

    appendFact(db, { nodeId: "project:pub", kind: "state", status: "done", title: "项目已完结" });
    assert.equal(readState(), "done");
    assert.equal(currentStateOf(db, "project:pub"), "done");

    appendFact(db, { nodeId: "project:pub", kind: "state", status: "active", title: "重新开工" });
    assert.equal(readState(), "active", "允许回退，但必须经事件");
  } finally {
    cleanup();
  }
});

test("未上架节点默认是 draft；非 state 事件不改状态", () => {
  const { db, cleanup } = setup();
  try {
    assert.equal(currentStateOf(db, "project:draft"), "draft");
    appendFact(db, { nodeId: "project:draft", kind: "milestone", title: "内部记一笔" });
    assert.equal(currentStateOf(db, "project:draft"), "draft", "milestone 不该动状态");
  } finally {
    cleanup();
  }
});

test("recomputeState 由最新的 state 事件决定（按 at 而非录入顺序）", () => {
  const { db, cleanup } = setup();
  try {
    appendFact(db, { nodeId: "project:pub", kind: "state", status: "done", title: "完结", at: "2026-06-01T00:00:00.000Z" });
    // 补记一条更早的事件：不该覆盖
    appendFact(db, { nodeId: "project:pub", kind: "state", status: "paused", title: "当时暂停过", at: "2026-02-01T00:00:00.000Z" });
    assert.equal(currentStateOf(db, "project:pub"), "done", "补记历史事件不该改变当前状态");
    assert.equal(recomputeState(db, "project:pub"), "done");
  } finally {
    cleanup();
  }
});

/* ───────── 作废（不变量 2） ───────── */

test("★ 事件不可改，但可作废；作废后投影随之回退", () => {
  const { db, cleanup } = setup();
  try {
    const event = appendFact(db, { nodeId: "project:pub", kind: "state", status: "done", title: "手滑标成完结" });
    assert.equal(currentStateOf(db, "project:pub"), "done");

    voidEvent(db, { eventId: event.id, actorId: "person:A", reason: "标错了" });
    assert.equal(currentStateOf(db, "project:pub"), "active", "作废后应回退到上一个有效状态");
    assert.equal(listEvents(db, "project:pub").length, 0, "作废的事件不出现在默认列表里");

    assert.throws(() => voidEvent(db, { eventId: event.id }), (error) => error.code === "already_voided");
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM audit_log WHERE action='event.voided'").c, 1, "作废要留审计");
  } finally {
    cleanup();
  }
});

/* ───────── 可见性 ───────── */

test("内部事件默认不出现在公开列表，但可以显式取", () => {
  const { db, cleanup } = setup();
  try {
    appendFact(db, { nodeId: "project:pub", kind: "note", title: "公开的" });
    appendFact(db, { nodeId: "project:pub", kind: "note", title: "内部的", visibility: "internal" });

    assert.deepEqual(listEvents(db, "project:pub").map(titleOf), ["公开的"]);
    assert.deepEqual(listEvents(db, "project:pub", { includeInternal: true }).map(titleOf).sort(), ["公开的", "内部的"].sort());
  } finally {
    cleanup();
  }
});

test("列表支持 limit", () => {
  const { db, cleanup } = setup();
  try {
    for (let index = 0; index < 5; index += 1) {
      appendFact(db, { nodeId: "project:pub", kind: "note", title: `第 ${index} 条` });
    }
    assert.equal(listEvents(db, "project:pub", { limit: 2 }).length, 2);
  } finally {
    cleanup();
  }
});
