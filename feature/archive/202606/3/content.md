---
title: '如何检测玩家按下了什么键'
---

<FeatureHead
    title='如何检测玩家按下了什么键'
    authorName='伊桑桑桑桑桑'
/>

## 一、F 键检测（交换副手物品键）

### F 键的特殊性

F 键（默认绑定 `Swap Item with Offhand`）**不在**原版谓词 `input` 系统中。以下字段是谓词支持的全部：
```
forward, backward, left, right, jump, sneak, sprint
```
F 键不在其中。来源：`InputPredicate` (yarn 1.21.11+build.4)。

### 物品交换标记法
适用版本：1.20.5+
原理：F 键触发主手/副手物品交换 → 通过 `inventory_changed` 进度检测物品位置变化。
核心思路（来自 Inventory Rotate 数据包，Modrinth）：

1. 给副手物品打 tag（通过 `item_modifier` 写入 `custom_data`）
2. 给副手物品打不同的 tag
3. 当 F 键按下→物品交换→两件物品的 tag 互换位置
4. 检测 tag 位置变化即可判定 F 键被按下

预先准备：在load中预先加载世界实体，并 revoke player 的 advancement（防止重启后玩家已拥有该 advancement 导致下次无法触发）
```mcfunction
advancement revoke @a only <namespace>:fkey_detect
```

第一步：tick 中给主/副手物品打标记
tick:
```mcfunction
execute as @a at @s run function <namespace>:player/tick
```

`<namespace>/function/player/tick.mcfunction`
```mcfunction
# 用 item modifier 写入 custom_data 标记
item modify entity @s weapon.mainhand <namespace>:tag_mainhand
item modify entity @s weapon.offhand <namespace>:tag_offhand
```

`<namespace>/item_modifier/fkey/tag_mainhand.json`
```json
{
    "function": "minecraft:set_custom_data",
    "tag": "{<namespace>:{offhand:0b}}",
    "conditions": []
}
```
`<namespace>/item_modifier/fkey/tag_offhand.json`
```json
{
    "function": "minecraft:set_custom_data",
    "tag": "{<namespace>:{offhand:1b}}",
    "conditions": []
}
```

第二步：advancement自动监听，任何物品栏更改都会触发这个进度
`<namespace>/advancement/fkey_detect.json`
```json
{
  "criteria": {
    "a": { "trigger": "minecraft:inventory_changed" }
  },
  "rewards": { "function": "<namespace>:fkey/check" }
}
```

第三步实现一：如果主副手标记错位，则触发；之后清除鼠标指针上的custom_data标记
> 推荐，大部分时候都有效，存在创造玩家物品副手持后无法堆叠回去的问题（数据不同了无法和原先同类物品堆叠）
`<namespace>/function/fkey/check.mcfunction`
```mcfunction
function <namespace>:fkey/check/is_swap

execute if items entity @s player.cursor *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/cursor

# 不能在一开始移除，防止逻辑内触发check
advancement revoke @s only <namespace>:fkey_detect
```
`<namespace>/function/fkey/check/is_swap.mcfunction`
```mcfunction
execute if items entity @s weapon.mainhand *[custom_data~{<namespace>:{offhand:1b}}] run return run function <namespace>:fkey/on_press
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}] run function <namespace>:fkey/on_press
```
`<namespace>/function/fkey/check/enum/cursor.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s player.cursor
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s player.cursor from entity a-b-c-d-2 contents
```

第三步实现二：如果主副手标记错位，则触发；之后清除背包内所有custom_data标记
> 比实现一更安全，也存在创造玩家物品副手持后无法堆叠回去的问题（数据不同了无法和原先同类物品堆叠），但是点2下就能让物品堆叠起来
> 但是性能消耗会略高一些
`<namespace>/function/fkey/check.mcfunction`
```mcfunction
function <namespace>:fkey/check/is_swap

# 把背包物品栏里的所有东西都查一遍，移除主副手数据标志（很遗憾，穷举的性能是最好的）
# 函数名里加点是合法的，可放心加
## 物品栏（inventory.0~26）
execute if items entity @s inventory.0 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/inventory.0
##...省略中间
execute if items entity @s inventory.26 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/inventory.26
## 快捷栏（hotbar.0~8）
execute if items entity @s hotbar.0 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/hotbar.0
##...省略中间
execute if items entity @s hotbar.8 *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/hotbar.8
## 盔甲（armor.head，armor.chest，armor.legs，armor.feet）
execute if items entity @s armor.head *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/armor.head
##...省略之后
## 副手
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/weapon.offhand
## 鼠标
execute if items entity @s player.cursor *[custom_data~{<namespace>:{offhand:0b}}|custom_data~{<namespace>:{offhand:1b}}] run function <namespace>:fkey/check/enum/cursor

# 最后移除进度，防止逻辑内触发check
advancement revoke @s only <namespace>:fkey_detect
```

