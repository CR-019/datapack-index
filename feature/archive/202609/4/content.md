---
title: '魔咒数据组件教程'
---


<FeatureHead
title='魔咒数据组件教程'
authorName='晓舒迢'
cover="../_assets/4.png"
/>

### 摘要

在 **Minecraft 1.21** 版本中，魔咒被正式改造为数据驱动内容，成为原版开发“牢三门”（魔咒、村民交易、药水效果）中最先上岸的一个。通过数据驱动的方式，开发者现在可以为魔咒定义多种触发器与效果器，从而实现更加灵活且可控的功能设计，也让许多过去难以实现的想法变得可行.

不过，对于大多数数据包作者来说，这一系统仍然具有一定的上手门槛。魔咒数驱作为新增内容，相关资料较为零散，加之其属于实验性内容，不能够热重载，一旦配置出错存档就会直接进入安全模式，这也让不少开发者在实际尝试时有所顾虑。

目前中文社区无论是 Wiki 还是视频教程，对于各类魔咒效果组件的教程大多停留在表面，缺乏系统性的整理与实际应用示例，这也使得不少开发者即便了解基础结构，也难以真正将其运用到数据包中。

因此，本文将从实用角度出发对各个魔咒效果组件进行逐一讲解（**部分通过查阅原版魔咒就能直接上手的组件会直接跳过，如三叉戟旋转攻击力度和弩装填声音**），并结合**实例**说明其使用方法。同时也会整理在编写过程中常见的问题与注意事项，帮助你更顺利地上手这一系统。

### 引言

**该教程的编写版本为 26.2**

