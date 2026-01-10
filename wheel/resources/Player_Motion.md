---
name: Player Motion
author:
    -
        name: MulverineX
        char: 作者
    -
        name: BigPapi
        char: 原作者
description: 使用精确爆炸操控玩家动量
tags: [动量]
version: 1.4.4
gameversion: [1.21.2~1.21.8]
aside: left
wheel: true
repo: MulverineX/player_motion
cover: https://raw.githubusercontent.com/MulverineX/player_motion/refs/heads/main/logo.png
---

<InfoCard />

本库通过精确地在高空制造爆炸的方式修改玩家的动量。阅读仓库内的说明文件以获取详细信息。

简易的使用方法：

### 在局部坐标上修改动量（`^ ^ ^`）

```mcfunction
# Left/Right
scoreboard players set $x player_motion.api.launch 500
# Above/Below
scoreboard players set $y player_motion.api.launch 12000
# Forward/Backward
scoreboard players set $z player_motion.api.launch -3125

function player_motion:api/launch_local_xyz
```
- `$x`, `$y`, `$z` 的单位为方块/一万游戏刻。例：`$z`=`10000`将会将玩家向其面向的方向施加1方块/游戏刻的动量。
- 必须以目标玩家的身份，在其当前位置执行。

### 在相对坐标上修改动量（`~ ~ ~`）

```mcfunction
scoreboard players set $x player_motion.api.launch 500
scoreboard players set $y player_motion.api.launch 12000
scoreboard players set $z player_motion.api.launch -3125

function player_motion:api/launch_global_xyz
```