`<namespace>/function/fkey/check/is_swap.mcfunction`
```mcfunction
execute if items entity @s weapon.mainhand *[custom_data~{<namespace>:{offhand:1b}}] run return run function <namespace>:fkey/on_press
execute if items entity @s weapon.offhand *[custom_data~{<namespace>:{offhand:0b}}] run function <namespace>:fkey/on_press
```
`<namespace>/function/fkey/check/enum/inventory.0.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s inventory.0
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s inventory.0 from entity a-b-c-d-2 contents
```
...
`<namespace>/function/fkey/check/enum/inventory.26.mcfunction`
```mcfunction
item replace entity a-b-c-d-2 contents from entity @s inventory.26
data remove entity a-b-c-d-2 item.components."minecraft:custom_data".<namespace>.offhand
item replace entity @s inventory.26 from entity a-b-c-d-2 contents
```
...（其他函数格式类似，可以写python或者其他脚本来批量创建）



### 前后帧存储法（Storage 比较版，未验证，可能不能使用）

原理：利用 `inventory_changed` 进度触发。在 Storage 中存储上一刻的主副手 NBT，当物品栏变动时，对比"现在的副手 vs 过去的主手"以及"现在的主手 vs 过去的副手"。如果两者完全一致，则判定为 F 键交换。

缺点：主副手物品完全相同时（NBT 完全一致），交换前后状态不可区分，无法检测 F 键。如需覆盖此场景，请回退到"物品交换标记法"。

#### 1. 初始化 (Load)

在数据包加载时，准备计分项和持久化实体。

`<namespace>/function/load.mcfunction`
```mcfunction
scoreboard objectives add <namespace> dummy
scoreboard objectives add <namespace>.id dummy

execute in overworld run forceload add -1 -1 1 1
execute in overworld run function <namespace>:load/item_display
```

`<namespace>/function/load/item_display.mcfunction`
```mcfunction
execute if entity a-b-c-d-2 run return 0
execute in overworld run return run summon item_display 0 0 0 {Tags:["<namespace>.persistent"],UUID:uuid("a-b-c-d-2"),view_range:0}
```

#### 2. 触发器 (Advancement)

`data/<namespace>/advancement/fkey_detect.json`
```json
{
  "criteria": { "a": { "trigger": "minecraft:inventory_changed" } },
  "rewards": { "function": "<namespace>:fkey/check" }
}
```

#### 3. 核心检测逻辑

`<namespace>:fkey/check.mcfunction`
```mcfunction
# 1. 空手特判（1.20.5+ items 子命令）
execute unless items entity @s weapon.mainhand * unless items entity @s weapon.offhand * run return run advancement revoke @s only <namespace>:fkey_detect

# 2. 准备 ID
execute unless score @s <namespace>.id matches -2147483648.. store result score @s <namespace>.id run scoreboard players add id <namespace> 1
execute store result storage <namespace>:io id int 1 run scoreboard players get @s id

# 3. "打开"数据：将玩家数据从数组读入临时空间
function <namespace>:fkey/open with storage <namespace>:io

# 4. 执行比较逻辑
function <namespace>:fkey/compare

# 5. "保存"数据：将修改后的临时空间写回数组
function <namespace>:fkey/close with storage <namespace>:io

# 6. 撤销进度（放在最后，防止内部item重新触发check函数）
advancement revoke @s only <namespace>:fkey_detect
```

#### 4. 核心存取与性能优化
读取玩家 NBT 消耗极高（约 160 单位），而操作 Storage 极快（约 5~8 单位）。因此我们先将当前物品存入 `io temp` 再进行后续操作。

