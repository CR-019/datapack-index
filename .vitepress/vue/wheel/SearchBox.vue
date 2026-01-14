<template>
	<div class="page-frame">
		<div class="search-container">
			<div class="header" :class="{ 'header--shrunk': headerShrunk }">
				<img src="/icons/cart_with_chest.png" alt="Logo" class="logo" />
				<div class="title-container">
					<span class="title">香草前置馆</span>
					<span class="subtitle">图书馆最新业务火爆开张中</span>
				</div>
			</div>
			<div class="search-row">
				<div class="search-box-container">
					<input v-model="query" @input="onInput" @keydown="onKeydown" @keyup.enter="doSearch"
						@focus="isInputFocused = true" @blur="onInputBlur" placeholder="请问你今天要来点轮子吗" class="search-box"
						aria-label="搜索" />
					<button class="search-box-button" @click="doSearch" aria-label="搜索">
						<img src="/icons/search.png" alt="搜索" class="icon" />
					</button>
					<ul v-if="query.trim() && suggestions.length && isInputFocused" class="suggestions" role="listbox">
						<li v-for="(s, idx) in suggestions.slice(0, 5)" :key="s.path || idx"
							:class="['suggestion-item', { active: suggestionIndex === idx }]"
							@mousedown.prevent="onSuggestionMouseDown" @click.prevent="selectSuggestion(s)">
							<span class="suggestion-name">{{ s.name }}</span>
							<span class="suggestion-desc">{{ s.description }}</span>
						</li>
					</ul>
				</div>
				<div class="submit-button-container">
					<button class="submit-button" @click="submit" aria-label="投稿">
						<!-- inline upload/submit icon -->
						<svg class="submit-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
							<path d="M12 3v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
							<path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
							<path d="M21 21H3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
						</svg>
						<span class="submit-text">投稿</span>
					</button>
				</div>
			</div>
			<div class="results" v-if="!showRandomSection">
				<ResultCard v-for="item in results" :key="item.id" :item="item" @select="goToResource" />
			</div>
			<div v-if="showRandomSection && randomResults.length" class="random-results">
				<ResultCard v-for="item in randomResults" :key="item.id" :item="item" @select="goToResource" />
			</div>
			<div class="browse-toggle-row">
				<button class="browse-toggle" @click="toggleBrowse">
					{{ browseLabel }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import FlexSearch from "flexsearch";
import ResultCard from "./ResultCard.vue";

export default {
	components: { ResultCard },
	data() {
		return {
			query: "",
			results: [],
			suggestions: [],
			suggestionIndex: -1,
			isInputFocused: false,
			showRandomSection: false,
			browseLabel: "或者随便看看？",
			randomResults: [],
			index: null,
			data: [],
		};
	},
	methods: {
		async onInput() {
			// if index not ready, try to fetch
			if (!this.index) return;
			const q = this.query.trim();
			if (!q) {
				this.suggestions = [];
				return;
			}
			// use flexsearch to get up to 10 raw hits, then map to stores
			const raw = this.index.search(q, { limit: 10 });
			const result = processSearchResults(
				raw,
				this.data,
				["name", "description", "path"],
				{ pageSize: 10 }
			);
			// map items to suggestions (single-line brief)
			this.suggestions = (result.items || []).slice(0, 5).map((it) => ({
				name: it.name || "",
				description: it.description || "",
				path: it.path || "",
			}));
			this.suggestionIndex = -1;
		},
		onKeydown(e) {
			const len = Math.min(5, this.suggestions.length);
			if (!len) return;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				this.suggestionIndex = (this.suggestionIndex + 1) % len;
				this.scrollSuggestionIntoView();
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				this.suggestionIndex = (this.suggestionIndex - 1 + len) % len;
				this.scrollSuggestionIntoView();
			} else if (e.key === "Enter" || e.key === "Tab") {
				if (this.suggestionIndex >= 0 && this.suggestionIndex < len) {
					e.preventDefault();
					const s = this.suggestions[this.suggestionIndex];
					if (s) this.selectSuggestion(s);
				}
			} else if (e.key === "Escape") {
				this.suggestions = [];
				this.suggestionIndex = -1;
			}
		},
		scrollSuggestionIntoView() {
			this.$nextTick(() => {
				const container = this.$el.querySelector(".suggestions");
				const active =
					container && container.querySelector(".suggestion-item.active");
				if (active && container) {
					const aRect = active.getBoundingClientRect();
					const cRect = container.getBoundingClientRect();
					if (aRect.top < cRect.top)
						active.scrollIntoView({ block: "nearest" });
					else if (aRect.bottom > cRect.bottom)
						active.scrollIntoView({ block: "nearest" });
				}
			});
		},
		selectSuggestion(s) {
			// set query to suggestion name and run search
			this.query = s.name || "";
			this.suggestions = [];
			this.suggestionIndex = -1;
			// perform search based on new query
			this.doSearch();
		},
		onInputBlur() {
			// small delay to allow click/mousedown on suggestion before clearing
			this.isInputFocused = false;
			setTimeout(() => {
				this.suggestions = [];
				this.suggestionIndex = -1;
			}, 150);
		},
		onSuggestionMouseDown() {
			// prevent blur from clearing suggestion before click
			this.isInputFocused = true;
		},
		async fetchData() {
			const response = await fetch("../formatters.json");
			const data = await response.json();
			this.index = new FlexSearch.Document({
				document: {
					id: "id",
					index: [
						{
							field: "tokens",
							tokenize: "full",
							resolution: 9,
						},
						{
							field: "name",
							tokenize: "full",
							resolution: 9,
						},
						{
							field: "author",
							tokenize: "full",
							resolution: 9,
						},
					],
					store: [
						"name",
						"description",
						"tags",
						"path",
						"cover",
						"gameversion",
						"author",
					],
					tag: ["tags", "gameversion"],
				},
			});
			this.data = data;
			for (const d of data) {
				this.index.add(d);
			}
		},
		// perform the actual search against the built index
		onSearch() {
			if (!this.index) return;
			if (this.query.trim()) {
				// increase search breadth: request more hits from the index
				const raw = this.index.search(this.query, { limit: 40 });
				// return more items per page for denser results
				const result = processSearchResults(raw, this.data, undefined, {
					pageSize: 40,
				});
				this.results = result.items;
				console.log(result);
			}
		},

		// invoked by button click or Enter key
		async doSearch() {
			if (!this.index) {
				await this.fetchData();
			}
			// clear suggestions when doing a formal search
			this.suggestions = [];
			this.suggestionIndex = -1;
			this.onSearch();
			// hide random section when search executed
			if (this.query.trim()) {
				this.showRandomSection = false;
				this.browseLabel = "或者随便看看？";
			}
		},
		refreshRandom() {
			const allItems = this.data;
			if (Array.isArray(allItems)) {
				this.randomResults = allItems
					.sort(() => 0.5 - Math.random())
					.slice(0, 6);
			} else {
				console.error("Index export did not return an array:", allItems);
				this.randomResults = [];
			}
			// when refreshed explicitly, ensure label indicates ability to change batch
			this.browseLabel = "再换一批？";
		},
		toggleBrowse() {
			if (this.showRandomSection) {
				// already showing -> regenerate random batch
				this.refreshRandom();
			} else {
				// show random area and hide results
				this.refreshRandom();
				this.showRandomSection = true;
				this.browseLabel = "再换一批？";
				this.results = [];
			}
		},
		goToResource(id) {
			window.location.href = id;
		},
		submit(){
			//跳转到https://github.com/CR-019/datapack-index/issues/new?template=new_wheel.yaml
			window.location.href = "https://github.com/CR-019/datapack-index/issues/new?template=new_wheel.yaml";
		}
	},
	computed: {
		headerShrunk() {
			const hasResults = Array.isArray(this.results) && this.results.length > 0;
			// shrink if random/results are shown, or when input focused and no results/random shown
			return (
				this.showRandomSection ||
				hasResults ||
				(this.isInputFocused && !this.showRandomSection && !hasResults)
			);
		},
	},
	async mounted() {
		if (!this.index) {
			await this.fetchData();
		}
	},
};

