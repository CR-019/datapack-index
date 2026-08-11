import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const root = process.cwd()
const translationInputDirectory = path.join(root, '.cache')
const force = process.argv.includes('--force')
const requestedFiles = process.argv
  .filter((arg) => arg.startsWith('--file='))
  .map((arg) => arg.slice('--file='.length).replaceAll('\\', '/'))

const ignoredDirectories = new Set([
  '.git',
  '.vitepress',
  'dist',
  'node_modules',
  'public',
  'en',
])

// Keep terminology that has a precise Minecraft meaning stable across pages.
// The values are restored after translation, so the translation service cannot
// reinterpret command/data-pack terminology as ordinary prose.
const glossary = [
  ['原版模组', 'vanilla mod'],
  ['数据包', 'data pack'],
  ['资源包', 'resource pack'],
  ['命令方块', 'command block'],
  ['命令', 'command'],
  ['函数', 'function'],
  ['实体', 'entity'],
  ['方块', 'block'],
  ['物品', 'item'],
  ['战利品表', 'loot table'],
  ['物品修饰器', 'item modifier'],
  ['谓词', 'predicate'],
  ['进度', 'advancement'],
  ['记分板', 'scoreboard'],
  ['选择器', 'selector'],
  ['标签', 'tag'],
  ['配方', 'recipe'],
  ['对话框', 'dialog'],
  ['伤害类型', 'damage type'],
  ['世界生成', 'world generation'],
  ['维度类型', 'dimension type'],
  ['维度', 'dimension'],
  ['拼图方块', 'jigsaw block'],
  ['着色器', 'shader'],
  ['模型映射', 'model mapping'],
  ['资源包格式', 'resource-pack format'],
  ['数据包格式', 'data-pack format'],
  ['原版', 'vanilla'],
  ['玩家', 'player'],
  ['生物', 'mob'],
  ['客户端', 'client'],
  ['服务器', 'server'],
  ['世界', 'world'],
  ['区块', 'chunk'],
  ['方块状态', 'block state'],
  ['物品组件', 'item component'],
  ['自定义世界生成', 'custom world generation'],
  ['命名空间', 'namespace'],
  ['版本号', 'version number'],
  ['版本', 'version'],
  ['坐标', 'coordinate'],
  ['记分板分数', 'scoreboard score'],
  ['香草图书馆', 'Vanilla Library'],
]

const sourceFiles = new Set()

function collectMarkdown(directory, relativeDirectory = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        collectMarkdown(path.join(directory, entry.name), path.join(relativeDirectory, entry.name))
      }
      continue
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      sourceFiles.add(path.posix.normalize(path.join(relativeDirectory, entry.name).replaceAll('\\', '/')))
    }
  }
}

collectMarkdown(root)

