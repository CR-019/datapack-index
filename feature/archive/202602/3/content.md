---
title: '着色器进阶篇：基于物理的渲染（PBR）'
---

<FeatureHead
    title='着色器进阶篇：基于物理的渲染（PBR）'
    authorName='轩宇1725'
    cover = '../_assets/3.png'
/>


## 前言

本篇文章虽不在计划中，但鉴于我在B站发布过相关视频，且收到不少读者的询问，因此决定补充这一部分内容。必须说明的是，PBR 的相关知识与Minecraft关系不大，大部分是通用且可能略显枯燥的计算机图形学内容，读者可根据兴趣选择阅读。

此外，着色器系列教程的发布时间并不决定学习顺序，待教程基本完善后，读者可在主站的资源包体系模块中找到编者的学习顺序指引。建议读者先学习 Blinn - Phong 光照模型，再学习 PBR 内容，以后我可能会编写关于 Blinn - Phong 模型的文章。

## PBR简介

其实大多数读者都接触过PBR材质，但可能并不清楚PBR的具体含义。PBR 的全称是 Physically Based Rendering，即基于物理的渲染。它是一种通过模拟光与物体表面交互的物理过程来实现更真实视觉效果的渲染方法。因此，PBR主要分为两个部分，即光照模型和材质模型，我们将分别进行介绍。

## 渲染方程

PBR的核心是渲染方程（Rendering Equation），它描述了表面上每个点的出射光（Radiance）如何由入射光（Irradiance）和材质属性决定。渲染方程的积分形式可以表示为：

$$ L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (\omega_i \cdot n) d\omega_i $$

$p$ 是表面上的点，$L_o$ 是出射光，$L_e$ 是自发光，$f_r$ 是双向反射分布函数（BRDF），$L_i$ 是入射光，$n$ 是法线，$ω_i$ 和 $ω_o$ 分别是入射和出射方向。

其中积分部分表示所有入射光对出射光的贡献。不过在 Minecraft 中我们的光源都可以看做点光源，所以积分可以简化为对所有光源的求和：

$$ L_o(p, \omega_o) = L_e(p, \omega_o) + \sum_{l=1}^{N} f_r(p, \omega_{i_l}, \omega_o) L_i(p, \omega_{i_l}) (\omega_{i_l} \cdot n) $$

公式中的自发光项比较好理解，而 $L_i(p, \omega_i) (\omega_i \cdot n)$ 是基于 Lambert余弦定律计算的入射光强度，在之前的基础教程中我们曾介绍过，简单来说，入射光在表面的辐照度正比于入射光强度与法线夹角的余弦值（即 $\omega_i \cdot n$），也与入射光在这一点本身的强度有关，即函数 $L_i(p, \omega_i)$

剩下的一项 $f_r(p, \omega_i, \omega_o)$ 则是 PBR 的核心内容——双向反射分布函数（BRDF）。它描述了表面如何反射入射光到各个方向。BRDF 通常基于物理属性进行建模，常见的模型包括 Lambertian（漫反射）、Cook-Torrance（镜面反射）等。我们这里介绍较为复杂且真实的 Cook-Torrance 模型。

## 基本理论

### 微表面理论（Microfacet Theory）

微表面理论认为，不存在完全光滑的材质，极致光滑的材质，其表面上都有小的凹凸。这些不平整的表面上会发生光的反射、折射、散射。当微表面比较粗糙时，反射光会更加分散，产生漫反射。当微表面比较平滑时，反射光会更加集中，产生高光反射。

### 亥姆霍兹互异性（Helmholtz reciprocity theorem）

在无吸收介质中，光波的传播方向可以互换而不会影响光强分布。即出射角和入射角互换时，BRDF值不变（在实际情况中BRDF模型可能违背此规则）。

### 能量守恒（Energy Conservation）

能量守恒是物理学的基本规则之一，在渲染中，它体现为出射光永远不会大于入射光。这意味着材质的反射率和透射率之和不能超过1。

此外，点光源的传播过程中，以光源为圆心的球壳所含的光能是一定的，这意味着球壳单位面积上接收到的光辐射度与距离的关系循序平方反比定律。

在渲染中能量守恒不一定严格遵循，而是追求近似，而避免物体过量而产生不现实的观感。

### 定向半球反射率（Directional-Hemispherical Reflectance）

