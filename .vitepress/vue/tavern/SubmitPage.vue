<template>
	<div class="tv-page tv-workbench">
		<TavernNav :crumbs="[{ label: '投稿工作台' }]" />

		<header class="tv-workbench-hero">
			<h1>投稿工作台</h1>
			<p>
				在这里把要交的东西组装成一个 zip：填元数据 → 拖图 → 写正文 → 预览 → 提交。
				表单里填的东西<b>先存在你自己的浏览器里</b>，只有你点"提交"才会离开这台机器。
			</p>
		</header>

		<div class="tv-workbench-layout">
			<main>
				<!-- ── 0 · 登录（只在提交时需要） ─────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-auth">
					<h2 id="wb-auth"><span class="tv-wb-stepno">0</span>身份</h2>
					<p class="tv-wb-hint">
						投稿要工作组签发的凭证。凭证<b>只在内存里用一次</b>换会话（cookie），
						不写进 localStorage、也不进 URL —— 令牌即密码，泄露等于身份泄露。
					</p>
					<div v-if="account" class="tv-wb-account">
						<span class="tv-badge tv-badge--open">已登录</span>
						<span><b>{{ account.pin }}</b>（{{ account.role === "staff" ? "工作组" : "作者" }}）</span>
						<!-- 工作组登录后才露出管理台入口：它是私域页面，不需要摆在公共导航上 -->
						<a v-if="account.role === 'staff'" class="tv-btn" :href="adminUrl">凭证管理台（给别人签发 pin + token）</a>
						<button class="tv-btn" type="button" @click="signOut">退出</button>
					</div>
					<form v-else class="tv-wb-auth" @submit.prevent="signIn">
						<label>
							<span>pin</span>
							<input v-model.trim="credentials.pin" type="text" autocomplete="username" placeholder="例如 alumopper" />
						</label>
						<label>
							<span>token</span>
							<input v-model.trim="credentials.token" type="password" autocomplete="current-password" placeholder="32 位令牌" />
						</label>
						<button class="tv-btn tv-btn--primary" type="submit" :disabled="authBusy">
							{{ authBusy ? "验证中…" : "登录" }}
						</button>
					</form>
					<p v-if="authError" class="tv-wb-error" role="alert">{{ authError }}</p>
					<p v-if="!account" class="tv-wb-hint">
						没有凭证也可以先写好、<b>导出 zip</b> 存着，之后从 Issue 附件或私聊交给工作组 ——
						zip 是通用货币，哪条通道进来都是同一套流水线。
					</p>
				</section>

				<!-- ── 1 · 类型（类型即模板） ─────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-type">
					<h2 id="wb-type"><span class="tv-wb-stepno">1</span>交什么</h2>
					<p class="tv-wb-hint">
						类型决定的是<b>模板</b>与<b>校验</b>，不是"创建哪种实体"。
						作者、团队不在这里 —— 它们是身份，不走投稿管线。
					</p>
					<div class="tv-wb-types">
						<button
							v-for="type in types"
							:key="type.kind"
							type="button"
							class="tv-wb-type"
							:class="{ 'is-active': draft.kind === type.kind }"
							:aria-pressed="draft.kind === type.kind ? 'true' : 'false'"
							@click="pickType(type.kind)"
						>
							<span class="tv-wb-type-label">{{ type.label }}</span>
							<span class="tv-wb-type-kind">{{ type.kind }}</span>
							<span class="tv-wb-type-hint">{{ type.hint }}</span>
						</button>
					</div>
					<p class="tv-wb-hint">
						「合集」暂时不在列表里：它的成员是 <code>includes</code> 边，而后端还没有创建这类边的接口，
						交上来只会是个空壳。等接口补齐再开。
					</p>
				</section>

				<!-- ── 2 · 元数据 ─────────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-meta">
					<h2 id="wb-meta"><span class="tv-wb-stepno">2</span>元数据</h2>
					<div class="tv-wb-grid">
						<label class="tv-wb-field tv-wb-field--wide">
							<span>名称<em>必填</em></span>
							<input id="wb-name" v-model="draft.name" type="text" :maxlength="LIMITS.maxNameLength" placeholder="例如 地图册" @input="onNameInput" />
						</label>
						<label class="tv-wb-field tv-wb-field--wide">
							<span>slug<em>条目 id 的一部分，创建后不能改</em></span>
							<input id="wb-slug" v-model.trim="draft.slug" type="text" placeholder="例如 atlas" @input="slugTouched = true" />
							<small class="tv-wb-slug">{{ draft.kind }}:<b>{{ effectiveSlug }}</b></small>
							<small v-if="slugTouched" class="tv-wb-hint">
								已锁定：改上面的名称不会换掉这个 id（这正是"改一版"该有的样子）。要开一条新条目，请用第 6 步的「清空」。
							</small>
						</label>
						<label class="tv-wb-field tv-wb-field--wide">
							<span>一句话简介<em>必填，≤ {{ LIMITS.maxSummaryLength }} 字</em></span>
							<input v-model="draft.summary" type="text" :maxlength="LIMITS.maxSummaryLength" placeholder="列表卡片上显示的那句话" />
						</label>
						<label class="tv-wb-field">
							<span>标签<em>回车添加</em></span>
							<input v-model="tagInput" type="text" list="wb-tag-options" placeholder="UI / 数学 / 工具…" @keydown.enter.prevent="addTag" />
							<datalist id="wb-tag-options">
								<option v-for="tag in knownTags" :key="tag" :value="tag" />
							</datalist>
						</label>
						<label v-if="type.fields.includes('gameversion')" class="tv-wb-field">
							<span>支持的 MC 版本<em>如 1.21.9 或 1.21~26.3</em></span>
							<input v-model="draft.gameversion" type="text" placeholder="1.21.9" />
						</label>
						<label v-if="type.fields.includes('gameversion')" class="tv-wb-field">
							<span>仓库坐标<em>可选</em></span>
							<input v-model.trim="draft.repo" type="text" placeholder="owner/repo" />
						</label>
						<template v-if="type.fields.includes('time')">
							<label class="tv-wb-field">
								<span>开始<em>必填</em></span>
								<input v-model="draft.time.start" type="date" />
							</label>
							<label class="tv-wb-field">
								<span>结束<em>必填</em></span>
								<input v-model="draft.time.end" type="date" />
							</label>
							<label class="tv-wb-field">
								<span>报名/投稿截止<em>可选</em></span>
								<input v-model="draft.time.deadline" type="date" />
							</label>
						</template>
					</div>

					<div class="tv-wb-tags">
						<button v-for="tag in draft.tags" :key="tag" class="tv-badge" type="button" :title="`移除标签 ${tag}`" @click="removeTag(tag)">
							{{ tag }} <span aria-hidden="true">×</span>
						</button>
					</div>
				</section>

				<!-- ── 3 · 图片 ───────────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-assets">
					<h2 id="wb-assets"><span class="tv-wb-stepno">3</span>图片</h2>
					<p class="tv-wb-hint">
						拖进来就<b>在浏览器里重新编码</b>（顺带剥掉 EXIF/定位），原图不会离开你的机器。
						第一张默认当封面，点缩略图可切换。
					</p>
					<div
						class="tv-wb-drop"
						:class="{ 'is-over': dragOver }"
						@dragover.prevent="dragOver = true"
						@dragleave.prevent="dragOver = false"
						@drop.prevent="onDrop"
					>
						<p>把图片拖到这里，或者</p>
						<label class="tv-btn">
							选文件
							<input type="file" accept="image/*" multiple hidden @change="onPick" />
						</label>
					</div>
					<ul v-if="draft.assets.length" class="tv-wb-thumbs">
						<li v-for="asset in draft.assets" :key="asset.path" :class="{ 'is-cover': asset.cover }">
							<img :src="asset.preview" :alt="asset.path" />
							<div class="tv-wb-thumb-meta">
								<span class="tv-wb-thumb-name">{{ asset.path }}</span>
								<span class="tv-muted">{{ (asset.bytes.length / 1024).toFixed(0) }} KB</span>
							</div>
							<div class="tv-wb-thumb-actions">
								<button v-if="!asset.cover" class="tv-btn" type="button" @click="setCover(asset)">设为封面</button>
								<span v-else class="tv-badge tv-badge--open">封面</span>
								<button class="tv-btn" type="button" @click="removeAsset(asset)">移除</button>
							</div>
						</li>
					</ul>
					<p v-if="skippedFiles.length" class="tv-wb-error" role="alert">
						这些文件没能加进来（{{ skippedFiles.length }} 个）：{{ skippedFiles.join("；") }}
					</p>
				</section>

				<!-- ── 4 · 正文 ───────────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-body">
					<h2 id="wb-body"><span class="tv-wb-stepno">4</span>正文</h2>
					<p class="tv-wb-hint">
						支持站内同一套 Markdown（含 <code>:::</code> 提示块、脚注）。预览用的就是公开页那一份渲染器与过滤器 ——
						你在这里看到什么，上架后就是什么。
					</p>
					<div class="tv-wb-body-grid">
						<label class="tv-wb-field">
							<span>Markdown</span>
							<textarea v-model="draft.body" rows="16" placeholder="# 标题&#10;&#10;正文…" />
						</label>
						<div class="tv-wb-preview">
							<span class="tv-wb-field-label">预览</span>
							<div class="tv-wb-preview-body" v-html="previewHtml"></div>
							<p v-if="bodyIssues.length" class="tv-wb-error">
								正文里有站点渲染不接受的东西：{{ bodyIssues.join("；") }}
							</p>
						</div>
					</div>
				</section>

				<!-- ── 5 · 招队友 ─────────────────────────────────────────── -->
				<section v-if="type.fields.includes('recruit')" class="tv-panel tv-wb-step" aria-labelledby="wb-recruit">
					<h2 id="wb-recruit"><span class="tv-wb-stepno">5</span>想找的队友</h2>
					<p class="tv-wb-hint">缺谁就写谁。招满了点一下就能关掉（收敛型改动直通，不用重走审核）。</p>
					<div v-for="(role, index) in draft.recruit" :key="index" class="tv-wb-recruit">
						<input v-model="role.role" type="text" placeholder="测试 / 美术 / 文档…" />
						<input v-model.number="role.headcount" type="number" min="1" placeholder="人数" />
						<input v-model="role.skillsText" type="text" placeholder="要会什么（逗号分隔）" />
						<input v-model="role.deadline" type="date" />
						<select v-model="role.status">
							<option value="open">还在招</option>
							<option value="filled">已招满</option>
							<option value="closed">不招了</option>
						</select>
						<button class="tv-btn" type="button" @click="draft.recruit.splice(index, 1)">删除</button>
					</div>
					<button class="tv-btn" type="button" @click="addRecruit">+ 加一项</button>
				</section>

				<!-- ── 6 · 检查与提交 ─────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="wb-submit">
					<h2 id="wb-submit"><span class="tv-wb-stepno">6</span>打包与提交</h2>
					<div class="tv-wb-check" :class="issues.errors.length ? 'is-bad' : 'is-ok'">
						<strong v-if="issues.errors.length">本地预检发现 {{ issues.errors.length }} 个问题（后端还会独立复查一遍）：</strong>
						<strong v-else-if="issues.warnings.length">可以提交；有 {{ issues.warnings.length }} 条提醒：</strong>
						<strong v-else>本地预检通过。</strong>
						<ul>
							<li v-for="issue in issues.errors" :key="issue.code">{{ issue.message }}</li>
							<li v-for="issue in issues.warnings" :key="issue.code" class="tv-muted">{{ issue.message }}</li>
						</ul>
					</div>
					<div class="tv-wb-submit-row">
						<button class="tv-btn" type="button" :disabled="packBusy" @click="exportZip">
							{{ packBusy ? "打包中…" : "导出 zip（存着/走别的通道）" }}
						</button>
						<button class="tv-btn tv-btn--primary" type="button" :disabled="!canSubmit || submitBusy" @click="submit">
							{{ submitBusy ? "提交中…" : "提交给工作组审核" }}
						</button>
						<button class="tv-btn" type="button" @click="resetDraft">清空</button>
					</div>
					<p v-if="!account" class="tv-wb-hint">提交需要先在第 0 步登录；没有凭证就先用"导出 zip"。</p>
					<p v-if="submitMessage" class="tv-wb-submit-message" :class="{ 'is-bad': submitError }" role="status">{{ submitMessage }}</p>
					<ul v-if="serverErrors.length" class="tv-wb-error">
						<li v-for="error in serverErrors" :key="error.code">{{ error.message }}</li>
					</ul>
				</section>
			</main>

			<!-- ── 侧栏：本地缓存的一切 ─────────────────────────────────── -->
			<aside class="tv-wb-side">
				<section class="tv-panel">
					<h2>我的投稿</h2>
					<p class="tv-wb-hint">
						这份清单只存在<b>这台机器的浏览器里</b>。待审期间后台不会把内容回给任何人（含你自己），
						所以"我刚交了什么"只能靠本地这份缓存 —— 换设备或清了浏览器数据就没了。
					</p>
					<ul v-if="submissions.length" class="tv-wb-sublist">
						<li v-for="entry in submissions" :key="entry.revisionId">
							<span class="tv-badge" :class="entry.kind === 'event' ? 'tv-badge--live' : 'tv-badge--dim'">{{ entry.kind }}</span>
							<span class="tv-wb-sub-title">{{ entry.name }}</span>
							<span class="tv-muted">{{ entry.nodeId }}</span>
							<span class="tv-wb-sub-meta">
								<time :datetime="entry.at">{{ entry.at.slice(0, 10) }}</time>
								<b :class="{ 'is-bad': entry.status === 'rejected' }">{{ entry.status === "pending" ? "等待审核" : entry.status }}</b>
							</span>
							<button class="tv-btn" type="button" @click="loadSubmission(entry)">本地预览</button>
						</li>
					</ul>
					<p v-else class="tv-muted">还没有提交过东西。</p>
				</section>

				<section class="tv-panel">
					<h2>这份草稿</h2>
					<p class="tv-wb-hint">
						字段自动存在 localStorage（防刷新丢失）；<b>图片只存在内存里</b>，
						刷新后需要重新拖进来 —— 把几 MB 的图塞进 localStorage 会撑爆配额。
					</p>
					<p class="tv-muted">上次保存：{{ savedAt || "（还没保存）" }}</p>
				</section>
			</aside>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";

