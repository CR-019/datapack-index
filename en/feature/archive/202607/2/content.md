---
title: 'How to make all items have the effect of Undying Totem'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
title='How to make all items have the effect of Undying Totem'
    authorName="jk137"
/>


## Preface

Since [Java Edition 1.21.2](https://zh.minecraft.wiki/w/Java版1.21.2) updated`death_protection`After component, the player can consume the item with this component to obtain an effect similar to the Totem of the Undying.

How to bring all items to this component?



You *may* need the following knowledge points to understand this article:



- [data component](https://zh.minecraft.wiki/w/数据组件)

- [item modifier](https://zh.minecraft.wiki/w/物品修饰器)

- [loot table](https://zh.minecraft.wiki/w/战利品表)

- [recipe](https://zh.minecraft.wiki/w/配方)



Of course, it doesn’t matter if you don’t have these knowledge points. I will break it down for you slowly below.



## text

There are two ideas to solve this problem.



### 1. Pure command method

See the following lines of command:



`/give @s stick[death_protection={}]`

- Directly gives the current executor a stick with a death protection component.



`/item modify entity @s weapon.mainhand {function: "set_components", components: {death_protection: {}}}`

- Change the item at the current executor's main hand position to an item with a death protection component.



`/loot give @s loot {functions: [{function: "set_components", components: {death_protection: {}}}], pools: [{rolls: 1, entries: [{type: "loot_table", value: "chests/end_city_treasure"}]}]}`

- Obtain end city loot boxes and add death protection components to all items in them.



The above 3 methods can obtain the target item without modifying the vanilla game file.



To solve the problem raised at the beginning of the article,

Put the second command`weapon.mainhand`Change to`container.*`This will allow the player's items in all grids to carry death protection components.



It seems that this can perfectly solve the problem...?



The old problem is indeed solved, but it will lead to new problems: nbt is different, even if the items are of the same type, they cannot be stacked.



How about adding components to all drops?



The stacking problem of dropped objects can indeed be partially solved, but as for opening boxes and synthesizing, both require an extra step to organize the backpack, which is so awkward!



#### Summarize

This method only requires high-frequency operation (frequently loading chunk's cyclic command block or data packtick) the following two lines of command:



`/item modify entity @a container.* {function: "set_components", components: {death_protection: {}}}`



`/item modify entity @e[type=item] container.0 {function: "set_components", components: {death_protection: {}}}`



Cons: Requires an extra step to organize the backpack manually.



### 2. Modify vanilladata pack

First think about it, what are the ways for the player to obtain items?

- Destroy, synthesize, open boxes, and kill monsters.

(In fact, there are still leftovers after eating and drinking, which will not be considered here for now)



Therefore, we only need to modify the **components** of **recipe** (synthesis) and **loot table** (destroy, unbox, kill monsters)!



#### recipe

Since [Java Edition 1.20.5](https://zh.minecraft.wiki/w/Java版1.20.5), recipe products can now have components.



The general format is:

- `{"type": "有序/无序/熔炼/特殊等等", ..., "result": {"count": 个数, "id": "产物id", "components": {组件}}}`



#### loot table

The general format is:

- `{"type": "方块/箱子/实体等等", ..., "pools": [{随机池1}, {随机池2}]}`



If not`functions`The fields are added:`"functions": [{"function": "set_components", components: {组件}}]`



#### script

Obviously, it would be too troublesome for us to modify these vanilla files one by one. Using scripts can help us save time faster.



Here I am using Python and the code is pasted directly:

::: details

```python
# 部分代码参考deepseek的输出

import os

import json



# 组件定义

COMPONENT = {

    "death_protection": {

        "death_effects": [

            {"type": "clear_all_effects"},

            {"type": "apply_effects", "effects": [

                {"id": "fire_resistance", "duration": 800},

                {"id": "regeneration", "amplifier": 1, "duration": 900},

                {"id": "absorption", "amplifier": 1, "duration": 100}

            ]}

        ]

    }

}



# 路径配置

# 需为原版数据包，要解压原版jar文件中的data\minecraft

INPUT_ROOT = r'D:\Codes\VSCode\python\test\minecraft'

OUTPUT_ROOT = r'D:\4MC\datapacks\recent\data\minecraft'





def process_json(input_path, output_path, is_recipe=False):

    """处理JSON：loot_table添加functions，recipe修改result的components"""

    try:

        with open(input_path, 'r', encoding='utf-8') as f:

            data = json.load(f)

    except Exception as e:

        print(f"跳过 {input_path}: {e}")

        return



    if is_recipe:

        if "result" not in data:

            print(f"跳过（无result）: {input_path}")

            return

        r = data["result"]

        if isinstance(r, str):

            data["result"] = {"id": r, "components": COMPONENT.copy()}

        elif isinstance(r, dict):

            r["components"] = COMPONENT.copy()

        else:

            return

    else:

        data["functions"] = [{"function": "set_components", "components": COMPONENT}]



    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:

        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))





for subdir, is_recipe in [("loot_table", False), ("recipe", True)]:

    src = os.path.join(INPUT_ROOT, subdir)

    if not os.path.isdir(src):

        continue

    for root, _, files in os.walk(src):

        for file in files:

            if file.endswith('.json'):

                inp = os.path.join(root, file)

                rel = os.path.relpath(inp, src)

                out = os.path.join(OUTPUT_ROOT, subdir, rel)

                process_json(inp, out, is_recipe)

print("完成，输出到:", OUTPUT_ROOT)
```


:::

The data pack generated after running this script needs to be used when loading a new world!



### appendix

To have the same effect as the Totem of Undying, please replace the death protection component`{}`for:



`{"death_effects": [{"type": "clear_all_effects"}, {"type": "apply_effects", "effects": [{"id": "fire_resistance", "duration": 800}, {"id": "regeneration", "amplifier": 1, "duration": 900}, {"id": "absorption", "amplifier": 1, "duration": 100}]}]}`



## download

- [Optional download location](https://github.com/JesKi13567/Experimental-Datapacks/releases/tag/the-tag)


## Video demonstration

https://www.bilibili.com/video/BV1CQV1zHEjG
