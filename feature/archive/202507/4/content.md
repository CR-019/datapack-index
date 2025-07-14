<FeatureHead
    title = '动态自定义物品使用冷却'
    authorName = icuqALT10
    avatarUrl = '../../_authors/icuqalt10.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/1239940161' }
    ]"
/>

看到CR_019大佬写的《基于原版冷却组件实现动态冷却》想起来很早之前我自己写的右键检测也可以实现动态自定义物品冷却，仅用到3个进度与其对应的reward函数和1个空配方 ~~闲来无事再投个稿（）~~

## 包含内容

进度："`using_item`"、"`consume_item`"、"`recipe_unlocked`"

配方：任意空配方

## 实现方法

### 大致思路

原版的 `consumable`组件可以自定义物品的消耗所需时间，`use_cooldown组件`则可以设置使用后冷却

但是 `use_cooldown`组件在大多数情况下只有在触发了 `consumable`才会跟着触发

因此我们可以利用 `consumable来触发use_cooldown`

而1t和2t体感上没有什么差别，因此可以将消耗所需时间设置为0.1s，同时在消耗过程中可以不断触发using_item进度

这样我们就可以做到：

第1t的时候利用using_item进度保存物品的信息并修改他的冷却

第2t成功消耗物品的函数中可以写其右键使用后的对应效果（截止1.21.6 触发此函数时依旧可以利用data get来获取所消耗的物品的信息）

第2t触发效果的同时给予玩家一个空配方，就能触发第三个进度

第三个进度就能用到第1t时所存储的物品信息，在第2t将物品在玩家更新后返还给玩家（配方更新在玩家更新后）

### 具体实现

以我已写的指令为例

#### 第1t的进度与函数

```json
{
    "criteria": {
        "test":{
            "trigger": "minecraft:using_item",
            "conditions": {
                "item": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click_hand:\"main\"}"
                    }
                }
            }
        }
    },
    "rewards": {
        "function": "yyt:system/right_click/mainhand/consumable/main"
    }
}
```

```mcfunction
advancement revoke @s only yyt:system/click_check/consumable/right_click_mainhand

#根据tag一次右键仅触发一次的动态更新cd
execute unless entity @s[tag=cooldown_set] run function yyt:system/right_click/mainhand/consumable/cd

#获取物品信息
data remove storage yyt:item modify
data modify storage yyt:item modify set from entity @s SelectedItem

#将物品信息保存到玩家专属storage中（具体自由发挥，不详细讲述）
function yyt:players/get/main
data modify storage yyt:player player.temp.item.modify set from storage yyt:item modify
function yyt:players/set/main

#revoke第三个进度，为下文做铺垫（？）
advancement revoke @s only yyt:system/click_check/consumable/mainhand_replace
```

```mcfunction
#修改玩家手中物品的cd
item modify entity @s weapon.mainhand {function:"set_components",components:{"minecraft:use_cooldown":{seconds:0.5,"cooldown_group":"yyt:weapon/sword/1/1"}}}

#给予tag，让cd确保一次只修改一次
tag @s add cooldown_set
```

这样在第1t触发了本进度以及其对应函数，成功保存了物品的信息，修改了手中物品的cd

#### 第2t以及第二个进度

```json
{
    "criteria": {
        "test":{
            "trigger": "minecraft:consume_item",
            "conditions": {
                "item": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click_hand:\"main\"}"
                    }
                }
            }
        }
    },
    "rewards": {
        "function": "yyt:system/right_click/mainhand/main"
    }
}
```

```mcfunction
advancement revoke @s only yyt:system/click_check/right_click_mainhand

#移除tag
tag @s remove cooldown_set

#执行对应函数
function yyt:system/right_click/function with entity @s SelectedItem.components.minecraft:custom_data

#重新给予配方	以触发第三个进度
recipe take @s yyt:click_check/mainhand
recipe give @s yyt:click_check/mainhand
```

正常触发了物品的消耗，物品的冷却组进入cd，并给予了一个配方

如果你想要修改物品，比如修改数量、修改nbt，都可以通过修改前文保存的物品信息来实现

#### 第2t以及第三个进度

```json
{
    "criteria": {
      "requirement": {
        "trigger": "minecraft:recipe_unlocked",
        "conditions": {
          "recipe": "yyt:click_check/mainhand"
        }
        },
        "test":{
            "trigger": "minecraft:consume_item",
            "conditions": {
                "item": {
                    "predicates":{
                        "minecraft:custom_data":"{right_click_hand:\"main\"}"
                    }
                }
            }
        }
    },
    "rewards": {
        "function": "yyt:system/right_click/mainhand/consumable/replace_main"
    }
}
```

```mcfunction
#读取物品信息
function yyt:players/get/main
data modify storage yyt:item modify set from storage yyt:player player.temp.item.modify

#写回原始cd 自由发挥    可以将原始cd保存在custom_data里在这里用宏修改上面的storage的内容	不过多写了
function 懒得写

#返还物品以及数量
item replace entity @s weapon.mainhand with stick
function yyt:system/item/components/mainhand with storage yyt:item modify
function yyt:system/item/count/mainhand

#清除物品信息并返还给玩家专属storage
data remove storage yyt:player player.temp.item.modify
function yyt:players/set/main
```

最关键的部分，配方获取的进度会在玩家更新后触发，因此我们可以以此做到在第2t玩家成功消耗了物品的同时无缝返还给玩家该物品（理不清也没关系，你只需要知道在第二个进度那给玩家这个配方并将其获取检测写在第三个进度即可）

## 尾言

做起来其实也不麻烦，就是在我写的时候理思路理了很久

希望对你有帮助！
