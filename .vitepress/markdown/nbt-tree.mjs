import { parse } from '@vue/compiler-dom'

// Only merge static legacy tags. Keep directives and attributes on icon-only
// nodes untouched rather than discarding their individual behavior.
function attributes(source) {
  const result = new Map()
  const pattern = /\s+([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/gy
  let offset = 0
  while (offset < source.length) {
    if (!source.slice(offset).trim()) break
    pattern.lastIndex = offset
    const match = pattern.exec(source)
    if (!match || result.has(match[1])) return null
    const raw = match[2]
    result.set(match[1], {
      value: raw?.replace(/^(["'])([\s\S]*)\1$/, '$2') ?? '',
      start: match.index,
      end: pattern.lastIndex,
    })
    offset = pattern.lastIndex
  }
  return result
}

function legacyNode(token) {
  if (token?.type !== 'html_inline') return null
  const match = /^<node(\s[\s\S]*?)\s*\/>$/.exec(token.content)
  if (!match) return null
  const attrs = attributes(match[1])
  const type = attrs?.get('type')
  if (!type || !/^[a-zA-Z_ ]+$/.test(type.value)) return null
  const allowed = ['type', 'name', 'required', 'store', 'colon', ':required', ':store', ':colon']
  if ([...attrs.keys()].some(key => !allowed.includes(key))) return null
  const name = attrs.get('name')?.value.trim() ?? ''
  if (!name && [...attrs.keys()].some(key => key !== 'type' && key !== 'name')) return null
  return { attrs, source: match[1], type: type.value, name }
}

// Transform the rendered Vue template, independent of the Markdown engine.
// Edit source ranges instead of serializing HTML: preserve Vue bindings and spelling.
export function transformNbtTree(html) {
  if (!html.includes('nbttree')) return html
  let ast
  const errors = []
  try {
    ast = parse(html, { onError: error => errors.push(error) })
  } catch {
    return html
  }
  // Preview recovers from malformed HTML elsewhere in an article. Do not let
  // an unrelated diagnostic disable every valid NBT group in that article.
  const edits = []
  const asLegacy = node => node?.type === 1 && node.tag === 'node'
    ? legacyNode({ type: 'html_inline', content: node.loc.source }) : null
  const visit = (parent, inTree = false) => {
    if (parent.type === 1) {
      const opening = parent.loc.source.match(/^<(?:(?:"[^"]*"|'[^']*')|[^'">])*>/)?.[0] || ''
      if (['pre', 'code', 'script', 'style'].includes(parent.tag) || /\sv-pre(?:[\s=>/])/.test(opening)) return
      const isTree = parent.tag === 'div' && parent.props.some(prop =>
        prop.type === 6 && prop.name === 'class' && prop.value?.content.split(/\s+/).includes('nbttree'))
      if (isTree && errors.some(error => error.loc?.start.offset === parent.loc.start.offset)) return
      inTree ||= isTree
    }
    const children = parent.children || []
    if (inTree) {
      for (let i = 0; i < children.length; i++) {
        const first = asLegacy(children[i])
        if (!first || first.name) continue
        const types = [first.type]
        let end = children[i].loc.end.offset
        for (let j = i + 1; j < children.length; j++) {
          const child = children[j]
          if (child.type === 2 && /^[\t ]*$/.test(child.loc.source)) continue
          if (!/^[\t ]*$/.test(html.slice(end, child.loc.start.offset))) break
          const next = asLegacy(child)
          if (!next) break
          types.push(next.type)
          end = child.loc.end.offset
          if (!next.name) continue
          if (errors.some(error => error.loc && error.loc.start.offset >= children[i].loc.start.offset &&
              error.loc.start.offset < end)) break
          const typeAttr = next.attrs.get('type')
          const binding = JSON.stringify(types).replaceAll('"', '&quot;')
          const replacement = '<node' + next.source.slice(0, typeAttr.start) + ' :type="' + binding + '"' + next.source.slice(typeAttr.end) + ' />'
          edits.push({ start: children[i].loc.start.offset, end, replacement })
          i = j
          break
        }
      }
    }
    for (const child of children) visit(child, inTree)
  }
  visit(ast)
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    html = html.slice(0, edit.start) + edit.replacement + html.slice(edit.end)
  }
  return html
}

export function useNbtTree(md) {
  const renderInline = md.renderer.rules.html_inline
  md.renderer.rules.html_inline = function (tokens, index, ...args) {
    const token = tokens[index]
    let nextIndex = index + 1
    while (tokens[nextIndex]?.type === 'inline' && !tokens[nextIndex].content) nextIndex++
    const next = tokens[nextIndex]
    const html = renderInline ? renderInline.call(this, tokens, index, ...args) : token.content
    // VitePress drops the source newline after a standalone component token.
    // Preserve that boundary so both engines agree about adjacent node groups.
    return token.block && token.map && next?.map && next.map[0] > token.map[0] &&
      legacyNode(token) && ['inline', 'html_inline'].includes(next.type) ? html + '\n' : html
  }
  const render = md.renderer.render
  md.renderer.render = function (...args) {
    return transformNbtTree(render.apply(this, args))
  }
}
