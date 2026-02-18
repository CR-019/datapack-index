---
name: Mxpea's Multiplayer Motion API
author:
    -
        name: Mxpea
        char: 作者
description: 简单的修改非玩家实体动量的数据包
tags: [动量,Motion]
version: 1.3.0
gameversion: [1.20.2-1.21.11]
aside: left
wheel: true
repo: Mxpea/Mxpea-s-Multiplayer-Motion-API
---

<InfoCard />

添加了一些操作非玩家实体Motion的便捷接口，为实体添加不同的tag可以以多种方式控制实体的动量。

由于使用使用标签作为接口，本库的`#tick`函数中有多条`@e[tag=<tag>]`检测，若使用者希望节省性能，可以关闭将其移除`#tick`并在添加tag后手动调用函数。

## 用法

以下说明可能已经过时。请以[官方文档](https://github.com/Mxpea/Mxpea-s-Multiplayer-Motion-API/tree/v1.3.0)为准。

为实体添加如下 Tag 标签即可让该实体向你面向的方向扔出：

`mot`：向你的视线处发射实体；

`random_mot`，`random_mot_mid`，`random_mot_big`：为发射增添随机性，此三种是不同的预设，当然，你也可以在数据包文件中自定义随机性；

`random_exp`：向随机方向发射实体，一次性对多个实体应用可以让他看起来像是爆炸；

`trace`：向最近的玩家发射实体；

`away`：向远离最近的玩家的方向发射实体；

`one_random_mot`：向随机方向发射实体,但它无法为同时对于多个实体提供不同的随机。