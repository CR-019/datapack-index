---
title: '更好的右键检测：减半法'
---

<FeatureHead
    title='更好的右键检测：减半法'
    authorName='伊桑桑桑桑桑'
/>


让我们来看一个右键检测的性能改进方案:

# 右键检测（减半法）
在开始之前我们先做个实验：假如一个记分板数值一开始为$\color{blue}0$，每次都先加上$\color{blue}4$，再整除以$\color{blue}2$，看看会发生什么：

- 初始：$\color{blue}0$
- $0+4=4$，$4 \div 2=\color{blue}2$
- $2+4=6$，$6 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- ...

你会发现，最后的值似乎一直是$\color{blue}3$。\
如果我们不继续加$4$，会怎么样？

- 初始：$\color{blue}0$
- $0+4=4$，$4 \div 2=\color{blue}2$
- $2+4=6$，$6 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3 \div 2=\color{blue}1$
- $1 \div 2=\color{blue}0$
- $0 \div 2=\color{blue}0$
- ...


如果我们不继续加$4$，这个值就会从$3$变为$1$，然后回到一开始的$0$
有没有发现什么蹊跷？\
我们直接看结果的数字：

$\color{blue}0$\
$\color{blue}2$\
$\color{blue}3$\
$\color{blue}3$\
$\color{blue}3$\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$

会发现，在值加$4$的这段时间里，这个值的样子就会是$23331$，也就是开始为$2$，中间为$3$，结束为$1$。
也就是说，我们只要在按下右键的时候加上$4$，之后不断整除以$2$，就可以得到右键的状态。这就是“减半法”名字的由来。

但是熟悉命令的玩家就会说，右键检测进度这个东西很不稳定，经常会断触。
这样在长按期间就会因为断触导致检测到结束后又立即开始
那么这个方法就不能用了吗？
并不是，我们可以把流程里的加$4$改成加$6$：

$\color{blue}0$\
$\color{blue}3$\
$\color{blue}4$\
$\color{blue}5$\
$\color{blue}5$\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$

如果值为$3$，就说明开始长按右键
如果值为$1$，就说明松开右键
否则只要不是$0$，就说明正在长按右键
但是又有人会说，那我按一下立刻松开会怎么样？

$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$

按的时间再长一点呢？

$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}4$ 🕹️\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$

如果断触呢？

$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}4$ 🕹️\
$\color{blue}5$ 🕹️\
$\color{blue}2$\
$\color{blue}5$ 🕹️\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$

你会发现，只要$+3$或者$+4$后$\div 2$，无论怎么做，这个值都是以$2$或$3$开始，以$1$结束的。只有整除以2才能满足这个性质，这也是为什么它叫做“减半法”。\
这是为什么呢？在这个过程中，只有$3$和$2$整除以$2$会得到$1$，其他的数字都不会。而其他的数字在多次整除以$2$之后，最终一定会回到$2$。\
篇幅限制，本期视频不进行严格的数学证明。如果感兴趣可以自行证明。

接下来贴出完整的代码，不做进一步的解释了
```bash
# example:rmb/using_item
# ...右键运行example:rmb/run的进度

# example:load
scoreboard objectives add rmb_flag dummy
scoreboard objectives add example dummy
scoreboard players set 2 example 2

# example:rmb/run
scoreboard players add @s rmb_flag 4
advancement revoke @s only example:rmb/using_item

# example:tick
execute as @a at @s run function example:rmb/player_tick

# example:rmb/player_tick
scoreboard players operation @s rmb_flag /= 2 example
execute if score @s rmb_flag matches 2 run say 开始长按右键
execute if score @s rmb_flag matches 3 run say 正在长按右键
execute if score @s rmb_flag matches 1 run say 松开右键
```

# 小结
本期教程我们学习了一种高性能的右键检测方案——减半法。涉及到的知识点有：

- 减半法：
  - 利用整数除法的特性，通过 $(当前值 + 输入值) \div 2$ 的公式，在一个变量内完成状态流转
  - 如果需要断触保护，只需要修改数字，不需要添加新的逻辑

- 状态映射表

    | 方案     | 值 | 含义            |
    |----------|----|----------------|
    | $+4$减半 | $2$  | 开始按下右键  |
    |          | $3$  | 正在长按右键  |
    |          | $1$  | 松开右键      |
    |          | $0$  | 无操作        |
    | $+6$减半 | $3$  | 开始按下右键   |
    |          | $1$  | 松开右键      |
    |          | $0$  | 无操作        |
    |          |其它值| 正在长按右键   |

- 计分板运算
  - 常量设置：计分板运算不支持直接除以数字，必须先设置一个“常量分数”（如设置`example`分数为`2`）作为除数。
  - 运算指令：
    - 输入信号：`scoreboard players add @s rmb_flag 4`（在进度触发的函数中执行）
    - 状态衰减：`scoreboard players operation @s rmb_flag /= 2 example`（在Tick函数中执行）