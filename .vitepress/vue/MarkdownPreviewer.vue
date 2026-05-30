<script setup>
import * as VueRuntime from 'vue'
import { computed, defineComponent, markRaw, onMounted, onUnmounted, provide, ref, shallowRef, watch } from 'vue'
import { dataSymbol, useData } from 'vitepress'
import { compile as compileTemplate } from '@vue/compiler-dom'
import { Marked, Renderer } from 'marked'
import katex from 'katex'
import { compileToCache, config as nbtConfig } from '../MCFPPNBTParser'

const STORAGE_KEY = 'vanilla-library-markdown-preview'
const PATH_STORAGE_KEY = 'vanilla-library-markdown-preview-path'
const BASE_URL = import.meta.env.BASE_URL || '/'

const sampleMarkdown = `---
name: Markdown Preview
author:
  -
    name: Alumopper
    char: 编辑
description: 用站点样式检查 Markdown 和自定义 Vue 组件
tags: [预览, Markdown]
version: 1.0
gameversion: [1.21+]
wheel: true
---

<InfoCard />

<ColorLine :height="4" />

# Markdown 预览

::: tip
这里会使用站点的 VitePress 文档样式。
:::

<FeatureHead
  title="自定义组件预览"
  authorName="Alumopper"
  abstractText="Markdown 中的 Vue 组件会作为真实组件渲染。"
  cover="/icons/bg5.png"
/>

## 表格与代码

| 项目 | 状态 |
| --- | --- |
| GFM 表格 | 正常 |
| Vue 组件 | 正常 |

\`\`\`mcfunction
execute as @a run say preview
\`\`\`
`

const source = ref(sampleMarkdown)
const documentPath = ref('')
const previewComponent = shallowRef(null)
const previewError = ref('')
const setupError = ref('')
const previewStyle = ref('')
const isRendering = ref(false)
const loadedFileName = ref('')
const renderVersion = ref(0)

const parentData = useData()
const parsedFrontmatter = ref({})
const previewPage = computed(() => ({
  ...parentData.page.value,
  title: parsedFrontmatter.value.title || parsedFrontmatter.value.name || 'Markdown Preview',
  frontmatter: parsedFrontmatter.value
}))

provide(dataSymbol, {
  ...parentData,
  page: previewPage,
  frontmatter: computed(() => parsedFrontmatter.value)
})

const frontmatterSummary = computed(() => {
  const keys = Object.keys(parsedFrontmatter.value || {})
  return keys.length ? keys.join(', ') : 'none'
})

let renderTimer = 0
let activeRender = 0
let previewStyleElement = null

onMounted(() => {
  const savedSource = window.localStorage.getItem(STORAGE_KEY)
  const savedPath = window.localStorage.getItem(PATH_STORAGE_KEY)

  if (savedSource) source.value = savedSource
  if (savedPath) documentPath.value = savedPath

  watch(source, () => {
    window.localStorage.setItem(STORAGE_KEY, source.value)
    queueRender()
  })

  watch(documentPath, () => {
    window.localStorage.setItem(PATH_STORAGE_KEY, documentPath.value)
    queueRender()
  })

  queueRender(0)
})

watch(previewStyle, syncPreviewStyle, { immediate: true })

onUnmounted(() => {
  syncPreviewStyle('')
})

function syncPreviewStyle(css) {
  if (typeof document === 'undefined') return

  if (!css) {
    previewStyleElement?.remove()
    previewStyleElement = null
    return
  }

  if (!previewStyleElement) {
    previewStyleElement = document.createElement('style')
    previewStyleElement.dataset.markdownPreview = 'true'
    document.head.appendChild(previewStyleElement)
  }

  previewStyleElement.textContent = css
}

function queueRender(delay = 160) {
  window.clearTimeout(renderTimer)
  renderTimer = window.setTimeout(renderPreview, delay)
}

