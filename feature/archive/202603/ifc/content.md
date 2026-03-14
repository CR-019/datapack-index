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
- [NBT Autocomplete - 提供游戏内nbt自动补全](https://modrinth.com/mod/nbt-autocomplete)
- [原版技术性开发教程 - 徐木弦](https://github.com/xu-mu-xian/Minecraft-Vanilla-Techincal-Development-Tutorial)
- [我的世界wiki的历史版本在哪找？](https://www.bilibili.com/video/BV11if5BcEgs)
- [【Minecraft】Animated Java原版模型动画制作基础教程①--以1.20.1版为例](https://www.bilibili.com/video/BV16zfHBGEi2)
- [blockbench建模软件快速入门教程文档 - 伊塔喵啊](https://pcn6fq3p3rgn.feishu.cn/wiki/KYbDwKtyUi5VNZkw61wcuW50nTe?from=from_copylink)
- [NexusMC - Minecraft社区](https://www.nexusmc.cn/)
- [VM汉化组](https://vmct-cn.top/)
- [CTM地图资源站](http://omgctm.top/)

<ColorLine :height="2"/>

## 命令快闪 Command Flashlight

### 快速实体访问器

我们知道，用Item实体的Thrower标签可以保存实体的UUID引用并进行高效的访问：

```mcfunction
# 将当前实体的UUID保存到物品NBT中
# 假设我们物品实体的uuid固定为0-0-0-0-1
data modify entity 0-0-0-0-1 Thrower set from entity @s UUID
```

只要这个实体还存在，接下来在我们数据包的任何位置，我们都可以通过这个物品实体来访问这个实体：

```mcfunction
execute as 0-0-0-0-1 on origin run <命令>
```

但是如果要储存多个实体的引用呢？我们可以让多个物品实体骑乘在一个世界实体上，借助世界实体进行访问：

```mcfunction
# 假设世界实体是0-0-0-0-2
execute as 0-0-0-0-2 on passengers on origin run <命令>
```

当我们要添加新的实体引用时，只需要让一个新的物品实体骑乘在世界实体上即可，无需限定物品实体的UUID。