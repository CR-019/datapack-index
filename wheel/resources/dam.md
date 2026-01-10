---
name: DAM文本混合管理器
author:
    -
        name: Dahesor
        char: 作者
description: 允许组合不同的文本组件片段一起显示在actionbar上
tags: [文本组件, UI]
version: 1.3.2
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: Dahesor/Actionbar-Mixer-for-Minecraft
---

<InfoCard />

本库允许你组合不同的文本组件片段一起显示在actionbar上。这并不是兼容用库，而是功能库。

阅读其官方说明文件（[Github](https://github.com/Dahesor/Actionbar-Mixer-for-Minecraft/blob/main/README.md) | [红石中继站](https://www.mczwlt.net/resource/3ou8njeh)）以获取更多信息。

## 示例：

玩家应该会在 actionbar 上看到 `Hello`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:1",text:{"text":"Hello"},order:1}
function dah.actbar_mixer:new/insert
```

再次重复上述命令，这次使用 `{id:"test:2",text:{"text":"World!"},order:3}`，玩家应该会看到 `Hello World!`。

然后运行如下命令，玩家应该会看到 `Hey! Hello World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:1",text:{"text":"Hey!"}}
function dah.actbar_mixer:new/prepend
```

接着运行如下命令，玩家应看到 `Hey! Hello Beautiful World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:beautiful",text:{"text":"Beautiful"},order:2}
function dah.actbar_mixer:new/insert
```

之后运行如下命令，玩家应看到 `Hey! Hello Great World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:beautiful",text:{"text":"Great"},order:2}
function dah.actbar_mixer:new/update_id
```