import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import { renderRuntimeMarkdown, validateRuntimeMarkdown } from "../wheel/runtimeMarkdown.mjs";
import { LIMITS, WORKBENCH_TYPES, archiveName, buildProjectEntries, emptyDraft, normalizeSlug, normalizeTags, slugify, typeOf, validateDraft } from "./workbench-model.mjs";
import { zipFiles } from "./zipwriter.mjs";
import { WRITE_API_BASE, adminHref, withSiteBase } from "./api.mjs";

const DRAFT_KEY = "tavern:workbench:draft";
const SUBMISSIONS_KEY = "tavern:workbench:submissions";

const types = WORKBENCH_TYPES;
const draft = reactive(emptyDraft("project"));
const credentials = reactive({ pin: "", token: "" });
const account = ref(null);
const authBusy = ref(false);
const authError = ref("");
const packBusy = ref(false);
const submitBusy = ref(false);
const submitMessage = ref("");
const submitError = ref(false);
const serverErrors = ref([]);
const tagInput = ref("");
const knownTags = ref([]);
const slugTouched = ref(false);
const dragOver = ref(false);
const savedAt = ref("");
const submissions = ref([]);
const bodyIssues = ref([]);
const skippedFiles = ref([]);

const type = computed(() => typeOf(draft.kind));
const adminUrl = adminHref();
// 显示的 id 必须等于**真正会落库的那个**：手填的 slug 要过一遍后端同一套归一化
// （`Atlas_Map` → `atlas-map`），归一化后什么都不剩就让预检去报错，而不是显示一个假 id。
const effectiveSlug = computed(() => (String(draft.slug ?? "").trim() ? normalizeSlug(draft.slug) : slugify(draft.name)));
const issues = computed(() => {
	const result = validateDraft({ ...draft, recruit: draft.recruit.map(withSkills) });
	// 正文里站点渲染器不接受的东西也算**预检错误**（曾经只是提示，于是按钮照样绿着，
	// 作者会在"预检通过"下提交一个必然渲染失败的正文）。
	const body = bodyIssues.value.map((message) => ({ code: "body_rejected", message: `正文里有站点渲染不接受的东西：${message}` }));
	return body.length ? { errors: [...result.errors, ...body], warnings: result.warnings } : result;
});
const canSubmit = computed(() => Boolean(account.value) && issues.value.errors.length === 0 && Boolean(effectiveSlug.value));

