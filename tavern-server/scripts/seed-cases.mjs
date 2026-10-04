#!/usr/bin/env node
/**
 * 两个真实场景的走查夹具（赛事 + 作品），用来压数据模型而不是压功能点。
 *
 *   TAVERN_DB=data/cases.db npm run seed
 *   TAVERN_DB=data/cases.db npm run bootstrap -- --pin cases --name Cases --label 走查
 *   TAVERN_DB=data/cases.db npm run seed:cases
 *
 * 场景一「办一个比赛」：征稿 → 投稿（个人投稿 + 团队投稿）→ 评选 → 精选作品集
 * 场景二「发一个作品」：招募人员 → 成稿
 *
 * 之所以值得单独走一遍：先前的种子数据里 **0 个 event、0 个 index、0 个 team**，
 * 也就是说任务书里最"有时间轴"的三类东西从来没被真实数据压过。
 *
 * 这个脚本刻意**尽量走真实投稿管线**（ingestZip → saveSubmission → reviewRevision），
 * 凡是只能直接写库的地方都记进 GAP —— 那些就是"设计里有、实现里没有"的缺口清单。
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { config, nowIso } from "../src/config.mjs";
import { openDatabase, q } from "../src/db.mjs";
import { packDirectory } from "../src/archive.mjs";
import { ingestZip } from "../src/ingest.mjs";
import { reviewRevision, saveSubmission } from "../src/submissions.mjs";
import { appendFact } from "../src/events.mjs";
import { createStage } from "../src/stages.mjs";
import { applyConvergentChange } from "../src/changes.mjs";
import { findPublishedNode } from "../src/read-model.mjs";

const FORCE = process.argv.includes("--force");
const SCRATCH = path.join(import.meta.dirname, "..", "data", "cases");

/** 1×1 透明 PNG：素材内容不重要，但必须是真的图片字节 */
const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

const gaps = [];
const gap = (what, why) => gaps.push({ what, why });

function guard() {
  const name = (config.dbPath ?? "").split(/[\\/]/).pop();
  if (name === "tavern.db" && !FORCE) {
    console.error(
      [
        "✖ 拒绝把走查数据写进主库：" + config.dbPath,
        "",
        "  走查会造事件/索引/团队，主库混进这些会让 snapshot:check 失败，",
        "  而 public/tavern-snapshot.json 是要上线的离线兜底文件。",
        "",
        "  TAVERN_DB=data/cases.db npm run seed",
        "  TAVERN_DB=data/cases.db npm run bootstrap -- --pin cases --name Cases --label 走查",
        "  TAVERN_DB=data/cases.db npm run seed:cases",
      ].join("\n"),
    );
    process.exit(2);
  }
}

/* ───────────────── 走真实投稿管线 ───────────────── */

function writeFixture(name, { meta, body, extras = {} }) {
  const dir = path.join(SCRATCH, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });

  const lines = ["---"];
  for (const [key, value] of Object.entries(meta)) {
    if (value == null) continue;
    if (Array.isArray(value)) lines.push(`${key}: [${value.join(", ")}]`);
    else if (typeof value === "object") {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value)) lines.push(`  ${k}: ${v}`);
    } else lines.push(`${key}: ${value}`);
  }
  lines.push("---", "", body ?? "（正文）", "");
  fs.writeFileSync(path.join(dir, "project.md"), lines.join("\n"), "utf8");
  fs.writeFileSync(path.join(dir, "assets", "cover.png"), PNG_1PX);

  for (const [relative, content] of Object.entries(extras)) {
    const full = path.join(dir, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, "utf8");
  }

  const { buffer } = packDirectory(dir);
  return { dir, buffer, sha256: crypto.createHash("sha256").update(buffer).digest("hex") };
}

