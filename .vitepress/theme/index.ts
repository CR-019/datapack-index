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


import 'katex/dist/katex.min.css'

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
  }
}
