---
title: '香草快讯 - Mojang Spotlight - 2026年09月'
---

<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2026年09月"
    authorName = Alumopper
    cover='../_assets/spotlight.png'
    type=0
/>

这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月Mojang结束了26.3的快照周期，正式版**奔赴荒野**预计在9月15日发布。本月的五个开发版本以数值提供器的重构为重点，更新了包括浮点数运算，大量数学函数在内的数值提供器系统，让人瘫倒在椅子上，宛如看到核弹爆炸。

目前，数据包版本来到了**121.0**，资源包版本来到了**97.1**。

先说结论，本轮更新是革命性的，总体属于<h2>***SUPER BIG CUUUUUUUUUP***</h2>水平。

## 数值提供器

数值提供器在本轮迎来了一次彻底的重构：原先的注册表`minecraft:number_provider`被移除，数值提供器被拆分为**整数数值提供器**（`minecraft:context_int_provider`）和**浮点数数值提供器**（`minecraft:context_float_provider`）两套系统，各自拥有独立的类型和注册表。

* 整数数值提供器内部使用32位有符号整数运算，浮点数数值提供器则使用单精度浮点数运算。两者都支持直接写一个数字作为`constant`类型的简写。
* 两者的类型几乎一一对应，包括`constant`、`add`、`sub`、`mul`、`div`、`negate`、`abs`、`min`、`max`、`avg`、`pow`、`mod`、`uniform`、`binomial`、`weighted_list`、`number_dispatcher`和`conditional`等。
* 浮点数和整数可以通过`from_int`和`from_float`互相转换。
* 浮点数数值提供器额外提供了数学函数`sin`、`cos`、`sqrt`、`length`（平方和的算术平方根）以及`floor`、`ceil`、`round`、`truncate`等取整操作。
* 两套系统都加入了`storage`类型，直接从命令存储中读取数据标签；整数数值提供器还额外提供了`score`类型，用于读取记分项分数。
* 两者都加入了`environment_attribute`类型，可以直接读取环境属性的值（~~环境属性终于能直接读取了~~）。
* 浮点数数值提供器还加入了`enchantment_value`类型，根据战利品上下文提供的魔咒等级与等级依赖函数计算数值。

:::warning
本次重构影响范围极大，所有涉及数值提供器的字段都改为了区分整数和浮点数的两套类型。在更新数据包的时候，务必参考wiki的最新格式！
:::

### 谓词与数值提供器

* 移除了`minecraft:value_check`谓词类型，取而代之的是`minecraft:int_value_check`和`minecraft:float_value_check`。
* 加入了`minecraft:product`、`minecraft:minimum`、`minecraft:maximum`和`minecraft:average`数值提供器类型，分别计算所有操作数的乘积、最小值、最大值和平均值。
* `minecraft:sum`数值提供器的`summands`字段被重命名为`operands`，并且现在至少需要包含一个操作数；在整数上下文中使用时，所有操作数也会在整数上下文中求值。

## 命令格式

### `compute`

加入了`compute`命令，在指定战利品上下文中对数值提供器求值。语法如下：

* `compute default <provider> [<scale>|integer]`：使用`minecraft:command_compute_default`上下文求值。
* `compute block <computePos> <provider> [<scale>|integer]`：使用`minecraft:command_compute_block`上下文求值。
* `compute entity <computeTarget> <provider> [<scale>|integer]`：使用`minecraft:command_compute_entity`上下文求值。

在预发布版中，该命令的语法被进一步细化为`integer <provider>`和`float <provider> [<scale>]`两种形式，并且数值提供器求值失败时命令也会失败。

### `data`

`data modify`加入了新的数据来源`compute`，语法为`data modify ... compute (default|block <computePos>|entity <computeTarget>) (integer|float) <provider>`。

### `swing`

`<animation>`参数现在支持`none`。

## 数据驱动

### 方块变换效果

* 方块变换效果现在可以单独在数据包中定义，并加入了`minecraft:block_transformer`注册表。
* 加入了`minecraft:shovel`、`minecraft:axe`和`minecraft:hoe`三种默认方块变换效果。
* `minecraft:block_transformer`组件不再接受内联定义的方块变换效果，而必须引用注册表中的项目。

