#!/usr/bin/env node
/**
 * 演示数据（可选）：让阶段条与事件流有东西可看。
 *
 * 为什么需要它：网关注入的既有数据里**没有阶段也没有事件**，所以两条新 UI 在
 * 真实数据上永远渲染成空态——能证明"没报错"，证明不了"能用"。
 *
 * ⚠️ 两个刻意的设计：
 *
 *   1) **不碰任何真实项目**。演示数据自建两个明显叫 demo 的项目（`project:demo-alpha`
 *      / `project:demo-beta`）。往 `project:Anisum` 里塞假阶段会让将来分不清
 *      哪些阶段是编的——演示数据必须一眼就能认出来。
 *   2) **默认拒绝写主库**。演示数据一旦进 `data/tavern.db`，`npm run snapshot:check`
 *      就会失败（快照是从主库生成的），而且 `public/tavern-snapshot.json` 是要
 *      上线的离线兜底文件，不能混进编造内容。所以要么给 `TAVERN_DB` 指一个专门的
 *      演示库，要么显式加 `--force` 表示你确实知道后果。
 *
 * 用法：
 *
 *   TAVERN_DB=data/demo.db npm run seed          # 先铺基础数据（作者/条目/标签）
 *   TAVERN_DB=data/demo.db npm run seed:demo     # 再加演示阶段与事件
 *   TAVERN_DB=data/demo.db TAVERN_PORT=9879 npm run dev
 *
 * 阶段与事件都走**真实写入 API**（`createStage` / `appendFact`），不手搓 SQL——
 * 这样这份脚本同时也是一次写入路径的冒烟测试。项目节点本身沿用种子脚本的老办法
 * （直接插 + 发布修订），因为它只是个壳。
 */