在开始讲解魔咒之前，请先确保你对[战利品表谓词](https://zh.minecraft.wiki/w/谓词)以及[魔咒定义格式](https://zh.minecraft.wiki/w/魔咒定义格式)有基础的了解，这两部分内容是理解魔咒数驱的关键前置知识：前者主要用于条件判断，决定某个效果是否能够被触发；后者则定义了整个魔咒的数据结构，是后续编写的基础框架。

如果你此前没有接触过相关内容，建议先进行简单的查阅与实践，例如尝试编写一个基础谓词，或阅读原版的魔咒定义文件，了解其基本结构，这样在后续学习各类效果组件时会更容易理解其运作方式，而不是停留在“照抄配置”的层面。

完成上述准备后，我们就可以正式进入魔咒效果组件的讲解部分。接下来将以首字母A~Z排序的组件开始逐一讲解。

### 概念

魔咒所产生的实际影响主要由若干个魔咒效果组件控制

| 普通值效果型 | 带谓词的值效果型组件 | 带目标和谓词的值效果型 |
| :---------: | :---------: | :---------: |
|`•crossbow_charge_time` </br> `•trident_spin_attack_strength`|`•ammo_use` </br> `•block_experience` </br> `•item_damage` </br> `•projectile_piercing` </br> `•repair_with_xp` </br> `•armor_effectiveness` </br> `•damage` </br> `•damage_protection` </br> `•knockback` </br> `•smash_damage_per_fallen_block` </br> `•mob_experience`  </br> `•fishing_luck_bonus`  </br> `•fishing_time_reduction`  </br> `•projectile_count`  </br> `•projectile_spread`  </br> `•trident_return_acceleration` | `•equipment_drops`|

| 带谓词的实体效果型 | 带目标和谓词的实体效果型 | 位置依赖效果型 |
| :---------: | :---------: | :---------: |
| `•tick`  </br> `•post_piercing_attack`  </br> `•projectile_spawned`  </br> `•hit_block` | `•post_attack` | `•location_changed` |

| 伤害免疫组件 | 其他魔咒效果组件 |
| :---------: | :---------: |
| `•damage_immunity` | `•attributes` </br>  `•crossbow_charging_sounds` </br> `•trident_sound`  </br> `•prevent_armor_change`  </br> `•prevent_equipment_drop` |

在本篇教程中，下列名词被赋予了特殊定义

| 通用谓词 | 不可用谓词 |
| :---------: | :---------: |
| 可随意使用的谓词列表 | 不允许使用的谓词列表（安全模式警告） |
|`•random_chance` </br> `•random_chance_with_enchanted_bonus` </br> `•value_check` </br> `•weather_check` </br> `•time_check`|`•killed_by_player` </br> `•reference` </br> `•table_bonus` </br> `•survives_explosion` |

### 魔咒效果组件

#### **ammo_use**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 此弓发射或此弩装载时消耗的弹射物物品数量，计算结果向下取整 | `enchanted_item:` </br> `•tool：此物品（在此处指装载的弹射物）` </br> `•enchantment_level：魔咒等级` | 1 | `•通用谓词` </br> `•match_tool` |

查阅[无限](https://misode.github.io/enchantment/?version=26.2&preset=infinity)魔咒json：

```json
    "minecraft:ammo_use": [
      {
        "effect": {
          "type": "minecraft:set",
          "value": 0
        },
        "requirements": {
          "condition": "minecraft:match_tool",
          "predicate": {
            "items": "minecraft:arrow"
          }
        }
      }
    ]
```

通过阅读我们得知，当玩家**装填箭矢到弩或使用弓射出箭矢**后消耗的箭矢数量为0,但光灵箭仍然会被消耗，为了将这俩一视同仁，我们可以修改为：

```json
"items":["minecraft:arrow","minecraft:spectral_arrow"]
```

重进存档，我们就能发现射出光灵箭也不消耗了

#### **armor_effectiveness**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 此物品提供的伤害减免比例，计算结果小于0则视为0，大于1则视为1。物品须装备在slots中 | `enchanted_damage:` </br> `•this_entity：受伤或死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` </br> `•enchantment_level：魔咒等级` |  仅使用物品护甲值和盔甲韧性</br>计算得到的伤害减免比例  | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check`|

查阅[破甲](https://misode.github.io/enchantment/?version=26.2&preset=breach)魔咒json：

```json
    "minecraft:armor_effectiveness": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": -0.15,
            "per_level_above_first": -0.15
          }
        }
      }
    ]
```

通过阅读得知，玩家**主手**持有该附魔的物品时造成伤害每级均无视对方0.15护甲系数，但在1.21.11的更新中加入了矛，**矛放在副手进行冲锋的攻击方式**也能吃到主手的**破甲加成**，若要修复该问题，可以补充伤害来源谓词：

```json
    "minecraft:armor_effectiveness": [
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "tags": [
                {
                  "id": "minecraft:spear",
                  "expected": false
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": -0.15,
            "per_level_above_first": -0.15
          }
        }
      }
    ]
```

注意到原版并没有spear伤害标签，你需要在minecraft命名空间下自己注册一个伤害标签并把spear伤害类型纳入
聪明的你突发奇想，想做一个名为**融透**的附魔，作用是**受击者身上着火**且**攻击者带有抗火效果**时削弱**0.4**护甲系数，通过查询允许使用的谓词表，你很快写出来了

```json
    "minecraft:armor_effectiveness": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "flags": {
                "is_on_fire": true
              }
            }
          },
          {
            "condition": "minecraft:entity_properties",
            "entity": "attacker",
            "predicate": {
              "effects": {
                "minecraft:fire_resistance": {}
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": -0.40
        }
      }
    ]
```

#### **attributes**

查阅[迅捷潜行](https://misode.github.io/enchantment/?version=26.2&preset=swift_sneak)魔咒json：

```json
    "minecraft:attributes": [
      {
        "amount": {
          "type": "minecraft:linear",
          "base": 0.15,
          "per_level_above_first": 0.15
        },
        "attribute": "minecraft:sneaking_speed",
        "id": "minecraft:enchantment.swift_sneak",
        "operation": "add_value"
      }
    ]
```

属性效果组件用于为装备此物品的生物提供临时性的属性修饰符，物品需装备在slots中才生效

#### **block_experience**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 使用此物品挖掘方块后方块掉落的经验球的经验值，计算结果向下取整 | `enchanted_item:` </br> `•tool：此物品` </br> `•enchantment_level：魔咒等级` | 挖掘此方块所掉落的经验值（取决于方块）| `•通用谓词` </br> `•match_tool` |

查阅[精准采集](https://misode.github.io/enchantment/?version=26.2&preset=silk_touch)魔咒json：

```json

    "minecraft:block_experience": [
      {
        "effect": {
          "type": "minecraft:set",
          "value": 0
        }
      }
    ]
```

注意到使用普通镐子挖掘矿物会掉落经验，而带有精准采集的不会，原因在于魔咒发挥作用将掉落的经验量设为了0
你打算让**带有经验修补且耐久不为满**的**精准采集镐**挖掘矿物会**掉落少量经验用于修复自身耐久**，通过查询可使用的谓词表很快就写出来了：

```json
    "minecraft:block_experience": [
      {
        "requirements": [
          {
            "condition": "minecraft:any_of",
            "terms": [
              {
                "condition": "minecraft:inverted",
                "term": {
                  "condition": "minecraft:match_tool",
                  "predicate": {
                    "predicates": {
                      "minecraft:enchantments": [
                        {
                          "enchantments": "minecraft:mending"
                        }
                      ]
                    }
                  }
                }
              },
              {
                "condition": "minecraft:match_tool",
                "predicate": {
                  "predicates": {
                    "minecraft:damage": {
                      "damage": 0
                    },
                    "minecraft:enchantments": [
                      {
                        "enchantments": "minecraft:mending"
                      }
                    ]
                  }
                }
              }
            ]
          }
        ],
        "effect": {
          "type": "minecraft:set",
          "value": 0
        }
      },
      {
        "requirements": [
          {
            "condition": "minecraft:match_tool",
            "predicate": {
              "predicates": {
                "minecraft:damage": {
                  "damage": {"min": 1}
                },
                "minecraft:enchantments": [
                  {
                    "enchantments": "minecraft:mending"
                  }
                ]
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:set",
          "value": 2
        }
      }
    ]
```

#### **crossbow_charge_time**

查阅[快速装填](https://misode.github.io/enchantment/?version=26.2&preset=quick_charge)附魔的json：

```json
    "minecraft:crossbow_charge_time": {
      "type": "minecraft:add",
      "value": {
        "type": "minecraft:linear",
        "base": -0.25,
        "per_level_above_first": -0.25
      }
    }
```

显而易见，其作用是每级减少**0.25秒**的完全装填所需时间

#### **crossbow_charging_sounds**

略

#### **damage**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 使用此物品攻击时造成的伤害，即魔咒攻击力 | `enchanted_damage:` </br> `•this_entity：受伤或死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 生物的基础近战攻击力 | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check`|

查阅[亡灵杀手](https://misode.github.io/enchantment/?version=26.2&preset=smite)的附魔json：

```json
   "minecraft:damage": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 2.5,
            "per_level_above_first": 2.5
          }
        },
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "this",
          "predicate": {
            "entity_type": "#minecraft:sensitive_to_smite"
          }
        }
      }
    ] 
```

对于在标签集 **#sensitive_to_smite** 内的生物，每级增加**2.5**的伤害，这就是亡灵杀手的生效条件与效果
同样的，副手的矛也可以吃主手锋利的加成，修改方式与上文的破甲示例相同

#### **damage_immunity**

|   战利品上下文   |   允许使用的谓词   |
| :-------------: | :---------------: |
| `enchanted_damage:` </br> `•this_entity：被攻击的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：被攻击的实体的位置` </br> `•enchantment_level：魔咒等级` | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check`|

查阅[冰霜行者](https://misode.github.io/enchantment/?version=26.2&preset=frost_walker)附魔的json：

```json
    "minecraft:damage_immunity": [
      {
        "effect": {},
        "requirements": {
          "condition": "minecraft:damage_source_properties",
          "predicate": {
            "tags": [
              {
                "expected": true,
                "id": "minecraft:burn_from_stepping"
              },
              {
                "expected": false,
                "id": "minecraft:bypasses_invulnerability"
              }
            ]
          }
        }
      }
    ]    
```

当玩家穿戴冰霜行者靴时**免疫 #burn_from_stepping** 且不在 **#bypasses_invulnerability** 标签集内的伤害类型，这就是穿着冰霜靴踩在岩浆块和篝火上**不会受到燃烧伤害的原因**
玩家在高空建筑时经常会被幻翼骚扰，查询了可用谓词表写出如下附魔：

```json
    "minecraft:damage_immunity": [
      {
        "effect": {},
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "attacker",
            "predicate": {
              "entity_type": "minecraft:phantom"
            }
          }
        ]
      }
    ]
```

现在的幻翼变得人畜无害了，只不过叫声挺烦人的

#### **damage_protection**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: |
| 此物品提供的魔咒保护系数。物品须装备在slots中 | `enchanted_damage:` </br> `•this_entity：受伤或死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[弹射物保护](https://misode.github.io/enchantment/?version=26.2&preset=projectile_protection)附魔的json：

```json
    "minecraft:damage_protection": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 2,
            "per_level_above_first": 2
          }
        },
        "requirements": {
          "condition": "minecraft:damage_source_properties",
          "predicate": {
            "tags": [
              {
                "expected": true,
                "id": "minecraft:is_projectile"
              },
              {
                "expected": false,
                "id": "minecraft:bypasses_invulnerability"
              }
            ]
          }
        }
      }
    ]
```

可得每级提供**2点**对 **#is_projectile** 标签集内伤害的魔咒保护系数 (**EPF**)，即 2x4%=8% (1 EPF= 4%)的伤害减免，上限为**80%** (即**20EPF**)
众所周知，摔落保护一直有个缺点，那就是无法**减免鞘翅飞行撞墙带来的动能伤害**，为了**减少玩家的坠机率**，你查询了允许的谓词表写出了以下魔咒：

```json
    "minecraft:damage_protection": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "flags": {
                "is_fall_flying": true
              }
            }
          },
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "tags": [
                {
                  "id": "minecraft:fly_into_wall",
                  "expected": true
                },
                {
                  "id": "minecraft:bypasses_invulnerability",
                  "expected": false
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 3,
            "per_level_above_first": 3
          }
        }
      }
    ]
```

注意到原版不存在 **#fly_into_wall** 的伤害标签集，**你需要自己动手完成**，流程参考上文的 #spear

#### **equipment_drops**

| 行为 | 战利品上下文 | 效果输入参数 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: |
| 生物盔甲槽位和主副手的物品的掉落概率，计算结果大于1则等同于1，小于0则等同于0</br>物品须装备在slots中且只要此物品装备在slots中，会影响所有物品的掉落概率而非只影响此物品 | `enchanted_damage:` </br> `•this_entity：死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 生物各槽位的原始掉落概率，即`drop_chances` | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[抢夺](https://misode.github.io/enchantment/?version=26.2&preset=looting)附魔的json：

```json
    "minecraft:equipment_drops": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 0.01,
            "per_level_above_first": 0.01
          }
        },
        "enchanted": "attacker",
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "attacker",
          "predicate": {
            "entity_type": "minecraft:player"
          }
        }
      }
    ]
```

**enchanted**：在**slots**内装备此物品时，指定该效果在**攻击时**还是**被攻击时**生效，即该物品所在的实体为**攻击者**还是被**攻击者**时才生效;
为**attacker**时：**攻击的源发实体装备此物品直接或间接杀死一个实体**时生效;
为**victim**时：**被攻击而受伤的实体装备有此物品并被其他实体杀死**时生效
虽说是抢夺，但大多时候怪物随身掉落的装备都非常占位子，建造手砍刷怪塔还得给这些不可堆叠的垃圾分类，因此你做出了如下改动：

```json
    "effect": {
          "type": "minecraft:set",
          "value": 0
        }
```

#### **fishing_luck_bonus**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 使用此物品钓鱼增加的幸运程度，即影响战利品表中的`bonus_rolls`和`quality`，计算结果向下取整，小于0则视为0 | `enchanted_entity:` </br> `•this_entity：玩家` </br> `•origin：`玩家位置 </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[海之眷顾](https://misode.github.io/enchantment/?version=26.2&preset=luck_of_the_sea)魔咒json：

```json
    "minecraft:fishing_luck_bonus": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 1,
            "per_level_above_first": 1
          }
        }
      }
    ]
