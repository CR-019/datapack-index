<template>
    <div class="presets-page">
        <div class="header-row">
            <PresetSearch v-model="query" @search="onSearch" @goto-all="onGotoAll" />
            <button class="refresh-btn" @click="refresh" :title="'刷新显示（当前 ' + shown.length + ' 项）'">
                刷新
            </button>
        </div>

        <div class="grid-wrap">
            <div class="grid">
                <PresetCard v-for="(p, idx) in shown" :key="p._id || p.url || idx" :title="p.title"
                    :description="p.description" :url="p.url || '#'" />
            </div>

            <div class="empty-note" v-if="!shown.length">
                暂无匹配项
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PresetSearch from './PresetSearch.vue';
import PresetCard from './PresetCard.vue';

// 配置：文档目录与默认显示数量
const SHOW_COUNT = 8;

const query = ref('');
const all = ref([]);
const shown = ref([]);

// 读取所有 preset 文档（eager）
function loadAll() {
    // import.meta.glob 的路径在不同环境略有差异：
    // 在 VitePress 中通常可使用 '/docs/presets/*.md' 或 '../presets/*.md'，按实际调整。
    const modules = import.meta.glob('/presets/*.md', { eager: true });
    const list = Object.values(modules).map(m => {
        const fm = m.frontmatter || {};
        return {
            _id: fm.id || fm.title || (m.url || ''),
            title: fm.title || 'Untitled',
            description: fm.description || fm.summary || '',
            url: (m.url) ? m.url.replace(/\/index\.html$/, '/') : (fm.path || '#')
        };
    });
    all.value = list;
}

// 简单文本匹配过滤
const filtered = computed(() => {
    const q = (query.value || '').trim().toLowerCase();
    if (!q) return all.value;
    return all.value.filter(p => {
        return (p.title || '').toLowerCase().includes(q)
            || (p.description || '').toLowerCase().includes(q);
    });
});

// 随机抽样（不重复）
function pickRandomFromPool(pool, n = SHOW_COUNT) {
    const arr = pool.slice();
    const res = [];
    while (res.length < n && arr.length) {
        const i = Math.floor(Math.random() * arr.length);
        res.push(arr.splice(i, 1)[0]);
    }
    return res;
}

function refresh() {
    // 从已过滤集合中随机抽取
    shown.value = pickRandomFromPool(filtered.value, SHOW_COUNT);
}

function onSearch(val) {
    // 当按回车触发搜索时，刷新显示（保留随机语义）
    refresh();
}
function onGotoAll(val) {
    // 导航到所有页面；在 VitePress 中可直接跳转到某路径并携带 query
    const url = '/presets/';
    const search = val ? ('?q=' + encodeURIComponent(val)) : '';
    window.location.href = url + search;
}

// 初始化
onMounted(() => {
    loadAll();
    // 小延迟以确保 all 填充（eager 模式一般同步）
    setTimeout(() => refresh(), 60);
});
</script>

<style scoped>
.presets-page {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.header-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.refresh-btn {
    padding: 8px 12px;
    background: var(--vp-c-surface-emphasis, #fafafa);
    border: 1px solid var(--vp-c-divider, #e6e6e6);
    border-radius: 6px;
    cursor: pointer;
}

.grid-wrap {
    position: relative;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.empty-note {
    padding: 20px;
    color: var(--vp-c-muted, #666);
    text-align: center;
}
</style>
