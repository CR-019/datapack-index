import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outlineTitle:"",
    outline:[2,6],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '原版模组体系结构',
        collapsed: false,
        items: [
          {text:'前言',link:'/index/前言'}
        ]
      },
      {
        text: '数据包体系结构',
        collapsed: false,
        items: [
          {
            text:'逻辑结构：命令/函数',
            collapsed: false,
            items:[
              {text:'命令操作',link:'/index/命令1-命令操作'},
              {text:'数据操作',link:'/index/命令2-数据操作'},
              {text:'文本组件',link:'/index/命令3-文本组件'},
              {text:'方块/物品操作',link:'/index/命令4-方块和物品操作'},
              {text:'实体操作',link:'/index/命令5-实体操作'},
              {text:'世界/服务器指令',link:'/index/命令6-世界指令'}
            ]
          },
          {
            text:'数据结构：数据包组分',
            collapsed: false,
            items:[
              {text:'战利品表',link:'/index/数据结构/#战利品表'},
              {text:'谓词',link:'/index/数据结构/#谓词'},
              {text:'物品修饰器',link:'/index/数据结构/#物品修饰器'},
              {text:'进度',link:'/index/数据结构/#进度'},
              {text:'附魔',link:'/index/数据结构/#附魔'},
              {text:'标签',link:'/index/数据结构/#标签'},
              {text:'配方',link:'/index/数据结构/#配方'}
            ]
          },
          {
            text:'世界生成',
            collapsed: false,
            items:[
              {text:'结构',link:'/index/世界生成/#结构'},
              {text:'维度和维度类型',link:'/index/世界生成/#维度和维度类型'},
              {text:'自定义世界生成',link:'/index/世界生成/#自定义世界生成'}
            ]
          }
        ]
      },
      {
        text: '资源包体系结构',
        collapsed: false,
        items: [
          {text:'模型',link:'/index/资源包体系结构/#模型'},
          {text:'纹理',link:'/index/资源包体系结构/#纹理'},
          {text:'声音',link:'/index/资源包体系结构/#声音'},
          {text:'字体',link:'/index/资源包体系结构/#字体'},
          {text:'着色器',link:'/index/资源包体系结构/#着色器'}
        ]
      },
      {
        text: '原版模组实践',
        collapsed: false,
        items: [
          {text:'数据包实践',link:'/index/数据包实践'},
          {text:'资源包实践',link:'/index/资源包实践'},
          {text:'调试与综合实例',link:'/index/调试与综合实例'}
        ]
      },
      {
        text: '参考与友链',
        collapsed: false,
        items: [
          {text:'工具',link:'/index/工具'},
          {text:'参考',link:'/index/参考'},
          {text:'友情链接',link:'/index/友链'}
        ]
      },
      {
        text: '附录',
        collapsed: false,
        items: [
          {text:'附录1：天豹星雲教程合集',link:'/index/附录1'},
          {text:'附录2：Alumooper的着色器教程合集——MCJE着色器教程：从开发入门到游戏崩溃',link:'/index/附录2'}
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})


