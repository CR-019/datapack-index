---
title: '核心着色器覆盖的“太阳跟随视线·全屏天空盒”技术实现'
---


<FeatureHead
title='基于 Minecraft 1.21.11 核心着色器覆盖的“太阳跟随视线·全屏天空盒”技术实现'
authorName='MC作死狼王'
/>

# 

**摘要**：本文记录一种仅使用 Minecraft 资源包（纯原版着色器覆盖、无 Mod、无 Mixin）实现“太阳固定在玩家视线上·月亮保持世界固定，并把太阳贴图扩展为全屏、六面无缝的天空盒”的完整技术路线。全文以**着色器侧**为核心，逐项推导顶点/片元两阶段的数学原理（投影逆推、插值恒等式、正交求逆、立方体贴图映射、线性滤波权重等）；原版 Java 渲染层仅保留必要事实。文章同时完整记录了一个固有缺陷：**时间定格（模式 2）基于 `Globals.GameTime`（游戏年龄钟）计算补偿，而日月帧由 `dayTime` 驱动，二者在 `/time set` 操作下会产生固定的相位偏差**——并给出验证方法、影响范围与规避方案。

---

## 1. 背景与目标

在 Minecraft 中，太阳/月亮渲染在天空背景之后，随玩家视角与世界时间变化。本项目目标：

1. **太阳始终固定在玩家视线方向**（屏幕中央），月亮保持原世界位置；
2. 太阳贴图放大为**全屏**，作为载体渲染一个**六面无缝、方向正确**的自定义天空盒；
3. 太阳提供三种模式：**0 原版一致 / 1 天空盒随时间滚动 / 2 天空盒世界锚定+时间定格**；
4. 任意分辨率、任意 FOV、任意贴图尺寸均自动适配，不修改任何 Java 代码。

---

## 2. 运行环境

| 项 | 值 |
|---|---|
| 游戏版本 | Minecraft 1.21.11（Fabric Loader 0.18.5，Fabric API 0.141.3+1.21.11） |
| 资源包格式 | `pack.mcmeta`（`min_format`/`max_format` 75） |
| 着色器 | 原版核心着色器覆盖：`*.vsh` / `*.fsh` |
| 纹 理 | `textures/environment/celestial/*`（celestials atlas 源） |
| 涉及管线 | `pipeline/celestial`（日/月/末地闪光）、`pipeline/sky`（天空背景） |

---

## 3. 原版日月渲染要点（必要事实）

> 仅列出着色器改造必须依赖的 CPU 侧事实（来源：对官方 jar 的 `javap -p -c` 分析）。

**(1) 管线与着色器**：`pipeline/celestial` 定义为复用 `core/position_tex` 顶点/片元着色器、`Sampler0`、`BlendFunction.OVERLAY`、深度写关闭。全 jar 中该着色器程序仅此一个使用者——覆盖 `core/position_tex.{vsh,fsh}` 只影响日/月/末地闪光。

**(2) 顶点数据与变换模型**：日（含末地）与月亮（8 相位）共用同一几何：

```
顶点：(−1,0,−1) (1,0,−1) (1,0,1) (−1,0,1)      // 单位四边形，X-Z 平面
UV  ：celestials atlas 中对应精灵的边界 (u0,v0,u1,v1)
```

绘制时对 ModelViewStack（JOML `Matrix4fStack`，后进先出的矩阵栈）执行：

| 操作 | 栈顶内容 | 说明 |
|---|---|---|
| pushMatrix | V（相机视图旋转，栈基座） | 压栈备份当前矩阵 |
| mul(SkyRot) | V × SkyRot | 天球旋转（含 −90°X 与时间旋转） |
| translate(0,100,0) | V × SkyRot × T | 太阳距离 100 |
| scale(S,1,S) | V × SkyRot × T × S | 太阳尺寸 S（见下表） |
| —— 上传 DynamicTransforms | **ModelViewMat = 栈顶** | 即着色器收到的 MVM |
| popMatrix | V | 弹栈还原，供月亮/末地/世界继续使用 |

即：**push = 从相机矩阵 V 出发开始叠加自己的变换；pop = 用完还原**——日、月、末地闪光三者共享同一栈基座 V，互不污染。

