import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'
import { sidebar as sourceSidebar } from './sidebar'
import { sidebar_feature as sourceFeatureSidebar } from './sidebar_feature'
import {
  sidebar_202504,
  sidebar_202505,
  sidebar_202506,
  sidebar_202507,
  sidebar_202508,
  sidebar_202509,
  sidebar_202510,
  sidebar_202511,
  sidebar_202512,
} from './sidebar_feature2025'
import {
  sidebar_202601,
  sidebar_202602,
  sidebar_202603,
  sidebar_202604,
  sidebar_202605,
  sidebar_202606,
  sidebar_202607,
} from './sidebar_feature2026'

const root = process.cwd()

const groupLabels: Record<string, string> = {
  '香草图书馆': 'Vanilla Library',
  '快速开始': 'Getting Started',
  '月刊《Feature》': 'Feature Monthly',
  '数据包体系结构': 'Data Pack Architecture',
  '命令/函数': 'Commands / Functions',
  '数据包组分': 'Data Pack Components',
  '世界生成': 'World Generation',
  '资源包体系结构': 'Resource Pack Architecture',
  '破坏性技术更新日志': 'Breaking Technical Changelog',
  '原版模组实践': 'Vanilla Mod Practice',
  '参考与友链': 'References and Links',
  '附录': 'Appendices',
  '服务台': 'Help Desk',
  '最新': 'Latest',
  '往期': 'Previous Issues',
  '更早': 'Earlier Issues',
  'Feature 2025': 'Feature 2025',
  'Feature 2026': 'Feature 2026',
  '封面文章 Featured': 'Featured',
  '专题 Featured': 'Featured',
  '精选 Featured': 'Featured',
  '特别企划': 'Special Project',
  '封二': 'Inside Front Cover',
  '洞见 Insights': 'Insights',
  '香草快讯 Λojang Spotlight': 'Vanilla Spotlight',
  '香草快讯 Mojang Spotlight': 'Vanilla Spotlight',
  '香草快讯 ojang Spotlight': 'Vanilla Spotlight',
  '巧匠 Masterpieces': 'Masterpieces',
}

const itemLabels: Record<string, string> = {
  '目录': 'Contents',
  '创刊寄语': 'Founding Message',
  '上一刊': 'Previous Issue',
  '下一刊': 'Next Issue',
  '《Feature》主页': 'Feature Home',
  '月刊条款': 'Monthly Terms',
  '格式指导': 'Formatting Guide',
  '返回主站': 'Back to Main Site',
  '🏠绝赞征稿中！': '🏠 Submissions Open!',
  '🌟2026.07': '🌟 2026.07',
}

function prefixLink(link: string | undefined) {
  if (!link || link.startsWith('http://') || link.startsWith('https://')) return link
  const hashIndex = link.indexOf('#')
  const pathname = hashIndex < 0 ? link : link.slice(0, hashIndex)
  const suffix = hashIndex < 0 ? '' : link.slice(hashIndex)
  if (pathname === '/en' || pathname.startsWith('/en/')) return link
  if (/^\/(?:index|feature|wheel|resources|preview)(?:\/|$)/.test(pathname)) {
    return `/en${pathname}${suffix}`
  }
  return link
}

function pageSourcePath(link: string) {
  const withoutPrefix = link.replace(/^\/en\//, '').replace(/^\//, '').split('#')[0]
  const fileCandidate = path.join(root, 'en', `${withoutPrefix.replace(/\/$/, '')}.md`)
  if (fs.existsSync(fileCandidate)) return fileCandidate
  const indexCandidate = path.join(root, 'en', `${withoutPrefix.replace(/\/$/, '')}/index.md`)
  return indexCandidate
}

function englishPageTitle(link: string | undefined) {
  if (!link) return undefined
  const filePath = pageSourcePath(prefixLink(link) || link)
  if (!fs.existsSync(filePath)) return undefined
  const content = fs.readFileSync(filePath, 'utf8')
  const frontmatterTitle = content.match(/^title:\s*["']?(.+?)["']?\s*$/mu)?.[1]
  const componentTitle = content.match(/\btitle\s*=\s*["']([^"']+)["']/u)?.[1]
  const heading = content.match(/^#\s+(.+)$/mu)?.[1]
  return (frontmatterTitle || componentTitle || heading)
    ?.replace(/[*_`]/g, '')
    .trim()
}

function translateLabel(text: string | undefined, link?: string) {
  if (!text) return text
  if (itemLabels[text]) return itemLabels[text]
  if (groupLabels[text]) return groupLabels[text]
  const pageTitle = englishPageTitle(link)
  if (pageTitle && !/[\u3400-\u9fff]/u.test(pageTitle)) return pageTitle
  return text
}

function translateSidebar(items: DefaultTheme.Sidebar): DefaultTheme.Sidebar {
  return items.map((item) => {
    if (typeof item === 'string') return item
    return {
      ...item,
      link: prefixLink(item.link),
      text: translateLabel(item.text, item.link),
      items: item.items ? translateSidebar(item.items) : undefined,
    }
  })
}

const sourceArchiveSidebars = {
  202504: sidebar_202504,
  202505: sidebar_202505,
  202506: sidebar_202506,
  202507: sidebar_202507,
  202508: sidebar_202508,
  202509: sidebar_202509,
  202510: sidebar_202510,
  202511: sidebar_202511,
  202512: sidebar_202512,
  202601: sidebar_202601,
  202602: sidebar_202602,
  202603: sidebar_202603,
  202604: sidebar_202604,
  202605: sidebar_202605,
  202606: sidebar_202606,
  202607: sidebar_202607,
} as const

export const sidebar_en: DefaultTheme.SidebarMulti = {
  '/en/index/': translateSidebar(sourceSidebar),
  '/en/resources/': translateSidebar(sourceSidebar),
  '/en/feature/': translateSidebar(sourceFeatureSidebar),
  ...Object.fromEntries(
    Object.entries(sourceArchiveSidebars).map(([month, sidebar]) => [
      `/en/feature/archive/${month}/`,
      translateSidebar(sidebar),
    ]),
  ),
}
