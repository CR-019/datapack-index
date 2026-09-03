<template>
  <section ref="listElement" class="bug-list" aria-label="Minecraft Java Edition 漏洞列表">
    <p v-if="loading" class="bug-list-message" role="status">
      正在加载漏洞列表……
    </p>

    <div v-else-if="errorMessage" class="bug-list-message bug-list-error" role="alert">
      <strong>漏洞列表加载失败</strong>
      <span>{{ errorMessage }}</span>
      <button type="button" @click="loadBugs">重新加载</button>
    </div>

    <p v-else-if="bugs.length === 0" class="bug-list-message">
      暂无收录的漏洞。
    </p>

    <div v-else class="bug-list-items">
      <article
        v-for="(bug, index) in paginatedBugs"
        :key="`${bug.id}-${index}`"
        class="bug-card"
        :class="[
          `bug-card-${statusInfo(bug.status).key}`,
          { 'is-bug-target': highlightedBug === issueKey(bug.id) },
        ]"
        :data-bug-key="issueKey(bug.id)"
      >
        <a
          class="bug-card-link"
          :href="bugUrl(bug.id)"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${bug.cn_title}：影响版本 ${bug.version}，${statusInfo(bug.status).label}`"
        >
          <span class="bug-card-main">
            <span class="bug-title-row">
              <span class="bug-cn-title">{{ bug.cn_title }}</span>

              <span class="bug-tags">
                <span class="bug-tag bug-version">{{ bug.version }}</span>
                <span
                  class="bug-tag bug-status"
                  :class="`bug-status-${statusInfo(bug.status).key}`"
                  :data-tooltip="statusInfo(bug.status).description"
                  @mouseenter="positionStatusTooltip"
                >
                  {{ statusInfo(bug.status).label }}
                </span>
              </span>
            </span>

            <span class="bug-details">
              <span class="bug-details-inner">
                <span class="bug-en-title" lang="en">{{ issueKey(bug.id) }} {{ bug.title }}</span>
                <span v-if="bug.description.trim()" class="bug-description">
                  {{ bug.description }}
                </span>
              </span>
            </span>
          </span>

          <span class="bug-external" aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          class="bug-copy-button"
          :aria-label="`复制 ${issueKey(bug.id)} 的页面链接`"
          :aria-busy="copyFeedback?.key === issueKey(bug.id) && copyFeedback.state === 'copying'"
          @click.stop.prevent="copyBugLink(bug.id)"
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="8" y="8" width="12" height="13" rx="2" />
            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
          </svg>
          复制链接
        </button>
        <span
          v-if="copyFeedback?.key === issueKey(bug.id)"
          class="bug-copy-feedback"
          :class="{ 'is-error': copyFeedback.state === 'error' }"
          role="status"
        >{{ copyFeedback.state === 'copied' ? '已复制' : copyFeedback.state === 'error' ? '复制失败，请重试' : '正在复制…' }}</span>
      </article>

      <nav v-if="totalPages > 1" class="bug-pagination" aria-label="漏洞列表分页">
        <button
          type="button"
          class="bug-page-button bug-page-step"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>

        <template v-for="item in visiblePages" :key="item.key">
          <span v-if="item.page === null" class="bug-page-ellipsis" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            class="bug-page-button bug-page-number"
            :class="{ 'is-current': item.page === currentPage }"
            :aria-current="item.page === currentPage ? 'page' : undefined"
            :aria-label="`第 ${item.page} 页`"
            @click="goToPage(item.page)"
          >
            {{ item.page }}
          </button>
        </template>

        <button
          type="button"
          class="bug-page-button bug-page-step"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>

        <span class="bug-page-summary">共 {{ bugs.length }} 条</span>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { bugPermalink, findBugTarget } from './bugTarget.mjs'

interface BugEntry {
  id: string
  title: string
  cn_title: string
  description: string
  status: string
  version: string
}

interface StatusInfo {
  key: string
  label: string
  description: string
}

interface PageItem {
  key: string
  page: number | null
}

const PAGE_SIZE = 15

const statuses: Record<string, StatusInfo> = {
  unconfirmed: {
    key: 'unconfirmed',
    label: '未确认',
    description: 'Mojang 尚未确认该漏洞存在',
  },
  confirmed: {
    key: 'confirmed',
    label: '已确认',
    description: 'Mojang 已承认该漏洞存在',
  },
  wont_fix: {
    key: 'wont-fix',
    label: '不予修复',
    description: 'Mojang 承认本漏洞，但由于影响太小、修复难度大或修复影响大等原因决定不修复',
  },
  intended: {
    key: 'intended',
    label: '有意为之',
    description: 'Mojang 表明当前行为正是他们所期望的',
  },
  invalid: {
    key: 'invalid',
    label: '无效',
    description: '本漏洞被认为无效',
  },
  fixed: {
    key: 'fixed',
    label: '已修复',
    description: '本漏洞已在最新版本中修复',
  },
}

const unknownStatus: StatusInfo = {
  key: 'unknown',
  label: '状态未知',
  description: '状态未知',
}

const bugs = ref<BugEntry[]>([])
const loading = ref(true)
const errorMessage = ref('')
const currentPage = ref(1)
const listElement = ref<HTMLElement | null>(null)
const highlightedBug = ref('')
const copyFeedback = ref<{ key: string; state: 'copying' | 'copied' | 'error' } | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | undefined
let copyAttempt = 0
const router = useRouter()
let previousRouteChange: typeof router.onAfterRouteChange
let highlightTimer: ReturnType<typeof setTimeout> | undefined
let revealRequest = 0
let disposed = false

const totalPages = computed(() => Math.max(1, Math.ceil(bugs.value.length / PAGE_SIZE)))

const paginatedBugs = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return bugs.value.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed<PageItem[]>(() => {
  const pages = new Set<number>([1, totalPages.value])
  for (let page = currentPage.value - 2; page <= currentPage.value + 2; page += 1) {
    if (page >= 1 && page <= totalPages.value) pages.add(page)
  }

  const sortedPages = [...pages].sort((a, b) => a - b)
  const items: PageItem[] = []

  sortedPages.forEach((page, index) => {
    const previous = sortedPages[index - 1]
    if (index > 0 && page - previous > 1) {
      items.push({ key: `ellipsis-${previous}-${page}`, page: null })
    }
    items.push({ key: `page-${page}`, page })
  })

  return items
})

function normalizeStatus(status: string): string {
  const normalized = String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[\s-]+/g, '_')

  const aliases: Record<string, string> = {
    open: 'unconfirmed',
    wontfix: 'wont_fix',
    works_as_intended: 'intended',
  }

  return aliases[normalized] ?? normalized
}

function statusInfo(status: string): StatusInfo {
  return statuses[normalizeStatus(status)] ?? unknownStatus
}

function positionStatusTooltip(event: MouseEvent) {
  const tag = event.currentTarget as HTMLElement
  // Reserve room for the card's hover expansion and the viewport edge.
  const availableWidth = document.documentElement.clientWidth - tag.getBoundingClientRect().left - 32
  tag.style.setProperty('--bug-tooltip-max-width', `${Math.max(1, availableWidth)}px`)
}

function issueKey(id: string): string {
  const normalized = String(id ?? '').trim().toUpperCase()
  return normalized.startsWith('MC-') ? normalized : `MC-${normalized}`
}

function bugUrl(id: string): string {
  return `https://bugs.mojang.com/browse/MC/issues/${encodeURIComponent(issueKey(id))}`
}

