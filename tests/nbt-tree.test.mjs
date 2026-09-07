import assert from 'node:assert/strict'
import test from 'node:test'
import { useNbtTree } from '../.vitepress/markdown/nbt-tree.mjs'

const html = content => ({ type: 'html_inline', content })
const text = content => ({ type: 'text', content })
const block = content => ({ type: 'html_block', content })
const inline = children => ({ type: 'inline', children })
const tag = (type, name = '', extra = '') => html(`<node type="${type}" name="${name}"${extra}/>`)
function run(tokens) {
  let transform
  useNbtTree({ core: { ruler: { push(name, fn) { transform = fn } } } })
  transform({ tokens })
  return tokens
}
function tree(children) {
  run([block('<div class="nbttree">'), inline(children), block('</div>')])
  return children
}
const joined = tokens => tokens.map(token => token.content).join('')

test('legacy union becomes one node, retaining the final field attributes and prose', () => {
  const children = tree([
    tag('float'), tag('list'), tag('compound', 'continentalness', ' required store :colon="false"'),
    text('放置所需的大陆性。'),
  ])
  assert.equal(children.length, 2)
  assert.equal(children[0].content, '<node :type="[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;]" name="continentalness" required store :colon="false" />')
  assert.equal(children[1].content, '放置所需的大陆性。')
})

test('accepts spaces, quote variants, omitted names, array aliases and reordered attributes', () => {
  const children = tree([
    html("<node type='byte_list'/>"), text(' \t'), tag('int_list'),
    html("<node name='a&amp;b' :required='needed' type='long_list' :store='stored'/>"),
  ])
  assert.equal(children.length, 1)
  assert.match(children[0].content, /name='a&amp;b' :required='needed' :type="\[&quot;byte_list&quot;,&quot;int_list&quot;,&quot;long_list&quot;\]" :store='stored'/)
})

test('stops at prose, line breaks, code, other markup and separate fields', () => {
  for (const separator of [text('描述'), { type: 'softbreak', content: '' }, { type: 'code_inline', content: '<node/>' }, html('<br/>'), tag('int', 'another')]) {
    const children = [tag('float'), separator, tag('compound', 'field')]
    const before = joined(children)
    tree(children)
    if (separator.type === 'html_inline' && separator.content.includes('another')) {
      assert.equal(children.length, 2)
      assert.match(children[0].content, /name="another"/)
      assert.equal(children[1].content, '<node type="compound" name="field"/>')
    } else assert.equal(joined(children), before)
  }
})

test('leaves standalone, all-unnamed, dynamic and individually annotated nodes intact', () => {
  for (const children of [
    [tag('int', 'field')], [tag('float'), tag('list')],
    [tag('float', '', ' required'), tag('compound', 'field')],
    [html('<node :type="kind"/>'), tag('compound', 'field')],
    [tag('float'), html('<node type="compound" :name="field"/>')],
    [tag('float'), tag('compound', 'field', ' v-if="visible"')],
    [tag('float'), tag('compound', 'field', ' class="special"')],
  ]) {
    const before = joined(children)
    tree(children)
    assert.equal(joined(children), before)
  }
})

test('only transforms tree content, including nested divs, and ignores code examples', () => {
  const pair = () => [tag('float'), tag('compound', 'field')]
  const outside = pair(), inside = pair(), nested = pair(), afterNested = pair(), after = pair()
  const code = { type: 'fence', content: '<div class="nbttree">\n<node type="float"/>' }
  run([
    code, inline(outside), block('<!-- <div class="nbttree"> -->'),
    block('<div class="extra nbttree">'), inline(inside),
    block('<div class="nested">'), inline(nested), block('</div>'), inline(afterNested),
    block('</div>'), inline(after),
  ])
  assert.equal(outside.length, 2)
  assert.equal(after.length, 2)
  for (const children of [inside, nested, afterNested]) assert.equal(children.length, 1)
  assert.equal(code.content, '<div class="nbttree">\n<node type="float"/>')
})

test('handles multiple groups, unquoted class and inline div boundaries', () => {
  const children = [html('<div class=nbttree>'), tag('float'), tag('compound', 'a'), text('说明'), tag('int'), tag('list', 'b'), html('</div>'), tag('float'), tag('list', 'outside')]
  run([inline(children)])
  assert.equal(children.filter(token => token.content.includes(':type=')).length, 2)
  assert.equal(children.at(-2).content, '<node type="float" name=""/>')
})