const previewHtml = computed(() => {
	try {
		return renderRuntimeMarkdown(draft.body || "", { baseUrl: withSiteBase("/") });
	} catch (error) {
		return `<p class="tv-wb-error">预览渲染失败：${String(error && error.message)}</p>`;
	}
});

/* ───────────────────────── 本地缓存（草稿 / 我的投稿） ───────────────────────── */

function saveDraft() {
	if (typeof window === "undefined") return;
	const snapshot = { ...draft, assets: [] };   // 图片不进 localStorage（配额）
	try {
		window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, at: new Date().toISOString(), draft: snapshot }));
		savedAt.value = new Date().toLocaleTimeString();
	} catch (error) {
		console.warn("[workbench] 草稿保存失败（可能是配额）", error);
	}
}

function loadDraft() {
	if (typeof window === "undefined") return;
	try {
		const raw = window.localStorage.getItem(DRAFT_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw);
		Object.assign(draft, emptyDraft(parsed?.draft?.kind ?? "project"), parsed?.draft ?? {});
		draft.assets = [];
		// ⚠️ 恢复出来的草稿已经带着 slug 了 —— 那意味着"这个条目已经存在"，必须**锁住**。
		// 否则（曾经就是这样）`slugTouched` 是内存里的 false，作者回来改一下标题，
		// onNameInput 就把 slug 重新派生一遍，提交后**多出一个新条目**，
		// 而不是给原条目发一版新修订 —— 正是 slug 规则要防的那件事。
		if (draft.slug) slugTouched.value = true;
		savedAt.value = parsed?.at ? `本地已恢复（${String(parsed.at).slice(0, 10)}）` : "";
	} catch (error) {
		console.warn("[workbench] 草稿恢复失败", error);
	}
}