function flattenResults(raw) {
	const map = new Map();
	if (!raw) return [];
	// case: simple id array
	if (
		Array.isArray(raw) &&
		raw.length &&
		(typeof raw[0] === "string" || typeof raw[0] === "number")
	) {
		raw.forEach((id) => map.set(String(id), (map.get(String(id)) || 0) + 1));
	} else {
		// case: groups from flexsearch enrich or mixed arrays
		const groups = Array.isArray(raw) ? raw : [raw];
		for (const group of groups) {
			const arr = group && group.result ? group.result : group;
			if (!arr) continue;
			for (const item of arr) {
				if (item == null) continue;
				if (typeof item === "string" || typeof item === "number") {
					const id = String(item);
					map.set(id, (map.get(id) || 0) + 1);
				} else {
					// item could be {id,score,doc}
					const id = String(item.id);
					const s = typeof item.score === "number" ? item.score : 1;
					map.set(id, (map.get(id) || 0) + s);
				}
			}
		}
	}
	return [...map.entries()]
		.map(([id, score]) => ({ id, score }))
		.sort((a, b) => b.score - a.score);
}

function buildDocsMap(docs = [], idKey = "id") {
	const m = new Map();
	for (const d of docs) {
		const id = String(d[idKey] ?? d.path ?? d.file ?? "");
		if (!id) continue;
		m.set(id, d);
	}
	return m;
}

