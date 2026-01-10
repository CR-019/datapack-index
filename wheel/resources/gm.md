---
name: gm
author:
    -
        name: gibbsly
        char: 作者
description: 浮点数与三角函数数学库
tags: [浮点数, 三角函数, 数学]
version: 1.0
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: gibbsly/gm
---

<InfoCard />

gm是一个可以进行浮点数与三角函数计算的简易数学库。

## 单输入函数

这些函数需要`{x:(number)}`作为宏输入。输出会被写入进storage `gm:io` `out`，同时也会作为int返回。

### `gm:negate`

> 取负数。`x * -1`

### `gm:reciprocal`

> 取倒数。`1 / x`

### `gm:square`

> 取平方。`x^2`

### `gm:sqrt`

> 取开放。`√x`

### `gm:sin`

> 取正弦。`sin(x)`

### `gm:cos`

> 取余弦。`cos(x)`

### `gm:tan`

> 取正切。`tan(x)`

同时将sin的结果写入`storage gm._temp_:std var1`，cos的结果写入`storage gm._temp_:std var2`。

### `gm:arcsin`

> 取反正弦。`sin⁻¹(x)`

`-90 ≤ sin⁻¹(x) ≤ 90`, `-1 ≤ x ≤ 1`

### `gm:arccos`

> 取反余弦。`cos⁻¹(x)`

`0 ≤ cos⁻¹(x) ≤ 180`, `-1 ≤ x ≤ 1`

### `gm:arctan`

> 取反正切。`tan⁻¹(x)`

`-90 ≤ tan⁻¹(x) ≤ 90`

### `gm:round`

> 取整`round(x)`

取整至最近的整数。`0.5`会向上取整。

### `gm:floor`

> 向下取整。`floor(x)`

### `gm:ceil`

> 向上取整。`ceil(x)`

## 双输入函数

这些函数需要两个变量`{x:(number),y:(number)}`作为宏输入。输出会被写入进storage `gm:io` `out`，同时也会作为int返回。

### `gm:add`

> 相加。`x + y`

### `gm:subtract`

> 相减。`x - y`

### `gm:multiply`

> 相乘。`x * y`

### `gm:divide`

> 相除。

#### 本函数有两个功能

若`x`为数值

> 求`x / y`

若`x`为数组

> 求`[0] / y, [1] / y, [2] / y`

只使用x的前三个值。结果将作为数组输出值storage中。函数将会返回该数组的长度。

### `gm:modulo`

> 求余。`x % y`

y不可为0

### `gm:distance`

> 获取`x`与`y`的距离

x与y应当是数组而非单独的数值。任意不符合条件的输入会使输出为0。

### `gm:arctan2`

> `atan2(y, x)`

和`tan⁻¹(y/x)`类似，但`-180 ≤ atan2(y, x) ≤ 180`。本函数有360°的输出范围而非180°。