---
title: '从宏到 NBT：Minecraft 26.3数据包性能实测'
---


<FeaturedHead
title='从宏到 NBT：Minecraft 26.3数据包性能实测'
authorName='伊桑桑桑桑桑'
/>


## 摘要

在 26.3-snapshot-9 上，我把宏、execute、实体 NBT、storage 和 item modifier 放在同一套框架里做了对照。主要结论：宏缓存命中比宏长短更重要；实体 NBT 贵在整段序列化；modifier 是否划算，要看数据在 score 和 storage 之间怎么走。

**关键词：** 数据包性能、函数宏、execute、NBT、item modifier、命令基准测试

## 测试背景

26.3-snapshot-9 出了一堆核弹爆炸级别的新的运算器，然后想看看是不是真的有那么核弹级别，然后顺便把一些老古董命令也一起拉出来测一遍。

## 宏

这个版本的宏函数有 8 项参数缓存。测了两端：同一参数持续命中，以及 16 组参数循环制造未命中。

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

`@s` 和 UUID 差别在噪声内，多一次 `at` 约 4 score-add unit。

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

纯世界坐标最便宜，局部坐标贵一点，UUID/facing 更贵一点，不过差别不是很大。

另外还测了一些常见的execute小技巧的消耗：

| 几何链 | 增量 score-add unit |
| --- | ---: |
| 眼部锚点后沿局部坐标位移 | 0.61 |
| 从旋转生成方向向量 | 0.91 |
| facing 实体后生成方向向量 | 1.39 |
| 通过归零坐标捕获位置 | 2.30 |
| 物理引擎中的完整 facing 链 | 4.07 |

## 实体 NBT

NBT 测试用新召唤的白板 marker 和 item_display。结果：

| 数据来源与宽度 | score-add unit |
| --- | ---: |
| storage 单 float | 5.47 |
| storage float 列表 | 6.78 |
| marker 单值 | 23.15 |
| marker 列表 | 25.37 |
| marker compound | 25.80 |
| item_display 的 CMD 单 float | 35.56 |
| item_display 的 CMD floats | 37.01 |
| item_display 的完整 CMD component | 37.55 |

## item modifier 算子（核弹？）

“1、3、25”指一次写入 `custom_model_data.floats` 的元素数，不是执行次数。3 个直接常量：

```json
"floats": {
  "values": [1.0, 2.0, 3.0],
  "mode": "replace_all"
}
```

| modifier 测试 | 实际改变的变量 | score-add unit |
| --- | --- | ---: |
| 输出 1 / 3 / 25 个直接常量 | CMD floats 列表宽度为 1 / 3 / 25，不读取 storage | 8.59 / 9.01 / 10.77 |
| 输出 1 / 3 / 25 个 storage 值 | 列表宽度相同，但每个 float 都运行一个 storage provider | 9.93 / 11.13 / 25.52 |
| 8 个常量做 flat / nested sum | 都只输出 1 个 float；比较同一批操作数的 provider 树形 | 8.56 / 9.85 |
| 8 次相同 / 不同 storage path | 都只输出 1 个 float；比较重复路径能否被复用 | 14.30 / 14.24 |

实际上表现平平，没我想象中那么好。虽然本身性能还行，但是实际计算的时候，主要的消耗都浪费在数值读取上了。


## 常见的两个线性运算的不同实现路径的性能比较

modifier 的 number provider 可以直接读分数，所以实际不只有 `storage -> 算法 -> storage` 一种路子。输入和输出各可能是 score 或 storage，组合起来有四种。

#### modifier 怎么读分数

score 输入用 `minecraft:score`，不需要先转 storage：

```json
{
  "type": "minecraft:score",
  "target": {"type": "minecraft:fixed", "name": "#cross_ax"},
  "score": "mcfbench",
  "scale": 0.0001
}
```

#### modifier 的输出路径

modifier 只能把计算结果先写进实体物品的 `custom_model_data`，再整体读回 storage。

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

## `#xx` 的性能优势（几乎没有）

普通长窗口差距约 1%，ABBA 后 `#xx add` 净低约 **2.2%**，这点差异几乎可以忽略。如果自己有什么习惯之类的，遵守原来的习惯就好。

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