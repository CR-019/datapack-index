---
title: '第一人称视角下自身背饰的隐藏方法'
---


<FeatureHead
title='第一人称视角下自身背饰的隐藏方法：基于物品模型着色标记与核心着色器的实践'
authorName='古镇天Gugle'
/>

---

**摘要**：在以 ItemDisplay 展示实体实现的玩家背饰（背包等）系统中，第一人称相机距背饰仅 0.3~0.8 格，存在明显的遮挡视线与穿模问题。原版客户端未提供任何可直接区分第一/第三人称的着色器全局量，使得"仅隐藏本人第一人称视角下的背饰"成为一个缺乏现成手段的问题。本文提出一种纯客户端渲染侧可验证的组合判定方法：利用 1.21.4 引入的物品模型定义（item model definition）中的 constant tint 与 tintindex 机制，将"仅本人可见的模型变体"的所有顶点色标记为特定魔法色（0xFEFFFF）；在核心着色器 rendertype_item_entity_translucent_cull 中，于光照混合之前检测原始顶点色完成标记识别，结合投影矩阵元素排除 GUI 渲染，再以片元球面距离区分本人第一人称与第三人称视角，对近距离片元执行 discard。实验表明，该方法在 1.21.6~1.21.11 各版本上稳定工作，视觉差异不可感知（1/255 亮度），且可退化为纯资源包实现（牺牲"仅本人"的精确性）。本文同时讨论了按观察者差异化的服务端前提、大模型部分可见问题及与光影管线的兼容性边界。

**关键词**：Minecraft Java 版；核心着色器；展示实体；物品模型定义；顶点色；第一人称渲染

---

## 1 引言

佩戴在玩家背部的装饰性模型（下称背饰）在多人服务器中广泛存在。工程上，背饰通常以 ItemDisplay 展示实体锚定于玩家背部实现，并借助展示实体的变换插值（transformation interpolation）获得平滑跟随效果。然而第一人称视角下相机位于玩家头部，背饰距相机仅 0.3~0.8 格，背包类模型会持续出现在画面边缘，既遮挡视线又产生穿模。

理想的行为是四象限差异化渲染：本人第一人称隐藏、本人第三人称（F5）可见、其他玩家任意视角可见、GUI 中物品图标可见。该需求的核心困难在于：核心着色器（core shader）的全部全局量中不存在任何与"第几人称"直接相关的量[1][11]；Mojang 亦未提供按观察者切换实体物品模型的原版机制。因此，问题被分解为两个正交的子问题：

1. **标记**：如何让着色器可靠识别"这个顶点属于需要被本人隐藏的模型"；
2. **判定**：如何在着色器内近似区分"本人第一人称"与"本人第三人称"。

本文第 2 节介绍相关背景；第 3 节给出方案设计；第 4 节详述实现；第 5 节分析纯资源包实现的可行性；第 6 节讨论边界情况与已知限制；第 7 节总结。

## 2 背景

### 2.1 核心着色器

Minecraft Java 版的渲染由一系列内置于客户端的核心着色器程序完成，资源包可通过同名文件覆盖其中以 GLSL 编写的着色器源码[1][2][7]。1.21.6 起，Mojang 将着色器 uniform 重组为 UBO（Uniform Buffer Object）结构，`ProjMat`、`ModelViewMat`、`ColorModulator` 等全局量改由 `projection.glsl`、`dynamictransforms.glsl` 等 include 文件提供，雾参数与工具函数则由 `fog.glsl` 提供[8][9][10]。覆盖核心着色器属于"受支持但未文档化"的高级资源包用法，其应用与风险在社区中已有系统讨论[4][6][12]。

ItemDisplay 实体携带的物品模型在世界中渲染时，走的核心着色器为 `rendertype_item_entity_translucent_cull`（顶点/片元着色器各一），与背包内图标共用同一程序——这是后文必须区分"世界渲染"与"GUI 渲染"的原因。

### 2.2 物品模型定义与顶点色

1.21.4 引入的物品模型定义（`assets/<ns>/items/<id>.json`）允许为物品模型声明 `tints` 列表；其中 `minecraft:constant` 类型的 tint 会把指定颜色乘到模型中所有声明了 `tintindex` 的面上，其结果经顶点色的 `Color` 属性传入顶点着色器。这意味着资源包可以完全主动地控制某个模型所有顶点的颜色值——本文将其用作**标记通道**。

社区方案 CEM-S 采用纹理固定像素标记（`texelFetch` 读取实体纹理的魔数像素）实现类似目的，但该方法依赖实体纹理直接绑定采样器；物品与方块渲染走统一图集（ITEM/BLOCK atlas），无法以固定纹素定位标记，故不适用于本场景。

