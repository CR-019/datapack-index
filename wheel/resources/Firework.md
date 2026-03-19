---
name: FIREWORK!
author:
    -
        name: Mxpea
        char: 作者
description: 烟花与粒子效果特效库
tags: [视效,粒子]
version: 0.0.2
gameversion: [1.21.11]
aside: left
wheel: true
repo: Mxpea/FIREWORK--datapacks
cover: /datapack-index/wheel/Mxpea_fireworks.png
---

<InfoCard />

一个用于 Minecraft (1.21.11 环境) 的烟花/粒子效果库，提供大量基于函数的特效、字形和烟花召唤逻辑

> [!IMPORTANT]
> 需要前置：[Mxpea's Multiplayer Motion API](./Mxpea_Motion_API.md)

## 主要功能
- 颜色与彩虹循环
  - 周期逻辑：[firework:tick](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/tick.mcfunction)
  - 彩虹色生成：[firework:effects/rainbow/rainbow_color_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/rainbow/rainbow_color_gen.mcfunction)
  - 随机烟花生成
  - 主入口：[firework:run/ran_firework](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/run/ran_firework.mcfunction)
  - 子流程：目录 effects/fireworks_ran/（如 ran_color, ran_color_fade, ran_trail, ran_twinkle, ran_firework_summon, ran_type）
- 粒子 / 像素 / 字符
  - 像素生成：[firework:pixel_square/pixel_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/pixel_square/pixel_gen.mcfunction)
  - 默认尺寸：[firework:pixel_square/size_default](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/pixel_square/size_default.mcfunction)
  - 字符集合：目录 letters/（示例：[firework:letters/a](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/letters/a.mcfunction)）
- 下落方块与环形排布
  - 下落方块：[firework:effects/ran_falling_block/ran_fallingblock_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ran_falling_block/ran_fallingblock_gen.mcfunction)
  - 环形工具：[firework:effects/ring/math](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ring/math.mcfunction)、[firework:effects/ring/poz](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ring/poz.mcfunction)
- 射线与工具支持
  - 射线流程：目录 ray/（ray_gen, ray_step_facing, ray_step_go, ray_step_target, ray_uuid_transform）
  - UUID 工具：[firework:gu/convert](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/gu/convert.mcfunction)、[firework:gu/generate](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/gu/generate.mcfunction)、[firework:tools/uuid_get](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/tools/uuid_get.mcfunction)