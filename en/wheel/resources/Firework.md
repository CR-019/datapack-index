---
name: FIREWORK!
author:
    -
        name: Mxpea
        char: author
description: Fireworks and particle effects library
tags: [visual effects, particles]
version: 0.0.2
gameversion: [1.21.11]
aside: left
wheel: true
repo: Mxpea/FIREWORK--datapacks
cover: /datapack-index/wheel/Mxpea_fireworks.png
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />

A firework/particle effects library for Minecraft (1.21.11 environment), providing a large number of function-based special effects, glyphs and firework summoning logic

> [!IMPORTANT]
> Requires prerequisite: [Mxpea's Multiplayer Motion API](/en/wheel/resources/Mxpea_Motion_API)

## Main functions
- Color and rainbow cycle
  - Periodic logic: [firework:tick](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/tick.mcfunction)
  - Rainbow color generation: [firework:effects/rainbow/rainbow_color_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/rainbow/rainbow_color_gen.mcfunction)
  - Random fireworks generation
  - Main entrance: [firework:run/ran_firework](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/run/ran_firework.mcfunction)
  - Subprocess: Directory effects/fireworks_ran/ (such as ran_color, ran_color_fade, ran_trail, ran_twinkle, ran_firework_summon, ran_type)
- Particles / Pixels / Characters
  - Pixel generation: [firework:pixel_square/pixel_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/pixel_square/pixel_gen.mcfunction)
  - Default size: [firework:pixel_square/size_default](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/pixel_square/size_default.mcfunction)
  - Character collection: directory letters/ (Example: [firework:letters/a](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/letters/a.mcfunction)）
- Drop block and circular arrangement
  - Falling block: [firework:effects/ran_falling_block/ran_fallingblock_gen](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ran_falling_block/ran_fallingblock_gen.mcfunction)
  - Ring tool: [firework:effects/ring/math](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ring/math.mcfunction)、[firework:effects/ring/poz](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/effects/ring/poz.mcfunction)
- Ray and tool support
  - Ray process: directory ray/(ray_gen, ray_step_facing, ray_step_go, ray_step_target, ray_uuid_transform)
  - UUID tool: [firework:gu/convert](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/gu/convert.mcfunction)、[firework:gu/generate](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/gu/generate.mcfunction)、[firework:tools/uuid_get](https://github.com/Mxpea/FIREWORK--datapacks/blob/main/firework/data/firework/function/tools/uuid_get.mcfunction)
