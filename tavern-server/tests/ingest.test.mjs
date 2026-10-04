import assert from "node:assert/strict";
import test from "node:test";

import { ZipError } from "../src/zip.mjs";
import { buildProject, foldProjectRoot, ingestZip, isPlatformJunk, normalizeFiles, projectContentHash } from "../src/ingest.mjs";
import { buildZip, textEntry } from "./helpers/zip-writer.mjs";

const MINIMAL = [
  "---",
  "template: 1",
  "name: 测试项目",
  "summary: 一个用于测试的项目",
  "tags: [UI, 展示实体]",
  "gameversion: [1.21.9]",
  "repo: someone/test",
  "---",
  "# 测试项目",
  "",
  "正文内容。",
].join("\n");

const png = (size = 64) => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(size, 7)]);

const withProject = (extra, mainText = MINIMAL) => buildZip([textEntry("project.md", mainText), ...extra]);

const codes = (errors) => errors.map((error) => error.code);

test("最小可用项目：解析成功且没有错误", () => {
  const zip = withProject([{ name: "assets/cover.png", data: png() }]);
  const result = ingestZip(zip);
  assert.deepEqual(result.errors, []);
  assert.equal(result.project.name, "测试项目");
  assert.equal(result.project.kind, "project");
  assert.deepEqual(result.project.tags, ["UI", "展示实体"]);
  assert.deepEqual(result.project.gameversion, ["1.21.9"]);
  assert.equal(result.project.cover, "assets/cover.png");
  assert.equal(result.project.i18n.zh.title, "测试项目");
  assert.equal(result.project.i18n.zh.body.trim(), "# 测试项目\n\n正文内容。");
  assert.equal(result.project.assets.length, 1);
  assert.match(result.project.assets[0].sha256, /^[0-9a-f]{64}$/);
  assert.equal(result.project.assets[0].mime, "image/png");
});

test("缺少 project.md 时给出可读错误，并列出实际顶层内容", () => {
  const zip = buildZip([textEntry("readme.txt", "hi")]);
  const { errors } = ingestZip(zip);
  assert.deepEqual(codes(errors), ["missing_project_md"]);
  assert.match(errors[0].message, /readme\.txt/);
});

test("缺少 frontmatter 时报错", () => {
  const zip = withProject([], "没有元数据块的正文");
  assert.ok(codes(ingestZip(zip).errors).includes("missing_frontmatter"));
});

test("平台垃圾被自动丢弃（不报错，只给提示）", () => {
  const zip = withProject([
    textEntry("__MACOSX/._project.md", "junk"),
    textEntry("assets/.DS_Store", "junk"),
    textEntry("Thumbs.db", "junk"),
    textEntry(".git/config", "junk"),
    { name: "assets/cover.png", data: png() },
  ]);
  const result = ingestZip(zip);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.droppedCount, 4);
  assert.ok(result.warnings.some((warning) => warning.code.startsWith("dropped_")));
});

test("多套一层的顶层目录会被折叠", () => {
  const zip = buildZip([
    textEntry("my-project/project.md", MINIMAL),
    { name: "my-project/assets/cover.png", data: png() },
  ]);
  const result = ingestZip(zip);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.foldedRoot, "my-project");
  assert.equal(result.project.cover, "assets/cover.png");
});

test("散文件时不折叠根目录", () => {
  const { foldedRoot } = foldProjectRoot([
    { path: "project.md", data: Buffer.from(""), size: 1 },
    { path: "assets/a.png", data: Buffer.from(""), size: 1 },
  ]);
  assert.equal(foldedRoot, null);
});

test("isPlatformJunk 判定", () => {
  assert.equal(isPlatformJunk("__MACOSX/x"), true);
  assert.equal(isPlatformJunk("a/b/.DS_Store"), true);
  assert.equal(isPlatformJunk("a/._x.png"), true);
  assert.equal(isPlatformJunk("node_modules/x.js"), true);
  assert.equal(isPlatformJunk("assets/cover.png"), false);
  assert.equal(isPlatformJunk("project.md"), false);
});

/* ───────── 校验：一次报全部问题 ───────── */

test("一次收集多个问题，而不是只报第一个", () => {
  const broken = [
    "---",
    "template: 9",          // 不支持的模板版本
    "kind: 乱七八糟",        // 非法 kind
    "summary: " + "很".repeat(200), // 过长
    "id: project:hack",     // 平台字段
    "---",
    "正文",
  ].join("\n");
  const { errors } = ingestZip(withProject([], broken));
  const found = codes(errors);
  assert.ok(found.includes("unsupported_template"), found.join(","));
  assert.ok(found.includes("bad_kind"));
  assert.ok(found.includes("summary_too_long"));
  assert.ok(found.includes("missing_name"));
  assert.ok(found.includes("platform_field"));
  assert.ok(errors.length >= 5, `应当一次报出至少 5 个问题，实际 ${errors.length}`);
});

