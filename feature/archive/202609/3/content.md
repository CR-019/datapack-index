---
title: '后处理着色器工作流程'
---


<FeatureHead
title='后处理着色器工作流程'
authorName='轩宇1725'
/>

## 摘要

本文为后处理的第一篇，介绍了后处理管线的定义格式和使用方法。涵盖目前已发布的所有版本。

## 前言

没想到后处理篇目拖到现在居然等到了 26.3 给后处理增加接口，由于后处理的结构改过，本文直接讲 26.3 版本下的后处理管线，并在附录中简单介绍一下 1.7 起的旧版后处理管线。方便读者适应中间几个不同版本的情况。（即使你是旧版本开发者，也推荐先看新版本的格式，再看后面的旧版本格式，因为新版本的信息更加丰富，反而能帮助你理解旧版本的逻辑）

核心着色器用于控制画面上的一切东西如何渲染，但它是局域的，即只能获取当前渲染的这个面相关的信息，因此也不知道周围场景的几何形状。

而后处理则是当所有东西渲染完毕之后，把整个画面作为纹理输入，再生成一个新画面的过程，因此可以获取到场景的更多信息，但被遮挡的内容、屏幕外的内容就完全访问不了了。另外，Minecraft 没有让 GUI 渲染参与后处理阶段，因此后处理也“看不到” GUI，如聊天栏、背包等。

## 缓冲

缓冲（Buffer）是渲染过程中用于存储数据的显存区域，而帧缓冲可以理解为一块画板。包含颜色和深度等各种附件（各种画布）。

“画板”还是“画布”的比喻不需要分得太严格，我们这里只关心一个帧缓冲有颜色和深度两个部分。而 Minecraft 后处理着色器本质上就是不同帧缓冲之间交换和处理数据的管线（也称流水线）——后处理渲染管线。

更简单地考虑，这些缓冲被使用时，也都被绑定到一个 Sampler2D 上，因此也可以将它们理解为一副画面，一张纹理或一张图片。其中每一个像素点上可以被采样出一个 vec4 向量（不意味着有那么多数据，比如深度缓冲其实只在每个位置有一个float值，下文会提到）

## 深度缓冲

深度缓冲只有在 1.16 引入极佳管线后才可用

从深度缓冲采样得到的值是一个vec4，采样得到的结果中只有 r 通道是深度，格式是 vec4(depth, 0.0, 0.0, 1.0)，1.17前为 vec4(depth, depth, depth, 1.0)

26.2 以下，近平面对应的深度是 0.0，而远平面对应的深度是 1.0. 而自 26.2 起使用反向深度，即近平面对应 1.0, 远平面对应 0.0.

