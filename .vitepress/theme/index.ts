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

    const initZoom = () => {
      // 只选择带有 data-md-img 的图片（即来自 Markdown 语法的）
      mediumZoom('img[data-md-img]', {
        background: 'var(--vp-c-bg)'
      })
    }

    initZoom()

    router.onAfterRouteChanged = () => {
      // 清理旧实例
      try {
        const zoom = mediumZoom()
        zoom.detach?.()
      } catch (e) {
        // ignore
      }
      setTimeout(initZoom, 100)
    }
  }
}
