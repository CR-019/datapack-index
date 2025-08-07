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
} from "./sidebar_feature";
import { withMermaid } from "vitepress-plugin-mermaid";


// https://vitepress.dev/reference/site-config
export default withMermaid({
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
            "/feature/": sidebar_feature,
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/CR-019/datapack-index" },
            { icon: "bilibili", link: "https://space.bilibili.com/85292644" },
            { icon: "afdian", link: "https://afdian.com/a/CR_019" },
        ],
        logo: "/icons/dream_catcher8.png",
        footer: {
            copyright: "Copyright©2025 CR_019",
            message:
                'Powered by Vitepress and Github Pages',
        },
    },
    head: [
        ["link", { rel: "icon", href: "/datapack-index/icons/dream_catcher8.png" }],
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
        },
    },
    vite: {
        plugins: [
            nodePolyfills({
                include: ["util"],
            })
        ]
    },
})