/**
 * E2E 走查 · 用例运行器
 * =============================================================================
 *   npm run e2e                 跑全部**后端**用例（不起浏览器，CI 可跑）
 *   npm run e2e -- --browser    连浏览器用例一起跑（需要先构建站点）
 *   npm run e2e -- --only submit      只跑名字里含 "submit" 的用例
 *   npm run e2e -- --list       只列用例
 *
 * 每个用例一个**独立环境**（独立夹具库 + 独立端口 + 独立服务进程），所以用例之间
 * 可以随便往库里塞诱饵、互相不污染；失败也不会拖累后面的用例。
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromePath, createEnv } from "./harness.mjs";

const CASES_DIR = path.join(import.meta.dirname, "cases");
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const withBrowser = args.includes("--browser");
const listOnly = args.includes("--list");

const files = fs.readdirSync(CASES_DIR).filter((file) => file.endsWith(".mjs")).sort();
const cases = [];
for (const file of files) {
	const module = await import(pathToFileURL(path.join(CASES_DIR, file)).href);
	const entry = module.default;
	if (!entry || typeof entry.run !== "function") continue;
	cases.push({ file, ...entry });
}

const selected = only ? cases.filter((entry) => `${entry.title} ${entry.file}`.toLowerCase().includes(only.toLowerCase())) : cases;

if (listOnly) {
	for (const entry of selected) {
		const tag = entry.browser ? " [browser]" : "";
		console.log(`  ${entry.file}${tag}  ${entry.title}`);
	}
	process.exit(0);
}

// `--only` 拼错 = 一条都没选中。那看起来和"全绿"一模一样，所以必须当场失败。
if (!selected.length) {
	console.error(`✖ --only「${only}」没匹配到任何用例（可用 --list 看名字）`);
	process.exit(1);
}

console.log(`E2E 走查：${selected.length} 条用例${withBrowser ? "（含浏览器）" : "（仅后端）"}`);
if (withBrowser && !chromePath()) console.log("  ⚠ 没找到 Chrome/Edge —— 浏览器用例会跳过");

let pass = 0;
let fail = 0;
let skipped = 0;
const failures = [];

for (const entry of selected) {
	const needsBrowser = Boolean(entry.browser);
	if (needsBrowser && !withBrowser) {
		console.log(`\n● ${entry.title}\n  ⏭ 跳过（需要 --browser）`);
		skipped += 1;
		continue;
	}
	console.log(`\n● ${entry.title}   [${entry.file}]`);

	/*
	 * `--browser` 与 `browser: true` 是两件事，别混：
	 *   · `--browser`      = "把浏览器夹具端上来"（站点静态 + /v1 反代 + CDP 可用）
	 *   · `browser: true`  = "这条用例**非**浏览器不可"（没有就整条跳过）
	 * 分开的理由是 03 这类用例**同时**有接口层与页面层：没有浏览器时接口层照样得跑，
	 * 有浏览器时页面层必须真跑。曾经这里只按 `entry.browser` 传，于是 03 在
	 * `--browser` 下也拿不到夹具 —— 页面层被静默跳过，还记了一条"通过"。
	 */
	let env = null;
	try {
		// createEnv 也放进 try：夹具/服务起不来只该让**这一条**失败，
		// 而不是让整轮在这里断掉、后面的用例一条都不跑（文件头承诺过要隔离）。
		env = await createEnv({ ...(entry.env ?? {}), browser: withBrowser || Boolean(entry.browser || entry.env?.browser) });
		if (needsBrowser && env.browser?.skipped) {
			// 缺构建产物 / 缺浏览器：这条**没跑**。记成跳过并显示出来 —— 静默消失等于假绿。
			console.log(`  ⏭ 跳过：${env.browser.skipped}`);
			skipped += 1;
			await env.dispose();
			env = null;
			continue;
		}
		await entry.run(env);
	} catch (error) {
		if (!env) {
			console.error(`  ✖ 用例环境起不来：${error && error.message}`);
			fail += 1;
			failures.push(entry.title);
			continue;
		}
		env.check(false, `用例抛异常：${error && error.message}`);
		console.error(error);
	} finally {
		if (env) await env.dispose();
	}

	for (const line of env.results.lines) {
		if (line.step) console.log(`  ── ${line.step}`);
		else if (line.skip) console.log(`  ⏭ ${line.label}${line.extra ? ` — ${line.extra}` : ""}`);
		else console.log(`  ${line.ok ? "✔" : "✖"} ${line.label}${line.extra ? ` — ${line.extra}` : ""}`);
	}
	pass += env.results.pass;
	fail += env.results.fail;
	skipped += env.results.skipped;
	if (env.results.fail) failures.push(entry.title);
}

// 跳过的段单独报数：跳过不是通过。把"没跑"记成"通过"，正是假绿的来源。
console.log(`\n${fail ? "✖" : "✔"} 断言：${pass} 通过 / ${fail} 失败${skipped ? ` / ${skipped} 跳过` : ""}`);
if (failures.length) console.log(`  失败用例：${failures.join("、")}`);
process.exit(fail ? 1 : 0);
