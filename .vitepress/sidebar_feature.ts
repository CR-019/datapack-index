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
    text: '最新',
    items: [
      {
        text: '🌟2026.01',
        link: '/feature/index/202601'
      },
    ]
  },
  {
    text: '',
    items: [
      {
        text: '2025.12',
        link: '/feature/index/202512'
      },
      {
        text: '2025.11',
        link: '/feature/index/202511'
      },
      {
        text: '2025.10',
        link: '/feature/index/202510'
      }
    ]
  },
  {
    text: '往期',
    collapsed: true,
    items: [
      {
        text: '2025.9',
        link: '/feature/index/202509'
      },
      {
        text: '2025.8',
        link: '/feature/index/202508'
      },
      {
        text: '2025.7',
        link: '/feature/index/202507'
      },
      {
        text: '2025.6',
        link: '/feature/index/202506'
      },
      {
        text: '2025.5',
        link: '/feature/index/202505'
      },
      {
        text: '2025.4',
        link: '/feature/index/202504'
      },
    ]
  },
  {
    items: [
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '格式指导', link: '/feature/_格式指导' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  },
];
