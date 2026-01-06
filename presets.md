---
title: 前置库
---

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vitepress';
import PresetGrid from '.vitepress/vue/wheel/PresetGrid.vue';
import PresetCard from '.vitepress/vue/wheel/PresetCard.vue';
import AllPresetsList from '.vitepress/vue/wheel/AllPresetsList.vue';

const route = useRoute();
const router = useRouter();

const q = ref('');
// 客户端安全读取 query
onMounted(() => {
  try {
    const params = new URLSearchParams(window.location.search || '');
    q.value = params.get('q') || '';
  } catch (e) {
    q.value = '';
  }
  // 监听后退/前进导致的 URL 变化
  const onPop = () => {
    try {
      const params = new URLSearchParams(window.location.search || '');
      q.value = params.get('q') || '';
    } catch (e) {
      q.value = '';
    }
  };
  window.addEventListener('popstate', onPop);
  // 清理监听（可选）：在组件卸载时移除
  // import { onUnmounted } from 'vue' 并使用 onUnmounted(() => window.removeEventListener('popstate', onPop))
});
</script>

  <div class="page-presets">
    <div v-if="q">
      <h1>搜索结果：{{ q }}</h1>
      <AllPresetsList :query="q" />
    </div>
    <div v-else>
      <h1>精选前置库</h1>
      <PresetGrid />
    </div>
  </div>

<script>
// 辅助组件：展示全部匹配项（非随机抽样），放在同文件以便示例完整
import { defineComponent, ref, computed, onMounted } from 'vue';

export default {
  components: { PresetGrid },
};
</script>

<style scoped>
.page-presets { display: block; padding: 8px 4px; }
</style>