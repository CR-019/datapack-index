Based on linear motion prediction and client interpolation (`teleport_duration: 1`)'s delay-free screen entity following module. The tailing caused by traditional high-frequency TP can be eliminated to a certain extent.
The data pack file is in`build/`middle.

# 📦 API: Generate following entity

**function**:`latch:follower/__new__`**Execution Environment**: Must be used as player (`@s`) is executed, and the generation position (at the player's eye) must be loaded.
**Return Value**: Successfully generated return`1`, return on failure`0`.

# Parameters passed in

Parameters need to be written before calling`storage latch:io follower`, the storage will be automatically cleared after execution.

```mcfunction
#Example: Generate a carrot fishing rod display with a custom NBT
data modify storage latch:io follower set value {
    type: "minecraft:item_display",        #Optional: Default is item_display
    offset: [0f, 0f, -2f],                 #Optional: coordinate offset relative to the player screen, unit block
    nbt: {                                 #Optional: Generate the initial NBT of the entity, supporting specified UUID
        Tags: ["my_hud"],
        item: {id: "minecraft:carrot_on_a_stick", count: 1}
    }
}

#Execute build
execute as @s run function latch:follower/__new__
```
# ⚠️ Core development instructions

1. **Absolutely don’t use it`tp`Control rotation and screen offset**
   If you need to deviate the model from the center of the screen or apply transformations such as rotation, use`offset`Parameter ** or ** in`nbt`Set in parameters`transformation`(Choose one of the two, the effects will not overlap).
2. **Emergency stop overshoot phenomenon (Overshoot)**
   Since the following relies on the speed of the previous frame for prediction, when the player suddenly stops while moving at high speed (such as taking off, landing), the entity will slightly rush forward for 1 tick due to the predicted inertia, and then bounce back quickly. This is a normal phenomenon of the algorithm.
3. **Depends on moment stability**
   Follow TPS which relies heavily on stability. When the server freezes or the client drops frames severely, there will be a brief visual shift.