| 对象 | 缩放 S | 四边形 |
|---|---|---|
| 太阳 | 30 | 单位四边形 ×1 |
| 月亮（8 相位） | 20 | 单位四边形 ×8（索引偏移 = 相位×4） |
| 末地闪光 | 60 | 单位四边形 ×1 |

**(3) 混合模式**：`BlendFunction.OVERLAY = (SRC_ALPHA, ONE, ONE, ZERO)`，即

```
最终像素 = 贴图.rgb × α + 背景.rgb        // 加法混合（与后处理链无关，详见 §6）
```

**(4) 双时钟事实**（本方案缺陷的根源，详见 §9.1）：

- **dayTime**：`/time set` 修改的对象，`doDaylightCycle` 冻结的对象；**太阳角度 θ = f(dayTime)**；
- **gameTime（年龄钟）**：自世界创建持续累加的 tick 计数，`/time set` 不修改；
- `Globals.GameTime` uniform 的取值 = `((float)(gameTime % 24000L) + gez.a(false)) / 24000.0f` —— 一个 **0..1 的日进度值，但不随 `/time set` 变化**（字节码：`dwo`/`dwp.au()` → `LevelData.b()`）。

---

## 4. 总体设计：数据流与中间变量

```
渲染顺序: 天空背景(pipeline/sky) → 星星 → 日月(pipeline/celestial, 加法混合)
                                    ↓ 资源包覆盖
  sky.fsh           天空背景 → 纯黑（消除加法混合的“白天泛白”）
  position_tex.vsh  ①按 |MVM 列| 特判太阳 ②SUN_MODE≠0 时太阳四边形铺满视锥 ③输出中间量
  position_tex.fsh  月亮: 原样采样；太阳: 模式0 原版一致 / 模式1 随时间滚动 / 模式2 时间定格
```

**顶点着色器 → 片元着色器的中间变量（invariants）**：

| 变量 | 类型 | 含义 | 传递性质 |
|---|---|---|---|
| `texCoord0` | vec2 | 原始 atlas UV | 逐三角形透视校正插值（月亮分支直接使用） |
| `oPosition` | vec3 | 单位四边形坐标 | 屏幕归一化参数 t/s 的唯一来源 |
| `isSunV` | float | 1=太阳，0=月亮/末地 | 常量传递（同一次绘制内不变） |
| `sunRayView` | vec3 | 视空间未归一化视线方向 | 恒定深度平面上的**屏幕线性场** |
| `uPair` / `vPair` | vec2 | 精灵边界拆分 | 线性字段：`(u0(1−t), u1 t)` / `(v0(1−s), v1 s)` |

> 太阳三模式（`SUN_MODE`，统一在 `skybox_config.glsl` 中定义）：
> **0** = 原版一致；**1** = 天空盒随时间滚动（世界锚定 + 方位随游戏时间旋转）；
> **2** = 天空盒世界锚定+时间定格（转头见不同面；方位恒定于 `SKY_FIXED_TIME` 时刻，
> 借助 `Globals.GameTime` 计算补偿；对 `/time set` 的相位跳变存在固有缺陷，见 §9.1）。

---

## 5. 着色器实现详解

### 5.1 顶点着色器 `position_tex.vsh`

#### 5.1.1 绘制目标识别（列长度恒等）

```glsl
float celestialScale = length(ModelViewMat[0].xyz);
```

MVM 的 X 轴列 = `MVM · (1,0,0,0)ᵀ = V·SkyRot·(S,0,0,0)ᵀ`；旋转与平移保持长度，故 `|MVM[0]| = S`（30/20/60）。配合几何特征（单位四边形且 `Position.y≈0`）即可在着色器内完成对象分类，无需任何 CPU 状态。

#### 5.1.2 全屏四边形（投影矩阵逆推）

```
x_ndc = ProjMat[0][0] · x_view / (−z_view)
y_ndc = ProjMat[1][1] · y_view / (−z_view)
```

取与原版日月相同的视空间距离 `z_view = −D`（D=100）：

```glsl
float halfW = D / ProjMat[0][0];     // 半宽：NDC ±1 所需
float halfH = D / ProjMat[1][1];
viewPos = vec3(Position.x * halfW, Position.z * halfH, −D);
```

FOV、宽高比完全由 `ProjMat` 反映——改 FOV、超宽屏、改分辨率均自动精确适配。

#### 5.1.3 视线射线的精确插值（透视校正）

