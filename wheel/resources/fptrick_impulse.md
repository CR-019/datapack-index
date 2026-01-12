---
name: Fptrick Impulse
author:
    -
        name: Triton365
        char: 作者
description: 使用魔咒与浮点数黑魔法实现的玩家动量修改
tags: [动量]
version: 0.2.1
gameversion: [1.21.11]
aside: left
wheel: true
---

<InfoCard />

本库使用1.21.11添加的魔咒效果，在相对坐标系内为玩家施加任意大小的动量。本库使用浮点数魔法将相对坐标系转换为局部坐标系。

本库无官方分发处。请[点击此处下载](https://github.com/CR-019/datapack-index/raw/refs/heads/lib-hosting/libs/fptrick_impulse_v2-1.zip)。

## 使用说明

将x,y,z三个分量分别输入到`fptrick_impulse`计分板的`#x`,`#y`,`#z`。中，再以该玩家执行`function fptrick_impulse:launch_global`。
