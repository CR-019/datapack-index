<template>
	<div class="page-frame">
		<div class="search-container">
			<div class="header" :class="{ 'header--shrunk': headerShrunk }">
				<img src="/icons/cart_with_chest.png" alt="" class="logo" />
				<div class="title-container">
					<span class="title">{{ siteTitle }}</span>
					<span class="subtitle">{{ siteSubtitle }}</span>
				</div>
			</div>

			<div class="search-row">
				<div class="search-box-container">
					<input
						v-model="query"
						class="search-box"
						:placeholder="searchPlaceholder"
						:aria-label="searchLabel"
						@input="updateSuggestions"
						@keydown="onKeydown"
						@keyup.enter="doSearch"
						@focus="isInputFocused = true"
						@blur="onInputBlur"
					/>
					<button class="search-box-button" type="button" :aria-label="searchLabel" @click="doSearch">
						<img src="/icons/search.png" alt="" class="icon" />
					</button>
					<ul v-if="query.trim() && suggestions.length && isInputFocused" class="suggestions" role="listbox">
						<li
							v-for="(suggestion, index) in suggestions"
							:key="suggestion.id"
							:class="['suggestion-item', { active: suggestionIndex === index }]"
							@mousedown.prevent
							@click="selectSuggestion(suggestion)"
						>
							<span class="suggestion-name">{{ suggestion.name }}</span>
							<span class="suggestion-desc">{{ suggestion.description }}</span>
						</li>
					</ul>
				</div>
				<button class="submit-button" type="button" @click="submit">
					<svg class="submit-icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 3v12M8 7l4-4 4 4M21 21H3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
					</svg>
					{{ submitLabel }}
				</button>
			</div>

			<p v-if="loading" class="state-message">{{ loadingLabel }}</p>
			<p v-else-if="error" class="state-message state-message--error">{{ error }}</p>
			<div v-else-if="!showRandomSection" class="results">
				<ResultCard v-for="item in results" :key="item.id" :item="item" @select="goToResource" />
			</div>
			<div v-else class="results">
				<ResultCard v-for="item in randomResults" :key="item.id" :item="item" @select="goToResource" />
			</div>

			<div class="browse-toggle-row">
				<button class="browse-toggle" type="button" @click="goToAll">{{ browseAllLabel }}</button>
				<span class="bt-divider" aria-hidden="true"></span>
				<button class="browse-toggle" type="button" @click="toggleBrowse">{{ browseText }}</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useData } from "vitepress";
import ResultCard from "./ResultCard.vue";
import { fetchMcfpmPackages, filterPackageCards } from "./mcfpmPackages.mjs";

export default {
	components: { ResultCard },
	setup() {
		const { lang } = useData();
		return { lang };
	},
	data() {
		return {
			query: "",
			data: [],
			results: [],
			suggestions: [],
			suggestionIndex: -1,
			isInputFocused: false,
			showRandomSection: false,
			randomResults: [],
			loading: true,
			error: "",
			originalTitle: "",
		};
	},
	computed: {
		isEnglish() {
			return String(this.lang || "").startsWith("en");
		},
		siteTitle() {
			return this.isEnglish ? "Vanilla Prerequisite Library" : "香草前置馆";
		},
		siteSubtitle() {
			return this.isEnglish ? "Live packages from Mcfpm repositories" : "由 Mcfpm 软件仓库实时提供";
		},
		searchPlaceholder() {
			return this.isEnglish ? "Search name, author, tag, or coordinate" : "搜索名称、作者、标签或 Maven 坐标";
		},
		searchLabel() {
			return this.isEnglish ? "Search" : "搜索";
		},
		submitLabel() {
			return this.isEnglish ? "Submit" : "投稿";
		},
		loadingLabel() {
			return this.isEnglish ? "Loading the package index…" : "正在获取软件包索引…";
		},
		browseAllLabel() {
			return this.isEnglish ? "Browse all packages" : "查看全部资源";
		},
		browseText() {
			if (this.showRandomSection) return this.isEnglish ? "Another batch?" : "再换一批？";
			return this.isEnglish ? "Or browse randomly?" : "或者随便看看？";
		},
		headerShrunk() {
			return this.showRandomSection || this.results.length > 0 || this.isInputFocused;
		},
	},
	methods: {
		async fetchData() {
			this.loading = true;
			this.error = "";
			try {
				this.data = await fetchMcfpmPackages();
			} catch (error) {
				this.error = this.isEnglish ? "The package index is temporarily unavailable." : "软件包索引暂时不可用，请稍后重试。";
				console.warn("Mcfpm package index fetch failed", error);
			} finally {
				this.loading = false;
			}
		},
		updateSuggestions() {
			this.suggestions = filterPackageCards(this.data, this.query).slice(0, 5);
			this.suggestionIndex = -1;
		},
		onKeydown(event) {
			const count = this.suggestions.length;
			if (event.key === "Escape") {
				this.suggestions = [];
				this.suggestionIndex = -1;
				return;
			}
			if (!count) return;
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				const delta = event.key === "ArrowDown" ? 1 : -1;
				this.suggestionIndex = (this.suggestionIndex + delta + count) % count;
			} else if ((event.key === "Enter" || event.key === "Tab") && this.suggestionIndex >= 0) {
				event.preventDefault();
				this.selectSuggestion(this.suggestions[this.suggestionIndex]);
			}
		},
		onInputBlur() {
			this.isInputFocused = false;
			window.setTimeout(() => { this.suggestions = []; }, 120);
		},
		selectSuggestion(item) {
			this.query = item.name;
			this.suggestions = [];
			this.doSearch();
		},
		doSearch() {
			this.results = filterPackageCards(this.data, this.query).slice(0, 40);
			this.showRandomSection = false;
			this.suggestions = [];
		},
		refreshRandom() {
			this.randomResults = [...this.data].sort(() => Math.random() - 0.5).slice(0, 6);
		},
		toggleBrowse() {
			this.refreshRandom();
			this.showRandomSection = true;
			this.results = [];
		},
		goToResource(path) {
			window.location.assign(path);
		},
		goToAll() {
			window.location.assign(this.isEnglish ? "/datapack-index/en/wheel/all" : "/datapack-index/wheel/all");
		},
		submit() {
			window.open("https://github.com/Alumopper/datapack-index-mcfpm-staging/issues/new?template=new_wheel.yaml", "_blank", "noopener,noreferrer");
		},
	},
	async mounted() {
		this.originalTitle = document.title;
		document.title = this.siteTitle;
		await this.fetchData();
	},
	beforeUnmount() {
		if (this.originalTitle) document.title = this.originalTitle;
	},
};
</script>