**数据读取 (宏)：**
`<namespace>:fkey/open.mcfunction`
```mcfunction
$data modify storage <namespace>:io player set from storage <namespace>:data player[{id:$(id)}]
```

**逻辑比较 (普通函数)：**
`<namespace>:fkey/compare.mcfunction`
```mcfunction
# 性能优化：先将玩家当前物品读入 io temp 缓存
data modify storage <namespace>:io temp set value {now_main:{},now_off:{}}
data modify storage <namespace>:io temp.now_main set from entity @s SelectedItem
data modify storage <namespace>:io temp.now_off set from entity @s equipment.offhand

# 比较逻辑：尝试用"现在的副手"去覆盖"过去的主手"
# 注意：对比的是 io 中的两个节点，不涉及玩家 NBT 读取，速度极快
execute store success score #main_match <namespace> run data modify storage <namespace>:io player.prev_main set from storage <namespace>:io temp.now_off
# 尝试用"现在的主手"去覆盖"过去存储的副手"
execute store success score #off_match <namespace> run data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.now_main
# 查看一下是否相同
execute store success score #diff_match <namespace> run data modify storage <namespace>:io player.prev_off set from storage <namespace>:io player.prev_main

# 如果 store success 返回 0，说明主副手完全对调，判定为按下 F 键
# 并且主副手物品必须不同
execute if score #main_match <namespace> matches 0 if score #off_match <namespace> matches 0 if score #diff_match <namespace> matches 1 run function <namespace>:fkey/on_press

# 无论是否交换，都要更新 player 数据为当前状态，供下一帧比较
data modify storage <namespace>:io player.prev_main set from storage <namespace>:io temp.now_main
data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.now_off
```

**按下 F 键后的处理 (示范交换逻辑)：**
`<namespace>:fkey/on_press.mcfunction`
```mcfunction
# 如果需要拦截 F 键并还原（或者在程序中手动交换）：
# 1. 物理还原（利用寄存器实体）
item replace entity a-b-c-d-2 contents from entity @s weapon.mainhand
item replace entity @s weapon.mainhand from entity @s weapon.offhand
item replace entity @s weapon.offhand from entity a-b-c-d-2 contents

# 2. Storage 还原 (交换 prev_main 和 prev_off)
data modify storage <namespace>:io temp.swap set from storage <namespace>:io player.prev_main
data modify storage <namespace>:io player.prev_main set from storage <namespace>:io player.prev_off
data modify storage <namespace>:io player.prev_off set from storage <namespace>:io temp.swap
```

**数据写回 (宏)：**
`<namespace>:fkey/close.mcfunction`
```mcfunction
$data modify storage <namespace>:data player[{id:$(id)}] set from storage <namespace>:io player
```

**性能参考**：
- 直接读取玩家主副手：~160 单位/次
- Storage 内部操作：~5-8 单位/次
- 通过 `io temp` 缓存后，后续复杂的逻辑判断（即使有多次 NBT 对比）总消耗也远低于重复读取玩家实体数据。


## 二、WASD键、shift、ctrl、space键检测（无需额外工具）

用 `entity_properties` 谓词即可检测：

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

可用字段：
`forward`, `backward`, `left`, `right`（WASD）
`jump`（space）
`sneak`（shift）
`sprint`（ctrl）

用法：
```mcfunction
execute as @a if predicate <namespace>:is_jumping run ...
execute as @a[predicate=<namespace>:is_jumping] run ...
```