```

你想写一个**夜间钓鱼**获得额外**I级**幸运加成，**满月时再叠加I级**的魔咒，在查询可用谓词表后写出：

```json
    "minecraft:fishing_luck_bonus": [
      {
        "requirements": [
          {
            "condition": "minecraft:time_check",
            "clock": "minecraft:overworld",
            "value": {
              "min": 13800,
              "max": 22200
            },
            "period": 24000
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": 1
        }
      },
      {
        "requirements": [
          {
            "condition": "minecraft:time_check",
            "clock": "minecraft:overworld",
            "value": {
              "min": 13800,
              "max": 22200
            },
            "period": 192000
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": 1
        }
      }
    ]
```

#### **fishing_time_reduction**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 使用此物品钓鱼减少的等待时间，以秒为单位，计算结果小于0则视为0 | `enchanted_entity:` </br> `•this_entity：玩家` </br> `•origin：`玩家位置 </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[饵钓](https://misode.github.io/enchantment/?version=26.2&preset=lure)魔咒json：

```json
    "minecraft:fishing_time_reduction": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 5,
            "per_level_above_first": 5
          }
        }
      }
    ]
```

钓鱼的最长时间为**30s**，如果用命令获得**高于V级的饵钓**，钓鱼时会使得等待时间小于等于0，系统会反复在下一刻生成一个新的等待时间，这样将**永远不会上钩**

#### **hit_block**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 玩家刚开始挖掘方块，或箭、三叉戟实体击中方块 </br> 忽略slots字段 | `hit_block:` </br> `•this_entity：此玩家或箭、三叉戟实体` </br> `•origin：若为玩家挖掘方块，则为方块的正中心；若为箭、三叉戟击中方块则为击中点的位置` </br> `•block_state：此方块` </br>  `•enchantment_level：魔咒等级` | 此玩家或箭、三叉戟实体 | 若为玩家挖掘方块，则为方块的正中心。若为箭、三叉戟击中方块，则为击中点的位置 | `•通用谓词` </br> `•block_state_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check`|

查阅[引雷](https://misode.github.io/enchantment/?version=26.2&preset=channeling)的附魔json文件：

```json
    "minecraft:hit_block": [
      {
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:summon_entity",
              "entity": "minecraft:lightning_bolt"
            },
            {
              "type": "minecraft:play_sound",
              "pitch": 1,
              "sound": "minecraft:item.trident.thunder",
              "volume": 5
            }
          ]
        },
        "requirements": {
          "condition": "minecraft:all_of",
          "terms": [
            {
              "condition": "minecraft:weather_check",
              "thundering": true
            },
            {
              "condition": "minecraft:entity_properties",
              "entity": "this",
              "predicate": {
                "entity_type": "minecraft:trident"
              }
            },
            {
              "condition": "minecraft:location_check",
              "predicate": {
                "block": {
                  "blocks": "#minecraft:lightning_rods"
                },
                "can_see_sky": true
              }
            }
          ]
        }
      }
    ]
