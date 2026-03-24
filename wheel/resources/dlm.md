---
name: 大脸猫
author:
    -
        name: Dahesor
        char: 作者
description: 工单制forceload操作与兼容库
tags: [区块,forceload,区块加载]
version: 1.0.0
gameversion: [1.21.5+]
aside: left
wheel: true
repo: Dahesor/Leopard-Cat
---

<InfoCard />

大脸猫为原版的forceload命令加装了外壳。使用大脸猫时，所有的forceload指令都应当通过大脸猫下达。

用户可以创建请求以加载特定的区块，或指定长方形范围内的多个区块。一个区块上只要挂有至少一个请求，就会被持续加载。

Minecraft的forceload命令是异步的，这意味着在执行forceload后区块可能不会立刻完成加载。大脸猫允许用户提供一个on_load命令列表，在请求的区块全部加载完成后自动执行这些命令。

每个请求也可以指定自己的生命周期。

## 使用说明

阅读其[文档](https://github.com/Dahesor/Leopard-Cat/blob/main/docs/zh_cn.md)以获取使用说明