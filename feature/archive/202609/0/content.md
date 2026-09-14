---
title: '从宏到 NBT：Minecraft 26.3数据包性能实测'
---

<script setup>
import float from '/.vitepress/vue/nbt/float.vue'
import double from '/.vitepress/vue/nbt/double.vue'
import ns from '/.vitepress/vue/nbt/namespace.vue'
import obj from '/.vitepress/vue/nbt/object.vue'
import homolist from '/.vitepress/vue/nbt/homolist.vue'
import bool from '/.vitepress/vue/nbt/boolean.vue'
</script>

<FeatureHead
title='从宏到 NBT：Minecraft 26.3数据包性能实测'
authorName='伊桑桑桑桑桑'
/>


本文将函数宏、<cmd c="execute"/>、实体NBT、storage和物品修饰器放在同一套框架里做了性能对照。\
主要结论：宏缓存命中对性能的影响比比宏命令的长短更重要；实体的主要花销来自于其序列化过程；物品修饰器是否划算，则取决于如何从记分板或storage中读取数据。

**关键词：** 数据包性能、函数宏、execute、NBT、物品修饰器、命令基准测试

> [!TIP]编者注
> 由于本文撰写于26.3快照版本，<cmd c="compute"/>命令加入之前，因此其中部分方案和内容已过时。读者应当自行分辨

## 测试背景

26.3-snapshot-9 出了一堆核弹爆炸级别的新的运算器，然后想看看是不是真的有那么核弹级别，然后顺便把一些老古董命令也一起拉出来测一遍。

所有性能的单位均为`score-add unit`。即为该开销约等于多少条`scoreboard players add #target ...`记分板命令。

## 宏

宏函数有**8**项参数缓存。同时测试了两种情况：同一参数持续命中，以及 16 组参数循环制造未命中。

| 写法 | 缓存状态 | score-add unit |
| --- | --- | ---: |
| `$tp $(x) $(y) $(z)` | 命中 | 16.13 |
| `$execute positioned ... run function tp_here` | 命中 | 19.36 |
| `$execute positioned ... run function tp_here` | 无缓存 | 31.88 |
| `$tp $(x) $(y) $(z)` | 无缓存 | 78.31 |
| `$execute positioned ... run tp ...` | 无缓存 | 87.81 |

在无缓存的 positioned/function 宏上继续加上下文：

| 新增内容 | 总成本 | 相对基础宏的增量 |
| --- | ---: | ---: |
| 无 | 31.88 | 0 |
| `at UUID` | 36.04 | 4.16 |
| `at @s` | 36.30 | 4.42 |

`@s` 和 UUID 差别在噪声内，多一次 `at` 约4 `score-add unit`。

## execute 子命令

| 新增 execute 子命令 | 增量 score-add unit |
| --- | ---: |
| `positioned <世界坐标>` | 0.40 |
| `anchored eyes` | 0.45 |
| `positioned as @s` | 0.46 |
| `at @s` | 0.46 |
| `rotated as @s` | 0.49 |
| `align xyz` | 0.49 |
| `rotated as UUID` | 0.62 |
| `at UUID` | 0.64 |
| `positioned ^ ^ ^` | 0.80 |
| `facing entity UUID feet` | 1.49 |

最便宜的是`positioned <世界坐标>`。局部坐标要贵一点，而UUID和`facing`则更贵一写，不过差别不是很大。

另外还测了一些常见的execute小技巧的消耗：

| 几何链 | 增量 score-add unit |
| --- | ---: |
| 眼部锚点后沿局部坐标位移 | 0.61 |
| 从旋转生成方向向量 | 0.91 |
| facing 实体后生成方向向量 | 1.39 |
| 通过归零坐标捕获位置 | 2.30 |
| 物理引擎中的完整 facing 链 | 4.07 |

## NBT

NBT 测试包含了Storage，以及<ns t="marker"/>和<ns t="item_display"/>实体。结果：

| 数据来源与类型 | score-add unit |
| --- | ---: |
| **`storage`**; <float t="float"/> | 5.47 |
| **`storage`**; <homolist t="floats"/> | 6.78 |
| <ns t="marker"/>; <nbt :i="['byte','short','int','long','float','double']" t="单值" /> | 23.15 |
| <ns t="marker"/>; <homolist t="列表"/> | 25.37 |
| <ns t="marker"/>; <obj t="复合标签"/> | 25.80 |
| <ns t="item_display"/>; <obj t="custom_model_data"/>单float | 35.56 |
| <ns t="item_display"/>; <obj t="custom_model_data"/>列表 | 37.01 |
| <ns t="item_display"/>; <obj t="custom_model_data"/>复合标签 | 37.55 |

## 物品修饰器

测试内容为将不同来源的数据写入<obj t="custom_model_data"/>**.**<float t="floats"/>。

首先是直接输入硬编码的常量。

| 写入数量 | score-add unit |
| --- | --- |
| 1 | $8.59$ |
| 3 | $9.01$ |
| 25 | $10.77$ |

其次是来自storage的数值

