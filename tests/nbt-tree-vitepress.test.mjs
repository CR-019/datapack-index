import assert from 'node:assert/strict'
import test from 'node:test'
import { createMarkdownRenderer } from 'vitepress'
import { useNbtTree } from '../.vitepress/markdown/nbt-tree.mjs'

const md = await createMarkdownRenderer(process.cwd(), {
  config(md) { useNbtTree(md) },
}, '/')

test('VitePress list-leading component joins every icon in the field', () => {
  const source = `<div class="nbttree">

<node type="list" name="biomes"/>生物群系源
- <node type="compound" name=""/>一个生物群系。
  - <node type="compound" name="parameters"/>放置条件。
    - <node type="float" name=""/><node type="list" name=""/><node type="compound" name="continentalness" required store :colon="false"/>大陆性。
    - <node type="float" name=""/><node type="list" name=""/><node type="compound" name="depth"/>深度。
</div>`
  const rendered = md.render(source)
  const union = ':type="[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;]"'
  assert.equal(rendered.split(union).length - 1, 2)
  assert.doesNotMatch(rendered, /<node type="float"/)
  assert.match(rendered, /name="continentalness" required store :colon="false"/)
  assert.match(rendered, /name="biomes"/)
  assert.match(rendered, /name="parameters"/)
})

test('VitePress does not join different rows, line breaks, prose or code samples', () => {
  for (const body of [
    '- <node type="float"/>\n- <node type="compound" name="other"/>',
    '- <node type="float"/>\n  <node type="compound" name="other"/>',
    '- <node type="float"/>描述<node type="compound" name="other"/>',
    '```html\n<node type="float"/><node type="compound" name="other"/>\n```',
  ]) {
    assert.doesNotMatch(md.render(`<div class="nbttree">\n\n${body}\n\n</div>`), /:type=/)
  }
  assert.doesNotMatch(md.render('- <node type="float"/><node type="compound" name="outside"/>'), /:type=/)
})
