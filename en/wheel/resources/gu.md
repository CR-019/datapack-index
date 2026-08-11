---
name: gu
author:
    -
        name: gibbsly
        char: author
description: Simple UUID array to hexadecimal string converter
tags: [math, UUID]
version: 1.0.0
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: gibbsly/gu
---

<InfoCard />

gu is a simple low-level library that can convert UUID in array format into hyphenated hexadecimal string format. This library will allow you to select entities directly using UUID, change the score of an entity when it is not loaded, etc.

>`gu:generate`- After converting the executor's UUID into a hyphenated hexadecimal string format. Write the results to storage`gu:main out`

> `gu:convert`- Give this macro function something like`{UUID:[I;0,1,2,3]}`is an input, the function converts it to a hyphenated hexadecimal string format and writes the result to storage`gu:main out`