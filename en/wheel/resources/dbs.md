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

<InfoCard />

The DBS (D-Better-Schedule) library provides a schedulecommand that can retain the command context. It can record the current executor, execution location, execution direction, and in most cases, execution dimension. Restore these contexts and execute arbitrary commands after a period of time. If the target executor no longer exists (dead, uninstalled, or offline) during execution, this library can also handle it flexibly.

Read its [official documentation](https://github.com/Dahesor/D-Better-Schedule) for more information

Example:

```mcfunction
#Teleport the executor back to the current location after 1 second.
data modify storage dah.sch:new new set value {run:"tp ~ ~ ~",time:20}
function dah.sch:new

#Set current position to stone after 1 second. Try to get the dimensions and output the log.
data modify storage dah.sch:new new set value {run:"setblock ~ ~ ~ stone",time:20,flags:["debug","try_dimension"]}
function dah.sch:new

#Remove the player's attribute modifiers after 10 seconds or so. If the player goes offline within 10 seconds, wait until the player comes online before removing it.
data modify storage dah.sch:new new set value {run:"attribute @s attack_damage modifier remove foo:bar",time:200,offline:"delay"}
function dah.sch:new
```