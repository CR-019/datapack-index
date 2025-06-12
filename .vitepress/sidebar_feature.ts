import { DefaultTheme } from "vitepress";
export const sidebar_feature: DefaultTheme.Sidebar = [
  {
    text: '月刊《Feature》',
    link: '/feature/_index',
    items: [
      { text: '绝赞征稿中！', link: '/feature/_index' },
    ]
  },
  {
    text: '🌟2025.5月刊',
    link: '/feature/index/202505'
  },
    {
    text: '2025.4月刊',
    link: '/feature/index/202504'
  },
  {
    items: [
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '格式指导', link: '/feature/_格式指导' },
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
      { text: '下一刊', link: '/feature/index/202505' },
    ]
  },
  {
    text: '封面文章 Featured',
    items: [
      { text: '原版家具的“终极答案”？——新一代家具框架《松果核》', link: '/feature/archive/202504/0/content' },
    ]
  },
  {
    text: '洞见 Insights',
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
      { text: '《Features》主页', link: '/feature/_index' },
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  }
];


export const sidebar_202505: DefaultTheme.Sidebar = [
  {
    text: 'Feature 2025.05',
    items: [
      { text: '目录', link: '/feature/index/202505' },
      { text: '上一刊', link: '/feature/index/202504' },
    ]
  },
  {
    text: '封面文章 Featured',
    items: [
      { text: '烟花来咯！', link: '/feature/archive/202505/1/content' },
    ]
  },
  {
    text: '香草快讯 Λojang Spotlight',
    items: [
      { text: '香草快讯 - 2025年5月', link: '/feature/archive/202505/spotlight/content' },
    ]
  },
  {
    text: '洞见 Insights',
    items: [
      { text: '对展示实体渲染变换的研究', link: '/feature/archive/202505/2/content' },
      { text: 'Spyglass(大憨批)进阶使用说明', link: '/feature/archive/202505/3/content_' },
      { text: '数据包和命令入门学习-初学者如何快速适应', link: '/feature/archive/202505/4/content' },
      { text: '原版血条！', link: '/feature/archive/202505/5/content' },
    ]
  },
  {
    text: '巧匠 Masterpieces',
    items: [
      { text: 'Digging Underground', link: '/feature/archive/202505/6/content' },
    ]
  },
  {
    items: [
      { text: '《Features》主页', link: '/feature/_index' },
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  }
];
