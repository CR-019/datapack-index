---
title: 'How to detect which key the player pressed'
---

<FeatureHead
    title="How to detect which key the player pressed"
    authorName="Esan Sang Sang Sang"
/>


## 1. F key detection (swap the off-hand item key)

### Special features of F key

F key (default binding`Swap Item with Offhand`)**not in**vanillapredicate`input`in the system. The following fields are all supported by predicate:

```
forward, backward, left, right, jump, sneak, sprint
```
The F keys are not among them. source:`InputPredicate`(yarn 1.21.11+build.4).

### item exchange notation
Applicable version: 1.20.5+
Principle: F key triggers main hand/off hand item exchange → Pass`inventory_changed`Advancement detects changes in item position.
Core ideas (from Inventory Rotate data pack, Modrinth):

1. Tag the deputy item (via`item_modifier`write`custom_data`)
2. Give different tags to the off-hand items
3. When the F key is pressed → item swap → the tags of the two items swap positions.
4. Detect the change of tag position to determine whether the F key is pressed.

Preparation: Preload the worldentity in load, and revoke the player's advancement (to prevent the player from already owning the advancement after restarting and causing it to fail to trigger next time)

```mcfunction
advancement revoke @a only <namespace>:fkey_detect
```
Step 1: Mark the main/deputy item in the tick
tick:

```mcfunction
execute as @a at @s run function <namespace>:player/tick
```


`&lt;namespace&gt;/function/player/tick.mcfunction`
```mcfunction
#Write custom_data tag with item modifier
item modify entity @s weapon.mainhand <namespace>:tag_mainhand
item modify entity @s weapon.offhand <namespace>:tag_offhand
```


`&lt;namespace&gt;/item_modifier/fkey/tag_mainhand.json`
```json
{
    "function": "minecraft:set_custom_data",
    "tag": "{<namespace>:{offhand:0b}}",
    "conditions": []
}
```

`&lt;namespace&gt;/item_modifier/fkey/tag_offhand.json`
```json
{
    "function": "minecraft:set_custom_data",
    "tag": "{<namespace>:{offhand:1b}}",
    "conditions": []
}
```
Step 2: Advancement automatically monitors. Any change in the item column will trigger this advancement.`&lt;namespace&gt;/advancement/fkey_detect.json`
```json
{
  "criteria": {
    "a": { "trigger": "minecraft:inventory_changed" }
  },
  "rewards": { "function": "<namespace>:fkey/check" }
}
```
Step 3: Implementation 1: If the main and deputy hand marks are misplaced, trigger; then clear the custom_data mark on the mouse pointer
> Recommended, it works most of the time. There is a problem that the player item cannot be stacked back after being created in the offhand hand (the data is different and it cannot be stacked with the original same type of item)`&lt;namespace&gt;/function/fkey/check.mcfunction`
```mcfunction
function <namespace>:fkey/check/is_swap

execute if items entity @s player.cursor *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/cursor

#It cannot be removed at the beginning to prevent the check from being triggered within the logic.
advancement revoke @s only <namespace>:fkey_detect
```

`&lt;namespace&gt;/function/fkey/check/is_swap.mcfunction`
```mcfunction
execute if items entity @s weapon.mainhand *[custom_data~{<namespace>:{offhand:1b}}] run return run function <namespace>:fkey/on_press
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}] run function <namespace>:fkey/on_press
```