<style scoped>
.page-frame {
	min-height: 72vh;
	padding: 36px 20px;
	background: linear-gradient(180deg, rgba(250, 251, 253, 0.98), rgba(248, 250, 255, 0.995));
}

.search-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 1100px;
	margin: 0 auto;
}

.header {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	transition: min-height 180ms ease;
}

.header--shrunk { min-height: 128px; }
.logo { width: auto; height: 112px; margin-right: 20px; }
.title-container { display: flex; flex-direction: column; }
.title { font-size: clamp(30px, 5vw, 46px); font-weight: 800; line-height: 1; }
.subtitle { margin-top: 12px; color: var(--vp-c-text-2); }

.search-row {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	width: min(760px, 100%);
	margin-bottom: 28px;
}

.search-box-container { position: relative; flex: 1; }
.search-box {
	width: 100%;
	height: 48px;
	padding: 0 56px 0 20px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 24px;
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	font-size: 15px;
	box-shadow: 0 8px 24px rgba(12, 24, 40, 0.06);
}
.search-box:focus { border-color: var(--vp-c-brand-1); outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent); }
.search-box-button {
	position: absolute;
	top: 4px;
	right: 5px;
	width: 40px;
	height: 40px;
	border: 0;
	border-radius: 50%;
	background: transparent;
	cursor: pointer;
}
.icon { width: 22px; height: 22px; }

.submit-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 48px;
	padding: 0 18px;
	border: 0;
	border-radius: 24px;
	background: #1e90ff;
	color: #fff;
	font-weight: 600;
	cursor: pointer;
}
.submit-button:hover { background: #297fe6; }
.submit-icon { width: 18px; height: 18px; }

.suggestions {
	position: absolute;
	z-index: 20;
	top: 54px;
	left: 10px;
	right: 10px;
	margin: 0;
	padding: 7px;
	list-style: none;
	border: 1px solid var(--vp-c-divider);
	border-radius: 14px;
	background: var(--vp-c-bg);
	box-shadow: 0 16px 40px rgba(12, 24, 40, 0.14);
}
.suggestion-item { display: flex; flex-direction: column; padding: 9px 12px; border-radius: 9px; cursor: pointer; }
.suggestion-item:hover, .suggestion-item.active { background: var(--vp-c-bg-soft); }
.suggestion-name { font-weight: 600; }
.suggestion-desc { overflow: hidden; color: var(--vp-c-text-2); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }

.results { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; width: min(920px, 100%); }
.browse-toggle-row { display: flex; align-items: center; gap: 16px; margin: 28px 0; }
.browse-toggle { border: 0; background: transparent; color: var(--vp-c-brand-1); cursor: pointer; }
.bt-divider { width: 1px; height: 18px; background: var(--vp-c-divider); }
.state-message { margin: 24px 0; color: var(--vp-c-text-2); }
.state-message--error { color: var(--vp-c-danger-1); }

.dark .page-frame { background: var(--vp-c-bg); }

@media (max-width: 760px) {
	.page-frame { padding: 18px 12px; }
	.header { flex-direction: column; min-height: 170px; text-align: center; }
	.logo { height: 90px; margin: 0 0 14px; }
	.search-row { align-items: stretch; }
	.submit-button { padding: 0 14px; }
	.results { grid-template-columns: 1fr; }
}
</style>