function goToPage(page: number) {
  clearCopyFeedback()
  clearHighlight()
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function clearCopyFeedback() {
  copyAttempt += 1
  clearTimeout(copyTimer)
  copyFeedback.value = null
}

async function copyBugLink(id: string) {
  if (copyFeedback.value?.key === issueKey(id) && copyFeedback.value.state === 'copying') return
  clearCopyFeedback()
  const attempt = copyAttempt
  const key = issueKey(id)
  copyFeedback.value = { key, state: 'copying' }
  try {
    const link = bugPermalink(window.location.href, id)
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Support HTTP mirrors and browsers without the Clipboard API.
      const previousFocus = document.activeElement
      const textarea = document.createElement('textarea')
      textarea.value = link
      textarea.readOnly = true
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.append(textarea)
      try {
        textarea.select()
        if (!document.execCommand('copy')) throw new Error('Copy failed')
      } finally {
        textarea.remove()
        if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
      }
    }
    if (!disposed && attempt === copyAttempt) copyFeedback.value = { key, state: 'copied' }
  } catch {
    if (!disposed && attempt === copyAttempt) copyFeedback.value = { key, state: 'error' }
  }
  if (!disposed && attempt === copyAttempt) {
    copyTimer = setTimeout(clearCopyFeedback, 2500)
  }
}

function clearHighlight() {
  revealRequest += 1
  clearTimeout(highlightTimer)
  highlightedBug.value = ''
}