`&lt;namespace&gt;/function/fkey/check/enum/cursor.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s player.cursor
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s player.cursor from entity a-b-c-d-2 contents
```
The third step is to implement the second step: If the main and deputy hand marks are misplaced, it will be triggered; then clear all custom_data marks in the backpack.
> It is safer than the first implementation. There is also the problem that the player item cannot be stacked back after being created in the secondary hand (the data is different and it cannot be stacked with the original same type of item), but the items can be stacked with 2 clicks.
> But the performance consumption will be slightly higher`&lt;namespace&gt;/function/fkey/check.mcfunction`
```mcfunction
function <namespace>:fkey/check/is_swap

#Check everything in the item column of the backpack and remove the main and deputy data flags (unfortunately, exhaustive performance is the best)
#It is legal to add a dot in the function name, feel free to add it
## item column (inventory.0~26)
execute if items entity @s inventory.0 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/inventory.0
##...omit the middle
execute if items entity @s inventory.26 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/inventory.26
## Hotbar (hotbar.0~8)
execute if items entity @s hotbar.0 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/hotbar.0
##...omit the middle
execute if items entity @s hotbar.8 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/hotbar.8
## Armor (armor.head, armor.chest, armor.legs, armor.feet)
execute if items entity @s armor.head *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/armor.head
##...After omitting
## deputy
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/weapon.offhand
## mouse
execute if items entity @s player.cursor *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/cursor

#Finally, remove the advancement to prevent the check from being triggered within the logic.
advancement revoke @s only <namespace>:fkey_detect
```


`&lt;namespace&gt;/function/fkey/check/is_swap.mcfunction`
```mcfunction
execute if items entity @s weapon.mainhand *[custom_data~{<namespace>:{offhand:1b}}] run return run function <namespace>:fkey/on_press
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}] run function <namespace>:fkey/on_press
```

`&lt;namespace&gt;/function/fkey/check/enum/inventory.0.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s inventory.0
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s inventory.0 from entity a-b-c-d-2 contents
```

...
`&lt;namespace&gt;/function/fkey/check/enum/inventory.26.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s inventory.26
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s inventory.26 from entity a-b-c-d-2 contents
```
...(Other functions have similar formats and can be created in batches by writing python or other scripts)



### Pre- and post-frame storage method (Storage comparison version, not verified, may not be used)

Principle: Use`inventory_changed`advancement triggers. Store the last moment's main and deputy NBT in Storage. When the item column changes, compare "the current deputy hand vs the past main hand" and "the current main hand vs the past deputy hand". If the two are exactly the same, it is judged as an F key exchange.

Disadvantages: When the main and deputy items are exactly the same (NBT is completely the same), the status before and after the exchange is indistinguishable, and the F key cannot be detected. To cover this scenario, fall back to "item exchange notation".

#### 1. Initialization (Load)

When the data pack is loaded, score items and persistent entities are prepared.`&lt;namespace&gt;/function/load.mcfunction`
```mcfunction
scoreboard objectives add <namespace> dummy
scoreboard objectives add <namespace>.id dummy

execute in overworld run forceload add -1 -1 1 1
execute in overworld run function <namespace>:load/item_display
```


`&lt;namespace&gt;/function/load/item_display.mcfunction`
```mcfunction
execute if entity a-b-c-d-2 run return 0
execute in overworld run return run summon item_display 0 0 0 {Tags:["<namespace>.persistent"],UUID:uuid("a-b-c-d-2"),view_range:0}
```
#### 2. Trigger (Advancement)`data/&lt;namespace&gt;/advancement/fkey_detect.json`
```json
{
  "criteria": { "a": { "trigger": "minecraft:inventory_changed" } },
  "rewards": { "function": "<namespace>:fkey/check" }
}
```
#### 3. Core detection logic`&lt;namespace&gt;:fkey/check.mcfunction`
```mcfunction
#1. Empty-handed special judgment (1.20.5+ items subcommand)
execute unless items entity @s weapon.mainhand * unless items entity @s weapon.offhand * run return run advancement revoke @s only <namespace>:fkey_detect

#2. Prepare ID
execute unless score @s <namespace>.id matches -2147483648.. store result score @s <namespace>.id run scoreboard players add id <namespace> 1
execute store result storage <namespace>:io id int 1 run scoreboard players get @s id

#3. "Open" data: read player data from the array into temporary space
function <namespace>:fkey/open with storage <namespace>:io

#4. Execute comparison logic
function <namespace>:fkey/compare

#5. "Save" data: write the modified temporary space back to the array
function <namespace>:fkey/close with storage <namespace>:io

#6. Cancel advancement (put it at the end to prevent internal items from re-triggering the check function)
advancement revoke @s only <namespace>:fkey_detect
```
#### 4. Core access and performance optimization
Reading player NBT is extremely expensive (about 160 units), while operating Storage is extremely fast (about 5~8 units). Therefore, we first save the current item into`io temp`Then proceed with the subsequent operations.

