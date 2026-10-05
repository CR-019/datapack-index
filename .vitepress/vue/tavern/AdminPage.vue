<template>
	<div class="tv-page tv-workbench">
		<TavernNav :crumbs="[{ label: '凭证管理台' }]" />

		<header class="tv-workbench-hero">
			<h1>凭证管理台</h1>
			<p>
				看板没有公开注册：<b>所有身份都出自这里</b>。给一个人（或一个团队）签发一对
				<code>pin + token</code>，他就拿去投稿工作台登录。
				明文令牌<b>只显示这一次</b> —— 库里只存哈希，丢了只能吊销重发。
				本人拿到凭证后到 <a :href="submitUrl">投稿工作台</a> 第 0 步登录（本页不提供"替他登录"）。
			</p>
		</header>

		<main class="tv-admin">
			<!-- ── 0 · 身份（这里是管理台，进门就要工作组） ─────────────── -->
			<section class="tv-panel tv-wb-step" aria-labelledby="ad-auth">
				<h2 id="ad-auth"><span class="tv-wb-stepno">0</span>身份</h2>
				<p class="tv-wb-hint">
					签发凭证是工作组权限（FR-16）。用你自己的 <code>pin + token</code> 登录 ——
					令牌只在内存里换一次会话，不落 localStorage、不进 URL。
				</p>
				<div v-if="account" class="tv-wb-account">
					<span class="tv-badge" :class="isStaff ? 'tv-badge--open' : 'tv-badge--dim'">
						{{ isStaff ? "工作组" : "作者（无签发权限）" }}
					</span>
					<span><b>{{ account.pin }}</b></span>
					<button class="tv-btn" type="button" @click="signOut">退出</button>
				</div>
				<form v-else class="tv-wb-auth" @submit.prevent="signIn">
					<label>
						<span>pin</span>
						<input v-model.trim="credentials.pin" type="text" autocomplete="username" placeholder="你的工作组账号" />
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
				<p v-if="account && !isStaff" class="tv-wb-hint">
					这个账号不是工作组，看不到也动不了任何凭证。需要签发权限的话，请工作组里已有权限的人给你签一枚。
				</p>
			</section>

			<template v-if="isStaff">
				<!-- ── 1 · 签发 ─────────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="ad-issue">
					<h2 id="ad-issue"><span class="tv-wb-stepno">1</span>签发一对凭证</h2>
					<p class="tv-wb-hint">
						填一个人的显示名与 pin（用户名）。显示名如果已经存在于看板上（种子里那些没有账号的老作者），
						这步会<b>认领</b>它：既有档案与条目归属一个字都不动，只补一个账号。
					</p>
					<div class="tv-wb-grid">
						<label class="tv-wb-field">
							<span>显示名<em>必填</em></span>
							<input id="ad-name" v-model.trim="form.name" type="text" placeholder="例如 阿罗 / Floating_UI 团队" @input="onNameInput" />
						</label>
						<label class="tv-wb-field">
							<span>pin<em>用户名，不可改</em></span>
							<input id="ad-pin" v-model.trim="form.pin" type="text" placeholder="例如 alumopper" @input="pinTouched = true" />
							<small class="tv-wb-hint">2–32 位，只能 a–z A–Z 0–9 . _ - ；不区分大小写地查重</small>
						</label>
						<label class="tv-wb-field">
							<span>主体类型</span>
							<select id="ad-kind" v-model="form.kind">
								<option value="person">个人（person）</option>
								<option value="team">团队（team）</option>
							</select>
							<small class="tv-wb-hint">团队 = 一个 pin、每人一枚令牌（ADR-004），不需要共享密码</small>
						</label>
						<label class="tv-wb-field">
							<span>角色</span>
							<select id="ad-role" v-model="form.role">
								<option value="author">作者（投稿）</option>
								<option value="staff">工作组成员（可审核、可签发）</option>
							</select>
						</label>
						<label class="tv-wb-field">
							<span>令牌标签<em>可选</em></span>
							<input id="ad-label" v-model.trim="form.label" type="text" placeholder="例如 阿罗的笔记本" />
							<small class="tv-wb-hint">一个人可以有多枚令牌，标签是事后分清"哪枚是谁的"的唯一线索</small>
						</label>
						<label class="tv-wb-field">
							<span>事由<em>写进审计</em></span>
							<input id="ad-reason" v-model.trim="form.reason" type="text" placeholder="例如 走查：地图册作者申请认领" />
						</label>
					</div>
					<div class="tv-wb-submit-row">
						<button id="ad-issue-submit" class="tv-btn tv-btn--primary" type="button" :disabled="issueBusy || !canIssue" @click="issueCredential">
							{{ issueBusy ? "签发中…" : "签发凭证" }}
						</button>
					</div>
					<p v-if="issueError" class="tv-wb-error tv-admin-error" role="alert">{{ issueError }}</p>
					<p v-else-if="issueMessage" class="tv-wb-submit-message" role="status">{{ issueMessage }}</p>

					<!-- 一次性明文：这一屏就是"令牌交付"的全部，关掉即不可复现 -->
					<div v-if="issued" class="tv-admin-secret" role="status">
						<h3>把这两行交给本人（只显示这一次）</h3>
						<p class="tv-wb-hint">
							它不在任何地方留底：库里只有 <code>sha256(token + pepper)</code>，
							我们也没法帮你找回来。丢了就吊销这枚、重签一枚。
						</p>
						<dl class="tv-admin-secret-grid">
							<dt>pin</dt>
							<dd><code class="tv-admin-secret-pin">{{ issued.pin }}</code></dd>
							<dt>token</dt>
							<dd><code class="tv-admin-secret-token">{{ issued.plaintext }}</code></dd>
						</dl>
						<div class="tv-admin-secret-actions">
							<button class="tv-btn" type="button" @click="copySecret">复制</button>
							<label class="tv-admin-confirm">
								<input id="ad-saved" v-model="secretSaved" type="checkbox" />
								<span>我已把凭证交给本人（关掉这一屏就再也看不到明文）</span>
							</label>
							<button v-if="secretSaved" class="tv-btn tv-btn--primary tv-admin-secret-dismiss" type="button" @click="issued = null">
								关掉这一屏
							</button>
						</div>
						<p v-if="copyState" class="tv-muted">{{ copyState }}</p>
					</div>
				</section>

				<!-- ── 2 · 已有凭证 ─────────────────────────────────────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="ad-list">
					<h2 id="ad-list"><span class="tv-wb-stepno">2</span>已有凭证</h2>
					<p class="tv-wb-hint">
						一共 <b>{{ stats.subjects }}</b> 个主体、<b>{{ stats.activeTokens }}</b> 枚有效令牌
						（已吊销 {{ stats.revokedTokens }} 枚<span v-if="stats.suspendedSubjects">、已停用 {{ stats.suspendedSubjects }} 个账号</span>）。
						「最后用过」是发现异常使用的第一手线索：一枚从没用过、或在你没预期的时间被用过的令牌，值得看一眼。
					</p>
					<p v-if="listError" class="tv-wb-error tv-admin-error" role="alert">{{ listError }}</p>
					<ul v-else class="tv-admin-subjects">
						<li v-for="subject in subjects" :key="subject.id" class="tv-admin-subject" :class="{ 'is-suspended': subject.status !== 'active' }">
							<div class="tv-admin-subject-head">
								<span class="tv-badge" :class="subject.role === 'staff' ? 'tv-badge--open' : 'tv-badge--dim'">
									{{ subject.role === "staff" ? "工作组" : "作者" }}
								</span>
								<b class="tv-admin-pin">{{ subject.pin }}</b>
								<span class="tv-muted">{{ subject.title || subject.id }}</span>
								<span class="tv-muted tv-admin-subject-id">{{ subject.id }}</span>
								<span v-if="subject.status !== 'active'" class="tv-badge tv-badge--dim tv-admin-status-badge">已停用</span>
								<button
									class="tv-btn tv-admin-status"
									type="button"
									:data-account="subject.id"
									:disabled="busyAccount === subject.id"
									@click="toggleStatus(subject)"
								>{{ subject.status === "active" ? "停用" : "恢复" }}</button>
								<button
									class="tv-btn tv-admin-issue-more"
									type="button"
									:data-account="subject.id"
									:disabled="busyAccount === subject.id"
									@click="issueMore(subject)"
								>签发新令牌</button>
							</div>
							<ul class="tv-admin-tokens">
								<li v-for="token in subject.tokens" :key="token.id" :class="{ 'is-revoked': token.revokedAt }">
									<code class="tv-admin-token-id">{{ token.id }}</code>
									<span>{{ token.label }}</span>
									<span class="tv-muted">签发 {{ shortDate(token.createdAt) }}</span>
									<span class="tv-muted">最后用过 {{ token.lastUsedAt ? shortDate(token.lastUsedAt) : "（还没用过）" }}</span>
									<span v-if="token.revokedAt" class="tv-badge tv-badge--dim">已吊销 {{ shortDate(token.revokedAt) }}</span>
									<button
										v-else
										class="tv-btn tv-admin-rotate"
										type="button"
										:data-token="token.id"
										:disabled="busyToken === token.id"
										@click="rotate(subject, token)"
									>轮换</button>
									<button
										v-if="!token.revokedAt"
										class="tv-btn tv-admin-revoke"
										type="button"
										:data-token="token.id"
										:disabled="busyToken === token.id"
										@click="revoke(subject, token)"
									>吊销</button>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- ── 3 · 最近动作（谁签发了谁，必须可查 §7.4 ⑦） ───────── -->
				<section class="tv-panel tv-wb-step" aria-labelledby="ad-trail">
					<h2 id="ad-trail"><span class="tv-wb-stepno">3</span>最近动作</h2>
					<ol class="tv-admin-trail">
						<li v-for="(entry, index) in trail" :key="index">
							<span class="tv-muted">{{ entry.at.slice(0, 16).replace("T", " ") }}</span>
							<b>{{ trailLabel(entry.action) }}</b>
							<span>{{ entry.target }}</span>
							<span class="tv-muted">by {{ entry.actor ?? "（服务器本机）" }}</span>
							<span v-if="entry.reason" class="tv-muted tv-admin-trail-reason">{{ entry.reason }}</span>
						</li>
					</ol>
					<p v-if="!trail.length" class="tv-muted">还没有记录。</p>
				</section>
			</template>
		</main>
	</div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import TavernNav from "./TavernNav.vue";
