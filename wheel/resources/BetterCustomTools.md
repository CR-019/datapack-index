---
name: Better Custom Tools
author:
    -
        name: 七柏
        char: 作者
description: 允许用户更简单的配置物品的交互效果
tags: [物品, 自定义]
version: 1.0.0
gameversion: [1.21.4+]
aside: left
wheel: true
repo: Bybycyann/BetterCustomTools
---

<InfoCard />





对多个触发器进行了封装, 用于实现仅配置物品组件就可实现物品交互效果的事件流, 并针对 `use_cooldown` 组件以及道具的主副手逻辑问题与原版做了兼容.

阅读其官方说明文件 ([Github](https://github.com/Bybycyann/BetterCustomTools/blob/main/README_zh.md)) 以获取更多信息。

## 依赖

> [!IMPORTANT]
> Better Custom Tools需要[Player Data Expansion](./PlayerDataExpansion.md)作为前置以管理玩家数据。


以下提供部分说明，可能过时。请以官方文档为准。


## 函数

> *数据包提供了一些函数接口, 但通常为内部调用.*

|        函数        |                             功能                             |                             说明                             |
| :----------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  `#bct:item.get`   |     获取物品数据到 `bct.io stack[-1].CONTEXT.item_data`      |             CONTEXT: {hand: (mainhand\|offhand)}             |
| `#bct:item.update` | 将 `bct:io stack[-1].item_update` 的数据合并到目标物品上 (merge) | CONTEXT: {hand: (mainhand\|offhand)<br />需要向 `bct:io stack[-1].item_update` 中传入待合并的数据 |
|   `#bct:item.cd`   | 获取目标物品的冷却情况, 返回值为 1 (冷却结束) 或 0 (冷却中)  |             CONTEXT: {hand: (mainhand\|offhand)              |
| `#bct:using.exit`  |                   打断一个使用状态 (using)                   |                              -                               |
|    `#bct:macro`    |                        调用一个宏命令                        | 需要向 `bct:io stack[-1].command` 中写入目标命令<br />需要将 `bct:io stack[-1]` 作为宏参数传入 |

## 示例

包内提供了 7 个道具示例, [点击此处查看](https://github.com/Bybycyann/BetterCustomTools/tree/main/data/bct/loot_table).