test("赛事必须有时间窗，且 end 要晚于 start", () => {
  const noTime = ["---", "template: 1", "kind: event", "name: 秋季赛", "summary: 摘要", "---", "正文"].join("\n");
  assert.ok(codes(ingestZip(withProject([], noTime)).errors).includes("missing_time"));

  const badRange = ["---", "template: 1", "kind: event", "name: 秋季赛", "summary: 摘要", "time:", "  start: 2026-11-30", "  end: 2026-09-01", "---", "正文"].join("\n");
  assert.ok(codes(ingestZip(withProject([], badRange)).errors).includes("bad_time_range"));
});

test("不支持的素材类型被拒绝", () => {
  const zip = withProject([{ name: "assets/evil.exe", data: Buffer.from("MZ") }]);
  const { errors } = ingestZip(zip);
  assert.deepEqual(codes(errors), ["bad_asset_type"]);
  assert.match(errors[0].message, /evil\.exe/);
});

test("超大素材被拒绝", () => {
  const zip = withProject([{ name: "assets/big.png", data: Buffer.alloc(3 * 1024 * 1024, 1) }]);
  assert.ok(codes(ingestZip(zip).errors).includes("asset_too_large"));
});

test("frontmatter 指定的封面不存在时报错", () => {
  const withCover = MINIMAL.replace("repo: someone/test", "repo: someone/test\ncover: assets/nope.png");
  const { errors } = ingestZip(withProject([{ name: "assets/cover.png", data: png() }], withCover));
  assert.ok(codes(errors).includes("cover_missing"));
});

test("没有封面时只给提示，不报错", () => {
  const result = ingestZip(withProject([]));
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.code === "no_cover"));
});

test("标签去重：大小写不同视为同一个标签（保留首次写法）", () => {
  const duplicated = MINIMAL.replace("tags: [UI, 展示实体]", "tags: [UI, ui, 展示实体]");
  const result = ingestZip(withProject([], duplicated));
  assert.deepEqual(result.project.tags, ["UI", "展示实体"]);
  assert.ok(result.warnings.some((warning) => warning.code === "duplicate_tags"));
});

test("危险链接被拒绝", () => {
  const bad = MINIMAL.replace("repo: someone/test", "repo: someone/test\nlinks:\n  - label: x\n    url: javascript:alert(1)");
  assert.ok(codes(ingestZip(withProject([], bad)).errors).includes("unsafe_link"));
});

/* ───────── 语言变体 / 招募 / 关联 ───────── */

test("语言变体 project.en.md 被收进 i18n", () => {
  const english = ["---", "name: Test Project", "summary: A project for testing", "---", "English body."].join("\n");
  const zip = buildZip([
    textEntry("project.md", MINIMAL),
    textEntry("project.en.md", english),
    { name: "assets/cover.png", data: png() },
  ]);
  const { project, errors } = ingestZip(zip);
  assert.deepEqual(errors, []);
  assert.equal(project.i18n.en.title, "Test Project");
  assert.equal(project.i18n.en.body.trim(), "English body.");
  assert.equal(project.i18n.zh.title, "测试项目");
});

test("招募岗位被解析，缺 role 时报错", () => {
  const good = ["---", "role: 着色器", "skills: [GLSL, 后处理]", "headcount: 1", "---", "希望你能负责着色器部分。"].join("\n");
  const zip = withProject([textEntry("recruit/shader.md", good)]);
  const { project, errors } = ingestZip(zip);
  assert.deepEqual(errors, []);
  assert.equal(project.recruit.length, 1);
  assert.equal(project.recruit[0].role, "着色器");
  assert.deepEqual(project.recruit[0].skills, ["GLSL", "后处理"]);
  assert.equal(project.recruit[0].status, "open");
  assert.match(project.recruit[0].body, /着色器部分/);

  const bad = withProject([textEntry("recruit/x.md", "---\nheadcount: 2\n---\n正文")]);
  assert.ok(codes(ingestZip(bad).errors).includes("recruit_missing_role"));
});

test("relations.json 区分意图（requests）与弱关系（related/depends）", () => {
  const relations = JSON.stringify({
    requests: [{ rel: "includes", to: "event:autumn-jam-2026", note: "希望参赛" }],
    related: ["project:xiaodou-math"],
    depends: ["project:xiaodou-math"],
  });
  const zip = withProject([textEntry("relations.json", relations)]);
  const { project, errors } = ingestZip(zip);
  assert.deepEqual(errors, []);
  assert.deepEqual(project.relations.requests, [{ rel: "includes", to: "event:autumn-jam-2026", note: "希望参赛" }]);
  assert.deepEqual(project.relations.related, ["project:xiaodou-math"]);
  assert.deepEqual(project.relations.depends, ["project:xiaodou-math"]);
});