```

当**三叉戟在雷雨天扎中露天避雷针时生成闪电并播放音频**
尝试制作一个新魔咒，当玩家带有**蓄风**状态时**下蹲左键露天的方块**会在当前方块上表面位置产生**风爆**：

```json
    "minecraft:hit_block": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "type_specific/player": {
                "input": {"sneak": true}
              },
              "effects": {
                "minecraft:wind_charged": {}
              }
            }
          },
          {
            "condition": "minecraft:location_check",
            "predicate": {
              "can_see_sky": true
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:explode",
              "immune_blocks": "#minecraft:blocks_wind_charge_explosions",
              "knockback_multiplier": 1.2, "radius": 3.5,
              "offset": [0,0.5,0], "block_interaction": "trigger",
              "small_particle": {"type": "minecraft:gust_emitter_small"},
              "large_particle": {"type": "minecraft:gust_emitter_large"},
              "sound": "minecraft:entity.wind_charge.wind_burst"
            }
          ]
        }
      }
    ]
```

这本附魔书有概率从某个特殊宝库开出，但没有人帮忙宝库你只能开启一次
为了实现反复开启，你又想到了做一把**宝库解锁器**：

```json
   "minecraft:hit_block": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "entity_type": "minecraft:player",
              "flags": {
                "is_sneaking": true
              }
            }
          },
          {
            "condition": "minecraft:block_state_property",
            "block": "minecraft:vault",
            "properties": {
              "vault_state": "inactive"
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:play_sound",
              "sound": "minecraft:block.vault.open_shutter",
              "volume": 2, "pitch": 1
            },
            {
              "type": "minecraft:run_function",
              "function": "namespace:unlock_vault"
            }
          ]
        }
      }
    ] 
```

```mcfunction
[unlock_vault.mcfunction]
data remove block ~ ~ ~ server_data.rewarded_players
clear @s "宝库解锁器" 1
```

现在只要在**生存模式蹲下左键**未激活状态的宝库就能消耗开锁器实现“撬锁”了

#### **item_damage**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 此物品使用时消耗的耐久度，计算结果向下取整，小于0也视为0 | `enchanted_item:` </br> `•tool：此物品` </br> `•enchantment_level：魔咒等级` | 此次物品使用消耗的耐久度（取决于物品及使用方式） | `•通用谓词` </br> `•match_tool` |

查阅[耐久](https://misode.github.io/enchantment/?version=26.2&preset=unbreaking)魔咒json：

```json
    "minecraft:item_damage": [
      {
        "effect": {
          "type": "minecraft:remove_binomial",
          "chance": {
            "type": "minecraft:fraction",
            "denominator": {
              "type": "minecraft:linear",
              "base": 10,
              "per_level_above_first": 5
            },
            "numerator": {
              "type": "minecraft:linear",
              "base": 2,
              "per_level_above_first": 2
            }
          }
        },
        "requirements": {
          "condition": "minecraft:match_tool",
          "predicate": {
            "items": "#minecraft:enchantable/armor"
          }
        }
      }
    ]
```

由此可知，当耐久作用于 **#enchantable/armor** 标签集内的物品（即所有防具）时，每1耐久度消耗导致物品耐久度下降1的概率为 $(60+\frac{40}{level+1})\%$

#### **knockback**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: |
| 	使用此物品攻击生物产生额外的击退效果 </br> 横扫攻击产生的击退不受此影响 | `enchanted_damage:` </br> `•this_entity：受伤或死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 对于近战攻击,为攻击者的 </br> 击退属性`attack_knockback` </br> 对于箭和三叉戟，为0 | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[冲击](https://misode.github.io/enchantment/?version=26.2&preset=punch)魔咒json：

```json
    "minecraft:knockback": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 1,
            "per_level_above_first": 1
          }
        },
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "direct_attacker",
          "predicate": {
            "entity_type": "#minecraft:arrows"
          }
        }
      }
    ]
```

阅读代码可知，当造成攻击的直接实体为**箭矢或光灵箭**时，对受击者每级造成1点击退
查阅可用的谓词表后给**三叉戟**也做一个专属的击退附魔

```json
    "minecraft:knockback": [
      {
        "requirements": [
          {
            "condition": "minecraft:any_of",
            "terms": [
              {
                "condition": "minecraft:damage_source_properties",
                "predicate": {
                  "is_direct": true
                }
              },
              {
                "condition": "minecraft:entity_properties",
                "entity": "direct_attacker",
                "predicate": {
                  "entity_type": "minecraft:trident"
                }
              }
            ]
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 1,
            "per_level_above_first": 1
          }
        }
      }
    ]
```

不论玩家是**手持三叉戟进行近战攻击**，还是**远程投掷三叉戟**，受击者都会受到击退的影响

#### **location_changed**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 生物所在的方块位置发生变动时触发此效果；</br>生物落地时瞬间触发一次此效果；</br> 附有此魔咒的物品刚被装备时瞬间触发一次效果； </br> 玩家切换出旁观模式瞬间触发一次此效果| `enchanted_location:` </br> `•this_entity：此生物` </br> `•origin：此生物的位置` </br> `•enchantment_active：触发该效果的生物的此魔咒是否是初次生效（即刚装备上此物品或刚退出旁观模式）` </br>  `•enchantment_level：魔咒等级` | 此生物 | 此生物的位置 | `•通用谓词` </br> `•enchantment_active_check` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check`|

[灵魂疾行](https://misode.github.io/enchantment/?version=26.2&preset=soul_speed)的魔咒json阅读起来过于复杂，在这里只讲应用：
制作一个靴子专属魔咒，效果是玩家疾跑时不受空气阻力影响

```json
    "minecraft:location_changed": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "minecraft:flags": {
                "is_sprinting": true,
                "is_flying": false,
                "is_in_water": false
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:attribute",
              "attribute": "minecraft:air_drag_modifier",
              "id": "minecraft:test",
              "amount": -1,
              "operation": "add_multiplied_total"
            }
          ]
        }
      }
    ]
```

没错，location_changed组件允许使用属性效果器，很神奇吧

#### **mob_experience**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :---: | :-----------: |
| 装备该物品时杀死生物时生物掉落的经验，计算结果向下取整。此物品须装备在攻击者的slots中 | `enchanted_entity:` </br> `•this_entity：死亡的实体` </br> `•origin：死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 生物被杀死后掉落经验值（取决于生物） | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check`|

原版**没有**使用此魔咒效果组件的魔咒
不妨来制作一个专门用于提高刷怪塔经验获取效率的附魔：

```json
    "minecraft:mob_experience": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "type": [
                "minecraft:zombified_piglin",
                "minecraft:enderman",
                "minecraft:silverfish"
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:multiply",
          "factor": {
            "type": "minecraft:linear",
            "base": 1.25,
            "per_level_above_first": 0.375
          }
        }
      }
    ]
```

#### **post_attack**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 生物成功进行攻击时触发；</br>唤魔者尖牙成功攻击时触发；</br> 羊驼唾沫、潜影弹、箭、光灵箭、三叉戟、火球、小火球、由生物发射的凋零骷髅之首、风弹物品风弹和旋风人风弹成功攻击时触发；| `enchanted_damage:` </br> `•this_entity：被攻击的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` `•enchantment_level：魔咒等级` | 由`affected`指定的实体 | 由`affected`指定的实体位置 | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check`|

**enchanted**：指定该效果在攻击时还是被攻击时触发，即使用该物品的实体为**攻击者**（**attacker**）还是**被攻击者**（**victim**）时才触发。值必须为：
**attacker**：意味着伤害的**源发实体若为生物**，**使用此物品**攻击一个实体时触发此效果（**箭或三叉戟**伤害实体时，**只触发箭和三叉戟上的此效果组件，而非触发弓上的**；**其他弹射物伤害实体时，只触发主手上的，而非此弹射物上的**），前提是**slots**字段必须包含**主手**；
**victim**：意味着装备有此物品的生物被攻击时，此效果被触发，前提条件是此物品必须在有效槽位**slots**内
如果你对**attacker**内的描述感到**晦涩难懂**，没关系，刚接触时我也看不懂，后面写多了用多了就渐渐明白了，以下是我的总结：
如果你进行**近战攻击**，你需要确保该魔咒的生效槽位一定要**包含mainhand**，并且要**使用带有该附魔的物品**进行攻击，否则无论如何都无法触发，例如

```json
    "minecraft:post_attack": [
      {
        "effect": {
          "type": "minecraft:ignite",
          "duration": 10
        },
        "enchanted": "attacker",
        "affected": "victim"
      }
    ]
```

如果**slots**不包含**mainhand**，即使**手持**带有此附魔的剑攻击生物也**不会**将其**点燃**；
往**slots**添加**mainhand**后，你**偶然**又发现了新的问题：当你**主手持**附魔剑，**副手投掷风弹**时，被风弹击中的生物却**着火**了，这是因为谓词里没有声明**伤害来源特质**，这样修改即可避免问题：

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "is_direct": true
            }
          }
        ],
        "effect": {
          "type": "minecraft:ignite",
          "duration": 10
        },
        "enchanted": "attacker",
        "affected": "victim"
      }
    ]
