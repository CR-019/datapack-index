import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { createShikiCache } from '../.vitepress/markdown/shiki-cache.mjs'

const quietLogger = {
  log() {},
  warn() {},
}

function mockHighlighter() {
  let calls = 0
  return {
    codeToHtml(code, options) {
      calls += 1
      return `<pre data-lang="${options.lang}">${code}</pre>`
    },
    calls() {
      return calls
    },
  }
}

async function temporaryCache(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'shiki-cache-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  return directory
}

test('reuses highlighted HTML in the same and later processes', async (t) => {
  const cacheDirectory = await temporaryCache(t)
  const options = { lang: 'js', theme: 'github-dark', meta: { __raw: '' } }
  const coldHighlighter = mockHighlighter()
  const coldCache = createShikiCache({ cacheDirectory, logger: quietLogger })
  coldCache.install(coldHighlighter)

  const first = coldHighlighter.codeToHtml('const value = 1', options)
  const duplicate = coldHighlighter.codeToHtml('const value = 1', options)

  assert.equal(duplicate, first)
  assert.equal(coldHighlighter.calls(), 1)
  assert.deepEqual(coldCache.stats(), { hits: 1, misses: 1, writeFailures: 0 })

  const hotHighlighter = mockHighlighter()
  const hotCache = createShikiCache({ cacheDirectory, logger: quietLogger })
  hotCache.install(hotHighlighter)

  assert.equal(hotHighlighter.codeToHtml('const value = 1', options), first)
  assert.equal(hotHighlighter.calls(), 0)
  assert.deepEqual(hotCache.stats(), { hits: 1, misses: 0, writeFailures: 0 })
})

test('invalidates entries when code or rendering options change', async (t) => {
  const cacheDirectory = await temporaryCache(t)
  const highlighter = mockHighlighter()
  const cache = createShikiCache({ cacheDirectory, logger: quietLogger })
  cache.install(highlighter)

  highlighter.codeToHtml('same code', { lang: 'js', meta: { __raw: '' } })
  highlighter.codeToHtml('changed code', { lang: 'js', meta: { __raw: '' } })
  highlighter.codeToHtml('same code', { lang: 'ts', meta: { __raw: '' } })
  highlighter.codeToHtml('same code', { lang: 'js', meta: { __raw: '{1}' } })

  assert.equal(highlighter.calls(), 4)
  assert.deepEqual(cache.stats(), { hits: 0, misses: 4, writeFailures: 0 })
})
