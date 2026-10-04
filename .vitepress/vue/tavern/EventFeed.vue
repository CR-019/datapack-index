<template>
	<section v-if="visible" class="tv-panel tv-events" aria-labelledby="tavern-event-feed">
		<h2 id="tavern-event-feed">事件流</h2>

		<!-- 取数失败（非 404）：面板里给一条可重试的提示，而不是整页报错 -->
		<p v-if="error" class="tv-event-warn" role="alert">
			{{ error }}
			<button type="button" class="tv-btn" @click="reload">重试</button>
		</p>

		<p v-if="loading && !events.length" class="tv-muted" role="status" aria-live="polite">
			<span class="tv-spinner" aria-hidden="true"></span>
			正在读取事件流…
		</p>

		<!-- 端点在、但一条事件都没有 → 明确空态（不塌成空白）；端点不存在（404）→ 整块不渲染 -->
		<p v-else-if="!events.length && !error" class="tv-event-empty" role="status">
			<span class="tv-event-empty-icon" aria-hidden="true">🕒</span>
			暂无事件记录 —— 这个条目还没有任何"已发生的事实"被记下来
			（招募招满、标记完结、审核上架时，后端会自动追加一条）。
		</p>

		<template v-else-if="events.length">
			<p class="tv-muted tv-event-meta">
				事件是"发生了什么"的真相源（ADR-009）：只追加、不倒序改，最新在最上面。
				共 {{ totalText }}<template v-if="sourceNote">，{{ sourceNote }}</template>。
			</p>

			<ol class="tv-event-list">
				<li v-for="event in events" :key="event.id" class="tv-event" :class="`is-${event.kind}`">
					<span class="tv-event-dot" aria-hidden="true" />
					<div class="tv-event-main">
						<div class="tv-event-head">
							<time class="tv-event-time" :datetime="event.at || undefined" :title="absoluteText(event.at)">
								{{ relativeText(event.at) }}
							</time>
							<span class="tv-event-kind" :class="`is-${event.kind}`">{{ kindText(event.kind) }}</span>
							<span v-if="statusText(event)" class="tv-event-status">{{ statusText(event) }}</span>
							<span
								v-if="event.source === 'derived'"
								class="tv-event-source"
								title="由后端在收敛型修改时自动追加（source=derived）"
							>{{ sourceText(event.source) }}</span>
						</div>
						<p class="tv-event-title">{{ event.title || "（这条事件没有标题）" }}</p>
						<!-- 不引 markdown 解析器、也不用 v-html：纯文本 + 保留换行就够，
						     而且不会给"后端数据 → innerHTML"开一个 XSS 面。 -->
						<p v-if="event.body" class="tv-event-text">{{ event.body }}</p>
					</div>
				</li>
			</ol>

			<div class="tv-event-foot">
				<button v-if="hasMore" type="button" class="tv-btn" :disabled="loading" @click="loadMore">
					{{ loading ? "正在加载…" : moreLabel }}
				</button>
				<span v-else class="tv-muted">已经到底了。</span>
			</div>
		</template>
	</section>
</template>

<script setup>
/**
 * 事件流（ADR-009 / §6.6）
 * =============================================================================
 * · **倒序**：最新的在最上面；`at` 相同的事件保持后端给的相对顺序（稳定的排序，不打乱）。
 * · **时间**：相对时间（"19 天前"）+ `title` 里挂绝对时间；`datetime` 属性给机器读。
 * · **类型徽标**：state / milestone / recruit / relation / note 五色，全部走 `--vp-c-*` 变量。
 * · **body**：有值才渲染。不引 markdown 解析器、不用 `v-html`（理由见模板注释）：纯文本 +
 *   `white-space: pre-wrap` 保留换行就够了 —— 事件的长描述本来就"超过一句话要走待审修订"，
 *   正文不在这个只读视图的职责里。
 * · **分页**：一次 20 条，`?limit=` 递增后重取（接口是"从最新往回数 N 条"，不是 cursor）。
 * · **降级**：
 *     - 后端还没有这个端点（HTTP 404）→ 整块不渲染，只在控制台留一条 warn；
 *     - 其它错误（网络 / 5xx）→ 面板内一行可重试的提示，不炸整页；
 *     - 端点返回空数组 → **明确空态**（"暂无事件记录"），不是塌成一片空白；
 *     - 事件缺 `status`（最终契约里就没有这个字段）→ 那枚徽标直接不渲染，不算错。
 */
