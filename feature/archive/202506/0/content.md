---
title: '适用于Minecraft的前端框架——Floating UI'
---

<!-- markdownlint-disable MD033 MD041 -->
<script setup>
    import {config} from '/.vitepress/MCFPPNBTParser.ts';

    config.namespace = "floating_ui"
</script>

<FeaturedHead
    title = '适用于Minecraft的前端框架——Floating UI'
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    resourceLink = 'https://github.com/Alumopper/Floating-UI'
    cover='../_assets/0.png'
/>

展示实体是在1.19.4正式引入的特性，可以用来展示方块物品文字什么的，某种意义其作为UI开发的潜力基本上是可以和容器GUI媲美，甚至说在灵活性可以超越容器UI。事实上，也有很多数据包或者地图实现了用展示实体制作的UI，但是，令人意外的是，直至目前，都没有支持动态解析的展示实体UI库出现。于是，Floating UI就诞生了~

这个UI库一开始是隶属于一个更大型的项目，其名字*Floating*也是来源于这个项目。但是呢，最后我把它解耦出来，独立作为了一个项目，就叫做Floating UI啦。

Floating UI允许开发者使用SNBT格式定义并渲染UI，并提供了事件系统用于读取用户的点击等输入操作。同时，还支持开发者定义自定义用户控件，以及自动布局，简化了UI的绘制。

::: tip 前置库提示

