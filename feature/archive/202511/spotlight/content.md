<SpotlightHead
    title = "香草快讯 - Mojang Spotlight - 2025年11月"
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    cover='../_assets/spotlight.png'
    type=0
/>

这里是***香草***快讯，全Minecraft最***Vanilla***的技术性快照新闻，由本社记者*香草狐*为你报道最新快照消息~

本月Mojang共发布了六个快照：25w42a-46a，均归属于1.21.11。数据包版本号来到了**93.1**，资源包版本号来到了**74.0**。

本月快照的技术性内容主要围绕着一个新的内容——**环境属性**展开，同时对1.21.11的主体玩法内容等进行了一些小修改和补充。

先说结论，本月更新泛用性较强，破坏性较强，对策性极强，总体属于**超大杯下**水平。

<ColorLine />

> [!TIP]
>
> 对于比较重要的破坏性更改，会使用💥标注哦

## 环境属性

环境属性是在25w42a中加入的，依靠数据驱动来控制各种视觉效果和游戏玩法的内容。游戏根据目前多个环境属性源（例如维度、生物群系、时间等）计算最终的环境属性值，从而控制天空颜色、云雾颜色等视觉效果，以及环境光照，床是否可以睡觉等游戏行为。

目前来说，按照应用的顺序，游戏中共有四个环境属性源：维度、生物群系、时间线、天气。环境源提供了两个内容，修饰符和修饰值。游戏将会将上一个修饰器计算得到的修饰值按照指定的修饰符和修饰值进行运算。例如，`add`修饰符号表示将上一个修饰器计算得到的*浮点数*加上修饰值，`and`修饰符表示将上一个修饰器计算得到的*布尔值*和修饰值进行与门计算。每个修饰符和修饰值以及上一个修饰器计算得到的类型对应，不能乱用类型。

目前所有的属性修饰符都可以在[环境属性#环境属性修饰符](https://zh.minecraft.wiki/w/%E7%8E%AF%E5%A2%83%E5%B1%9E%E6%80%A7#%E7%8E%AF%E5%A2%83%E5%B1%9E%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6)中查到。

环境属性值的运算结果最终将会影响到环境属性。在维度类型和生物群系的json定义格式中，定义了如下的格式用于在对应的维度和生物群系中应用不同的环境修饰符从而影响环境属性：

![alt text](image.png)

例如：

```json
{
  "attributes": {
    "minecraft:visual/water_fog_radius": {
      "modifier": "multiply",
      "argument": 0.85
    }
  }
}
```

这个例子会将对应维度或生物群系中水中雾的半径更改为原来的0.85倍。

环境属性的种类非常之多，从视觉效果、声音效果再到视觉玩法，短短几个快照内就已经有了非常丰富的内容亟待探索。所有的环境属性都可以在[环境属性#环境属性列表](https://zh.minecraft.wiki/w/%E7%8E%AF%E5%A2%83%E5%B1%9E%E6%80%A7#%E7%8E%AF%E5%A2%83%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)中找到。

## 时间线

时间线是在25w45a中加入的新实验性功能，根据游戏日时间来作为环境属性源影响环境属性。

可以将时间线理解为动画软件中的时间轴，而时间线上定义的每个点或者属性就是一个关键帧，从而定义了一个环境属性的“动画”。在每一个点上，还可以定义在这个点处的插值方式，默认为线性，可用的插值类型和大多数动画软件中的插值类型基本一致，可以在[插值函数速查表](https://www.xuanfengge.com/easeing/easeing/)这个网站中预览动画效果。

除此之外，缓动类型也可以指定为一个三次贝塞尔曲线。

时间线的定义格式中包含两个字段：`period_ticks`和`tracks`。前者是时间轴的循环周期，后者是时间轴的一个或者多个属性轨道，每个轨道对应一个属性，其上有数个关键帧控制属性的变化。例如：

```json
{
    "period_ticks": 24000,
    "tracks": {
        "minecraft:gameplay/cat_waking_up_gift_chance": {
            "ease": "constant",
            "modifier": "maximum",
            "keyframes": [
                { "ticks": 362,   "value": 0.0 },
                { "ticks": 23667, "value": 0.7 }
            ]
        }
    }
}
```

以上时间轴的周期为24000 tick，也就是恰好一个游戏日。轨道只有`minecraft:gameplay/cat_waking_up_gift_chance`，即控制猫猫送给玩家礼物的概率。缓动类型为`constant`，表示常量，所以在关键帧处为突跃变化。因此，这条时间轴定义了，在362刻到23667刻之间，猫猫送礼物的概率为0，而在23667刻到下一个循环的362刻之间，猫猫送礼物的概率为0.7。

## 槽位源

槽位源是在25w44a中加入的新功能，允许数据包指定任何槽位位置。目前来说，槽位源只能用于战利品表，允许战利品表从对应的槽位中抽取物品。

简单地说，槽位源是多个槽位的组合，并根据一定的规则对槽位进行筛选，最终返回一个或多个槽位位置。

例如：

```json
{
    "type": "minecraft:filtered",
    "item_filter": {
        "count": {
            "min": 16
        }
    },
    "slot_source": [
        {
            "type": "minecraft:slot_range",
            "source": "this",
            "slots": "hotbar.*"
        },
        {
            "type": "minecraft:slot_range",
            "source": "this",
            "slots": "armor.*"
        }
    ]
}
```

这个槽位源在`slot_source`中使用`minecraft:slot_range`选择了玩家的快捷栏和装备栏的槽位，在`item_filter`中定义了槽位中物品数量必须大于等于16，因此总的来说这个槽位源选择了玩家快捷栏和装备栏中数量大于等于16的槽位。

具体的槽位源类型可以在[槽位源](https://zh.minecraft.wiki/w/%E6%A7%BD%E4%BD%8D%E6%BA%90)中找到。

## 杂项

除了上述的几个大板块以外，这些快照中同样还有不少的细节修改。避免啰嗦，这里只写出我觉得比较重要的部分修改，具体的修改内容可以查看更新日志。

* 原来维度类型格式和生物群系定义格式中的一些字段已经因为与环境属性重复而被移除。

* `kinetic_weapon`加入新字段`contact_cooldown_ticks`，表示击中后的冷却时间，在能够再次击中实体之前无法与实体互动

* 新的魔咒效果`apply_exhaustion`，控制对目标实体造成的额外消耗度。

* 世界边界现在基于游戏刻变化而非现实时间，所以现在游戏暂停也会暂停世界边界的移动。相应的，`/worldborder`命令的`time`参数现在也从接受秒改为接受时间值（默认为tick，若有s或d后缀，则为秒或天）

* 所有的游戏规则已经从驼峰命名法重命名为蛇形命名法，并为一些游戏规则添加了值域限制。

* 新的进度触发器`spear_mobs`，当玩家使用任意物品进行冲锋攻击时触发

* 着色器的一些调整

* 方块模型中的元素现在可以绕着多个轴转动

更多详细内容请查阅更新日志~


- 25w42a：<https://zh.minecraft.wiki/w/25w42a>  
- 25w43a：<https://zh.minecraft.wiki/w/25w43a>  
- 25w44a：<https://zh.minecraft.wiki/w/25w44a>  
- 25w45a：<https://zh.minecraft.wiki/w/25w45a>  
- 25w46a：<https://zh.minecraft.wiki/w/25w46a>  