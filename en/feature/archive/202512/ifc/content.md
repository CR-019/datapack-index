::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# Second cover
<ColorLine :height="4"/>

::: warning You have entered a secret page!
Just kidding.
During the update process of Vanilla Library, we found that there is no suitable place for storing some time-sensitive and detailed information in the library.
Therefore, we plan to add a page in "feature" to put some miscellaneous information. Updated with the "feature" update.
The content of this page is not fixed, it may be various information, such as command questions and answers, trivia, ~~data pack jokes~~, etc.
We have also added a discussion area for this journal at the bottom of this page. You can express your views on this issue of "Feature" below, and you can also ask us questions.
:::

## What's New in the Library?
<ColorLine :height="2"/>

::: tip
This section posts new posts recently included in the library, replacing the original "Recent Updates" page.
:::
- [Vanilla Notes](https://docs.qq.com/aio/DV0xYeXVWaFJxQ3pI)
- [data pack tutorial:dialog](https://www.bilibili.com/video/BV1JyycB7E8H)
- [Tutorial: How to combine two items after throwing them together](https://www.bilibili.com/video/BV1opCvBiEAh/)


## Command Flashlight Command Flashlight

### MC explosion momentum calculation formula

Explosion intensity = 1-distance from explosion center to entity/explosion diameter
Explosion momentum = unit vector from explosion center to entity eye * explosion intensity

### Execute direction to quaternion

```mcfunction
execute in minecraft:overworld positioned 0. 0 1. rotated ~ 0 positioned ^ ^ ^1 facing 0. 0 0. positioned 0. 0 0. run teleport 0-0-0-0-0 ^ ^ ^-1
execute store result score #s temp run data get entity 0-0-0-0-0 Pos[0] 46340
execute store result score #c temp run data get entity 0-0-0-0-0 Pos[2] 46340
execute in minecraft:overworld positioned 0. 0 1. rotated 0 ~ positioned ^ ^ ^1 facing 0. 0 0. positioned 0. 0 0. run teleport 0-0-0-0-0 ^ ^ ^-1
execute store result score #y temp store result score #w temp run data get entity 0-0-0-0-0 Pos[2] 46340
execute store result score #x temp store result score #z temp run data get entity 0-0-0-0-0 Pos[1] 46340
execute store result storage example:s quaternion[3] float .000000000465661287520 run scoreboard players operation #w temp *= #c temp
execute store result storage example:s quaternion[2] float .000000000465661287520 run scoreboard players operation #z temp *= #s temp
execute store result storage example:s quaternion[1] float .000000000465661287520 run scoreboard players operation #y temp *= #s temp
execute store result storage example:s quaternion[0] float -.00000000046566128752 run scoreboard players operation #x temp *= #c temp
```


### Calculate sun and moon altitude angle

The following code takes the time of day as input and outputs the angle of the sun (the angle value is multiplied by 100000 for accuracy). If the angle is 0, the sun is due east; if the angle is 90, the sun is due north, and so on. The moon's position is opposite that of the sun (360 - sun angle = moon angle).

::: warning Editor's note
Due to the existence of 1.21.11 environment attribute settings, the actual location may be different in some mob groups.
:::

pack:main.mcfunction
```mcfunction
scoreboard objectives add obj._ dummy
scoreboard players set #24 obj._ 24
scoreboard players set #60 obj._ 60
scoreboard players set #100 obj._ 100
scoreboard players set #180 obj._ 180
scoreboard players set #240 obj._ 240
scoreboard players set #25000 obj._ 25000
scoreboard players set #100000 obj._ 100000
scoreboard players set #15000000 obj._ 15000000
scoreboard players set #36000000 obj._ 36000000
execute store result score #_a obj._ run time query daytime
scoreboard players operation #_a obj._ *= #100 obj._
scoreboard players operation #_a obj._ /= #24 obj._
scoreboard players operation #_a obj._ -= #25000 obj._
scoreboard players operation #_b obj._ = #_a obj._
scoreboard players operation #_b obj._ /= #100000 obj._
scoreboard players operation #_b obj._ *= #100000 obj._
scoreboard players operation #_a obj._ -= #_b obj._
scoreboard players operation #_c obj._ = #_a obj._
scoreboard players operation #_c obj._ *= #240 obj._
scoreboard players operation #_d obj._ = #_a obj._
scoreboard players operation #_d obj._ *= #180 obj._
execute summon minecraft:marker run function pack:cos
scoreboard players operation #_d obj._ *= #60 obj._
scoreboard players operation #_c obj._ -= #_d obj._
scoreboard players operation #_c obj._ += #15000000 obj._
scoreboard players operation #_c obj._ %= #36000000 obj._
scoreboard players operation $_angle_of_sun obj._ = #_c obj._
```


pack:cos.mcfunction
```mcfunction
tp @s 0.0 0.0 0.0
execute store result entity @s Rotation[0] float 0.00001 run scoreboard players get #_d obj._
execute at @s run tp @s ^ ^ ^1
execute store result score #_d obj._ run data get entity @s Pos[2] 100000
kill @s
```


<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
category="Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="43"
    :strict="false"
    :reactionsEnabled="true"
    emitMetadata="0"
    inputPosition="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy"
    class="giscus-wrapper"
  />
</ClientOnly>