async function renderPreview() {
  const job = ++activeRender
  isRendering.value = true
  previewError.value = ''
  setupError.value = ''

  try {
    const parsed = splitFrontmatter(source.value)
    parsedFrontmatter.value = parsed.data

    let body = parsed.content
    body = await executeSupportedSetup(body)
    const styles = extractStyleBlocks(body)
    body = styles.content
    previewStyle.value = styles.styles.join('\n\n')

    const html = rewriteTemplateUrls(renderMarkdown(body))
    const render = compilePreviewTemplate(`<div class="markdown-preview-render vp-doc">${html}</div>`)

    if (job !== activeRender) return

    previewComponent.value = markRaw(defineComponent({
      name: 'CompiledMarkdownPreview',
      setup() {
        const data = useData()
        return {
          site: data.site,
          theme: data.theme,
          page: data.page,
          frontmatter: data.frontmatter
        }
      },
      render
    }))
    renderVersion.value += 1
  } catch (error) {
    if (job !== activeRender) return
    previewComponent.value = null
    previewError.value = formatError(error)
  } finally {
    if (job === activeRender) isRendering.value = false
  }
}

function compilePreviewTemplate(template) {
  const result = compileTemplate(template, {
    mode: 'function',
    hoistStatic: false,
    cacheHandlers: false
  })

  return new Function('Vue', result.code)(VueRuntime)
}

async function executeSupportedSetup(markdown) {
  const scriptBlocks = []
  const content = markdown.replace(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/gi, (_, script) => {
    scriptBlocks.push(script)
    return ''
  })

  for (const script of scriptBlocks) {
    const namespaceMatch = script.match(/\bconfig\.namespace\s*=\s*(['"`])([\s\S]*?)\1/)
    if (namespaceMatch) {
      nbtConfig.namespace = namespaceMatch[2]
    }

    const calls = findCompileToCacheCalls(script)
    for (const call of calls) {
      try {
        await compileToCache(call.id, call.code)
      } catch (error) {
        setupError.value = `compileToCache(${call.id}) failed: ${formatError(error)}`
      }
    }
  }

  return content
}

function findCompileToCacheCalls(script) {
  const calls = []
  const pattern = /compileToCache\s*\(\s*(['"])(.*?)\1\s*,\s*(`(?:\\`|[\s\S])*?`|'(?:\\'|[\s\S])*?'|"(?:\\"|[\s\S])*?")\s*\)/g
  let match

  while ((match = pattern.exec(script))) {
    calls.push({
      id: match[2],
      code: readStringLiteral(match[3])
    })
  }

  return calls
}

function readStringLiteral(value) {
  const quote = value[0]
  const raw = value.slice(1, -1)

  if (quote === '`') {
    return raw.replace(/\\`/g, '`').replace(/\\\$/g, '$')
  }

  try {
    return JSON.parse(value)
  } catch {
    return raw.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n')
  }
}

function splitFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) {
    return { data: {}, content: markdown }
  }

  return {
    data: parseYaml(match[1]),
    content: markdown.slice(match[0].length)
  }
}

function parseYaml(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const result = parseYamlBlock(lines, 0, 0)
  return isPlainObject(result.value) ? result.value : {}
}

function parseYamlBlock(lines, start, indent) {
  let index = skipYamlNoise(lines, start)
  const first = lines[index]
  if (first == null || getIndent(first) < indent) return { value: {}, index }

  if (getIndent(first) === indent && first.trimStart().startsWith('-')) {
    return parseYamlSequence(lines, index, indent)
  }

  return parseYamlMapping(lines, index, indent)
}

function parseYamlMapping(lines, start, indent) {
  const value = {}
  let index = start

  while (index < lines.length) {
    index = skipYamlNoise(lines, index)
    const line = lines[index]
    if (line == null || getIndent(line) < indent) break
    if (getIndent(line) > indent) {
      index += 1
      continue
    }

    const trimmed = line.trim()
    if (trimmed.startsWith('-')) break

    const separator = findYamlSeparator(trimmed)
    if (separator === -1) {
      index += 1
      continue
    }

    const key = trimmed.slice(0, separator).trim()
    const rest = trimmed.slice(separator + 1).trim()

    if (rest) {
      value[key] = parseYamlScalar(rest)
      index += 1
    } else {
      const next = skipYamlNoise(lines, index + 1)
      if (next >= lines.length || getIndent(lines[next]) <= indent) {
        value[key] = null
        index += 1
      } else {
        const nested = parseYamlBlock(lines, next, getIndent(lines[next]))
        value[key] = nested.value
        index = nested.index
      }
    }
  }

  return { value, index }
}

function parseYamlSequence(lines, start, indent) {
  const value = []
  let index = start

  while (index < lines.length) {
    index = skipYamlNoise(lines, index)
    const line = lines[index]
    if (line == null || getIndent(line) < indent) break
    if (getIndent(line) > indent) {
      index += 1
      continue
    }

    const trimmed = line.trimStart()
    if (!trimmed.startsWith('-')) break

    const rest = trimmed.slice(1).trim()
    if (!rest) {
      const next = skipYamlNoise(lines, index + 1)
      if (next >= lines.length || getIndent(lines[next]) <= indent) {
        value.push(null)
        index += 1
      } else {
        const nested = parseYamlBlock(lines, next, getIndent(lines[next]))
        value.push(nested.value)
        index = nested.index
      }
      continue
    }

    const separator = findYamlSeparator(rest)
    if (separator > 0) {
      const item = {}
      const key = rest.slice(0, separator).trim()
      const scalar = rest.slice(separator + 1).trim()
      item[key] = scalar ? parseYamlScalar(scalar) : null

      const next = skipYamlNoise(lines, index + 1)
      if (next < lines.length && getIndent(lines[next]) > indent) {
        const nested = parseYamlMapping(lines, next, getIndent(lines[next]))
        Object.assign(item, nested.value)
        index = nested.index
      } else {
        index += 1
      }

      value.push(item)
    } else {
      value.push(parseYamlScalar(rest))
      index += 1
    }
  }

  return { value, index }
}

function parseYamlScalar(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1)
  }

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim()
    return inner ? splitTopLevel(inner).map(parseYamlScalar) : []
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const object = {}
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) return object

    for (const part of splitTopLevel(inner)) {
      const separator = findYamlSeparator(part)
      if (separator > -1) {
        object[part.slice(0, separator).trim()] = parseYamlScalar(part.slice(separator + 1).trim())
      }
    }

    return object
  }

  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)

  return trimmed
}

