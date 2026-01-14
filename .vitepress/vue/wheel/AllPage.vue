<template>
	<div class="page-frame">
		<div class="search-container">
			<div class="header">
				<img src="/icons/bg4.png" alt="Logo" class="logo" />
				<div class="title-container">
					<span class="title">香草前置馆 — 全部资源</span>
					<span class="subtitle">随意挑选自己最香草的前置</span>
				</div>
			</div>

			<!-- action buttons: return to search, submit -->
			<div class="action-row">
				<button class="submit-button" @click="goToSearch" aria-label="返回搜索页面">返回搜索页面</button>
				<button class="submit-button" @click="submit" aria-label="投稿">投稿</button>
			</div>

			<div class="results">
				<ResultCard v-for="item in paginatedItems" :key="item.id || item.path" :item="item"
					@select="goToResource" />
			</div>

			<div class="pagination" v-if="totalPages > 1">
				<button class="page-btn" :disabled="page <= 1" @click="prevPage">上一页</button>
				<span class="page-info">第 {{ page }} / {{ totalPages }} 页</span>
				<button class="page-btn" :disabled="page >= totalPages" @click="nextPage">下一页</button>
			</div>

			<div class="empty" v-if="loading">加载中…</div>
			<div class="empty" v-else-if="!data || !data.length">暂无资源</div>
		</div>
	</div>
</template>

<script>
import FlexSearch from "flexsearch";
import ResultCard from "./ResultCard.vue";

// simple localStorage cache configuration
const CACHE_KEY = "datapack_formatters_cache_v1";
// default TTL: 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000;

// IndexedDB helpers
function openIndexedDB() {
	return new Promise((resolve, reject) => {
		if (!window.indexedDB) return reject(new Error("IndexedDB not supported"));
		const req = window.indexedDB.open("datapack_cache_db_v1", 1);
		req.onupgradeneeded = (ev) => {
			const db = ev.target.result;
			if (!db.objectStoreNames.contains("cache")) {
				db.createObjectStore("cache", { keyPath: "key" });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () =>
			reject(req.error || new Error("Failed to open IndexedDB"));
	});
}

async function idbGet(key) {
	try {
		const db = await openIndexedDB();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(["cache"], "readonly");
			const store = tx.objectStore("cache");
			const req = store.get(key);
			req.onsuccess = () => resolve(req.result ? req.result.value : null);
			req.onerror = () => reject(req.error || new Error("IDB get failed"));
		});
	} catch (e) {
		console.warn("idbGet error", e);
		return null;
	}
}

async function idbSet(key, value) {
	try {
		const db = await openIndexedDB();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(["cache"], "readwrite");
			const store = tx.objectStore("cache");
			const req = store.put({ key, value });
			req.onsuccess = () => resolve(true);
			req.onerror = () => reject(req.error || new Error("IDB set failed"));
		});
	} catch (e) {
		console.warn("idbSet error", e);
		return false;
	}
}

async function idbDelete(key) {
	try {
		const db = await openIndexedDB();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(["cache"], "readwrite");
			const store = tx.objectStore("cache");
			const req = store.delete(key);
			req.onsuccess = () => resolve(true);
			req.onerror = () => reject(req.error || new Error("IDB delete failed"));
		});
	} catch (e) {
		console.warn("idbDelete error", e);
		return false;
	}
}

// sanitize data before caching to avoid non-cloneable values
function sanitizeDataForCache(data, fields = [
	"id",
	"tokens",
	"name",
	"description",
	"tags",
	"path",
	"cover",
	"gameversion",
	"author",
]) {
	if (!Array.isArray(data)) return [];
	return data.map((d) => {
		const out = {};
		for (const f of fields) {
			// support nested fields 'a.b'
			if (f.includes(".")) {
				const parts = f.split(".");
				let val = d;
				for (const p of parts) {
					if (val == null) break;
					val = val[p];
				}
				out[parts.join(".")] = val == null ? null : val;
			} else {
				let val = d[f];
				// only keep primitives and plain objects/arrays
				if (
					val == null ||
					typeof val === "string" ||
					typeof val === "number" ||
					typeof val === "boolean" ||
					Array.isArray(val) ||
					(typeof val === "object" && val.constructor === Object)
				) {
					out[f] = val;
				} else {
					// fallback to string representation
					try {
						out[f] = String(val);
					} catch (e) {
						out[f] = null;
					}
				}
			}
		}
		return out;
	});
}

