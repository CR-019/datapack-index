execute anchored eyes unless loaded ^ ^ ^ run return run function latch:follower/__new__/clear
execute as @s[type=!player] run return run function latch:follower/__new__/clear
data remove storage latch:io temp.follower
data modify storage latch:io temp.follower.nbt.data.follower set from storage latch:io follower
data modify storage latch:io temp.follower merge value {type: "minecraft:item_display", nbt: {view_range: 0.5f, transformation: {translation: [0.0f, 0.0f, 0.0f], left_rotation: [0.0f, 0.0f, 0.0f, 1.0f], scale: [1.0f, 1.0f, 1.0f], right_rotation: [0.0f, 0.0f, 0.0f, 1.0f]}}}
data modify storage latch:io temp.follower merge from storage latch:io follower
data modify storage latch:io temp.follower.nbt.teleport_duration set value 1
data modify storage latch:io temp.follower.nbt.billboard set value "center"
execute store success score #is_list latch run data modify storage latch:io temp.follower.nbt.Tags append value "latch.init"
execute if score #is_list latch matches 0 run data modify storage latch:io temp.follower.nbt.Tags set value ["latch.init"]
data modify storage latch:io temp.follower.nbt.transformation.translation set from storage latch:io follower.offset
tag @s add latch.this
data modify entity 48a95344-ff42-4f3c-960c-50226b4017c8 text set value {selector: "@a[tag=latch.this,limit=1]"}
tag @s remove latch.this
data modify storage latch:io temp.follower.nbt.data.owner set from entity 48a95344-ff42-4f3c-960c-50226b4017c8 text.insertion
scoreboard players set #summon_success latch 0
execute store success score #summon_success latch at @s anchored eyes positioned ^ ^ ^ run function latch:follower/__new__/wrapper_with_uuid with storage latch:io temp.follower
function latch:follower/__new__/clear
return run scoreboard players get #summon_success latch