import "./tavern.css";

import { slugify } from "./workbench-model.mjs";
import { WRITE_API_BASE, submitHref } from "./api.mjs";

/**
 * 凭证管理台（§7.4 ②③④ / FR-16）
 * =============================================================================
 * 它与投稿工作台共用同一套零件（`.tv-panel` / `.tv-wb-auth` / `.tv-btn`），
 * 因为它们本来就是同一个流程的两端：这边签发，那边填写。
 *
 * 三条刻意的取舍：
 *   · **明文令牌不进任何持久化**：只活在 `issued` 这个 ref 里，刷新即消失 ——
 *     写进 localStorage 就违背了"只显示这一次"（那等于给了它第二个落点）。
 *   · **pin 自动从显示名派生、但可改**（同工作台的 slug）：签发人少打一遍字，
 *     而遇到已有规范用户名时仍能对齐（认领老作者就是这么用的）。
 *   · **吊销要二次确认**：吊销是立即生效且不可逆的（连带掐掉会话），
 *     误点一次就等于把一个人踢出门。
 */

const credentials = reactive({ pin: "", token: "" });
const account = ref(null);
const authBusy = ref(false);
const authError = ref("");

const form = reactive({ name: "", pin: "", kind: "person", role: "author", label: "", reason: "" });
const pinTouched = ref(false);