**Data Reading (Macro):**`&lt;namespace&gt;:fkey/open.mcfunction`
```mcfunction
$data modify storage <namespace>:io player set from storage <namespace>:data player[{id:$(id)}]
```
**Logical comparison (normal function):**`&lt;namespace&gt;:fkey/compare.mcfunction`
```mcfunction
#Performance optimization: first read the player's current item into the io temp cache
data modify storage <namespace>:io temp set value {now_main:{},now_off:{}}
data modify storage <namespace>:io temp.now_main set from entity @s SelectedItem
data modify storage <namespace>:io temp.now_off set from entity @s equipment.offhand

#Comparative logic: try to use "current off-hand" to cover "past main hand"
#Note: The comparison is between two nodes in io and does not involve player NBT reading, which is extremely fast.
execute store success score #main_match <namespace> run data modify storage <namespace>:io player.prev_main set from storage <namespace>:io temp.now_off
#Try to overwrite the "past stored off-hand" with the "current main hand"
execute store success score #off_match <namespace> run data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.now_main
#Check to see if they are the same
execute store success score #diff_match <namespace> run data modify storage <namespace>:io player.prev_off set from storage <namespace>:io player.prev_main

#If store success returns 0, it means that the main and deputy hands are completely swapped, and it is determined that the F key is pressed.
#And the main and deputy items must be different
execute if score #main_match <namespace> matches 0 if score #off_match <namespace> matches 0 if score #diff_match <namespace> matches 1 run function <namespace>:fkey/on_press

#Regardless of whether it is exchanged or not, the player data must be updated to the current state for comparison in the next frame.
data modify storage <namespace>:io player.prev_main set from storage <namespace>:io temp.now_main
data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.now_off
```
**Processing after pressing the F key (demonstration exchange logic):**`&lt;namespace&gt;:fkey/on_press.mcfunction`
```mcfunction
#If you need to intercept the F keys and restore them (or swap them manually in the program):
#1. Physical restoration (using register entity)
item replace entity a-b-c-d-2 contents from entity @s weapon.mainhand
item replace entity @s weapon.mainhand from entity @s weapon.offhand
item replace entity @s weapon.offhand from entity a-b-c-d-2 contents

#2. Storage restore (swap prev_main and prev_off)
data modify storage <namespace>:io temp.swap set from storage <namespace>:io player.prev_main
data modify storage <namespace>:io player.prev_main set from storage <namespace>:io player.prev_off
data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.swap
```
**Data writeback (macro):**`&lt;namespace&gt;:fkey/close.mcfunction`
```mcfunction
$data modify storage <namespace>:data player[{id:$(id)}] set from storage <namespace>:io player
```
**Performance Reference**:
- Directly read the player's main and deputy hands: ~160 units/time
- Storage internal operations: ~5-8 units/time
- Pass`io temp`After caching, the total consumption of subsequent complex logical judgments (even with multiple NBT comparisons) is much lower than repeated reading of playerentity data.


## 2. WASD key, shift, ctrl, space key detection (no additional tools required)

use`entity_properties`predicate can be detected:

```json
// data/<namespace>/predicate/is_jumping.json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "type_specific": {
      "type": "minecraft:player",
      "input": { "jump": true }
    }
  }
}
```
Available fields:`forward`, `backward`, `left`, `right`（WASD）
`jump`（space）
`sneak`（shift）
`sprint`(ctrl)

Usage:

