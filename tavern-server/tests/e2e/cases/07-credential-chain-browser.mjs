/**
 * 用例 07 · 凭证链路（真·浏览器）：管理员在管理台签发 → 本人在工作台填写
 * =============================================================================
 * 这是那条链路的**页面版**，也是它唯一被真正跑过的地方：
 *   管理台登录 → 签发一对 pin+token（明文只出现一次）→ 交给"本人"
 *   → 本人在投稿工作台填 pin+token → 登录 → 提交投稿
 *   → 工作组审核上架 → 公开页出现 → 回管理台吊销 → 本人会话当场失效
 *
 * 为什么接口版（06）不能替代它：页面这一层有三件事只在浏览器里成立 ——
 *   · **明文令牌不进任何持久化**（写进 localStorage 就违背了"只显示这一次"）
 *   · 非工作组登录后**看不到**签发表单（不是"点了被拒"，而是压根不给）
 *   · 签发/吊销之后列表要自己刷新到正确状态（前端状态机，接口对不对看不出来）
 *
 * ⚠️ 一个人一台机器：登录态是 cookie，同一浏览器里换不了"人"。所以链路里
 * 管理员先退出，再以本人身份登录 —— 这正是生产上发生的事（凭证交给本人，
 * 本人在自己的机器上填）。测试不为此另开浏览器上下文，是因为"换个人"在这里
 * 没有别的含义，而多一套上下文只会让失败信息更难读。
 */

import { PAGE_SET_INPUT, PAGE_WAIT, pageHas, pageSignIn, pageSignOut, startBrowser } from "../harness.mjs";

const PIN = "e2e-ui-author";
const NAME = "E2E 界面作者";
const TITLE = "E2E UI 凭证链路";

