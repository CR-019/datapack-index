<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 图书馆上新 What's New

**[香草前置馆](/wheel/index.md)火爆开张中！如果知道好用的前置数据包或资源包，欢迎投稿（无论是否是你的）！**

## 命令快闪 Command Flashlight

### 关于 Minecraft 世界重启时实体选择器失效问题的说明

**现象描述**

在Minecraft世界（无论是单人模式还是多人服务器）启动或重启后，存在一个短暂的“空白期”。在此期间，任何使用`@e`等选择器的命令均无法选中任何已经存在的实体，包括玩家、生物或物品。\
在此期间使用`summon`命令召唤的实体，若区块已经处于加载状态，则可以被选择器选中，反之不行。\
`execute summon`可以正常工作。

此现象并非游戏崩溃或错误，而是引擎内部加载机制的固有特性。

**核心原因：实体与区块的异步加载机制**

该现象的根本原因在于 Minecraft 引擎对区块（Blocks）和实体（Entities）采用了异步、分阶段的加载策略，以优化性能并避免游戏卡顿。

1.  **加载动作是异步任务**：根据代码分析，区块和实体的实际加载过程都是通过后台任务（Task）进行的。引擎会将这些任务排入队列，在后续的tick中逐步执行。
2.  **实体追踪状态决定可选性**：一个实体能否被`@e`选择器选中，取决于该区块是否被加载。
3.  **加载顺序不确定**：区块和实体的加载任务由引擎调度，方块与实体的加载先后顺序有待考证。*需要验证*
4.  **forceload异步**: `forceload`只会标记强制加载而不立即开始加载, 所以在它无法在函数上下文内生效。

### 关于检测背包是否存在某物品的两种方法的性能测试的结论

转载自[此Discord讨论](https://discord.com/channels/154777837382008833/157097006500806656/1455993798399098902)

检测背包是否存在某物品的2种方法的性能测试结论：

1. `execute if items`穷举和`clear ... 0`量级总体相当，差异不大。
2. `execute if items`穷举所有背包槽位完全安全，不会对玩家物品栏产生任何意外影响。
3. `execute if items`性能表现不稳定，在检测目标存在时较快，但在所有检测条件均不满足（如库存为空）时，需要运行全部判断，性能最差。
4. `clear ... 0`在绝大多数常规情况下（尤其是物品栏与合成格为空时），性能稳定且优异，检测速度大多数时候比穷举`if items`略快。
5. 当`player.crafting`（玩家合成格）中存在物品时，`clear 0`的性能消耗会急剧增加，可能出现消耗增加接近$10$倍的情况，导致此时的速度远慢于`execute if items`方法。

建议：
1. 检测全部背包物品，包括副手，装备，合成栏等，建议使用`execute if items`先检测合成栏，如果检测到了则`return 1`，之后再`return run clear ... 0`。
2. 如果只需要检测背包和快捷栏（槽位范围不那么多的时候），建议直接使用`execute if items`，大多数情况下比`clear ... 0`更快。

## 你问我答 Q & A
Q：我做了一个贴图，怎么让它像原版物品一样渲染呢？  
A：在资源包的模型文件中有一个parent字段，可以指定一个模型文件的路径。指定后该模型可以继承父模型的一些数据。

> 一个模型可以指定继承于另一个模型下，子模型可以继承父模型的部分数据：
> - 如果子模型没有定义布尔型ambientocclusion、NBT列表/JSON数组elements或字符串gui_light，则直接使用父模型的数据。如果子模型有定义这些数据则使用子模型数据。
> - 如果子模型没有定义NBT复合标签/JSON对象display中的其中一种显示格式，则使用父模型的对应显示格式。如果子模型有定义这种显示格式则使用子模型数据。
> - 子模型的NBT复合标签/JSON对象textures会与父模型的NBT复合标签/JSON对象textures一起混合解析，见下文纹理变量。
>
> https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E6%A8%A1%E5%9E%8B%E7%BB%A7%E6%89%BF

而"item/generated"这个模型是原版物品默认的模型，使用这个作为父模型，在textures字段下声明"layer0"纹理变量即可调用原版的渲染引擎渲染该贴图。

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="44"
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