test("★ requests 只接受 includes：parent 等于要求把自己从看板上抹掉（§5.4.1）", () => {
  // 这条曾经是允许的，而且设计文档里的例子就是它。但 §5.4.1 把 parent 收窄成
  // 「组成」，而不变量 13 靠 parent 判断"是否独立条目"——于是 rel: parent 会让
  // 提交者的作品从看板消失（实测 219 → 218），而作者以为自己只是在报名参赛。
  const zip = withProject([textEntry("relations.json", JSON.stringify({
    requests: [{ rel: "parent", to: "event:autumn-jam-2026", note: "希望参赛" }],
  }))]);
  const { errors } = ingestZip(zip);
  assert.ok(codes(errors).includes("bad_request_rel"));
  // 报错必须说清楚该用什么，否则作者只会以为平台不支持参赛
  const message = errors.find((error) => error.code === "bad_request_rel").message;
  assert.match(message, /includes/);
  assert.match(message, /看板/);
});

test("relations.json 的目标必须是 kind:slug 形式", () => {
  const relations = JSON.stringify({ requests: [{ rel: "includes", to: "autumn-jam" }] });
  const zip = withProject([textEntry("relations.json", relations)]);
  assert.ok(codes(ingestZip(zip).errors).includes("bad_request_target"));
});

test("relations.json 不是合法 JSON 时报错", () => {
  const zip = withProject([textEntry("relations.json", "{ 这不是 json")]);
  assert.ok(codes(ingestZip(zip).errors).includes("bad_relations_json"));
});

/* ───────── 入口与哈希 ───────── */

test("非 zip 输入抛 ZipError（结构性错误不收集）", () => {
  assert.throws(() => ingestZip(Buffer.from("这不是 zip")), (error) => error instanceof ZipError && error.code === "not_a_zip");
});

test("路径穿越在摄取入口就被挡下（不会走到内容校验）", () => {
  const evil = buildZip([textEntry("../evil.txt", "pwned"), textEntry("project.md", MINIMAL)]);
  assert.throws(() => ingestZip(evil), (error) => error.code === "path_traversal");
});

test("内容哈希稳定且随内容变化", () => {
  const zip = withProject([{ name: "assets/cover.png", data: png() }]);
  const first = ingestZip(zip);
  const second = ingestZip(zip);
  assert.equal(projectContentHash(first.project, first.files), projectContentHash(second.project, second.files));

  const changed = ingestZip(withProject([{ name: "assets/cover.png", data: png(128) }]));
  assert.notEqual(projectContentHash(first.project, first.files), projectContentHash(changed.project, changed.files));
});

test("normalizeFiles 分别统计保留与丢弃", () => {
  const { kept, dropped } = normalizeFiles([
    { path: "project.md", data: Buffer.from("x"), size: 1 },
    { path: "a/._x", data: Buffer.from("x"), size: 1 },
    { path: "empty.txt", data: Buffer.from(""), size: 0 },
  ]);
  assert.equal(kept.length, 1);
  assert.deepEqual(dropped.map((item) => item.reason).sort(), ["empty_file", "platform_junk"]);
});

/* ───────── headcount 的类型（§6.5：number | "不限"） ───────── */

/* ───────── headcount 的类型（§6.5：number | "不限"） ───────── */

test("★ recruit.headcount 是数字，不限才留字符串（曾全被 YAML 子集变成字符串）", () => {
  // frontmatter 走 YAML 子集解析，所有标量都以字符串抵达 —— 于是
  // headcount: 3 会变成 "3"，而源码里那句 typeof === "number" 永远走不到。
  // 设计 §6.5 写的类型是 number | "不限"。
  const zip = withProject([
    textEntry("recruit/shader.md", "---\nrole: 着色器\nheadcount: 3\n---\n"),
    textEntry("recruit/art.md", "---\nrole: 美术\nheadcount: 不限\n---\n"),
    textEntry("recruit/qa.md", "---\nrole: 测试\n---\n"),
  ]);
  const { project, errors } = ingestZip(zip);
  assert.deepEqual(errors, []);

  const byRole = Object.fromEntries(project.recruit.map((entry) => [entry.role, entry.headcount]));
  assert.equal(byRole["着色器"], 3);
  assert.equal(typeof byRole["着色器"], "number");
  assert.equal(byRole["美术"], "不限", "数不清的保持字符串");
  assert.equal(byRole["测试"], null, "没写就是未定");
});
