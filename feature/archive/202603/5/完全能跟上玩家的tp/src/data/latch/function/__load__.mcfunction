merge function_tag load {
    "values":[__name__]
}

in overworld:
    forceload add -1 -1 1 1
    kill 30b509e1-f596-4f16-9c20-723ed6531c50
    summon marker 0. 0. 0. {Tags:["latch.global"],UUID:[I;817170913,-174698730,-1675595202,-699196336]}

    kill 48a95344-ff42-4f3c-960c-50226b4017c8
    summon text_display 0. 0. 0. {Tags:["latch.global"],UUID:[I;1219056452,-12431556,-1777577950,1799362504]}

scoreboard objectives add latch dummy

scoreboard objectives add latch.vx_level dummy
scoreboard objectives add latch.vy_level dummy
scoreboard objectives add latch.vz_level dummy

say loaded