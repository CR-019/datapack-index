/**
 * 用例 02 · 投稿 → 审核 → 上架（完整生命周期）
 * =============================================================================
 * 这一条就是最初手跑的那一条，搬进专题里当第 2 个 case。它盯的是：
 *   · 待审期间公开面**完全**看不到（列表 / 详情 / 时间线）
 *   · ★ **后台不把待审内容给作者**（作者自己的详情接口也是 404）——
 *     这是"仅作者可见只能靠本地缓存实现"的依据
 *   · 审核通过才上架；上架**要留一条事件**（ADR-009 / §6.6）
 *   · 上架后再投稿：公开面仍显示旧版，直到新版过审
 *   · 驳回的修订永不上架；同一条修订不能重复上架
 */

import { buildZip } from "../harness.mjs";

const SLUG = "e2e-lifecycle";
const TITLE = "E2E Lifecycle Entry";
// slug 由 name 派生（`slugify("E2E Lifecycle Entry")` → e2e-lifecycle-entry），
// 所以节点 id 以服务端返回为准，别硬编码 —— 这条断言本身就是个坑，踩过一次。
let NODE_ID = `project:${SLUG}`;
// 第一版不带 slug（由 name 派生），拿到服务端返回的真实 id 之后，后续版本都显式带它
let ANCHOR_SLUG = null;
const SECOND = "E2E Lifecycle Entry v2";

