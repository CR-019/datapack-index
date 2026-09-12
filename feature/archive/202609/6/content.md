---
title: '全实体“乘骑座位高度”探究'
---


<FeatureHead
title='骑上去的一瞬间，你被抬高了多少？全实体“乘骑座位高度”探究'
authorName='我吃大白菜'
/>

## 前言

当你骑着马在原野上飞驰，或是骑着驴，忽然想cos一把倒骑毛驴的阿凡提；又或者，你手一痒敲了条命令，把自己塞到一只恶魂、一头凋灵、甚至一条末影龙身上时，你是否想过，**在你“坐上去”的那一刻，你的身体，到底被抬到了多高的位置？**

## 为什么要研究这个

说实话，用途可能不大，但毕竟也算个小发现。我个人是把它用在**动画实体的乘骑**上。至于还能拿它玩出什么花样，就交给各位读者去开发了。

## 抬升高度是怎么算出来的

游戏给每个实体都记了几个“挂点”，其中管乘客的那个叫 **乘客点（`PASSENGER`）**：谁骑上来，就把谁放到这个点。它的缺省规则写在 `EntityAttachment` 里，没特别指定时，乘客点就落在**身高的最顶端**（`AT_HEIGHT`）：

> 下面的 Java 都由 26.1.2 的反编译字节码还原。

```
public enum EntityAttachment {
    PASSENGER(Fallback.AT_HEIGHT),   // 谁骑我 → 缺省坐在我“身高顶端”
    VEHICLE  (Fallback.AT_FEET),     // 我骑谁 → 我的参考点在“脚底”
    NAME_TAG (Fallback.AT_HEIGHT), WARDEN_CHEST(Fallback.AT_CENTER);
}
enum Fallback {
    AT_FEET  { List<Vec3> create(float w, float h){ return List.of(Vec3.ZERO);          } },  // (0, 0,   0)
    AT_HEIGHT{ List<Vec3> create(float w, float h){ return List.of(new Vec3(0, h,   0)); } },  // (0, 身高, 0)
    AT_CENTER{ List<Vec3> create(float w, float h){ return List.of(new Vec3(0, h/2, 0)); } };
}
```

摆放乘客的逻辑在 `Entity` 里：先算出载体给的座位（`载体位置 + 乘客点`，而且乘客点会被载体的 `scale` 一起缩放），再减掉乘客自己的参考点：

```
public Vec3 getPassengerRidingPosition(Entity passenger) {
    return position().add(getPassengerAttachmentPoint(passenger, getDimensions(getPose()), getScale()));
}
protected void positionRider(Entity passenger, MoveFunction move) {
    Vec3 seat = getPassengerRidingPosition(passenger);      // 载体给的座位
    Vec3 self = passenger.getVehicleAttachmentPoint(this);  // 乘客自己的参考点(展示实体=脚底=0)
    move.accept(passenger, seat.x - self.x, seat.y - self.y, seat.z - self.z);
}
```

展示实体（`item_display` 这类）自己的参考点就在脚底（0），于是它**正好落在载体的乘客点上**。所以问题只剩一个：每种实体的乘客点到底是多少？

一部分怪没特别设，就用“身高顶端”（例如骷髅、村民）。但**很多实体，不只是坐骑，连僵尸、尸壳这些普通怪也硬编码了自定义值**。这个数写死在代码里，跟碰撞箱没有固定关系，甚至可能**高过头顶**。比如尸壳：

```
HUSK = register("husk", EntityType.Builder.of(Husk::new, MobCategory.MONSTER)
    .sized(0.6f, 1.95f)              // 碰撞箱:宽 0.6、高 1.95
    .eyeHeight(1.74f)
    .passengerAttachments(2.075f)    // ← 乘客坐 2.075,硬编码,比头顶高 0.125
    .ridingOffset(-0.7f)             // (这是“husk 骑别人”时的偏移,与“谁骑 husk”无关)
    .clientTrackingRange(8).notInPeaceful());
```

碰撞箱才 1.95 高，乘客点却写死成 **2.075**（比头顶高 0.125，多半是想让骑手“站”在头上、而不是陷进脑袋）；僵尸同理是 2.0125。

```
ldc  #1121  // float 1.95f     ← sized 的高
invokevirtual EntityType$Builder.sized:(FF)
ldc  #947   // float 1.74f
invokevirtual EntityType$Builder.eyeHeight:(F)
iconst_1; newarray float; dup; iconst_0
ldc  #1335  // float 2.075f    ← 塞进 passengerAttachments 的值
fastore
invokevirtual EntityType$Builder.passengerAttachments:([F)
```

