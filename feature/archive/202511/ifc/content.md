<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

::: warning 你进入了一个秘密页面！
开个玩笑。  
在香草图书馆的更新过程中，我们发现，一些具有时效性的、细碎的信息，图书馆里没有适合他们存放的位置。  
因此，我们打算在《feature》中添加一个页面，放置一些杂项信息。随着《feature》更新一同更新。  
本页的内容不固定，可能会是各种信息，比如说命令问答，冷知识，~~数据包笑话~~，等等。  
我们在本页下方同样添加了本刊的讨论区，可以在下面发表你对本期《Feature》的看法，也可以向我们提问。
:::

## 图书馆上新 What's New
<ColorLine :height="2"/>

::: tip
本版块贴出最近收录在图书馆的新帖子，替代原先的“最近更新”页面。
:::

- [SlopeCraft - 地图画生成器](https://github.com/SlopeCraft/SlopeCraft)
- [南京大学MC社团官网](https://nmo.net.cn/)
- [Minecraft实体运动研究与应用](http://lovexyn0827.space/mcdocs/docs/Minecraft%E5%AE%9E%E4%BD%93%E8%BF%90%E5%8A%A8%E7%A0%94%E7%A9%B6%E4%B8%8E%E5%BA%94%E7%94%A8/0-Minecraft%E5%AE%9E%E4%BD%93%E8%BF%90%E5%8A%A8%E7%9B%B8%E5%85%B3%E7%A0%94%E7%A9%B6%E4%B8%8E%E5%BA%94%E7%94%A8.html)


## 命令快闪 Command Flashlight

### 消除狼自动协同攻击行为
> 狼作为可以主动跟随玩家的实体之一，在制作一些跟随系统（如自动跟随的机器人）时很有效。但是我们不总是希望它自动攻击骷髅或玩家正在攻击的生物。因此我们可以通过修改`follow_range`来消除敌意行为。

以指定的狼为执行者高频执行下列命令：

```mcfunction
execute if data entity @s AngryAt run attribute @s follow_range modifier add anger -1 add_multiplied_total
 
execute unless data entity @s AngryAt run attribute @s follow_range modifier remove anger
```

这段命令在狼具有仇恨目标时通过降低其`follow_range`属性来消除仇恨目标，在目标消除后恢复属性以保留其跟随和寻路能力。

### 快速粗略射线检测
仅对实体生效，模拟在某个位置朝向实体发射一条射线，被射线击中的实体say 被你发现了  
无递归，性能较好，精度一般但可接受

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
as @e[tag=!raycast.ignore,type=!#你要忽略的实体,distance=..最远距离,sort=nearest] positioned ^ ^ ^最远距离 positioned as @s[distance=..最远距离+0.3] \
positioned ~ ~ ~2048 facing entity @s eyes positioned ^ ^ ^1024 positioned ~ ~ ~-1024 \
rotated as 62b8618f-a8d1-4d04-ab9b-1aa77123c442 positioned ^ ^ ^1024 facing entity 62b8618f-a8d1-4d04-ab9b-1aa77123c442 feet positioned ^ ^ ^1024 \
facing entity @s feet rotated ~ 0 positioned ^ ^ ^0.26 \
positioned ~-0.01 ~-0.01 ~-0.01 as @s[dx=0,dy=0,dz=0] positioned ~-0.98 ~-0.98 ~-0.98 at @s[dx=0,dy=0,dz=0] \
run return run say 被你发现了
#使用方法
#执行者为玩家
tag @s add raycast.ignore
execute anchored eyes positioned ^ ^ ^ run function raycast
tag @s remove raycast.ignore
```

### mc爆炸动量计算公式
爆炸强度 = 1-爆炸中心到实体距离/爆炸直径  
爆炸动量 = 爆炸中心到实体眼睛的单位向量 * 爆炸强度

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
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