定向半球反射率通常简称为DHR，或用 $ \displaystyle R(l)$ 表示。定向半球指的是以法线为中心的半球，DHR描述了表面将光反射到半球上的总体反射率，它描述了BRDF模型的守恒程度。根据能量守恒定律，定向半球反射率的值必须在0到1之间。可以定义为 $ \displaystyle R(\omega_i) = \int\limits_{\Omega} f_r(p, \omega_i, \omega_o)(\omega_i \cdot n) d\omega_o$， 类似的，由于亥姆霍兹互异性，也可以这样定义 $ \displaystyle R(\omega_o) = \int\limits_{\Omega} f_r(p, \omega_i, \omega_o)(\omega_o \cdot n) d\omega_i $。事实上我们已经在反射方程中见到过这一部分。

### 菲涅尔反射（Fresnel Reflection）

光在材质的表面会发生反射和折射，菲涅尔反射则描述了反射光和折射光的比例。当观察角度垂直于表面时，反射光较少，当观察角度接近于平行表面时，反射光较多。

### 兰伯特余弦定律（Lambert's Cosine Law）

对于垂直于光照方向的面，其单位面积受到的光辐射量为100%，而当其与光照方向呈60°角时，这个比例降低到50%。即，表面接受到的光的辐射量与法线和光照方向之间的夹角的余弦值成正比，称为兰伯特余弦定律。

由于我们已经在反射方程中引入了这项，所以在BRDF模型中我们不再考虑。

## Cook-Torrance BRDF

基于上述理论，罗伯特·库克（Robert L. Cook）​ 和 肯尼斯·托伦斯（Kenneth E. Torrance）提出了一种基于微表面理论的BRDF模型，称为Cook-Torrance模型。该模型将BRDF分解为三个主要部分：微表面法线分布函数（D），几何遮蔽函数（G），以及菲涅尔反射项（F）。Cook-Torrance BRDF的表达式如下：

$$f_r = k_d \cdot f_{\text{lambert}} + k_s \cdot f_{\text{cook-torrance}}$$

其中，$k_d$ 和 $k_s$ 分别是漫反射和镜面反射的权重系数，满足 $k_d + k_s = 1$ ，由具体材质属性决定。$f_{\text{lambert}}$ 是Lambertian BRDF，表示漫反射部分：

$$f_{\text{lambert}} = \frac{c}{\pi}$$

事实上，Lambertian BRDF是一个常数函数，表示表面在所有方向上均匀反射光线。$c$ 是材质的漫反射颜色，分母的 $\pi$ 是为了确保能量守恒。(即定向半球反射率不超过1)

$ f_{\text{cook-torrance}} $ 则是Cook-Torrance模型的镜面反射部分，定义为：

$$f_{\text{cook-torrance}} = \frac{F \cdot D \cdot G}{4 (n \cdot v) (n \cdot l)}$$

同样地，分母的 $4$ 是为了确保能量守恒。

其中 $D, G, F$ 都是与材质属性和光照几何相关的函数。

### 微表面法线分布函数（D）

微表面法线分布函数 $D$ 描述了微表面法线（即微小凹凸面的法线）相对于宏观法线（法线贴图）$n$ 的分布情况。常用的分布函数包括 Beckmann 分布和 GGX 分布。这里我们采用 GGX 分布，其定义为：

$$ D(h) = \frac{\alpha^2}{\pi ((n \cdot h)^2 (\alpha^2 - 1) + 1)^2} $$

其中，$h$ 是半程向量，即入射方向和出射方向中间的归一化向量，可以直接由两个向量和的归一化得到。$\alpha$ 是粗糙度参数，取值范围为 $[0, 1]$，表示表面的粗糙程度，$\alpha = 0$ 表示完全光滑，$\alpha = 1$ 表示非常粗糙，由材质属性决定。

### 几何遮蔽函数（G）

几何遮蔽函数 $G$ 描述了微表面之间的遮挡和阴影效应。常用的几何遮蔽函数是 Smith 函数，其定义为：

$$ G(l, v) = G_1(l) \cdot G_1(v) $$

即认为入射方向和出射方向的遮蔽是独立的，$G_1$ 是单侧几何遮蔽函数，两个方向的乘积即为总的几何遮蔽函数。

$G_1$ 在 Schlick 近似下定义为：

$$ G_1(x) = \frac{n \cdot x}{(n \cdot x)(1 - k) + k}$$

其中，$k = \frac{(\alpha + 1)^2}{8}$，$x$ 可以是入射方向 $l$ 或出射方向 $v$。

