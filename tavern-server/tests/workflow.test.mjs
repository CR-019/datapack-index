import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { SERVER_ROOT } from "../src/config.mjs";

/**
 * 工作流的漂移检查。
 *
 * 起因是一个真洞：酒馆前端有自己的 Vue 组件，但改了 `.vitepress/vue/tavern/**`
 * 时**没有任何工作流会构建站点**——`verify-tavern.yml` 只跑后端测试，
 * `verify-wheel-api.yml` 的 paths 不含酒馆，`deploy.yml` 只在 master push 时跑。
 * 结果是写坏的组件能通过全部 PR 门禁，等合并后部署才炸。
 *
 * 工作流的 `paths` 同样是"手写的第二份真相"：加了一个源文件目录却忘了加进
 * paths，门禁就静默失效了——不会报错，只是不再拦人。所以把它变成测试。
 */

const WORKFLOW_DIR = path.resolve(SERVER_ROOT, "..", ".github", "workflows");

const readWorkflow = (name) => {
  const full = path.join(WORKFLOW_DIR, name);
  assert.ok(fs.existsSync(full), `工作流不存在：${name}`);
  return fs.readFileSync(full, "utf8");
};

test("酒馆前端改动必须触发一次真正的站点构建（否则坏组件要到部署才被发现）", () => {
  const workflow = readWorkflow("verify-tavern.yml");

  // 触发路径要覆盖酒馆的三个源：组件、页面、离线快照
  for (const glob of [".vitepress/vue/tavern/**", "tavern/**", "public/tavern-snapshot.json"]) {
    assert.ok(workflow.includes(glob), `verify-tavern.yml 的 paths 缺少 ${glob}`);
  }

  // 而且必须真的构建，不能只跑后端测试
  assert.match(workflow, /vitepress build/, "verify-tavern.yml 需要一个真的构建站点的 job");
});

test("离线兜底文件必须验证真的进了构建产物", () => {
  const workflow = readWorkflow("verify-tavern.yml");

  // "文件躺在 public/ 里"和"它被发布出去了"是两件事；前端连不上后端时
  // 全靠这份快照，所以要有一步去产物里确认它存在且非空。
  assert.match(
    workflow,
    /test -s .*tavern-snapshot\.json/,
    "需要一步断言 .vitepress/dist/tavern-snapshot.json 存在且非空",
  );
});

test("酒馆后端工作流保持零依赖（不引入 pnpm install 到后端 job）", () => {
  const workflow = readWorkflow("verify-tavern.yml");
  const backendJob = workflow.slice(workflow.indexOf("jobs:"), workflow.indexOf("build-site:"));

  // 后端是零运行时依赖的，装依赖那一步本身就是风险面。前端 job 需要 pnpm
  // 是没办法（VitePress 是 devDependency），但后端 job 不该被顺手带上。
  assert.ok(!backendJob.includes("pnpm install"), "后端 job 不该需要安装依赖");
  assert.match(backendJob, /npm test/);
  assert.match(backendJob, /snapshot:check/);
});