function normaliseRelative(value) {
  return path.posix.normalize(value.replaceAll('\\', '/')).replace(/^\.\//, '')
}

function isChinese(value) {
  return /[\u3400-\u9fff]/u.test(value)
}

function protectValue(protectedValues, value) {
  const token = `QzX9vA${String(protectedValues.length).padStart(5, '0')}LmR7`
  protectedValues.push([token, value])
  return token
}

const protectedBlockPattern = /QzX9vA\d{5}LmR7/gu

function splitChunks(value, maxLength = 1600) {
  if (value.length <= maxLength) return [value]
  const chunks = []
  let offset = 0
  while (offset < value.length) {
    if (value.length - offset <= maxLength) {
      chunks.push(value.slice(offset))
      break
    }
    let end = value.lastIndexOf('\n', offset + maxLength)
    if (end <= offset) end = offset + maxLength
    else end += 1
    const tokenPattern = protectedBlockPattern
    let tokenMatch
    let lastTokenMatch
    while ((tokenMatch = tokenPattern.exec(value)) !== null && tokenMatch.index < end) {
      lastTokenMatch = tokenMatch
    }
    if (lastTokenMatch && lastTokenMatch.index >= offset) {
      const tokenEnd = lastTokenMatch.index + lastTokenMatch[0].length
      if (tokenEnd >= end) end = tokenEnd
    }
    chunks.push(value.slice(offset, end))
    offset = end
  }
  return chunks
}

let lastRequestAt = 0
let requestSequence = 0
let requestGate = Promise.resolve()
let activeRequests = 0
const requestWaiters = []

async function acquireRequestSlot() {
  while (activeRequests >= 6) {
    await new Promise((resolve) => requestWaiters.push(resolve))
  }
  activeRequests += 1

  let release
  const previous = requestGate
  requestGate = new Promise((resolve) => {
    release = resolve
  })
  await previous
  const wait = Math.max(0, 120 - (Date.now() - lastRequestAt))
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
  lastRequestAt = Date.now()
  release()

  return () => {
    activeRequests -= 1
    requestWaiters.shift()?.()
  }
}

async function requestTranslation(value) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const releaseRequestSlot = await acquireRequestSlot()

    const url = new URL('https://translate.googleapis.com/translate_a/single')
    url.searchParams.set('client', 'gtx')
    url.searchParams.set('sl', 'zh-CN')
    url.searchParams.set('tl', 'en')
    url.searchParams.set('dt', 't')
    url.searchParams.set('q', value)

    let requestInputPath = ''
    try {
      // The execution environment exposes the configured network proxy to
      // Windows PowerShell, while Node's undici client may not inherit it.
      // Use the platform client as a fallback so this generator remains usable
      // in the repository's Windows development environment.
      // Keep the request body out of the PowerShell command line. Long
      // command lines are rejected by Windows before PowerShell can run.
      const encoded = Buffer.from(value, 'utf8').toString('base64')
      fs.mkdirSync(translationInputDirectory, { recursive: true })
      requestInputPath = path.join(
        translationInputDirectory,
        `datapack-index-translation-${process.pid}-${requestSequence++}.txt`,
      )
      fs.writeFileSync(requestInputPath, encoded, 'ascii')
      const escapedInputPath = requestInputPath.replaceAll("'", "''")
      const command = [
        `$encoded=Get-Content -Raw -LiteralPath '${escapedInputPath}'`,
        `$bytes=[Convert]::FromBase64String($encoded.Trim())`,
        `$text=[Text.Encoding]::UTF8.GetString($bytes)`,
        `$q=[uri]::EscapeDataString($text)`,
        `$u='${url.origin}${url.pathname}?client=gtx&sl=zh-CN&tl=en&dt=t&q='+$q`,
        `$response=(Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 30).Content`,
        `[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($response))`,
      ].join(';')
      const { stdout } = await execFileAsync('powershell.exe', [
        '-NoLogo',
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        command,
      ], { maxBuffer: 1024 * 1024 * 8 })
      const responseText = Buffer.from(stdout.trim(), 'base64').toString('utf8')
      const json = JSON.parse(responseText)
      const translated = json?.[0]
        ?.map((part) => part?.[0] || '')
        .join('')
      if (typeof translated === 'string' && translated.length > 0) return translated
      throw new Error('translation response was empty')
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    } finally {
      if (requestInputPath) {
        try {
          fs.rmSync(requestInputPath, { force: true })
        } catch {
          // Best-effort cleanup; the cache directory is removed after the run.
        }
      }
      releaseRequestSlot()
    }
  }
  return value
}

function protectTerms(value) {
  let result = value
  for (const [source, target] of glossary) {
    if (!result.includes(source)) continue
    // Replace exact Minecraft terminology directly. It is already English,
    // so this avoids sending another placeholder through the translator.
    result = result.split(source).join(target)
  }
  return result
}

