import { computed } from 'vue'

export function useBaseUrl() {
  const rawBase = import.meta.env.BASE_URL
  
  // 移除尾部斜杠，如果是根路径 "/" 则转为空字符串 ""
  const base = computed(() => {
    return rawBase === '/' ? '' : rawBase.replace(/\/$/, '')
  })

  return { base }
}