const subjects = ref([]);
const stats = ref({ subjects: 0, activeTokens: 0, revokedTokens: 0, staffActiveTokens: 0 });
const trail = ref([]);

const issued = ref(null);
const secretSaved = ref(false);
const copyState = ref("");

const issueBusy = ref(false);
const issueMessage = ref("");
const issueError = ref("");
const listError = ref("");
const busyAccount = ref("");
const busyToken = ref("");

const isStaff = computed(() => account.value?.role === "staff");
const canIssue = computed(() => Boolean(form.name) && /^[A-Za-z0-9._-]{2,32}$/.test(form.pin));
/** 本人登录的那一页：签发的收件人要知道去哪填这对凭证 */
const submitUrl = submitHref();

const shortDate = (value) => String(value ?? "").slice(0, 16).replace("T", " ");

const TRAIL_LABELS = {
	"account.created": "新建主体并签发",
	"account.created.claim": "认领既有主体并签发",
	"account.suspended": "停用账号",
	"account.reactivated": "恢复账号",
	"token.issued": "签发令牌",
	"token.rotated": "轮换令牌",
	"token.revoked": "吊销令牌",
	"auth.failed": "登录失败",
};
const trailLabel = (action) => TRAIL_LABELS[action] ?? action;

/**
 * 一次性明文那一屏在第 1 屏（签发）里，而「补发 / 轮换」的按钮在第 2 屏的清单里 ——
 * 不滚过去的话，签发人点完轮换只会看到清单刷新了、根本不知道明文已经出现。
 */
