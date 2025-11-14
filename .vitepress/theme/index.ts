// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
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
import Node from '../vue/Node.vue'
import mediumZoom from 'medium-zoom'



import 'katex/dist/katex.min.css'
import { reactive, watch } from 'vue'


const globalDataStore = reactive({})

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
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
    app.component('node', Node)

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