```

现在再来看使用弓、弩和三叉戟进行的**远程攻击**，这类攻击只要**slots**包含**mainhand**就能触发，因为造成伤害的直接实体**箭矢和三叉戟**的实体数据分别带有**weapon**和**item**标签，该标签存储了带有的魔咒等数据，比如：

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "direct_attacker",
            "predicate": {
              "entity_type": "#minecraft:impact_projectiles"
            }
          }
        ],
        "effect": {
          "type": "minecraft:ignite",
          "duration": 10
        },
        "enchanted": "attacker",
        "affected": "victim"
      }
    ]
```

即使玩家发射弹射物后手中换成其他**不带该魔咒的物品**，被攻击到的生物也会**着火**

再来看**风弹、潜影弹、火球、小火球、凋零之首和唤魔者尖牙**是如何触发的，这些实体的实体数据都包含**owner或Owner**，当命中生物后进行效果结算时，游戏会检查**源发实体**的**主手**是否持有**带有对应附魔的物品**，比如一位唤魔者**主手**持有一根带有特殊魔咒的木棍，该木棍魔咒具有的组件如下：

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "direct_attacker",
            "predicate": {
              "entity_type": [
                "minecraft:evoker_fangs",
                "minecraft:shulker_bullet",
                "minecraft:wind_charge"
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:ignite",
          "duration": 10
        },
        "enchanted": "attacker",
        "affected": "victim"
      }
    ]
```

在唤魔者召唤**尖牙**对村民造成伤害后，村民**着火**了，如果生成一个潜影弹并修改**owner**为此唤魔者，该潜影弹击中村民后也会使其**着火**，但**移除**掉幻魔者手中的木棍附魔后**就不起作用**了

**enchanted为attacker**的情况先讲到这里，现在我们一边拆解原版魔咒一边讲解其他部分

查阅[荆棘](https://misode.github.io/enchantment/?version=26.2&preset=thorns)的附魔json文件：

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:random_chance",
            "chance": {
              "type": "minecraft:enchantment_level",
              "amount": {
                "type": "minecraft:linear",
                "base": 0.15,
                "per_level_above_first": 0.15
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:damage_entity",
              "damage_type": "minecraft:thorns",
              "min_damage": 1, "max_damage": 5
            },
            {
              "type": "minecraft:change_item_damage",
              "amount": 2
            }
          ]
        },
        "enchanted": "victim",
        "affected": "attacker"
      }
    ]
```

由此可知，荆棘魔咒的作用为：当穿戴有此附魔装备的生物被攻击时每级有15%的概率对攻击者造成1~5点伤害，并扣除此魔咒生效物品2点耐久。由于**enchanted**为**victim**，所以穿戴者作为被攻击者会触发上述效果

