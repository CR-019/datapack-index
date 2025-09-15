---
title: '自然工艺 - 高版本自定义模型框架'
---

<FeaturedHead
    title = '自然工艺 - 高版本自定义模型框架'
    authorName = 七柏
    avatarUrl = '../../_authors/七柏.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/405830542' }
    ]"
    :extraAuthors="[
      {
        authorName: 'Nox_Obscura',
        avatarUrl: '../../_authors/nox_obscura.jpg',
        socialLinks:[
          { name: 'BiliBili', url: 'https://space.bilibili.com/1184771713' }
        ]
      }
    ]"
    resourceLink = https://github.com/Bybycyann/NatureCraft
    cover='../_assets/2.png'
/>

> by - 七柏, Nox_Obscura
>
> 仓库地址 : [[NatureCraft: Minecraft-Java原版自定义模型支持库](https://github.com/Bybycyann/NatureCraft)]
>
> NatureCraft 交流群 : [602217514](https://qm.qq.com/q/qD7TOv3LAO)
>
> 自 1.16 版本以来进行的多次更新, 极大程度拓展了高版本数据包的操作空间。 以此为基础, 编写了一个高版本自定义交互模型支持框架, 以便玩家添加各式各样的模型来丰富游戏体验。

## 简介

NatureCraft 是面向高版本 (1.21.5+) 的自定义交互模型框架。该数据包为二次开发, 充分吸收前一代总结的经验, 参考学习了 [NyaaWorks](https://www.bilibili.com/video/BV12ohXeYE2h/?spm_id_from=333.1387.upload.video_card.click), [Decoration Creator Kit](https://www.bilibili.com/video/BV1HKY9z9Ek2) 等一众知名框架包, 结合一些更丰富的内容, 历时两周左右~~编写完成~~(还没有完全完成)。

## NatureCraft 相较于其它框架有什么特点?

作为一个自定义模型支持库, 我们当然需要为玩家提供了一种模型注册、交互与存储方法。你可以使用该框架创作许多有趣的交互模型, 包括但不限于 : 家具, 地物, 祭坛, 功能石碑, 宝箱, 作物等。

### A. 独立化模型包制作

为了尽可能实现**模型包之间及模型包与框架包的独立性**, 我们提供了一种基于 [命令存储 (Storage)](https://zh.minecraft.wiki/w/命令存储存储格式?variant=zh-cn) 的模型数据存储方式。玩家可以通过向不同命名空间的命令存储中注册模型来实现**模型包的独立化存储与分发**。

当玩家想要基于 NatureCraft 来创作自己的模型包时, 需要关注三个部分 :

- 存储模型的资源包;

- 管理模型数据的命令存储文件;

- 管理事件的数据包.

其中资源包的功能不必多说, 在 NatureCraft 框架下, 数据包仅负责提供一些自定义事件, 命令存储文件大家相对而言会比较陌生, [命令存储](https://zh.minecraft.wiki/w/命令存储存储格式?variant=zh-cn)是 1.15 版本加入的一种数据存储文件, 在 NatureCraft 中, 数据包会将该文件内容视为模型 "注册表" 来读取, 以对模型调用与模型事件提供支持。

在**区分命名空间**的情况下, 资源包与数据包本身都支持独立分发与跨存档调用, 模型数据也是支持的, 玩家只需要将存档下 `data/command_storage_<命名空间>.dat` 的文件拷贝下来即可直接跨存档使用。

> 当然这种方式也有缺陷, 在修改特定模型数据时会异常麻烦, 建议玩家在数据包中留档注册函数方便维护和管理模型。

<div style="text-align:center">
<img src=".\1.png" alt=".\1.png" style="zoom: 33%;" />
<p style="color: gray;">这是一个模型数据文件</p>
</div>

### B. 提供了对于条件性模型状态自适应更新的支持

考虑到模型在不同情况下需要调用不同变体, NatureCraft 提供了三种模型类型, 支持三种独立的状态映射模式。

<div class="nbttree">

<node type="compound" name="ModelData"/>
- <node type="string" name="type"/>模型类型, 默认为`none`, 其他可选值 : `hang`(悬挂), `link`(连接), `predicate`(谓词)。
- <node type="list" name="states"/>与方块状态类似的, 用于定义不同情况下采用的模型映射规则。<br> &emsp;&emsp; **type** 为 `hang` 时: 
  - <node type="compound" name=""/>一个状态映射。
    - <node type="compound" name="model"/>递归标签。包含模型, 光照, 碰撞箱与交互箱属性与事件。
      - <node type="any" name="<模型属性标签>"/>一个模型属性。
    - <node type="string" name="facing"/> (0≤值≤5) 匹配一个模型附着面。  
    **type** 为 `link` 时: 
  - <node type="compound" name=""/>一个状态映射。
    - <node type="compound" name="model"/>递归标签。包含模型, 光照, 碰撞箱与交互箱属性与事件。
      - <node type="any" name="<模型属性标签>"/>一个模型属性。
    - <node type="compound" name="condition"/> 一个条件。
      - <node type="list" name="code"/> 一个10位状态数组, 用来描述临近10个位置满足的条件状态。
      - <node type="string" name="tag"/> 要检查的位置上的模型标签。
      **type** 为 `predicate` 时:  
  - <node type="compound" name=""/>一个状态映射。
    - <node type="compound" name="model"/>递归标签。包含模型, 光照, 碰撞箱与交互箱属性与事件。
      - <node type="any" name="<模型属性标签>"/>一个模型属性。
    - <node type="string" name="predicate"/> 一个[谓词](https://zh.minecraft.wiki/w/谓词) (支持内联定义)。
</div>


- 需要注意的是, `hang` 类模型的生成原点并不是紧贴墙面的, 而是离墙面有 `0.03125` 的距离.

- 关于 `link` 类模型状态映射的code键, 顺序满足 `[上,西北,北,东北,西,东,西南,南,东南,下]`, 即 :

  ```mcfunction
  "code":\
  [   ↑,\
  NW, N,NE,\
   W,    E,\
  SW, S,SE,\
      ↓],\
  ```

  当数字为1时, 表示目标位置需要有标记tag的模型实体, 为0时则不能有, 若为-1,则该位置任意。

  <div style="text-align:center">
  <img src=".\2.png" alt="2.png" style="zoom:50%;" />
  <p style="color: gray;">link模型的更新范围</p>
  </div>

### C. 更多事件源支持

NatureCraft 共支持 5 种事件源, 分别为 :

`place`(放置事件)、`left_click`(左键交互事件)、`right_click`(右键交互事件)、`random`(随机事件) 与 `clock`(周期事件)。

通过合理设置模型的事件属性, 可以实现丰富的效果, 如祭坛, 工作台, 自定义作物, 信标等效果。

- 关于 `random` 事件源, 该事件触发逻辑与[随机刻](https://zh.minecraft.wiki/w/刻?variant=zh-cn#随机刻)完全一致, 受 `randomTickSpeed` 规则控制;
- 关于 `clock` 事件源, 在之后的规划中打算添加**动画事件**分支。

### D. 复合模型支持

还在苦恼于模型块元素只能单轴旋转而使得表现力不足? NatureCraft 提供了复合模型的方法来绕过这个问题, 玩家可以将目标模型拆解成独立组件, 通过展示实体的旋转变换, 以此在游戏内实现更加复杂的模型效果。

<div class="nbttree">

<node type="compound" name="ModelData"/>
- <node type="string" name="item_model"/>外观数据。
  -  一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射), 决定物品状态下使用的模型。若不存在则与 <img src="/nbt_sprites/string.svg" class="nbt-icon"/> $\color{red}^*$**model** 保持一致。
  -  <node type="string" name="model" required=true />一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射)。
  -  <node type="compound" name="common"/> 展示实体渲染变换属性。
     -  <node type="any" name="<物品展示实体标签>"/>(详见[展示实体 - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/展示实体))
  - <node type="list" name="submodels"/> 子模型数据。
    - <node type="compound" name=""/>一个子模型定义。
      - <node type="string" name="model" />一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射)。
      -  <node type="compound" name="common"/> 展示实体渲染变换属性。
         -  <node type="any" name="<物品展示实体标签>" colon=false />

</div>


### E. 较高自由度的模型属性设置

NatureCraft 提供了模型交互箱、碰撞箱、光照的支持

其中碰撞箱分为两类 : 固定碰撞箱(屏障) 与 动态碰撞箱 (NoAI潜影贝)

交互箱与动态碰撞箱支持三个平移自由度调节

光照与固定碰撞箱不支持位移调节

## 如何使用 NatureCraft 注册自定义模型?

### 定义

NatureCraft 使用命令存储作为模型数据存储媒介, 按照下图格式定义

<div class="nbttree">
<node type="compound" name="ModelData"/>

+ <node type="compound" name="<模型ID>"/>
  + <node type="compound" name="template" required=true /> 模型调用的模板属性。解析为 `<命令存储> template.路径`。
    + <node type="string" name="name" required=true /> 命令存储的命名空间ID。
    + <node type="string" name="nbt" required=true /> 一个[NBT路径](https://zh.minecraft.wiki/w/NBT路径?variant=zh-cn)。
  + <node type="compound" name="model"/> 模型属性。
    + <node type="compound" name="model"/> 模型属性。在生成后**继承**于预加载 marker。变体独立存储的模型在注册时根据需要选择填入该字段。
      + <node type="string" name="name"/> 命令存储的命名空间ID。
      + <node type="string" name="name"/> 一个[NBT路径](https://zh.minecraft.wiki/w/NBT路径?variant=zh-cn)。
    + <node type="list" name="Tags"/> 添加给 Marker 实体的额外标签。(仅在模型生成时读取)
    + <node type="string" name="states"/> 与方块状态类似的, 用于定义不同情况下采用的模型映射规则。
        <br>&emsp; 当`type`为`hang`时：
      + <node type="compound" name=""/> 一个状态映射。
        + <node type="compound" name="model"/> 递归标签。包含模型, 光照, 碰撞箱与交互箱属性。
          + <node type="any" name="模型属性标签"/> 一个模型属性。
        + <node type="string" name="facing"/> (0≤值≤5) 匹配一个模型附着面。
           当`type`为`link`时: (Marker 会被添加一个 `NatureCraft.link` 的标签, 用于接受状态更新)
      + <node type="compound" name=""/> 一个状态映射。
        + <node type="compound" name="model"/> 递归标签。包含模型, 光照, 碰撞箱与交互箱属性。
          + <node type="any" name="模型属性标签"/> 一个模型属性。
        + <node type="compound" name="condition"/> 一个条件。
          + <node type="list" name="code"/> 一个10位状态数组, 用来描述临近10个位置需要满足的条件状态。
          + <node type="string" name="tag"/> 要检查的位置上模型要满足的标签。
           当`type`为`predicate`时、
      + <node type="compound" name=""/> 一个状态映射。
        + <node type="compound" name="model"/> 递归标签。包含模型, 光照, 碰撞箱与交互箱属性。
          + <node type="any" name="模型属性标签"/> 一个模型属性。
        + <node type="string" name="predicate"/> 一个谓词(支持内联定义)。
    + <node type="string" name=""/><node type="compound" name=""/><node type="list" name="item_name"/> ([文本组件](https://zh.minecraft.wiki/w/文本组件)) 模型名称。
    + <node type="bool" name="towards"/> 默认为 `true`。模型是否有朝向性, 即根据玩家放置视角决定水平朝向(NSWE), 在非默认类型下启用该选项可能会出错。
    + <node type="compound" name="display"/> 外观数据。
      + <node type="string" name="item_model"/> 一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射), 决定物品状态下使用的模型。若不存在则与 **model** 保持一致。
      + <node type="string" name="model"/> 一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射)。
      + <node type="compound" name="common"/> 展示实体渲染变换属性。
        + <node type="any" name="<物品展示实体标签>"/> (详见[展示实体 - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/展示实体))
      + <node type="list" name="submodels"/> 子模型数据。
        + <node type="compound" name=""/> 一个子模型定义。
          + <node type="string" name="model"/> 一个[物品模型映射](https://zh.minecraft.wiki/w/物品模型映射)。
          + <node type="compound" name="common"/> 展示实体渲染变换属性。
    + <node type="compound" name="ride"/> 骑乘属性。
      + <node type="double" name="height"/> 骑乘高度。
    + <node type="int" name="light_level"/> 光照等级。
    + <node type="compound" name="collision_box"/> 碰撞箱属性。
      + <node type="bool" name="barrier"/> 默认为 `false`, 是否采用屏障碰撞箱。(需要注意的是, 当该选项为 `true` 时, 光照属性将不生效。) 
      + <node type="double" name="offset_x" required=true /> (默认为0)碰撞箱底部中心相对方块底部中心在X轴上的偏移。
      + <node type="double" name="offset_y" required=true /> (默认为0)碰撞箱底部中心相对方块底部中心在Y轴上的偏移。
      + <node type="double" name="offset_z" required=true /> (默认为0)碰撞箱底部中心相对方块底部中心在Z轴上的偏移。
    + <node type="compound" name="interaction_box"/> 碰撞箱属性。
      + <node type="float" name="height" required=true /> (默认为0)交互箱高度。
      + <node type="float" name="width" required=true /> (默认为0)交互箱宽度。
      + <node type="double" name="offset_x" required=true /> (默认为0)交互箱底部中心相对方块底部中心在X轴上的偏移。
      + <node type="double" name="offset_y" required=true /> (默认为0)交互箱底部中心相对方块底部中心在Y轴上的偏移。
      + <node type="double" name="offset_z" required=true /> (默认为0)交互箱底部中心相对方块底部中心在Z轴上的偏移。
      + <node type="bool" name="response"/> (默认为`false`)玩家交互时是否挥动手臂。
    + <node type="compound" name="event"/> 交互事件。
      + <node type="compound" name="place"/> 放置事件。
        + <node type="string" name="name"/> 命名空间。
        + <node type="string" name="path"/>  一个事件**函数路径**。
      + <node type="compound" name="random"/> 随机刻事件。
        + <node type="any" name="<事件通用参数>"/> 一组事件通用参数(`name` & `path`)。解析为 `<name>:data/event/<path>`。
      + <node type="compound" name="clock"/> 时钟事件。
        + <node type="any" name="<事件通用参数>"/> 一组事件通用参数(`name` & `path`)。解析为 `<name>:data/event/<path>`。
        + <node type="int" name="time"/> 时钟周期, 以 `tick `为单位。
      + <node type="compound" name="left_click"/> 左键事件。
        + <node type="any" name="<事件通用参数>"/> 一组事件通用参数(`name` & `path`)。解析为 `<name>:data/event/<path>`。
      + <node type="compound" name="right_click"/> 右键事件。
        + <node type="any" name="<事件通用参数>"/> 一组事件通用参数(`name` & `path`)。解析为 `<name>:data/event/<path>`。
    + <node type="compound" name="const"/> 事件调用时传递的常参量。
      + <node type="compound" name="place"/> 放置事件传递的参数组。
      + <node type="compound" name="random"/> 随机事件传递的参数组。
      + <node type="compound" name="clock"/> 时钟事件传递的参数组。
      + <node type="compound" name="left_click"/> 左键事件传递的参数组。
      + <node type="compound" name="right_click"/> 右键事件传递的参数组。
        

</div>

在函数文件中输入

```mcfunction
data modify storage <命名空间ID> model.<nbt路径> set value {\
	...\
}\
```

对模型进行注册, 目前仅提供了一个基础模板 `naturecraft:base`, 其格式如下 :

```mcfunction
data modify storage naturecraft:main template.base set value {\
  "type": "none",\
  "display": {\
    "common": {\
      "transformation": {\
        "translation": [0.0f,0.5f,0.0f]\
      }\
    }\
  },\
  "interaction_box": {\
    "height": 1.0,\
    "width": 1.0,\
    "offset_x": 0.0,\
    "offset_y": 0.0,\
    "offset_z": 0.0,\
    "response": true\
  },\
  "event": {\
    "place": {\
      "name": "naturecraft",\
      "path": "base/sound"\
    },\
    "left_click": {\
      "name": "naturecraft",\
      "path": "base/group/break1"\
    }\
  }\
}
```
其定义了一个1\*1\*1的交互箱与基础的事件, 分别为左键的按原物掉落破坏事件(naturecraft:0 break), 以及放置时的声音事件(naturecraft:0 sound).

借助该模板, 可以很容易的定义一个最简单的展示模型 :

```mcfunction
data modify storage <命名空间ID> model.<nbt路径> set value {\
	"template": {\
		"name": "naturecraft:main",
		"nbt": "base"
	},\
	"model": {\
		"item_name": "<模型物品的名称>",\
		"display": {\
			"model": "<物品模型映射的命名空间ID>"\
		}\
	},\
	"event": {\
		"const":{\
			"place": {\
				"sound": "<音效的命名空间ID>"\
			},\
			"left_click": {\
				"sound": "<音效的命名空间ID>"\
			}\
		}\
	}\
}\
```

### 获取

包内定义了一个粗糙的give函数, 输入 :

```mcfunction
/function naturecraft:give {name:"<存储模型数据的命名空间ID>","nbt":"<模型存储的nbt路径>",model:"<一个物品模型映射>",count:<数量>,type:<none(0)|hang(1)>}
```

获取模型物品。

其中`type`参数决定模型是否获取依附面方向, 在模型类型为悬挂(hang)时写入1, 通常写入0。

### 事件

> NatureCraft 尚未正式完成, 目前仅提供少数基础性事件。

**naturecraft base/group/break1** : 按原模型掉落的破坏事件。接受一个`(string)sound`参数

**naturecraft base/loot_spawn** : 按指定的战利品表生成战利品。接受一个`(string)loot_tbale`参数(支持内联形式)

**naturecraft base/sound** : 声音事件。接受一个`(string)sound`参数

**naturecraft base/variant** : 模型变换, 调用另一个模型替代现有模型(仅外观)并更新时钟与随机刻标签。接受`(string)name`,`(string)nbt`参数

**naturecraft base/ride** : (内部调用)骑乘事件, 模型中由`ride`定义。

**naturecraft base/model_updata** : (内部调用)模型状态更新, 在`link`模型中使用。

## 使用 NatureCraft 制作的一些模型实例

### 紫水晶簇

<div style="text-align:center">
<img src=".\3.png" alt="3.png" style="zoom:23%;" />
<p style="color: gray;">采用悬挂变换与复合模型的紫荆簇</p>
</div>

::: details 注册函数
```mcfunction
data modify storage naturecraft:0 model.amethyst set value {\
  "template": {\
    "name": "naturecraft:main",\
    "nbt": "base"\
  },\
  "model":{\
    "type": "hang",\
    "towards": false,\
    "states": [\
      {\
        "model": {\
          "display": {\
            "common": {\
              "transformation": {\
                "left_rotation": [0.707f,0.0f,0.0f,0.707f]\
              }\
            },\
            "submodels": [{\
              "model": "naturecraft:0/amethyst/1",\
              "common": {\
                "transformation": {\
                  "left_rotation": [0.271f,0.653f,0.653f,0.271f],\
                  "translation": [0.0f,0.5f,0.0f]\
                }\
              }\
            }]\
          },\
          "collision_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.2187,\
            "offset_z": 0.18745\
          },\
          "interaction_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.25,\
            "offset_z": 0.21875\
          }\
        },\
        "facing": 3\
      },\
      {\
        "model": {\
          "display": {\
            "common": {\
              "transformation": {\
                "left_rotation": [1.0f,0.0f,0.0f,0.0f]\
              }\
            },\
            "submodels": [{\
              "model": "naturecraft:0/amethyst/1",\
              "common": {\
                "transformation": {\
                  "left_rotation": [0.383f,0.0f,0.924f,0.0f],\
                  "translation": [0.0f,0.5f,0.0f]\
                }\
              }\
            }]\
          },\
          "collision_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.40615,\
            "offset_z": 0.0\
          },\
          "interaction_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.46875,\
            "offset_z": 0.0\
          }\
        },\
        "facing": 0\
      },\
      {\
        "model": {\
          "display": {\
            "common": {\
              "transformation": {\
                "left_rotation": [0.707f,0.0f,0.0f,-0.707f]\
              }\
            },\
            "submodels": [{\
              "model": "naturecraft:0/amethyst/1",\
              "common": {\
                "transformation": {\
                  "left_rotation": [0.271f,-0.653f,0.653f,-0.271f],\
                  "translation": [0.0f,0.5f,0.0f]\
                }\
              }\
            }]\
          },\
          "collision_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.2187,\
            "offset_z": -0.18745\
          },\
          "interaction_box": {\
            "offset_x": 0.0,\
            "offset_y": -0.25,\
            "offset_z": -0.21875\
          }\
        },\
        "facing": 2\
      },\
      {\
        "model": {\
          "display": {\
            "common": {\
              "transformation": {\
                "left_rotation": [0.0f,0.0f,-0.707f,0.707f]\
              }\
            },\
            "submodels": [{\
              "model": "naturecraft:0/amethyst/1",\
              "common": {\
                "transformation": {\
                  "left_rotation": [0.653f,0.653f,-0.271f,0.271f],\
                  "translation": [0.0f,0.5f,0.0f]\
                }\
              }\
            }]\
          },\
          "collision_box": {\
            "offset_x": 0.18745,\
            "offset_y": -0.2187,\
            "offset_z": 0.0\
          },\
          "interaction_box": {\
            "offset_x": 0.21875,\
            "offset_y": -0.25,\
            "offset_z": 0.0\
          }\
        },\
        "facing": 5\
      },\
      {\
        "model": {\
          "display": {\
            "common": {\
              "transformation": {\
                "left_rotation": [0.0f,0.0f,0.707f,0.707f]\
              }\
            },\
            "submodels": [{\
              "model": "naturecraft:0/amethyst/1",\
              "common": {\
                "transformation": {\
                  "left_rotation": [-0.653f,0.653f,0.271f,0.271f],\
                  "translation": [0.0f,0.5f,0.0f]\
                }\
              }\
            }]\
          },\
          "collision_box": {\
            "offset_x": -0.18745,\
            "offset_y": -0.2187,\
            "offset_z": 0.0\
          },\
          "interaction_box": {\
            "offset_x": -0.21875,\
            "offset_y": -0.25,\
            "offset_z": 0.0\
          }\
        },\
        "facing": 4\
      },\
    ],\
    "item_name": {"translate":"","fallback":"水晶簇"},\
    "display": {\
      "model": "naturecraft:0/amethyst/0",\
      "submodels":[{\
        "model": "naturecraft:0/amethyst/1",\
        "common": {\
          "transformation": {\
            "left_rotation":[0.0f,0.924f,0.0f,0.383f],\
            "translation": [0.0f,0.5f,0.0f]\
          }\
        }\
      }]\
    },\
    "light_level": 5,\
    "collision_box": {\
      "scale": 0.4374,\
      "offset_x": 0.0,\
      "offset_y": 0.0,\
      "offset_z": 0.0\
    },\
    "interaction_box": {\
      "height": 0.5,\
      "width": 0.5,\
    },\
    "event": {\
      "const": {\
        "place": {\
        "sound": "block.amethyst_cluster.place"\
        },\
        "left_click": {\
          "sound": "block.amethyst_cluster.break"\
        }\
      }\
    }\
  }\
}

function naturecraft:give {name:"naturecraft:0","nbt":"amethyst",model:"naturecraft:0/amethyst/0",count:1,type:1}
```
:::

### 橡树盆栽

<div style="text-align:center">
<img src=".\4.png" alt="4.png" style="zoom:50%;" />
<p style="color: gray;">调用随机事件的橡树盆栽(左)与成熟的橡树盆栽(右)</p>
</div>


::: details 注册函数
```mcfunction
# 默认
data modify storage naturecraft:0 model.oak_pot.0 set value {\
  "template": {\
    "name": "naturecraft:main",\
    "nbt": "base"\
  },\
  "model":{\
    "model": {\
      "name": "naturecraft:0",\
      "nbt": "oak_pot.0"\
    },\
    "towards": false,\
    "item_name": {"translate":"","fallback":"橡树盆栽"},\
    "display": {\
      "model": "naturecraft:0/pots/oak_pot/0"\
    },\
    "collision_box": {\
      "scale": 0.5,\
      "offset_x": 0.0,\
      "offset_y": 0.0,\
      "offset_z": 0.0\
    },\
    "interaction_box": {\
      "height": 0.501,\
      "width": 0.501,\
    },\
    "event": {\
      "random": {\
        "name": "naturecraft",\
        "path": "0/oak_pot/randomtick"\
      },\
      "right_click": {},\
      "const": {\
        "place": {\
          "sound": "block.stone.place"\
        },\
        "left_click": {\
          "sound": "block.stone.break"\
        },\
        "random": {\
          "name": "naturecraft:0",\
          "nbt": "oak_pot.apple"\
        }\
      }\
    }\
  }\
}

function naturecraft:give {name:"naturecraft:0","nbt":"oak_pot.0",model:"naturecraft:0/pots/oak_pot/0",count:1,type:0}

# 成熟变体
data modify storage naturecraft:0 model.oak_pot.apple set value {\
  "template": {\
    "name": "naturecraft:main",\
    "nbt": "base"\
  },\
  "model":{\
    "model": {\
      "name": "naturecraft:0",\
      "nbt": "oak_pot.apple"\
    },\
    "towards": false,\
    "item_name": {"translate":"","fallback":"橡树盆栽(成熟)"},\
    "display": {\
      "model": "naturecraft:0/pots/oak_pot/apple"\
    },\
    "collision_box": {\
      "scale": 0.5,\
      "offset_x": 0.0,\
      "offset_y": 0.0,\
      "offset_z": 0.0\
    },\
    "interaction_box": {\
      "height": 0.501,\
      "width": 0.501,\
    },\
    "event": {\
      "right_click": {\
        "name": "naturecraft",\
        "path": "0/oak_pot/apple"\
      },\
      "const": {\
        "right_click": {\
          "name": "naturecraft:0",\
          "nbt": "oak_pot.0",\
          "loot_table": "naturecraft:0/oak_pot_apple"\
        }\
      }\
    }\
  }\
}
```
:::

### 桌子

<div style="text-align:center">
<img src=".\5.png" alt="5.png" style="zoom:50%;" />
<p style="color: gray;">link类实现的拼接模型</p>
</div>

::: details 注册函数
```mcfunction
data modify storage naturecraft:0 model.stripped_oak_table set value {\
  "template": {\
    "name": "naturecraft:main",\
    "nbt": "base"\
  },\
  "model":{\
    "Tags": ["NatureCraft.0.table.oak"],\
    "type": "link",\
    "states": [\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 1,\
             1,    1,\
             1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/2-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 0,\
             1,    1,\
             1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/2-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 1,\
             1,    1,\
             1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/2-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 1,\
             1,    1,\
             0, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/2-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 1,\
             1,    1,\
             1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 0,\
             1,    1,\
             1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 1,\
             1,    1,\
             0, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 1,\
             1,    1,\
             0, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 0,\
             1,    1,\
             1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 0,\
             1,    1,\
             0, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/3-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 1,\
             1,    1,\
             1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 0,\
             1,    1,\
             0, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 1,\
             1,    1,\
             0, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 0,\
             1,    1,\
             0, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 0,\
             1,    1,\
             1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 0,-1,\
             1,    1,\
             1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 1, 1,\
             0,    1,\
            -1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 1,\
             1,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/4-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1,-1,\
             1,    0,\
             1, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 0,\
             1,    1,\
             0, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 0,-1,\
             1,    1,\
             1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 1, 0,\
             0,    1,\
            -1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1, 1,\
             1,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1,-1,\
             1,    0,\
             0, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 0,-1,\
             1,    1,\
             0, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-5",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 1, 1,\
             0,    1,\
            -1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             1, 1, 0,\
             1,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/5-5",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
             0, 1,-1,\
             1,    0,\
             1, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 0,-1,\
             1,    1,\
             0, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code":\
            [  -1,\
            -1, 1, 0,\
             0,    1,\
            -1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
             0, 1, 0,\
             1,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
             0, 1,-1,\
             1,    0,\
             0, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             0,    1,\
            -1, 1, 1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 1, 1,\
             0,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
             1, 1,-1,\
             1,    0,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/6-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             1,    0,\
             1, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             1,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 1,-1,\
             0,    0,\
            -1, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             1,    0,\
             0, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
             0, 1,-1,\
             1,    0,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-3",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 1, 0,\
             0,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/7-4",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             0,    1,\
            -1, 1, 0,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/8-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             0,    1,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/8-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,0.0f,0.0f,1.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 1,-1,\
             0,    0,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/8-1",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             1,    0,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/8-2",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             0,    0,\
            -1, 1,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
      {\
        "model": {\
          "display": {\
            "model": "naturecraft:0/tables/stripped_oak_table/0",\
            "common": {\
              "transformation": {\
                "left_rotation":[0.0f,1.0f,0.0f,0.0f]\
              }\
            }\
          }\
        },\
        "condition": {\
          "code": \
            [  -1,\
            -1, 0,-1,\
             0,    0,\
            -1, 0,-1,\
               -1],\
          "tag": "NatureCraft.0.table.oak"\
        }\
      },\
    ],\
    "item_name": {"translate":"","fallback":"去皮橡木木桌"},\
    "towards": false,\
    "display": {\
      "item_model": "naturecraft:0/tables/stripped_oak_table/0",\
      "model": "naturecraft:0/tables/stripped_oak_table/0"\
    },\
    "collision_box": {\
      "barrier": true,\
      "offset_x": 0.0,\
      "offset_y": 0.0,\
      "offset_z": 0.0\
    },\
    "interaction_box": {\
      "height": 1.001,\
      "width": 1.001,\
    },\
    "event": {\
      "const": {\
        "place": {\
          "sound": "block.wood.place"\
        },\
        "left_click": {\
          "sound": "block.wood.break"\
        }\
      }\
    }\
  }\
}

function naturecraft:give {name:"naturecraft:0","nbt":"stripped_oak_table",model:"naturecraft:0/tables/stripped_oak_table/0",count:1,type:0}
```
:::

## 关于 NatureCraft

如果对 NatureCraft 感兴趣的玩家, 可以通过 (QQ)[602217514](https://qm.qq.com/q/qD7TOv3LAO) 与我们交流。