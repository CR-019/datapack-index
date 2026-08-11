# Technical update log

> ⚠️The change log of this article is partially translated from the "Technical Update Log" page of misode:https://misode.github.io/changelog> It is recommended that capable readers read the original text and search for changes based on feature classification.

## Preface
Since recent versions have made many changes to the technical side, which have a greater impact on data pack compatibility, there may be situations where a tutorial or resource can only be used in a specific version, which may be a little confusing for developers who are not familiar with these data pack features. Therefore, the changes between versions are listed here.

Readers can refer to this tutorial for availability in your target version.

The change log uses the official version as the category entry and sorts it in descending order.

Routine updates (such as data pack/resource packversion number increment) are not listed.

Technical changes not related to data packs and resource packs are not listed.

Destructive changes (i.e. breaking) to the old version will be highlighted in bold.

:::warning Note
Since the source site has not updated the content of 1.21.8 and above, the update of this log has been suspended until it is synchronized with the latest version and translated together.  
We have sorted out the relevant destructive changes in subsequent versions by ourselves, which can be found in [lite version log](/en/index/changelog_breaking.md).
:::


## Migration Guide
[My world JE1.21 data pack folder name changed](https://www.bilibili.com/opus/942372286438047753)


## Change log

### **1.21.4**
#### data pack：
- command：
    -`/attribute`New command`reset`Subcommand:`attribute &lt;target&gt; &lt;attribute&gt; base reset`;
    - exist`/jfr`New events have been added to the command:`StructureGeneration`。
    - **`trial`Particles are added to a required field`duration`;**
    - Joined`pale_oak_leaves`particle type;
- nbt:
    - Renamed furnace class blockentity data field:
      -`CookTime` -> `cooking_time_spent`;
      - `CookTimeTotal` -> `cooking_total_time`;
      - `BurnTime` -> `lit_time_remaining`;
      - join in`lit_total_time`field;
    - Modified the NBT of TNT minecart:
      - **will`TNTFuse`Rename to`fuse`;**
      - Add optional fields`explosion_speed_factor`, indicating the additional explosion power of the minecart;
    - Have`block_entity_data`The component's blockitem will now only appear in`id`Set blockentity data when consistent with the placed blockentity;
    - Added storage bag usage animation`bundle`;
    - **`custom_model_data`The component is changed to a composite tag,`set_custom_model_data`Modifiers are updated synchronously; **
    - Add optional fields to text component format`shadow_color`, used to describe the text shadow color, which can be a decimal color code or an RGBA floating point array;
- Other components of data pack:
    - **Removed`#trim_templates`itemtag. **
    - Added a series of tags to mark blocks pollinated by bees and items that enemy mobs are more willing to pick up;
    - **Removed`trim_material`in the registry`item_model_index`Field;**
    - **`equippable`in the component`model`The field has now been renamed to`asset_id`. **
    - Environmental effects`effects`Now also includes the following:
      -`music`: The music that can be played in this mob group is a weighted list. If the list is empty, it means no music will be played;
      -`music_volume`: The volume of music in this mob group. When entering this mob group, the volume will transition smoothly;
    - for`simple_block`Optional fields have been added to type features`schedule_tick`,for`true`When, this block will request the planned moment;

#### resource pack:
- **<p style="font-size:28px">Introducing a new format to describe [item model](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E7%89%A9%E5%93%81%E6%A8%A1%E5%9E%8B)；</p>**
- **`toast/system`The sprite appearance has now been updated to use the standard nine-square grid division;**
- **`toast/tutorial`Sprites are now scaled to taller popups;**
- **`advancements/box_obtained`and`advancements/box_unobtained`GUI textures now use the nine-square grid division method to change size; **
- **Empty slot textures such as armor slots in the item bar are now removed from`item`move to`gui/sprites/container/slot`directory and rename it; **
- **Empty slot sprites in the Loom, Brewing Stand, Horse and Llama item bar GUI are now split from the background and moved;**
### **1.21.2**
#### data pack：
- command：
  - Joined`/rotate`command;
  - **Tie knots, floats and lightning no longer pass`/ride`Ride;**
  -`/loot`The command will now issue an error when trying to generate block drops that do not have a corresponding loot table.
  - Add game rules`disablePlayerMovementCheck`，`minecartMaxSpeed`;
  - Joined`block_crumble`and`trail`particle;
  - Particle type`trail`，`dust`，`dust_color_transition`The color parameters now support color codes and color float arrays;
  - **Attribute id no longer exists`generic.`，` player.`，`zombie.`Prefix; **
  - Add attributes`tempt_range`;
- nbt:
  - Added item component:`death_protection`，`item_model`，`equippable`，`glider`，`tooltip_style`，`consumable`，`use_remainder`，`use_cooldown`，`enchantable`，`repairable`- Modify item component`food`;Remove some fields and hand them over to`consumable`control;\
  -`instrument`Component join field`description`;
  - **Rename`fire_resistant`The item component is`damage_resistant`, and join`types`Field;**
  -`potion_contents`item component added`custom_name`field;
  - **Split the entity types of ships and box ships into separate entities for each texture;**
  - ** Container blockentity`Lock`The field is renamed to`lock`, and supports itempredicate;**
  - The entityX axis rotation angle must now be between -90 and 90;
  - Invalid in chat component`selector`Mode will now cause command parsing to fail instead of parsing to an empty string.
  - Optional fields have been added to TNT and TNT minecart entities.`explosion_power`;
- data pack components:
  - advancement:
    - **Rename`killed_by_crossbow`The criterion is`killed_by_arrow`;**
  - Enchantment:
    - **Rename enchantment type`damage_item`for`change_item_damage`, and supports negative values; **
  - loot table, predicate, item modifier:
    - **Remove loot table`empty`;**
    - Some items can be controlled by loot table:
      - Items produced by chickens laying eggs are now composed of`gameplay/chicken_lay`control;
      - Scale armor dropped by armadillos`gameplay/armadillo_shed`control;
      - Gifts given by villagers to village heroes are given by`gameplay/hero_of_the_village/unemployed_gift`and`gameplay/hero_of_the_village/baby_gift`control;
      - Objects dropped during wool shearing can be obtained by`shearing/sheep`control;
      - Mooshroom pruning drops are provided by`shearing/mooshroom`control;
    - **Removed`minecraft:boat`entity subpredicate;**
    - Add entity sub-predicate`salmon`，`sheep`;
    - Add player sub-predicate`input`, used to detect key input;
    - tool predicate (for`match_tool`etc. predicate) is now also available for`archaeology`，`vault`，`shearing`loot table type;
  -recipe:
    - Joined`crafting_transmute`recipe type, replace`crafting_special_shulkerboxcoloring`;
    - **recipe raw material format modification:**
      - **`{ "item": "&lt;item id&gt;" }`Modify to`"&lt;item id&gt;"`**
      - **`{ "tag": "&lt;tag id&gt;" }`Modify to`"#&lt;tag id&gt;"`**
      - **List format no longer supports tags**
    -`smithing_transform`and`smithing_trim`under recipe type`template`， `base`， `addition`Field is now optional;
  - tag:
    - Added itemtag:`gaze_disguise_equipment`，`map_invisibility_equipment`，`duplicates_allays`，`panda_eats_from_ground`，`brewing_fuel`，`piglin_safe_armor`，`repairs_leather_armor`， `repairs_iron_armor`， `repairs_chain_armor`， `repairs_gold_armor`， `repairs_diamond_armor`， `repairs_netherite_armor`， `repairs_turtle_helmet`， `repairs_wolf_armor`，`furnace_minecart_fuel`，`villager_picks_up`;
    - Added entitytag:`boat`;
    - Added blocktag:`bats_spawnable_on`;
  - Goat Horn Instrument is now data driven;
  - Join`ender_pearl`and`mace_smash`damage type;
  - world generation：
    - **Removed carvers type carvers, carvers can now be listed directly**;


#### resource pack:
- Texture:
  - The texture of the highlighted slot can now be customized by replacing the sprite map;
  - **All equipment related textures are now moved to`textures/entity/equipment`in the subdirectory. **
  - The background and border of the prompt box are determined by`tooltip/background`and`tooltip/frame`Sprite control.
- Model:
  - Add equipment model;
  - item override conditions`broken`Now available in all item models;
  - Add model fields`light_emission`, forced to set to the specified light level;
- shader:
  - Add core shader`rendertype_armor_translucent`, used for wolf armor rendering;
  - **`rendertype_entity_glint_direct`Rename to`rendertype_entity_glint`；**
  - **`rendertype_entity_translucent_cull`Rename to`rendertype_item_entity_translucent_cull`;**
  - **Procedural definition for post-processing effects (`assets/&lt;namespace>/shaders/program/&lt;name>.json`) is now defined with the core shader (`assets/&lt;namespace>/shaders/core/&lt;name>.json`) Uniformity: **
    - **Removed the ones that have no practical effect`blend`field. **
    - **Removed`attributes`fields whose vertex attributes`Position`will be bound forever. **
    - **`Uniform`Now provided for the core shader`Uniform`merge, where`Time`was renamed to`GameTime`;**
  - vertex and fragmentshader references now need to be shadernamespaceID.
    - vertex shader`&lt;namespace>:&lt;path>`will be processed as`assets/&lt;namespace>/shaders/&lt;path>.vsh`.
    - Fragment shader`&lt;namespace>:&lt;path>`will be processed as`assets/&lt;namespace>/shaders/&lt;path>.fsh`.
  - shader source files no longer need to be placed in`shaders/core`subdirectory.
  - shader import command`#moj_import`Namespace inclusion shaders with absolute paths are now supported.
  - **The post-processing pipeline routine is now represented by`assets/&lt;namespace>/shaders/post moved to assets/&lt;namespace>/post_effect`. **
  - Vertex and fragment shaders used by the post-processing pipeline are now`assets/&lt;namespace>/shaders/program`move to`assets/&lt;namespace>/shaders/post`. **
  - **Post processing rendering process`name`Now renamed to`program`, and namespaceID is required. **

### **1.21**

#### data pack：
- command：
  -`/give`，`/item`，`/loot`command now supports the use of`!`Prefix remove default component;
  -`generic.attack_knockback`Properties now apply to players;
  - Add attributes`generic.burning_time` ， `generic.explosion_knockback_resistance` ， `player.mining_efficiency` ， `generic.movement_efficiency` ， `generic.oxygen_bonus` ， `player.sneaking_speed` ， `player.submerged_mining_speed` ， `player.sweeping_damage_ratio` ， `generic.water_movement_efficiency`;
-nbt:
  - **Removed the arrow type entity`ShotFromCrossbow`Field**
- data pack components:
  - loot table, predicate, item modifier:
    - **Value renaming of entity keys such as predicate:**
      - **`killer` -> `attacker`**
      - **`direct_killer` -> `direct_attacker`**
      - **`killer_player` -> `attacking_player`**
    - in **predicate`enchantment`The field is renamed to`enchantments`;**
    - Added entity criterion`is_on_ground` ， `is_flying` ， `can_see_sky` ， `weather`;
    - Added entity sub-predicate`movement` ， `periodic_ticks`- **Rename`random_chance_with_looting`The condition is`random_chance_with_enchanted_bonus`, and modify the following fields: **
      - **Remove`looting_multiplier`Field;**
      - **`chance`Now for level dependent functions; **
      - **Join`enchantment`Field;**
    - Join`enchantment_active_check`conditions;
    - **Rename`looting_enchant`function is`enchanted_count_increase`, and join`enchantment`Field;**
    - **at`enchant_randomly`Modify the following fields under function: **
      - **`enchantments`The field is renamed to`options；`**
      - **Add Boolean value field`only_compatible` ；**
    - **`enchant_with_levels`Modify under function: **
      - **Removed`treasure`Field;**
      - **Join`options`Field;**
    - **`copy_name`function change: renamed fields`source`Enumeration value: **
      - **will`killer`Rename to`attacking_entity`. **
      - **Will`killer_player`Rename to`last_damage_player`**
    - `random_chance`Conditions now accept numeric providers as values;
    - Added value provider`enchantment_level`;
  - Enchantment:
    - Enchantments are now data driven;
      - Naturally occurring enchantments are controlled by enchantment providers;
      - Excluded enchantments are controlled by tags;
  - Painting is now data driven;
  - Added damage type`campfire`，`burn_from_stepping`;
  - world generation: join blockpredicate`unobstructed`### **1.20.5**

#### data pack：
- command：
  - item processing:
    -`/item`The command's item slot supports using "*" to represent any slot;
    - Join`/execute if items`subcommand;
    - Add item slot`contents`， `player.cursor`， `player.crafting.0` - `player.crafting.3`;
    - `/loot`，`/item`，`/execute if predicate`Command now supports inline loot table, predicate, and item decorators.
  - Particles:
    - **`/particle`The command format has been modified. There are too many to list. [Go to the wiki to see](https://zh.minecraft.wiki/w/Java%E7%89%881.20.5-pre1#%E5%B8%B8%E8%A7%84_2)**
    - Add particle type`infested`， `item_cobweb`， `small_gust`， `raid_omen`， `trial_omen`， `trial_spawner_detection_ominous`，  `ominous_spawning`，`vault_connection`;
    - **Split particles`gust_emitter`for`gust_emitter_large`and`gust_emitter_small`**
    - Removed particle types`gust_dust`;
  - Properties:
    - Add attributes:`generic.gravity`，`generic.jump_strength`，`generic.safe_fall_distance`，`generic.fall_damage_multiplier`，`player.block_break_speed`，`generic.block_interaction_range`，`generic.entity_interaction_range`，`generic.scale`，`generic.step_height`;
    - Rename properties:
      - **generic.block_interaction_range** → **player.block_interaction_range**
      - **generic.entity_interaction_range** → **player.entity_interaction_range**
    - **Remove attributes:`horse.jump_strength`**
  - `/place jigsaw`The instruction allows a maximum depth of 20;
  - Join`/transfer`instructions;
  - Add game rules`spawnChunkRadius`- **The maximum command length is now 2000000 (2 million) characters;**
- entity and NBT:
  - Add new entity type`breeze_wind_charge`;
  - **Modified the regional effect cloud entity`Particle`The fields are in the same format as command/world generation;**
  - Change monster spawner blockentity data`SpawnPotentials`Neutralization trial monster spawner blockentity data`spawn_potentials`Optional fields in`equipment_loot_table`Rename to`equipment`.
  - The number of pages in a book is no longer limited to 255 (there is still a maximum page limit of 100 in survival);
  - In the monster spawner`SpawnPotentials`Optional added to generated data`equipment_loot_table`A string value used to randomly select items from the specified loot table and equip them to the generated mob.
  - Flag patterns are now data driven;
  - Wolf variants are data driven;
  - **Potion Arrow's`Potion`and`custom_potion_effects`fields are merged in`item`within tag;**
  - **Modify the effect field of the potion effect cloud to match`potion_contents`Component matching;**
  - **Modify the blockentity field of the flag to and`banner_patterns`Component matching;**
  - **Modify hive's blockentity field to be`bees`Component matching;**
  - **Rename some NBT fields of blocks and entities:**
    - **Location nbt:`{X:1，Y:2，Z:3}` → `[I;1，2，3]`**
    - **bee:`FlowerPos` and `HivePos` → `flower_pos` and `hive_pos`**
    - **Hive:`FlowerPos` → `flower_pos`**
    - **End Crystal:`BeamTarget` → `beam_target`**
    - **Mobs that can be towed by tethers:`Leash` → `leash`**
    - **raid mob:`PatrolTarget` → `patrol_target`**
    - **End Portal:`ExitPortal` → `exit_portal`**
    - **Wandering Trader:`WanderTarget` → `wander_target`**
  - Projectile enchantments, such as infinite, multishot, piercing, etc., now work on both bows and crossbows;
  - **Removed the counter-productive behavior of some potions when they are above level 127;**
  - Remove the effect of NBT`FactorCalculationData`Field
- **item component**:
  - **<p style="font-size:28px">item's NBTtags are replaced by the new structured item component:</p>**
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
  - Added item component`enchantment_glint_override`;
  - **item format`Count`Rename to`count`**
  - max_stack_size and max_damage item components cannot exist at the same time;
  -`writable_book_content`and`written_book_content`item stack component: unfiltered JSON text raw information`text`was renamed to`raw`to avoid ambiguity.
  -`profile`item stacking component: now specified`id`without specifying`name`At this time, player file data can be directly parsed by UUID.
- data pack components:
  - advancement:
    -Add advancement trigger`crafter_recipe_crafted` ， `fall_after_explosion`， `any_block_use`，`default_block_use`;;
  - loot table:
    - Added loot table type`equipment`;
    - Added value provider`storage`;
    - Add list operation of loot table elements with fields`mode`;
    - **Nested lists are no longer supported in loot function lists.**
    - **loot table extraction item loot_table (returning all items from the provided nested loot table) now has the following syntax: value can be: **
      - **A namespaceID refers to a reference to another loot table. **
      - **Complete loot table, the format is the same as the independent file's loot table. **
    - Panda sneezing drops are now made by`gameplay/panda_sneeze`loot table control;
  - predicate:
    - Add item sub-predicate`container` ， `bundle_contents` ， `firework_explosion` ， `fireworks` ， `writable_book_content` ， `written_book_content` ， `attribute_modifiers` ， `trim` ， `max_stack_size` ， `max_damage` ， `fire_resistant` ， `rarity` ， `tool` ， `hide_tooltip`;
    - Add entity sub-predicate`raider`，`wolf`- exist`equipment`Added under entity sub-predicate`body`field;
    - Entity sub-predicate added`slot`field;
    - **itempredicate modification:**
      - **The tag field has been removed, and the items field now supports tags;**
      - **potion field renamed to potions;**
      - **nbt field renamed to custom_data;**
    - **blockpredicate modified**
      - **Remove tag field, blocks field now supports tag;**
    - **fluid predicate`fluid`Rename to`fluids`**
    - entitypredicate`type`Support tag;
    - **Location predicate modified:**
      - **`biome`Rename to`biomes`, and supports group tags; **
      - **`structure`Rename to`structures`, and supports structure tag;**
    -Modify predicate`cat`，`frog`，`painting`of`variant`Field format;
    - Extended [itempredicate format](https://zh.minecraft.wiki/w/24w12a#%E5%91%BD%E4%BB%A4%E6%A0%BC%E5%BC%8F);
    - **Modify itempredicate`predicates`The following sub-predicate: **
      - **`durability` -> `damage`subpredicate;**
      - **`enchantments` -> `enchantments`subpredicate;**
      - **`stored_enchantments` -> `stored_enchantments`subpredicate;**
      - **`potions` -> `potion_contents`subpredicate;**
      - **`custom_data` ->  `custom_data`subpredicate;**
    - Remove`type_specific`down`any`entity subpredicate;
  - item decorator:
    - Added item modifier function`modify_contents` ， `modify_contents` ， `filtered` ， `set_custom_model_data` ， `set_ominous_bottle_amplifier`，`toggle_tooltips`，`set_fireworks`，`set_firework_explosion`，`set_book_cover`，`set_writable_book_pages`，`set_written_book_pages`，`copy_components`， `set_components`- **Rename item decorator function**
      - **`set_nbt` → `set_custom_data`**
      - **`copy_nbt` → `copy_custom_data`**

    - **Rename`/attribute`The operation field of command: **
      - **`add` → `add_value`**
      - **`multiply_base` → `add_multiplied_base`**
      - **`multiply` → `add_multiplied_total`**
    - Removed`set_contents`in item decorator function`type`fields and join`component`field;
    - for`set_attributes`item modifier function added`replace`field;
    -`set_lore`Under item modifier function`replace`The field is renamed to`mode`;
    - `set_written_book_pages`function：`pages`Now a JSON object instead of a JSON text.
    - Added collection matchers, which are used in predicates. It is an object with optional fields: size (int bounds), contains (list of element predicates), and count (object with fields test and count). (No information found)
  -recipe:
    - **The product column of recipe now supports specified item components**;
  - damage type:
    - Add damage type`bypasses_wolf_armor`，`spit`，`wind_charge`;
  - tag:
    - New:
      - Add blocktag`incorrect_for_wooden_tool`， `incorrect_for_gold_tool`， `incorrect_for_stone_tool`， `incorrect_for_iron_tool`， `incorrect_for_diamond_tool`， `incorrect_for_netherite_tool`，`does_not_block_hoppers`，`badlands_terracotta`，`blocks_wind_charge_explosions`;
      - Add itemtag`meat`， `piglin_food`， `fox_food`， `cow_food`， `goat_food`， `sheep_food`， `wolf_food`， `cat_food`， `horse_food`， `horse_tempt_items`， `camel_food`， `armadillo_food`， `bee_food`， `chicken_food`， `frog_food`， `hoglin_food`， `llama_food`， `llama_tempt_items`， `ocelot_food`， `panda_food`， `pig_food`， `rabbit_food`， `strider_food`， `strider_tempt_items`， `turtle_food`， `parrot_food`， `parrot_poisonous_food`，`dyeable`，`chest_armor`， `foot_armor`， `head_armor`， `leg_armor`， `skulls`， `enchantable/armor`， `enchantable/bow`， `enchantable/chest_armor`， `enchantable/crossbow`， `enchantable/durability`， `enchantable/equippable`， `enchantable/fishing`， `enchantable/foot_armor`， `enchantable/head_armor`， `enchantable/leg_armor`， `enchantable/mining`， `enchantable/mining_loot`， `enchantable/sword`， `enchantable/trident`， `enchantable/vanishing`， `enchantable/weapon`;
      - Add entity type tag`punchable_projectiles`，`immune_to_oozing` ， `immune_to_infested`，`sensitive_to_smite`，`no_anger_from_wind_charge`，`deflects_projectiles`，`aquatic`， `arthropod`， `ignores_poison_and_regen`， `illager`， `illager_friends`， `inverted_healing_and_harm`， `not_scary_for_pufferfish`， `sensitive_to_bane_of_arthropods`， `sensitive_to_impaling`，  `wither_friends`;
      - Add damage typetag`is_player_attack`， `always_kills_armor_stands`- Add enchantment tag`tooltip_order`;
    -Modification:
      -entitytag`punchable_projectiles`Rename to`redirectable_projectile`;
      - Rename`axolotl_tempt_items`for`axolotl_food`;
    - Remove:
      - **Remove itemtag`tools`**
      - Remove entitytag`deflects_arrows` ，`deflects_tridents`- world generation：
    - Added a new terrain adjustment method encapsulate for configured structural features;
    - **for`worldgen`Defined integer and floating point providers are no longer wrapped in`type`next to extra`value`in the field. **
- Others:
  - The nbtitem copied using ctrl+mouse is no longer displayed`(+NBT)`annotation;
#### resource pack:
- Texture:
  - When teleporting from the Nether and the End or going to the Nether End, the loading interface displays the corresponding portal texture animation;
  - **Change map decoration icons from previous ones`map_icons.png`separated from`textures/map/decorations`/Atlas loaded in directory;**
  - Added multi-layer texture of wolf armor;
- Font:
  - **ttf font provider`shift`Field values are now limited to between -512 and 512; **
  - Added font variant filter;
- shader:
  - **Post-processing shader`blur`Rename to`box_blur`;**
  - **Added`entity_outline_box_blur`shader;**
  - Added optional fields for post-processing`use_linear_filter`. When true, the texture sampling mode of this process switches from nearest neighbor sampling to linear interpolation.

### **1.20.3**

#### data pack：
- command：
  - for`/scoreboard`Add a new subcommand:
    -`scoreboard players display name &lt;targets&gt; &lt;objective&gt; &lt;text component&gt;`
    - `scoreboard players display name &lt;targets&gt; &lt;objective&gt;`
    - `scoreboard objectives modify &lt;scoreboard&gt; displayautoupdate [true|false]`- Number format:
      -`scoreboard objectives modify &lt;objective&gt; numberformat &lt;format&gt;`
      - `scoreboard objectives modify &lt;objective&gt; numberformat`
      - `scoreboard players display numberformat &lt;targets&gt; &lt;score&gt; &lt;format&gt;`
      - `scoreboard players display numberformat &lt;targets&gt; &lt;score&gt;`- Added`/return fail`subcommand;
  - Reintroduction`/execute if function`，`/return run`subcommand;
  - **`/function`command no longer returns the number of executed commands;**
  - Add particle type`white_smoke`，`dust_plume`;
  - Add game rules`playersNetherPortalDefaultDelay`， `playersNetherPortalCreativeDelay`， `projectilesCanBreakBlocks`，`maxCommandForkCount`.
  - **Game rules`maxCommandChainLength`Counting is now stricter;**
- NBT:
  - **Rename the registered name of block grass and its corresponding item from minecraft:grass to minecraft:short_grass**
  - Added fields for blockentity decorative pots`LootTable`and`LootTableSeed`;
  - Decorated clay pots are added to the item field;
  - **Place the trident (entity)`Trident`The field is renamed to`item`;**
  - **TNTentity’s nbt data:`Fuse`Rename to`fuse`; Add to`block_state`Field;**
  - Non-mobentities with custom names will also display their names:
  - Wither Head entity added`dangerous`field;
  - The inspection of text components is more stringent:
    - Right`color`，`clickEvent`，`hoverEvent`Errors in will be reported instead of silently ignored;
    - Empty strings are no longer accepted;
    - Texts of numeric and boolean types are no longer parsed as strings;
    - That is: the writing of text components needs to be more standardized, Boolean values and numerical values cannot be enclosed in quotation marks, and string types need to be enclosed in quotation marks;
- data pack components:
  - tag:
    - Add damage typetag`can_break_armor_stands`- Add entity type tag`can_breathe_under_water`， `undead`， `zombies`.
  - world generation：
    - Increased the maximum field length of the puzzle structure from 7 to 20;
    - Added in puzzle block editing interface`Selection Priority`and`Placement Priority`field;
    - Add optional fields to the structure format`pool_aliases`;

#### resource pack:
- Texture:
  -`.png`Now the only supported texture format;


### **1.20.2**

#### data pack：
- command：
  - Join`/random`instructions;
  - **The function macro has been added, and macro parameters can be added to the function and passed into the function to achieve dynamic functions; **
  - **You can use a backslash at the end of a command line`\`Indicates line break to support multi-line single instructions and increase readability; **
  - Add game rules`enderPearlsVanishOnDeath`;
  - The frequency of weather updates checked in the open air block is now subject to game rules`randomTickSpeed`influence;
  - Add attributes`generic.max_absorption`;
- Debugging:
  - Charts in the debug window can now be accessed via`F3+1`，`F3+2`，`F3+3`call out;
  - The debug window now displays a network load graph;
  - Now the command memory function saves 50 items across archives, which can be found in the game folder`command_history.txt`found in the file;
- NBT:
  - **mobNBT's status effect id is changed from numeric id to namespaceid (string)**;
  - **Many status effect related entityNBT key names changed from camel case to snake format: **
    * **mob status effect field: **
      *`Id` -> `id`
      * `Ambient` -> `ambient`
      * `Amplifier` -> `amplifier`
      * `Duration` -> `duration`
      * `ShowParticles` -> `show_particles`
      * `ShowIcon` -> `show_icon`
      * `HiddenEffect` -> `hidden_effect`
      * `FactorCalculationData` -> `factor_calculation_data`* **Potions and Potion Arrows:**
      *`CustomPotionEffects` -> `custom_potion_effects`* **Status Effect Cloud and Mysterious Stew:**
      *`Effects` -> `effects`
      * `EffectId` -> `id`
      * `EffectDuration` -> `duration`* **Mooshroom:**
      *`EffectId` and `EffectDuration` -> `stew_effects`* **mob status effect:**
    *`ActiveEffects` -> `active_effects`* **Beacon:**
      *`Primary` -> `primary_effect`
      * `Secondary` -> `secondary_effect`- The display entity will now update the client's position and rotation at the first tick after updating.
    - Previously, updates were applied in the same tick, causing jerky motion.
    - New behavior similar to mobs.
    - In the server, position and rotation are still updated immediately.
  - Barrier blocks can now contain water, but water can only be added by the creative mode player;
- data pack components:
  - loot table, item modifier, predicate:
    -`all_of`predicate and`sequence`The item decorator function can be declared as an inline untyped array;
    - Add item modifier function`sequence`;
  - tag:
    - Add blocktag`concrete_powder` ， `camel_sand_step_sound_blocks`- Add entity type tag`non_controlling_rider`-Add damage tag`always_kills_armor_stands`，`no_knockback`;
  - world generation：
    - Add world generation features`minecraft:ore_diamond_medium`;
- Others:
  - in`pack.mcmeta`Add to file`supported_formats`Field, you can specify a version interval supported by data pack/resource pack;
  - Added data pack/resource pack coverage function, which can be used according to data pack/resource pack version`pack.mcmeta`Specify to overwrite some files of the original data pack;
#### resource pack:
- Texture:
  - Changed structure icons on explorer maps sold by cartographers.
  - **The text edit box is now a`widget/text_field`and`widget/text_field_highlighted`A sprite diagram divided into nine squares. **
  - **Scrollbars for lists and edit boxes are now a`widget/scroller`A sprite diagram divided into nine squares. **
  - **`realms`The namespace texture is moved in`minecraft`Within namespace;**
  - GUI textures are now passable.`mcmeta`Add animation to file. The prompt icon for the previous Realms trial and the status icon for Realms about to expire are now animated in this way, instead of the previous hard coding.
  - **All GUI textures containing multiple widget maps are now split into separate maps located in`textures/gui/sprites`directory. **
  - **`villager2.png`was renamed to`villager.png`**
  - GUI texture atlas is now available via`.mcmeta`in the file`gui`Some custom transformation behavior.
    - Currently this section only includes`scaling`Fields, which have 3 types, can be specified through the type parameter:`stretch`(stretch, default),`tile`(tiled) and`nine_slice`(Nine-square grid division).
    -`tile`and`nine_slice`Additional parameters need to be provided for proper display.
    - The background texture of the storage bag floating prompt box is now adopted`nine_slice`way to deal with it.
  - **Button icons for Accessibility, Languages, and Realms News are now separate files and are no longer attached to the button's texture. **
- Model:
  - Added armor decorations`decal`field;

### **1.20**

#### data pack：
- command：
  - Join`/return`command;
- NBT:
  - Added dynamic drop shards option for the name field of the the dynamic loot table entry. It drops the shards of a decorated pot.
  - Add decorative pottery to the blockentity`shard`The field is renamed to`sherd`;
  - Will`item_display`The displayed item is rotated 180 degrees along the Y-axis to match the rendering transform applied to the rendered armor stand head and the item on the display frame.
  - Modified the NBT of the notice board: removed`Text1`， `Text2`， `Text3`, and`Text4`, joined`front_text`and`back_text`;
  - Notice boards with click events can trigger interactions even if they are not waxed;
- data pack components:
  - advancement:
    -Add advancement trigger`recipe_crafted`;
    - **`placed_block`， `item_used_on_block`, and`allay_drop_item_on_block`All fields under the advancement trigger are merged`location`field; this field now accepts a loot tablepredicate. **
  - loot table, predicate, item modifier:
    - Add fields to loot table`random_sequence`, you can specify the random sequence used to generate items. ID is optional. When not specified, the sequence will be generated by an unspecified random seed.
    - **join in`all_of`condition,`alternative`The condition is renamed to`any_of`**
    - Add item modifier function`reference`
  - recipe：
    - `smithing_trim`and`smithing_transform`type of recipe whose`template`、`​base`and`addition`Fields now support listing multiple raw materials in an array. These fields allow empty arrays, which means leaving this slot empty.
  - damage type:
    - Add damage type`outside_border`and`generic_kill`.
  - tag:
    - Add itemtag`villager_plantable_seeds`;
    - Add blocktag`maintains_farmland`，`enchantment_power_provider`， `enchantment_power_transmitter`，`sword_efficient` ；
    - blocktag`replaceable_plants`Split into`replaceable`and`replaceable_by_trees`- world generation：
    - Features on the ground`huge_fungus`Join below`replaceable_blocks`field;
    - Added structural post-processor`capped`;
    - Removed structural postprocessor`rule`of`output_nbt`Field, added`block_entity_modifier `as an alternative.
#### resource pack:
- Font:
  - **Remove character provider`legacy_unicode`;**
  - Added character provider`reference` ， `unihex`;


### **1.19.4**

#### data pack：
- command：
  - Add subcommand`execute positioned over`;
  - Add subcommand`/execute on`;
  - join in`/execute summon`subcommand;
  - Join`/execute if|unless dimension &lt;dimension&gt;`subcommand;
  - Join`/execute if|unless loaded &lt;pos&gt;`subcommand;
  - Join`/damage`instructions;
  - Join`/ride`instructions;
  -`infinite`Now available as`/effect`The duration parameter of command;
  -`/clone`Instructions can now be copied across dimensions;
  -`/weather`，`/title &lt;selector&gt; times`The command's duration parameter now supports suffixes with t, s, or d;
  -`/data`command join data source`string &lt;entity|block|storage&gt; [path] [start] [end]`;
  - Add game rules`doVinesSpread`，`commandModificationBlockLimit`;
- entity and NBT
  - **Add (block, item, text) display entity, interactive entity; **
  - in`HideFlags`Adding 128 to the field will hide the item prompt box;
- data pack components
  - loot table, predicate, item modifier:
    - **damage typepredicate is modified, the original criterion is removed, and the new damage type data judgment is used instead, using`tags`Field judgment;**
  - Add damage type data;
  -recipe:
    - Add recipe type`crafting_decorated_pot`;`smithing_transform`;;
    -recipe type`crafting_shaped`New`show_notification`field;
  - tag:
    - Add blocktag`smelts_to_glass`;
    - Add itemtag`smelts_to_glass`，`trim_materials`， `trim_templates`， `trimmable_armor`;
    - Add entity type tag`fall_damage_immune`- Add damage typetag`bypasses_shield`，`bypasses_cooldown`，`always_hurts_ender_dragons`;
  - world generation：
    - Added mob community field`spawns_white_rabbits`;
    - Removed mob biofield`precipitation`;
#### resource pack:
- Texture:
  - Enchanted light effects are now split into two separate texture files:`enchanted_glint_entity.png`and` enchanted_glint_item.png`.
  - Add image gallery source:`paletted_permutations`;
  - Added armor decoration;
- Translation:
  -`en_us.json`Translation files are now sorted alphabetically;
- shader:
  - Add shader type`rendertype_text_background`and`rendertype_text_background_see_through`;

### **1.19.3**

#### data pack：
- command：
  - Add instructions`/fillbiome`;
  - Add subcommand`/execute if|unless biome &lt;pos&gt; &lt;biome&gt;`;
  - **modified command`/publish`The format**;
  - Added game rules`blockExplosionDropDecay`， `mobExplosionDropDecay` ， `tntExplosionDropDecay` ，`snowAccumulationHeight` ， `waterSourceConversion` ， `lavaSourceConversion` ， `globalSoundEvents`;
- data pack components:
  -recipe:
    - **Add required fields to the recipe file`category`;**
  - tag:
    - Add blocktag`invalid_spawn_inside`，`stripped_logs`;
    - Add itemtag`stripped_logs`;
    - **Remove blocktag`overworld_natural_logs`;**
  - world generation：
    - Remove`template_pool`of`name`field;
#### resource pack:
- Texture:
  - **at`entity/player/(slim|wide)`Added default player skins; removed`entity/steve`and`entity/alex`**;
  - **Modified`gui/container/creative_inventory/tabs`texture**;

### **1.19.1**
- Rename`team_name`The parameters are`target`;
- Chat type definition, omitted;
-`run_command`Click events no longer support outputting chat messages and always require a prefix`/`;

### **1.19**

#### data pack：
- command：
  - Join`/place`instructions;
  -`/locate`command to join`poi`subcommand;
  - Add particle type`sonic_boom`，`shriek`，`sculk_charge`， `sculk_charge_pop` ， `sculk_soul`;
  - Removed particle types`vibration`of`origin`parameters;
  - **Cat variant changed from numeric id to namespaceid;**
  - playerNBT added field`warden_spawn_tracker`;
  - **Status effects`ID`The type is changed from byte type to integer type; **
- advancement:
  -Add advancement trigger`avoid_vibration`，`thrown_item_picked_up_by_player` ， `allay_drop_item_on_block`，`kill_mob_near_sculk_catalyst`;
  - **advancement trigger`location`， `slept_in_bed`， `hero_of_the_village`and`voluntary_exile`Down`location`Fields are moved into`player.location`Location;**
- loot table, predicate, item modifier:
  - use`type_specific`Field replacement`player`， `fishing_hook`， `lightning_bolt`， `catType` `field, with types: player`，`fishing_hook`，`lightning`，`cat`，`slime`，`frog`;
  - **Location predicate field`feature`Rename to`structure`;**
  - Add item modifier`set_instrument`;
- tag:
  - Add blocktag`dragon_transparent`;
  - blocktag `occludes_vibration_signals`Rename to`dampens_vibrations`;
  - Add point of interest type tag:`acquirable_job_site`， `bee_home`， `village`;
  - Added flag type tag;
- world generation：
  - Add mob group tag`mineshaft_blocking`;
  - Add dimension type field`monster_spawn_block_light_limit` ，`monster_spawn_light_level`;
  - Add optional fields to the puzzle structure`start_jigsaw_name`;
  - Terrain Sculptor Add fields`replaceable`;
  - Remove features`ice_patch` ， `ice_patch`and by features`disk`instead of;
  - Tree root placer format modification:
    -`y_offset`Rename to`trunk_offset_y`;
    - fields`max_root_width`， `max_root_length`， `random_skew_chance`， `can_grow_through`， `muddy_roots_in`， `muddy_roots_provider`move in`mangrove_root_placement`under the object;
    - Add fields`above_root_placement`;
  - tree decorator`leave_vine`Add fields:`probability`;
  - Features`tree`Add fields`root_placer`;
  - Added tree trunk placer`upwards_branching_trunk_placer`;
  - Add features`surface_disk`;
  - Features`glow_lichen`Rename to`multiface_growth` ;
  - `block_rot`Processor fields`rottable_blocks`Need one now`#`prefix;
  - Remove structure fields`adapt_noise`;
  - Add structure fields`terrain_adaptation`;
  - Features`sculk_patch`Add fields`extra_rare_growths`;
  - `block_rot`Processor adds optional fields`rottable_blocks`;
  - Removed density function`slide`,Depend on`add`， `mul` ， `y_clamped_gradient`instead of;
  - Removed noise setting field`noise.sampling`， `noise.top_slide`，  `noise.bottom_slide`, and moved into the density function;
  - Density function old_blended_noise added field`xz_scale`， `y_scale`， `xz_factor`， `y_factor`， `smear_scale_multiplier`.
  - Added fields to puzzle structure`max_distance_from_center`;
  - dimension type is no longer inline in dimension data;
  - Removed chunk noise generator`seed`field;
  - Removed density function`terrain_shaper_spline`and remove the density function`spline`of`min_value`and`max_value`field;
  - Removed mob biofield`category`;
  - Added feature types`sculk_patch`;
  - Will`worldgen/configured_structure_feature`Move folder into`worldgen/structure`folder;
- Others:
  - Add chat type;
#### resource pack:
- Font:
  - Added glyph provider`space`;

### **1.18.2**

#### data pack：

* command
  * `locate`command now accepts the configured structure object ID as a parameter instead of the structure type;
  *`locate`command and`locatebiome`command now supports tags as parameters;
  * Join`/placefeature`command;
*tag
  * Any registration type can now have tags. tags are stored in`&lt;namespace>/tags/&lt;type registry name>`Down. The original tag folder name remains unchanged;
  * Add mob group tag`is_badlands`，`is_beach`，`is_deep_ocean`，`is_forest`，`is_hill`，`is_jungle`，`is_mountain`，`is_nether`，`is_ocean`，`is_river`,and`is_taiga`;
* world generation
  * Add density function`spline`;
  * Add new fields to configured structural features`adapt_noise`and`spawn_overrides`;
  * Added structure set JSON file, replacing the noise field`structures`field;
  * Removed fields in noise settings`noise_caves_enabled`，`noodle_caves_enabled`;
  * Add noise setting field`noise_router`;
  * Add density functionJSON file;
  * Add new fields to configured structural features`biomes`;
  * Some fields that accept lists of IDs can now accept tags. Also, these fields can accept either a list as multiple values or a string as a single value:
    *`feature.glow_lichen`in configuration`can_be_placed_on`
    * `feature.spring_feature`in configuration`valid_blocks`
    * `feature.simple_random_selector`in configuration`features`
    * `block_predicate_type.matching_blocks`in`blocks`
    * `block_predicate_type.matching_fluids`in`fluids`
    * `biome`in`features`internal list of and`carvers`The mapping value of
    *`biome_source.checkerboard`in`biomes`* Some tag fields now require the ID to be preceded by`#`, but they do not accept lists of elements yet:
    -`dimension_type`in`infiniburn`
    - `feature.geode`in configuration`blocks.cannot_replace`and`blocks.invalid_blocks`
    - `feature.vegetation_patch`and`feature.waterlogged_vegetation_patch`in configuration`replaceable`
    - `feature.root_system`in configuration`root_replaceable`
    - `structure_processor.protected_blocks`in`value`* Modified the noise settings`structures`format;

#### resource pack:

* Others:
  * added`assets/minecraft/regional_compliancies.json`Used to configure anti-addiction prompts for Korean players;

### **1.18**

#### data pack：

*command

  * Move particles`light`and`barrier`unified as`block_marker`;
  * join in`/jfr`command
  * Removed the name length limit for score items, scoreboard names, and team names;

*NBT

  * In the monster spawner`SpawnData`fields and`SpawnPotentials`added in`custom_spawn_rules`field;

  * Will be the monster spawner`SpawnPotentials`The format changes to:

```snbt
    {
        weight: <int>,
        data: {
        	entity: {...},
    		custom_spawn_rules: {...}
    	}
    }
    ```
* Will be the monster spawner`SpawnData`The contents of the field are moved to`SpawnData.entity`;

* advancement

  * Add trigger`fall_from_height`，`ride_entity_in_lava`;
  * Change the advancementpredicate in`nether_travel`of`entered`Rename to`start_position`, removed the field`exit`;

* item modifier

  * Add item modifier function`set_potion`* **Now`set_contents`and`set_loot_table`item decorator function requires`type`Field**

*tag

  * Add blocktag:`terracotta`，`replacable_plants`，`azalea_grows_on`，`azalea_root_replaceable`，`animals_spawnable_on`， `axolotls_spawnable_on`， `goats_spawnable_on`， `mooshrooms_spawnable_on`， `parrots_spawnable_on`， `polar_bears_spawnable_on_in_frozen_ocean`， `rabbits_spawnable_on`， `foxes_spawnable_on`， `wolves_spawnable_on`;
  * Add itemtag:`dirt`and`terracotta`;
  * Change blocktag`lava_pool_stone_replaceables`Rename to`lava_pool_stone_cannot_replace`;

* world generation
  * **Add blockpredicate for feature placement; **
  * **Added placed features;**
  * Configure the configured features`random_boolean_selector`fields in`feature_false`，`feature_true`Modified to placed features;
  * Configure the configured features`vegetation_patch`and`waterlogged_vegetation_patch`in`vegetation_feature`Modify to placed features;
  * Configure the configured features`glow_lichen`in`can_be_placed_on`The field is modified to a blockID list;
  * Features on the ground`twisting_vines`Add new fields in`spread_width`，`spread_height`and`max_height`;
  * Features on the ground`nether_forest_vegetation`Add new fields in`spread_width`and`spread_height`;
  * Place features`small_dripstone`Replace with`pointed_dripstone`* From features`lake`Remove fields from`state`, add a new field`fluid`and`barrier`;
  * Place features`block_column`in`allow_water`field replaced with`allowed_placements`field;
  * Removed features`random_patch`，`flower`and`flower_no_bonemeal`in`only_in_air`，`allowed_on`and`disallowed_on`field;
  * Removed the water lake feature;
  * Removed features`simple_block`in`place_on`，`place_in`，`place_under`field. Use now`place_under`place modifier;
  * Place features`growing_plant`Rename to`block_column`, removed the`body_provider`，`head_provider`，`height_distribution`Field, added`layers`list field;
  * Rewritten features`random_patch`，`flower`and`flower_no_bonemeal`fields in;
  * Removed the tree features`sapling_provider`field;
  * Removed the placement modifier for features`decorated`，`dark_oak_tree`，`iceberg`，`count_extra`，`lava_lake`，`cave_surface`， `end_gateway`,and`nope`;
  * Added placement modifier for ground objects`biome`，`random_offset`，`environment_scan`，`world_survive`，`block_filter`，`surface_relative_threshold_filter`;
  * Rename the placement modifier of the figure:
    *`count_multilayer` → `count_on_every_layer`
    * `square` → `in_square`
    * `chance` → `rarity_filter`
    * `count_noise` → `noise_threshold_count`
    * `count_noise_biased` → `noise_based_count`
    * `water_depth_threshold` → `surface_water_depth_filter`
    * `range` → `height_range`* Removed the mob biome`player_spawn_friendly`and`surface_builder`field;
  * Removed the mob biome`scale`，`depth`and`starts`field;
  * Removed`multi_noise `in the mob community source (used for noise-type chunk generators, the same below)`seed`，`altitude_noise`，`temperature_noise`，`humidity_noise`，`weirdness_noise`fields, added`octaves`field;
  * Removed mob biome source`vanilla_layered`;
  * Added mob community noise parameters`continentalness`，`erosion`，`depth`;
  * Removed mob community noise parameter`altitude`;
  * Added to the entity generation type of mob group`axolotls`;
  * Removed the`aquifers_enabled`field;
  * Rename the mob group:
    *`stone_shore` → `stony_shore`
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
    * `snowcapped_peaks` → `frozen_peaks`* Removed mob biome`badlands_plateau`，`bamboo_jungle_hills`，`birch_forest_hills`，`dark_forest_hills`，`desert_hills`，`desert_lakes`，`giant_spruce_taiga_hills`，`giant_tree_taiga_hills`，`jungle_hills`，`modified_badlands_plateau`，`modified_gravelly_mountains`，`modified_jungle`，`modified_jungle_edge`，`modified_wooded_badlands_plateau`，`mountain_edge`，`mushroom_field_shore`，`shattered_savanna_plateau`，`snowy_mountains`，`snowy_taiga_hills`，`snowy_taiga_mountains`，`swamp_hills`，`taiga_hills`，`taiga_mountains`，`tall_birch_hills`，`wooded_hills`.
  * **Added surface rules;**
  * in noise setting`noise`Add to field`large_biomes`，`terrain_shaper`and`legacy_random_source`field;
  * Removed the`bedrock_roof_position`， `bedrock_floor_position`， `deepslate_enabled`，`min_surface_level`field, removed`noise`in the field`density_factor`，`density_offset`，`use_legacy_random`，`simplex_surface_noise`，`random_density_offset`field;
  * Removed the`octaves`field. Now through the noise`minecraft:temerature`Configure world temperature noise;
  * **Add noise JSON data file; **
  * Add integer provider`clamped_normal`，`weighted_list`;
  * In the world generation step`UNDERGROUND_DECORATION`and`VEGETAL_DECORATION`added`FLUID_SPRINGS`;
  * **Removed surface generator;**
  * Now temperature and humidity will not change along the y-axis;
  * The generation of bedrock layers is now controlled by world seeds;
  * **Removed block placer;**
  * Added block status provider`dual_noise_2d_provider`，`noise_2d_cutoff_provider`，`noise_2d_provider`* Rename block status provider:
    *`noise_2d_provider` → `noise_provider`
    * `dual_noise_2d_provider` → `dual_noise_provider`
    * `noise_2d_cutoff_provider` → `noise_threshold_provider`* Removed block state provider`forest_flower_provider`and`plain_flower_provider`;

#### resource pack:

* Font
  * Added font`illageralt`* other
  *`inventory.png`Now includes a new icon for compact display of status effects in the item bar;

### **1.17**

#### data pack：

*command
  * Join`/item`command, replaced`/replaceitem`command;
  * Join`/pref`command;
  * Joined`/debug function`command;
  * Removed`/debug report`command；
  * `/give`The upper limit of items that can be given by command is now 100;
  * now`/setblock`The placed structure block defaults to loading mode;
  * Add scoreboard guidelines`minecraft.custom:minecraft.total_world_time`;
  * Rename scoreboard guidelines`minecraft.custom:minecraft.play_one_minute` → `minecraft.custom:minecraft.play_time`;
* advancement
  * Add trigger`started_riding`， `lightning_strike`， `using_item`;
  * in trigger`effects_changed`Add conditions in`source`;
* loot table and predicate

  * Add loot table function`set_banner_pattern`， `set_nbt`， `set_damage`， `set_enchantments`;
  * Added value provider, scoreboard can now be read by loot table;

  * Join`value_check`;
  * Change the names of all item condition fields in predicate from`item`modified to`items`, the names of all block condition fields start from`block`modified to`blocks`;
  * Added in location information predicate`passenger`and`stepping_on`field, in`lightning_bolt`Added to the entity sub-predicate`blocks_set_on_fire`and`entity_struck`field;
  * Add to player's entity sub-predicate`looking_at`;
* Added item modifier
*NBT

  * New fields for projectile common tags`HasBeenShot`；
  *  `fireball`fields`ExplosionPower`now byte instead of int;
  * New fields for entity general tag`HasVisualFire`;
  * Slime field`Size`The upper limit is now 126;
  *Fields of potion cloud`Radius`The upper limit is now 32;
*tag
  * Added itemtag`candles`，`ignored_by_piglin_babies`，`piglin_food`， `freeze_immune_wearables`， `axolotl_tempt_items`， `occludes_vibration_signals`， `fox_food`, `diamond_ores`, `iron_ores`, `lapis_ores`, `redstone_ores`， `coal_ores`， `emerald_ores`， `copper_ores`， `cluster_max_harvestables`;
  * Added blocktag`candle_cakes`，`candles`， `cauldrons`， `crystal_sound_blocks`， `dripstone_replaceable_blocks`， `occludes_vibration_signals`， ` lush_ground_replaceable`， `cave_vaaines`， `moss_replaceable`， `stone_ore_replaceable`， `deepslate_ore_replaceable`， `geode_invalid_blocks`， `lava_pool_stone_replaceables`， `features_cannot_replace`， `coal_ores`， `emerald_ores`， `copper_ores`, `dirt`, `snow`， `small_dripleaf_placeable`， `needs_stone_tool`， `needs_iron_tool`， `needs_diamond_tool`， `mineable/axe`， `mineable/hoe`， `mineable/pickaxe`， `mineable/shovel`;
  * Rename blocktag:`snow_step_sounds` → `inside_snow_step_sounds`* Added entitytag`snow_step_sound_blocks`， `axolotl_always_hostiles`， `axolotl_hunt_targets`， `freeze_hurts_extra_types`，`freeze_immune_entity_types`;
  * Added game event tag`vibrations`，` ignore_vibrations_sneaking`;
* world generation
  * Add features`geode`， `dripstone_cluster`， `large_dripstone`， `small_dripstone`， `glow_lichen`， `underwater_magma`， `scattered_ore`， `root_system`， `vegetation_patch`， `waterlogged_vegetation_patch`， `growing_plant`;
  * Split the features`glowstone_blob`The placement modifier;
  * Renamed features`dripstone_cluster`fields in`max_distance_from_center_affecting_chance_of_dripstone_column` → `max_distance_from_edge_affecting_chance_of_dripstone_column`;
  * Features`ore`Add new field`discard_chance_on_air_exposure`,Will`target`and`state`field replaced with`targets`, rename the field`leaves_provider` → `foliage_provider`;
  * Features`tree`Add new field`sapling_provider`， `dirt_provider`， `force_dirt`, remove the field`max_water_depth`， `heightmap`;
  * Features`simple_block`fields`to_place`Now a block state provider;
  * Features`fossil`Now configurable, some new fields have been added;
  * Features`netherrack_replace_blobs`fields`radius`Now limited to 0-12;
  * Removed features`no_surface_ore`;
  * Place features`emerald_ore`Replace with`replace_single_block`;
  * Added placement modifier`water_depth_threshold`， `cave_surface`;
  * Place modifier`heightmap`Add new fields in`heightmap`;
  * Place modifier` carving_mask`Remove field`probability`;
  * Place modifier`range`Now using vertical anchors, fields`range`Use height provider;
  * Place modifier`dripstone_cluster`and`large_dripstone`Now use floating point number provider;
  * Place modifier`count`Negative values are no longer allowed;
  * Split the placement modifier` dark_oak_tree`， `end_gateway`;
  * Removed placement modifier`water_lake`，`emerald_ore`， `fire`, `lava_lake`， `top_solid_heightmap`， `heightmap_world_surface`，`glowstone`;
  * Added leaf provider to ground objects`random_spread_foliage_provider`, the trunk placer was added`bending_trunk_placer`;
  * New fields in template pool`weight`;
  * Structural features`nether_fossil`Add new field`height`;
  * Engraver`canyon`，`cave`Now configurable, with multiple fields;
  * Added engraver field`debug_settings`;
  * Removed engraver`underwater_canyon`， `underwater_cave`;
  * Convert the fields in the engraver`bottom_inclusive`and`top_inclusive`Replace with`y`;
  * New fields for engraver`yScale`， `aquifers_enabled`, engraver field`debug_settings`Add new field`water_state`， `lava_state`，`barrier_state`;
  * New fields for noise settings`noise.min_y`， `aquifers_enabled`， `noise_caves_enabled`， `grimstone_enabled`， `min_surface_level`， `ore_veins_enabled`， `noodle_caves_enabled`;
  * Dimension setting new field`min_y`and`height`;
  * The upper and lower height limits of the main world have been expanded by 64 blocks;
  * Added floating point number provider;
  * Added integer provider;
  * Random float provider now contains fields`min_inclusive`and`max_exclusive`;
  * Add block status provider`randomized_int_state_provider`;
  * Added height provider;
  * Added entity generation category to mob group`underground_water_creature`;
  * Add custom structure processor`protected_blocks`;
* block
  * The rails can now contain water, and water will no longer damage the rails;
  * Split the cauldron into`cauldron`(empty cauldron),`water_cauldron`(filled with water) and`lava_cauldron`(containing magma);
  * Rename`grass_path` → `dirt_path`，`grimstone `→`deepslate`;
  * Added block status to the notice board`lit`;
  * Joined`light`block;
* entity
  * Joined`glow_item_frame`， `glow_squid`， `goat`;
  * **Joined`marker`**
* Others
  * Add particles`small_flame`， `snowflake`， `dripping_dripstone_lava`， `falling_dripstone_lava`，`dripping_dripstone_water`， `falling_dripstone_water`， `vibration`， `dust_color_transition`， `glow`， `glow_squid_ink`， `falling_spore_blossom`， `spore_blossom_air`， `electric_spark`， `scrape`， `wax_on`， `wax_off`， `light`;
  *Add game rules`freezeDamage`， `playersSleepingPercentage`;
  * Added game events;
  * Copper oxidation is now affected by`randomTickSpeed`The impact of game rules;
  * Now the death information of the named entity will be output in the log;
  * References to mineral blockIDs in advancement and recipes are now mineral tags to accommodate deep slate mineral variants;
  * use`F3+L`A performance report can be generated and stored in`.minecraft/debug/profiling/`down;
  * The target selector component and NBT component in the text component can use fields`separator`Specify delimiter;

#### resource pack:

* Texture
  * Join`misc/spyglass_scope.png`;
  * join in`gui/container/bundle.png`Used for storage bag texture;
  * changed`toasts.png`To include icons for storage bag tutorials;
  * Now the grid size of the F3+F4 game mode selection box is adjusted from 25 pixels to 26;
* model
  * The telescope model is now split into item column model and handheld model;

* shader
  * Now using OpenGL 3.2 rendering, you can use resource pack to replace vanillashader;
  * Added resource pack directory`shaders/core`and`shaders/include`;


* Others
  * The credits are now stored in json format instead of txt;

- - -

### **1.16.2**

#### data pack：

- command：
  -`/spawnpoint`and`/setworldspawn`command to join`angle`field;
  -`/execute in`The command will now follow the coordinate scaling of different dimensions for relative coordinates and local coordinates.
- tag:
  - Tags can now contain optional items using the key-value pair format. The absence of optional items will not cause the tag check to fail. The format is as follows`{ "id": "foo", "required": false }`;
- world generation：
  - right now`worldgen`Experimental support is provided in the directory:
    -`worldgen/biome`Can contain definitions of mob biomes.
    -`worldgen/configured_carver`Can include a definition for a terrain carver.
    -`worldgen/configured_feature`Can include definitions for terrain feature placement.
    -`worldgen/configured_structure_feature`Can contain definitions for the placement of generated structures.
    -`worldgen/configured_surface_builder`Can contain definitions for surface generators.
    -`worldgen/processor_list`Can contain definitions for block processors.
    -`worldgen/template_pool`Can contain a definition of the puzzle structure.
    -`worldgen/noise_settings`Noise configurations can now be included.
    - Now after enabling the data pack containing mob biomes, you can use custom mob biomes in single mob biomes, caves and floating islands.
    - Custom mob biomes can now be used in custom dimension generators.
    - **Custom world generation and dimension settings now use the same folder pattern (namespace/&lt;type&gt;/resource.json) in the data pack, consistent with other resources. **

### **1.16**

#### data pack：

- command：
  - Add instructions`/locatebiome`- Add instructions`/attribute`;
  - Add particle type`ash`, `crimson_spore`, `soul_fire_flame`, `warped_spore`,`dripping_obsidian_tear`, `falling_obsidian_tear`, `landing_obsidian_tear`,`soul`;
  - **Attribute naming changed from camel case naming to underline naming;**
  -`/spreadplayers`join in`under`subcommand;
- NBT:
  - Add NBT data to the item display box entity`Invisible` `Fixed`;
  - **The UUID value of entity is now changed to a 4-element integer array;**;
  - Compass item now has NBT field`LodestonePos`, `LodestoneDimensions`, `LoadstoneTracked`;
  - with`NoAI`The tag's shulker can be generated with a rotation angle;
  - Text component:
    - Text component`hoverEvent`Add fields`contents`- Text component`color`Components can now be prefixed with # to use RGB colors;
    - Add text component`font`;
- data pack components:
  - advancement:
    -Add advancement trigger`target_hit`,`item_used_on_block`, `player_generates_container_loot`, `thrown_item_picked_up_by_entity`,`player_interacted_with_entity`;
    - **Remove advancement trigger`safely_harvest_honey`;**
    - **advancement content`location`, `slept_in_bed`, `hero_of_the_village`, `voluntary_exile`fields are put into`location`under field;**
    - All entitypredicates under advancement triggers can now be loot tablepredicate lists;
    - to divide`impossible`All advancement triggers except join condition`player`;
  - loot table, predicate:
    - entitypredicate adds parameters`fishing_hook`;
    - Added under entitypredicate`vehicle`, `targeted_entity`entitypredicate field;
    - Added under location predicate`smokey`field;
    - The predicate root object can now be a predicate list, and if all sub-predicates are satisfied at the same time;
  -recipe:
    - Add recipe type`smithing`;
  - tag:
    - Add blocktag`soul_speed_blocks`;
  - world generation：
    - **Added experimental gameplay "custom world"; **
    - Now data pack can define dimension and dimension type;
    - Add nbt field to puzzle block`joint`- Puzzle blocks now have facing block status;
    - The maximum block range that can be saved by the structure block is expanded from 32x32x32 to 48x48x48;
- Others:
  - data pack loading optimization:
    - If loading fails, the modification will not be applied;
    - If there is an error in the loaded data pack when entering the world, the "Safe Mode" option will pop up;
    - Only modify the data pack list after the data pack is successfully loaded;
    - data pack can now be specified before world generation;
    - Now if the data pack component is missing (such as uninstalled`vanilla`data pack), will prevent the player from loading the world.