export default {
	components: { ResultCard },
	data() {
		return {
			page: 1,
			pageSize: 12,
			index: null,
			data: [],
			// 是否正在加载资源（用于在获取/解析资源时展示“加载中”）
			loading: true,
			_originalTitle: '',
		};
	},
	methods: {
		// clear cached formatters and index
		clearCache() {
			try {
				idbDelete(CACHE_KEY);
				this.index = null;
				this.data = [];
				console.info("Formatters cache cleared");
			} catch (e) {
				console.warn("Failed to clear cache", e);
			}
		},
		goToSearch() {
			// if router exists, navigate back to root or search route; otherwise open index page
			try {
				if (this.$router && this.$route) {
					// try to preserve query except page
					this.$router.push({ path: this.$route.path.replace(/all(?:page)?/i, ""), query: {} });
					return;
				}
				// fallback: open root
				window.location.href = "/datapack-index/wheel";
			} catch (e) {
				window.location.href = "/datapack-index/wheel";
			}
		},
		async fetchData() {
			// 设置加载状态，保证在获取/解析过程中显示“加载中”
			this.loading = true;
			try {
				// attempt to read from IndexedDB cache first
				try {
					const cached = await idbGet(CACHE_KEY);
					if (cached) {
						const now = Date.now();
						if (
							cached.timestamp &&
							now - cached.timestamp < (cached.ttl || CACHE_TTL)
						) {
							if (Array.isArray(cached.data)) {
								this.data = cached.data;
								this.index = buildIndexFromData(this.data);
									this.loading = false;
									return;
							}
						}
					}
				} catch (e) {
					console.warn("Failed to read IDB cache for formatters.json", e);
				}

				// fetch fresh if cache missing/expired
				const response = await fetch("../formatters.json");
				const data = await response.json();
				this.data = data;
				this.index = buildIndexFromData(this.data);

				// write to IndexedDB cache (only plain data)
				try {
					const sanitized = sanitizeDataForCache(this.data);
					await idbSet(CACHE_KEY, {
						timestamp: Date.now(),
						ttl: CACHE_TTL,
						data: sanitized,
					});
				} catch (e) {
					console.warn("Failed to write formatters cache to IDB", e);
				}
			} catch (e) {
				console.warn("fetchData error", e);
				// 如果请求失败，确保 data 是数组而不是 null，从而不会误判为有资源
				this.data = Array.isArray(this.data) ? this.data : [];
			} finally {
				this.loading = false;
			}
		},
		goToResource(id) {
			// open resource in a new tab and nullify opener for security
			try {
				const win = window.open(id, "_blank");
				if (win) win.opener = null;
			} catch (e) {
				// fallback to same-tab navigation if popup blocked
				window.location.href = id;
			}
		},
		submit() {
			// 在新标签页中打开投稿页面
			const url =
				"https://github.com/CR-019/datapack-index/issues/new?template=new_wheel.yaml";
			try {
				const win = window.open(url, "_blank");
				if (win) win.opener = null;
			} catch (e) {
				window.location.href = url;
			}
		},
		// pagination helpers
		setPage(n) {
			const newPage = Math.max(1, Math.floor(n));
			const total = this.totalPages || 1;
			this.page = Math.min(newPage, total);
			// update URL query if router available
			if (this.$router && this.$route) {
				try {
					const q = Object.assign({}, this.$route.query || {});
					q.page = String(this.page);
					this.$router.replace({
						path: this.$route.path,
						query: q,
					});
				} catch (e) {
					// ignore router update errors
				}
			}
		},
		nextPage() {
			this.setPage(this.page + 1);
		},
		prevPage() {
			this.setPage(this.page - 1);
		},
	},
	computed: {
		paginatedItems() {
			const items = Array.isArray(this.data) ? this.data : [];
			const p = Math.max(1, Math.min(this.page, Math.ceil(items.length / this.pageSize || 1)));
			const start = (p - 1) * this.pageSize;
			return items.slice(start, start + this.pageSize);
		},
		totalPages() {
			const items = Array.isArray(this.data) ? this.data : [];
			return Math.max(1, Math.ceil(items.length / this.pageSize));
		},
	},
	async mounted() {
		if (!this.index) {
			await this.fetchData();
		} else {
			// index already present, ensure loading flag is cleared
			this.loading = false;
		}
		// initialize page from query if present
		try {
			const q = (this.$route && this.$route.query) || {};
			const p = parseInt(q.page, 10);
			if (!Number.isNaN(p) && p > 0) this.page = p;
		} catch (e) {
			// ignore
		}
		// Set static document title for this page and remember original title
		try {
			if (typeof document !== 'undefined') {
				this._originalTitle = document.title || '';
				document.title = '全部内容 | 香草前置馆';
			}
		} catch (e) {
			// ignore
		}
	},
	beforeUnmount() {
		try {
			if (typeof document === 'undefined') return;
			if (this._originalTitle) document.title = this._originalTitle;
		} catch (e) {
			// ignore
		}
	},
	watch: {
		data() {
			// clamp page when data changes
			const total = this.totalPages || 1;
			if (this.page > total) this.page = total;
		},
		'$route.query.page': function (val) {
			const p = parseInt(val, 10);
			if (!Number.isNaN(p) && p > 0) this.page = p;
		},
	},
};

