import assert from "node:assert/strict";
import test from "node:test";

import { DEV_PEPPER, assertSecureConfig } from "../src/config.mjs";

const STRONG = "K7fQ2mZx9Lp4Rt8Vw1Yb6Nc3Hs5Jd0Ga";

test("生产环境用默认胡椒 → 拒绝启动", () => {
  assert.throws(
    () => assertSecureConfig({ strict: true, bindHost: "127.0.0.1", pepperValue: DEV_PEPPER }),
    /拒绝启动/,
  );
});

test("胡椒过短 → 拒绝启动", () => {
  assert.throws(
    () => assertSecureConfig({ strict: true, bindHost: "127.0.0.1", pepperValue: "short" }),
    /太短/,
  );
});

test("绑定非回环地址却用默认胡椒 → 即使非生产也拒绝启动", () => {
  assert.throws(
    () => assertSecureConfig({ strict: false, bindHost: "0.0.0.0", pepperValue: DEV_PEPPER }),
    /非回环地址/,
  );
});

test("本地开发（回环 + 默认胡椒）→ 放行但会返回提醒", () => {
  const problems = assertSecureConfig({ strict: false, bindHost: "127.0.0.1", pepperValue: DEV_PEPPER });
  assert.equal(problems.length, 2);
});

test("强胡椒 → 任何情况下都放行", () => {
  assert.deepEqual(assertSecureConfig({ strict: true, bindHost: "0.0.0.0", pepperValue: STRONG }), []);
});
