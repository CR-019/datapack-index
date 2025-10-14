---
title: '在MC的UI中实现数据绑定'
---

<FeatureHead
    title = '在MC的UI中实现数据绑定'
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    resourceLink = 'https://github.com/Alumopper/Floating-UI'
/>

## 引入

> 如果你还不知道什么是Floating UI，看[这里](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202506/0/content.html)就可以啦。

书接上文。Floating UI是使用的NBT数据来定义布局数据的。试想一下，假设我们想要做一个滚动的列表，内容是玩家的背包物品，我们应该怎么做呢？

`list`中有一个`child`列表字段，其中定义的就是列表中要显示的元素。所以，我们只需要遍历玩家背包列表，然后根据内容添加`sprite`控件数据就好了。

嗯……“只需要”，说得好像遍历很方便一样（

众所周知，在MC中要完成一个遍历操作非常的麻烦，只能依靠递归完成。而且，很明显这种需求是很常见的，我们就需要写很多次重复的代码。虽然在数据包里面这是不得不评鉴的一环，但是咱不是Mojang不会让你去品鉴一坨东西，所以肯定需要提供一个很方便的东西啦。

让我们看看，在其他的UI框架中，是怎么解决这类问题的。在宇宙最强Windows桌面开发框架WPF中，提供了模板(Template)和数据绑定(Data Binding)两个东西来优雅地解决这样的问题。

```xml
<!-- ItemsControl用于显示数据集合，ItemsSource绑定到ViewModel的数据源 -->
<ItemsControl x:Name="listControl" ItemsSource="{Binding ItemList}">
    
    <!-- 定义每个数据项的显示模板 -->
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <!-- 每个数据项显示为带边框的文本块 -->
            <Border Margin="5" Padding="10" Background="LightBlue">
                <TextBlock Text="{Binding Name}" FontSize="16"/>
            </Border>
        </DataTemplate>
    </ItemsControl.ItemTemplate>
</ItemsControl>
```

```cs
// MainWindow.xaml.cs
using System.Collections.Generic;
using System.Windows;

namespace WpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            
            // 创建测试数据
            var items = new List<Item>
            {
                new Item { Name = "项目1" },
                new Item { Name = "项目2" },
                new Item { Name = "项目3" },
                // 可继续添加更多项目测试滚动效果
            };
            
            // 设置数据上下文
            DataContext = new ViewModel { ItemList = items };
        }
    }

    // 数据模型类
    public class Item
    {
        public string Name { get; set; }
    }

    // ViewModel类
    public class ViewModel
    {
        public List<Item> ItemList { get; set; }
    }
}
```

看不懂？没关系喵。简单的说，就是定义了一个模板，这个模板会根据数据源中的数据来生成对应的UI元素。是不是很方便呀？于是，我们也要做一个这样的功能才行。

## 成果

在Floating UI中，有`list`和`stackpanel`两个控件拥有`child`列表字段，这两个控件都支持模板和数据绑定。如果把`child`字段定义为一个*数据源*，同时额外定义一个`template`字段，Floating UI就会根据模板和数据源自动生成UI元素。

```json
{
    "type": "list",
    "size":[5f,5f],
    "template": {   // 模板
        "type":"button",
        "size":[1.2f,1.2f],
        "item":{
            "id":"apple"
        }
    },
    "child": {
        "path": "temp qwq.value",   //数据源
        "binds": [  //绑定关系
            {
                "source": "id",
                "target": "item.id",
            }
        ]
    }
}
```

在上述例子中，`template`中是一个控件，也就是一个模板，而`child`本来应该是一个列表，这里却定义为了一个复合标签，表示是一个数据源引用。`child.path`是一个`storage`路径，空格隔开的前半部分是storage的命名空间ID，后半部分则是在这个storage中的nbt路径，必然对应一个列表。`child.binds`列表描述了一个绑定关系，其中的`source`字段表示数据源中的路径，`target`字段表示模板中的路径。在这个绑定关系中，将会把`minecraft:temp`中`qwq.value`列表作为数据源，其中每一个元素的`id`字段都会作为模板中`item.id`字段的值，从而生成一个按钮。

到这一步，仍然只是从已有的一个数据中生成UI，若数据源中的内容发生更改，UI还是不会自动更新。这个时候，就是`set_property`函数登场的时候了。通过使用`floating_ui:datasource/set_property`函数设置数据源中的内容，可以自动触发UI的更新。当然，必须要通过这个函数设置才行，毕竟，咱不可能每个tick都轮询数据源中的内容，这样的开销太大了。事实上在WPF中，也是使用了`SetProperty`这样的方法来触发事件，从而通知UI进行更新的。

