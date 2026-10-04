<template>
	<section class="tv-facet" :aria-label="ariaLabel || title">
		<h2 class="tv-facet-title">
			<span>{{ title }}</span>
			<span v-if="hint" class="tv-facet-hint">{{ hint }}</span>
		</h2>

		<label v-if="searchable && expanded" class="tv-sr-only" :for="searchId">{{ searchLabel }}</label>
		<input
			v-if="searchable && expanded"
			:id="searchId"
			v-model="keyword"
			class="tv-facet-search"
			type="search"
			:placeholder="searchPlaceholder"
			:aria-label="searchLabel"
		/>

		<div :class="{ 'tv-facet-scroll': expanded && scrollable }">
			<ul class="tv-chips">
				<li v-for="option in visibleOptions" :key="option.key">
					<button
						class="tv-chip"
						:class="{ 'is-active': isSelected(option.key), 'is-empty': option.count === 0 }"
						type="button"
						:aria-pressed="isSelected(option.key) ? 'true' : 'false'"
						:aria-label="chipLabel(option)"
						:title="chipLabel(option)"
						@click="$emit('toggle', option.key)"
					>
						<span>{{ option.label }}</span>
						<span v-if="showCounts" class="tv-chip-count">{{ option.count }}</span>
						<span v-if="isSelected(option.key)" aria-hidden="true">✓</span>
					</button>
				</li>
				<li v-if="showMoreToggle">
					<button class="tv-chip tv-chip-more" type="button" :aria-expanded="expanded ? 'true' : 'false'" @click="expanded = !expanded">
						{{ expanded ? collapseLabel : moreLabel }}
					</button>
				</li>
				<li v-if="expanded && searchable && !visibleOptions.length">
					<span class="tv-muted">{{ noMatchLabel }}</span>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import { computed, ref, useId } from "vue";

const props = defineProps({
	title: { type: String, required: true },
	hint: { type: String, default: "" },
	/** [{ key, label, count }] */
	options: { type: Array, default: () => [] },
	selected: { type: Array, default: () => [] },
	ariaLabel: { type: String, default: "" },
	showCounts: { type: Boolean, default: true },
	/** 折叠时显示多少个选项；0 表示全部显示 */
	maxVisible: { type: Number, default: 0 },
	searchable: { type: Boolean, default: false },
	scrollable: { type: Boolean, default: false },
	searchLabel: { type: String, default: "搜索筛选项" },
	searchPlaceholder: { type: String, default: "筛选…" },
	moreLabel: { type: String, default: "更多…" },
	collapseLabel: { type: String, default: "收起" },
	noMatchLabel: { type: String, default: "没有匹配的筛选项" },
});

defineEmits(["toggle"]);

const searchId = useId();
const keyword = ref("");
const expanded = ref(false);

const showMoreToggle = computed(() => props.maxVisible > 0 && props.options.length > props.maxVisible);

const visibleOptions = computed(() => {
	const keywordValue = keyword.value.trim().toLowerCase();
	const selectedSet = new Set(props.selected);
	if (expanded.value && props.searchable && keywordValue) {
		return props.options.filter((option) => String(option.label).toLowerCase().includes(keywordValue));
	}
	if (expanded.value) return props.options;
	const head = props.options.slice(0, props.maxVisible || props.options.length);
	// 折叠时也要保证已选项可见，否则用户会以为筛选丢了
	for (const option of props.options) {
		if (selectedSet.has(option.key) && !head.includes(option)) head.push(option);
	}
	return head;
});

function isSelected(key) {
	return props.selected.includes(key);
}

function chipLabel(option) {
	if (typeof option.count !== "number") return option.label;
	return `${option.label}（${option.count} 条）`;
}
</script>
