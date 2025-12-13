# 破坏性技术更新日志

> ⚠️本文部分正文内容翻译自misode的“技术性更新日志”页面： https://misode.github.io/changelog
>

## 前言
本条目列出所有原版Minecraft各版本更新时所有的破坏性改动，也就是那些如果不加处理会导致数据包或资源包在升级版本后无法正常运行的更新。

请注意大部分条目经过简化，目的仅为提醒读者这项变更的存在。请查阅Wiki以获取详细说明。

改动日志以正式版本为分类条目，降序排列。

## 迁移指南
[我的世界 JE1.21 数据包文件夹名称改变](https://www.bilibili.com/opus/942372286438047753)

## 正文

### **1.21.11**
#### 数据包：
- 命令
  - **/wordboard的时间参数现在默认使用游戏刻作为单位。**
  - **现在世界边界由游戏刻而不是现实时间控制。**
  - **所有的游戏规则现在使用命名空间ID。所有的原ID被重命名为snake_case。部分游戏规则的含义发生反转。部分游戏规则的值域现在有额外限制。请[查阅Wiki](https://zh.minecraft.wiki/w/?curid=19184#%E6%B8%B8%E6%88%8F%E8%A7%84%E5%88%99%E5%88%97%E8%A1%A8)。**
- NBT
  - **移除了`AngerTime`，以`anger_end_time`取代，表示生物从哪刻起不再愤怒。**
  - **`AngryAT`重命名为`angry_at`。**
- 数据组件
  - **`consumable`组件的`animation`字段中，原有的`spear`动画重命名为`trident`。加入了新的`spear`动画。**
  - **`intangible_projectile`组件现在有工具栏提示。**
- 标签
  - **重命名物品标签`#enchantable/sword` → `#enchantable/sweeping`。**
  - **以下生物群系标签被新的环境属性取代，故移除：**
    - `#snow_golem_melts`，`#increased_fire_burnout`，`#plays_underwater_music`，`#has_closer_water_fog`。
- 物品修饰器
  - **将`modifier`替换为`on_pass`和`on_fail`两个字段，分别在测试成功和失败时执行。**
- 世界生成
  - **维度类型和生物群系中的以下字段被移动到新的环境属性选项中：**
    - `ultrawarm`，`bed_works`，`respawn_anchor_works`，`cloud_height`，`piglin_safe`，`has_raids`，`natural`，`fog_color`，`water_fog_color`，`sky_color`，`particle`，`ambient_sound`，`music`，`music_volume`。
  - **维度类型的`effects`被移除，由`skybox`和`cardinal_light`取代。**
  - **维度类型的`fixed_time`被重置为`has_fixed_time`，新字段为布尔值，默认为`false`。基于时间的效果现在由环境属性指定。**
- 杂项
  - **测试环境定义格式中，`game_rules`的`bool_rule`和`int_rule`字段已被`rules`取代。**

#### 资源包：
- 模型和纹理：
  - **静止的水和熔岩的纹理现在硬编码为`minecraft:block/water_still`和`minecraft:block/lava_still`**
  - **新增了`items`纹理集，包含所有物品的纹理。同一个物品模型所使用的纹理必须全都来自于`items`或全都来自于`blocks`。**
- 着色器：
  - **加入了`ChunkSection`，被`terrain.vsh`使用，替代了`DynamicTransforms`。**

### **1.21.9**
#### 数据包：
- 世界
  - **出生点区块不再被强加载。**
  - **移除了`spawnChunkRadius`游戏规则，因为不再有出生点区块的概念。**
  - **每个世界的世界边界现在各自独立。**
  - **飞行中的末影珍珠以及活跃的传送门现在会加载区块。**
- 命令
  - **`/test pos [<var>]`现在搜索半径由200格更改为250格。`/test clearall [<radius>]`的默认值更改为250格。**
  - **`/summon`在和平难度下尝试召唤无法在和平难度生成的敌对生物会执行失败。**
  - **`/setworldspawn`和`/spawnpoint`的`<angle>`参数被替换为可选参数`<rotation>`，可以在设置玩家重生时面朝的垂直角度**。
  - **`/setworldspawn`现在不止可以在主世界中执行。服务端会在世界出生点执行命令，即使出生点不在主世界。**
- 文本组件
  - **现在尝试使用`run_command`执行`/say`、`​/me`、`​/msg`、`​/tell`、`​/w`、`​/teammsg`和`​/tm`这类署名命令会弹出提示窗，允许玩家复制命令手动执行。**
- 数据组件
  - **`block_attacks`组件，受到为0的伤害现在不会触发抵挡行为，不会进入冷却，也不会因抵挡而受到击退。**
  - **`profile`组件现在有静态和动态两种行为：**
    - **静态**：当此组件具有`properties`、同时具有`name`和`id`字段亦或上述两字段均无时。
      - 将会永久按照生成时的档案。展示的皮肤会在组件创建时冻结。
    - **动态**：`name`和`id`字段只有其一时。
      - 将会动态解析为最近的数据。会展示目标当前的皮肤。
    - **旧版世界中的头颅会优先转换为动态形式。**
- NBT
  - **玩家的`respawn`中的`angle`重命名为`yaw`。**
#### 资源包：
  - 着色器：
    - **移除了`core/blit_screen.vsh`、`​post/blit.vsh`、`​post/blur.vsh`、`​post/invert.vsh`、`​post/sobel.vsh`和`​post/screenquad.vsh`，并由`core/screenquad.vsh`替代。**
    - **移除了`core/position_color_lightmap.vsh/fsh`和`core/position_color_tex_lightmap.vsh/fsh`。**
    - **用于后处理效果、亮度图生成和全屏位块传输的顶点着色器不再传递`Position`属性，而须通过`gl_VertexID`分配顶点坐标。**
    - **修改了`core/terrain.vsh`中函数`minecraft_sample_lightmap`中UV计算的部分。**
    - **所有着色器的版本已经从`150`提升至`330`**
#### pack.mcmeta
- **现在版本号包含一个主要版本号和一个次要版本号。**
- **弃用了`supported_formats`。**
- **加入了必选字段`min_format`和`max_format`规定支持的版本。**
  - 格式为`[主版本号，次版本号]`。若只填入一个整数则等价于`[主版本号, 0]`。
- **`pack_format`现在是可选的。**

### **1.21.6**
#### 数据包：
- 文本组件
  - **现在使用`run_command`执行命令时，若执行的命令需要1级或更高的权限，将会展示弹窗提示玩家二次确认**。
- NBT
  - **药水效果云的`Particle`被重命名为`custom_particle`。使用`entity_effect`和`tinted_leaves`粒子时，颜色不再从药水中继承。**
- 标签
  - **重命名以下方块标签：**
    - `#plays_ambient_desert_block_sounds` → `#triggers_ambient_desert_sand_block_sounds`
- 数据组件
  - **`painting/variant`组件不再接受内联。**
#### 资源包：
- 纹理
  - **移除了`mob_effects`纹理集。其中的纹理移动至`gui`纹理集中。**
- 模型
  - **现在在物品模型映射中，若物品在GUI中的大小大过一个格子，需要添加`"oversized_in_gui": true`，否在会在格子边缘被裁断。**
- 声音：
  - **重命名`block.sand.wind`为`block.dry_grass.ambient`**。
- 着色器
  - **所有的内置uniform都改为统一变量块而不再是松散的。后处理着色器现在接受统一变量块。**
- 杂项
  - **玩家头颅物品模型不再从`profile`数据组件中读取纹理。加入了新的player_head模型类别以渲染`profile`的纹理。**

### **1.21.5**
#### 数据包：
- SNBT格式：
  - 整数现在可以以`0`开始。
  - 不再允许使用科学计数法（如`1e1000`）表示数字。
- NBT：
  - **`ArmorItems`，`HandItems`，和`body_armor_item`被合并为了`equipment`，包含所有槽位的物品。**
  - **`ArmorDropChances`，`HandDropChances`，以及`body_armor_drop_chance`被合并为了`drop_chances`。**
    - 这是一个复合标签，内含各个槽位的掉落概率。
  - **`Pos`，`Motion`，和`Rotation`列表现在必须有正确数量的元素。**
  - **重命名`FallDistance`为`fall_distance`且类型更改为`double`。**
  - **矿车类实体的`CustomDisplayTile`被移除。`DisplayState`总是可以设置展示的方块。`DisplayOffset`不再需要有自定义的展示方块才能生效。**
  - **物品展示框，荧光物品展示框，和栓绳结的`TileX`，`TileY`，和`TileZ`被合并为`block_pos`。**
  - **恼鬼的`LifeTicks`重命名为`life_ticks`，`BoundX`，`BoundY`，和`BoundZ`被合并为`bound_pos`。**
  - **海龟的`HasEgg`重命名为`has_egg`，`HomePosX`，`HomePosY`，和`HomePosZ`被合并为`home_pos`，`TravelPos<X|Y|Z>`被移除。**
  - **海豚的`TreasurePosX`，`TreasurePosY`，和`TreasurePosZ`被移除。**
  - **幻翼的`Size`重命名为`size`，`AX`，`AY`，和`AZ`被合并为`anchor_pos`。**
  - **多个实体的`SleepingX`，`SleepingY`，和`SleepingZ`被合并为`sleeping_pos`。**
  - **玩家实体NBT**：
    - `enteredNetherPosition`重命名为`entered_nether_pos`，且现在为3个`double`组成的列表。
    - `SpawnX`，`SpawnY`，`SpawnZ`，`SpawnAngle`，`SpawnDimension`，和`SpawnForced`标签合并为`respawn`。
- 命令
  - **`/setblock`和`/fill`命令现在不会更改方块实体数据，除非特别地使用`{...}`指定。**
    - 想要清空方块实体的数据，必须指明`{}`。
    - 只要在命令执行前后有方块的状态或数据变更，就视为执行成功。
- 标签
  - 重命名以下方块标签：
    - `#dead_bush_may_place_on` → `#dry_vegetation_may_place_on`
- 文本组件
  - **文本组件现在在所有命令中使用SNBT格式。在JSON文件中使用JSON格式。**
  - **`hoverEvent`和`clickEvent`，以及它们的子项被重命名。**
- 谓词
  - **实体谓词新增了`components`用于匹配实体组件。下列`type_specific`实体子谓词已被移除并挪入`components`中**：
    - `axolotl`, `fox`, `mooshroom`, `rabbit`, `horse`, `llama`, `villager`, `parrot`, `salmon`, `tropical_fish`, `painting`, `cat`, `frog`, `wolf`, `pig`, 以及`sheep`的`color`项。
- 数据组件
  - **重命名`weapon`组件的`damage_per_attack`为`item_damage_per_attack`**。
  - **`hide_additional_tooltip`和`hide_tooltip`组件被移除。多个组件中的`show_in_tooltip`项也被移除。现在统一由新组件`tooltip_display`管理。**
- 配方
  - **`smithing_trim`配方类型的`base`，`template`，和`addition`现在是必选的。**
  - **`crafting_transmute`配方类型的`base`现在是必选的。**
- 进度
  - **`background`现在使用命名空间ID而不再使用带`.png`路径的绝对路径。**
- 世界生成
  - **`patch_pumpkin`和`patch_sugar_cane`的生成顺序被调换。**
- 杂项
  - **槽位`horse.saddle`重命名为`saddle`且任何生物都拥有**。
  - **盔甲纹饰定义不再有`item`。现在这由配方决定。**
  - **`tinted_leaves`粒子现在需要`color`提供颜色。**
  - **猪变种定义格式的`texture`重命名为`assets_id`。**
  - **狼变种定义格式`angry_texture`， `tame_texture，` `wild_texture`合并为`assets`。**
  - **各生物变种格式的`biome`重命名为`spawn_conditions`，且可以根据更多条件决定生成。**
  - **实体`potion`独立为`splash_potion`和`lingering_potion`两个实体。**

#### 资源包：
- 纹理：
- **以下纹理的命名空间ID变更**：
    - `entity/pig/pig_saddle.png` → `entity/equipment/pig_saddle/saddle.png`
    - `entity/strider/strider_saddle.png` → `entity/equipment/strider_saddle/saddle.png`
    - `.../cow` → `.../temperate_cow`
    - `.../pig` → `.../temperate_pig`
    - `entity/chicken.png` → `entity/chicken/temperate_chicken.png`
  - **以下纹理的大小变化**：
    - `temperate_cow`
    - `temperate_pig`
    - `red_mooshroom`
    - `brown_mooshroom`
  - **以下纹理被从原本的纹理文件中分离为单独的文件**：
    - `entity/camel/camel.png` → `entity/equipment/camel_saddle/saddle.png`
    - `entity/horse/horse_<variant>.png` → `entity/equipment/horse_saddle/saddle.png`
    - `entity/horse/donkey.png` → `entity/equipment/donkey_saddle/saddle.png`
    - `entity/horse/mule.png` → `entity/equipment/mule_saddle/saddle.png`
    - `entity/horse/horse_skeleton.png` → `entity/equipment/skeleton_horse_saddle/saddle.png`
    - `entity/horse/horse_zombie.png` → `entity/equipment/zombie_horse_saddle/saddle.png`
- 模型
  - **牛和蘑菇牛的模型多了个鼻子。**
- 声音
  - **移除了`entity.wolf.howl`。**
  - **原本的狼的音效被移动到了classic文件夹下**。
- 着色器
  - **核心和后处理着色器不再使用任何JSON文件定义。**
  - **删除了着色器中的`program`，以`vertex_shader`和`fragment_shader`替代。`<namespace>:<path>`会被解析为`assets/<namespace>/shaders/<path>.<vsh|fsh>`**
  - **在每个`uniform`，`type`现在是必选的。接受任意的`int`，`ivec3`，`float`，`vec2`，`vec3`，`vec4`，和`matrix4`。**

### **1.21.4**
#### 数据包：
- 命令：
    - **`trial`粒子加入必选字段`duration`;**
- NBT：
    - 修改了TNT矿车的NBT：
      - **将`TNTFuse`重命名为`fuse`；**
    - **`custom_model_data`组件更改为复合标签，`set_custom_model_data`修饰器同步更新；**
- 数据包其他组分：
    - **移除了`#trim_templates`物品标签。**
    - **移除了`trim_material`注册表中的`item_model_index`字段；**
    - **`equippable`组件中的`model`字段现已重命名为`asset_id`。**

#### 资源包：
- **<p style="font-size:28px">引入新格式以描述[物品模型](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E7%89%A9%E5%93%81%E6%A8%A1%E5%9E%8B)；</p>**
- **`toast/system`精灵图外观现在已更新至使用标准九宫格划分方式；**
- **`toast/tutorial`精灵图现在被缩放为更高的弹窗；**
- **`advancements/box_obtained`和`advancements/box_unobtained`GUI纹理现在使用九宫格划分方式变换尺寸；**
- **与物品栏中盔甲槽一类的空槽位纹理现已从`item`移动到`gui/sprites/container/slot`目录，并重命名；**
- **织布机、酿造台、马和羊驼物品栏GUI中的空槽位精灵图现已从背景拆分并移动；**

### **1.21.2**
#### 数据包：
- 命令：
  - **栓绳结，浮漂和闪电不再能通过`/ride`骑乘；**
  - **属性id不再有`generic.`，` player.`，`zombie.`前缀；**
- NBT：
  - **重命名`fire_resistant`物品组件为`damage_resistant`，并加入`types`字段；**
  - `potion_contents`物品组件加入`custom_name`字段；
  - **将船和箱船的实体类型拆分为每种材质独立实体；**
  - **容器方块实体的`Lock`字段被重命名为`lock`，并支持物品谓词；**
- 数据包组分：
  - 进度：
    - **重命名`killed_by_crossbow`判据为`killed_by_arrow`;**
  - 附魔：
    - **重命名附魔类型`damage_item`为`change_item_damage`，并支持负值；**
  - 战利品表、谓词、物品修饰器：
    - **移除战利品表`empty`;**
    - **移除了`minecraft:boat`实体子谓词；**
  - 配方：
    - **配方原料格式修改：**
      - **`{ "item": "<item id>" }` 修改为 `"<item id>"`**
      - **`{ "tag": "<tag id>" }` 修改为 `"#<tag id>"`**
      - **列表格式不再支持tag**
  - 世界生成：
    - **移除了雕刻器类型carvers，现在可直接列出雕刻器**;


#### 资源包：
- 纹理：
  - **所有与装备相关的纹理现移动到了`textures/entity/equipment`的子目录中。**
- 着色器：
  - **`rendertype_entity_glint_direct`重命名为`rendertype_entity_glint`；**
  - **`rendertype_entity_translucent_cull`重命名为`rendertype_item_entity_translucent_cull`；**
  - **用于后处理效果的程序定义（`assets/<命名空间>/shaders/program/<名称>.json`）现与核心着色器定义（`assets/<命名空间>/shaders/core/<名称>.json`）一致化：**
    - **移除了没有实际作用的`blend`字段。**
    - **移除了`attributes`字段，其顶点属性`Position`将永被绑定。**
    - **`Uniform`现与为核心着色器提供的`Uniform`合并，其中`Time`被重命名为`GameTime`；**
  - **现在后处理管线程序由`assets/<命名空间>/shaders/post移动到assets/<命名空间>/post_effect`。**
  - 后**处理管线使用的顶点和片段着色器现由`assets/<命名空间>/shaders/program`移动到`assets/<命名空间>/shaders/post`。**
  - **后处理渲染过程`name`现被重命名为`program`，且需要命名空间ID。**

### **1.21**

#### 数据包：
- NBT:
  - **移除了箭类实体的 `ShotFromCrossbow` 字段**
- 数据包组分：
  - 战利品表、谓词、物品修饰器：
    - **诸如谓词的entity键的值重命名：**
      - **`killer` -> `attacker`**
      - **`direct_killer` -> `direct_attacker`**
      - **`killer_player` -> `attacking_player`**
    - **谓词中的 `enchantment` 字段重命名为 `enchantments` ；**
    - **重命名`random_chance_with_looting` 条件为`random_chance_with_enchanted_bonus`，并修改如下字段：**
      - **移除`looting_multiplier`字段；**
      - **`chance` 现在为等级依赖函数；**
      - **加入`enchantment`字段；**
    - 加入`enchantment_active_check`条件；
    - **重命名 `looting_enchant` 函数为 `enchanted_count_increase` ，并加入  `enchantment` 字段；**
    - **在 `enchant_randomly` 函数下修改如下字段：**
      - **`enchantments` 字段重命名为 `options；`**
      - **加入布尔值字段 `only_compatible` ；**
    - **`enchant_with_levels` 函数下修改：**
      - **移除了 `treasure` 字段；**
      - **加入 `options` 字段；**
    - **`copy_name`函数更改：重命名了字段`source`的枚举值：**
      - **将`killer`重命名为`attacking_entity`。**
      - **将`killer_player`重命名为`last_damage_player`**

### **1.20.5**

#### 数据包：
- 命令：
  - 粒子：
    - **`/particle`指令格式大幅修改，[详见Wiki](https://zh.minecraft.wiki/w/Java%E7%89%881.20.5-pre1#%E5%B8%B8%E8%A7%84_2)**
    - **拆分粒子`gust_emitter`为`gust_emitter_large` 和`gust_emitter_small`**
  - 属性：
    - 重命名属性:
      - **generic.block_interaction_range** → **player.block_interaction_range**
      - **generic.entity_interaction_range** → **player.entity_interaction_range**
    - **移除属性：`horse.jump_strength`**
  - **命令最大长度现在为2000000（2百万）字符；**
- 实体和NBT：
  - **修改了区域效果云实体的 `Particle` 字段以和命令/世界生成格式一致；**
  - **药水箭的`Potion` 和 `custom_potion_effects`字段被合并在`item`标签内;**
  - **修改药水效果云的效果字段以与`potion_contents` 组件匹配；**
  - **修改旗帜的方块实体字段以和`banner_patterns` 组件匹配；**
  - **修改蜂巢的方块实体字段以和`bees` 组件匹配；**
  - **重命名部分方块和实体的NBT字段：**
    - **位置nbt：`{X:1，Y:2，Z:3}` → `[I;1，2，3]`**
    - **蜜蜂: `FlowerPos` and `HivePos` → `flower_pos` and `hive_pos`**
    - **蜂巢: `FlowerPos` → `flower_pos`**
    - **末影水晶: `BeamTarget` → `beam_target`**
    - **可被栓绳牵引的生物: `Leash` → `leash`**
    - **袭击生物: `PatrolTarget` → `patrol_target`**
    - **末地传送门: `ExitPortal` → `exit_portal`**
    - **流浪商人: `WanderTarget` → `wander_target`**
  - **移除了部分药水效果在大于127级时产生的反效果行为；**
- **物品组件**：
  - **<p style="font-size:28px">物品的NBTtags由新的结构化物品组件替代:</p>**
    - **`Damage:12` -> `damage=12`**
    - **`RepairCost:12` -> `repair_cost=12`**
    - **`Unbreakable:1b` -> `unbreakable={}`**
    - **`Enchantments:[{id:"sharpness"，lvl:2}]` -> `enchantments={levels:{sharpness:2}}`**
    - **`StoredEnchantments` -> `stored_enchantments`**
    - **`display:{Name:'"hello"'}` -> `custom_name='"hello"'`**
    - **`display:{Lore:['"hello"']}` -> `lore=['"hello"']`**
    - **`CanDestroy:["stone"]` -> `can_break={blocks:"stone"}`**
    - **`CanPlaceOn:["stone"]` -> `can_place_on={blocks:"stone"}`**
    - **`display:{color:16711680}` -> `dyed_color={rgb:16711680}`**
    - **`AttributeModifiers:[]` -> `attribute_modifiers={modifiers=[]}`**
    - **`Charged:1b，ChargedProjectiles:[{id:"arrow"}]` -> `charged_projectiles=[{id:"arrow"}]`**
    - **`Items:[]` (bundle) -> `bundle_contents=[]`**
    - **`display:{MapColor:16711680}` -> `map_color=16711680`**
    - **`Decorations:[]` (filled map) -> `map_decorations={}`**
    - **`map:1` -> `map=1`**
    - **`CustomModelData` -> `custom_model_data`**
    - **`Potion:"invisibility"，CustomPotionColor:16711680，custom_potion_effects:[]` -> `potion_contents={potion:"invisibility"，custom_color:16711680，custom_effects:[]}`**
    - **`pages:["hello"]` (book and quill) -> `writable_book_content={pages:["hello"]}`**
    - **`pages:['"hello"']，title:"Title"，author:"Misode"，generation:1，resolved:1b` (written book) -> `written_book_content={pages:['"hello"']，title:"Title"，author:"Misode"，generation:1，resolved:true}`**
    - **`Trim={...}` -> `trim={...}`**
    - **`effects:[]` (suspicious stew) -> `suspicious_stew=[]`**
    - **`HideFlags` -> split to the different components as well as `hide_additional_tooltip` component**
    - **`DebugProperty` -> `debug_stick_state`**
    - **`EntityTag:{...}` -> `entity_data={...}`**
    - **bucketed mobs data -> `bucket_entity_data={...}`**
    - **`instrument:"ponder_goat_horn"` -> `instrument="ponder_goat_horn"`**
    - **`Recipes:[]` (knowledge book) -> `recipes=[]`**
    - **`LodestonePos`， `LodestoneDimension`， and `LodestoneTracked` -> `lodestone_target={pos:[13，64，-43]，dimension:"the_nether"}`**
    - **`Explosion` (firework star) -> `firework_exlosion={}`**
    - **`Fireworks:{Explosions:[]，Flight:1}` (firework rocket) -> `fireworks={explosions:[]，flight_duration:1}`**
    - **`SkullOwner:{Name:"Steve"}` -> `profile={name:"Steve"}`**
    - **`BlockEntityTag:{note_block_sound:"ambient.cave"}` -> `note_block_sound="ambient.cave"`**
    - **`BlockEntityTag:{Base:2}` -> `base_color="magenta"`**
    - **`BlockEntityTag:{Patterns:[]}` -> `banner_patterns=[]`**
    - **`BlockEntityTag:{sherds:[]}` -> `pot_decorations=[]`**
    - **`BlockEntityTag:{Items:[]}` (shulker box) -> `container=[]`**
    - **`BlockEntityTag:{Bees:[]}` -> `bees=[]`**
    - **`BlockEntityTag:{Lock:"test"}` -> `lock="test"`**
    - **`BlockEntityTag:{LootTable:"foo"，LootTableSeed:123}` -> `container_loot={loot_table:"foo"，seed:123}`**
    - **`BlockEntityTag:{...}` -> `block_entity_data={...}`**
    - **`BlockStateTag:{...}` -> `block_state={...}`**
  - 加入了物品组件`enchantment_glint_override` ;
  - **物品格式`Count`重命名为`count`**
- 数据包组分：
  - 战利品表：
    - **Nested lists are no longer supported in loot function lists.**
    - **战利品表抽取项loot_table（从提供的嵌套战利品表返回所有物品）现在有以下语法：value可以是：**
      - **一个命名空间ID，指对另一个战利品表的引用。**
      - **完整的战利品表，格式与独立文件的战利品表相同。**
  - 谓词：
    - **物品谓词修改：**
      - **移除了 tag 字段，items 字段现在支持标签;**
      - **potion 字段重命名为 potions;**
      - **nbt 字段重命名为 custom_data;**
    - **方块谓词修改**
      - **移除 tag 字段，blocks 字段现在支持标签;**
    - **流体谓词`fluid` 重命名为 `fluids`**
    - 实体谓词`type`支持标签；
    - **位置谓词修改：**
      - **`biome` 重命名为 `biomes` ，并支持群系标签；**
      - **`structure` 重命名为 `structures` ，并支持结构标签；**
    - **修改物品谓词的`predicates`下的子谓词：**
      - **`durability` -> `damage` 子谓词;**
      - **`enchantments` -> `enchantments` 子谓词;**
      - **`stored_enchantments` -> `stored_enchantments` 子谓词;**
      - **`potions` -> `potion_contents` 子谓词;**
      - **`custom_data` ->  `custom_data` 子谓词;**
  - 物品修饰器：
    - **重命名物品修饰器函数**
      - **`set_nbt` → `set_custom_data`**
      - **`copy_nbt` → `copy_custom_data`**
    - **重命名`/attribute`命令的operation字段：**
      - **`add` → `add_value`**
      - **`multiply_base` → `add_multiplied_base`**
      - **`multiply` → `add_multiplied_total`**
    - 移除了 `set_contents` 物品修饰器函数中的 `type` 字段，并加入 `component` 字段；
    - 为`set_attributes`物品修饰器函数加入`replace`字段;
    - `set_lore`物品修饰器函数下`replace`字段重命名为`mode`;
    - **`set_written_book_pages`函数：`pages`现在是一个JSON对象而不再是一个JSON文本。**
  - 配方：
    - **配方的产物栏现在支持指定物品组件**;
  - 标签：
    - 修改：
      - **实体标签 `punchable_projectiles` 重命名为 `redirectable_projectile` ；**
      - **重命名 `axolotl_tempt_items`为`axolotl_food`;**
    - 移除：
      - **移除物品标签`tools`**
      - **移除实体标签`deflects_arrows` ，`deflects_tridents`**
  - 世界生成：
    - **用于`worldgen`定义的整数和浮点数提供器不再包装在`type`旁的额外`value`字段中。**
#### 资源包：
- 纹理：
  - **将地图装饰图标从以前的`map_icons.png`中分离为从`textures/map/decorations`/目录中加载的图集;**
- 字体：
  - **ttf字体提供器的`shift`字段的值现在被限制在-512到512之间；**
- 着色器:
  - **后处理着色器 `blur` 重命名为 `box_blur`;**
  - **新增`entity_outline_box_blur` 着色器;**

### **1.20.3**

#### 数据包：
- 命令：
  - **`/function`命令不再返回执行的命令条数；**
  - **游戏规则 `maxCommandChainLength` 现在更严格计数；**
- NBT：
  - **重命名方块草及其对应物品的注册名，从minecraft:grass重命名为minecraft:short_grass**
  - **将三叉戟（实体）的`Trident` 字段重命名为 `item`;**
  - **TNT实体的nbt数据：`Fuse` 重命名为 `fuse`; 添加 `block_state` 字段；**

#### 资源包：
- 纹理：
  - `.png`现在是唯一支持的纹理格式；

### **1.20.2**

#### 数据包：
- 命令：
  - **加入了函数宏，可以在函数中加入宏参数传入函数，以实现动态函数；**
  - **可以在一行命令的末尾用反斜杠`\`表示换行，以支持多行单指令，增加可读性；**
- 调试：
  - 现在命令记忆功能跨存档保存50条，可在游戏文件夹的`command_history.txt`文件中找到；
- NBT：
  - **生物NBT的状态效果id由数字id改为命名空间id（字符串）**；
  - **许多状态效果相关的实体NBT键名从驼峰格式改为蛇形格式：**
    * **生物状态效果字段：**
      * `Id` -> `id`
      * `Ambient` -> `ambient`
      * `Amplifier` -> `amplifier`
      * `Duration` -> `duration`
      * `ShowParticles` -> `show_particles`
      * `ShowIcon` -> `show_icon`
      * `HiddenEffect` -> `hidden_effect`
      * `FactorCalculationData` -> `factor_calculation_data`
    * **药水和药水箭：**
      * `CustomPotionEffects` -> `custom_potion_effects`
    * **状态效果云和迷之炖菜：**
      * `Effects` -> `effects`
      * `EffectId` -> `id`
      * `EffectDuration` -> `duration`
    * **哞菇：**
      * `EffectId` and `EffectDuration` -> `stew_effects`
    * **生物状态效果：**
    * `ActiveEffects` -> `active_effects`
    * **信标：**
      * `Primary` -> `primary_effect`
      * `Secondary` -> `secondary_effect`
#### 资源包：
- 纹理：
  - **文本编辑框现在是一张位于`widget/text_field`和`widget/text_field_highlighted`的九宫格切分的精灵图。**
  - **列表和编辑框的滚动条现在是一张位于`widget/scroller`的九宫格切分的精灵图。**
  - **`realms`命名空间的纹理被移入`minecraft`命名空间内；**
  - **所有含有多个部件贴图的GUI纹理现在都被拆分为单独的贴图，位于`textures/gui/sprites`目录下。**
  - **`villager2.png`被重命名为`villager.png`**
  - **辅助功能、语言和Realms新闻的按钮图标现在是单独的文件，不再各自附于按钮的纹理之上。**

### **1.20**

#### 数据包：
- 数据包组分：
  - 进度：
    - **`placed_block`， `item_used_on_block`， 和 `allay_drop_item_on_block` 进度触发器下所有字段并入`location` 字段；现在该字段接受战利品表谓词。**
  - 战利品表、谓词、物品修饰器：
    - **加入`all_of`条件，  `alternative` 条件重命名为 `any_of`**
  - 标签：
    - 方块标签`replaceable_plants` 拆分为`replaceable` 和 `replaceable_by_trees`
  - 世界生成：
    - 移除了结构后处理器`rule`的`output_nbt` 字段，新增了`block_entity_modifier `作为替代。
#### 资源包：
- 字体：
  - **移除字符提供器`legacy_unicode`;**

### **1.19.4**

#### 数据包：
- 实体和NBT
  - **加入（方块、物品、文本）展示实体、交互实体；**
- 数据包组分
  - 战利品表、谓词、物品修饰器：
    - **伤害类型谓词修改，移除了原先判据，改用新的伤害类型数据判定，使用`tags`字段判定；**

### **1.19.3**

#### 数据包：
- 命令：
  - **修改了命令`/publish`的格式**；
- 数据包组分：
  - 配方：
    - **配方文件内加入必选字段 `category` ；**
  - 标签：
    - **移除方块标签`overworld_natural_logs`;**
  - 世界生成：
    - 移除`template_pool` 的 `name`字段；
#### 资源包：
- 纹理：
  - **在`entity/player/(slim|wide)`新增了各默认玩家皮肤；移除了`entity/steve` 和 `entity/alex`**；
  - **修改了`gui/container/creative_inventory/tabs`纹理**；

### **1.19.1**

### **1.19**

#### 数据包：
- 命令：
  - **猫变种由数字id改为命名空间id；**
  - **状态效果 `ID` 的类型由字节型改为整型；**
- 进度：
  - **进度触发器 `location`， `slept_in_bed`， `hero_of_the_village` 和 `voluntary_exile` 下 `location` 字段被移入 `player.location` 位置;**
- 战利品表、谓词、物品修饰器：
  - **位置谓词字段 `feature`  重命名为 `structure`；**
- 世界生成：
  - 移除地物 `ice_patch` ， `ice_patch` 并由地物 `disk` 代替；
  - 树根放置器格式修改：
    - `y_offset` 重命名为 `trunk_offset_y`;
    - 字段 `max_root_width`， `max_root_length`， `random_skew_chance`， `can_grow_through`， `muddy_roots_in`， `muddy_roots_provider` 移入 `mangrove_root_placement` 对象下；
    - 加入字段 `above_root_placement` ;
  - 地物 `glow_lichen` 重命名为 `multiface_growth` ;
  - `block_rot` 处理器的字段 `rottable_blocks`现在需要一个`#`前缀；
  - 移除结构字段 `adapt_noise` ;
  - 移除密度函数 `slide`，由 `add`， `mul` ， `y_clamped_gradient` 代替；
  - 移除噪声设置字段 `noise.sampling`， `noise.top_slide`，  `noise.bottom_slide`，并移入密度函数;
  - 维度类型不再内联于维度数据中；
  - 移除区块噪声生成器的 `seed` 字段；
  - 移除密度函数 `terrain_shaper_spline` 并移除密度函数 `spline` 的 `min_value` 和 `max_value` 字段；
  - 移除生物群系字段 `category`；
  - 将`worldgen/configured_structure_feature` 文件夹移入 `worldgen/structure` 文件夹；

### **1.18.2**

#### 数据包：

* 命令
  * `locate`命令现在接受已配置的结构地物ID作为参数而不是结构类型；
  * `locate`命令和`locatebiome`命令现在支持标签作为参数；
* 世界生成
  * 加入结构集JSON文件，取代了噪声字段中的`structures`字段；
  * 移除了噪声设置中的字段`noise_caves_enabled`，`noodle_caves_enabled`；
  * 一些标签字段现在要求在ID前面加上`#`，但是它们暂不接受元素列表：
    - `dimension_type`中的`infiniburn`
    - `feature.geode`配置中的`blocks.cannot_replace`和`blocks.invalid_blocks`
    - `feature.vegetation_patch`和`feature.waterlogged_vegetation_patch`配置中的`replaceable`
    - `feature.root_system`配置中的`root_replaceable`
    - `structure_processor.protected_blocks`中的`value`
  * 修改了噪声设置中`structures`的格式；

### **1.18**

#### 数据包：
* 命令
  * 移除了记分项、记分板名称、队伍名称的名称长度限制；

* NBT
  * 将刷怪笼的`SpawnPotentials`格式更改为：
    ```snbt
    {
        weight: <int>,
        data: {
        	entity: {...},
    		custom_spawn_rules: {...}
    	}
    }
    ```
  * 将刷怪笼的`SpawnData`字段的内容移动到`SpawnData.entity`；
* 进度
  * 将进度谓词中的`nether_travel`的`entered`重命名为`start_position`，移除了字段`exit`；
* 物品修饰器
  * **现在`set_contents`和`set_loot_table`物品修饰器函数需要`type`字段**
* 标签
  * 将方块标签`lava_pool_stone_replaceables`重命名为`lava_pool_stone_cannot_replace`；
* 世界生成
  * **加入用于地物放置的方块谓词；**
  * **加入了已放置的地物；**
  * **加入了表面规则；**
  * **加入噪声JSON数据文件；**
  * **移除了地表生成器；**
  * **移除了方块放置器；**

### **1.17**

#### 数据包：

* 命令
  * **加入`/item`命令，取代了`/replaceitem`命令；**
  * `/give`命令能给予的物品上限现在是100；
* 进度
  * 在触发器 `effects_changed`中加入条件 `source`；
* 战利品表和谓词
  * **把谓词中的所有物品条件字段的名称从`item`修改为了`items`，所有方块条件字段的名称从`block`修改为了`blocks`；**
* 加入了物品修饰器
* NBT
  *  `fireball`的字段 `ExplosionPower`现在是byte而不是int；
  * 史莱姆的字段 `Size`现在上限是126；
  * 药水云的字段 `Radius`现在上限是32；
* 标签
  * 重命名方块标签： `snow_step_sounds` → `inside_snow_step_sounds`
* 方块
  * 铁轨能含水了，水不再破坏铁轨；
  * 将炼药锅拆分为`cauldron`（空的炼药锅）， `water_cauldron`（装水的）和 `lava_cauldron`（装岩浆的）；
  * 重命名 `grass_path` → `dirt_path`，`grimstone `→`deepslate`；
* 实体
  * **加入了`marker`**
* 其他
  * 加入了游戏事件；
  * 使用`F3+L`可以生成一份性能报告，储存在 `.minecraft/debug/profiling/`下；
  * 文本组件中的目标选择器组件和NBT组件可以使用字段 `separator`指定分隔符；

#### 资源包：
* 着色器
  * 现在使用OpenGL 3.2渲染，可使用资源包替换原版着色器；
  * 新增资源包目录`shaders/core`和`shaders/include`；
* 其他
  * 制作者名单现在是json格式储存而不是txt；

## **1.16.2**

#### 数据包：
- 世界生成：
  - **自定义世界生成和维度设置现在在数据包中使用相同的文件夹模式（namespace/<类型>/resource.json），与其他资源保持一致。**

### **1.16**

#### 数据包：

- 命令：
  - **属性命名由驼峰命名改为下划线命名；**
- NBT：
  - **实体的UUID值现在改为4元素整数数组；**；
- 数据包组分：
  - 进度：
    - **移除进度触发器 `safely_harvest_honey` ；**
    - **进度内容`location`, `slept_in_bed`, `hero_of_the_village`, `voluntary_exile` 字段被放入`location` 字段下；**
  - 世界生成：
    - **加入实验性玩法“自定义世界”；**
- 其他：
  - 数据包加载优化：
    - 若加载失败，则修改不会被应用；
    - 如果进入世界时，已加载的数据包出错，会弹出“安全模式”选项；
    - 仅在数据包成功加载后修改数据包列表；
    - 数据包现在可以在世界生成之前指定；
    - 现在若数据包组分缺失（如卸载了`vanilla`数据包），将阻止玩家加载世界。
