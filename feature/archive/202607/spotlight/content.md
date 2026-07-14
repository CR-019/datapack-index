---
title: '香草快讯 - Mojang Spotlight - 2026年07月'
---

<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2026年07月"
    authorName = Alumopper
    cover='../_assets/spotlight.png'
    type=0
/>

> 喂？喂？麦克风测试

咳咳，虽然有点迟，这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月是26.3版本开始快照的第一个月，发布了大量新的内容。当然，本该在昨天发布的snapshot-4因为Mojang员工放暑假了（是的）所以推迟发布了，但是这轮的三个快照依然量大管饱！

> 等到半夜发现没快照，上dc发现Mojang放假了
> ![Mojang员工放假消息截图](a0736b60920133c6828f7c04e28b1460.png)

目前，数据包版本来到了**110.0**，资源包版本来到了**91.0**。

先说结论，本轮更新实用性极强，破坏性中等，总体属于**超大杯下**水平。

由于本栏目主要总结技术性快照内容，所以不会涉及游戏玩法的改动。

## 世界生成

Mojang对世界生成的相关内容进行了大幅更改。这些改动虽然加入了不少更通用的数据驱动能力，同时也大幅更改了许多字段和地物类型的名称或格式。

### 表面规则（旧）

噪声设置中的`surface_rule`字段被重命名为`material_rule`。同时，游戏加入了`worldgen/material_rule`和`worldgen/material_condition`两个注册表，分别用于定义原来的表面规则和表面规则测试。

新的规则和测试的JSON格式与原有表面规则基本相同。除了内联定义外，现在还可以引用注册表中的命名空间ID。此举极大的提高了表面规则的可重用性和可读性（Mojang终于舍得把这一坨东西给拆开了）。对于旧数据包而言，原有的表面规则仍然有效，只需要更改字段名称即可。

此外，表面规则测试新增`height_match`、`all_of`、`any_of`和`not`，可以组合高度与逻辑条件。

### 结构、地物与雕刻器

已配置地物注册表`worldgen/configured_feature`被重命名为`worldgen/feature`，所有地物原先位于`config`中的配置字段也被移动到了根标签。已配置雕刻器注册表`worldgen/configured_carver`则被重命名为`worldgen/carver`，`cave`和`canyon`雕刻器原先位于`config`中的字段同样被移动到了根标签。

雕刻器的更改还包括：

* `cave`加入了`count`、`start_vertical_radius_multiplier`、`thickness`和`weird_thickness_bias`等字段，并将`yScale`重命名为`room_vertical_radius_multiplier`。
* `canyon`的`yScale`被重命名为`shape.y_scale`。
* 两种雕刻器均移除了`replaceable`、`lava_level`和`debug_settings`字段。
* 移除了`nether_cave`雕刻器类型，其功能由`cave`替代。

一些原先用途固定的地物类型也被改造成了更通用的版本：

* `basalt_columns`被重命名为`stepped_column_cluster`。
* `basalt_pillar`被重命名为`single_block_pillar`。
* `glowstone_blob`被重命名为`random_neighbor_spread`。
* 加入了`overlay`地物类型，无论单个地物是否放置成功，都会在同一位置依次尝试放置给定的一组地物。
* 加入了`projected_random_patch_square`地物类型，以离正方形中心的距离决定方块的放置概率，并支持向下投影方块。
* 加入了`end_podium`地物类型，用于放置激活或未激活的返回传送门。
* 移除了`coral_mushroom`、`kelp`、`seagrass`和`sea_pickle`地物类型；`coral_claw`和`coral_tree`则加入了`feature`字段，用给定的已放置地物生成实际方块。


加入了`dimension_origin`结构放置类型，在维度原点放置一个结构实例。对于使用噪声设置的维度，这个原点由`spawn_target`决定，否则为区块(0,0)。

此外，本轮快照还加入或更改了其他世界生成有关的内容：

* 加入了`height_range`方块谓词，垂直锚点也新增了相对维度海平面的`relative_to_sea_level`选项。
* 加入了`copy_properties_provider`方块状态提供器，将当前位置方块与输出方块共有的方块状态属性复制到输出结果。其字段在snapshot-3中最终命名为`source`。
* 加入了`random_block_provider`方块状态提供器，从一个方块、方块列表或方块标签中随机选择方块并返回其默认状态。
* 放置修饰器`random_offset`被重命名为`offset`，原有的`xz_spread`和`y_spread`被独立的`x`、`y`、`z`整数提供器替代。
* 加入了`cuboid`和`random_chance`放置修饰器，分别用于在长方体范围内重复放置地物和按概率放置地物。
* 噪声设置中的`spawn_target`现在可以使用任意密度函数，并通过多个密度函数轴上的目标范围描述候选出生点。
* `place feature`命令现在可以直接接受内联定义的已配置地物。