/** 投稿一条：zip → 校验 → 落一条 pending 修订 → 审核上架 */
function submit(db, { fixture, slug, reviewerId, approve = true }) {
  const { project, warnings, errors } = ingestZip(fixture.buffer);
  if (errors.length) {
    return { ok: false, errors: errors.map((e) => `${e.code}: ${e.message}`) };
  }
  const inboxPath = path.join(SCRATCH, "inbox", `${slug}.zip`);
  fs.mkdirSync(path.dirname(inboxPath), { recursive: true });
  fs.writeFileSync(inboxPath, fixture.buffer);

  const saved = saveSubmission(db, {
    accountId: reviewerId, project, slug, zipSha256: fixture.sha256, zipPath: inboxPath, warnings,
  });
  if (!approve) return { ok: true, saved, project, warnings };
  const reviewed = reviewRevision(db, { revisionId: saved.revisionId, action: "approve", reviewerId });
  return { ok: true, saved, reviewed, project, warnings };
}

/* ───────────────── 直接写库的那些（每一条都记 GAP） ───────────────── */

function insertNode(db, { id, kind, profile, reason }) {
  gap(`创建 ${kind} 节点（${id}）`, `没有公开的「新建条目」接口，只能直接写 nodes —— ${reason}`);
  const now = nowIso();
  q.run(db, "INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
    id, kind, JSON.stringify(profile), `seed_${id}_1`, now, now);
  q.run(db, "INSERT INTO revisions (id, node_id, snapshot_json, status, created_at) VALUES (?,?,?,'published',?)",
    `seed_${id}_1`, id, JSON.stringify(profile), now);
  return id;
}

function insertEdge(db, { from, rel, to, role = null, char = null, status = null, note = null, reason }) {
  gap(`创建边 ${from} -${rel}-> ${to}`, reason);
  q.run(db, "INSERT INTO edges (from_id, rel, to_id, role, char, status, note, created_at) VALUES (?,?,?,?,?,?,?,?)",
    from, rel, to, role, char, status, note, nowIso());
}

/* ───────────────── 场景一：办一个比赛 ───────────────── */

