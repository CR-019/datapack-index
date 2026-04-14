---
title: '香草快讯 - Λojang Spotlight - 2026年04月'
---

<SpotlightHead
    title = "香草快讯 - Λojang Spotlight - 2026年04月"
    authorName = Alumopper
    avatarUrl = '/datapack-index/_authors/alumopper.jpg'
    cover='../_assets/spotlight.png'
    type=1
/>

这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月Mojang发布了26.1的正式版，同时发布了归属26.2的三个快照26.1-snapshot-1~3。目前，数据包版本来到了**102.0**，资源包版本来到了**86.0**。

先说结论，本月更新实用性中等，破坏性中等，总体属于**大杯下**水平。

## 恭迎Vulkan

在26.2中，Mojang添加了对Vulkan图形API的支持。玩家可以在视频设置选项中，选择使用Vulkan渲染器来替代默认的OpenGL渲染器，当然，这也是默认的选项。

Vulkan渲染当前是实验性的。尽管在大部分的报告中Vulkan渲染器表现良好，但是也有不少报告反映Vulkan渲染器比OpenGL渲染器更容易出现崩溃或者性能问题。

## 新属性

随着硫磺怪的加入，Mojang也为实体添加了三个可以配置的属性：弹性，摩擦力修正系数和空气阻力修正系数。

弹性（`minecraft:bounciness`）决定了控制生物碰撞后水平速度保留量，在视觉上表现为生物碰撞后的反弹能力。取值范围为0-1，0表示完全没有弹性，1表示完全弹性。

摩擦力修正系数（`minecraft:friction_modifier`）控制生物在地面上行走时受到的阻力。取值范围为0-2048，0表示没有摩擦力，1表示正常的摩擦力。

空气阻力修正系数（`minecraft:air_drag_modifier`）控制生物在空中运动时受到的阻力。取值范围为0-2048，0表示没有空气阻力，1表示正常的空气阻力。

## 实体谓词

实体谓词格式已从带有多个可选字段的结构变为类似数据组件映射的结构。

例如，以前的`effect`字段改为了`minecraft:effect`：

```json
{
    "minecraft:effects": {...}
}
```

这意味着现在实体谓词中所有的键都是命名空间ID。由于`minecraft`命名空间可以被省略，因此现在已有的字段仍然是有效的。

但是有两个例外：

`type`字段被重命名为`minecraft:entity_type`。

类型子谓词被重命名并移动至顶层。例如：

```json
{
  "type_specific": {
    "type": "minecraft:player",
    "looking_at": {
      "type": "minecraft:ender_dragon"
    }
  }
}
```

变为了

```
{
  "minecraft:type_specific/player": {
    "looking_at": {
      "minecraft:type": "minecraft:ender_dragon"
    }
  }
}
```

新增了`minecraft:entity_tags`实体子谓词，用于匹配实体的标签。它有三种匹配模式：`all_of`（匹配所有标签），`any_of`（匹配任意标签）和`none_of`（匹配没有指定标签）。

## 世界生成

* 加入了地物类型`sequence`，它会根据一个预定义的地物列表来生成地物。

* 加入了地物类型`template`，它会从给定权重的结构模板ID列表中中随机放置结构模板。

* 地物类型`lake`现在支持`can_place_feature`字段，用于描述该地物可以被放置在哪些方块上。同时还支持了`can_replace_with_air_or_fluid`字段和`can_replace_with_barrier`字段，用于描述该地物可以用空气、指定的流体或者屏障方块替换哪些方块。

* 重命名地物`pointed_dripstone`为`speleothem`，并对其内容进行了一定的调整以适配硫磺地形。

* 重命名地物`dripstone_cluster`为`speleothem_cluster`，并对其内容进行了一定的调整以适配硫磺地形。

* 地物`large_dripstone`、`geode`、`root_system`、`vegetation_patch`和`waterlogged_vegetation_patch`的相关字段除了接受标签外，现在还支持ID或者ID的列表。

* 维度类型`infiniburn`和处理器列表的`protected_blocks`现在除了接受标签外，还支持ID或者ID的列表。

## 杂项

床现在不再是方块实体，同时也移除了相关的特殊模型类型。

着色器`core/rendertype_text`、`core/rendertype_text_see_through`、`core/rendertype_text_intensity`、`core/rendertype_text_intensity_see_through`、`core/rendertype_text_background`和`core/rendertype_text_background_see_through`被`core/text`和`core/text_background`替代。

更多详细内容请查阅更新日志~

* 26.2-snapshot-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-1>
* 26.2-snapshot-2：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-2>
* 26.2-snapshot-3：<https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-3>