## 槽位源

原本只用于战利品表系统的槽位源在本轮快照中正式接入了命令系统。数据包现在可以在`slot_source`文件夹中定义槽位源，并使用新的`reference`槽位源类型按命名空间ID引用它们。`slot_range`的`source`字段新增了`container`取值，并将其设为默认值；`contents`槽位源也可以选中空槽位了。

`execute`加入了`if|unless slots`条件，用于检测方块或实体是否具有给定槽位源所匹配的槽位。原有的`if|unless items`也从接受槽位改为接受槽位源。它们都会使用新的`command_slot_source`战利品上下文进行解析。

`item`命令中原先接受槽位的位置现在同样接受槽位源，因此可以一次处理多个槽位，甚至串联多个来源实体的槽位。`item`既可以修改一系列的槽位，也可以通过原来 `from`从一系列的槽位中选择有序的物品序列。现在除了语义经过调整的`replace`外，还加入了两个新子命令：

* `item fill`：重复来源物品序列，直至填满所有目标槽位。
* `item override`：使用来源物品覆盖目标槽位，并清空没有对应来源物品的多余目标槽位。

原有的`hotbar.4`、`armor.chest`和`container.*`等槽位字符串仍然有效，它们会被视为`slot_range`槽位源的简写。（Mojang难得的兼容性考虑）

## 数据组件与数据驱动

加入了`block_transformer`数据组件。带有该组件的物品在与方块交互时，可以按照一系列规则将方块转换成方块状态提供器给出的结果。每条规则还可以控制声音、粒子、不可交互的面、战利品表、掉落位置、是否消耗物品或耐久，以及是否联动大型铜箱子的另一半。

加入了`number_provider`注册表，即数值提供器。

加入了`compostable`数据组件。`compostable`使用`layers`字段引用数值提供器，描述物品每次用于堆肥时增加的层数。

### 酿造配方

加入了`brewing`配方类型，药水酿造现在可以通过数据包定义。每个酿造配方包含`input`、`reagent`和`output`三个主要字段；输入物品和酿造材料均可指定物品、物品列表或物品标签，还可以附带`potion_contents`组件谓词，输出则使用物品模板格式，**可以**带有组件。

### 其他组件改动

* 加入了`provides_pottery_pattern`数据组件，用命名空间ID指定物品提供的陶片图案。
* `pot_decorations`数据组件和饰纹陶罐方块实体的`sherds`字段从列表改为包含`back`、`left`、`right`和`front`可选字段的对象。
* `potion_contents`数据组件谓词现在使用`potions`匹配药水ID、ID列表或标签，并使用`effects`匹配状态效果集合。

## 资源包与渲染

加入了`posteffect`命令，可以使用`add`、`remove`、`clear`和`list`子命令管理玩家的后处理效果。后处理效果仅存在于客户端，服务端并不知道效果是否真正成功应用。

资源包还可以定义`minecraft:end_of_frame`后处理管线。只要资源包处于加载状态，该效果就会在其他效果之前一直启用，也无法通过`posteffect`命令关闭；多个资源包同时定义时，以最后加载的定义为准。

“改进透明显示”选项改用了新的顺序无关透明（OIT）算法，加入了对应的着色器文件和定义，并移除了旧的透明后处理链。云和世界边界的部分核心着色器也去掉了`rendertype_`前缀。

烘焙模型的元素加入了`shade_direction_override`字段，可以指定计算阴影时使用的朝向。随后，原有的`shade`字段被移除；若要保持`shade: false`的效果，需要改用`shade_direction_override: "up"`。

## 杂项

* 装备资产加入了`trim_palette_replacements`字段；盔甲纹饰材料的`asset_name`被`palette_id`替代，`override_armor_assets`被移除。盔甲纹饰调色板纹理也移动到了新的路径。
* 山羊角乐器定义加入了`durability_damage`字段，`use_duration`现在可以为0。
* 服务端配置中的`white-list`默认值被改为`true`。
* `give`以及部分`tick`子命令在失败时会直接返回错误；`team join`和`team leave`现在返回实际改变队伍的实体数量。
* 方块标签`#convertable_to_mud`被更正为`#convertible_to_mud`，物品标签`#dowses_campfires`被更正为`#douses_campfires`。

更多详细内容请查阅更新日志~

* 26.3-snapshot-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-1>
* 26.3-snapshot-2：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-2>
* 26.3-snapshot-3：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-3>
