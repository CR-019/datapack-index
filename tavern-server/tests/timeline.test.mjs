import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import {
  childrenOf,
  derivePhases,
  eventPhasesOf,
  hasParent,
  listStages,
  openRecruitRoles,
  parseBoundary,
  parentIdOf,
  stagePhaseOf,
  withDerivedFacets,
} from "../src/timeline.mjs";

/* ───────── 时间边界 ───────── */

test("date-only 的结束边界覆盖整天（否则一天的赛事当天 00:00 就结束）", () => {
  const start = parseBoundary("2026-11-30");
  const end = parseBoundary("2026-11-30", { endOfDay: true });
  assert.equal(new Date(start).toISOString(), "2026-11-30T00:00:00.000Z");
  assert.equal(new Date(end).toISOString(), "2026-11-30T23:59:59.999Z");
  assert.ok(end > start);
});

test("带时间的边界按原样解析；非法值返回 null", () => {
  assert.equal(new Date(parseBoundary("2026-08-01T12:00:00.000Z")).toISOString(), "2026-08-01T12:00:00.000Z");
  assert.equal(parseBoundary("不是时间"), null);
  assert.equal(parseBoundary(""), null);
  assert.equal(parseBoundary(null), null);
});

/* ───────── 单个阶段的派生状态 ───────── */

test("stagePhaseOf：past / current / future", () => {
  const stage = { facets: { time: { start: "2026-03-01", end: "2026-06-30" } } };
  assert.equal(stagePhaseOf(stage, new Date("2026-01-01T00:00:00Z")), "future");
  assert.equal(stagePhaseOf(stage, new Date("2026-04-15T00:00:00Z")), "current");
  assert.equal(stagePhaseOf(stage, new Date("2026-12-01T00:00:00Z")), "past");
  // 边界：起始当天算 current，结束当天也算 current（整天覆盖）
  assert.equal(stagePhaseOf(stage, new Date("2026-03-01T00:00:00Z")), "current");
  assert.equal(stagePhaseOf(stage, new Date("2026-06-30T23:00:00Z")), "current");
  assert.equal(stagePhaseOf(stage, new Date("2026-07-01T00:00:00Z")), "past");
});

test("没有窗口的阶段返回 null（正常阶段不该出现这种情况）", () => {
  assert.equal(stagePhaseOf({ facets: {} }), null);
});

/* ───────── 阶段列表 ───────── */

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tavern-timeline-"));
  const db = openDatabase(path.join(dir, "test.db"));
  const now = nowIso();
  const makeNode = (id, kind, profile, published = true) => {
    q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
      id, kind, JSON.stringify(profile), published ? `seed_${id}_1` : null, now, now);
    if (published) {
      q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?,?,?,'published',?)",
        `seed_${id}_1`, id, JSON.stringify(profile), now);
    }
  };
  const addStage = (id, parentId, profile) => {
    makeNode(id, "stage", profile);
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES (?, 'parent', ?, ?)", id, parentId, now);
  };
  return { db, dir, makeNode, addStage, cleanup: () => { db.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
}

const stageProfile = (name, start, end) => ({
  name,
  i18n: { zh: { title: name } },
  facets: { time: { start, end }, state: "active" },
});

test("listStages 按窗口起点升序，并带上派生 phase", () => {
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:p-late", "project:p", stageProfile("第三期", "2026-09-01", "2026-12-01"));
    addStage("stage:p-early", "project:p", stageProfile("第一期", "2026-01-01", "2026-03-01"));
    addStage("stage:p-mid", "project:p", stageProfile("第二期", "2026-04-01", "2026-06-01"));

    const stages = listStages(db, "project:p", { now: new Date("2026-05-01T00:00:00Z") });
    assert.deepEqual(stages.map((stage) => stage.name), ["第一期", "第二期", "第三期"]);
    assert.deepEqual(stages.map((stage) => stage.phase), ["past", "current", "future"]);
  } finally {
    cleanup();
  }
});

test("未上架的阶段不出现在公开列表里", () => {
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:pub", "project:p", stageProfile("公开期", "2026-01-01", "2026-12-31"));
    // 未上架的阶段
    makeNode("stage:draft", "stage", stageProfile("草稿期", "2026-01-01", "2026-12-31"), false);
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('stage:draft','parent','project:p',?)", nowIso());

    assert.deepEqual(listStages(db, "project:p").map((stage) => stage.name), ["公开期"]);
    assert.equal(listStages(db, "project:p", { includeUnpublished: true }).length, 2);
  } finally {
    cleanup();
  }
});

/* ───────── phases 投影（用户拍板：允许并列、允许空隙） ───────── */

test("★ 并列阶段：窗口重叠时 phases 同时包含多个", () => {
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:p-dev", "project:p", stageProfile("v2 开发", "2026-01-01", "2026-12-31"));
    addStage("stage:p-ops", "project:p", stageProfile("社区运营", "2026-06-01", "2026-09-01"));

    const node = JSON.parse(q.get(db, "SELECT profile_json FROM nodes WHERE id='project:p'").profile_json);
    const phases = derivePhases(db, { id: "project:p", ...node }, { now: new Date("2026-07-01T00:00:00Z") });
    assert.deepEqual(phases.sort(), ["v2 开发", "社区运营"].sort(), "并列阶段必须同时出现在 phases 里");
  } finally {
    cleanup();
  }
});

