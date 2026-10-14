---
title: 'Tess：快速搭建自定义容器的数据包工具'
---

<script setup>
import ns from '/.vitepress/vue/nbt/namespace.vue'
import obj from '/.vitepress/vue/nbt/object.vue'
</script>

<FeatureHead
  title="Tess：快速搭建自定义容器的数据包工具"
  authorName="Genkihuh"
  resourceLink = ../_assets/Tess示例文件.zip
/>

## 前言

### 1. 介绍
自定义容器一直是mc原版模组编写里既重要又繁琐的一环。借助 Tess ，数据包和地图作者可以快速搭建自己的自定义容器逻辑，使自定义容器不再卡住编写进度，并将自定义容器变为通用性强、使用便捷的开发工具。

数据包对应的 mc 版本为 $26.3$。[本体下载链接](https://wwawb.lanzoul.com/ii6P24arwk9i)和[示例文件](https://wwawb.lanzoul.com/ic32T4arwked)，这个示例文件与下文给出的示例不太一样。
### 2. 为什么自定义容器很重要？
自定义容器，指由数据包控制的特定的容器（一般以箱子/木桶为载体），它主要用来模拟工作台以及更多扩展功能。

尽管我们可以设计类似摆放祭坛的交互式工作台来替代自定义容器，自定义容器仍然以其用户操作简单（仅需要把物品拖拽到指定槽位里）、交互形式经典通用为优势。交互式工作台满足一部分设计需求，自定义容器满足一部分设计需求，两者可以各司其职。

维护一个自定义容器是很复杂的流程。开发者需要避免模拟ui的物品被用户错误拾取，在必要时更新ui、覆写ui，存储各个ui的数据，同时保护用户的物品。编写 Tess 的核心目的很简单：让开发者充分利用自定义容器的优势，让开发者专注于ui搭建和交互逻辑本身。

### 3. Tess的优势
 Tess 提供了一个定义ui里各种组件功能的方法。简单地说，Tess 将组成ui的物品以功能分类，将它们视为不同功能的组件，不同组件的功能都可以在物品的 custom_data 里配置。Tess 还提供了一些封装指令和函数接口，力求轻量化、低卡顿的同时提供更高的扩展空间。
## 正文
Tess 仅支持维护拥有 27 个槽位的木桶容器，但是通常这已经足够使用。本文不介绍功能的内部实现，仅介绍如何使用已经配置好的功能，并给出添加更多功能的指南。

约定：

1. 下文所称的**作为命令执行者**的“自定义容器”，均指维护木桶容器的物品展示实体<ns t='item_display'/>，而非木桶方块。
2. 下文所称的**ui组件/ui物品**，指组成自定义容器页面、在页面刷新时得以保留且不能被玩家拾取的物品。非ui物品即指玩家真正拥有的物品。

### 1. 定义ui组件
所有的定义都需要保存在物品组件<ns t='custom_data'/>**.**<obj t="tess" />的路径下。下文提到需要填写的参数，默认是放在这个路径。

所有的ui组件都需要以下两个参数: ```type``` 和 ```if_ui```。其中，```if_ui```必须填写为 **true**。
```snbt
custom_data: {
  tess:{
    type: "xxx",
    if_ui: true
   }
}
```

对于参数```type```， Tess 将ui组件分为以下几类：
|类型|作用|
|:--------:|:--------:|
|**border**(边框)|勾勒ui的轮廓|
|**button**(按钮)|玩家用鼠标指针选中按钮时，执行一些指令|
|**generator**(生成器)|用于ui界面的生成 |
|**goto**(跳转)  |跳转到指定界面   |
|**void**(空槽)  |必要的占位物品，界面加载完成后会被清除|

#### border (边框)

边框组件 **border** 仅需要注意原版的组件配置，比如物品模型、隐藏 tooltip 等。Tess 提供了模型为空气的 border 战利品表```tess:bdr```，方便开发者调用:
```json
{
  "pools": [{
    "rolls": 1,
    "entries": [{
      "type": "item",
      "name": "structure_void",
      "modifier": [{
        "type": "set_components",
        "components": {
          "custom_data": {
            "tess":{
              "if_ui":true,
              "type":"border"
            }
          },
          "item_model":"air",
          "max_stack_size":1,
          "tooltip_display": {
            "hide_tooltip": true
          }
        }
      }]
    }]
  }]
}
```


#### button(按钮)

对于按钮组件 **button** ，需要参数：```click_event```，在玩家**用光标选中**按钮时执行**默认位置为自定义容器位置**的指令。

```click_event``` 是一个复合标签，其中有两个参数：

```command``` ，一个被引号引用的命令；

```mode```，只能填```self```（执行者为触发点击事件的玩家）或```machine```（执行者为自定义容器）。

**button** 自带一个 4 tick 的按钮冷却，作用于所有按钮，防止高频点击带来的卡顿。

```json
"custom_data": {
  "tess": {
    "if_ui": true,
    "type": "button",
    "click_event": {
      "command": "say hi",
      "mode": "machine"
    }
  }
}
```

#### generator（生成器）

对于生成器组件 **generator** ，需要以下参数：

```page_index```：页面索引。需要保证一个自定义容器中可能出现的各个生成器的索引不重复，否则会出现冲突。以自定义容器为执行者（使用上文的`machine`模式按钮，以及下文的函数接口），执行`scoreboard players get @s tess.current_index`来获取自定义容器当前的页面索引。

```gui```：一个列表。列表内的元素是复合标签，列表每一项为`{"I":"战利品表ID"}`格式的对象。

Tess 通过加载战利品表来加载ui组件。```gui```内必须有 27 个元素，元素的顺序就是容器内第 0 槽位到第 26 槽位的顺序。载入空槽需要引用 **void** 类型的 ui 组件（后文介绍）。

具体请看以下示例：
```json
"custom_data": {
  "tess": {
    "if_ui": true,
    "type": "generator",
    "page_index": 1,
    "gui": [
      {"I":"eg:border"},{"I":"eg:button"}...//省略之后的战利品表
    ]
  }
}
```

#### goto（跳转）

对于跳转组件 **goto** ，需要参数```to```：一个 **generator** 的战利品表。Tess 保证从 A 页面跳转到 B 页面时，保存 A 页面的非ui物品，同时加载 B 页面已保存的物品。
```json
"custom_data": {
  "tess": {
    "if_ui": true,
    "type": "goto",
    "to": "eg:generator"
  }
}
```

#### void（空槽）

空槽 **void** 同 **border** 一样，无需额外的配置且 Tess 已定义了一份战利品表```tess:void```:
```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "structure_void",
          "quality": 1,
          "modifier": [
            {
              "type": "set_components",
              "components": {
                "max_stack_size": 1,
                "custom_data": {
                  "tess": {
                    "if_ui": true,
                    "type": "void"
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```


### 2.放置自定义容器
使用刷怪蛋召唤拥有参数的**带有标签**`tess.load`的 **marker** 实体，Tess 系统检测到该 `marker`，自动实例化自定义容器，召唤`item_display` 并放置木桶。以战利品表为例：
```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "spider_spawn_egg",
          "modifier": [
            {
              "type": "set_components",
              "components": {
                "entity_data": {
                  "id": "marker",
                  "Tags": [
                    "tess.load"
                  ],
                }
              }
            }
          ]
        }
      ]
    }
  ]
}

```
`marker` 同样拥有参数，保存在`data.tess`里，以下是参数列表：
|参数（每项都***必填***） |取值        |说明        |
|:--------:|:--------:|:--------:|
|model     |一个物品模型文件，或者一个原版物品的命名空间id|方块的模型|
|machine_loot|一个战利品表    |破坏自定义容器掉落的物品|
|home      |一个生成器的战利品表|自定义容器的初始界面|
|place_event|一个命令|放置容器执行的命令，执行者为自定义容器|
|destroy_event|一个命令|破坏容器执行的命令，执行者为自定义容器|
|open_sound|一个声音|打开容器的声音|
|machine_name|json文本或字符串|自定义容器显示在箱子ui左上角的名称|
|tags|若干tag，形如"tag1,tag2,..."|追加到自定义容器对应的实体`item_display`中的Tags里|

对于参数`place_event`,`destroy_event`和`tags`，它们可以为空字符串，但必须存在这个参数。

示例 (战利品表名`eg:machine`) ：
```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "spider_spawn_egg",
          "modifier": [
            {
              "type": "set_components",
              "components": {
                "item_model": "fletching_table",
                "max_stack_size": 64,
                "entity_data": {
                  "id": "marker",
                  "Tags": [
                    "tess.load"
                  ],
                  "data": {
                    "tess": {
                      "model": "fletching_table",
                      "machine_loot": "eg:machine",
                      "home": "eg:generator",
                      "place_event": "playsound block.amethyst_block.place block @a[distance=..16]",
                      "destroy_event": "playsound block.amethyst_block.break block @a[distance=..16]",
                      "open_sound": "block.enchantment_table.use",
                      "machine_name": [{"text":"CustomName","color": "dark_blue"}],
                      "tags":"eg.example1,eg.example2"
                    }
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ]
}

```

### 3. 函数接口
Tess提供了多个函数接口。接口的形式为函数标签，它们的执行者均为自定义容器，故这里的接口可以接收 cmd 命令。请注意，**所有**通过 Tess 定义的容器都会执行接口的指令，因此你需要额外写一个判断来区分各容器。

所有的接口都存储在`minecraft`命名空间下的`tags/function/tess`文件夹里。以下是所有接口函数标签：
|函数标签      |触发时间      |
|:--------:|:--------:|
|`#minecraft:tess/always`|容器方块每tick都会执行一次|
|`#minecraft:tess/in_use`|容器方块正在被打开时每tick执行一次|
|`#minecraft:tess/idle`|容器方块没有被打开时每tick执行一次|
|`#minecraft:tess/opened`|容器方块被打开时执行一次|
|`#minecraft:tess/closed`|容器方块被关闭时执行一次|

其中，`#minecraft:tess/always`是接在原有的以自定义容器为执行者的 tick 函数之后，且总是在`#minecraft:tess/in_use`或`#minecraft:tess/idle`之后执行。

### 4.转变命令执行者
Tess 提供了一个封装好的函数组：`#tess:transfer`。执行者为玩家，效果是以**玩家绑定的自定义容器**为执行者执行一条命令。

需要参数`command`：一条被引号引起来的命令。

玩家每次按下按钮，都会把自己和自定义容器绑定。换句话说，这个函数组主要是给`self`模式下的按钮使用的。
```
#执行者为玩家

function #tess:transfer {command:"say I_am_a_machine"}
```

性能方面，`#tess:transfer`使用了目标选择器和宏函数，所以最好不要高频触发。


### 5.内置cmd命令
对于搭建一个简单的可交互、可进行简单操作的菜单，以上功能已经足够。若想执行一些修改页面、设置主页的操作，可以使用 Tess 内置的 cmd 命令功能。使用 cmd 需要以下步骤：

第一步，转换命令执行者为需要操作的自定义容器，通常使用 **button** 组件的```machine```模式执行命令。

第二步，使用```data modify storage tess:cmd quests append value {opt:{操作名:true},target:xxx,source: xxx}```添加一个或若干个操作请求。

第三步，以自定义容器为执行者执行命令`function #tess:cmd`，这个函数组会依照`quests`列表的顺序执行操作，直到`quests`被清空。

以下是可执行的操作：
|操作\参数   |source    |target|说明        |
|:------:|:--------:|:----:|:--------:|
|add     |一个战利品表    |目标槽位  |在当前页面的指定槽位`target`添加一个ui物品`source`
|
|remove  |——        |目标槽位  |删除当前页面一个槽位`target`的ui物品|
|modify  |一个物品修饰器，必须是引用|目标槽位  |在当前页面的指定槽位`target`施加一个物品修饰器`source`|
|pop     |——        |目标槽位  |在当前页面，弹出指定槽位`target`的非ui物品，将其变为掉落物形式|
|set_home|——|——|设置当前页面为主页面|
|go_home |——|——|立刻跳转到主页面  |

```
#向容器第 1 格添加一个ui组件（以border为例）
data modify storage tess:cmd quests append value {opt:{add:true},target:0b,source: "eg:border"}

#删除容器第 1 格的ui组件
data modify storage tess:cmd quests append value {opt:{remove:true},target:0b}

#向容器第 1 格施加一个物品修饰器
data modify storage tess:cmd quests append value {opt:{modify:true},target:0b,source: "eg:modifier"}

#弹出容器第 1 格的物品（即变成掉落物形式）
data modify storage tess:cmd quests append value {opt:{pop:true},target:0b}

#设置当前页面为主页
data modify storage tess:cmd quests append value {opt:{set_home:true}}

#立刻跳转到主页
data modify storage tess:cmd quests append value {opt:{go_home:true}}

#运行 cmd
function #tess:cmd
```
带有`source`参数的操作都用到了宏函数，带有`target`参数的操作都访问了实体或方块实体的 nbt 。对于性能问题，只要保证 cmd 不会高频触发就不会有卡顿。

### 6. 模拟合成台
Tess 本身没有自带的合成组件，因为我考虑到不同数据包或地图有不同的合成需求。如果想要做几乎与原版一致的工作台，我们可以使用如下的合成逻辑：
```json
//在这个实例中，自定义容器的输出槽为空槽

玩家打开工作台 //#minecraft:tess/in_use
    ↓
检测当前页面是否是合成页面//检测自定义容器的tess.current_index计分板
    ↓
循环匹配合成配方 //检测配方的方法在原版有很多，我个人倾向于使用mc26.3新增的slot_source
    ↓
          输入槽物品是否匹配？
├──────────────────┤
│是                                  │否
↓                                    ↓
是否第一次匹配？         是否存在某个配方的标记？
//即是否存在该配方对应标记
│                      ├─是 →如果输出槽为对应
│                       配方成品，清空输出槽，
│                       否则弹出输出槽的物品//cmd的pop
│
├─是 → 清除其他配方标记，打上该配方对应标记，
│        在输出槽更新成品
└─否 → 如果成品不存在于输出槽:
          扣减输入原料，//原版的物品修饰器
          如果输出槽不为空，弹出输出槽物品，//cmd的pop操作

```
以上流程可能会有可以优化的地方，这里仅简单举例。如果不追求完全模拟原版工作台，你也可以这样写：

```json
//在这个实例中，自定义容器的输出槽为self模式的按钮

玩家打开工作台 //#minecraft:tess/in_use
    ↓
检测当前页面是否是合成页面//检测自定义容器的tess.current_index计分板
    ↓
循环匹配合成配方 //检测配方的方法在原版有很多，我个人倾向于使用mc26.3新增的slot_source
    ↓
          输入槽物品是否匹配？
├──────────────────┤
│是                                  │否
↓                                    ↓
是否第一次匹配？         隐藏输出槽按钮的tooltip
//即是否存在该配方对应标记
│
├─是 → 清除其他配方标记，打上该配方对应标记，
          输出槽按钮的物品模型变为成品的模型，
          并且显示其tooltip。//cmd的modify操作

输出槽按钮逻辑：
按下按钮 → 匹配各配方，若匹配到某配方 → 给予自己成品，并扣减原料。

```
### 7. 进阶：添加新功能
通过组合以上的功能，我们可以做更多效果。上述提到的合成流程即为一个组合一些功能的实例。

若想继续添加新功能，可以扒开 Tess 数据包，查看实体或物品的数据结构。

数据包内，大部分函数我都写了详细的注释。可以先翻看`function/marker`文件夹，里面存放了用于保存页面的函数和用于放置容器的函数。也可以先翻看`function/general/tick.mcfunction`，从这里一层一层看。

另外，补充一个我在数据包层面没有解决的问题。

`item_display`嵌入方块内时会变黑，因为`item_display`会渲染使用实体原点位置方块的光照，而木桶不透明（即光照为 0），箱子这种透明容器又容易互相合并、造成bug。在 Tess 中，我默认渲染的方块亮度为15，这会导致夜晚时看起来很奇怪。你可以通过`#minecraft:tess/loaded`接口来修改加载容器后，`item_display`的亮度。

我想到的办法是可以通过检测相邻方块的光照，来判断自定义容器渲染哪个光照。但是，这样做很复杂，而且性能不好，不同场景的需求也不一样。也许之后我找到好的办法后，会解决这个问题。

### 附录：mcdoc

以下是上述NBT结构的[Mcdoc](../0/content)描述文件：

```mcdoc
dispatch minecraft:storage["tess:cmd"] to struct{
    quests?: [Quest],
}

struct Quest{
    /// 操作
    opt: struct{
        [TessOperationTypes]: true,
    },
    /// 来源
    source?: any,
    /// 目标槽位
    target?: byte,
}

enum(string) TessOperationTypes {
    /// 在当前页面的指定槽位target添加一个ui物品source
    add = "add",
    /// 删除当前页面一个槽位target的ui物品
    remove = "remove",
    /// 在当前页面的指定槽位target施加一个物品修饰器source
    modify = "modify",
    /// 在当前页面，弹出指定槽位target的非ui物品，将其变为掉落物形式
    pop = "pop",
    /// 设置当前页面为主页面
    set_home = "set_home",
    /// 立刻跳转到主页面
    go_home = "go_home",
}

dispatch mcdoc:custom_data[tess] to struct{
    /// 是否为UI物品组件
    if_ui?: true,
    /// UI物品组件的类型
    type?: TessUIComponents,
    ...tess:components[[type]],
}

/// Marker数据
dispatch tess:components[%none] to struct{
    /// 方块的模型
    model: (#[id=item] string |#[id=item_definition] string ),
    /// 破坏自定义容器掉落的物品
    machine_loot: #[id=loot_table] string,
    /// 自定义容器的初始界面。需要一个生成器的战利品表
    home: #[id=loot_table] string,
    /// 放置容器执行的命令，执行者为自定义容器
    place_event: #[command(empty="allowed")] string,
    /// 破坏容器执行的命令，执行者为自定义容器
    destroy_event: #[command(empty="allowed")] string,
    /// 打开容器时播放的声音
    open_sound: #[id="sound_event"] string,
    /// 文本组件，用于显示自定义容器的名称
    machine_name:::java::util::text::Text,
    /// 追加给机器实体标签
    tags: [#[tag] string],
}

enum(string) TessUIComponents{
    /// 勾勒ui的轮廓
    border = "border",
    /// 玩家用鼠标指针选中按钮时，执行一些指令
    button = "button",
    /// 用于ui界面的生成
    generator = "generator",
    /// 跳转到指定界面
    goto = "goto",
    /// 必要的占位物品，界面加载完成后会被清除
    void = "void"
}

dispatch tess:components[border, void] to struct {}
dispatch tess:components[button] to struct {
    /// 点击按钮时触发的事件
    click_event: struct{
        /// 执行的命令
        command: #[command] string,
        /// 执行模式
        mode: TessClickEventMode,
    }
}

enum(string) TessClickEventMode{
    /// 执行者为触发点击事件的玩家
    self = "self",
    /// 执行者为自定义容器实体
    machine = "machine"
}

dispatch tess:components[generator] to struct {
    /// 页面索引。需要保证一个自定义容器中可能出现的各个生成器的索引不重复
    page_index: int,
    /// 必须为27元素的列表，规定每个格子
    gui: [GeneratorGUIElements] @ 27,
}

struct GeneratorGUIElements{
    /// 该格子的物品，需要为战利品表的ID
    I: #[id=loot_table] string,
}

dispatch tess:components[goto] to struct {
    /// 一个generator物品的战利品表
    to: #[id=loot_table] string,
}
```


## 结尾
总算写完文档了！这是我发布的第一个数据包，~~想不到我发布的第一个数据包会是一个轮子~~，所以难免（或者在我心里，很可能）会有各种bug和需要优化的地方。我接受一切形式的批评，如需要交流请访问我的[bilibili主页](https://space.bilibili.com/372325957?spm_id_from=333.1007.0.0)。

最后，感谢你使用Tess！