/**
 * 投稿工作台 · 数据模型（类型即模板）
 * =============================================================================
 * 这个模块是**工作台页面与 E2E 用例共用**的那一份：把"作者在表单里填的东西"
 * 变成"一个 zip"，以及"本地预检该报什么错"。
 *
 * 为什么类型要这样分（对应"工作台该不该区分赛事/作品/作者/团队"这个设计问题）：
 *
 *   · `kind` 在设计里只是一副**眼镜**（选模板 / 选校验 / 选默认排序），不是数据建模的轴。
 *     所以工作台问的不该是"你要创建哪种实体"，而是"**你手上有什么**"。
 *   · 走 zip 管线、要过审的那三种（作品 project / 赛事 event / 合集 index）共享同一条
 *     流水线，差的是**模板字段**与**校验 profile** —— 这就是"类型下拉"的全部意义。
 *   · **作者 / 团队不是投稿类型**：它们是主体（principal），不是内容。ingest 的
 *     `KINDS` 只有三种，把"作者"放进下拉框，作者传个 zip 上来只会 422。
 *     认领身份、改团队那是另一条路（不进 zip、不走审核）。
 *
 * M1 只开 **作品 / 赛事** 两种：
 *   · 合集（index）的成员是 `includes` 边，而目前**没有任何接口能建 includes**（走查已记为 GAP），
 *     交上来只能是个空壳，所以先不开；
 *   · 团队同样没有创建接口。
 * 等后端补齐那两组接口，这里加一条 `WORKBENCH_TYPES` 记录就能开。
 */

/**
 * 后端 ingest 的硬限制（此处镜像，权威仍以后端为准 —— 前端校验只是体验）。
 * ⚠️ 数值必须**逐项对齐** `tavern-server/src/ingest.mjs` 的 LIMITS：本地预检存在的
 * 意义就是"别让作者等审核员才发现问题"，两边不一致就会制造"预检绿、后端 422"的假象
 * （实测过：13 个招募岗位、3 MB 素材都是前端说没问题、后端直接拒）。
 */
export const LIMITS = Object.freeze({
	maxNameLength: 60,
	maxSummaryLength: 120,
	maxTags: 24,
	maxBodyBytes: 200 * 1024,
	maxRecruit: 12,
	maxAssetBytes: 2 * 1024 * 1024,
	maxAssets: 30,
	maxArchiveBytes: 20 * 1024 * 1024,
});

/**
 * 可投稿的类型 = "眼镜"。`fields` 决定表单渲染什么，`validate` 决定本地预检拦什么。
 */
export const WORKBENCH_TYPES = Object.freeze([
	Object.freeze({
		kind: "project",
		label: "作品",
		hint: "数据包、资源包、工具、库 —— 你在做的东西。",
		fields: ["name", "summary", "tags", "gameversion", "repo", "body", "recruit"],
	}),
	Object.freeze({
		kind: "event",
		label: "赛事",
		hint: "有开始与结束的社区活动（创作赛、Jam）。必须有时间窗。",
		fields: ["name", "summary", "tags", "time", "body", "recruit"],
	}),
]);

/** 类型元数据。未知 kind 退回作品（后端默认也是 project）。 */
export function typeOf(kind) {
	return WORKBENCH_TYPES.find((entry) => entry.kind === kind) ?? WORKBENCH_TYPES[0];
}

export function emptyDraft(kind = "project") {
	return {
		kind,
		slug: "",
		name: "",
		summary: "",
		tags: [],
		gameversion: "",
		repo: "",
		license: "",
		time: { start: "", end: "", deadline: "" },
		body: "",
		recruit: [],
		assets: [],
	};
}

/**
 * 标签归一化：去空白、按小写去重（与后端同一口径），保留首次写法。
 *
 * ⚠️ 逗号在这里就切开：frontmatter 是 `tags: [a, b]` 这种内联列表，后端的解析器
 * 按逗号拆项 —— 一个含逗号的标签在那边会**变成两个标签**（实测 `[工具, 库]` →
 * `["工具","库"]`）。与其让作者看到"我写了一个标签、上架后成了两个"，不如在入口就切开，
 * 与后端口径一致。
 */
