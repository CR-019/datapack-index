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
# Teleport the executor back to this position after one second.
data modify storage dah.sch:new new set value {run:"tp ~ ~ ~",time:20}
function dah.sch:new

# Place stone at this position after one second, resolving the dimension and writing a debug log.
data modify storage dah.sch:new new set value {run:"setblock ~ ~ ~ stone",time:20,flags:["debug","try_dimension"]}
function dah.sch:new

# Remove the player's attribute modifier after ten seconds. If the player is offline, wait until they return.
data modify storage dah.sch:new new set value {run:"attribute @s attack_damage modifier remove foo:bar",time:200,offline:"delay"}
function dah.sch:new
```
