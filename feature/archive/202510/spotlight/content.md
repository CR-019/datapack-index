---
title: '香草快讯 - Mojang Spotlight - 2025年10月'
---

<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2025年10月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.png'
    type=0
/>

::: tip
本快讯***不包含***25w42a的内容www~
:::

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了1.21.9的数个预览版和1.21.9的正式版，随后迅速发布了1.21.10用于修复一些严重的bug。在Minecraft Live直播结束后的第二个星期，Mojang在周四更新了1.21.11的首个快照：25w41a。现在，数据包版本号来到了**89.0**，资源包版本号来到了**70.0**。

先说结论，本月更新破坏性较小，实用性较强，总体属于**超大杯中**水平。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 物品组件

在25w41a中，Mojang添加了一种新的武器——[矛](https://zh.minecraft.wiki/w/%E7%9F%9B)，随之而来的，还有和矛相关的各种物品组件。

**`use_effects`**

包含两个字段：

- `can_sprint`：布尔值。玩家使用（长按右键）此物品的时候是否可以疾跑
- `speed_multiplier`：单精度浮点数。玩家使用此物品的时候的速度乘数

**`minimum_attack_charge`**

为一个浮点数值，表示可以用这个物品攻击的时候，需要攻击指示器填充的最小幅度（最短攻击cd时间）

**`damage_type`**

一个字符串，表示物品攻击能造成的伤害类型（命名空间ID）

**`kinetic_weapon`**

拥有此物品组件的物品可以右键蓄力攻击，造成的伤害为下文中所定义的`floor(relative_speed * velocity_multiplier)`。其中`relative_speed`是投影到攻击者视向量轴上的攻击者和目标的速度向量之差。

<div class="nbttree">

<node type="compound" name="kinetic_weapon"/> 数据组件
   + <node type="float" name="min_reach"/> 从攻击者到目标，攻击被视为有效的最小距离。  
   + <node type="float" name="max_reach"/> 从攻击者到目标，攻击被视为有效的最大距离。
   + <node type="float" name="hitbox_margin"/> 检查攻击碰撞时，目标产生有效碰撞的误差。
   + <node type="int" name="delay_ticks"/> 武器生效前的游戏刻数。
   + <node type="compound" name="dismount_conditions"/> 达成下列条件时，使目标脱离坐骑。
     + <node type="int" name="max_duration_ticks"/> （值≥0）<inline>delay_ticks</inline>后持续检查该条件的最大时长。
     + <node type="float" name="min_speed"/> 攻击者沿其视线方向上的最低速度，单位为格每秒。
     + <node type="float" name="min_relative_speed"/> 攻击者沿其视线方向与目标之间的最低相对速度，单位为格每秒。
   + <node type="compound" name="knockback_conditions"/> 击退目标，格式同dismount_conditions。
   + <node type="compound" name="damage_conditions"/> 伤害目标，格式同dismount_conditions。
   + <node type="compound" name="sound"/> （[声音事件](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%A3%B0%E9%9F%B3%E4%BA%8B%E4%BB%B6)）武器被占用时播放的音效。
   + <node type="hitsound" name="hit_sound"/> （声音事件）武器击中实体时播放的音效。
</div>

**`piercing_weapon`**

拥有此物品组件的物品可以戳刺攻击以伤害一定方向上的多个实体。

<div class="nbttree">

<node type="compound" name="piercing_weapon"/> 数据组件
   + <node type="float" name="min_reach"/> 从攻击者到目标，攻击被视为有效的最小距离。  
   + <node type="float" name="max_reach"/> 从攻击者到目标，攻击被视为有效的最大距离。
   + <node type="float" name="hitbox_margin"/> 检查攻击碰撞时，目标产生有效碰撞的误差。
   + <node type="bool" name="deals_knockback"/> 武器生效前的游戏刻数。
   + <node type="bool" name="dismounts"/> 达成下列条件时，使目标脱离坐骑。
   + <node type="compound" name="sound"/> （声音事件）武器击中实体时播放的音效。
   + <node type="compound" name="hit_sound"/> （声音事件）武器击中实体时播放的音效。
</div>

**`swing_animation`**

指定物品攻击或者交互时候的摇晃动画。包含两个字段：

- `type`：字符串，动画的ID。可选值有`none`、`whack`和`stab`
- `duration`：整数，动画的持续刻数。

## 魔咒相关

加入了**`post_piercing_attack`**组件，控制物品穿刺攻击后的效果。

加入了实体效果`apply_impulse`，用于对目标实体进行冲刺（给予自己一个动量）

:::warning ojng造的轮椅没有椅面
因为[MC-302790](https://bugs.mojang.com/browse/MC/issues/MC-302790)，该效果器暂时无法在上下文内触发，因此多个来源的动量无法复合（后来的会覆盖先前的）
:::

`play_sound`现在可以是一个列表，列表的索引对应等级，从而支持随魔咒等级播放声音

加入了等级依赖函数`exponent`

## 秒表（stopwatch）

秒表是25w41a中添加的一种新命令机制，用于实现**独立于**游戏刻的时间记录。

秒表只会在游戏打开了一个地图，或者进入了一个服务器的时候进行计时。Esc暂停并不能暂停秒表。

:::tip 你知道吗

`stopwatch`是Mojang把世界边界计时法修坏以后的补偿

:::

[**`/stopwatch`**](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stopwatch)

`stopwatch`命令用于管理游戏中的秒表，其语法如下：

- `stopwatch <id> create`：创建指定命名空间ID的秒表
- `stopwatch <id> query`：在聊天栏中显示指定秒表的经过时间，以秒为单位。
- `stopwatch <id> restart`：重启指定秒表
- `stopwatch <id> remove`： 删除指定秒表

:::warning ojng造的轮椅没有椅面
`stopwatch`命令不能直接把秒表当前的时间储存到计分板上，因为其命令返回值**仅**和命令执行成功与否有关。若成功，则无论是`store success`还是`store result`都会储存`1`，反之则为`0`。Mojang的小巧思说是。
:::

**`execute if|unless stopwatch <id> <range>`**

将秒表的经过时间与提供的范围进行比较，精度为毫秒级。例如`/execute if stopwatch foo:bar ..10.001 run say Stopwatch foo:bar has not reached 10.001 seconds yet`

## 杂项

除了秒表和新的物品组件以外，本月更新中还有大量的细节内容。

- 玩家模型加入了`pose`、`immovable`、`hidden_description`、`description`字段。

- 玩家NBT中的重生点信息现在总是记录垂直角度和维度，相应的还有对`setworldspawn`命令和`spawnpoint`命令的修改。同时，`setworldspawn`现在可以在其他维度使用。

- 组件存在检查

  现在分别为物品组件谓词和数据组件谓词*拓展*了新的语法，用于检查组件是否存在，现有语法的形式和功能不变。

  对于物品组件，原来检测组件是否存在的语法是类似于`<id>[<component>]`，而语法则为`<id>[<component>~{}]`。

  对于数据组件谓词，使用`<component>:{}`来检查此组件是否存在。例如`{predicates：{instrument：{}}`

- 添加了实体谓词：`is_in_water`，`is_fall_flying`

- 添加了伤害类型：`spear`

- 物品模型映射现在包含可选项单精度浮点数`swap_animation_scale`，控制玩家切换至手持该物品时切换动画的速度倍率。

- 在纹理元数据信息中加入了`darkened_cutout_mipmap`字段。如果为`true`且纹理是cutout的，则MipMap会将其变暗以模拟较暗的方块内部

- 玻璃板和玻璃现在支持半透明像素

- 新增了一些物品标签、方块标签和魔咒标签

- 💥一些重命名

<ColorLine />

以上就是本月更新的大致内容啦，具体详细请查看Wiki，点击下方链接即可进入。值得一提的是，本月*Feature*发布的时候正好是星期二，也就是快照更新的日子，让我们看看Mojang又会更新什么呢？

1.21.9-pre1：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre1>
1.21.9-pre2：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre2>
1.21.9-pre3：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre3>
1.21.9-pre4：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre4>
1.21.9-rc1：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-rc1>
1.21.10：<https://zh.minecraft.wiki/w/Java%E7%89%881.21.10>
25w41a：<https://zh.minecraft.wiki/w/25w41a>
