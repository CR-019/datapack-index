---
title: '在世界生成方面搞点花活'
---
<script setup>
import ns from '/.vitepress/vue/nbt/namespace.vue'
import obj from '/.vitepress/vue/nbt/object.vue'
</script>
<FeatureHead
  title="在世界生成方面搞点花活"
  authorName="卡儿3058"
  cover='../_assets/1.jpg'
/>


世界生成检测不了光亮？原版草方块生成机制是什么？表面规则里可以手搓实现列表随机？众所周知：不是花活，就是狠活；想要搞点有意思的，就得硬着头皮搞硬核的。今天我们就把这个黑箱拆开看看原理。

### 1.在被遮挡的表面零散放置方块

实验版本：1.21.1

假设我有这样一个多层空岛世界：

![空岛概览](./%E5%9B%BE%E7%89%87/%E7%A9%BA%E5%B2%9B%E6%A6%82%E8%A7%88.jpg)

下层空岛被高层空岛遮挡的地方太暗了，容易刷怪还看不清，我想在这部分区域放一些光源（图中是已放置好的效果）。

众所周知，原版世界生成里并没有能检测光亮或者是否被遮挡的东西。

已放置地物里有一个<obj t="environment_scan" />函数可以逐层检查，但是它最大只能检查32步。而且我们不能假设空岛最大间距有多高，因为空岛生成高度上至256下至负高度，这显然不现实。

噪声设置里有一个表面规则<obj t="stone_depth" />函数，可以检测上方地表或者下方的天花板。但是实际上空岛之间的空旷区域是密度函数为负值产生的，而非"洞穴"，所以这个也用不了。

那么，我是否可以换一种思路：虽然我无法检测"被遮挡"，但是我可以检测"没有被遮挡"。地物或结构可以使用"高度图"来保证它被放置在"世界的上表面"。于是，我可以先把方块满世界随机零散的铺开，然后再使用结构或地物把"没有被遮挡"的部分方块替换回去。这样留下来的方块，就是放置在了"被遮挡区域"。

那么，表面规则阶段如何使用随机数呢？注意到噪声是一种随机数，把它弄得零散一些，就能当随机数用了。比如我让GPT帮我生成的这个噪声，起名叫`scattered_random`：

```json
{
  "firstOctave": 0,
  "amplitudes": [1.0, 1.0, 0.5]
}
```

若噪声值非负则放置泥土，否则放置石头，可以发现这个噪声确实很零碎：

![零碎噪声正负值](./%E5%9B%BE%E7%89%87/%E9%9B%B6%E7%A2%8E%E5%99%AA%E5%A3%B0%E6%AD%A3%E8%B4%9F%E5%80%BC.jpg)

因为噪声值通常都是集中在0附近，所以直接按自己想要的密度采样一个合适的区间，就得到了基于噪声的随机数。

::: details json配置，效果是：在草方块上随机零散放置菌光体

```json
{
  "type": "minecraft:sequence",
  "sequence": [
    {
      "type": "minecraft:condition",
      "if_true": {
        "type": "minecraft:noise_threshold",
        "noise": "aetherial_islands:scattered_random",
        "max_threshold": 0.0023,
        "min_threshold": 0
      },
      "then_run": {
        "type": "minecraft:block",
        "result_state": {
          "Name": "minecraft:shroomlight"
        }
      }
    },
    {
      "type": "minecraft:block",
      "result_state": {
        "Name": "minecraft:grass_block",
        "Properties": {
          "snowy": "false"
        }
      }
    }
  ]
}
```

:::

那么，方块铺好了，该使用什么样的东西把它替换回去呢？

首先我想到了结构，因为结构可以直接在结构文件里定义生成范围，不用去修改生物群系。\
但是，原版的结构即使把最小间距设为0，平均间距设为1，依然很稀疏，而且原版有刻意的防止结构之间过近的算法，结构过密会导致世界生成很卡。\
所以我换成了用地物。

换成地物的话，首先我想到了地物的<obj t="netherrack_replace_blobs" />函数。其效果是：用一个方块替换特定半径内的所有目标方块。若放置失败，则向下移动，直到找到目标方块后再生成。

但是实际上这个地物的放置方式有问题，那就是它只能检测放置点及其下方的方块是否符合替换条件，而且替换形状是一个八面体，即"用曼哈顿距离定义的球"：

![八面体状替换方块](./%E5%9B%BE%E7%89%87/%E5%85%AB%E9%9D%A2%E4%BD%93%E7%8A%B6%E6%9B%BF%E6%8D%A2%E6%96%B9%E5%9D%97.jpg)

