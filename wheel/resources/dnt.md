---
name: DNT - NBT操作库
author:
    -
        name: Dahesor
        char: 作者
description: 安全字符串拼接，NBT转JSON等SNBT与字符串操作
tags: [NBT, 字符串]
version: 1.0.1
gameversion: [1.21.5~1.21.11]
aside: left
wheel: true
repo: Dahesor/DNT-Dahesor-NBT-Transformer
---

<InfoCard />

本库允许提供了一些操作SNBT的工具。它可以拼接任意字符串，支持转义字符；也可以将一个NBT结构转换为等价的JSON结构。

阅读其官方说明文件（[Github](https://github.com/Dahesor/DNT-Dahesor-NBT-Transformer) | [红石中继站](https://www.mczwlt.net/resource/ryzp7bof)）以获取更多信息。


**拼接示例：**

输入：[`"Hello"`,`" single ' quote"`,`" and \\ back slash"`]

输出：`"Hello single ' quote and \\ back slash"`

**NBT转JSON示例：**

输入：
```snbt
{equipment:{mainhand:{id:"diamond",components:{"minecraft:item_name":{text:"what\"\"''ha>?",italic:true},"!attribute_modifiers":{},custom_data:{'Cool"\'\\Name':Yeah...}}}}}
```
输出：
```json
{"equipment":{"mainhand":{"components":{"!attribute_modifiers":{},"custom_data":{"Cool\"'\\Name":"Yeah..."},"minecraft:item_name":{"italic":true,"text":"what\"\"''ha>?"}},"id":"diamond"}}}
 ```