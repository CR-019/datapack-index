import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const englishRoot = path.join(root, 'en')
const ignoredDirectories = new Set(['.git', '.vitepress', 'dist', 'node_modules', 'public', 'en'])
const sfcPattern = /<\/?(script|style)\b/giu
const fenceLinePattern = /^>?[ \t]*(````|```|~~~~|~~~)(?:[A-Za-z0-9_+.-]+)?[ \t]*$/u
const fencePattern = /(^|\r?\n)\s*(```|~~~)([^\r\n]*)/gu
const headingPattern = /^\s*(#{1,6})\s+/gmu
const chinesePattern = /[\u3400-\u9fff]/gu
const noticePattern = /:::\s*tip\s+Translation notice/iu

function collectMarkdown(directory, relativeDirectory = '', results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue
    const entryPath = path.join(directory, entry.name)
    const relativePath = path.posix.join(relativeDirectory, entry.name)
    if (entry.isDirectory()) collectMarkdown(entryPath, relativePath, results)
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) results.push(relativePath)
  }
  return results
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replaceAll('\r\n', '\n')
}

function maskProtected(value) {
  let result = value
  result = result.replace(
    /(^>?[ \t]*````[^\r\n`]*(?:\r?\n|$)[\s\S]*?^>?[ \t]*````[ \t]*(?:\r?\n|$)|^>?[ \t]*```[^\r\n`]*(?:\r?\n|$)[\s\S]*?^>?[ \t]*```[ \t]*(?:\r?\n|$)|^>?[ \t]*~~~~[^\r\n~]*(?:\r?\n|$)[\s\S]*?^>?[ \t]*~~~~[ \t]*(?:\r?\n|$)|^>?[ \t]*~~~[^\r\n~]*(?:\r?\n|$)[\s\S]*?^>?[ \t]*~~~[ \t]*(?:\r?\n|$))/gmu,
    (match) => match.replace(/[^\n]/gu, ' '),
  )
  result = result.replace(/```[^\r\n]*```|~~~~[^\r\n]*~~~~|~~~[^\r\n]*~~~/gu, (match) => match.replace(/[^\n]/gu, ' '))
  result = result.replace(/<!--[\s\S]*?-->/gu, (match) => match.replace(/[^\n]/gu, ' '))
  result = result.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/giu, (match) => match.replace(/[^\n]/gu, ' '))
  result = result.replace(/!?\[[^\]]*\]\([^)]*\)/gu, (match) => {
    const label = match.startsWith('!') ? '' : match.replace(/\]\([^)]*\)$/, ']').replace(/^\[[^\]]*/, '')
    return label.replace(/[^\n]/gu, ' ')
  })
  result = result.replace(/https?:\/\/[^\s)>]+/gu, (match) => match.replace(/[^\n]/gu, ' '))
  result = result.replace(/`[^`\n]*`/gu, (match) => match.replace(/[^\n]/gu, ' '))
  result = result.replace(/<[^>\n]*>/gu, (match) => match.replace(/[^\n]/gu, ' '))
  return result
}

function extractHeadings(value) {
  const headings = []
  const lines = value.split('\n')
  let inFrontmatter = false
  let fence = null
  let sfcTag = null

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim()
    if (index === 0 && trimmed === '---') {
      inFrontmatter = true
      continue
    }
    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      continue
    }

    const fenceMatch = trimmed.match(fenceLinePattern)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1]
      else if (fence === fenceMatch[1]) fence = null
      continue
    }
    if (fence) continue

    const sfcOpen = trimmed.match(/^<(script|style)\b/iu)
    if (sfcOpen) sfcTag = sfcOpen[1].toLowerCase()
    if (sfcTag) {
      if (new RegExp(`</${sfcTag}>`, 'iu').test(line)) sfcTag = null
      continue
    }

    const heading = line.match(/^\s*(#{1,6})[ \t]+/u)
    if (heading) headings.push(heading[1].length)
  }
  return headings
}

function extractFenceMarkers(value) {
  const markers = []
  for (const line of value.split('\n')) {
    const match = line.trim().match(fenceLinePattern)
    if (match) markers.push(match[1])
  }
  return markers
}

function extractSfcTags(value) {
  return [...value.matchAll(sfcPattern)].map((match) => match[1].toLowerCase())
}

function extractComponents(value) {
  const components = []
  const componentPattern = /(?:^|[^A-Za-z0-9_="'\x60])<\/?([A-Z][A-Za-z0-9]*)\b/gu
  const lines = value.split('\n')
  let fence = null

  for (const line of lines) {
    const trimmed = line.trim()
    const fenceMatch = trimmed.match(fenceLinePattern)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1]
      else if (fence === fenceMatch[1]) fence = null
      continue
    }
    if (fence) continue
    const withoutInlineCode = line.replace(/`[^`\n]*`/gu, '')
    for (const match of withoutInlineCode.matchAll(componentPattern)) components.push(match[1].toLowerCase())
  }
  return components
}

