<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type AnnouncementBarConfig = {
  enabled?: boolean
  content?: string
  text?: string
  link?: string
  linkText?: string
  background?: string
  color?: string
  dismissible?: boolean
  doNotShowAgainText?: string
  storageKey?: string
  closeLabel?: string
}

const { theme, lang } = useData()
const barRef = ref<HTMLElement | null>(null)
const dismissed = ref(false)
const doNotShowAgain = ref(false)

let resizeObserver: ResizeObserver | undefined

const config = computed(() => {
  const themeConfig = theme.value as typeof theme.value & {
    announcementBar?: AnnouncementBarConfig
  }

  return themeConfig.announcementBar ?? {}
})

const content = computed(() => config.value.content ?? config.value.text ?? '')
const storageKey = computed(() => config.value.storageKey ?? 'site-announcement-bar')
const isDismissible = computed(() => config.value.dismissible !== false)
const defaultDoNotShowAgainText = computed(() => lang.value.startsWith('en') ? "Don't show again" : '不再提示')
const defaultCloseLabel = computed(() => lang.value.startsWith('en') ? 'Close announcement' : '关闭公告')
const isVisible = computed(() => {
  return config.value.enabled !== false && content.value.trim().length > 0 && (!isDismissible.value || !dismissed.value)
})

const barStyle = computed(() => ({
  '--announcement-bar-bg': config.value.background ?? 'var(--vp-c-brand-3)',
  '--announcement-bar-color': config.value.color ?? 'var(--vp-c-white)'
}))

function syncDismissedState() {
  if (typeof window === 'undefined') return

  try {
    dismissed.value = window.localStorage.getItem(storageKey.value) === 'dismissed'
  } catch {
    dismissed.value = false
  }
}

function setLayoutTopHeight(height: number) {
  if (typeof document === 'undefined') return

  document.documentElement.style.setProperty('--vp-layout-top-height', `${height}px`)
  document.documentElement.classList.toggle('has-announcement-bar', height > 0)
}

async function updateLayoutTopHeight() {
  await nextTick()
  setLayoutTopHeight(isVisible.value && barRef.value ? barRef.value.offsetHeight : 0)
}

function dismiss() {
  dismissed.value = true

  if (doNotShowAgain.value && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(storageKey.value, 'dismissed')
    } catch {
      // ignore storage failures
    }
  }

  void updateLayoutTopHeight()
}

onMounted(() => {
  syncDismissedState()

  if (typeof window === 'undefined') return

  if (typeof ResizeObserver !== 'undefined' && barRef.value) {
    resizeObserver = new ResizeObserver(() => {
      void updateLayoutTopHeight()
    })
    resizeObserver.observe(barRef.value)
  }

  window.addEventListener('resize', updateLayoutTopHeight)
  void updateLayoutTopHeight()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateLayoutTopHeight)
  }
  setLayoutTopHeight(0)
})

watch(storageKey, () => {
  syncDismissedState()
  void updateLayoutTopHeight()
})

watch(isVisible, () => {
  void updateLayoutTopHeight()
})
</script>

<template>
  <aside
    v-if="isVisible"
    ref="barRef"
    class="site-announcement-bar"
    :style="barStyle"
    role="status"
  >
    <div class="site-announcement-bar__inner">
      <p class="site-announcement-bar__content">
        <span>{{ content }}</span>
        <a
          v-if="config.link && config.linkText"
          class="site-announcement-bar__link"
          :href="config.link"
        >
          {{ config.linkText }}
        </a>
      </p>
      <div
        v-if="isDismissible"
        class="site-announcement-bar__actions"
      >
        <label class="site-announcement-bar__remember">
          <input
            v-model="doNotShowAgain"
            class="site-announcement-bar__checkbox"
            type="checkbox"
          >
          <span>{{ config.doNotShowAgainText ?? defaultDoNotShowAgainText }}</span>
        </label>
        <button
          class="site-announcement-bar__close"
          type="button"
          :aria-label="config.closeLabel ?? defaultCloseLabel"
          @click="dismiss"
        >
          <span class="site-announcement-bar__close-icon" aria-hidden="true"></span>
        </button>
      </div>
      <span v-else class="site-announcement-bar__spacer" aria-hidden="true"></span>
    </div>
  </aside>
</template>

<style scoped>
.site-announcement-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--vp-z-index-layout-top);
  color: var(--announcement-bar-color);
  background: var(--announcement-bar-bg);
  box-shadow: 0 1px 0 rgb(255 255 255 / 16%) inset, 0 1px 8px rgb(0 0 0 / 12%);
}

.site-announcement-bar__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 7px max(16px, env(safe-area-inset-right)) 7px max(16px, env(safe-area-inset-left));
}

.site-announcement-bar__content {
  min-width: 0;
  margin: 0;
  text-align: center;
  line-height: 1.45;
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.site-announcement-bar__link {
  margin-left: 10px;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  white-space: nowrap;
}

.site-announcement-bar__link:hover {
  opacity: 0.82;
}

.site-announcement-bar__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  min-width: max-content;
}

.site-announcement-bar__remember {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  padding: 4px 6px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.site-announcement-bar__remember:hover {
  background: rgb(255 255 255 / 14%);
}

.site-announcement-bar__checkbox {
  flex: none;
  width: 14px;
  height: 14px;
  accent-color: currentColor;
  cursor: pointer;
}

.site-announcement-bar__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  border: 0;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.site-announcement-bar__close:hover {
  background: rgb(255 255 255 / 14%);
}

.site-announcement-bar__close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.site-announcement-bar__close-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.site-announcement-bar__close-icon::before,
.site-announcement-bar__close-icon::after {
  position: absolute;
  top: 6px;
  left: 1px;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  content: "";
}

.site-announcement-bar__close-icon::before {
  transform: rotate(45deg);
}

.site-announcement-bar__close-icon::after {
  transform: rotate(-45deg);
}

@media (max-width: 640px) {
  .site-announcement-bar__inner {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px;
    min-height: 44px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .site-announcement-bar__content {
    font-size: 13px;
  }

  .site-announcement-bar__remember {
    padding-right: 4px;
    padding-left: 4px;
    font-size: 12px;
  }
}
</style>
