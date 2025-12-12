<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2025年12月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.png'
    type=0
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了八个快照，即1.21.11的预发布版本和发布候选版本，并于十二月九日发布了1.21.11的正式版。数据包版本号来到了**94.1**，资源包版本号来到了**75.0**。

由于主体内容已经在十一月更新完毕，本月更新没有添加太多新内容，大部分属于小修小补。

先说结论，本月更新内容量少，破坏性较小，总体属于**中杯**水平。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 杂项

### `minecraft:attack_range`

允许物品拥有自定义的攻击范围。此组件会覆盖玩家的实体交互距离属性，包含的字段有：

* `min_range`: 攻击者到目标的最小有效距离。此距离等于攻击者眼睛位置、沿视角方向到被攻击者攻击判定箱的最小距离。
* `max_range`: 攻击者到目标的最大有效距离。
* `hitbox_margin`: 决定攻击判定箱的大小。游戏将实体的碰撞箱向各个方向扩展此距离得到攻击判定箱。
* `mob_factor`: 对于非玩家生物，其使用的最小有效距离和最大有效距离的缩放乘数。
* `min_creative_reach`: 同`min_range`，但是控制的是创造模式玩家的相关属性
* `max_creative_reach`: 同`max_range`，但是控制的是创造模式玩家的相关属性

原有的`piercing_weapon`和`kinetic_weapon`组件中的相关字段被移动到了此组件中。

### 纹理元数据中的`alpha_cutoff_bias`

用于在 cutout 判定里加入一个小的偏移，用于补偿采样与精度误差，从而让纹理边缘更稳定。当纹理在远处过于透明的时候，可以适当提高此值，比如海带纹理为0.1。

更多详细内容请查阅更新日志~

* 1.21.11-pre1：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre1>
* 1.21.11-pre2：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre2>
* 1.21.11-pre3：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre3>
* 1.21.11-pre4：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre4>
* 1.21.11-pre5：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre5>
* 1.21.11-rc1：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc1>
* 1.21.11-rc2：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc2>
* 1.21.11-rc3：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc3>
* 1.21.11：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.11>
