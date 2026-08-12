import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const englishRoot = path.join(root, 'en')
const ignoredDirectories = new Set(['.git', '.vitepress', 'dist', 'node_modules', 'public', 'en'])

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

function repairHeadingArtifacts(value) {
  const output = []
  let inFrontmatter = false
  let fence = null
  let sfcTag = null

  for (const [index, line] of value.split('\n').entries()) {
    const trimmed = line.trim()
    if (index === 0 && trimmed === '---') {
      inFrontmatter = true
      output.push(line)
      continue
    }
    if (inFrontmatter) {
      output.push(line)
      if (trimmed === '---') inFrontmatter = false
      continue
    }

    const fenceMatch = trimmed.match(/^>?[ \t]*(```|~~~)/u)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1]
      else if (fence === fenceMatch[1]) fence = null
      output.push(line)
      continue
    }
    if (fence) {
      output.push(line)
      continue
    }

    const sfcOpen = trimmed.match(/^<(script|style)\b/iu)
    if (sfcOpen) sfcTag = sfcOpen[1].toLowerCase()
    if (sfcTag) {
      output.push(line)
      if (new RegExp(`</${sfcTag}>`, 'iu').test(line)) sfcTag = null
      continue
    }

    if (/^[ \t]*#{1,6}[ \t]*$/u.test(line)) continue
    const match = line.match(/^([ \t]*)(#(?:[ \t]+#)+)([ \t]+.*)?$/u)
    if (!match) {
      output.push(line)
      continue
    }
    const level = (match[2].match(/#/gu) ?? []).length
    const content = match[3] ?? ''
    output.push(`${match[1]}${'#'.repeat(level)}${content}`)
  }
  return output.join('\n')
}

function extractHeadings(value) {
  const lines = value.split('\n')
  const headings = []
  let inFrontmatter = false
  let fence = null
  let sfcTag = null

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    if (index === 0 && trimmed === '---') {
      inFrontmatter = true
      continue
    }
    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      continue
    }
    const fenceMatch = trimmed.match(/^>?[ \t]*(```|~~~)/u)
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

    const heading = line.match(/^(\s*)(#{1,6})(?:[ \t]+)(.*)$/u)
    if (heading) headings.push({ index, level: heading[2].length })
  }
  return headings
}

const files = collectMarkdown(root).sort()
let repaired = 0
const unresolved = []

for (const relativePath of files) {
  const targetPath = path.join('en', relativePath)
  if (!fs.existsSync(path.join(root, targetPath))) {
    unresolved.push(`${relativePath}: missing English file`)
    continue
  }

  const source = read(relativePath)
  const originalTarget = read(targetPath)
  const target = repairHeadingArtifacts(originalTarget)
  if (target !== originalTarget) {
    fs.writeFileSync(path.join(root, targetPath), target, 'utf8')
    repaired += 1
  }
  const sourceHeadings = extractHeadings(source)
  const targetHeadings = extractHeadings(target)
  if (sourceHeadings.length !== targetHeadings.length) {
    if (sourceHeadings.length || targetHeadings.length) {
      unresolved.push(`${relativePath}: headings ${sourceHeadings.length} -> ${targetHeadings.length}`)
    }
    continue
  }
  if (!targetHeadings.length) continue

  const lines = target.split('\n')
  let changed = false
  targetHeadings.forEach((heading, index) => {
    const sourceLevel = sourceHeadings[index].level
    const indent = lines[heading.index].match(/^\s*/u)?.[0] ?? ''
    const replacement = `${indent}${'#'.repeat(sourceLevel)} `
    const next = lines[heading.index].replace(/^\s*#{1,6}[ \t]+/u, replacement)
    if (next !== lines[heading.index]) {
      lines[heading.index] = next
      changed = true
    }
  })
  if (!changed) continue
  fs.writeFileSync(path.join(root, targetPath), lines.join('\n'), 'utf8')
  repaired += 1
}

console.log(`Repaired heading structure in ${repaired} English files.`)
console.log(`Unresolved heading maps: ${unresolved.length}`)
if (unresolved.length) console.log(unresolved.slice(0, 80).join('\n'))
