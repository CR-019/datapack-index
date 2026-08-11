---
title: 'NeKoCustomSpawn-demo'
---

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

## Implementation

Regarding the implementation of the package body function, I will divide it into two modules: **Generation module** and **Feedback module** to discuss.

### Feedback

We hope to stop the generation of mobs after the category reaches the corresponding generation limit, so we need to obtain the maximum generation limit of the entity. This upper limit is determined by the effective generation chunk and the mob category upper limit multiplier.

According to the general generation logic, the maximum number of generated mobs of a category is given by$m=\frac{ac}{289}$decision, formula$m$To generate an upper limit,$a$is the mob category upper limit multiplier,$c$is the number of chunks that can be generated. We mainly measure the number of effective chunks$c$Perform operations.

First we need to know what a generateable chunk is. According to [Wiki:Generation](https://zh.minecraft.wiki/w/生成/#生物类别与生物上限) The definition of the entry on the chunk that can be generated: ==A 17×17 chunk centered on the chunk where each player is located is considered a **generable chunk**==.

Regarding how to calculate the number of chunks, two feasible solutions were initially selected. They were the **hash table method** and the **scan line method**. In the end, the scan line scheme was adopted in the package. The two executable schemes are briefly introduced below.

#### ~~Hash table~~

During execution, **traverse** the 17*17 chunkcoordinates around each player, store them in storage with key names, and finally use execute store ... data get to read the number of chunks that can be generated.

#### Scan line

The scan line method needs to obtain the diagonal chunkcoordinates of the 17*17 rectangular range around the player as source data, and sequentially use sorting, interval merging, and scanning operations to read the number of chunks that can be generated. The execution logic is as follows:

- **Get source data**

:::details nkcustomspawn:main/effective_chunk/player.mcfunction

*This function is responsible for counting the effective monster spawning chunks centered on the player 17\*17*#

```mcfunction
#Get PlayerPos
execute store result score #CustomSpawn.Pos_x .NEKOTEMP run data get entity @s Pos[0]
execute store result score #CustomSpawn.Pos_z .NEKOTEMP run data get entity @s Pos[2]
#Scoring items for calculation
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 16
#Get ChunkPos
##Operation
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP /= #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP /= #CustomSpawn.Calculate .NEKOTEMP
##initialization
data modify storage nkcustomspawn:data EffectiveChunk.left set value [0,0,0,0]
data modify storage nkcustomspawn:data EffectiveChunk.right set value [0,0,0,1]
##chunk diagonal vertex determines (x,z)
###Left vertex (upper left)
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 8
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP -= #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP += #CustomSpawn.Calculate .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.left[0] int 1 run \
    scoreboard players get #CustomSpawn.Pos_x .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.left[1] int 1 run \
    scoreboard players get #CustomSpawn.Pos_z .NEKOTEMP
###Right vertex (lower right)
scoreboard players set #CustomSpawn.Calculate .NEKOTEMP 16
scoreboard players operation #CustomSpawn.Pos_x .NEKOTEMP += #CustomSpawn.Calculate .NEKOTEMP
scoreboard players operation #CustomSpawn.Pos_z .NEKOTEMP -= #CustomSpawn.Calculate .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.right[0] int 1 run \
    scoreboard players get #CustomSpawn.Pos_x .NEKOTEMP
execute store result storage nkcustomspawn:data EffectiveChunk.right[2] int 1 run \
    scoreboard players get #CustomSpawn.Pos_z .NEKOTEMP
#tidy
data modify storage nkcustomspawn:data EffectiveChunk.right[1] set from storage nkcustomspawn:data EffectiveChunk.left[1]
data modify storage nkcustomspawn:data EffectiveChunk.left[2] set from storage nkcustomspawn:data EffectiveChunk.right[2]
#Store in nktoolkit:array sorting operation
data modify storage nktoolkit:array input.source append from storage nkcustomspawn:data EffectiveChunk.left
data modify storage nktoolkit:array input.source append from storage nkcustomspawn:data EffectiveChunk.right
#Reset scoring
scoreboard players reset #CustomSpawn.Pos_x
scoreboard players reset #CustomSpawn.Pos_z
scoreboard players reset #CustomSpawn.Calculate
```
:::

- **Data preprocessing (interval division)**

:::details nkcustomspawn:main/effective_chunk/0.mcfunction

```mcfunction
#Call bubble sort to sort the input data according to x from small to large
scoreboard players set #nktoolkit_arr .NEKOTEMP 1
function nktoolkit:list/bubble_store/0
scoreboard players reset #nktoolkit_arr .NEKOTEMP
#Endpoint x0 initialization
data modify storage nkcustomspawn:data input.source set from storage nktoolkit:array output
data remove storage nktoolkit:array output
##z direction interval collection
##input.zarray
data modify storage nkcustomspawn:data input.z set value [0,0]
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#Boundary coordinate reading
execute store result score #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
#Boundary type reading
execute store result score #CustomSpawn.Calculate_lorr0 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#collinear boundary count
scoreboard players set #CustomSpawn.Calculate_CollinearCount .NEKOTEMP 1
#remove source[0]
data remove storage nkcustomspawn:data input.source[0]
#Call main function
function nkcustomspawn:main/effective_chunk/main
#Post-processing
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
#Boundary type identification
execute store result score #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#left border
##Get boundary coordinate
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    store result score #CustomSpawn.Calculate_x1 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
##colinear
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    if score #CustomSpawn.Calculate_x1 .NEKOTEMP = #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    function nkcustomspawn:main/effective_chunk/left/collinear
##noncollinear
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 \
    unless score #CustomSpawn.Calculate_x1 .NEKOTEMP = #CustomSpawn.Calculate_x0 .NEKOTEMP run \
    function nkcustomspawn:main/effective_chunk/boundary
#Boundary type identification
execute store result score #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][3]
#right border
##Get boundary coordinate
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 1 \
    store result score #CustomSpawn.Calculate_x1 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source[0][0]
##data processing
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 1 run \
    function nkcustomspawn:main/effective_chunk/boundary
#Circulation criterion
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nkcustomspawn:data input.source
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return fail
#cycle
function nkcustomspawn:main/effective_chunk/main
```
:::

- **Collinear boundary processing (left)**

:::details nkcustomspawn:main/effective_chunk/left/collinear.mcfunction

```mcfunction
#---------------------------#
#                main                #
#---------------------------#
##zAdd to range
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#remove source[0]
data remove storage nkcustomspawn:data input.source[0]
#collinear boundary count
scoreboard players add #CustomSpawn.Calculate_CollinearCount .NEKOTEMP 1
#reset right border
scoreboard players reset #CustomSpawn.Calculate_x1 .NEKOTEMP
```
:::

- **Non-collinear processing**

:::details nkcustomspawn:main/effective_chunk/boundary.mcfunction

```mcfunction
#---------------------------#
#                main                #
#---------------------------#
#Get the x-direction interval length #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthx .NEKOTEMP += #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthx .NEKOTEMP -= #CustomSpawn.Calculate_x0 .NEKOTEMP
#Differential boundary correction
execute unless score #CustomSpawn.Calculate_lorr0 .NEKOTEMP = #CustomSpawn.Calculate_lorr .NEKOTEMP run \
    scoreboard players add #CustomSpawn.Calculate_lengthx .NEKOTEMP 1
#Get the z-direction interval length #CustomSpawn.Calculate_lengthz .NEKOTEMP
##Interval union
data modify storage nktoolkit:array input.source set from storage nkcustomspawn:data input.interval
function nktoolkit:list/interval_union/0
#Length operation
function nkcustomspawn:main/effective_chunk/left/lengthz
data remove storage nktoolkit:array output
#Valid Count #CustomSpawn.CalCulate_ChunkCount .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP *= #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_ChunkCount .NEKOTEMP += #CustomSpawn.Calculate_lengthz .NEKOTEMP
#Reset scoreboard
scoreboard players reset #CustomSpawn.Calculate_lengthx .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_lengthz .NEKOTEMP
#boundary swap
scoreboard players operation #CustomSpawn.Calculate_x0 .NEKOTEMP = #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_x1 .NEKOTEMP
scoreboard players operation #CustomSpawn.Calculate_lorr0 .NEKOTEMP = #CustomSpawn.Calculate_lorr .NEKOTEMP
#Classification processing
##Left border is non-collinear
execute if score #CustomSpawn.Calculate_lorr .NEKOTEMP matches 0 run \
    function nkcustomspawn:main/effective_chunk/left/noncollinear
##right border
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
#Find the length of a single interval
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output[0][1]
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP += #CustomSpawn.Calculate_temp .NEKOTEMP
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output[0][0]
scoreboard players operation #CustomSpawn.Calculate_lengthz .NEKOTEMP -= #CustomSpawn.Calculate_temp .NEKOTEMP
scoreboard players add #CustomSpawn.Calculate_lengthz .NEKOTEMP 1
#First item removed
data remove storage nktoolkit:array output[0]
#Circulation criterion
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nktoolkit:array output
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return run \
    scoreboard players reset #CustomSpawn.Calculate_temp
#cycle
function nkcustomspawn:main/effective_chunk/left/lengthz
```
:::

- **Left boundary non-collinear processing**

:::details nkcustomspawn:main/effective_chunk/left/noncollinear.mcfunction

```mcfunction
#---------------------------#
#               boundary              #
#---------------------------#
#zAdd to range
data modify storage nkcustomspawn:data input.z[0] set from storage nkcustomspawn:data input.source[0][2]
data modify storage nkcustomspawn:data input.z[1] set from storage nkcustomspawn:data input.source[0][1]
data modify storage nkcustomspawn:data input.interval append from storage nkcustomspawn:data input.z
#Boundary collinear number processing
execute store result storage nkcustomspawn:data input.collinear_temp int 1 run \
    scoreboard players get #CustomSpawn.Calculate_CollinearCount .NEKOTEMP
data modify storage nkcustomspawn:data input.collinear append from storage nkcustomspawn:data input.collinear_temp
data remove storage nkcustomspawn:data input.collinear_temp
#Boundary count reset
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
#If collinear does not exist, the scoring item #CustomSpawn.Calculate_CollinearCount will be inserted
execute unless data storage nkcustomspawn:data input.collinear \
    store result storage nkcustomspawn:data input.collinear_temp int 1 run \
    scoreboard players get #CustomSpawn.Calculate_CollinearCount .NEKOTEMP
#Clear Scoring Item #CustomSpawn.Calculate_CollinearCount
execute if data storage nkcustomspawn:data input.collinear_temp run \
    scoreboard players reset #CustomSpawn.Calculate_CollinearCount
#Place list
execute if data storage nkcustomspawn:data input.collinear_temp run \
    data modify storage nkcustomspawn:data input.collinear append from storage nkcustomspawn:data input.collinear_temp
#Clearcollinear_temp
execute if data storage nkcustomspawn:data input.collinear_temp run \
    data remove storage nkcustomspawn:data input.collinear_temp
#Read the first collinear list
execute if data storage nkcustomspawn:data input.collinear \
    store result score #CustomSpawn.Calculate_temp .NEKOTEMP run \
    data get storage nkcustomspawn:data input.collinear[0]
#Delete the first position in the collinear list
data remove storage nkcustomspawn:data input.collinear[0]
#If collinear is empty, clear
execute store result score #CustomSpawn.Calculate_temp2 .NEKOTEMP run \
    data get storage nkcustomspawn:data input.collinear
execute if score #CustomSpawn.Calculate_temp2 .NEKOTEMP matches 0 run \
    data remove storage nkcustomspawn:data input.collinear
scoreboard players reset #CustomSpawn.Calculate_temp2
#Right border event call
function nkcustomspawn:main/effective_chunk/right/main
```


:::

:::details nkcustomspawn:main/effective_chunk/right/main.mcfunction

```mcfunction
#---------------------------#
#          right/0          #
#---------------------------#
#z-direction interval deletion
data remove storage nkcustomspawn:data input.interval[0]
#Circulation criterion
scoreboard players remove #CustomSpawn.Calculate_temp .NEKOTEMP 1
execute if score #CustomSpawn.Calculate_temp .NEKOTEMP matches 0 run return run \
    scoreboard players reset #CustomSpawn.Calculate_temp .NEKOTEMP
#cycle
function nkcustomspawn:main/effective_chunk/right/main
```
:::

**Additional:**

storage data storage structure`nkcustomspawn:data`

```snbt
{
    "input": {
        "source": [[x1,y1,y2,1],[x2,y1,y2,1],[r1,t1,t2,0],[r2,t1,t2,1],...],
        "interval":[[x-z interval],[r-z interval]],
        "collinear": [(collinear count 1),(collinear count 2),...]
    }
}
```


scoreboard

```
#CollinearCount — Collinear boundary count
#x0 - left border
#x1 - right border
#lengthx - x-direction interval length
#lengthz - z-direction interval length
#ChunkCount - can generate chunk count
------------------------------------------
temporary variables
#temp - called when calculating #lengthz
#temp2
#lorr - left and right boundary judgment
#lorr1 - Opposite sex boundary judgment
```
### Generate

Regarding the generation of custom mob/entity, in view of the excellent properties of the spreadplayers command (the spread range can be customized and there is no need to perform large-scale data operations in the package), the package body simulates natural generation based on this command.

:::tip Note
However, spreadplayers also have certain disadvantages, that is, they cannot spread points into water or lava, which results in this package only being generated on the ground.
:::
Before simulation generation, we should first obtain the upper limit of the corresponding entity generation. We can get this through the feedback module

In each build cycle, we should handle the following events

Let's take the zombie class as an example. First, let's deal with the generation limit

```mcfunction
#Effective chunk number calculation
execute store result score #CustomSpawn.Player .NEKOTEMP run \
    execute if entity @a
execute if score #CustomSpawn.Player .NEKOTEMP matches 2.. as @a at @s run \
    function nkcustomspawn:main/effective_chunk/player
execute if score #CustomSpawn.Player .NEKOTEMP matches 2.. run \
    function nkcustomspawn:main/effective_chunk/0
execute if score #CustomSpawn.Player .NEKOTEMP matches 1 run \
    scoreboard players set #CustomSpawn.Calculate_ChunkCount .NEKOTEMP 289

#Zombie spawn limit
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP = #CustomSpawn.Calculate_ChunkCount .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_ChunkCount .NEKOTEMP
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP *= #ChunkMobCap CustomSpawn_Factor
scoreboard players operation #CustomSPawn.MobCap .NEKOTEMP /= #BasicSpawn CustomSpawn_Factor

#Reading the number of monsters
execute store result score #CustomSpawn.Mob .NEKOTEMP run \
    execute if entity @e[type=#undead]
```
After processing the generation upper limit, if the number of counted entities is lower than the upper limit, a generation plan will be executed.

```mcfunction
#generate
execute if score #CustomSpawn.Mob .NEKOTEMP < #CustomSPawn.MobCap .NEKOTEMP as @a at @s run \
    function nkcustomspawn:main/spawn/temp
```
Due to Java version spreadplayers`maxHeight`Parameters do not support relative positions`~`input, so we use macros to standardize the generated height.

:::tip Note
The purpose of limiting the generation height here is for cave generation. If the height is not restricted, the generation point can only be selected on the surface.
:::

Yes`maxHeight`The parameters are calculated and passed into the macro

```
mcfunction
execute store result score #CustomSpawn.Calculate_temp .NEKOTEMP run data get entity @s Pos[1]
scoreboard players add #CustomSpawn.Calculate_temp .NEKOTEMP 20
execute store result storage nkcustomspawn:data temp int 1 run scoreboard players get #CustomSpawn.Calculate_temp .NEKOTEMP
scoreboard players reset #CustomSpawn.Calculate_temp
function nkcustomspawn:main/spawn/0 with storage nkcustomspawn:data
```
Execute the generated main function

```mcfunction
#Spread generation origin
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
#generate walks
##Distance parameter
scoreboard players set #CustomSpawn.DistanceFactor .NEKOTEMP 80
##WanderingHeight
execute as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    data modify entity @s data.Posy set from entity @s Pos[1]
##Travel times
scoreboard players set #CustomSpawn.WanderingChance .NEKOTEMP 4
execute as @n[type=minecraft:marker,tag=nkcustomspawn] run \
    function nkcustomspawn:main/spawn/wandering
#reset
##Clear mark (there is a strange BUG, ​​but it does not affect the main logic)
kill @e[type=minecraft:marker,tag=nkcustomspawn]
```
generate walks

:::tip Note
This function seems to have some logical bugs, but I haven't found any.

Specifically about line 30`kill @s`, the marker used for marking cannot be completely cleared after execution. If you comment out the`kill @e[type=minecraft:marker,tag=nkcustomspawn]`It can be discovered.
:::

```mcfunction
#Reduce the number of walks by one
scoreboard players remove #CustomSpawn.WanderingChance .NEKOTEMP 1
#Random number generation
execute store result score #CustomSpawn.Roll .NEKOTEMP run \
    random value 0..100
#Generate judgment (probability, distance, spatial judgment)
execute at @s \
    if score #CustomSpawn.Roll .NEKOTEMP <= #CustomSpawn.DistanceFactor .NEKOTEMP \
    unless entity @a[distance=..24] \
    if entity @a[distance=..128] \
    if predicate nkcustomspawn:general/allow_spawn run \
    function nkcustomspawn:main/spawn/main

#generate walks
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    spreadplayers ~ ~ 0.0 5.0 under 256 false @s
#Altitude reset
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    data modify entity @s Pos[1] set from entity @s data.Posy

#Carry out next round of tour
execute unless score #CustomSpawn.SuccessSpawn .NEKOTEMP matches 1 \
    unless score #CustomSpawn.WanderingChance .NEKOTEMP matches ..0 run \
    return run function nkcustomspawn:main/spawn/wandering

#Generate successfully or exit when there are no remaining walks.
##Clear mark (there is a strange BUG, ​​but it does not affect the main logic)
kill @s
##successmark
scoreboard players reset #CustomSpawn.SuccessSpawn .NEKOTEMP
##Reset the number of walks
scoreboard players set #CustomSpawn.WanderingChance .NEKOTEMP 4
##Decrease distance parameter
scoreboard players remove #CustomSpawn.DistanceFactor .NEKOTEMP 20
##WanderingHeight
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
#ground
execute if predicate nkcustomspawn:general/ground run \
    function nkcustomspawn:main/spawn/sub/ground
#water
#execute if predicate nkcustomspawn:general/water run \
    function nkcustomspawn:main/spawn/sub/water
#lava
#execute if predicate nkcustomspawn:general/lava run \
    function nkcustomspawn:main/spawn/sub/lava
```
:::tip Note
This function is used to manage the generated entities, using random numbers to randomly extract entities from the table (this is an example, so only one is written). You can also write a generation predicate for a specific entity here to limit the generation.
:::

```mcfunction
#Random number generation
execute store result score #CustomSpawn.Roll .NEKOTEMP run \
    random value 0..1

#Custom entity data
##test1
execute if score #CustomSpawn.Roll .NEKOTEMP matches 0 run return run \
    function nkcustomspawn:data/test1
```
:::tip Note
Determination of the last step of generation (density determination, that is, the same type of mobs within 9*9chunk cannot exceed a threshold. If successfully generated, the scoring item SuccessSpawn will be marked)
:::

```
#Density determination
execute store result score #CustomSpawn.Density .NEKOTEMP run \
    execute if entity @e[distance=..72,type=minecraft:armor_stand]
#Tag generated successfully
execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    scoreboard players set #CustomSpawn.SuccessSpawn .NEKOTEMP 1
#generate
#execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    summon armor_stand ~ ~ ~ {Glowing:1b}
execute unless score #CustomSpawn.Density .NEKOTEMP matches 9.. run \
    summon husk ~ ~ ~ {NoAI:1b,Glowing:1b}
#Density judgment value clear
scoreboard players reset #CustomSpawn.Density .NEKOTEMP
```
## End

In short, the general process is as above. I wrote it intermittently for a week, and the test results are still good.


Thank you [Mengcha](https://space.bilibili.com/320500029) group friends:

- [@Ethan](https://space.bilibili.com/397069113) 
- u0
- Doom_Decapitator