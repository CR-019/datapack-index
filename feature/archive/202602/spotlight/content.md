---
title: '香草快讯 - Λojang Spotlight - 2026年02月'
---

<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2026年02月"
    authorName = Alumopper
    avatarUrl = '/datapack-index/_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.png'
    type=1
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了四个快照，分别是26.1的snapshot 4-7。目前，数据包版本来到了**99.1**，资源包版本来到了**81.0**。

先说结论，本月更新实用性较小，破坏性中等，总体属于**大杯下**水平。

## 染料组件

在26.1-snapshot-5中，添加了一种新的物品组件——`dye`，其值为十六种染料颜色名中的一种。持有这种物品组件的物品，代表这个物品具备在特定环境下作为某种染料的能力。但是光是添加这个物品组件还不够，还需要在物品标签中添加这个物品才行。目前加入了以下物品标签，存在于这些标签中的物品，同时带有指定`dye`组件的，即可在指定环境下作为对应染料使用：

- `#dyes`：辅助标签，包含原版游戏中的所有染料。
- `#loom_dyes`：允许在织布机界面上设置图案颜色的物品。织布机屏幕仍然需要物品堆叠具有`minecraft:dye`组件。
- `#loom_patterns`：允许在织布机界面上解锁图案的物品。织布机屏幕仍然需要物品堆叠具有`minecraft:provides_banner_patterns`组件。
- `#cat_collar_dyes`：用于给猫的项圈染色的物品。设置的颜色取自物品的`minecraft:dye`组件。
- `#wolf_collar_dyes`：用于给狼的项圈染色的物品。设置的颜色取自物品的`minecraft:dye`组件。
- `#cauldron_can_remove_dye`：可以在装有水的炼药锅中使用以去除`minecraft:dyed_color`组件的物品。

## 配方

在26.1-snapshot-5中Mojang对配方格式进行了大量更改~~（但是还是没有给原料加上对组件的支持）~~。由于更改的配方内容繁多，简洁起见这里仅仅标出被影响的配方类型，读者可自行查看文章末尾附带的更新日志链接以获取更详细的信息：

- `minecraft:crafting_dye`：**新增**，替代了`minecraft:crafting_special_armordye`
- `minecraft:crafting_imbue`：**新增**，替代了`minecraft:crafting_special_tippedarrow`，匹配匹配一个单一物品被8个原料环绕的配方。
- 移除了`minecraft:crafting_special_mapcloning`，其功能被整合到`minecraft:crafting_transmute`
- `show_notification`字段现在支持所有配方
- 移除了`minecraft:stonecutting`, `minecraft:smithing_transform` ,`minecraft:smithing_trim`中的`group`字段
- 更改了：
  - `minecraft:crafting_transmute`
  - `minecraft:crafting_special_bannerduplicate`
  - `minecraft:crafting_special_bookcloning`
  - `minecraft:crafting_decorated_pot`
  - `minecraft:crafting_special_firework_rocket`
  - `minecraft:crafting_special_firework_star_fade`
  - `minecraft:crafting_special_firework_star`
  - `minecraft:crafting_special_mapextending`
  - `minecraft:crafting_special_shielddecoration`

## Worldgen

对世界生成进行了一些细小的改动。

现在所有已配置的地物都支持`fallback`字段，原先此字段只被`disk`类型使用。

`forest_rock`被重命名为`block_blob`，并支持参数：

- `state`：方块
- `can_place_on`：可以放置在哪里

`ice_spike`被重命名为`spike`，并已支持任意方块。

`huge_red_mushroom`和`huge_brown_mushroom`现在拥有字段`can_place_on`，以定义巨型蘑菇可放置在哪里。

`alter_ground`树木装饰器的`provider`现在是基于测试的方块状态提供器。

`tree`的`force_dirt`和`dirt_provider`被替换为单一的基于测试的方块状态提供器`below_trunk_provider`：

- fallback：可选的方块状态提供器。
- rules：一个规则的列表。
  - if_true：方块谓词，检查要放置方块前的方块坐标。
  - then：一个方块状态提供器。

在维度类型定义中加入了布尔值字段`has_ender_dragon_fight`，控制此维度是否有末影龙战斗。

## 杂项

加入了`pig_sound_variant`、`cat_sound_variant`、`cow_sound_variant`和`chicken_sound_variant`子文件夹，允许数据包定义猪、猫、牛和鸡的不同声音变体。

`block.vsh`与`terrain.vsh`顶点着色器现在不再接收Normal法线顶点属性。\
着色器`core/rendertype_item_entity_translucent_cull`被移除，由`core/entity`取代。\
着色器`core/rendertype_entity_alpha和core/rendertype_entity_decal`被移除，改为`core/entity`实现的DISSOLVE标志。\
UI和世界中的物品渲染现在由`core/entity`拆分到新着色器`core/item`。

所有方块模型现在均可支持镂空或半透明（部分像素透明）纹理。

更多详细内容请查阅更新日志~

* 26.1-snapshot-4：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-4>
* 26.1-snapshot-5：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-5>
* 26.1-snapshot-6：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-6>
* 26.1-snapshot-7：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-7>
