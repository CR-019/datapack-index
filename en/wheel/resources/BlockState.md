---
name: BlockState
author:
    -
        name: Triton365
        char: author
description: Use a long loot table to obtain the block and block status of the current location
tags: [block, environment read, block status]
version: 1.1.0
gameversion: [1.19.2-1.21.11]
aside: left
wheel: true
repo: Triton365/BlockState
cover: /datapack-index/wheel/Block_State.gif
---

<InfoCard />

This library adds a very long loot table and uses it to obtain block and block status information at any location.

## Instructions for use

Read its official documentation ([Github](https://github.com/Triton365/BlockState)) for details.

execute anywhere`loot ... loot blockstate:get`An item can be generated. The item's "minecraft:custom_data" stores the block's ID and block status:

```snbt
{"minecraft:custom_data":{Name:"minecraft:...",Properties:{...}}}
```
Example:

```mcfunction
summon item_display ~ ~ ~ {UUID:[I;0,0,0,0]}
execute at @s positioned ~ ~-0.1 ~ run loot replace entity 0-0-0-0-0 contents loot blockstate:get
tellraw @a {"nbt":"item.components.minecraft:custom_data","entity":"0-0-0-0-0"}
kill 0-0-0-0-0
```