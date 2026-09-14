import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import MarkdownIt from 'markdown-it'

import { useKatex } from '../.vitepress/markdown/katex.mjs'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(testDirectory, '..')
const skippedDirectories = new Set([
  '.cache',
  '.git',
  '.github',
  '.idea',
  '.vitepress',
  'material',
  'node_modules',
  'public',
])

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue

    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findMarkdownFiles(entryPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath)
    }
  }

  return files
}

function createRenderer() {
  const renderer = new MarkdownIt({ html: true })
  useKatex(renderer)
  return renderer
}

test('renders inline and display math as KaTeX HTML', () => {
  const output = createRenderer().render('Inline $E=mc^2$.\n\n$$\\sum_{i=1}^{n} i$$')

  assert.match(output, /class="katex"/)
  assert.doesNotMatch(output, /<mjx-container|<svg/i)
})

test('renders every math expression in the Markdown source tree', async () => {
  const renderer = createRenderer()
  const files = await findMarkdownFiles(projectRoot)
  let renderedExpressions = 0

  for (const file of files.sort()) {
    const source = await readFile(file, 'utf8')
    let output

    try {
      output = renderer.render(source, {
        relativePath: path.relative(projectRoot, file),
      })
    } catch (error) {
      assert.fail(`${path.relative(projectRoot, file)}: ${error.message}`)
    }

    assert.doesNotMatch(
      output,
      /katex-error/,
      `${path.relative(projectRoot, file)} contains invalid or unsupported math`,
    )
    renderedExpressions += output.match(/class="katex"/g)?.length ?? 0
  }

  assert.ok(files.length > 500, `expected the complete source tree, found ${files.length} files`)
  assert.ok(renderedExpressions > 3_000, `expected more than 3,000 equations, rendered ${renderedExpressions}`)
})