function mapToStoreItems(flatResults, docsMap, storeFields = []) {
	const out = [];
	for (const { id, score } of flatResults) {
		const doc = docsMap.get(String(id));
		if (!doc) continue; // 可选：保留未命中的 id
		const obj = {};
		for (const f of storeFields) {
			// 支持嵌套字段 'a.b.c'
			if (f.includes(".")) {
				const parts = f.split(".");
				let val = doc;
				for (const p of parts) {
					if (val == null) break;
					val = val[p];
				}
				obj[f] = val ?? null;
			} else {
				obj[f] = doc[f] ?? null;
			}
		}
		obj.score = score;
		out.push(obj);
	}
	return out;
}

function sortItems(
	items,
	opts = { primary: "score", desc: true, tieBreaker: "name" }
) {
	const { primary, desc, tieBreaker } = opts;
	return items.sort((a, b) => {
		const pa = a[primary] ?? 0,
			pb = b[primary] ?? 0;
		if (pa === pb) {
			const ta = (a[tieBreaker] ?? "").toString().toLowerCase();
			const tb = (b[tieBreaker] ?? "").toString().toLowerCase();
			return ta < tb ? -1 : ta > tb ? 1 : 0;
		}
		return desc ? pb - pa : pa - pb;
	});
}

function paginate(items, page = 1, pageSize = 20) {
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const p = Math.min(Math.max(1, page), totalPages);
	const start = (p - 1) * pageSize;
	return {
		items: items.slice(start, start + pageSize),
		total,
		page: p,
		pageSize,
		totalPages,
	};
}

function processSearchResults(
	raw,
	docs,
	storeFields = [
		"name",
		"description",
		"tags",
		"path",
		"cover",
		"gameversion",
		"author",
	],
	options = {}
) {
	const {
		idKey = "id",
		page = 1,
		pageSize = 20,
		sortOpts = undefined,
	} = options;
	const flat = flattenResults(raw);
	const docsMap = buildDocsMap(docs, idKey);
	let items = mapToStoreItems(flat, docsMap, storeFields);
	items = sortItems(
		items,
		sortOpts ?? { primary: "score", desc: true, tieBreaker: "name" }
	);
	return paginate(items, page, pageSize);
}
</script>

