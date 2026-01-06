<template>
    <div class="repo-card" v-if="repoName">
        <header class="header">
            <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="repo-link">
                <svg class="repo-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <span class="repo-name-text">{{ repoName }}</span>
            </a>
            <p class="desc" v-if="repo.description">{{ repo.description }}</p>
        </header>

        <section class="stats">
            <div class="stat">
                <div class="label">Stars</div>
                <div class="value">{{ formatNumber(repo.stargazerCount) }}</div>
            </div>
            <div class="stat">
                <div class="label">Issues</div>
                <div class="value">{{ formatNumber(repo.issues?.totalCount ?? 0) }}</div>
            </div>
            <div class="stat">
                <div class="label">PRs</div>
                <div class="value">{{ formatNumber(repo.pullRequests?.totalCount ?? 0) }}</div>
            </div>
        </section>

        <section class="languages" v-if="langs.length">
            <div class="lang-bar" aria-hidden="true">
                <div v-for="(l, i) in langs" :key="l.name" class="lang-seg"
                    :style="{ width: l.percent + '%', background: l.color || defaultColor }"
                    :title="`${l.name}: ${l.percent.toFixed(1)}%`" />
            </div>

            <div class="lang-list">
                <div v-for="(l, i) in top3" :key="l.name" class="lang-item">
                    <span class="dot" :style="{ background: l.color || defaultColor }"></span>
                    <span class="lang-name">{{ l.name }}</span>
                    <span class="lang-pct">{{ l.percent.toFixed(1) }}%</span>
                </div>
            </div>
        </section>

        <hr class="divider" />

        <section class="meta">
            <div class="release">
                <div class="meta-title">Release</div>
                <div class="tag-row">
                    <template v-if="release">
                        <a :href="release.url" target="_blank" rel="noopener noreferrer" class="release-tag">{{ release.tagName }}</a>
                        <span
                            class="badge"
                            :class="release.isPrerelease ? 'badge-prerelease' : 'badge-release'"
                            v-if="release && typeof release.isPrerelease !== 'undefined'"
                        >
                            {{ release.isPrerelease ? 'Pre‑release' : 'Release' }}
                        </span>
                    </template>
                    <template v-else>
                        <span class="muted">No releases</span>
                    </template>
                </div>
                <div class="release-meta">
                    <span class="muted">{{ release ? formatDate(release.publishedAt) : '' }}</span>
                    <span v-if="release && release.name" class="release-name">{{ release.name }}</span>
                </div>
            </div>

            <div class="commit">
                <div class="meta-title">Last commit</div>
                <div class="commit-time"><span class="muted">{{ formatDate(lastCommit) }}</span></div>
            </div>
        </section>

        <div class="foot" v-if="error">{{ error }}</div>
    </div>

    <div v-else-if="loading" class="loading">Loading…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';

const props = defineProps({
    repo: { type: String, required: true },                // "owner/repo"
    apiBase: { type: String, default: 'https://api.mcfpp.top' },
    topN: { type: Number, default: 10 }                    // languages fetch limit (display subset)
});

const loading = ref(false);
const error = ref('');
const data = ref(null);

const defaultColor = '#888';

const repoName = computed(() => data.value?.name);
const repo = computed(() => data.value || {});

const fetchRepo = async () => {
    if (!props.repo) return;
    loading.value = true;
    error.value = '';
    data.value = null;
    try {
        const url = `${props.apiBase}/?repo=${encodeURIComponent(props.repo)}`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        if (!json || !json.repository) throw new Error('invalid data');
        data.value = json.repository;
    } catch (err) {
        error.value = err.message || 'fetch error';
    } finally {
        loading.value = false;
    }
};

// auto fetch when repo prop changes
watchEffect(() => {
    fetchRepo();
});

// languages processing
const langs = computed(() => {
    const L = [];
    const info = data.value?.languages;
    if (!info || !info.edges || !info.totalSize) return L;
    const total = info.totalSize || 0;
    for (const e of info.edges) {
        const size = e.size || 0;
        L.push({
            name: e.node?.name || 'unknown',
            color: e.node?.color || defaultColor,
            size,
            percent: total ? (size / total) * 100 : 0
        });
    }
    // already ordered by size in response; ensure numeric sort fallback
    L.sort((a, b) => b.size - a.size);
    return L;
});

const top3 = computed(() => langs.value.slice(0, 3));

// release: prefer releases.nodes[0] then latestRelease
const release = computed(() => {
    const r = data.value?.releases?.nodes?.[0] || data.value?.latestRelease || null;
    return r;
});

// last commit time pick defaultBranchRef.target.committedDate or pushedAt
const lastCommit = computed(() => {
    return data.value?.defaultBranchRef?.target?.committedDate || data.value?.pushedAt || null;
});

// helpers
function formatNumber(n) {
    if (n == null) return '0';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return String(n);
}
function formatDate(iso) {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return d.toLocaleString();
}
</script>

<style scoped>
.repo-card {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: #fff;
    color: #111;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    width: 100%;
}

.header {
    margin-bottom: 12px;
}

.repo-link {
    font-weight: 700;
    font-size: 1.05rem;
    color: #0366d6;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.repo-link:hover {
    text-decoration: underline;
}

.repo-icon {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    display: inline-block;
    color: #24292f;
}

.repo-name-text { line-height: 1; }

.desc {
    margin: 6px 0 0;
    font-size: 0.9rem;
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 12px 0;
}

.stat {
    text-align: center;
    padding: 8px;
    border-radius: 6px;
}

.label {
    font-size: 0.8rem;
    color: #6b7280;
}

.value {
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 6px;
}

.languages {
    margin: 10px 0;
}

.lang-bar {
    height: 7px;
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    background: #f3f4f6;
}

.lang-seg {
    height: 100%;
}

.lang-list {
    display: flex;
    gap: 6px;
    margin-top: 12px;
    flex-wrap: wrap;
}

.lang-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #111827;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    display: inline-block;
}

.lang-pct {
    color: #6b7280;
    margin-left: 6px;
    font-size: 0.85rem;
}

.divider {
    margin: 14px 0;
    border: none;
    border-top: 1px solid #eee;
}

.meta {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    flex-wrap: wrap;
    color: #111827;
}

.meta-title {
    font-weight: 700;
    color: #374151;
    margin-bottom: 6px;
}

.release,
.commit {
    min-width: 180px;
}

.tag-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.release-tag {
    font-weight: 500;
    font-size: 1 rem;
    color: #0b66c3;
    text-decoration: none;
}
.release-tag:hover { text-decoration: underline; }

.badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 999px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
}
.badge-release { background: #28a745; }
.badge-prerelease { background: #6f42c1; }

.release-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}
.release-name {
    color: #374151;
    font-size: 0.8rem;
    margin-left: 6px;
}

.commit-time { margin-top: 6px; }

.release-meta .muted {
    color: #6b7280;
    font-size: 0.8rem;
}

.commit-time .muted {
    color: #6b7280;
}

.loading,
.error,
.foot {
    margin-top: 12px;
    color: #6b7280;
}
</style>
