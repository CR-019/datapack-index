<template>
	<nav class="tv-nav" :aria-label="ariaLabel">
		<a :href="boardUrl">酒馆看板</a>
		<template v-for="item in crumbs" :key="item.label">
			<span class="tv-nav-sep" aria-hidden="true">/</span>
			<a v-if="item.href" :href="item.href">{{ item.label }}</a>
			<span v-else aria-current="page">{{ item.label }}</span>
		</template>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { TAVERN_PATHS, withSiteBase } from "./api.mjs";

const props = defineProps({
	/** 中间层级的链接，例如 [{ label: "全部标签", href: "/tavern/tags" }] */
	crumbs: { type: Array, default: () => [] },
	ariaLabel: { type: String, default: "酒馆看板导航" },
});

const boardUrl = computed(() => withSiteBase(TAVERN_PATHS.board));
</script>
