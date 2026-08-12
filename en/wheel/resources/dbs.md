---
name: DBetter Schedule
author:
    -
        name: Dahesor
        char: author
description: Scheduled tasks that retain context and flexibly handle the problem of entity non-existence during execution
tags: [scheduled task]
version: 1.3.0
gameversion: [1.21.5~26.2]
aside: left
wheel: true
repo: Dahesor/D-Better-Schedule
cover: /datapack-index/wheel/dbs.png
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

The DBS (D-Better-Schedule) library provides a schedulecommand that can retain the command context. It can record the current executor, execution location, execution direction, and in most cases, execution dimension. Restore these contexts and execute arbitrary commands after a period of time. If the target executor no longer exists (dead, uninstalled, or offline) during execution, this library can also handle it flexibly.

Read its [official documentation](https://github.com/Dahesor/D-Better-Schedule) for more information

Example:
```mcfunction
# 1秒后将执行者传送回当前位置。
data modify storage dah.sch:new new set value {run:"tp ~ ~ ~",time:20}
function dah.sch:new

# 1秒后将当前位置设置为石头。尝试获取维度，且输出日志。
data modify storage dah.sch:new new set value {run:"setblock ~ ~ ~ stone",time:20,flags:["debug","try_dimension"]}
function dah.sch:new

# 在10秒或移除该玩家的属性修饰器。若玩家在10秒内下线，则等到玩家上线后再移除。
data modify storage dah.sch:new new set value {run:"attribute @s attack_damage modifier remove foo:bar",time:200,offline:"delay"}
function dah.sch:new
```