async function revealQueryBug() {
  clearHighlight()
  if (disposed || loading.value || errorMessage.value) return

  const target = findBugTarget(bugs.value, window.location.search, PAGE_SIZE)
  if (!target) return

  const request = revealRequest
  currentPage.value = target.page
  await nextTick()
  // Let VitePress finish its own route scroll before positioning the card.
  await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
  if (disposed || request !== revealRequest) return

  const card = Array.from(
    listElement.value?.querySelectorAll<HTMLElement>('[data-bug-key]') ?? [],
  ).find((element) => element.dataset.bugKey === target.key)
  if (!card) return

  // Jump first so the whole highlight is visible, even for a distant target.
  card.scrollIntoView({ behavior: 'instant', block: 'center' })
  highlightedBug.value = target.key
  highlightTimer = setTimeout(() => { highlightedBug.value = '' }, 2200)
}

async function afterRouteChange(to: string) {
  // Preserve the theme's route hook, including its legacy medium-zoom hook.
  await (previousRouteChange ?? router.onAfterRouteChanged)?.(to)
  if (!disposed) await revealQueryBug()
}

function isBugEntry(value: unknown): value is BugEntry {
  if (!value || typeof value !== 'object') return false

  const bug = value as Record<string, unknown>
  const requiredFieldsAreValid = ['id', 'title', 'cn_title', 'status', 'version'].every(
    (field) => typeof bug[field] === 'string' && bug[field].trim().length > 0,
  )

  return requiredFieldsAreValid && typeof bug.description === 'string'
}

async function loadBugs() {
  clearCopyFeedback()
  clearHighlight()
  loading.value = true
  errorMessage.value = ''
  currentPage.value = 1

  try {
    const response = await fetch(withBase('/bug_list.json'), { cache: 'no-cache' })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('bug_list.json 的顶层必须是数组')
    }

    bugs.value = data.filter(isBugEntry)
    if (bugs.value.length !== data.length) {
      console.warn('bug_list.json 中有条目缺少必填字段，已跳过。')
    }
  } catch (error) {
    bugs.value = []
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
  } finally {
    loading.value = false
  }
  await revealQueryBug()
}

onMounted(() => {
  previousRouteChange = router.onAfterRouteChange
  router.onAfterRouteChange = afterRouteChange
  void loadBugs()
})

onBeforeUnmount(() => {
  disposed = true
  clearCopyFeedback()
  clearHighlight()
  if (router.onAfterRouteChange === afterRouteChange) {
    router.onAfterRouteChange = previousRouteChange
  }
})
</script>

<style scoped>
:global(html) {
  --bug-description-color: #000;
}

:global(html.dark) {
  --bug-description-color: var(--vp-c-text-1);
}

.bug-list {
  margin: 28px 0 48px;
}

.bug-list-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bug-card {
  --bug-accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  width: calc(100% - 28px);
  min-height: 70px;
  margin-inline: auto;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--bug-accent);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 9px rgb(0 0 0 / 5%);
  text-decoration: none;
  transition:
    width 220ms ease,
    border-color 220ms ease,
    background-color 220ms ease,
    box-shadow 220ms ease,
    transform 220ms ease;
}

.bug-card-link {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 18px 46px 18px 20px;
  color: inherit;
  text-decoration: none;
  outline: none;
}

.bug-card-link:hover {
  color: inherit;
}

.bug-card:hover,
.bug-card:focus-within {
  width: 100%;
  border-color: color-mix(in srgb, var(--bug-accent) 58%, var(--vp-c-divider));
  background: var(--vp-c-bg);
  box-shadow: 0 10px 28px rgb(0 0 0 / 12%);
  outline: none;
  transform: translateY(-1px);
}

.bug-card.is-bug-target {
  animation: bug-target-highlight 2200ms ease-out;
}

@keyframes bug-target-highlight {
  0%, 100% {
    outline: 3px solid transparent;
    outline-offset: 2px;
  }
  15%, 45% {
    outline: 3px solid var(--bug-accent);
    outline-offset: 5px;
  }
}

.bug-card:focus-within {
  box-shadow:
    0 0 0 3px var(--vp-c-brand-soft),
    0 10px 28px rgb(0 0 0 / 12%);
}

.bug-card-main {
  display: block;
  width: 100%;
  min-width: 0;
}

.bug-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.bug-cn-title {
  min-width: 0;
  padding-top: 2px;
  font-size: 17px;
  font-weight: 650;
  line-height: 1.45;
}

