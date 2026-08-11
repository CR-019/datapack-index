---
title: 'Dynamic custom item uses cooling'
---

<FeatureHead
    title = "Dynamic custom item uses cooling"
    authorName = "icuqALT10"
/>


When I saw "Dynamic Cooling Based on Vanilla Cooling Components" written by CR_019, I remembered that the right-click detection I wrote a long time ago can also realize dynamic custom item cooling. It only uses 3 advancements and their corresponding reward functions and 1 empty recipe ~~I will submit another article when I have nothing to do ()~~

## Contains content

advancement:"`using_item`"、"`consume_item`"、"`recipe_unlocked`"

recipe: any empty recipe

## Implementation method

### General idea

The vanilla `consumable` component can customize the time required to consume an item, while the `use_cooldown` component can set the cooldown after use.

However, in most cases, the `use_cooldown` component is triggered only when `consumable` is triggered.

Therefore, we can use `consumable` to trigger `use_cooldown`. There is no noticeable difference between 1t and 2t, so the time required for consumption can be set to 0.1s, while the `using_item` advancement can be triggered continuously during the consumption process.

This way we can do:

In the 1tth time, using_itemadvancement is used to save the item information and modify its cooling

The corresponding effect after the right-click is used can be written in the function of the 2tth successfully consumed item (as of 1.21.6, when this function is triggered, data get can still be used to obtain the information of the consumed item)

When the 2t triggers the effect and gives the player an empty recipe, the third advancement can be triggered.

The third advancement can use the item information stored in the 1t time, and return the item to the player after the player updates in the 2t time (the recipe is updated after the player updates)

### Specific implementation

Take the instructions I have written as an example

#### The 1tth advancement and function

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

#Dynamic update cd that is triggered only once by right-clicking on a tag
execute unless entity @s[tag=cooldown_set] run function yyt:system/right_click/mainhand/consumable/cd

#Get item information
data remove storage yyt:item modify
data modify storage yyt:item modify set from entity @s SelectedItem

#Save the item information to the player's exclusive storage (free to use the details, no details will be given)
function yyt:players/get/main
data modify storage yyt:player player.temp.item.modify set from storage yyt:item modify
function yyt:players/set/main

#revoke the third advancement, paving the way for the following (?)
advancement revoke @s only yyt:system/click_check/consumable/mainhand_replace
```


```mcfunction
#Modify the cd of the item in the player's hand
item modify entity @s weapon.mainhand {function:"set_components",components:{"minecraft:use_cooldown":{seconds:0.5,"cooldown_group":"yyt:weapon/sword/1/1"}}}

#Give the tag and let cd ensure that it is only modified once
tag @s add cooldown_set
```
In this way, this advancement and its corresponding function are triggered at the 1tth time, the information of the item is successfully saved, and the cd of the item in hand is modified.

#### The 2nd and second advancement

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

#remove tag
tag @s remove cooldown_set

#Execute the corresponding function
function yyt:system/right_click/function with entity @s SelectedItem.components.minecraft:custom_data

#Re-give the recipe to trigger the third advancement
recipe take @s yyt:click_check/mainhand
recipe give @s yyt:click_check/mainhand
```
The item consumption is triggered normally, the item's cooling group enters the cd, and a recipe is given.

If you want to modify the item, such as modifying the quantity or modifying nbt, you can do so by modifying the item information saved previously.

#### The 2nd and third advancement

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
#Read item information
function yyt:players/get/main
data modify storage yyt:item modify set from storage yyt:player player.temp.item.modify

#Write back the original cd. Feel free to use it. You can save the original cd in custom_data and use macros here to modify the content of the above storage. But it’s too much to write.
function 懒得写

#Return item and quantity
item replace entity @s weapon.mainhand with stick
function yyt:system/item/components/mainhand with storage yyt:item modify
function yyt:system/item/count/mainhand

#Clear item information and return it to player-specific storage
data remove storage yyt:player player.temp.item.modify
function yyt:players/set/main
```
The most critical part is that the advancement obtained by the recipe will be triggered after the player is updated, so we can use this to seamlessly return the item to the player when the second player successfully consumes the item (it doesn’t matter if you don’t understand it, you just need to know to give the player the recipe in the second advancement and write its acquisition detection in the third advancement)

## Epilogue

It’s actually not troublesome to do. It just took me a long time to think about it while I was writing it.

Hope this helps!
