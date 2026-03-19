global_marker = "30b509e1-f596-4f16-9c20-723ed6531c50"
gloabl_text_display = "48a95344-ff42-4f3c-960c-50226b4017c8"

data modify storage latch:io temp.vars set value {
    prev_x:0,
    prev_y:0,
    prev_z:0,
    # target_x, target_y, target_z
}

# 存入目标位置
execute run function latch:follower/__tick__/run_at_owner_macro with entity @s data:
    $execute as $(owner) run function latch:follower/__tick__/run_at_owner

    function latch:follower/__tick__/run_at_owner:
        at @s anchored eyes positioned ^ ^ ^ run function latch:follower/__tick__/run_at_owner_eyes

    function latch:follower/__tick__/run_at_owner_eyes:
        execute summon marker:
            data modify storage latch:io temp.target_pos set from entity @s Pos
            kill @s
        data modify storage latch:io temp.vars.target_x set from storage latch:io temp.target_pos[0]
        data modify storage latch:io temp.vars.target_y set from storage latch:io temp.target_pos[1]
        data modify storage latch:io temp.vars.target_z set from storage latch:io temp.target_pos[2]

# 获取之前显示位置
data remove storage latch:io temp.prev_display_pos
data modify storage latch:io temp.prev_display_pos set from entity @s data.prev_display_pos
unless data storage latch:io temp.prev_display_pos run return:
    kill @s
    tellraw @a {"text":"prev_display_pos格式不正确"}

# 存入之前的显示位置的相反数（正数放入xyz，负数放入nxnynz）
data modify storage latch:io temp.vars.prev_x set from storage latch:io temp.prev_display_pos[0]
data modify storage latch:io temp.vars.prev_y set from storage latch:io temp.prev_display_pos[1]
data modify storage latch:io temp.vars.prev_z set from storage latch:io temp.prev_display_pos[2]


# 2*玩家眼睛位置 - 之前显示位置 = 现在Pos
positioned 0. 0. 0. rotated 180 0 anchored feet run \
function latch:follower/__tick__/tp \
with storage latch:io temp.vars:
    $execute \
        positioned ~$(target_x) ~$(target_y) ~$(target_z) \
        positioned ~$(target_x) ~$(target_y) ~$(target_z) \
        positioned ^$(prev_x) ^ ^$(prev_z) \
        rotated 0 90 positioned ^ ^ ^$(prev_y) \
        run function latch:follower/tp_here

# 之前显示位置 = 玩家眼睛位置
data modify entity @s data.prev_display_pos set from storage latch:io temp.target_pos