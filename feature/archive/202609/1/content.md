---
title: '基于 1.21.11 核心着色器的天空盒技术实现'
---
<script setup>
import float from '/.vitepress/vue/nbt/float.vue'
import homolist from '/.vitepress/vue/nbt/homolist.vue'
</script>

<FeaturedHead
title='基于 1.21.11 核心着色器的天空盒技术实现'
authorName='MC作死狼王'
/>

**摘要**：本文记录一种仅使用原版资源包，利用太阳和月亮纹理，把太阳贴图扩展为全屏、六面无缝的天空盒的完整技术路线。全文以着色器为核心，逐项推导顶点/片元两阶段的数学原理，包括投影逆推、插值恒等式、正交求逆、立方体贴图映射、线性滤波权重等。同时探讨了本技术的一个固有缺陷：使用<cmd c="time"/>命令更改时间时会产生固定的相位偏差，给出该问题验证方法、影响范围与规避方案。


## 1. 背景与目标

为了达到渲染天空盒的目的，太阳和月亮纹理可以帮到我们。思路是：

1. 把太阳始终固定在玩家视线方向（屏幕中央），月亮保持在原位置
2. 太阳贴图放大为全屏，作为载体渲染一个六面无缝的自定义天空盒

并以此实现三种模式：
1. 原版一致
2. 固定的天空盒
3. 随时间滚动的天空盒

且还需要适配任意的分辨率、FOV、和纹理尺寸。

