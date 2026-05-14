---
title: '香草快讯 - Λojang Spotlight - 2026年04月'
---

<SpotlightHead
    title = "香草快讯 - Λojang Spotlight - 2026年04月"
    authorName = Alumopper
    cover='../_assets/spotlight.png'
    type=1
/>

这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月Mojang发布了归属26.2的三个快照26.2-snapshot-4~7。目前，数据包版本来到了**105.1**，资源包版本来到了**87.0**。

先说结论，本月更新实用性中等，破坏性中等，总体属于**大杯下**水平。更新依然主要围绕着硫方怪和硫磺地形展开。同时Mojang还添加了p2p的联机方式。

## 世界生成

加入了密度函数`minecraft:interval_select`，根据输入的密度函数和阈值，在多个密度函数之间选择。

加入了`matching_biomes`世界生成方块谓词，用于判断方块是否在指定生物群系中。

加入了地物类型`weighted_random_selector`，根据权重随机选择一个地物。

`tree`类型地物的`below_trunk_provider`不再具有默认值。

`multiface_growth`地物类型的`block`现在是必须的。

表面规则条件`noise_threshold`新增`is_3d`字段。

`large_dripstone`地物的`column_radius`最大值现在是`16`。

`root_system`地物新增`level_test_distance`和`max_level_deviation`字段，分别控制根系距离原点多远会检查现有地形，以及测试位置的地面高度和原始地面高度可以偏移多远。

`minecraft:block_rot`结构处理器现在会继续处理上一个处理器的结果，而不是重新处理原始结构。

## 新属性

添加了两个新属性：

* `minecraft:name_tag_distance`：控制实体的名称标签能在多少格之内可见。
* `minecraft:below_name_distance`：控制below_name记分板显示能在多少格之内可见。

## 杂项

史莱姆子谓词从`minecraft:type_specific/slime`重命名为`minecraft:type_specific/cube_mob`。

新增粒子：`minecraft:geyser_base`，`minecraft:geyser_poof`，`minecraft:geyser_plume`，`minecraft:geyser`。

队伍颜色参数现在只能使用文本组件的颜色名。

更多详细内容请查阅更新日志~

* 26.2-snapshot-4：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-4>
* 26.2-snapshot-5：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-5>
* 26.2-snapshot-6：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-6>
* 26.2-snapshot-7：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-7>
