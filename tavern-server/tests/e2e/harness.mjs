/**
 * E2E 走查 · 公共底座
 * =============================================================================
 * 一条 case 需要的东西，这里一次给全：
 *   · 一份**可随意破坏的夹具库**（从 data/cases.db 复制，绝不碰真库）
 *   · 三个主体：工作组 / 作者本人 / 另一位作者（越权用例必须用独立账号）
 *   · 起一个真服务（子进程），全程走真实 HTTP —— 测的是路由 + 鉴权 + 存储的合体
 *   · 可选的浏览器夹具：自己起静态服务 + 把 /v1 反代到本条 case 的服务，
 *     于是**同源**成立、cookie 可用（生产上作者中心也必须与 API 同源，见设计 §7.7）
 *
 * 设计取舍：
 *   · 每个 case 一个独立环境（独立库、独立端口），互不污染 —— 所以可以放心发射饵。
 *   · 浏览器用例默认跳过：它需要先构建站点（~/2 分钟）。加 --browser 才跑。
 */

import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";

export const SERVER_ROOT = path.resolve(import.meta.dirname, "..", "..");
export const REPO_ROOT = path.resolve(SERVER_ROOT, "..");
const DIST = path.join(REPO_ROOT, ".vitepress", "dist");
const TMP = path.join(SERVER_ROOT, "tests", "e2e", ".tmp");

const PEPPER = (() => {
	const envPath = path.join(SERVER_ROOT, ".env");
	if (fs.existsSync(envPath)) {
		const match = fs.readFileSync(envPath, "utf8").match(/TAVERN_TOKEN_PEPPER=(.+)/);
		if (match) return match[1].trim();
	}
	return process.env.TAVERN_TOKEN_PEPPER ?? "dev-pepper-CHANGE-ME";
})();

const tokenHash = (token) => crypto.createHash("sha256").update(`${token}${PEPPER}`).digest("hex");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 找一个空闲端口（避免多个 case 撞车）。 */
async function freePort() {
	return new Promise((resolve, reject) => {
		const probe = http.createServer();
		probe.listen(0, "127.0.0.1", () => {
			const { port } = probe.address();
			probe.close(() => resolve(port));
		});
		probe.on("error", reject);
	});
}

const MIME = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

/**
 * 站点静态服务 + `/v1` 反代。
 * 反代是为了让**浏览器里同源成立** —— 只有这样 cookie 才会被带上，
 * 也才测得出"会话 + 上传 + 审核"这条真正依赖同源的链路。
 */
function startSiteProxy({ distDir, apiPort, port }) {
	const server = http.createServer((req, res) => {
		const url = new URL(req.url, "http://127.0.0.1");
		if (url.pathname.startsWith("/v1/")) {
			const upstream = http.request({
				host: "127.0.0.1", port: apiPort, path: req.url, method: req.method, headers: req.headers,
			}, (upstreamRes) => {
				res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
				upstreamRes.pipe(res);
			});
			upstream.on("error", () => res.writeHead(502).end("bad gateway"));
			req.pipe(upstream);
			return;
		}
		const rel = url.pathname.replace(/^\/datapack-index/, "");
		const candidates = rel.endsWith("/")
			? [path.join(distDir, rel, "index.html")]
			: [path.join(distDir, rel), path.join(distDir, `${rel}.html`), path.join(distDir, rel, "index.html")];
		for (const candidate of candidates) {
			if (!candidate.startsWith(distDir)) continue;
			if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
				res.writeHead(200, { "content-type": MIME[path.extname(candidate)] ?? "application/octet-stream" });
				res.end(fs.readFileSync(candidate));
				return;
			}
		}
		res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end(`404 ${rel}`);
	});
	return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

/* ───────────────────────── 夹具库 ───────────────────────── */

/**
 * 夹具源库（`data/cases.db` / `data/tavern.db`）—— 没有就**现造**。
 *
 * ⚠️ `data/` 是 gitignore 的运行时目录：干净检出（CI、新克隆、换台机器）里它**不存在**。
 * 于是"源库缺失"不是配置错误，而是"夹具还没造过"。这里按 `scripts/seed-cases.mjs`
 * 头部记的三步造一份，与本地手工走的完全同一条管线：
 *
 *     seed → bootstrap --pin cases → seed:cases
 *
 * 两个刻意的选择：
 *   · **不写 `data/`**：那是人手上的走查库（本地开发常用，甚至正被服务占着），
 *     测试凭什么覆盖它？造在 `.tmp/fixture/` 里，随便破坏、随便删。
 *   · **不在 CI 里加"准备夹具"的步骤**：那样 `npm run e2e` 就只在 CI 里能跑，
 *     而一条测试命令的第一条契约是"拿到干净检出就能跑"。
 *
 * 夹具比 `src/` / `scripts/` / `migrations/` 旧就重造 —— 免得改完 ingest
 * 还在拿昨天的夹具跑（那时红的是测试，坏的是夹具，排查方向全错）。
 */
