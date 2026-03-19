---
title: '动态自定义物品冷却'
---

<FeatureHead
    title='动态自定义物品冷却'
    authorName='icuqALT10'
/>

:::tip
本篇稿子为重置版，因发现更好的写法，且第一版过于冗余复杂，所以抽空写了本第二版
:::

## 涉及部分

进度："`using_item`"、"`consume_item`"

若干函数

## 实现思路

### 注意

因为要动态地修改物品的cd，所以实现起来要麻烦不少，增加了很多/data所以性能要大打折扣

如果只需要普通的右键检测而不需要动态冷却，可以通过其他方法或参考本文章中 `consume_item进度所对应的部分内容自行改写`

### 思路

1. 将物品的消耗时间 `consumable`.`consume_seconds`设置为至少0.1（即2t）
2. 用 `using_item`进度在 第1t 对物品进行动态cd调整
3. 用 `consume_item进度来执行右键对应的 函数 + 返还物品 + 返还原始cd + 扣除对应数量的物品`
4. 主手和副手需要分别写进度与函数，（具体实现中只展示主手部分的写法，副手的部分复制粘贴主手并将mainhand改成offhand即可）

## 具体实现代码

load（初始化内容）

```
scoreboard objectives add temp dummy
scoreboard objectives add temp2 dummy
scoreboard objectives add right_click_hand dummy "右键检测主副手"
scoreboard objectives add cooldown_remove dummy "冷却缩减"
scoreboard objectives add count_remove_check dummy "是否能消耗"
```

### 首先给予自己如下格式的物品（示例为json格式写在物品修饰符里的）

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

`custom_data.right_click`：标识此物品应用了右键检测

`custom_data.right_click_function`：右键所要执行的函数路径

`custom_data.cooldown_remove`：是否开启动态冷却缩减（不开启则cd固定）

`consumable.consume_seconds`：至少为0.1s（2t）

### 动态修改冷却部分

#### 编写进度检测

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

#### 编写修改冷却的函数

主手的动态冷却函数

```
advancement revoke @s only 上述using_item进度路径

#cd动态设置
execute if score @s cooldown_remove matches 1.. if items entity @s weapon.mainhand *[minecraft:custom_data~{cooldown_remove:true}] unless data entity @s SelectedItem.components.minecraft:custom_data.cd_value run function 符合动态修改条件并开始修改的函数路径
```

符合动态修改条件并开始修改的函数

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

修改冷却的宏函数

```
$item modify entity @s weapon.mainhand {function:"set_components",components:{"minecraft:use_cooldown":$(value),"minecraft:custom_data":$(custom_data)}}
```

### 执行与返还部分

#### 编写进度检测

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

#### 编写函数

主手的右键执行函数

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

冷却返还函数

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

数量修改函数

`count_remove_check`计分板为1分时扣除1个物品，3分扣除3个物品，以此类推

```
execute store result score @s temp run data get entity @s SelectedItem.count
scoreboard players operation @s temp -= @s count_remove_check

item modify entity @s weapon.mainhand {"function": "set_count","add": false,"count": {"type":"score","score": "temp","target": "this"}}

scoreboard players reset @s count_remove_check
```

## 尾言

大致思路如此

如果还有疑惑可以私信我的b站，uid：1239940161