/** 按字段标签定位输入框（表单顺序会变，标签不会）—— 与 05 同一套做法。 */
const SET_BY_LABEL = `(labelPrefix, value) => {
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

export default {
	title: "凭证链路（管理台签发 → 工作台填写）",
	browser: true,
	async run(env) {
		const { api, check, step, pins, tokens } = env;
		if (!env.browser) throw new Error("这条用例需要浏览器环境");

		const staff = await api.login(pins.staff, tokens.staff);
		const browser = await startBrowser();
		if (!browser) throw new Error("起不了浏览器");

		try {
			await browser.goto(env.browser.url("/tavern/admin"));

			step("管理台：非工作组登录后拿不到签发能力");
			check((await browser.text()).includes("凭证管理台"), "管理台页面渲染出来了");
			await pageSignIn(browser, env.pins.author, env.tokens.author);
			const authorText = await browser.text();
			check(authorText.includes("作者（无签发权限）"), "作者登录后界面直说没有签发权限");
			check(!(await pageHas(browser, "#ad-issue-submit")), "★ 作者看不到签发表单（不是点了被拒，而是压根不给）");
			await pageSignOut(browser);

			step("管理台：工作组登录");
			await pageSignIn(browser, env.pins.staff, env.tokens.staff);
			check(await pageHas(browser, "#ad-issue-submit"), "工作组登录后出现签发表单");

			step("签发一对凭证");
			await browser.evaluate(`(${PAGE_SET_INPUT})("#ad-name", ${JSON.stringify(NAME)})`);
			const derived = await browser.evaluate("document.querySelector('#ad-pin')?.value ?? ''");
			check(derived.startsWith("e2e"), "pin 从显示名自动派生（签发人少打一遍字）", derived);
			await browser.evaluate(`(${PAGE_SET_INPUT})("#ad-pin", ${JSON.stringify(PIN)})`);
			await browser.evaluate(`(${PAGE_SET_INPUT})("#ad-label", "走查：管理台签发")`);
			await browser.evaluate(`(${PAGE_SET_INPUT})("#ad-reason", "走查：UI 链路")`);
			await browser.evaluate(`(${PAGE_SET_INPUT})("#ad-role", "author")`);
			const clickable = await browser.evaluate("document.querySelector('#ad-issue-submit')?.disabled === false");
			check(clickable, "签发按钮在填完必填项后可用（名称 + 合法 pin）");
			await browser.evaluate("document.querySelector('#ad-issue-submit').click()");

			const appeared = await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-admin-secret') !== null", 10000)`);
			check(appeared, "签发成功并弹出一屏明文凭证");
			if (!appeared) return;

			const shownPin = await browser.evaluate("document.querySelector('.tv-admin-secret-pin')?.textContent?.trim() ?? ''");
			const shownToken = await browser.evaluate("document.querySelector('.tv-admin-secret-token')?.textContent?.trim() ?? ''");
			check(shownPin === PIN, "明文里的 pin 与填的一致", shownPin);
			check(/^[0-9A-HJKMNP-TV-Z]{32}$/.test(shownToken), "★ 明文令牌是 32 位（本人要抄走的就是这一串）", `${shownToken.length} 字符`);

			step("明文只显示这一次");
			const persisted = await browser.evaluate(
				`[JSON.stringify(Object.entries(localStorage)), JSON.stringify(Object.entries(sessionStorage))].join("|")`,
			);
			check(!String(persisted).includes(shownToken), "★ 明文令牌没进 localStorage / sessionStorage（写进去就等于给了它第二个落点）");
			const list = await browser.evaluate("[...document.querySelectorAll('.tv-admin-pin')].map((el) => el.textContent.trim())");
			check(list.includes(PIN), "新主体出现在下面的凭证清单里", list.join(", "));
			check((await browser.text()).includes("（还没用过）"), "这枚令牌标着「还没用过」（异常使用的第一手线索）");

			await browser.evaluate("document.querySelector('#ad-saved').click()");
			await browser.evaluate("document.querySelector('.tv-admin-secret-dismiss').click()");
			check(!(await pageHas(browser, ".tv-admin-secret")), "点「关掉这一屏」后明文消失");
			await browser.goto(env.browser.url("/tavern/admin"));
			await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-admin-subjects') !== null", 10000)`);
			check(!(await pageHas(browser, ".tv-admin-secret")), "★ 刷新之后明文再也回不来（它没有被存到任何地方）");
			check((await browser.text()).includes(PIN), "刷新后仍认得出登录身份，并继续看得见这个主体");

			step("本人：在工作台第 0 步填 pin + token");
			await pageSignOut(browser);
			await browser.goto(env.browser.url("/tavern/submit"));
			await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-wb-auth input[type=\\"password\\"]') !== null", 8000)`);
			await browser.evaluate(`(() => {
				const set = ${PAGE_SET_INPUT};
				set('.tv-wb-auth input[type="text"]', ${JSON.stringify(PIN)});
				set('.tv-wb-auth input[type="password"]', ${JSON.stringify(shownToken)});
				return true;
			})()`);
			await browser.evaluate("document.querySelector('.tv-wb-auth button[type=\"submit\"]').click()");
			const loggedIn = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('已登录')", 10000)`);
			check(loggedIn, "★ 用刚签发的凭证在工作台登录成功");
			const accountText = await browser.evaluate("document.querySelector('.tv-wb-account')?.innerText?.replace(/\\s+/g, ' ') ?? ''");
			check(accountText.includes(PIN) && accountText.includes("作者"), "页面认得出这是刚签发的那个作者", accountText);
			check(!accountText.includes("凭证管理台"), "作者身份下不露出管理台入口（那是工作组的东西）");

			/*
			 * 同一个人常常还开着第二台设备。这里用同一枚令牌再换一个会话，
			 * 用来验"吊销令牌会掐掉**所有**由它派生的会话"（而不只是当前这台）。
			 */
			const secondDevice = await api.login(PIN, shownToken);
			check(secondDevice.status === 200, "同一枚令牌在另一台设备上也换到了会话");

			step("本人：投稿");
			await browser.evaluate(`(${SET_BY_LABEL})('名称', ${JSON.stringify(TITLE)})`);
			await browser.evaluate(`(${SET_BY_LABEL})('一句话简介', '由管理台签发的凭证提交')`);
			await browser.evaluate(`(${SET_BY_LABEL})('Markdown', '# 凭证链路\\n\\n这条内容由界面签发出来的凭证提交。')`);
			const slug = await browser.evaluate("document.querySelector('#wb-slug')?.value ?? ''");
			await browser.evaluate("document.querySelector('.tv-wb-submit-row .tv-btn--primary').click()");
			const submitted = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('投稿已收到')", 12000)`);
			check(submitted, "★ 投稿成功（签发 → 填写 → 投稿这条链路真的通了）", await browser.evaluate("document.querySelector('.tv-wb-submit-message')?.innerText ?? '（没有回执）'"));

			const nodeId = `project:${slug}`;
			const queue = (await api.queue(staff.cookie)).payload?.items ?? [];
			const mine = queue.find((item) => item.nodeId === nodeId);
			check(Boolean(mine), "审核队列里有它", nodeId);
			if (!mine) return;

			step("工作组审核 → 公开页");
			check((await api.review(staff.cookie, mine.revisionId, "approve")).status === 200, "审核通过");
			await browser.goto(env.browser.url(`/tavern/p?id=${encodeURIComponent(nodeId)}`));
			check((await browser.text()).includes(TITLE), "公开条页渲染出这条投稿");

			step("回管理台吊销 → 本人当场失效");
			await browser.goto(env.browser.url("/tavern/admin"));
			await pageSignIn(browser, env.pins.staff, env.tokens.staff);
			/*
			 * 吊销按钮带二次确认（`window.confirm`）：确认框里的两句话是这条流程的
			 * 安全说明（立即生效、会掐掉在用的会话）。无头浏览器里原生弹窗会挂住
			 * 页面，所以这里把它替换成一个"总是确认"的桩 —— 验的是确认之后的路径。
			 */
			await browser.evaluate("window.confirm = () => true");
			const clicked = await browser.evaluate(`(() => {
				const subject = [...document.querySelectorAll('.tv-admin-subject')]
					.find((el) => el.querySelector('.tv-admin-pin')?.textContent?.trim() === ${JSON.stringify(PIN)});
				const button = subject?.querySelector('.tv-admin-revoke');
				if (!button) return false;
				button.click();
				return true;
			})()`);
			check(clicked, "找得到那位作者名下可吊销的令牌");
			const revokedShown = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('已吊销')", 10000)`);
			check(revokedShown, "★ 吊销后清单当场变成「已吊销」");

			check((await api.me(secondDevice.cookie)).status === 401, "★ 另一台设备的会话也一起失效（吊销掐的是令牌，不是某一个会话）");

			/*
			 * 页面侧只能验"这枚凭证再也登不进来"：同一浏览器里换不了人，
			 * 而刚刚为了吊销已经用工作组身份登录过 —— 本人的那个 cookie 已经被顶掉了。
			 * （"已建立的会话立刻失效"由这里的 secondDevice 与 06 那条用例钉住。）
			 */
			await pageSignOut(browser);
			await browser.goto(env.browser.url("/tavern/submit"));
			await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-wb-auth input[type=\\"password\\"]') !== null", 10000)`);
			await browser.evaluate(`(() => {
				const set = ${PAGE_SET_INPUT};
				set('.tv-wb-auth input[type="text"]', ${JSON.stringify(PIN)});
				set('.tv-wb-auth input[type="password"]', ${JSON.stringify(shownToken)});
				return true;
			})()`);
			await browser.evaluate("document.querySelector('.tv-wb-auth button[type=\"submit\"]').click()");
			const rejected = await browser.evaluate(`(${PAGE_WAIT})("(document.querySelector('.tv-wb-error')?.innerText ?? '').includes('不正确')", 10000)`);
			check(rejected, "★ 被吊销的凭证在工作台登不进去，且给的是可读的拒绝", await browser.evaluate("document.querySelector('.tv-wb-error')?.innerText ?? '（没有错误提示）'"));
			check(!(await browser.text()).includes("已登录"), "页面上没有「已登录」");

			/*
			 * 吊销不是终点：工作组要能**随时**再补发一枚（丢了、泄露了、换设备）。
			 * 这一步走的是清单里那个「签发新令牌」按钮 —— 它此前没有任何用例覆盖
			 * （它是唯一一处用 `window.prompt` 问标签的交互，最容易悄悄坏掉）。
			 */
			step("工作组随时补发一枚（把刚吊销的人放回来）");
			await browser.goto(env.browser.url("/tavern/admin"));
			await pageSignIn(browser, env.pins.staff, env.tokens.staff);
			await browser.evaluate("window.prompt = () => '走查：补发'");
			const reissueClicked = await browser.evaluate(`(() => {
				const subject = [...document.querySelectorAll('.tv-admin-subject')]
					.find((el) => el.querySelector('.tv-admin-pin')?.textContent?.trim() === ${JSON.stringify(PIN)});
				const button = subject?.querySelector('.tv-admin-issue-more');
				if (!button) return false;
				button.click();
				return true;
			})()`);
			check(reissueClicked, "清单里有「签发新令牌」按钮（吊销之后账号还在）");
			const appearedAgain = await browser.evaluate(`(${PAGE_WAIT})("(document.querySelector('.tv-admin-secret-token')?.textContent ?? '').trim().length === 32", 10000)`);
			check(appearedAgain, "补发也弹一次性明文");
			const newToken = appearedAgain ? await browser.evaluate("document.querySelector('.tv-admin-secret-token')?.textContent?.trim() ?? ''") : "";
			check(newToken && newToken !== shownToken, "★ 补发的是一枚**新**令牌（旧的那枚不动，各自可单独吊销）");

			const fresh = await api.login(PIN, newToken);
			check(fresh.status === 200, "★ 新令牌立刻能用");
			check((await api.login(PIN, shownToken)).status === 401, "刚被吊销的那枚仍然用不了");
			const rows = await browser.evaluate(`(() => {
				const subject = [...document.querySelectorAll('.tv-admin-subject')]
					.find((el) => el.querySelector('.tv-admin-pin')?.textContent?.trim() === ${JSON.stringify(PIN)});
				return subject ? [...subject.querySelectorAll('.tv-admin-tokens li')].map((li) => li.innerText.replace(/\\s+/g, ' ')) : [];
			})()`);
			check(rows.length === 2, "清单里两枚令牌都在（吊销的那枚 + 新补发的）", rows.join(" ｜ "));
			check(rows.some((row) => row.includes("已吊销")) && rows.some((row) => row.includes("还没用过")), "状态各自如实：一枚「已吊销」、一枚「还没用过」");

			await browser.evaluate("document.querySelector('#ad-saved').click()");
			await browser.evaluate("document.querySelector('.tv-admin-secret-dismiss').click()");
			await pageSignOut(browser);
			await browser.goto(env.browser.url("/tavern/submit"));
			await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-wb-auth input[type=\\"password\\"]') !== null", 10000)`);
			await browser.evaluate(`(() => {
				const set = ${PAGE_SET_INPUT};
				set('.tv-wb-auth input[type="text"]', ${JSON.stringify(PIN)});
				set('.tv-wb-auth input[type="password"]', ${JSON.stringify(newToken)});
				return true;
			})()`);
			await browser.evaluate("document.querySelector('.tv-wb-auth button[type=\"submit\"]').click()");
			const backIn = await browser.evaluate(`(${PAGE_WAIT})("document.body.innerText.includes('已登录')", 10000)`);
			check(backIn, "★ 本人用补发的凭证立刻回到工作台（吊销 ≠ 把人永久踢出去）");
		} finally {
			await browser.close();
		}
	}
};
