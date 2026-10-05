/**
 * 用例 04 · 工作台打的包，后端收得下（工作台 ↔ 后端 的接口契约）
 * =============================================================================
 * 工作台的产物是一个 zip：元数据（frontmatter）+ 正文 + 素材，全在浏览器里现打。
 * 这条用例直接拿**工作台自己的打包模块**（zipwriter.mjs）造包，再走真实投稿管线：
 *   打 → 投稿 → 待审不可见 → 上架 → 内容与前端填的一致
 *
 * 它挡住的是最容易出事的一类问题：前端打包格式与后端解包器悄悄不兼容
 * （压缩方式、UTF-8 名字、中央目录偏移……），而这种问题在人工点页面时
 * 往往只表现为"投稿失败"，看不出是格式问题。
 */

import { buildProjectEntries, buildFrontmatter } from "../../../../.vitepress/vue/tavern/workbench-model.mjs";
import { zipFiles } from "../../../../.vitepress/vue/tavern/zipwriter.mjs";

export default {
	title: "工作台打包 → 投稿（契约）",
	async run(env) {
		const { api, check, step, pins, tokens } = env;
		const author = await api.login(pins.author, tokens.author);
		const staff = await api.login(pins.staff, tokens.staff);
		const NODE_ID = "project:e2e-workbench";

		step("用工作台的模型造一个包（与页面里走的是同一段代码）");
		const draft = {
			kind: "project",
			slug: "e2e-workbench",
			name: "E2E Workbench Made",
			summary: "由工作台打包模块生成的投稿",
			tags: ["e2e走查", "工作台"],
			gameversion: "1.21.9",
			repo: "example/workbench-made",
			body: "# 标题\n\n正文里有**粗体**、`行内代码` 与列表：\n\n- 一\n- 二\n",
			recruit: [{ role: "测试", headcount: 2, status: "open", skills: ["耐心"] }],
			/*
			 * ⚠️ 素材名刻意用工作台真实生成的那种（`assets/<slug>-N.webp`，**不是** `assets/cover.*`），
			 * 并且显式标 cover —— 这样"封面有没有传到后端"才真的被测到。
			 * 曾经这条用例喂的是 `assets/cover.png`，恰好命中后端的 `assets/cover.*` 启发式，
			 * 于是"工作台从来不发 cover 字段、封面上架后 100% 丢失"这个 bug 被测试盖住了。
			 */
			assets: [{ path: "assets/e2e-workbench-1.webp", bytes: new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]), cover: true }],
		};
		const entries = buildProjectEntries(draft);
		check(entries.length >= 3, "包里有 frontmatter 文件 + 正文 + 素材", entries.map((entry) => entry.name).join(", "));
		check(buildFrontmatter(draft).includes("kind: project"), "frontmatter 由模型生成（作者不手写 YAML）");
		check(buildFrontmatter(draft).includes("slug: e2e-workbench") === false, "slug 不进 frontmatter（它是平台字段，走 multipart 字段）");

		const zip = await zipFiles(entries);
		check(zip.length > 0 && zip[0] === 0x50 && zip[1] === 0x4b, "产物是真 zip（PK 头）", `${zip.length} 字节`);

		step("投稿 → 待审 → 上架");
		check((await api.detail(NODE_ID)).status === 404, "投稿前公开面没有它");
		const submitted = await api.submitZip(author.cookie, zip, { filename: "e2e-workbench.zip", slug: "e2e-workbench" });
		check(submitted.status === 201, "后端收下了工作台打的包", JSON.stringify(submitted.payload?.errors ?? submitted.payload?.message ?? ""));
		check(submitted.payload?.nodeId === NODE_ID, "节点 id 与工作台填的 slug 一致", submitted.payload?.nodeId);
		check((await api.detail(NODE_ID)).status === 404, "待审期间公开面仍 404");

		const approved = await api.review(staff.cookie, submitted.payload.revisionId, "approve");
		check(approved.status === 200, "审核通过");

		step("上架内容与工作台里填的一致");
		const node = (await api.detail(NODE_ID)).payload?.node;
		check(node?.i18n?.zh?.title === "E2E Workbench Made", "标题正确", node?.i18n?.zh?.title);
		check(node?.i18n?.zh?.summary === "由工作台打包模块生成的投稿", "简介正确");
		check(JSON.stringify(node?.tags ?? []) === JSON.stringify(["e2e走查", "工作台"]), "标签顺序与内容都对", JSON.stringify(node?.tags));
		check((node?.recruit ?? []).some((role) => role.role === "测试" && role.headcount === 2), "招募岗位正确", JSON.stringify(node?.recruit));
		check(node?.repo === "example/workbench-made", "仓库坐标正确", node?.repo);
		check(node?.cover === "assets/e2e-workbench-1.webp", "★ 封面传到了后端（工作台必须显式写 frontmatter 的 cover）", String(node?.cover));
		check(String(node?.i18n?.zh?.body ?? "").includes("**粗体**"), "正文原样落库（Markdown 不被前端改写）");

		/*
		 * 页面层：这里**只断言"条目渲染出来了"**，不断言正文被渲染成 HTML。
		 *
		 * ⚠️ 本期条目页不渲染正文（页面上那段"正文还没有同步进来看板"就是它自己说的），
		 * 所以 `<strong>粗体</strong>` 根本不会出现 —— 这两条断言曾经写着"会渲染"，
		 * 而 case 拿不到浏览器夹具，于是它们从来没跑过（没跑还当通过）。
		 * 真正被验证的是"接口把正文原样返回"（上面那条），而"渲染器能渲染正文"
		 * 由 05 在**工作台实时预览**里验（用的就是站点那一份 runtimeMarkdown.mjs）。
		 * 等条目页真渲染正文了，把那两条断言加回来即可。
		 */
		const html = await env.browser?.grab?.(`/tavern/p?id=${encodeURIComponent(NODE_ID)}`);
		if (!html) {
			env.skip("详情页渲染", "需要 --browser（站点静态 + /v1 反代）");
			return;
		}
		check(html.includes("E2E Workbench Made"), "详情页渲染出这个条目");
		env.skip("详情页把正文渲染成 HTML", "条目页还不渲染正文（见页面上的说明）");

		/*
		 * 写接口基址：**不能**被 `?api=` 骗到外域。
		 *
		 * 工作台的登录请求 body 里是明文 pin + token（令牌按设计就是密码）。如果写基址
		 * 照单全收查询串，那么一条 `…/tavern/submit?api=https://evil.tld` 的链接就能让作者
		 * "正常登录"、凭证却 POST 给攻击者。api.mjs 是纯模块（无框架依赖），所以这里
		 * 直接用一个假 window 把它 import 起来验规则，不需要浏览器。
		 */
		step("写接口基址不会被 ?api= 骗到外域");
		const previousWindow = globalThis.window;
		const baseWith = async (search, tag) => {
			globalThis.window = {
				location: { origin: "https://tavern.example", search, pathname: "/datapack-index/tavern/submit" },
				sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
			};
			try {
				const module = await import(`../../../../.vitepress/vue/tavern/api.mjs?${tag}`);
				return module.WRITE_API_BASE;
			} finally {
				if (previousWindow === undefined) delete globalThis.window;
				else globalThis.window = previousWindow;
			}
		};
		const hijack = await baseWith("?api=https://evil.example/collect", "hijack");
		check(hijack === "https://tavern.example", "★ 外域 ?api= 被忽略（否则登录会把凭证送到攻击者服务器）", hijack);
		const loopback = await baseWith("?api=http://127.0.0.1:9878", "loopback");
		check(loopback === "http://127.0.0.1:9878", "本机开发用的回环覆盖仍然有效", loopback);
		const sameOrigin = await baseWith("", "same-origin");
		check(sameOrigin === "https://tavern.example", "没有 ?api= 时就是同源", sameOrigin);
	}
};
