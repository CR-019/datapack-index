::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

Based on linear motion prediction and client interpolation (`teleport_duration: 1`)'s delay-free screen entity following module. The tailing caused by traditional high-frequency TP can be eliminated to a certain extent.
The data pack file is in`build/`middle.

# 📦 API: Generate following entity

**function**: `latch:follower/__new__`
**Execution Environment**: Must be used as player (`@s`) is executed, and the generation position (at the player's eye) must be loaded.
**Return Value**: Successfully generated return`1`, return on failure`0`。

# Parameters passed in

Parameters need to be written before calling`storage latch:io follower`, the storage will be automatically cleared after execution.

```mcfunction
# 示例：生成一个带有自定义 NBT 的胡萝卜钓竿 Display
data modify storage latch:io follower set value {
    type: "minecraft:item_display",        # 可选：默认为 item_display
    offset: [0f, 0f, -2f],                 # 可选：相对于玩家屏幕的坐标偏移，单位方块
    nbt: {                                 # 可选：生成实体的初始 NBT，支持指定UUID
        Tags: ["my_hud"],
        item: {id: "minecraft:carrot_on_a_stick", count: 1}
    }
}

# 执行生成
execute as @s run function latch:follower/__new__
```


# ⚠️ Core development instructions

1. **Absolutely don’t use it`tp`Control rotation and screen offset**
If you need to deviate the model from the center of the screen or apply transformations such as rotation, use`offset`Parameter ** or ** in`nbt`Set in parameters`transformation`(Choose one of the two, the effects will not overlap).
2. **Emergency stop overshoot phenomenon (Overshoot)**
Since the following depends on the speed of the previous frame for prediction, when the player suddenly stops while moving at high speed (such as taking off, landing), the entity will slightly rush forward for 1 tick due to the predicted inertia, and then rebound quickly. This is a normal phenomenon of the algorithm.
3. **Depends on instant stability**
Follow TPS which relies heavily on stability. When the server freezes or the client drops frames severely, there will be a brief visual shift.
