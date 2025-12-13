# 技术性更新日志

> ⚠️本文改动日志部分翻译自misode的“技术性更新日志”页面： https://misode.github.io/changelog
> 建议有能力的读者阅读原文，可以根据特性分类查找改动。

## 前言
由于最近数个版本对技术侧的改动较多，对数据包兼容性的影响较大，可能会出现一个教程或资源只能在特定版本使用的情况，对于还不熟悉这些数据包特性的开发者来说可能会有些困惑。因此在此列出版本间的修改。

读者可借此参阅教程在你的目标版本的可用性。

改动日志以正式版本为分类条目，降序排列。

例行更新（如数据包/资源包版本号递增）不列出。

与数据包和资源包不相关的技术性更改不列出。

对旧版本有破坏性的改动（即breaking）会加粗标出。

:::warning 注
由于源站未更新1.21.8及以上的内容，本日志暂停更新，待其同步最新版本后一并翻译。  
我们自行整理了后续版本的相关破坏性更改，可见[精简版日志](/index/changelog_breaking.md)。
:::


## 迁移指南
[我的世界 JE1.21 数据包文件夹名称改变](https://www.bilibili.com/opus/942372286438047753)


## 改动日志

### **1.21.4**
#### 数据包：
- 命令：
    - `/attribute`指令新增`reset`子命令：`attribute <target> <attribute> base reset`;
    - 在`/jfr`指令中加入了新事件:`StructureGeneration`。
    - **`trial`粒子加入必选字段`duration`;**
    - 加入了`pale_oak_leaves`粒子类型；
- nbt：
    - 重命名了熔炉类方块实体数据字段：
      - `CookTime` -> `cooking_time_spent`;
      - `CookTimeTotal` -> `cooking_total_time`;
      - `BurnTime` -> `lit_time_remaining`;
      - 加入`lit_total_time`字段;
    - 修改了TNT矿车的NBT：
      - **将`TNTFuse`重命名为`fuse`；**
      - 添加可选字段`explosion_speed_factor`，表示矿车的附加爆炸威力；
    - 具有`block_entity_data`组件的方块物品现在只会在`id`与被放置的方块实体一致时设置方块实体数据；
    - 加入收纳袋使用动画`bundle`;
    - **`custom_model_data`组件更改为复合标签，`set_custom_model_data`修饰器同步更新；**
    - 文本组件格式加入可选字段`shadow_color`，用于描述文字阴影颜色，可以为十进制颜色代码或RGBA浮点数组；
- 数据包其他组分：
    - **移除了`#trim_templates`物品标签。**
    - 加入了一系列标签，标记蜜蜂授粉的方块和敌对生物更愿意拾取的物品；
    - **移除了`trim_material`注册表中的`item_model_index`字段；**
    - **`equippable`组件中的`model`字段现已重命名为`asset_id`。**
    - 环境效果`effects`现还可包含以下内容：
      - `music`：该生物群系中可以播放的音乐，为一个加权列表。如列表为空，表示不播放音乐；
      - `music_volume`：该生物群系中音乐的音量。在进入该生物群系时，音量会平滑过渡；
    - 为`simple_block`类型地物加入了可选字段`schedule_tick`，为`true`时，此方块将会请求计划刻；

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
  - 加入了`/rotate`命令；
  - **栓绳结，浮漂和闪电不再能通过`/ride`骑乘；**
  - `/loot`指令现在会在尝试生成无对应战利品表的方块掉落物时报错。
  - 加入游戏规则`disablePlayerMovementCheck`，`minecartMaxSpeed`；
  - 加入了`block_crumble`和`trail`粒子；
  - 粒子类型`trail`，`dust`，`dust_color_transition`的颜色参数现在支持颜色代码和颜色浮点数组；
  - **属性id不再有`generic.`，` player.`，`zombie.`前缀；**
  - 加入属性`tempt_range`;
- nbt：
  - 新增物品组件：`death_protection`，`item_model`，`equippable`，`glider`，`tooltip_style`，`consumable`，`use_remainder`，`use_cooldown`，`enchantable`，`repairable`
  - 修改物品组件`food`;移除部分字段并交由`consumable`控制；\
  - `instrument` 组件加入字段 `description`；
  - **重命名`fire_resistant`物品组件为`damage_resistant`，并加入`types`字段；**
  - `potion_contents`物品组件加入`custom_name`字段；
  - **将船和箱船的实体类型拆分为每种材质独立实体；**
  - **容器方块实体的`Lock`字段被重命名为`lock`，并支持物品谓词；**
  - 实体X轴旋转角度现在必须在-90到90之间；
  - 聊天组件中的无效`selector`模式现在将导致命令解析失败，而不再解析为空字符串。
  - TNT和TNT矿车实体加入了可选字段`explosion_power`；
- 数据包组分：
  - 进度：
    - **重命名`killed_by_crossbow`判据为`killed_by_arrow`;**
  - 附魔：
    - **重命名附魔类型`damage_item`为`change_item_damage`，并支持负值；**
  - 战利品表、谓词、物品修饰器：
    - **移除战利品表`empty`;**
    - 一些物品可由战利品表控制：
      - 鸡下蛋产生的物品现在由`gameplay/chicken_lay`控制；
      - 犰狳掉落的鳞甲由`gameplay/armadillo_shed`控制；
      - 村民给村庄英雄的礼物由`gameplay/hero_of_the_village/unemployed_gift`和`gameplay/hero_of_the_village/baby_gift`控制；
      - 羊毛修剪时掉落物可由`shearing/sheep`控制；
      - 哞菇修剪掉落物由`shearing/mooshroom`控制；
    - **移除了`minecraft:boat`实体子谓词；**
    - 加入实体子谓词`salmon`，`sheep`;
    - 加入玩家子谓词`input`，用于检测键位输入；
    - 工具谓词（用于`match_tool`等谓词）现在还可用于`archaeology`，`vault`，`shearing`战利品表类型；
  - 配方：
    - 加入了`crafting_transmute`配方类型，替换`crafting_special_shulkerboxcoloring`;
    - **配方原料格式修改：**
      - **`{ "item": "<item id>" }` 修改为 `"<item id>"`**
      - **`{ "tag": "<tag id>" }` 修改为 `"#<tag id>"`**
      - **列表格式不再支持tag**
    - `smithing_transform` 和 `smithing_trim` 配方类型下的 `template`， `base`， `addition` 字段现在为可选；
  - 标签：
    - 新增物品标签：`gaze_disguise_equipment`，`map_invisibility_equipment`，`duplicates_allays`，`panda_eats_from_ground`，`brewing_fuel`，`piglin_safe_armor`，`repairs_leather_armor`， `repairs_iron_armor`， `repairs_chain_armor`， `repairs_gold_armor`， `repairs_diamond_armor`， `repairs_netherite_armor`， `repairs_turtle_helmet`， `repairs_wolf_armor`，`furnace_minecart_fuel`，`villager_picks_up`；
    - 新增实体标签：`boat`；
    - 新增方块标签：`bats_spawnable_on`；
  - 山羊角乐器现在由数据驱动；
  - 加入 `ender_pearl` 和 `mace_smash` 伤害类型;
  - 世界生成：
    - **移除了雕刻器类型carvers，现在可直接列出雕刻器**;


#### 资源包：
- 纹理：
  - 高亮槽位的纹理现在能通过替换精灵图自定义;
  - **所有与装备相关的纹理现移动到了`textures/entity/equipment`的子目录中。**
  - 提示框的背景与边框分别由`tooltip/background`和`tooltip/frame`精灵图控制。
- 模型：
  - 加入装备模型；
  - 物品覆写条件`broken`现在在所有物品模型中都可用了;
  - 加入模型字段`light_emission` ，强制设为指定光照等级；
- 着色器：
  - 加入核心着色器`rendertype_armor_translucent`，用于狼铠渲染；
  - **`rendertype_entity_glint_direct`重命名为`rendertype_entity_glint`；**
  - **`rendertype_entity_translucent_cull`重命名为`rendertype_item_entity_translucent_cull`；**
  - **用于后处理效果的程序定义（`assets/<命名空间>/shaders/program/<名称>.json`）现与核心着色器定义（`assets/<命名空间>/shaders/core/<名称>.json`）一致化：**
    - **移除了没有实际作用的`blend`字段。**
    - **移除了`attributes`字段，其顶点属性`Position`将永被绑定。**
    - **`Uniform`现与为核心着色器提供的`Uniform`合并，其中`Time`被重命名为`GameTime`；**
  - vertex和fragment着色器引用现在需为着色器命名空间ID。
    - 顶点着色器`<命名空间>:<路径>`会被处理为`assets/<命名空间>/shaders/<路径>.vsh`。
    - 片段着色器`<命名空间>:<路径>`会被处理为`assets/<命名空间>/shaders/<路径>.fsh`。
  - 着色器源文件不再需放于`shaders/core`子目录。
  - 着色器导入指令`#moj_import`现在支持带绝对路径的命名空间包含着色器。
  - **现在后处理管线程序由`assets/<命名空间>/shaders/post移动到assets/<命名空间>/post_effect`。**
  - 后**处理管线使用的顶点和片段着色器现由`assets/<命名空间>/shaders/program`移动到`assets/<命名空间>/shaders/post`。**
  - **后处理渲染过程`name`现被重命名为`program`，且需要命名空间ID。**

### **1.21**

#### 数据包：
- 命令：
  - `/give`，`/item`，`/loot`命令现在支持使用`!`前缀移除默认组件；
  - `generic.attack_knockback`属性现在对玩家生效；
  - 加入属性 `generic.burning_time` ， `generic.explosion_knockback_resistance` ， `player.mining_efficiency` ， `generic.movement_efficiency` ， `generic.oxygen_bonus` ， `player.sneaking_speed` ， `player.submerged_mining_speed` ， `player.sweeping_damage_ratio` ， `generic.water_movement_efficiency`；
- nbt:
  - **移除了箭类实体的 `ShotFromCrossbow` 字段**
- 数据包组分：
  - 战利品表、谓词、物品修饰器：
    - **诸如谓词的entity键的值重命名：**
      - **`killer` -> `attacker`**
      - **`direct_killer` -> `direct_attacker`**
      - **`killer_player` -> `attacking_player`**
    - **谓词中的 `enchantment` 字段重命名为 `enchantments` ；**
    - 加入了实体判据 `is_on_ground` ， `is_flying` ， `can_see_sky` ， `weather` ；
    - 加入了实体子谓词 `movement` ， `periodic_ticks`
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
    - `random_chance` 条件现在接受数值提供器作为值；
    - 添加了数值提供器`enchantment_level`;
  - 附魔：
    - 附魔现在由数据驱动；
      - 自然出现的附魔由附魔提供器控制；
      - 排除的附魔由标签控制；
  - 画现在由数据驱动；
  - 加入了伤害类型`campfire`，`burn_from_stepping`；
  - 世界生成：加入方块谓词`unobstructed`

### **1.20.5**

#### 数据包：
- 命令：
  - 物品处理：
    - `/item`命令的物品槽位支持用"*"表示其中的任意槽位;
    - 加入`/execute if items`子命令；
    - 加入物品槽位 `contents`， `player.cursor`， `player.crafting.0` - `player.crafting.3`;
    - `/loot`，`/item`，`/execute if predicate`等命令现在支持内联战利品表、谓词、物品修饰器。
  - 粒子：
    - **`/particle`指令格式修改，太多了懒得列，[去wiki看吧](https://zh.minecraft.wiki/w/Java%E7%89%881.20.5-pre1#%E5%B8%B8%E8%A7%84_2)**
    - 加入粒子类型 `infested`， `item_cobweb`， `small_gust`， `raid_omen`， `trial_omen`， `trial_spawner_detection_ominous`，  `ominous_spawning`，`vault_connection`;
    - **拆分粒子`gust_emitter`为`gust_emitter_large` 和`gust_emitter_small`**
    - 移除粒子类型`gust_dust`;
  - 属性：
    - 加入属性：`generic.gravity`，`generic.jump_strength`，`generic.safe_fall_distance`，`generic.fall_damage_multiplier`，`player.block_break_speed`，`generic.block_interaction_range`，`generic.entity_interaction_range`，`generic.scale`，`generic.step_height`;
    - 重命名属性:
      - **generic.block_interaction_range** → **player.block_interaction_range**
      - **generic.entity_interaction_range** → **player.entity_interaction_range**
    - **移除属性：`horse.jump_strength`**
  - `/place jigsaw`指令允许最大深度至20；
  - 加入`/transfer`指令;
  - 加入游戏规则`spawnChunkRadius`
  - **命令最大长度现在为2000000（2百万）字符；**
- 实体和NBT：
  - 加入新实体类型`breeze_wind_charge`;
  - **修改了区域效果云实体的 `Particle` 字段以和命令/世界生成格式一致；**
  - 将刷怪笼方块实体数据`SpawnPotentials`中和试炼刷怪笼方块实体数据`spawn_potentials`中的可选字段`equipment_loot_table`重命名为`equipment`。
  - 成书的页码数量不再有255限制（生存中仍有最大100页限制）；
  - 在刷怪笼的`SpawnPotentials`生成数据中加入了可选的`equipment_loot_table`字符串值，用于将指定战利品表内的物品随机选取装备到生成的生物身上。
  - 旗帜图案现在由数据驱动；
  - 狼的变种由数据驱动；
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
  - 弹射物附魔，如无限、多重射击、穿透等，现在在弓和弩上都生效；
  - **移除了部分药水效果在大于127级时产生的反效果行为；**
  - 移除效果NBT的 `FactorCalculationData` 字段
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
  - max_stack_size 和 max_damage 物品组件不能同时存在；
  - `writable_book_content`和`written_book_content`物品堆叠组件：未过滤的JSON文本原始信息`text`被重命名为`raw`以避免歧义。
  - `profile`物品堆叠组件：现在指定`id`而不指定`name`时，可由UUID直接解析玩家档案数据。
- 数据包组分：
  - 进度：
    - 加入进度触发器 `crafter_recipe_crafted` ， `fall_after_explosion`， `any_block_use`，`default_block_use`;;
  - 战利品表：
    - 加入战利品表类型`equipment`;
    - 加入数值提供器 `storage`;
    - 加入战利品表元素的列表操作，附带字段`mode`；
    - **Nested lists are no longer supported in loot function lists.**
    - **战利品表抽取项loot_table（从提供的嵌套战利品表返回所有物品）现在有以下语法：value可以是：**
      - **一个命名空间ID，指对另一个战利品表的引用。**
      - **完整的战利品表，格式与独立文件的战利品表相同。**
    - 熊猫打喷嚏掉落物现在由`gameplay/panda_sneeze`战利品表控制；
  - 谓词：
    - 加入物品子谓词 `container` ， `bundle_contents` ， `firework_explosion` ， `fireworks` ， `writable_book_content` ， `written_book_content` ， `attribute_modifiers` ， `trim` ， `max_stack_size` ， `max_damage` ， `fire_resistant` ， `rarity` ， `tool` ， `hide_tooltip`;
    - 加入实体子谓词 `raider`，`wolf`
    - 在 `equipment`实体子谓词下加入了`body`字段；
    - 实体子谓词加入`slot`字段；
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
    - 修改谓词 `cat`，`frog`，`painting`的`variant`字段格式；
    - 扩展了[物品谓词格式](https://zh.minecraft.wiki/w/24w12a#%E5%91%BD%E4%BB%A4%E6%A0%BC%E5%BC%8F)；
    - **修改物品谓词的`predicates`下的子谓词：**
      - **`durability` -> `damage` 子谓词;**
      - **`enchantments` -> `enchantments` 子谓词;**
      - **`stored_enchantments` -> `stored_enchantments` 子谓词;**
      - **`potions` -> `potion_contents` 子谓词;**
      - **`custom_data` ->  `custom_data` 子谓词;**
    - 移除`type_specific`下的 `any` 实体子谓词;
  - 物品修饰器：
    - 加入了物品修饰器函数 `modify_contents` ， `modify_contents` ， `filtered` ， `set_custom_model_data` ， `set_ominous_bottle_amplifier`，`toggle_tooltips`，`set_fireworks`，`set_firework_explosion`，`set_book_cover`，`set_writable_book_pages`，`set_written_book_pages`，`copy_components`， `set_components`
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
    - `set_written_book_pages`函数：`pages`现在是一个JSON对象而不再是一个JSON文本。
    - Added collection matchers， which are used in predicates. It is an object with optional fields: size (int bounds)， contains (list of element predicates)， and count (object with fields test and count).（未找到资料）
  - 配方：
    - **配方的产物栏现在支持指定物品组件**;
  - 伤害类型：
    - 加入伤害类型`bypasses_wolf_armor`，`spit`，`wind_charge`;
  - 标签：
    - 新增：
      - 加入方块标签 `incorrect_for_wooden_tool`， `incorrect_for_gold_tool`， `incorrect_for_stone_tool`， `incorrect_for_iron_tool`， `incorrect_for_diamond_tool`， `incorrect_for_netherite_tool`，`does_not_block_hoppers`，`badlands_terracotta`，`blocks_wind_charge_explosions`;
      - 加入物品标签 `meat`， `piglin_food`， `fox_food`， `cow_food`， `goat_food`， `sheep_food`， `wolf_food`， `cat_food`， `horse_food`， `horse_tempt_items`， `camel_food`， `armadillo_food`， `bee_food`， `chicken_food`， `frog_food`， `hoglin_food`， `llama_food`， `llama_tempt_items`， `ocelot_food`， `panda_food`， `pig_food`， `rabbit_food`， `strider_food`， `strider_tempt_items`， `turtle_food`， `parrot_food`， `parrot_poisonous_food`，`dyeable`，`chest_armor`， `foot_armor`， `head_armor`， `leg_armor`， `skulls`， `enchantable/armor`， `enchantable/bow`， `enchantable/chest_armor`， `enchantable/crossbow`， `enchantable/durability`， `enchantable/equippable`， `enchantable/fishing`， `enchantable/foot_armor`， `enchantable/head_armor`， `enchantable/leg_armor`， `enchantable/mining`， `enchantable/mining_loot`， `enchantable/sword`， `enchantable/trident`， `enchantable/vanishing`， `enchantable/weapon`;
      - 加入实体类型标签 `punchable_projectiles`，`immune_to_oozing` ， `immune_to_infested`，`sensitive_to_smite`，`no_anger_from_wind_charge`，`deflects_projectiles`，`aquatic`， `arthropod`， `ignores_poison_and_regen`， `illager`， `illager_friends`， `inverted_healing_and_harm`， `not_scary_for_pufferfish`， `sensitive_to_bane_of_arthropods`， `sensitive_to_impaling`，  `wither_friends`;
      - 加入伤害类型标签 `is_player_attack`， `always_kills_armor_stands`
      - 加入附魔标签 `tooltip_order` ;
    - 修改：
      - 实体标签 `punchable_projectiles` 重命名为 `redirectable_projectile` ；
      - 重命名 `axolotl_tempt_items`为`axolotl_food`;
    - 移除：
      - **移除物品标签`tools`**
      - 移除实体标签`deflects_arrows` ，`deflects_tridents`
  - 世界生成：
    - 为已配置的结构地物加入了新的地形调整方式encapsulate;
    - **用于`worldgen`定义的整数和浮点数提供器不再包装在`type`旁的额外`value`字段中。**
- 其他：
  - 使用ctrl+鼠标中间复制的带nbt物品不再显示`(+NBT)`注释；
#### 资源包：
- 纹理：
  - 从下界和末地传送或前往下界末地时，加载界面显示对应传送门纹理动画；
  - **将地图装饰图标从以前的`map_icons.png`中分离为从`textures/map/decorations`/目录中加载的图集;**
  - 加入狼铠的多层纹理;
- 字体：
  - **ttf字体提供器的`shift`字段的值现在被限制在-512到512之间；**
  - 加入了字体变种过滤器；
- 着色器:
  - **后处理着色器 `blur` 重命名为 `box_blur`;**
  - **新增`entity_outline_box_blur` 着色器;**
  - 加入了后处理过程可选字段`use_linear_filter`。为true时，此过程的纹理采样模式由最近邻采样切换到线性插值。

### **1.20.3**

#### 数据包：
- 命令：
  - 为`/scoreboard`加入新的子命令：
    - `scoreboard players display name <targets> <objective> <text component>`
    - `scoreboard players display name <targets> <objective>`
    - `scoreboard objectives modify <scoreboard> displayautoupdate [true|false]`
    - 数字格式：
      - `scoreboard objectives modify <objective> numberformat <format>`
      - `scoreboard objectives modify <objective> numberformat`
      - `scoreboard players display numberformat <targets> <score> <format>`
      - `scoreboard players display numberformat <targets> <score>`
  - 新增了`/return fail`子命令；
  - 重新引进`/execute if function`，`/return run`子命令；
  - **`/function`命令不再返回执行的命令条数；**
  - 加入粒子类型`white_smoke`，`dust_plume`;
  - 添加游戏规则`playersNetherPortalDefaultDelay`， `playersNetherPortalCreativeDelay`， `projectilesCanBreakBlocks`，`maxCommandForkCount`.
  - **游戏规则 `maxCommandChainLength` 现在更严格计数；**
- NBT：
  - **重命名方块草及其对应物品的注册名，从minecraft:grass重命名为minecraft:short_grass**
  - 为方块实体饰纹陶罐添加了字段`LootTable` 和 `LootTableSeed`;
  - 饰纹陶罐加入item字段；
  - **将三叉戟（实体）的`Trident` 字段重命名为 `item`;**
  - **TNT实体的nbt数据：`Fuse` 重命名为 `fuse`; 添加 `block_state` 字段；**
  - 有自定义名字的非生物实体也会显示名字了：
  - 凋灵之首实体加入`dangerous` 字段;
  - 文本组件的检查更加严格：
    - 对`color`，`clickEvent`，`hoverEvent`中的错误会报错而非静默忽略；
    - 空串不再被接收；
    - 数字和布尔值类型的文本不再被解析为字符串；
    - 即：文本组件的书写需要更加的规范，布尔值和数值不能加引号，字符串类型需要加；
- 数据包组分：
  - 标签：
    - 加入伤害类型标签`can_break_armor_stands`
    - 加入实体类型标签`can_breathe_under_water`， `undead`， `zombies`.
  - 世界生成：
    - 将拼图结构的最大字段长度从7提高至20；
    - 在拼图方块编辑界面新增`Selection Priority` 和 `Placement Priority`字段；
    - 结构格式加入可选字段`pool_aliases`;

#### 资源包：
- 纹理：
  - `.png`现在是唯一支持的纹理格式；


### **1.20.2**

#### 数据包：
- 命令：
  - 加入`/random`指令；
  - **加入了函数宏，可以在函数中加入宏参数传入函数，以实现动态函数；**
  - **可以在一行命令的末尾用反斜杠`\`表示换行，以支持多行单指令，增加可读性；**
  - 加入游戏规则`enderPearlsVanishOnDeath`；
  - 现在露天方块检查天气更新的频率受游戏规则`randomTickSpeed`影响；
  - 加入属性`generic.max_absorption`;
- 调试：
  - debug窗口的图表现在可以通过`F3+1`，`F3+2`，`F3+3`调出；
  - debug窗口现在会显示网络负载图表；
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
  - 展示实体现在会在更新后的第一个刻开始更新客户端的位置和旋转。
    - 此前，更新是在相同的刻中应用的，导致运动不平稳。
    - 新的行为类似于生物。
    - 在服务器中，位置和旋转仍是立即更新的。
  - 屏障方块现在可以含水，但是只能由创造模式玩家加入水；
- 数据包组分：
  - 战利品表、物品修饰器、谓词：
    - `all_of` 谓词和 `sequence` 物品修饰器函数可被声明为内联无类型数组；
    - 加入物品修饰器函数`sequence` ;
  - 标签：
    - 加入方块标签`concrete_powder` ， `camel_sand_step_sound_blocks`
    - 加入实体类型标签`non_controlling_rider`
    - 加入伤害标签`always_kills_armor_stands`，`no_knockback`;
  - 世界生成：
    - 加入世界生成地物`minecraft:ore_diamond_medium`;
- 其他：
  - 在`pack.mcmeta`文件中加入 `supported_formats` 字段，可以指定一个数据包/资源包支持的版本区间；
  - 加入了数据包/资源包覆盖功能，可根据数据包/资源包版本在`pack.mcmeta`中指定覆盖原数据包的部分文件；
#### 资源包：
- 纹理：
  - 更改了制图师出售的探险家地图上的结构图标。
  - **文本编辑框现在是一张位于`widget/text_field`和`widget/text_field_highlighted`的九宫格切分的精灵图。**
  - **列表和编辑框的滚动条现在是一张位于`widget/scroller`的九宫格切分的精灵图。**
  - **`realms`命名空间的纹理被移入`minecraft`命名空间内；**
  - GUI纹理现在可以通过.`mcmeta`文件添加动画。先前Realms试用的提示图标与Realms即将过期的状态图标，现在即采用此方式显示动画，而不再是之前的硬编码。
  - **所有含有多个部件贴图的GUI纹理现在都被拆分为单独的贴图，位于`textures/gui/sprites`目录下。**
  - **`villager2.png`被重命名为`villager.png`**
  - GUI纹理图集现在可以通过`.mcmeta`文件中的`gui`部分自定义变换行为。
    - 目前该部分仅包括`scaling`字段，其有3种类型，可通过type参数指定：`stretch`（拉伸，默认值）、`tile`（平铺）和`nine_slice`（九宫格切分）。
    - `tile`和`nine_slice`需要提供额外参数才能正常显示。
    - 收纳袋悬浮提示框的背景纹理现在即采用`nine_slice`方式处理。
  - **辅助功能、语言和Realms新闻的按钮图标现在是单独的文件，不再各自附于按钮的纹理之上。**
- 模型：
  - 盔甲纹饰添加 `decal` 字段；

### **1.20**

#### 数据包：
- 命令：
  - 加入`/return`命令；
- NBT：
  - Added dynamic drop shards option for the name field of the the dynamic loot table entry. It drops the shards of a decorated pot.
  - 将饰纹陶罐的方块实体中`shard`字段重命名为`sherd`;
  - 将`item_display`展示的物品沿Y轴旋转了180度，以与应用于渲染盔甲架头部及展示框上的物品的渲染变换相匹配。
  - 修改了告示牌的NBT: 移除了`Text1`， `Text2`， `Text3`， 和 `Text4`，加入了 `front_text` 和 `back_text`；
  - 带有点击事件的告示牌即便未涂蜡也能够触发交互；
- 数据包组分：
  - 进度：
    - 加入进度触发器`recipe_crafted`;
    - **`placed_block`， `item_used_on_block`， 和 `allay_drop_item_on_block` 进度触发器下所有字段并入`location` 字段；现在该字段接受战利品表谓词。**
  - 战利品表、谓词、物品修饰器：
    - 战利品表加入字段`random_sequence`，可以指定生成物品使用的随机序列。ID为可选项，当未指定时序列将会通过无指定性的随机种子生成。
    - **加入`all_of`条件，  `alternative` 条件重命名为 `any_of`**
    - 加入物品修饰器函数`reference`
  - 配方：
    - `smithing_trim`和`smithing_transform`类型的配方，其`template`、`​base`和`addition`字段现在支持以数组形式列出多种原材料。这些字段允许空数组，意为将此槽位留空。
  - 伤害类型：
    - 加入伤害类型 `outside_border` 和 `generic_kill`.
  - 标签：
    - 加入物品标签`villager_plantable_seeds`；
    - 加入方块标签`maintains_farmland`，`enchantment_power_provider`， `enchantment_power_transmitter`，`sword_efficient` ；
    - 方块标签`replaceable_plants` 拆分为`replaceable` 和 `replaceable_by_trees`
  - 世界生成：
    - 在地物`huge_fungus` 下加入`replaceable_blocks`字段;
    - 加入了结构后处理器`capped`;
    - 移除了结构后处理器`rule`的`output_nbt` 字段，新增了`block_entity_modifier `作为替代。
#### 资源包：
- 字体：
  - **移除字符提供器`legacy_unicode`;**
  - 加入字符提供器 `reference` ， `unihex` ;


### **1.19.4**

#### 数据包：
- 命令：
  - 加入子命令`execute positioned over`;
  - 加入子命令`/execute on` ;
  - 加入`/execute summon`子命令；
  - 加入`/execute if|unless dimension <dimension>`子命令;
  - 加入`/execute if|unless loaded <pos>`子命令；
  - 加入`/damage`指令；
  - 加入 `/ride` 指令;
  - `infinite` 现在可以作为`/effect`命令的持续时间参数；
  - `/clone`指令现在可以跨维度复制；
  - `/weather`，`/title <selector> times`命令的持续时间参数现在支持带有t，s，或d的后缀；
  - `/data`命令加入数据源 `string <entity|block|storage> [path] [start] [end]`;
  - 加入游戏规则`doVinesSpread`，`commandModificationBlockLimit`;
- 实体和NBT
  - **加入（方块、物品、文本）展示实体、交互实体；**
  - 在`HideFlags`字段内加128会隐藏物品提示框；
- 数据包组分
  - 战利品表、谓词、物品修饰器：
    - **伤害类型谓词修改，移除了原先判据，改用新的伤害类型数据判定，使用`tags`字段判定；**
  - 加入伤害类型数据；
  - 配方：
    - 加入配方类型`crafting_decorated_pot`;`smithing_transform`;;
    - 配方类型`crafting_shaped`新增`show_notification`字段；
  - 标签：
    - 加入方块标签`smelts_to_glass`；
    - 加入物品标签`smelts_to_glass`，`trim_materials`， `trim_templates`， `trimmable_armor`;
    - 加入实体类型标签`fall_damage_immune`
    - 加入伤害类型标签`bypasses_shield`，`bypasses_cooldown`，`always_hurts_ender_dragons`;
  - 世界生成：
    - 添加生物群系字段 `spawns_white_rabbits`;
    - 移除生物群系字段`precipitation`;
#### 资源包：
- 纹理：
  - 附魔光效现在拆分为两个独立纹理文件：`enchanted_glint_entity.png` 和` enchanted_glint_item.png`.
  - 加入图集源：`paletted_permutations`；
  - 加入盔甲纹饰；
- 翻译：
  - `en_us.json`翻译文件现在按字母表顺序排序；
- 着色器：
  - 加入着色器类型`rendertype_text_background` 和 `rendertype_text_background_see_through`;

### **1.19.3**

#### 数据包：
- 命令：
  - 加入指令 `/fillbiome`;
  - 加入子命令`/execute if|unless biome <pos> <biome>`;
  - **修改了命令`/publish`的格式**；
  - 新增游戏规则 `blockExplosionDropDecay`， `mobExplosionDropDecay` ， `tntExplosionDropDecay` ，`snowAccumulationHeight` ， `waterSourceConversion` ， `lavaSourceConversion` ， `globalSoundEvents` ;
- 数据包组分：
  - 配方：
    - **配方文件内加入必选字段 `category` ；**
  - 标签：
    - 加入方块标签 `invalid_spawn_inside`，`stripped_logs`；
    - 加入物品标签 `stripped_logs`；
    - **移除方块标签`overworld_natural_logs`;**
  - 世界生成：
    - 移除`template_pool` 的 `name`字段；
#### 资源包：
- 纹理：
  - **在`entity/player/(slim|wide)`新增了各默认玩家皮肤；移除了`entity/steve` 和 `entity/alex`**；
  - **修改了`gui/container/creative_inventory/tabs`纹理**；

### **1.19.1**
- 重命名 `team_name` 参数为 `target`;
- 聊天类型定义，略；
- `run_command` 点击事件不再支持输出聊天信息，且总是需要前缀`/`；

### **1.19**

#### 数据包：
- 命令：
  - 加入`/place`指令；
  - `/locate`指令加入 `poi`子命令；
  - 加入粒子类型`sonic_boom`，`shriek`，`sculk_charge`， `sculk_charge_pop` ， `sculk_soul`;
  - 移除粒子类型 `vibration` 的 `origin` 参数;
  - **猫变种由数字id改为命名空间id；**
  - 玩家NBT加入字段 `warden_spawn_tracker`;
  - **状态效果 `ID` 的类型由字节型改为整型；**
- 进度：
  - 加入进度触发器`avoid_vibration`，`thrown_item_picked_up_by_player` ， `allay_drop_item_on_block`，`kill_mob_near_sculk_catalyst`;
  - **进度触发器 `location`， `slept_in_bed`， `hero_of_the_village` 和 `voluntary_exile` 下 `location` 字段被移入 `player.location` 位置;**
- 战利品表、谓词、物品修饰器：
  - 使用 `type_specific` 字段替换 `player`， `fishing_hook`， `lightning_bolt`， `catType` `字段，下有类型：player`，`fishing_hook`，`lightning`，`cat`，`slime`，`frog`;
  - **位置谓词字段 `feature`  重命名为 `structure`；**
  - 加入物品修饰器 `set_instrument`;
- 标签：
  - 加入方块标签 `dragon_transparent`;
  - 方块标签 `occludes_vibration_signals` 重命名为 `dampens_vibrations`；
  - 加入兴趣点类型标签：`acquirable_job_site`， `bee_home`， `village`;
  - 加入旗帜类型标签；
- 世界生成：
  - 加入生物群系标签`mineshaft_blocking`;
  - 加入维度类型字段`monster_spawn_block_light_limit` ，`monster_spawn_light_level` ;
  - 拼图结构加入可选字段`start_jigsaw_name`；
  - 地形雕刻器 加入字段 `replaceable` ；
  - 移除地物 `ice_patch` ， `ice_patch` 并由地物 `disk` 代替；
  - 树根放置器格式修改：
    - `y_offset` 重命名为 `trunk_offset_y`;
    - 字段 `max_root_width`， `max_root_length`， `random_skew_chance`， `can_grow_through`， `muddy_roots_in`， `muddy_roots_provider` 移入 `mangrove_root_placement` 对象下；
    - 加入字段 `above_root_placement` ;
  - 树装饰器`leave_vine` 加入字段： `probability` ;
  - 地物 `tree` 加入字段 `root_placer` ;
  - 加入树干放置器 `upwards_branching_trunk_placer`；
  - 加入地物 `surface_disk`;
  - 地物 `glow_lichen` 重命名为 `multiface_growth` ;
  - `block_rot` 处理器的字段 `rottable_blocks`现在需要一个`#`前缀；
  - 移除结构字段 `adapt_noise` ;
  - 加入结构字段 `terrain_adaptation`;
  - 地物 `sculk_patch` 加入字段 `extra_rare_growths`;
  - `block_rot` 处理器加入可选字段 `rottable_blocks`;
  - 移除密度函数 `slide`，由 `add`， `mul` ， `y_clamped_gradient` 代替；
  - 移除噪声设置字段 `noise.sampling`， `noise.top_slide`，  `noise.bottom_slide`，并移入密度函数;
  - 密度函数 old_blended_noise 加入字段 `xz_scale`， `y_scale`， `xz_factor`， `y_factor`， `smear_scale_multiplier`.
  - 拼图结构加入字段 `max_distance_from_center`;
  - 维度类型不再内联于维度数据中；
  - 移除区块噪声生成器的 `seed` 字段；
  - 移除密度函数 `terrain_shaper_spline` 并移除密度函数 `spline` 的 `min_value` 和 `max_value` 字段；
  - 移除生物群系字段 `category`；
  - 加入地物类型 `sculk_patch`；
  - 将`worldgen/configured_structure_feature` 文件夹移入 `worldgen/structure` 文件夹；
- 其他：
  - 加入聊天类型；
#### 资源包：
- 字体：
  - 加入字形提供器 `space`;

### **1.18.2**

#### 数据包：

* 命令
  * `locate`命令现在接受已配置的结构地物ID作为参数而不是结构类型；
  * `locate`命令和`locatebiome`命令现在支持标签作为参数；
  * 加入`/placefeature`命令；
* 标签
  * 现在任何注册类型都能拥有标签。标签储存在`<命名空间>/tags/<类型注册名>`下。原有的标签文件夹名保持不变；
  * 加入生物群系标签 `is_badlands`，`is_beach`，`is_deep_ocean`，`is_forest`，`is_hill`，`is_jungle`，`is_mountain`，`is_nether`，`is_ocean`，`is_river`，和`is_taiga`；
* 世界生成
  * 加入密度函数`spline`；
  * 在已配置的结构地物中新增字段`adapt_noise`和`spawn_overrides`；
  * 加入结构集JSON文件，取代了噪声字段中的`structures`字段；
  * 移除了噪声设置中的字段`noise_caves_enabled`，`noodle_caves_enabled`；
  * 加入噪声设置字段`noise_router`；
  * 加入密度函数JSON文件；
  * 在已配置的结构地物中新增字段`biomes`；
  * 一些接受ID列表的字段现在可以接受标签。同时，这些字段既可以接受列表作为多个值，也可以接受一个字符串作为单个值：
    * `feature.glow_lichen`配置中的`can_be_placed_on`
    * `feature.spring_feature`配置中的`valid_blocks`
    * `feature.simple_random_selector`配置中的`features`
    * `block_predicate_type.matching_blocks`中的`blocks`
    * `block_predicate_type.matching_fluids`中的`fluids`
    * `biome`中的`features`的内部列表和`carvers`的映射值
    * `biome_source.checkerboard`中的`biomes`
  * 一些标签字段现在要求在ID前面加上`#`，但是它们暂不接受元素列表：
    - `dimension_type`中的`infiniburn`
    - `feature.geode`配置中的`blocks.cannot_replace`和`blocks.invalid_blocks`
    - `feature.vegetation_patch`和`feature.waterlogged_vegetation_patch`配置中的`replaceable`
    - `feature.root_system`配置中的`root_replaceable`
    - `structure_processor.protected_blocks`中的`value`
  * 修改了噪声设置中`structures`的格式；

#### 资源包：

* 其他：
  * 添加了`assets/minecraft/regional_compliancies.json`用于配置韩国玩家的防沉迷提示；

### **1.18**

#### 数据包：

* 命令

  * 将粒子`light`和`barrier`统一为`block_marker`；
  * 加入`/jfr`命令
  * 移除了记分项、记分板名称、队伍名称的名称长度限制；

* NBT

  * 在刷怪笼的`SpawnData`字段和`SpawnPotentials`中添加了`custom_spawn_rules`字段；

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

  * 加入触发器`fall_from_height`，`ride_entity_in_lava`；
  * 将进度谓词中的`nether_travel`的`entered`重命名为`start_position`，移除了字段`exit`；

* 物品修饰器

  * 加入物品修饰器函数`set_potion`
  * **现在`set_contents`和`set_loot_table`物品修饰器函数需要`type`字段**

* 标签

  * 加入方块标签： `terracotta`，`replacable_plants`，`azalea_grows_on`，`azalea_root_replaceable`，`animals_spawnable_on`， `axolotls_spawnable_on`， `goats_spawnable_on`， `mooshrooms_spawnable_on`， `parrots_spawnable_on`， `polar_bears_spawnable_on_in_frozen_ocean`， `rabbits_spawnable_on`， `foxes_spawnable_on`， `wolves_spawnable_on`；
  * 加入物品标签： `dirt`和`terracotta`；
  * 将方块标签`lava_pool_stone_replaceables`重命名为`lava_pool_stone_cannot_replace`；

* 世界生成
  * **加入用于地物放置的方块谓词；**
  * **加入了已放置的地物；**
  * 将已配置的地物`random_boolean_selector`中的字段`feature_false`，`feature_true`修改为了已放置的地物；
  * 将已配置的地物`vegetation_patch`和`waterlogged_vegetation_patch`中的`vegetation_feature`修改为已放置的地物；
  * 将已配置的地物`glow_lichen`中的`can_be_placed_on`字段修改为方块ID列表；
  * 在地物`twisting_vines`中新增字段`spread_width`，`spread_height`和`max_height`；
  * 在地物`nether_forest_vegetation`中新增字段`spread_width`和`spread_height`；
  * 将地物`small_dripstone`替换为`pointed_dripstone`
  * 从地物`lake`中移除字段`state`，新增字段`fluid`和`barrier`；
  * 将地物`block_column`中的`allow_water`字段替换为`allowed_placements`字段；
  * 移除了地物`random_patch`，`flower`和`flower_no_bonemeal`中的`only_in_air`，`allowed_on`和`disallowed_on`字段；
  * 移除了地物water lake；
  * 移除了地物`simple_block`中的`place_on`，`place_in`，`place_under`字段。现在使用`place_under`放置修饰器；
  * 将地物`growing_plant`重命名为`block_column`，移除了其中的`body_provider`，`head_provider`，`height_distribution`字段，新增了`layers`列表字段；
  * 重写了地物`random_patch`，`flower`和`flower_no_bonemeal`中的字段；
  * 移除了树类地物中的`sapling_provider`字段；
  * 移除了地物的放置修饰器`decorated`，`dark_oak_tree`，`iceberg`，`count_extra`，`lava_lake`，`cave_surface`， `end_gateway`，和`nope`；
  * 加入地物的放置修饰器`biome`，`random_offset`，`environment_scan`，`world_survive`，`block_filter`，`surface_relative_threshold_filter`；
  * 重命名地物的放置修饰器：
    * `count_multilayer` → `count_on_every_layer`
    * `square` → `in_square`
    * `chance` → `rarity_filter`
    * `count_noise` → `noise_threshold_count`
    * `count_noise_biased` → `noise_based_count`
    * `water_depth_threshold` → `surface_water_depth_filter`
    * `range` → `height_range`
  * 移除了生物群系中的`player_spawn_friendly`和`surface_builder`字段；
  * 移除了生物群系中的`scale`，`depth`和`starts`字段；
  * 移除了`multi_noise `生物群系源（用于噪声型区块生成器，后同）中的`seed`，`altitude_noise`，`temperature_noise`，`humidity_noise`，`weirdness_noise`字段，增加了`octaves`字段；
  * 移除了生物群系源`vanilla_layered`；
  * 加入了生物群系噪声参数`continentalness`，`erosion`，`depth`；
  * 移除了生物群系噪声参数`altitude`；
  * 在生物群系的实体生成种类中新增`axolotls`；
  * 移除了雕刻器中的`aquifers_enabled`字段；
  * 重命名生物群系：
    * `stone_shore` → `stony_shore`
    * `jungle_edge` → `sparse_jungle`
    * `snowy_tundra` → `snowy_plains`
    * `giant_tree_taiga` → `old_growth_pine_taiga`
    * `giant_spruce_taiga` → `old_growth_spruce_taiga`
    * `tall_birch_forest` → `old_growth_birch_forest`
    * `moutains` → `windswept_hills`
    * `wooded_mountains` → `windswept_forest`
    * `gravelly_mountains` → `windswept_gravelly_hills`
    * `shattered_savanna` → `windswept_savanna`
    * `wooded_badlands_plateau` → `wooded_badlands`
    * `lofty_peaks` → `jagged_peaks`
    * `snowcapped_peaks` → `frozen_peaks`
  * 移除了生物群系 `badlands_plateau`，`bamboo_jungle_hills`，`birch_forest_hills`，`dark_forest_hills`，`desert_hills`，`desert_lakes`，`giant_spruce_taiga_hills`，`giant_tree_taiga_hills`，`jungle_hills`，`modified_badlands_plateau`，`modified_gravelly_mountains`，`modified_jungle`，`modified_jungle_edge`，`modified_wooded_badlands_plateau`，`mountain_edge`，`mushroom_field_shore`，`shattered_savanna_plateau`，`snowy_mountains`，`snowy_taiga_hills`，`snowy_taiga_mountains`，`swamp_hills`，`taiga_hills`，`taiga_mountains`，`tall_birch_hills`，`wooded_hills`。
  * **加入了表面规则；**
  * 在噪声设置的`noise`字段中加入`large_biomes`，`terrain_shaper`和`legacy_random_source`字段；
  * 移除了噪声设置中的 `bedrock_roof_position`， `bedrock_floor_position`， `deepslate_enabled`，`min_surface_level` 字段，移除了`noise`字段中的`density_factor`，`density_offset`，`use_legacy_random`，`simplex_surface_noise`，`random_density_offset`字段；
  * 移除了噪声设置中的`octaves`字段。现在通过噪声`minecraft:temerature`配置世界温度噪声；
  * **加入噪声JSON数据文件；**
  * 加入整数提供器`clamped_normal`，`weighted_list`；
  * 在世界生成步骤`UNDERGROUND_DECORATION`和`VEGETAL_DECORATION`增加了`FLUID_SPRINGS`；
  * **移除了地表生成器；**
  * 现在温度和湿度不会随着y轴变化；
  * 基岩层的生成现在受世界种子的控制；
  * **移除了方块放置器；**
  * 加入了方块状态提供器`dual_noise_2d_provider`，`noise_2d_cutoff_provider`，`noise_2d_provider`
  * 重命名方块状态提供器：
    * `noise_2d_provider` → `noise_provider`
    * `dual_noise_2d_provider` → `dual_noise_provider`
    * `noise_2d_cutoff_provider` → `noise_threshold_provider`
  * 移除了方块状态提供器`forest_flower_provider`和`plain_flower_provider`；

#### 资源包：

* 字体
  * 新增了字体`illageralt`
* 其他
  * `inventory.png`现在包含一个新的图标，应用于物品栏中状态效果的紧凑式显示；

### **1.17**

#### 数据包：

* 命令
  * 加入`/item`命令，取代了`/replaceitem`命令；
  * 加入`/pref`命令；
  * 加入了`/debug function`命令；
  * 移除了`/debug report`命令；
  * `/give`命令能给予的物品上限现在是100；
  * 现在 `/setblock`放置的结构方块默认为加载模式；
  * 加入记分板准则 `minecraft.custom:minecraft.total_world_time`；
  * 重命名记分板准则 `minecraft.custom:minecraft.play_one_minute` → `minecraft.custom:minecraft.play_time`；
* 进度
  * 加入触发器 `started_riding`， `lightning_strike`， `using_item`；
  * 在触发器 `effects_changed`中加入条件 `source`；
* 战利品表和谓词

  * 加入战利品表函数 `set_banner_pattern`， `set_nbt`， `set_damage`， `set_enchantments`；
  * 加入了值提供器，记分板现在可以被战利品表读取；

  * 加入`value_check`；
  * 把谓词中的所有物品条件字段的名称从`item`修改为了`items`，所有方块条件字段的名称从`block`修改为了`blocks`；
  * 在位置信息谓词加入 `passenger`和 `stepping_on`字段，在 `lightning_bolt`的实体子谓词中加入 `blocks_set_on_fire`和 `entity_struck`字段；
  * 在玩家的实体子谓词中加入 `looking_at`；
* 加入了物品修饰器
* NBT

  *  弹射物通用标签新增字段`HasBeenShot`；
  *  `fireball`的字段 `ExplosionPower`现在是byte而不是int；
  * 实体通用标签新增字段 `HasVisualFire`；
  * 史莱姆的字段 `Size`现在上限是126；
  * 药水云的字段 `Radius`现在上限是32；
* 标签
  * 加入了物品标签`candles`，`ignored_by_piglin_babies`，`piglin_food`， `freeze_immune_wearables`， `axolotl_tempt_items`， `occludes_vibration_signals`， `fox_food`, `diamond_ores`, `iron_ores`, `lapis_ores`, `redstone_ores`， `coal_ores`， `emerald_ores`， `copper_ores`， `cluster_max_harvestables`；
  * 加入了方块标签`candle_cakes`，`candles`， `cauldrons`， `crystal_sound_blocks`， `dripstone_replaceable_blocks`， `occludes_vibration_signals`， ` lush_ground_replaceable`， `cave_vaaines`， `moss_replaceable`， `stone_ore_replaceable`， `deepslate_ore_replaceable`， `geode_invalid_blocks`， `lava_pool_stone_replaceables`， `features_cannot_replace`， `coal_ores`， `emerald_ores`， `copper_ores`, `dirt`, `snow`， `small_dripleaf_placeable`， `needs_stone_tool`， `needs_iron_tool`， `needs_diamond_tool`， `mineable/axe`， `mineable/hoe`， `mineable/pickaxe`， `mineable/shovel`；
  * 重命名方块标签： `snow_step_sounds` → `inside_snow_step_sounds`
  * 加入了实体标签 `snow_step_sound_blocks`， `axolotl_always_hostiles`， `axolotl_hunt_targets`， `freeze_hurts_extra_types`，`freeze_immune_entity_types`；
  * 加入了游戏事件标签`vibrations`，` ignore_vibrations_sneaking`；
* 世界生成
  * 加入地物`geode`， `dripstone_cluster`， `large_dripstone`， `small_dripstone`， `glow_lichen`， `underwater_magma`， `scattered_ore`， `root_system`， `vegetation_patch`， `waterlogged_vegetation_patch`， `growing_plant`；
  * 拆分了地物 `glowstone_blob` 的放置修饰器；
  * 重命名了地物 `dripstone_cluster`中的字段`max_distance_from_center_affecting_chance_of_dripstone_column` → `max_distance_from_edge_affecting_chance_of_dripstone_column`；
  * 地物`ore`新增字段 `discard_chance_on_air_exposure`，将 `target`和 `state`字段替换为 `targets`，重命名字段 `leaves_provider` → `foliage_provider`；
  * 地物 `tree`新增字段 `sapling_provider`， `dirt_provider`， `force_dirt`，移除字段 `max_water_depth`， `heightmap`；
  * 地物 `simple_block`的字段 `to_place`现在是一个方块状态提供器；
  * 地物 `fossil`现在是可配置的，新增了一些字段；
  * 地物 `netherrack_replace_blobs`的字段 `radius`现在被限制在0-12；
  * 移除了地物 `no_surface_ore`；
  * 将地物  `emerald_ore`替换为`replace_single_block`；
  * 加入了放置修饰器 `water_depth_threshold`， `cave_surface`；
  * 放置修饰器 `heightmap`中新增字段 `heightmap`；
  * 放置修饰器` carving_mask`移除字段`probability`；
  * 放置修饰器`range`现在使用垂直锚点，字段`range`使用高度提供器；
  * 放置修饰器 `dripstone_cluster`和 `large_dripstone`现在使用浮点数字提供器；
  * 放置修饰器`count`现在不再允许负值；
  * 拆分了放置修饰器` dark_oak_tree`， `end_gateway`；
  * 移除了放置修饰器 `water_lake`，`emerald_ore`， `fire`, `lava_lake`， `top_solid_heightmap`， `heightmap_world_surface`，`glowstone`；
  * 地物中的树叶提供器加入 `random_spread_foliage_provider`，树干放置器加入 `bending_trunk_placer`；
  * 模板池新增字段 `weight`；
  * 结构地物 `nether_fossil`新增字段 `height`；
  * 雕刻器 `canyon`，`cave` 现在是可配置的，有多个字段；
  * 新增雕刻器字段 `debug_settings`；
  * 移除了雕刻器 `underwater_canyon`， `underwater_cave`；
  * 将雕刻器中的字段 `bottom_inclusive`和 `top_inclusive`替换为`y`；
  * 雕刻器新增字段`yScale`， `aquifers_enabled`，雕刻器字段 `debug_settings`新增字段 `water_state`， `lava_state`，`barrier_state`；
  * 噪声设置新增字段 `noise.min_y`， `aquifers_enabled`， `noise_caves_enabled`， `grimstone_enabled`， `min_surface_level`， `ore_veins_enabled`， `noodle_caves_enabled`；
  * 维度设置新增字段 `min_y`和 `height`；
  * 主世界的高度上限和下限均扩展了64格；
  * 加入了浮点数提供器；
  * 加入了整数提供器；
  * 随机浮点数提供器现在包含字段`min_inclusive`和`max_exclusive`；
  * 加入方块状态提供器 `randomized_int_state_provider`；
  * 加入了高度提供器；
  * 生物群系新增实体生成分类 `underground_water_creature`；
  * 加入自定义结构处理器 `protected_blocks`；
* 方块
  * 铁轨能含水了，水不再破坏铁轨；
  * 将炼药锅拆分为`cauldron`（空的炼药锅）， `water_cauldron`（装水的）和 `lava_cauldron`（装岩浆的）；
  * 重命名 `grass_path` → `dirt_path`，`grimstone `→`deepslate`；
  * 告示牌新增方块状态 `lit`；
  * 加入了 `light`方块；
* 实体
  * 加入了 `glow_item_frame`， `glow_squid`， `goat`；
  * **加入了`marker`**
* 其他
  * 加入粒子`small_flame`， `snowflake`， `dripping_dripstone_lava`， `falling_dripstone_lava`，`dripping_dripstone_water`， `falling_dripstone_water`， `vibration`， `dust_color_transition`， `glow`， `glow_squid_ink`， `falling_spore_blossom`， `spore_blossom_air`， `electric_spark`， `scrape`， `wax_on`， `wax_off`， `light`；
  * 加入游戏规则 `freezeDamage`， `playersSleepingPercentage`；
  * 加入了游戏事件；
  * 铜的氧化现在受到 `randomTickSpeed`游戏规则的影响；
  * 现在命名的实体的死亡信息会输出在日志中；
  * 进度和配方对矿物方块ID的引用现在是矿物标签以适配深板岩矿物变种；
  * 使用`F3+L`可以生成一份性能报告，储存在 `.minecraft/debug/profiling/`下；
  * 文本组件中的目标选择器组件和NBT组件可以使用字段 `separator`指定分隔符；

#### 资源包：

* 纹理
  * 加入 `misc/spyglass_scope.png`；
  * 加入`gui/container/bundle.png`用于收纳袋材质；
  * 更改了 `toasts.png`以包含收纳袋教程的图标；
  * 现在F3+F4游戏模式选择框的格子大小从25像素调整为26；
* 模型
  * 望远镜的模型现在被拆分为物品栏模型和手持模型；

* 着色器
  * 现在使用OpenGL 3.2渲染，可使用资源包替换原版着色器；
  * 新增资源包目录`shaders/core`和`shaders/include`；


* 其他
  * 制作者名单现在是json格式储存而不是txt；

- - -

### **1.16.2**

#### 数据包：

- 命令：
  - `/spawnpoint` 和 `/setworldspawn` 指令加入`angle`字段;
  - `/execute in`命令现在对于相对坐标和局部坐标会遵循不同维度的坐标缩放。
- 标签：
  - 标签现在可以使用键值对格式包含可选项，可选项不存在时不会导致标签检查不通过，格式形如`{ "id": "foo", "required": false }`；
- 世界生成：
  - 现在对`worldgen`目录提供了实验性支持：
    - `worldgen/biome`可以包含对生物群系的定义。
    - `worldgen/configured_carver`可以包含对地形雕刻器的定义。
    - `worldgen/configured_feature`可以包含对地形特征放置的定义。
    - `worldgen/configured_structure_feature`可以包含对生成结构放置的定义。
    - `worldgen/configured_surface_builder`可以包含对地表生成器的定义。
    - `worldgen/processor_list`可以包含对方块处理器的定义。
    - `worldgen/template_pool`可以包含对拼图结构的定义。
    - `worldgen/noise_settings`现在可以包含噪声配置。
    - 现在启用含生物群系的数据包后，就可以在单一生物群系、洞穴和浮岛中使用自定义生物群系。
    - 现在自定义生物群系可以在自定义维度生成器中使用。
    - **自定义世界生成和维度设置现在在数据包中使用相同的文件夹模式（namespace/<类型>/resource.json），与其他资源保持一致。**

### **1.16**

#### 数据包：

- 命令：
  - 加入指令`/locatebiome`
  - 加入指令 `/attribute`;
  - 加入粒子类型 `ash`, `crimson_spore`, `soul_fire_flame`, `warped_spore`,`dripping_obsidian_tear`, `falling_obsidian_tear`, `landing_obsidian_tear`,`soul`；
  - **属性命名由驼峰命名改为下划线命名；**
  - `/spreadplayers` 加入 `under` 子命令;
- NBT：
  - 物品展示框实体加入NBT数据 `Invisible` `Fixed`；
  - **实体的UUID值现在改为4元素整数数组；**；
  - 指南针物品现在拥有NBT字段 `LodestonePos`, `LodestoneDimensions`, `LoadstoneTracked`；
  - 带有`NoAI`标签的潜影贝生成时可以带有旋转角度；
  - 文本组件：
    - 文本组件`hoverEvent`加入字段 `contents`
    - 文本组件 `color` 组件现在可以带前缀#来使用RGB颜色；
    - 加入文本组件 `font`;
- 数据包组分：
  - 进度：
    - 加入进度触发器`target_hit`,`item_used_on_block`, `player_generates_container_loot`, `thrown_item_picked_up_by_entity`,`player_interacted_with_entity`；
    - **移除进度触发器 `safely_harvest_honey` ；**
    - **进度内容`location`, `slept_in_bed`, `hero_of_the_village`, `voluntary_exile` 字段被放入`location` 字段下；**
    - 进度触发器下的所有实体谓词现在都可以为战利品表谓词列表；
    - 为除`impossible`外的所有进度触发器加入条件 `player`;
  - 战利品表、谓词：
    - 实体谓词加入参数 `fishing_hook`；
    - 实体谓词下加入 `vehicle`, `targeted_entity` 实体谓词字段；
    - 位置谓词下加入 `smokey` 字段；
    - 谓词根对象现在可以为一个谓词列表，同时满足其中所有子谓词则通过；
  - 配方：
    - 加入配方类型 `smithing` ;
  - 标签：
    - 加入方块标签`soul_speed_blocks`;
  - 世界生成：
    - **加入实验性玩法“自定义世界”；**
    - 现在数据包可定义维度和维度类型；
    - 拼图方块加入nbt字段`joint`
    - 拼图方块现在有朝向方块状态；
    - 结构方块可保存的最大方块范围由32x32x32扩大为48x48x48;
- 其他：
  - 数据包加载优化：
    - 若加载失败，则修改不会被应用；
    - 如果进入世界时，已加载的数据包出错，会弹出“安全模式”选项；
    - 仅在数据包成功加载后修改数据包列表；
    - 数据包现在可以在世界生成之前指定；
    - 现在若数据包组分缺失（如卸载了`vanilla`数据包），将阻止玩家加载世界。