export function normalizeTags(tags) {
	const seen = new Set();
	const out = [];
	for (const raw of Array.isArray(tags) ? tags : []) {
		for (const piece of String(raw ?? "").split(/[,，]/)) {
			const text = piece.trim();
			if (!text) continue;
			const key = text.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			out.push(text);
		}
	}
	return out;
}

/**
 * slug：条目身份的一部分（`kind:slug`）。
 * 只在**新建**时从名字派生；条目一旦存在就必须锁死（改它就等于换了个条目）。
 *
 * ⚠️ 与后端 `submissions.mjs` 的 slugify **不是同一份实现**：中文名兜底哈希这边是
 * djb2（同步、可在 computed 里用），那边是 sha1（`p-xxxxxxxx`）。工作台总是显式把
 * slug 交给后端，所以这条路上**前端算出来的就是最终 id**；会露馅的只有"导出 zip 走
 * Issue 附件"那条没有 slug 字段的通道（那时后端按自己的算法派生，与页面显示的不同）。
 * 要根治就得两端共用一份派生函数（见设计 FR-19/20），记在待办里。
 */
export function slugify(name) {
	const ascii = String(name ?? "")
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);
	if (ascii && /[a-z0-9]/.test(ascii)) return ascii;
	// 全中文之类：用稳定哈希兜底，保证同名永远同 slug
	let hash = 5381;
	for (const char of String(name ?? "")) hash = ((hash * 33) ^ char.codePointAt(0)) >>> 0;
	return `entry-${hash.toString(36).slice(0, 8)}`;
}

/**
 * 手填 slug 的归一化 —— 与后端 `normalizeSlug` 同一套规则（小写、非 `[a-z0-9-]` → `-`、
 * 去首尾 `-`、截 64）。页面上显示的 id 必须等于**真正会落库的那个**：后端 `"Atlas_Map"`
 * 存成 `atlas-map`、`"地图册"` 直接 400 bad_slug，而前端如果照原样显示，作者看到的
 * `project:Atlas_Map` 就是个不存在的条目。
 *
 * @returns {string} 归一化结果；不含可用字符时返回空串（调用方据此报错）
 */