function splitTopLevel(value) {
  const result = []
  let current = ''
  let quote = ''
  let depth = 0

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]
    const prev = value[i - 1]

    if (quote) {
      current += char
      if (char === quote && prev !== '\\') quote = ''
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }

    if (char === '[' || char === '{') depth += 1
    if (char === ']' || char === '}') depth -= 1

    if (char === ',' && depth === 0) {
      result.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) result.push(current.trim())
  return result
}

function skipYamlNoise(lines, start) {
  let index = start
  while (index < lines.length) {
    const trimmed = lines[index].trim()
    if (trimmed && !trimmed.startsWith('#')) break
    index += 1
  }
  return index
}

function getIndent(line) {
  return line.match(/^ */)?.[0].length || 0
}

function findYamlSeparator(value) {
  let quote = ''
  let depth = 0

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]
    const prev = value[i - 1]

    if (quote) {
      if (char === quote && prev !== '\\') quote = ''
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '[' || char === '{' || char === '(') depth += 1
    if (char === ']' || char === '}' || char === ')') depth -= 1
    if (char === ':' && depth === 0) return i
  }

  return -1
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function extractStyleBlocks(markdown) {
  const styles = []
  const content = markdown.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    styles.push(css.trim())
    return ''
  })

  return { content, styles }
}

