<SpotlightHead
    title = "香草快讯 - Λojang Spotlight - 2025年9月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.png'
    type=1
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了六个快照：25w34a-37a，均归属于1.21.9。数据包版本号来到了**87.0**，资源包版本号来到了**69.0**。

先说结论，本月更新破坏性较小，实用性一般，总体属于**大杯上**水平。

这个月的重要看点就是玩家模型这个新的技术性实体，但是很遗憾目前的玩家模型还不能做什么有用的东西，只有等待Mojang的进一步更新吧。

> 你知道吗，这个月Mojang少有的发布了两次`b`快照——`25w36b`和`25w34b`。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 玩家模型

在25w36a中，添加了一种新的技术性实体——**玩家模型**（`mannequin`）。玩家模型可以看作是一个没有玩家操控的玩家实体，它不拥有物品栏或者其他玩家拥有的NBT字段，但是拥有实体和生物的基本NBT字段，也有基本的生物行为。此外，它还拥有一些控制渲染的NBT字段，可以定义玩家是左撇子还是右撇子，或者是否显示披风等等。

目前玩家模型除了展示用以外，还没有任何其他的功能，并且在其名字下方，也就是`below_name`计分板显示位置会显示一个不可去除的`NPC`字样。

## 💥玩家档案格式

在25w34a中，对玩家档案方面进行了一些更改。首先是我`profile`组件的解析行为发生了改变。在过去，`profile`组件会在被加载的时候自动解析，并将解析结果储存到组件中。现在，此组件的内容不再会在解析的时候被改变，也就是游戏不再向组件中写入解析好的数据。根据组件中字段的定义情况，`profile`组件的行为现在分为两种：

* 若仅仅定义了`properties`字段，或者三个字段同时存在，则将按照原样进行解析，并且不会因为对应玩家（若存在）在线上服务器中档案的更改而更改。

* 若没有定义`properties`字段，且`name`和`id`字段仅仅定义其中一个，则游戏会实时获取对应玩家当前的数据。这个过程可能会有延迟，在加载期间会显示默认皮肤。

同时，也添加了一个新的命令：[**`/fetchprofile`**](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/fetchprofile)，用于**异步**获取玩家档案。命令会获取完成后，在聊天栏输出一个包含了获取结果的文本组件。但是由于Minecraft的命令系统是**同步**的，因此使用`store`或`return`之类的方法获取这个命令的返回值时，不会阻塞命令的运行，相反，它永远返回`1`，也永远会成功。

## 杂项

除此之外，还有很多较小的更新的改动。

* 为`object`文本组件添加了`object`字段，有`atlas`和`player`两个可选值。前者即为先前`object`组件的行为，而后者则根据一个玩家档案组件渲染一个玩家头像。
* 添加了一系列规则。其中一些取代了原来存在于`server.properties`文件中的配置项：
  * `pvp`： 是否允许玩家攻击其他玩家
  * `allowEnteringNetherUsingPortals`：实体是否能通过下界传送门进入下界
  * `enableCommandBlocks`：是否启用命令方块
  * `spawnMonsters`：是否生成敌对生物
  * `spawnerBlocksEnabled`：是否启用刷怪笼
* 💥将`enableCommandBlocks`游戏规则重命名为`commandBlocksEnabled`，以匹配基岩版
