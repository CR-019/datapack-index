---
title: 'Shader Practice - Accurate Sampling Texture'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
title='Shader Practice - Accurate Sampling Texture'
authorName='Xuanyu1725'
/>

## summary

This article provides a method for sampling surface textures stably and accurately. The original numerical stability problem is solved to facilitate the shader to obtain additional information on the texture.

## Preface

The topic to be discussed in this article is not how to sample and then display colors. This has already been introduced in the core shader workflow, and more in-depth sampling theory will be introduced in other topics. The issue considered in this article is how to accurately obtain the texture information attached to this surface in the fragment shader.

In the previous "Shader Practice - Code Rain Block" and "Shader Advanced - Physically Based Rendering (PBR)", we introduced a way to$P = kX+B$Transformation, a method of converting the normalized texture coordinates in the plane into sprite coordinates for sampling. However, the partial derivatives used in this method have numerical stability problems, and noise will be generated during sampling, resulting in distorted results.

![sampling noise](../../../../../feature/archive/202607/4/QQ_1782856332362.png)

Therefore, we hope to use a more stable sampling method to accurately sample according to the given normalized texture coordinate.

## Calculated by texture resolution

It would be easier if we knew in advance what the resolution of the texture would be. We record the size of the material as`vec2 imgSize`or`ivec2 imgSize`(We use`vec2`A little more, since it's better suited for interpolation and computation).

Our goal is to use normalized coordinate sampling in the context of any fragment, and we also need to know the size of the texture atlas. The size of the texture atlas is actually the size of Sampler0. We can directly pass`vec2 atlasSize = textureSize(Sampler0, 0)`Get. (The second parameter is Lod)

Then normalized coordinate`imgCoord`The actual sampling coordinate of the corresponding Sampler0 is the starting point coordinate plus`imgCoord * imgSize / atlasSize`

Next we calculate the coordinates of the starting point. Examining any patch, we can obtain its normalized coordinate within the plane using a similar method as before.`vec2 normalizedUV`and interpolated`texCoord0`, and the same logic as above, there is a relationship here`texCoord0 = startCoord + normalizedUV * imgSize / atlasSize`

Apart from`startCoord`are all known, so`startCoord = texCoord0 - normalizedUV * imgSize / atlasSize`

So we get a mapping from the normalized coordinate to the actual sampled coordinate of Sampler0

```glsl
vec2 imgSize = ... ;
vec2 atlasSize = textureSize(Sampler0, 0);

vec2 startCoord = texCoord0 - normalizedUV * imgSize / atlasSize;
vec2 sampleCoord = startCoord + imgCoord * imgSize / atlasSize;
```


After simplification

```glsl
vec2 imgSize = ... ;
vec2 atlasSize = textureSize(Sampler0, 0);

vec2 scale = imgSize / atlasSize;
vec2 sampleCoord = texCoord0 + (imgCoord - normalizedUV) * scale;
```


![Improved effect](../../../../../feature/archive/202607/4/QQ_1782859725888.png)

You can see that the noise disappears and the sampling is very clean.

## Things to note

The arrangement of vertices and sample coordinates may change between different versions of Minecraft (in fact, Mojang did change it several times). make sure`normalizedUV`The surrounding direction of`texCoord0`consistent.

In the previous model we had the relationship`texCoord0 = k * normalizedUV + b`, here`k = imgSize / atlasSize` `b = startCoord`, if the wrapping directions are inconsistent, output`startCoord`You will see that b changes linearly in a certain direction. The figure below shows when`texCoord0`Taking the upper left corner as the origin, and`normalized`When taking the lower left corner as the origin`fragColor = vec4(startCoord, 0.0, 1.0);`the output result.

![Y-axis opposite](../../../../../feature/archive/202607/4/QQ_1782860678313.png)

More examples will be shown in the subsequent "Shader Practice - Grayscale and Dithering".
