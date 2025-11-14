---
title: '如何通过模型映射制作装弹动画？'
---

<FeatureHead
    title = '如何通过模型映射制作装弹动画？'
    authorName = 呜呜呜228766
    avatarUrl = '../../_authors/呜呜呜228766.jpg'
    resourceLink = 'https://wwbh.lanzouu.com/iAh3839h5prc'
    cover='../_assets/6.png'
/>

本文将介绍一个通过模型映射机制的动画实现方式，仅需使用资源包即可实现。

## 动画是怎么来的？

>动画是通过把人物的表情、动作、变化等分解后画成许多动作瞬间的画幅，再用摄影机连续拍摄成一系列画面，给视觉造成连续变化的图画。它的基本原理与电影、电视一样，都是**[视觉暂留](https://baike.baidu.com/item/%E8%A7%86%E8%A7%89%E6%9A%82%E7%95%99/0?fromModule=lemma_inlink)**原理。医学证明人类具有“视觉暂留”的特性，人的眼睛看到一幅画或一个物体后，在0.34秒内不会消失。利用这一原理，在一幅画还没有消失前播放下一幅画，就会给人造成一种流畅的视觉变化效果。
---百度百科

![演示](演示.gif)

## 实现原理

在1.21.4更新的物品模型映射机制中,有一种**值调配型物品模型映射**（range_dispatch），此物品模型映射类型会先计算并返回物品堆叠内给定的一个数值属性，游戏会按照给定阈值从小到大排序，找到数值属性第一个超过或等于的阈值，并使用对应物品模型映射。如果数值属性小于所有阈值，则使用回落映射。

::: tip 通俗地说
定义每个模型的阈值，如果给出的值到达了其中一个模型的阈值，那么则使用这个模型，如果所模型的预值均未到达，则使用回落模型（fallback）
:::

::: warning 注：
也许旧版的模型覆写也可以实现，但笔者未测试过。

编者注：旧版的模型注解也有回落映射的机制，比如说原版模型中的时钟就利用了这种机制。
:::

如果我们要实现枪的功能，则应该在弩的基础上进行修改，并使用**模型映射数值属性当中的`crossbow/pull`**

| 命名空间ID              | 具有附加元素 | 数值来源                                                                                                    |
| :---------------------- | :----------: | :---------------------------------------------------------------------------------------------------------- |
| bundle/fullness         |      否      | 获取收纳袋的容量，此浮点数只会在0-1之间，如果物品堆叠没有 `bundle_contents`组件则返回0                    |
| compass                 |      是      | 获取指南针的指向方向                                                                                        |
| cooldown                |      否      | 获取物品堆叠的冷却程度；如果物品不在玩家物品栏内，则返回0                                                   |
| count                   |      是      | 获取物品堆叠的物品数量                                                                                      |
| **crossbow/pull** | **否** | **弩被拉伸的程度；如果物品堆叠没有 `charged_projectiles`组件，或物品堆叠不在任何生物身上，则返回0** |
| custom\_model\_data     |      是      | 读取物品堆叠的 `custom_model_data`组件中的float数组                                                       |
| damage                  |      是      | 获取物品堆叠的损坏程度                                                                                      |
| time                    |      是      | 获取当前维度时间并归一化，用于时钟的渲染                                                                    |
| use\_cycle              |      是      | 根据物品堆叠使用进度按周期返回浮点数                                                                        |
| use\_duration           |      是      | 获取物品堆叠使用进度                                                                                        |

**`crossbow/pull`会返回0-1的浮点数，下方为其计算逻辑**

```java
/**
     * 获取弩的拉弓动画进度值
     * @param itemStack 弩物品堆
     * @param level 客户端世界（可为空）
     * @param entity 使用物品的实体（可为空）
     * @param remainTime 剩余使用时间
     * @return 拉弓动画进度，范围0.0F到1.0F，已装填或无使用者时返回0.0F
     */
    @Override
    public float get(ItemStack itemStack, @Nullable ClientLevel level, @Nullable LivingEntity entity, int remainTime) {
        if (entity == null) {
            return 0.0F;
        } else if (CrossbowItem.isCharged(itemStack)) {
            return 0.0F;
        } else {
            int i = CrossbowItem.getChargeDuration(itemStack, entity);
            return (float)UseDuration.useDuration(itemStack, entity) / (float)i;
        }
    }
```

那么我们可以通过这个返回值来实现 *在装填的不同阶段展示不同的模型 ！*

仅需在模型映射文件中定义类似以下示例的内容:

```json
{
    "type": "minecraft:range_dispatch",
    "entries": [
        {
            "threshold": 0.004,
            "model": {
                "type": "model",
                "model": "weapons:item/gun/display/gun_1"
            }
        },
...此处省略代码
        {
            "threshold": 1.000,
            "model": {
                "type": "model",
                "model": "weapons:item/gun/display/gun_250"
            }
        }
    ],
}
```

## 模型生成

显然，想要做出流畅的动画，需要几十上百个模型拼接而成，一个一个生成显然是不现实的，我们可以输出几个 **“关键帧模型”**，就像是其他动画软件中的 **“关键帧”** 一样，由软件自动补全“关键帧”与“关键帧”之间的动画，为此我制作了一个自动生成脚本。

需要给出数个用以下格式命名的文件，例如*gun_1.json*和*gun_5.json*，其中的文件及其数值将使用特定差值补全(例如这里是为线性)。

| 文件名（粗体字为输入数据） |  内容（一个简化的例子）  |
| :------------------------: | :-----------------------: |
|  ***gun_1.json***  | ***1 , 5 , 10*** |
|         gun_2.json         |        2 , 10 , 20        |
|         gun_3.json         |        3 , 15 , 30        |
|         gun_4.json         |        4 , 20 , 40        |
|  ***gun_5.json***  | ***5 , 25 , 50*** |

注：使用时需保证两个“关键帧模型”之间的结构一致，且之间的变化仅适用于部分内容 ，反正适用于模型变换与显示变换是没有问题的！😎

注2：虽然模型映射机制本身是每帧调用的，但是其调用的值是每刻更新的，所以在一般情况下，动画帧数仍被限制至20帧 :(

::: warning 生成脚本（需要Java环境）

- 下载链接: <https://wwbh.lanzouu.com/iAh3839h5prc>
- 密码: ef0v
:::

::: tip 广告
本人正在利用 BUKKIT API + 数据包 + 资源包 的方式开发对原版进行扩展插件服务器，目前已实现100+种物品，更多建筑与生物群系，如果你对该项目有兴趣，可以加我QQ3124289614一起制作 !
:::

