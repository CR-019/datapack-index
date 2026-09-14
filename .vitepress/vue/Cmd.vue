<script setup>
import { computed } from 'vue'

const props = defineProps({
  c: { type: String, required: true }
})

const href = computed(() => `https://zh.minecraft.wiki/w/命令/${encodeURIComponent(props.c)}`)
</script>

<template>
  <a class="cmd-inline" :href="href" target="_blank" rel="noopener noreferrer"><code class="cmd-inline-text">/{{ c }}</code></a>
</template>

<style scoped>
a.cmd-inline {
  display: inline-block;
  box-sizing: border-box;
  max-width: calc(100% - 0.3em);
  padding: 0.05em 0.2em;
  line-height: 1.25;
  margin: 0 0.15em;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  overflow-wrap: anywhere;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

a.cmd-inline:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

a.cmd-inline::after {
  display: none;
}

.cmd-inline > code.cmd-inline-text {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-family: var(--vp-font-family-mono);
  font-size: 0.95em;
  font-weight: 700;
  line-height: inherit;
}
</style>
