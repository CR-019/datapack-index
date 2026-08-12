import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const englishRoot = path.join(root, 'en')
const componentNames = 'FeaturedHead|FeatureHead|SpotlightHead|JournalHead|IndexCompatible|ColorLine'
const componentPattern = new RegExp(`<(?::?${componentNames})\\b[\\s\\S]*?\\/>`, 'gu')
const customTagNames = new Set([
  'Badge', 'Button', 'DpsCell', 'DpsPlayground', 'Panel', 'Property',
  'Sprite', 'Template', 'TextBlock', 'TextButton', 'UI', 'Vec3d', 'Window',
  'AllPage', 'MarkdownPreviewer', 'SearchBox',
])
const fencedPattern = /(^[ \t]*````[^\r\n`]*(?:\r?\n|$)[\s\S]*?^[ \t]*````[ \t]*(?:\r?\n|$)|^[ \t]*```[^\r\n`]*(?:\r?\n|$)[\s\S]*?^[ \t]*```[ \t]*(?:\r?\n|$)|^[ \t]*~~~[^\r\n~]*(?:\r?\n|$)[\s\S]*?^[ \t]*~~~[ \t]*(?:\r?\n|$))/gmu
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
const translationNotice = `::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::`

const terminologyReplacements = [
  [/\bdata packedit\b/gu, 'data pack editor'],
  [/\bdata packfunction\b/gu, 'data pack function'],
  [/\bdata packversion\b/gu, 'data pack version'],
  [/\bresource packversion\b/gu, 'resource pack version'],
  [/\bfunctioncommand\b/gu, 'function command'],
  [/\bcommandtp\b/gu, 'command TP'],
  [/\bexecutecommand\b/gu, 'execute command'],
  [/\bversionexecute\b/gu, 'version execute'],
  [/\bitemmodel\b/gu, 'item model'],
  [/\bvanillashader\b/gu, 'vanilla shader'],
  [/\bresource packshader\b/gu, 'resource pack shader'],
  [/\bdata packresource pack\b/gu, 'data pack/resource pack'],
  [/\bdata packtag\b/gu, 'data pack tag'],
  [/\bNBTtags\b/gu, 'NBT tags'],
  [/\bSNBTtag\b/gu, 'SNBT tag'],
  [/\bfunctiontag\b/gu, 'function tag'],
  [/\badvancementpredicate\b/gu, 'advancement predicate'],
  [/\bloot tablepredicate\b/gu, 'loot table predicate'],
  [/\bMinecraftresource\b/gu, 'Minecraft resource'],
  [/\bZIPresource\b/gu, 'ZIP resource'],
  [/\bMCdata pack\b/gu, 'MC data pack'],
  [/\bmcvanilla\b/gu, 'MC vanilla'],
  [/\bserverworld\b/gu, 'server world'],
  [/\bworldentity\b/gu, 'world entity'],
]

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
  const fencePattern = /^[ \t]*(?:````|```|~~~)(?=[ \t]*(?:[A-Za-z0-9_+.-]+)?[ \t]*(?:\r?$))/gmu
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

function normalizeMarkdownBoundaries(value) {
  let result = value
  result = result.replace(
    /([^#\r\n])([ \t]*)(#{1,6}[ \t]+[A-Za-z])/gu,
    '$1\n\n$3',
  )
  result = result.replace(
    /([)\]`])([ \t]*)(-[ \t]*(?=[A-Za-z0-9\[`*]))/gu,
    '$1\n$3',
  )
  result = result.replace(
    /([)\]`])([ \t]*)(\d+[.)][ \t]+)/gu,
    '$1\n$3',
  )
  result = result.replace(/`[ \t]+([^`\n]*?)[ \t]+`/gu, '`$1`')
  result = result.replace(/^([ \t]*-(?!-{2}))[ \t]*(?=\S)/gmu, '$1 ')
  return result
}

function normalizeSfcBoundaries(value) {
  return value.replace(
    /([^\r\n])---(\r?\n\s*<(?:script|style)\b)/giu,
    '$1\n\n---$2',
  )
}

function ensureTranslationNotice(value) {
  if (/:::\s*tip\s+Translation notice/iu.test(value)) return value

  const lines = value.split('\n')
  let insertAt = 0
  if (lines[0]?.trim() === '---') {
    const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
    if (frontmatterEnd >= 0) insertAt = frontmatterEnd + 1
  }

  const prefix = lines.slice(0, insertAt).join('\n').replace(/\n+$/u, '')
  const suffix = lines.slice(insertAt).join('\n').replace(/^\n+/u, '')
  return [prefix, translationNotice, suffix].filter((part) => part !== '').join('\n\n') + '\n'
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
    if (/^[ \t]*#{1,6}(?!#)\S/u.test(result)) {
      result = result.replace(/^([ \t]*#{1,6})(?!#)(?=\S)/u, '$1 ')
    }
    return result
  }).join('\n')
}

function normalizeEnglishTerminology(value) {
  const protectedValues = []
  let result = value.replace(
    /`[^`\n]*`|https?:\/\/[^\s)>]+|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>\n]*>/giu,
    (match) => {
      const token = 'QzTerm' + String(protectedValues.length).padStart(4, '0') + 'LmR7'
      protectedValues.push([token, match])
      return token
    },
  )
  for (const [pattern, replacement] of terminologyReplacements) {
    result = result.replace(pattern, replacement)
  }
  for (const [token, replacement] of [...protectedValues].reverse()) {
    result = result.split(token).join(replacement)
  }
  return result
}

function normalizeLiteralAngles(value) {
  const restoredCustomTags = value.replace(
    /&lt;(\/?)([A-Za-z][A-Za-z0-9:-]*)([^>\r\n]*?)&gt;/gu,
    (match, slash, tag, rest) => customTagNames.has(tag) ? `<${slash}${tag}${rest}>` : match,
  )
  const withKnownTags = restoredCustomTags.replace(
    /<(\/?)([A-Za-z][A-Za-z0-9:-]*)([^>\r\n]*?)>/gu,
    (match, slash, tag, rest) => safeTags.has(tag) || customTagNames.has(tag)
      ? match
      : `&lt;${slash}${tag}${rest}&gt;`
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
    const withBoundaries = normalizeMarkdownBoundaries(normalizeHtmlBlocks(withComponents))
    return normalizeHeadingBoundaries(normalizeEnglishTerminology(normalizeLiteralAngles(withBoundaries)))
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
  const normalized = ensureTranslationNotice(normalizeMarkdown(source))
  if (normalized === source) continue
  fs.writeFileSync(filePath, normalized, 'utf8')
  changed += 1
}

console.log(`Normalized ${changed} of ${files.length} English Markdown files.`)