查阅[风爆](https://misode.github.io/enchantment/?version=26.2&preset=wind_burst)魔咒json：

```json
    "minecraft:post_attack": [
      {
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "direct_attacker",
          "predicate": {
            "flags": {
              "is_flying": false
            },
            "movement": {
              "fall_distance": {"min": 1.5}
            }
          }
        },
        "effect": {"..."},
        "enchanted": "attacker",
        "affected": "attacker"
      }
    ]
```

由此可知，风爆的作用为：攻击者下落距离大于1.5格且不在飞行状态时攻击生物会在攻击者自身位置产生爆炸效果。由于**affected**为**attacker**，所以执行实体和执行位置都为**攻击者**
接下来我们来创建一个名为**红温**的魔咒，作用是**被攻击**时概率获得**力量**效果，**攻击其他生物**时获得**急迫**效果：

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:random_chance",
            "chance": {
              "type": "minecraft:enchantment_level",
              "amount": {
                "type": "minecraft:linear",
                "base": 0.15,
                "per_level_above_first": 0.15
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:apply_mob_effect",
          "to_apply": "minecraft:haste",
          "min_duration": 1, "max_duration": 3,
          "min_amplifier": 0, "max_amplifier": 1
        },
        "enchanted": "attacker",
        "affected": "attacker"
      },
       {
        "requirements": [
          {
            "condition": "minecraft:random_chance",
            "chance": {
              "type": "minecraft:enchantment_level",
              "amount": {
                "type": "minecraft:linear",
                "base": 0.15,
                "per_level_above_first": 0.15
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:apply_mob_effect",
          "to_apply": "minecraft:strength",
          "min_duration": 1, "max_duration": 3,
          "min_amplifier": 0, "max_amplifier": 0
        },
        "enchanted": "victim",
        "affected": "victim"
      }
    ]
```

#### **post_piercing_attack**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 生物主手持带有该魔咒效果组件的物品攻击其他实体后；</br>玩家主手持带有该魔咒效果组件并且带有`piercing_weapon`数据组件的物品按下攻击键后 </br> 且触发间隔受`minimum_attack_charge`数据组件影响 | `enchanted_entity:` </br> `•this_entity：该生物` </br> `•origin：该生物的位置` `•enchantment_level：魔咒等级` | 该生物 | 该生物的位置 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check`|

查阅[突进](https://misode.github.io/enchantment/?version=26.2&preset=lunge)魔咒json：

```json
    "minecraft:post_piercing_attack": [
      {
        "effect": {"..."},
        "requirements": {
          "condition": "minecraft:all_of",
          "terms": [
            {
              "condition": "minecraft:inverted",
              "term": {
                "condition": "minecraft:entity_properties",
                "entity": "this",
                "predicate": {
                  "vehicle": {}
                }
              }
            },
            {
              "condition": "minecraft:entity_properties",
              "entity": "this",
              "predicate": {
                "flags": {
                  "is_fall_flying": false
                }
              }
            },
            {
              "condition": "minecraft:entity_properties",
              "entity": "this",
              "predicate": {
                "flags": {
                  "is_in_water": false
                }
              }
            }
          ]
        }
      }
    ]
```

当玩家**没有接触水、没有滑翔、没有骑乘实体**时**左键**带有**piercing_weapon**组件的物品则触发以上效果
**post_piercing_attack**魔咒组件相当于一个十分稳定的**左键**触发器，这意味着**1.21.11**后，左键检测不再一味的依赖于**交互实体**

#### **prevent_armor_change**

略

#### **prevent_equipment_drop**

略

#### **projectile_count**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 此弓或弩能够一次发射出多少个弹射物，计算结果向下取整，小于0也视为0 | `enchanted_entity:` </br> `•this_entity：使用弓或弩的生物` </br> `•origin：生物的位置` </br> `•enchantment_level：魔咒等级` | 1 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check` |

查阅[多重射击](https://misode.github.io/enchantment/?version=26.2&preset=multishot)附魔json文件

#### **projectile_spread**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 弹射物射出时最边缘的弹射物相对于视角向量的偏移，以度（°）为单位，计算结果小于0也视为0 | `enchanted_entity:` </br> `•this_entity：使用弓或弩的生物` </br> `•origin：生物的位置` </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check` |

查阅[多重射击](https://misode.github.io/enchantment/?version=26.2&preset=multishot)附魔json文件

#### **projectile_piercing**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 此箭实体可以穿透多少实体，计算结果向下取整，小于0也视为0 | `enchanted_item:` </br> `•tool：此物品（在此处指装载的弹射物）` </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•match_tool` |

查阅[穿透](https://misode.github.io/enchantment/?version=26.2&preset=piercing)附魔json文件

#### **projectile_spawned**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 弹射物刚被发射时，忽略slots字段 | `enchanted_entity:` </br> `•this_entity：该弹射物` </br> `•origin：该弹射物的位置` `•enchantment_level：魔咒等级` | 该弹射物 | 该弹射物的位置 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check`|

查阅[火矢](https://misode.github.io/enchantment/?version=26.2&preset=flame)魔咒json：

```json
    "minecraft:projectile_spawned": [
      {
        "effect": {
          "type": "minecraft:ignite",
          "duration": 100
        }
      }
    ]
```

在**1.21.2**后，projectile_spawned实体效果组件现在也会在发射**雪球、三叉戟、小火球、药水、末影珍珠、浮漂、烟花火箭、风弹或鸡蛋时**触发，相当于一个**极好的**弹射物生成检测器，不过需要注意的是，由**烟花弩发射的烟花**无法触发而**玩家右键放飞的烟花**可以
现在，结合上面四种有关弹射物生成的魔咒效果组件，做一个**万箭齐发**弩附魔，万箭齐发的前提条件装填物是带有**特殊数据组件**：`custom_data:{is_super_arrow:true}`的箭矢，否则发射后立刻清除自身：

```json
    "minecraft:projectile_count": [
      {
        "effect": {
          "type": "minecraft:set",
          "value": 100
        }
      }
    ],
    "minecraft:projectile_spread": [
      {
        "effect": {
          "type": "minecraft:set",
          "value": 15
        }
      }
    ],
    "minecraft:projectile_piercing": [
      {
        "effect": {
          "type": "minecraft:set",
          "value": 2
        }
      }
    ],
    "minecraft:projectile_spawned": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "type": "#minecraft:arrows"
            }
          },
          {
            "condition": "minecraft:inverted",
            "term": {
              "condition": "minecraft:entity_properties",
              "entity": "this",
              "predicate": {
                "slots": {
                  "contents": {
                    "predicates": {
                      "minecraft:custom_data": {
                        "is_super_arrow": true
                      }
                    }
                  }
                }
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:run_function",
          "function": "namespace:kill_arrow"
        }
      }
    ]
```

```mcfunction
[kill_arrow.mcfunction]
kill @s[type=#arrows]
```

#### **repair_with_xp**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 经验修补此物品时增加的耐久度，计算结果向下取整，小于0也视为0；物品须装备在slots中才可被经验修补 | `enchanted_item:` </br> `•tool：此物品` </br> `•enchantment_level：魔咒等级` | 经验球提供的经验值 | `•通用谓词` </br> `•match_tool` |

查阅[经验修补](https://misode.github.io/enchantment/?version=26.2&preset=mending)魔咒json：

```json
    "minecraft:repair_with_xp": [
      {
        "effect": {
          "type": "minecraft:multiply",
          "factor": 2
        }
      }
    ]
```

由此可得经验修补吸取1经验可以恢复2耐久度

#### **smash_damage_per_fallen_block**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: |
| 使用重锤下落攻击时每下降一格增加的伤害值 | `enchanted_damage:` </br> `•this_entity：受伤或死亡的实体` </br> `•attacking_entity：伤害的源发实体` </br> `•direct_attacking_entity：伤害的直接实体` </br> `•damage_source：伤害来源` </br> `•origin：受伤或死亡实体的位置` </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•damage_source_properties` </br> `•entity_properties` </br> `•entity_scores` </br> `•location_check` |

查阅[致密](https://misode.github.io/enchantment/?version=26.2&preset=density)魔咒json：

```json
    "minecraft:smash_damage_per_fallen_block": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 0.5,
            "per_level_above_first": 0.5
          }
        }
      }
    ]
```

#### **trident_return_acceleration**

| 修改的数值 | 战利品上下文 | 初始值 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :----------: |
| 三叉戟忠诚效果的加速度，以米每二次方秒为单位，计算结果向下取整，小于0也视为0，大于127也视为127，为0时无忠诚效果 | `enchanted_entity:` </br> `•this_entity：三叉戟实体` </br> `•origin：三叉戟实体的位置` </br> `•enchantment_level：魔咒等级` | 0 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check` |

查阅[忠诚](https://misode.github.io/enchantment/?version=26.2&preset=loyalty)魔咒json：

```json
    "minecraft:trident_return_acceleration": [
      {
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 1,
            "per_level_above_first": 1
          }
        }
      }
    ]
```

#### **trident_spin_attack_strength**

查阅[激流](https://misode.github.io/enchantment/?version=26.2&preset=riptide)魔咒json

#### **trident_sound**

略

#### **tick**

| 触发场景 | 战利品上下文 | 效果的作用实体 | 效果的作用位置 | 允许使用的谓词 |
| :-------: | :---------: | :----: | :-----------: | :------: |
| 生物每个游戏刻都会触发一次此效果 | `enchanted_entity:` </br> `•this_entity：该生物` </br> `•origin：该生物的位置` `•enchantment_level：魔咒等级` | 此生物 | 此生物的位置 | `•通用谓词` </br> `•entity_properties(entity:this)` </br> `•entity_scores(entity:this)` </br> `•location_check`|

**魔咒tick**相较于**函数tick**在性能方面有**较大的优势**，且对**Folia**这一类更改了tick规则的插件端也能正常运行，唯一的**缺点**是**魔咒tick**属于**实体效果组件**，必须**依赖存在的实体**才能生效，性能优势也**仅限**于对此实体进行操作，比如我想让**锁定玩家的苦力怕**靠近**被锁定玩家**2格以内直接瞬爆，使用**函数tick**：

```mcfunction
execute as @e[type=creeper] at @s if predicate {condition: entity_properties,entity: this,predicate: {targeted_entity: {entity_type: player,distance: {absolute: {max: 2}}}}} run data merge entity @s {Fuse:0s,ignited:1b}
```

使用**魔咒tick**：

```json
    "minecraft:tick": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "targeted_entity": {
                "entity_type": "minecraft:player",
                "distance": {
                  "absolute": {"max": 2}
                }
              }
            }
          }
        ],
        "effect": {
          "type": "minecraft:run_function",
          "function": "namespace:explode"
        }
      }
    ]
```

```mcfunction
[explode.mcfunction]
data merge entity @s {Fuse:0s,ignited:1b}
```

**魔咒tick**对单体生物的复杂行为监听优于**函数tick**，所以非常适合用于地图的Boss战制作、特殊生物逻辑等等

### 实战应用

#### **武器：旋风制造机**

创建魔咒 **breeze_mace.json** 作为该特殊武器的固有附魔，要求如下：
手持时，若玩家有**蓄风**效果，则每秒**恢复1点耐久**；
在**触发重锤猛击**时，若玩家的**潜行键**为按下状态，则不触发风爆，同时给予自身**10~20秒蓄风**药水效果；若**跳跃键**未按下则对玩家自身触发**II级风爆**的效果；若**跳跃键**按下**潜行键**松开，则对玩家自身触发**III级风爆**效果；
在**未触发重锤猛击**时，若玩家有**蓄风**效果，**攻击生物**触发平地风爆；**潜行键**为按下状态同时**左键地面**，将在左键的方块中心上表面产生**风爆**并**消耗5点耐久**

需要用到**tick、hit_block、post_attack**三种魔咒组件

```json
   "minecraft:tick": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "effects": {"minecraft:wind_charged": {}},
              "periodic_tick": 20
            }
          }
        ],
        "effect": {
          "type": "minecraft:change_item_damage",
          "amount": -1
        }
      }
    ]
```

```json
    "minecraft:hit_block": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "type_specific/player": {
                "input": {"sneak": true}
              },
              "effects": {"minecraft:wind_charged": {}}
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:explode",
              "block_interaction": "trigger",
              "immune_blocks": "#minecraft:blocks_wind_charge_explosions",
              "knockback_multiplier": 1.25, "radius": 3.5, "offset": [0,0.5,0],
              "large_particle": {"type": "minecraft:gust_emitter_small"},
              "small_particle": {"type": "minecraft:gust_emitter_small"},
              "sound": "minecraft:entity.wind_charge.wind_burst"
            },
            {
              "type": "minecraft:change_item_damage",
              "amount": 5
            },
            {
              "type": "minecraft:play_sound",
              "sound": "minecraft:entity.breeze.idle_air",
              "volume": 3, "pitch": 1
            }
          ]
        }
      }
    ]
```

```json
    "minecraft:post_attack": [
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "is_direct": true,
              "source_entity": {
                "type_specific/player": {
                  "input": {"jump": false,"sneak": false}
                }
              },
              "tags": [
                {
                  "id": "minecraft:mace_smash",
                  "expected": true
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:explode",
              "block_interaction": "trigger",
              "immune_blocks": "#minecraft:blocks_wind_charge_explosions",
              "knockback_multiplier": 1.75, "radius": 3.5,
              "large_particle": {"type": "minecraft:gust_emitter_small"},
              "small_particle": {"type": "minecraft:gust_emitter_small"},
              "sound": "minecraft:intentionally_empty"
            }
          ]
        },
        "enchanted": "attacker",
        "affected": "attacker"
      },
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "is_direct": true,
              "source_entity": {
                "type_specific/player": {
                  "input": {"jump": true,"sneak": false}
                }
              },
              "tags": [
                {
                  "id": "minecraft:mace_smash",
                  "expected": true
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:explode",
              "block_interaction": "trigger",
              "immune_blocks": "#minecraft:blocks_wind_charge_explosions",
              "knockback_multiplier": 2.2, "radius": 3.5,
              "large_particle": {"type": "minecraft:gust_emitter_large"},
              "small_particle": {"type": "minecraft:gust_emitter_small"},
              "sound": "minecraft:intentionally_empty"
            }
          ]
        },
        "enchanted": "attacker",
        "affected": "attacker"
      },
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "direct_entity": {
                "flags": {"is_flying": false},
                "effects": {"minecraft:wind_charged": {}}
              },
              "tags": [
                {
                  "id": "minecraft:mace_smash",
                  "expected": false
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:explode",
              "block_interaction": "trigger",
              "immune_blocks": "#minecraft:blocks_wind_charge_explosions",
              "knockback_multiplier": 1.0, "radius": 0.05,
              "large_particle": {"type": "minecraft:gust_emitter_small"},
              "small_particle": {"type": "minecraft:gust_emitter_small"},
              "sound": "minecraft:entity.wind_charge.wind_burst"
            }
          ]
        },
        "enchanted": "attacker",
        "affected": "attacker"
      },
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "direct_entity": {
                "type_specific/player": {
                  "input": {"sneak": true}
                }
              },
              "tags": [
                {
                  "id": "minecraft:mace_smash",
                  "expected": true
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:all_of",
          "effects": [
            {
              "type": "minecraft:apply_mob_effect",
              "to_apply": "minecraft:wind_charged",
              "min_duration": 10,"max_duration": 20,
              "min_amplifier": 0,"max_amplifier": 0
            }
          ]
        },
        "enchanted": "attacker",
        "affected": "attacker"
      }
    ]
```

#### **魔咒：试炼杀手**

要求：编写一个对**试炼刷怪笼**生成的**试炼怪**有伤害加成的附魔
注意到**1.21.2**加入了**试炼刷怪笼数据驱动**，可以手动修改试炼刷怪笼配置文件给怪物加上特殊标签，普通难度添加**trial_normal**，不详难度添加**trial_ominous**标签：

```json
    "minecraft:armor_effectiveness": [
      {
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "this",
          "predicates": {
            "entity_tags": {
              "any_of": [
                "trial_normal",
                "trial_ominous"
              ]
            }
          }
        },
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": -0.10,
            "per_level_above_first": -0.10
          }
        }
      }
    ],
    "minecraft:damage": [
      {
        "requirements": {
          "condition": "minecraft:entity_properties",
          "entity": "this",
          "predicates": {
            "entity_tags": {
              "any_of": [
                "trial_normal",
                "trial_ominous"
              ]
            }
          }
        },
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 2.5,
            "per_level_above_first": 2.5
          }
        }
      }
    ]
```

这时候有聪明宝宝要问了：“为什么不判定怪物是否在试炼密室呢，这不是更简单吗？”
理想很丰满，现实很骨感，**注意到** [MC-273376](https://bugs.mojang.com/browse/MC-273376) (Custom enchantments with "structures" subpredicate cause worlds to have 'Network Protocol Error' on attempted load) ，如果你这么做进入世界时会显示网络协议错误，甚是诡异

#### **魔咒：悠魂**

要求：**快乐恶魂**被**骑乘**时**飞得更快**，同时提供**伤害减免**，位于**云层上**时获得不间断**生命恢复**

```json
    "minecraft:tick": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "location": {
                "position": {
                  "y": {"min": 192}
                }
              },
              "periodic_tick": 30
            }
          }
        ],
        "effect": {
          "type": "minecraft:apply_mob_effect",
          "to_apply": "minecraft:regeneration",
          "min_duration": 4, "max_duration": 4,
          "min_amplifier": 1, "max_amplifier": 1
        }
      }
    ],
    "minecraft:damage_protection": [
      {
        "requirements": [
          {
            "condition": "minecraft:damage_source_properties",
            "predicate": {
              "tags": [
                {
                  "id": "minecraft:bypasses_invulnerability",
                  "expected": false
                }
              ]
            }
          }
        ],
        "effect": {
          "type": "minecraft:add",
          "value": {
            "type": "minecraft:linear",
            "base": 4,
            "per_level_above_first": 4
          }
        }
      }
    ],
    "minecraft:location_changed": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "entity_type": "minecraft:happy_ghast",
              "passenger": {}
            }
          }
        ],
        "effect": {
          "type": "minecraft:attribute",
          "attribute": "minecraft:flying_speed",
          "id": "minecraft:enchantment.ghastling",
          "amount": {
            "type": "minecraft:linear",
            "base": 0.4,
            "per_level_above_first": 0.4
          },
          "operation": "add_multiplied_base"
        }
      }
    ]
```

#### **饰品：亡命之徒**

要求：**生物**被**杀死**后**消失前一刻**产生**自爆**

```json
    "minecraft:tick": [
      {
        "requirements": [
          {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "predicate": {
              "nbt": "{DeathTime:19s}"
            }
          }
        ],
        "effect": {
          "type": "minecraft:explode",
          "damage_type": "minecraft:explosion",
          "knockback_multiplier": 1.75,
          "offset": [0,0.1,0],
          "radius": 3.5,
          "create_fire": true,
          "block_interaction": "tnt",
          "small_particle": {
            "type": "minecraft:explosion"
          },
          "large_particle": {
            "type": "minecraft:explosion_emitter"
          },
          "sound": "minecraft:entity.generic.explode"
        }
      }
    ]
```

### 总结

Minecraft 1.21开放的自定义魔咒，绝不仅仅是一次附魔系统的功能补强，它将曾经只属于模组开发者的“事件监听能力”以一种标准化、高性能、易组合的方式交给了每一个高版本数据包作者，无论是武器特效、环境互动、生物AI增强, 还是不依赖tick.json的高性能玩法, 自定义魔咒都展现出前所未有的潜力，它不再仅仅是“更强的工具附魔”，而是进化为一种通用、标准、高性能的原生事件监听与响应机制，它将摆脱对命令方块链、函数轮询的依赖，成为原版内容创作中与进度系统、战利品表、谓词系统并列的核心手段之一，降低玩法的开发门槛，推动数据包生态进入一个更加高效、富有想象力的时代

### 参考文献与已有教程

1.[Feature 2025.12 自定义魔咒的综合应用 |香草图书馆](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202512/3/content.html)
2.[中文 Minecraft Wiki 魔咒定义格式](https://zh.minecraft.wiki/w/%E9%AD%94%E5%92%92%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F)
3.[Misode 魔咒生成器](https://misode.github.io/enchantment)
4.[筱燚的mc数据包教程：自定义魔咒（上）](https://www.bilibili.com/video/BV1M7fhBEETx)
5.[筱燚的mc数据包教程：自定义魔咒（下）](https://www.bilibili.com/video/BV1xyfaBUE5V)
6.[筱燚的mc数据包教程：谓词](https://www.bilibili.com/video/BV1BrznBpEPt)