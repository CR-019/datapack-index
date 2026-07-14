---
title: '让所有物品都拥有不死图腾效果的方法'
---

<FeatureHead
    title='让所有物品都拥有不死图腾效果的方法'
    authorName='jk137'
/>


## 前言

自 [Java版1.21.2](https://zh.minecraft.wiki/w/Java版1.21.2) 更新了 `death_protection` 组件后，玩家即可消耗带有此组件的物品来获得类似不死图腾的效果。

要将所有物品都带上这个组件，应该怎么实现呢？



你*可能*需要以下几个知识点来理解本文章：



- [数据组件](https://zh.minecraft.wiki/w/数据组件)

- [物品修饰器](https://zh.minecraft.wiki/w/物品修饰器)

- [战利品表](https://zh.minecraft.wiki/w/战利品表)

- [配方](https://zh.minecraft.wiki/w/配方)



当然没有这些知识点也没关系，看下文我给你慢慢分解。



## 正文

有两种思路来解决此问题。



### 一、纯命令方式

见以下几行命令：



`/give @s stick[death_protection={}]`

- 直接给予当前执行者一个带有死亡保护组件的木棍。



`/item modify entity @s weapon.mainhand {function: "set_components", components: {death_protection: {}}}`

- 将当前执行者的主手位置的物品改为带有死亡保护组件的物品。



`/loot give @s loot {functions: [{function: "set_components", components: {death_protection: {}}}], pools: [{rolls: 1, entries: [{type: "loot_table", value: "chests/end_city_treasure"}]}]}`

- 获取末地城战利品箱，并给其中所有物品附加死亡保护组件。



以上 3 种方式均可在不修改原版游戏文件的情况下获取目标物品。



要解决文章开头提出的问题，

把第二条命令的 `weapon.mainhand` 改为 `container.*` 即可让玩家所有格子的物品都携带上死亡保护组件了。



看起来，这就能完美解决问题了……吗？



旧问题确实解决了，但会导致新的问题：nbt 不同，尽管是相同种类物品也不可堆叠。



那再给所有掉落物都加上组件怎么样？



掉落物的堆叠问题确实能解决一部分，但还有开箱子和合成呢，都需要多一步来整理背包，太别扭了！



#### 总结

此方法只需要高频运行（常加载区块的循环命令方块或数据包tick）以下两行命令：



`/item modify entity @a container.* {function: "set_components", components: {death_protection: {}}}`



`/item modify entity @e[type=item] container.0 {function: "set_components", components: {death_protection: {}}}`



缺点：需要多一步来手动整理背包。



### 二、修改原版数据包

首先思考一下，玩家获取物品的方式有哪些？

- 破坏、合成、开箱、杀怪。

（实际上还有吃喝完剩下的，这里暂时不考虑）



因此，我们只需要修改**配方**（合成）与**战利品表**（破坏、开箱、杀怪）的**组件**就好了！



#### 配方

自 [Java版1.20.5](https://zh.minecraft.wiki/w/Java版1.20.5) 以来，配方产物就可带组件了。



一般格式为：

- `{"type": "有序/无序/熔炼/特殊等等", ..., "result": {"count": 个数, "id": "产物id", "components": {组件}}}`



#### 战利品表

一般格式为：

- `{"type": "方块/箱子/实体等等", ..., "pools": [{随机池1}, {随机池2}]}`



若没有 `functions` 字段则添加：`"functions": [{"function": "set_components", components: {组件}}]`



#### 脚本

很明显，如果我们挨个修改这些原版文件太麻烦了，要用上脚本才可以帮助我们更快地节约时间。



这里我使用的是 Python，代码直接粘贴了：

[/md]

[spoiler]

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

[/spoiler]

[md]

此脚本运行后生成的数据包需要在新世界加载时使用！



### 附录

若要和不死图腾效果完全一致，请替换死亡保护组件的 `{}` 为：



`{"death_effects": [{"type": "clear_all_effects"}, {"type": "apply_effects", "effects": [{"id": "fire_resistance", "duration": 800}, {"id": "regeneration", "amplifier": 1, "duration": 900}, {"id": "absorption", "amplifier": 1, "duration": 100}]}]}`



## 下载

- [可选下载位置](https://github.com/JesKi13567/Experimental-Datapacks/releases/tag/the-tag)

[/md]

[attach]14904[/attach]

[attach]14906[/attach]

[md]

## 视频演示

[/md]

[bilibili]BV1CQV1zHEjG[/bilibili]