merge function_tag tick {
    "values":[__name__]
}

as @e[tag=latch.follower] at @s run function latch:follower/__tick__

#for i in range(2000):
#    particle cloud ~ ~ ~