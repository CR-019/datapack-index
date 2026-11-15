---
title: '香草快讯 - Mojang Spotlight - 2026年11月'
---

<SpotlightHead
  title="香草快讯 - Mojang Spotlight - 2026年11月"
  authorName="Alumopper"
  cover="../_asset/spotlight.png"
  :type="2"
/>

十一月好！这里是 ***香草*** 快讯，全Minecraft最 ***Vanilla*** 的技术性快照新闻，由本社记者 *香草狐* 为你报道最新快照消息~

在上个月中，Mojang 发布了多个归属于26.4的快照版本（26.4-snapshot-5 至 26.4-snapshot-8）。目前，数据包版本来到了**127.0**，资源包版本来到了**103.0**。

先说结论，本轮更新着重于冬季更新方面的游戏内容，在技术性方面改动不大。主要带来了大量的实用标签拆分、更人性化的上下文校验放宽以及渲染管线的资源包改动，破坏性较小，总体属于**中杯上**水平。

## 数据组件

* `minecraft:equippable`
* `equip_sound`字段现在完全可选（默认值为`minecraft:item.armor.equip_generic`）。
* `shearing_sound`字段现在完全可选（默认值为`minecraft:item.shears.snip`）。

## 世界生成

### 密度函数

* 将`interpolated`重命名为`upscale`（每个轴采样2次，按Z、X、Y顺序在各轴上以指定模式进行上采样）。

### 地物

* 更改了`ore`和`scattered_ore`地物：由于暴露在空气中而被丢弃的方块，现在不再回退到下一条替换规则。

## 命令格式

### `/effect`

现在支持接受状态效果标签作为参数。

### 杂项

* 新增正则表达式匹配命令参数类型`pattern`，主要用于改善服务端模组和插件自定义命令的支持。
* 时间参数在输入的刻数值超过上限时现在会直接报错失败。
* `commands.json`格式调整：
  * 参数信息现在统一归入`argument`字段下，不再直接合并到父节点中。
  * 新增了关于命令补全建议的信息，且支持上下文的命令参数类型现在会在`context`字段中标明其使用的上下文。

## 战利品表与上下文校验

* **校验机制放宽与重构**：以下注册表中的大多数校验警告不再阻止元素加载（仅在存在递归调用或执行上下文缺失必需的上下文值时才会报错阻止加载或命令编译）：
* `minecraft:loot_table`、`minecraft:predicate`、`minecraft:item_modifier`、`minecraft:slot_source`
* `minecraft:context_float_provider`、`minecraft:context_int_provider`、`minecraft:villager_trade`
* `minecraft:advancement`中的`trigger`字段，以及`minecraft:enchantment_effect_component_type`实例上的`requirements`字段。


* **条件元素免检**：在`minecraft:number_dispatcher`的`cases`、村民交易的`merchant_predicate`以及战利品池/条目/函数中的`condition`字段内，只要条件本身满足上下文要求，即使内部元素跨上下文复用也不会再触发校验错误。
* **上下文拆分**：原`minecraft:command`上下文已拆分为`minecraft:command_predicate`（用于`/execute if predicate`等）和`minecraft:command_modifier`（用于`/item ... modify`等）。
* 新增数据生成器报告`loot_context_requirements.json`，方便查阅各上下文允许使用的校验规则。

:::warning
在26.4-snapshot-8中，校验错误会直接阻止命令编译（包括函数文件和控制台输入），例如在缺少对应上下文的`/compute`命令中使用`minecraft:enchantment_level`将直接编译失败！
:::

## 资源包

* **地形顶点缓冲重构**：`terrain.vsh`中的地形顶点数据现在从纹理缓冲区获取，而非传统的顶点缓冲区，区块网格数据的顶点打包方式也已同步更改。
* **OIT（顺序无关透明度）着色器调整**：修改了`core/oit_composite.fsh`、`core/oit_depth_bounds_cull.fsh`、`include/oit_depth_sample.glsl`、`include/oit_sample.glsl`，并新增`core/blit_depth_bounds.fsh`。
* **船只水遮罩（Boat Water Mask）渲染重构**：不再渲染到地形深度缓冲区，改为渲染至独立目标并在地形渲染时采样（无论是否开启OIT均生效）；修改了`core/rendertype_water_mask.fsh`和`core/terrain.fsh`，移除了`core/blit_depth.fsh`。

更多详细内容请查阅官方更新日志~

* 26.4-snapshot-5：[https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-5](https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-5)
* 26.4-snapshot-6：[https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-6](https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-6)
* 26.4-snapshot-7：[https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-7](https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-7)
* 26.4-snapshot-8：[https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-8](https://www.minecraft.net/en-us/article/minecraft-26-4-snapshot-8)
