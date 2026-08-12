---
pageClass: h2-no-border
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# Second cover
<ColorLine :height="4"/>

## What's New in the Library?

### Domestic nodes go online
In cooperation with @红石综合站, Vanilla Library’s domestic node is online!
Can be usedhttps://cr-109.docs.repeater.red/datapack-index/access


## Command Flashlight Command Flashlight

### Warning - Danger of item directive
Use a loot table to exchange the main hand ⇄ The off-hand only needs 1 command!  The core is to use slot_source. Since you can reference slots and make conditional logic judgments for each slot, you only need to detect one slot and reference another slot at the same time; and mainhand and offhand are consecutive in slot numbers, so executing the following command will take effect directly: loot replace entity @s weapon.mainhand loot lib:swap_mainhand_offhand 🎉.

Main and deputy hand replacement loot table

```json
{
    "pools": [
        {
            "rolls": 1,
            "entries": [
                {
                    "type": "minecraft:alternatives",
                    "children": [
                        {
                            "type": "minecraft:item",
                            "name": "minecraft:stone",
                            "conditions": [
                                {
                                    "condition": "minecraft:entity_properties",
                                    "entity": "this",
                                    "predicate": {
                                        "slots": {
                                            "weapon.offhand": {
                                                "items": "minecraft:air"
                                            }
                                        }
                                    }
                                }
                            ],
                            "functions": [
                                {
                                    "function": "minecraft:discard"
                                }
                            ]
                        },
                        {
                            "type": "minecraft:slots",
                            "slot_source": {
                                "type": "minecraft:slot_range",
                                "source": "this",
                                "slots": "weapon.offhand"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "rolls": 1,
            "entries": [
                {
                    "type": "minecraft:alternatives",
                    "children": [
                        {
                            "type": "minecraft:item",
                            "name": "minecraft:stone",
                            "conditions": [
                                {
                                    "condition": "minecraft:entity_properties",
                                    "entity": "this",
                                    "predicate": {
                                        "slots": {
                                            " weapon.mainhand": {
                                                "items": "minecraft:air"
                                            }
                                        }
                                    }
                                }
                            ],
                            "functions": [
                                {
                                    "function": "minecraft:discard"
                                }
                            ]
                        },
                        {
                            "type": "minecraft:slots",
                            "slot_source": {
                                "type": "minecraft:slot_range",
                                "source": "this",
                                "slots": " weapon.mainhand"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```


<ColorLine :height="2"/>

## I ask you answer Quizs

:::warning This column is not a "you ask and I answer"!
In this column, we will ask several questions, and readers can give their own answers in the comment area (indicate the question number).
The answer will be announced in the next issue of Feature.

The questioner of this issue: Xu Muxian
:::

---

1. The pitch angle (Rotation[1]) of the nearest marked entity is fixed to 9.6, and the yaw angle (Rotation[0]) continues to increase evenly every game tick at a rate of 1 degree per second.

---

2. A player wants to transform different characters in the text display entity to achieve animation effects, so he defines a bitmap font`minecraft:arrows`, the contents are as follows:

```json
{
  "providers": [
    {
      "type": "bitmap",
      "file": "minecraft:font/arrows.png",
      "chars": [
        "\ue000\ue001\ue002\ue003\ue004\ue005\ue006",
        "\ue007\ue008\ue009\ue010\ue011\ue012\ue013"
       ],
      "ascent": 0
    }
  ]
}
```


The actual code points used by the font are U+E000 to U+E013. The operation of displaying the entity is as follows:

```mcfunction
execute as @e[type=text_display,tag=arrows] run data modify @s text set value {font:"minecraft:arrows",text:"\ue001"}
```


The expected effect after application is a scrolling upward arrow, bitmap`minecraft:font/arrows.png`As shown in the picture:

![](../../../../../feature/archive/202607/ifc/位图字体箭头.png)

After actual application, the display of characters U+E003 to U+E008 is always offset from other characters and cannot be aligned. Try to analyze the possible reasons.

---

3. There are 10 markers in the world, and the function`cpp:marker`The number of chain executions of the command is 5. Execute this command:

```mcfunction
execute as @e[type=marker] at @s run function cpp:marker
```


To make the command fully executed,`max_command_sequence_length`What should be the minimum value of ?

---

<ColorLine :height="2"/>

### Reference answers from last issue

> Note: The answer is not unique. Just solve the problem.

Question 1:

```
<存档名称>\dimensions\minecraft\the_end\entities\r.0.0.mca
```


---

Question 2:

$$\begin{bmatrix}
 - 1 & 0 & 0 & 0\\
 0 & -1 & 0 & 0\\
 0 & 0 & -1 & 0\\
 0 & 0 & 0 & 1
\end{bmatrix}$$


---

Question 3:

```
"filter": {
  "block": [
    {
      "namespace": "minecraft",
      "path": "recipe/*"
    }
  ]
}
```


---

## data pack jokes Jokes

| | Good | Neutral | Evil |
|---|---|---|---|
| **Lawful** | All interfaces are scoreboard and storage. Scoreboard is used to implement calculations. The input and output are clear, and any temporary variables must be declared. Even if there are internal loops, the caller can see the data flow clearly at a glance. | Only use scoreboard, all status must be encoded into integers and inserted into scoreboard. All structures must be strictly organized and arranged according to specifications. It does not matter whether they are easy to read or not. Rules take precedence. | As long as the interface is clean, a layer of macros must be written in the implementation to make it clean. It looks pleasing to the eye from the outside, but it's a mountain of shit inside. Anyway, the caller only touches that layer of macros, and never knows how dark it is behind it. |
| **Neutral** | Use storage as an interface, not limited to computing methods. Internally, you can use scoreboard, execute, or even some black technology to assist, as long as the final interface is clean and easy to understand. | Determine the appropriate interface based on the specific implementation. You can use scoreboard as long as you use it, and use storage when needed. We don’t insist on uniformity, as long as the interface and data flow are clearly written in the document. | Convenience comes first. In order to make it convenient for others to use, the interface uses storage. But for the convenience of writing it yourself, it is also filled with macros. Readability is an absolute truth. |
| **Chaotic** | Write as you like, without deliberately designing the interface. The naming and file structure are messy, and data is flying all over the place, but the documentation is clearly written, and you will be fine if you follow the documentation. | There is no concept of interface. Global scoreboard name`tmp`, the storage path is written casually, the execute branch is stuck forever, but it can run anyway, the document is in the mind, and the code is the truth. | Context io is also io, execute is started, and if it can run, it is a victory. |


<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
category="Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="71"
    :strict="false"
    :reactionsEnabled="true"
    emitMetadata="0"
    inputPosition="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy"
    class="giscus-wrapper"
  />
</ClientOnly>