import { config, nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { appendFact } from "../src/events.mjs";
import { createStage } from "../src/stages.mjs";

const FORCE = process.argv.includes("--force");
const MAIN_DB = "tavern.db";

/** 演示数据的时间锚点：固定值，保证两次播种结果一致 */
const DEMO_TIME = process.env.TAVERN_SEED_TIME ?? "2026-10-04T00:00:00.000Z";

function guard() {
  const dbPath = config.dbPath ?? "";
  const isMain = dbPath.split(/[\\/]/).pop() === MAIN_DB;
  if (isMain && !FORCE) {
    console.error(
      [
        "✖ 拒绝把演示数据写进主库：" + dbPath,
        "",
        "  演示阶段/事件一旦进主库，`npm run snapshot:check` 就会失败，",
        "  而且 public/tavern-snapshot.json（要上线的离线兜底文件）会混进编造内容。",
        "",
        "  想单独看演示效果，用专用库：",
        "    TAVERN_DB=data/demo.db npm run seed",
        "    TAVERN_DB=data/demo.db npm run seed:demo",
        "    TAVERN_DB=data/demo.db TAVERN_PORT=9879 npm run dev",
        "",
        "  确实要写主库（本机自娱，别提交快照）：加 --force",
      ].join("\n"),
    );
    process.exit(2);
  }
}

function upsertProject(db, { id, title, summary, tags, state }) {
  const profile = {
    i18n: { zh: { title, summary } },
    tags,
    facets: { state, phases: [] },
  };
  q.run(
    db,
    `INSERT INTO nodes (id, kind, profile_json, created_at, updated_at) VALUES (?, 'project', ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, profile_json = excluded.profile_json, updated_at = excluded.updated_at`,
    id, JSON.stringify(profile), DEMO_TIME, DEMO_TIME,
  );
  const revisionId = `seed_${id}_1`;
  q.run(
    db,
    `INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?, ?, ?, 'published', ?)
     ON CONFLICT(id) DO UPDATE SET snapshot_json = excluded.snapshot_json`,
    revisionId, id, JSON.stringify(profile), DEMO_TIME,
  );
  q.run(db, "UPDATE nodes SET published_revision_id = ? WHERE id = ?", revisionId, id);
}

/** 阶段是幂等的：同名同窗口已存在就跳过（否则重跑会堆出一串重复阶段） */
function stageOnce(db, { parentId, name, start, end, summary }) {
  const existing = q.get(
    db,
    `SELECT 1 AS ok FROM nodes n JOIN edges e ON e.from_id = n.id AND e.rel = 'parent'
     WHERE e.to_id = ? AND n.kind = 'stage' AND json_extract(n.profile_json, '$.name') = ?`,
    parentId, name,
  );
  if (existing) return false;
  createStage(db, { parentId, actorId: null, name, start, end, summary });
  return true;
}

function factOnce(db, { nodeId, kind, title, at, status = null, visibility = "public" }) {
  const existing = q.get(db, "SELECT 1 AS ok FROM node_events WHERE node_id = ? AND title = ?", nodeId, title);
  if (existing) return false;
  appendFact(db, { nodeId, kind, title, at, status, visibility, source: "manual", actorId: null });
  return true;
}

function main() {
  guard();
  const db = openDatabase(config.dbPath);
  const created = { stages: 0, events: 0 };

  /* ── Alpha：三个阶段，其中两个**并列**（都含 now）——展示"当前阶段"是集合不是单值 ── */
  const alpha = "project:demo-alpha";
  upsertProject(db, {
    id: alpha,
    title: "示例项目 Alpha",
    summary: "演示用项目：三个阶段，其中两个并列处于进行中，用来验证阶段条与 facets.phases",
    tags: ["演示"],
    state: "active",
  });
  for (const stage of [
    { name: "前期调研", start: "2026-05-01", end: "2026-07-31", summary: "确定范围与技术选型" },
    { name: "v1.0 开发", start: "2026-08-01", end: "2026-12-31", summary: "主功能开发与内测" },
    { name: "社区运营", start: "2026-09-15", end: "2027-03-31", summary: "与开发并行：文档、答疑、征集反馈" },
    { name: "v2.0 规划", start: "2027-01-01", end: "2027-06-30", summary: "尚未开始" },
  ]) {
    if (stageOnce(db, { parentId: alpha, ...stage })) created.stages += 1;
  }
  for (const event of [
    { kind: "milestone", title: "项目立项", at: "2026-05-01" },
    { kind: "state", title: "状态转为开发中", at: "2026-08-01", status: "active" },
    { kind: "milestone", title: "首个可运行版本完成", at: "2026-08-15" },
    { kind: "recruit", title: "招募内测参与者", at: "2026-09-01" },
    // 内部事件：用来验证它**不会**出现在公开接口与快照里
    { kind: "note", title: "内部：与作者确认署名顺序", at: "2026-09-20", visibility: "internal" },
  ]) {
    if (factOnce(db, { nodeId: alpha, ...event })) created.events += 1;
  }

  /* ── Beta：两个阶段之间**有空隙**（4–6 月），展示"允许留白"而非硬要首尾相接 ── */
  const beta = "project:demo-beta";
  upsertProject(db, {
    id: beta,
    title: "示例项目 Beta",
    summary: "演示用项目：两个阶段之间刻意留了空隙，用来验证空隙不会被当成错误",
    tags: ["演示"],
    state: "active",
  });
  for (const stage of [
    { name: "第一季", start: "2026-01-01", end: "2026-03-31", summary: "已完成" },
    { name: "第二季", start: "2026-07-01", end: "2026-12-31", summary: "进行中（与第一季之间空了 4–6 月）" },
  ]) {
    if (stageOnce(db, { parentId: beta, ...stage })) created.stages += 1;
  }
  for (const event of [
    { kind: "milestone", title: "第一季收官", at: "2026-03-31" },
    { kind: "state", title: "暂停两个月后重启", at: "2026-07-01", status: "active" },
    { kind: "milestone", title: "第二季启动", at: "2026-07-01" },
  ]) {
    if (factOnce(db, { nodeId: beta, ...event })) created.events += 1;
  }

  console.log(`✔ 演示数据就绪（库：${config.dbPath}，锚点 ${DEMO_TIME}）`);
  console.log(`  新建 ${created.stages} 个阶段、${created.events} 条事件（已存在的跳过）`);
  console.log("");
  console.log("  预期效果：");
  console.log("    示例项目 Alpha → phases 应为 [\"v1.0 开发\", \"社区运营\"]（并列），阶段条 4 段");
  console.log("    示例项目 Beta  → phases 应为 [\"第二季\"]，且 4–6 月为空隙");
  console.log("    两个项目的公开事件数：Alpha 4 条（第 5 条是 internal，不该出现）、Beta 3 条");
  console.log("");
  console.log(`  现在可以：TAVERN_DB=${config.dbPath} TAVERN_PORT=9879 npm run dev`);
}

main();
