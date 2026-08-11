import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const englishRoot = path.join(root, 'en')
const componentNames = 'FeaturedHead|FeatureHead|SpotlightHead|JournalHead|IndexCompatible|ColorLine'
const componentPattern = new RegExp(`<(?::?${componentNames})\\b[\\s\\S]*?\\/>`, 'gu')
const fencedPattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/gu
const attributePattern = /^(\s+)(title|authorName|abstract|abstractText|description|text|alt)(\s*=\s*)([^\r\n]*)(\r?)$/u
const safeTags = new Set([
  'a', 'article', 'aside', 'audio', 'b', 'blockquote', 'br', 'button', 'code', 'col', 'div',
  'em', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
  'hr', 'i', 'iframe', 'img', 'input', 'label', 'li', 'link', 'main', 'mark', 'nav', 'ol', 'p', 'pre',
  'section', 'script', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
  'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video',
  'center', 'details', 'node', 'ClientOnly', 'GiscusComment', 'ColorLine', 'InfoCard', 'RepoCard',
  'RandomParagraph', 'FeatureHead', 'FeaturedHead', 'SpotlightHead', 'JournalHead',
  'IndexCompatible', 'Tabs', 'Tab', 'CodeGroup', 'CodeGroupItem', 'VPBadge', 'http', 'https', 'mailto',
])

function escapeAttribute(value) {
  return value.replaceAll('"', '&quot;')
}

function normalizeComponentBlock(block) {
  const lines = block.split('\n')
  const normalized = lines.map((line) => {
    const match = line.match(attributePattern)
    if (!match) return line

    let value = match[4].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    return `${match[1]}${match[2]}${match[3]}"${escapeAttribute(value)}"${match[5]}`
  })

  return normalized.join('\n')
}

function normalizeFenceBoundaries(value) {
  const fencePattern = /```|~~~/gu
  let result = ''
  let cursor = 0
  let inFence = false
  let match

  while ((match = fencePattern.exec(value)) !== null) {
    const markerStart = match.index
    const lineEnd = value.indexOf('\n', markerStart + match[0].length)
    const tailEnd = lineEnd === -1 ? value.length : lineEnd
    const linePrefix = value.slice(value.lastIndexOf('\n', markerStart - 1) + 1, markerStart)
    const tail = value.slice(markerStart + match[0].length, tailEnd)

    result += value.slice(cursor, markerStart)
    if (linePrefix.trim()) result += '\n\n'
    result += match[0]

    if (!inFence) {
      if (tail.trim() && !/^[A-Za-z0-9_+.-]+$/u.test(tail.trim())) {
        result += '\n'
        result += tail
      } else {
        result += tail
      }
      inFence = true
    } else {
      if (tail) {
        result += '\n'
        result += tail
      }
      inFence = false
    }

    cursor = tailEnd
    if (lineEnd === -1) break
    fencePattern.lastIndex = lineEnd
  }

  return result + value.slice(cursor)
}

function normalizeHtmlBlocks(value) {
  return value
    .replace(/([^>\r\n])(<img\b)/gu, '$1\n\n$2')
    .replace(/([^\r\n])(<details\b[^>]*\bclass=["']details custom-block["'])/gu, '$1\n\n$2')
    .replace(/(<\/details>)(?=[^\r\n])/gu, '$1\n\n')
}

function normalizeSfcBoundaries(value) {
  return value.replace(
    /([^\r\n])---(\r?\n\s*<(?:script|style)\b)/giu,
    '$1\n\n---$2',
  )
}

function normalizeHeadingBoundaries(value) {
  const lines = value.split('\n')
  let inFrontmatter = false
  let inScript = false

  return lines.map((line, index) => {
    const trimmed = line.trim()
    if (index === 0 && trimmed === '---') {
      inFrontmatter = true
      return line
    }
    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      return line
    }
    if (/^\s*<script\b/iu.test(line)) inScript = true
    if (inScript) {
      if (/<\/script>\s*$/iu.test(line)) inScript = false
      return line
    }

    let result = line.replace(/([^\s#\r\n])(#{1,6}\s+[A-Za-z])/gu, '$1\n$2')
    if (/^\s*#{1,6}[A-Za-z]/u.test(result)) {
      result = result.replace(/^(\s*#{1,6})(?=[A-Za-z])/u, '$1 ')
    }
    return result
  }).join('\n')
}

function normalizeLiteralAngles(value) {
  const withKnownTags = value.replace(
    /<(\/?)([A-Za-z][A-Za-z0-9:-]*)([^>\r\n]*?)>/gu,
    (match, slash, tag, rest) => safeTags.has(tag) ? match : `&lt;${slash}${tag}${rest}&gt;`
  )
  return withKnownTags.replace(/<(?![\/!?A-Za-z])/gu, '&lt;')
}

function normalizeMarkdown(value) {
  const withSfcBoundaries = normalizeSfcBoundaries(value)
  const withFenceBoundaries = normalizeFenceBoundaries(withSfcBoundaries)
  const segments = withFenceBoundaries.split(fencedPattern)
  return segments.map((segment, index) => {
    if (index % 2 === 1) return segment

    const withComponents = segment.replace(componentPattern, (block, offset) => {
      let prefix = ''
      let suffix = ''
      const end = offset + block.length
      const following = segment.slice(end)

      if (offset > 0 && segment[offset - 1] !== '\n') prefix = '\n'
      if (following.startsWith('\r\n')) {
        if (!following.startsWith('\r\n\r\n')) suffix = '\r\n'
      } else if (following.startsWith('\n')) {
        if (!following.startsWith('\n\n')) suffix = '\n'
      } else if (following) {
        suffix = '\n'
      }

      return `${prefix}${normalizeComponentBlock(block)}${suffix}`
    })
    return normalizeHeadingBoundaries(normalizeLiteralAngles(normalizeHtmlBlocks(withComponents)))
  }).join('')
}

function collectMarkdown(directory, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      collectMarkdown(entryPath, results)
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(entryPath)
    }
  }
  return results
}

const files = collectMarkdown(englishRoot)
let changed = 0

for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8')
  const normalized = normalizeMarkdown(source)
  if (normalized === source) continue
  fs.writeFileSync(filePath, normalized, 'utf8')
  changed += 1
}

console.log(`Normalized ${changed} of ${files.length} English Markdown files.`)
