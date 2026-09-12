# SkyCubeShader

把太阳做成一个铺满全屏的天空盒：太阳会跟着你的视线方向走，月亮保持原样。不需要任何模组，放进资源包就能用。

## 怎么用

1. 把 `SkyCubeShader` 文件夹放进游戏的 `resourcepacks` 文件夹；
2. 游戏里「选项 → 资源包」把它打开；
3. 按 **F3 + T** 刷新，完成。

## 三种太阳模式

在 `assets/minecraft/shaders/include/skybox_config.glsl` 里改 `SUN_MODE` 这一个数字：

| 数字 | 效果 |
|---|---|
| 0 | 太阳和原版一模一样 |
| 1 | 天空盒，太阳方位随时钟慢慢转 |
| 2 | 天空盒，方位固定住不变 |

想固定哪个时刻：改 `SKY_FIXED_TIME`（6000=正午，12000=日落，18000=午夜）。

## 参数都在哪里改

**只改这一个文件：`assets/minecraft/shaders/include/skybox_config.glsl`**

| 参数 | 作用 |
|---|---|
| `SUN_MODE` | 上面说的 0 / 1 / 2 |
| `SKY_FIXED_TIME` | 模式 2 固定在哪一刻 |
| `SKY_TIME_DIR` | 模式 2 方向反了就改成 -1.0 |
| `SKY_FIX_AXIS` | 模式 2 的旋转轴（一般不用动） |
| `SKY_TIME_RATE` | 模式 2 还有残余漂移时才动（试 0.5 或 2.0） |
| `SKY_DEBUG_AXES` | 1 = 看颜色诊断用，平时 0 |
| `SKY_ROLL_FIX_DEG` | 天空盒上下反了就改成 0 或 -90 |

## 天空盒贴图怎么画

画一张 `assets/minecraft/textures/environment/celestial/sun.png`，按下面这个十字摆六块颜色（贴图大小不超过8192x，每块占 1/4）：

```text
      [ 顶 ]
[ 左 ][ 前 ][ 右 ][ 后 ]
      [ 底 ]
```

画的时候注意：

- 六块之外的**空隙画成透明**（不要画白色）；
- 每块四周如果挨着透明空隙，往外多复制 1 像素同样颜色（防止出现细线）；

## 固定天空盒推荐这样用

```
/gamerule doDaylightCycle false
/time set 6000
```

时间停住后，模式 1 的天空盒就是完全静止的，最稳定。