function loadSubmissions() {
	if (typeof window === "undefined") return;
	try {
		const raw = window.localStorage.getItem(SUBMISSIONS_KEY);
		submissions.value = raw ? JSON.parse(raw) : [];
	} catch {
		submissions.value = [];
	}
}

function rememberSubmission(entry) {
	submissions.value = [entry, ...submissions.value.filter((item) => item.revisionId !== entry.revisionId)].slice(0, 20);
	try {
		window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions.value));
	} catch (error) {
		console.warn("[workbench] 投稿清单保存失败", error);
	}
}

/* ───────────────────────── 表单动作 ───────────────────────── */

function pickType(kind) {
	draft.kind = kind;
	if (!typeOf(kind).fields.includes("time")) draft.time = { start: "", end: "", deadline: "" };
	if (!typeOf(kind).fields.includes("gameversion")) draft.gameversion = "";
}

function onNameInput() {
	if (!slugTouched.value) draft.slug = slugify(draft.name);
}

function addTag() {
	const value = tagInput.value.trim();
	if (!value) return;
	draft.tags = normalizeTags([...draft.tags, value]);
	tagInput.value = "";
}

function removeTag(tag) {
	draft.tags = draft.tags.filter((entry) => entry !== tag);
}

function addRecruit() {
	draft.recruit.push({ role: "", headcount: 1, skillsText: "", deadline: "", status: "open" });
}

