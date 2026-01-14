---
name: D更好的Schedule
author:
    -
        name: Dahesor
        char: 作者
description: 保留上下文的定时任务，并灵活处理执行时实体不存在的问题
tags: [定时任务]
version: 1.1.0
gameversion: [1.21.5~1.21.11]
aside: left
wheel: true
repo: Dahesor/D-Better-Schedule
cover: /datapack-index/wheel/dbs.png
---

<InfoCard />

DBS(D-Better-Schedule)库提供了一个可以保留命令上下文的schedule命令。它可以记录当前的执行者，执行位置，执行朝向，以及在大部分情况下，记录执行维度。在一段时间后还原这些上下文并执行任意命令。若执行时，目标执行者不再存在（死亡，卸载，或是下线），本库也可灵活处理。

阅读其[官方说明文件](https://github.com/Dahesor/D-Better-Schedule)以获取更多信息

示例:
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