### 2.3 展示实体插值

展示实体的平移/旋转/缩放变化可携带插值时长（interpolation duration），客户端在若干游戏刻内平滑过渡。第一人称下头部高速转动，插值越长拖影越明显；因此本方案附带将本人视角的插值压至 0（即时跟随），他人保持 3 刻平滑。该优化与隐藏判定相互独立，后文不再展开。

## 3 方案设计

### 3.1 总体结构

```
背饰佩戴者本人收到的展示实体 → 使用带标记的模型变体（记作 *_self）
        ↓
变体模型所有面挂 tintindex，物品定义挂 constant tint 魔法色 0xFEFFFF
        ↓
顶点着色器：光照混合前检测原始顶点色 → selfHideMarker = 1
        ↓
片元着色器：selfHideMarker == 1 且距相机 < 1.5 格 → discard
```

### 3.2 标记的选取

魔法色取 `0xFEFFFF`：R 通道 254/255、G/B/A 全满。该取值满足三点：其一，正常物品几乎不会天然出现"仅 R 通道恰好为 254/255"的顶点色，误报率低；其二，tint 是乘法染色，254/255 仅使 R 通道变暗 1/255，视觉上不可感知；其三，顶点色以 RGBA8 量化，检测容差取 0.002（约半个刻度）即可稳定命中。

### 3.3 人称判定模型

客户端无第几人称的显式信号，但两个可获得的量足以近似：

- **投影矩阵形态**：世界渲染使用透视投影，`ProjMat[2][3]` 非零；GUI/背包内物品使用正交投影，该元素为零。以 `abs(ProjMat[2][3]) > 10e-6` 排除 GUI，防止背包图标被误隐藏；
- **片元到相机的球面距离** `sphericalVertexDistance`：第一人称下背饰距相机 0.3~0.8 格，第三人称默认相机在身后约 4 格，两者间隔充足，取阈值 1.5 格。

该判定对"本人第三人称"是必要且充分的：`*_self` 变体只下发给背饰佩戴者本人（见 4.3），因此携带标记的模型只会出现在本人客户端，判定只需在"本人第一人称"与"本人第三人称"之间区分。

## 4 实现

### 4.1 标记变体的生成

对每个背饰模型生成一个 `_self` 副本，副本将所有面的 JSON 注入 `"tintindex": 0`；并生成对应的物品定义变体，在原模型引用上追加 constant tint：

```json
{
  "model": {
    "type": "minecraft:model",
    "model": "<namespace>:item/example_wing_self",
    "tints": [{ "type": "minecraft:constant", "value": 16711679 }]
  }
}
```

工程上需注意：若物品定义被装饰系统包装为 `minecraft:composite` / `select` / `condition` 等复合形态，顶层不存在直接的 `model` 引用；生成变体时应递归遍历整棵定义树，替换所有指向目标模型的 `{"type":"minecraft:model"}` 节点并挂 tint，其余节点保持不动。纯 `parent` 继承、无 `elements` 的模型没有面可注入 tintindex，标记不生效，此类模型退化为旧行为。

### 4.2 着色器改动

以下改动基于 1.21.11 原版 `rendertype_item_entity_translucent_cull`

**顶点着色器**（vsh），`main()` 末尾追加：

```glsl
out float selfHideMarker;

#define SELF_TINT_R (254.0 / 255.0)

void main() {
    // …… 原版逻辑保持不变 ……

    selfHideMarker = 0.0;
    if (abs(ProjMat[2][3]) > 10e-6
        && abs(Color.r - SELF_TINT_R) < 0.002
        && Color.g > 0.999 && Color.b > 0.999 && Color.a > 0.999) {
        selfHideMarker = 1.0;
    }
}
```

其中最关键的时序约束是**检测必须位于光照混合之前**：原版随后执行 `vertexColor = minecraft_mix_light(...) * texelFetch(Sampler2, UV2 / 16, 0)`，方向光照与 lightmap 的乘法染色会破坏通道比例，此后 254/255 的标记将无法识别[9][11]。

**片元着色器**（fsh）：

```glsl
in float selfHideMarker;
in float sphericalVertexDistance;   // 原版 vsh 已输出（fog_spherical_distance）

#define SELF_HIDE_DIST 1.5

void main() {
    if (selfHideMarker > 0.5 && sphericalVertexDistance < SELF_HIDE_DIST) {
        discard;
    }
    // …… 原版逻辑保持不变 ……
}
```

变体模型所有顶点同色，标记在同一图元内恒为 1.0，无需 `flat` 插值限定。

