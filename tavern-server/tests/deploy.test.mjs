import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { SERVER_ROOT } from "../src/config.mjs";

/**
 * 部署产物的漂移检查。
 *
 * systemd 单元、反代配置、运维文档都是"手写的第二份真相"，最容易和代码悄悄对不上：
 * 改了环境变量名却忘了改单元文件，服务会带着默认值启动（而生产用默认胡椒会拒绝启动，
 * 但别的变量就没这么幸运了）。这个文件把这类漂移变成测试失败。
 */

const DEPLOY = path.resolve(SERVER_ROOT, "..", "deploy");

const readIfExists = (relative) => {
  const full = path.join(DEPLOY, relative);
  return fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null;
};

const unitFiles = ["systemd/tavern-api.service", "systemd/tavern-snapshot.service", "systemd/tavern-backup.service"];

test("部署目录齐全（单元 / 反代 / Caddy / 文档）", () => {
  for (const relative of [
    ...unitFiles,
    "systemd/tavern-snapshot.timer",
    "systemd/tavern-backup.timer",
    "nginx/tavern-api.conf",
    "caddy/Caddyfile.fragment",
    "README.md",
  ]) {
    assert.ok(readIfExists(relative), `缺少部署产物：deploy/${relative}`);
  }
});

test("★ 单元与文档里出现的每个 TAVERN_* 变量都被 config.mjs 真正读取（防改名漂移）", () => {
  const configSource = fs.readFileSync(path.join(SERVER_ROOT, "src", "config.mjs"), "utf8");
  const referenced = new Set();
  const sources = [
    ...unitFiles.map((file) => readIfExists(file)),
    readIfExists("README.md"),
  ].filter(Boolean);

  for (const source of sources) {
    for (const match of source.matchAll(/\bTAVERN_[A-Z_]+\b/g)) referenced.add(match[0]);
  }

  assert.ok(referenced.size >= 5, `应当在部署产物里看到多个 TAVERN_* 变量，实际 ${referenced.size}`);

  const unknown = [...referenced].filter((name) => !configSource.includes(name));
  assert.deepEqual(unknown, [], `部署产物引用了代码里不存在的变量（改名漂移？）：${unknown.join(", ")}`);

  // 反向：代码里读的关键变量必须在文档里交代过，否则部署者不知道要配
  for (const required of ["TAVERN_TOKEN_PEPPER", "TAVERN_TRUST_PROXY", "TAVERN_DB"]) {
    assert.ok(referenced.has(required), `部署文档没有交代 ${required}`);
  }
});

test("单元里的 ExecStart 指向真实存在的入口", () => {
  for (const file of unitFiles) {
    const unit = readIfExists(file);
    const exec = /^ExecStart=(.+)$/m.exec(unit);
    assert.ok(exec, `${file} 没有 ExecStart`);

    // 取 .mjs 结尾的 token，而不是"最后一个非选项参数" ——
    // 后者会把 `--out /var/.../x.json` 的值当成入口（踩过）
    const entries = exec[1].trim().split(/\s+/).filter((part) => part.endsWith(".mjs"));
    assert.equal(entries.length, 1, `${file} 的 ExecStart 应当恰好有一个 .mjs 入口，实际 ${entries.length} 个`);

    const full = path.join(SERVER_ROOT, entries[0]);
    assert.ok(fs.existsSync(full), `${file} 的 ExecStart 指向不存在的文件：${entries[0]}`);
  }
});

test("单元做了该做的加固与资源限制", () => {
  const api = readIfExists("systemd/tavern-api.service");
  for (const directive of [
    "NoNewPrivileges=true",
    "ProtectSystem=strict",
    "PrivateTmp=true",
    "ReadWritePaths=/var/lib/tavern-server",
    "MemoryMax=",
    "CPUQuota=",
    "EnvironmentFile=/etc/tavern/tavern.env",
    "Restart=always",
  ]) {
    assert.ok(api.includes(directive), `tavern-api.service 缺少 ${directive}（同机还有镜像站，不能裸跑）`);
  }
  // 数据目录必须可写，否则服务起不来（且报错会很难懂）
  assert.match(api, /ReadWritePaths=.*\/var\/lib\/tavern-server/);
});