像这样来使用`set_property`函数：

```mcfunction
data modify storage floating_ui:temp binding.path set value "minecraft:temp qwq.value"
data modify storage floating_ui:temp binding.value set from entity @p Inventory
floating_ui:datasource/set_property
```

就是这样的简单~

## 原理

以`stackpanel`为例。在其`_new`函数中，会判断`child`字段是否是一个列表。如果不是列表，说明是一个数据源，那么就可能使用了数据绑定，因此进入`./template/append_template`函数中。

```mcfunction
# template: (string|compound)
# 如果不是内联数据，则获取数据模板
execute unless data storage floating_ui:input temp.template.type run return run function log:_error {msg: "无效的模板"}
# temp.child: {value: [...], path:xxx, binds: [source:xxx, target: xxx]}
# 若有绑定，则注册绑定，并获取绑定数据，储存在source.value中。如果没有binding，则说明直接声明了数据源，不参与绑定
execute if data storage floating_ui:input temp.child.path if function floating_ui:element/stackpanel/template/register_binding run function floating_ui:element/stackpanel/template/set_source with storage floating_ui:temp binding
# 解析保存在temp.child.value中的源数据
function floating_ui:element/stackpanel/template/update_source
```

这个函数分为三步。第一步，注册数据绑定；第二步，初次解析数据源中的内容；第三步，根据数据源的内容更新UI。

### 注册数据绑定

首先，通过`if function`子命令调用`floating_ui:element/stackpanel/template/register_binding`函数。

```mcfunction
# floating_ui:element/stackpanel/template/register_binding

#注册绑定
data modify storage floating_ui:temp binding.path set from storage floating_ui:input temp.child.path
function floating_ui:datasource/register_binding
#在实体中写入绑定信息
function floating_ui:element/stackpanel/template/register_binding_1 with storage floating_ui:input temp.child
return 1
```

```mcfunction
# floating_ui:element/stackpanel/template/register_binding_1

$data modify entity @s item.components."minecraft:custom_data".register_binding."$(path)" set value 'function floating_ui:element/stackpanel/template/before_update_source'
```

`floating_ui:datasource/register_binding`函数用于全局注册一个数据绑定，将这个UI控件绑定到这个路径中。我们稍后来看这个函数的详细内容。而`floating_ui:element/stackpanel/template/register_binding_1`是一个宏函数。先前`_new`函数是以当前控件对应的展示实体作为上下文，所以在宏函数中，就写入了数据绑定事件的信息——当`$(path)`对应的数据源中的内容发生改变的时候，会执行`floating_ui:element/stackpanel/template/before_update_source`函数。

:::tip
你可能会发现，Floating UI中凡是涉及到宏函数相关的内容，几乎都会单独开一个函数，保证单个宏函数中的命令量尽可能少。这是因为在宏函数中，即使普通的命令也会占用宏的解析事件，简短的宏函数对整体执行效率的提升有很大的帮助。
:::

回过头来看看`floating_ui:datasource/register_binding`函数。需要记住的是，这个函数执行的上下文同样应该是控件对应的这个展示实体。

```mcfunction
# floating_ui:datasource/register_binding

execute store result score _ int run function floating_ui:datasource/get_or_create_data_id with storage floating_ui:temp binding
#设置实体绑定
function floating_ui:datasource/register_binding_1
```

```mcfunction
# floating_ui:datasource/get_or_create_data_id

$execute unless data storage floating_ui:data binding.id."$(path)" store result storage floating_ui:data binding.id."$(path)" int 1.0 run scoreboard players add _static_index floating_ui.data_id 1
$return run data get storage floating_ui:data binding.id."$(path)"
```

```mcfunction
function floating_ui:datasource/register_binding_1

#这个控件有数据绑定
scoreboard players set @s floating_ui.data_id 0
execute unless score @s floating_ui.data_id_0 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_0 = _ int
execute unless score @s floating_ui.data_id_1 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_1 = _ int
# ...穷举部分省略
execute unless score @s floating_ui.data_id_20 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_20 = _ int
function log:_error {msg: "Failed to register binding: No data_id is available"}
#绑定失败，移除绑定标记
scoreboard players reset @s floating_ui.data_id
```

`get_or_create_data_id`函数会获取数据源（其实就是路径）的唯一ID值，如果没有，则创建ID。比较遗憾的是，如果用计分板储存ID，这里的性能本应该可以大大提升，但是我们的数据源中含有空格，而计分板的积分项不能含有空格。所以嘛，只能用storage来储存ID了。函数使用`return`命令返回了这个数据源的ID，并在`register_binding`中暂存起来。

