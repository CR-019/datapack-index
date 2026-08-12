---
name: Fptrick Impulse
author:
    -
        name: Triton365
        char: author
description: Player momentum modification implemented using magic spells and floating point number black magic
tags: [momentum]
version: 0.2.1
gameversion: [1.21.11]
aside: left
wheel: true
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

This library uses the magic effect added in 1.21.11 to apply any amount of momentum to the player in the relative coordinate system. This library uses floating point magic to convert the relative coordinate system`(~x ~y ~z)`Convert to local coordinate system`(^u ^v ^w)`。

There is no official distribution point for this library. Please[click here to download](https://github.com/CR-019/datapack-index/raw/refs/heads/lib-hosting/libs/fptrick_impulse-2.zip)([Alternate Download](https://gitee.com/Dahesor/server_resourcepacks/raw/lib/fptrick_impulse-2.zip)）。

## Instructions for use

Input the three components of x, y, and z into`fptrick_impulse`scoreboard`#x`,`#y`,`#z`. , and then execute it with this player`function fptrick_impulse:launch_global`。