```mcfunction
execute as @a if predicate <namespace>:is_jumping run ...
execute as @a[predicate=<namespace>:is_jumping] run ...
```
Community data pack [WASD Detection](https://modrinth.com/datapack/wasd-detection) (Modrinth) provides encapsulated predicate:`wasd:w`, `wasd:a`, `wasd:s`, `wasd:d`, `wasd:space`, `wasd:shift`wait.


## 3. Right-click detection (`use`key)

### 1. Traditional solution: carrot fishing rod method
Applicable: 1.13+. Currently the most versatile click detection method with the lowest performance overhead.

```mcfunction
#initialization
scoreboard objectives add click_rmb used:carrot_on_a_stick
#circular logic
execute as @a[score={click_rmb=1..}] run function <namespace>:on_right_click
scoreboard players set @a click_rmb 0
```
*Note*: Can also be used`used:warped_fungus_on_a_stick`(Weird fungus fishing rod) avoids logical conflicts with the carrot fishing rod item.

### 2. Interaction entity solution: Interaction Entity
Applicable: 1.19.4+. Intercept and handle click events by placing an invisible entity in front of the player. **Needs to be used in conjunction with the tick scheduling and cleaning system in left-click detection** (see below).
*Advantages*: Can distinguish between left and right keys, supports click coordinate positioning.

### 3. Component solution: Consumable (1.21.5+ recommended)
take advantage of`consumable`Component features support full state detection of click, long press, and release. See details`right-click detection example`three subfolders in .

#### A. Click detection (Click)
settings`consume_seconds: 0`causing it to be "eaten" instantly and pass`use_remainder`Return yourself.

```mcfunction
give @s firework_star[consumable={consume_seconds:0,animation:"none",sound:{sound_id:"none"},has_consume_particles:false},use_remainder={id:firework_star,components:{...}}]
```
*Logic*: Cooperation`used:firework_star`scoring item or`consume_item`advancement triggers.

#### B. Long press detection (Hold)
settings`consume_seconds`is the desired duration (e.g. 2 seconds), with`using_item`and`consume_item`Double advancement detection.

```mcfunction
#Give item (press and hold for 2 seconds to trigger)
give @s firework_star[consumable={animation:"none",has_consume_particles:false,consume_seconds:2,sound:{sound_id:"none"}},custom_data={sample:1b},use_remainder={id:firework_star,components:{custom_data:{sample_remainder:1b}}}]
```
- **Long press**:`using_item` advancement → `consumable_hold:using`, executed every tick (such as particle effects)
- **Long press to complete**:`consume_item` advancement → `consumable_hold:trigger`, after triggering`use_remainder`Return item
- **Return item**:`schedule`Detection after 1t`sample_remainder`and replace it with the original item

#### C. Release detection (Release)
settings`consume_seconds`is a maximum value (such as 9999),`using_item`Advancement sets the scoreboard mark, and the tick function detects when the mark is released from 1→0.

```mcfunction
#Give item (press and release to trigger)
give @s firework_star[consumable={animation:"none",has_consume_particles:false,consume_seconds:9999,sound:{sound_id:"none"}},custom_data={sample:1b},use_remainder={id:firework_star,components:{custom_data:{sample_remainder:1b}}}]
```
- **When pressed**:`using_item`advancement set scoreboard`consume_use = 1`- **When released**: tick function detection`consume_use`The change from 1→0 triggers the release logic

#### D. Full state detection (halved state machine method)

Integrate unified detection of clicks, long presses, and releases. Core idea: Use **halving method** state machine, executed every tick`&lt;namespace&gt;.state /= 2`Causes state to automatically decay when input is detected`&lt;namespace&gt;.state += 4`Inject pulse.

**Preparation** (`load.mcfunction`）：
```mcfunction
scoreboard objectives add <namespace>.state dummy
scoreboard objectives add <namespace> dummy
scoreboard players set 2 <namespace> 2
```
**advancement file**——`using_item`Triggered every tick when a press and hold is detected; the namespace ID is consistent with the rewards function:`data/&lt;namespace&gt;/advancement/right_click/using.json`
```json
{
  "criteria": {
    "a": { "trigger": "minecraft:using_item" }
  },
  "rewards": { "function": "<namespace>:right_click/using" }
}
```
**Award function** (same name as advancement):`data/&lt;namespace&gt;/function/right_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using
scoreboard players add @s <namespace>.state 4
```
**tick function** (registered to`#tick`）：
`data/&lt;namespace&gt;/function/right_click/tick.mcfunction`
```mcfunction
#State decay every tick
scoreboard players operation @s <namespace>.state /= 2 <namespace>

#Three-state detection
execute if score @s <namespace>.state matches 2 run function <namespace>:right_click/on_press
execute if score @s <namespace>.state matches 3 run function <namespace>:right_click/while_hold
execute if score @s <namespace>.state matches 1 run function <namespace>:right_click/on_release
```
**Response function** (example, implemented on demand):`data/&lt;namespace&gt;/function/right_click/on_press.mcfunction`
```mcfunction
say 刚按下右键
```


`data/&lt;namespace&gt;/function/right_click/while_hold.mcfunction`
```mcfunction
say 按住中...
```


`data/&lt;namespace&gt;/function/right_click/on_release.mcfunction`
```mcfunction
say 松开右键
```


| `&lt;namespace&gt;.state`| Meaning |
|---------------------|------|
| 0 | Idle |
| 2 | Just pressed (rising edge) |
| 3 | Press and hold center |
| 1 | Just released (falling edge) |

**State Transfer**:

```
0 → [+4] → 2(刚按下) → [/2] → 3(按住中) → [/2] → 3 → ... → [/2] → 1(刚松开) → [/2] → 0(空闲)
```
**Anti-shake variant (+6)**: When adding 6 instead of 4, an additional intermediate state 4~5 is generated as an anti-shake buffer. When the signal is briefly interrupted, the state will not immediately fall to the judgment threshold:`data/&lt;namespace&gt;/function/right_click/using_debounce.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using
scoreboard players add @s <namespace>.state 6
```
When switching, just change the function name of advancement reward to`right_click/using_debounce`. The status table at this time:

|`&lt;namespace&gt;.state`| Meaning |
|---------------------|------|
| 0 | Idle |
| 3 | Just pressed |
| 1 | Just released |
| Other states | Press and hold center |

**With consumable item**: use`consume_seconds:9999`item (see Section C), press and hold during`using_item`advancement triggers every tick → bonus function`right_click/using`implement`scoreboard players add @s &lt;namespace&gt;.state 4`→ The state machine automatically handles all state flows.

## 4. Left button detection (attack button)

### Solution 1: Interactive entity (1.19.4+, not preferred)

**Principle**: Continuously transmit interactive entities at the player's position → The player's left-click attack is blocked by the entity →`player_hurt_entity`advancement captures and triggers function → strip advancement to duplicate detection.
**Advantages**: version has strong compatibility, no need to hold the item, and supports right-click detection.
**Disadvantages**: The interactive entity will not be detected due to tp delay and loss, and continuous tp will consume performance and server bandwidth, so it is not the first choice.

#### Directory structure

```
data/<namespace>/
├── advancement/
│   └── left_click/
│       └── using.json
└── function/
    ├── click_detector/
    │   ├── choice_tick.mcfunction
    │   ├── summon.mcfunction
    │   └── tp_and_keep_single.mcfunction
    ├── left_click/
    │   ├── check_owner.mcfunction
    │   └── using.mcfunction
    ├── right_click/
    │   ├── check_owner.mcfunction
    │   └── using.mcfunction
    ├── player/
    │   └── tick.mcfunction
    ├── load.mcfunction
    └── tick.mcfunction
```


`data/&lt;namespace&gt;/function/load.mcfunction`
```mcfunction
scoreboard objectives add <namespace> dummy
scoreboard objectives add <namespace>.id dummy
scoreboard objectives add <namespace>.owner dummy

#Revoke the granted advancement to ensure it can be triggered again after restart
advancement revoke @a only <namespace>:left_click/using
advancement revoke @a only <namespace>:right_click/using
```


`&lt;namespace&gt;`Used as a global incrementing counter,`&lt;namespace&gt;.id`Stores the binding ID of the player/entity.`data/&lt;namespace&gt;/function/tick.mcfunction`
```mcfunction
execute as @a[gamemode=!creative,gamemode=!spectator] at @s run function <namespace>:player/tick
execute as @e[type=interaction,tag=click_detector,limit=1,sort=random] at @s run function <namespace>:click_detector/choice_tick
```


`data/&lt;namespace&gt;/function/player/tick.mcfunction`
```mcfunction
#If no ID is assigned
execute unless score @s <namespace>.id matches -2147483648.. store result score @s <namespace>.id run scoreboard players add id <namespace> 1

#Initialize match tag
scoreboard players set #has_entity <namespace> 0

#Match entities with temporary scores
scoreboard players operation #id <namespace> = @s <namespace>.id
execute as @e[type=interaction,tag=click_detector] if score @s <namespace>.owner = #id <namespace> run function <namespace>:click_detector/tp_and_keep_single

#Not matched → Summon new entity
execute if score #has_entity <namespace> matches 0 anchored eyes positioned ^ ^ ^ run function <namespace>:click_detector/summon
```


`data/&lt;namespace&gt;/function/click_detector/summon.mcfunction`
```mcfunction
summon interaction ~ ~ ~ {Tags:["click_detector","init"],width:1.8f,height:1.8f}
scoreboard players operation @e[type=interaction,tag=init,limit=1] <namespace>.owner = @s <namespace>.id
tag @e[tag=init,limit=1] remove init
```

`data/&lt;namespace&gt;/function/click_detector/choice_tick.mcfunction`
```mcfunction
#dxyz is 0 0 0 indicating size 1 1 1
execute positioned ~-0.5 ~-0.5 ~-0.5 unless entity @a[dx=0,dy=0,dz=0,limit=1] run kill @s
```

`data/&lt;namespace&gt;/function/click_detector/tp_and_keep_single.mcfunction`
```mcfunction
execute if score #has_entity <namespace>.id matches 1 run return run kill @s
scoreboard players set #has_entity <namespace>.id 1
execute anchored eyes run tp @s ^ ^ ^
```


`data/&lt;namespace&gt;/advancement/left_click/using.json`
```json
{
  "criteria": {
    "attack_interaction": {
      "trigger": "minecraft:player_hurt_entity"
    }
  },
  "rewards": {
    "function": "<namespace>:left_click/using"
  }
}
```

`data/&lt;namespace&gt;/function/left_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:left_click/using

tag @s add <namespace>.self
execute as @e[type=interaction,tag=click_detector] if function <namespace>:left_click/check_owner run data remove entity @s attack
tag @s remove <namespace>.self

title @s actionbar {"text":"触发左键！","color":"red"}
```

`data/&lt;namespace&gt;/function/left_click/check_owner.mcfunction`
```mcfunction
execute on attacker as @s[tag=<namespace>.self] run return 1
return 0
```


`data/&lt;namespace&gt;/advancement/right_click/using.json`
```json
{
  "criteria": {
    "interact": {
      "trigger": "minecraft:player_interacted_with_entity"
    }
  },
  "rewards": {
    "function": "<namespace>:right_click/using"
  }
}
```

`data/&lt;namespace&gt;/function/right_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using

tag @s add <namespace>.self
scoreboard players set #exist <namespace> 0
execute store result score #exist <namespace> as @e[type=interaction,tag=click_detector] if function <namespace>:right_click/check_owner run data remove entity @s interaction
tag @s remove <namespace>.self

execute if score #exist <namespace> matches 0 run return 0

say 右键触发
```

`data/&lt;namespace&gt;/function/right_click/check_owner.mcfunction`
```mcfunction
execute on target as @s[tag=<namespace>.self] run return 1
return 0
```
### Solution 2: piercing_weapon + post_piercing_attack (1.21.11+ recommended)

> are mutually exclusive with option 1. Only one of them can be selected during actual deployment.


**Directory structure**

```
data/<namespace>/
├── enchantment/
│   └── left_click/
│       └── using.json
└── function/
    └── left_click/
        └── using.mcfunction
```
**Mechanism Principle**

1. **Motion Transformation**: Handheld Belt`piercing_weapon`Click the left button on the item (including air swing) → the game determines it as "Piercing Attack"
2. **Event capture**: Custom spell`post_piercing_attack`Effect binding function, triggered by each piercing attack.
3. **Release Cooling**:`minimum_attack_charge=0.0f`Reduce the attack cooldown ratio to zero and support extremely fast connection points

#### Custom spell`data/&lt;namespace&gt;/enchantment/left_click/using.json`
```json
{
  "anvil_cost": 4,
  "description": {
    "translate": "enchantment.<namespace>.left_click_detect",
    "fallback": "左键检测"
  },
  "max_cost": {
    "base": 65,
    "per_level_above_first": 9
  },
  "max_level": 1,
  "min_cost": {
    "base": 15,
    "per_level_above_first": 9
  },
  "slots": [
    "mainhand"
  ],
  "supported_items": "minecraft:recovery_compass",
  "weight": 2,
  "effects": {
    "minecraft:post_piercing_attack": [
      {
        "effect": {
          "type": "minecraft:run_function",
          "function": "<namespace>:left_click/using"
        }
      }
    ]
  }
}
```


`supported_items`suggestion`recovery_compass`——Zero-interaction basic items. Also available`music_disc_4[!jukebox_playable]`(1.21.5+), but additionally needs to block record player playback.

#### Response function`data/&lt;namespace&gt;/function/left_click/using.mcfunction`
```mcfunction
#When left-clicking (including air swiping), the player will automatically run as the execution source.
#Use say instead of title when debugging, because say can retain historical records to facilitate troubleshooting continuous triggering problems.
say 检测到左键点击！
playsound minecraft:entity.experience_orb.pickup player @s ~ ~ ~ 1 1.5
```
#### Give detection item (SNBT format)

```mcfunction
give @s minecraft:recovery_compass[\
  minecraft:piercing_weapon={deals_knockback:false},\
  minecraft:minimum_attack_charge=0.0f,\
  minecraft:enchantments={"<namespace>:left_click/using":1},\
  minecraft:enchantment_glint_override=false,\
  minecraft:tooltip_display={hidden_components:["enchantments"]},\
  minecraft:rarity="common",\
  minecraft:item_model="stone",\
  minecraft:item_name={"translate":"item.<namespace>.detector","fallback":"左键检测器"}\
]
```
#### Component Description

| Component | Function |
|---|---|
|`piercing_weapon`| Activate the piercing click mechanism to legalize air swing; optional`deals_knockback:true`With knockback |
|`minimum_attack_charge=0.0f`| Lift the attack cooldown restriction and support extremely fast connection points |
|`enchantments={...}`| Enchantment trigger`post_piercing_attack` |
| `enchantment_glint_override=false`| Hidden Magic Purple Light |
|`tooltip_display`| Hide redundant information such as attack damage, enchantments, etc. |
|`rarity="common"`| Normal quality, avoid item name display color |
|`item_model`| Custom model, covering the vanilla compass appearance |
|`item_name`| Modify item base name (optional; yes`custom_name`The latter is displayed first) |
|`custom_name`| Only affects the name displayed in the backpack (optional; does not affect the entity name of the dropped object, the same as renaming the anvil) |

#### Notes

1. **version requirement**: **1.21.11 (25w41a)**+ (`post_piercing_attack` + `piercing_weapon`)
2. **Survival Mode Restrictions**: With`piercing_weapon`The item** cannot destroy the block** and is only applicable to staffs/interactive props.
3. **Main Hand Binding**: Must be held in **Main Hand** to take effect (`slots: ["mainhand"]`)
4. **Hunger value limit**: It may fail when the hunger is lower than 6 points in early snapshots (fixed in 26w1 Snapshot 1)