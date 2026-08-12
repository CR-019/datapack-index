---
title: '[1. 14. 4+] TPS detection'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "[1. 14. 4+] TPS detection"
    authorName = "hao145245"
    cover = '../../../../../feature/archive/202508/_assets/6.png'
/>

> I found it on wiki on August 6th. I searched it on Station B, planetminecraft and modrinth and found that no one had done it, so I recorded it.

## Principle[^1]

The output of the `/debug stop`command added in Java version 1.3.1 (12w27a) through`/execute store result...` is the average TPS during the entire analysis process.

`/debug start`will start a new profiler session, and the session can be ended with the`/debug stop` command

Therefore, we can use `/schedule`[^2] to create a plan for `/execute store result ... run debug stop`that is executed every`20tick` to detect TPS

After testing, if the above interval is lower than `15tick`, it will not be detected (the error is large). `20tick` can take into account both speed and accuracy.

## version limit

### Permission level

Why is it `1.14.4+`? Since `1.14.4-pre4`, `function-permission-level`has been added to`server.properties` to control the permission level possessed by the function. [^3]

The `/debug`command requires a permission level of`3`, and the default permission level of function is `2`[^4], resulting in versions lower than `1.14.4-pre4`unable to run`/debug` through the function.

### schedule

`1.15(19w38a)`added the`replace`parameter to`/schedule` [^5]. I don’t know if there will be any problems if the functions planned in the previous version are not overwritten.

> Only when I wrote this did I realize that `replace` is the default. I wonder if the version before this was also the default.

### tick

`1.20.3(23w43a)`added`/tick`[^6]. When the data pack is running, you can use `/execute store result...`to get the output of`/tick query` to get the target TPS[^7]. If the server changes the target TPS, it can be detected.

### Singular and plural

`1.21(24w21a)`renamed`functions`to`function`. [^8]

## Example data pack

[here](https://github.com/hao145245/TPS-Detection) is an example TPS detection data pack, which will display the current TPS and target TPS in the form of `title`, and supports `1.14.4+`.

### code

This is the code for `1.21+`

```mcfunction
# load.mcfunction

scoreboard objectives add tps_detection dummy

#1.20.3+
execute store result score target_tps tps_detection run tick query
#1.20.3-
#scoreboard players set target_tps tps_detection 20

#1.15+
schedule function tps-detection:update_tps 20 replace
#1.15- 1.14.4+
#schedule function tps-detection:update_tps 20

debug start
```


```mcfunction
# update_tps.mcfunction

#1.15+
schedule function tps-detection:update_tps 20 replace
#1.15- 1.14.4+
#schedule function tps-detection:update_tps 20

execute store result score tps tps_detection run debug stop

#display
title @a title ["TPS:",{"score":{"name":"tps","objective":"tps_detection"}},"/",{"score":{"name":"target_tps","objective":"tps_detection"}}]


debug start
```


### Demo

#### 1.14.4

![1.14.4](../../../../../feature/archive/202508/6/1.14.4.png)

#### 1.21.8

![1.21.8](../../../../../feature/archive/202508/6/1.21.8_1.png)

## Actual combat

![Actual combat](../../../../../feature/archive/202508/6/1.21.8_2.png)

## write on the back

The idea of ​​data pack detecting TPS came about when `/tick`was added in`1.20.3`. At that time, I thought I could get TPS directly through the output of `/tick query`, and even wanted to get mspt, but it turned out that its output was the target TPS...

At that time, I was still thinking of getting it from the output of the command block, but the permission level required by `/tick`is`3`, which is completely unacceptable.

Then I thought of a way. The waiting time of `/schedule`has the unit of`s`, which is thought to be real time, but the game will convert it into `tick`

After discovering `/debug`, I thought that TPS could be detected with the data pack version, but it was not possible because of the permission level mentioned above.

However, the player can still manually obtain TPS (as shown below)

![1.13](../../../../../feature/archive/202508/6/1.13.png)

[^1]: See [command/debug - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/debug)

[^2]: See [command/schedule - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/schedule)

[^3]: See [Java Edition 1.14.4-pre4
- Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/Java%E7%89%881.14.4-pre4)

[^4]: See [Permission Level - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%9D%83%E9%99%90%E7%AD%89%E7%BA%A7#Java%E7%89%88_2)

[^5]: See [19w38a - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/19w38a)

[^6]: See [23w43a - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/23w43a)

[^7]: See [command/tick - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tick)

[^8]: See [24w21a - Chinese Minecraft Wiki](https://zh.minecraft.wiki/w/24w21a)