<style scoped>
.page-frame {
	position: relative;
	width: 100%;
	min-height: 100vh;
	padding: 36px 20px;
	box-sizing: border-box;
	background: linear-gradient(180deg,
			rgba(250, 251, 253, 0.98),
			rgba(248, 250, 255, 0.995));
	display: flex;
	flex-direction: column;
}

.page-frame::before,
.page-frame::after {
	content: "";
	position: absolute;
	top: 0;
	bottom: 0;
	width: 160px;
	pointer-events: none;
}

.page-frame::before {
	left: 0;
	background: linear-gradient(90deg,
			rgba(14, 30, 60, 0.04),
			rgba(14, 30, 60, 0));
}

.page-frame::after {
	right: 0;
	background: linear-gradient(270deg,
			rgba(14, 30, 60, 0.04),
			rgba(14, 30, 60, 0));
}

.results,
.random-results {
	width: 100%;
	max-width: 920px;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
	align-items: start;
}

@media (max-width: 820px) {

	.results,
	.random-results {
		grid-template-columns: 1fr;
	}
}

.search-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 1100px;
	margin: 0 auto;
	padding: 8px 20px;
}

.search-row {
	display: flex;
	gap: 8px;
	width: 100%;
	max-width: 820px;
	margin-bottom: 20px;
	transition: transform 220ms ease;
}

.search-box-container {
	position: relative;
	width: 100%;
	max-width: 820px;
}

.search-box {
	min-width: 720px;
	width: 100%;
	max-width: 720px;
	/* keep original input width even when results area expands */
	padding: 12px 56px 12px 18px;
	/* extra right padding for the internal button */
	border: 1px solid #ccc;
	border-radius: 26px;
	transition: border-color 0.2s;
	height: 52px;
	/* fixed height to help vertical centering */
	box-sizing: border-box;
	font-size: 15px;
}

.search-box:focus {
	border-color: #1e90ff;
	outline: none;
}

.search-box-button {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	background-color: transparent;
	border: none;
	cursor: pointer;
	padding: 0 8px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	line-height: 0;
	z-index: 50;
	height: auto;
}
.search-box-button:focus {
	outline: none;
}

.search-box-button .icon {
	display: block;
	width: 22px;
	height: 22px;
	opacity: 0.55;
	/* 半透明初始状态 */
	transition: opacity 0.18s, transform 0.18s;
	filter: grayscale(100%) brightness(0.9);
}

.search-box-button:hover .icon,
.search-box-button:focus .icon {
	opacity: 1;
	/* 变为不透明 */
	transform: translateY(-1px);
	filter: none;
}

.submit-button {
	/* flat modern button */
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	background: #1e90ff;
	color: #fff;
	min-width: 96px;
	height: 48px;
	padding: 0 14px;
	border-radius: 26px;
	font-size: 14px;
	border: none;
	cursor: pointer;
	box-shadow: none; /* 扁平化，去掉立体阴影 */
	transition: transform 120ms ease, background-color 120ms ease, box-shadow 120ms ease;
}

.submit-button .submit-text {
	font-weight: 600;
}

.submit-button .submit-icon {
	width: 18px;
	height: 18px;
	display: inline-block;
	color: rgba(255,255,255,0.95);
}

.submit-button:hover {
	background-color: #297fe6;
}

.submit-button:focus {
	outline: 2px solid rgba(30,144,255,0.18);
	outline-offset: 2px;
}

.suggestions {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	right: 0;
	background: #fff;
	border: 1px solid #e6e6e6;
	border-radius: 8px;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
	list-style: none;
	padding: 6px 6px;
	margin-top: 0;
	max-height: 240px;
	overflow: auto;
	z-index: 40;
}

.suggestion-item {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 10px;
	cursor: pointer;
	align-items: center;
	white-space: nowrap;
}

.suggestion-item.active {
	background: #eaf2ff;
}

.suggestion-item.active {
	outline: 2px solid rgba(30, 144, 255, 0.12);
}

.suggestion-item+.suggestion-item {
	margin-top: 6px;
}

.suggestion-item:hover {
	background: #f5f8ff;
}

.suggestion-name {
	font-weight: 500;
	color: #111;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 45%;
}