### 4.3 按观察者差异化

资源包只负责定义"带标记的变体"，"谁看到变体"由服务端决定：展示实体的物品栈存于实体元数据（1.21.x 中 ItemDisplay 的 `item_stack` 位于索引 23，插值时长位于索引 9），需在服务端网络层按观察者改写下发给背饰佩戴者本人的实体元数据包，将其中的 `item_model` 组件替换为 `_self` 变体。该步骤超出资源包/原版数据包能力范围，本文从略。

## 5 纯资源包实现的可行性分析

标记与着色器均为资源包内容，故存在一条不依赖服务端的退化路线：**不做 `_self` 变体，直接让背饰模型常挂魔法色 tint**。此时行为变为"任何相机距离该模型 1.5 格以内即不渲染"：

| 场景 | 表现 |
| --- | --- |
| 本人第一人称（0.3~0.8 格） | 隐藏 ✓ |
| 本人第三人称（约 4 格） | 可见 ✓ |
| 他人正常距离观看 | 可见 ✓ |
| 他人贴近 1.5 格内围观 | 不可见 ✗（妥协点） |

原版数据包（战利品表、函数、谓词等）不提供任何按观察者切换实体物品模型的机制，无法弥补上述妥协。因此结论是：纯资源包可实现约九成的效果；要精确表达"仅本人第一人称不可见"，服务端按观察者差异化是必要条件。

版本适配方面，1.21.6~1.21.11 可直接使用本文代码；1.21.4/1.21.5 处于 UBO 改造前的旧结构（`#version 150`，`ProjMat` 等为普通 uniform，雾参数形态亦不同），需另行移植，并可借助 `pack.mcmeta` 的 overlays 按版本分发[2][8]。

## 6 讨论

### 6.1 大模型的部分可见

距离判定是逐片元的：超出阈值的图元不会被丢弃。超过 1.5 格的大型背饰在第一人称下可能残留部分可见。缓解手段是按最大模型半径调整 `SELF_HIDE_DIST`（阈值 = 半径 + 0.5 格余量）；代价是狭窄空间中第三人称相机被碰撞推近时的误隐藏窗口增大。对超大模型也可选择不做标记，退化为第一人称可见。

### 6.2 已知限制

- **光影管线不兼容**：Iris/OptiFine 接管渲染管线后核心着色器失效，本方法与 CEM-S 类方案同样受限[6][12]；
- **附魔光效独立**：glint 使用独立的核心着色器，带光效的模型需另行同样处理，否则第一人称会看到"隐形模型的光效"；

## 7 结论

本文提出并验证了一种"第一人称隐藏自身背饰"的完整方法：以 constant tint 魔法色作为顶点色标记，在核心着色器中于光照混合前识别标记，结合投影矩阵形态排除 GUI、以片元相机距离区分本人第一/第三人称，对近距离片元执行 discard。方案对玩家不可感知（1/255 亮度差），在 1.21.6~1.21.11 上稳定，并可退化为纯资源包实现。该方法的核心思想——"用物品模型定义主动构造顶点色信道，再在核心着色器中消费该信道"——亦可推广至其他需要按物品种类做特殊渲染处理的场景。

## 参考文献

[1] 着色器 - Minecraft Wiki[EB/OL]. https://zh.minecraft.wiki/w/%E7%9D%80%E8%89%B2%E5%99%A8.

[2] 原版着色器指导[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/save/916150.html.

[3] Minecraft GLSL Shader着色器基础教程系列[EB/OL]. 哔哩哔哩专栏. https://www.bilibili.com/read/readlist/rl738651.

[4] MCJE着色器教程：从开发入门到游戏崩溃[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/datapack_index.html#aopshader.

[5] 香草着色器入门教程！[EB/OL]. ETIS. https://etis.vcsofficial.site/d/17-xiang-cao-zhao-se-qi-ru-men-jiao-cheng-421.

[6] McTsts. Minecraft-Shaders-Wiki[EB/OL]. GitHub. https://github.com/McTsts/Minecraft-Shaders-Wiki/tree/main.

[7] 着色器基础教程01：Minecraft中的着色器[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202508/1/content.html.

[8] 着色器基础教程02：核心着色器的工作流程（上）[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202509/3/content.html.

[9] 着色器基础教程03：核心着色器的工作流程（中）[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202510/3/content.html.

[10] 着色器基础教程04：核心着色器的工作流程（下）[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202511/2/content.html.

[11] 附注-核心全局量汇总（上）[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202512/5/content.html.

[12] 着色器的应用与滥用[EB/OL]. 香草图书馆. https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202605/2/content.html.
