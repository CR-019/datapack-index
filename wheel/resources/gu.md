---
name: gu
author:
    -
        name: gibbsly
        char: 作者
description: 简易的UUID数组至十六进制字符串转换器
tags: [数学, UUID]
version: 1.0
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: gibbsly/gu
---

<InfoCard />

gu是一个简易的底层库，可以将数组格式的UUID转换为带连字符的十六进制字符串格式。本库将允许你实现直接使用UUID选择实体，或是在实体未被加载时更改其分数等等功能。

> `gu:generate` - 将执行者的UUID转换为带连字符的十六进制字符串格式后。将结果写入storage `gu:main out`

> `gu:convert` - 给本宏函数提供类似`{UUID:[I;0,1,2,3]}`的输入，函数会将其转换为带连字符的十六进制字符串格式，并将结果写入storage `gu:main out`