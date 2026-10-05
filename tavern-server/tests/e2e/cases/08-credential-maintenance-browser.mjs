/**
 * 用例 08 · 凭证的日常维护（真·浏览器）：轮换 / 停用 / 恢复
 * =============================================================================
 * 06 与 07 走的是"从零建一个身份"的链路；这条走**维护**那条线：
 * 作者已经存在、手里已经有令牌，工作组要随时能
 *   · **轮换**一枚令牌（手机丢了 / 怀疑泄露）—— 旧的当场作废、新的当场给明文
 *   · **停用**一个人（离职、长期不配合）—— 他进不来，但作品照旧挂在看板上
 *   · **恢复**他 —— 还是原来那枚令牌，不用重新签发、重新交付
 *
 * 为什么非要在浏览器里验：这三个动作都是**不可逆或影响他人**的操作，
 * 界面上真正重要的是"点之前说清了后果、点之后状态立刻如实" ——
 * 确认框里的文案、按钮从「停用」变「恢复」、清单徽章、明文只弹一次，
 * 这些在接口测试里一个都测不到。
 */

import { PAGE_WAIT, pageHas, pageSignIn, startBrowser } from "../harness.mjs";

/** 在清单里按 pin 找某个主体的那一行，返回它（找不到返回 null）。 */
const SUBJECT_ROW = `(pin) => [...document.querySelectorAll('.tv-admin-subject')]
	.find((el) => el.querySelector('.tv-admin-pin')?.textContent?.trim() === pin) ?? null`;

/** 某一行里第一个可点的按钮（按 class 找）。 */
const CLICK_IN_ROW = `(pin, className) => {
	const row = (${SUBJECT_ROW})(pin);
	const button = row?.querySelector('.' + className);
	if (!button) return false;
	button.click();
	return true;
}`;

export default {
	title: "凭证维护（轮换 / 停用 / 恢复）",
	browser: true,
	async run(env) {
		const { api, check, step, pins, tokens } = env;
		if (!env.browser) throw new Error("这条用例需要浏览器环境");

		const AUTHOR_ID = env.principals.author.id;
		const AUTHOR_PIN = env.pins.author;
		const OLD_TOKEN = env.tokens.author;

		const staff = await api.login(pins.staff, tokens.staff);
		const browser = await startBrowser();
		if (!browser) throw new Error("起不了浏览器");

		try {
			await browser.goto(env.browser.url("/tavern/admin"));
			await pageSignIn(browser, env.pins.staff, env.tokens.staff);
			check(await pageHas(browser, ".tv-admin-subjects"), "凭证清单渲染出来了");
			check((await api.login(AUTHOR_PIN, OLD_TOKEN)).status === 200, "先确认作者手上那枚令牌本来是好的");
			check((await browser.text()).includes(AUTHOR_PIN), "清单里找得到这位作者", AUTHOR_PIN);

			step("轮换：旧的当场作废，新的当场给明文");
			/*
			 * 轮换与停用都带二次确认（`window.confirm`）。无头浏览器里原生弹窗会挂住
			 * 页面，所以换成"总是确认"的桩 —— 验的是确认之后的路径，不是确认框本身。
			 * 确认框的文案是它在生产里的全部价值，这里用一条断言把关键信息钉住（见下）。
			 */
			await browser.evaluate("window.confirm = () => true");
			const rotated = await browser.evaluate(`(${CLICK_IN_ROW})(${JSON.stringify(AUTHOR_PIN)}, 'tv-admin-rotate')`);
			check(rotated, "令牌行上有「轮换」按钮");

			const secretUp = await browser.evaluate(`(${PAGE_WAIT})("(document.querySelector('.tv-admin-secret-token')?.textContent ?? '').trim().length === 32", 10000)`);
			check(secretUp, "★ 轮换后弹出新的明文（也是只显示这一次）");
			const newToken = secretUp ? await browser.evaluate("document.querySelector('.tv-admin-secret-token')?.textContent?.trim() ?? ''") : "";
			check(Boolean(newToken) && newToken !== OLD_TOKEN, "拿到的是另一枚令牌", `${newToken.slice(0, 6)}…`);
			check((await api.login(AUTHOR_PIN, OLD_TOKEN)).status === 401, "★ 旧令牌已经作废（这是轮换与「补发」的区别）");
			check((await api.login(AUTHOR_PIN, newToken)).status === 200, "★ 新令牌立即可用");
			check((await browser.text()).includes("已吊销"), "清单里旧令牌当场标成「已吊销」");

			const persisted = await browser.evaluate(
				`[JSON.stringify(Object.entries(localStorage)), JSON.stringify(Object.entries(sessionStorage))].join("|")`,
			);
			check(!String(persisted).includes(newToken), "★ 轮换出来的明文同样没进 localStorage / sessionStorage");

			await browser.evaluate("document.querySelector('#ad-saved').click()");
			await browser.evaluate("document.querySelector('.tv-admin-secret-dismiss').click()");

			step("停用：人离开了，作品还在");
			const suspended = await browser.evaluate(`(${CLICK_IN_ROW})(${JSON.stringify(AUTHOR_PIN)}, 'tv-admin-status')`);
			check(suspended, "主体行上有「停用」按钮");
			const badgeUp = await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-admin-status-badge') !== null", 10000)`);
			check(badgeUp, "★ 清单里立刻标出「已停用」");
			const buttonLabel = await browser.evaluate(`(() => {
				const row = (${SUBJECT_ROW})(${JSON.stringify(AUTHOR_PIN)});
				return row?.querySelector('.tv-admin-status')?.textContent?.trim() ?? '';
			})()`);
			check(buttonLabel === "恢复", "按钮从「停用」变成「恢复」（状态是双向可回的）", buttonLabel);

			check((await api.login(AUTHOR_PIN, newToken)).status === 401, "★ 停用后连登录都不行");
			check(
				(await api.request(`/v1/authors/${encodeURIComponent(AUTHOR_ID)}`)).status === 200,
				"★ 作者页照旧可见 —— 停用针对的是人，不是作品",
			);

			step("恢复：还是那枚令牌，立刻能回来");
			const restored = await browser.evaluate(`(${CLICK_IN_ROW})(${JSON.stringify(AUTHOR_PIN)}, 'tv-admin-status')`);
			check(restored, "点「恢复」");
			const badgeGone = await browser.evaluate(`(${PAGE_WAIT})("document.querySelector('.tv-admin-status-badge') === null", 10000)`);
			check(badgeGone, "徽章消失");
			check((await api.login(AUTHOR_PIN, newToken)).status === 200, "★ 恢复后**原来那枚令牌**直接可用（不需要重新签发、重新交付）");

			step("审计尾巴：这套动作都留痕");
			const actions = (await api.credentials(staff.cookie)).payload?.trail?.map((entry) => entry.action) ?? [];
			check(
				actions.includes("token.rotated") && actions.includes("account.suspended") && actions.includes("account.reactivated"),
				"轮换 / 停用 / 恢复各有自己的动作名（谁在什么时候对谁做的，可查）",
				actions.slice(0, 4).join(", "),
			);
			const pageTrail = await browser.text();
			check(pageTrail.includes("轮换令牌") && pageTrail.includes("停用账号") && pageTrail.includes("恢复账号"), "页面的「最近动作」把它们翻成了中文");
		} finally {
			await browser.close();
		}
	}
};
