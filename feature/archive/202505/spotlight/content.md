---
title: '香草快讯 - Λojang Spotlight - 2025年5月'
---


<script setup>
    import SpotlightHead from '/.vitepress/vue/SpotlightHead.vue'
	import ColorLine from '/.vitepress/vue/ColorLine.vue'
</script>

<SpotlightHead
    title = "香草快讯 - Λojang Spotlight - 2025年5月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.jpg'
	type=1
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共更新了四个快照：25w16a，25w17a，25w18a，25w19a。数据包版本号来到了**76**，资源包版本号来到了**60**。

先说结论，本月更新功能性较好，破坏性偏小，优化性一般，总体属于**大杯**水平。

本月更新中，Mojang为我们端上来了前瞻中提到过的路径点功能，同时对着色器中的Uniform变量进行了优化性更改。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 路径点/waypoint

在25w17a中，Mojang将路径点移除了实验性内容，意味着[定位栏](https://zh.minecraft.wiki/w/定位栏)和路径点的相关内容正式加入了游戏之中。

什么是路径点呢？作为和定位栏一起更新的内容，路径点是世界中的一个位置，可以在玩家的定位栏中投射记号，也就是在定位栏上看到的路径点指示器。这些指示器指示了路径点相对于玩家目前视线方向的相对角度。一般来说，只有玩家可以产生路径点，但是如果一个生物的`waypoint_transmit_range`大于0，它也可以在附近玩家的定位栏中产生指示器。

路径点指示器是否出现主要由两个属性控制：[路径点传输距离](https://zh.minecraft.wiki/w/属性/路径点传输距离)（`waypoint_transmit_range`）和[路径点接收距离](https://zh.minecraft.wiki/w/?curid=149918)（`waypoint_receive_range`），下面简称为传输距离和接收距离。把生物看作一个广播站，玩家看作一个收音机，那传输距离就定义了生物最远能广播自己位置给多远的玩家，而接收距离则定义了玩家最多能接收到多远距离内的生物的广播。所以只有当在玩家的接收距离内的生物，它的传输距离大于自己和玩家之间的距离的时候，玩家才能接收到这个生物的坐标信息（路径点），才能在自己的定位栏上显示出这个生物的位置。

> [!NOTE]
>
> 下图展示了两个玩家之间的”路径点广播的过程“。红色范围表示路径点传输距离，蓝色范围表示路径点接收距离。仅当Alex的传输范围包含Steve且Steve的接收范围包含Alex时，Steve才能看到Alex的路径点图标
>
> ![qwq](waypoint_range.png)
>
> 来自：[属性/路径点接收距离 - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/属性/路径点接收距离)

定位栏通常情况下会占用玩家经验条的位置。但是，如果玩家经验发生了变动，或者打开了需要看到经验的界面（比如铁砧和附魔台的界面），经验栏就会显示出来。当然，也可以使用`locatorBar`游戏规则来控制是否显示定位栏。

Mojang提供了[`waypoint`](https://zh.minecraft.wiki/w/?curid=149568)来对路径点进行一些操作。使用`waypoint modify <waypoint> (color|style) ...`可以更改路径点的样式或者颜色，其中`waypoint`需要是单个实体。一般来说，我们可以使用一个marker实体来创建一个自定义路径点，然后修改这个`marker`的相关属性来控制路径点的显示。

路径点的图标也可以通过资源包中的[路径点图标样式](https://zh.minecraft.wiki/w/资源包#路径点图标样式)指定自定义的纹理。

## 💥Uniform块

在25w16a中，Mojang将着色器中的所有核心着色器的Uniform变量都变为了Uniform块，从而让Uniform变量变得透明可见。例如，在`include/globals.glsl`中有：

```glsl
#version 150

layout(std140) uniform Globals {
    vec2 ScreenSize;
    float GlintAlpha;
    float GameTime;
    int MenuBlurRadius;
};
```

均对应了以前隐含的默认提供的Uniform变量。在着色器中，可以直接使用[Uniform块](zhuanlan.zhihu.com/p/33093968)中定义好的Uniform变量。

同时，在后处理管线的渲染过程Json格式中，Uniform的定义也是按照Uniform块的格式来定义了。原来定义了Uniform变量的`uniforms`字段现在对应了着色器中的一个Uniform块，同时这个Uniform块将在片段着色器和顶点着色器之间共享。例如，对后处理管线程序`blur.json`中有

```json
{
	"vertex_shader": "minecraft:post/blur",
	"fragment_shader": "minecraft:post/box_blur",
	"inputs": [
		{
            "sampler_name": "In",
            "target": "minecraft:main",
            "bilinear": true
		}
	],
	"output": "swap",
	"uniforms": {
		"BlurConfig": [
			{
				"name": "BlurDir",
				"type": "vec2",
				"value": [ 1.0, 0.0 ]
			},
			{
				"name": "Radius",
				"type": "float",
				"value": 0.0
			}
		]
	}
}
```

对应在`post/blur.vsh`和`post/box_blur.fsh`中均有Uniform块定义：

```glsl
layout(std140) uniform BlurConfig {
    vec2 BlurDir;
    float Radius;
};
```

注意，Json中对Uniform块中变量的定义必须和着色器中的定义顺序严格一致。而Json中Uniform块对应的`name`字段虽然已经被废弃，即和着色器中的定义并无关系，但是处于可读性考虑，仍然推荐写上并且和着色器保持一致。

有些Uniform块是游戏自动链接传入的，有些则需要通过Json的方式手动传入。具体的在后处理管线程序中需要传入的Uniform块，以及在本次更新中新定义的用于透明化原Uniform变量的Uniform块在[更新日志](https://zh.minecraft.wiki/w/25w16a)的着色器与后处理管线部分中均有说明。

## 其他

在25w16a中，解除了资源包模型定义中，方块模型的旋转角度必须为22.5的倍数的限制。

在25w18a中，为所有带有AI的生物（包含AI生物共通标签的实体）添加了`home_pos`字段（定义”家“的中心位置）和`home_radius`字段（定义”家“的范围半径）。这些字段将会为生物设置一个”家“的范围，而后此生物的寻路范围只会局限在”家“的范围内。值得注意的是，蝙蝠、史莱姆、岩浆怪、幻翼和末影龙可以忽略此字段的影响。

💥在25w18a中，还将所有的Json文件解析器更改为了必须用严格模式解析，要求所有的Json必须严格遵守Json格式规范。也就是说，你不能再用单引号表示字符串，也不能在列表和对象的末尾使用尾随逗号，你也不再能在Json中使用注释——虽然你大概从来没有意识到过你可以做这些，因为常用的数据包开发工具，比如说VSCode和DHP，都是默认以严格模式对Json进行语法解析的（除非你设置语言为Json with comment），所以，其实几乎没有任何的影响啦。

此外，还给一些实体添加了一些新的字段，以及弹射物精度有关的更改，这里就不细说啦。具体内容，请前往Wiki查看~

[25w19a - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/25w19a)

[25w18a - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/25w18a)

[25w17a - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/25w17a)

[25w16a - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/25w16a)