function protectMarkup(value, protectedValues) {
  const patterns = [
    /```[\s\S]*?```/gu,
    /~~~[\s\S]*?~~~/gu,
    /<!--\s*[\s\S]*?-->/gu,
    /`[^`\n]+`/gu,
    /\$\$[\s\S]*?\$\$/gu,
    /\$(?:\\.|[^$\n])+\$/gu,
    /<(?=[^>]*\b(?:src|href|cover|background)\s*=)[^>]+>/giu,
    /https?:\/\/[^\s)\]>]+/gu,
  ]
  let result = value
  // Protect local Markdown destinations separately so the translation service
  // cannot translate Chinese filenames inside links while translating the link
  // label itself.
  result = result.replace(/(\]\()([^\s)]+)(?=[)#?])/gu, (_match, prefix, target) => {
    return `${prefix}${protectValue(protectedValues, target)}`
  })
  for (const pattern of patterns) {
    result = result.replace(pattern, (match) => {
      return protectValue(protectedValues, match)
    })
  }
  return result
}

function restoreTokens(value, protectedValues) {
  let result = value
  for (const [token, replacement] of [...protectedValues].reverse()) {
    result = result.split(token).join(replacement)
  }
  return result
}

async function translateText(value) {
  if (!isChinese(value)) return value

  const protectedValues = []
  // Protect markup before applying the terminology glossary. Otherwise a
  // glossary term inside a URL or code block would be restored into that
  // protected value and silently rewrite it.
  let prepared = protectMarkup(value, protectedValues)
  prepared = protectTerms(prepared)

  const translationParts = []
  const tokenPattern = /QzX9vA\d{5}LmR7/gu
  let cursor = 0
  let tokenMatch
  while ((tokenMatch = tokenPattern.exec(prepared)) !== null) {
    for (const chunk of splitChunks(prepared.slice(cursor, tokenMatch.index))) {
      translationParts.push(isChinese(chunk) ? requestTranslation(chunk) : chunk)
    }
    translationParts.push(tokenMatch[0])
    cursor = tokenMatch.index + tokenMatch[0].length
  }
  for (const chunk of splitChunks(prepared.slice(cursor))) {
    translationParts.push(isChinese(chunk) ? requestTranslation(chunk) : chunk)
  }

  const translatedChunks = await Promise.all(translationParts)
  return restoreTokens(translatedChunks.join(''), protectedValues)
}

async function translateAttributeValues(value) {
  const attributePattern = /(\b(?:title|alt|description|abstractText|authorName|abstract|text)\s*=\s*["'])([^"']+)(["'])/gu
  const matches = [...value.matchAll(attributePattern)]
  let result = value
  for (const match of matches.reverse()) {
    if (!isChinese(match[2])) continue
    const translated = await translateText(match[2])
    const replacement = `${match[1]}${translated}${match[3]}`
    result = result.slice(0, match.index) + replacement + result.slice(match.index + match[0].length)
  }

  const unquotedPattern = /(\b(?:authorName|abstract)\s*=\s*)([^\s"'<>][^\n]*?)(?=\s*(?:\n|\/?>))/gu
  const unquotedMatches = [...result.matchAll(unquotedPattern)]
  for (const match of unquotedMatches.reverse()) {
    if (!isChinese(match[2])) continue
    const translated = await translateText(match[2].trim())
    const replacement = `${match[1]}${translated}`
    result = result.slice(0, match.index) + replacement + result.slice(match.index + match[0].length)
  }
  return result
}

function resolveSourceReference(sourceRelativePath, reference) {
  const cleanReference = reference.split('#')[0].split('?')[0]
  if (!cleanReference || cleanReference.startsWith('/') || /^[a-z][a-z0-9+.-]*:/iu.test(cleanReference)) return null
  const resolved = normaliseRelative(path.posix.join(path.posix.dirname(sourceRelativePath), cleanReference))
  const rootRelative = normaliseRelative(cleanReference)
  if (sourceFiles.has(rootRelative)) return rootRelative
  return resolved
}

function addEnglishPrefix(reference) {
  const hashIndex = reference.indexOf('#')
  const queryIndex = reference.indexOf('?')
  const suffixStart = [hashIndex, queryIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0]
  const pathname = suffixStart === undefined ? reference : reference.slice(0, suffixStart)
  const suffix = suffixStart === undefined ? '' : reference.slice(suffixStart)
  if (!pathname.startsWith('/')) return reference
  // Absolute paths to static assets belong to the shared source tree. Only
  // document-like routes should be redirected into the English locale.
  if (/\.(?:avif|bmp|css|csv|gif|html?|ico|jpeg|jpg|js|json|mp3|mp4|pdf|png|svg|txt|webp|woff2?|zip|7z)$/iu.test(pathname)) return reference
  if (pathname === '/datapack-index') return `/datapack-index/en${suffix}`
  if (pathname.startsWith('/datapack-index/')) return `/datapack-index/en${pathname.slice('/datapack-index'.length)}${suffix}`
  if (/^\/(?:index|feature|wheel|resources|preview)(?:\/|$)/u.test(pathname)) return `/en${pathname}${suffix}`
  return reference
}

function localiseReference(sourceRelativePath, targetRelativePath, reference) {
  if (!reference || reference.startsWith('#') || reference.startsWith('mailto:') || reference.startsWith('data:')) return reference
  if (reference.startsWith('/')) return addEnglishPrefix(reference)
  if (/^[a-z][a-z0-9+.-]*:/iu.test(reference)) return reference

  const hashIndex = reference.indexOf('#')
  const queryIndex = reference.indexOf('?')
  const suffixStart = [hashIndex, queryIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0]
  const pathname = suffixStart === undefined ? reference : reference.slice(0, suffixStart)
  const suffix = suffixStart === undefined ? '' : reference.slice(suffixStart)
  const sourceTarget = resolveSourceReference(sourceRelativePath, pathname)
  if (!sourceTarget) return reference

  if (sourceFiles.has(sourceTarget)) {
    return `/en/${sourceTarget.replace(/\.md$/iu, '')}${suffix}`
  }

  const sourceAsset = path.join(root, sourceTarget)
  if (!fs.existsSync(sourceAsset)) return reference
  let relative = path.posix.relative(
    path.posix.dirname(targetRelativePath),
    sourceTarget,
  )
  if (!relative.startsWith('.')) relative = `./${relative}`
  return `${relative}${suffix}`
}

function localiseLinks(value, sourceRelativePath, targetRelativePath) {
  const protectedValues = []
  let result = value.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/gu, (match) => {
    const token = `MCBLOCK${protectedValues.length}TOKEN`
    protectedValues.push([token, match])
    return token
  })

  result = result.replace(/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/gu, (_match, start, target, end) => {
    return `${start}${localiseReference(sourceRelativePath, targetRelativePath, target)}${end}`
  })
  result = result.replace(/(\b(?:href|src|cover|background)\s*=\s*["'])([^"']+)(["'])/giu, (_match, start, target, end) => {
    return `${start}${localiseReference(sourceRelativePath, targetRelativePath, target)}${end}`
  })

  return restoreTokens(result, protectedValues)
}

async function translateFile(relativePath) {
  const sourcePath = path.join(root, relativePath)
  const targetRelativePath = path.posix.join('en', relativePath)
  const targetPath = path.join(root, targetRelativePath)
  if (!force && fs.existsSync(targetPath)) return 'skipped'

  const source = fs.readFileSync(sourcePath, 'utf8')
  let translated = await translateText(source)
  translated = await translateAttributeValues(translated)
  translated = localiseLinks(translated, relativePath, targetRelativePath)
  if (/QzX9vA\d{5}LmR7/u.test(translated)) {
    throw new Error(`unrestored translation marker in ${relativePath}`)
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, translated, 'utf8')
  return 'written'
}

const files = requestedFiles.length
  ? requestedFiles.filter((file) => sourceFiles.has(normaliseRelative(file)))
  : [...sourceFiles].sort()

if (!files.length) {
  console.error('No Markdown files selected.')
  process.exitCode = 1
} else {
  let written = 0
  let skipped = 0
  const failures = []
  let nextFile = 0
  const worker = async () => {
    while (true) {
      const fileIndex = nextFile++
      if (fileIndex >= files.length) return
      const file = files[fileIndex]
      process.stdout.write(`Translating ${file}\n`)
      try {
        const result = await translateFile(file)
        if (result === 'written') written += 1
        else skipped += 1
      } catch (error) {
        failures.push({ file, error })
        console.error(`Failed ${file}: ${error?.stack || error}`)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, files.length) }, () => worker()))
  console.log(`Completed: ${written} written, ${skipped} skipped, ${failures.length} failed.`)
  if (failures.length) process.exitCode = 1
}
