import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import MarkdownIt from 'markdown-it'
import { baseParse } from '@vue/compiler-dom'
import { useChangelog } from '../.vitepress/markdown/changelog.mjs'

const env = { relativePath: 'index/changelog_breaking.md' }
const md = new MarkdownIt({ html: true }).use(useChangelog)
test('bug badges match whole English words without flagging identifiers', () => {
  const renderItem = text => md.render(`## 正文\n### **26.3**\n- ${text}\n`, { ...env })
  for (const text of ['修复Bug。', '修复 BUG', '修复 bug', '修复漏洞']) {
    assert.match(renderItem(text), /data-changelog-icons="🐛"/)
  }
  for (const text of ['`debug_settings`', '`debug`', '`bug_settings`', 'debugging']) {
    assert.doesNotMatch(renderItem(text), /🐛|changelog-bug/)
  }
  assert.match(renderItem('移除了`debug_settings`字段。'), /data-changelog-icons="🗑️"/)
})
const sample = `## 前言
- 普通列表
  - 保留
## 正文
### **26.3**
#### 数据包：
- 物品修饰器
  - **变化**与<NbtIcon type="string" />字段
  - 世界生成
    - 内层内容
- 独立更新
### **26.2**
#### pack.mcmeta
- 格式
  - 使用\`pack_format\`
## 结尾
- 普通结尾
`

test('versions and nested topics collapse while prose and other pages stay intact', () => {
  const html = md.render(sample, { ...env })
  assert.equal((html.match(/class="changelog-version" open/g) || []).length, 1)
  assert.equal((html.match(/class="changelog-version"/g) || []).length, 2)
  assert.equal((html.match(/<details class="changelog-item">/g) || []).length, 3)
  assert.doesNotMatch(html, /changelog-item" open/)
  assert.match(html, /changelog-mcmeta/)
  assert.match(html, /<strong>变化<\/strong>与<NbtIcon type="string" \/>字段/)
  assert.match(html, /<li>独立更新<\/li>/)
  assert.ok(html.indexOf('</details>\n<h2>结尾') > 0)
  assert.doesNotThrow(() => baseParse(html))
  assert.equal(md.render(sample, { relativePath: 'index/other.md' }), new MarkdownIt({ html: true }).render(sample))
  assert.equal(md.render(sample, { relativePath: 'en/index/changelog_breaking.md' }), new MarkdownIt({ html: true }).render(sample))
})

test('entire existing changelog retains every inline, code and HTML content token', async () => {
  const source = await readFile(new URL('../index/changelog_breaking.md', import.meta.url), 'utf8')
  const original = new MarkdownIt({ html: true }).parse(source, {})
  const transformed = md.parse(source, { ...env })
  const content = tokens => tokens.filter(t => ['inline', 'fence', 'code_block', 'html_inline'].includes(t.type)).map(t => [t.type, t.content])
  assert.deepEqual(content(transformed), content(original))
  const html = md.renderer.render(transformed, md.options, env)
  assert.equal((html.match(/class="changelog-version"/g) || []).length, (source.match(/^### /gm) || []).length)
  assert.equal((html.match(/class="changelog-version" open/g) || []).length, 1)
  assert.doesNotThrow(() => baseParse(html))
})

test('VitePress rendering preserves heading anchors and valid Vue markup', async () => {
  const { createMarkdownRenderer } = await import('vitepress')
  const renderer = await createMarkdownRenderer(process.cwd(), { config: md => md.use(useChangelog) })
  const html = renderer.render(sample, { ...env })
  assert.match(html, /class="changelog-version" open/)
  assert.match(html, /id="_26-2"/)
  assert.doesNotThrow(() => baseParse(html))
})