test("定时器都带 Persistent=true（重启后补跑错过的时点）", () => {
  for (const file of ["systemd/tavern-snapshot.timer", "systemd/tavern-backup.timer"]) {
    const timer = readIfExists(file);
    assert.match(timer, /OnCalendar=/, `${file} 没有 OnCalendar`);
    assert.match(timer, /Persistent=true/, `${file} 缺少 Persistent=true`);
    assert.match(timer, /WantedBy=timers\.target/, `${file} 缺少 WantedBy=timers.target`);
  }
});

test("备份服务的目标是异地挂载点，不是数据目录本身", () => {
  const backup = readIfExists("systemd/tavern-backup.service");
  const dest = /--dest\s+(\S+)/.exec(backup);
  assert.ok(dest, "备份服务没有指定 --dest");
  assert.ok(!dest[1].startsWith("/var/lib/tavern-server"), "--dest 落在数据目录里 = 同盘备份，不防磁盘故障");
  assert.ok(backup.includes(dest[1]), "ReadWritePaths 必须包含备份目标，否则写不进去");
});

test("打包出的快照写到暂存区（代码目录是只读的）", () => {
  const snapshot = readIfExists("systemd/tavern-snapshot.service");
  const out = /--out\s+(\S+)/.exec(snapshot);
  assert.ok(out, "快照服务没有指定 --out");
  assert.ok(out[1].startsWith("/var/lib/tavern-server"), `快照应写到可写的数据目录，实际 ${out[1]}`);
  assert.ok(!out[1].startsWith("/opt/"), "不该往只读的代码目录里写");
});

test("Nginx 片段：大括号配平、上传上限够大、转发头齐全", () => {
  const nginx = readIfExists("nginx/tavern-api.conf");
  const opens = (nginx.match(/\{/g) ?? []).length;
  const closes = (nginx.match(/\}/g) ?? []).length;
  assert.equal(opens, closes, `Nginx 配置大括号不配平（${opens} vs ${closes}）`);

  const limit = /client_max_body_size\s+(\d+)m/.exec(nginx);
  assert.ok(limit, "没有设置 client_max_body_size —— 投稿会在到达 Node 前被 413 挡掉");
  assert.ok(Number(limit[1]) >= 25, `上传上限 ${limit[1]}m 太小（投稿 zip 上限 20MB）`);

  for (const header of ["X-Real-IP", "X-Forwarded-For", "X-Forwarded-Proto"]) {
    assert.ok(nginx.includes(header), `缺少 ${header} —— TRUST_PROXY 就失去意义`);
  }
  assert.match(nginx, /X-Robots-Tag/, "管理域不该被搜索引擎收录，要加 noindex");
  assert.match(nginx, /return 301 https/, "缺少 HTTP → HTTPS 跳转");
});

test("反代目标端口与代码默认端口一致（改端口时最易漏的一处）", () => {
  const configSource = fs.readFileSync(path.join(SERVER_ROOT, "src", "config.mjs"), "utf8");
  const defaultPort = /TAVERN_PORT\s*\?\?\s*(\d+)/.exec(configSource)?.[1];
  assert.ok(defaultPort, "config.mjs 里找不到默认端口");

  for (const file of ["nginx/tavern-api.conf", "caddy/Caddyfile.fragment"]) {
    const text = readIfExists(file);
    assert.ok(text.includes(`127.0.0.1:${defaultPort}`), `${file} 的反代目标端口与代码默认值（${defaultPort}）不一致`);
  }
});

test("Caddy 片段也设了上传上限与 noindex", () => {
  const caddy = readIfExists("caddy/Caddyfile.fragment");
  assert.match(caddy, /max_size\s+25MB/, "Caddy 也要放开上传体积");
  assert.match(caddy, /X-Robots-Tag/);
  const opens = (caddy.match(/\{/g) ?? []).length;
  const closes = (caddy.match(/\}/g) ?? []).length;
  assert.equal(opens, closes, "Caddy 片段大括号不配平");
});

test("运维文档同时覆盖了自检清单、TRUST_PROXY 的理由与恢复演练", () => {
  const readme = readIfExists("README.md");
  for (const marker of ["上线自检清单", "TAVERN_TRUST_PROXY=1", "恢复演练", "integrity_check", "--force"]) {
    assert.ok(readme.includes(marker), `部署文档缺少「${marker}」`);
  }
  assert.ok(readme.includes("/var/lib/tavern-server"), "文档里的数据目录要和单元文件一致");
});
