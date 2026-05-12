---
title: 'Fast Motion'
---

<FeatureHead
    title='Fast Motion'
    authorName='不会画画的Cree'
    cover = '../_assets/5_cover.png'
/>

这是一个能让你更方便地赋予玩家速度的数据包，它支持Minecraft Java 1.21.11及以上的版本。
[点击下载数据包](https://pan.baidu.com/s/1ELnB5z4DatqJK8mFGImNJg?pwd=Cree)

::: warning 该数据包的缺陷
赋予的速度大小有误差，误差值散布在-0.001~0.001内。
受限于作者能力，该数据包未经优化，性能欠佳。
:::

## 用法
我们可以通过执行以下两个函数来赋予玩家速度。
```mcfunction
function motion:apply_arguments
function motion:apply_scoreboard
```
数据包在执行这两个函数时会**分别赋予执行者指向了执行朝向的正左、正上、正前三个方向的速度（执行者必须为玩家）**。

因此，我们需要在使用`/function`命令执行这两个函数时传入**执行朝向**以及**各方向速度大小**这两组参数。
### 执行朝向
执行朝向通过命令上下文直接传入。

示例：
赋予某位玩家指向了他的正左、正上、正前三个方向的速度。
```mcfunction
execute as @r at @s run function motion:apply_arguments {x:100,y:100,z:100}
```
赋予某位玩家指向了世界的正东、正上、正南三个方向的速度。
```mcfunction
execute as @r rotated 0 0 run function motion:apply_arguments {x:100,y:100,z:100}
```

### 各方向速度大小
速度大小的单位为**格每刻**，其传入有以下规定：
- 范围为-10000~10000
- 必须为整数
- 必须为实际输出速度的1000倍

其传入方式则需要根据两个函数的不同来决定。
#### motion:apply_arguments
对于motion:apply_arguments函数，我们需要利用`/function`命令传入一个复合标签来传入各方向速度大小。
该复合标签内容如下：

<div class=nbttree>

<node type="compound" name="" required=true></node>
- <node type="int" name="x" required=true></node>指向执行朝向正左方的速度大小。
- <node type="int" name="y" required=true></node>指向执行朝向正上方的速度大小。
- <node type="int" name="z" required=true></node>指向执行朝向正前方的速度大小。

</div>

::: warning 注意
三个方向的速度大小都不可省略。若不需要赋予该轴速度，请将其大小设为0。
:::

示例：
赋予某位玩家一个指向世界正下方的大小为0.1格每刻的速度。
```mcfunction
execute as @r rotated 0 0 run function motion:apply_arguments {x:0,y:-100,z:0}
```
#### motion:apply_scoreboard
对于motion:apply_scoreboard函数，我们需要通过设置执行者的以下三个计分板的分数来传入各方向速度大小：

    motion.x
    motion.y
    motion.z
它们分别表示指向执行朝向的正左、正上、正前方的速度大小。

::: tip 提示
未设置分数的的计分板会自动视为0分，即速度大小为0。
:::

示例：
赋予每位玩家一个指向世界正下方的大小为5.085格每刻的速度。
```mcfunction
scoreboard players set @a motion.z -5085
execute as @a rotated 0 0 run function motion:apply_scoreboard
```
将每位玩家的Motion标签大致修改为[0.9d,-4.0d,3.0d]。
```mcfunction
scoreboard players set @a motion.x 900
scoreboard players set @a motion.y -4000
scoreboard players set @a motion.z 3000
execute as @a rotated 0 0 run function motion:apply_scoreboard
```

---

最后，点击[此处](https://www.bilibili.com/video/BV1Zgwyz3EPu/?share_source=copy_web&vd_source=8181862500e323499406c784dd72c4e7 "bilibili: [我的世界]一个数据包助你便捷修改玩家速度！")观看更详细的视频解说