那么还有其他方法吗？

实际上，对于世界生成替换方块，我更推荐"disk"函数生成的圆盘：

```json
{
    "type": "minecraft:disk",
    "config": {
        "half_height": （0≤值≤4）圆盘的半高,
        "radius": （0≤值≤8）圆盘的半径,
        "state_provider": {<圆盘使用的方块>},
        "target": {<方块谓词，决定方块在此处是否可以放置>}
    }
}
```

圆盘可以在组成圆盘的每个方块的位置都检测一次方块谓词，可以定义多种规则，它更自由。

图：用淡绿色羊毛替换了草方块，用玻璃替换了菌光体：

![圆盘替换效果](./%E5%9B%BE%E7%89%87/%E5%9C%86%E7%9B%98%E6%9B%BF%E6%8D%A2%E6%95%88%E6%9E%9C.jpg)

配置如下：

::: details 配置详情

```json
{
    "type": "minecraft:disk",
    "config": {
        "half_height": 4,
        "radius": 8,
        "state_provider": {
            "fallback": {
                "type": "minecraft:simple_state_provider",
                "state": {
                    "Name": "minecraft:lime_wool"
                }
            },
            "rules": [
                {
                    "if_true": {
                        "type": "matching_blocks",
                        "blocks": ["minecraft:shroomlight"]
                    },
                    "then": {
                        "type": "simple_state_provider",
                        "state": {
                            "Name": "minecraft:glass"
                        }
                    }
                }
            ]
        },
        "target": {
            "type": "matching_blocks",
            "blocks": [
                "minecraft:shroomlight",
                "minecraft:grass_block"
            ]
        }
    }
}
```

:::

若地物是用地物放置器放置的，那么游戏会在每个可生成地物的区块的西北下角作为地物的初始生成位置。\
这样，再多叠加一些圆盘，再让每个都随机偏移一下，都放置在 `WORLD_SURFACE_WG` 高度图，这样可以替换掉大部分"没有被遮挡"的方块。

虽然不算严格意义上的100%替换，也是一种很好的"蒙特卡洛式"解决方案：没有被替换掉的就当是边界条件好了，整体上可以接受。\
缺点就是需要修改每一个会在岛屿地表生成草方块的生物群系，在它们的同一生成阶段都加上这个地物。

效果预览（菌光体的放置）：

![效果2](./%E5%9B%BE%E7%89%87/%E6%95%88%E6%9E%9C2.jpg)

### 2.原版世界生成，地表草方块的生成原理

实验版本：26.2

那么，怎么在世界地表放置方块呢？或许可以参考一下原版草方块的生成方法？

实际上原版并没有一个可以严格意义上保证方块放置在地表的功能（表面规则条件没有高度图）。在表面规则里，原版放置草方块有三个主要条件：

```json
{
  "type": "minecraft:condition",
  "if_true": {
    "type": "minecraft:above_preliminary_surface"  //条件1
  },
  "then_run": {
    "type": "minecraft:condition",
    "if_true": {
        "type": "minecraft:stone_depth",  //条件2
        "offset": 0,
        "add_surface_depth": false,
        "secondary_depth_range": 0,
        "surface_type": "floor"
    },
    "then_run": {
        "type": "minecraft:condition",
        "if_true": {
            "type": "minecraft:water",  //条件3
            "offset": 0,
            "add_stone_depth": false,
            "surface_depth_multiplier": 0
        },
        "then_run": {
            "type": "minecraft:block",
            "result_state": {
                "Name": "minecraft:grass_block"
            }
        }
    }
  }
}
```

核心就是<ns t="minecraft:above_preliminary_surface"/>函数，其功能是：检查当前位置是否高于初步地表高度。初步地表高度由噪声设置<nbt :i='["d","str","object"]' t='noise_router.preliminary_surface_level'/>产生的地表高度插值后，向下偏移8格，再加上表面厚度后的值。其中表面厚度基于噪声<ns t="minecraft:surface"/>计算而来。

也就是说，初步地表是由密度函数计算而来的，然后由于噪声的不确定性，偏移8格是作为一个合适余量设置的，就是"宁要放在地下，也不要漏放了地表"。然后再检查这个位置"是否是地板"，然后检查是不是水下，就可以放置了。其他的就是针对各生物群系的修修补补了。

由于<obj t="stone_depth"/>函数是把洞穴底部和世界表面都作为"地板"来返回的，因此就能看到如下情况：

![洞穴里的草方块](./%E5%9B%BE%E7%89%87/%E6%B4%9E%E7%A9%B4%E9%87%8C%E7%9A%84%E8%8D%89%E6%96%B9%E5%9D%97.jpg)

