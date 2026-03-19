基于线性运动预测与客户端插值（`teleport_duration: 1`）的无延迟屏幕实体跟随模块。可以在一定程度上消除传统高频 tp 造成的拖尾。
数据包文件在`build/`中。

# 📦 API: 生成跟随实体

**函数**: `latch:follower/__new__`
**执行环境**: 必须作为玩家（`@s`）执行，且生成位置（玩家眼睛处）必须已加载。
**返回值**: 成功生成返回 `1`，失败返回 `0`。

# 参数传入

调用前需将参数写入 `storage latch:io follower`，执行完后storage会自动清空。

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

# ⚠️ 核心开发须知

1. **绝对不要用 `tp` 控制旋转与屏幕偏移**
   如果你需要让模型偏离屏幕中心或者应用旋转等变换，使用 `offset` 参数**或**在 `nbt` 参数中设置 `transformation`（两者选其一，效果不会叠加）。
2. **急停过冲现象 (Overshoot)**
   由于跟随依赖上一帧的速度进行预测，当玩家在高速移动中突然停止（如起跳，落地）时，实体会因预测惯性向前微冲 1 tick，随后迅速弹回，此为算法正常现象。
3. **依赖刻稳定性**
   跟随极度依赖稳定的 TPS。服务器卡顿或客户端严重掉帧时，会出现短瞬的视觉偏移。