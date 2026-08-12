---
title: 'NeKoCustomSpawn-demo'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "NeKoCustomSpawn-demo"
    authorName = "Qi Bai"
/>

> Reference video: [[data pack]pseudo-natural generation based on spreadplayers](https://www.bilibili.com/video/BV1FGRSYnELb/).
>

:::tip Note
vanilla custom build.

This data pack is a sub-package of the NeKoWorldCraft series and relies on BlockTags in the front-end NeKoToolKit.

Currently, the package body has only completed the rough generation process, and the file calling relationship is still relatively confusing.
:::

## Introduction

Created to solve the problem that vanilla mods cannot naturally add custom mobs to the game. You can use this package to make your world richer by allowing custom mobs or entities to be generated naturally in the world at all times!

## accomplish

Regarding the implementation of the package body function, I will divide it into two modules: **Generation module** and **Feedback module** to discuss.

### feedback

We hope to stop the generation of mobs after the category reaches the corresponding generation limit, so we need to obtain the maximum generation limit of the entity. This upper limit is determined by the effective generation chunk and the mob category upper limit multiplier.

According to the general generation logic, the maximum number of generated mobs of a category is given by$m=\frac{ac}{289}$decision, formula$m$To generate an upper limit,$a$is the mob category upper limit multiplier,$c$is the number of chunks that can be generated. We mainly measure the number of effective chunks$c$Perform operations.

First we need to know what a generateable chunk is. According to [Wiki:Generation](https://zh.minecraft.wiki/w/生成/#生物类别与生物上限) The definition of the entry on the chunk that can be generated: ==A 17×17 chunk centered on the chunk where each player is located is considered a **generable chunk**==.

Regarding how to calculate the number of chunks, two feasible solutions were initially selected. They were the **hash table method** and the **scan line method**. In the end, the scan line scheme was adopted in the package. The two executable schemes are briefly introduced below.

#### ~~Hash table~~

During execution, **traverse** the 17*17 chunkcoordinates around each player, store them in storage with key names, and finally use execute store ... data get to read the number of chunks that can be generated.

#### scan line

The scan line method needs to obtain the diagonal chunkcoordinates of the 17*17 rectangular range around the player as source data, and sequentially use sorting, interval merging, and scanning operations to read the number of chunks that can be generated. The execution logic is as follows:

- **Get source data**

:::details nkcustomspawn:main/effective_chunk/player.mcfunction

*This function is responsible for counting the effective monster spawning chunks centered on the player 17\*17*#

```mcfunction
#获取 PlayerPos
execute store result score #CustomSpawn.Pos_x .NEKOTEMP run data get entity @s Pos[0]
execute store result score #CustomSpawn.Pos_z .NEKOTEMP run data get entity @s Pos[2]
#运算用计分项
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 16
#获取 ChunkPos
##运算
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP /= #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP /= #CustomSpawn.Calculate .NEKOTEMP
##初始化
data modify storage nkcustomspawn:data EffectiveChunk.left set value [0,0,0,0]
data modify storage nkcustomspawn:data EffectiveChunk.right set value [0,0,0,1]
##区块对角顶点确定(x,z)
###左顶点(左上)
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 8
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP -= #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP += #CustomSpawn.Calculate .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.left[0] int 1 run \
    scoreboard players get #CustomSpawn.Pos_x .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.left[1] int 1 run \
    scoreboard players get #CustomSpawn.Pos_z .NEKOTEMP
###右顶点(右下)
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 16
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP += #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP -= #CustomSpawn.Calculate .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.right[0] int 1 run \
    scoreboard players get #CustomSpawn.Pos_x .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.right[2] int 1 run \
    scoreboard players get #CustomSpawn.Pos_z .NEKOTEMP
#整理
data modify storage nkcustomspawn:data EffectiveChunk.right[1] set from storage nkcustomspawn:data EffectiveChunk.left[1]
data modify storage nkcustomspawn:data EffectiveChunk.left[2] set from storage nkcustomspawn:data EffectiveChunk.right[2]
#存入 nktoolkit:array 整理运算
data modify storage nktoolkit:array input.source append from storage nkcustomspawn:data EffectiveChunk.left
data modify storage nktoolkit:array input.source append from storage nkcustomspawn:data EffectiveChunk.right
#重置计分项
scoreboard players reset #CustomSpawn.Pos_x
scoreboard players reset #CustomSpawn.Pos_z
scoreboard players reset #CustomSpawn.Calculate
```


:::

- **Data preprocessing (interval division)**

:::details nkcustomspawn:main/effective_chunk/0.mcfunction

```mcfunction
#调用冒泡排序对input data依据x由小到大排序
scoreboard players set #nktoolkit_arr .NEKOTEMP 1
function nktoolkit:list/bubble_store/0
scoreboard players reset #nktoolkit_arr .NEKOTEMP
#端点x0初始化
data modify storage nkcustomspawn:data input.source set from storage nktoolkit:array output
data remove storage nktoolkit:array output
##z向区间采集
##input.z数组
data modify storage nkcustomspawn:data input.z set value [0,0]
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#边界坐标读取
execute store result score #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
#边界类型读取
execute store result score #CustomSpawn.Calculate_lorr0 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#共线边界计数
scoreboard players set #CustomSpawn.Calculate_CollinearCount .NEKOTEMP 1
#remove source[0]
data remove storage nkcustomspawn:data input.source[0]
#调用主函数
function nkcustomspawn:main/effective_chunk/main
#后处理
scoreboard players reset #CustomSpawn.Calculate_CollinearCount .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lengthz .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lorr0 .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lorr .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_x0 .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_x1 .NEKOTEMP
data remove storage nkcustomspawn:data input
data remove storage nkcustomspawn:data EffectiveChunk
```


:::

- **Boundary Classification Processing**

::: details nkcustomspawn:main/effective_chunk/main.mcfunction

```mcfunction
#---------------------------#
#                  0                   #
#---------------------------#
#边界类型识别
execute store result score #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#左边界
##获取边界坐标
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    store result score #CustomSpawn.Calculate_x1 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
##共线
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    if score #CustomSpawn.Calculate_x1 .NEKOTEMP = #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    function nkcustomspawn:main/effective_chunk/left/collinear
##非共线
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    unless score #CustomSpawn.Calculate_x1 .NEKOTEMP = #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    function nkcustomspawn:main/effective_chunk/boundary
#边界类型识别
execute store result score #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#右边界
##获取边界坐标
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 1 \
    store result score #CustomSpawn.Calculate_x1 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
##数据处理
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 1 run \
    function nkcustomspawn:main/effective_chunk/boundary
#循环判据
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return fail
#循环
function nkcustomspawn:main/effective_chunk/main
```


:::

- **Collinear boundary processing (left)**

:::details nkcustomspawn:main/effective_chunk/left/collinear.mcfunction

```mcfunction
#---------------------------#
#                main                #
#---------------------------#
##z向区间添置
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#remove source[0]
data remove storage nkcustomspawn:data input.source[0]
#共线边界计数
scoreboard players add #CustomSpawn.Calculate_CollinearCount .NEKOTEMP 1
#重置右边界
scoreboard players reset #CustomSpawn.Calculate_x1 .NEKOTEMP
```


:::

- **Non-collinear processing**

:::details nkcustomspawn:main/effective_chunk/boundary.mcfunction

```mcfunction
#---------------------------#
#                main                #
#---------------------------#
#获取x向区间长 #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthx .NEKOTEMP += #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthx .NEKOTEMP -= #CustomSpawn.Calculate_x0 .NEKOTEMP
#异向边界修正
execute unless score #CustomSpawn.Calculate_lorr0 .NEKOTEMP = #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    scoreboard players add #CustomSpawn.Calculate_lengthx .NEKOTEMP 1
#获取z向区间长 #CustomSpawn.Calculate_lengthz .NEKOTEMP
##区间求并
data modify storage nktoolkit:array input.source set from storage nkcustomspawn:data input.interval
function nktoolkit:list/interval_union/0
#长度运算
function nkcustomspawn:main/effective_chunk/left/lengthz
data remove storage nktoolkit:array output
#有效计数 #CustomSpawn.CalCulate_ChunkCount .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP *= #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_ChunkCount .NEKOTEMP += #CustomSpawn.Calculate_lengthz .NEKOTEMP
#重置计分板
scoreboard players reset #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lengthz .NEKOTEMP
#边界调换
scoreboard players operation #CustomSpawn.Calculate_x0 .NEKOTEMP = #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lorr0 .NEKOTEMP = #CustomSpawn.Calculate_lorr .NEKOTEMP
#分类处理
##左边界非共线
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 run \
    function nkcustomspawn:main/effective_chunk/left/noncollinear
##右边界
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 1 run \
    function nkcustomspawn:main/effective_chunk/right/0
#remove source[0]
data remove storage nkcustomspawn:data input.source[0]
```


:::

- **z-direction length operation**

:::details nkcustomspawn:main/effective_chunk/lengthz.mcfunction

```mcfunction
#---------------------------#
#            boundary            #
#---------------------------#
#单一区间求长
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output[0][1]
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP += #CustomSpawn.Calculate_temp .NEKOTEMP
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output[0][0]
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP -= #CustomSpawn.Calculate_temp .NEKOTEMP
scoreboard players add #CustomSpawn.Calculate_lengthz .NEKOTEMP 1
#首项移除
data remove storage nktoolkit:array output[0]
#循环判据
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return run \
    scoreboard players reset #CustomSpawn.Calculate_temp
#循环
function nkcustomspawn:main/effective_chunk/left/lengthz
```


:::

- **Left boundary non-collinear processing**

:::details nkcustomspawn:main/effective_chunk/left/noncollinear.mcfunction

```mcfunction
#---------------------------#
#               boundary              #
#---------------------------#
#z向区间添置
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#边界共线数处理
execute store result storage nkcustomspawn:data input.collinear_temp int 1 run \
    scoreboard players get #CustomSpawn.Calculate_CollinearCount .NEKOTEMP
data modify storage nkcustomspawn:data input.collinear append from storage nkcustomspawn:data input.collinear_temp
data remove storage nkcustomspawn:data input.collinear_temp
#边界计数重置
scoreboard players set #CustomSpawn.Calculate_CollinearCount .NEKOTEMP 1
scoreboard players reset #CustomSpawn.Calculate_lorr .NEKOTEMP
```


:::

- **Right border processing**

::: details nkcustomspawn:main/effective_chunk/right/0.mcfunction

```mcfunction
#---------------------------#
#         boundary          #
#---------------------------#
#若collinear不存在则将计分项#CustomSpawn.Calculate_CollinearCount置入
execute unless data storage nkcustomspawn:data input.collinear \
    store result storage nkcustomspawn:data input.collinear_temp int 1 run \
    scoreboard players get #CustomSpawn.Calculate_CollinearCount .NEKOTEMP
#清除计分项#CustomSpawn.Calculate_CollinearCount
execute if data storage nkcustomspawn:data input.collinear_temp run \
    scoreboard players reset #CustomSpawn.Calculate_CollinearCount
#置入列表
execute if data storage nkcustomspawn:data input.collinear_temp run \
    data modify storage nkcustomspawn:data input.collinear append from storage nkcustomspawn:data input.collinear_temp
#清除collinear_temp
execute if data storage nkcustomspawn:data input.collinear_temp run \
    data remove storage nkcustomspawn:data input.collinear_temp
#读取collinear列表首位
execute if data storage nkcustomspawn:data input.collinear \
    store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nkcustomspawn:data input.collinear[0]
#删除collinear列表首位
data remove storage nkcustomspawn:data input.collinear[0]
#若collinear为空, 则清除
execute store result score #CustomSpawn.Calculate_temp2 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.collinear
execute if score #CustomSpawn.Calculate_temp2 .NEKOTEMP matches 0 run \
    data remove storage nkcustomspawn:data input.collinear
scoreboard players reset #CustomSpawn.Calculate_temp2
#右边界事件调用
function nkcustomspawn:main/effective_chunk/right/main
```


:::

:::details nkcustomspawn:main/effective_chunk/right/main.mcfunction

```mcfunction
#---------------------------#
#          right/0          #
#---------------------------#
#z向区间删除
data remove storage nkcustomspawn:data input.interval[0]
#循环判据
scoreboard players remove #CustomSpawn.Calculate_temp .NEKOTEMP 1
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return run \
    scoreboard players reset #CustomSpawn.Calculate_temp .NEKOTEMP
#循环
function nkcustomspawn:main/effective_chunk/right/main
```


:::

**Replenish:**

storage data storage structure `nkcustomspawn:data`

```snbt
{
    "input": {
        "source": [[x1,y1,y2,1],[x2,y1,y2,1],[r1,t1,t2,0],[r2,t1,t2,1],...],
        "interval":[[x-z区间],[r-z区间]],
        "collinear": [(共线计数1),(共线计数2),...]
    }
}
```


scoreboard

```
#CollinearCount -共线边界计数
#x0				-左边界
#x1				-右边界
#lengthx		-x向区间长度
#lengthz		-z向区间长度
#ChunkCount		-可生成区块计数
------------------------------------------
临时变量
#temp			-计算#lengthz时调用
#temp2
#lorr			-左右边界判断
#lorr1			-异性边界判断
```


### generate

Regarding the generation of custom mob/entity, in view of the excellent properties of the spreadplayers command (the spread range can be customized and there is no need to perform large-scale data operations in the package), the package body simulates natural generation based on this command.

:::tip Note
However, spreadplayers also have certain disadvantages, that is, they cannot spread points into water or lava, which results in this package only being generated on the ground.
:::
Before simulation generation, we should first obtain the upper limit of the corresponding entity generation. We can get this through the feedback module

In each build cycle, we should handle the following events

Let's take the zombie class as an example. First, let's deal with the generation limit

```mcfunction
#有效区块数计算
execute store result score #CustomSpawn.Player .NEKOTEMP run \
    execute if entity @a
execute if score #CustomSpawn.Player .NEKOTEMP matches 2.. as @a at @s run \
    function nkcustomspawn:main/effective_chunk/player
execute if score #CustomSpawn.Player .NEKOTEMP matches 2.. run \
    function nkcustomspawn:main/effective_chunk/0
execute if score #CustomSpawn.Player .NEKOTEMP matches 1 run \
    scoreboard players set #CustomSpawn.Calculate_ChunkCount .NEKOTEMP 289

#僵尸生成上限
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP = #CustomSpawn.Calculate_ChunkCount .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_ChunkCount .NEKOTEMP
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP *= #ChunkMobCap CustomSpawn_Factor
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP /= #BasicSpawn CustomSpawn_Factor

#怪物数量读取
execute store result score #CustomSpawn.Mob .NEKOTEMP run \
    execute if entity @e[type=#undead]
```


After processing the generation upper limit, if the number of counted entities is lower than the upper limit, a generation plan will be executed.

```mcfunction
#生成
execute if score #CustomSpawn.Mob .NEKOTEMP < #CustomSPawn.MobCap .NEKOTEMP as @a at @s run \
    function nkcustomspawn:main/spawn/temp
```


Since the `maxHeight`parameter of Java version spreadplayers does not support the input of relative position`~`, we use macros to standardize the generated height.

:::tip Note
The purpose of limiting the generation height here is for cave generation. If the height is not restricted, the generation point can only be selected on the surface.
:::

Calculate the `maxHeight` parameter and pass it into the macro

```mcfunction
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run data get entity @s Pos[1]
scoreboard players add #CustomSpawn.Calculate_temp .NEKOTEMP 20
execute store result storage nkcustomspawn:data temp int 1 run scoreboard players get #CustomSpawn.Calculate_temp .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_temp
function nkcustomspawn:main/spawn/0 with storage nkcustomspawn:data
```


Execute the generated main function

```mcfunction
#散布生成原点
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
summon minecraft:marker ~ ~ ~ {Tags:["nkcustomspawn"]}
$spreadplayers ~ ~ 24.0 110.0 under $(temp) false @e[distance=..0.5,type=minecraft:marker,tag=nkcustomspawn]
#生成游走
##距离参数
scoreboard players set #CustomSpawn.DistanceFactor .NEKOTEMP 80
##游走高度
execute as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    data modify entity @s data.Posy set from entity @s Pos[1]
##游走次数
scoreboard players set #CustomSpawn.WanderingChance .NEKOTEMP 4
execute as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    function nkcustomspawn:main/spawn/wandering
#重置
##清除标记 (有一个奇怪的BUG,但是不影响主体逻辑)
kill @e[type=minecraft:marker,tag=nkcustomspawn]
```


generate walks

:::tip Note
This function seems to have some logical bugs, but I haven't found any.

Specifically, regarding the `kill @s`on line 30, the marker used for marking cannot be completely cleared after execution. You can find out if you comment out the`kill @e[type=minecraft:marker,tag=nkcustomspawn]` in the previous function.
:::
```mcfunction
#游走次数减一
scoreboard players remove #CustomSpawn.WanderingChance .NEKOTEMP 1
#随机数生成
execute store result score #CustomSpawn.Roll .NEKOTEMP run \
    random value 0..100
#生成判定(几率, 距离, 空间判定)
execute at @s \
    if score #CustomSpawn.Roll .NEKOTEMP <= #CustomSpawn.DistanceFactor .NEKOTEMP \
    unless entity @a[distance=..24] \
    if entity @a[distance=..128] \
    if predicate nkcustomspawn:general/allow_spawn run \
    function nkcustomspawn:main/spawn/main

#生成游走
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    spreadplayers ~ ~ 0.0 5.0 under 256 false @s
#高度重置
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    data modify entity @s Pos[1] set from entity @s data.Posy

#进行下一轮游走
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    return run function nkcustomspawn:main/spawn/wandering

#成功生成 or 无剩余游走时退出
##清除标记 (有一个奇怪的BUG,但是不影响主体逻辑)
kill @s
##成功标记
scoreboard players reset #CustomSpawn.SuccessSpawn .NEKOTEMP
##重置游走次数
scoreboard players set #CustomSpawn.WanderingChance .NEKOTEMP 4
##减距离参数
scoreboard players remove #CustomSpawn.DistanceFactor .NEKOTEMP 20
##游走高度
execute as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    data modify entity @s data.Posy set from entity @s Pos[1]
execute if entity @e[distance=..128,type=marker,tag=nkcustomspawn] \
    as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    function nkcustomspawn:main/spawn/wandering
```


About the processing of generation

:::tip Note
I originally wanted to include aquatic and lava generation, but after writing it I discovered that spreadplayers cannot select these two blocks as target points QAQ.
:::

```mcfunction
#地面
execute if predicate nkcustomspawn:general/ground run \
    function nkcustomspawn:main/spawn/sub/ground
#水
#execute if predicate nkcustomspawn:general/water run \
    function nkcustomspawn:main/spawn/sub/water
#熔岩
#execute if predicate nkcustomspawn:general/lava run \
    function nkcustomspawn:main/spawn/sub/lava
```


:::tip Note
This function is used to manage the generated entities, using random numbers to randomly extract entities from the table (this is an example, so only one is written). You can also write a generation predicate for a specific entity here to limit the generation.
:::

```mcfunction
#随机数生成
execute store result score #CustomSpawn.Roll .NEKOTEMP run \
    random value 0..1

#自定义实体数据
##test1
execute if score #CustomSpawn.Roll .NEKOTEMP matches 0 run return run \
    function nkcustomspawn:data/test1
```


:::tip Note
Determination of the last step of generation (density determination, that is, the same type of mobs within 9*9chunk cannot exceed a threshold. If successfully generated, the scoring item SuccessSpawn will be marked)
:::

```
#密度判定
execute store result score #CustomSpawn.Density .NEKOTEMP run \
    execute if entity @e[distance=..72,type=minecraft:armor_stand]
#成功生成标记
execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    scoreboard players set #CustomSpawn.SuccessSpawn .NEKOTEMP 1
#生成
#execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    summon armor_stand ~ ~ ~ {Glowing:1b}
execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    summon husk ~ ~ ~ {NoAI:1b,Glowing:1b}
#密度判定值清除
scoreboard players reset #CustomSpawn.Density .NEKOTEMP
```


## ending

In short, the general process is as above. I wrote it intermittently for a week, and the test results are still good.


Thank you [Mengcha](https://space.bilibili.com/320500029) group friends:

- [@Ethan](https://space.bilibili.com/397069113) 
- u0
- Doom_Decapitator
