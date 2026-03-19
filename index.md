---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: h2-no-border

hero:
  name: "香草图书馆"
  tagline: 原版模组开发资源索引站
  image:
    src: /icons/bg5.png
  actions:
    - theme: brand
      text: 进入文档
      link: /index/绪论
    - theme: brand
      text: 前置检索
      link: /wheel/
    - theme: alt
      text: 支持一下宣传视频！
      link: https://www.bilibili.com/video/BV1JuNyzXEsP
features:
  - icon:
      src: /icons/echo_prism.png
    title: 《Feature》
    details: 数据包短文月刊
    linkText: 最新一期已发布！
    link: /feature/index/202603
  - icon:
      src: /icons/vt.png
    title: 系列教程
    details: 从零基础到稍微进阶的各种教程
    linkText: 零基础新手戳这里
    link: /index/参考
  - icon:
      src: /icons/totem_of_recovery.png
    title: 工具箱
    details: 能方便数据包开发的工具索引
    link: /index/工具
  - icon:
      src: /icons/ocean_clock.png
    title: 报刊亭
    details: 浏览往期《Feature》
    link: /feature/_index
  - icon:
      src: /icons/green_apple.png
    title: 数据包实践
    details: 实践和实例教程
    link: /index/数据包实践
  - icon:
      src: /icons/sweetbarry_stew.png
    title: 更新改动速查
    details: 看看更新你的数据包后什么东西会坏掉
    link: /index/changelog_breaking
---
<script setup>
import { useData } from 'vitepress'
import RandomParagraph from '/.vitepress/vue/random.vue'
const { isDark } = useData()
const { frontmatter } = useData()
</script>

<ColorLine :height="4"/>

> <RandomParagraph />




<div class="spacer"></div>

## 🍀欢迎
<ColorLine />
欢迎来到香草图书馆。  
“香草”，即 `Vanilla` 。本站点是原版模组相关资源的索引站点，力求为Minecraft Java版的原版模组（即数据包+资源包）开发，提供尽量全面的资源索引。
本站原名“原版模组体系结构”，由同名文章修改增补而来。
我们的愿景是收集尽可能多尽可能全面的教程资源，如同图书馆一样，包罗万象。
读者可根据自身喜好和需要，从本站给出的链接中选择合适的资源学习和使用。

## 📚资源相关
<ColorLine />

### MCBBS资源
由于MCBBS关站，许多其中的资源丢失了。
我们找到了其中一部分资源，现在点击他们会跳转到存档页面以浏览内容。
然而，还有相当比例的MCBBS帖子我们尚未找到。我们在这些帖子链接处加了删除线标识。如果你是帖子的原作者，或者知道这些帖子的存档位置，欢迎与我们联系。

> 虽然bbs打赢复活赛了，但是数据仍然丢失，亟待补充。

### 扩充资源
站点资源持续补充中。由于MCBBS的关站以及最近数个版本mojang对java版技术侧的改动，导致新版本相关特性的教程与介绍较为缺乏。
此外关于原版模组开发理论相关的内容，如调试技巧，性能测试等版块，也处于缺乏资料的状态。
我们欢迎有相关经验的原版模组作者为这些缺失的版块撰写教程。如果您有相关的资料，欢迎与我们联系，我们很高兴能够充实我们的馆藏。

### 文章暂存
我们推荐投稿作者先将文章发布在其他平台，然后在本站添加链接；
但是如果作者希望直接将文档发布在本平台，我们也提供文章暂存服务：
- 我们接受markdown格式的文档；
- 我们会将您的文章存放在仓库中，并在正文中以站内链接的方式引用文档。
- 当然，我们依然推荐作者在本地保留存档。

## ☎️联系我们
<ColorLine />
📧**意见箱**（新增链接条目/文档修改建议）：
[Github issues](https://github.com/CR-019/datapack-index/issues)

📖图书管理员 @CR_019:
- QQ:1703467028
- Bilibili：https://space.bilibili.com/85292644
- Github：https://github.com/CR-019

🏡房东 @Alumooper：
- Bilibili：https://space.bilibili.com/280394409
- Github：https://github.com/Alumopper


## 香草奖2025
<ColorLine />
<p class="float-right-image">
  <img src="/icons/tva2025.png" alt="描述图片的文字">
</p>

全MC圈最香草的奖项正在火热颁发中！  
快来看看你心目中最香草的作品有没有获奖吧！

[去看看->](/feature/tva/tva2025.md)