Floating UI使用了[小豆的数学库](https://github.com/xiaodou8593/math2.0)和[小豆的事件队列](https://github.com/xiaodou8593/timelist)，使用小豆的数学库进行精准的浮点计算和交点计算，使用小豆的事件队列托管事件的定时触发效果。

:::

## 基本使用

::: warning 提示

在使用Floating UI之前，请手动调用`function floating_ui:load`对浮空UI库进行初始化！

:::

如果要创建一个UI，最简单的方式是使用`floating_ui:.player_new_ui`函数。这个函数将会读取预先输入好的布局数据，在执行者前方生成一个面向玩家的UI界面。

```mcfunction
# 写入UI布局数据
data modify floating_ui:input data set value {\
    "type":"panel",\
    "size":[5f,5f],\
    "child":[\
        {\
            "type":"button",\
            "y":0.3,\
            "size":[2.5f,2.5f],\
            "item":{"id":"apple"}\
        }\
    ]\
}

# 显示UI
function floating_ui:.player_new_ui
```

::: tip 提示

如果你是用数据包中的函数运行的，可以使用`\`换行写布局数据以提高布局数据的可读性。

:::

在调用这个函数以后，在`_`记分板的`return`记分项中会存放这个UI的根实体的唯一数字UID，可以在调用后将它保存下来以供后续操作。但是——，这个值会在每次调用的时候被覆盖，所以一定要及时保存哦。

如果要关闭一个UI，有两种方法。第一种是直接调用`function floating_ui:.player_dispose_ui`函数，它将会关闭执行者玩家拥有的所有UI。

或者，如果你想要清除某一个UI，之前保存下来的UID就有作用啦。假设要清除掉UID为0的UI，可以这样做：

```mcfunction
execute as @e[tag=floating_ui_root] \
    if score @s floating_ui.uid matches 0 \
    run function floating_ui:_dispose_ui
```

`floating_ui:.player_new_ui`创建的UI只能被创建它的玩家（执行此函数的玩家）交互。如果你要创建一个所有玩家都能交互的UI，可以使用`floating_ui:.world_new_ui`。但是要注意哦，这样创建的UI只能通过UID选中来删除，所以一定要记得保存好它的UID。

## 数据结构

### 控件

Floating UI**布局数据**是由**UI控件数据**组成的。

所有控件最基础的类是`basecontrol`，包含了一切控件会有的基本属性。此类为抽象类，不能实例化。

<NBTTree code='
@Desc<"所有非文本组件UI控件的基类">
data basecontrol {
    @Desc<"控件的类型"> type as string;
    @Desc<"x坐标。原点是正中央"> x as double;
    @Desc<"y坐标。原点是正中央"> y as double;
    @Desc<"z坐标。原点是正中央"> z as double;
    @Desc<"控件的旋转。是一个四元数。默认为[0f,1f,0f,0f]"> rotation as list<any>;
    @Desc<"控件的标签"> tag as list<string>;
    @Desc<"控件的动画效果"> anims as list<Animation>;
    @Desc<"控件的唯一字符串名，用于保存UUID"> name as string;
    @Desc<"一个函数或函数标签的命名空间id。鼠标准星进入这个控件时执行"> move_in as string;
    @Desc<"一个函数或函数标签的命名空间id。鼠标准星离开这个控件时执行"> move_out as string;
}
'/>

`control`是大部分控件的父类，包含了基本的属性。此类为抽象类，不能实例化。在`control`以及后续所有的数据格式中，和UI坐标相关的数据都默认为以一个方块为单位长度。

<NBTTree code='
@Desc<"所有非文本组件UI控件的基类">
data control: BaseControl {
    @Desc<"对应物品展示实体的`item_display`"> display as string;
    @Desc<"物品展示实体将要展示的物品"> item as Item;
}
'/>

在创建控件以后，还可以访问到的额外数据有：

<NBTTree code='
@Desc<"所有非文本组件UI控件的基类">
data control{
    @Desc<"这个控件可能的所有子控件的UUID数组列表。"> x as list<any>;
}
'/>

`textcontrol`是文本控件的父类，包含了一些基本的属性。由于文本展示实体难以储存自定义信息，因此textcontrol分为两个marker和文本展示实体两个实体组成，其中marker用于储存信息，同时也是UI界面节点的组成部分。可以通过marker访问到对应的文本展示实体。

<NBTTree code='
@Desc<"所有文本组件UI控件的基类">
data textcontrol: BaseControl{
    @Desc<"字体的大小。仅用于输入"> fontsize as float;
}
'/>

在创建文本控件以后，还可以访问到的额外数据有：

<NBTTree code='
@Desc<"所有文本组件UI控件的基类">
data textcontrol {
    @Desc<"这个控件的父控件的UUID"> parent as UUID;
    @Desc<"这个控件所对应的文本展示实体的UUID"> displayEntity as UUID;
}
'/>

这两种基类控件都是**抽象的**，即不能直接创建并显示出来。下面的控件类型则都是可以被实例化的。

`panel`是一个简单的容器控件，可以在其中放置其他的子空间。

<NBTTree code='
data panel: Control {
    @Desc<"子控件"> child as list<BaseControl>;
}
'/>

`button`是一个基础的按钮控件，可以被点击并触发点击事件。

<NBTTree code='
data button: Control {
    @Desc<"事件。使用鼠标左键点击了此按钮时触发"> left_click as string;
    @Desc<"事件。使用鼠标右键点击了此按钮时触发"> right_click as string;
    @Desc<"按钮的内容，是一个控件。如果指定，则忽略`item`，而将按钮展示为指定的控件。"> content as BaseControl;
}
'/>

`textblock`是一个基础的文本控件，可以展示指定的文本

<NBTTree code='
data textblock: TextControl {
    @Name<"text">
    @Desc<"要展示的字符串。如果为列表则代表多行文本"> tex as (string | list<string>);
    @Desc<"文本对齐方式，有`left`，`right`，`center`三种。默认为`left`"> align as string;
}
'/>

`list`是一个可以展示滚动一系列控件的容器控件。通过鼠标滚轮可以滚动展示其中的控件。

<NBTTree code='
@Name<"list">
data l: Control {
    @Desc<"子控件"> child as list<BaseControl>;
}
'/>

`sprite`和`control`几乎没有新的控件数据，可以用于展示一个物品，通过修改材质可以用它展示一些图片。

`stackpanel`是一个能自动布局的容器，可以以指定的布局方式自动排列内部的控件。

<NBTTree code='
data stackpanel: Control {
    @Desc<"控件的布局方式。有right, left, center三种取值"> align as string;
    @Desc<"子控件"> child as list<BaseControl>;
    @Desc<"（TODO）子控件之间的间距"> gap as int;
}
'/>

### 事件

Floating UI的事件机制相当简单，在数据格式中标注了是事件的地方，你都可以写一个函数的命名空间ID或者函数标签上去，这样就可以在需要的时候执行指定的函数了。

例如，我们可以这样为一个按钮添加点击事件：

```json
{
    "type":"button",
    "left_click":"example:event/click"
}
```

当我们点击按钮的时候，就会执行`example:event/click`函数中的内容。

在函数中，函数的执行者是事件所在的控件，而不是玩家。如果要访问玩家，可以使用`floating_ui_owner`标签。

### 动画

既然是UI库，当然少不了动画的支持啦！借助Minecraft展示实体的插值功能，Floating UI提供了一些基本的动画功能。动画通常会在事件触发的时候执行。动画的数据格式如下所示：

<NBTTree code='
data animation {
    @Desc<"动画的目标键值对"> value as list<data {
        @Desc<"动画要修改的UI控件实体的NBT键"> key as string;
        @Desc<"动画要修改的NBT目标值"> value as any;
    }>;
    @Desc<"动画持续时间"> time as float;
    @Desc<"事件。动画开始的时候触发。"> start as string;
    @Desc<"事件。动画结束的时候触发。"> end as string;
}
'/>

例如，要让一个`panel`在鼠标进入的时候变大，可以这样写：

```json
{
    "type":"panel",
    "anim":{
        "move_in":{
            "value":[
                {
                    "key":"transformation.scale[]",
                    "value":3f
                }
            ],
            "time":3,
            "start":"example:event/anim/start",
            "end":"example:event/anim/end"
        }
    }
}
```

不过，和其他的事件不一样的是，动画中的两个事件`start`和`end`不能用于触发动画哦。

### 控件模板

通常来说，一个好用的UI库一定不能缺少自定义控件，或者用户控件，或者模板，Floating UI当然也不例外。通过控件模板，可以把多个控件打包在一起，这样就不用重复编写相同的代码了。Floating UI中控件模板的定义和使用都非常的简单。

<NBTTree code='
data template {
    @Desc<"模板打包的控件"> content as BaseControl;
    @Desc<"一系列键值对，定义了模板中的参数。键名代表了参数名，而键值则表示从content出发的NBT相对路径"> params as compound;
}
'/>

将这个NBT数据传入`floating_ui:data custom.<模板名>`来注册这个模板，随后，就可以直接在`type`字段里面使用这个模板名了，并传入参数了。

下面是一个例子：

```mcfunction
data modify storage floating_ui:data custom.test set value {\
    "content": {\
        "type": "panel",\
        "name": "test",\
        "size": [5f, 5f],\
        "child": [\
            {\
                "type": "textblock",\
                "text": "default"\
            }\
        ]\
    },\
    "params": {\
        "text": "child[0].text"\
    }\
}

data modify storage floating_ui:input data set value {\
    "type": "test",\
    "params":[\
        {"key":"text", "value":"Hello FloatingUI"}\
    ],\
}
```

## 漂浮的API（Floating UI API）

### 控件的访问

对控件的访问有两种方式，一种是使用一对一的name列表访问，一种是使用tag访问多个控件。

#### name

要使用name列表访问一个控件，需要在布局数据中添加对应的name属性。

```json
{
    "type":"panel",
    "size":[5f,5f],
    "child":[
        {
            "name":"apple_button",
            "type":"button",
            "y":-1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"apple"
            }
        }
    ]
}
```

之后，可以在选中根实体的时候，访问`data.names.<name>`这个nbt来获取对应控件的uuid。欸，如果有多个控件有相同的`name`怎么办呢，那自然是后来的覆盖前面的，只会访问到最后一个控件。

#### tag

当然，也可以设置`tag`属性，为控件添加一个标签，实现对多个控件的访问。

```json
{
    "type":"panel",
    "size":[5f,5f],
    "child":[
        {
            "tag":"fruit_button",
            "type":"button",
            "y":-1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"apple"
            }
        },
        {
            "tag":"fruit_button",
            "type":"button",
            "y":1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"carrot"
            }
        }
    ]
}
```

之后，我们就可以使用目标选择器的tag选项来选中我们需要的控件了。

```mcfunction
execute as @e[tag=fruit_button] run ...
```

### 漂浮的函数

Floating UI提供了一些便于调用的函数。以下函数全部略去`floating_ui`命名空间。标记为**非公开**的API可能会发生破坏性变动。

#### `.player_new_ui`

按照floating_ui:input data中的布局数据，生成属于命令执行者的新UI。

直接调用。

#### `.player_dispose_ui`

销毁这个玩家拥有的全部UI

直接调用

#### `_new_ui`（非公开）

按照floating_ui:input data中的布局数据，生成属于\[tag=floating_ui_owner\]玩家的UI。

需要`execute summon item_display run function this`进行调用

#### `_dispose_ui`

删除作为函数执行者的这个UI。

需要`execute as UI实体 run function this`进行调用

#### `.player_tree`

输出这个玩家的UI的结构。

直接调用。

#### `util/_tree`（非公开）

在聊天栏输出作为函数执行者的UI的结构。

需要`execute as UI实体 run function this`进行调用

## 使用XML<Badge type="warning" text="开发中特性" />

觉得写NBT太麻烦了嘛？没关系，Floating UI的数据包中内置了mcdoc，可以实现自动补全。但是在命令中的换行还是很麻烦。怎么办呢，或许还可以使用json。Floating UI的数据包中也包含了一系列的json schema，只要写好json，复制过去，然后按住鼠标中键，就可以批量在末尾添加跨行符`\`啦。

还是觉得麻烦嘛，没关系，我们还有终极武器——XML。

咱们直接上例子：

:::details
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<?xml version="1.0" encoding="UTF-8" ?>
<UI xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="schema.xml">
    <Window>
        <Panel width="6" height="6">
            <Panel.Item tex="11451000"/>
            <Panel width="5" height="2.1" y="-2">
                <Panel.Item tex="11451000"/>
                <Panel.Anim>
                    <Animation trigger="new"/>
                </Panel.Anim>
                <Sprite name="bg1" x="-2.5" width="0" height="2.1">
                    <Sprite.Item tex="11451002" id="yellow_stained_glass_pane"/>
                    <Sprite.Anim>
                        <Animation trigger="new" time="3" end="floating:ui/1/anim/new_next">
                            <Property key="transformation.translation[0]" value="0"/>
                            <Property key="transformation.translation[1]" value="5"/>
                        </Animation>
                    </Sprite.Anim>
                </Sprite>
                <Sprite name="bg2" x="-2.5" width="0" height="2.1">
                    <Sprite.Anim>
                        <Animation trigger="new" time="3" delay="3">
                            <Property key="transformation.translation[0]" value="-0.1"/>
                            <Property key="transformation.translation[1]" value="4.8"/>
                        </Animation>
                    </Sprite.Anim>
                </Sprite>
                <TextButton y="0.7" x="1">选择1</TextButton>
                <TextButton x="1">选择2</TextButton>
                <TextButton y="-0.7" x="1">选择2</TextButton>
            </Panel>
            <Sprite name="character" x="-4" z="0.002">
                <Sprite.Item id="paper" tex="11450001"/>
                <Sprite.Anim>
                    <Animation trigger="new" time="3">
                        <Property key="transformation.translation[0]" value="-3"/>
                    </Animation>
                </Sprite.Anim>
            </Sprite>
            <TextBlock name="character_name" fontsize="3" align="center" y="-1" x="-1.5" z="0.002">霜叶</TextBlock>
        </Panel>
    </Window>

    <Template id="TextButton" params="value">
        <Button width="3" height="0.7">
            <Button.Anim>
                <Animation trigger="new"/>
            </Button.Anim>
            <TextBlock fontsize="1" align="center">{value}</TextBlock>
        </Button>
    </Template>
</UI>
```