.suggestion-desc {
	color: #666;
	font-size: 13px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 50%;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 50px;
	margin-top: 20px;
	margin-right: 30px;
	min-height: 260px;
}

.logo {
	min-height: 120px;
	margin-right: 36px;
}

.title-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.title {
	font-size: 56px;
	font-weight: 800;
	line-height: 1;
}

/* 移动端优化 */
@media (max-width: 720px) {
	.page-frame {
		padding: 16px 12px;
	}

	.header {
		flex-direction: column;
		align-items: center;
		margin-right: 0;
		min-height: 120px;
	}

	.logo {
		height: 200px;
		margin: 0 0 30px 0;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title {
		font-size: 40px;
		font-weight: 800;
	}

	.subtitle {
		font-size: 13px;
		margin-top: 6px;
		margin-left: 0;
		color: #8a8f95;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 1100px;
		margin: 0 8px 0 8px;
		padding: 8px 20px;
	}

	.search-row {
		max-width: 100%;
		margin-bottom: 14px;
	}

	.search-box {
		min-width: 100%;
		height: 44px;
		padding: 10px 48px 10px 12px;
		border-radius: 20px;
		font-size: 15px;
	}

	.search-box-button {
		right: 8px;
	}

	.submit-button {
		min-width: 84px;
		height: 44px;
		border-radius: 26px;
		padding: 0 10px;
		font-size: 13px;
	}

	.suggestions {
		max-height: 320px;
	}

	.suggestion-item {
		padding: 12px 12px;
		white-space: normal;
		gap: 8px;
	}

	.suggestion-name {
		max-width: 60%;
		font-size: 15px;
	}

	.suggestion-desc {
		max-width: 36%;
		font-size: 13px;
	}
}

.subtitle {
	font-size: 16px;
	color: #7a7f85;
	margin-top: 12px;
	margin-left: 8px;
}

.browse-toggle-row {
	margin-top: 12px;
	display: flex;
	justify-content: center;
}

.browse-toggle {
	border: none;
	background: transparent;
	color: #666;
	cursor: pointer;
	font-size: 14px;
}

.browse-toggle:hover {
	color: #1e90ff;
}

/* Dark mode (黑色系) 支持 */
.dark .page-frame {
	background: linear-gradient(180deg, #1b1b1f, #1b1b1f);
	color: #f2f2f2;
}

.dark .page-frame::before {
	background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
}

.dark .page-frame::after {
	background: linear-gradient(270deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
}

/* search-container 保持原样，不需要额外样式 */

.dark .search-box {
	background: #161618;
	border: 1px solid #1f1f20;
	color: #f7f7f7;
}

.dark .search-box::placeholder {
	color: #8a8a8a;
}

.dark .search-box:focus {
	border-color: #bfbfbf;
	outline: none;
	box-shadow: 0 6px 18px rgba(255,255,255,0.04);
}

.dark .search-box-button .icon {
	filter: invert(100%) grayscale(0%) brightness(1.05);
	opacity: 0.95;
}

.dark .suggestions {
	background: #0b0b0d;
	border: 1px solid #1f1f20;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.dark .suggestion-name {
	color: #f2f2f2;
}

.dark .suggestion-desc {
	color: #909090;
}

.dark .suggestion-item.active {
	background: rgba(255,255,255,0.03);
	outline: 2px solid rgba(255,255,255,0.06);
}

.dark .suggestion-item:hover {
	background: rgba(255,255,255,0.02);
}

.dark .submit-button {
	background: linear-gradient(180deg, #2b6fd6, #2b6fd6);
	color: #fff;
}

.dark .submit-button .submit-icon {
	color: rgba(255,255,255,0.95);
}

.dark .header {
	color: #f2f2f2;
}

.dark .title {
	color: #ffffff;
}

.dark .subtitle {
	color: #bfc8cc;
}

.dark .browse-toggle {
	color: #bfc8cc;
}

.dark .browse-toggle:hover {
	color: #e6e6e6;
}
</style>
