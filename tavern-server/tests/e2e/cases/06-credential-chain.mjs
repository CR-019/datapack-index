/**
 * 用例 06 · 凭证链路（接口层）：管理员签发 pin+token → 本人填写 → 投稿 → 上架
 * =============================================================================
 * 前面几条用例的凭证都是**夹具直接往库里插行**造出来的（harness 的 installPrincipals），
 * 于是"签发"这条真路径从来没被跑过。这条用例把那条缺口补上：管理员走真接口签发
 * 一对凭证，**本人**拿这对凭证登录、投稿，管理员审核上架。
 *
 * 为什么这件事值得单独一条用例：签发是整个身份体系唯一的入口（没有公开注册），
 * 而它有几个只在"真跑一遍"时才暴露的点 ——
 *   · 明文令牌是不是只回一次（会不会顺手写进审计/日志/列表接口）
 *   · 新建的主体有没有同时补上已发布修订（否则公开面看不到这个作者）
 *   · 吊销之后，**已经建立的会话**是不是立刻失效（不是只挡住下次登录）
 *   · 最后一枚工作组凭证被吊销，是不是整个工作组就再也进不来了
 *
 * 这条用例全程走 HTTP、不起浏览器，所以 CI 的 verify job 每次都会真跑它。
 * 页面那一半（管理台点签发 → 工作台填 pin+token）在 07，需要 --browser。
 */

import { buildZip } from "../harness.mjs";

const NEW_PIN = "e2e-chain-author";
const NEW_NAME = "E2E 链路作者";
const NEW_ACCOUNT = `person:${NEW_NAME}`;
const NODE_ID = "project:e2e-credential-chain";

