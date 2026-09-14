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
repo: HalbFettKaese/WireframeDisplay
cover: /datapack-index/wheel/WireframeDisplay.png
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

A small resource pack that allows display of entity display wireframes.

Read its official documentation ([Github](https://github.com/HalbFettKaese/WireframeDisplay)) for details.

Example:
```mcfunction
# Generate a white wireframe similar to F3 + B:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# Generate a red wireframe with custom model data:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white",custom_model_data:{colors:[[1,0,0]]}}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# Generate a thicker white wireframe:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_white_thick"}} ,transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}

# Generate a black wireframe similar to the block-selection outline:
/execute align xyz run summon item_display ~ ~ ~ {item: {id:"coal",components: {"minecraft:item_model":"wireframe:wireframe_black"}}, transformation:{scale:[1f,1f,1f],left_rotation:[0f,0f,0f, 1f],right_rotation:[0f,0f,0f,1f],translation:[0.5,0.5,0.5]}}
```
