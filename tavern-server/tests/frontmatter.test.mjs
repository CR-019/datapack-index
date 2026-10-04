import assert from "node:assert/strict";
import test from "node:test";

import { parseFrontmatter, parseScalar, parseYamlSubset } from "../src/frontmatter.mjs";

test("解析基本标量与内联数组", () => {
  const data = parseYamlSubset(["name: 测试项目", "tags: [UI, 展示实体]", "repo: Alumopper/Floating-UI"].join("\n"));
  assert.equal(data.name, "测试项目");
  assert.deepEqual(data.tags, ["UI", "展示实体"]);
  assert.equal(data.repo, "Alumopper/Floating-UI");
});

test("版本号必须保持字符串（否则 1.21.9 会变成 1.21）", () => {
  const data = parseYamlSubset(["version: 1.21.9", "gameversion: [1.21.9, 26.1]", "count: 007"].join("\n"));
  assert.equal(data.version, "1.21.9");
  assert.deepEqual(data.gameversion, ["1.21.9", "26.1"]);
  assert.equal(data.count, "007");
});

test("布尔与 null 被识别", () => {
  assert.equal(parseScalar("true"), true);
  assert.equal(parseScalar("false"), false);
  assert.equal(parseScalar("null"), null);
  assert.equal(parseScalar("~"), null);
  assert.equal(parseScalar("yes"), "yes", "yes 不应被当成布尔值");
});

test("引号被剥离", () => {
  const data = parseYamlSubset(['name: "带: 冒号的名字"', "tag: '单引号'"].join("\n"));
  assert.equal(data.name, "带: 冒号的名字");
  assert.equal(data.tag, "单引号");
});

test("块数组", () => {
  const data = parseYamlSubset(["tags:", "  - UI", "  - 展示实体"].join("\n"));
  assert.deepEqual(data.tags, ["UI", "展示实体"]);
});

test("嵌套映射（time）", () => {
  const data = parseYamlSubset(["time:", "  start: 2026-09-01", "  end: 2026-11-30", "  deadline: 2026-09-20"].join("\n"));
  assert.deepEqual(data.time, { start: "2026-09-01", end: "2026-11-30", deadline: "2026-09-20" });
});

test("数组里放映射（links）", () => {
  const data = parseYamlSubset([
    "links:",
    "  - label: 演示视频",
    "    url: https://example.com/v",
    "  - label: 文档",
    "    url: /index/绪论",
  ].join("\n"));
  assert.deepEqual(data.links, [
    { label: "演示视频", url: "https://example.com/v" },
    { label: "文档", url: "/index/绪论" },
  ]);
});

test("注释与空行被忽略", () => {
  const data = parseYamlSubset(["# 这是注释", "", "name: x", "  ", "summary: y"].join("\n"));
  assert.deepEqual(data, { name: "x", summary: "y" });
});

test("parseFrontmatter 拆出元数据与正文，且不影响正文里的 ---", () => {
  const { data, body, hasFrontmatter } = parseFrontmatter(["---", "template: 1", "name: 测试", "---", "# 标题", "", "--- 这是正文里的分隔线 ---"].join("\n"));
  assert.equal(hasFrontmatter, true);
  assert.equal(data.template, "1");
  assert.equal(data.name, "测试");
  assert.equal(body, ["# 标题", "", "--- 这是正文里的分隔线 ---"].join("\n"));
});

test("没有 frontmatter 时原样返回正文", () => {
  const { data, body, hasFrontmatter } = parseFrontmatter("只有正文");
  assert.equal(hasFrontmatter, false);
  assert.deepEqual(data, {});
  assert.equal(body, "只有正文");
});
