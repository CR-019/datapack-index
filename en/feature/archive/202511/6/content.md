---
title: 'How to create a reloading animation through model mapping? '
---
<FeatureHead
    title = "How to create a reloading animation through model mapping?"
    authorName = "Woo woo 228766"
    resourceLink = 'https://wwbh.lanzouu.com/iAh3839h5prc'
    cover='../../../../../feature/archive/202511/_assets/6.png'
/>

This article will introduce an animation implementation method through the model mapping mechanism, which can be achieved by using only resource pack.

:::tip see
There are currently blockbench plug-ins that can implement interpolation and export sequence frame models. See [java block sequencer](https://github.com/Jatzylap/Java-Block-Sequencer).
:::


## Where did the animation come from?

>Animation is a picture that decomposes the character's expressions, movements, changes, etc. into many frames of action moments, and then uses a camera to continuously shoot a series of frames to create a continuously changing visual picture. Its basic principle is the same as that of movies and television, which is **[persistence of vision](https://baike.baidu.com/item/%E8%A7%86%E8%A7%89%E6%9A%82%E7%95%99/0?fromModule=lemma_inlink)**principle. Medical science has proven that humans have the characteristic of "persistence of vision". After human eyes see a painting or an object, it will not disappear within 0.34 seconds. Using this principle, playing the next picture before one picture disappears will create a smooth visual change effect.
---Baidu Encyclopedia

![Demo](../../../../../feature/archive/202511/6/演示.gif)

## Implementation principle

In the itemmodel mapping mechanism updated in 1.21.4, there is a value dispatch type itemmodel mapping** (range_dispatch). This itemmodel mapping type will first calculate and return a numerical attribute given in the item stack. The game will sort the given threshold from small to large, find the first numerical attribute that exceeds or is equal to the threshold, and use the corresponding itemmodel mapping. If the numeric attribute is less than all thresholds, the fallback mapping is used.

::: tip in layman’s terms
Define the threshold of each model. If the given value reaches the threshold of one of the models, then this model is used. If the predetermined value of the model is not reached, the fallback model (fallback) is used.
:::

::: warning Note:
Maybe the old version of model overwriting can also be implemented, but the author has not tested it.

Editor's note: Older versions of model annotations also have a fallback mapping mechanism. For example, the clock in the vanilla model utilizes this mechanism.
:::

If we want to implement the function of a gun, we should modify it on the basis of the crossbow and use the **model mapping numerical attribute.`crossbow/pull`**

| namespaceID | has additional elements | value source |
| :----------------------- | :----------: | :---------------------------------------------------------------------------------------------------------------- |
| bundle/fullness | No | Get the capacity of the storage bag. This floating point number will only be between 0-1, if there is no item stack`bundle_contents`component returns 0 |
| compass | Yes | Get the compass pointing direction |
| cooldown | No | Get the cooling degree of the item stack; if the item is not in the playeritem column, return 0 |
| count | Yes | Get the number of items in the item stack |
| **crossbow/pull** | **No** | **The degree to which the crossbow is stretched; if the item stack is not`charged_projectiles`If the component or item stack is not on any mob, 0** will be returned |
| custom\_model\_data | Yes | Read item stack`custom_model_data`float array in component |
| damage | Yes | Get the damage degree of the item stack |
| time | Yes | Get the current dimension time and normalize it for clock rendering |
| use\_cycle | Yes | Use advancement to return floating point numbers by cycle based on item stacking |
| use\_duration | Yes | Get item stack using advancement |

**`crossbow/pull`It will return a floating point number of 0-1, and the calculation logic is below**

```java
/**
     * Get the advancement value of the crossbow's draw animation
     * @param itemStack crossbow item stack
     * @param level clientworld (can be empty)
     * @param entity Use the entity of the item (can be empty)
     * @param remainTime remaining usage time
     * @return Bow drawing animation advancement, range 0.0F to 1.0F, returns 0.0F when loaded or without user*/
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
Then we can use this return value to achieve *Show different models at different stages of loading! *

Just define something like the following example in your model mapping file:

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
## Model generation

Obviously, to make a smooth animation, dozens or hundreds of models need to be spliced together. It is obviously unrealistic to generate them one by one. We can output several **"keyframe models"**, just like **"keyframes"** in other animation software. The software automatically completes the animation between "keyframes" and "keyframes". For this purpose, I made an automatic generation script.

Several files named in the following format need to be given, such as *gun_1.json* and *gun_5.json*. The files and their values ​​will be completed using a specific difference (for example, linear here).

| File name (input data in bold) | Content (a simplified example) |
| :------------------------: | :--------------------------: |
| ***gun_1.json*** | ***1, 5, 10*** |
| gun_2.json | 2, 10, 20 |
| gun_3.json | 3, 15, 30 |
| gun_4.json | 4, 20, 40 |
| ***gun_5.json*** | ***5, 25, 50*** |

Note: When using it, you need to ensure that the structure between the two "keyframe models" is consistent, and the changes between them only apply to part of the content. Anyway, there is no problem in model transformation and display transformation! 😎

Note 2: Although the model mapping mechanism itself is called every frame, the value it calls is updated every moment, so under normal circumstances, the number of animation frames is still limited to 20 frames :(

::: warning generation script (requires Java environment)

- Download link: &lt;https://wwbh.lanzouu.com/iAh3839h5prc&gt;
- Password: ef0v
:::

::: tip advertising
I am using BUKKIT API + data pack + resource pack to develop a vanilla extension plug-in server. Currently, 100+ items, more buildings and mob groups have been implemented. If you are interested in this project, you can add me at QQ3124289614 to make it together!
:::