function revealSecret() {
	if (typeof document === "undefined") return;
	requestAnimationFrame(() => {
		document.querySelector(".tv-admin-secret")?.scrollIntoView({ behavior: "smooth", block: "center" });
	});
}

/** 派生 pin：与工作台派生 slug 同一套规则，避免"手打的用户名"和它长得不一样。 */
function onNameInput() {
	if (!pinTouched.value) form.pin = slugify(form.name).slice(0, 32);
}

/* ───────────────────────── 会话 ───────────────────────── */

function describeAuthError(message) {
	// 与工作台同一句提醒：管理台也必须与 API 同源（§7.7），否则 cookie 根本带不上
	return /Failed to fetch|NetworkError|HTTP (404|405)/.test(message)
		? `${message} —— 管理台必须与酒馆 API 同源部署：请从 API 域名访问本页；本机开发可用 ?api=http://127.0.0.1:9878（写接口只接受回环地址的覆盖）`
		: message;
}

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
		credentials.token = "";     // 用完即弃：明文只留在内存里，且立刻清掉
		await refresh();
	} catch (error) {
		authError.value = describeAuthError(String(error?.message ?? error));
	} finally {
		authBusy.value = false;
	}
}

async function signOut() {
	try {
		await fetch(`${WRITE_API_BASE}/v1/auth/session`, { method: "DELETE", credentials: "include" });
	} catch { /* 退出失败也要清本地状态 */ }
	account.value = null;
	subjects.value = [];
	trail.value = [];
	issued.value = null;
}

/** 刷新后 cookie 还在（HttpOnly），但页面状态没了 —— 用 /v1/me 把"已登录"找回来。 */
async function restoreSession() {
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/me`, { credentials: "include" });
		if (!response.ok) return;
		const payload = await response.json().catch(() => null);
		if (payload?.account) {
			account.value = payload.account;
			if (payload.account.role === "staff") await refresh();
		}
	} catch { /* 没登录或 API 不可达：第 0 步会让人重新登录 */ }
}

/* ───────────────────────── 取数与动作 ───────────────────────── */

async function refresh() {
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/credentials`, { credentials: "include" });
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `取不到凭证列表（HTTP ${response.status}）`);
		subjects.value = payload.subjects ?? [];
		stats.value = payload.stats ?? stats.value;
		trail.value = payload.trail ?? [];
		listError.value = "";
	} catch (error) {
		listError.value = describeAuthError(String(error?.message ?? error));
	}
}

/** 一次签发/吊销之后：把列表拉新，并把这一屏的提示留在原地。 */
async function issueCredential() {
	issueBusy.value = true;
	issueMessage.value = "";
	issueError.value = "";
	secretSaved.value = false;
	copyState.value = "";
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/authors`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ ...form }),
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `签发失败（HTTP ${response.status}）`);
		issued.value = {
			pin: payload.subject.pin,
			plaintext: payload.token.plaintext,
			accountId: payload.subject.id,
			claimed: payload.claimed,
		};
		issueMessage.value = payload.message ?? "已签发。";
		// 表单留着（同一批人往往要连着签几位），但令牌标签清掉 —— 它会误导下一枚的归属
		form.label = "";
		await refresh();
	} catch (error) {
		issueError.value = String(error?.message ?? error);
	} finally {
		issueBusy.value = false;
	}
}

async function issueMore(subject) {
	const label = window.prompt(`给「${subject.pin}」签发新令牌 —— 写上这枚令牌的标签（谁在用、什么设备）：`, "");
	if (label === null) return;
	busyAccount.value = subject.id;
	issueMessage.value = "";
	issueError.value = "";
	secretSaved.value = false;
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/credentials/${encodeURIComponent(subject.id)}/tokens`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ label }),
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `签发失败（HTTP ${response.status}）`);
		issued.value = { pin: subject.pin, plaintext: payload.token.plaintext, accountId: subject.id, claimed: false };
		issueMessage.value = payload.message ?? "新令牌已签发。";
		await refresh();
		revealSecret();
	} catch (error) {
		issueError.value = String(error?.message ?? error);
	} finally {
		busyAccount.value = "";
	}
}

/**
 * 轮换：补发新的 + 吊销旧的一步到位。
 *
 * 确认框里必须把"本人会当场下线"说明白 —— 这正是它与「签发新令牌」的区别，
 * 也是为什么默认做法是两步走（先补发、确认本人能用，再吊销旧的）。
 */