反过来，坐骑常让你**坐进身体里**：马的乘客点只有 **1.44375**，比 1.6 的马背还低（你是坐进鞍里）。另外有 9 个实体（马 / 驴 / 羊驼 / 骆驼 / 鸡 / 狐狸 / 青蛙 / 海龟 / 狼 / 劫掠兽 / 快乐恶魂）用的是 `Vec3(0, 座位Y, 前后偏移)` 的写法，**座位高是第一个 `Y`**：

```
HORSE = register("horse", EntityType.Builder.of(Horse::new, MobCategory.ANIMAL)
    .sized(1.3964844f, 1.6f).eyeHeight(1.52f)
    .passengerAttachments(1.44375f));               // 单值:坐 1.44375

WOLF = register("wolf", EntityType.Builder.of(Wolf::new, MobCategory.ANIMAL)
    .sized(0.6f, 0.85f).eyeHeight(0.68f)
    .passengerAttachments(new Vec3(0.0, 0.81875, -0.0625)));  // Y=0.81875 才是座位高,-0.0625 是前后偏移
```

（灾厄村民传的是**空**乘客点，属特殊情况，表里按“坐头顶”近似。矿车 `0.1875` 几乎贴轨道、骆驼是前后双座，也都各自写死。）

当你骑上去，你的脚就被挪到 `载体位置 + 座位高度 × scale`。总结出来就是，**你被抬多高 = 那个载体的“座位高度”。** 剩下的就是把每种实体的这个数字读出来。

> 数据取自 Minecraft 26.1.2。为排除魔改可能性，用了两份**官方 Mojang 映射**的类：Purpur 服务端里的，和官方 bundler 里**未打任何补丁的原版** `server-26.1.2.jar`，把全部 57 个自定义乘客点**逐个对比，完全一致**。

## 常见实体的座位高度

单位是方块（`scale=1`）。★ = 游戏单独设的自定义座位，其余 = “坐头顶”（等于身高）。

| 载体 | 座位高度 | 备注        |
|---|---|-----------|
| 末影龙 ender_dragon ★ | 3.00 | 坐龙背       |
| 监守者 warden ★ | 3.15 |           |
| 恶魂 ghast ★ | 4.06 | 全场最高      |
| 铁傀儡 iron_golem | 2.70 | 坐头顶       |
| 骆驼 camel ★ | 2.375 | **双座**    |
| 女巫 witch ★ | 2.26 |           |
| 尸壳 husk ★ | **2.075** |           |
| 僵尸 zombie ★ | **2.0125** | 和尸壳略有不同！  |
| 骷髅 skeleton | 1.99 | 坐头顶       |
| 村民 villager | 1.95 | 坐头顶       |
| **马 horse ★** | **1.44375** | 坐进鞍里，比马背低 |
| 驴 donkey ★ | 1.11 | 阿凡提就坐这么高  |
| 羊驼 llama ★ | 1.37 |           |
| 牛 cow ★ | 1.37 |           |
| 猪 pig ★ | 0.87 | 胡萝卜钓竿骑的那位 |
| 狼 wolf ★ | 0.82 |           |
| 蜘蛛 spider ★ | 0.765 | 蜘蛛骑士      |
| 鸡 chicken ★ | 0.70 | 鸡骑士就是蹲这儿  |
| 船 boat ★ | 0.5625 | 坐得很低，双座   |
| **矿车 minecart ★** | **0.1875** | 几乎贴着轨道    |

## 全实体座位高度总表

下面是26.1版本中所有能确定数值的实体（157 个，含飞行物/掉落物等一切有乘客点的实体）。按高度从高到低。`0（无碰撞）` = 标记/展示实体这类没有体积的，乘客坐在原点。

<details>
<summary>点开查看完整表格</summary>

