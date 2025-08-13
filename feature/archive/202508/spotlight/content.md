<SpotlightHead
    title = "香草快讯 - Λojang Spotlight - 2025年8月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.webp'
    type=1
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了三个快照：25w31a-33a，均归属于1.21.9。数据包版本号来到了**83.1**，资源包版本号来到了**65.2**。

先说结论，本月更新破坏性中等，实用性一般，总体属于**大杯上**水平。

这个月的更新基本围绕着铜的新制品展开，比如说铜工具、铜盔甲，以及铜傀儡等等。说的好，铜制品现在已经成为Minecraft中衍生物种类最多的东西了（

有关铜制品的内容在香草快讯中就不多说啦，毕竟本栏是专注于技术性更改的，还是让我们看看远方的数据包更改吧。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 💥数据包版本号

从25w31a开始，Mojang给数据包也加上了小版本号，也就是说以后会有`83.0`，`83.1`这样的数据包版本号，资源包同理。或许Mojang也意识到了刷版本号刷得太快了，想办法整理一下版本呢。

相应的，`pack.mcmeta`文件的格式也有所更改。首先是移除了`support_formats`字段，同时`pack_format`变为了可选字段。`support_format`字段的功能则被`min_format`和`max_format`两个字段代替，分别代表最高的版本号和最低的版本号。但是注意，这两个字段并不是一个浮点数，而是用一个长度为2的列表表示大版本号和小版本号。例如`[74, 1]`表示`74.1`。当然，也可以直接只填写一个整数或者列表中只写一个数字。此时，对于`max_format`字段则相当于小版本号为0，而对于`min_format`字段，则表示任何小版本号都可以被接受。

现在，完整的`pack.mcmeta`格式如下所示：

<NBTTree code='
@Desc<"根对象">
data pack {
    @Desc<"存放数据包信息"> pack as data {
        @Desc<"（文本组件）数据包的描述信息。在创建世界的数据包页面，或光标在/datapack list命令列出的数据包名称上悬停时，会显示此描述。">
        description as text;
        @Desc<"数据包兼容的最低版本号，为两个整数组成的数组，依次为主要版本号和次要版本号，必须大于81。">
        min_format as (int|IntArray);
        @Desc<"数据包兼容的最高版本号，为两个整数组成的数组，依次为主要版本号和次要版本号。">
        max_format as (int|IntArray);
    };
    @Desc<"包过滤器，用于指定数据包要忽略的文件。在NBT列表/JSON数组block内被匹配到的任何模式都将形如其不在该数据包中存在。"> filter as data {
        @Desc<"模式列表">
        block as list<data {
            @Desc<"一个正则表达式，表示要滤除文件的命名空间。若省略则匹配所有命名空间。">
            namespace as string;
            @Desc<"一个正则表达式，表示要滤除文件的路径。若省略则匹配所有文件。">
            path as string;
        }>;
    };
    @Desc<"要启用的实验性内容。注意：如果添加了该字段，则该数据包需要在创建新世界的时候添加，否则在更改旧世界的level.dat前无法添加。">
    features as data {
        @Desc<"启用的内容">
        enabled as list<string>;
    };
    @Desc<"指定要覆盖的部分，即应用在“标准”包内容上的子包。其目录是其自己的资源和data目录（存放于包的根目录下）。">
    overlay as data {
        @Desc<"覆盖列表。其顺序很重要，列表中的第一个对象将被首先应用">
        entries as list<data{  
            @Desc<"此叠加数据包生效的最低版本号。格式与NBT复合标签/JSON对象pack中的格式相同">
            min_format as (int|IntArray);
            @Desc<"此叠加数据包生效的最高版本号">
            max_format as (int|IntArray);
            @Desc<"此子包所在的相对路径。">
            directory as string;
        }>;
    }
}
'/>

## 战利品表上下文

为战利品表添加了两种新的上下文参数集：`entity_interact`和`block_interact`。

其中`entity_interact`提供的参数如下：

|参数名|在谓词中被称作|描述|
|-|-|-|
|`target_entity`|`target_entity`|被交互的实体|
|`interacting_entity`|`interacting_entity`|（可选）与`target_entity`交互的实体|
|`tool`| *谓词无法访问* |与`target_entity`交互所用的工具|

`block_interact`提供的参数如下：

|参数名|在谓词中被称作|描述|
|-|-|-|
|`block_state`|*谓词无法访问*|被交互方块实体的方块状态|
|`block_entity`|*谓词无法访问*|被交互的方块实体|
|`interacting_entity`| `interacting_entity` |（可选）与`block_state`交互的实体|
|`tool`| *谓词无法访问* |与 `block_state`交互所用的工具|

## 文本组件

在25w32a中添加了一个新的文本组件类型`object`，可以直接以字符的形式显示一个纹理图，但是总是会显示为8*8像素的大小，无法更改。所以用字体显示图片的方法一时半会儿还解决不了，但是这个组件确实为显示图标提供了极大的便利。

object文本组件的格式如下：

<NBTTree code='
data root {
    @Desc<"为object">
    type as string;
    @Desc<"（默认为minecraft:blocks）纹理图集的命名空间ID">
    atlas as string;
    @Desc<"图集中精灵图的命名空间ID。示例：item/porkchop。">
    sprite as string;
}
'/>

## 杂项

除此之外，本月的快照中还有相当多小改动：

* 对噪声设置字段的更改
* 新密度函数的加入
* 调试屏幕增强
* `summon`在和平模式下生成敌对生物会执行失败
* `test`命令范围的更改
* 拼图结构的`max_distance_from_center`字段现在可以指定垂直与水平轴上不同的限制
* `block_attacks`物品组件不再会因为不大于0的伤害触发
* 加入了`copper_fire_flame`粒子效果
* 为`explode`魔咒效果加入了`block_particles`字段，指定爆炸的时候产生的粒子效果

还有很多小改动，就不再多说啦，这里附上本月快照链接。值得一提的是，Mojang表示已经把1.21.9的内容更新完毕了，所以接下来的快照估计也没什么大东西啦。

<https://zh.minecraft.wiki/w/25w31a>\
<https://zh.minecraft.wiki/w/25w32a>\
<https://zh.minecraft.wiki/w/25w33a>
