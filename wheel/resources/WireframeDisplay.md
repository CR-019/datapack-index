---
name: WireframeDisplay
author:
    -
        name: HalbFettKaese
        char: 作者
description: 允许简便地创建一个类原版线框
tags: [资源包, 着色器]
version: 1.1.0
gameversion: [1.21-1.21.4]
aside: left
wheel: true
repo: Triton365/BlockState
cover: /datapack-index/wheel/WireframeDisplay.png
---

<InfoCard />

一个允许展示实体显示线框的小型资源包。

阅读其官方说明文件（[Github](https://github.com/HalbFettKaese/WireframeDisplay)）以获取详细信息。

示例：
```mcfunction
# 生成白色线框(类似F3 + B):
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# 使用custom_model_data生成红色线框:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white",custom_model_data:{colors:[[1,0,0]]}}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# 生成较粗的白色线框
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white_thick"}} ,transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# 生成黑色线框(类似玩家选择方块时的指示器)
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_black"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}
```