接下来，在`register_binding_1`中，就是把控件（即展示实体）和这个数据源（即路径）的ID绑定起来。实体的`floating_ui.data_id_x`值对应了它所绑定的数据源。实体有20个`data_id`计分板，从`data_id_0`到`data_id_20`，也就是说一个控件最多可以支持21个数据源的绑定。如果没有空余的绑定位，就会绑定失败并给出提示。事实上，这样的做法相当于是使用了一个静态数组，其长度为21。从泛用性的考虑来说，这里应该使用一个可变长度的列表，也就是使用一个列表类型的NBT来储存。但是列表的访问代价高昂，在大多数情况下21个绑定位已经足够。

### 初次获取数据源中的内容

回到一开始的`append_template`函数。接下来就是使用`function floating_ui:element/stackpanel/template/set_source with storage floating_ui:temp binding`来解析数据源中的内容。这一步非常简单，只使用了一条宏命令。

```mcfunction
$data modify storage floating_ui:input temp.child.value set from storage $(source)
```

它将解析的结果暂存在了`value`字段中。稍后的解析部分就是根据这个内容来更新UI的。

### 更新数据源中的内容

我们先不说解析，先说在更新数据源的时候会发生什么。因为不管是初始化的时候，还是更新的时候，解析都是调用的同一个函数，所以不如稍后一起说。

更新数据源的内容是使用`function floating_ui:datasource/set_property`函数完成的。我们之前说，在使用这个函数之前，需要先给`floating_ui:temp binding`中的`path`和`value`复制，分别代表了数据源路径和要赋值的内容。这个函数是这样的：

```mcfunction
# floating_ui:temp binding
# {path: xxx, value: xxx}
execute store result score _ int run function floating_ui:datasource/get_or_create_data_id with storage floating_ui:temp binding
#设置值
function floating_ui:datasource/set_value with storage floating_ui:temp binding
execute if score isChanged _ matches 0 run return 0
#通知所有UI刷新
scoreboard players operation now floating_ui.notify_id = SOURCE_UPDATE floating_ui.notify_id
execute as @e[tag=floating_ui_control] run function floating_ui:datasource/set_property_1
```

首先还是熟悉的`floating_ui:datasource/get_or_create_data_id`，获取了数据源的唯一ID。随后就是使用一个简单的宏命令来设置数据源的值。这里使用了一个小技巧，也就是如果要设置的值和原来的值一样，`data`命令就会返回失败。通过获取命令的返回值，我们就能知道数据源在设置前后是否发生了更改，从而决定是否刷新UI，这样来节约性能。

之后，就是通知所有的UI进行刷新了。从拓展性出发，考虑到除了数据源更新以外，以后可能有其他的通知事件，这里用`floating_ui.notify_id`计分板表示事件ID，而`SOURCE_UPDATE`常量则表示了数据源更新事件。之后，就是遍历所有UI，通知绑定了对应数据源的UI进行刷新，也就是`set_property_1`函数。这个函数还是一个冗长的穷举过程，看一眼就能明白了。

```mcfunction
# 依次检查绑定槽，判断是否绑定了该数据源
execute if score @s floating_ui.data_id_0 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
execute if score @s floating_ui.data_id_1 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
# ...
execute if score @s floating_ui.data_id_20 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
```

`floating_ui:macro/notify`的内容是这样的：

```mcfunction
$function floating_ui:element/$(type)/_notified
```

这其实是一个类似*多态*的戏法。每个控件都储存了一个`type`字段表示控件的类型，根据这个字段构建的命令就可以调用对应控件的函数。对于`stackpanel`来说，它的函数是这样的：

```mcfunction
function floating_ui:element/control/_notified

#0 - 源更新通知
execute if score now floating_ui.notify_id = SOURCE_UPDATE floating_ui.notify_id run function floating_ui:element/list/binding/update_source
```

首先第一步调用其基控件（父类）的函数，因为一般情况下子控件应该继承了父控件的事件处理逻辑，随后才是自己的逻辑，也就是处理数据源更新的通知事件，调用`floating_ui:element/list/binding/update_source`函数。

```mcfunction
#获取绑定数据的更新行为
function floating_ui:element/list/binding/update_source_1 with storage floating_ui:temp binding
#执行更新
function floating_ui:macro/action with storage floating_ui:temp binding_info
```

依然是从拓展性角度考虑，由于可能会有多种绑定，而不一定所有字段的绑定都是调用一个方法，或者应该说，只有`child`字段的绑定才会去调用更新列表控件的函数，所以首先需要通过`update_source_1`宏函数获取到绑定数据的更新行为。我们之前在注册数据绑定的时候，往实体里面写入的东西这里就排上用场了。