未归一化视线方向 `ray = (x_view, y_view, −D)` 在恒定深度平面上是屏幕坐标的**仿射函数**；三角形顶点属性插值对常量深度平面即为**屏幕线性**（透视校正因子 `w = D` 恒定）。故：

```glsl
sunRayView = vec3(Position.x * halfW, Position.z * halfH, -D);
```

片元端 `normalize(sunRayView)` 即得穿越该像素**精确**的视线方向——无需 `ScreenSize`、无需 `gl_FragCoord`，不存在角度分量非线性插值误差。

#### 5.1.4 精灵边界拆分（插值恒等式）

四角 UV 与坐标的对应关系（`(−1,·,−1)→(u0,v0)` 等），按角点拆分输出：

```glsl
uPair = (Position.x < 0.0) ? vec2(UV0.x, 0.0) : vec2(0.0, UV0.x);
vPair = (Position.z < 0.0) ? vec2(UV0.y, 0.0) : vec2(0.0, UV0.y);
```

插值后（仍为屏幕线性）：`uPair.x = u0(1−t)`、`uPair.y = u1·t`（v 同理）——两个恒等式只与屏幕参数 t/s 有关，任意像素成立，从而精确反解边界；**贴图尺寸/内容可任意更换**。

### 5.2 片元着色器 `position_tex.fsh`

#### 5.2.1 边界反解（t/s 重建与数值稳定性）

```glsl
float t = clamp(0.5 * (oPosition.x + 1.0), 0.0, 1.0);   // oPosition.x 插值 = 2t−1
float s = clamp(0.5 * (oPosition.z + 1.0), 0.0, 1.0);
float u0 = uPair.x / max(1.0 - t, 1e-4);   // 0/0 可去型：分子同阶趋于 0
…
```

除法在 t→0/1 边界为可去奇点，`max(·, 1e-4)` 仅作除零保护，误差为浮点舍入级。

#### 5.2.2 模式 0：与原版一致

顶点着色器恢复原版变换（`MVM·Position`），片元恢复原版采样：

```glsl
fragColor = color * ColorModulator;   // 且 alpha==0 → discard（与原版 position_tex.fsh 一致）
```

#### 5.2.3 模式 1/2：天空盒（核心）

**a) 视线方向**：见 5.1.3，`normalize(sunRayView)`。

**b) 天球坐标系变换（正交求逆）**：

```glsl
mat3 m = mat3(ModelViewMat);
vec3 c0 = normalize(m[0]); vec3 c1 = normalize(m[1]); vec3 c2 = normalize(m[2]);
vec3 dir = normalize(transpose(mat3(c0, c1, c2)) * dirView);
```

- `mat3(MVM)` 取旋转+缩放部分；列归一化消除非均匀缩放（S 与 Y 轴 1 的差异必须去除，否则方向被斜切）；
- 旋转矩阵正交 ⇒ `R⁻¹ = Rᵀ`——一行矩阵乘完成“视空间 → 天球系”；
- 得到的 `dir` 与日月共享同一天空坐标系，语义一致。

**c) 倾角校正（天球系滚转）**：

```glsl
dir = rot_x(radians(SKY_ROLL_FIX_DEG)) * dir;
```

天球系内嵌 `−90°X`，会令“顶”不在世界天顶；`SKY_ROLL_FIX_DEG`（0/±90/180）校正之。

**c2) 时间定格（仅模式 2）**：

```glsl
float dayFrac = GameTime;                                // Globals.GameTime：0..1 日进度
float fixFrac = fract(SKY_FIXED_TIME / 24000.0);
float delta   = (fixFrac - dayFrac) * 6.28318530718 * SKY_TIME_RATE;
dir = rot_fix_axis(SKY_TIME_DIR * delta) * dir;
```

- 语义：盒体保持世界锚定（`MVM⁻¹` 保留世界方向语义），把当前时刻校正到 `SKY_FIXED_TIME` 的朝向；
- `GameTime` 已是 0..1 日进度（源：`(gameTime % 24000 + gez.a(false)) / 24000`），直接使用；
- 校正为绕 `SKY_FIX_AXIS`（0=X/1=Y/2=Z）指定轴的纯方位旋转；`SKY_TIME_DIR` 控制旋向，`SKY_TIME_RATE` 为速率倍率（正常 1.0）；
- **局限**：`GameTime` 来自“年龄钟”而日月帧由 `dayTime` 驱动——连续漂移可完全抵消，但 `/time set` 造成的相位跳变不在补偿范围（详见 §9.1 缺陷）。

