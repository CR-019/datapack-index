import { DefaultTheme } from "vitepress";
export const sidebar_feature: DefaultTheme.Sidebar = [
  {
    text: '月刊《Feature》',
    items: [
      { text: '绝赞征稿中！', link: '/feature/_规则' },
    ]
  },
  {
    text: '最新一期：2025.4月刊',
    link: '/feature/index/202504'
  },
  {
    items: [
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  },
];

export const sidebar_202504: DefaultTheme.Sidebar = [
  {
    text: 'Feature 2025.04',
    items: [
      { text: '目录', link: '/feature/index/202504' },
      { text: '创刊寄语', link: '/feature/archive/202504/preface' },
    ]
  },
  {
    text: '封面文章',
    items: [
      { text: '原版家具的“终极答案”？——新一代家具框架《松果核》', link: '/feature/archive/202504/0/content' },
    ]
  },
  {
    text: '内容索引',
    items: [
      { text: '数据包快速入门', link: '/feature/archive/202504/1/content' },
      { text: '如何合并多个版本的数据包？', link: '/feature/archive/202504/2/content' },
      { text: '数据包优化原则以及分析方式简述', link: '/feature/archive/202504/3/content' },
      { text: 'NeKoCustomSpawn-demo', link: '/feature/archive/202504/4/content' },
      { text: 'Java版1.21.5-SNBT语法概览', link: '/feature/archive/202504/5/content' },
      { text: '拾尘（七）-使用复合物品模型映射更简便的制作状态栏', link: '/feature/archive/202504/6/content' },
      { text: '根据玩家记分板分数进行排名', link: '/feature/archive/202504/7/content' },
    ]
  },
  {
    items: [
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  }
];