> 26.2-snapshot-1：现在渲染使用反向深度缓冲，这有助于在大部分硬件上改善深度冲突。修复了 MC-190728 (https://bugs.mojang.com/browse/MC-190728)。
> 但他为什么要这么做呢？

## 管线

### 定义格式

管线（pipeline）是一个由 json 声明的流水线，存储在资源包内的 `assets/namespace/post_effect` 内，定义了多个渲染目标（target）和渲染过程（pass）。

<div class="nbttree">

<node type="compound" name=""/> 根标签
 - <node type="compound" name="targets"/> 渲染目标
 - <node type="list" name="passes"/> 渲染过程

</div>

其中，一个渲染目标就是一个帧缓冲，定义在 targets 标签内，键名就是帧缓冲的名字

<div class="nbttree">

<node type="compound" name=""/> 渲染目标
 - <node type="int" name="width"/> 帧缓冲的宽度，不指定时为视口宽度
 - <node type="int" name="height"/> 帧缓冲的高度，不指定时为视口高度
 - <node type="bool" name="persistent"/> 切换帧时保留数据，不指定时为假，即每帧清除
 - <node type="list" name=""/><node type="int" name="clear_color"/> 如果为列表，每个成员分别是归一化的 RGBA 值，如果为整数，则是格式为 ARGB 的 24 位颜色值（每通道占 8 位）不指定时默认为 `[0.0, 0.0, 0.0, 0.0]`

</div>

这里所说的视口，即这一帧窗口内显示东西的区域。和ScreenSize同语义。

可以注意到这里每个参数都是可选的，因此如下的声明会创建一个名字为 foo，尺寸和视口大小一致，每帧自动清空的帧缓冲：

```json
{
    "targets":{
        "foo":{}
    }
}
```

渲染过程是一组操作，每个pass内声明一个或多个输入、顶点着色器和片元着色器、一个输出目标和uniform块定义（可选）。

<div class="nbttree">

<node type="compound" name=""/> 一个pass
 - <node type="string" name="vertex_shader"/> 顶点着色器相对于 `assets/namespace/shaders` 的命名空间路径
 - <node type="string" name="fragment_shader"/> 片元着色器相对于 `assets/namespace/shaders` 的命名空间路径
 - <node type="list" name="inputs"/> 输入，详见后文
 - <node type="string" name="output"/> 输出目标的id
 - <node type="compound" name="uniforms"/> uniform 的定义
    - <node type="list" name=""/> 键名为 uniform 块的名称
        - <node type="string"  name="name"/> uniform 变量名
        - <node type="string"  name="type"/> uniform 变量类型，可选值为 `int`, `float`, `ivec3`, `vec2`, `vec3`, `vec4`, `matrix4x4`
        - <node type="int" name=""/><node type="float" name=""/><node type="list" name=""/> uniform 的值，根据 uniform 的类型决定该键的类型。

</div>

### pass的输入

pass有两种输入，分别是渲染目标输入和纹理输入。

<div class="nbttree">

<node type="compound" name=""/> 一个pass
 - <node type="string" name="sampler_name"/> 采样器的名称，如果将这个值写为 `MainDepth`，则着色器内对应的 sampler2D uniform 名称为 `MainDepthSampler`，并自动提供一个 SamplerInfo uniform 块内的 `MainDepthSize` 变量。（仍需声明，见下文）
 - <node type="bool" name="bilinear"/> 使用双线性插值过滤，若为假则使用最近邻居过滤，默认为假。
 - 如果是渲染目标输入，还有如下的属性
 - <node type="string" name="target"/> 渲染目标的id
 - <node type="bool" name="use_depth_buffer"/> 是否使用深度缓冲。如果为真，采样时从深度缓冲采样，如果为假，采样时从颜色缓冲采样。
 - 如果是纹理输入，还有如下的属性
 - <node type="string" name="location"/> 纹理相对于 `assets/namespace/textures/effect` 的命名空间路径
 - <node type="int" name="width"/> 以像素为单位的图像宽度
 - <node type="int" name="height"/> 以像素为单位的图像宽度

</div>

注意，这里的图像尺寸在最新版其实没有作用（除了字面量不合法导致解析失败外）。在 1.21.1-1.21.5，这个字段被用于设置 xxxSize 这个 uniform (1.7.2 - 1.21.1 的版本见后续的旧版管线). 在 1.21.6 后，该 uniform 实际上取的是图像尺寸。而自 1.7.2 起图像始终是以原尺寸进入显存和采样的。

### 管线的使用

26.3 起可以通过 /posteffect 按顺序应用特定的管线。但原版有如下几个管线会被自动开启（按应用顺序）：

0. (自26.3) minecraft:end_of_frame 只要资源包被加载就会使用，无法用 /posteffect 关闭
1. (仅1.16-26.2)当玩家的 `视频设置`>`品质与性能` 的预设为“极佳！”时，应用 `transparency` 管线，将不同元素的缓冲重新叠加。内置的特殊渲染目标有：
- minecraft:main 不透明世界（实心/镂空地形、不透明实体、天空等）
- minecraft:translucent 水、染色玻璃等半透明方块
- minecraft:item_entity 掉落物、经验球等
- minecraft:particles 粒子
- minecraft:clouds 云
- minecraft:weather 雨雪

2. 当屏幕内有发光轮廓时，应用 `entity_outline` 管线，作用是将核心着色器 `rendertype_outline` 渲染好的发光部分模糊扩张后重新叠加。内置的特殊渲染目标有：
- minecraft:main 不含发光轮廓部分的渲染结果
- minecraft:entity_outline `rendertype_outline` 的绘制结果

最终由 java 端将 entity_outline 的内容用 blit 着色器拷贝到 main 并显示到屏幕上。（）

3. 当旁观苦力怕、蜘蛛、末影人时，分别应用 `creeper`, `spider`, `invert` 管线，对画面起滤镜效果。

### 上屏逻辑

管线结束后，旧版的超级秘密选项/旁观/极佳以及自定义管线都是将最后 minecraft:main 的结果写入屏幕上。而 entity_outline 是由 java 端将 minecraft:entity_outline 拷贝到 minecraft:main 里再上屏。

> 注意在 entity_outline 管线里如果向 minecraft:main 写入颜色会破坏深度缓存，这个bug最晚在2021年前就被发现了，但是mojira上居然没有报告？！

## 后处理的着色器

GLSL着色器本身的结构都相似，因此我们主要说的是这些着色器如何与pass要求对接。

自 1.21.9 起，原版的后处理着色器程序统一使用 `core/screenquad.vsh` 作为顶点着色器，我们只关心片元着色器的修改。

管线中定义的 uniform 块都需要声明才能让着色器通过编译。如果声明了一个输入采样器名称为 In，一个自定义 uniform 快 BlurConfig，内含两个变量 vec2 BlurDir, float Radius.

```glsl
layout(std140) uniform SamplerInfo {
    vec2 OutSize;
    vec2 InSize;
};

layout(std140) uniform BlurConfig {
    vec2 BlurDir;
    float Radius;
};
```

> 这里 OutSize 是输出目标的大小，以像素为单位。

也需要声明对应的采样器：

```glsl
uniform sampler2D InSampler
```

## 例子 - creeper.json

```json
{
    "targets": {
        "swap": {}
    },
    "passes": [
        {
            "vertex_shader": "minecraft:core/screenquad",
            "fragment_shader": "minecraft:post/color_convolve",
            "inputs": [
                {
                    "sampler_name": "In",
                    "target": "minecraft:main"
                }
            ],
            "output": "swap",
            "uniforms": {
                "ColorConfig": [
                    {
                        "name": "RedMatrix",
                        "type": "vec3",
                        "value": [ 0.0, 0.0, 0.0 ]
                    },
                    {
                        "name": "GreenMatrix",
                        "type": "vec3",
                        "value": [ 0.3, 0.59, 0.11 ]
                    },
                    {
                        "name": "BlueMatrix",
                        "type": "vec3",
                        "value": [ 0.0, 0.0, 0.0 ]
                    }
                ]
            }
        },
        {
            "vertex_shader": "minecraft:core/screenquad",
            "fragment_shader": "minecraft:post/bits",
            "inputs": [
                {
                    "sampler_name": "In",
                    "target": "swap"
                }
            ],
            "output": "minecraft:main",
            "uniforms": {
                "BitsConfig": [
                    {
                        "name": "Resolution",
                        "type": "float",
                        "value": 16.0
                    },
                    {
                        "name": "MosaicSize",
                        "type": "float",
                        "value": 4.0
                    }
                ]
            }
        }
    ]
}
```

## 1.7.2～1.21.1 管线格式

### 后处理管线程序

<div class="nbttree">

<node type="compound" name=""/> JSON文件根元素
 - <node type="list" name="targets"/> 指定后处理管线中需要创建以使用的自定义渲染目标。列表里每一项可以是：
  - <node type="string" name=""/> 渲染目标名称，宽度和高度为当前窗口大小
  - <node type="compound" name=""/> 带固定尺寸的后处理渲染目标
   - <node type="string" name="name"/> 渲染目标名称
   - <node type="int" name="width"/> 渲染目标内帧缓冲的宽度
   - <node type="int" name="height"/> 渲染目标内帧缓冲的高度
 - <node type="list" name="passes"/> 渲染过程列表
  - <node type="compound" name=""/> 一个渲染过程
   - <node type="string" name="name"/> 程序定义名称，对应 `shaders/program/<名称>.json`，不写命名空间
   - <node type="string" name="intarget"/> 输入渲染目标。输入渲染目标固定使用 `DiffuseSampler` 采样器和 `InSize` Uniform
   - <node type="string" name="outtarget"/> 输出渲染目标。不能和 `intarget` 相同
   - <node type="bool" name="use_linear_filter"/> （1.20.5 起）为 true 时，此过程的纹理采样模式由最近邻采样切换到线性插值。不写为假
   - <node type="list" name="auxtargets"/> 纹理输入，可选
    - <node type="compound" name=""/> 一项纹理输入
     - <node type="string" name="name"/> 着色器里的采样器全名（例如 `DiffuseDepthSampler`），不是前缀
     - <node type="string" name="id"/> 输入渲染目标绑定的后处理帧缓冲名称；或 `textures/effect` 下 png 的路径（不含 `.png`）。在渲染目标ID后加 `:depth` 后缀则使用该目标的深度缓冲而不是颜色缓冲（如 `minecraft:main:depth`）
     - <node type="int" name="width"/> `id` 指向纹理时必填，纹理的宽度，单位为像素，用来填 `AuxSize<序号>`
     - <node type="int" name="height"/> 指向纹理时必填，纹理的高度，单位为像素
     - <node type="bool" name="bilinear"/> 指向纹理时必填。为 true 时用线性过滤进行采样，否则将使用邻近过滤
   - <node type="list" name="uniforms"/> 覆盖程序定义里的默认值，可选
    - <node type="compound" name=""/>
     - <node type="string" name="name"/> Uniform变量名
     - <node type="list" name="values"/> 浮点数数组，长度须与程序定义的 `count` 一致

</div>

特殊的渲染目标：

- `minecraft:main`：与新版本一致，见前文。
- 在 entity_ouline 中： `final` 为发光轮廓，与新版本的 `entity_outline` 一致。

主输入对应 `InSize`；`auxtargets` 第 *i* 项（从 0 计）对应 `AuxSize<i>`。`width` / `height` 只用来填这些 Size，纹理仍按 png 原尺寸进入显存。

此外，还需要用json专门配置一个着色器程序。

### 程序定义

<div class="nbttree">

<node type="compound" name=""/> `assets/<命名空间>/shaders/program/<名称>.json`
 - <node type="compound" name="blend"/> 混合模式。原版常用，但没有实际作用
    - <node type="string" name="func"/> 如 `add`
    - <node type="string" name="srcrgb"/> 如 `srcalpha`、`one`
    - <node type="string" name="dstrgb"/> 如 `1-srcalpha`、`zero`
 - <node type="string" name="vertex"/> 顶点着色器文件名，相对本目录，不写 `.vsh`
 - <node type="string" name="fragment"/> 片段着色器文件名，不写 `.fsh`
 - <node type="list" name="attributes"/> 顶点属性定义。后处理只能写 `Position`
 - <node type="list" name="samplers"/> 采样器声明
     - <node type="compound" name=""/>
         - <node type="string" name="name"/> 须包含 `DiffuseSampler`，以及所有会在 `auxtargets` 里用到的 `name`
 - <node type="list" name="uniforms"/> Uniform声明
     - <node type="compound" name=""/>
         - <node type="string" name="name"/> Uniform变量名。游戏会自动填 `Time`（0～1，每秒循环）、`InSize`、`OutSize`、`ProjMat`
     - <node type="string" name="type"/> 如 `float`、`matrix4x4`
     - <node type="int" name="count"/> 分量个数（`vec2` 为 2，`matrix4x4` 为 16）
     - <node type="list" name="values"/> 默认值，长度等于 `count`

</div>

这里对 uniform 字段的字面量检查非常松：

json 端只有 value 的长度大于 1 且不等于 count 时会无法解析。

而着色器只看 value 写了几个数，越界会报错，不足会只覆盖前几个数。

type 只检查是不是合法的枚举，并不核实字面量是不是对应的类型。

内置的 Uniform 逻辑相同，只匹配名字，然后再更新对应 count 数的分量。

## 历史

注：这不完全是wiki上的历史表，wiki上的历史表并不完整，下面的内容是从代码中整理并补充的。

| 版本 | 开发版本 | 更改 |
| --- | --- | --- |
| **1.7.2** | 13w38a | 加入了后处理管线，被超级秘密选项调用。管线为上文的 `shaders/post` + `shaders/program` 格式。 |
| **1.8** | 14w05a | 加入了苦力怕和蜘蛛后处理管线。当以苦力怕、蜘蛛或末影人的视角观察世界时，后处理管线将被自动启用。 |
| | 14w05b | 现在当玩家脱离生物视角时，后处理管线会被禁用。F4 现在会切换不同的后处理管线，而不是禁用后处理管线。 |
| | 14w06a | 加入了实体轮廓后处理管线。 |
| **1.9** | 15w31a | 因内部重写而移除了超级秘密选项按钮。管线程序文件仍留在资源里。 |
| **1.16** | 20w22a | 为 *极佳！*图像品质添加了半透明后处理管线。深度缓冲写作 `"id": "<目标>:depth"`。 |
| **1.20.5** | 24w05a | 将 `blur` 后处理着色器重命名为 `box_blur`。加入了后处理过程可选字段 `use_linear_filter`。为 true 时，此过程的纹理采样模式由最近邻采样切换到线性插值。加入了后处理着色器 `entity_outline_box_blur`。 |
| | 24w09a | 加入了 `blur`后处理管线渲染模糊GUI背景效果。 |
| | 24w11a | 移除了所有未被使用的后处理着色器。这些被删除的着色器曾用于超级秘密选项。 |
| **1.21.2** | 24w33a | 修改了后处理管线的格式。输入渲染目标（`intarget`）与纹理输入（`auxtargets`）现合并为 `inputs`；重命名 `outtarget` 为 `output`。`targets` 现作为帧缓冲名与帧缓冲定义的映射，而不再是一个列表（`["swap"]` 现在为 `{"swap": {}}`）。每个输入使用 `sampler_name` 作为 `_Sampler` 采样器和 `_Size` 的前缀（此前输入渲染目标固定使用 `DiffuseSampler` 采样器和 `InSize` Uniform）。`use_depth_buffer` 替代了原渲染目标ID的 `:depth` 后缀。纹理输入改为使用 `location` / `width` / `height` / `bilinear`。`bilinear` 亦可作用于渲染目标，替代原渲染过程格式中的 `use_linear_filter` 字段。 |
| | 24w34a | 后处理管线程序由 `assets/<命名空间>/shaders/post` 移动到 `assets/<命名空间>/post_effect`。后处理管线使用的顶点和片段着色器现由 `assets/<命名空间>/shaders/program` 移动到 `assets/<命名空间>/shaders/post`。现在所有着色器路径都使用命名空间ID。后处理渲染过程 `name` 现被重命名为 `program`，且需要命名空间ID。删除了着色器格式中没有实际作用的混合模式、顶点属性定义（`blend`、`attributes`）。Uniform现与为核心着色器提供的Uniform合并，其中 `Time` 被重命名为 `GameTime`。实体轮廓后处理着色器现直接传入 `minecraft:entity_outline` 渲染目标。*极佳！* 的图像半透明后处理设置不再指定排序帧缓冲区作为自定义目标，渲染目标重命名为 `minecraft:translucent`、`minecraft:item_entity`、`minecraft:particles`、`minecraft:weather`、`minecraft:clouds`。 |
| **1.21.5** | 25w07a | 删除了核心着色器和后处理着色器的JSON文件定义。修改了后处理管线的格式。后处理渲染过程JSON格式中的 `program` 现被 `vertex_shader` 和 `fragment_shader` 取代；`<命名空间>:<路径>` 会被解析为 `assets/<命名空间>/shaders/<路径>.<vsh\|fsh>`。每个Uniform定义的 `type` 字段现在是必选项（可选值包括 `int`、`ivec3`、`float`、`vec2`、`vec3`、`vec4` 和 `matrix4`）。每个Uniform定义的 `values` 字段现在是可选项。 |
| **1.21.6** | 25w16a | 现在后处理管线的JSON文件使用Uniform块，并使用 `value`字段指定Uniform。向后处理渲染目标加入新属性 `persistent` 和 `clear_color`。弃用了 `name` 字段。移除了 `values` 字段，现在使用 `value`字段指定Uniform（`int` / `float` 为单个数字）。大小的列表（所有 `vec2*Size` 的Uniform）现在被单个Uniform块 `SamplerInfo`取代，包含按顺序的输入纹理大小和输出纹理大小。 |
| **1.21.9** | 25w31a | 移除了 `core/blit_screen.vsh`、`post/blit.vsh`、`post/blur.vsh`、`post/invert.vsh`、`post/sobel.vsh` 和 `post/screenquad.vsh` 着色器，现在由 `core/screenquad.vsh`替代。用于后处理效果、亮度图生成和全屏位块传输的顶点着色器不再传递 `Position` 属性，而须通过 `gl_VertexID`分配顶点坐标。 |
| **26.2** | snapshot-1 | 现在渲染使用反向深度缓冲，这有助于在大部分硬件上改善深度冲突。管线 json 字段不变。 |
| **26.3** | snapshot-2 | 将“改进透明显示”选项的实现方式更换为新的顺序无关透明（OIT）算法。移除了旧的透明后处理链：`post_effect/transparency.json`、`shaders/post/transparency.fsh`。 |
| | snapshot-3 | 加入了 `minecraft:end_of_frame`后处理管线，可由资源包定义。该效果将在所有其他效果之前应用。只要加载了资源包，该效果就会一直启用，`/posteffect` 命令无法将其禁用。加入 `/posteffect`，添加或移除玩家使用的后处理效果。 |
| | snapshot-5 | 着色器包含现在由ShaderC使用 `#include` 而不是 `#moj_import` 处理。现在着色器的输入输出必须在源码中指明位置。 |

