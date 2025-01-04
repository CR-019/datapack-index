import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { mcfunction } from './highlight'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "香草图书馆",
  base:"/datapack-index/",
  description: "Powered by VitePress",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outlineTitle:"概览",
    outline:[2,6],
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/index/绪论' },
      { text: 'Wiki', link: 'https://zh.minecraft.wiki/' }
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换"
            }
          }
        }
      }
    },

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CR-019/datapack-index' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/85292644' }
    ],
    logo:'/dream_catcher1.png',
    footer:{
      copyright:"Copyright©2024 CR_019",
      message:"<a href=\"https://mcicp.com\" title=\"MCICP备2024000012号\" target=\"_blank\">MCICP备2024000012号</a> | Powered by Vitepress and Github Pages"
    }
  },
  head: [
      ['link', { rel: 'icon', href: '/datapack-index/dream_catcher1.png' }]
  ],
  ignoreDeadLinks: true,

  markdown: {
    languages: [mcfunction],

    shikiSetup: async (shiki) => {
      await shiki.loadLanguage(mcfunction)
    } 
  }
})