test("★ 空隙：两段之间 phases 为空（项目中断几个月是正常的）", () => {
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:p-1", "project:p", stageProfile("第一期", "2026-01-01", "2026-03-01"));
    addStage("stage:p-2", "project:p", stageProfile("第二期", "2026-09-01", "2026-12-01"));

    const node = JSON.parse(q.get(db, "SELECT profile_json FROM nodes WHERE id='project:p'").profile_json);
    const inGap = derivePhases(db, { id: "project:p", ...node }, { now: new Date("2026-06-01T00:00:00Z") });
    assert.deepEqual(inGap, [], "处在空隙里应当返回空集合，而不是硬塞一个阶段");

    const inSecond = derivePhases(db, { id: "project:p", ...node }, { now: new Date("2026-10-01T00:00:00Z") });
    assert.deepEqual(inSecond, ["第二期"]);
  } finally {
    cleanup();
  }
});

test("没有 stage 子节点时回退到 kind 规则：赛事窗口", () => {
  const time = { start: "2026-09-01", end: "2026-11-30", deadline: "2026-09-20" };
  const node = { kind: "event", facets: { time }, recruit: [] };
  assert.deepEqual(eventPhasesOf(node, new Date("2026-08-01T00:00:00Z")), ["筹备中"]);
  assert.deepEqual(eventPhasesOf(node, new Date("2026-09-10T00:00:00Z")), ["报名中"]);
  assert.deepEqual(eventPhasesOf(node, new Date("2026-10-01T00:00:00Z")), ["进行中"]);
  assert.deepEqual(eventPhasesOf(node, new Date("2026-12-01T00:00:00Z")), ["已结束"]);
});

test("没有 stage 时回退：招募中（并尊重 deadline）", () => {
  const open = { kind: "project", facets: {}, recruit: [{ role: "着色器", status: "open" }] };
  assert.deepEqual(openRecruitRoles(open, new Date("2026-05-01T00:00:00Z")), ["着色器"]);

  const expired = { kind: "project", facets: {}, recruit: [{ role: "着色器", status: "open", deadline: "2026-04-01" }] };
  assert.deepEqual(openRecruitRoles(expired, new Date("2026-05-01T00:00:00Z")), [], "过了截止日就不再算招募中");

  const filled = { kind: "project", facets: {}, recruit: [{ role: "着色器", status: "filled" }] };
  assert.deepEqual(openRecruitRoles(filled, new Date("2026-05-01T00:00:00Z")), []);

  const { db, cleanup } = setup();
  try {
    const phases = derivePhases(db, { id: "project:none", ...open }, { now: new Date("2026-05-01T00:00:00Z") });
    assert.deepEqual(phases, ["招募中"]);
  } finally {
    cleanup();
  }
});

test("withDerivedFacets 挂上 phases 且不改动其它 facets", () => {
  const { db, cleanup } = setup();
  try {
    const decorated = withDerivedFacets(db, { id: "project:x", facets: { state: "active", game: ["1.21.9"] } });
    assert.deepEqual(decorated.facets.phases, []);
    assert.equal(decorated.facets.state, "active");
    assert.deepEqual(decorated.facets.game, ["1.21.9"]);
  } finally {
    cleanup();
  }
});

/* ───────── 父子关系（不变量 13 的基础） ───────── */

test("hasParent / parentIdOf / childrenOf", () => {
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:a", "project:p", stageProfile("A", "2026-01-01", "2026-02-01"));
    addStage("stage:b", "project:p", stageProfile("B", "2026-03-01", "2026-04-01"));

    assert.equal(hasParent(db, "project:p"), false, "顶层条目没有父节点");
    assert.equal(hasParent(db, "stage:a"), true);
    assert.equal(parentIdOf(db, "stage:a"), "project:p");
    assert.deepEqual(childrenOf(db, "project:p"), ["stage:a", "stage:b"]);
    assert.deepEqual(childrenOf(db, "stage:a"), []);
  } finally {
    cleanup();
  }
});

/* ───────── 阶段的权限继承（ADR-010） ───────── */

test("★ 阶段继承父节点的维护权（否则每个阶段都要单独挂一条 maintains 边）", async () => {
  const { canEdit } = await import("../src/auth.mjs");
  const { db, makeNode, addStage, cleanup } = setup();
  try {
    const now = nowIso();
    makeNode("project:p", "project", { i18n: { zh: { title: "P" } }, facets: {} });
    addStage("stage:p-1", "project:p", stageProfile("第一期", "2026-01-01", "2026-02-01"));

    for (const [id, role] of [["person:Owner", "author"], ["person:Other", "author"], ["person:Staff", "staff"]]) {
      q.run(db, "INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'person', '{}', ?, ?)", id, now, now);
      q.run(db, "INSERT INTO accounts (id, pin, role, status, created_at) VALUES (?, ?, ?, 'active', ?)", id, id.toLowerCase(), role, now);
    }
    // 只有 Owner 维护父项目
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, role, created_at) VALUES ('person:Owner','maintains','project:p','owner',?)", now);

    assert.equal(canEdit(db, "person:Owner", "project:p"), true);
    assert.equal(canEdit(db, "person:Owner", "stage:p-1"), true, "阶段应继承父项目的维护权");
    assert.equal(canEdit(db, "person:Other", "stage:p-1"), false);
    assert.equal(canEdit(db, "person:Staff", "stage:p-1"), true, "工作组通吃");
    // 顶层无关节点不受影响
    makeNode("project:q", "project", { i18n: { zh: { title: "Q" } }, facets: {} });
    assert.equal(canEdit(db, "person:Owner", "project:q"), false);
  } finally {
    cleanup();
  }
});