:::

在Floating UI XML中，根节点为`UI`以及一个`Window`，在`Window`中编写Floating UI。除了`Windows`里面的东西，其他的都可以直接复制。而`UI`下面还有一个`Template`节点，就是用来定义模板的啦。

从NBT转到XML是很简单的。对于简单的属性值（比如说字符串、数字之类的）记住这样的形式就好：`<控件类型 属性=值></控件类型>`，而对于类型为复合标签的属性值，比如说`item`，在控件标签里面写`<控件类型.属性ID 键=值></控件类型>`。在上面的例子中，基本上已经把所有的格式都说明白啦，可以自己对照着看。

:::tip
对于XML形式的模板来说，有一个特殊的语法糖，也就是名字为`value`的属性。它对应了使用模板时候，直接写在插槽里面的值。

例如，在上面的例子中有模板：

```xml
<Template id="TextButton" params="value">
    <Button width="3" height="0.7">
        <Button.Anim>
            <Animation trigger="new"/>
        </Button.Anim>
        <TextBlock fontsize="1" align="center">{value}</TextBlock>
    </Button>
</Template>
```

其中的params定义了`value`属性，在模板中处于`TextBlock`的文本位置，所以它会替换掉`TextBlock`中的文本。而使用的时候：

```xml
<TextButton y="0.7" x="1">选择1</TextButton>
```

此时文本`选择1`将会默认作为`value`的值传入模板，而不用再写`value="选择1"`

:::