### 菲涅尔反射项（F）

菲涅尔反射项 $F$ 描述了光在表面反射和折射的比例。常用的近似方法是 Schlick 近似，其定义为：

$$ F(\omega_i, h) = F_0 + (1 - F_0)(1 - (\omega_i \cdot h))^5 $$

其中，$F_0$ 是在垂直入射时的反射率，通常由材质属性决定。对于非金属材质，$F_0$ 通常较低（如 0.04），而对于金属材质，$F_0$ 较高（如 0.9 以上）。

### 组合BRDF

将上述各项组合起来，我们得到完整的 Cook-Torrance BRDF，可以看到这些式子都为经验公式，并不是基于物理严格推导出来的，但他们很好地近似了真实世界中的光照现象，同时也易于计算，适合实时渲染使用。

最终得到的 Cook-Torrance BRDF 可以用于渲染方程中，计算每个片元的出射光，这就是 PBR 光照系统的核心内容。

## 材质系统

在上述公式中，可修改的参数包括:

- 漫反射颜色 $c$ ：决定材质的基本颜色。
- 粗糙度 $\alpha$ ：决定材质表面的光滑程度，影响高光的扩散程度。
- 金属度 $k_s$ ：决定材质是金属还是非金属，影响菲涅尔反射项 $F_0$ 的取值。

这些参数可以分别从3个不同的纹理贴图中获取，分别是漫反射贴图（Albedo Map）、粗糙度贴图（Roughness Map）和金属度贴图（Metalness Map），基于这三张贴图的工作流称为金属-粗糙度工作流（Metalness-Roughness Workflow）。

此外，还可以添加3张辅助贴图：

法线贴图（Normal Map）：用于表示表面的宏观法线分布，影响光照计算中的法线 $n$。由于颜色值只能表示正值，因此颜色 $(r,g,b)$ 实际对应到的法线为 $(x, y, z) = (2r - 1, 2g - 1, \sqrt{1 - x^2 - y^2})$。

环境光遮蔽贴图（Ambient Occlusion Map）：用于表示表面的环境光遮蔽程度，直接与出射光相乘，影响整体亮度。

视差贴图（Parallax Map）：用于模拟表面的微小凹凸效果，影响纹理采样坐标的偏移，从而增强视觉细节。

## 着色器实现

### TBN 矩阵和切线空间

切线空间即以模型的表面为基础建立的局部坐标系，通常由法线（Normal）、切线（Tangent）和副切线（Bitangent）三个正交向量组成。切线空间的建立对于正确应用法线贴图至关重要，因为法线贴图中的法线是相对于切线空间定义的。

在顶点着色器中，Minecraft 已经提供了顶点属性 Normal，而 Tangent 和 Bitangent 需要我们自行计算，这需要在 fsh 中通过偏导数计算得到。

通过 `dFdx` 和 `dFdy` 函数，我们可以计算出纹理坐标在屏幕空间的偏导数，从而计算出切线向量，数学证明在附录中给出：

```glsl
vec3 dp1 = dFdx(worldPosition);
vec3 dp2 = dFdy(worldPosition);
vec2 duv1 = dFdx(uv);
vec2 duv2 = dFdy(uv);
vec3 tangent = normalize(duv2.y * dp1 - duv1.y * dp2);
```

> 注: 可能需要对极端值进行处理

得到一条切线后，我们将其视作主切线，然后通过叉乘计算副切线：

```glsl
vec3 bitangent = normalize(cross(normal, tangent));
```

最终，我们将法线、切线和副切线组合成 TBN 矩阵：

```glsl
mat3 TBN = mat3(tangent, bitangent, normal);
```

该矩阵可以将切线空间的向量转换到世界空间。

通过采样法线贴图，我们可以得到切线空间下的法线，然后通过 TBN 矩阵将其转换到世界空间：

```glsl
vec3 n_tbn = ... // 这是从法线贴图采样得到的切线空间法线
vec3 n_world = normalize(TBN * n_tbn);
```

### 采样技巧

由于 Minecraft 的着色器通常只能访问一张可修改的纹理，而且这张纹理是嵌入到精灵图中的，因此我们需要将多张贴图合并到一张纹理中进行采样，并且建立子图上的纹理坐标映射关系。

使用到的技巧在 《着色器实践篇 - 代码雨方块》中有证明，这里直接给出代码示例：