function caseOne(db, staffId, picks = {}) {
  const out = { steps: [] };

  // ① 赛事本身就是一条投稿：设计 §9.1 的 frontmatter 支持 kind: event + time
  const eventFixture = writeFixture("autumn-jam-2026", {
    meta: {
      template: 1, kind: "event", name: "2026 秋季创作赛",
      summary: "为期三个月的社区创作赛：征稿、投稿、评选、精选作品集",
      tags: ["赛事", "创作赛"],
      time: { start: "2026-09-01", end: "2026-12-31", deadline: "2026-10-15" },
    },
    body: "秋季创作赛正文。",
    // 评委岗位来自投稿（新增岗位属扩张型，不能走收敛型直通）
    extras: { "recruit/评委.md": "---\nrole: 评委\nheadcount: 3\nstatus: open\ndeadline: 2026-09-20\n---\n" },
  });
  const eventSlug = "autumn-jam-2026";
  const eventSubmit = submit(db, { fixture: eventFixture, slug: eventSlug, reviewerId: staffId });
  out.steps.push({ step: "① 提交赛事（kind: event）", ...pick(eventSubmit) });

  // ② 个人投稿：一个作者署名的作品，声明想参赛（requests.includes，§5.4.1）
  const soloFixture = writeFixture("jam-solo-entry", {
    meta: { template: 1, kind: "project", name: "参赛作品·独行", summary: "个人投稿的参赛作品", tags: ["赛事投稿"] },
    body: "个人投稿作品正文。",
    extras: {
      "relations.json": JSON.stringify({ requests: [{ rel: "includes", to: "event:autumn-jam-2026", note: "希望参赛" }] }, null, 2),
    },
  });
  const soloSubmit = submit(db, { fixture: soloFixture, slug: "jam-solo-entry", reviewerId: staffId });
  out.steps.push({ step: "② 个人投稿（带 requests.includes）", ...pick(soloSubmit) });

  // ③ 团队投稿：团队是 kind=team 的节点，成员用 member 边
  const teamId = insertNode(db, {
    id: "team:jam-squad", kind: "team",
    profile: { i18n: { zh: { title: "秋季小队" } }, members: [] },
    reason: "设计 §5.1.1 说团队是独立 kind，但没有任何接口能建团队",
  });
  for (const person of ["person:Alumopper", "person:Amber"]) {
    insertEdge(db, {
      from: teamId, rel: "member", to: person,
      reason: "设计 §5.1.1「团队 = 成员是人的集合」用 member 边表达，但没有创建边的接口",
    });
  }
  const teamFixture = writeFixture("jam-team-entry", {
    meta: { template: 1, kind: "project", name: "参赛作品·同行", summary: "团队投稿的参赛作品", tags: ["赛事投稿"] },
    body: "团队投稿作品正文。",
    extras: {
      "relations.json": JSON.stringify({ requests: [{ rel: "includes", to: "event:autumn-jam-2026", note: "希望参赛" }] }, null, 2),
    },
  });
  const teamSubmit = submit(db, { fixture: teamFixture, slug: "jam-team-entry", reviewerId: staffId });
  out.steps.push({ step: "③ 团队投稿", ...pick(teamSubmit) });

  // 署名边：`authored` 决定"谁是作者"，而投稿管线**不建这条边**
  for (const [from, to, char] of [
    ["person:Alumopper", "project:jam-solo-entry", "作者"],
    [teamId, "project:jam-team-entry", "团队"],
  ]) {
    insertEdge(db, {
      from, rel: "authored", to, char,
      reason: "投稿 profile 里没有 authors 字段、管线也不建 authored 边 —— 投完的作品在作者页上是隐身的（FR-14）",
    });
  }

  // ④ 赛事报名：投稿时声明了 requests.includes，但没有任何审核它的接口
  gap(
    "把参赛作品挂到赛事上（requests → 真实边）",
    "ingest 会解析并校验 relations.requests（rel 只接受 includes，见 §5.4.1），" +
    "submissions.mjs 明确忽略它、且没有「审核入集申请」的接口 —— 意图被解析完就丢在地上。" +
    "此处只能手工建边。关系用 `includes`（赛事 → 作品）：v1.11 起 `parent` 只表示组成，" +
    "照旧文档给参赛作品建 parent 边会让它从看板列表消失（走查还留了一条 CI 不变量专门拦这个）",
  );
  for (const entry of ["project:jam-solo-entry", "project:jam-team-entry"]) {
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, char, created_at) VALUES (?, 'includes', ?, NULL, ?)",
      "event:autumn-jam-2026", entry, nowIso());
  }

  // ⑤ 精选作品集：kind=index 同样可以是一条投稿（走真实管线，标签才会被物化）
  const picksFixture = writeFixture("jam-2026-picks", {
    meta: {
      template: 1, kind: "index", name: "2026 秋季创作赛·精选作品集",
      summary: "把本届入选作品编成一个集子", tags: ["精选"],
    },
    body: "精选作品集正文。",
  });
  const picksSubmit = submit(db, { fixture: picksFixture, slug: "jam-2026-picks", reviewerId: staffId });
  out.steps.push({ step: "⑤ 精选作品集（kind: index 走真实投稿）", ...pick(picksSubmit) });

  gap(
    "让索引收录成员（includes 边）",
    "索引收录成员靠 includes 边，但没有创建边的接口；" +
      "applyWeakRelations 只处理 related/depends，而 includes 只能出现在" +
      "relations.requests 里、又没有人审它",
  );
  for (const entry of ["project:jam-solo-entry", "project:jam-team-entry"]) {
    q.run(db, "INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('index:jam-2026-picks', 'includes', ?, ?)", entry, nowIso());
  }

  /* ⑥ 四个阶段（这一段全部走真实 API） */
  const stages = [
    ["征稿期", "2026-09-01", "2026-09-30", "公开征集，同步招募评委"],
    ["投稿期", "2026-10-01", "2026-10-15", "接受个人投稿与团队投稿"],
    ["评选期", "2026-10-16", "2026-11-15", "评委评审，公示结果"],
    ["精选作品集期", "2026-11-16", "2026-12-31", "编纂精选作品集"],
  ];
  for (const [name, start, end, summary] of stages) {
    createStage(db, { parentId: "event:autumn-jam-2026", actorId: staffId, name, start, end, summary });
  }
  out.steps.push({ step: "⑥ 四个阶段（真实 API）", note: "createStage ×4，直通生效" });

  /* ⑦ 事件流：一部分靠收敛型直通自动追写，一部分是里程碑 */
  //
  // ⚠️ 只记**已经发生**的事：`appendFact` 会拒绝未来时间点（future_event）。
  // "截稿 10-15""评选开始 10-16"在 now=2026-10-04 都还没发生——它们属于**阶段
  // 时间窗里的计划**，不属于事件流。这不是实现限制，是设计原则：事件是事实。
  // 下面故意试一次未来事件，把守卫本身也当成走查证据。
  out.futureEventGuard = (() => {
    try {
      appendFact(db, { nodeId: "event:autumn-jam-2026", kind: "milestone", title: "截稿", at: "2026-10-15", actorId: staffId });
      return "✗ 未被拒绝（守卫失效）";
    } catch (error) {
      return `✓ 被拒绝：${error.code}（${error.message}）`;
    }
  })();

  for (const [kind, title, at] of [
    ["milestone", "赛事启动", "2026-09-01"],
    ["milestone", "征稿开始", "2026-09-01"],
    ["milestone", "评委招募开放", "2026-09-05"],
  ]) {
    appendFact(db, { nodeId: "event:autumn-jam-2026", kind, title, at, actorId: staffId });
  }
  // 招募满员 = 收敛型修改（设计 §4.2 的"招满了直通"）
  const filled = applyConvergentChange(db, {
    nodeId: "event:autumn-jam-2026", actorId: staffId,
    patch: { recruit: [{ role: "评委", status: "filled" }] },
  });
  out.steps.push({ step: "⑦ 评委招满（收敛型直通）", changes: filled.changes, events: filled.events.map((e) => e.title) });

  /* ⑧ 一个"刚开赛、还没划分阶段"的赛事：当前阶段只能由时间窗派生
     —— 这是 `facets.time` 落在正确位置的活证据。它曾经被写在顶层 `time`，
     而 eventPhasesOf() 读 `node.facets?.time`，于是赛事相位派生从未生效。 */
  const plainFixture = writeFixture("winter-jam-2027", {
    meta: {
      template: 1, kind: "event", name: "2027 冬季创作赛（筹备中）",
      summary: "刚发布、还没划分阶段，当前阶段由时间窗派生",
      tags: ["赛事"],
      time: { start: "2026-09-15", end: "2027-03-31", deadline: "2026-11-30" },
    },
    body: "筹备中的赛事。",
  });
  const plainSubmit = submit(db, { fixture: plainFixture, slug: "winter-jam-2027", reviewerId: staffId });
  out.steps.push({ step: "⑧ 没有阶段的赛事（当前阶段靠时间窗派生）", ...pick(plainSubmit) });
  const plain = findPublishedNode(db, "event:winter-jam-2027");
  out.derivedPhase = plain?.facets?.phases ?? null;

  return out;
}

