---
title: '简单、轻量、优雅——dc装饰模型支持库'
---

<FeaturedHead
    title = '简单、轻量、优雅——dc装饰模型支持库'
    authorName = CR_019
    avatarUrl = '../../_authors/cr_019.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/85292644' },
        { name: 'GitHub', url: 'https://github.com/CR-019' }
    ]"
    resourceLink = https://www.mcmod.cn/class/14646.html
    cover='../_assets/0.png'
/>



## 引言

**Decoration Creator Kit（dc）**，是一个面向MC高版本（1.20.5+）的装饰模型的支持库。它支持开发者使用至少两条指令，在游戏内注册一个可交互的模型。

该支持库可以支持开发者很简单的定义模型的各种属性和交互事件。注册的模型可以像方块一样直接放置、互动和破坏，也能像实体一样移动、旋转，以及对玩家的互动做出各种反馈。因此，该支持库十分适合装饰向模型的作者使用。

### 关于dc的诞生……
这个项目最初来自于24年3月份的一个委托，委托人希望我制作一个能够支持自定义模型放置、移动和旋转的数据包。实际上，在更早开发CAM的时候，我便考虑过制作装饰模型的可能。

> 我曾经规划过一个“雕塑扩展包”，内容便是各种各样的装饰性雕塑。不过随着CAM项目的终止，这个企划便也没有下文了。

因此，我开始设想制作一个统一的框架，能够将模型的放置、破坏和交互统一管理，同时又拥有比较好的性能。正巧，mj在当时引入了展示实体和交互实体，而函数宏的引入也大大方便了动态参数的传递，在这些便利下，我花了数周时间研究调试，便将dc的首个版本完成了。顺便，最初的委托便是**森罗物语**数据包版的前身，而当前的森罗数据包也依赖于dc。

## dc的特色和优势

dc的目标是在**易用性、轻量级、高性能、高自由度**之间取得平衡。因此，dc的模型具备基本的交互功能，同时也支持引入外部函数和谓词来简单地扩展。dc拥有非常简单清晰的索引注册结构，并且引入了mcdoc支持索引注册的自动补全，更加方便开发者注册模型，减少记忆成本。

一个典型的dc模型由一个标记实体、一个展示实体和一个交互实体组成。如果它具有碰撞箱或光源属性，还可能具有其他的辅助方块或实体。它们通过uid计分板进行逻辑连接。

dc使用索引方法存储模型数据。在手动执行install指令时，支持库会解析并存储模型的索引数据，在模型生成时，标记实体会直接拉取存储中的索引数据并分配给展示实体和交互实体。如此，我们便不需在模型物品中存储大量数据，同时减少了轮询操作，保证了常态下的性能。

## dc的使用方法

### 索引（Index）
dc采用索引的方式读取模型数据，在添加模型之前，需要注册对应的索引。

#### 索引注册
索引的注册为创建一个函数，按照如下结构写入数据：

```mcfunction
data modify storage dc:index input.<name> set value <data>
data modify storage dc:index keylist append value "<name>"
```

其中 `<name>` 为需要注册的索引名称， `<data>` 为索引数据，为一复合标签，格式如下：

> 注：键前方的括号为键值类型，在compound后面带有冒号的为结构模板，只在第一次出现时解析其结构，后面则省略；

:::details 索引数据

<div class="nbttree">