import { computed, ref, watch } from "vue";

import {
	eventKindLabel,
	eventSourceLabel,
	eventStatusLabel,
	fetchNodeEvents,
	formatDateTime,
	relativeTime,
	snapshotFallbackState,
} from "./api.mjs";

const PAGE_SIZE = 20;

const props = defineProps({
	nodeId: { type: String, default: "" },
	/** 父级（例如快照兜底分支）已经拿到的这几条事件，有就直接用，省一次请求。 */
	initialEvents: { type: Array, default: () => [] },
});

const events = ref([]);
const total = ref(0);
const limit = ref(PAGE_SIZE);
const loading = ref(false);
const loaded = ref(false);
const error = ref("");
const silent = ref(false); // 404（后端还没上这个端点）→ 静默，不渲染、不报错
const fromSnapshot = ref(false);

const visible = computed(() => {
	if (silent.value) return false; // 后端没有这个端点 → 整块不渲染，不留空壳
	if (error.value || loading.value) return true;
	return loaded.value; // 取数完成：有数据就列表，没有就明确空态
});
const hasMore = computed(() => {
	if (error.value) return false;
	if (total.value) return events.value.length < total.value;
	return events.value.length >= limit.value;
});
const remaining = computed(() => (total.value ? Math.max(0, total.value - events.value.length) : 0));
const moreLabel = computed(() => (remaining.value ? `加载更多（还有 ${remaining.value} 条）` : "加载更多"));
const totalText = computed(() => {
	if (total.value) return `${total.value} 条已记录的事件`;
	return `${events.value.length} 条事件`;
});
const sourceNote = computed(() => {
	if (!fromSnapshot.value) return "";
	if (snapshotFallbackState()) return "来自静态快照，可能不是最新";
	return "来自静态快照";
});

function absoluteText(value) {
	return value ? formatDateTime(value) : "";
}

function relativeText(value) {
	return value ? relativeTime(value) : "时间未记录";
}

function kindText(kind) {
	return eventKindLabel(kind);
}

function sourceText(source) {
	return eventSourceLabel(source) || "系统自动";
}

function statusText(event) {
	return eventStatusLabel(event);
}

async function fetchPage(size) {
	loading.value = true;
	error.value = "";
	try {
		const data = await fetchNodeEvents(props.nodeId, { limit: size });
		events.value = data.items;
		total.value = data.total || data.items.length;
		fromSnapshot.value = data.source === "snapshot";
		loaded.value = true;
	} catch (caught) {
		const kind = caught && caught.kind;
		if (kind === "not-found") {
			// 后端这一版还没有 /v1/nodes/:id/events —— 安静地不渲染，不算错误。
			silent.value = true;
			events.value = [];
			console.warn("[tavern] 事件流端点不可用（HTTP 404），本区块不渲染", props.nodeId);
		} else {
			error.value = caught && caught.message ? caught.message : String(caught);
			console.warn("[tavern] 事件流加载失败", caught);
		}
	} finally {
		loading.value = false;
	}
}

function reload() {
	error.value = "";
	silent.value = false;
	void fetchPage(PAGE_SIZE);
}

function loadMore() {
	limit.value += PAGE_SIZE;
	void fetchPage(limit.value);
}

function seed() {
	if (silent.value) return;
	error.value = "";
	limit.value = PAGE_SIZE;
	if (props.initialEvents.length) {
		events.value = props.initialEvents;
		total.value = props.initialEvents.length;
		limit.value = Math.max(PAGE_SIZE, props.initialEvents.length);
		loaded.value = true;
		fromSnapshot.value = snapshotFallbackState() != null;
		return;
	}
	events.value = [];
	void fetchPage(PAGE_SIZE);
}

watch(() => props.nodeId, () => {
	// 同一个页面里换了条目（?id= 变了）→ 重新来一遍
	silent.value = false;
	loaded.value = false;
	seed();
});

watch(() => props.initialEvents, (value) => {
	if (!loaded.value && value && value.length) seed();
});

if (props.nodeId) seed();
</script>
