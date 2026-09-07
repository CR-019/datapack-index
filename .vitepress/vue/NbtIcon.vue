<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  type: [String, Array],
  i: [String, Array],
  text: String,
  t: String
})

// Accept both the names used by <node> and the sprite filenames.
const aliases = {
  i: 'int',
  s: 'short',
  l: 'long',
  b: 'byte',
  str: 'string',
  f: 'float',
  d: 'double',
  o: 'object',
  h: 'homolist',
  ns: 'namespace',
  ls: 'Data_node_list',
  ia: 'int_array',
  la: 'long_array',
  ba: 'byte_array',
  bl: 'bool',
  boolean: 'bool',
  'int array': 'int_array',
  'long array': 'long_array',
  'byte array': 'byte_array',
  byte_list: 'byte_array',
  int_list: 'int_array',
  long_list: 'long_array',
  compound: 'object',
  list: 'Data_node_list'
}
const sprites = new Set([
  'any', 'bool', 'byte_array', 'byte', 'Data_node_list', 'double',
  'float', 'homolist', 'int_array', 'int', 'long_array', 'long',
  'object', 'short', 'string', 'namespace'
])
const iconType = computed(() => props.type ?? props.i ?? 'any')
const label = computed(() => props.text ?? props.t ?? '')
const icons = computed(() => {
  const types = Array.isArray(iconType.value) ? iconType.value : [iconType.value]
  return types.map((value) => {
    const type = typeof value === 'string' ? value : 'any'
    const name = Object.hasOwn(aliases, type) ? aliases[type] : type
    const sprite = sprites.has(name) ? name : 'any'
    return { type, src: withBase(`/nbt_sprites/${sprite}.svg`) }
  })
})
</script>

<template>
  <span class="nbt-inline" :class="{ 'nbt-inline-labeled': label }"><img v-for="(icon, index) in icons" :key="index" class="nbt-inline-icon" :src="icon.src" :alt="icon.type" :title="icon.type" /><code v-if="label" class="nbt-inline-text">{{ label }}</code></span>
</template>

<style scoped>
img.nbt-inline-icon {
  display: inline-block;
  float: none;
  width: 1em;
  height: 1em;
  margin: 0 0.15em;
  vertical-align: -0.125em;
}

.nbt-inline {
  /* Move the whole tag to the next line; wrap inside only if it exceeds a line. */
  display: inline-block;
  box-sizing: border-box;
  max-width: calc(100% - 0.3em);
}

.nbt-inline-labeled {
  padding: 0.05em 0.2em;
  line-height: 1.25;
  margin: 0 0.15em;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  overflow-wrap: anywhere;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.nbt-inline-labeled > img.nbt-inline-icon {
  margin: 0 0.25em 0 0;
}

.nbt-inline > code.nbt-inline-text {
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
