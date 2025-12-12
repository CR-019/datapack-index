import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";
import { mcfunction } from "./highlights/mcfuntion";
import { mcdoc } from "./highlights/mcdoc/mcdoc";
import { snbt } from "./highlights/snbt";
import anchor from "markdown-it-footnote";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import {
    sidebar_feature,
    sidebar_202504,
    sidebar_202505,
    sidebar_202506,
    sidebar_202507,
    sidebar_202508,
    sidebar_202509,
    sidebar_202510,
    sidebar_202511,
} from "./sidebar_feature";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "香草图书馆",
    base: "/datapack-index/",
    description: "Powered by VitePress",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        outlineTitle: "概览",
        outline: [2, 6],
        nav: [
            { text: "文档", link: "/index/绪论" },
            { text: "《Feature》", link: "/feature/_index" },
            { text: "Wiki", link: "https://zh.minecraft.wiki/" },
        ],
        search: {
            provider: "local",
            options: {
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
            "/feature/": sidebar_feature,
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/CR-019/datapack-index" },
            { icon: "bilibili", link: "https://space.bilibili.com/85292644" },
            { icon: "afdian", link: "https://afdian.com/a/CR_019" },
        ],
        logo: "/icons/dream_catcher10.png",
        footer: {
            copyright: "Copyright©2025 CR_019",
            message:
                'Powered by Vitepress and Github Pages',
        },
    },
    head: [
        ["link", { rel: "icon", href: "/datapack-index/icons/dream_catcher10.png" }],
    ],
    ignoreDeadLinks: true,
    lastUpdated: false,

    markdown: {
        languages: [mcfunction, mcdoc, snbt],
        math: true,

        shikiSetup: async (shiki) => {
            await shiki.loadLanguage(mcfunction);
            await shiki.loadLanguage(mcdoc);
        },

        config: (md) => {
            md.use(anchor);
            // 获取默认的 image renderer
            const defaultRender = md.renderer.rules.image

            // 重写 image 渲染规则
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                // 给所有由 Markdown 语法生成的 img 添加 data-md-img 属性
                token.attrSet('data-md-img', '')
                // 调用默认渲染逻辑
                return defaultRender?.(tokens, idx, options, env, self) || ''
            }
        },
    },
    vite: {
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
            nodePolyfills({
                include: ["util"],
            })
        ]
    },
})