function newestSourceMtime() {
	let newest = 0;
	const walk = (dir) => {
		let entries;
		try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else newest = Math.max(newest, fs.statSync(full).mtimeMs);
		}
	};
	for (const dir of ["src", "scripts", "migrations"]) walk(path.join(SERVER_ROOT, dir));
	return newest;
}

function ensureFixtureSource(name) {
	const source = path.join(SERVER_ROOT, "data", `${name}.db`);
	if (fs.existsSync(source)) return source;

	const staged = path.join(TMP, "fixture", `${name}.db`);
	if (fs.existsSync(staged) && fs.statSync(staged).mtimeMs >= newestSourceMtime()) return staged;

	fs.rmSync(staged, { force: true });
	fs.mkdirSync(path.dirname(staged), { recursive: true });
	const steps = [["scripts/seed.mjs", []]];
	if (name === "cases") {
		steps.push(
			["scripts/bootstrap.mjs", ["--pin", "cases", "--name", "Cases", "--label", "e2e 夹具"]],
			["scripts/seed-cases.mjs", []],
		);
	}
	for (const [script, args] of steps) {
		const result = spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", script, ...args], {
			cwd: SERVER_ROOT,
			env: { ...process.env, TAVERN_DB: staged },
			encoding: "utf8",
		});
		if (result.status !== 0) {
			throw new Error(
				`造 E2E 夹具库失败：${script} 退出码 ${result.status}\n` +
				`${result.stdout ?? ""}${result.stderr ?? ""}`,
			);
		}
	}
	return staged;
}

function prepareDatabase(source) {
	fs.mkdirSync(TMP, { recursive: true });
	const dbPath = path.join(TMP, `e2e-${crypto.randomBytes(4).toString("hex")}.db`);
	const src = new DatabaseSync(source, { readOnly: true });
	src.exec(`VACUUM INTO '${dbPath.replace(/\\/g, "/")}'`);
	src.close();
	return dbPath;
}

/** 给夹具库装上三个主体 + 各自的令牌，返回明文令牌与 pin（明文只在这里存在）。 */
function installPrincipals(dbPath, { staffNode = null, authorNode = "person:Alumopper", otherNode = "person:Amber" } = {}) {
	const db = new DatabaseSync(dbPath);
	const now = new Date().toISOString();
	const existingStaff = db.prepare("SELECT id, pin FROM accounts WHERE role = 'staff' LIMIT 1").get();
	const principals = {};
	const tokens = {};
	const pins = {};

	const plan = [
		["staff", existingStaff?.id ?? staffNode ?? "person:Cases", "staff", existingStaff?.pin ?? "e2e-staff"],
		["author", authorNode, "author", "e2e-author"],
		["other", otherNode, "author", "e2e-other"],
	];
	for (const [key, accountId, role, fallbackPin] of plan) {
		const node = db.prepare("SELECT id FROM nodes WHERE id = ?").get(accountId);
		if (!node) throw new Error(`夹具库缺少主体节点：${accountId}`);
		const account = db.prepare("SELECT id, pin, role FROM accounts WHERE id = ?").get(accountId);
		const pin = account?.pin ?? fallbackPin;
		if (!account) {
			db.prepare("INSERT INTO accounts (id, pin, role, status, created_at) VALUES (?,?,?,?,?)")
				.run(accountId, pin, role, "active", now);
		}
		const token = crypto.randomBytes(20).toString("hex");
		db.prepare("INSERT INTO tokens (id, account_id, label, hash, created_at) VALUES (?,?,?,?,?)")
			.run(`tok_e2e_${key}_${crypto.randomBytes(3).toString("hex")}`, accountId, `e2e ${key}`, tokenHash(token), now);
		principals[key] = { id: accountId, pin, role: db.prepare("SELECT role FROM accounts WHERE pin = ?").get(pin).role };
		tokens[key] = token;
		pins[key] = pin;
	}
	db.close();
	return { principals, tokens, pins };
}