| 写入数量/来源 | score-add unit |
| --- | --- |
| 1 | $9.93$ |
| 3 | $11.13$ |
| 25 | $25.52$ |
| 8（浅层路径）| $8.56$ |
| 8（深层路径） | $9.85$ |
| 8（路径重复）| $14.30$ |
| 8（路径不同） | $14.24$ |

*可以注意到读取重复路径的数值没有优化。*

实际上表现平平，没我想象中那么好。虽然本身性能还行，但是实际计算的时候，主要的消耗都浪费在数值读取上了。


## 常见的两个线性运算的不同实现路径的性能比较

物品修饰器的数值提供器可以直接读分数。输入和输出各可能是记分板或storage，因此组合起来共有四种可能的路径。

数值提供器<ns t="minecraft:score"/>可以直接读取分数：

```json
{
  "type": "minecraft:score",
  "target": {"type": "minecraft:fixed", "name": "#cross_ax"},
  "score": "mcfbench",
  "scale": 0.0001
}
```

#### modifier 的输出路径

modifier 只能把计算结果先写进实体物品的<obj t="custom_model_data"/>，再整体读回 storage。

如果最后要 score，还要再转一次：

```text
score -> modifier -> custom_model_data -> storage
score -> modifier -> custom_model_data -> storage -> score
```

回读命令：

```mcfunction
data modify storage mcfbench:state algorithm.output set from entity 00000000-0000-0000-0000-000000000069 item.components."minecraft:custom_model_data"
```

单独看这几段 I/O 的成本：

- 3 个 score provider 的 modifier：`0.134354 MSPT`
- 3 个 score 直接写 storage：`0.145921 MSPT`
- 完整 CMD 从实体回读 storage：`0.419639 MSPT`

#### 两个线性运算的对比

我拿三维叉乘和世界向量转局部 UVW 当例子，对比了基准用 out-of-place scoreboard、lalib plain/high/high_high 和 item modifier。

这里的 out-of-place scoreboard 是直接使用扩大10000倍率的记分板，但输入只读，结果写到另一组记分板假名，然后连续调用时省去了恢复输入。lalib 原函数是原地运算，会覆盖输入；为了让同一组数据连续测试 128 次，lalib case 在每次调用前额外复制了输入。所以下表中两者的差值包含这部分复位成本。

测试向量：

```text
cross((1.25, -2.5, 3.75), (-4, 0.5, 2))
  = (-6.875, -17.5, -9.375)

world_to_local((1.25, -2.5, 3.75))
  = (3.25, -0.65, 3.3)
```

叉乘结果：

| 实现 | score -> score | score -> storage | storage -> score | storage -> storage |
| --- | ---: | ---: | ---: | ---: |
| 基准用 out-of-place scoreboard | **0.329164** | **0.491642** | **0.561482** | 0.730460 |
| lalib plain | 0.466636 | 0.621504 | 0.700771 | 0.862069 |
| lalib high | 0.955110 | 1.114827 | 1.203369 | 1.360544 |
| lalib high_high | 1.941748 | 2.100840 | 2.178649 | 2.352941 |
| item modifier | 0.727802 | 0.600962 | 0.900090 | **0.717360** |

世界向量转局部 UVW 结果：

| 实现 | score -> score | score -> storage | storage -> score | storage -> storage |
| --- | ---: | ---: | ---: | ---: |
| 基准用 out-of-place scoreboard | **0.472144** | 0.628931 | **0.927644** | 1.090513 |
| lalib plain | 0.691085 | 0.851064 | 1.166861 | 1.328021 |
| lalib high | 1.349528 | 1.512859 | 1.855288 | 2.000000 |
| item modifier | 0.758150 | **0.627353** | 0.947867 | **0.811688** |

#### 结果

- score 进、score 出：out-of-place scoreboard 实现最快。叉乘 `score -> score` 大约是 modifier 的 45.2%，局部转换约 62.3%。
- storage 进、storage 出：叉乘基本持平，局部转换 modifier 快约 25.6%。
- score 进、storage 出：几乎没差别。

所以建议：

1. 分数进分数出的时候，直接用 scoreboard。modifier 虽然能读分数，但结果要先写回实体再读出来，绕一圈一般不划算。
2. storage 进 storage 出的时候，modifier 只在计算树比较宽的时候才有明显优势。局部转换能快约 25.6%，叉乘上基本没差别。

## `#xx` 的性能优势

经过测试，类似于`#xx`的分数持有者略有性能优势，约1%到2%，这点差异几乎可以忽略。如果自己有什么习惯之类的，遵守原来的习惯就好。

## 测试方法

环境是官方 26.3-snapshot-9 服务端、Java 25、无玩家、固定强加载区块。每个测试项每 tick 重复 128 次目标操作，整个包 112 项，每项先预热 400 tick，再跑 5 轮 2000 tick 的 `/tick sprint`，取中位数。

