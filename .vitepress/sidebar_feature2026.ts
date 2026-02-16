import { DefaultTheme } from "vitepress";

export const sidebar_202601: DefaultTheme.Sidebar = [
  {
    text: 'Feature 2026.01',
    items: [
      { text: '目录', link: '/feature/index/202601' },
      { text: '上一刊', link: '/feature/index/202512' },
      { text: '下一刊', link: '/feature/index/202602' },
    ]
  },
  {
    text: '封二',
    link: '/feature/archive/202601/ifc/content'
  },
  {
    text: '特别企划',
    items: [
      { text: 'The Vanilla Awards (TVA) 2025 颁奖典礼', link: '/feature/tva/tva2025' },
    ]
  },
  {
    text: '精选 Featured',
    items: [
      { text: '图书馆最新力作：香草前置馆 现已上线！', link: '/feature/archive/202601/g/content' },
    ]
  },
  {
    text: '香草快讯 Mojang Spotlight',
    items: [
      { text: '香草快讯 - 2026年1月', link: '/feature/archive/202601/spotlight/content' },
    ]
  },
  {
    text: '洞见 Insights',
    items: [
      { text: 'TheSkyBlessing数据包解析其二', link: '/feature/archive/202601/a/content' },
      { text: '如何使用最新最热的MC特性制作原版国际象棋（上）', link: '/feature/archive/202601/d/content' },
      { text: '如何判断给定地址的NBT数据类型', link: '/feature/archive/202601/e/content' },
      { text: '原版开发常识汇总（其一）', link: '/feature/archive/202601/b/content' },
      { text: '更好的右键检测：减半法', link: '/feature/archive/202601/f/content' },

    ]
  },
  {
    text: '巧匠 Masterpieces',
    items: [
      { text: '基于非对称加密的只能游玩一次的MC地图', link: '/feature/archive/202601/c/content' }
    ]
  },
  {
    items: [
      { text: '《Feature》主页', link: '/feature/_index' },
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '格式指导', link: '/feature/_格式指导' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  }
];

export const sidebar_202602: DefaultTheme.Sidebar = [
  {
    text: 'Feature 2026.02',
    items: [
      { text: '目录', link: '/feature/index/202602' },
      { text: '上一刊', link: '/feature/index/202601' },
    ]
  },
  {
    text: '封二',
    link: '/feature/archive/202602/ifc/content'
  },
  {
    text: '精选 Featured',
    items: [
      { text: '着色器实践篇：简单2D场景的搭建', link: '/feature/archive/202602/1/content' },
      { text: '着色器实践篇：代码雨制作', link: '/feature/archive/202602/2/content' },
    ]
  },
  {
    text: '香草快讯 Λojang Spotlight',
    items: [
      { text: '香草快讯 - 2026年2月', link: '/feature/archive/202602/spotlight/content' },
    ]
  },
  {
    text: '洞见 Insights',
    items: [
      { text: '着色器进阶篇：基于物理的渲染（PBR）', link: '/feature/archive/202602/3/content' },
      { text: '如何使用最新最热的MC特性制作原版象棋（下）', link: '/feature/archive/202602/4/content' },
      { text: 'TheSkyBlessing 解析其三——检测生物攻击', link: '/feature/archive/202602/5/content' },
      { text: '论 Minecraft 环境下 Brainduck 解释器的实现与性能优化', link: '/feature/archive/202602/6/content' }

    ]
  },
  {
    text: '巧匠 Masterpieces',
    items: [
      { text: 'Patrick的流处理前置', link: '/feature/archive/202602/7/content' }
    ]
  },
  {
    items: [
      { text: '《Feature》主页', link: '/feature/_index' },
      { text: '月刊条款', link: '/feature/_条款' },
      { text: '格式指导', link: '/feature/_格式指导' },
      { text: '返回主站', link: '/index/绪论' }
    ]
  }
];