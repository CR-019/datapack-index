function isChangelog(env) {
  const path = (env.relativePath || env.path || '').replace(/\\/g, '/')
  return (path === 'index/changelog_breaking.md' || path.endsWith('/index/changelog_breaking.md'))
    && !path.startsWith('en/') && !path.includes('/en/')
}

// Transform only this page's presentation; keep the authoring format intact.
export function useChangelog(md) {
  // Accept changing only '-' to '1.' without requiring an extra space on
  // every child line. Inspect parsed list items so code/HTML stays untouched.
  md.core.ruler.after('block', 'changelog_numbered_indentation', (state) => {
    if (!isChangelog(state.env)) return
    const expandedLines = new Set()
    state.env.changelogExpandedLines = expandedLines
    const lines = state.src.split('\n')
    let changed
    do {
      changed = false
      let inBody = false
      for (let i = 0; i < state.tokens.length; i++) {
        const token = state.tokens[i]
        if (token.type === 'heading_open' && token.tag === 'h2') {
          inBody = state.tokens[i + 1]?.content === '正文'
        }
        if (!inBody || token.type !== 'list_item_open' || token.level < 3 || !token.map) continue
        const line = token.map[0]
        const marker = /^( *)(\d+[.)]) (\S.*)$/.exec(lines[line])
        if (!marker) continue
        let next = line + 1
        while (next < token.map[1] && !lines[next].trim()) next++
        const child = /^( *)(?:[-+*]|\d+[.)])\s+/.exec(lines[next] || '')
        if (!child) continue
        const indent = marker[1].length
        if (child[1].length < indent + 2 || child[1].length >= indent + marker[2].length + 1) continue
        lines[line] = `${marker[1]}- ${marker[3]}`
        expandedLines.add(line)
        changed = true
      }
      if (changed) {
        state.src = lines.join('\n')
        state.tokens = []
        md.block.parse(state.src, md, state.env, state.tokens)
      }
    } while (changed)
  })
  md.core.ruler.push('breaking_changelog', (state) => {
    if (!isChangelog(state.env)) return

    const tokens = state.tokens
    const before = new Map()
    const after = new Map()
    const add = (map, index, html) => map.set(index, (map.get(index) || '') + html)
    let inBody = false
    let version = false
    let first = true
    let section = false
    const listStack = []
    const close = (index) => {
      if (section) add(before, index, '</section>\n')
      if (version) add(before, index, '</div></details>\n')
      section = version = false
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type === 'heading_open' && token.tag === 'h2') {
        close(i)
        inBody = tokens[i + 1]?.content === '正文'
      }
      if (!inBody) continue
      if (token.type === 'heading_open' && token.tag === 'h3') {
        close(i)
        add(before, i, `<details class="changelog-version"${first ? ' open' : ''}><summary class="changelog-version-title">`)
        add(after, i + 2, '<button type="button" class="changelog-expand" title="展开此版本的一级条目" aria-label="展开此版本的一级条目"><span class="changelog-expand-icon" aria-hidden="true"></span></button></summary><div class="changelog-version-body">\n')
        version = true
        first = false
      }
      if (!version) continue
      if (token.type === 'heading_open' && token.tag === 'h4') {
        if (section) add(before, i, '</section>\n')
        const title = tokens[i + 1]?.content || ''
        const type = title.includes('数据包') ? 'datapack' : title.includes('资源包') ? 'resourcepack' : 'mcmeta'
        add(before, i, `<section class="changelog-section changelog-${type}">\n`)
        token.attrJoin('class', 'changelog-section-title')
        section = true
      }
      if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
        listStack.push(token.type)
        if (listStack.length === 1) token.attrJoin('class', 'changelog-topics')
      } else if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') {
        listStack.pop()
      }
      if (token.type !== 'list_item_open') continue
      let end = i + 1
      while (end < tokens.length && !(tokens[end].type === 'list_item_close' && tokens[end].level === token.level)) end++
      const paragraph = tokens[i + 1]
      if (paragraph?.type !== 'paragraph_open' || tokens[i + 2]?.type !== 'inline' || tokens[i + 3]?.type !== 'paragraph_close') continue
      const hasChildren = tokens.slice(i + 4, end).some(t => (t.type === 'bullet_list_open' || t.type === 'ordered_list_open') && t.level === token.level + 1)
      const title = (tokens[i + 2].children || [])
        .filter(t => t.type === 'text' || t.type === 'code_inline')
        .map(t => t.content).join('')
      const badges = [
        { match: /重命名/, name: 'rename', icon: '♻️' },
        { match: /删除|移除/, name: 'delete', icon: '🗑️' },
        { match: /更改|修改|变更/, name: 'edit', icon: '✏️' },
        { match: /漏洞|\bbug\b/i, name: 'bug', icon: '🐛' },
      ].filter(badge => badge.match.test(title))
      const badgeClasses = badges.map(badge => ` changelog-${badge.name}`).join('')
      const icons = badges.map(badge => badge.icon).join(' ')
      if (!hasChildren) {
        if (badges.length) {
          token.attrJoin('class', `changelog-leaf${badgeClasses}`)
          token.attrSet('data-changelog-icons', icons)
          token.attrSet('style', `--changelog-icon-count: ${badges.length}`)
        }
        continue
      }
      token.attrJoin('class', 'changelog-topic')
      paragraph.hidden = tokens[i + 3].hidden = true
      const iconAttribute = badges.length ? ` data-changelog-icons="${icons}"` : ''
      // Numbered markers opt nested topics into expansion; their marker is
      // still replaced by the same disclosure arrow as an unordered topic.
      const expanded = listStack.length >= 2 && (listStack.at(-1) === 'ordered_list_open'
        || state.env.changelogExpandedLines?.has(token.map?.[0]))
      add(after, i, `<details class="changelog-item${badgeClasses}"${expanded ? ' open data-default-open' : ''}><summary${iconAttribute}><span class="changelog-item-title">`)
      add(after, i + 3, '</span></summary><div class="changelog-item-body">')
      add(before, end, '</div></details>')
    }
    close(tokens.length)
    const html = (content) => {
      const token = new state.Token('html_block', '', 0)
      token.content = content
      return token
    }
    state.tokens = tokens.flatMap((token, i) => [
      ...(before.has(i) ? [html(before.get(i))] : []), token,
      ...(after.has(i) ? [html(after.get(i))] : []),
    ])
    if (before.has(tokens.length)) state.tokens.push(html(before.get(tokens.length)))
  })
}
