data modify storage latch:io temp.vars set value {prev_x: 0, prev_y: 0, prev_z: 0}
function latch:follower/__tick__/run_at_owner_macro with entity @s data
data remove storage latch:io temp.prev_display_pos
data modify storage latch:io temp.prev_display_pos set from entity @s data.prev_display_pos
execute unless data storage latch:io temp.prev_display_pos run return run function latch:follower/__tick__/nested_return_0
data modify storage latch:io temp.vars.prev_x set from storage latch:io temp.prev_display_pos[0]
data modify storage latch:io temp.vars.prev_y set from storage latch:io temp.prev_display_pos[1]
data modify storage latch:io temp.vars.prev_z set from storage latch:io temp.prev_display_pos[2]
execute positioned 0.0 0.0 0.0 rotated 180 0 anchored feet run function latch:follower/__tick__/tp with storage latch:io temp.vars
data modify entity @s data.prev_display_pos set from storage latch:io temp.target_pos
