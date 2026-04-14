---
pageClass: h2-no-border
---

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 图书馆上新 What's New
- [**使用AI生成指令的工具**](https://wowomc.com/tools/ai-commander)
- [MC原版视频播放器](https://github.com/WindWavesSea/Minecraft-Vanilla-Video-Player)

<ColorLine :height="2"/>

## 命令快闪 Command Flashlight

### 上下文内检测特定坐标是否被红石充能

在指定的位置放置一个漏斗，检查其enabled方块状态，然后清除。该状态会在上下文内被设置。

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。  
答案会在下一期Feature公布。  

本期出题人：徐木弦
:::

:::tip
本期问题均基于`26.1`版本。
:::

---

1. 命令题：对所有拥有狗的玩家输出聊天栏文本：“[提示] 你可以通过狗尾巴的角度判断它的生命值”。

---

2. 填空题：制作地图过程中需要设计一个书架触发事件，点击如图所示的白框位置即可触发机关，该机关是一个交互实体，其大小与书架上该纹理书本的像素完全贴合。则交互实体数据 height 字段的值应该写成多少？
![](交互实体.png)


---

3. 分析题：自定义世界生成是一个容易产生错误的模块，在不使用任何外部插件、Mods的情况下
某个使用了自定义世界生成的存档出现了“安全模式”错误导致玩家无法进入该存档，
查看游戏日志得到如下的部分内容：
``` 
[16:15:18] [Render thread/ERROR]: Registry loading errors: 
> Errors in registry minecraft:worldgen/biome: 
>> Errors in element backrooms:level0_normal: 
java.lang.IllegalStateException: Failed to parse backrooms:worldgen/biome/l
evel0_normal.json from pack file/Tape of M.E.G.CN 
...
at net.minecraft.client.main.Main.main(SourceFile:276) 
Caused by: java.lang.IllegalStateException: Failed to get element ResourceKe
y[minecraft:sound_event / backrooms:ambient.level0] 
...
```
试分析出现“安全模式”错误的原因。


---

4. 综合题：“色盲派对”是常见的服务器小游戏：在一块平台上会有不同颜色的方块，每轮都会给出一种颜色的方块，倒计时结束时，不是该颜色的方块就会消失，届时位于上面的玩家就会掉入虚空。假如游戏平台位于$(0,0,0)$和$(31,0,31)$之间，平台上会出现棕、红、橙、黄、黄绿、绿、青、淡蓝、蓝、紫、品红、粉红这几种颜色的混凝土。假如一轮游戏中不是红色混凝土的方块都会消失，尝试实现这个效果。






<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="64"
    :strict="false"
    :reactionsEnabled="true"
    emitMetadata="0"
    inputPosition="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy"
    class="giscus-wrapper"
  />
</ClientOnly>