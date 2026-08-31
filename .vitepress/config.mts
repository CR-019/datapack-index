import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";
import { mcfunction } from "./highlights/mcfuntion";
import { mcdoc } from "./highlights/mcdoc/mcdoc";
import { snbt } from "./highlights/snbt";
// @ts-ignore
import anchor from "markdown-it-footnote";
import { useKatex } from "./markdown/katex.mjs";
import { renderSearchIndex, splitSearchIndex } from "./markdown/search-index.mjs";
import { createShikiCache } from "./markdown/shiki-cache.mjs";

import {
    sidebar_feature,
} from "./sidebar_feature";

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
} from "./sidebar_feature2025"
// @ts-ignore
import fs from "node:fs";
// @ts-ignore
import path from "node:path";
// @ts-ignore
import type { Plugin } from "vite";

import{
    sidebar_202601,
    sidebar_202602,
    sidebar_202603,
    sidebar_202604,
    sidebar_202605,
    sidebar_202606,
    sidebar_202607,
    sidebar_202608,
}from "./sidebar_feature2026"
import { sidebar_en } from "./sidebar_en"

function htmlImagePlugin(): Plugin {
  let root = "";
  let outDir = "";
  let isBuild = false;
  const imageAssets = new Set<string>();

  return {
    name: "vitepress-html-image-handler",
    enforce: "pre",

    configResolved(config) {
      root = config.root || process.cwd();
      outDir = path.resolve(root, config.build.outDir);
    },

    config(_, { command }) {
      isBuild = command === "build";
    },

    transform(code, id) {
      if (!isBuild) return null;
      if (!id.endsWith(".md") && !id.endsWith(".vue")) return null;

      const sourceDir = path.dirname(id);

      const patterns: RegExp[] = [
        // <img src="..."> in HTML
        /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
        // Vue component props: cover="..." cover='...' cover = "..."
        /\b(?:cover|background)\s*=\s*["']([^"']+\.(?:png|jpe?g|webp|svg|gif))["']/gi,
        // :cover="'...'" (dynamic with literal string)
        /:(?:cover|background)\s*=\s*"([^"]*)"\s*['"]([^"']+\.(?:png|jpe?g|webp|svg|gif))['"]/gi,
        // bare string in :cover="..." not matching above
        /:(?:cover|background)\s*=\s*"([./][^"]+\.(?:png|jpe?g|webp|svg|gif))"/gi,
      ];

      for (const regex of patterns) {
        let match;
        while ((match = regex.exec(code)) !== null) {
          const src = match[match.length - 1]; // last capture group is the path
          if (/^https?:\/\//.test(src)) continue;
          if (src.startsWith("/")) continue;

          const resolved = path.resolve(sourceDir, src);
          if (fs.existsSync(resolved)) {
            imageAssets.add(resolved);
          }
        }
      }

      return null;
    },

    closeBundle() {
      if (!isBuild) return;
      // @ts-ignore
        for (const sourcePath of imageAssets) {
        const relativePath = path.relative(root, sourcePath).replace(/\\/g, "/");
        const destPath = path.resolve(outDir, relativePath);
        try {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(sourcePath, destPath);
        } catch {
          // skip missing files
        }
      }
    },
  };
}

const siteBase = process.env.VITEPRESS_BASE || '/datapack-index/'
const configuredBuildConcurrency = Number(process.env.VITEPRESS_BUILD_CONCURRENCY || 8)
const buildConcurrency = Number.isSafeInteger(configuredBuildConcurrency) && configuredBuildConcurrency > 0
    ? configuredBuildConcurrency
    : 8
const shikiCache = createShikiCache()



