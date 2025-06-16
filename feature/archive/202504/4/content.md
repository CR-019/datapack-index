

<FeatureHead
    title = NeKoCustomSpawn-demo
    authorName = 七柏
    avatarUrl = '../../_authors/七柏.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/405830542' }
    ]"
/>

> 参考视频: [[数据包]基于 spreadplayers 的伪自然生成](https://www.bilibili.com/video/BV1FGRSYnELb/).
>

:::tip 注
原版自定义生成.

本数据包为 NeKoWorldCraft 系列子包, 依赖于前置 NeKoToolKit 中的 BlockTags. 

包体目前只完成了大概的生成流程, 文件调用关系还较为混乱.
:::

## 简介

为解决原版模组不能自然地向游戏中添加自定义生物而创建. 你可以借助此包以让世界中能够时刻且自然地生成自定义的生物或实体来使你的世界更加丰富!

## 实现

关于包体功能的实现, 我将其分为两个模块: **生成模块** 和 **反馈模块** 来讨论.

### 反馈

我们希望在类别生物达到对应生成上限后停止生成, 因此需要获取实体的最大生成上限, 这个上限由有效生成区块、生物类别上限乘数共同决定.

根据通用生成逻辑, 一种类别生物的最大生成数量由式 $m=\frac{ac}{289}$ 决定, 式中 $m$ 为生成上限, $a$ 为生物类别上限乘数, $c$ 为可生成区块数量. 我们主要对有效区块数量 $c$ 进行操作.

首先我们要知道什么是可生成区块. 根据 [Wiki:生成](https://zh.minecraft.wiki/w/生成/#生物类别与生物上限) 词条关于可生成区块的定义: ==以每个玩家所在区块为中心的17×17区块都被认为是**可生成区块**==. 

关于如何计算区块数量, 一开始选择了两种可行方案. 分别为**哈希表法**和**扫描线法**. 最终包内采用扫描线方案. 下面简要介绍一下两种可执行方案.

#### ~~哈希表~~

执行时**遍历**每个玩家周围 17*17 的区块坐标, 以键名存入 storage , 最后使用 execute store ... data get 的方式读取可生成区块数量.

#### 扫描线

扫描线法需要获取玩家周围 17*17 矩形范围的对角区块坐标为源数据, 先后采用 排序, 区间合并, 扫描操作来读取可生成区块数. 执行逻辑如下:

- **获取源数据**

:::details nkcustomspawn:main/effective_chunk/player.mcfunction

*该函数负责统计以玩家为中心17\*17的有效刷怪区块*#

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

- **数据预处理(区间划分)**

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

- **边界分类处理**

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

- **共线边界处理(左)**

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

- **非共线处理**

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

- **z 向长度运算**

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

- **左边界非共线处理**

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

- **右边界处理**

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

**补充:** 

storage 数据存储结构 `nkcustomspawn:data`

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

### 生成

关于自定义生物/实体的生成问题, 鉴于 spreadplayers 命令的优良性质(散布范围可自定义、不用在包内进行大规模数据运算), 包体基于该命令对自然生成进行模拟.

:::tip 注
但是 spreadplayers 也存在一定的缺点, 即不能将点位散布到水或熔岩中去, 这导致了本包只能于地面模拟生成.
:::
在进行模拟生成前, 我们首先应获取对应实体生成上限, 通过反馈模块我们可以得到这一点

在每个生成周期中, 我们应对以下事件进行处理

下面我们以僵尸类为例, 首先, 让我们处理生成上限

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

处理完生成上限后, 若已统计的实体数量低于上限, 便执行一次生成计划

```mcfunction
#生成
execute if score #CustomSpawn.Mob .NEKOTEMP < #CustomSPawn.MobCap .NEKOTEMP as @a at @s run \
    function nkcustomspawn:main/spawn/temp
```

由于 Java 版本 spreadplayers 的 `maxHeight` 参数并不支持相对位置 `~` 的输入, 因此我们采用宏来规范生成高度.

:::tip 注
关于此处限制生成高度的目的是为了洞穴生成, 如果不限制高度的话生成点只能选取在地表.
:::

对 `maxHeight` 参数进行计算并传入宏

```mcfunction
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run data get entity @s Pos[1]
scoreboard players add #CustomSpawn.Calculate_temp .NEKOTEMP 20
execute store result storage nkcustomspawn:data temp int 1 run scoreboard players get #CustomSpawn.Calculate_temp .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_temp
function nkcustomspawn:main/spawn/0 with storage nkcustomspawn:data
```

执行生成主函数

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

生成游走

:::tip 注
这个函数貌似有一些逻辑上的bug, 但我没找到.

具体是关于第30行的`kill @s`, 执行完后并不能完全清除标记用的marker, 若你注释掉上一段函数中的`kill @e[type=minecraft:marker,tag=nkcustomspawn]` 就可发现.
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

关于生成的处理

:::tip 注
本来是也想把水生和熔岩生成搞进来的, 但是写完才发现 spreadplayers 不能选取这两个方块作为目标点QAQ.
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

:::tip 注
这个函数用来管理生成的实体, 利用随机数对表中实体进行随机抽取 (这里是例子所以只写了一个), 这里也可以写入特定实体的生成谓词, 用来限制生成.
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

:::tip 注
对生成的最后一步判定(密度判定, 即9*9区块内同类生物不能超过一个阈值, 若成功生成则对计分项SuccessSpawn进行标记)
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

## 结尾

总之大概过程如上, 断断续续写了一个礼拜, 测试的效果感觉还是不错的.


感谢[萌茶](https://space.bilibili.com/320500029)群的群友:

- [@伊桑](https://space.bilibili.com/397069113) 
- u0
- Doom_Decapitator