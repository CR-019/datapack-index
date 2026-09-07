import assert from 'node:assert/strict'
import test from 'node:test'
import { transformNbtTree } from '../.vitepress/markdown/nbt-tree.mjs'

const tag = (type, name = '', extra = '') => `<node type="${type}" name="${name}"${extra}/>`
const tree = content => `<div class="nbttree">${content}</div>`
const transform = content => transformNbtTree(tree(content))

test('merges all icons and preserves the terminal field attributes and prose', () => {
  const result = transform(tag('float') + tag('list') + tag('compound', 'continentalness', ' required store :colon="false"') + '大陆性。')
  assert.equal(result, tree('<node :type="[&quot;float&quot;,&quot;list&quot;,&quot;compound&quot;]" name="continentalness" required store :colon="false" />大陆性。'))
})

test('preserves quote variants, entities, aliases and bound indicators', () => {
  const result = transform("<node type='byte_list'/> \t" + tag('int_list') + "<node name='a&amp;b' :required='needed' type='long_list' :store='stored'/>")
  assert.equal((result.match(/<node /g) || []).length, 1)
  assert.match(result, /name='a&amp;b' :required='needed' :type="\[&quot;byte_list&quot;,&quot;int_list&quot;,&quot;long_list&quot;\]" :store='stored'/)
})

test('does not cross prose, newlines, elements, comments or list items', () => {
  for (const separator of ['描述', '\n', '<br/>', '<!-- comment -->', '</li><li>']) {
    const input = tree('<ul><li>' + tag('float') + separator + tag('compound', 'field') + '</li></ul>')
    assert.equal(transformNbtTree(input), input)
  }
})

test('keeps standalone, unnamed, dynamic and independently annotated nodes', () => {
  for (const input of [
    tag('int', 'field'), tag('float') + tag('list'),
    tag('float', '', ' required') + tag('compound', 'field'),
    '<node :type="kind"/>' + tag('compound', 'field'),
    tag('float') + '<node type="compound" :name="field"/>',
    tag('float') + tag('compound', 'field', ' v-if="visible"'),
    tag('float') + tag('compound', 'field', ' class="special"'),
  ]) assert.equal(transform(input), tree(input))
})

test('only merges tree nodes; ignores code and v-pre and handles nested divs', () => {
  const pair = tag('float') + tag('compound', 'field')
  const outside = pair + '<!-- <div class="nbttree"> -->' + pair
  assert.equal(transformNbtTree(outside), outside)
  for (const wrapper of ['pre', 'code', 'div v-pre']) {
    const input = tree(`<${wrapper}>${pair}</${wrapper.split(' ')[0]}>`)
    assert.equal(transformNbtTree(input), input)
  }
  const result = transformNbtTree(`<div class='extra nbttree'><div>${pair}</div>${pair}</div>${pair}`)
  assert.equal((result.match(/:type=/g) || []).length, 2)
  assert.ok(result.endsWith(pair))
})

test('supports multiple groups and is idempotent; leaves malformed templates to preview recovery', () => {
  const input = `<div class=nbttree>${tag('float')}${tag('compound', 'a')}说明${tag('int')}${tag('list', 'b')}</div>`
  const result = transformNbtTree(input)
  assert.equal((result.match(/:type=/g) || []).length, 2)
  assert.equal(transformNbtTree(result), result)
  const broken = '<div class="nbttree">' + tag('float') + tag('list', 'field')
  assert.equal(transformNbtTree(broken), broken)
})
