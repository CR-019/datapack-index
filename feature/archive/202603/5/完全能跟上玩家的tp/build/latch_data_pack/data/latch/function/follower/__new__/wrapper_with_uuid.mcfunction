$summon $(type) ~ ~ ~ $(nbt)
execute as @e[tag=latch.init, dx=-1, dy=-1, dz=-1, limit=1] run function latch:follower/__new__/wrapper_with_uuid/nested_execute_0
return run function latch:follower/__new__/clear
