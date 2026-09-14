import { createHash, randomUUID } from 'node:crypto'
import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

export const SHIKI_CACHE_VERSION = 'v1'

const require = createRequire(import.meta.url)

function packageVersion(packageName) {
  let directory = path.dirname(require.resolve(packageName))

  while (directory !== path.dirname(directory)) {
    try {
      const packageData = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'))
      if (packageData.name === packageName) return packageData.version
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    directory = path.dirname(directory)
  }

  return 'unknown'
}

const pipelineVersion = [
  `vitepress-${packageVersion('vitepress')}`,
  `shiki-${packageVersion('shiki')}`,
].join('-')

function hasVPreTransformer(options) {
  const transformer = options.transformers?.find(({ name }) => name === 'vitepress:v-pre')
  if (!transformer?.pre) return false

  const node = { properties: {} }
  try {
    transformer.pre(node)
  } catch {
    return false
  }
  return Object.hasOwn(node.properties, 'v-pre')
}

function cacheKey(code, options) {
  const fingerprint = JSON.stringify({
    // Bump the cache version when VitePress's transformer pipeline or the
    // pinned Shiki version changes.
    version: SHIKI_CACHE_VERSION,
    pipeline: pipelineVersion,
    code,
    lang: options.lang,
    meta: options.meta,
    theme: options.theme,
    themes: options.themes,
    defaultColor: options.defaultColor,
    vPre: hasVPreTransformer(options),
  })
  return createHash('sha256').update(fingerprint).digest('hex')
}

function atomicWrite(filePath, contents) {
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`
  try {
    mkdirSync(path.dirname(filePath), { recursive: true })
    writeFileSync(temporaryPath, contents, { flag: 'wx' })
    renameSync(temporaryPath, filePath)
  } catch (error) {
    rmSync(temporaryPath, { force: true })
    throw error
  }
}

/**
 * Cache Shiki's deterministic HTML by code and rendering options. Individual
 * files avoid retaining a second copy of all highlighted HTML in the Node heap.
 */
export function createShikiCache({
  cacheDirectory = path.resolve('.cache/shiki', SHIKI_CACHE_VERSION),
  logger = console,
} = {}) {
  let hits = 0
  let misses = 0
  let writeFailures = 0
  let installed = false

  return {
    install(highlighter) {
      if (installed) return
      installed = true

      const codeToHtml = highlighter.codeToHtml.bind(highlighter)
      highlighter.codeToHtml = (code, options) => {
        const key = cacheKey(code, options)
        const cacheFile = path.join(cacheDirectory, key.slice(0, 2), `${key}.html`)

        try {
          const cached = readFileSync(cacheFile, 'utf8')
          hits += 1
          return cached
        } catch (error) {
          if (error?.code !== 'ENOENT') {
            logger.warn(`[shiki-cache] Ignoring ${cacheFile}: ${error.message}`)
          }
        }

        misses += 1
        const highlighted = codeToHtml(code, options)
        try {
          atomicWrite(cacheFile, highlighted)
        } catch (error) {
          writeFailures += 1
          logger.warn(`[shiki-cache] Could not cache ${cacheFile}: ${error.message}`)
        }
        return highlighted
      }
    },

    report() {
      logger.log(
        `[shiki-cache] hits ${hits}, misses ${misses}, write failures ${writeFailures}.`,
      )
    },

    stats() {
      return { hits, misses, writeFailures }
    },
  }
}
