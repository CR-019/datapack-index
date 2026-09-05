<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  type: { type: String, required: true }
})

// Accept both the names used by <node> and the sprite filenames.
const aliases = {
  byte_list: 'byte_array',
  int_list: 'int_array',
  long_list: 'long_array',
  compound: 'object',
  list: 'Data_node_list'
}
const sprites = new Set([
  'any', 'bool', 'byte_array', 'byte', 'Data_node_list', 'double',
  'float', 'homolist', 'int_array', 'int', 'long_array', 'long',
  'object', 'short', 'string'
])
const iconName = computed(() => {
  const name = Object.hasOwn(aliases, props.type) ? aliases[props.type] : props.type
  return sprites.has(name) ? name : 'any'
})
const iconSrc = computed(() => withBase(`/nbt_sprites/${iconName.value}.svg`))
</script>

<template>
  <img class="nbt-inline-icon" :src="iconSrc" :alt="type" :title="type" />
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
</style>