### 方块状态提供器

* 方块状态提供器现在可以作为单独的文件定义在数据包中，并加入了`minecraft:worldgen/block_state_provider`注册表。
* 大量方块状态提供器类型去掉了`_provider`后缀，例如`noise_provider`重命名为`noise`、`simple_state_provider`重命名为`simple`、`random_block_provider`重命名为`random_block`。
* `minecraft:rule_based`方块状态提供器在一条规则未能提供方块状态时，会继续测试下一项规则，而不是直接失败。
* 现在可以使用对象形式的内联方块状态作为`simple`类型的简写。

### 其他

* 加入了`minecraft:ore_vein`材料规则类型，噪声设置中的`ore_veins`字段被移除，其功能完全由材料规则代替。矿脉的矿石、粗矿块和填充方块现在都使用方块状态提供器。
* 加入了可选的`debug_functions`字段，可以在`chunk_generation_stats`调试信息中显示指定密度函数的值。
* 进度定义中，可见的根进度现在必须在`display`中包含`background`，而非根进度不再允许包含`background`。
* `minecraft:group`槽位源和`minecraft:sequence`物品修饰器现在只能在顶级文件中使用内联定义。
* 烧炼配方中的`cookingtime`字段现在是必需的。

## 数据组件

* `minecraft:consumable`的`teleport_randomly`消耗效果类型加入了可选布尔值字段`directional_particles`，控制传送时是否产生指向传送后位置的粒子拖尾，默认为`true`。
* `minecraft:attack_animation`和`minecraft:interact_animation`的`duration`字段现在必须是非负整数，`type`字段现在支持`none`。
* `minecraft:cooking_fuel`、`minecraft:brewing_fuel`和`minecraft:compostable`的字段改为接受对应整数或浮点数数值提供器的ID或内联定义。
    * 熔炉和酿造台的燃料消耗返还逻辑也一并调整：若燃料槽内仍有燃料，返还物会以物品形式掉落，否则留在燃料槽内。

## 谓词

* `minecraft:int_value_check`：将整数数值与另一个整数或范围作比较。
* `minecraft:float_value_check`：将浮点数数值与另一个浮点数或范围作比较。
* 移除了`minecraft:value_check`。

## 杂项

* 物品修饰器`minecraft:set_loot_table`移除了未使用的`type`字段，并将`tag`字段重命名为`loot_table_id`。
* 物品修饰器`minecraft:set_attributes`、`minecraft:set_count`、`minecraft:set_damage`、`minecraft:enchant_with_levels`、`minecraft:set_enchantments`、`minecraft:limit_count`等类型中涉及数值的字段，均改为接受对应数值提供器的ID或内联定义。
* 战利品表的`rolls`和`bonus_rolls`字段、村民交易定义中`max_uses`、`xp`等字段同样改为接受对应数值提供器的ID或内联定义。
* 加入了`ENABLE_FARLANDS`调试工具，启用后当柏林噪声计算值超出16,777,216时直接返回原值，可以在不修改游戏文件的情况下重现边境之地。
* `cache_once`密度函数重命名为`cache`，并移除了`shifted_noise`、`cache_2d`、`cache_all_in_cell`和`flat_cache`密度函数类型。
* `noise`密度函数加入了`shift_x`、`shift_y`和`shift_z`字段，`interpolated`密度函数加入了`cell_size_xz`和`cell_size_y`字段。
* 噪声设置中的`preliminary_surface_level`被重命名为`chunk_surface_level`，`noise`字段中的`size_horizontal`和`size_vertical`被移除。
* 加入了`core/blit_depth.fsh`核心着色器，作为基于渲染后端复制深度纹理内容的方法的替代。

更多详细内容请查阅更新日志~

* 26.3-snapshot-9：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-9>
* 26.3-snapshot-10：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-snapshot-10>
* 26.3-pre-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-pre-1>
* 26.3-pre-2：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-pre-2>
* 26.3-pre-3：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-pre-3>
* 26.3-rc-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-rc-1>
* 26.3-rc-2：<https://zh.minecraft.wiki/w/Java%E7%89%8826.3-rc-2>