低成本操作另外拉长了窗口，scoreboard 是 9 轮 × 20000 tick；`#xx` 和 `xx` 用 ABBA 顺序跑 3 轮 × 50000 tick；execute 子命令跑 7 轮 × 10000 tick；item modifier 完整算法预热 1000 tick 后跑 7 轮 × 5000 tick。

为了方便对比，用 `scoreboard players add #xx ... 1` 的净成本作为单位：

```text
score-add unit = (测试项 MSPT - 空载 MSPT) / (score-add MSPT - 空载 MSPT)
```

所有测试项每 tick 的重复次数都一样，所以这个比值可以理解成“单次操作大约等于多少次 scoreboard add”。绝对 MSPT 只对本机有意义，同轮测试里的相对差异更值得看。

### 实际测试代码

下面实际跑的数据包片段按测试类别分块。

#### 公共外壳

每个测试项都有独立的 scheduled loop，case 由生成器展开 128 次，不是测量时再用宏或递归制造循环。拿宏缓存未命中项举例：

```mcfunction
execute if score #case mcfbench matches 10 as 00000000-0000-0000-0000-000000000066 at @s run function mcfbench:case/macro/positioned_function_thrash
execute if score #case mcfbench matches 10 run schedule function mcfbench:loop/macro/positioned_function_thrash 1t replace
```

空载基准保留同样的判断、函数调用和 schedule 外壳。比如 score-add 基准文件里，下面这一行连续出现 128 次：

```mcfunction
scoreboard players add #xx mcfbench 1
```

#### 宏测试

宏对照用的两个函数：

```mcfunction
# mcfbench:macro/tp_direct
$tp 00000000-0000-0000-0000-000000000065 $(x) $(y) $(z)
```

```mcfunction
# mcfbench:macro/positioned_function
$execute positioned $(x) $(y) $(z) run function mcfbench:primitive/tp_here
```

后者调用的普通函数不含宏：

```mcfunction
# mcfbench:primitive/tp_here
tp 00000000-0000-0000-0000-000000000065 ~ ~ ~
```

hot 测试连续传入同一个 compound；thrash 测试依次读取 16 个 compound。下面是实际文件的前四行，索引继续到 `[15]` 后再循环，共执行 128 次：

```mcfunction
function mcfbench:macro/positioned_function with storage mcfbench:state macro_args[0]
function mcfbench:macro/positioned_function with storage mcfbench:state macro_args[1]
function mcfbench:macro/positioned_function with storage mcfbench:state macro_args[2]
function mcfbench:macro/positioned_function with storage mcfbench:state macro_args[3]
```

#### execute 测试

execute 测试只改变待测子命令，尾命令保持不变：

```mcfunction
# execute/tail
scoreboard players add #probe mcfbench 1

# execute/at_uuid
execute at 00000000-0000-0000-0000-000000000066 run scoreboard players add #probe mcfbench 1
```

实际物理几何链按生产写法测试，例如：

```mcfunction
execute positioned ~ ~0.9 ~ facing entity 00000000-0000-0000-0000-000000000069 feet positioned 0. 0. 0. run tp 00000000-0000-0000-0000-000000000065 ^ ^ ^1
```

#### NBT 对照

NBT 对照写入同一个 storage sink，只有数据来源不同：

```mcfunction
# item_display 的 custom_model_data 单 float
data modify storage mcfbench:state sink set from entity 00000000-0000-0000-0000-000000000069 item.components."minecraft:custom_model_data".floats[0]

# storage 单 float
data modify storage mcfbench:state sink set from storage mcfbench:state values[0]
```

#### item modifier

单 storage provider 文件如下，通过 `item modify entity <UUID> contents mcfbench:storage_1` 调用：

```json
{
  "type": "minecraft:set_custom_model_data",
  "floats": {
    "values": [
      {
        "type": "minecraft:storage",
        "storage": "mcfbench:state",
        "path": "values[0]"
      }
    ],
    "mode": "replace_all"
  }
}
```

宽度和 provider 树形测试只扩展 `values` 或 `operands`，实体、物品槽位、调用次数和循环外壳都保持一致。

## 数据包开发建议

1. 高频数据尽量留在 scoreboard 或 storage，少碰实体 NBT。实体 NBT 的大头是读取和序列化实体。
2. 宏先看缓存，再看长度。参数能稳定命中缓存时，宏直接执行很快；参数经常变化时，要把宏行的语法树尽可能压小（约等于长度变短），比如把命令放进function，把 `at @s` `positioned` 之类的固定上下文放到宏行外，等等。
3. 普通的 `positioned`、`rotated`、`align` 非常便宜，实体解析和 `facing entity` 略贵，但仍然很便宜。
4. 对于新出的物品修饰器计算器：score 进 score 出，直接用 scoreboard；storage 进 storage 出，且乘加树足够宽，或者有精度/溢出处理需求才考虑物品修饰器。
5. `#xx`、holder 名称只有百分之几的差距，按习惯写就好。少读一次实体 NBT，通常比改一大片假名更有用。
6. 不要过度优化。有时候改一下算法能省出几百甚至几千条scb add，扣写法可能也就省出几十条，不要老是纠结于一点微小差异不放。