```glsl
// 在 vsh 中计算
out vec2 NormalizedUV;
if (gl_VertexID % 4 == 0) {
        NormalizedUV = vec2(0.0, 1.0);
    } else if (gl_VertexID % 4 == 1) {
        NormalizedUV = vec2(0.0, 0.0);
    } else if (gl_VertexID % 4 == 2) {
        NormalizedUV = vec2(1.0, 0.0);
    } else {
        NormalizedUV = vec2(1.0, 1.0);
    }
```

```glsl
// 在 fsh 中计算
in vec2 NormalizedUV;
vec2 k = dFdx(texCoord0) / dFdx(NormalizedUV);
vec2 b = texCoord0 - k * NormalizedUV;

vec2 SpriteUV = k * SpriteNormalizedUV + b; // 这一行在最终采样时使用，我们提供的 SpriteNormalizedUV 是子图内的归一化坐标，通过计算可以得到正确的采样坐标.
```

### 获取光照方向

由于 Minecraft 中没有提供光源位置，我们需要通过原版基于 Lambert 模型中的漫反射强度反解出光照方向。（注意，这种方案给出的精度非常低，常见的实现方式是转到后处理着色器中实现PBR效果，但这里我们尝试在核心着色器中实现）

光照贴图的采样结果由下面的代码给出（摘自原版 vsh）

```glsl
vec4 minecraft_sample_lightmap(sampler2D lightMap, ivec2 uv) {
    return texture(lightMap, clamp((uv / 256.0) + 0.5 / 16.0, vec2(0.5 / 16.0), vec2(15.5 / 16.0)));
}

minecraft_sample_lightmap(Sampler2, UV2) // 该函数返回的是光照的颜色和强度，相当于 L_i(p, ω_i)项
```

为了让采样得到的光照信息更加准确，我们修改 lightmap.fsh，将环境光照颜色、天空光照颜色都设为白色，取消方块光照的闪烁效果（如需保留部分原版光照效果，自行设计和修改）：

```glsl
// lightmap.fsh
// 完整的修改不给出, 这里介绍如何修改

layout(std140) uniform LightmapInfo {
    float AmbientLightFactor; // 使用该变量的地方替换为 0.0
    float SkyFactor; // 设为合适的定值
    float BlockFactor; // 设为合适的定值
    float NightVisionFactor;
    float DarknessScale;
    float DarkenWorldFactor;
    float BrightnessFactor;
    vec3 SkyLightColor; // 使用该变量的地方替换为 vec3(1.0, 1.0, 1.0);
    vec3 AmbientColor; // 若 AmbientLightFactor 保留，则使用该变量的地方替换为 vec3(1.0, 1.0, 1.0);
} lightmapInfo;

```

> 注：如果需要保留颜色可参考在纹理中编码更多信息的技巧，在下个月的文章中我会介绍相关内容。

同样对 minecraft_sample_lightmap() 的返回值进行偏导计算，我们可以得到世界空间中描述的光照方向:

```glsl
vec3 lightColor = minecraft_sample_lightmap(Sampler2, UV2).rgb;
vec3 dp1 = dFdx(worldPosition);
vec3 dp2 = dFdy(worldPosition);
vec3 dl1 = dFdx(lightColor);
vec3 dl2 = dFdy(lightColor);
vec3 lightDir = normalize(cross(dl2, dp1) - cross(dl1, dp2));
```

> 注: 可能需要对极端值进行处理

现在我们得到了法线、光照方向和视角方向（就是片元在视图空间中的位置向量取反归一化），再对粗糙度、金属度和漫反射颜色进行采样，就可以将这些值代入 Cook-Torrance BRDF 公式中，计算出最终的出射光颜色。

最终的颜色乘以环境光遮蔽贴图的值即可得到最终的片元颜色。

### 视差贴图

视差贴图造成的采样偏移计算比较复杂，实际上实现的复杂程度决定了视差贴图的真实感。这里我们采用一种简单的视差映射方法，称为偏移映射（Offset Mapping）。

```glsl
float height = ... // 采样视差贴图
vec3 viewDir_tbn = normalize(TBN * viewDir);
vec2 parallaxUV = uv + (viewDir_tbn.xy / viewDir_tbn.z) * (height * scale + bias);
```

上述对所有材质贴图的采样坐标均使用 parallaxUV 进行采样即可。

## 局限