> [!DANGER] 注意
> **在开始阅读前，请[下载成品资源包](https://github.com/CR-019/datapack-index/raw/refs/heads/lib-hosting/feature/2609/SkyCubeShader.zip)（[备用载点](https://gitee.com/Dahesor/server_resourcepacks/raw/lib/feature/202609/SkyCubeShader.zip)），打开放到一边**\
> **为了简洁，文章内将不再完整贴出着色器的源代码**

## 2. 原版日月渲染

先来研究一下原版日月渲染流程。

**(1) 管线与着色器**：`pipeline/celestial`

其定义为复用`core/position_tex`着色器。游戏中，该着色器程序仅此一个使用者，因此覆盖`core/position_tex`只影响日月和末地闪光。

**(2) 顶点数据与变换模型**：太阳和月亮（包括所有月相）共用同一几何：

```
顶点：(−1,0,−1) (1,0,−1) (1,0,1) (−1,0,1)      // 单位四边形，X-Z 平面
UV  ：celestials atlas 中对应精灵的边界 (u0,v0,u1,v1)
```

绘制时对 ModelViewStack（JOML `Matrix4fStack`，后进先出的矩阵栈）执行：

| 操作 | 栈顶内容 | 说明 |
|---|---|---|
| pushMatrix | V（相机视图旋转，栈基座） | 压栈备份当前矩阵 |
| mul(SkyRot) | $V × SkyRot$ | 天球旋转（含时间旋转） |
| translate(0,100,0) | $V × SkyRot × T$ | 太阳距离 100 |
| scale(S,1,S) | $V × SkyRot × T × S$ | 太阳尺寸 S（见下表） |
| 上传 DynamicTransforms | ModelViewMat $=$ 栈顶 | 即着色器收到的 MVM |
| popMatrix | $V$ | 弹栈还原，供月亮/末地/世界继续使用 |

| 对象 | 缩放 S | 四边形 |
|---|---|---|
| 太阳 | 30 | 单位四边形 ×1 |
| 月亮（8 相位） | 20 | 单位四边形 ×8（索引偏移 = 相位×4） |
| 末地闪光 | 60 | 单位四边形 ×1 |

**(3) 混合模式**：`BlendFunction.OVERLAY = (SRC_ALPHA, ONE, ONE, ZERO)`，即

$最终像素 = 贴图.rgb × α + 背景.rgb$

### 2.1 有关双时钟

我们需要关注相关的两个时间

**daytime**：`/time set` 修改的对象，`doDaylightCycle` 冻结的对象。太阳的角度根据这个时间变化，即$θ = f(daytime)$。\
**gametime**：自世界创建持续累加的游戏刻计数，`/time query gametime`的查询目标

着色器中，`Globals.GameTime` uniform 的取值为`(gametime % 24000L) + gez.a(false)) / 24000f`。它的范围为`0..1`，和daytime无关。

## 3. 总体设计：数据流与中间变量

现在，来关注一下我们的着色器。

游戏会先渲染出天空背景（`pipeline/sky`），之后是星星，再然后是日月。我们可以通过资源包覆盖着色器，在渲染星星之后介入这个过程：

 - 修改`sky.fsh`，将天空背景更改为纯黑。
 - 修改`position_tex.vsh`，按 |MVM 列| 特判太阳，在需要时将太阳的纹理铺满整个天空。
 - 修改`position_tex.fsh`，月亮可以直接原样采样。太阳则可以根据我们想要的效果任意调整，制作天空盒。

**顶点着色器 → 片元着色器的中间变量**：

| 变量 | 类型 | 含义 | 传递性质 |
|---|---|---|---|
| `texCoord0` | <homolist t="vec2"/> | 原始 atlas UV | 逐三角形透视校正插值 |
| `oPosition` | <homolist t="vec3"/>  | 单位四边形坐标 | 屏幕归一化参数 t/s 的唯一来源 |
| `isSunV` | <float t="float"/>| 1=太阳，0=月亮或末地闪光 | 常量传递 |
| `sunRayView` | <homolist t="vec3"/> | 视空间未归一化视线方向 | 恒定深度平面上的**屏幕线性场** |
| `uPair` 和 `vPair` | <homolist t="vec2"/> | 精灵图边界拆分 | `(u0(1−t), u1 t)` / `(v0(1−s), v1 s)` |

三种模式（`SUN_MODE`）统一在 `skybox_config.glsl` 中定义：
 - **0** = 原版一致
 - **1** = 天空盒随时间滚动
 - **2** = 天空盒时间定格


## 4. 着色器实现详解

### 4.1 顶点着色器 `position_tex.vsh`

#### 4.1.1 绘制目标的识别

```glsl
float celestialScale = length(ModelViewMat[0].xyz);
```

MVM 的 X 轴列$= MVM \cdot \begin{bmatrix}1\\0\\0\\0\end{bmatrix} = V \cdot SkyRot \cdot \begin{bmatrix}S\\0\\0\\0\end{bmatrix}$

旋转与平移保持长度，故 `|MVM[0]| = S`（30/20/60）。同时我们知道目标的几何特征是一个单位四边形且其$Position.y≈0$，所以在着色器内即可完成绘制对象的分类。

#### 4.1.2 全屏四边形（投影矩阵逆推）

$$
x_{ndc} = \operatorname{ProjMat}[0][0] · x_{\text{view}} / −z_{\text{view}}\\
y_{ndc} = \operatorname{ProjMat}[1][1] · y_{\text{view}} / −z_{\text{view}}
$$

取与原版中日月的视空间距离 $z_{\text{view}view} = −D$（D=100）：

```glsl
float halfW = D / ProjMat[0][0];
float halfH = D / ProjMat[1][1];
viewPos = vec3(Position.x * halfW, Position.z * halfH, −D);
```

FOV,分辨率，和宽高比的适配都能完全由`ProjMat`负责。

#### 4.1.3 视线射线的精确插值（透视校正）

未归一化视线方向${\text{ray}} = (x_{\text{view}}, y_{\text{view}}, −D)$ 在恒定深度平面上是屏幕坐标的**仿射函数**；三角形顶点属性插值对常量深度平面即为**屏幕线性**（透视校正因子`w = D`）。故：

```glsl
sunRayView = vec3(Position.x * halfW, Position.z * halfH, -D);
```

$\operatorname{normalize}(\operatorname{sunRayView})$ 即为穿越该像素精确的视线方向。

#### 4.1.4 精灵边界拆分（插值恒等式）

四角 UV 与坐标的对应关系，按角点拆分输出：

```glsl
uPair = (Position.x < 0.0) ? vec2(UV0.x, 0.0) : vec2(0.0, UV0.x);
vPair = (Position.z < 0.0) ? vec2(UV0.y, 0.0) : vec2(0.0, UV0.y);
```

插值后（仍为屏幕线性）：`uPair.x = u0(1−t)`、`uPair.y = u1·t`。两个恒等式只与 t/s 有关，任意像素成立，从而精确反解边界；贴图尺寸/内容可任意更换。

### 4.2 片元着色器 `position_tex.fsh`

#### 4.2.1 边界反解（t/s 重建与数值稳定性）

```glsl
float t = clamp(0.5 * (oPosition.x + 1.0), 0.0, 1.0);   // oPosition.x 插值 = 2t−1
float s = clamp(0.5 * (oPosition.z + 1.0), 0.0, 1.0);
float u0 = uPair.x / max(1.0 - t, 1e-4);   // 0/0 可去型：分子同阶趋于 0
…
```

除法在`t`接近1的边界时可能出现奇点，`max(1.0 - t, 1e-4)`仅作除零保护。

#### 4.2.2 模式 0：与原版一致

顶点着色器恢复原版变换（`MVM·Position`），片元恢复原版采样：

```glsl
fragColor = color * ColorModulator;   // 且 alpha==0 → discard（与原版 position_tex.fsh 一致）
```

#### 4.2.3 模式 1/2：天空盒

**(a) 视线方向**：见 4.1.3，`normalize(sunRayView)`。

**(b) 天球坐标系变换（正交求逆）**：

```glsl
mat3 m = mat3(ModelViewMat);
vec3 c0 = normalize(m[0]); vec3 c1 = normalize(m[1]); vec3 c2 = normalize(m[2]);
vec3 dir = normalize(transpose(mat3(c0, c1, c2)) * dirView);
```

- `mat3(MVM)` 取旋转+缩放部分；列需要归一化消除非均匀缩放，否则方向会被斜切。
- 旋转矩阵正交 ⇒ `R⁻¹ = Rᵀ`，该运算直接完成“视空间 → 天球系”的转换。
- 得到的 `dir` 与日月共享同一天空坐标系。

**c) 倾角校正（天球系滚转）**：

