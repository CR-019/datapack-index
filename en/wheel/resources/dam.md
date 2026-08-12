---
name: DAM Text Mix Manager
author:
    -
        name: Dahesor
        char: author
description: Allows combining different text component fragments to be displayed together on the actionbar
tags: [text component, UI]
version: 1.3.2
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: Dahesor/Actionbar-Mixer-for-Minecraft
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

This library allows you to combine different text component fragments to display together on the actionbar. This is not a compatibility library, but a functional library.

Read its official documentation ([Github](https://github.com/Dahesor/Actionbar-Mixer-for-Minecraft/blob/main/README.md) | [Redstone Relay](https://www.mczwlt.net/resource/3ou8njeh)) for more information.

## Example:

The player should see it on the actionbar`Hello`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:1",text:{"text":"Hello"},order:1}
function dah.actbar_mixer:new/insert
```

Repeat the above command again, this time using`{id:"test:2",text:{"text":"World!"},order:3}`, the player should see`Hello World!`。

Then run the following command, the player should see`Hey! Hello World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:1",text:{"text":"Hey!"}}
function dah.actbar_mixer:new/prepend
```

Then run the following command, the player should see`Hey! Hello Beautiful World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:beautiful",text:{"text":"Beautiful"},order:2}
function dah.actbar_mixer:new/insert
```

After running the following command, the player should see`Hey! Hello Great World`：
```mcfunction
data modify storage dah:actbar new set value {id:"test:beautiful",text:{"text":"Great"},order:2}
function dah.actbar_mixer:new/update_id
```
