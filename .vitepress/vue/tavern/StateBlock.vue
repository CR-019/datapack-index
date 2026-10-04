<template>
	<div
		v-if="loading"
		class="tv-state"
		role="status"
		aria-live="polite"
	>
		<p class="tv-state-text"><span class="tv-spinner" aria-hidden="true"></span> {{ loadingText }}</p>
	</div>

	<div v-else-if="error" class="tv-state tv-state--error" role="alert">
		<div class="tv-state-icon" aria-hidden="true">⚠</div>
		<h3 class="tv-state-title">{{ errorTitle }}</h3>
		<p class="tv-state-text">{{ error }}</p>
		<div class="tv-state-actions">
			<button class="tv-btn tv-btn--primary" type="button" :aria-label="retryLabel" @click="$emit('retry')">
				{{ retryLabel }}
			</button>
			<slot name="actions" />
		</div>
	</div>

	<div v-else-if="empty" class="tv-state">
		<div class="tv-state-icon" aria-hidden="true">🔍</div>
		<h3 class="tv-state-title">{{ emptyTitle }}</h3>
		<p class="tv-state-text">{{ emptyText }}</p>
		<div v-if="$slots.actions" class="tv-state-actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup>
defineProps({
	loading: { type: Boolean, default: false },
	error: { type: String, default: "" },
	empty: { type: Boolean, default: false },
	loadingText: { type: String, default: "正在从酒馆后端取数…" },
	errorTitle: { type: String, default: "取数失败了" },
	emptyTitle: { type: String, default: "没有符合条件的条目" },
	emptyText: { type: String, default: "试着换个关键字，或者清掉几个筛选条件。" },
	retryLabel: { type: String, default: "重新加载" },
});

defineEmits(["retry"]);
</script>
