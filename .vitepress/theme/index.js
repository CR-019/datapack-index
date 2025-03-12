// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ExtraFeatures from './ExtraFeatures.vue'
import './style.css'
import Giscus from '@giscus/vue'

/** @type {import('vitepress').Theme} */
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
    app.component('ExtraFeatures', ExtraFeatures)
  }
}