/* ───────────────── 场景二：发一个作品 ───────────────── */

function caseTwo(db, staffId) {
  const out = { steps: [] };

  // ① 作品本身 + 招募岗位（岗位来自 recruit/<岗位>.md，属扩张型 → 走投稿）
  const fixture = writeFixture("atlas", {
    meta: {
      template: 1, kind: "project", name: "地图册", summary: "把服务器坐标整理成可检索的地图册",
      tags: ["工具"], gameversion: "1.21.9", repo: "example/atlas",
    },
    body: "地图册正文。",
    extras: {
      "recruit/美术.md": "---\nrole: 美术\nskills: [像素画, UI]\nheadcount: 2\nstatus: open\ndeadline: 2026-10-31\n---\n负责封面与界面。\n",
      "recruit/测试.md": "---\nrole: 测试\nheadcount: 3\nstatus: open\n---\n",
    },
  });
  const submitted = submit(db, { fixture, slug: "atlas", reviewerId: staffId });
  out.steps.push({ step: "① 投稿作品（带两个招募岗位）", ...pick(submitted) });
  insertEdge(db, {
    from: "person:Alumopper", rel: "authored", to: "project:atlas", char: "作者",
    reason: "同上：投稿管线不建 authored 边，作品在作者页上隐身",
  });

  // ② 两个阶段：招募人员 → 成稿
  const stages = [
    ["招募人员", "2026-09-01", "2026-10-31", "凑齐美术与测试"],
    ["成稿", "2026-11-01", "2027-03-31", "完善正文与素材，准备上架"],
  ];
  for (const [name, start, end, summary] of stages) {
    createStage(db, { parentId: "project:atlas", actorId: staffId, name, start, end, summary });
  }
  out.steps.push({ step: "② 两个阶段（真实 API）", note: "createStage ×2" });

  // ③ 阶段自己的招募：设计 §4.2 说阶段可以有自己的招募（「v2 阶段招美术」），
  //    但 createStage 的 profile 写死 recruit: []，接口也不收 recruit 参数
  const recruitStage = q.get(
    db,
    `SELECT n.id FROM nodes n JOIN edges e ON e.from_id = n.id AND e.rel = 'parent'
     WHERE e.to_id = 'project:atlas' AND n.kind = 'stage' AND json_extract(n.profile_json, '$.name') = '招募人员'`,
  );
  gap(
    "让「招募人员」阶段自带招募岗位",
    "createStage 的 profile 写死 recruit: []，接口也不收 recruit 参数；" +
      "而设计 §4.2 明确说阶段可以有自己的招募。于是阶段的招募既建不了、" +
      "也改不了（收敛型接口只认同名岗位，会回 role_not_found）",
  );
  void recruitStage;

  // ④ 招募招满：这是收敛型修改的标准场景
  const filled = applyConvergentChange(db, {
    nodeId: "project:atlas", actorId: staffId,
    patch: { recruit: [{ role: "美术", status: "filled" }] },
  });
  out.steps.push({ step: "④ 美术招满（收敛型直通）", changes: filled.changes, events: filled.events.map((e) => e.title) });

  for (const [kind, title, at] of [
    ["milestone", "立项", "2026-09-01"],
    ["recruit", "开始招募", "2026-09-01"],
    ["milestone", "第一位美术加入", "2026-09-20"],
  ]) {
    appendFact(db, { nodeId: "project:atlas", kind, title, at, actorId: staffId });
  }

  return out;
}