/**
 * 注入"本不该出现在公开面"的诱饵（可见性用例专用）。
 * 返回诱饵字符串清单，供断言使用。
 */
export function injectLeaks(dbPath, { nodeId = "project:secret-draft" } = {}) {
	const db = new DatabaseSync(dbPath);
	const now = new Date().toISOString();
	const event = "event:autumn-jam-2026";
	const atlas = "project:atlas";

	db.prepare("INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?,?,?,NULL,?,?)")
		.run(nodeId, "project", JSON.stringify({
			i18n: { zh: { title: "秘密草稿项目", summary: "未上架，公开面绝不该看到它" } },
			tags: ["机密标签"],
			facets: { state: "draft", phases: [], time: { start: "2026-09-01", end: "2026-12-31" } },
			recruit: [{ role: "秘密岗位", status: "open", headcount: 1 }],
		}), now, now);
	// 待审修订：改了标题，公开面必须仍显示旧版
	const atlasRow = db.prepare("SELECT published_revision_id, profile_json FROM nodes WHERE id = ?").get(atlas);
	const pending = JSON.parse(atlasRow.profile_json);
	pending.i18n.zh.title = "秘密新标题（未审）";
	db.prepare("INSERT INTO revisions (id, node_id, base_revision_id, snapshot_json, status, created_at) VALUES (?,?,?,?, 'pending', ?)")
		.run("perm_pending_1", atlas, atlasRow.published_revision_id, JSON.stringify(pending), now);
	// 内部事件
	db.prepare("INSERT INTO node_events (id, node_id, kind, at, title, body, source, visibility, created_at) VALUES (?,?, 'note', ?,?,?, 'manual', 'internal', ?)")
		.run("perm_internal_1", atlas, "2026-10-03", "内部：秘密事件不该出现", "内部正文：也不该出现", now);
	// 未上架阶段
	db.prepare("INSERT INTO nodes (id, kind, profile_json, published_revision_id, created_at, updated_at) VALUES (?, 'stage', ?, NULL, ?, ?)")
		.run("stage:autumn-jam-2026-permsecret", JSON.stringify({
			name: "秘密阶段", i18n: { zh: { title: "秘密阶段" } },
			facets: { time: { start: "2026-10-01", end: "2026-10-31" }, state: "active" }, recruit: [],
		}), now, now);
	db.prepare("INSERT INTO edges (from_id, rel, to_id, created_at) VALUES ('stage:autumn-jam-2026-permsecret', 'parent', ?, ?)").run(event, now);
	// 指向未上架条目的边（收录 + 关联）—— 前端最容易在这里漏 id
	db.prepare("INSERT INTO edges (from_id, rel, to_id, created_at) VALUES (?, 'includes', ?, ?)").run(event, nodeId, now);
	db.prepare("INSERT INTO edges (from_id, rel, to_id, created_at) VALUES (?, 'related', ?, ?)").run(atlas, nodeId, now);
	db.close();
	return {
		nodeId,
		/*
		 * ⚠️ 诱饵串要**两个方向都覆盖**：`includes` / `related` 是出边（event → 未上架条目），
		 * 而那条 `parent` 边（未上架阶段 → 赛事）只在**入边**方向出现 —— 它的 id 片段
		 * `permsecret` 必须在这里，否则"只堵出边、漏了入边"这种半修状态全绿通过
		 * （实测过：只删掉 read-model 的 incoming 过滤，诱饵串一个都不命中）。
		 */
		strings: ["秘密草稿项目", "秘密新标题", "内部：秘密事件不该出现", "内部正文：也不该出现", "秘密阶段", "机密标签", "秘密岗位", "secret-draft", "permsecret"],
	};
}

/* ───────────────────────── 环境 ───────────────────────── */

