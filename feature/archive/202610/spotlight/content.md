---
title: '香草快讯 - Mojang Spotlight - 2026年10月'
---
<script setup>
import ns from '/.vitepress/vue/nbt/namespace.vue'
</script>
<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2026年10月"
    authorName = Alumopper
    cover='../_assets/spotlight.jpg'
    type=1
/>

这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月Mojang开始了26.4的快照更新周期，更新了归属于26.4的四个快照版本snapshot-1~4。本月更新主要服务于新版本中的地形生成，在功能性改变并不多。

目前，数据包版本来到了**124.0**，资源包版本来到了**100.1**。

先说结论，本轮更新实用性一般，破坏性一般，总体属于中杯水平。

## 音效

在最新的快照版中移除硬编码的空音效`intentionally_empty`。Mojang, why?

## 方块音效集

加入了<ns t="minecraft:block_sound_set" />注册表，用于定义不同类别的方块所产生的声音。

包含以下字段：
* `volume`：（0.00001≤值≤10.0）所有声音播放时的相对音量。默认为1.0。
* `pitch`：（0.00001≤值≤10.0）所有声音播放时的相对音高。默认为1.0。
* `break_sound`：破坏方块时要使用的声音事件。
* `step_sound`：实体在方块上行走时要使用的声音事件。
* `place_sound`：放置方块时要使用的声音事件。
* `hit_sound`：挖掘方块时要使用的声音事件。
* `fall_sound`：实体摔落到方块上时要使用的声音事件。

## 世界生成

* `minecraft:straight_trunk_placer` 树干放置器类型新增`trunk_width`可选字段，指定树干的宽度。
* `minecraft:speleothem_cluster` 地物类型添加了`placement_options`，包含放置钟乳石簇时可应用的设置。
* `minecraft:large_dripstone` 加入了`base_block`字段。表示大型滴水石锥的基础方块。
* 添加了`minecraft:crevasse`地物类型，用于生成裂缝。
* 现在游戏会验证生物群系中所包含的已放置的地物在XZ平面内的可能位置。地物放置只能发生在3×3区块的范围内，超出此范围则无效。
* `minecraft:cuboid` 放置修饰器类型的`xz_size`和`y_size`现在会忠实反映长方体本身的尺寸，不再会隐式地增大1。
* `minecraft:fixed_placement` 放置修饰器类型的`positions`不能再为空。
* 移除了噪声设置中的`default_block`字段。现在的行为和之前把该字段设为`minecraft:air`的行为相同。如果要修改，应使用材料规则。
* `minecraft:steep` 材料条件类型不再使用顺序依赖的方式考虑风蚀恶地的陶瓦岩柱带来的高度修改。游戏现在会在完全计算完陶瓦岩柱后再计算噪声设置指定的材料规则。
* 加入了`minecraft:ice_cave_gradient`噪声。

## 环境属性

* 新增了`minecraft:visual/has_sky_occluder`：决定是否要使用天空遮罩。天空遮罩会使用迷雾遮挡天空盒，直到某一特定角度。边缘会被平滑过渡处理。

## 谓词

* 新增了`minecraft:below_heightmap`：检查某个位置的高度是否低于指定高度图的值。

## 渲染

* 现在图形API默认为Vulkan。
* 现在，顺序无关透明算法使用基于深度分箱的累积代替基于小波的数学运算，以简化算法。
* 加入了`blit_clouds.fsh`着色器，用于将云从离屏目标渲染到顺序无关透明（OIT）目标。
* 加入了`sky_occluder.vsh`和`sky_occluder.fsh`着色器，用于实现天空遮罩。
* 将`screenquad.vsh`着色器重命名为`screentriangle.vsh`。
* 移除了`clouds.fsh`着色器的顺序无关透明（OIT）支持。

## 杂项

* <cmd c="fillbiome" />命令对生物群系的修改可以精确到方块。
* 现在浮点数类型的NBT字段向整数类型转换时总是向下取整。
* 加入了`minecraft:freezing`粒子类型。被冰冻影响的实体会发出此粒子。
* 移除了`minecraft:item_snowball`粒子类型。
* 对实体变种定义格式中声音相关的部分的部分字段更改为可选字段。
* 移除了流体类型`flowing_water`和`flowing_lava`。同时流体类型新增`source`和`level`字段用来表示流体的状态。
* 在`minecraft:matching_fluids`方块谓词中也进行了相应的更改。
* `minecraft:explode`魔咒类型中的`small_particle`、`large_particle`和`sound`字段现在是可选的。

更多详细内容请查阅更新日志~

* 26.3-snapshot-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.4-snapshot-1>
* 26.3-snapshot-2：<https://zh.minecraft.wiki/w/Java%E7%89%8826.4-snapshot-2>
* 26.3-snapshot-3：<https://zh.minecraft.wiki/w/Java%E7%89%8826.4-snapshot-3>
* 26.3-snapshot-4：<https://zh.minecraft.wiki/w/Java%E7%89%8826.4-snapshot-4>