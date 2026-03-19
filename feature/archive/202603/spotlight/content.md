---
title: '香草快讯 - Λojang Spotlight - 2026年03月'
---

<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2026年03月"
    authorName = Alumopper
    avatarUrl = '/datapack-index/_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.jpeg'
    type=1
/>

这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

本月Mojang共发布了五个快照，分别是26.1的snapshot 8-11，以及预览版本26.1-pre-1。目前，数据包版本来到了**101.0**，资源包版本来到了**84.0**。

先说结论，本月更新实用性中等，破坏性一般，总体属于**大杯中**水平。

## 物品模型映射

在26.1-snapshot-11中，为`minecraft:model`、`​minecraft:special`、`​minecraft:range_dispatch`、`​minecraft:composite`、`​minecraft:select`和`​minecraft:condition`物品模型类型添加了`transformation`字段。这些字段的格式和展示实体的`transformation`字段相同。物品模型的变换将会在物品渲染变换之后进行。

将一些特殊的物品模型的变换提取到了特殊模型类型中，包括：

* `minecraft:bell`：新增。渲染钟方块的动画部分
* `minecraft:book`：新增。渲染附魔台和讲台的书。
* `minecraft:bed`：现在仅渲染床的一半。新字段`part`控制渲染床的哪一半。
* `minecraft:banner`：新字段`attachment`控制旗帜渲染使用的模型
* `minecraft:chest`：新字段`chest_type`控制渲染使用的模型
* `minecraft:hanging_sign`：新字段`attachment`控制使用的模型
* `minecraft:standing_sign`：新字段`attachment`控制使用的模型
* `minecraft:shulker_box`：移除了`orientation`字段
* `minecraft:end_cube`：渲染末地传送门和末地折跃门方块

同时，对部分场景的方块状态渲染进行了一些更改，例如末影人手持的方块、方块展示实体方块，但不包括下落的方块和移动的活塞。详细可以查看Wiki中的更新日志。

## 时间线

在先前的快照中，新增了时间线的概念，以及对`time`命令进行了修改以适配新的时间线机制。而在26.1-pre-1中又对`time`命令进行了进一步的增强。新的`time [of <clock>] rate <rate>`子命令允许玩家设置一个时钟的时间流逝速率。借助这个命令可以控制游戏中和时间线有关的功能，例如昼夜更替的速度。但是注意，这个命令并不会像`tick`命令一样直接改变游戏刻的流动速度。

## 环境属性

在26.1-pre-1中，提供了新的数值提供器，以获取当前上下文位置的环境属性的值。同时，加入了战利品表谓词`minecraft:environment_attribute_check`，用于在给定上下文的位置上精准匹配环境属性的值。

## 杂项

为`fectchprofile`命令新增`entity`子命令，用于输出世界中实体的（目前仅支持玩家和玩家模型）的档案信息。

加入了新的方块状态提供器`rule_based_state_provider`，根据方块谓词规则来决定提供的方块。

能够使用骨粉生成的地物由`#can_spawn_from_bone_meal`标签控制，而不再限制于`flower`类型的地物。

`object`组件现在支持`fallback`字段，允许在对象组件无法渲染的时候提供替代文本。

`nbt`类型的文本组件在`interpret`为`false`的时候，将会进行排版打印输出。同时新增了`plain`字段，用于移除精美印刷的文本样式。

`minecraft:provides_banner_patterns`组件、`minecraft:blocks_attacks`组件的`bypassed_by`字段、`minecraft:damage_resistant`组件的`types`字段和`minecraft:set_instrument`战利品表函数的`options`字段现在除了接受标签外，还支持ID或者ID的列表。

添加了新的整数提供器`trapezoid`，根据梯形分布选择随机数。

添加了新的粒子`pause_mob_growth`和`reset_mob_growth`。

着色器`core/rendertype_translucent_moving_block`被移除。

更多详细内容请查阅更新日志~

* 26.1-snapshot-8：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-8>
* 26.1-snapshot-9：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-9>
* 26.1-snapshot-10：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-10>
* 26.1-snapshot-11：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-11>
* 26.1-pre-1：<https://zh.minecraft.wiki/w/Java%E7%89%8826.1-pre-1>