export default {
	title: "凭证签发链路（接口）",
	async run(env) {
		const { api, check, step, pins, tokens } = env;
		const staff = await api.login(pins.staff, tokens.staff);
		const author = await api.login(pins.author, tokens.author);

		step("越权：签发与列表只认工作组");
		const anonymous = await api.createAuthor("", { pin: "nobody", name: "无主" });
		check(anonymous.status === 401, "匿名不能签发凭证", `HTTP ${anonymous.status}`);
		const byAuthor = await api.createAuthor(author.cookie, { pin: "nobody", name: "无主" });
		check(byAuthor.status === 403, "作者不能给自己签发凭证（否则等于公开注册）", `HTTP ${byAuthor.status}`);
		check((await api.credentials(author.cookie)).status === 403, "作者看不到凭证列表");

		step("管理员签发一对凭证（本人从没见过这个账号）");
		const issued = await api.createAuthor(staff.cookie, {
			pin: NEW_PIN,
			name: NEW_NAME,
			kind: "person",
			role: "author",
			label: "e2e 走查",
			reason: "走查：验证签发链路",
		});
		check(issued.status === 201, "签发成功", JSON.stringify(issued.payload?.message ?? issued.payload));
		check(issued.payload?.subject?.id === NEW_ACCOUNT, "主体 id = person:显示名", issued.payload?.subject?.id);
		const plaintext = issued.payload?.token?.plaintext ?? "";
		check(/^[0-9A-HJKMNP-TV-Z]{32}$/.test(plaintext), "★ 拿到 32 位明文令牌（唯一一次）", `${plaintext.length} 字符`);
		check(issued.headers?.get("cache-control") === "no-store", "★ 明文令牌的响应不可缓存（否则它会进浏览器/代理缓存）");

		const console_ = await api.credentials(staff.cookie);
		const dump = JSON.stringify(console_.payload);
		check(!dump.includes(plaintext), "★ 管理台接口不回明文令牌");
		check(!/[0-9a-f]{64}/.test(dump), "★ 管理台接口也不回令牌哈希（响应会被截图、被复制粘贴）");
		check(dump.includes("token.issued"), "签发动作进了审计（谁签发了谁必须可查 §7.4 ⑦）");
		check(String(console_.payload?.trail?.[0]?.actor ?? "") === pins.staff, "审计记的是签发人", String(console_.payload?.trail?.[0]?.actor));

		step("本人拿 pin + token 登录（就是工作台第 0 步做的那件事）");
		const login = await api.login(NEW_PIN, plaintext);
		check(login.status === 200, "★ 刚签发的凭证立刻能换会话", `HTTP ${login.status}`);
		check(login.payload?.account?.id === NEW_ACCOUNT, "会话属于被签发的那个人", login.payload?.account?.id);
		check(login.payload?.account?.role === "author", "角色是作者", login.payload?.account?.role);
		const user = { cookie: login.cookie };
		const me = await api.me(user.cookie);
		check(me.status === 200 && me.payload?.account?.pin === NEW_PIN, "/v1/me 认得出是谁");

		const profile = await api.request(`/v1/authors/${encodeURIComponent(NEW_ACCOUNT)}`);
		check(profile.status === 200, "新建的主体在公开面立刻可见（签发时要一并补上已发布修订）", `HTTP ${profile.status}`);

		step("本人投稿 → 待审 → 上架");
		const zip = await buildZip({
			slug: "e2e-credential-chain",
			meta: { template: 1, kind: "project", name: "E2E 凭证链路", tags: ["e2e走查"], summary: "由签发出来的凭证投稿" },
			body: "# 凭证链路\n\n这条内容由管理员签发凭证的人提交。\n",
		});
		check((await api.detail(NODE_ID)).status === 404, "投稿前公开面没有它");
		const submitted = await api.submitZip(user.cookie, zip, { filename: "e2e-credential-chain.zip", slug: "e2e-credential-chain" });
		check(submitted.status === 201, "★ 用签发来的会话能真投稿", JSON.stringify(submitted.payload?.errors ?? submitted.payload?.message ?? ""));
		check((await api.detail(NODE_ID)).status === 404, "待审期间公开面仍 404");

		const queue = (await api.queue(staff.cookie)).payload?.items ?? [];
		const mine = queue.find((item) => item.nodeId === NODE_ID);
		check(Boolean(mine), "审核队列里出现了它", mine ? `revision=${mine.revisionId}` : "（队列里没有）");
		if (!mine) return;   // 投稿没进去就没什么可审的了，别让后面抛异常盖住真正的原因
		const approved = await api.review(staff.cookie, mine.revisionId, "approve");
		check(approved.status === 200, "管理员审核通过");
		const detail = await api.detail(NODE_ID);
		check(detail.status === 200 && JSON.stringify(detail.payload).includes("E2E 凭证链路"), "公开面出现了这条投稿");

		step("吊销 → 立刻失效（含已经建立的会话）");
		const revoke = await api.revokeToken(staff.cookie, NEW_ACCOUNT, issued.payload.token.id, "走查结束，回收凭证");
		check(revoke.status === 200, "★ 管理员吊销令牌", JSON.stringify(revoke.payload?.message ?? ""));
		check(revoke.payload?.killedSessions >= 1, "★ 连带掐掉了本人正在用的会话", `killedSessions=${revoke.payload?.killedSessions}`);
		check((await api.me(user.cookie)).status === 401, "★ 已建立的会话立刻失效（不是只挡住下次登录）");
		check((await api.login(NEW_PIN, plaintext)).status === 401, "再用这枚令牌登录也不行");
		// 但上架的内容不受影响：吊销的是**写入权限**，不是他的作品
		check((await api.detail(NODE_ID)).status === 200, "吊销凭证不影响已经上架的内容");

		step("随时补发 / 轮换（丢了、泄露了、换设备）");
		const reissued = await api.issueToken(staff.cookie, NEW_ACCOUNT, "第二台设备");
		check(reissued.status === 201, "★ 给已有主体补发一枚令牌（不必重新建主体）", JSON.stringify(reissued.payload?.message ?? ""));
		const secondDevice = await api.login(NEW_PIN, reissued.payload?.token?.plaintext);
		check(secondDevice.status === 200, "补发的令牌立刻能用");

		const rotated = await api.rotateToken(staff.cookie, NEW_ACCOUNT, reissued.payload.token.id, "走查：换设备");
		check(rotated.status === 201, "★ 轮换：补发新的 + 吊销旧的，一步到位", JSON.stringify(rotated.payload?.message ?? ""));
		check(rotated.payload?.revokedTokenId === reissued.payload.token.id, "回执要点明作废的是哪一枚");
		check((await api.me(secondDevice.cookie)).status === 401, "轮换后旧令牌的会话立刻失效");
		check((await api.login(NEW_PIN, reissued.payload.token.plaintext)).status === 401, "旧令牌登不进来");
		const rotatedToken = rotated.payload?.token?.plaintext;
		check((await api.login(NEW_PIN, rotatedToken)).status === 200, "★ 新令牌立即可用");

		step("停用 / 恢复（人离开了，作品还在）");
		const suspended = await api.setStatus(staff.cookie, NEW_ACCOUNT, "suspended", "走查：作者离职");
		check(suspended.status === 200, "★ 停用账号", JSON.stringify(suspended.payload?.message ?? ""));
		check((await api.login(NEW_PIN, rotatedToken)).status === 401, "★ 停用后连登录都不行（与「令牌错」给同一条信息）");
		check((await api.detail(NODE_ID)).status === 200, "★ 已上架的内容不受影响 —— 停用针对的是人，不是作品");
		const reactivated = await api.setStatus(staff.cookie, NEW_ACCOUNT, "active", "走查：作者回来了");
		check(reactivated.status === 200, "恢复账号");
		check((await api.login(NEW_PIN, rotatedToken)).status === 200, "★ 恢复后**原来那枚令牌**就能用（不需要重新签发、重新交付）");

		step("守门：最后一枚工作组凭证不许吊销");
		/*
		 * 要触发这条守门，得先让"只剩一枚"成立 —— 夹具里那个 staff 账号至少有两枚
		 * 有效令牌（bootstrap 那枚的哈希还在库里 + 夹具又插了一枚），所以先收掉别的。
		 *
		 * 收尾的会话必须来自**新签发**的工作组凭证：吊销某一枚令牌会连带掐掉
		 * 由它派生的会话，用旧会话去收令牌，收到一半自己就被踢出去了。
		 */
		const adminIssued = await api.createAuthor(staff.cookie, {
			pin: "e2e-admin", name: "E2E 管理员", role: "staff", label: "走查用管理员",
			reason: "走查：验证最后一枚凭证守门",
		});
		check(adminIssued.status === 201, "顺带验证：签到是一名工作组同事", JSON.stringify(adminIssued.payload?.message ?? ""));
		const adminLogin = await api.login("e2e-admin", adminIssued.payload?.token?.plaintext);
		check(adminLogin.status === 200 && adminLogin.payload?.account?.role === "staff", "新签的工作组账号能登录");
		const admin = { cookie: adminLogin.cookie };

		const keep = adminIssued.payload.token.id;
		const activeStaffTokens = ((await api.credentials(admin.cookie)).payload?.subjects ?? [])
			.filter((subject) => subject.role === "staff")
			.flatMap((subject) => subject.tokens.filter((token) => !token.revokedAt).map((token) => ({ accountId: subject.id, tokenId: token.id })));
		const others = activeStaffTokens.filter((entry) => entry.tokenId !== keep);
		check(others.length > 0, "夹具里本来就不止一枚工作组令牌（否则这条守门根本触发不到）", `${others.length} 枚`);
		for (const other of others) {
			const gone = await api.revokeToken(admin.cookie, other.accountId, other.tokenId, "走查：清掉旧的工作组令牌");
			check(gone.status === 200, `先吊销旧令牌 ${other.tokenId}`, `HTTP ${gone.status}`);
		}

		const lastOne = await api.revokeToken(admin.cookie, adminIssued.payload.subject.id, keep);
		check(lastOne.status === 409, "★ 拒绝吊销最后一枚工作组凭证", `HTTP ${lastOne.status}`);
		check(lastOne.payload?.error === "last_staff_credential", "拒绝的理由是可读的错误码", String(lastOne.payload?.error));
		check((await api.me(admin.cookie)).status === 200, "被拒之后，管理员自己的会话完好无损");

		step("守门：pin 撞车会被拦住");
		const taken = await api.createAuthor(admin.cookie, { pin: NEW_PIN.toUpperCase(), name: "另一个人" });
		check(taken.status === 409 && taken.payload?.error === "pin_taken", "★ pin 查重不区分大小写（否则会出现两个看起来一样的身份）", `HTTP ${taken.status}`);
		const occupied = await api.createAuthor(admin.cookie, { pin: "another-pin", name: NEW_NAME });
		check(occupied.status === 409 && occupied.payload?.error === "already_claimed", "已认领的主体只能补发令牌，不能造第二个身份", String(occupied.payload?.error));

		step("通配 CORS 只给公开只读面");
		const readCors = (await api.status()).headers?.get("access-control-allow-origin");
		const writeCors = issued.headers?.get("access-control-allow-origin");
		check(readCors === "*", "公开只读接口仍然允许跨源读（静态站兜底要靠它）", String(readCors));
		check(!writeCors, "★ 签发这种写接口不带通配 CORS（写接口只服务同源前端）", String(writeCors));
	}
};
