<template>
  <section class="bug-list" aria-label="Minecraft Java Edition 漏洞列表">
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
      <a
        v-for="(bug, index) in paginatedBugs"
        :key="`${bug.id}-${index}`"
        class="bug-card"
        :class="`bug-card-${statusInfo(bug.status).key}`"
        :href="bugUrl(bug.id)"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${bug.cn_title}：${statusInfo(bug.status).label}，影响版本 ${bug.version}`"
      >
        <span class="bug-card-main">
          <span class="bug-title-row">
            <span class="bug-cn-title">{{ bug.cn_title }}</span>

            <span class="bug-tags">
              <span
                class="bug-tag bug-status"
                :class="`bug-status-${statusInfo(bug.status).key}`"
                :data-tooltip="statusInfo(bug.status).description"
                :title="statusInfo(bug.status).description"
              >
                {{ statusInfo(bug.status).label }}
              </span>
              <span class="bug-tag bug-version">{{ bug.version }}</span>
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
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

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

const PAGE_SIZE = 20

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

function issueKey(id: string): string {
  const normalized = String(id ?? '').trim().toUpperCase()
  return normalized.startsWith('MC-') ? normalized : `MC-${normalized}`
}

function bugUrl(id: string): string {
  return `https://mojira.dev/${encodeURIComponent(issueKey(id))}`
}

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
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
}

onMounted(loadBugs)
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
  padding: 18px 46px 18px 20px;
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

.bug-card:hover,
.bug-card:focus-visible {
  width: 100%;
  border-color: color-mix(in srgb, var(--bug-accent) 58%, var(--vp-c-divider));
  background: var(--vp-c-bg);
  box-shadow: 0 10px 28px rgb(0 0 0 / 12%);
  outline: none;
  transform: translateY(-1px);
}

.bug-card:focus-visible {
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
  right: 0;
  width: max-content;
  max-width: min(330px, 75vw);
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

.bug-card:hover .bug-details,
.bug-card:focus-visible .bug-details {
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
.bug-card:focus-visible .bug-external {
  color: var(--bug-accent);
  transform: translate(2px, -2px);
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
  .bug-card:focus-visible {
    width: 100%;
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

@media (prefers-reduced-motion: reduce) {
  .bug-card,
  .bug-details,
  .bug-external,
  .bug-status::after {
    transition: none;
  }
}
</style>