上面的实现实际上对模型做了进一步的简化，即将所有点光源的光看做一束，从而失去了光源的空间位置关系，也即我们最终将原始的渲染方程

$$ L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (\omega_i \cdot n) d\omega_i $$

先简化为了

$$ L_o(p, \omega_o) = L_e(p, \omega_o) + \sum_{l=1}^{N} f_r(p, \omega_{i_l}, \omega_o) L_i(p, \omega_{i_l}) (\omega_{i_l} \cdot n) $$

通过合并光照方向，每个点的光照方向实际上变成了一个固定的方向，从而进一步简化为了

$$ L_o(p, \omega_o) = L_e(p, \omega_o) + f_r(p, \omega_{i_l}, \omega_o) \sum_{l=1}^{N} L_i(p, \omega_{i_l}) (\omega_{i_l} \cdot n) $$

这种简化使得我们无法正确模拟多个光源对同一表面的不同影响，尤其是在存在多个光源且它们的位置关系复杂时，可能会导致不真实的渲染效果。

## 附录 - 切线计算的数学推导

设世界坐标为 $P_\text{world} \in \mathbb{R}^3$, 纹理坐标为 $UV \in \mathbb{R}^2$, dFdx 和 dFdy 分别表示为 $\frac{\partial}{\partial x}$ 和 $\frac{\partial}{\partial y}$。

我们要计算的切线实际上是 $UV$ 对 $P_\text{world}$ 的偏导数，即：

$$\text{Tangent} = \frac{\partial UV}{\partial P_\text{world}}$$

根据多元函数的链式法则，我们有：

$$\begin{bmatrix}
\frac{\partial UV.x}{\partial x} & \frac{\partial UV.x}{\partial y} \\
\frac{\partial UV.y}{\partial x} & \frac{\partial UV.y}{\partial y}
\end{bmatrix} = \begin{bmatrix}
\frac{\partial UV.x}{\partial P_\text{world}.x} & \frac{\partial UV.x}{\partial P_\text{world}.y} & \frac{\partial UV.x}{\partial P_\text{world}.z} \\
\frac{\partial UV.y}{\partial P_\text{world}.x} & \frac{\partial UV.y}{\partial P_\text{world}.y} & \frac{\partial UV.y}{\partial P_\text{world}.z}
\end{bmatrix} \cdot \begin{bmatrix} \frac{\partial P_\text{world}.x}{\partial x} & \frac{\partial P_\text{world}.x}{\partial y} \\
\frac{\partial P_\text{world}.y}{\partial x} & \frac{\partial P_\text{world}.y}{\partial y} \\
\frac{\partial P_\text{world}.z}{\partial x} & \frac{\partial P_\text{world}.z}{\partial y} \end{bmatrix}$$

记左侧矩阵为 $A$，右侧第一个矩阵为 $B$，第二个矩阵为 $C$，则有 $A = B \cdot C$。我们需要求解 $B$，即：

$$ B = A \cdot C^{-1} $$

由于 $C$ 是一个 $3 \times 2$ 的矩阵，其逆不存在，但我们可以通过计算其伪逆来求解。$C$ 的伪逆 $C^+$ 可以通过以下公式计算：

$$ C^+ = (C^T C)^{-1} C^T $$

因此，我们有：

$$ B = A \cdot C^+ = A \cdot (C^T C)^{-1} C^T $$

计算出 $B$ 后，我们可以从中提取出切线向量，即 $B$ 的第一列：

B 的第一列实际上是 $A$ 的各行点乘 $C^+$ 的第一列，而 $C^+$ 的第一列可以通过 $C$ 的列向量计算得到。经过推导，我们发现切线向量可以用A与C的列表示为:

$$ \text{Tangent} = \frac{\partial UV.y}{\partial y} \cdot \frac{\partial P_\text{world}}{\partial x} - \frac{\partial UV.x}{\partial y} \cdot \frac{\partial P_\text{world}}{\partial y} $$

整个过程用GLSL代码表示如下：

```glsl
vec3 dp1 = dFdx(worldPosition); // 即 C 的第一列
vec3 dp2 = dFdy(worldPosition); // 即 C 的第二列
vec2 duv1 = dFdx(uv); // 即 A 的第一列
vec2 duv2 = dFdy(uv); // 即 A 的第二列
vec3 tangent = normalize(duv2.y * dp1 - duv1.y * dp2); // 计算 B 的第一列
```

相似地，计算光照方向也可以使用同样的方法。