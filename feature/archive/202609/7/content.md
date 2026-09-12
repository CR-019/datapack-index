---
title: '浅谈原版地图常见的一些问题'
---


<FeatureHead
title='浅谈原版地图常见的一些问题'
authorName='轩宇1725'
/>

## 摘要

本文列出了几种新手作者在地图中会出现的问题，一些有成熟的解决方案，一些则在高技术力的作品中也会面临相似的问题。

## 前言

本文不是一篇教程，只是一些观察，欢迎大家补充和交流。

所给参考中，一些属于例子，一些属于替代方案，读者可自行参考。

## 命令方块

命令方块是一个问题吗？当然是。

只要不是远古版本，在发布的地图中使用大量命令方块本身就是一个问题。命令方块一定程度上会限制你的建筑布局，额外的渲染任务，额外的方块更新任务，以及额外的区块加载要求，甚至有时会依赖额外的红石结构。

因此绝对不推荐在发布时还将命令方块作为逻辑主体，应该使用数据包完成绝大部分的操作，命令方块最多作为一些按钮的入口（或完全不使用）

> 参考：
> - Doom_Decapitator - [数据包和命令入门学习-初学者如何快速适应](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202505/4/content.html)
> - 轩宇1725 - [为什么不推荐使用命令方块开发](https://vanillalibrary.mcfpp.top/datapack-index/resources/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%E5%91%BD%E4%BB%A4%E6%96%B9%E5%9D%97%E5%BC%80%E5%8F%91.html)
> - Dahesor - [数据包优化原则以及分析方式简述](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202504/3/content)
> - 创小业- [minecraft指令烹饪指南：凉拌实体选择器](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/2/content)
> - 我吃大白菜 - [一条命令值多少钱](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202608/2/content)

## 缺失受击反馈

许多玩家在长期游玩Minecraft的过程中已经建立了一种预期：当玩家受到攻击时，屏幕会抖动、血条有动画、会被击退、会有声音反馈；而怪物被几种时会变红、击退及声音反馈。

有部分地图在架空了原版的攻击和受伤机制后，却没有提供任何反馈。玩家无法马上反应自己被攻击了，而是要先看血条才能确定（甚至有些地图把血条变成了数字显示，玩家更难以察觉）

另一方面，当玩家攻击怪物时，怪物可能没有正确、及时、适量的击退（或者根本没有受击反馈），导致攻击反馈不明显或有偏差，造成攻击空打或者软绵绵的感觉。

> 参考：
> - MulverineX - [Player Motion](https://modrinth.com/datapack/player_motion)
> - SKSAMA - [原版血条！](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202505/5/content)
> - 伶 - [TheSkyBlessing 解析其三——检测生物攻击](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202602/5/content)
> - 不会画画的Cree - [Fast Motion](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202605/5/content)
> - 雨相日生 et al. - ：[基于展示实体的一些巧思](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202510/1/content)
> - 张小叉 - [简易原版敌人](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202608/6/content)

## 粒子设计问题

在展示实体出现之前 Minecraft 最常见的 VFX(Visual Effects) 是粒子效果，大量的作者采用粒子效果来丰富自己的画面。但部分作者在制作地图的时候并没有对这些 VFX 进行合理的设计，经常导致地图里粒子太多太乱，或者太薄而缺乏体积感，亦或是在多人游戏下造成较严重的发包性能问题。

最典型的情况是玩家在一场充满粒子效果的战斗中无法快速判断自己攻击的方向和范围，甚至没法从粒子的大小和颜色判断它的位置（如 `dust` 这样的粒子纹理尺寸会变化，颜色也带噪声）。最严重的是这些粒子有时候甚至挡住了关键内容（如敌人的位置等）。

> 参考：
> - Antares - [一种 particle 指令下的粒子定向发射方法](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202511/5/content)
> - SKSAMA - [一种基于展示实体的法阵](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/5/content)
> - 轩宇1725 - [杂谈 - 着色器的应用与滥用](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202605/2/content)

## 画风不统一

这是一个美术上的问题，部分地图修改的纹理和原版 Minecraft 的画风差异较大，特别是只修改了部分纹理的地图，这种差异可能会让对画面敏感的玩家感到不适应。

另外，很多作者有从别人的资源包里改东西的习惯。但要注意很多资源包是不允许二次修改和发布的，可能会造成侵权。另一方面，也不推荐地图内保留大量未经修改的纹理（如使用完整的原版资源包进行部分修改），这样会使得玩家的其他美化资源包无法发挥作用（除非有意为之）。

> - XeKr - [【XeKr】从零开始自制资源包-第一讲，创建文件，画上两笔](https://www.bilibili.com/video/BV1N4411a7gG)
> - XeKr - [【XeKr】从零开始自制资源包-第二讲，审美与风格](https://www.bilibili.com/video/BV1x4411N7B7)

## 对话延时

一些地图内会有丰富的人物对话或者剧情系统，通常以文本方式呈现。但值得注意的是，玩家阅读不同的文本需要不同的时间，通常我们用字数来预测阅读时间，从而决定下一句话再多长时间之后出现，但部分地图用同样长的时间间隔展示多句对话，玩家可能无法流畅阅读（通常要打开聊天栏回到之前的对话去阅读）。

如果这些作品中不能同时出现两句话（如使用一个对话框或者在titile、actionbar等位置显示文本），那么玩家很可能会错过一段对话中的信息。

一个常用的经验取值如下：

| 场景 | 建议 \(r\)（字/秒） | 说明 |
|------|---------------------|------|
| 舒适字幕 / 画面旁文字 | **4–6** | 传统中文字幕标准约 5 cps |
| 一般观众、有画面分心 | **5** | 最常用的经验值 |
| 流媒体较快节奏（如 Netflix 中文） | 最高约 **8–9** | - |
| 纯阅读、标题卡、PPT | **6–8** | 没有画面抢注意力时可以稍快 |
| 最短停留 | 至少 **1–1.5 秒** | - |
| 最长单条 | 一般不超过 **6–7 秒** | - |

> 参考：
> - 轩宇1725 - [轻量级场景对话框
](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/TL_lite.html)
> - SKSAMA - [以防你不知道我可以在MC里玩千恋万花](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/0/content)
> - icuqALT10 - [更好的剧情对话](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/1/content)
> - 皮革剑 - [聊天栏卷轴式用户界面](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202509/5/content)
> - CoolGaston - [文本动画资源库](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202510/7/content)
> - 火昱- [Better Title](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/Better_Title)

## 操作延迟

原版 Minecraft 的直接体验是客户端和服务器之间的交互，虽然服务器负责验证操作的合法性，但是客户端本身也会进行一些预测和渲染操作。在绝大多数的延迟情况下，客户端的预测是足够准确的，玩家几乎不会察觉到延迟。

许多社区地图由于用数据包架空了很多基础操作（如移动，攻击等行为），由于客户端无法预测数据包的行为，玩家在操作的时候有不低于 50 ms 的延迟，如果是多人游戏则还加上服务器返回数据（如各种展示实体的位置）的延迟，轻易可达 70-100+ms，这种延迟十分影响游戏体验。

事实上这是一个比较难解决的问题，目前没有完美的解决方案。不过，除了缩小延迟差异外，地图设计者也可以通过设计来让玩家有心理预期，例如在动作间加入一些动画、动作增加惯性，让玩家觉得这个延迟是设计的一部分，而不是一个影响体验的问题。

> 参考:
> - 伊桑 - [告别延迟拖尾：用线性预测实现 Display 实体的低延迟跟随](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202603/5/content)
> - CoolGaston - [原版摄像机动画资源库](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202603/3/content)
> - DartCat25 - [CEM-S](https://github.com/DartCat25/CEM-S)

## 参考

这些内容不对应某个特定的小节，但对整篇文章有参考作用，故在此单独列出

- 卡儿3058 - [【MC命令】一些宝贵的经验](https://www.bilibili.com/opus/996281238417309699)
- Rainbow_ - [原版开发常识汇总（其一）](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202601/b/content)
- 伶 - [TheSkyBlessing 数据包解析](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202512/0/content) 起的系列