export default {
	title: "投稿 → 审核 → 上架",
	async run(env) {
		const { api, check, step, pins, tokens } = env;
		const author = await api.login(pins.author, tokens.author);
		const staff = await api.login(pins.staff, tokens.staff);

		step("投稿前");
		check((await api.search(TITLE)).payload?.total === 0, "公开列表还没有它");
		check((await api.detail(NODE_ID)).status === 404, "公开详情 404");

		step("作者上传");
		const zip = await buildZip({
			slug: SLUG,
			meta: { template: 1, kind: "project", name: TITLE, summary: "E2E 生命周期走查", tags: ["e2e走查"], gameversion: "1.21.9" },
			extras: { "recruit/测试.md": "---\nrole: 测试\nheadcount: 3\nstatus: open\n---\n" },
		});
		check((await api.submitZip("", zip)).status === 401, "匿名投稿 → 401");
		const submitted = await api.submitZip(author.cookie, zip);
		check(submitted.status === 201 && submitted.payload?.status === "pending", "投稿被接收，状态 pending", submitted.payload?.message);
		NODE_ID = submitted.payload?.nodeId ?? NODE_ID;
		ANCHOR_SLUG = NODE_ID.split(":").slice(1).join(":");
		check(NODE_ID.startsWith("project:"), "节点 id 按 kind:slug 生成", NODE_ID);
		check(NODE_ID !== `project:${SLUG}`, "slug 由 name 派生（不是 multipart 里手填的）", `${TITLE} → ${NODE_ID}`);
		const revisionId = submitted.payload?.revisionId;

		step("待审期间 · 公开面");
		check((await api.search(TITLE)).payload?.total === 0, "公开列表 0 条");
		check((await api.detail(NODE_ID)).status === 404, "公开详情 404");
		const timeline = JSON.stringify((await api.timeline()).payload);
		check(!timeline.includes(TITLE) && !timeline.includes(NODE_ID), "公开时间线里既没有标题也没有 id");
		check((await api.events(NODE_ID)).status === 404, "未上架条目的公开事件接口 404");

		step("待审期间 · 作者自己能看到什么（本地缓存的依据）");
		const me = await api.me(author.cookie);
		const meText = JSON.stringify(me.payload);
		check(!meText.includes(TITLE), "★ /v1/me 不返回待审标题");
		check(!["snapshot", "snapshot_json", "revision"].some((key) => meText.includes(`"${key}"`)), "★ /v1/me 没有修订/快照字段", Object.keys(me.payload ?? {}).join(","));
		check((await api.detail(NODE_ID, author.cookie)).status === 404, "★ 作者本人也拿不到待审详情（后台不提供）");
		check(me.payload?.maintained?.some((entry) => entry.id === NODE_ID), "投稿时自动建立 maintains 边（作者成为维护者）");

		step("工作组队列与上架");
		const queue = await api.queue(staff.cookie);
		const mine = queue.payload?.items?.find((item) => item.revisionId === revisionId);
		check(Boolean(mine), "队列里有这条待审修订", mine ? `title=${mine.title} waiting=${mine.waitingHours}h` : "");
		check(Boolean(mine) && !("snapshot" in mine) && !("body" in mine), "队列只给元信息，不带正文快照", mine ? Object.keys(mine).join(",") : "（队列里没有这条）");
		const approved = await api.review(staff.cookie, revisionId, "approve");
		check(approved.status === 200 && approved.payload?.status === "published", "审核通过 → 上架");

		const events = await api.events(NODE_ID);
		check((events.payload?.total ?? 0) > 0, "★ 上架留了一条事件（ADR-009：审核通过应补 milestone）", `events=${events.payload?.total ?? 0}`);
		check(
			(events.payload?.items ?? []).some((item) => item.kind === "milestone" && item.title === "内容更新"),
			"事件形状符合 §6.6 对照表：{kind: milestone, title: 内容更新}",
		);

		const detail = await api.detail(NODE_ID);
		check(detail.status === 200, "上架后公开详情 200");
		check(JSON.stringify(detail.payload).includes(TITLE), "公开面是已审的那一版");
		check((detail.payload?.node?.recruit ?? []).some((role) => role.role === "测试"), "招募岗位随投稿一起上架", JSON.stringify(detail.payload?.node?.recruit));

		step("第二版：未审不得覆盖公开面");
		const zip2 = await buildZip({
			slug: SLUG,
			meta: { template: 1, kind: "project", name: SECOND, summary: "第二版（未审）", tags: ["e2e走查"] },
		});
		const second = await api.submitZip(author.cookie, zip2, { slug: ANCHOR_SLUG });
		check(second.status === 201, "第二版进入 pending");
		check(second.payload?.nodeId === NODE_ID, "★ 带 slug 时命中**同一个**条目（改版不是新建）", second.payload?.nodeId);
		const stillOld = await api.detail(NODE_ID);
		check(JSON.stringify(stillOld.payload).includes(TITLE) && !JSON.stringify(stillOld.payload).includes(SECOND), "★ 公开面仍显示旧版");
		check((await api.search(SECOND)).payload?.total === 0, "★ 公开列表搜不到未审标题");
		check((await api.review(staff.cookie, second.payload.revisionId, "approve")).status === 200, "第二版审核通过");
		check(JSON.stringify((await api.detail(NODE_ID)).payload).includes(SECOND), "公开面切到新版");

		step("驳回分支");
		const zip3 = await buildZip({ slug: SLUG, meta: { template: 1, kind: "project", name: "E2E Lifecycle v3", summary: "将被驳回" } });
		const third = await api.submitZip(author.cookie, zip3, { slug: ANCHOR_SLUG });
		const rejected = await api.review(staff.cookie, third.payload.revisionId, "reject", "走查：故意驳回");
		check(rejected.status === 200 && rejected.payload?.status === "rejected", "工作组驳回");
		const after = JSON.stringify((await api.detail(NODE_ID)).payload);
		check(!after.includes("E2E Lifecycle v3"), "驳回的内容没进公开面");
		check((await api.search("E2E Lifecycle v3")).payload?.total === 0, "驳回的内容搜不到");
		check((await api.review(staff.cookie, third.payload.revisionId, "approve")).status === 409, "同一条修订不能重复上架（状态机拦住）");

		step("投稿质量门（前端校验的权威在后端）");
		// 规则钉死：不传 slug 时节点身份由 name 派生 —— 换个标题名就等于换了个条目。
		// 工作台必须把 slug 显式带上（并在条目已存在后锁死它），否则作者会莫名其妙多出条目。
		const noSlug = await api.submitZip(author.cookie, await buildZip({
			slug: "e2e-lifecycle-renamed",
			meta: { template: 1, kind: "project", name: "E2E Lifecycle Renamed", summary: "换个名字再传一次" },
		}));
		check(noSlug.status === 201 && noSlug.payload?.nodeId === "project:e2e-lifecycle-renamed",
			"★ 不带 slug 时按 name 派生 → 变成**另一个**新条目（工作台必须显式带 slug）",
			`${noSlug.payload?.nodeId}（原条目 ${NODE_ID}）`);
		const badZip = await buildZip({ slug: "e2e-bad", meta: { template: 1, kind: "project", name: "E2E Bad" } });
		const missing = await api.submitZip(author.cookie, badZip);
		check(missing.status === 422, "缺 summary 等必填 → 422 而不是静默收下", `HTTP ${missing.status}`);
		check(Array.isArray(missing.payload?.errors), "422 里逐条给出错误清单（供前端回填提示）", JSON.stringify(missing.payload?.errors?.map((e) => e.code)));
		// 第三个参数是选项对象（`{ filename }`）；以前这里传的是裸字符串，
		// 于是文件名落回默认值 —— "假装成 .zip 的坏文件"那个意图根本没生效。
		const notZip = await api.submitZip(author.cookie, Buffer.from("这不是 zip"), { filename: "fake.zip" });
		check(notZip.status === 422 || notZip.status === 415, "不是 zip 的文件被拒", `HTTP ${notZip.status}`);
	}
};
