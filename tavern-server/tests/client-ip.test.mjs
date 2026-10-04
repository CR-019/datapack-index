import assert from "node:assert/strict";
import test from "node:test";

import { clientIp } from "../src/http.mjs";

const fakeRequest = (headers = {}, socketAddress = "203.0.113.9") => ({
  headers,
  socket: { remoteAddress: socketAddress },
});

test("默认不采信 X-Forwarded-For（直连时它可以被伪造）", () => {
  const req = fakeRequest({ "x-forwarded-for": "1.2.3.4" });
  assert.equal(clientIp(req, { trustProxy: false }), "203.0.113.9");
});

test("配置了可信反代时取 X-Forwarded-For 最左边的地址", () => {
  const req = fakeRequest({ "x-forwarded-for": "1.2.3.4, 10.0.0.1, 10.0.0.2" });
  assert.equal(clientIp(req, { trustProxy: true }), "1.2.3.4");
});

test("可信反代下回退到 X-Real-IP，再回退到 socket", () => {
  assert.equal(clientIp(fakeRequest({ "x-real-ip": "5.6.7.8" }), { trustProxy: true }), "5.6.7.8");
  assert.equal(clientIp(fakeRequest({}), { trustProxy: true }), "203.0.113.9");
});

test("空白的转发头被忽略，不会变成空字符串键", () => {
  const req = fakeRequest({ "x-forwarded-for": "   ", "x-real-ip": "" });
  assert.equal(clientIp(req, { trustProxy: true }), "203.0.113.9");
});

test("没有 socket 时不抛异常", () => {
  assert.equal(clientIp({ headers: {} }, { trustProxy: true }), "unknown");
});

test("★ 反代场景下不同作者必须拿到不同限流键（否则可被锁死）", () => {
  // 没有 trustProxy 时：所有请求都来自代理 IP，键退化成"只有 pin"，
  // 攻击者故意失败 5 次就能锁住某个作者。
  const viaProxy = (forwarded) => fakeRequest({ "x-forwarded-for": forwarded }, "127.0.0.1");

  const keyWithout = (forwarded, pin) => `${pin}|${clientIp(viaProxy(forwarded), { trustProxy: false })}`;
  const keyWith = (forwarded, pin) => `${pin}|${clientIp(viaProxy(forwarded), { trustProxy: true })}`;

  assert.equal(keyWithout("198.51.100.1", "alice"), keyWithout("198.51.100.2", "alice"), "这正是漏洞");
  assert.notEqual(keyWith("198.51.100.1", "alice"), keyWith("198.51.100.2", "alice"), "采信转发头后键才区分得开");
});
