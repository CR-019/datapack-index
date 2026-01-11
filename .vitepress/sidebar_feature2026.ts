import { DefaultTheme } from "vitepress";

export const sidebar_202601: DefaultTheme.Sidebar = [
  {
    text: 'Feature 2026.01',
    items: [
      { text: '目录', link: '/feature/index/202601' },
      { text: '上一刊', link: '/feature/index/202512' },
    ]
  },
  {
    text: '封二',
    link: '/feature/archive/202601/ifc/content'
  },
  {
    text: '精选 Featured',
    items: [
      { text: 'TheSkyBlessing数据包解析', link: '/feature/archive/202512/0/content' },
    ]
  },
  {
    text: '洞见 Insights',
    items: [
      { text: '一种可行的将OBJ模型转换为json模型的方法', link: '/feature/archive/202512/1/content' },
      { text: '基于世界生成结构集完成的无限自由度的无限建筑结构', link: '/feature/archive/202512/2/content' },
      { text: '自定义魔咒的综合应用', link: '/feature/archive/202512/3/content' },
      { text: '使用头颅/玩家档案信息半自动获取Unix时间戳', link: '/feature/archive/202512/4/content' },
      { text: '附注-核心全局量汇总（上）', link: '/feature/archive/202512/5/content' },

    ]
  },
  {
    text: '巧匠 Masterpieces',
    items: [
      { text: 'Sniffer: 来自Fabric的数据包开发支持Mod', link: '/feature/archive/202512/6/content' }
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