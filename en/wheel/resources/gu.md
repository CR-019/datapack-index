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

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

gu is a simple low-level library that can convert UUID in array format into hyphenated hexadecimal string format. This library will allow you to select entities directly using UUID, change the score of an entity when it is not loaded, etc.

> - `gu:generate`: After converting the executor's UUID into a hyphenated hexadecimal string format, write the result to storage `gu:main out`.

> - `gu:convert`: Given input such as `{UUID:[I;0,1,2,3]}`, this macro function converts it to a hyphenated hexadecimal string format and writes the result to storage `gu:main out`.
