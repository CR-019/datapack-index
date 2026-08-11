import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const root = process.cwd()
const englishRoot = path.join(root, 'en')
const cacheDirectory = path.join(root, '.cache')
const hanPattern = /[\u3400-\u9fff]/u
const inlineCodePattern = new RegExp(
  String.fromCharCode(96) + '[^' + String.fromCharCode(96) + '\n]+' + String.fromCharCode(96),
  'gu',
)
const translationCache = new Map()
let requestSequence = 0
let lastRequestAt = 0
let requestGate = Promise.resolve()

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
  ['谓词', 'predicate'],
  ['进度', 'advancement'],
  ['记分板', 'scoreboard'],
  ['选择器', 'selector'],
  ['标签', 'tag'],
  ['配方', 'recipe'],
  ['对话框', 'dialog'],
  ['着色器', 'shader'],
  ['原版', 'vanilla'],
  ['玩家', 'player'],
  ['生物', 'mob'],
  ['客户端', 'client'],
  ['服务器', 'server'],
  ['世界', 'world'],
  ['区块', 'chunk'],
  ['命名空间', 'namespace'],
  ['坐标', 'coordinate'],
]

function protectValue(values, value) {
  const token = 'MCCommentToken' + String(values.length).padStart(6, '0') + 'End'
  values.push([token, value])
  return token
}

function protectMarkup(value, values) {
  let result = value
  result = result.replace(/https?:\/\/[^\s)\]>]+/gu, (match) => protectValue(values, match))
  result = result.replace(inlineCodePattern, (match) => protectValue(values, match))
  result = result.replace(/\$\$[\s\S]*?\$\$/gu, (match) => protectValue(values, match))
  result = result.replace(/\$(?:\\.|[^$\n])+\$/gu, (match) => protectValue(values, match))
  return result
}

function restoreValues(value, values) {
  let result = value
  for (const [token, replacement] of [...values].reverse()) {
    result = result.split(token).join(replacement)
  }
  return result
}

function prepareTranslation(value) {
  const values = []
  let result = protectMarkup(value, values)
  for (const [source, target] of glossary) {
    result = result.split(source).join(target)
  }
  return { result, values }
}

async function runTranslationRequest(command) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await execFileAsync('powershell.exe', [
        '-NoLogo',
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        command,
      ], { maxBuffer: 1024 * 1024 * 8 })
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  throw new Error('translation request failed')
}

async function requestTranslation(value) {
  if (!hanPattern.test(value)) return value
  const cached = translationCache.get(value)
  if (cached) return cached

  const { result: prepared, values } = prepareTranslation(value)
  if (!hanPattern.test(prepared)) {
    const restored = restoreValues(prepared, values)
    translationCache.set(value, restored)
    return restored
  }

  const promise = (async () => {
    const previous = requestGate
    let release
    requestGate = new Promise((resolve) => {
      release = resolve
    })
    await previous
    const wait = Math.max(0, 120 - (Date.now() - lastRequestAt))
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
    lastRequestAt = Date.now()
    release()

    const encoded = Buffer.from(prepared, 'utf8').toString('base64')
    fs.mkdirSync(cacheDirectory, { recursive: true })
    const inputPath = path.join(
      cacheDirectory,
      'datapack-index-comment-' + process.pid + '-' + requestSequence++ + '.txt',
    )
    fs.writeFileSync(inputPath, encoded, 'ascii')
    const escapedInputPath = inputPath.replaceAll("'", "''")
    const command = [
      "$encoded=Get-Content -Raw -LiteralPath '" + escapedInputPath + "'",
      '$bytes=[Convert]::FromBase64String($encoded.Trim())',
      '$text=[Text.Encoding]::UTF8.GetString($bytes)',
      '$q=[uri]::EscapeDataString($text)',
      "$u='https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q='+$q",
      '$response=(Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 30).Content',
      '[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($response))',
    ].join(';')

    try {
      const { stdout } = await runTranslationRequest(command)
      const responseText = Buffer.from(stdout.trim(), 'base64').toString('utf8')
      const json = JSON.parse(responseText)
      const translated = json?.[0]?.map((part) => part?.[0] || '').join('')
      if (!translated) throw new Error('translation response was empty')
      return restoreValues(translated, values)
    } finally {
      try {
        fs.rmSync(inputPath, { force: true })
      } catch {
        // Best-effort cleanup of this script's temporary request file.
      }
    }
  })()

  translationCache.set(value, promise)
  try {
    const translated = await promise
    translationCache.set(value, translated)
    return translated
  } catch (error) {
    translationCache.delete(value)
    throw error
  }
}

async function translateCommentBody(value) {
  if (!hanPattern.test(value)) return value
  return requestTranslation(value)
}

async function translateBlockComments(value) {
  const replacements = []
  const pattern = /(\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/gu
  const matches = [...value.matchAll(pattern)]
  for (const match of matches) {
    const full = match[0]
    const opener = full.startsWith('<!--') ? '<!--' : '/*'
    const closer = full.startsWith('<!--') ? '-->' : '*/'
    const inner = full.slice(opener.length, -closer.length)
    if (!hanPattern.test(inner)) continue
    replacements.push({
      start: match.index,
      end: match.index + full.length,
      value: opener + await translateCommentBody(inner) + closer,
    })
  }
  let result = value
  for (const replacement of replacements.reverse()) {
    result = result.slice(0, replacement.start)
      + replacement.value
      + result.slice(replacement.end)
  }
  return result
}

async function translateCodeComments(value) {
  const lines = value.split(/\r?\n/)
  let inFence = false
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\s*(?:\x60{3}|~~~)/u.test(line)) {
      inFence = !inFence
      continue
    }
    if (!inFence || !hanPattern.test(line)) continue

    const slashIndex = line.indexOf('//')
    const hashMatch = line.match(/(?:^|\s)#/)
    const hashIndex = hashMatch ? line.indexOf('#', hashMatch.index) : -1
    const candidates = [slashIndex, hashIndex].filter((position) => position >= 0)
    if (!candidates.length) continue
    const commentIndex = Math.min(...candidates)
    const prefix = line.slice(0, commentIndex)
    const body = line.slice(commentIndex + (line[commentIndex] === '#' ? 1 : 2))
    if (!hanPattern.test(body)) continue
    lines[index] = prefix
      + (line[commentIndex] === '#' ? '#' : '//')
      + await translateCommentBody(body)
  }
  return lines.join('\n')
}

function collectMarkdown(directory, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectMarkdown(entryPath, results)
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) results.push(entryPath)
  }
  return results.sort()
}

const files = collectMarkdown(englishRoot)
let changed = 0
let failed = 0

let nextFile = 0
const worker = async () => {
  while (true) {
    const filePath = files[nextFile++]
    if (!filePath) return
    try {
      const source = fs.readFileSync(filePath, 'utf8')
      const withBlockComments = await translateBlockComments(source)
      const translated = await translateCodeComments(withBlockComments)
      if (translated === source) continue
      fs.writeFileSync(filePath, translated, 'utf8')
      changed += 1
    } catch (error) {
      failed += 1
      console.error('Failed ' + path.relative(root, filePath) + ': ' + (error?.stack || error))
    }
  }
}

await Promise.all(Array.from({ length: 12 }, () => worker()))
console.log('Translated comments in ' + changed + ' of ' + files.length + ' English Markdown files.')
if (failed) process.exitCode = 1
