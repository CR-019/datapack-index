const contentTokenTypes = new Set([
  'code_block',
  'code_inline',
  'fence',
  'html_block',
  'html_inline',
  'math_block',
  'math_inline',
  'text',
])
const htmlTokenTypes = new Set(['html_block', 'html_inline'])

function tokenContent(token) {
  return htmlTokenTypes.has(token.type)
    ? token.content.replace(/<[^>]*>/g, ' ')
    : token.content
}

function normalizeSearchText(value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?，。；：！？])/g, '$1')
    .trim()
}

function textFromTokens(tokens = []) {
  const parts = []

  for (const token of tokens) {
    if (token.children?.length) {
      parts.push(textFromTokens(token.children))
    } else if (contentTokenTypes.has(token.type)) {
      parts.push(tokenContent(token))
    }
  }

  return normalizeSearchText(parts.join(' '))
}

/**
 * Produce compact search records without invoking Markdown renderer rules.
 * The latter perform syntax highlighting and math-to-HTML conversion and are
 * useful for pages, but wasteful when MiniSearch ultimately strips all tags.
 *
 * @param {string} source
 * @param {Record<string, any>} env
 * @param {import('markdown-it')} md
 */
export function renderSearchIndex(source, env, md) {
  const tokens = md.parse(source, env)
  if (env.frontmatter?.search === false) return '[]'

  const sections = []
  const parentTitles = []
  let currentSection

  const finishSection = () => {
    if (!currentSection) return
    currentSection.text = normalizeSearchText(currentSection.parts.join(' '))
    delete currentSection.parts
    sections.push(currentSection)
  }

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]

    if (token.type === 'heading_open') {
      finishSection()

      const level = Number(token.tag.slice(1)) - 1
      const inline = tokens[index + 1]
      const title = textFromTokens(inline?.children).trim()
      const titles = parentTitles.slice(0, level)
      titles[level] = title

      if (level === 0) {
        parentTitles.splice(0, parentTitles.length, title)
      } else {
        parentTitles[level] = title
      }

      currentSection = {
        anchor: token.attrGet('id') || '',
        parts: [],
        titles: titles.filter(Boolean),
      }
      index += 1
      continue
    }

    if (!currentSection) continue

    if (token.type === 'inline') {
      const text = textFromTokens(token.children)
      if (text) currentSection.parts.push(text)
    } else if (contentTokenTypes.has(token.type)) {
      const text = normalizeSearchText(tokenContent(token))
      if (text) currentSection.parts.push(text)
    }
  }

  finishSection()
  return JSON.stringify(sections)
}

/**
 * @param {string} _file
 * @param {string} serializedSections
 */
export function splitSearchIndex(_file, serializedSections) {
  return JSON.parse(serializedSections)
}