像这样放置在地下的草方块或地表没有成功放置草方块的情况，就是"合理的边界情况"了。因为要严格意义上扫描地表比较耗算力，这种是直接借用了已有结果组合而来的，算是一种省性能的方案。

### 3.世界各处零散生成随机方块

实验版本：26.2

此效果的相关数据包：https://github.com/kaer-3058/gold_in_wilderness_mcdatapack

设计灵感来源于这个视频：

[【Minecraft】当《我的世界》每一层都是随机方块，能通关吗？！-哔哩哔哩](https://b23.tv/fNgpJPV)

那么随机来源是什么呢？当然还是噪声。然后发现由于噪声不能缓存，因此每一层随机貌似做不了，但是可以试试每个位置随机。

**1**. 让gpt设计了一个很零碎的噪声，这样采样可以足够随机。便是上文那个"scattered_random"噪声。

**2**. 让gpt对噪声采样，得到噪声的主体的值分布区间。

![GPT采样噪声分布区间](./%E5%9B%BE%E7%89%87/GPT%E9%87%87%E6%A0%B7%E5%99%AA%E5%A3%B0%E5%88%86%E5%B8%83%E5%8C%BA%E9%97%B4.jpg)

实际上这个值还是略微保守，这是按置信率98%计算的，可以更大一点。

**3**. 让gpt写了个Python脚本从官网获取方块id。

::: details Python内容

```python
"""Export vanilla Minecraft block IDs for a selected Java Edition version.

The program uses Mojang's official version manifest and client JAR files.
It needs only Python's standard library and writes one ID per line as:
["minecraft:stone"]
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path


MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
VERSION_PATTERN = re.compile(r"^[0-9]+(?:\.[0-9]+)*(?:[-+][0-9A-Za-z.-]+)?$")
BLOCKSTATE_PATTERN = re.compile(r"^assets/minecraft/blockstates/([^/]+)\.json$")


def download_json(url: str) -> dict:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "minecraft-block-id-exporter/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def get_client_url(version: str) -> str:
    manifest = download_json(MANIFEST_URL)
    for version_entry in manifest.get("versions", []):
        if version_entry.get("id") == version:
            version_metadata = download_json(version_entry["url"])
            return version_metadata["downloads"]["client"]["url"]
    raise ValueError(
        f"找不到版本 {version!r}。请确认这是 Minecraft Java Edition 的有效版本号。"
    )


def get_block_ids(client_jar: Path) -> list[str]:
    with zipfile.ZipFile(client_jar) as archive:
        block_ids = {
            match.group(1)
            for file_name in archive.namelist()
            if (match := BLOCKSTATE_PATTERN.match(file_name))
        }
    return [f"minecraft:{name}" for name in sorted(block_ids)]


def download_client(version: str, target: Path) -> None:
    url = get_client_url(version)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "minecraft-block-id-exporter/1.0"},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        target.write_bytes(response.read())


def main() -> int:
    version = sys.argv[1].strip() if len(sys.argv) > 1 else input(
        "请输入 Minecraft Java 版本号（例如 1.20.1）："
    ).strip()

    if not VERSION_PATTERN.fullmatch(version):
        print("版本号格式不正确，例如：1.20.1 或 1.21", file=sys.stderr)
        return 2

    output_path = Path.cwd() / f"minecraft_{version}_block_ids.txt"
    cache_dir = Path.cwd() / ".minecraft_block_id_cache"
    client_jar = cache_dir / f"client-{version}.jar"

    try:
        cache_dir.mkdir(exist_ok=True)
        if not client_jar.exists():
            print(f"正在从 Mojang 官方服务器下载 {version} 客户端...")
            download_client(version, client_jar)

        block_ids = get_block_ids(client_jar)
        if not block_ids:
            raise ValueError("客户端 JAR 中没有找到方块状态文件，可能不是受支持的版本。")

        output_path.write_text(
            "\n".join(f'["{block_id}"]' for block_id in block_ids) + "\n",
            encoding="utf-8",
        )
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, ValueError, zipfile.BadZipFile) as error:
        print(f"处理失败：{error}", file=sys.stderr)
        if client_jar.exists() and client_jar.stat().st_size == 0:
            client_jar.unlink()
        return 1

    print(f"已输出 {len(block_ids)} 个方块 ID：{output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

:::

但这个列表有点问题，例如展示框id也在列表里。

**4**. 图：噪声值的分布的MC版可视化

![零碎噪声的值的分布可视化](./%E5%9B%BE%E7%89%87/%E9%9B%B6%E7%A2%8E%E5%99%AA%E5%A3%B0%E7%9A%84%E5%80%BC%E7%9A%84%E5%88%86%E5%B8%83%E5%8F%AF%E8%A7%86%E5%8C%96.jpg)

按照非保守理论区间，即按`[-1,1]`为基底估计的噪声分布区间（minecraft内部是按照保守的[-2,2]计算），然后把这个区间正值部分按五段均分，从0到区间边缘的着色为：黑色、棕色、灰色、淡灰色、白色，基底是砂岩。\
负值部分按绝对值划分，与正值部分相同着色。

可以看出，**minecraft噪声的值的分布不是均匀分布**，是一个较多值趋近于0附近的分布，可以近似为正态分布。

于是，假设噪声值服从正态分布，然后对其按照概率密度拆分区间，拆分数等于方块随机列表长度，这样一段噪声区间可以对应一种方块。

以下是一段比较无聊的数学计算：

::: details 数学计算

取正态分布的CDF（累计分布函数）为 $F(x)$ ，其反函数为 $F^{-1}(x)$ 。

设采样区间为 $[a,b]$ ，按正态分布近似。均值：

$$
\mu=\frac{1}{n}
$$

标准差：

$$
\sigma=\frac{b-a}{2F^{-1}\left(1-\frac{1}{n}\right)}
$$

则每个区间的分界值为：

$$
b_k=\mu+\sigma \cdot F^{-1}\left(\mu+\frac{\left(1-\frac{2}{n} \right)k}{n} \right)
$$

正态分布的PDF（概率密度函数）为：

$$
\frac{1}{\sigma \sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

有高斯误差函数，定义为：

$$
\mathrm{erf}(x)=\frac{2}{\sqrt{\pi}}\int_0^x{e^{-t^2}\,\mathrm{d}t}
$$

因此正态分布的CDF为：

$$
F(x)=\frac{1}{2}\left(1+\mathrm{erf}\left(\frac{x-\mu}{\sigma \sqrt{2}} \right) \right)
$$

于是就有：

$$
F^{-1}(x)=\mu+\sigma \sqrt{2}\,\mathrm{erf}^{-1}(2x-1)
$$

有逆误差函数的近似公式：

$$
\mathrm{erf}^{-1}\left( x \right) \approx \mathrm{sgn} \left( x \right) \cdot \sqrt{\sqrt{\left( \frac{2}{\pi a}+\frac{\ln \left( 1-x^2 \right)}{2} \right) ^2-\frac{\ln \left( 1-x^2 \right)}{a}}-\left( \frac{2}{\pi a}+\frac{\ln \left( 1-x^2 \right)}{2} \right)}
$$

常数a的一个较好的取值是0.147。

公式来源：https://en.wikipedia.org/wiki/Error_function#Approximation_with_elementary_functions

于是便可以计算采样区间分界值 $b_k$ 了。

问题来了，计算标准差时需要分布函数的逆函数，而计算分布函数的逆函数需要方差，这不自相矛盾吗？实际上，我计算方差时使用的是标准正态分布的分布函数的逆函数，即：

$$
\sqrt{2}\,\mathrm{erf}^{-1}(2x-1)
$$

:::

**5**. 然后计算得到这些区间分界值，就得到了随机表。

![mma计算得到的分界值](./%E5%9B%BE%E7%89%87/mma%E8%AE%A1%E7%AE%97%E5%BE%97%E5%88%B0%E7%9A%84%E5%88%86%E7%95%8C%E5%80%BC.jpg)

**6**. 我直接在噪声设置的表面规则里塞了一整个随机表。

![json里的随机表](./%E5%9B%BE%E7%89%87/json%E9%87%8C%E7%9A%84%E9%9A%8F%E6%9C%BA%E8%A1%A8.jpg)

综上，零碎噪声+正态分布近似+按概率密度分配噪声值区间，就得到了近似于均匀分布的随机数。这样就做到了在表面规则里手搓列表随机。

理论上应该还有更好的近似方法，然而我概率论实际上也是浅学的。鉴于真的使用数理统计方法去严格检验噪声的分布的工作量较大，所以这方面工作如果有读者感兴趣可以来完善一下。

**7**. 最后，如果直接在世界上每个位置生成，因为方块实体和不完整方块太多，会非常卡。因此我采用了基于对噪声采样的随机零散生成。

效果预览（随机方块的放置）：

![效果1](./%E5%9B%BE%E7%89%87/%E6%95%88%E6%9E%9C1.jpg)
