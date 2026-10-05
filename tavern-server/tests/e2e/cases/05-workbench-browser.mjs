/**
 * 用例 05 · 投稿工作台（真·浏览器交互）
 * =============================================================================
 * 前面几条测的是后台与打包格式，这条测**作者真正会走的那个界面**：
 *   在页面里选类型 → 填元数据 → 写正文 → 登录 → 点提交 → 侧栏出现本地记录
 *   → 工作组审核 → 公开页出现
 *
 * 为什么非要用浏览器：工作台的要点是**交互**（v-model 绑定、按钮禁用条件、
 * 提交后的状态机），这些在任何"直接调函数"的测试里都测不到。
 * 驱动方式是 Chrome DevTools Protocol，不引第三方依赖。
 *
 * 同源：站点与 /v1 都走同一个端口（harness 里的反代），于是 cookie 会话成立 ——
 * 这正是生产上作者中心必须与 API 同源部署的原因。
 */

import { PAGE_CLICK, PAGE_SET_INPUT, PAGE_WAIT, startBrowser } from "../harness.mjs";

const TITLE = "E2E Workbench UI";
const BODY = "# 说明\n\n这是**工作台**里写的正文。";

export default {
	title: "投稿工作台（浏览器交互）",
	browser: true,
	async run(env) {
		const { api, check, step, pins, tokens, base } = env;
		if (!env.browser) throw new Error("这条用例需要浏览器环境");

		const staff = await api.login(pins.staff, tokens.staff);
		const author = await api.login(pins.author, tokens.author);

		const browser = await startBrowser();
		if (!browser) throw new Error("起不了浏览器");

		try {
			// ⚠️ 这里**故意不带 ?api=**：工作台的写基址默认取 location.origin，
			// 而 harness 的反代已经把 /v1 指到这条用例的后端了 —— 于是同源成立、cookie 可用。
			// 反过来，若带上 ?api=http://127.0.0.1:<另一个端口>，登录就变成跨源请求，
			// cookie 与 CORS 全会拦下来（这正是设计里"作者中心必须与 API 同源"那条约束）。
			void base;
			await browser.goto(env.browser.url("/tavern/submit"));

			step("页面骨架");
			const text = await browser.text();
			check(text.includes("投稿工作台"), "页面渲染出来了");
			check(text.includes("作品") && text.includes("赛事"), "类型卡里有作品与赛事");
			const typeCards = await browser.evaluate("[...document.querySelectorAll('.tv-wb-type-kind')].map((el) => el.textContent.trim())");
			check(JSON.stringify(typeCards) === JSON.stringify(["project", "event"]), "类型卡恰好是 作品 / 赛事 两种（合集等成员接口补齐后才开）", typeCards.join(", "));
			check(text.includes("我的投稿"), "侧栏有「我的投稿」本地缓存区");
			check(text.includes("不写进 localStorage"), "界面上直说了令牌不落地");

			step("填表");
			// 按"字段标签"定位，而不是靠 DOM 顺序 —— 表单顺序会变，标签不会
			const setByLabel = `(labelPrefix, value) => {
				const fields = [...document.querySelectorAll('.tv-wb-field')];
				const target = fields.find((field) => (field.querySelector('span')?.textContent ?? '').trim().startsWith(labelPrefix));
				if (!target) throw new Error('找不到字段：' + labelPrefix);
				const el = target.querySelector('input, textarea');
				const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value')?.set;
				setter ? setter.call(el, value) : (el.value = value);
				el.dispatchEvent(new Event('input', { bubbles: true }));
				el.dispatchEvent(new Event('change', { bubbles: true }));
				return true;
			}`;
			await browser.evaluate(`(${setByLabel})('名称', ${JSON.stringify(TITLE)})`);
			await browser.evaluate(`(${setByLabel})('一句话简介', '由工作台界面提交的条目')`);
			await browser.evaluate(`(${setByLabel})('Markdown', ${JSON.stringify(BODY)})`);
			const slugShown = await browser.evaluate("document.querySelector('.tv-wb-slug')?.textContent?.trim() ?? ''");
			check(slugShown.startsWith("project:"), "slug 从名称自动派生（作者不手填）", slugShown);

			await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-wb-preview-body h1') !== null")`);
			const preview = await browser.evaluate("document.querySelector('.tv-wb-preview-body')?.innerHTML ?? ''");
			check(/<h1[^>]*>\s*说明/.test(preview), "正文实时预览用了站点的渲染器（标题被渲染成 h1）", preview.slice(0, 60));
			check(/<strong>工作台<\/strong>/.test(preview), "粗体也渲染了");

			step("没登录时不能提交");
			const disabledBefore = await browser.evaluate("document.querySelector('.tv-wb-submit-row .tv-btn--primary')?.disabled === true");
			check(disabledBefore, "提交按钮在未登录时是禁用的");

			step("在页面里登录");
			await browser.evaluate(`(() => {
				const set = ${PAGE_SET_INPUT};
				const inputs = [...document.querySelectorAll('.tv-wb-auth input')];
				set('.tv-wb-auth input[type="text"]', ${JSON.stringify(env.pins.author)});
				set('.tv-wb-auth input[type="password"]', ${JSON.stringify(env.tokens.author)});
				return inputs.length;
			})()`);
			await browser.evaluate("document.querySelector('.tv-wb-auth button[type=\"submit\"]').click()");
			const loggedIn = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('已登录')")`);
			check(loggedIn, "登录成功（页面出现「已登录」）", await browser.evaluate("document.querySelector('.tv-wb-account')?.innerText?.replace(/\\s+/g,' ') ?? '（没有）'"));

			step("提交");
			await browser.evaluate("document.querySelector('.tv-wb-submit-row .tv-btn--primary').click()");
			const submitted = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('投稿已收到')", 12000)`);
			check(submitted, "提交成功并给出回执", await browser.evaluate("document.querySelector('.tv-wb-submit-message')?.innerText ?? '（没有回执）'"));

			const sidebar = await browser.evaluate("document.querySelector('.tv-wb-sublist')?.innerText?.replace(/\\s+/g, ' ') ?? ''");
			check(sidebar.includes(TITLE), "侧栏「我的投稿」出现了这条本地记录", sidebar.slice(0, 80));
			check(sidebar.includes("等待审核"), "本地记录标着「等待审核」");

			step("后台状态与前端一致");
			const nodeId = `project:${slugShown.replace(/^project:/, "")}`;
			check((await api.detail(nodeId)).status === 404, "待审期间公开面 404（后台不回内容，本地缓存是唯一来源）");
			const queue = (await api.queue(staff.cookie)).payload?.items ?? [];
			const mine = queue.find((item) => item.nodeId === nodeId);
			check(Boolean(mine), "工作组的审核队列里有它", mine ? `title=${mine.title}` : `（队列里没有 ${nodeId}）`);

			step("刷新之后 slug 必须锁死（改标题不能换条目身份）");
			/*
			 * 这条钉的是一个真出现过的高危行为：草稿存在 localStorage，刷新后 `slugTouched`
			 * 却是内存里的 false —— 作者回来把标题改一改，slug 就被重新派生一遍，
			 * 提交出去的**不是原条目的新修订，而是另一个新条目**（看板上多一条重复、
			 * 审核队列里多一条像重复投稿的记录）。slug 是条目身份的一部分，不能这么丢。
			 *
			 * 两个细节让这条断言真的有效：
			 *   · 新名字要能派生出**不同**的 slug（加 ASCII），否则"没锁住"和"锁住了"看起来一样；
			 *   · 等页面把草稿恢复出来再读（读取时它还是空的话，比较就失去意义）。
			 */
			const beforeReload = slugShown.replace(/^project:/, "");
			// 草稿是**防抖** 600ms 后写进 localStorage 的，所以要先等它真的落地 ——
			// 不等就刷新，测的其实是"缓存里什么都没有"，与 slug 锁不锁无关。
			const draftSaved = await browser.evaluate(`(${PAGE_WAIT})("localStorage.getItem('tavern:workbench:draft') !== null", 8000)`);
			check(draftSaved, "草稿写进了本地缓存（刷新不丢的前提）");
			await browser.goto(env.browser.url("/tavern/submit"));
			await browser.evaluate(`(${PAGE_WAIT})("(document.querySelector('#wb-slug')?.value ?? '').length > 0", 8000)`);
			const restoredSlug = await browser.evaluate("document.querySelector('#wb-slug')?.value ?? ''");
			check(restoredSlug === beforeReload, "刷新后草稿带着原来的 slug 恢复", `${beforeReload} → ${restoredSlug}`);
			await browser.evaluate(`(${PAGE_SET_INPUT})("#wb-name", ${JSON.stringify(`${TITLE} Renamed`)} )`);
			const slugAfter = await browser.evaluate("document.querySelector('#wb-slug')?.value ?? ''");
			check(slugAfter === beforeReload, "改标题后 slug 不变（否则会多出一个新条目）", `${beforeReload} → ${slugAfter}`);

			step("审核通过 → 公开可见");
			const approved = await api.review(staff.cookie, mine.revisionId, "approve");
			check(approved.status === 200, "工作组通过");
			const detail = await api.detail(nodeId);
			check(detail.status === 200 && JSON.stringify(detail.payload).includes(TITLE), "公开面出现了工作台提交的内容");
			await browser.goto(env.browser.url(`/tavern/p?id=${encodeURIComponent(nodeId)}`));
			check((await browser.text()).includes(TITLE), "详情页也渲染出来了");
		} finally {
			await browser.close();
		}
	}
};
