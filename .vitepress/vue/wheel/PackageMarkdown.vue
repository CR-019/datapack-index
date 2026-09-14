<template>
	<div ref="root" class="package-markdown package-markdown-host" @click="copyCodeBlock">
		<component :is="renderedComponent" v-if="renderedComponent" />
		<p v-else-if="renderError" class="package-markdown-error">{{ renderError }}</p>
	</div>
</template>

<script setup>
import * as VueRuntime from "vue";
import { compile } from "@vue/compiler-dom";
import { computed, defineComponent, markRaw, ref, shallowRef, watch } from "vue";
import { useData } from "vitepress";

import { mcfunction } from "../../highlights/mcfuntion";
import { mcdoc } from "../../highlights/mcdoc/mcdoc";
import { snbt } from "../../highlights/snbt";
import { renderRuntimeMarkdown } from "./runtimeMarkdown.mjs";

const props = defineProps({
	source: { type: String, default: "" },
	documentPath: { type: String, default: "" },
});
const { lang } = useData();
const english = computed(() => String(lang.value || "").startsWith("en"));
const renderedComponent = shallowRef(null);
const renderError = ref("");
const root = ref(null);
let activeRender = 0;
let highlighterPromise;

async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("shiki").then(async ({ createHighlighter }) => {
			const highlighter = await createHighlighter({
				themes: ["github-light", "github-dark"],
				langs: ["javascript", "typescript", "json", "yaml", "bash", "powershell", "python", "java", "css", "html", "vue", "markdown", "xml", "diff", "toml", "plaintext"],
			});
			await highlighter.loadLanguage(mcfunction);
			await highlighter.loadLanguage(mcdoc);
			await highlighter.loadLanguage(snbt);
			return highlighter;
		});
	}
	return highlighterPromise;
}

async function renderSource() {
	const job = ++activeRender;
	renderError.value = "";
	if (!props.source) {
		renderedComponent.value = null;
		return;
	}
	try {
		const highlighter = await getHighlighter();
		if (job !== activeRender) return;
		const html = renderRuntimeMarkdown(props.source, {
			highlighter,
			english: english.value,
			documentPath: props.documentPath,
			baseUrl: import.meta.env.BASE_URL || "/",
		});
		const diagnostics = [];
		const result = compile(`<div class="vp-doc package-markdown">${html}</div>`, {
			mode: "function",
			hoistStatic: false,
			cacheHandlers: false,
			onError: (error) => diagnostics.push(error),
		});
		if (diagnostics.length) throw diagnostics[0];
		const render = new Function("Vue", result.code)(VueRuntime);
		const EmptyInfoCard = defineComponent({ name: "RuntimeInfoCard", render: () => null });
		renderedComponent.value = markRaw(defineComponent({
			name: "RuntimePackageMarkdown",
			components: { InfoCard: EmptyInfoCard },
			render,
		}));
	} catch (error) {
		if (job !== activeRender) return;
		renderedComponent.value = null;
		renderError.value = english.value
			? "This package documentation could not be rendered safely."
			: "该软件包的介绍文档无法安全渲染。";
		console.warn("Package Markdown rendering failed", error);
	}
}

async function copyCodeBlock(event) {
	const button = event.target.closest?.("button.copy");
	if (!button || !root.value?.contains(button)) return;
	const code = button.parentElement?.querySelector("pre code")?.textContent;
	if (typeof code !== "string") return;
	await navigator.clipboard.writeText(code);
	button.classList.add("copied");
	window.setTimeout(() => button.classList.remove("copied"), 1600);
}

watch([() => props.source, () => props.documentPath, english], renderSource, { immediate: true });
</script>

<style scoped>
.package-markdown-error { margin: 24px 0; color: var(--vp-c-danger-1); }
</style>
