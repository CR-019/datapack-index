---
name: Fast Bitwise OPs
author:
    -
        name: Triton365
        char: 作者
description: 利用浮点数误差快速进行位操作
tags: [位操作, 逻辑门]
version: 1.1.0
gameversion: [1.21+]
aside: left
wheel: true
repo: Triton365/fast_bitwise_ops
---

<InfoCard />

本库利用浮点数误差快速地进行位操作。支持and, or, xor, nand, nor, xnor运算。

## 使用说明

阅读其官方说明文件（[Github](https://github.com/Triton365/fast_bitwise_ops)）以获取详细信息。

示例：
```mcfunction
scoreboard players set #input1 fast_bitwise <INPUT1>
scoreboard players set #input2 fast_bitwise <INPUT2>
function fast_bitwise:(and|or|xor|nand|nor|xnor)
scoreboard players get #output fast_bitwise
```
分别在计分板`fast_bitwise`的`#input1`与`#input2`中输入参数，执行一个函数，数据包就会进行32位的指定位运算，并将结果输出至`#output`中。