function countLineBoundaryIssues(value) {
  const patterns = [
    /`[^`\n]*`\s*-\s*(?:\[|\*\*|\d+\.|[A-Z])/gu,
    /\]\([^\n)]*\)\s*-\s*(?:\[|\*\*|\d+\.|[A-Z])/gu,
    /[^#\r\n][ \t]+#{1,6}[ \t]+[A-Za-z]/gu,
  ]
  let total = 0
  const lines = value.split('\n')
  let fence = null
  let inFrontmatter = false

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim()
    if (index === 0 && trimmed === '---') {
      inFrontmatter = true
      continue
    }
    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      continue
    }
    const fenceMatch = trimmed.match(fenceLinePattern)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1]
      else if (fence === fenceMatch[1]) fence = null
      continue
    }
    if (fence) continue
    total += patterns.reduce((count, pattern) => count + [...line.matchAll(pattern)].length, 0)
  }
  return total
}

const sourceFiles = collectMarkdown(root).sort()
const englishFiles = collectMarkdown(englishRoot).map((file) => file.replace(/^en\//u, '')).sort()
const missing = []
const extra = []
const issues = []
const residuals = []
const missingNotices = []
let notices = 0
let structuralPairs = 0

const sourceSet = new Set(sourceFiles)
const englishSet = new Set(englishFiles)
for (const relativePath of sourceFiles) {
  const targetPath = path.join('en', relativePath)
  if (!fs.existsSync(path.join(root, targetPath))) {
    missing.push(relativePath)
    continue
  }

  const source = read(relativePath)
  const english = read(targetPath)
  structuralPairs += 1
  if (noticePattern.test(english)) notices += 1
  else missingNotices.push(relativePath)

  const sourceHeadings = extractHeadings(source)
  const englishHeadings = extractHeadings(english)
  if (sourceHeadings.join(',') !== englishHeadings.join(',')) {
    issues.push(`${relativePath}: heading levels ${sourceHeadings.join(',')} -> ${englishHeadings.join(',')}`)
  }

  const sourceFences = extractFenceMarkers(source)
  const englishFences = extractFenceMarkers(english)
  if (sourceFences.join(',') !== englishFences.join(',')) {
    issues.push(`${relativePath}: fenced block markers ${sourceFences.join(',')} -> ${englishFences.join(',')}`)
  }

  const sourceSfc = extractSfcTags(source)
  const englishSfc = extractSfcTags(english)
  if (sourceSfc.join(',') !== englishSfc.join(',')) {
    issues.push(`${relativePath}: SFC tags ${sourceSfc.join(',')} -> ${englishSfc.join(',')}`)
  }

  const sourceComponents = extractComponents(source)
  const englishComponents = extractComponents(english)
  if (sourceComponents.join(',') !== englishComponents.join(',')) {
    issues.push(`${relativePath}: component tags ${sourceComponents.join(',')} -> ${englishComponents.join(',')}`)
  }

  const residual = [...maskProtected(english).matchAll(chinesePattern)].length
  if (residual) residuals.push(`${relativePath}: ${residual} Chinese characters outside protected markup`)

  const boundaryIssues = countLineBoundaryIssues(english)
  if (boundaryIssues) issues.push(`${relativePath}: ${boundaryIssues} likely collapsed Markdown line boundaries`)
}

for (const relativePath of englishFiles) {
  if (!sourceSet.has(relativePath)) extra.push(relativePath)
}

console.log(`Source Markdown files: ${sourceFiles.length}`)
console.log(`English Markdown files: ${englishFiles.length}`)
console.log(`Matched pairs: ${structuralPairs}`)
console.log(`Missing English files: ${missing.length}`)
console.log(`Extra English files: ${extra.length}`)
console.log(`Translation notices: ${notices}/${structuralPairs}`)
console.log(`Structural issues: ${issues.length}`)
console.log(`Chinese residual files: ${residuals.length}`)

if (missing.length) console.log(`\nMissing:\n${missing.slice(0, 30).join('\n')}`)
if (missingNotices.length) console.log(`\nMissing translation notices:\n${missingNotices.slice(0, 30).join('\n')}`)
if (extra.length) console.log(`\nExtra:\n${extra.slice(0, 30).join('\n')}`)
if (issues.length) console.log(`\nStructural issues (first 80):\n${issues.slice(0, 80).join('\n')}`)
if (residuals.length) console.log(`\nChinese residuals (first 80):\n${residuals.slice(0, 80).join('\n')}`)

if (missing.length || issues.length) process.exitCode = 1
