---
name: PlayerMotion
author:
    -
        name: MulverineX
        char: author
    -
        name: BigPapi
        char: original author
description: Manipulate player momentum using precise explosions
tags: [momentum]
version: 1.4.4
gameversion: [1.21.2~1.21.8]
aside: left
wheel: true
repo: MulverineX/player_motion
cover: /datapack-index/wheel/Player_Motion.png
---

<InfoCard />

This library modifies the player's momentum by accurately creating explosions at high altitudes. Read the documentation in the repository for details.

Easy to use:

### Modify momentum on local coordinate (`^ ^ ^`）

```mcfunction
# Left/Right
scoreboard players set $x player_motion.api.launch 500
# Above/Below
scoreboard players set $y player_motion.api.launch 12000
# Forward/Backward
scoreboard players set $z player_motion.api.launch -3125

function player_motion:api/launch_local_xyz
```

- `$x`, `$y`, `$z`The unit is block/10,000 game ticks. example:`$z`=`10000`Will apply 1 block/game tick of momentum to the player in the direction it is facing.
- Must be executed as the target player, at its current location.

### Modify momentum on relative coordinate (`~ ~ ~`）

```mcfunction
scoreboard players set $x player_motion.api.launch 500
scoreboard players set $y player_motion.api.launch 12000
scoreboard players set $z player_motion.api.launch -3125

function player_motion:api/launch_global_xyz
```