const withSkills = (role) => ({
	...role,
	skills: String(role.skillsText ?? "").split(/[,，]/).map((entry) => entry.trim()).filter(Boolean),
});

/* ───────────────────────── 图片（浏览器内重编码） ───────────────────────── */

const MAX_EDGE = 1600;

async function reencode(file) {
	// 用 createImageBitmap + canvas 重编码：既压体积，也**顺带剥掉 EXIF**（原图不出机器）。
	// `imageOrientation: "from-image"` 是必须显式要的：EXIF 会被剥掉，若不先按方向摆正，
	// 手机竖拍的照片上架后就是横的（老浏览器不认这个选项，退回默认调用）。
	const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => createImageBitmap(file));
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
	bitmap.close?.();
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.8));
	if (!blob) throw new Error("浏览器无法编码这张图");
	/*
	 * ⚠️ 不能假定"要了 webp 就得到 webp"：按规范，不支持的格式会**静默回退 PNG**
	 * （WebKit 至今不能编码 webp）。那样产物就是"名字 .webp、内容 PNG"—— 后端按扩展名
	 * 判 mime，于是体积大几倍还可能撞 2 MB 上限。所以扩展名跟随**真实**类型。
	 */
	const extension = blob.type === "image/webp" ? "webp" : "png";
	return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height, extension, mime: blob.type || "image/png" };
}

