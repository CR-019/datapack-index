import assert from "node:assert/strict";
import test from "node:test";

import { createRouter, safeDecode } from "../src/http.mjs";

test("safeDecode 不会因畸形百分号编码抛异常（曾导致整进程崩溃）", () => {
  assert.equal(safeDecode("%E4%B8%8D"), "不");
  // 这些都是非法编码，必须原样返回而不是抛出 URIError
  for (const bad of ["%E4%B8%8D%", "%", "%ZZ", "%E4%B8"]) {
    assert.doesNotThrow(() => safeDecode(bad));
    assert.equal(typeof safeDecode(bad), "string");
  }
});

test("路由匹配畸形编码的路径段时不抛异常", () => {
  const router = createRouter();
  router.get("/v1/nodes/:id", () => {});
  assert.doesNotThrow(() => router.match("GET", "/v1/nodes/%E4%B8%8D"));
  const matched = router.match("GET", "/v1/nodes/%E4%B8%8D");
  assert.equal(typeof matched.params.id, "string");
});

test("路径匹配但方法不符时返回 allowed 列表", () => {
  const router = createRouter();
  router.get("/v1/nodes", () => {});
  router.post("/v1/nodes", () => {});
  const matched = router.match("DELETE", "/v1/nodes");
  assert.deepEqual(matched.allowed.sort(), ["GET", "POST"]);
  assert.equal(matched.handler, undefined);
});

test("未注册的路径返回 null，参数被正确解码", () => {
  const router = createRouter();
  router.get("/v1/tags/:id/members", () => {});
  assert.equal(router.match("GET", "/v1/nope"), null);
  const matched = router.match("GET", "/v1/tags/tag%3Aui/members");
  assert.equal(matched.params.id, "tag:ui");
});
