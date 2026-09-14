---
name: fast_bitwise_ops
author:
    -
        name: Triton365
        char: author
description: Exploit floating point errors for fast bit operations
tags: [bit operations, logic gates]
version: 1.1.0
gameversion: [1.21+]
aside: left
wheel: true
repo: Triton365/fast_bitwise_ops
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

This library exploits floating point errors to perform bit operations quickly. Supports and, or, xor, nand, nor, xnor operations.

## Instructions for use

Read its official documentation ([Github](https://github.com/Triton365/fast_bitwise_ops)) for details.

Example:
```mcfunction
scoreboard players set #input1 fast_bitwise <INPUT1>
scoreboard players set #input2 fast_bitwise <INPUT2>
function fast_bitwise:(and|or|xor|nand|nor|xnor)
scoreboard players get #output fast_bitwise
```
on the scoreboard`fast_bitwise`of`#input1`and`#input2`Input parameters, execute a function, data pack will perform 32-bit specified bit operations, and output the result to`#output`middle.
