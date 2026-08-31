import assert from 'node:assert/strict'
import test from 'node:test'

import MarkdownIt from 'markdown-it'

import { renderSearchIndex, splitSearchIndex } from '../.vitepress/markdown/search-index.mjs'

function createRenderer() {
  const md = new MarkdownIt()
  md.core.ruler.push('test-heading-ids', (state) => {
    let heading = 0
    for (const token of state.tokens) {
      if (token.type === 'heading_open') token.attrSet('id', `heading-${++heading}`)
    }
  })
  return md
}

test('builds hierarchical search sections without rendering page HTML', () => {
  const md = createRenderer()
  md.renderer.rules.fence = () => {
    throw new Error('search indexing must not invoke renderer rules')
  }

  const source = [
    '# Page title',
    '',
    'Intro paragraph.',
    '',
    '## Details',
    '',
    'Formula `$x < 2$`, vector $<a,b>$, and `inline code`.',
    '',
    '```mcfunction',
    'say searchable code',
    '```',
  ].join('\n')
  const serialized = renderSearchIndex(source, {}, md)
  const sections = splitSearchIndex('page.md', serialized)

  assert.deepEqual(sections, [
    {
      anchor: 'heading-1',
      text: 'Intro paragraph.',
      titles: ['Page title'],
    },
    {
      anchor: 'heading-2',
      text: 'Formula $x < 2$, vector $<a,b>$, and inline code. say searchable code',
      titles: ['Page title', 'Details'],
    },
  ])
})

test('honors search: false frontmatter populated by Markdown plugins', () => {
  const md = createRenderer()
  md.core.ruler.push('test-frontmatter', (state) => {
    state.env.frontmatter = { search: false }
  })

  assert.equal(renderSearchIndex('# Hidden\n\nSecret', {}, md), '[]')
})
