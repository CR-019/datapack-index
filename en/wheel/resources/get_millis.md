---
name: get_millis
author:
    -
        name: intsuc
        char: author
description: Get high-precision real time
tags: [time, real time]
version: 1.0.0
gameversion: [1.21+]
aside: left
wheel: true
repo: intsuc/get_millis
---

<InfoCard />

Calculate the high-precision time of the JVM in milliseconds ((System.nanoTime() / 1000000L) & 0x0000ffffffffffff).

## Instructions for use

Read its official documentation ([Github](https://github.com/intsuc/get_millis)) for details.

Example:

```mcfunction
scoreboard objectives add example dummy

execute store result score #start example run function get_millis:api/get_and_resolve
  #Perform any time-consuming tasks such as:
  reload
  reload
  reload
execute store result score #end example run function get_millis:api/get_and_resolve

scoreboard players operation #end example -= #start example
#Output elapsed time
tellraw @a ["Elapsed time: ", {score: {name: "#end", objective: "example"}, color: "gold"}, " ms"]
```