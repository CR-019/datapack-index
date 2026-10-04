import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { ChangeError, applyConvergentChange } from "../src/changes.mjs";
import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { countEvents, currentStateOf, listEvents } from "../src/events.mjs";

function setup(profile = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-changes-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();
  const full = {
    i18n: { zh: { title: "测试项目", summary: "简介", body: "正文" } },
    facets: { state: "active", game: ["1.21.9"] },
    tags: ["UI"],
    recruit: [{ role: "着色器", status: "open", skills: ["GLSL"] }, { role: "美术", status: "open" }],
    ...profile,
  };
  q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES ('project:p','project',?, 'rev1', ?, ?)",
    JSON.stringify(full), now, now);
  q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES ('rev1','project:p','{}','published',?)", now);
  return { db, dir, cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}

const profileOf = (db) => JSON.parse(q.get(db, "SELECT profile_json FROM nodes WHERE id='project:p'").profile_json);

/* ───────── 核心：直通 + 自动追写事件 ───────── */

test("★ 关招募：直通生效，且自动留下事件（零审核成本 + 完整历史）", () => {
  const { db, cleanup } = setup();
  try {
    const result = applyConvergentChange(db, {
      nodeId: "project:p",
      actorId: "person:A",
      patch: { recruit: [{ role: "着色器", status: "filled" }], note: "招满了" },
    });

    // ① 直通：公开 profile 立刻变了
    assert.equal(profileOf(db).recruit.find((item) => item.role === "着色器").status, "filled");
    // ② 有历史：事件被自动追加（不是作者额外劳动）
    assert.equal(result.events.length, 1);
    assert.equal(result.events[0].kind, "recruit");
    assert.equal(result.events[0].status, "filled");
    assert.match(result.events[0].title, /着色器/);
    // ③ 可回滚：记了一条收敛型修订并移动了发布指针
    assert.match(result.revisionId, /^rev_conv_/);
    assert.equal(q.get(db, "SELECT published_revision_id AS r FROM nodes WHERE id='project:p'").r, result.revisionId);
    assert.equal(q.get(db, "SELECT status FROM revisions WHERE id='rev1'").status, "superseded");
    // ④ 审计
    assert.equal(q.get(db, "SELECT COUNT(*) AS c FROM audit_log WHERE action='node.convergent-change'").c, 1);
  } finally {
    cleanup();
  }
});

test("★ 标记完结：状态走事件投影，不是直接改字段", () => {
  const { db, cleanup } = setup();
  try {
    const result = applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { state: "done" } });
    assert.equal(result.state, "done");
    assert.equal(currentStateOf(db, "project:p"), "done");
    assert.equal(JSON.parse(q.get(db, "SELECT profile_json FROM nodes WHERE id='project:p'").profile_json).facets.state, "done");
    assert.equal(result.events[0].kind, "state");
    assert.match(result.events[0].title, /进行中 → 已完结/);
  } finally {
    cleanup();
  }
});

test("状态与招募可以一次改完，各自留一条事件", () => {
  const { db, cleanup } = setup();
  try {
    const result = applyConvergentChange(db, {
      nodeId: "project:p",
      actorId: "person:A",
      patch: { state: "done", recruit: [{ role: "着色器", status: "closed" }, { role: "美术", status: "filled" }] },
    });
    assert.equal(result.events.length, 3);
    assert.deepEqual(result.events.map((event) => event.kind).sort(), ["recruit", "recruit", "state"]);
    assert.equal(countEvents(db, "project:p"), 3);
  } finally {
    cleanup();
  }
});

/* ───────── 边界：只收收敛型 ───────── */

test("★ 扩张型字段被拒绝，并指回投稿流程", () => {
  const { db, cleanup } = setup();
  try {
    for (const patch of [{ summary: "新的宣传语" }, { links: [{ label: "x", url: "/y" }] }, { tags: ["新标签"] }, { cover: "a.png" }]) {
      assert.throws(
        () => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch }),
        (error) => error instanceof ChangeError && error.code === "not_convergent",
        `应当拒绝：${JSON.stringify(patch)}`,
      );
    }
    assert.match(
      (() => { try { applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { summary: "x" } }); } catch (error) { return error.message; } })(),
      /待审修订/,
    );
    assert.equal(countEvents(db, "project:p"), 0, "被拒绝的请求不该留下任何事件");
  } finally {
    cleanup();
  }
});