// https://vitepress.dev/reference/site-config
export default defineConfig({
    // VitePress defaults to 64 simultaneous page/search renders. Eight keeps
    // enough work in flight for CI while avoiding dozens of large page trees
    // being retained at once. Override only when benchmarking larger runners.
    buildConcurrency,
    buildEnd() {
        shikiCache.report()
    },
    locales: {
        root: {
            label: "简体中文",
            lang: "zh-CN",
            link: "/",
        },
        en: {
            label: "English",
            lang: "en-US",
            link: "/en/",
            title: "Vanilla Library",
            description: "An index of resources for vanilla Minecraft Java Edition mod development.",
            markdown: {
                container: {
                    tipLabel: "Tip",
                    infoLabel: "Info",
                    warningLabel: "Warning",
                    dangerLabel: "Danger",
                    detailsLabel: "Details",
                },
                codeCopyButton: {
                    tooltipText: "Copy code",
                    copiedText: "Copied",
                },
            },
            themeConfig: {
                nav: [
                    { text: "Documentation", link: "/en/index/绪论" },
                    { text: "Prerequisite Library", link: "/en/wheel/" },
                    { text: "Feature", link: "/en/feature/_index" },
                    { text: "Preview", link: "/en/preview/" },
                    { text: "Wiki", link: "https://minecraft.wiki/" },
                ],
                outlineTitle: "On this page",
                sidebar: sidebar_en,
                announcementBar: {
                    enabled: false,
                    content: "🎉 Vanilla Library's Mojira bugs page is now available",
                    link: siteBase + "en/index/misc/bugs",
                    linkText: "[Open]",
                    background: "#ffa05a",
                    color: "#ffffff",
                    dismissible: true,
                    doNotShowAgainText: "Dismiss",
                    storageKey: "datapack-index-announcement-202609-v1-en",
                },
                search: {
                    provider: "local",
                    options: {
                        // @ts-ignore
                        showDetailedList: true,
                        translations: {
                            button: {
                                buttonText: "Search",
                                buttonAriaLabel: "Search documentation",
                            },
                            modal: {
                                noResultsText: "No results found",
                                resetButtonTitle: "Clear search",
                                footer: {
                                    selectText: "Select",
                                    navigateText: "Navigate",
                                },
                            },
                        },
                    },
                },
                langMenuLabel: "Change language",
                docFooter: {
                    prev: "Previous page",
                    next: "Next page",
                },
                footer: {
                    copyright: "Copyright©2026 VanillaLibrary Dev",
                    message: "Powered by VitePress and GitHub Pages",
                },
            },
        },
    },
    title: "香草图书馆",
    base: siteBase,
    description: "Powered by VitePress",
    themeConfig: {
        announcementBar: {
            enabled: true,
            content: "🎉 香草图书馆Mojira漏洞页面已上线",
            link: siteBase + "index/misc/bugs",
            linkText: "【传送门】",
            background: "#ffa05a",
            color: "#ffffff",
            dismissible: true,
            doNotShowAgainText: "不再提示",
            storageKey: "datapack-index-announcement-202609-v1",
        },
        // https://vitepress.dev/reference/default-theme-config
        outlineTitle: "概览",
        outline: [2, 6],
        // VitePress 1.x only supports a boolean here. Disable corresponding-page
        // routing so untranslated pages switch to the locale home instead of a 404.
        i18nRouting: false,
        nav: [
            { text: "文档", link: "/index/绪论" },
            { text: "前置馆", link: "/wheel/" },
            { text: "《Feature》", link: "/feature/_index" },
            { text: "预览", link: "/preview/" },
            { text: "Wiki", link: "https://zh.minecraft.wiki/" },
        ],
        search: {
            provider: "local",
            options: {
                // @ts-ignore
                showDetailedList:true,
                // Build the local index from Markdown tokens instead of fully
                // rendering every page (syntax highlighting, KaTeX, and Vue
                // HTML are unnecessary for plain-text search records).
                _render: renderSearchIndex,
                miniSearch: {
                    _splitIntoSections: splitSearchIndex,
                },
                translations: {
                    button: {
                        buttonText: "搜索",
                        buttonAriaLabel: "搜索文档",
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                        },
                    },
                },
            },
        },

        sidebar: {
            // @ts-ignore
            "/index/": sidebar,
            "/resources/": sidebar,
            "/feature/archive/202504": sidebar_202504,
            "/feature/archive/202505": sidebar_202505,
            "/feature/archive/202506": sidebar_202506,
            "/feature/archive/202507": sidebar_202507,
            "/feature/archive/202508": sidebar_202508,
            "/feature/archive/202509": sidebar_202509,
            "/feature/archive/202510": sidebar_202510,
            "/feature/archive/202511": sidebar_202511,
            "/feature/archive/202512": sidebar_202512,
            "/feature/archive/202601": sidebar_202601,
            "/feature/archive/202602": sidebar_202602,
            "/feature/archive/202603": sidebar_202603,
            "/feature/archive/202604": sidebar_202604,
            "/feature/archive/202605": sidebar_202605,
            "/feature/archive/202606": sidebar_202606,
            "/feature/archive/202607": sidebar_202607,
            "/feature/archive/202608": sidebar_202608,
            "/feature/": sidebar_feature,
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/CR-019/datapack-index" },
            { icon: "bilibili", link: "https://space.bilibili.com/85292644" },
            { icon: "afdian", link: "https://afdian.com/a/CR_019" },
        ],
        logo: "/icons/bg5.png",
        footer: {
            copyright: "Copyright©2026 VanillaLibrary Dev",
            message:
                'Powered by Vitepress and Github Pages',
        },
    },
    head: [
        ["link", { rel: "icon", href: `/datapack-index/icons/bg5.png` }],
    ],
    ignoreDeadLinks: true,
    lastUpdated: false,
    srcExclude:["material",".github",".idea"],

    markdown: {
        languages: [mcfunction, mcdoc, snbt],

        shikiSetup: async (shiki) => {
            await shiki.loadLanguage(mcfunction);
            await shiki.loadLanguage(mcdoc);
            shikiCache.install(shiki);
        },

        config: (md) => {
            md.use(anchor);
            useKatex(md);

            // 自动适配硬编码的 /datapack-index/ 链接前缀：当 siteBase 变化时同步替换
            const normalizedBase = siteBase === '/' ? '/' : siteBase.replace(/\/$/, '');
            const basePrefix = normalizedBase === '/' ? '' : normalizedBase;

            md.core.ruler.push('normalize_base_links', (state) => {
                const processTokens = (tokens: any[]) => {
                    for (const token of tokens) {
                        if (token.type === 'link_open') {
                            const idx = token.attrIndex('href');
                            if (idx >= 0) {
                                const href: string = token.attrs[idx][1];
                                if (href.startsWith('/datapack-index/')) {
                                    token.attrs[idx][1] = basePrefix + href.slice('/datapack-index'.length);
                                } else if (href === '/datapack-index') {
                                    token.attrs[idx][1] = normalizedBase;
                                }
                            }
                        }
                        if (token.type === 'image') {
                            const idx = token.attrIndex('src');
                            if (idx >= 0) {
                                const src: string = token.attrs[idx][1];
                                if (src.startsWith('/datapack-index/')) {
                                    token.attrs[idx][1] = basePrefix + src.slice('/datapack-index'.length);
                                } else if (src === '/datapack-index') {
                                    token.attrs[idx][1] = normalizedBase;
                                }
                            }
                        }
                        if (token.type === 'html_inline' || token.type === 'html_block') {
                            token.content = token.content.replace(
                                /(href|src)=(["'])\/datapack-index(\/[^"']*)?\2/gi,
                                (_: string, attr: string, quote: string, rest?: string) =>
                                    `${attr}=${quote}${basePrefix}${rest || ''}${quote}`
                            );
                        }
                        if (token.children) {
                            processTokens(token.children);
                        }
                    }
                };
                processTokens(state.tokens);
            });

            // 获取默认的 image renderer
            const defaultRender = md.renderer.rules.image

            // 重写 image 渲染规则
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                // 给所有由 Markdown 语法生成的 img 添加 data-md-img 属性
                token.attrSet('data-md-img', '')
                // 调用默认渲染逻辑
                const rendered = defaultRender?.(tokens, idx, options, env, self) || ''
                return normalizeVoidMarkup(rendered)
            }

            // Raw HTML and Markdown hard breaks can also emit HTML void tags.
            // Keep those compatible with Vue's template parser as well.
            const normalizeVoidMarkup = (value: string) => value.replace(
                /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*?)?(\s*\/)?>(?:)/giu,
                (_match, tag, attrs = '', slash = '') => slash
                    ? `<${tag}${attrs}${slash}>`
                    : `<${tag}${attrs} />`
            )
            for (const ruleName of ['html_inline', 'html_block'] as const) {
                const defaultHtmlRender = md.renderer.rules[ruleName]
                md.renderer.rules[ruleName] = (tokens, idx, options, env, self) => {
                    const rendered = defaultHtmlRender
                        ? defaultHtmlRender(tokens, idx, options, env, self)
                        : tokens[idx].content
                    return normalizeVoidMarkup(rendered)
                }
            }

            const defaultHardbreakRender = md.renderer.rules.hardbreak
            md.renderer.rules.hardbreak = (tokens, idx, options, env, self) => {
                const rendered = defaultHardbreakRender?.(tokens, idx, options, env, self) || '<br>\n'
                return normalizeVoidMarkup(rendered)
            }
        },
    },
    vite: {
        // Vite's dependency optimizer relocates import.meta.url without copying
        // the playground's packaged Worker asset. Serve this ESM package in
        // place so its relative Worker URL continues to resolve from dist/.
        optimizeDeps: {
            exclude: ['@datapack-sandbox/vitepress-playground'],
        },
        define: {
            'process.env': JSON.stringify({}), // 将 process.env 替换为空对象
            'global': 'globalThis',            // 将 global 替换为 globalThis
        },
        css: {
            // 提取 CSS 到单独文件
            // 这会为所有 CSS 生成文件，但我们只关心基础样式
            // 你可能需要进一步配置 Rollup 选项来精确控制
        },
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name.endsWith('.css')) {
                            // 尝试将主要的站点样式命名为 base.css
                            // 注意：Vitepress 的 CSS 文件名可能包含 hash
                            // 你可能需要检查构建输出或使用更复杂的逻辑
                            return 'assets/base.[ext]'; // 尝试强制命名为 base.css
                        }
                        return 'assets/[name].[hash].[ext]';
                    },
                },
            },
        },
        plugins: [
            htmlImagePlugin()
        ]
    },
})
