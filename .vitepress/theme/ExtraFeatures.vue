// .vitepress/theme/components/ExtraFeatures.vue

<template>
  <div class="extra-features VPHomeFeatures">
    <div class="container">
      <div class="items">
        <div 
          v-for="(feat, index) in features" 
          :key="index" 
          class="item"
          :class="[feat.customClass, { 'has-link': feat.link }]"
        >
          <div class="icon-wrapper">
            <FeatureIcon :icon="feat.icon" />
          </div>
          <h2 class="title" v-text="feat.title" />
          <p class="details" v-text="feat.details" />
          <a 
            v-if="feat.link" 
            :href="feat.link" 
            class="action"
          >
            {{ feat.actionText || 'Learn more' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import { computed } from 'vue'

interface FeatureItem extends DefaultTheme.FeatureIcon {
  title: string
  details: string
  link?: string
  actionText?: string
  customClass?: string
}

const props = defineProps<{
  features: FeatureItem[]
}>()

const normalizedFeatures = computed(() => {
  return props.features.map(feat => ({
    ...feat,
    icon: normalizeIcon(feat.icon)
  }))
})

function normalizeIcon(icon: DefaultTheme.FeatureIcon) {
  if (typeof icon === 'string') return { src: icon }
  if ('light' in icon || 'dark' in icon) return icon
  return { 
    src: icon.src,
    alt: icon.alt || '',
    width: icon.width || '48',
    height: icon.height || '48',
    wrap: icon.wrap ?? true
  }
}
</script>

<style scoped>
.extra-features {
  padding: 96px 24px;
  background: var(--vp-c-brand-soft);
}

.items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.item {
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  transition: transform 0.25s, box-shadow 0.25s;
}

.item:hover {
  transform: translateY(-8px);
  box-shadow: var(--vp-shadow-3);
}

.icon-wrapper {
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.details {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}

.action {
  display: inline-block;
  color: var(--vp-c-brand);
  font-weight: 500;
  transition: color 0.25s;
}

.action:hover {
  color: var(--vp-c-brand-dark);
}
</style>