```mcfunction
$data modify storage floating_ui:temp binding_info.action set from entity @s item.components."minecraft:custom_data".register_binding."$(path)"
```

之后是简短的`floating_ui:macro/action`工具函数，只是用来执行`binding_info.action`中储存的命令。

```mcfunction
$$(action)
```

（真的很简短喵）

所以我们实际上会去调用先前写入实体中的目标函数，也就是`floating_ui:element/stackpanel/template/before_update_source`函数。

```mcfunction
#floating_ui:temp binding
#{path: xxx, value: xxx}
data modify storage floating_ui:input temp.template set from entity @s item.components."minecraft:custom_data".data.ui.template
data modify storage floating_ui:input temp.source.binds set from entity @s item.components."minecraft:custom_data".data.ui.source.binds
data modify storage floating_ui:input temp.source.value set from storage floating_ui:temp binding.value
# 移除已有的所有子控件
#删除子节点
execute on passengers run function floating_ui:dispose_control with entity @s item.components.minecraft:custom_data.data.ui
#更新源
function floating_ui:element/stackpanel/template/update_source
```

这里是为了兼容`floating_ui:element/stackpanel/template/update_source`所需要的NBT数据结构模式进行的一系列赋值，以及移除现在控件上已有的子控件，为后续更新做准备。最后，调用`update_source`函数来更新UI。

现在，我们终于可以说说`update_source`函数了。

### 解析

`floating_ui:element/stackpanel/template/update_source`的内容如下：

```mcfunction
# floating_ui:input temp.child: {value: [...], path:xxx, binds: [{source:xxx, target: xxx}]}

#遍历函数，确定参数
data modify storage floating_ui:temp temp.source.value set from storage floating_ui:input temp.source.value
execute unless data storage floating_ui:temp temp.source.value[0] run return run function log:_error {"message":"Data source must be a list"}

#覆盖手动定义的子元素
data modify storage floating_ui:input temp.child set value []

function floating_ui:element/stackpanel/template/update_source/loop

scoreboard players set isUpdate _ 1

#子元素
function floating_ui:element/stackpanel/child
```

没错哦，繁琐的遍历就是在这里完成的。这里总共有两个遍历过程，第一个是遍历`value`列表中的数据，第二个是遍历`binds`列表中的绑定关系，并将每个关系都应用到模板，得到新的子空间的布局数据，按照储存在`child`列表中。

::: details 相关函数

```mcfunction
# floating_ui:element/stackpanel/template/update_source/loop

#没有元素了，返回
execute unless data storage floating_ui:temp temp.source.value[0] run return 0

#复制一份模板
data modify storage floating_ui:temp temp.template set from storage floating_ui:input temp.template
#复制绑定参数表
data modify storage floating_ui:temp temp.source.binds set from storage floating_ui:input temp.source.binds

# 绑定替换
function floating_ui:element/stackpanel/template/update_source/params_loop

# 得到了模板，加入child列表
data modify storage floating_ui:input temp.child append from storage floating_ui:temp temp.template

data remove storage floating_ui:temp temp.source.value[0]

function floating_ui:element/stackpanel/template/update_source/loop
```

```mcfunction
# function floating_ui:element/stackpanel/template/update_source/params_loop

#没有元素了，返回
execute unless data storage floating_ui:temp temp.source.binds[0] run return 0

# 绑定替换
function floating_ui:element/stackpanel/template/update_source/get_source with storage floating_ui:temp temp.source.binds[0]

data remove storage floating_ui:temp temp.source.binds[0]

function floating_ui:element/stackpanel/template/update_source/params_loop
```

```mcfunction
# function floating_ui:element/stackpanel/template/update_source/get_source

$data modify storage floating_ui:temp temp.template.$(target) set from storage floating_ui:temp temp.source.value[0].$(source)
```

:::

当所有的子控件布局数据写入`child`列表后，调用`function floating_ui:element/stackpanel/child`函数，生成子控件。这一步的话，就和直接声明`child`列表是一样的了，这里就不多说啦。

## 总结

通过数据绑定和模板，我们可以很方便地根据数据源动态生成UI元素，并且在数据源发生更改的时候，自动更新UI。这样一来，我们就能很方便地实现滚动列表之类的功能。在这一套框架下，不止是`child`字段，其他的属性，例如`text`，`item`等等，也都可以使用数据绑定来动态更新，只是目前尚未实现而已。未来，Floating UI还会继续完善这方面的功能，让大家能更方便地使用数据绑定来实现动态UI。
