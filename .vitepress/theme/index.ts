// https://vitepress.dev/guide/custom-theme
import { defineComponent, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './process-polyfill.js' 
import './style.css'
import Giscus from '@giscus/vue'

import FeaturedHead from '../vue/FeaturedHead.vue'
import FeatureHead from '../vue/FeatureHead.vue'
import JournalHead from '../vue/JournalHead.vue'
import JournalIndex from '../vue/JournalIndex.vue'
import Index from '../vue/Index.vue'
import IndexCompatible from '../vue/IndexCompatible.vue'
import NBTTree from '../vue/NBTTree.vue'
import SpotlightHead from '../vue/SpotlightHead.vue'
import RandomParagraph from '../vue/random.vue'
import ColorLine from '../vue/ColorLine.vue'
import NBTDefine from '../vue/NBTDefine.vue'
import SearchBox from '../vue/wheel/SearchBox.vue'
import InfoCard from '../vue/wheel/InfoCard.vue'
import Node from '../vue/Node.vue'
import SideCard from '../vue/wheel/SideCard.vue'
import AllPage from '../vue/wheel/AllPage.vue'
import mediumZoom from 'medium-zoom'
import RepoCard from '../vue/wheel/RepoCard.vue'
import MarkdownPreviewer from '../vue/MarkdownPreviewer.vue'



import 'katex/dist/katex.min.css'
import { reactive, watch } from 'vue'
import { useData } from 'vitepress'


const globalDataStore = reactive({})

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    name: 'CustomLayoutWrapper',
    setup() {
      const { frontmatter } = useData()
      
      return () => {
        //如果frontmatter.wheel为真，则渲染wheel自定义侧边栏
        if (frontmatter.value && frontmatter.value.wheel) {
          return h('div', { class: 'wheel-layout' }, [
            h(DefaultTheme.Layout, null, {
              'aside-outline-before': () => h(SideCard)
            })
          ])
        }
        //否则返回默认的
        return h(DefaultTheme.Layout)
      }
    }
  }),
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('GiscusComment', Giscus)
    app.component('FeaturedHead', FeaturedHead)
    app.component('FeatureHead', FeatureHead)
    app.component('JournalHead', JournalHead)
    app.component('JournalIndex', JournalIndex)
    app.component('Index', Index)
    app.component('IndexCompatible', IndexCompatible)
    app.component('NBTTree', NBTTree)
    app.component('NBTDefine', NBTDefine)
    app.component('SpotlightHead', SpotlightHead)
    app.component('random', RandomParagraph)
    app.component('ColorLine', ColorLine)
    app.component('SearchBox', SearchBox)
    app.component('InfoCard', InfoCard)
    app.component('node', Node)
    app.component('AllPage', AllPage)
    app.component('RepoCard', RepoCard)
    app.component('MarkdownPreviewer', MarkdownPreviewer)

    // 只在浏览器环境中执行 zoom 初始化
    if (typeof window !== 'undefined') {
      // 动态导入 medium-zoom（避免 SSR 报错）
      import('medium-zoom').then(({ default: mediumZoom }) => {
        const initZoom = () => {
          // 仅对 Markdown 生成的图片（带 data-md-img）启用 zoom
          const images = document.querySelectorAll('img[data-md-img]')
          if (images.length) {
            mediumZoom(images, {
              background: 'var(--vp-c-bg)',
              margin: 40
            })
          }
        }

        // 初次加载
        initZoom()

        // 路由切换后重新绑定
        router.onAfterRouteChanged = () => {
          // 清理旧实例（可选）
          try {
            const zoom = mediumZoom()
            zoom.detach?.()
          } catch (e) {
            // ignore
          }
          setTimeout(initZoom, 100)
        }
      })
    }
  }
}