export async function createEnv({ useCases = true, browser = false, injections = null } = {}) {
	const source = ensureFixtureSource(useCases ? "cases" : "tavern");
	const dbPath = prepareDatabase(source);
	const { principals, tokens, pins } = installPrincipals(dbPath);
	const leaks = injections === "leaks" ? injectLeaks(dbPath) : null;

	const apiPort = await freePort();
	/*
	 * 子进程环境：夹具库、端口、**上传隔离区**都要指到本条用例的 .tmp 里。
	 * ⚠️ TAVERN_INBOX 曾经漏了 —— 服务写的是真的 `data/inbox/`，夹具库删了、投稿 zip
	 * 永久留在真实数据目录里。测试凭什么往生产目录里堆东西？
	 * ⚠️ 同时**清掉 NODE_ENV / TAVERN_STRICT**：它们会让服务按生产模式拒绝启动
	 * （缺强胡椒直接退出，表现为含糊的"服务没起来"），而开发者的 shell 里恰好可能带着。
	 */
	const childEnv = { ...process.env, TAVERN_DB: dbPath, TAVERN_PORT: String(apiPort), TAVERN_INBOX: path.join(TMP, "inbox") };
	delete childEnv.NODE_ENV;
	delete childEnv.TAVERN_STRICT;
	const server = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "src/server.mjs"], {
		cwd: SERVER_ROOT,
		env: childEnv,
		stdio: ["ignore", "pipe", "pipe"],
	});
	let serverLog = "";
	server.stdout.on("data", (chunk) => { serverLog += chunk; });
	server.stderr.on("data", (chunk) => { serverLog += chunk; });
	const started = Date.now();
	/*
	 * 等到 banner 把**夹具库路径**也打出来，并核对它就是我们的库。
	 * 为什么要等到这一行而不是只看第一行：只等一句"酒馆看板后端"的话，端口被别的进程占着
	 * 也可能蒙混过去；而这两行是同一次 listen 回调里写的，等第二行几乎不花时间。
	 * （踩过一次：只看第一行 → 第二行还没到就判"这不是夹具库"，把好用例判成环境故障。）
	 */
	while (!serverLog.includes(dbPath)) {
		if (Date.now() - started > 10_000) {
			throw new Error(
				serverLog.includes("酒馆看板后端")
					? `端口 ${apiPort} 上起来的是**别的**服务（banner 里的库不是夹具库 ${dbPath}）：\n${serverLog}`
					: `服务没起来：\n${serverLog}`,
			);
		}
		await sleep(50);
	}

	const base = `http://127.0.0.1:${apiPort}`;
	const results = { pass: 0, fail: 0, skipped: 0, lines: [] };
	const check = (ok, label, extra = "") => {
		if (ok) results.pass += 1; else results.fail += 1;
		results.lines.push({ ok, label, extra });
		return ok;
	};
	const step = (title) => results.lines.push({ step: title });
	/**
	 * 记一段**没跑**的东西。它不增加通过数 —— "跳过"记成"通过"就是假绿：
	 * 页面层的检查在 `--browser` 下被静默跳过却报 ✔，等于没测还说测了。
	 */
	const skip = (label, why = "") => {
		results.skipped += 1;
		results.lines.push({ skip: true, label, extra: why });
	};

	/* HTTP 客户端：cookie 手动带着走，避免依赖 fetch 的 cookie jar */
	async function request(pathname, { method = "GET", cookie, body, raw = false } = {}) {
		const response = await fetch(`${base}${pathname}`, {
			method,
			headers: { ...(cookie ? { cookie } : {}), ...(body && !raw ? { "content-type": "application/json" } : {}) },
			body: raw ? body : body ? JSON.stringify(body) : undefined,
		});
		let payload = null;
		const text = await response.text();
		try { payload = JSON.parse(text); } catch { payload = text; }
		return { status: response.status, payload, cookie: (response.headers.get("set-cookie") ?? "").match(/^([^=]+=[^;]+)/)?.[1] ?? "" };
	}

	const api = {
		request,
		login: (pin, token) => request("/v1/auth/session", { method: "POST", body: { pin, token } }),
		logout: (cookie) => request("/v1/auth/session", { method: "DELETE", cookie }),
		me: (cookie) => request("/v1/me", { cookie }),
		search: (q) => request(`/v1/nodes?q=${encodeURIComponent(q)}&limit=50`),
		detail: (id, cookie) => request(`/v1/nodes/${encodeURIComponent(id)}`, { cookie }),
		events: (id, cookie) => request(`/v1/nodes/${encodeURIComponent(id)}/events?limit=50`, { cookie }),
		timeline: () => request("/v1/timeline?limit=100"),
		status: () => request("/v1/status"),
		tags: () => request("/v1/tags"),
		queue: (cookie) => request("/v1/reviews/queue", { cookie }),
		review: (cookie, revisionId, action, note) => request(`/v1/reviews/${encodeURIComponent(revisionId)}`, { method: "POST", cookie, body: { action, note } }),
		patch: (cookie, id, patch) => request(`/v1/nodes/${encodeURIComponent(id)}`, { method: "PATCH", cookie, body: patch }),
		/**
		 * 投稿。`slug` 决定节点身份：不传就按 name 派生 ——
		 * 于是"改一版标题再传一次"会**变成另一个新条目**（这条规则值得单独钉住，见 case 02）。
		 */
		async submitZip(cookie, buffer, { filename = "submission.zip", slug = null } = {}) {
			const form = new FormData();
			form.append("archive", new Blob([buffer], { type: "application/zip" }), filename);
			if (slug) form.append("slug", slug);
			const response = await fetch(`${base}/v1/submissions`, { method: "POST", headers: cookie ? { cookie } : {}, body: form });
			return { status: response.status, payload: await response.json().catch(() => null) };
		},
	};

	/* 浏览器夹具（可选）：站点静态 + /v1 反代 → 同源 */
	let proxy = null;
	let sitePort = null;
	let browserTool = null;
	if (browser) {
		const built = path.join(DIST, "tavern", "index.html");
		if (!fs.existsSync(built)) {
			browserTool = { skipped: "还没有构建站点（.vitepress/dist 不存在）—— 先 pnpm exec vitepress build" };
		} else {
			sitePort = await freePort();
			proxy = await startSiteProxy({ distDir: DIST, apiPort, port: sitePort });
			const origin = `http://127.0.0.1:${sitePort}`;
			browserTool = {
				skipped: null,
				origin,                                   // 反代端口 = 页面与 /v1 的共同来源
				base: `${origin}/datapack-index`,
				/**
				 * 页面 URL。**默认带上 `?api=<反代来源>`**：读接口的默认基址是
				 * 127.0.0.1:9878（开发后端），不带这个参数会去读**另一个库** ——
				 * 那样"页面里没有诱饵"这类断言会在错误的库上通过，测了个寂寞。
				 * 反代端口与页面同源，所以 cookie 与 CORS 都不受影响。
				 */
				url(relative) {
					const glue = relative.includes("?") ? "&" : "?";
					return `${origin}/datapack-index${relative}${glue}api=${encodeURIComponent(origin)}`;
				},
				grab: (relative) => grabDom(browserTool.url(relative)),
			};
		}
	}

	async function dispose() {
		server.kill();
		if (proxy) await new Promise((resolve) => proxy.close(resolve));
		await sleep(120);
		for (const suffix of ["", "-wal", "-shm"]) {
			const file = `${dbPath}${suffix}`;
			if (fs.existsSync(file)) fs.rmSync(file, { force: true });
		}
	}

	return { base, dbPath, principals, tokens, pins, api, check, step, skip, results, browser: browserTool, leaks, dispose, serverLog: () => serverLog };
}

