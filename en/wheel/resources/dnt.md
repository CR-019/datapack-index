---
name: DNT - NBT operation library
author:
    -
        name: Dahesor
        char: author
description: Secure string splicing, NBT to JSON and other SNBT and string operations
tags: [NBT, string]
version: 2.0.0
gameversion: [1.21.5~26.1]
aside: left
wheel: true
repo: Dahesor/DNT-Dahesor-NBT-Transformer
---

<InfoCard />

This library allows to provide some tools for operating SNBT. It can splice any string and supports escape characters; it can also convert an NBT structure into an equivalent JSON structure.

Read its official documentation ([Github](https://github.com/Dahesor/DNT-Dahesor-NBT-Transformer) | [Redstone Relay](https://www.mczwlt.net/resource/ryzp7bof)) for more information.


**Splicing example:**

Input: [`"Hello"`,`" single ' quote"`,`" and \\ back slash"`]

Output:`"Hello single ' quote and \\ back slash"`**NBT to JSON example:**

Input:

```snbt
{equipment:{mainhand:{id:"diamond",components:{"minecraft:item_name":{text:"what\"\"''ha>?",italic:true},"!attribute_modifiers":{},custom_data:{'Cool"\'\\Name':Yeah...}}}}}
```
Output:

```json
{"equipment":{"mainhand":{"components":{"!attribute_modifiers":{},"custom_data":{"Cool\"'\\Name":"Yeah..."},"minecraft:item_name":{"italic":true,"text":"what\"\"''ha>?"}},"id":"diamond"}}}
 ```