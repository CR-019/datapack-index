---
title: 'Dynamic custom item cooling'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<FeatureHead
title='Dynamic custom item cooling'
    authorName="icuqALT10"
/>

:::tip
This manuscript is a reset version. I found a better way to write it and the first version was too redundant and complicated, so I took the time to write a second version.
:::

## Involving parts

advancement："`using_item`"、"`consume_item`"

several functions

## Implementation ideas

### Notice

Because the CD of the item needs to be modified dynamically, it is a lot of trouble to implement, and a lot of /data is added, so the performance is greatly reduced.

If you only need ordinary right-click detection without dynamic cooling, you can use other methods or refer to this article.`consume_item进度所对应的部分内容自行改写`

### Ideas

1. Change the consumption time of the item`consumable`.`consume_seconds`Set to at least 0.1 (i.e. 2t)
2. use`using_item`Advancement performs dynamic cd adjustment on item at 1t
3. use`consume_item进度来执行右键对应的 函数 + 返还物品 + 返还原始cd + 扣除对应数量的物品`
4. The main hand and the off-hand need to write advancement and function respectively. (In the specific implementation, only the writing method of the main hand part is shown. For the off-hand part, just copy and paste the main hand and change mainhand to offhand)

## Specific implementation code

load (initialization content)

```
scoreboard objectives add temp dummy
scoreboard objectives add temp2 dummy
scoreboard objectives add right_click_hand dummy "右键检测主副手"
scoreboard objectives add cooldown_remove dummy "冷却缩减"
scoreboard objectives add count_remove_check dummy "是否能消耗"
```

### First give yourself the item in the following format (the example is json format written in the item modifier)

```
    {
        "function": "set_item",
        "item": "clock"
    },
    {
        "function": "set_components",
        "components": {
            "minecraft:custom_data": {
                "right_click":true,"right_click_function":"rt:item/2/grass/main",
                "cooldown_remove":true
            },

            "minecraft:consumable": {"has_consume_particles":false,"animation":"spear","consume_seconds":0.1,"sound":{"range":0,"sound_id":""}},
            "minecraft:use_cooldown": {"seconds":10,"cooldown_group":"rt:item.2.grass"}
        }
    }
```

`custom_data.right_click`: Indicates that this item has right-click detection applied.

`custom_data.right_click_function`: The function path to be executed by right-clicking

`custom_data.cooldown_remove`: Whether to enable dynamic cooling reduction (if not enabled, the cd will be fixed)

`consumable.consume_seconds`: At least 0.1s (2t)

### Dynamically modify the cooling section

#### Writing advancement detection

```
{
    "criteria": {
        "test":{
            "trigger": "minecraft:using_item",
            "conditions": {
                "item": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click:true}"
                    }
                },
                "player": {
                    "equipment": {
                        "mainhand": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click:true}"
                    }}
                    }
                }
            }
        }
    },
    "rewards": {
        "function": "主手的动态冷却函数路径"
    }
}
```

#### Write a function that modifies cooling

Dynamic cooling function for the main hand

```
advancement revoke @s only 上述using_item进度路径

#cd动态设置
execute if score @s cooldown_remove matches 1.. if items entity @s weapon.mainhand *[minecraft:custom_data~{cooldown_remove:true}] unless data entity @s SelectedItem.components.minecraft:custom_data.cd_value run function 符合动态修改条件并开始修改的函数路径
```

Function that meets the dynamic modification conditions and starts modification

```
data remove storage icu:item cd
data modify storage icu:item cd.value set from entity @s SelectedItem.components.minecraft:use_cooldown
data modify storage icu:item cd.custom_data set from entity @s SelectedItem.components.minecraft:custom_data
data modify storage icu:item cd.custom_data.cd_value set from entity @s SelectedItem.components.minecraft:use_cooldown.seconds


#cd计算
execute store result score @s temp run data get storage icu:item cd.value.seconds 1000

scoreboard players set @s temp2 100

scoreboard players operation @s temp2 -= @s cooldown_remove
#硬冷却
execute if score @s temp2 matches ..0 run scoreboard players set @s temp2 1

scoreboard players operation @s temp *= @s temp2
scoreboard players operation @s temp /= .100 int

execute store result storage icu:item cd.value.seconds float 0.001 run scoreboard players get @s temp


#修改
function 修改冷却的宏函数路径 with storage icu:item cd
```

Modify cooling macro function

```
$item modify entity @s weapon.mainhand {function:"set_components",components:{"minecraft:use_cooldown":$(value),"minecraft:custom_data":$(custom_data)}}
```

### Execution and Return Section

#### Writing advancement detection

```
{
    "criteria": {
        "test":{
            "trigger": "minecraft:consume_item",
            "conditions": {
                "item": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click:true}"
                    }
                },
                "player": {
                    "equipment": {
                        "mainhand": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click:true}"
                    }}
                    }
                }
            }
        }
    },
    "rewards": {
        "function": "主手的右键执行函数路径"
    }
}
```

#### Write function

The right button of the main hand executes the function

```
advancement revoke @s only 上述consume_item进度路径

#将主副手计分板设为主手	如果需要的话
scoreboard players set @s right_click_hand 1

#执行对应函数
function 执行右键对应的函数 with entity @s SelectedItem.components.minecraft:custom_data
#上述函数内容只有一行自行创建，内容：$function $(right_click_function)

scoreboard players reset @s right_click_hand


#返还物品
summon armor_stand ~ ~ ~ {Tags:["temp_kill"]}
item replace entity @e[distance=..0.01,tag=temp_kill,limit=1] weapon.mainhand from entity @s weapon.mainhand
item replace entity @s weapon.mainhand with knowledge_book
item replace entity @s weapon.mainhand from entity @e[distance=..0.01,tag=temp_kill,limit=1] weapon.mainhand
kill @e[distance=..0.01,tag=temp_kill,limit=1]

#返还cd
execute if score @s cooldown_remove matches 1.. if items entity @s weapon.mainhand *[minecraft:custom_data~{cooldown_remove:true}] run function 冷却返还函数路径

#移除数量
execute if score @s count_remove_check matches 1.. run function 数量修改函数路径
```

Cooldown return function

```
data remove storage icu:item cd

data modify storage icu:item cd.value set from entity @s SelectedItem.components.minecraft:use_cooldown
data modify storage icu:item cd.custom_data set from entity @s SelectedItem.components.minecraft:custom_data

data modify storage icu:item cd.value.seconds set from storage icu:item cd.custom_data.cd_value
data remove storage icu:item cd.custom_data.cd_value

#修改
function 修改冷却的宏函数路径 with storage icu:item cd
#上行的“修改冷却的宏函数路径”见上一步动态修改冷却部分，可复用
```

Quantity modification function

`count_remove_check`When the scoreboard is 1 point, 1 item will be deducted, 3 points will deduct 3 items, and so on.

```
execute store result score @s temp run data get entity @s SelectedItem.count
scoreboard players operation @s temp -= @s count_remove_check

item modify entity @s weapon.mainhand {"function": "set_count","add": false,"count": {"type":"score","score": "temp","target": "this"}}

scoreboard players reset @s count_remove_check
```

## Epilogue

The general idea is this

If you still have any questions, you can send a private message to my B station, uid: 1239940161

