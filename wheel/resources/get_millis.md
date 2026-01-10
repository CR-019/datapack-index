---
name: get_millis
author:
    -
        name: intsuc
        char: 作者
description: 获取高精度现实时间
tags: [时间, 现实时间]
version: 1.0.0
gameversion: [1.21+]
aside: left
wheel: true
repo: intsuc/get_millis
---

<InfoCard />

计算JVM的高精度时间，以毫秒为单位((System.nanoTime() / 1000000L) & 0x0000ffffffffffff)。

## 使用说明

阅读其官方说明文件（[Github](https://github.com/intsuc/get_millis)）以获取详细信息。

示例：
```mcfunction
scoreboard objectives add example dummy

execute store result score #start example run function get_millis:api/get_and_resolve
  # 执行任意花费时间的任务，如:
  reload
  reload
  reload
execute store result score #end example run function get_millis:api/get_and_resolve

scoreboard players operation #end example -= #start example
# 输出经过的时间
tellraw @a ["Elapsed time: ", {score: {name: "#end", objective: "example"}, color: "gold"}, " ms"]
```