/* ───────────────────────── 无头浏览器 ───────────────────────── */

const CHROME_CANDIDATES = [
	path.join("C:", "Program Files", "Google", "Chrome", "Application", "chrome.exe"),
	path.join("C:", "Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
];

export function chromePath() {
	return CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ?? null;
}

/** 把页面在无头浏览器里跑一遍，返回最终 DOM。 */
export async function grabDom(url, { budget = 15000, width = 1300, height = 2200 } = {}) {
	const chrome = chromePath();
	if (!chrome) return null;
	const { execFile } = await import("node:child_process");
	const profile = path.join(TMP, "chrome-profile");
	fs.mkdirSync(profile, { recursive: true });
	return new Promise((resolve) => {
		execFile(chrome, [
			"--headless=new", "--disable-gpu", "--no-sandbox",
			`--user-data-dir=${profile}`, `--virtual-time-budget=${budget}`,
			`--window-size=${width},${height}`, "--dump-dom", url,
		], { maxBuffer: 60 * 1024 * 1024 }, (error, stdout) => resolve(error && !stdout ? null : stdout));
	});
}

/* ───────────────────────── 投稿夹具（zip） ───────────────────────── */

/**
 * 造一个投稿 zip。默认走**真实打包**（src/archive.mjs 的 packDirectory），
 * 所以每个用例测的是"作者真会交上来的东西"，而不是手搓的假字节。
 *
 * @param {object} input { slug, meta, body, extras }
 *   meta 直接进 frontmatter（name / kind / tags / time…），extras 是额外文件路径 → 内容
 */
export async function buildZip({ slug = "e2e-entry", meta = {}, body = "正文。", extras = {} } = {}) {
	const { packDirectory } = await import(pathToFileURL(path.join(SERVER_ROOT, "src", "archive.mjs")).href);
	const dir = path.join(TMP, "zip", slug);
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
	lines.push("---", "", body, "");
	fs.writeFileSync(path.join(dir, "project.md"), lines.join("\n"), "utf8");
	fs.writeFileSync(path.join(dir, "assets", "cover.png"), Buffer.from(
		"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
		"base64",
	));

	for (const [relative, content] of Object.entries(extras)) {
		const full = path.join(dir, relative);
		fs.mkdirSync(path.dirname(full), { recursive: true });
		fs.writeFileSync(full, content, "utf8");
	}

	return packDirectory(dir).buffer;
}

/* ───────────────────────── 真·浏览器驱动（CDP） ───────────────────────── */
/*
 * 为什么需要它：`--dump-dom` 只能"看一眼渲染结果"，而工作台这类东西的要点是
 * **交互**（填表 → 点提交 → 侧栏出现本地记录）。这里用 Chrome DevTools Protocol
 * 直接驱动页面，不引任何第三方依赖 —— Node 24 自带 WebSocket 客户端。
 */

export async function startBrowser() {
	const chrome = chromePath();
	if (!chrome) return null;

	const port = await freePort();
	const profile = path.join(TMP, "cdp-profile");
	fs.mkdirSync(profile, { recursive: true });
	const child = spawn(chrome, [
		"--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run",
		`--user-data-dir=${profile}`, `--remote-debugging-port=${port}`,
		"--window-size=1300,1000", "about:blank",
	], { stdio: ["ignore", "pipe", "pipe"] });

	const endpoint = await (async () => {
		for (let attempt = 0; attempt < 60; attempt += 1) {
			try {
				const response = await fetch(`http://127.0.0.1:${port}/json/version`);
				const payload = await response.json();
				if (payload?.webSocketDebuggerUrl) return payload.webSocketDebuggerUrl;
			} catch { /* 还没起来 */ }
			await sleep(100);
		}
		throw new Error("Chrome DevTools 端点没起来");
	})();

	const socket = new WebSocket(endpoint);
	await new Promise((resolve, reject) => {
		socket.addEventListener("open", resolve, { once: true });
		socket.addEventListener("error", reject, { once: true });
	});

	let nextId = 1;
	const pending = new Map();
	socket.addEventListener("message", (event) => {
		const message = JSON.parse(event.data);
		if (message.id && pending.has(message.id)) {
			const { resolve, reject } = pending.get(message.id);
			pending.delete(message.id);
			message.error ? reject(new Error(message.error.message)) : resolve(message.result);
		}
	});

	const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
		const id = nextId++;
		pending.set(id, { resolve, reject });
		socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
	});

	// 开一个标签页并挂上会话
	const { targetId } = await send("Target.createTarget", { url: "about:blank" });
	const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
	await send("Page.enable", {}, sessionId);
	await send("Runtime.enable", {}, sessionId);

	async function evaluate(expression, { awaitPromise = true } = {}) {
		const result = await send("Runtime.evaluate", {
			expression, awaitPromise, returnByValue: true,
		}, sessionId);
		if (result.exceptionDetails) {
			throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? "页面里抛异常");
		}
		return result.result?.value;
	}

	async function goto(url, { settle = 1500 } = {}) {
		await send("Page.navigate", { url }, sessionId);
		// 等 load + 让框架把首屏渲染完
		for (let attempt = 0; attempt < 40; attempt += 1) {
			const ready = await evaluate("document.readyState === 'complete'").catch(() => false);
			if (ready) break;
			await sleep(100);
		}
		await sleep(settle);
	}

	return {
		evaluate,
		goto,
		async html() { return evaluate("document.documentElement.outerHTML"); },
		async text() { return evaluate("document.body.innerText"); },
		async close() {
			try { socket.close(); } catch { /* ignore */ }
			child.kill();
			await sleep(150);
			fs.rmSync(profile, { recursive: true, force: true });
		},
	};
}

/** 在页面里给 Vue 的 v-model 输入框赋值（必须派发 input 事件，否则 Vue 不知道变了）。 */
export const PAGE_SET_INPUT = `(selector, value) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error('找不到元素：' + selector);
  const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value')?.set;
  setter ? setter.call(el, value) : (el.value = value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}`;

/** 点一个元素（按文本或选择器）。 */
export const PAGE_CLICK = `(selector) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error('找不到元素：' + selector);
  el.click();
  return true;
}`;

/** 轮询等待某个条件在页面里成立。 */
export const PAGE_WAIT = `async (expression, timeoutMs = 8000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (eval(expression)) return true;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  return false;
}`;
