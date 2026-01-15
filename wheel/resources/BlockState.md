---
name: BlockState
author:
    -
        name: Triton365
        char: 作者
description: 使用超长战利品表获取当前位置的方块与方块状态
tags: [方块, 环境读取, 方块状态]
version: 1.1.0
gameversion: [1.19.2-1.21.11]
aside: left
wheel: true
repo: Triton365/BlockState
cover: /datapack-index/wheel/Block_State.gif
---

<InfoCard />

本库添加了一个超长的战利品表，并以此获取任意位置的方块与方块状态信息。

## 使用说明

阅读其官方说明文件（[Github](https://github.com/Triton365/BlockState)）以获取详细信息。

在任意位置执行`loot ... loot blockstate:get`即可生成一个物品。该物品的"minecraft:custom_data"中存储了该方块的ID与方块状态：

```snbt
{"minecraft:custom_data":{Name:"minecraft:...",Properties:{...}}}
```

示例：
```mcfunction
summon item_display ~ ~ ~ {UUID:[I;0,0,0,0]}
execute at @s positioned ~ ~-0.1 ~ run loot replace entity 0-0-0-0-0 contents loot blockstate:get
tellraw @a {"nbt":"item.components.minecraft:custom_data","entity":"0-0-0-0-0"}
kill 0-0-0-0-0
```