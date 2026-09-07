<script setup>
import NbtIcon from '../NbtIcon.vue'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <NbtIcon v-bind="$attrs" type="short" />
</template>