```glsl
dir = rot_x(radians(SKY_ROLL_FIX_DEG)) * dir;
```

天球系内嵌 `−90°X`，会令“顶上”不在世界的天顶，需要`SKY_ROLL_FIX_DEG`（0/±90/180）校正。

**c2) 时间定格（仅模式2）**：

```glsl
float dayFrac = GameTime;            // Globals.GameTime：0..1 日进度
float fixFrac = fract(SKY_FIXED_TIME / 24000.0);
float delta   = (fixFrac - dayFrac) * 6.28318530718 * SKY_TIME_RATE;
dir = rot_fix_axis(SKY_TIME_DIR * delta) * dir;
```

- 语义：盒体保持世界锚定，把当前时刻校正到 `SKY_FIXED_TIME` 的朝向；
- `GameTime` 已是`0..1`的太阳进度，可以直接使用；
- 校正为绕 `SKY_FIX_AXIS`（0=X/1=Y/2=Z）指定轴的纯方位旋转；`SKY_TIME_DIR` 控制旋向，`SKY_TIME_RATE` 为速率倍率（正常 1.0）；
- **局限**：上面说过，`GameTime`的数据来自游戏刻，而日月由`daytime`。驱动。连续漂移可完全抵消这一差别，但`/time set`造成的相位跳变不在补偿范围。详见下的**缺陷**部分。

**d) 立方体贴图映射（主导轴 + 面内 UV）**：

先按主导轴定面，再用其余两轴作面内 UV。公式采用公认约定，`u`向右方、v=0为块顶 = 天空朝上：

| 面 | 公式（ad = abs(dir) 的各分量） |
|---|---|
| +Y 顶 | $u = 0.5+0.5\times x/\text{ad.y}$，$v = 0.5+0.5\times z/\text{ad.y}$ |
| −Y 底 | $u = 0.5+0.5\times x/\text{ad.y}$，$v = 0.5−0.5\times z/\text{ad.y}$ |
| +Z 前 | $u = 0.5+0.5\times x/\text{ad.z}$，$v = 0.5−0.5\times y/\text{ad.z}$ |
| −Z 后 | $u = 0.5−0.5\times x/\text{ad.z}$，$v = 0.5−0.5\times y/\text{ad.z}$ |
| +X 右 | $u = 0.5−0.5\times z/\text{ad.x}$，$v = 0.5−0.5\times y/\text{ad.x}$ |
| −X 左 | $u = 0.5+0.5\times z/\text{ad.x}$，$v = 0.5−0.5\times y/\text{ad.x}$ |

