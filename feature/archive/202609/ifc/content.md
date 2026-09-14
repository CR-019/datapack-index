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

## 关于在《Feature》中使用AI工具辅助的声明
近期《Feature》收到了很多有AI参与的稿件，然而某些稿件的AI用的太不负责。  
**我们不反对作者在创作过程中以任何形式让AI参与任何部分的工作**，  
**但是**：
- 我们需要作者承担起自己文章的基础义务，例如确认语句的通顺，确认逻辑和事实的正确。
- 作者应该在提交前仔细阅读，审查，修改自己的文章，修正明显的错误，改写语法和遣词造句中明显不自然的部分，并关注读者从头读到尾时，获取信息的顺序的正确性（即，定义未知概念A之前不应不加解释地使用A）。
- 作者应该有计划地设计自己文章的组成部分，以传达想要表达的信息。

一句话：**我们不在意你的文章是键盘写的还是AI写的，但我们非常在意你有没有承担作为作者的基础责任。**

<ColorLine :height="2"/>

## 图书馆上新 What's New

狐狐正在睡觉……


<ColorLine :height="2"/>

## 命令快闪 Command Flashlight

获取区块xz最小值点： //16*16
```mcfunction
execute positioned ~ ~ ~-4 positioned ~ ~ ~54043195528445952 positioned ~ ~ ~-4 positioned ~ ~ ~-54043195528445952 run particle cloud ~ ~ ~
```


<ColorLine :height="2"/>

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。
答案会在下一期Feature公布。

本期出题人：徐木弦
:::

---

1. 已知有A、B、C、D四个玩家依次进入服务器，其中A、C、D位于主世界，B位于下界。在同一游戏刻内，表中各进度触发的先后顺序为

  | 玩家 | A | B | C | D |
  | --- | --- | --- | --- | --- |
  | 玩家受到伤害 | I | II | III | IV |,
  | 玩家物品栏改变 | V | VI | VII | VIII |

---

2. 在下图中，`/tp` 命令所使用参数 `-20 71 4.5` 所指的点为
  ![](./三维坐标点.png)

---

3. 一个玩家在快照 24w06a 中使用风弹时，游戏立刻崩溃，相应崩溃日志的部分内容如下所示：
```txt
  ---- Minecraft Crash Report ----
// Daisy, daisy...

Time: 2024-02-08 21:59:18
Description: Ticking entity

java.lang.IllegalStateException: Missing key in ResourceKey[minecraft:root / minecraft:damage_type]: ResourceKey[minecraft:damage_type / minecraft:wind_charge]
......
-- Entity being ticked --
Details:
	Entity Type: minecraft:wind_charge (ckc)
	Entity ID: 113
	Entity Name: 风弹
	Entity's Exact location: -0.68, 2.06, -2.25
	Entity's Block location: World: (-1,2,-3), Section: (at 15,2,13 in -1,0,-1; chunk contains blocks -16,-64,-16 to -1,319,-1), Region: (-1,-1; contains chunks -32,-32 to -1,-1, blocks -512,-64,-512 to -1,319,-1)
	Entity's Momentum: 0.70, -0.16, -1.32
	Entity's Passengers: []
	Entity's Vehicle: null
```
提出可行的解决办法。

---

<ColorLine :height="2"/>

### 上期参考答案

> 注：答案并非唯一。能解决问题即可。

1.

【答案】A

Realms 是由 Mojang Studios 官方托管的专用服务器。玩家购买服务后，官方会分配一个独立的服务器实例来运行该玩家的世界。

物理客户端：下载游戏版本得到的 `<version>.jar` 文件。

内置服务器：单人游戏时在本地电脑后台运行的服务器进程。

物理服务端：包含专用服务器的物理硬件。

---

2.

【答案】A

`summon` 子命令每次只能生成一个实体并将其设为命令执行者，故不会产生新分支。

---

3.

【答案】B

`minecraft:tick` 触发器会每游戏刻尝试触发一次，所以 I 的说法是正确的。但是，当游戏刻被冻结的时候，它仍然会以原游戏刻速率每游戏刻尝试触发一次，所以 II 的说法是错误的。步进多少游戏刻时，它也会随之尝试触发多少次，所以 III 的说法是正确的。当游戏刻快进执行时，它会随之快速触发，忽略原本的游戏刻速率，故IV的说法是错误的。综上所述，正确的说法有 I、III。

---

4.

【答案】D

噪声设置可以被维度引用，而不能被维度类型引用，故 D 项错误。


<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="101"
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