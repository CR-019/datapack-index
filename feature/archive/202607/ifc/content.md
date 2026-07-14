---
pageClass: h2-no-border
---

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 图书馆上新 What's New

### 国内节点上线
与@红石中继站​ 合作，香草图书馆的国内节点上线了！  
可以使用https://cr-109.docs.repeater.red/datapack-index/ 访问


## 命令快闪 Command Flashlight

### 警告- item指令的危险性
用一条战利品表交换主手 ⇄ 副手  只需 1 条命令！  核心是利用 slot_source。由于你可以引用槽位并对每个槽位做条件逻辑判断，因此只需检测一个槽位，同时引用另一个槽位；而 mainhand 和 offhand 在槽位编号上是连续的，所以执行下面这条命令就能直接生效：  loot replace entity @s weapon.mainhand loot lib:swap_mainhand_offhand 🎉。

主副手置换战利品表  

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

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。  
答案会在下一期Feature公布。  

本期出题人：徐木弦
:::

---

1. 将最近的标记实体的俯仰角（Rotation[1]）固定为9.6，偏航角（Rotation[0]）以每秒1度的速度每游戏刻连续均匀增大。

---

2. 某玩家想在文本展示实体中变换不同的字符以实现动画效果，因此他定义了一个位图字体`minecraft:arrows`，内容如下：

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

字体实际使用的码位为U+E000至U+E013。对展示实体的操作是这样的：

```mcfunction
execute as @e[type=text_display,tag=arrows] run data modify @s text set value {font:"minecraft:arrows",text:"\ue001"}
```

应用后预期的效果是一个滚动向上的箭头，位图 `minecraft:font/arrows.png` 如图所示：

![](位图字体箭头.png)

实际应用后，字符U+E003至U+E008的显示总是较其他字符有所偏移、无法对齐，尝试分析可能的原因。

---

3. 世界中存在 10 个标记，且函数 `cpp:marker` 中命令的连锁执行数量为 5，执行此命令：

```mcfunction
execute as @e[type=marker] at @s run function cpp:marker
```

要使命令完全执行，`max_command_sequence_length` 的值至少应该是多少？

---

<ColorLine :height="2"/>

### 上期参考答案

> 注：答案并非唯一。能解决问题即可。

题目1：

```
<存档名称>\dimensions\minecraft\the_end\entities\r.0.0.mca
```

---

题目2：

$$\begin{bmatrix}
 -1 & 0 & 0 & 0\\
 0 & -1 & 0 & 0\\
 0 & 0 & -1 & 0\\
 0 & 0 & 0 & 1
\end{bmatrix}$$


---

题目3：

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

## 数据包笑话 Jokes

| | 善良 Good | 中立 Neutral | 邪恶 Evil |
|---|---|---|---|
| **守序 Lawful** | 所有接口都是记分板和 storage，用记分板实现计算，输入输出明确，任何临时变量都必须声明。就算内部再绕，调用方一眼就能看清数据流向。 | 只使用记分板，一切状态都必须编码成整数塞进记分板。所有结构必须按规范严格组织编排，好不好读不重要，规则优先。 | 接口干净就行，为了干净在实现里专门写一层宏。外面看着赏心悦目，里面堆成屎山，反正调用方只碰那一层宏，永远不知道背后有多黑暗。 |
| **中立 Neutral** | 用 storage 做接口，不局限计算方式。内部可以用记分板、execute，甚至一点黑科技辅助，只要最终接口干净、好懂就行。 | 根据具体实现来确定合适的接口。可以用记分板就用，该上 storage 就上，不强求统一，只要文档把接口和数据流写清楚就行。 | 方便第一，为了让别人方便用，接口用 storage。但是为了自己编写方便，里面也塞满了宏。可读性是绝对真理。 |
| **混乱 Chaotic** | 怎么爽怎么写，不刻意设计接口。命名和文件结构乱七八糟，数据满天飞，但文档写得清清楚楚，照着文档就能平安无事。 | 没有接口这个概念。全局记分板起名叫 `tmp`，storage 路径随手写，execute 分支套到天荒地老，但反正能跑，文档在脑子里，代码即真理。 | 上下文 io 也是 io，execute 大数圆规启动，能跑就是胜利。 |


<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
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