// helper: build a FlexSearch.Document index from data array
function buildIndexFromData(data) {
	const idx = new FlexSearch.Document({
		document: {
			id: "id",
			index: [
				{ field: "tokens", tokenize: "full", resolution: 9 },
				{ field: "name", tokenize: "full", resolution: 9 },
				{ field: "author", tokenize: "full", resolution: 9 },
				{ field: "tags", tokenize: "full", resolution: 9 },
				{ field: "gameversion", tokenize: "full", resolution: 9 },
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
	for (const d of data || []) {
		try {
			idx.add(d);
		} catch (e) {
			console.warn("Failed to add doc to index", e, d && d.id);
		}
	}
	return idx;
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

.results {
	width: 100%;
	max-width: 920px;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
	align-items: start;
}

@media (max-width: 820px) {
	.results {
		grid-template-columns: 1fr;
	}
}

.pagination {
	margin: 18px 0 34px;
	display: flex;
	align-items: center;
	gap: 12px;
}

.page-btn {
	background: #fff;
	border: 1px solid #e6e6e6;
	padding: 8px 12px;
	border-radius: 8px;
	cursor: pointer;
}

.page-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.page-info {
	color: #666;
}

.empty {
	color: #8a8f95;
	margin-top: 30px;
}


.search-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 1100px;
	margin: 0 auto;
	padding: 8px 20px;
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
	box-shadow: none;
	/* 扁平化，去掉立体阴影 */
	transition: transform 120ms ease, background-color 120ms ease,
		box-shadow 120ms ease;
}

.submit-button .submit-text {
	font-weight: 600;
}

.submit-button .submit-icon {
	width: 18px;
	height: 18px;
	display: inline-block;
	color: rgba(255, 255, 255, 0.95);
}

.submit-button:hover {
	background-color: #297fe6;
}

.submit-button:focus {
	outline: 2px solid rgba(30, 144, 255, 0.18);
	outline-offset: 2px;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 24px;
	margin-top: 12px;
	margin-right: 16px;
	min-height: 120px;
}

.action-row {
	width: 100%;
	max-width: 920px;
	display: flex;
	justify-content: center;
	gap: 36px;
	margin-bottom: 24px;
	align-items: center;
	box-sizing: border-box;
}

.action-row .submit-button {
	min-width: 110px;
	height: 40px;
	font-size: 14px;
	padding: 0 12px;
}

.logo {
	min-height: 80px;
	max-height: 120px;
	margin-right: 20px;
	width: auto;
}

.title-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.title {
	font-size: 36px;
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

	.submit-button {
		min-width: 84px;
		height: 44px;
		border-radius: 26px;
		padding: 0 10px;
		font-size: 13px;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 1100px;
		margin: 0 8px 0 8px;
		padding: 8px 20px;
	}
}

.subtitle {
	font-size: 16px;
	color: #7a7f85;
	margin-top: 12px;
	margin-left: 8px;
}

/* Dark mode (黑色系) 支持 */
.dark .page-frame {
	background: linear-gradient(180deg, #1b1b1f, #1b1b1f);
	color: #f2f2f2;
}

.dark .page-frame::before {
	background: linear-gradient(90deg,
			rgba(255, 255, 255, 0.02),
			rgba(255, 255, 255, 0));
}

.dark .page-frame::after {
	background: linear-gradient(270deg,
			rgba(255, 255, 255, 0.02),
			rgba(255, 255, 255, 0));
}

.dark .submit-button {
	background: linear-gradient(180deg, #2b6fd6, #2b6fd6);
	color: #fff;
}

.dark .submit-button .submit-icon {
	color: rgba(255, 255, 255, 0.95);
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
</style>
