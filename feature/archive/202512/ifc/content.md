<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

::: warning 你进入了一个秘密页面！
开个玩笑。
在香草图书馆的更新过程中，我们发现，一些具有时效性的、细碎的信息，图书馆里没有适合他们存放的位置。
因此，我们打算在《feature》中添加一个页面，放置一些杂项信息。随着《feature》更新一同更新。
本页的内容不固定，可能会是各种信息，比如说命令问答，冷知识，~~数据包笑话~~，等等。
我们在本页下方同样添加了本刊的讨论区，可以在下面发表你对本期《Feature》的看法，也可以向我们提问。
:::

## 图书馆上新 What's New
<ColorLine :height="2"/>

::: tip
本版块贴出最近收录在图书馆的新帖子，替代原先的“最近更新”页面。
:::
- [香草笔记](https://docs.qq.com/aio/DV0xYeXVWaFJxQ3pI)
- [数据包教程：对话框](https://www.bilibili.com/video/BV1JyycB7E8H)
- [教程：如何使两个物品扔在一起后合成](https://www.bilibili.com/video/BV1opCvBiEAh/)


## 命令快闪 Command Flashlight

### mc爆炸动量计算公式

爆炸强度 = 1-爆炸中心到实体距离/爆炸直径
爆炸动量 = 爆炸中心到实体眼睛的单位向量 * 爆炸强度

### 执行朝向转四元数

```mcfunction
execute in minecraft:overworld positioned 0. 0 1. rotated ~ 0 positioned ^ ^ ^1 facing 0. 0 0. positioned 0. 0 0. run teleport 0-0-0-0-0 ^ ^ ^-1
execute store result score #s temp run data get entity 0-0-0-0-0 Pos[0] 46340
execute store result score #c temp run data get entity 0-0-0-0-0 Pos[2] 46340
execute in minecraft:overworld positioned 0. 0 1. rotated 0 ~ positioned ^ ^ ^1 facing 0. 0 0. positioned 0. 0 0. run teleport 0-0-0-0-0 ^ ^ ^-1
execute store result score #y temp store result score #w temp run data get entity 0-0-0-0-0 Pos[2] 46340
execute store result score #x temp store result score #z temp run data get entity 0-0-0-0-0 Pos[1] 46340
execute store result storage example:s quaternion[3] float .000000000465661287520 run scoreboard players operation #w temp *= #c temp
execute store result storage example:s quaternion[2] float .000000000465661287520 run scoreboard players operation #z temp *= #s temp
execute store result storage example:s quaternion[1] float .000000000465661287520 run scoreboard players operation #y temp *= #s temp
execute store result storage example:s quaternion[0] float -.00000000046566128752 run scoreboard players operation #x temp *= #c temp
```

### 计算日月高度角

以下代码以一天中的时间作为输入，并输出太阳的角度（为保证精度，角度值乘以了 100000）。若角度为 0，则太阳位于正东方；角度为 90 时，太阳位于正北方，以此类推。月亮的位置与太阳相反（360 - 太阳角度 = 月亮角度）。

::: warning 编辑注
由于1.21.11环境属性设置的存在，在部分生物群系中可能会和实际位置不同。
:::

pack:main.mcfunction
```mcfunction
scoreboard objectives add obj._ dummy
scoreboard players set #24 obj._ 24
scoreboard players set #60 obj._ 60
scoreboard players set #100 obj._ 100
scoreboard players set #180 obj._ 180
scoreboard players set #240 obj._ 240
scoreboard players set #25000 obj._ 25000
scoreboard players set #100000 obj._ 100000
scoreboard players set #15000000 obj._ 15000000
scoreboard players set #36000000 obj._ 36000000
execute store result score #_a obj._ run time query daytime
scoreboard players operation #_a obj._ *= #100 obj._
scoreboard players operation #_a obj._ /= #24 obj._
scoreboard players operation #_a obj._ -= #25000 obj._
scoreboard players operation #_b obj._ = #_a obj._
scoreboard players operation #_b obj._ /= #100000 obj._
scoreboard players operation #_b obj._ *= #100000 obj._
scoreboard players operation #_a obj._ -= #_b obj._
scoreboard players operation #_c obj._ = #_a obj._
scoreboard players operation #_c obj._ *= #240 obj._
scoreboard players operation #_d obj._ = #_a obj._
scoreboard players operation #_d obj._ *= #180 obj._
execute summon minecraft:marker run function pack:cos
scoreboard players operation #_d obj._ *= #60 obj._
scoreboard players operation #_c obj._ -= #_d obj._
scoreboard players operation #_c obj._ += #15000000 obj._
scoreboard players operation #_c obj._ %= #36000000 obj._
scoreboard players operation $_angle_of_sun obj._ = #_c obj._
```

pack:cos.mcfunction
```mcfunction
tp @s 0.0 0.0 0.0
execute store result entity @s Rotation[0] float 0.00001 run scoreboard players get #_d obj._
execute at @s run tp @s ^ ^ ^1
execute store result score #_d obj._ run data get entity @s Pos[2] 100000
kill @s
```

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="43"
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