global_marker = "30b509e1-f596-4f16-9c20-723ed6531c50"
gloabl_text_display = "48a95344-ff42-4f3c-960c-50226b4017c8"

#> latch:follower/__new__
#   生成一个属于@s的新的屏幕实体，生成位置必须已加载
#   生成失败返回0，成功返回1
# @usage
#   data modify storage latch:io follower set value { \
#       type: "minecraft:item_display", \       # 可以填写为任意实体ID，默认为item_display
#       offset: [0f,0f,0f], \                   # 跟随者相对于玩家的偏移，默认为[0,0,0]，单位为方块
#       nbt: { \                                # 生成实体的NBT数据，可以包含UUID，其他数据根据需要填写
#           Tags: ["123"], \
#           UUID: [I;1,1,1,1], \
#           item: {id: "minecraft:carrot_on_a_stick", count: 1}, \
#       }, \
#   }
#   function latch:follower/__new__

function test:
    data modify storage latch:io follower set value { 
        type: "minecraft:item_display",
        offset: [0f,0f,-2f], 
        disabled: ["y"],
        nbt: { 
            Tags: ["123"], 
            UUID: [I;1,1,1,1], 
            item: {id: "minecraft:carrot_on_a_stick", count: 1}, 
        },
    }
    function latch:follower/__new__

function latch:follower/__clear__:
    return run data modify storage latch:io follower set value {}

function latch:follower/__new__/clear:
    function latch:follower/__clear__
    return 0

anchored eyes unless loaded ^ ^ ^ run return run function latch:follower/__new__/clear
as @s[type=!player] run return run function latch:follower/__new__/clear

# 存储生成时的参数，方便把实体重新变成数据
data remove storage latch:io temp.follower
data modify storage latch:io temp.follower.nbt.data.follower set from storage latch:io follower

# 生成默认参数并覆盖
data modify storage latch:io temp.follower merge value {
    type:"minecraft:item_display",
    nbt:{
        view_range: 0.5f,
        transformation:{translation:[0f,0f,0f],left_rotation:[0f,0f,0f,1f],scale:[1f,1f,1f],right_rotation:[0f,0f,0f,1f]}
    }
}
data modify storage latch:io temp.follower merge from storage latch:io follower

# teleport_duration参数必须为1
data modify storage latch:io temp.follower.nbt.teleport_duration set value 1

# billboard参数必须为center
data modify storage latch:io temp.follower.nbt.billboard set value "center"

# 初始化Tags
store success score #is_list latch run data modify storage latch:io temp.follower.nbt.Tags append value "latch.init"
if score #is_list latch matches 0 run data modify storage latch:io temp.follower.nbt.Tags set value ["latch.init"]

# 存储相对位置
data modify storage latch:io temp.follower.nbt.transformation.translation set from storage latch:io follower.offset
#tellraw @a {"storage":"latch:io","nbt":"temp.follower.nbt.transformation"}

# 存储主人名字
tag @s add latch.this
data modify entity gloabl_text_display text set value {selector:"@a[tag=latch.this,limit=1]"}
tag @s remove latch.this

data modify storage latch:io temp.follower.nbt.data.owner set from entity gloabl_text_display text.insertion
#tellraw @a {"storage":"latch:io","nbt":"temp.follower.nbt"}

# 生成跟随者实体
scoreboard players set #summon_success latch 0

store success score #summon_success latch \
at @s anchored eyes positioned ^ ^ ^ run \
function latch:follower/__new__/wrapper_with_uuid with storage latch:io temp.follower:

    $summon $(type) ~ ~ ~ $(nbt)

    as @e[tag=latch.init,dx=-1,dy=-1,dz=-1,limit=1]:
        tag @s remove latch.init
        tag @s add latch.follower
        data modify entity @s data.prev_display_pos set from entity @s Pos
        rotate @s 0. 0.
    return run function latch:follower/__new__/clear

function latch:follower/__new__/clear
return run scoreboard players get #summon_success latch