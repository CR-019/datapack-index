---
name: WireframeDisplay
author:
    -
        name: HalbFettKaese
        char: author
description: Allows easy creation of vanilla-like wireframes
tags: [resource pack, shader]
version: 1.1.0
gameversion: [1.21-1.21.4]
aside: left
wheel: true
repo: Triton365/BlockState
cover: /datapack-index/wheel/WireframeDisplay.png
---

<InfoCard />

A small resource pack that allows display of entity display wireframes.

Read its official documentation ([Github](https://github.com/HalbFettKaese/WireframeDisplay)) for details.

Example:

```mcfunction
#Generate white wireframe (similar to F3 + B):
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

#Use custom_model_data to generate red wireframe:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white",custom_model_data:{colors:[[1,0,0]]}}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

#Generates a thicker white wireframe
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white_thick"}} ,transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

#Generate a black wireframe (similar to the indicator when the player selects a block)
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_black"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}
```