function renderMarkdown(markdown) {
  const withContainers = transformContainers(markdown)
  const withMath = transformMath(withContainers)
  const footnotes = extractFootnotes(withMath)
  const marked = createMarked()
  const html = marked.parse(footnotes.content)

  if (!footnotes.items.length) return html

  const notes = footnotes.items.map((item) => {
    const content = marked.parseInline(item.text)
    return `<li id="fn-${escapeAttr(item.id)}">${content} <a href="#fnref-${escapeAttr(item.id)}" class="footnote-backref">↩</a></li>`
  }).join('')

  return `${html}<section class="footnotes"><ol>${notes}</ol></section>`
}

function rewriteTemplateUrls(html) {
  const urlAttributes = [
    'src',
    'href',
    'cover',
    'background',
    'url',
    'link',
    'coverLink',
    'cover-link',
    'resourceLink',
    'resource-link'
  ]
  const attrPattern = urlAttributes.join('|')

  const dynamicAttr = new RegExp(`(\\s:(?:${attrPattern})\\s*=\\s*)(["'])(["'])(.*?)\\3\\2`, 'g')
  const staticAttr = new RegExp(`(\\s(?:${attrPattern})\\s*=\\s*)(["'])(.*?)\\2`, 'g')

  return html
    .replace(dynamicAttr, (_, prefix, outerQuote, innerQuote, value) => {
      return `${prefix}${outerQuote}${innerQuote}${resolvePreviewUrl(value)}${innerQuote}${outerQuote}`
    })
    .replace(staticAttr, (_, prefix, quote, value) => {
      return `${prefix}${quote}${resolvePreviewUrl(value)}${quote}`
    })
}

function createMarked() {
  const renderer = new Renderer()

  renderer.heading = function heading(token) {
    const text = this.parser.parseInline(token.tokens)
    const raw = stripHtml(text)
    const id = slugify(raw)
    return `<h${token.depth} id="${id}" tabindex="-1">${text} <a class="header-anchor" href="#${id}" aria-label="Permalink to &quot;${escapeAttr(raw)}&quot;">​</a></h${token.depth}>`
  }

  renderer.code = function code(token) {
    const language = normalizeLanguage(token.lang)
    const className = language ? `language-${escapeAttr(language)}` : 'language-text'
    const langLabel = language ? `<span class="lang">${escapeHtml(language)}</span>` : ''
    return `<div class="${className}"><button title="Copy Code" class="copy"></button>${langLabel}<pre><code>${escapeCode(token.text)}</code></pre></div>`
  }

  renderer.image = function image(token) {
    const src = escapeAttr(resolvePreviewUrl(token.href))
    const alt = escapeAttr(token.text || '')
    const title = token.title ? ` title="${escapeAttr(token.title)}"` : ''
    return `<img src="${src}" alt="${alt}"${title} data-md-img>`
  }

  renderer.link = function link(token) {
    const href = escapeAttr(resolvePreviewUrl(token.href))
    const title = token.title ? ` title="${escapeAttr(token.title)}"` : ''
    const external = /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(token.href || '')
    const target = external ? ' target="_blank" rel="noreferrer"' : ''
    return `<a href="${href}"${title}${target}>${this.parser.parseInline(token.tokens)}</a>`
  }

  return new Marked({
    async: false,
    gfm: true,
    breaks: false,
    mangle: false,
    headerIds: false,
    renderer
  })
}

function transformContainers(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const result = []
  const stack = []
  let fence = ''

  for (const line of lines) {
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[2][0]
      if (!fence) fence = marker
      else if (marker === fence) fence = ''
      result.push(line)
      continue
    }

    if (!fence) {
      const open = line.match(/^(:{3,})\s*(info|tip|warning|danger|details)\b\s*(.*?)\s*$/)
      if (open) {
        const type = open[2]
        const title = open[3] || defaultContainerTitle(type)
        if (type === 'details') {
          result.push(`<details class="details custom-block"><summary>${escapeHtml(title)}</summary>`)
          stack.push('details')
        } else {
          result.push(`<div class="${type} custom-block"><p class="custom-block-title">${escapeHtml(title)}</p>`)
          stack.push('div')
        }
        continue
      }

      if (/^:{3,}\s*$/.test(line) && stack.length) {
        result.push(stack.pop() === 'details' ? '</details>' : '</div>')
        continue
      }
    }

    result.push(line)
  }

  while (stack.length) {
    result.push(stack.pop() === 'details' ? '</details>' : '</div>')
  }

  return result.join('\n')
}

