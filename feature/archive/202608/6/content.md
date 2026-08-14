<FeatureHead
  title="简易原版敌人"
  authorName="张小叉"
/>

本条目将介绍如何用简易的方法在原版MC使用数据包与资源包制作一个类似《恐怖之森》中的木村方惠样式的敌人（26.2）

## Part.1 借助原版生物实现AI

我们可以借助原版生物的AI 比如僵尸或者僵尸猪灵 在这里我推荐使用**僵尸猪灵** 理由是僵尸猪灵有一个名为**Angry_at**的NBT标签 可以供我们方便的进行索敌

我们使用新建一个函数文件 使用命令召唤一个无敌、无声音、幼年形态的僵尸猪灵
**summon minecraft:zombified_piglin ~ ~ ~ {Invulnerable:true,IsBaby:true,Silent:true,Tags:[zimin0]}**

并给与其一个标签方便后续管理

这样我们的自定义敌人的本体便完成了

## Part.2 外观

我们可以通过修改资源包来设置敌人外观

这里我通过资源包将铜粒的纹理替换成了籽岷

我们生成一个物品展示实体 并通过axiom模组进行修改 将物品展示实体的外观修改成上图中的铜粒

再微调各种参数 使它变成我们想要的样子 将billboard调整成center 让他一直面向玩家

之后右键axiom的白色方块 复制生成命令并粘贴到我们的函数中 不要忘了也给他添加一个标签

之后通过ride命令 将物品展示实体骑乘在僵尸猪灵身上 并将僵尸猪灵隐身 达到外观效果

## Part.3 索敌

索敌十分简单 利用僵尸猪灵自带的angry_at标签

我们可以使用data修改僵尸猪灵的angry_at标签 以达到索敌目的

例子：
**data modify entity @n[tag=zimin0] angry_at set from entity @p UUID**

这条命令可以让僵尸猪灵开始追杀最近的玩家

