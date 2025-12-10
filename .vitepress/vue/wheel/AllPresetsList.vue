<template>
  <div class="all-list">
    <div class="controls">
      <input v-model="localQuery" @keyup.enter="onEnter" placeholder="搜索前置库" class="search-input" />
      <button @click="clear">清除</button>
    </div>

    <div class="list">
      <PresetCard
        v-for="(p, idx) in filtered"
        :key="p._id || p.url || idx"
        :title="p.title"
        :description="p.description"
        :url="p.url || '#'"
      />
    </div>

    <div v-if="!filtered.length" class="empty">无匹配项</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import PresetCard from './PresetCard.vue';

const props = defineProps({
  query: { type: String, default: '' }
});

const localQuery = ref(props.query);
watch(() => props.query, v => localQuery.value = v);

const all = ref([]);

function loadAll() {
  const modules = import.meta.glob('/presets/*.md', { eager: true });
  all.value = Object.values(modules).map(m => {
    const fm = m.frontmatter || {};
    return {
      _id: fm.id || fm.title || (m.url || ''),
      title: fm.title || 'Untitled',
      description: fm.description || fm.summary || '',
      url: (m.url) ? m.url.replace(/\/index\.html$/, '/') : (fm.path || '#')
    };
  });
}

const filtered = computed(() => {
  const q = (localQuery.value || '').trim().toLowerCase();
  if (!q) return all.value;
  return all.value.filter(p => {
    return (p.title || '').toLowerCase().includes(q)
      || (p.description || '').toLowerCase().includes(q);
  });
});

function onEnter() {
  // 将 q 同步到 URL
  const params = new URLSearchParams(window.location.search);
  if (localQuery.value) params.set('q', localQuery.value);
  else params.delete('q');
  const base = window.location.pathname.replace(/\/$/, '') + '/';
  window.location.href = base + (params.toString() ? ('?' + params.toString()) : '');
}

function clear() {
  localQuery.value = '';
  onEnter();
}

onMounted(() => loadAll());
</script>

<style scoped>
.controls { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
.search-input { flex:1; padding:8px; border-radius:6px; border:1px solid #e6e6e6; }
.list { display:grid; grid-template-columns: repeat(3,1fr); gap:12px; }
@media (max-width:900px) { .list { grid-template-columns: repeat(2,1fr); } }
@media (max-width:600px) { .list { grid-template-columns: 1fr; } }
.empty { padding:20px; color:#666; text-align:center; }
</style>
