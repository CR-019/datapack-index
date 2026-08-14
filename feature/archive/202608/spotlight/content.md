---
title: '香草快讯 - Mojang Spotlight - 2026年08月'
---

<SpotlightHead
    title = "香草快讯 - ojang Spotlight - 2026年08月"
    authorName = Alumopper
    cover='../_assets/spotlight.png'
    type=2
/>

八月好！这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月更新依然围绕26.3的快照展开。没有特别多亮点，主要集中在优化部分以及致死量的rename update。

目前，数据包版本来到了**116.0**，资源包版本来到了**96.0**。

先说结论，本轮更新实用性中上，破坏性极强，总体属于**中杯上**水平。

## 世界生成

### 密度函数

* 将此前密度函数中的参数名大部分进行了重命名让其更有可读性。
* 新增计算相关用途的函数：`sub`, `div`, `negate`, `lerp`, `floor`, `round`, `ceil`, `truncate`, `beardifier`, `pow`, `sqrt`, `log`, `sign`, `distance_to_point`, `slice`
* `y_clamped_gradient`重命名为`gradient`。此函数现在可以钳制三个轴上的噪声函数，并允许在界外循环执行此函数。
* 将`end_islands`重命名为`end_outer_islands`，并且此函数不再控制主岛的生成。

### 杂项

* 噪声设置的结构被重构
* 现在`final_density`不再默认加上`breadifier`的值。
* 地物`minecraft:sculk_patch`移除了`extra_rare_growths`和​`catalyst_chance`字段。
* 更改了噪声的配置。
* 现在密度函数和噪声使用单精度浮点数计算而非双精度浮点数。
* 为`minecraft:template`地物类型添加了`processors`字段，用于指定地物处理器列表。
* 新增放置修饰器`minecraft:randomly_selected`，从一个列表中随机选择一个放置修饰器应用。

## 命令格式

### `spreadplayers`

现在有效位置由方块标签`#entities_can_teleport_to`控制。

### `publish`

现在不再包含gamemode参数。

### `swing`

加入了控制挥动手臂的动画类型以及动画时间的参数。目前有普通攻击和用矛戳刺两种动画。

同时，对玩家使用此命令不再重置玩家的攻击冷却时间。

## 资源包

* `trim_palette_replacements`重命名为`trim_overrides`，允许给定的装备资产在使用了指定的纹饰材料或图案时交换纹理或调色板，而不仅仅是交换调色板。

## 谓词

* `minecraft:block/fast_cooking`
* `minecraft:match_block`：匹配方块或者方块实体

## 环境属性

* `minecraft:gameplay/natural_mob_spawns`和`minecraft:gameplay/creature_world_gen_spawn_probability`环境属性被加入。替代了原来生物群系中的生物生成配置。
* 环境属性新增修饰符
  * `overlay`：仅用于`minecraft:gameplay/natural_mob_spawns`
  * `append`：仅用于`minecraft:visual/ambient_particles`
* 环境属性`minecraft:visual/ambient_particles`现在支持插值。

## 数据组件

* 新增`minecraft:cooking_fuel`，让物品能作为三种熔炉的燃料。
* 新增`minecraft:brewing_fuel`，让物品能作为酿造台燃料。
* 新增`minecraft:sign_text_front`和`​minecraft:sign_text_back`，储存告示牌两侧的文本。
* 新增`minecraft:waxed`，表示物品是否被涂蜡。
* 新增`minecraft:cushion/color`，储存坐垫的颜色。
* 新增`minecraft:villager_food`，让物品能作为村民的食物。
* 新增`minecraft:mob_visibility`，描述物品被装备时对此实体的生物探测半径的范围的影响。
* 加入了物品组件`interact_animation`控制物品交互的动画。和`swing`命令类似，提供了普通攻击和用矛戳刺两种动画。

## 杂项
* 数值提供器现在提供大部分燃料的燃烧时间。
* 对大部分的json文件定义进行了重命名或者更改（~~力竭了~~）
:::warning
本次重构影响范围极大，在更新数据包的时候，务必参考wiki的最新格式！
:::
* 能接受某种类型命名空间ID的列表和相应类型的内联定义的列表的字段现在能接受将二者混合的列表。
* 为大量的字段提供了内联支持。
* 新增实体NBT`invulnerable_time`，控制实体的无敌时间。
* 战利品表上下文`minecraft:block_interact`现在支持`origin`，作为被交互方块的中心。
* 加入了方块谓词`minecraft:volume_match`，检查一定范围内的方块是否满足给定的方块谓词。

更多详细内容请查阅更新日志~

* 26.3-snapshot-4：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-4>
* 26.3-snapshot-5：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-5>
* 26.3-snapshot-6：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-6>
* 26.3-snapshot-7：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-7>
* 26.3-snapshot-8：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-8>
