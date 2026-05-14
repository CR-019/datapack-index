---
title: '基于新版本模型及模型映射的动画控制器'
---

<FeaturedHead
    title='基于新版本模型及模型映射的动画控制器'
    authorName='雨相日生awa'
    cover = '../_assets/1_cover.png'
/>

:::tip 参见
可见[Sequencer Helper](/feature/archive/202605/6/content.md)，获取辅助使用该插件的工具。
:::

在1.21.11版本中，模型系统解除了“块”仅能绕单轴旋转的限制，使得构建更复杂的模型不再需要多个实体。基于这一特性，我们可以使用[Blockbench](https://www.blockbench.net/)制作动画，并借助[Java Block Sequencer](https://www.blockbench.net/plugins/java_block_sequencer)插件将动画的每一帧导出为独立的模型文件。

## 动画导入

在[模型映射](https://zh.minecraft.wiki/w/物品模型映射)文件中，通过`custom_model_data`的浮点数值来控制不同序号模型文件的显示。这样一来，只需为展示实体[`container.0`](https://zh.minecraft.wiki/w/槽位#Java版) 的物品应用动画所用的模型映射，并动态修改`custom_model_data`，即可在游戏中逐帧调用动画模型。
```json
{
    "model": {
        "type": "range_dispatch",
        "property": "custom_model_data",
        "index": 0,
        "fallback": {
            "type": "model",
            "model": "jujutsu:item/megumi/makora/ambient/0"
        },
        "entries": [
            {
                "model": {
                    "type": "model",
                    "model": " jujutsu:item/megumi/makora/ambient/0"
                },
                "threshold": 0
            },
            {
                "model": {
                    "type": "model",
                    "model": " jujutsu:item/megumi/makora/ambient/1"
                },
                "threshold": 1
            },
            {
                "model": {
                    "type": "model",
                    "model": " jujutsu:item/megumi/makora/ambient/2"
                },
                "threshold": 2
            }
        ]
    }
}
```

## 动画控制器

需要设计一个不产生冲突的条件控制机制，避免后续模型映射覆盖前序映射，同时防止动画跳帧。具体实现如下：
```mcfunction
#函数->load:
scoreboard objectives add tick1 dummy "计时器-控制动画播放的帧数"
scoreboard objectives add tick2 dummy "动画播放的最大帧数"
```
### 物品修饰器 – 将计分板值映射为模型数据（cmd.json）：

可使用[`set_custom_model_data`](https://zh.minecraft.wiki/w/物品修饰器#set_custom_model_data)函数：

```json
{
  "function": "set_custom_model_data",
  "floats": {
    "values": [
      {
        "type": "score",
        "score": "tick1",
        "target": "this",
        "scale": 1
      }
    ],
    "mode": "replace_all"
  }
}
```
### 物品修饰器 – 切换模型映射（模型/动画名称.json）：

```json
[
  {
    "function": "set_components",
    "components": {
      "item_model": "jujutsu:megumi/makora/ambient"
    }
  }
]
```
### 循环动画

```mcfunction
#函数->animation/ambient: #具体动画控制器函数
scoreboard players add @s tick1 1
scoreboard players set @s tick2 24
execute if score @s tick1 > @s tick2 run scoreboard players set @s tick1 0 #循环
item modify entity @s container.0 jujutsu:cmd
item modify entity @s container.0 jujutsu: makora/ambient #更改模型映射
```

### 播放一次/停止于最后一帧

```mcfunction
#函数->animation/xxx/action
scoreboard players set @s tick2 24
item modify entity @s container.0 jujutsu: makora/ambient #更改模型映射
```
```mcfunction
#函数->animation/xxx/main
scoreboard players add @s tick1 1
item modify entity @s container.0 jujutsu:cmd
```
## **优缺点总结**

### 优点：

显著降低性能开销，所有动画仅需一个展示实体即可完成\
使用的命令数量少，逻辑清晰

### 缺点：
动画帧率被限制在 20 fps，无法像 [Animated Java](https://www.blockbench.net/plugins/animated_java) 那样通过插值实现平滑过渡\
使用 Java Block Sequencer 导出模型时，某些块的某一维度长度可能超出原版 $32$ 格的限制，导致动画过程中出现错误方块