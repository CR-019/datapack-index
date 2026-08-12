::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

# Disruptive Technology Update Log

:::danger AKA "What will break after upgrading your data pack"
:::

::: warning ⚠️Part of the content before 1.21.6 of this article is translated from misode’s “Technical Update Log” page:https://misode.github.io/changelog
:::

## Preface
This entry lists all destructive changes in all vanilla Minecraft version updates, that is, those updates that if left unaddressed will cause the data pack or resource pack to not run properly after upgrading the version.

Please note that most entries have been simplified simply to alert readers to the existence of this change. Please check the wiki for detailed instructions.

The change log uses the official version as the category entry and sorts it in descending order.

## text

### **26.2**
#### data pack：
- world
  - **The bed is no longer blockentity**.
  - **Gollins now despawn in Peaceful difficulty**.
  - **Piglins can now spawn on Peaceful difficulty**.
  - **Children** of armadillos, hoglins and zombie hoglins, axolotls, camels, chickens, cows and mooshrooms, dolphins, cats and ocelots, foxes, bees, goats, merry ghasts, pandas, pigs, polar bears, sheep, squids, wolves, striders, piglins, all zombie variants, and nautilus's **collision boxes, eye height and passenger height changes**. Please [subject to Wiki](https://zh.minecraft.wiki/w/Java版26.2#更改)。
- particle
  - **Now, instead of discarding new particles when there are too many, the game will randomly select particles to render**.