/**
 * 素材序号：**单调递增**，不用 `assets.length + 1`。
 * 删掉中间一张后数组长度会回退，再加一张就会生成一个已存在的路径 —— 后端对重名条目
 * 是整包拒绝（`duplicate_name`），作者看到的错误与"重名"有关，跟图片根本联系不上。
 */
let assetSeq = 0;

async function addFiles(files) {
	skippedFiles.value = [];
	for (const file of [...files]) {
		if (!/^image\//.test(file.type)) {
			skippedFiles.value.push(`${file.name}（不是图片）`);
			continue;
		}
		try {
			const { bytes, width, height, extension, mime } = await reencode(file);
			assetSeq += 1;
			const base = slugify(draft.name || "image");
			draft.assets.push({
				path: `assets/${base}-${assetSeq}.${extension}`,
				bytes, width, height, mime,
				preview: URL.createObjectURL(new Blob([bytes], { type: mime })),
				cover: draft.assets.length === 0,
				source: file.name,
			});
		} catch (error) {
			// 静默丢图是最难查的一类问题：作者以为交上去了，审核员说少图。所以记下来给界面看。
			skippedFiles.value.push(`${file.name}（${String(error?.message ?? error)}）`);
		}
	}
}

function onDrop(event) {
	dragOver.value = false;
	void addFiles(event.dataTransfer?.files ?? []);
}

function onPick(event) {
	void addFiles(event.target.files ?? []);
	event.target.value = "";
}

function setCover(asset) {
	for (const entry of draft.assets) entry.cover = entry === asset;
}

/** 释放预览图占用的 blob URL（反复增删图片时不释放会一路吃内存）。 */
function releasePreviews() {
	for (const asset of draft.assets) {
		if (asset.preview) URL.revokeObjectURL(asset.preview);
	}
}

function removeAsset(asset) {
	const wasCover = asset.cover;
	if (asset.preview) URL.revokeObjectURL(asset.preview);
	draft.assets = draft.assets.filter((entry) => entry !== asset);
	if (wasCover && draft.assets.length) draft.assets[0].cover = true;
}

/* ───────────────────────── 登录 ───────────────────────── */

async function signIn() {
	authBusy.value = true;
	authError.value = "";
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/auth/session`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ pin: credentials.pin, token: credentials.token }),
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `登录失败（HTTP ${response.status}）`);
		account.value = payload.account;
		credentials.token = "";             // 令牌用完即弃：只留在内存里，且立刻清掉
	} catch (error) {
		const message = String(error?.message ?? error);
		// 这一条几乎总是部署问题，而不是凭证问题：工作台必须与 API **同源**（设计 §7.7），
		// 否则 cookie 与 CORS 都会拦下来。与其让作者盯着"HTTP 404"发愣，不如直说。
		authError.value = /Failed to fetch|NetworkError|HTTP (404|405)/.test(message)
			? `${message} —— 工作台必须与酒馆 API 同源部署：请从 API 域名访问本页；本机开发可用 ?api=http://127.0.0.1:9878（写接口只接受回环地址的覆盖）`
			: message;
	} finally {
		authBusy.value = false;
	}
}

async function signOut() {
	try {
		await fetch(`${WRITE_API_BASE}/v1/auth/session`, { method: "DELETE", credentials: "include" });
	} catch { /* 退出失败也要清本地状态 */ }
	account.value = null;
}

/* ───────────────────────── 打包 / 提交 ───────────────────────── */

async function currentZip() {
	const entries = buildProjectEntries({ ...draft, recruit: draft.recruit.map(withSkills) });
	const zip = await zipFiles(entries);
	// 包体上限在本地就要拦：超了会撞后端 readBody 的上限，那条拒绝不是 422，
	// 作者只会看到"服务器内部错误"，完全不知道是自己包太大。
	if (zip.length > LIMITS.maxArchiveBytes) {
		throw new Error(
			`包太大（${(zip.length / 1024 / 1024).toFixed(1)} MB > ${LIMITS.maxArchiveBytes / 1024 / 1024} MB）` +
			`—— 减掉几张图，或改用"导出 zip"走 Issue 附件交给工作组`,
		);
	}
	return { entries, zip };
}

