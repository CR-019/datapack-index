---
pageClass: h2-no-border
---

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>


## 命令快闪 Command Flashlight


> 几小时前，我偶然发现了一个可能对你们很多人都很有用的技巧： **如果另一个数据包存在，就禁用某些资源使其不包含在某个标签中，但如果它不存在，也不会破坏整个标签。**
>假设你有一个函数标签，你希望它当且仅当某个数据包不存在时，在 #tick 下运行。
#tick：
```json
{ "values": [ { "id": "#ns:conditional_tick", "required": false } ] }
```

#ns:conditional_tick：
```json
{ "values": [ "foo:bar1" "foo:bar2" ... "ns:conditional_tags/tick/<pack_name>" <- 这才是酷的地方 ] }
```

你可以在各个依赖数据包中，在指定路径（ns:conditional_tags/tick/<pack_name>）放置一个空资源，<pack_name> 使用它们各自的名称或标识符。
然后，只需在控制数据包中过滤 `ns:conditional_tags` 的路径，所有资源就会从 #tick 标签中移除，而不会破坏其他数据包。


<ColorLine :height="2"/>

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。
答案会在下一期Feature公布。

本期出题人：徐木弦
:::

---

1. 为获取菜单按钮点击的声音文件，在散列资源文件中查找得到的对应字段如下所示：

```json
"minecraft/sounds/random/click.ogg": {
  "hash":"3455ca942556c7d5eac7dd5e458e7fb3bad564c9",
  "size": 5468
}"
```
则该声音文件的地址是？

---

2. 某个资源包中文件 `splashes.txt` 的所有内容如下：

```
\n
```

则游戏中的闪烁标语会是什么样的？

---

3. 尝试围绕执行位置水平生成一圈交互实体，交互实体离中心点的距离均为2格，相邻交互实体与中心点连线的夹角为$30 \degree$，按要求生成12个交互实体。

---

<ColorLine :height="2"/>

### 上期参考答案

> 注：答案并非唯一。能解决问题即可。

1.

【答案】游戏首先会遍历各个维度，顺序为：主世界在前，下界在后。对于每个维度，会依次遍历其中的实体，顺序为这些实体的生成时间。因此这四个玩家的遍历顺序为：A $\rightarrow$ C $\rightarrow$ D $\rightarrow$ B。对于每一个玩家，受伤的计算流程在前，物品栏改变的流程在后，因此完整的顺序为 I $\rightarrow$ V $\rightarrow$ III $\rightarrow$ VII $\rightarrow$ IV $\rightarrow$ VIII $\rightarrow$ II $\rightarrow$ VI。

---

2.

【答案】D

`-20 71 4.5` 经过中心点校准之后会变成 `-19.5 71.0 4.5`，因此实际的点位为D。

---

3.

【答案】崩溃原因是 `Ticking entity`，说明有实体发生了错误，游戏无法加载这个实体的数据。后文的 `Entity being ticked` 明确指出发生错误的实体是一个风弹，这个风弹位于区域$[-1,-1]$，区段坐标为$[-1,0,-1]$，局部方块坐标$[15,2,13]$。可行的解决办法是删除这个实体并向Mojang报告漏洞。




<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="104"
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