- command
  - **`advancement`The text output of command has changed**.
  - **`team`The team color parameter in now strictly needs to be in lowercase underline form (`dark_blue`rather than`DarkBlue`）**。
- Game content
  - **Respawning in spectator mode in a Hardcore world no longer turns off game rules`spectators_generate_chunks`**。
- tag
  - **Rename blocktag**`#concrete_powder`->`#concrete_powders`。
  - **The blocktag`#mineable/pickaxe`and`​#happy_ghast_avoids`The dripstone cone in is replaced by`#speleothems`**。
  - **entity type tag`#cannot_be_pushed_onto_boats`Added sulfur cube monster**.
- NBT
  - **mob's`HurtByTimestamp`Change to`ticks_since_last_hurt_by_mob`. Record the time since last injury instead of the timestamp**.
  - **`charged_projectiles`Array components now only accept stacks of up to 1024 items**.
- predicate
  - **entitypredicate`entity_properties`All fields in are expanded into data component-like forms**.
    - This means that the top-level field names are now of the form namespaceID (`effects`->`minecraft:effects`, minecraft can be omitted).
    - **entity sub-predicate`type_sepcific`was moved to the top level**(`"type_sepcific":{"minecraft:lightning":{...}}`->`"minecraft:type_specific/lightning":{...}`）。
    - **Rename**`type `-> `minecraft:entity_type`。
- world generation
  - Configured features
    - **The following features have been destructively renamed and/or modified. Please refer to Wiki**:
      - `pointed_dripstone`->`speleothem`
      - `dripstone_cluster`->`speleothem_cluster`
      - `large_dripstone`
      - `tree`
      - `multiface_growth`
  - Processor list
    - **`block_rot`The block state after processing by the previous block handler chain is now evaluated instead of always using the original block** of the structure.
  - Density function
    - **Removed`weird_scaled_sampler`, by newly added`interval_select`replace**.

#### resource pack：
- Model
  - **Signs and hanging signs now use the block model instead of the built-in entity model**.
- item model mapping
  - Special model types removed`bed`，`standing_sign`,and`hanging_sign`。
- texture
  - **`minecraft:signs`and`minecraft:beds`Texture set has been removed**.
  - **Changed the textures of baby hoglins, baby zombie hoglins, and baby white foxes**.
- shader
  - **Minecraft is about to complete its migration from OpenGL to Vulkan. The current version supports both, allowing players to switch freely. OpenGL is still used by default, but it will be completely deprecated in the near future**.
  - **core shader**`rendertype_text`，`rendertype_text_see_through`，`rendertype_text_intensity`，`rendertype_text_intensity_see_through`，`rendertype_text_background`and`rendertype_text_background_see_through`**quilt**`text`and`text_background`**Alternative**.

### **26.1**
#### data pack：
- timeline
  - **Added required fields`clock`, stipulates which world clock this timeline is based on**. To get the original behavior, you should change`clock`defined as`minecraft:overworld`。
- command
  - **`time`command uses such as`day`，`night`The time points represented by other options are no longer hard-coded**, but can be adjusted in the world clock. This means something like`time set day`The behavior of the command may be changed by the data pack.
  - **Slot removed`villager.*`. The item slots of villagers and piglins can now be used`mob.inventory.*`Come visit. **
- recipe
  - **Some special recipe types have been removed and replaced with new, more flexible recipe types**. include`minecraft:crafting_special_armordye`，`minecraft:crafting_special_tippedarrow`，`minecraft:crafting_special_mapcloning`. **Please [check wiki](https://zh.minecraft.wiki/w/?curid=29253) for details. **
  - **The format of the following recipe types has been changed to a more flexible form**. include`minecraft:crafting_transmute`，`minecraft:crafting_special_bannerduplicate`，`crafting_special_bookcloning`，`minecraft:crafting_decorated_pot`，`minecraft:crafting_special_firework_rocket`，`minecraft:crafting_special_firework_star_fade`，`minecraft:crafting_special_firework_star`，`minecraft:crafting_special_mapextending`，`minecraft:crafting_special_shielddecoration`. **Please [check wiki](https://zh.minecraft.wiki/w/?curid=29253) for details. **
  - **Also, some stonecutter recipes have been renamed. **
- text component
  - **Use now`nbt`In case of dynamic type, if`interpret`for`false`, the parsed result is no longer a flat string, but a complex text with color highlighting. **
    - **Use new fields`plain`Color highlighting can be removed, but the parsed result is not a flat string like the previous version. **
- world
  - **The hitboxes of some baby mobs have been changed. **Includes cows, sheep, ocelots, mooshrooms, squids, glowing squids, zombies, husks, drowned zombies, piglins, zombie piglins, villagers, zombie villagers, cats, chickens, horses, wolves, pigs, rabbits, axolotls, and skeleton horses.
  - **Naturally spawned zombies may now have higher health than 20**.
  - **Unused juveniles of camel carcasses have been removed**.
  - **Refreshing of villager trades now depends on a random sequence**.
  - **Signs and flags`rotation`The default value of the block attribute changes from`0`Change to`8`。**
- Data format
  - **Removed player's NBTtag`ignore_fall_damage_from_current_explosion`。**
- dimension type
  - **Field added`default_clock`designated for`/time`The default world clock. **
  - **Field added`has_ender_dragon_fight`Controls whether there is an ender dragon to fight in this dimension. **
  - **`ambient_light`It is no longer possible to fully control the ambient lighting of dimensions. The visual part of ambient lighting is now represented by the environment properties`visual/ambient_light_color`control**
- Environmental properties
  - `gameplay/turtle_egg_hatch_chance`The default value of is changed to`0.002`。
- Configured features
  - **The following figure types have been renamed**:
    - `forest_rock`->`block_blob`, `ice_spike`->`spike`
  - **Removed`flower`, `flower_no_bonemeal`, and`random_patch`Feature type. **
  - **`tree`Feature fields`force_dirt`and`dirt_provider`Don't merge into`below_trunk_provider`。**
- curse
  - **`post_piercing_attack`The component no longer checks the player's hunger level by default**.
- tag
  - **Some tags have been renamed**:
    - `#dry_vegetation_may_place_on`→`#supports_dry_vegetation`
    - `#bamboo_plantable_on`→`#supports_bamboo`
    - `#small_dripleaf_placeable`→`#supports_small_dripleaf`
    - `#big_dripleaf_placeable`→`#supports_big_dripleaf`
    - `#mushroom_grow_block`→`#overrides_mushroom_light_requirement`
    - `#snow_layer_can_survive_on`→`#support_override_snow_layer`
    - `#snow_layer_cannot_survive_on`→`#cannot_support_snow_layer`
  - **`#dyeable`itemtag has been removed. **
  - **`#dirt`blocktag now only contains dirt, sand, and rootbound dirt. **
  - **To blocktag`#flower_pots`Added golden dandelion potted plants. **
  - **To blocktag`#small_flowers`、itemtag`#piglin_loved`and`​#small_flowers`Added Golden Dandelion. **
- sound effect format
  - **Wolf sound effect variant definition format moves all previous fields to`adult_sounds`within and joined`baby_sounds`Sound effect representing a young wolf**.
- Test environment definition format
  - **Will`time_of_day`Replace with`clock_time`. Add required fields`clock`to provide a world clock ID. **
- storage
  - **The folder archive format of the game world is the same as`level.dat`The format has undergone major changes, which means that maps of the new version will not be loaded in the old version.`level.dat`Instead of storing a copy of player data, only the player's UUID is stored to reference the player data file. Please check [wiki: Java Edition Archive Format](https://zh.minecraft.wiki/w/?curid=9268) and [wiki: Archive Basic Data Storage Format](https://zh.minecraft.wiki/w/?curid=124403) for details. **

#### resource pack：
- Textures and models
  - **Lots of texture and model changes for baby mobs**. Includes donkey, mule, turtle, bee, fox, armadillo, polar bear, alpaca, panda, hoglin, zombie hoglin, sniffer, cow, sheep, ocelot, mooshroom, squid, glowing squid, zombie, corpse Husks, Drowned, Piglins, Zombie Piglins, Villagers, Zombie Villagers, Cats, Chickens, Horses, Wolves, Pigs, Goats, Rabbits, Axolotls, Camels, Dolphins, Striders, Zombie Horses, Skeleton Horses, and Trader Alpacas.
  - Wolf armor or saddles no longer render on young wolves or pigs.
  - **Removed`demo_background.png`, use sprites instead`popup/background.png`。**
  - **An extremely large number of textures have been renamed or moved. See this table in [Wiki](https://zh.minecraft.wiki/w/Java%E7%89%8826.1#%E6%95%B0%E6%8D%AE%E7%94%9F%E6%88%90%E5%99%A8:~:text=%E7%9A%84%E8%BE%93%E5%87%BA%E6%96%87%E4%BB%B6%E3%80%82-,%E5%AE%9E%E4%BD%93%E7%BA%B9%E7%90%86,-%E9%87%8D%E5%91%BD%E5%90%8D%E4%BA%86)。**
- sound
  - **Some baby mobs now use separate sound effects from adult mobs**. Including cats, chickens, horses, pigs, and wolves.
- shader
  - **Tripwire textures are now used`alpha cutout`Rendering is no longer transparent. **
  - **`lightmap.fsh`been significantly modified. **
  - **`core/rendertype_item_entity_translucent_cull`was removed by`core/entity`replace. **
  - **`core/rendertype_entity_alpha`and`core/rendertype_entity_decal`was removed and changed to`core/entity`Implemented DISSOLVE flag. **
  - **Removed`core/rendertype_translucent_moving_block`, to support`core/block`。**
  - **Item rendering in UI and world is now done by`core/entity`Split to new shader`core/item`。**
- item model mapping
  - **Some model types now have new`transformation`Fields, similar to display entities, can transform the model. Therefore, some special types of transformations are no longer hard-coded, but need to be specified in the item model mapping. **
    - include`minecraft:bed`, `minecraft:banner`, `minecraft:conduit`, `minecraft:copper_colem_statue`, `minecraft:head`, `minecraft:player_head`, `minecraft:shulker_box`, `minecraft:shield`, `minecraft:trident`, `minecraft:standing_sign`, `minecraft:hanging_sign`
  - **`minecraft:bed`The model now renders only half of the bed and is ready to use`part`Field controls which half is displayed. To show the complete bed the two models need to be joined together. **
  - **`minecraft:shulker_box`Model removed`orientation`field. **

### **1.21.11**
#### data pack：
- command
  - **/The time parameter of worldborder now uses game ticks as the unit by default. **
  - **World boundaries are now controlled by game time rather than real time. **
  - **All game rules now use namespaceID. All original IDs were renamed snake_case. The meaning of some game rules is reversed. The value ranges of some game rules now have additional restrictions. Please [check the Wiki](https://zh.minecraft.wiki/w/?curid=19184#%E6%B8%B8%E6%88%8F%E8%A7%84%E5%88%99%E5%88%97%E8%A1%A8)。**
- NBT
  - **Removed`AngerTime`,by`anger_end_time`Replace, indicating the moment when the mob is no longer angry. **
  - **`AngryAT`Rename to`angry_at`。**
- data component
  - **`consumable`component`animation`field, the original`spear`Animation renamed to`trident`. Added new`spear`animation. **
  - **`intangible_projectile`Components now have toolbar tips. **
- tag
  - **Rename itemtag`#enchantable/sword`→`#enchantable/sweeping`。**
  - **The following mob biotags were replaced by new environmental attributes and therefore removed:**
    - `#snow_golem_melts`，`#increased_fire_burnout`，`#plays_underwater_music`，`#has_closer_water_fog`。
- item decorator
  - **`filter`In the modifier, add`modifier`Replace with`on_pass`and`on_fail`Two fields, executed when the test succeeds and fails respectively. **
- world generation
  - **The following fields in dimension type and mob biomes have been moved to new environment attribute options: **
    - `ultrawarm`，`bed_works`，`respawn_anchor_works`，`cloud_height`，`piglin_safe`，`has_raids`，`natural`，`fog_color`，`water_fog_color`，`sky_color`，`particle`，`ambient_sound`，`music`，`music_volume`。
  - **dimension type`effects`was removed by`skybox`and`cardinal_light`replace. **
  - **dimension type`fixed_time`is reset to`has_fixed_time`, the new field is a Boolean value, and the default is`false`. Time-based effects are now specified by environment properties. **
- Miscellaneous
  - **In the test environment definition format,`game_rules`of`bool_rule`and`int_rule`The field has been`rules`replace. **
  - **dialog different body elements (`Body`) has slightly increased spacing**

#### resource pack：
- Models and Textures:
  - **Still water and lava textures are now hardcoded to`minecraft:block/water_still`and`minecraft:block/lava_still`**
  - **Added`items`Texture set, containing the textures of all items. The textures used by the same item model must all come from`items`or all from`blocks`。**
- shader：
  - **Joined`ChunkSection`,quilt`terrain.vsh`use, replace`DynamicTransforms`。**

### **1.21.9**
#### data pack：
- world
  - **The spawn point chunk is no longer forced to load. **
  - **Removed`spawnChunkRadius`Game rules, because there is no longer the concept of spawn point chunk. **
  - **The world boundaries of each world are now independent. **
  - **Flying ender pearls and active portals now load chunks. **
  - **Block "Iron Chain" ID rename:`minecraft:hain`->`minecraft:iron_chain`**
- command
  - **`/test pos [&lt;var&gt;]`The search radius is now changed from 200 blocks to 250 blocks.`/test clearall [&lt;radius&gt;]`The default value is changed to 250 blocks. **
  - **`/summon`Attempting to summon hostile mobs that cannot be spawned in Peaceful difficulty will fail. **
  - **`/setworldspawn`and`/spawnpoint`of`&lt;angle&gt;`Parameters are replaced with optional parameters`&lt;rotation&gt;`, you can set the vertical angle that the player faces when reborn**.
  - **`/setworldspawn`Now it can be executed not only in the main world. The server will execute the command at the world spawn point, even if the spawn point is not in the main world. **
- text component
  - **Try it now`run_command`implement`/say`、`​/me`、`​/msg`、`​/tell`、`​/w`、`​/teammsg`and`​/tm`This type of signed command will pop up a prompt window, allowing the player to copy the command and execute it manually. **
- data component
  - **`block_attacks`Component, receiving 0 damage will now not trigger the blocking behavior, will not enter the cooldown, and will not be knocked back due to blocking. **
  - **`profile`Components now have both static and dynamic behaviors: **
    - **static**: when this component has`properties`, having at the same time`name`and`id`field or neither of the above two fields.
      - The file will be permanently maintained as it was when it was generated. The displayed skin is frozen when the component is created.
    - **dynamic**:`name`and`id`There is only one field.
      - Will be dynamically parsed to the most recent data. The target's current skin will be displayed.
    - **The heads in the old version of the world will be converted to dynamic form first. **
- NBT
  - **player`respawn`in`angle`Rename to`yaw`。**
#### resource pack：
  - shader：
    - **Removed`core/blit_screen.vsh`、`​post/blit.vsh`、`​post/blur.vsh`、`​post/invert.vsh`、`​post/sobel.vsh`and`​post/screenquad.vsh`, and by`core/screenquad.vsh`substitute. **
    - **Removed`core/position_color_lightmap.vsh/fsh`and`core/position_color_tex_lightmap.vsh/fsh`。**
    - **Vertex shaders used for post-processing effects, luma map generation and full-screen binning transfer are no longer passed`Position`attribute, and must pass`gl_VertexID`Assign vertex coordinate. **
    - **Modified`core/terrain.vsh`Medium function`minecraft_sample_lightmap`The UV calculation part. **
    - **All shader versions have been changed from`150`promoted to`330`**
#### pack.mcmeta
- **The version number now contains a major version number and a minor version number. **
- **Deprecated`supported_formats`。**
- **Added required fields`min_format`and`max_format`Specifies supported versions. **
  - The format is`[主版本号，次版本号]`. If only one integer is filled in, it is equivalent to`[主版本号, 0]`。
- **`pack_format`Now optional. **

### **1.21.6**
#### data pack：
- text component
  - **Use now`run_command`When executing a command, if the executed command requires level 1 or higher permissions, a pop-up window will be displayed prompting the player for a second confirmation**.
- NBT
  - ** Potion effect cloud`Particle`was renamed to`custom_particle`. use`entity_effect`and`tinted_leaves`Color is no longer inherited from potions when using particles. **
- tag
  - **Rename the following blocktag:**
    - `#plays_ambient_desert_block_sounds`→`#triggers_ambient_desert_sand_block_sounds`
- data component
  - **`painting/variant`Components no longer accept inlining. **
#### resource pack：
- texture
  - **Removed`mob_effects`Texture set. The texture in it is moved to`gui`Texture is concentrated. **
- Model
  - **Now in item model mapping, if the size of the item in the GUI is larger than one grid, you need to add`"oversized_in_gui": true`, otherwise it will be cut off at the edge of the grid. **
- sound:
  - **Rename`block.sand.wind`for`block.dry_grass.ambient`**。
- shader
  - **All built-in uniforms have been changed to uniform variable blocks instead of loose. The post-processing shader now accepts uniform variable blocks. **
- Miscellaneous
  - **The player head item model no longer changes from`profile`Read the texture from the data component. Added new player_head model class for rendering`profile`texture. **

### **1.21.5**
#### data pack：
- SNBT format:
  - Integers can now be`0`start.
  - Scientific notation (e.g.`1e1000`) represents a number.
- NBT：
  - **`ArmorItems`，`HandItems`,and`body_armor_item`was merged into`equipment`, including items in all slots. **
  - **`ArmorDropChances`，`HandDropChances`,as well as`body_armor_drop_chance`was merged into`drop_chances`。**
    - This is a composite tag that contains the drop probability of each slot.
  - **`Pos`，`Motion`,and`Rotation`Lists must now have the correct number of elements. **
  - **Rename`FallDistance`for`fall_distance`and the type is changed to`double`。**
  - ** Minecart type entity`CustomDisplayTile`was removed.`DisplayState`It is always possible to set the display block.`DisplayOffset`There is no longer a need for a custom display block to take effect. **
  - **item display frame, fluorescent item display frame, and tie knot`TileX`，`TileY`,and`TileZ`was merged into`block_pos`。**
  - ** Annoying`LifeTicks`Rename to`life_ticks`，`BoundX`，`BoundY`,and`BoundZ`was merged into`bound_pos`。**
  - **Turtle's`HasEgg`Rename to`has_egg`，`HomePosX`，`HomePosY`,and`HomePosZ`was merged into`home_pos`，`TravelPos&lt;X|Y|Z&gt;`was removed. **
  - **Dolphin's`TreasurePosX`，`TreasurePosY`,and`TreasurePosZ`was removed. **
  - **Phantom's`Size`Rename to`size`，`AX`，`AY`,and`AZ`was merged into`anchor_pos`。**
  - **Multiple entities`SleepingX`，`SleepingY`,and`SleepingZ`was merged into`sleeping_pos`。**
  - **playerentityNBT**：
    - `enteredNetherPosition`Rename to`entered_nether_pos`, and now there are 3`double`composed list.
    - `SpawnX`，`SpawnY`，`SpawnZ`，`SpawnAngle`，`SpawnDimension`,and`SpawnForced`tags are merged into`respawn`。
- command
  - **`/setblock`and`/fill`command will now not change blockentity data unless specifically used`{...}`specified. **
    - If you want to clear the blockentity data, you must specify`{}`。
    - As long as the status or data of the block changes before and after command execution, the execution is considered successful.
- tag
  - Rename the following blocktag:
    - `#dead_bush_may_place_on`→`#dry_vegetation_may_place_on`
- text component
  - **Text components now use SNBT format in all commands. Use JSON format in JSON files. **
  - **`hoverEvent`and`clickEvent`, and their children are renamed. **
- predicate
  - **entitypredicate added`components`Used to match entity components. the following`type_specific`The entity sub-predicate has been removed and moved in`components`middle**:
    - `axolotl`, `fox`, `mooshroom`, `rabbit`, `horse`, `llama`, `villager`, `parrot`, `salmon`, `tropical_fish`, `painting`, `cat`, `frog`, `wolf`, `pig`, as well as`sheep`of`color`item.
- data component
  - **Rename`weapon`component`damage_per_attack`for`item_damage_per_attack`**。
  - **`hide_additional_tooltip`and`hide_tooltip`The component is removed. in multiple components`show_in_tooltip`Items are also removed. Now unified by new components`tooltip_display`manage. **
- recipe
  - **`smithing_trim`Recipe type`base`，`template`,and`addition`It is now required. **
  - **`crafting_transmute`Recipe type`base`It is now required. **
- advancement
  - **`background`Now use namespaceID instead of using`.png`The absolute path of the path. **
- world generation
  - **`patch_pumpkin`and`patch_sugar_cane`The order of creation is reversed. **
- Miscellaneous
  - **Slot`horse.saddle`Rename to`saddle`And any mob has **.
  - **Armor crest definition no longer exists`item`. Now this is determined by the recipe. **
  - **`tinted_leaves`Particles now require`color`Colors available. **
  - **pig variant definition format`texture`Rename to`assets_id`。**
  - **Wolf variant definition format`angry_texture`， `tame_texture，` `wild_texture`merged into`assets`。**
  - **Each mob variant format`biome`Rename to`spawn_conditions`, and can be generated based on more conditions. **
  - **entity`potion`independent for`splash_potion`and`lingering_potion`Two entities. **

#### resource pack：
- Texture:
- **namespaceID changes for the following textures**:
    - `entity/pig/pig_saddle.png`→`entity/equipment/pig_saddle/saddle.png`
    - `entity/strider/strider_saddle.png`→`entity/equipment/strider_saddle/saddle.png`
    - `.../cow`→`.../temperate_cow`
    - `.../pig`→`.../temperate_pig`
    - `entity/chicken.png`→`entity/chicken/temperate_chicken.png`
  - **Size changes for the following textures**:
    - `temperate_cow`
    - `temperate_pig`
    - `red_mooshroom`
    - `brown_mooshroom`
  - **The following textures were separated into separate files from the original texture files**:
    - `entity/camel/camel.png`→`entity/equipment/camel_saddle/saddle.png`
    - `entity/horse/horse_&lt;variant&gt;.png`→`entity/equipment/horse_saddle/saddle.png`
    - `entity/horse/donkey.png`→`entity/equipment/donkey_saddle/saddle.png`
    - `entity/horse/mule.png`→`entity/equipment/mule_saddle/saddle.png`
    - `entity/horse/horse_skeleton.png`→`entity/equipment/skeleton_horse_saddle/saddle.png`
    - `entity/horse/horse_zombie.png`→`entity/equipment/zombie_horse_saddle/saddle.png`
- Model
  - **The cow and mushroom cow models have extra noses. **
- sound
  - **Removed`entity.wolf.howl`。**
  - **The original wolf sound effects have been moved to the classic folder**.
- shader
  - **Core and post-processing shaders no longer use any JSON file definitions. **
  - **Deleted the`program`,by`vertex_shader`and`fragment_shader`substitute.`&lt;namespace&gt;:&lt;path&gt;`will be parsed as`assets/&lt;namespace&gt;/shaders/&lt;path&gt;.&lt;vsh|fsh&gt;`**
  - ** in every`uniform`，`type`It is now required. accept any`int`，`ivec3`，`float`，`vec2`，`vec3`，`vec4`,and`matrix4`。**

### **1.21.4**
#### data pack：
- command：
    - **`trial`Particles are added to a required field`duration`;**
- NBT：
    - Modified the NBT of the TNT minecart:
      - **Will`TNTFuse`Rename to`fuse`；**
    - **`custom_model_data`The component is changed to a composite tag,`set_custom_model_data`Modifiers are updated synchronously; **
- Other components of data pack:
    - **Removed`#trim_templates`itemtag。**
    - **Removed`trim_material`in the registry`item_model_index`Field;**
    - **`equippable`in the component`model`The field has now been renamed to`asset_id`。**

#### resource pack：
- **<p style="font-size:28px">Introducing a new format to describe [item model](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E7%89%A9%E5%93%81%E6%A8%A1%E5%9E%8B)；</p>**
- **`toast/system`The sprite appearance has now been updated to use the standard nine-square grid division;**
- **`toast/tutorial`Sprites are now scaled to taller popups;**
- **`advancements/box_obtained`and`advancements/box_unobtained`GUI textures now use the nine-square grid division method to change size; **
- **Empty slot textures such as armor slots in the item bar are now removed from`item`move to`gui/sprites/container/slot`directory and rename it; **
- **Empty slot sprites in the Loom, Brewing Stand, Horse and Llama item bar GUI are now split from the background and moved;**

### **1.21.2**
#### data pack：
- command：
  - **Tie knots, floats and lightning no longer pass`/ride`Ride;**
  - **Attribute id no longer exists`generic.`，` player.`，`zombie.`Prefix; **
- NBT：
  - **Rename`fire_resistant`The item component is`damage_resistant`, and join`types`Field;**
  - `potion_contents`item component added`custom_name`field;
  - **Split the entity types of ships and box ships into separate entities for each texture;**
  - ** Container blockentity`Lock`The field is renamed to`lock`, and supports itempredicate;**
- data pack components:
  - advancement：
    - **Rename`killed_by_crossbow`The criterion is`killed_by_arrow`;**
  - Enchantment:
    - **Renamed enchantment type`damage_item`for`change_item_damage`, and supports negative values; **
  - loot table, predicate, item modifier:
    - **Remove loot table`empty`;**
    - **Removed`minecraft:boat`entity subpredicate;**
  - recipe：
    - **Recipe raw material format modification:**
      - **`{ "item": "&lt;item id&gt;" }`Modify to`"&lt;item id&gt;"`**
      - **`{ "tag": "&lt;tag id&gt;" }`Modify to`"#&lt;tag id&gt;"`**
      - **List format no longer supports tags**
  - world generation：
    - **Removed carvers type cars, carvers can now be listed directly**;


#### resource pack：
- Texture:
  - **All equipment related textures have now been moved to`textures/entity/equipment`in the subdirectory. **
- shader：
  - **`rendertype_entity_glint_direct`Rename to`rendertype_entity_glint`；**
  - **`rendertype_entity_translucent_cull`Rename to`rendertype_item_entity_translucent_cull`；**
  - **Program definition for post-processing effects (`assets/&lt;命名空间>/shaders/program/&lt;名称>.json`) is now defined with the core shader (`assets/&lt;命名空间>/shaders/core/&lt;名称>.json`) Uniformity: **
    - **Removed those that have no practical effect`blend`field. **
    - **Removed`attributes`fields whose vertex attributes`Position`will be bound forever. **
    - **`Uniform`Now provided for the core shader`Uniform`merge, where`Time`was renamed to`GameTime`；**
  - **The post-processing pipeline program is now run by`assets/&lt;命名空间>/shaders/post移动到assets/&lt;命名空间>/post_effect`。**
  - The vertex and fragment shaders used by the post-processing pipeline are now`assets/&lt;命名空间>/shaders/program`move to`assets/&lt;命名空间>/shaders/post`。**
  - **Post processing rendering process`name`Now renamed to`program`, and namespaceID is required. **

### **1.21**

[My world JE1.21 data pack folder name changed](https://www.bilibili.com/opus/942372286438047753)

#### data pack：
- NBT:
  - **Removed the arrow type entity`ShotFromCrossbow`Field**
- data pack components:
  - loot table, predicate, item modifier:
    - **Value renaming of entity keys such as predicate: **
      - **`killer`->`attacker`**
      - **`direct_killer`->`direct_attacker`**
      - **`killer_player`->`attacking_player`**
    - **predicate in`enchantment`The field is renamed to`enchantments` ；**
    - **Rename`random_chance_with_looting`The condition is`random_chance_with_enchanted_bonus`, and modify the following fields: **
      - **Remove`looting_multiplier`Field;**
      - **`chance`Now for level dependent functions; **
      - **join in`enchantment`Field;**
    - join in`enchantment_active_check`condition;
    - **Rename`looting_enchant`function is`enchanted_count_increase`, and join`enchantment`Field;**
    - **exist`enchant_randomly`Modify the following fields under function: **
      - **`enchantments`The field is renamed to`options；`**
      - **Add Boolean value field`only_compatible` ；**
    - **`enchant_with_levels`Modify under function: **
      - **Removed`treasure`Field;**
      - **join in`options`Field;**
    - **`copy_name`function change: renamed fields`source`Enumeration value: **
      - **Will`killer`Rename to`attacking_entity`。**
      - **Will`killer_player`Rename to`last_damage_player`**

### **1.20.5**

#### data pack：
- command：
  - particle:
    - **`/particle`The command format has been significantly modified, [see Wiki for details](https://zh.minecraft.wiki/w/Java%E7%89%881.20.5-pre1#%E5%B8%B8%E8%A7%84_2)**
    - **Split particles`gust_emitter`for`gust_emitter_large`and`gust_emitter_small`**
  - property:
    - Rename properties:
      - **generic.block_interaction_range** → **player.block_interaction_range**
      - **generic.entity_interaction_range** → **player.entity_interaction_range**
    - **Remove attributes:`horse.jump_strength`**
  - **The maximum command length is now 2000000 (2 million) characters;**
- entity and NBT:
  - **Modified the regional effect cloud entity`Particle`The fields are in the same format as command/world generation;**
  - **Potion arrow's`Potion`and`custom_potion_effects`fields are merged in`item`within tag;**
  - **Modify the effect field of the potion effect cloud to match`potion_contents`Component matching;**
  - **Modify the blockentity field of the flag to be`banner_patterns`Component matching;**
  - **Modify the blockentity field of hive to be`bees`Component matching;**
  - **Rename some NBT fields of blocks and entities:**
    - **Location nbt:`{X:1，Y:2，Z:3}`→`[I;1，2，3]`**
    - **bee:`FlowerPos`and`HivePos`→`flower_pos`and`hive_pos`**
    - **honeycomb:`FlowerPos`→`flower_pos`**
    - **End Crystal:`BeamTarget`→`beam_target`**
    - **Mobs that can be towed by tethers:`Leash`→`leash`**
    - **raid mob:`PatrolTarget`→`patrol_target`**
    - **End Portal:`ExitPortal`→`exit_portal`**
    - **Wandering Trader:`WanderTarget`→`wander_target`**
  - **Removed the counter-productive behavior of some potions when they are above level 127;**
- **item component**:
  - **<p style="font-size:28px">item’s NBT tags are replaced by the new structured item component:</p>**
    - **`Damage:12`->`damage=12`**
    - **`RepairCost:12`->`repair_cost=12`**
    - **`Unbreakable:1b`->`unbreakable={}`**
    - **`Enchantments:[{id:"sharpness"，lvl:2}]`->`enchantments={levels:{sharpness:2}}`**
    - **`StoredEnchantments`->`stored_enchantments`**
    - **`display:{Name:'"hello"'}`->`custom_name='"hello"'`**
    - **`display:{Lore:['"hello"']}`->`lore=['"hello"']`**
    - **`CanDestroy:["stone"]`->`can_break={blocks:"stone"}`**
    - **`CanPlaceOn:["stone"]`->`can_place_on={blocks:"stone"}`**
    - **`display:{color:16711680}`->`dyed_color={rgb:16711680}`**
    - **`AttributeModifiers:[]`->`attribute_modifiers={modifiers=[]}`**
    - **`Charged:1b，ChargedProjectiles:[{id:"arrow"}]`->`charged_projectiles=[{id:"arrow"}]`**
    - **`Items:[]`(bundle) ->`bundle_contents=[]`**
    - **`display:{MapColor:16711680}`->`map_color=16711680`**
    - **`Decorations:[]`(filled map) ->`map_decorations={}`**
    - **`map:1`->`map=1`**
    - **`CustomModelData`->`custom_model_data`**
    - **`Potion:"invisibility"，CustomPotionColor:16711680，custom_potion_effects:[]`->`potion_contents={potion:"invisibility"，custom_color:16711680，custom_effects:[]}`**
    - **`pages:["hello"]`(book and quill) ->`writable_book_content={pages:["hello"]}`**
    - **`pages:['"hello"']，title:"Title"，author:"Misode"，generation:1，resolved:1b`(written book) ->`written_book_content={pages:['"hello"']，title:"Title"，author:"Misode"，generation:1，resolved:true}`**
    - **`Trim={...}`->`trim={...}`**
    - **`effects:[]`(suspicious stew) ->`suspicious_stew=[]`**
    - **`HideFlags`-> split to the different components as well as`hide_additional_tooltip` component**
    - **`DebugProperty`->`debug_stick_state`**
    - **`EntityTag:{...}`->`entity_data={...}`**
    - **bucketed mobs data -> `bucket_entity_data={...}`**
    - **`instrument:"ponder_goat_horn"`->`instrument="ponder_goat_horn"`**
    - **`Recipes:[]`(knowledge book) ->`recipes=[]`**
    - **`LodestonePos`， `LodestoneDimension`， and `LodestoneTracked`->`lodestone_target={pos:[13，64，-43]，dimension:"the_nether"}`**
    - **`Explosion`(firework star) ->`firework_exlosion={}`**
    - **`Fireworks:{Explosions:[]，Flight:1}`(firework rocket) ->`fireworks={explosions:[]，flight_duration:1}`**
    - **`SkullOwner:{Name:"Steve"}`->`profile={name:"Steve"}`**
    - **`BlockEntityTag:{note_block_sound:"ambient.cave"}`->`note_block_sound="ambient.cave"`**
    - **`BlockEntityTag:{Base:2}`->`base_color="magenta"`**
    - **`BlockEntityTag:{Patterns:[]}`->`banner_patterns=[]`**
    - **`BlockEntityTag:{sherds:[]}`->`pot_decorations=[]`**
    - **`BlockEntityTag:{Items:[]}`(shulker box) ->`container=[]`**
    - **`BlockEntityTag:{Bees:[]}`->`bees=[]`**
    - **`BlockEntityTag:{Lock:"test"}`->`lock="test"`**
    - **`BlockEntityTag:{LootTable:"foo"，LootTableSeed:123}`->`container_loot={loot_table:"foo"，seed:123}`**
    - **`BlockEntityTag:{...}`->`block_entity_data={...}`**
    - **`BlockStateTag:{...}`->`block_state={...}`**
  - Added item component`enchantment_glint_override` ;
  - **item format`Count`Rename to`count`**
- data pack components:
  - loot table：
    - **Nested lists are no longer supported in loot function lists.**
    - **loot table extraction item loot_table (returning all items from the provided nested loot table) now has the following syntax: value can be: **
      - **A namespaceID refers to a reference to another loot table. **
      - **The complete loot table has the same format as the independent file's loot table. **
  - predicate：
    - **itempredicate modification:**
      - **The tag field has been removed, and the items field now supports tags;**
      - **potion field renamed to potions;**
      - **nbt field renamed to custom_data;**
    - **blockpredicate modified**
      - **Removed tag field, blocks field now supports tag;**
    - **fluid predicate`fluid`Rename to`fluids`**
    - entitypredicate`type`Support tag;
    - **Location predicate modification:**
      - **`biome`Rename to`biomes`, and supports group tags; **
      - **`structure`Rename to`structures`, and supports structure tag;**
    - **Modify itempredicate`predicates`The following sub-predicate: **
      - **`durability`->`damage`subpredicate;**
      - **`enchantments`->`enchantments`subpredicate;**
      - **`stored_enchantments`->`stored_enchantments`subpredicate;**
      - **`potions`->`potion_contents`subpredicate;**
      - **`custom_data`->`custom_data`subpredicate;**
  - item modifier:
    - **Rename item decorator function**
      - **`set_nbt`→`set_custom_data`**
      - **`copy_nbt`→`copy_custom_data`**
    - **Rename`/attribute`The operation field of command: **
      - **`add`→`add_value`**
      - **`multiply_base`→`add_multiplied_base`**
      - **`multiply`→`add_multiplied_total`**
    - Removed`set_contents`in item decorator function`type`fields and join`component`field;
    - for`set_attributes`item modifier function added`replace`field;
    - `set_lore`Under item modifier function`replace`The field is renamed to`mode`;
    - **`set_written_book_pages`function：`pages`Now a JSON object instead of a JSON text. **
  - recipe：
    - **The product column of recipe now supports specified item components**;
  - tag：
    - Revise:
      - **entitytag `punchable_projectiles`Rename to`redirectable_projectile` ；**
      - **Rename`axolotl_tempt_items`for`axolotl_food`;**
    - Remove:
      - **Remove itemtag`tools`**
      - **Remove entitytag`deflects_arrows` ，`deflects_tridents`**
  - world generation：
    - **for`worldgen`Defined integer and floating point providers are no longer wrapped in`type`next to extra`value`in the field. **
#### resource pack：
- Texture:
  - **Change map decoration icons from previous ones`map_icons.png`separated from`textures/map/decorations`/Atlas loaded in directory;**
- Font:
  - **ttf font provider`shift`Field values ​​are now limited to between -512 and 512; **
- shader:
  - **Post-processing shader`blur`Rename to`box_blur`;**
  - **New`entity_outline_box_blur` shader;**

### **1.20.3**

#### data pack：
- command：
  - **`/function`command no longer returns the number of executed commands;**
  - **Game rules`maxCommandChainLength`Counting is now stricter;**
- NBT：
  - **Rename the registered name of block grass and its corresponding item from minecraft:grass to minecraft:short_grass**
  - **Place the trident (entity)`Trident`The field is renamed to`item`;**
  - **TNTentity’s nbt data:`Fuse`Rename to`fuse`; Add to`block_state`Field;**

#### resource pack：
- Texture:
  - `.png`Now the only supported texture format;

### **1.20.2**

#### data pack：
- command：
  - **The function macro has been added. You can add macro parameters to the function and pass it into the function to achieve dynamic functions;**
  - **You can use a backslash at the end of a command line`\`Indicates line break to support multi-line single instructions and increase readability; **
- debug:
  - The command memory function now saves 50 items across archives, which can be found in the game folder.`command_history.txt`found in the file;
- NBT：
  - **mobNBT’s status effect id is changed from numeric id to namespaceid (string)**;
  - **Many status effect related entityNBT key names have been changed from camel case to snake format: **
    * **mob status effect field:**
      * `Id`->`id`
      * `Ambient`->`ambient`
      * `Amplifier`->`amplifier`
      * `Duration`->`duration`
      * `ShowParticles`->`show_particles`
      * `ShowIcon`->`show_icon`
      * `HiddenEffect`->`hidden_effect`
      * `FactorCalculationData`->`factor_calculation_data`
    * **Potions and Potion Arrows:**
      * `CustomPotionEffects`->`custom_potion_effects`
    * **Status Effect Cloud and Mysterious Stew:**
      * `Effects`->`effects`
      * `EffectId`->`id`
      * `EffectDuration`->`duration`
    * **Mooshroom:**
      * `EffectId`and`EffectDuration`->`stew_effects`
    * **mob status effect:**
    * `ActiveEffects`->`active_effects`
    * **Beacon:**
      * `Primary`->`primary_effect`
      * `Secondary`->`secondary_effect`
#### resource pack：
- Texture:
  - **The text edit box is now a picture located in`widget/text_field`and`widget/text_field_highlighted`A sprite diagram divided into nine squares. **
  - **The scroll bars for lists and edit boxes are now a`widget/scroller`A sprite diagram divided into nine squares. **
  - **`realms`The namespace texture is moved in`minecraft`Within namespace;**
  - **All GUI textures containing multiple widget maps are now split into separate maps located in`textures/gui/sprites`directory. **
  - **`villager2.png`was renamed to`villager.png`**
  - **Button icons for Accessibility, Languages, and Realms News are now separate files and are no longer individually attached to the button's texture. **

### **1.20**

#### data pack：
- data pack components:
  - advancement：
    - **`placed_block`， `item_used_on_block`, and`allay_drop_item_on_block`All fields under the advancement trigger are merged`location`field; this field now accepts a loot table predicate. **
  - loot table, predicate, item modifier:
    - **join in`all_of`condition,`alternative`The condition is renamed to`any_of`**
  - tag：
    - blocktag`replaceable_plants`Split into`replaceable`and`replaceable_by_trees`
  - world generation：
    - Removed structural postprocessor`rule`of`output_nbt`Field, added`block_entity_modifier `as an alternative.
#### resource pack：
- Font:
  - **Remove character provider`legacy_unicode`;**

### **1.19.4**

#### data pack：
- entity and NBT
  - **Add (block, item, text) display entity, interactive entity;**
- data pack components
  - loot table, predicate, item modifier:
    - **damage typepredicate is modified, the original criterion is removed, and the new damage type data judgment is used instead, using`tags`Field judgment;**

### **1.19.3**

#### data pack：
- command：
  - **modified command`/publish`The format**;
- data pack components:
  - recipe：
    - **Add required fields to the recipe file`category` ；**
  - tag：
    - **Remove blocktag`overworld_natural_logs`;**
  - world generation：
    - Remove`template_pool`of`name`field;
#### resource pack：
- Texture:
  - **exist`entity/player/(slim|wide)`Added default player skins; removed`entity/steve`and`entity/alex`**；
  - **Modified`gui/container/creative_inventory/tabs`texture**;

### **1.19.1**

### **1.19**

#### data pack：
- command：
  - **Cat variant changed from numeric id to namespaceid;**
  - **Status effects`ID`The type is changed from byte type to integer type; **
- advancement：
  - **advancement trigger`location`， `slept_in_bed`， `hero_of_the_village`and`voluntary_exile`Down`location`Fields are moved into`player.location`Location;**
- loot table, predicate, item modifier:
  - **Location predicate field`feature`Rename to`structure`；**
- world generation：
  - Remove features`ice_patch`，`ice_patch`and by features`disk`replace;
  - Tree root placer format modification:
    - `y_offset`Rename to`trunk_offset_y`;
    - Field`max_root_width`， `max_root_length`， `random_skew_chance`， `can_grow_through`， `muddy_roots_in`， `muddy_roots_provider`move in`mangrove_root_placement`under the object;
    - Join fields`above_root_placement` ;
  - Features`glow_lichen`Rename to`multiface_growth` ;
  - `block_rot`Processor fields`rottable_blocks`Need one now`#`prefix;
  - Remove structure fields`adapt_noise` ;
  - Remove density function`slide`,Depend on`add`， `mul`，`y_clamped_gradient`replace;
  - Remove noise settings field`noise.sampling`， `noise.top_slide`，  `noise.bottom_slide`, and moved into the density function;
  - dimension type is no longer inline in dimension data;
  - Remove chunk noise generator`seed`field;
  - Remove density function`terrain_shaper_spline`and remove the density function`spline`of`min_value`and`max_value`field;
  - Remove mob biofield`category`；
  - Will`worldgen/configured_structure_feature`Move folder into`worldgen/structure`folder;

### **1.18.2**

#### data pack：

* command
  * `locate`command now accepts the configured structure object ID as a parameter instead of the structure type;
  * `locate`command and`locatebiome`Command now supports tags as parameters;
* world generation
  * Added structure set JSON file, replaced the noise field`structures`field;
  * Removed fields in noise settings`noise_caves_enabled`，`noodle_caves_enabled`；
  * Some tag fields now require the ID to be preceded by`#`, but they do not accept lists of elements yet:
    - `dimension_type`in`infiniburn`
    - `feature.geode`in configuration`blocks.cannot_replace`and`blocks.invalid_blocks`
    - `feature.vegetation_patch`and`feature.waterlogged_vegetation_patch`in configuration`replaceable`
    - `feature.root_system`in configuration`root_replaceable`
    - `structure_processor.protected_blocks`in`value`
  * Modified the noise settings`structures`format;

### **1.18**

#### data pack：
* command
  * Removed the name length limit for score items, scoreboard names, and team names;

* NBT
  * Will be a monster spawner`SpawnPotentials`The format changes to:
    ```snbt
    {
        weight: <int>,
        data: {
        	entity: {...},
    		custom_spawn_rules: {...}
    	}
    }
    ```

  * Will be a monster spawner`SpawnData`The contents of the field are moved to`SpawnData.entity`；
* advancement
  * Change the advancepredicate in`nether_travel`of`entered`Rename to`start_position`, removed the field`exit`；
* item decorator
  * **Now`set_contents`and`set_loot_table`item decorator function requires`type`Field**
* tag
  * blocktag`lava_pool_stone_replaceables`Rename to`lava_pool_stone_cannot_replace`；
* world generation
  * **Add blockpredicate for feature placement;**
  * **Added placed features;**
  * **Added surface rules;**
  * **Add noise JSON data file;**
  * **Removed surface generator;**
  * **Removed block placer;**

### **1.17**

#### data pack：

* command
  * **join in`/item`command, replaced`/replaceitem`command；**
  * `/give`The upper limit of items that can be given by command is now 100;
* advancement
  * in trigger`effects_changed`Add conditions in`source`；
* loot table and predicate
  * **Change the names of all item condition fields in predicate from`item`modified to`items`, the names of all block condition fields start from`block`modified to`blocks`；**
* Added item modifier
* NBT
  *  `fireball`fields`ExplosionPower`now byte instead of int;
  * slime field`Size`The upper limit is now 126;
  * Potion cloud fields`Radius`The upper limit is now 32;
* tag
  * Rename blocktag:`snow_step_sounds`→`inside_snow_step_sounds`
* block
  * The rails can now contain water, and water will no longer damage the rails;
  * Split the cauldron into`cauldron`(empty cauldron),`water_cauldron`(filled with water) and`lava_cauldron`(containing magma);
  * Rename`grass_path`→`dirt_path`，`grimstone `→`deepslate`；
* entity
  * **Joined`marker`**
* other
  * Added game events;
  * use`F3+L`A performance report can be generated and stored in`.minecraft/debug/profiling/`Down;
  * The target selector component and NBT component in the text component can use fields`separator`Specify delimiter;

#### resource pack：
* shader
  * Now using OpenGL 3.2 rendering, you can use resource pack to replace vanilla shader;
  * Add resource pack directory`shaders/core`and`shaders/include`；
* other
  * The credits are now stored in json format instead of txt;

### **1.16.2**

#### data pack：
- world generation：
  - **Custom world generation and dimension settings now use the same folder pattern (namespace/&lt;type&gt;/resource.json) in the data pack, consistent with other resources. **

### **1.16**

#### data pack：

- command：
  - **Attribute naming changed from camel case naming to underline naming;**
- NBT：
  - **The UUID value of the entity is now changed to a 4-element integer array;**;
- data pack components:
  - advancement：
    - **Remove advancement trigger`safely_harvest_honey` ；**
    - **advancement content`location`, `slept_in_bed`, `hero_of_the_village`, `voluntary_exile`fields are put into`location`under field;**
  - world generation：
    - **Added experimental gameplay "custom world";**
- other:
  - data pack loading optimization:
    - If the load fails, the modifications will not be applied;
    - If there is an error in the loaded data pack when entering the world, the "Safe Mode" option will pop up;
    - Only modify the data pack list after the data pack is successfully loaded;
    - data pack can now be specified before world generation;
    - Now if the data pack component is missing (such as uninstalled`vanilla`data pack), will prevent the player from loading the world.