**d) 立方体贴图映射（主导轴 + 面内 UV）**：

先按主导轴定面，再用其余两轴作面内 UV。公式采用公认 cubemap 约定（u 沿面“右”方向、v=0 为块顶=天空朝上）：

| 面 | 公式（ad = abs(dir) 的各分量） |
|---|---|
| +Y 顶 | u = 0.5+0.5·x/ad.y，v = 0.5+0.5·z/ad.y |
| −Y 底 | u = 0.5+0.5·x/ad.y，v = 0.5−0.5·z/ad.y |
| +Z 前 | u = 0.5+0.5·x/ad.z，v = 0.5−0.5·y/ad.z |
| −Z 后 | u = 0.5−0.5·x/ad.z，v = 0.5−0.5·y/ad.z |
| +X 右 | u = 0.5−0.5·z/ad.x，v = 0.5−0.5·y/ad.x |
| −X 左 | u = 0.5+0.5·z/ad.x，v = 0.5−0.5·y/ad.x |

**无缝性论证**：任意相邻棱上 (u,v) 数值与变化率连续。例：+Z 面右棱（x=z>0,u=1）与 +X 面左棱（z=x>0,u=0）对应同一组世界方向，且两面的 v 表达式同为 `0.5−0.5·y/·`，天空朝上约定一致 ⇒ 渐变跨棱严格衔接。十字展开采用标准环序 `[−X][+Z][+X][−Z]`（相邻面两两垂直、可无损折叠）；坏环序（如前后相邻）在数学上无法拼合。

**e) 方向校准（烘焙固定值）**：

```glsl
faceUV.y = 1.0 - faceUV.y;    // 六面统一
```

推导：先水平镜像 `(u,v)→(1−u,v)` 再旋转 180° `(1−u,v)→(u,1−v)`，两步复合 = 垂直翻转——与成品贴图方向一致。

**f) 采样、边界混合与 alpha 丢弃**：

```glsl
vec2 atlasUV = vec2(u0 + (u1-u0) * localUV.x, v0 + (v1-v0) * localUV.y);
vec4 sky = texture(Sampler0, atlasUV);
if (sky.a < ALPHA_DISCARD) discard;
fragColor = vec4(sky.xyz, 1.0);
```

- `localUV`(精灵内 0~1) 经边界仿射映射到 atlas 绝对坐标；
- atlas 为线性过滤：块边界处结果 = 相邻纹素加权平均（采样坐标小数部分为权）。邻块为透明空隙时边界 alpha 被稀释，叠加 alpha 丢弃产生 1px 细缝；
- 规避（采用）：**贴图内为每个面加 1px 不透明边框**（复制面边缘像素），配合 `CELL_MARGIN=0` 铺满整块采样——边界混合双方均为同色不透明像素，无细缝、无裁边。

### 5.3 三模式语义对照

| 模式 | 输入 | 输出语义 | 适用场景 |
|---|---|---|---|
| 0 原版一致 | 原版 MVM + 原版采样 | 太阳像原版一样固定在天空、随视角移动 | 对照/调试/兼容 |
| 1 天空盒·随时间 | `dir`（世界方向） | 六面随世界方向正确旋转，方位随游戏时间滚动 | 场景天空（自然） |
| 2 天空盒·世界锚定+定格 | `dir` + `GameTime` 补偿 | 转头见不同面；方位恒定于 `SKY_FIXED_TIME` 时刻 | 拍摄/作图（受 §9.1 缺陷约束） |

---

## 6. 混合与“雾感”问题

- **现象**：白天天空盒泛白发灰（似雾），夜晚为纯色；
- **根因**：`BlendFunction.OVERLAY` 为加法混合 `最终色 = 贴图×α + 背景`。白天背景为亮色雾天空（`FogColor`），整个背景被叠加进天空盒；夜晚背景近黑，加法 ≈ 原色（已实测贴图 alpha 全 255，排除透明度因素；原版 `position_tex` 与后处理链均无雾 shader）；
- **解决**：覆盖 `core/sky.fsh` 使天空背景输出纯黑 → 加法混合 = 颜色 + 0，全时段纯色，并兼得黑色幕布便于抠像（删除该文件即恢复原版天空）。

---