const pick = (result) => (result.ok
  ? { ok: true, nodeId: result.saved?.nodeId, revisionId: result.saved?.revisionId, status: result.reviewed?.status ?? "pending", warnings: result.warnings?.length ?? 0 }
  : { ok: false, errors: result.errors });

/* ───────────────── 主流程 ───────────────── */

function main() {
  guard();
  const db = openDatabase(config.dbPath);

  const staff = q.get(db, "SELECT id FROM accounts WHERE role = 'staff' LIMIT 1");
  if (!staff) {
    console.error("✖ 库里没有 staff 账号。先跑：npm run bootstrap -- --pin cases --name Cases --label 走查");
    process.exit(2);
  }

  console.log("═══ 场景一：办一个比赛（征稿 → 投稿 → 评选 → 精选作品集）═══");
  const one = caseOne(db, staff.id);
  for (const step of one.steps) console.log("  ·", step.step, JSON.stringify(step.ok === undefined ? step : { ok: step.ok, nodeId: step.nodeId, status: step.status, errors: step.errors }));
  if (one.futureEventGuard) console.log("  · 未来事件守卫：", one.futureEventGuard);
  if (one.derivedPhase) console.log("  · 无阶段赛事的当前阶段（靠 facets.time 派生）：", JSON.stringify(one.derivedPhase));

  console.log("\n═══ 场景二：发一个作品（招募人员 → 成稿）═══");
  const two = caseTwo(db, staff.id);
  for (const step of two.steps) console.log("  ·", step.step, JSON.stringify(step.ok === undefined ? step : { ok: step.ok, nodeId: step.nodeId, status: step.status, errors: step.errors }));

  console.log("\n═══ 缺口清单（设计里有、实现里没有）═══");
  const byReason = new Map();
  for (const entry of gaps) {
    const key = entry.why;
    if (!byReason.has(key)) byReason.set(key, []);
    byReason.get(key).push(entry.what);
  }
  let index = 1;
  for (const [why, whats] of byReason) {
    console.log(`  ${index}. ${why}`);
    for (const what of whats) console.log(`       · ${what}`);
    index += 1;
  }
  console.log(`\n  共 ${gaps.length} 处只能直接写库（合并同类后 ${byReason.size} 类）`);
}

main();