社区数据包 [WASD Detection](https://modrinth.com/datapack/wasd-detection) (Modrinth) 提供了封装好的谓词：`wasd:w`, `wasd:a`, `wasd:s`, `wasd:d`, `wasd:space`, `wasd:shift` 等。


## 三、右键检测（`use` 键）

### 1. 传统方案：胡萝卜钓竿法
适用：1.13+。目前最通用、性能开销最低的点击检测方式。
```mcfunction
# 初始化
scoreboard objectives add click_rmb used:carrot_on_a_stick
# 循环逻辑
execute as @a[score={click_rmb=1..}] run function <namespace>:on_right_click
scoreboard players set @a click_rmb 0
```
*备注*：也可以用 `used:warped_fungus_on_a_stick`（诡异菌钓竿）避免与胡萝卜钓竿物品逻辑冲突。

### 2. 交互实体方案：Interaction Entity
适用：1.19.4+。通过在玩家面前放置隐形实体拦截并处理点击事件。**需配合左键检测中的 tick 调度与清理系统使用**（见下文）。
*优点*：可区分左键/右键，支持点击坐标定位。

### 3. 组件方案：Consumable (1.21.5+ 推荐)
利用 `consumable` 组件特性，支持点击、长按、松开的全状态检测。详见 `右键检测示例` 中的三个子文件夹。

#### A. 点击检测 (Click)
设置 `consume_seconds: 0` 使其瞬间被"吃掉"，并通过 `use_remainder` 返还自身。
```mcfunction
give @s firework_star[consumable={consume_seconds:0,animation:"none",sound:{sound_id:"none"},has_consume_particles:false},use_remainder={id:firework_star,components:{...}}]
```
*逻辑*：配合 `used:firework_star` 计分项或 `consume_item` 进度触发。

#### B. 长按检测 (Hold)
设置 `consume_seconds` 为期望时长（如 2秒），配合 `using_item` 和 `consume_item` 双进度检测。
```mcfunction
# 给予物品（长按2秒触发）
give @s firework_star[consumable={animation:"none",has_consume_particles:false,consume_seconds:2,sound:{sound_id:"none"}},custom_data={sample:1b},use_remainder={id:firework_star,components:{custom_data:{sample_remainder:1b}}}]
```
- **长按中**：`using_item` 进度 → `consumable_hold:using`，每 tick 执行（如粒子效果）
- **长按完成**：`consume_item` 进度 → `consumable_hold:trigger`，触发后 `use_remainder` 返还物品
- **返还物品**：`schedule` 1t 后检测 `sample_remainder` 并换回原物品

#### C. 松开检测 (Release)
设置 `consume_seconds` 为极大值（如 9999），`using_item` 进度设置计分板标记，tick 函数检测标记从 1→0 判定松开。
```mcfunction
# 给予物品（长按后松开触发）
give @s firework_star[consumable={animation:"none",has_consume_particles:false,consume_seconds:9999,sound:{sound_id:"none"}},custom_data={sample:1b},use_remainder={id:firework_star,components:{custom_data:{sample_remainder:1b}}}]
```
- **按下时**：`using_item` 进度设置计分板 `consume_use = 1`
- **松开时**：tick 函数检测 `consume_use` 从 1→0 的变化触发松开逻辑

#### D. 全状态检测（减半状态机法）

整合点击、长按、松开的统一检测。核心思路：使用**减半法**状态机，每 tick 执行 `<namespace>.state /= 2` 使状态自动衰减，检测到输入时 `<namespace>.state += 4` 注入脉冲。

**前置准备**（`load.mcfunction`）：
```mcfunction
scoreboard objectives add <namespace>.state dummy
scoreboard objectives add <namespace> dummy
scoreboard players set 2 <namespace> 2
```

**进度文件**——`using_item` 每 tick 检测到按住时触发；命名空间 ID 与 rewards 函数一致：

`data/<namespace>/advancement/right_click/using.json`
```json
{
  "criteria": {
    "a": { "trigger": "minecraft:using_item" }
  },
  "rewards": { "function": "<namespace>:right_click/using" }
}
```

**奖励函数**（与进度同名）：

`data/<namespace>/function/right_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using
scoreboard players add @s <namespace>.state 4
```

**tick 函数**（注册到 `#tick`）：
`data/<namespace>/function/right_click/tick.mcfunction`
```mcfunction
# 每 tick 状态衰减
scoreboard players operation @s <namespace>.state /= 2 <namespace>

# 三态检测
execute if score @s <namespace>.state matches 2 run function <namespace>:right_click/on_press
execute if score @s <namespace>.state matches 3 run function <namespace>:right_click/while_hold
execute if score @s <namespace>.state matches 1 run function <namespace>:right_click/on_release
```

**响应函数**（示例，按需实现）：
`data/<namespace>/function/right_click/on_press.mcfunction`
```mcfunction
say 刚按下右键
```

`data/<namespace>/function/right_click/while_hold.mcfunction`
```mcfunction
say 按住中...
```

`data/<namespace>/function/right_click/on_release.mcfunction`
```mcfunction
say 松开右键
```

| `<namespace>.state` | 含义 |
|---------------------|------|
| 0 | 空闲 |
| 2 | 刚按下（上升沿） |
| 3 | 按住中 |
| 1 | 刚松开（下降沿） |

**状态转移**：
```
0 → [+4] → 2(刚按下) → [/2] → 3(按住中) → [/2] → 3 → ... → [/2] → 1(刚松开) → [/2] → 0(空闲)
```

**防抖变体（+6）**：加 6 而非 4 时，产生额外中间状态 4~5 作为防抖缓冲区，信号短暂中断时 state 不会立即跌到判定阈值：

`data/<namespace>/function/right_click/using_debounce.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using
scoreboard players add @s <namespace>.state 6
```

切换时只需将进度 reward 的函数名改为 `right_click/using_debounce`。此时状态表：

| `<namespace>.state` | 含义 |
|---------------------|------|
| 0 | 空闲 |
| 3 | 刚按下 |
| 1 | 刚松开 |
| 其他状态 | 按住中 |

**配合 consumable 物品**：使用 `consume_seconds:9999` 的物品（见 C 节），按住期间 `using_item` 进度每 tick 触发 → 奖励函数 `right_click/using` 执行 `scoreboard players add @s <namespace>.state 4` → 状态机自动处理全状态流转。

## 四、左键检测（攻击键）

### 方案一：交互实体（1.19.4+，非首选）

**原理**：在玩家位置持续传送交互实体 → 玩家左键攻击被实体阻挡 → `player_hurt_entity` 进度捕获并触发函数 → 剥夺进度以重复检测。
**优点**：版本兼容性较强，且无需手持物品，同时支持右键检测。
**缺点**：交互实体会因为tp延迟跟丢，导致检测不上，并且持续tp很吃性能以及服务器带宽，因此非首选推荐。

#### 目录结构

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

`data/<namespace>/function/load.mcfunction`
```mcfunction
scoreboard objectives add <namespace> dummy
scoreboard objectives add <namespace>.id dummy
scoreboard objectives add <namespace>.owner dummy

# 撤销已授予的进度，确保重启后可重复触发
advancement revoke @a only <namespace>:left_click/using
advancement revoke @a only <namespace>:right_click/using
```

`<namespace>` 用作全局自增计数器，`<namespace>.id` 存储玩家/实体的绑定 ID。
`data/<namespace>/function/tick.mcfunction`
```mcfunction
execute as @a[gamemode=!creative,gamemode=!spectator] at @s run function <namespace>:player/tick
execute as @e[type=interaction,tag=click_detector,limit=1,sort=random] at @s run function <namespace>:click_detector/choice_tick
```

`data/<namespace>/function/player/tick.mcfunction`
```mcfunction
# 无 ID 则分配
execute unless score @s <namespace>.id matches -2147483648.. store result score @s <namespace>.id run scoreboard players add id <namespace> 1

# 初始化匹配标记
scoreboard players set #has_entity <namespace> 0

# 用临时分数匹配实体
scoreboard players operation #id <namespace> = @s <namespace>.id
execute as @e[type=interaction,tag=click_detector] if score @s <namespace>.owner = #id <namespace> run function <namespace>:click_detector/tp_and_keep_single

# 未匹配到 → 召唤新实体
execute if score #has_entity <namespace> matches 0 anchored eyes positioned ^ ^ ^ run function <namespace>:click_detector/summon
```

`data/<namespace>/function/click_detector/summon.mcfunction`
```mcfunction
summon interaction ~ ~ ~ {Tags:["click_detector","init"],width:1.8f,height:1.8f}
scoreboard players operation @e[type=interaction,tag=init,limit=1] <namespace>.owner = @s <namespace>.id
tag @e[tag=init,limit=1] remove init
```
`data/<namespace>/function/click_detector/choice_tick.mcfunction`
```mcfunction
# dxyz是0 0 0表示尺寸1 1 1
execute positioned ~-0.5 ~-0.5 ~-0.5 unless entity @a[dx=0,dy=0,dz=0,limit=1] run kill @s
```
`data/<namespace>/function/click_detector/tp_and_keep_single.mcfunction`
```mcfunction
execute if score #has_entity <namespace>.id matches 1 run return run kill @s
scoreboard players set #has_entity <namespace>.id 1
execute anchored eyes run tp @s ^ ^ ^
```

`data/<namespace>/advancement/left_click/using.json`
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
`data/<namespace>/function/left_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:left_click/using

tag @s add <namespace>.self
execute as @e[type=interaction,tag=click_detector] if function <namespace>:left_click/check_owner run data remove entity @s attack
tag @s remove <namespace>.self

title @s actionbar {"text":"触发左键！","color":"red"}
```
`data/<namespace>/function/left_click/check_owner.mcfunction`
```mcfunction
execute on attacker as @s[tag=<namespace>.self] run return 1
return 0
```

`data/<namespace>/advancement/right_click/using.json`
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
`data/<namespace>/function/right_click/using.mcfunction`
```mcfunction
advancement revoke @s only <namespace>:right_click/using

tag @s add <namespace>.self
scoreboard players set #exist <namespace> 0
execute store result score #exist <namespace> as @e[type=interaction,tag=click_detector] if function <namespace>:right_click/check_owner run data remove entity @s interaction
tag @s remove <namespace>.self

execute if score #exist <namespace> matches 0 run return 0

say 右键触发
```
`data/<namespace>/function/right_click/check_owner.mcfunction`
```mcfunction
execute on target as @s[tag=<namespace>.self] run return 1
return 0
```

### 方案二：piercing_weapon + post_piercing_attack（1.21.11+ 推荐）

> 与方案一为互斥方案，实际部署时仅选其一。


**目录结构**

```
data/<namespace>/
├── enchantment/
│   └── left_click/
│       └── using.json
└── function/
    └── left_click/
        └── using.mcfunction
```

**机制原理**

1. **动作转化**：手持带 `piercing_weapon` 的物品点击左键（含空挥）→ 游戏判定为"穿刺攻击"
2. **事件捕获**：自定义魔咒 `post_piercing_attack` 效果绑定函数，每次穿刺攻击触发执行
3. **解除冷却**：`minimum_attack_charge=0.0f` 将攻击冷却比例降为零，支持极速连点

#### 自定义魔咒

`data/<namespace>/enchantment/left_click/using.json`
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

`supported_items` 建议 `recovery_compass`——零交互基础物品。也可用 `music_disc_4[!jukebox_playable]`（1.21.5+），但需额外屏蔽唱片机播放。

#### 响应函数

`data/<namespace>/function/left_click/using.mcfunction`
```mcfunction
# 左键点击（含空挥）时自动以该玩家为执行源运行
# 调试时用 say 而非 title，因为 say 可保留历史记录方便排查连续触发问题
say 检测到左键点击！
playsound minecraft:entity.experience_orb.pickup player @s ~ ~ ~ 1 1.5
```

#### 给予检测物品（SNBT 格式）

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

#### 组件说明

| 组件 | 作用 |
|---|---|
| `piercing_weapon` | 激活穿刺点击机制，使空挥合法化；可选 `deals_knockback:true` 带击退 |
| `minimum_attack_charge=0.0f` | 解除攻击冷却限制，支持极速连点 |
| `enchantments={...}` | 附魔触发 `post_piercing_attack` |
| `enchantment_glint_override=false` | 隐藏魔咒紫光 |
| `tooltip_display` | 隐藏攻击伤害、附魔等冗余信息 |
| `rarity="common"` | 普通品质，避免物品名显示颜色 |
| `item_model` | 自定义模型，覆盖原版罗盘外观 |
| `item_name` | 修改物品底名（可选；有 `custom_name` 时优先显示后者） |
| `custom_name` | 仅影响背包内显示名（可选；不影响掉落物实体名，同铁砧改名） |

#### 注意事项

1. **版本要求**：**1.21.11 (25w41a)**+（`post_piercing_attack` + `piercing_weapon`）
2. **生存模式限制**：带 `piercing_weapon` 的物品**无法破坏方块**，只适用做法杖/交互道具
3. **主手绑定**：必须拿在**主手**才能生效（`slots: ["mainhand"]`）
4. **饥饿值限制**：早期快照中饥饿低于 6 点时可能失效（26w1 Snapshot 1 已修复）