## 7. 参数总表（统一在 `shaders/include/skybox_config.glsl`，vsh/fsh 单源）

| 参数 | 当前值 | 说明 |
|---|---|---|
| `SUN_MODE` | 2 | 0=原版一致；1=天空盒随时间滚动；2=天空盒世界锚定+时间定格 |
| `SKY_FIXED_TIME` | 6000.0 | 模式 2 定格时刻（tick/天，0..24000；6000=正午，12000=日落，18000=午夜） |
| `SKY_TIME_DIR` | 1.0 | 模式 2 定格旋向（±1） |
| `SKY_FIX_AXIS` | 0 | 模式 2 时间旋转轴（0=X/1=Y/2=Z；实测锁定 X） |
| `SKY_TIME_RATE` | 1.0 | 模式 2 速率倍率（正常 1.0） |
| `SKY_DEBUG_AXES` | 0 | 1=方向轴可视化（R=X,G=Y,B=Z），诊断用 |
| `SKY_ROLL_FIX_DEG` | 180.0 | 模式 1/2 倾角校正（0/±90/180） |
| `CELL_MARGIN` | 0.0 | 块内采样边距（0=铺满整块） |
| `ALPHA_DISCARD` | 0.01 | 空隙 alpha 阈值 |
| `SUN_SCALE` | 30.0 | 太阳识别缩放（±1.5 容差） |
| `NEAR_PLANE` | 100.0 | 天空盒视空间距离 |

---

## 8. 文件清单

```
resourcepacks/SkyCubeShader/
├── pack.mcmeta
├── SKYBOX_技术论文.md
└── assets/minecraft/
    ├── shaders/
    │   ├── include/
    │   │   └── skybox_config.glsl     ← 共享配置（全部参数，单源）
    │   └── core/
    │       ├── position_tex.vsh      ← 日月顶点着色器（识别/全屏/中间量）
    │       ├── position_tex.fsh      ← 日月片元着色器（模式 0/1/2）
    │       ├── sky.vsh               ← 天空背景顶点着色器：固定旋转替代 MVM
    │       │                            （当前 sky.fsh=纯黑，无可见影响；
    │       │                              若恢复原版 sky.fsh，则天空背景固定于屏幕）
    │       └── sky.fsh               ← 天空背景改黑（消除加法混合泛白）
    ├── textures/environment/celestial/   ← 六面天空盒贴图（sun.png=六面十字）
    │   └── moon/*.png
    └── atlases/celestials.json   ← celestials atlas 定义
```

---

## 9. 已知限制与缺陷

### 9.1 缺陷：模式 2 的“时间定格”对 `/time set` 存在固定相位偏差（双时钟不一致）

- **机制**：Minecraft 内部存在两个长期时钟：
  - `dayTime`（日时刻）：`/time set` 修改、`doDaylightCycle` 冻结；**日月帧（太阳角 θ）由它驱动**；
  - `gameTime`（年龄钟）：自世界创建持续累加的 tick 总数，**`/time set` 不修改**；
  - `Globals.GameTime` uniform 来自年龄钟（`((gameTime % 24000) + 偏移) / 24000`）。
- **后果**：模式 2 的补偿 `delta = (SKY_FIXED_TIME − GameTime)` 只能抵消**连续的**时间漂移（高 tick 率下盒体稳定）；当使用 `/time set` **跳变**日时刻时，太阳帧产生离散跳变而补偿量不变——盒体整体留下一个**固定的角度偏移**（相位差），不会被自动修正。
- **验证方法**：`/time set 6000` 与 `/time set 18000` 分别观察盒体朝向——模式 2 下两者相差 180°（未被补偿的相位差）；而保持时刻不变、高 tick 率运行则盒体完全稳定（连续漂移已被抵消）。
- **影响范围**：仅模式 2 且使用 `/time set` 的场景；模式 0/1 与“冻结时间”方案不受影响。
- **规避方案**：
  1. **推荐**：模式 1 + 源头冻结时间——`/gamerule doDaylightCycle false` + `/time set <目标时刻>`。时间冻结后 `dayTime` 恒定 ⇒ 帧恒定 ⇒ 盒体绝对静止（世界锚定、无漂移、无相位问题；`/time set` 换值 = 换一个“定格时刻”，属预期行为）；
  2. 或保留模式 2：每次 `/time set` 后，把 `SKY_FIXED_TIME` 朝观察到的偏差反方向**校正一次**即可（相位差为常数，一次性标定）；
  3. 数学上无法在着色器内消除该缺陷：着色器只能读到年龄钟（无 dayTime uniform），而“从 MVM 反推 dayTime”受 3 自由度 vs （V 3 + θ 1）欠定约束，不可分解（见 §9.2）。

