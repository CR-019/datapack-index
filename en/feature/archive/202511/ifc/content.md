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

- [SlopeCraft - Map Generator](https://github.com/SlopeCraft/SlopeCraft)
- [Official website of Nanjing University MC Club](https://www.nmo.net.cn/)
- [Minecraftentity Sports Research and Application](http://lovexyn0827.space/mcdocs/docs/Minecraft%E5%AE%9E%E4%BD%93%E8%BF%90%E5%8A%A8%E7%A0%94%E7%A9%B6%E4%B8%8E%E5%BA%94%E7%94%A8/0-Minecraft%E5%AE%9E%E4%BD%93%E8%BF%90%E5%8A%A8%E7%9B%B8%E5%85%B3%E7%A0%94%E7%A9%B6%E4%B8%8E%E5%BA%94%E7%94%A8.html)


## command flashlight Command Flashlight

### Eliminate the automatic coordinated attack behavior of wolves
> Wolf, as one of the entities that can actively follow the player, is very effective when making some following systems (such as automatically following robots). But we don't always want it to automatically attack skeletons or mobs that the player is attacking. Therefore we can modify`follow_range`to eliminate hostile behavior.

Use the specified wolf as the executor to execute the following commands frequently:

```mcfunction
execute if data entity @s AngryAt run attribute @s follow_range modifier add anger -1 add_multiplied_total
 
execute unless data entity @s AngryAt run attribute @s follow_range modifier remove anger
```
This command works by lowering the wolf's aggro target by lowering its`follow_range`attributes to eliminate the hate target, and restore the attributes after the target is eliminated to retain its following and pathfinding capabilities.

### Fast and rough radiographic inspection
It only takes effect on the entity. The simulation emits a ray towards the entity at a certain position. The entity hit by the ray says you have discovered it.
No recursion, good performance, average but acceptable accuracy

```mcfunction
#raycast:
#uuid("62b8618f-a8d1-4d04-ab9b-1aa77123c442")
execute unless loaded ~ ~ ~ run return 0
summon marker ~ ~ ~ {UUID:[I;1656250767,-1462678268,-1415898457,1898169410]}
execute as 62b8618f-a8d1-4d04-ab9b-1aa77123c442 run function raycast/1
#raycast/1:
rotate @s ~ ~
function raycast/2
kill @s
#raycast/2:
execute \
as @e[tag=!raycast.ignore,type=!#&lt;entity to ignore>,distance=..&lt;max distance>,sort=nearest] positioned ^ ^ ^&lt;max distance> positioned as @s[distance=..&lt;max distance>+0.3] \
positioned ~ ~ ~2048 facing entity @s eyes positioned ^ ^ ^1024 positioned ~ ~ ~-1024 \
rotated as 62b8618f-a8d1-4d04-ab9b-1aa77123c442 positioned ^ ^ ^1024 facing entity 62b8618f-a8d1-4d04-ab9b-1aa77123c442 feet positioned ^ ^ ^1024 \
facing entity @s feet rotated ~ 0 positioned ^ ^ ^0.26 \
positioned ~-0.01 ~-0.01 ~-0.01 as @s[dx=0,dy=0,dz=0] positioned ~-0.98 ~-0.98 ~-0.98 at @s[dx=0,dy=0,dz=0] \
run return run say 被你发现了
#How to use
#The executor is player
tag @s add raycast.ignore
execute anchored eyes positioned ^ ^ ^ run function raycast
tag @s remove raycast.ignore
```
### MC explosion momentum calculation formula
Explosion intensity = 1-distance from explosion center to entity/explosion diameter
Explosion momentum = unit vector from explosion center to entity eye * explosion intensity

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="30"
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