async function rotate(subject, token) {
	const ok = window.confirm(
		`轮换「${subject.pin}」的令牌 ${token.id}（${token.label}）？\n\n` +
		"会立刻作废这枚旧令牌（本人正在用的会话一起失效），并签发一枚新的。\n" +
		"⚠️ 新明文只在下一步显示一次 —— 在它交到本人手上之前，他一直登不进来。\n" +
		"如果不能当场交付，请改用「签发新令牌」：让他确认新凭证能用之后，再回来吊销这一枚。",
	);
	if (!ok) return;
	busyToken.value = token.id;
	issueMessage.value = "";
	issueError.value = "";
	secretSaved.value = false;
	try {
		const response = await fetch(
			`${WRITE_API_BASE}/v1/credentials/${encodeURIComponent(subject.id)}/tokens/${encodeURIComponent(token.id)}/rotate`,
			{ method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({}) },
		);
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `轮换失败（HTTP ${response.status}）`);
		issued.value = { pin: subject.pin, plaintext: payload.token.plaintext, accountId: subject.id, claimed: false };
		issueMessage.value = payload.message ?? "已轮换。";
		await refresh();
		revealSecret();
	} catch (error) {
		issueError.value = String(error?.message ?? error);
	} finally {
		busyToken.value = "";
	}
}

/**
 * 停用 / 恢复账号。停用是"这个人现在不能进系统"，与"收回某一枚令牌"是两件事：
 * 令牌保留着，所以恢复是瞬时的（不用重新签发、重新交付）。
 */
async function toggleStatus(subject) {
	const suspending = subject.status === "active";
	const ok = window.confirm(suspending
		? `停用「${subject.pin}」？\n\n他名下的会话会立刻失效，从此登不进来。\n` +
			"令牌**保留**着 —— 恢复之后他用原来那枚就能继续用，不必重新签发。\n" +
			"已上架的内容不受影响：停用针对的是人，不是作品。"
		: `恢复「${subject.pin}」？\n\n恢复之后他用原来那枚令牌就能重新登录（停用期间令牌一直没动）。`);
	if (!ok) return;
	busyAccount.value = subject.id;
	issueMessage.value = "";
	issueError.value = "";
	try {
		const response = await fetch(`${WRITE_API_BASE}/v1/credentials/${encodeURIComponent(subject.id)}/status`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ status: suspending ? "suspended" : "active", reason: "工作组在管理台操作" }),
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `操作失败（HTTP ${response.status}）`);
		issueMessage.value = payload.message ?? "已更新状态。";
		await refresh();
	} catch (error) {
		issueError.value = String(error?.message ?? error);
	} finally {
		busyAccount.value = "";
	}
}

async function revoke(subject, token) {
	/*
	 * 二次确认不是走形式：吊销立即生效、不可逆，还会连带掐掉本人在用的会话
	 * （他正填着投稿会突然提交失败）。所以确认框里把这两件事都说清楚。
	 */
	const ok = window.confirm(
		`吊销「${subject.pin}」的令牌 ${token.id}（${token.label}）？\n\n` +
		"立即生效，且不可撤销：本人正在使用的会话会一起失效。\n" +
		"如果只是想换设备，正确做法是先签发新令牌、确认能登录，再吊销这一枚。",
	);
	if (!ok) return;
	busyToken.value = token.id;
	issueMessage.value = "";
	issueError.value = "";
	try {
		const response = await fetch(
			`${WRITE_API_BASE}/v1/credentials/${encodeURIComponent(subject.id)}/tokens/${encodeURIComponent(token.id)}`,
			{ method: "DELETE", credentials: "include" },
		);
		const payload = await response.json().catch(() => null);
		if (!response.ok) throw new Error(payload?.message ?? `吊销失败（HTTP ${response.status}）`);
		issueMessage.value = payload.message ?? "已吊销。";
		await refresh();
	} catch (error) {
		issueError.value = String(error?.message ?? error);
	} finally {
		busyToken.value = "";
	}
}

async function copySecret() {
	if (!issued.value) return;
	const text = `pin: ${issued.value.pin}\ntoken: ${issued.value.plaintext}`;
	try {
		await navigator.clipboard.writeText(text);
		copyState.value = "已复制到剪贴板。";
	} catch {
		// 无剪贴板权限（http、无头浏览器、用户拒绝）是常态，不是错误：让人手动选中复制
		copyState.value = "剪贴板不可用 —— 请手动选中上面两行复制。";
	}
}

onMounted(() => { void restoreSession(); });
</script>