export function normalizeSlug(raw) {
	const text = String(raw ?? "").trim();
	if (!text) return "";
	return text.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

/* ───────────────────────── 本地预检 ───────────────────────── */

const byteLength = (text) => new TextEncoder().encode(String(text ?? "")).length;

/**
 * 前端预检。**权威在后端**：同一份规则由后端独立复查（§11.1），
 * 这里只是让作者在本地就看到问题，而不是等审核员退回。
 *
 * @returns {{ errors: Array<{code,message}>, warnings: Array<{code,message}> }}
 */
export function validateDraft(draft) {
	const errors = [];
	const warnings = [];
	const type = typeOf(draft.kind);

	if (!String(draft.name ?? "").trim()) errors.push({ code: "missing_name", message: "缺少名称" });
	else if (String(draft.name).length > LIMITS.maxNameLength) {
		errors.push({ code: "name_too_long", message: `名称过长（${String(draft.name).length} > ${LIMITS.maxNameLength} 字）` });
	}
	if (!String(draft.summary ?? "").trim()) errors.push({ code: "missing_summary", message: "缺少一句话简介" });
	else if (String(draft.summary).length > LIMITS.maxSummaryLength) {
		errors.push({ code: "summary_too_long", message: `简介过长（${String(draft.summary).length} > ${LIMITS.maxSummaryLength} 字）` });
	}
	const tags = normalizeTags(draft.tags);
	if (tags.length > LIMITS.maxTags) errors.push({ code: "too_many_tags", message: `标签过多（${tags.length} > ${LIMITS.maxTags}）` });

	// slug 是条目身份的一部分，值得在这里拦一次（后端会独立复查：bad_slug / 撞 id）
	const rawSlug = String(draft.slug ?? "").trim();
	if (rawSlug && !normalizeSlug(rawSlug)) {
		errors.push({ code: "bad_slug", message: `slug「${rawSlug}」不含可用字符（只允许 a-z 0-9 -）` });
	} else if (!rawSlug && /^\d+$/.test(slugify(draft.name))) {
		// 纯数字派生值：`秋日创作赛 2026` 与 `2026 年度大赏` 都会派生成同一个 `2026`，
		// 于是第二个条目会撞上第一个的 id（后端报 not_maintainer）。这种撞车在本地就该拦住。
		errors.push({
			code: "slug_all_digits",
			message: `名称里没有可用的字母，自动派生的 slug 只有数字（「${slugify(draft.name)}」）—— 同年的其它条目会撞同一个 id，请手填一个（如 autumn-jam-2026）`,
		});
	}

	const bodyBytes = byteLength(draft.body);
	if (bodyBytes > LIMITS.maxBodyBytes) {
		errors.push({ code: "body_too_long", message: `正文过大（${(bodyBytes / 1024).toFixed(1)} KB > ${LIMITS.maxBodyBytes / 1024} KB）` });
	}
	if (type.fields.includes("time") && draft.kind === "event") {
		const { start, end } = draft.time ?? {};
		if (!start || !end) errors.push({ code: "missing_time", message: "赛事必须填开始与结束日期" });
		else if (!(new Date(end) > new Date(start))) errors.push({ code: "bad_time_range", message: `结束必须晚于开始（${start} → ${end}）` });
	}
	if ((draft.recruit ?? []).length > LIMITS.maxRecruit) {
		errors.push({ code: "too_many_recruit", message: `招募项过多（${draft.recruit.length} > ${LIMITS.maxRecruit}）` });
	}
	for (const role of draft.recruit ?? []) {
		if (!String(role.role ?? "").trim()) errors.push({ code: "recruit_missing_role", message: "招募项缺少名称" });
		if (role.status && !["open", "filled", "closed"].includes(role.status)) {
			errors.push({ code: "bad_recruit_status", message: `招募状态只能是 open / filled / closed（收到「${role.status}」）` });
		}
	}
	for (const asset of draft.assets ?? []) {
		if (asset.bytes && asset.bytes.length > LIMITS.maxAssetBytes) {
			errors.push({ code: "asset_too_large", message: `图片过大：${asset.path}（${(asset.bytes.length / 1024).toFixed(0)} KB）` });
		}
	}
	if ((draft.assets ?? []).length > LIMITS.maxAssets) errors.push({ code: "too_many_assets", message: `图片过多（${draft.assets.length} > ${LIMITS.maxAssets}）` });
	if (!(draft.assets ?? []).some((asset) => asset.cover)) {
		warnings.push({ code: "no_cover", message: "没有指定封面，列表里会显示占位图" });
	}
	return { errors, warnings };
}

/* ───────────────────────── frontmatter ───────────────────────── */

const yamlScalar = (value) => {
	const text = String(value ?? "");
	/*
	 * 只在必要时加引号，但这几种**必须**加：
	 *   · YAML 保留字（true / false / null / ~ / yes / no…）—— 不加引号会被解析成布尔或空值，
	 *     后端于是报 missing_name，作者看着自己填的名字一头雾水（实测 `name: true` 就是这样）；
	 *   · 纯数字 —— 同理，会被当数字读走；
	 *   · 含特殊字符（冒号、井号、引号、逗号…）的值。
	 */
	const needsQuotes = /^(true|false|null|yes|no|on|off|~)$/i.test(text) || /^\d+$/.test(text) || !/^[\p{L}\p{N}][^:#\n"',]*$/u.test(text);
	return needsQuotes ? JSON.stringify(text) : text;
};

/**
 * 生成 project.md 的 frontmatter。
 * ⚠️ 不含 `slug` —— 它是平台字段（开发提示里明确禁止作者手写），走 multipart 字段传。
 * ⚠️ 但**必须**带 `cover`：后端只认 frontmatter 的 `cover:` 或 `assets/cover.*`，
 *    而工作台把图片命名成 `assets/<slug>-N.webp` —— 不写这一行，封面上架后 100% 丢失
 *    （后端只会给一条 no_cover 警告，没人看得见；列表卡片永远显示占位图）。
 */
export function buildFrontmatter(draft) {
	const lines = ["---", "template: 1", `kind: ${draft.kind}`, `name: ${yamlScalar(draft.name)}`];
	if (draft.summary) lines.push(`summary: ${yamlScalar(draft.summary)}`);
	const tags = normalizeTags(draft.tags);
	if (tags.length) lines.push(`tags: [${tags.map(yamlScalar).join(", ")}]`);
	if (draft.gameversion && typeOf(draft.kind).fields.includes("gameversion")) {
		lines.push(`gameversion: [${String(draft.gameversion).split(/[\s,]+/).filter(Boolean).map(yamlScalar).join(", ")}]`);
	}
	if (draft.repo) lines.push(`repo: ${yamlScalar(draft.repo)}`);
	if (draft.license) lines.push(`license: ${yamlScalar(draft.license)}`);
	const cover = (draft.assets ?? []).find((asset) => asset.cover && asset.path);
	if (cover) lines.push(`cover: ${yamlScalar(cover.path)}`);
	if (typeOf(draft.kind).fields.includes("time")) {
		const { start, end, deadline } = draft.time ?? {};
		if (start || end || deadline) {
			lines.push("time:");
			if (start) lines.push(`  start: ${yamlScalar(start)}`);
			if (end) lines.push(`  end: ${yamlScalar(end)}`);
			if (deadline) lines.push(`  deadline: ${yamlScalar(deadline)}`);
		}
	}
	lines.push("---", "");
	return lines.join("\n");
}

const recruitFile = (role) => {
	const lines = ["---", `role: ${yamlScalar(role.role)}`];
	if (role.headcount != null && role.headcount !== "") lines.push(`headcount: ${Number(role.headcount) || role.headcount}`);
	if (Array.isArray(role.skills) && role.skills.length) lines.push(`skills: [${role.skills.map(yamlScalar).join(", ")}]`);
	if (role.deadline) lines.push(`deadline: ${yamlScalar(role.deadline)}`);
	lines.push(`status: ${role.status || "open"}`);
	lines.push("---", "", String(role.body ?? "").trim(), "");
	return lines.join("\n");
};

/**
 * 把草稿变成 zip 的条目列表（交给 zipwriter 打包）。
 * 结构与仓库归档同构（§9.5）：project.md + assets/ + recruit/<岗位>.md。
 *
 * 这里顺手做一次**重名校验**：后端对重名条目是**整包拒绝**（`duplicate_name`，大小写不敏感，
 * 因为落盘会冲突），而那条错误信息只会说"重名"，看不出是图片还是岗位出的问题。
 * 与其让作者拿到看不懂的 422，不如在本地就把"哪两个名字撞了"说清楚。
 */
export function buildProjectEntries(draft) {
	const encoder = new TextEncoder();
	const entries = [
		{ name: "project.md", data: encoder.encode(`${buildFrontmatter(draft)}${String(draft.body ?? "").trim()}\n`) },
	];
	for (const asset of draft.assets ?? []) {
		if (!asset.path || !asset.bytes) continue;
		entries.push({ name: String(asset.path).replace(/^\/+/, ""), data: asset.bytes });
	}
	for (const role of draft.recruit ?? []) {
		const name = String(role.role ?? "").trim();
		if (!name) continue;
		entries.push({ name: `recruit/${name}.md`, data: encoder.encode(recruitFile(role)) });
	}

	const seen = new Map();
	for (const entry of entries) {
		const key = entry.name.toLowerCase();
		if (seen.has(key)) {
			throw new Error(`包内条目重名：${entry.name}（与 ${seen.get(key)} 撞了）—— 改一下图片文件名或岗位名再提交`);
		}
		seen.set(key, entry.name);
	}
	return entries;
}

/** 建议的包名：`<slug>.zip`（作者存本地归档用，也是提交时的文件名）。 */
export function archiveName(draft) {
	return `${draft.slug || slugify(draft.name) || "tavern-submission"}.zip`;
}
