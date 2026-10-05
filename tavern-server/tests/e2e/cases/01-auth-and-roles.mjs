/**
 * 用例 01 · 身份、角色与越权矩阵
 * =============================================================================
 * 不问"功能有没有"，只问"谁能做、谁不能做"：
 *   · pin + token → 会话；错令牌被拒（且错误信息不泄露"pin 是否存在"）
 *   · 吊销令牌立即失效；登出后会话失效
 *   · 作者 vs 工作组：审核队列、审稿、改条目三条边界
 *   · 匿名：一律 401
 */

export default {
	title: "身份与越权矩阵",
	async run(env) {
		const { api, check, step, pins, tokens } = env;

		step("登录");
		const staff = await api.login(pins.staff, tokens.staff);
		check(staff.status === 200 && staff.payload?.account?.role === "staff", "工作组登录", `role=${staff.payload?.account?.role}`);
		const author = await api.login(pins.author, tokens.author);
		check(author.status === 200 && author.payload?.account?.role === "author", "作者登录", `role=${author.payload?.account?.role}`);
		const other = await api.login(pins.other, tokens.other);
		check(other.status === 200, "另一位作者登录（越权用例必须有独立账号）");

		const wrong = await api.login(pins.author, "NOT-A-REAL-TOKEN");
		check(wrong.status === 401, "错令牌被拒");
		check(
			String(wrong.payload?.message ?? "").includes("pin 或 token 不正确"),
			"错误信息不区分「pin 不存在」与「token 错」（否则成了账号探测器）",
			wrong.payload?.message,
		);
		const missing = await api.login("definitely-not-a-pin", "whatever");
		check(missing.status === 401 && missing.payload?.message === wrong.payload?.message, "两种失败的文案完全一致");

		step("会话");
		const me = await api.me(author.cookie);
		check(me.status === 200 && me.payload?.account?.pin === pins.author, "/v1/me 认得出是谁");
		check(me.payload?.permissions?.isStaff === false, "作者不是工作组");
		const staffMe = await api.me(staff.cookie);
		check(staffMe.payload?.permissions?.isStaff === true, "工作组 isStaff = true");
		const noCookie = await api.me("");
		check(noCookie.status === 401, "没有会话 → 401");
		await api.logout(author.cookie);
		check((await api.me(author.cookie)).status === 401, "登出后原会话立即失效");
		const relogin = await api.login(pins.author, tokens.author);
		check(relogin.status === 200, "重新登录可用（令牌没被登出动作吊销）");
		// 旧会话已经作废了，后面必须用新 cookie —— 否则测出来的是 401 而不是 403
		author.cookie = relogin.cookie;

		step("审核边界");
		check((await api.queue(author.cookie)).status === 403, "作者看审核队列 → 403");
		check((await api.queue("")).status === 401, "匿名看审核队列 → 401");
		check((await api.queue(staff.cookie)).status === 200, "工作组看审核队列 → 200");
		check((await api.review(author.cookie, "rev_whatever", "approve")).status === 403, "作者审稿 → 403");
		check((await api.review("", "rev_whatever", "approve")).status === 401, "匿名审稿 → 401");
		const notFound = await api.review(staff.cookie, "rev_does_not_exist", "approve");
		check(notFound.status === 404, "工作组审一条不存在的修订 → 404（不是 500）");
		check((await api.review(staff.cookie, "rev_whatever", "delete")).status === 400, "action 只接受 approve / reject");

		step("修改边界（收敛型直通）");
		const target = "project:atlas";
		check((await api.patch(staff.cookie, target, { state: "paused" })).status === 200, "工作组可改任意条目");
		check((await api.patch(staff.cookie, target, { state: "active" })).status === 200, "改回来");
		check([401, 403].includes((await api.patch("", target, { state: "paused" })).status), "匿名改条目被拒");
		const stranger = await api.patch(other.cookie, target, { state: "paused" });
		check(stranger.status === 403, "非维护者改别人的条目 → 403", `HTTP ${stranger.status}`);
		const badField = await api.patch(staff.cookie, target, { body: "想把正文塞进直通通道" });
		check([400, 403].includes(badField.status), "扩张型字段（正文）不能走收敛型直通", `HTTP ${badField.status}`);

		step("令牌吊销");
		const { DatabaseSync } = await import("node:sqlite");
		const db = new DatabaseSync(env.dbPath);
		// 按 **id** 吊销作者那把令牌。（原来上面还有一句 `WHERE hash = 'not-a-hash'`，
		// 影响 0 行 —— 那不是测试，只是让人以为测了什么，删掉。）
		const tokenRow = db.prepare("SELECT id FROM tokens WHERE account_id = ? AND label = 'e2e author'").get(env.principals.author.id);
		check(Boolean(tokenRow), "夹具里找得到作者那把令牌");
		db.prepare("UPDATE tokens SET revoked_at = ? WHERE id = ?").run(new Date().toISOString(), tokenRow?.id);
		db.close();
		check((await api.login(pins.author, tokens.author)).status === 401, "令牌吊销后立刻登不进来");
	}
};