| 实体 id | 座位高度 |
|---|---|
| `giant` | 12.0 |
| `ghast` | 4.0625 |
| `wither` | 3.5 |
| `warden` | 3.15 |
| `ender_dragon` | 3.0 |
| `enderman` | 2.80625 |
| `iron_golem` | 2.7 |
| `creaking` | 2.7 |
| `wither_skeleton` | 2.4 |
| `camel` | 2.375 |
| `camel_husk` | 2.375 |
| `elder_guardian` | 2.350625 |
| `witch` | 2.2625 |
| `ravager` | 2.2625 |
| `zombie_villager` | 2.125 |
| `sniffer` | 2.09375 |
| `husk` | 2.075 |
| `zombie` | 2.0125 |
| `drowned` | 2.0125 |
| `piglin` | 2.0125 |
| `piglin_brute` | 2.0125 |
| `zombified_piglin` | 2.0125 |
| `stray` | 1.99 |
| `skeleton` | 1.99 |
| `bogged` | 1.99 |
| `parched` | 1.99 |
| `armor_stand` | 1.975 |
| `villager` | 1.95 |
| `wandering_trader` | 1.95 |
| `vindicator` | 1.95 |
| `pillager` | 1.95 |
| `evoker` | 1.95 |
| `illusioner` | 1.95 |
| `snow_golem` | 1.9 |
| `blaze` | 1.8 |
| `player` | 1.8 |
| `mannequin` | 1.8 |
| `breeze` | 1.77 |
| `strider` | 1.7 |
| `happy_ghast` | 1.7 |
| `creeper` | 1.7 |
| `zoglin` | 1.49375 |
| `hoglin` | 1.49375 |
| `horse` | 1.44375 |
| `polar_bear` | 1.4 |
| `llama` | 1.37 |
| `trader_llama` | 1.37 |
| `cow` | 1.36875 |
| `mooshroom` | 1.36875 |
| `zombie_horse` | 1.31875 |
| `skeleton_horse` | 1.31875 |
| `panda` | 1.25 |
| `shulker` | 1.2375 |
| `sheep` | 1.2375 |
| `mule` | 1.2125 |
| `nautilus` | 1.1375 |
| `zombie_nautilus` | 1.1375 |
| `goat` | 1.1125 |
| `donkey` | 1.1125 |
| `dragon_fireball` | 1.1125 |
| `tnt` | 0.98 |
| `falling_block` | 0.98 |
| `fireball` | 0.98 |
| `copper_golem` | 0.98 |
| `guardian` | 0.975 |
| `bat` | 0.9 |
| `pig` | 0.86875 |
| `wolf` | 0.81875 |
| `squid` | 0.8 |
| `glow_squid` | 0.8 |
| `evoker_fangs` | 0.8 |
| `spider` | 0.765 |
| `vex` | 0.7375 |
| `chicken` | 0.7 |
| `pufferfish` | 0.7 |
| `armadillo` | 0.65 |
| `ocelot` | 0.6375 |
| `fox` | 0.6375 |
| `rabbit` | 0.6 |
| `dolphin` | 0.6 |
| `bee` | 0.6 |
| `allay` | 0.6 |
| `boat`（各木种/竹筏，含运输船） | 0.5625 |
| `turtle` | 0.55625 |
| `slime` | 0.52 |
| `magma_cube` | 0.52 |
| `cat` | 0.5125 |
| `cave_spider` | 0.5 |
| `arrow` / `spectral_arrow` / `trident` | 0.5 |
| `item_frame` / `glow_item_frame` / `painting` / `leash_knot` | 0.5 |
| `experience_orb` / `area_effect_cloud` | 0.5 |
| `parrot` | 0.4625 |
| `axolotl` | 0.42 |
| `salmon` / `tropical_fish` | 0.4 |
| `frog` | 0.375 |
| `phantom` | 0.3375 |
| `wither_skull` / `wind_charge` / `breeze_wind_charge` / `small_fireball` / `shulker_bullet` | 0.3125 |
| `cod` / `tadpole` | 0.3 |
| `egg` / `snowball` / `ender_pearl` / `splash_potion` / `lingering_potion` | 0.25 |
| `experience_bottle` / `eye_of_ender` / `firework_rocket` / `fishing_bobber` | 0.25 |
| `item` / `llama_spit` / `ominous_item_spawner` / `end_crystal` | 0.25 |
| `silverfish` | 0.2375 |
| `endermite` | 0.2375 |
| `minecart`（各类） | 0.1875 |
| `lightning_bolt` | 0.0625 |
| `marker` / `item_display` / `block_display` / `text_display` / `interaction` | 0（无碰撞） |

</details>

## 结语

骑上去能抬多高这个问题，以前我一直搞不懂到底是个什么规则。今日心血来潮翻了翻源代码，方才恍然大悟。用途嘛，前面也说了，可能真不大。但能把它挖清楚，这过程本身也挺有成就感的。至于这些数字往后能被谁、拿去玩出点什么，就交给屏幕前的你了。