<template>
	<p v-if="state" class="tv-stale" role="status">
		<span class="tv-stale__mark" aria-hidden="true">!</span>
		<span>
			当前显示的是<strong>静态快照</strong>（后端暂时连不上），<strong>数据可能不是最新的</strong>。
			<template v-if="generatedText">快照生成于 {{ generatedText }}。</template>
		</span>
	</p>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { onSnapshotFallback } from "./api.mjs";

// 设计文档 §11.2：降级时必须在 UI 上说明，不能只打 console.warn ——
// 否则读者无从知道自己看到的是旧数据。
const state = ref(null);
let unsubscribe = null;

const generatedText = computed(() => {
	const raw = state.value?.generatedAt;
	if (!raw) return "";
	const date = new Date(raw);
	return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("zh-CN");
});

onMounted(() => {
	unsubscribe = onSnapshotFallback((value) => {
		state.value = value;
	});
});

onBeforeUnmount(() => {
	if (unsubscribe) unsubscribe();
});
</script>

<style scoped>
.tv-stale {
	display: flex;
	gap: 0.5rem;
	align-items: flex-start;
	margin: 0 0 1rem;
	padding: 0.6rem 0.85rem;
	border: 1px solid var(--vp-c-warning-1, #d9a441);
	border-radius: 10px;
	background: var(--vp-c-warning-soft, rgba(217, 164, 65, 0.12));
	color: var(--vp-c-text-1);
	font-size: 0.875rem;
	line-height: 1.5;
}

.tv-stale__mark {
	flex: none;
	width: 1.25rem;
	height: 1.25rem;
	margin-top: 0.1rem;
	border-radius: 50%;
	background: var(--vp-c-warning-1, #d9a441);
	color: #fff;
	font-weight: 700;
	font-size: 0.8rem;
	line-height: 1.25rem;
	text-align: center;
}
</style>
