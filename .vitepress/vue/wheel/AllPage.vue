<template>
	<div class="page-frame">
		<div class="search-container">
			<div class="header">
				<img src="/icons/cart_with_chest.png" alt="" class="logo" />
				<div class="title-container">
					<span class="title">{{ siteTitle }}</span>
					<span class="subtitle">{{ siteSubtitle }}</span>
				</div>
			</div>
			<div class="action-row">
				<button class="action-button" type="button" @click="goToSearch">{{ backLabel }}</button>
				<button class="action-button" type="button" @click="submit">{{ submitLabel }}</button>
			</div>
			<p v-if="loading" class="state-message">{{ loadingLabel }}</p>
			<p v-else-if="error" class="state-message state-message--error">{{ error }}</p>
			<div v-else class="results">
				<ResultCard v-for="item in paginatedItems" :key="item.id" :item="item" @select="goToResource" />
			</div>
			<div v-if="!loading && !error && totalPages > 1" class="pagination">
				<button class="page-btn" type="button" :disabled="page <= 1" @click="setPage(page - 1)">{{ previousLabel }}</button>
				<span>{{ pageLabel }} {{ page }} / {{ totalPages }}</span>
				<button class="page-btn" type="button" :disabled="page >= totalPages" @click="setPage(page + 1)">{{ nextLabel }}</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useData } from "vitepress";
import ResultCard from "./ResultCard.vue";
import { fetchPackageCards } from "./mcfpmPackages.mjs";

export default {
	components: { ResultCard },
	setup() {
		const { lang } = useData();
		return { lang };
	},
	data() {
		return { data: [], page: 1, pageSize: 12, loading: true, error: "", originalTitle: "" };
	},
	computed: {
		isEnglish() { return String(this.lang || "").startsWith("en"); },
		siteTitle() { return this.isEnglish ? "Vanilla Wheel · All Packages" : "香草前置馆 · 全部资源"; },
			siteSubtitle() { return this.isEnglish ? "Repository packages with the legacy catalog as a fallback" : "软件仓库动态索引，原有资料静态兜底"; },
		backLabel() { return this.isEnglish ? "Back to search" : "返回搜索页面"; },
		submitLabel() { return this.isEnglish ? "Submit" : "投稿"; },
		loadingLabel() { return this.isEnglish ? "Loading the package index…" : "正在获取软件包索引…"; },
		previousLabel() { return this.isEnglish ? "Previous" : "上一页"; },
		nextLabel() { return this.isEnglish ? "Next" : "下一页"; },
		pageLabel() { return this.isEnglish ? "Page" : "第"; },
		totalPages() { return Math.max(1, Math.ceil(this.data.length / this.pageSize)); },
		paginatedItems() {
			const start = (this.page - 1) * this.pageSize;
			return this.data.slice(start, start + this.pageSize);
		},
	},
	methods: {
		async fetchData() {
			this.loading = true;
			this.error = "";
			try {
					this.data = await fetchPackageCards();
			} catch (error) {
					this.error = this.isEnglish ? "The package catalogs are temporarily unavailable." : "动态索引和静态资料暂时均不可用，请稍后重试。";
				console.warn("Mcfpm package index fetch failed", error);
			} finally {
				this.loading = false;
			}
		},
		setPage(page) {
			this.page = Math.min(this.totalPages, Math.max(1, Number(page) || 1));
			const url = new URL(window.location.href);
			url.searchParams.set("page", String(this.page));
			window.history.replaceState(null, "", url);
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		goToResource(path) { window.location.assign(path); },
		goToSearch() { window.location.assign(this.isEnglish ? "/datapack-index/en/wheel" : "/datapack-index/wheel"); },
		submit() { window.open("https://github.com/Alumopper/datapack-index-mcfpm-staging/issues/new?template=new_wheel.yml", "_blank", "noopener,noreferrer"); },
	},
	async mounted() {
		this.originalTitle = document.title;
		document.title = this.siteTitle;
		this.page = Math.max(1, Number(new URL(window.location.href).searchParams.get("page")) || 1);
		await this.fetchData();
		this.page = Math.min(this.page, this.totalPages);
	},
	beforeUnmount() { if (this.originalTitle) document.title = this.originalTitle; },
};
</script>

<style scoped>
.page-frame { min-height: 72vh; padding: 36px 20px; background: linear-gradient(180deg, rgba(250, 251, 253, 0.98), rgba(248, 250, 255, 0.995)); }
.search-container { display: flex; flex-direction: column; align-items: center; max-width: 1100px; margin: 0 auto; }
.header { display: flex; align-items: center; justify-content: center; min-height: 140px; margin-bottom: 12px; }
.logo { width: auto; height: 104px; margin-right: 20px; }
.title-container { display: flex; flex-direction: column; }
.title { font-size: clamp(28px, 4vw, 38px); font-weight: 800; line-height: 1.1; }
.subtitle { margin-top: 10px; color: var(--vp-c-text-2); }
.action-row { display: flex; gap: 24px; margin-bottom: 26px; }
.action-button { min-width: 116px; height: 42px; padding: 0 16px; border: 0; border-radius: 22px; background: #1e90ff; color: #fff; cursor: pointer; }
.action-button:hover { background: #297fe6; }
.results { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; width: min(920px, 100%); }
.pagination { display: flex; align-items: center; gap: 14px; margin: 28px 0; color: var(--vp-c-text-2); }
.page-btn { padding: 8px 13px; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.page-btn:disabled { cursor: not-allowed; opacity: 0.5; }
.state-message { margin: 24px 0; color: var(--vp-c-text-2); }
.state-message--error { color: var(--vp-c-danger-1); }
.dark .page-frame { background: var(--vp-c-bg); }
@media (max-width: 760px) {
	.page-frame { padding: 18px 12px; }
	.header { flex-direction: column; text-align: center; }
	.logo { height: 86px; margin: 0 0 12px; }
	.results { grid-template-columns: 1fr; }
}
</style>
