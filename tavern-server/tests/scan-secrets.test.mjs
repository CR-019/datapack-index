import assert from "node:assert/strict";
import test from "node:test";

import { RULES, scanText } from "../src/scan-secrets.mjs";

// 注意：本文件里的"凭证"全是假值，但必须长得像真的才能验证规则有效。
// 凡是刻意为之的行都带 secret-scan:allow 豁免标记并写明理由 ——
// 这个标记只该用于这种场景，不要拿它掩盖真泄露。
test("能认出常见凭证形态", () => {
  const cases = [
    ["-----BEGIN RSA PRIVATE KEY-----", "private-key"], // secret-scan:allow 测试夹具（假值）
    ["ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "github-token"], // secret-scan:allow 测试夹具（假值）
    ["AKIAIOSFODNN7EXAMPL3", "aws-key"], // secret-scan:allow 测试夹具（假值）
    ['password = "hunter2hunter2hunter2hunter2"', "assigned-secret"], // secret-scan:allow 测试夹具（假值）
    ['auth_token: "Zx9Qw8Er7Ty6Ui5Op4As3Df2Gh1Jk0Lm"', "assigned-secret"], // secret-scan:allow 测试夹具（假值）
  ];
  for (const [text, rule] of cases) {
    // 扫描的是夹具文本本身（不含标记），用来断言规则确实会命中
    const hits = scanText(text, "sample.txt");
    assert.ok(hits.some((hit) => hit.rule === rule), `未命中 ${rule}：${text}`);
  }
});

test("行内豁免标记能放行刻意为之的凭证字样", () => {
  const marked = 'const api_key = "Zx9Qw8Er7Ty6Ui5Op4As3Df2Gh1Jk0Lm"; // secret-scan:allow 文档示例';
  // 对照行故意**不带**标记，所以拆成两段拼接：这样本文件自身不会被仓库级扫描
  // 判定为硬编码凭证，同时断言未标记的行仍然会命中。
  const unmarked = 'const password = ' + '"Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8Qr9St0Uv";';
  const hits = scanText([marked, unmarked].join("\n"), "x.mjs");
  assert.equal(hits.length, 1, "带标记的行应被放行，未标记的行仍应命中");
  assert.equal(hits[0].line, 2);
});

test("规则表里不含「开发默认胡椒」这类假规则（它匹配的串本身就在白名单里，永远不会触发）", () => {
  // 曾经的教训：规则匹配 dev-pepper-CHANGE-ME，而 CHANGE-ME 在 ALLOW 里 → 死代码。
  // 该字面量本就是公开占位符，"生产不许用"由 assertSecureConfig() 强制，不靠文本扫描。
  const text = 'const DEV_PEPPER = "dev-pepper-CHANGE-ME";';
  assert.deepEqual(scanText(text, "src/config.mjs"), []);
});

test("对我们自己的配置文件不误报", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const file = path.join(import.meta.dirname, "..", "src", "config.mjs");
  assert.deepEqual(scanText(fs.readFileSync(file, "utf8"), "src/config.mjs"), []);
});

test("占位符与示例文件不误报", () => {
  const safe = [
    ["TAVERN_TOKEN_PEPPER=your-token-here-CHANGE-ME", ".env.example"],
    ['password: "xxxxxxxxxxxxxxxxxxxxxxxx"', "README.md"],
    ['api_key = "example-key-000000000000"', "docs.md"],
  ];
  for (const [text, file] of safe) {
    assert.deepEqual(scanText(text, file), [], `误报：${text}`);
  }
});

test("返回行号与规则说明，便于定位", () => {
  const fixture = 'const apiKey = "Zx9Qw8Er7Ty6Ui5Op4As3Df2Gh1Jk0Lm";'; // secret-scan:allow 测试夹具（假值）
  const text = ["# 注释", "", fixture].join("\n");
  const hits = scanText(text, "x.mjs");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 3);
  assert.equal(hits[0].file, "x.mjs");
  assert.ok(hits[0].why.length > 0);
});

test("规则表没有重复 id", () => {
  const ids = RULES.map((rule) => rule.id);
  assert.equal(new Set(ids).size, ids.length);
});