function defaultContainerTitle(type) {
  return {
    info: 'INFO',
    tip: 'TIP',
    warning: 'WARNING',
    danger: 'DANGER',
    details: 'Details'
  }[type] || type.toUpperCase()
}

function transformMath(markdown) {
  const segments = splitByCodeFences(markdown)
  return segments.map((segment) => {
    if (segment.code) return segment.text

    return segment.text
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, expression) => renderKatex(expression, true))
      .replace(/(^|[^\\$])\$([^\n$]+?)\$/g, (_, prefix, expression) => `${prefix}${renderKatex(expression, false)}`)
  }).join('')
}

function splitByCodeFences(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const segments = []
  let buffer = []
  let inCode = false
  let fence = ''

  for (const line of lines) {
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[2][0]
      if (!inCode) {
        if (buffer.length) segments.push({ code: false, text: `${buffer.join('\n')}\n` })
        buffer = [line]
        inCode = true
        fence = marker
        continue
      }

      if (marker === fence) {
        buffer.push(line)
        segments.push({ code: true, text: `${buffer.join('\n')}\n` })
        buffer = []
        inCode = false
        fence = ''
        continue
      }
    }

    buffer.push(line)
  }

  if (buffer.length) segments.push({ code: inCode, text: buffer.join('\n') })
  return segments
}

function renderKatex(expression, displayMode) {
  try {
    return katex.renderToString(expression.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false
    })
  } catch {
    return displayMode
      ? `<pre>${escapeHtml(expression)}</pre>`
      : `<code>${escapeHtml(expression)}</code>`
  }
}

function extractFootnotes(markdown) {
  const definitions = new Map()
  const order = []
  const content = markdown
    .replace(/^\[\^([^\]]+)\]:\s*(.*)$/gm, (_, id, text) => {
      definitions.set(id, text)
      return ''
    })
    .replace(/\[\^([^\]]+)\]/g, (_, id) => {
      if (!definitions.has(id)) return `[^${id}]`
      if (!order.includes(id)) order.push(id)
      const number = order.indexOf(id) + 1
      return `<sup class="footnote-ref"><a href="#fn-${escapeAttr(id)}" id="fnref-${escapeAttr(id)}">${number}</a></sup>`
    })

  return {
    content,
    items: order.map((id) => ({ id, text: definitions.get(id) || '' }))
  }
}