### 9.2 其他限制

1. **混合函数不可改**：OVERLAY（加法）由 CPU 端管线定义，资源包无法修改；纯色方案依赖纯黑背景（牺牲原版天空渐变）。若需真正 alpha 混合需 Fabric Mixin 重建管线（超出资源包范围）；
2. **世界帧不可分解**：`MVM_rot = V·R(θ)`，V（3 自由度）+ θ（1 自由度）= 4 未知对 3 方程，欠定 1 维；任意 θ′ 都可配一个 V′ 生成同一矩阵——因此“纯着色器提取世界帧/时间”不存在闭式解；
3. **FOV 范围**：由 ProjMat 精确适配常规投影；超广角/伪鱼眼不在设计内。

---

## 10. 调试与验证

1. 修改后按 **F3+T** 重载资源包（无需重启）；
2. 验证太阳跟随（模式0）：白天转头，太阳始终在屏幕中央；月亮保持世界位置；
3. 验证天空盒（模式1）：六面方向正确、相邻面无缝、白天夜晚均为纯色；
4. 验证时间定格（模式 2）：保持时刻不变、观察数分钟——盒体方位恒定；用 `/time set` 切换时刻——盒体整体旋转一个固定角度（§9.1 缺陷表现，属已知行为）。

**推荐工作流（作图/拍摄）**：

```
/gamerule doDaylightCycle false
/time set 6000
```

配 `SUN_MODE 1`——盒体世界锚定、六面无缝、绝对静止；改变 `/time set` 的值即可切换定格时刻。需要原版太阳时改 `SUN_MODE 0` 即可。

---

## 附录 A：颜色 ↔ 方向 ↔ 块位置 ↔ 公式 对照表

| 颜色（贴图块） | 方向 | 块位置 (origin, size) | 面内公式（abs() 表示取分量绝对值） |
|---|---|---|---|
| 绿 | +Y 顶 | (0.25, 0.50), (0.25,0.25) | u=x/abs(y)，v=z/abs(y) |
| 黄 | −Y 底 | (0.25, 0.00), (0.25,0.25) | u=x/abs(y)，v=−z/abs(y) |
| 红 | −X 左 | (0.00, 0.25), (0.25,0.25) | u=z/abs(x)，v=−y/abs(x) |
| 洋红 | +Z 前 | (0.25, 0.25), (0.25,0.25) | u=x/abs(z)，v=−y/abs(z) |
| 紫 | +X 右 | (0.50, 0.25), (0.25,0.25) | u=−z/abs(x)，v=−y/abs(x) |
| 青 | −Z 后 | (0.75, 0.25), (0.25,0.25) | u=−x/abs(z)，v=−y/abs(z) |

（六面采样后统一 `v → 1−v`，即烘焙的垂直翻转。）

## 附录 B：CPU 事实速查（字节码锚点，1.21.11 官方 jar）

| 内容 | 位置 |
|---|---|
| pipeline/celestial 定义（withVertexShader "core/position_tex"） | `hpa` 静态初始化 → `putstatic hpa.ap` |
| BlendFunction.OVERLAY = (SRC_ALPHA, ONE, ONE, ZERO) | `com/mojang/blaze3d/pipeline/BlendFunction` 静态初始化 |
| 四边形 (−1,0,−1)…(1,0,1) + 精灵边界 | `hpk#a(String, ilp)`、`hpk#c(ilo)`（8 相位） |
| translate(0,100,0)·scale(30/20,1,30/20) | `hpk#a(float,fzm)` / `hpk#a(dwy,float,fzm)` |
| 调用链：天空渲染 → 日月绘制 | `hoh#a(GpuBufferSlice, ikv, hpk)` → `hpk#a(fzm,FFF,dwy,FF)` |
| Globals 构建（含 GameTime = 年龄钟） | `hoc#a(IIDJLgez;ILger;Z)V`：`(float)(gameTime%24000)+gez.a(false)` 再 `/24000`；`gameTime` 源 = `hif.au()` → `dwp#au` 默认方法 → `LevelData.b()` |