<node type="compound" name=""/>索引数据
  + <node type="string" name="type"/> ( <`"regular"`|`"hitbox"`|`"fixed"`|`"light"`> )(默认为regular)模型类型。`hitbox`类型拥有碰撞箱，需要额外设置碰撞箱参数，`fixed`类型拥有1格完整碰撞箱，不可移动和缩放，交互框大小固定为1*1。`light`类型可以提供光照，其他与`fixed`类型相似，不可移动和缩放，交互框大小固定为1*1。只有类型相同的模型才可互相转换。
  + <node type="compound" name="extra_data"/> 在`type`非`regular`时，需要提供的额外数据。
    &emsp; 当`type`为`"hitbox"`时：
    + <node type="float" name="width"/>碰撞箱宽度；
    + <node type="float" name="offset"/>碰撞箱的偏移量，可为负值；
     当`type`为`"light"`时：
    + <node type="byte" name="level"/>（值域0-15，默认值15）光源亮度；
    + <node type="bool" name="hitbox"/> （默认0）是否有碰撞箱，设置为1时拥有一个碰撞箱。
  + <node type="string" name="template"/>(可选)[模板](#模板-template)名称；
  + <node type="compound" name="item"/> 显示的模型对应的物品数据，格式与一般物品格式相同，无`slot`标签。
    <details><summary>物品共通标签</summary>
    
    + <node type="string" name="id"/>物品的id
    + <node type="int" name="count"/>物品的数量
    + <node type="compound" name="components"/>物品组件格式
      + <node type="any" name="物品组件ID"/>一个物品组件
      + ...
    </details>
  + <node type="string" name="loot_table"/>战利品表，可以替换上述的`item`字段，从战利品表中导入物品数据。会与`item`中数据合并，如有同名标签，`item`覆盖`loot_table`中标签。
  + <node type="float_list" name="modsize"/> 三维数组，物品展示实体的长宽高,等效于展示实体中的`scale`属性
  + <node type="compound" name="interactsize"/> 交互实体尺寸：
    + <node type="float" name="height"/> 交互实体的高度；
    + <node type="float" name="width"/> 交互实体的宽度；
  + <node type="compound" name="prop"/> 模型的额外属性，可以在此指定一些模型特性。
    + <node type="bool" name="height_adaption"/>设为1时，垂直旋转时碰撞箱高度随之调整；
  + <node type="compound" name="events"/>互动事件设置。
    + <node type="list" name="construct"/>放置时默认执行的事件，如播放声音等；
      + <node type="compound" name=""/>一个[事件](#事件-event)，不带条件参数。
        + <node type="string" name="event"/> 事件名，详细信息见下；
        + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在）
    + <node type="list" name="update"/>在模型更新时执行的事件，旋转、缩放、转换等事件会触发更新行为
      + <node type="compound" name=""/>一个[事件](#事件-event) ，不带条件参数。
        + <node type="string" name="event"/> 事件名，详细信息见下；
        + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在）
    + <node type="compound" name="left_click"/>左键点击事件
        + <node type="compound" name="fallback"/>在`criteria`中的事件判据没有符合的时，应用的默认事件。一个[事件](#事件-event) ，不带条件参数。
          + <node type="string" name="event"/> 事件名，详细信息见下；
          + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在） 
        + <node type="list" name="criteria"/>条件事件，当玩家手持相应物品点击模型时，触发的事件
          + <node type="compound" name=""/>一个[事件](#事件-event) 
            + <node type="string" name="event"/> 事件名，详细信息见下；
            + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在）
            + <node type="compound" name="item"/>触发该事件要求玩家主手持有的物品，id可为物品或物品标签；
              + 结构略
            + <node type="string" name="preidcate"/><node type="compound" name=""/><node type="list" name=""/>谓词条件，触发该事件需要点击的玩家满足谓词要求的条件，可内联定义；
    + <node type="compound" name="right_click"/>右键点击事件
        + <node type="compound" name="fallback"/>在`criteria`中的事件判据没有符合的时，应用的默认事件。一个[事件](#事件-event) ，不带条件参数。
          + <node type="string" name="event"/> 事件名，详细信息见下；
          + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在） 
        + <node type="list" name="criteria"/>条件事件，当玩家手持相应物品点击模型时，触发的事件
          + <node type="compound" name=""/>一个[事件](#事件-event) 
            + <node type="string" name="event"/> 事件名，详细信息见下；
            + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在）
            + <node type="compound" name="item"/>触发该事件要求玩家主手持有的物品，id可为物品或物品标签；
              + 结构略
            + <node type="string" name="preidcate"/><node type="compound" name=""/><node type="list" name=""/>谓词条件，触发该事件需要点击的玩家满足谓词要求的条件，可内联定义； 
  


</div>

:::

此后，在自己的数据包下建立一个名为dc的命名空间，并创建一个名为index的函数标签(dc/tags/functions/index.json)，将索引注册函数加入即可。
#### 索引加载
在注册完索引后，该索引还未构建完成，还不可使用。此时需要加载索引。
执行```/reload```指令，然后执行```/function dc:api/install```指令加载索引。
动态构建可能需要花费一定时间，请耐心等待。

#### 索引使用
加载完成后即可使用该索引生成模型。
可以以任何方式生成一个带有指定数据的标记(marker)或物品展示框(item_frame)**(仅支持1.21.5+)**(即带有dc_place标签，data中指定索引)，即可生成指定的自定义模型。

```mcfunction
/give @s minecraft:cow_spawn_egg[entity_data={id:"minecraft:marker",Tags:["dc_place"],data:{index:"#YOURINDEX#"}}]
```

```mcfunction
/give @s minecraft:item_frame[entity_data={id:"minecraft:item_frame",Tags:["dc_place"],data:{index:"#YOURINDEX#"}}]
```

#### 模型类型
在dc2.0.0以后，引入了三种新的模型类型，其中`Fixed`和`Light`类型为固定模型，推荐通过物品展示框生成。


#### 索引数据继承
在标记实体中可以使用一个inheritance字段，语法和索引注册数据相同，在模型生成的时候会被合并进数据中。可用于特定物品单独设置一些数据。

此处以刷怪蛋为例：

```mcfunction
/give @s minecraft:cow_spawn_egg[entity_data={id:"minecraft:marker",Tags:["dc_place"],data:{index:"#YOURINDEX#",inheritance:{item:{id:"apple"}}}}]
```

### 事件(Event)
目前支持基础事件：旋转，平移，坐，破坏等。  
大部分的参数均可缺省，此时应用默认值。  

#### 破坏（destruct）
销毁模型。

参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`destruct`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="particle"/>破坏模型时产生的粒子；
  + <node type="string" name="sound"/>破坏模型时播放的音效;
  + <node type="any" name=""/><node type="compound" name="item"/>控制非创造模式下破坏模型产生的掉落物：
    <br>· 若不含该参数，则不产生掉落物；<br>· 若传入空值或任意字符串，则产生默认掉落物（索引中`item`指定的物品，此外包含生成该模型的索引值）<br>· 若传入一个复合标签，则按照其中规则修改掉落物：
    + <node type="string" name="mode"/>(`add`|`replace`|`inherit`) 决定物品数据和合并模式（默认为`add`）：
        <br>· `add`：将下面参数（`item`或`loot_table`）中指定的物品数据和**索引中**的物品数据合并<br>· `replace`：直接使用参数中指定的物品数据，舍弃索引中的物品数据； **注意：** 重新放置时依然从索引中获取物品数据；<br>· `inherit`: 舍弃索引中的物品数据,从模型的物品展示实体中动态获取物品数据。
    + <node type="compound" name="item"/>指定掉落物的物品数据
    + <node type="string" name="loot_table"/>使用战利品表指定掉落物数据，会与`item`中数据合并，如有同名标签，`item`覆盖`loot_table`中标签；


</div>

#### 平移（move）
移动模型。

参数：
<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`move`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="type"/>平移事件类型。接受以下五个值：
    <br>`X` | `Y` | `Z` :绝对路径移动，在指定的轴上平移。<br>`R` : 相对玩家与模型的位置水平移动模型。<br>`V` : 相对玩家与模型的位置垂直移动模型。
  + <node type="float" name="distance"/>(-2f~2f)平移的距离。值需要在-2到2之间，超出则会被强制设为最近的边界值。默认值为0f。

</div>

若type为"X","Y","Z",则正值向对应轴的正方向移动，负值向对应负方向移动；
若type为"R","V",则正值向远离玩家的方向移动，负值向靠近玩家的方向移动。

#### 旋转(rotate)
旋转模型。

参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`rotate`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="type"/>平移事件类型。接受以下两个值：
    <br>"H":水平旋转；"V":垂直旋转。默认值为H。
  + <node type="float" name="distance"/>(-180f~180f)旋转的角度。值需要在-180到180之间，超出则被强制设为最近的边界值。默认值为0f。

</div>

#### 坐(sit)
可以坐上模型。

参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`sit`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="compound" name="orient"/>总是为空标签，当存在时，玩家坐上的瞬间朝向会被校正为模型朝向。

</div>


#### 声音(sound)
发出声音。

参数：
<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`sound`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="sound"/>音效id，播放的音效；

</div>

#### 转换（trans）
将一个模型转换为另一个已注册的模型，将会使用对应模型的所有数据覆盖原有数据。
参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`trans`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="index" required=true />要转换的模型的索引，若该参数不存在，则事件注册将失败；若该参数指向为注册的索引名，则不会做出任何修改。
  + <node type="string" name="func"/>（可选）转换后以标记实体为执行者执行的函数。

</div>

> 在这个事件的函数中，标记实体可以使用@s选中；绑定的展示实体和交互实体分别具有`dc_trans_display`和`dc_trans_interaction`标签。

#### 缩放(scale)
可以放大和缩小模型。

参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`rotate`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="float" name="scale"/>模型大小的变化值，正值为放大，负值为缩小。

</div>

限制：scale本身没有范围限制，但放大缩小后模型有如下限制：
    - 模型放大倍数在0.1到10之间
    - 交互实体宽高任一不能小于0.1
    - 展示实体高不能大于10

备注：
该事件会调用更新模块自动更新模型；

#### 预制事件(pre)

预制事件是一类特殊事件，为带有固定的参数的特定普通事件。因此不需要额外指定arg（指定了也没有效果）。用于简化操作。

在使用中，在events里填写`pre/<预制事件名>`即可。

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处填写`pre/<预制事件名>`；

</div>

目前已有的预制事件：
- `move_r_1px`：水平移动1像素（推）
- `move_r_-1px`：水平移动-1像素（拉）
- `move_y_1px`：竖直移动1像素（上）
- `move_y_-1px`：竖直移动-1像素（下）
- `rotate_h_225`：水平旋转22.5度（顺时针）
- `rotate_h_-225`：水平旋转-22.5度（逆时针）
- `rotate_v_225`：垂直旋转22.5度（顺时针）
- `rotate_v_-225`：垂直旋转-22.5度（逆时针）
- `scale_02`：缩放0.2倍（大）
- `scale_-02`：缩放-0.2倍（小）

#### 调试事件：更新(update)
1.更新模型的数据结构到dc的版本，2.并且和当前的索引信息同步

参数：无

备注：
- 更新完成后会向互动玩家输出一条更新完成的信息，将`$silent_update` 的`dc_options`计分项设为1可以不输出该信息
- 使用调试棒左键模型可以触发更新事件

#### 调试事件：信息(info)
向玩家聊天栏输出模型的属性信息，包括该模型的uid，索引，缩放倍数，版本，上次更新时间，当前时间等。

参数：无

备注：
- 使用调试棒右键模型可以触发信息事件

#### 流程控制事件：组(group)
按照顺序依次执行一系列事件。

参数：
<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`group`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="list" name="events"/>为一个列表，里面的每一项均为一个事件，不含事件条件字段。
    + <node type="compound" name=""/>一个事件。
      + <node type="string" name="event"/> 事件名，详细信息见下；
      + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在） 

</div>


备注：
对列表内的事件暂无检查

#### 流程控制事件：随机(random)
在一系列事件中按照权重挑选一个事件执行。

参数：
<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`random`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="list" name="events"/>为一个列表，里面的每一项均为一个事件，不含事件条件字段。
    + <node type="compound" name=""/>一个事件。
      + <node type="string" name="event"/> 事件名，详细信息见下；
      + <node type="compound" name="args"/> 参数，具体格式随事件而决定（部分事件若不带参数，则此项不存在） 
      + <node type="int" name="weight"/>权重。代表该事件有多大的可能被选取。

</div>

备注：
对列表内的事件暂无检查

#### 保留字：`__nothing__`
什么都不做。可在创建空事件时使用。

#### 自定义事件(custom)
此事件支持引用外部函数作为事件执行。

参数：

<div class="nbttree">

<node type="compound" name=""/> 事件。
+ <node type="string" name="event"/>事件名，此处为`custom`；
+ <node type="compound" name="args"/>事件参数：
  + <node type="string" name="func"/>自定义事件函数路径。事件定义规范见下。
  + <node type="any" name=""/>可选，其他需要传入的参数，随事件类型而定。

</div>

> 自定义事件规范：
> 自定义事件的路径为一个文件夹，其下包含一个`execute.mcfunction`文件用于执行，一个可选的`check.mcfunction`文件用于参数检查，以及其他可选的辅助函数。
> 在索引构建时，会调用`check`函数检查参数的合法性；在交互条件触发时，会执行`execute`函数执行事件。

> 一些你需要知道的接口信息：
> 1. 执行函数可以为宏函数，参数会以函数宏的形式传入，可以直接调用；
> 如果不想使用宏方法调用，可以访问```storage dc events.temp.target.args```路径。
> 2. 检查函数执行时，参数会储存在```storage dc:temp event.args```路径下，可以检查并修改该路径中的参数信息，完成后，修改过的信息会合并至索引数据下。检测到参数未正确设置等问题时，可以将`#check`的`dc_temp`计分项设为1，此时该事件将不会被加入索引的事件列表中。
> 3. 本包的每个模型由三个实体组成，一个带有```dc_pivot```标签的标记实体，一个带有```dc_display```标签的展示实体，一个带有```dc_interaction```标签的交互实体；
>   函数以标记实体为执行者，以其位置为执行位置。此外，展示实体的y坐标比标记实体的高0.5个方块，在移动模型时需要注意。
>   可以用```dc_custom_pivot```，```dc_custom_display```，```dc_custom_interaction```来分别选中交互的模型的标记，展示实体，交互实体。
> 4. 执行（任意）事件时，触发点击事件的玩家拥有```dc_click_temp```标签，可以用此标签找到对应的玩家。


### 模板(Template)
为辅助构建模型数据的开发工具，为部分的索引数据，在索引构建时会合并到索引数据中。
可以将索引中重复的部分注册为模板，减少重复代码的使用。
#### 模板注册
新建一个函数，按照如下格式写入模板数据：

```mcfunction
data modify storage dc:template <name> set value <data>
```
`name`为模板名，`data`为模板数据，为索引的一部分（不完整）数据，格式参照[索引数据格式](#索引-index),不包含`template`选项(即不支持嵌套模板调用)，且所有键均为可选。

完成模板注册后，在dc命名空间下建立一个一个名为`template`的函数标签(`dc/tags/functions/template.json`)，把模板函数加入。
最后执行```/reload```指令。
#### 模板使用
在注册索引时，把注册好的模板的名字写在索引的`template`选项下即可。
#### 已有模板
dc内置了两个简单的模板，可以在注册索引时调用。
basic:

```snbt
{   
    modsize:[1f,1f,1f],
    interactsize:{height:1f,width:1f},
    events:{
        left_click:{
            fallback:{event:"destruct"},
            criteria:[]
        },
        right_click:{
            fallback:{event:"__nothing__"},
            criteria:[]
        }
    }
}
```
基础模型模板，左键破坏模型。

default:
```snbt
{
    modsize:[1f,1f,1f],
    interactsize:{height:1f,width:1f},
    events:{
        left_click:{
            criteria:[
                {
                    event:"move",
                    item:{id:"minecraft:stick"},
                    args:{distance:-0.2f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:shears"},
                    args:{angle:-45.0f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:blaze_rod"},
                    args:{type:"V",angle:-22.5f}
                }
            ],
            fallback:{event:"destruct"},
        },
        right_click:{
            criteria:[
                {
                    event:"move",
                    item:{id:"minecraft:stick"},
                    args:{type:"R",distance:0.2f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:shears"},
                    args:{angle:45.0f}
                },
                {   
                    event:"rotate",
                    item:{id:"minecraft:blaze_rod"},
                    args:{type:"V",angle:22.5f}
                }
            ],
            fallback:{event:"__nothing__"}
        }
    }
}
```
默认模型模板，在基础模板基础上，增加了手持木棍移动模型，手持剪刀水平旋转模型，手持烈焰棒垂直旋转模型的事件。其中左右键点击能够施加相反的效果。

### 设置
在`dc_options`计分板内有一些设置选项。

已有设置：  
`$auto_install`：设为1，在reload时自动加载模型索引数据;  
`$silent_update`：设为1，在更新模型时不再向玩家输出信息;  
`$silent_register`：设为1，在注册新模型时不再向玩家输出信息;

可视化设置界面：输入```/function dc:menu/main```,呼出设置页面，可以可视化调整上述选项。