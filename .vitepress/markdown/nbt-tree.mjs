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

export function useNbtTree(md) {
  md.core.ruler.push('nbt_tree_groups', state => {
    const divs = []
    const trackDivs = html => {
      // HTML comments cannot open or close a tree.
      for (const match of html.matchAll(/<!--[\s\S]*?-->|<\/div\s*>|<div\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)) {
        if (match[0].startsWith('<!--')) continue
        if (/^<\//.test(match[0])) divs.pop()
        else {
          const classes = attributes(match[1])?.get('class')?.value ?? ''
          divs.push(divs.at(-1) === true || classes.split(/\s+/).includes('nbttree'))
        }
      }
    }
    for (const [blockIndex, block] of state.tokens.entries()) {
      if (block.type === 'html_block' || block.type === 'html_inline') trackDivs(block.content)
      if (block.type !== 'inline' || !block.children) continue
      const tokens = block.children
      // VitePress extracts a component at the beginning of a list row into
      // a top-level html_inline token. Rejoin only the same source line and
      // nesting level; never merge across paragraphs or list items.
      if (divs.at(-1)) {
        const previous = state.tokens[blockIndex - 1]
        const leading = legacyNode(previous)
        if (leading && !leading.name && previous.level === block.level &&
            previous.map && block.map && previous.map[0] === block.map[0]) {
          tokens.unshift({ ...previous, block: false, map: null })
          previous.content = ''
        }
      }
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'html_inline') trackDivs(tokens[i].content)
        if (!divs.at(-1)) continue
        const first = legacyNode(tokens[i])
        if (!first || first.name) continue
        const types = [first.type]
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === 'text' && /^[\t ]*$/.test(tokens[j].content)) continue
          const next = legacyNode(tokens[j])
          if (!next) break
          types.push(next.type)
          if (!next.name) continue
          const typeAttr = next.attrs.get('type')
          const binding = JSON.stringify(types).replaceAll('"', '&quot;')
          tokens[j].content = `<node${next.source.slice(0, typeAttr.start)} :type="${binding}"${next.source.slice(typeAttr.end)} />`
          tokens.splice(i, j - i)
          break
        }
      }
    }
  })
}
