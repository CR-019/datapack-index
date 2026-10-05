/**
 * 用例 03 · 可见性泄露（诱饵库）
 * =============================================================================
 * 往夹具库里塞五类"本不该出现在公开面"的东西，然后逐个接口、逐个页面试：
 *   ① 未上架条目      ② 待审修订（改了标题）   ③ 内部事件
 *   ④ 未上架阶段      ⑤ 指向未上架条目的边（includes / related）
 *
 * 后端接口层 + 前端页面层都要干净：
 *   · 接口层：诱饵字符串一个都不出现，未上架条目的详情 404
 *   · 页面层（--browser）：连**裸 id** 都不能出现 —— 那是"存在一个未上架的 xxx"
 *     这件事本身泄露了，而且链接必然 404（主页的作品墙、详情页的关系区都踩过）
 */

import { chromePath } from "../harness.mjs";

const API_PATHS = [
	["公开列表", "/v1/nodes?limit=300"],
	["公开时间线", "/v1/timeline?limit=100"],
	["赛事详情", `/v1/nodes/${encodeURIComponent("event:autumn-jam-2026")}`],
	["作品详情", `/v1/nodes/${encodeURIComponent("project:atlas")}`],
	["作品事件", `/v1/nodes/${encodeURIComponent("project:atlas")}/events?limit=50`],
	["标签列表", "/v1/tags"],
	["状态计数", "/v1/status"],
];

const PAGES = [
	// [页面, 相对地址, 正向对照串] —— 第三个是"这个页面**确实渲染出来了**"的证据，
	// 而且必须是夹具库特有的内容（快照兜底里没有它），否则页面整块空白也会全绿。
	["主页", "/tavern/", "秋季创作赛"],
	["全部条目", "/tavern/all", "地图册"],
	["详情页", `/tavern/p?id=${encodeURIComponent("project:atlas")}`, "地图册"],
	["作者页", `/tavern/a?id=${encodeURIComponent("person:Alumopper")}`, "Alumopper"],
	["标签页", `/tavern/tag?id=${encodeURIComponent("tag:ui")}`, "Alumopper"],
];

export default {
	title: "可见性泄露（诱饵库）",
	env: { injections: "leaks" },
	async run(env) {
		const { api, check, step, leaks } = env;

		step("接口层");
		for (const [label, pathname] of API_PATHS) {
			const response = await api.request(pathname);
			const text = typeof response.payload === "string" ? response.payload : JSON.stringify(response.payload);
			const hits = leaks.strings.filter((needle) => text.includes(needle));
			// ⚠️ 负向断言必须**同时**要求 200：接口 500 时"不含诱饵"是当然成立的
			// （实测过：让 /v1/tags 抛异常，这条断言照样打勾）。
			check(response.status === 200 && hits.length === 0, `${label} 不含诱饵`, hits.length ? `命中：${hits.join(" / ")}` : `HTTP ${response.status}`);
		}
		// 出边（includes / related）与**入边**（未上架阶段 --parent--> 赛事）分开点名：
		// 只堵一个方向时，另一种写法会原样把未上架条目的 id 递出去。
		const eventDetail = await api.detail("event:autumn-jam-2026");
		const incoming = JSON.stringify(eventDetail.payload?.node?.incoming ?? []);
		check(!incoming.includes("permsecret"), "赛事详情的**入边**里没有未上架阶段的 id", incoming.slice(0, 120));
		check((await api.request(`/v1/nodes/${encodeURIComponent(leaks.nodeId)}`)).status === 404, "未上架条目的详情接口 404");
		check((await api.search("秘密")).payload?.total === 0, "按诱饵标题搜索搜不到");
		check((await api.search("秘密草稿")).payload?.total === 0, "按诱饵 slug 搜索也搜不到");

		const status = (await api.status()).payload;
		check(status?.nodes?.published < status?.nodes?.total, "状态计数里 published < total（未上架被排除在 published 之外）");
		check(status?.private === undefined, "匿名请求 /v1/status 拿不到 private 私域计数");

		step("页面层（浏览器）");
		if (!env.browser) {
			// 记成"跳过"而不是"通过"：这一段没跑。把没跑说成通过，正是假绿的来源。
			env.skip("页面层：5 个页面的诱饵/裸 id 检查", "需要 --browser（站点静态 + /v1 反代）");
			return;
		}
		for (const [label, relative, marker] of PAGES) {
			const html = await env.browser.grab(relative);
			if (html === null) {
				check(false, `${label} 没能抓到页面`);
				continue;
			}
			/*
			 * 正向对照**先于**负向断言：只断言"不含诱饵"的话，页面 404、构建产物不全、
			 * 或者退回了静态快照，都会一路绿灯（实测：把 dist 换成一个只剩 index.html 的
			 * 残缺目录，这一整段照样全 ✔）。所以先要一个"夹具库特有的内容真的渲染出来了"
			 * 的证据，再谈"没多出东西"。
			 */
			const rendered = html.includes(marker);
			check(rendered, `${label} 确实渲染出了夹具内容（对照串「${marker}」）`, rendered ? "" : `HTML 长度 ${html.length}，前 120 字：${html.slice(0, 120).replace(/\s+/g, " ")}`);
			const hits = leaks.strings.filter((needle) => html.includes(needle));
			check(hits.length === 0, `${label} 不含诱饵字符串`, hits.length ? `命中：${hits.join(" / ")}` : "");
		}
		check(Boolean(chromePath()), "浏览器可用");
	}
};