test("未上架的条目不能走直通（要走投稿流程）", () => {
  const { db, cleanup } = setup();
  try {
    q.run(db, "UPDATE nodes SET published_revision_id = NULL WHERE id='project:p'");
    assert.throws(
      () => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { state: "done" } }),
      (error) => error.code === "not_published",
    );
  } finally {
    cleanup();
  }
});

test("无改动 / 重复改 / 不存在的岗位都给出可读错误", () => {
  const { db, cleanup } = setup();
  try {
    assert.throws(() => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: {} }),
      (error) => error.code === "no_change");
    assert.throws(() => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { state: "active" } }),
      (error) => error.code === "no_change");
    assert.throws(() => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { recruit: [{ role: "不存在", status: "filled" }] } }),
      (error) => error.code === "role_not_found");
    assert.throws(() => applyConvergentChange(db, { nodeId: "project:p", actorId: "person:A", patch: { recruit: "x" } }),
      (error) => error.code === "bad_recruit");
  } finally {
    cleanup();
  }
});

/* ───────── 事务性 ───────── */

test("★ 一次改动中任何一项失败，整批回滚（不留半截状态）", () => {
  const { db, cleanup } = setup();
  try {
    const before = profileOf(db);
    assert.throws(
      () => applyConvergentChange(db, {
        nodeId: "project:p",
        actorId: "person:A",
        // 第一项合法、第二项引用不存在的岗位 → 整批应回滚
        patch: { state: "done", recruit: [{ role: "不存在", status: "filled" }] },
      }),
      (error) => error.code === "role_not_found",
    );

    assert.equal(profileOf(db).facets.state, before.facets.state, "状态不该被改成 done");
    assert.equal(currentStateOf(db, "project:p"), "active");
    assert.equal(countEvents(db, "project:p"), 0, "不该留下半截事件");
    assert.equal(q.get(db, "SELECT published_revision_id AS r FROM nodes WHERE id='project:p'").r, "rev1", "发布指针不该动");
  } finally {
    cleanup();
  }
});

test("收敛型修改留下的事件出现在时间线里，且可回滚（修订快照含改动后的 profile）", () => {
  const { db, cleanup } = setup();
  try {
    const result = applyConvergentChange(db, {
      nodeId: "project:p", actorId: "person:A",
      patch: { recruit: [{ role: "美术", status: "filled" }], note: "美术到齐" },
    });
    const events = listEvents(db, "project:p");
    assert.equal(events.length, 1);
    assert.equal(events[0].status, "filled");

    const snapshot = JSON.parse(q.get(db, "SELECT snapshot_json FROM revisions WHERE id = ?", result.revisionId).snapshot_json);
    assert.equal(snapshot.convergent, true);
    assert.equal(snapshot.profile.recruit.find((item) => item.role === "美术").status, "filled");
    assert.equal(snapshot.note, "美术到齐", "回滚时能知道当时为什么改");
  } finally {
    cleanup();
  }
});

/* ───────── 变更记录里的"改前值"必须是真值 ───────── */

test("★ recruit 变更记录的 from 是改前的状态，不是改后的（曾写成 from=to）", () => {
  const { db, cleanup } = setup();
  try {
    const first = applyConvergentChange(db, {
      nodeId: "project:p", actorId: null, patch: { recruit: [{ role: "美术", status: "filled" }] },
    });
    // `entry` 是 profile.recruit 里的对象引用：先赋值再读它当 from，就会得到
    // from=filled/to=filled。界面与审计日志里的"改前值"于是全是假的——
    // 不报错，只是让人以为这个岗位本来就是满的。
    assert.deepEqual(first.changes, [{ field: "recruit:美术", from: "open", to: "filled" }]);

    // 第二轮：from 必须是上一轮的结果
    const second = applyConvergentChange(db, {
      nodeId: "project:p", actorId: null, patch: { recruit: [{ role: "美术", status: "closed" }] },
    });
    assert.deepEqual(second.changes, [{ field: "recruit:美术", from: "filled", to: "closed" }]);

    // 状态确实落库，没提到的岗位不被动，且其余字段不被顺手抹掉
    const stored = profileOf(db).recruit;
    assert.equal(stored.find((item) => item.role === "美术").status, "closed");
    assert.equal(stored.find((item) => item.role === "着色器").status, "open");
    assert.deepEqual(stored.find((item) => item.role === "着色器").skills, ["GLSL"]);
  } finally {
    cleanup();
  }
});