.bug-tags {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.bug-tag {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 3px 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.25;
  white-space: nowrap;
}

.bug-version {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
}

.bug-status {
  position: relative;
  color: var(--bug-accent);
  background: color-mix(in srgb, var(--bug-accent) 13%, transparent);
}

.bug-status::after {
  position: absolute;
  z-index: 10;
  top: calc(100% + 8px);
  left: 0;
  box-sizing: border-box;
  width: max-content;
  max-width: min(330px, var(--bug-tooltip-max-width, 75vw));
  overflow-wrap: anywhere;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  content: attr(data-tooltip);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 150ms ease, transform 150ms ease;
  white-space: normal;
}

.bug-status:hover::after {
  opacity: 1;
  transform: translateY(0);
}

.bug-details {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 240ms ease, opacity 180ms ease;
}

.bug-details-inner {
  display: block;
  min-height: 0;
  overflow: hidden;
}

.bug-details-inner::after {
  display: block;
  height: 40px;
  content: '';
}

.bug-card:hover .bug-details,
.bug-card:focus-within .bug-details {
  grid-template-rows: 1fr;
  opacity: 1;
}

.bug-en-title,
.bug-description {
  display: block;
}

.bug-en-title {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 550;
  line-height: 1.5;
}

.bug-description {
  margin-top: 5px;
  color: var(--bug-description-color);
  font-size: 14px;
  line-height: 1.65;
}

.bug-external {
  position: absolute;
  right: 17px;
  bottom: 15px;
  color: var(--vp-c-text-3);
  font-size: 15px;
  transition: color 180ms ease, transform 180ms ease;
}

.bug-card:hover .bug-external,
.bug-card:focus-within .bug-external {
  color: var(--bug-accent);
  transform: translate(2px, -2px);
}

.bug-copy-button {
  position: absolute;
  right: 43px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 30px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}

.bug-card:hover .bug-copy-button,
.bug-card:focus-within .bug-copy-button {
  opacity: 1;
  pointer-events: auto;
}

.bug-copy-button:hover,
.bug-copy-button:focus-visible {
  color: var(--bug-accent);
  border-color: var(--bug-accent);
}

.bug-copy-button:focus-visible {
  outline: 2px solid var(--bug-accent);
  outline-offset: 2px;
}

.bug-copy-feedback {
  position: absolute;
  right: 143px;
  bottom: 16px;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 12px;
  line-height: 22px;
  pointer-events: none;
}

.bug-copy-feedback.is-error {
  color: var(--vp-c-danger-1);
}

.bug-card-unconfirmed,
.bug-card-unknown {
  --bug-accent: var(--vp-c-text-2);
}

.bug-card-confirmed {
  --bug-accent: var(--vp-c-brand-1);
}

.bug-card-wont-fix {
  --bug-accent: #c26a1d;
}

.bug-card-intended {
  --bug-accent: #c528cd;
}

.bug-card-invalid {
  --bug-accent: var(--vp-c-danger-1);
}

.bug-card-fixed {
  --bug-accent: #0d9c41;
}

.bug-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 14px;
  padding: 12px 8px 0;
}

.bug-page-button {
  display: inline-flex;
  min-width: 34px;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  font-weight: 550;
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease, background-color 160ms ease;
}

.bug-page-button:hover:not(:disabled),
.bug-page-button:focus-visible {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  outline: none;
}

.bug-page-button.is-current {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}

.bug-page-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.bug-page-ellipsis,
.bug-page-summary {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.bug-page-ellipsis {
  min-width: 18px;
  text-align: center;
}

.bug-page-summary {
  margin-left: 4px;
  white-space: nowrap;
}

.bug-list-message {
  display: flex;
  min-height: 92px;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.bug-list-error {
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  color: var(--vp-c-danger-1);
  text-align: center;
}

.bug-list-error button {
  margin-top: 4px;
  padding: 6px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  cursor: pointer;
}

.bug-list-error button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .bug-card,
  .bug-card:hover,
  .bug-card:focus-within {
    width: 100%;
  }

  .bug-card-link {
    padding: 16px 42px 16px 16px;
  }

  .bug-title-row {
    flex-direction: column;
    gap: 10px;
  }

  .bug-tags {
    justify-content: flex-start;
  }

  .bug-details {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .bug-pagination {
    flex-wrap: wrap;
  }

  .bug-page-summary {
    width: 100%;
    margin: 2px 0 0;
    text-align: center;
  }
}

@media (hover: none), (max-width: 640px) {
  .bug-copy-button {
    opacity: 1;
    pointer-events: auto;
  }

  .bug-details {
    grid-template-rows: 1fr;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bug-card.is-bug-target {
    animation: none;
    outline: 3px solid var(--bug-accent);
    outline-offset: 4px;
  }

  .bug-card,
  .bug-details,
  .bug-external,
  .bug-copy-button,
  .bug-status::after {
    transition: none;
  }
}
</style>