function resolvePreviewUrl(raw) {
  if (!raw) return ''
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(raw)) return raw
  if (/^(?:#|mailto:|tel:|data:|javascript:)/i.test(raw)) return raw

  const [pathWithQuery, hash = ''] = raw.split('#')
  const [path, query = ''] = pathWithQuery.split('?')
  const suffix = `${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`

  if (path.startsWith(`${BASE_URL}`)) return `${path}${suffix}`

  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`

  if (path.startsWith('/')) {
    return `${normalizedBase}${path.replace(/^\/+/, '')}${suffix}`
  }

  const folder = documentPath.value.replace(/\\/g, '/').replace(/[^/]*$/, '')
  const resolved = new URL(path, `https://preview.local/${normalizedBase}${folder}`).pathname
  return `${resolved}${suffix}`
}

function normalizeLanguage(language = '') {
  return language.replace(/\{.*$/, '').trim().toLowerCase()
}

function slugify(value) {
  return encodeURIComponent(
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  )
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, '').replace(/&ZeroWidthSpace;/g, '')
}

function escapeCode(value) {
  return escapeHtml(value).replace(/\{\{/g, '&#123;&#123;')
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error)
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  loadedFileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    source.value = String(reader.result || '')
    if (!documentPath.value) documentPath.value = file.name
  }
  reader.readAsText(file)
}

function useSample() {
  source.value = sampleMarkdown
  documentPath.value = ''
  loadedFileName.value = ''
}

function clearSource() {
  source.value = ''
  loadedFileName.value = ''
}
</script>

<template>
  <div class="markdown-preview-app">
    <header class="preview-toolbar">
      <div>
        <h1>Markdown Preview</h1>
        <p>香草图书馆编辑预览</p>
      </div>
      <div class="preview-actions">
        <label class="preview-button">
          打开 .md
          <input type="file" accept=".md,.markdown,text/markdown,text/plain" @change="onFileChange">
        </label>
        <button type="button" class="preview-button" @click="useSample">示例</button>
        <button type="button" class="preview-button subtle" @click="clearSource">清空</button>
      </div>
    </header>

    <div class="path-row">
      <label for="preview-path">文档路径</label>
      <input
        id="preview-path"
        v-model="documentPath"
        type="text"
        spellcheck="false"
        placeholder="feature/archive/202605/0/content.md"
      >
      <span v-if="loadedFileName" class="file-name">{{ loadedFileName }}</span>
    </div>

    <main class="preview-workspace">
      <section class="editor-pane" aria-label="Markdown editor">
        <textarea
          v-model="source"
          spellcheck="false"
          placeholder="Paste Markdown here..."
        />
      </section>

      <section class="result-pane" aria-label="Rendered preview">
        <div class="status-row">
          <span>{{ isRendering ? 'rendering' : 'ready' }}</span>
          <span>frontmatter: {{ frontmatterSummary }}</span>
        </div>

        <p v-if="setupError" class="preview-alert">{{ setupError }}</p>
        <pre v-if="previewError" class="preview-error">{{ previewError }}</pre>
        <component :is="previewComponent" v-if="previewComponent" :key="renderVersion" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.markdown-preview-app {
  width: min(1480px, calc(100vw - 48px));
  margin: 0 auto;
  color: var(--vp-c-text-1);
}

.preview-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.preview-toolbar h1 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 28px;
  line-height: 1.2;
}

.preview-toolbar p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.preview-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}

.preview-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.preview-button.subtle {
  color: var(--vp-c-text-2);
}

.preview-button input {
  display: none;
}

.path-row {
  display: grid;
  grid-template-columns: auto minmax(160px, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
}

.path-row label,
.file-name {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.path-row input {
  width: 100%;
  height: 34px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: 13px ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

.path-row input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.preview-workspace {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
  gap: 16px;
  min-height: calc(100vh - 250px);
}

.editor-pane,
.result-pane {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.editor-pane {
  display: flex;
}

.editor-pane textarea {
  width: 100%;
  min-height: 680px;
  resize: vertical;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: 13px/1.7 ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

.editor-pane textarea:focus {
  outline: 2px solid var(--vp-c-brand-soft);
  outline-offset: -2px;
}

.result-pane {
  overflow: auto;
  padding: 0 22px 32px;
}

.status-row {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 -22px 20px;
  padding: 10px 22px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 94%, transparent);
  backdrop-filter: blur(8px);
}

.status-row span {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 3px 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.preview-alert,
.preview-error {
  margin: 16px 0;
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 6px;
  padding: 12px;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-text-1);
}

.preview-error {
  white-space: pre-wrap;
  font-size: 13px;
}

:global(.markdown-preview-page .VPDoc .container),
:global(.markdown-preview-page .VPDoc .content),
:global(.markdown-preview-page .VPDoc .content-container) {
  max-width: none !important;
}

:global(.markdown-preview-page .VPDoc .aside) {
  display: none;
}

:global(.markdown-preview-render) {
  max-width: 920px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .markdown-preview-app {
    width: min(100%, calc(100vw - 28px));
  }

  .preview-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-actions {
    justify-content: flex-start;
  }

  .path-row {
    grid-template-columns: 1fr;
  }

  .preview-workspace {
    grid-template-columns: 1fr;
  }

  .editor-pane textarea {
    min-height: 360px;
  }
}
</style>
