---
name: Better Custom Tools
author:
    -
        name: Qipai
        char: author
description: Allows users to more easily configure the interactive effects of items
tags: [item, custom]
version: 1.0.0
gameversion: [1.21.4+]
aside: left
wheel: true
repo: Bybycyann/BetterCustomTools
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />





Multiple triggers are encapsulated to implement an event flow that can achieve item interaction effects by configuring only the item component, and for`use_cooldown`The primary and secondary logic issues of components and props are compatible with vanilla.

Read its official documentation ([Github](https://github.com/Bybycyann/BetterCustomTools/blob/main/README_zh.md)) for more information.

## rely

> [!IMPORTANT]
> Better Custom Tools requires [Player Data Expansion](/en/wheel/resources/PlayerDataExpansion) as a frontend to manage player data.


Some instructions are provided below and may be out of date. Please refer to the official documentation.


## function

> *data pack provides some function interfaces, but they are usually called internally.*

| function | function | description |
| :----------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  `#bct:item.get`| Get item data to`bct.io stack[-1].CONTEXT.item_data`      |             CONTEXT: {hand: (mainhand\|offhand)}             |
| `#bct:item.update`| will`bct:io stack[-1].item_update`The data is merged into the target item (merge) | CONTEXT: {hand: (mainhand\|offhand)<br />Needs to`bct:io stack[-1].item_update`Pass in the data to be merged |
|   `#bct:item.cd`| Get the cooling status of the target item, the return value is 1 (cooling ended) or 0 (cooling in progress) | CONTEXT: {hand: (mainhand\|offhand) |
| `#bct:using.exit`| Interrupt a usage state (using) | - |
|    `#bct:macro`| Call a macro command | Need to`bct:io stack[-1].command`To write the target command<br /> you need to`bct:io stack[-1]`Passed in as macro parameter |

## Example

7 sample props are provided in the package, [click here to view](https://github.com/Bybycyann/BetterCustomTools/tree/main/data/bct/loot_table).