function download(zip, filename) {
	const url = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function exportZip() {
	packBusy.value = true;
	try {
		const { zip } = await currentZip();
		download(zip, archiveName({ ...draft, slug: effectiveSlug.value }));
		submitMessage.value = "已导出 zip。它可以之后从页面提交，也可以走 Issue 附件交给工作组。";
		submitError.value = false;
	} catch (error) {
		submitMessage.value = `打包失败：${String(error.message ?? error)}`;
		submitError.value = true;
	} finally {
		packBusy.value = false;
	}
}

async function submit() {
	submitBusy.value = true;
	submitMessage.value = "";
	submitError.value = false;
	serverErrors.value = [];
	try {
		const { zip } = await currentZip();
		const form = new FormData();
		form.append("archive", new Blob([zip], { type: "application/zip" }), archiveName({ ...draft, slug: effectiveSlug.value }));
		// slug 必须显式带上：不带就按 name 派生，改一版标题再传会**变成另一个条目**
		form.append("slug", effectiveSlug.value);

		const response = await fetch(`${WRITE_API_BASE}/v1/submissions`, { method: "POST", credentials: "include", body: form });
		const payload = await response.json().catch(() => null);
		if (!response.ok) {
			serverErrors.value = Array.isArray(payload?.errors) ? payload.errors : [];
			throw new Error(payload?.message ?? `提交失败（HTTP ${response.status}）`);
		}
		submitMessage.value = payload.message ?? "投稿已收到。";
		// 本地快照：待审期间后台不回内容，所以"我刚交了什么"只能存在这里。
		// ⚠️ 序列化前**先剥掉 assets**：30 张 MB 级 Uint8Array 会被 stringify 成几十 MB 的
		// 字符串再丢掉，量级够大时抛 RangeError —— 那会被下面的 catch 说成"提交失败"，
		// 而服务端其实已经收下了，作者于是重复提交。反正图片本来就不进缓存。
		const { assets: _ignored, ...rest } = draft;
		rememberSubmission({
			revisionId: payload.revisionId,
			nodeId: payload.nodeId,
			kind: draft.kind,
			name: draft.name,
			status: payload.status ?? "pending",
			at: new Date().toISOString(),
			draft: { ...JSON.parse(JSON.stringify(rest)), assets: [] },
		});
		bodyIssues.value = [];
	} catch (error) {
		submitMessage.value = String(error.message ?? error);
		submitError.value = true;
	} finally {
		submitBusy.value = false;
	}
}

function loadSubmission(entry) {
	if (!entry.draft) return;
	releasePreviews();
	Object.assign(draft, emptyDraft(entry.draft.kind), entry.draft);
	draft.assets = [];
	// 这条投稿已经有 nodeId 了 —— 改标题不该换身份（同 loadDraft 的理由）
	if (draft.slug) slugTouched.value = true;
	submitMessage.value = `这是本地缓存的「${entry.name}」快照（${entry.at.slice(0, 16).replace("T", " ")}）。图片不在缓存里。`;
	submitError.value = false;
}

function resetDraft() {
	releasePreviews();
	Object.assign(draft, emptyDraft(draft.kind));
	skippedFiles.value = [];
	slugTouched.value = false;
	savedAt.value = "";
}

/** 刷新之后 cookie 还在（HttpOnly），但页面状态没了 —— 用 /v1/me 把"已登录"找回来。 */
async function restoreSession() {
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/me`, { credentials: "include" });
		if (!response.ok) return;
		const payload = await response.json().catch(() => null);
		if (payload?.account) account.value = payload.account;
	} catch { /* 没登录或 API 不可达：就当未登录，第 0 步会让人重新登录 */ }
}

/* ───────────────────────── 生命周期 ───────────────────────── */

let saveTimer = null;
watch(draft, () => {
	clearTimeout(saveTimer);
	saveTimer = setTimeout(saveDraft, 600);
}, { deep: true });

// validateRuntimeMarkdown 的约定是"有问题就抛"、通过则原样返回 —— 别当它返回错误清单
watch(() => draft.body, (body) => {
	try {
		validateRuntimeMarkdown(body || "");
		bodyIssues.value = [];
	} catch (error) {
		bodyIssues.value = [String(error?.message ?? error)];
	}
}, { immediate: true });

onMounted(() => {
	loadDraft();
	loadSubmissions();
	void restoreSession();
	void fetchTags()
		.then(({ items }) => { knownTags.value = items.map((item) => item.title).slice(0, 200); })
		.catch(() => { knownTags.value = []; });
});

onUnmounted(() => releasePreviews());
</script>