**无缝性论证**：任意相邻棱上 (u,v) 数值与变化率连续。\
例：+Z 面右棱（x=z>0,u=1）与 +X 面左棱（z=x>0,u=0）对应同一组世界方向，且两面的 v 表达式同为 `0.5−0.5*y/*`。

**e) 方向校准（烘焙固定值）**：

```glsl
faceUV.y = 1.0 - faceUV.y;    // 六面统一
```

推导：先水平镜像 `(u,v)→(1−u,v)` 再旋转 180° `(1−u,v)→(u,1−v)`，两步复合 = 垂直翻转，与成品贴图方向一致。

**f) 采样、边界混合，与高透明度丢弃**：

```glsl
vec2 atlasUV = vec2(u0 + (u1-u0) * localUV.x, v0 + (v1-v0) * localUV.y);
vec4 sky = texture(Sampler0, atlasUV);
if (sky.a < ALPHA_DISCARD) discard;
fragColor = vec4(sky.xyz, 1.0);
```

- `localUV`(精灵内 0~1) 经边界仿射映射到 atlas 绝对坐标；
- atlas 为线性过滤：每块边界处结果 = 相邻纹素加权平均。邻块为透明空隙时，边界的透明度被稀释，会产生1像素的细缝。为了修复，**贴图内为每个面加 1px 不透明边框**（复制旁边的像素），配合 `CELL_MARGIN=0` 铺满整块采样。

## 5. 混合与“雾感”问题

上文提过，我们覆盖了 `core/sky.fsh` 使天空背景输出纯黑的颜色。若不这么做，白天天空盒会泛白发灰。\
这是因为，`BlendFunction.OVERLAY`为加法混合`最终色 = 贴图 × α + 背景`。白天时，背景为亮色的雾天空（`FogColor`），整个背景都会被叠加进天空盒。


## 6. 参数总表

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


## 7. 文件清单

```
SkyCubeShader/
├── pack.mcmeta
└── assets/minecraft/
    ├── shaders/
    │   ├── include/
    │   │   └── skybox_config.glsl     ← 配置文件
    │   └── core/
    │       ├── position_tex.vsh      ← 日月顶点着色器
    │       ├── position_tex.fsh      ← 日月片元着色器
    │       ├── sky.vsh               ← 天空背景顶点着色器：固定旋转替代 MVM
    │       └── sky.fsh               ← 天空背景改纯黑
    ├── textures/environment/celestial/   ← 六面天空盒贴图
    │   └── moon/*.png
    └── atlases/celestials.json   ← celestials atlas 定义
```

## 8. 已知限制与缺陷

### 8.1 双时间问题

模式 2 的补偿 `delta = (SKY_FIXED_TIME − GameTime)` 只能抵消固定的时间漂移。当使用`/time set`更改时间时，太阳的位置将产生跳变，但补偿量不变。这会导致天空盒出现一个固定角度的偏移。

着色器无法消除这种偏移，因此该模式只建议在时间固定的情境下使用。

### 8.2 其他限制

1. **混合函数不可改**：OVERLAY（加法）由 CPU 端管线定义，资源包无法修改。纯色方案依赖纯黑背景，这牺牲了原版的天空渐变。若需真正透明度混合，将不再是纯原版资源包可以实现的范围。
2. **世界帧不可分解**：$MVM_{rot} = V·R(θ)$，$V$的3自由度+ θ的$1$自由度$= 4$个未知，但我们只有三个方程。因此任意$θ′$都可配一个$V′$生成同一矩阵——因此“纯着色器提取世界帧/时间”不存在闭式解；
3. **FOV 范围**：ProjMat只适配常规投影，超广角或伪鱼眼不在设计内。