import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { Marked } from 'marked'
import { compile, parse } from '@vue/compiler-dom'
import { createMarkdownRenderer } from 'vitepress'
import { transformNbtTree, useNbtTree } from '../.vitepress/markdown/nbt-tree.mjs'

const marked = new Marked({ gfm: true, breaks: false })
const site = await createMarkdownRenderer(process.cwd(), { config(md) { useNbtTree(md) } }, '/')
// Exercise the actual entry point used by both full and partial previews.
const source = readFileSync(new URL('../.vitepress/vue/MarkdownPreviewer.vue', import.meta.url), 'utf8')
const body = source.match(/function renderPreviewHtml\(markdown, highlighter\) \{([\s\S]*?)\n\}/)[1]
const preview = new Function('renderMarkdown', 'rewriteTemplateUrls', 'transformNbtTree', 'createRenderError', 't',
  `return function(markdown, highlighter) {${body}}`)(
  markdown => marked.parse(markdown), html => html, transformNbtTree, (_stage, error) => error, text => text,
)
function nodes(html) {
  const result = []
  const visit = node => {
    if (node.type === 1 && node.tag === 'node') result.push(node.loc.source)
    for (const child of node.children || []) visit(child)
  }
  visit(parse(html, { onError() {} }))
  return result
}

test('actual preview entry and VitePress agree on nested NBT unions and compile successfully', () => {
  const input = `<div class="nbttree">

<node type="list" name="biomes"/>生物群系源
- <node type="compound" name="parameters"/>条件。
  - <node type="float"/><node type="list"/><node type="compound" name="continentalness" required store :colon="false"/>大陆性。
  - <node type="byte_list"/> <node type="int_list"/><node type="long_list" name="arrays"/>数组。

</div>`
  const html = preview(input)
  assert.deepEqual(nodes(html), nodes(site.render(input)))
  assert.equal(nodes(html).length, 4)
  assert.match(html, /\[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;\]/)
  assert.match(html, /required store :colon="false"/)
  assert.doesNotThrow(() => compile(html, { mode: 'function' }))
})

test('preview leaves code examples, unrelated components and separate lines intact', () => {
  for (const body of [
    '- <node type="float"/>\n  <node type="compound" name="other"/>',
    '- <node type="float"/>\n- <node type="compound" name="other"/>',
    '- <node type="float"/>正文<node type="compound" name="other"/>',
    '```html\n<node type="float"/><node type="compound" name="other"/>\n```',
  ]) {
    const input = `<div class="nbttree">\n\n${body}\n\n</div>`
    assert.doesNotMatch(preview(input), /:type=/)
    assert.doesNotMatch(site.render(input), /:type=/)
  }
  assert.doesNotMatch(preview('<node type="float"/><node type="compound" name="outside"/>'), /:type=/)
})

test('partial preview entry applies the same transform and tolerates incomplete input', () => {
  const chunk = '<div class="nbttree">\n\n- <node type="float"/><node type="list" name="field"/>\n\n</div>'
  assert.match(preview(chunk), /:type=/)
  assert.doesNotThrow(() => preview('<div class="nbttree">\n\n<node type="float"/>'))
})

test('recoverable HTML errors elsewhere do not disable valid tree groups', () => {
  const tree = '<div class="nbttree">\n\n- <node type="float"/><node type="list"/><node type="compound" name="field"/>说明\n\n</div>'
  for (const input of ['</section>\n\n' + tree, tree + '\n\n<section>未闭合']) {
    const html = preview(input)
    assert.match(html, /:type="\[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;\]"/)
  }
})

test('whole biomes article still merges all six multi-icon fields in preview', () => {
  const article = readFileSync(new URL('../feature/archive/202608/3/content.md', import.meta.url), 'utf8')
  const html = preview(article)
  for (const name of ['continentalness', 'depth', 'erosion', 'humidity', 'temperature', 'weirdness']) {
    const field = nodes(html).find(node => node.includes(`name="${name}"`))
    assert.ok(field, name)
    assert.match(field, /:type="\[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;\]"/, name)
  }
})
