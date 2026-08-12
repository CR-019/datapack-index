---
title: 'Vanilla News - Λojang Spotlight - February 2026'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<SpotlightHead
    title = "Vanilla News - Mojang Spotlight - February 2026"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202602/_assets/spotlight.png'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

Mojang released a total of four snapshots this month, namely 26.1 snapshots 4-7. Currently, data pack version has reached **99.1**, and resource pack version has reached **81.0**.

Let’s talk about the conclusion first. This month’s update is of little practicality and moderately destructive. Overall, it falls within the **big cup** level.

## Dye components

In 26.1-snapshot-5, a new item component is added——`dye`, its value is one of the sixteen dye color names. An item holding this item component means that the item has the ability to act as a certain dye in a specific environment. But just adding this item component is not enough, you also need to add this item in the itemtag. The following itemtags are currently added. The items that exist in these tags also have the specified`dye`Components can be used as corresponding dyes in specified environments:

- `#dyes`: Auxiliary tag, containing all dyes in vanilla games.
- `#loom_dyes`: An item that allows setting the pattern color on the loom interface. Loom screen still requires item stack to have`minecraft:dye`components.
- `#loom_patterns`: An item that allows unlocking patterns on the loom interface. Loom screen still requires item stack to have`minecraft:provides_banner_patterns`components.
- `#cat_collar_dyes`: An item used to dye cat collars. The color set is taken from the item`minecraft:dye`components.
- `#wolf_collar_dyes`: An item used to dye wolf collars. The color set is taken from the item`minecraft:dye`components.
- `#cauldron_can_remove_dye`: Can be used in a cauldron filled with water to remove`minecraft:dyed_color`The component's item.

## recipe

In 26.1-snapshot-5, Mojang made a lot of changes to the recipe format~~ (but it still did not add support for components to the raw materials)~~. Due to the large number of changed recipes, for the sake of simplicity, only the affected recipe types are marked here. Readers can check the change log link at the end of the article for more detailed information:

- `minecraft:crafting_dye`: **New**, replaced`minecraft:crafting_special_armordye`
- `minecraft:crafting_imbue`: **New**, replaced`minecraft:crafting_special_tippedarrow`, matches a recipe where a single item is surrounded by 8 ingredients.
- Removed`minecraft:crafting_special_mapcloning`, whose functions are integrated into`minecraft:crafting_transmute`
- `show_notification`Fields now support all recipes
- Removed`minecraft:stonecutting`, `minecraft:smithing_transform` ,`minecraft:smithing_trim`in`group`Field
- Changed:
  - `minecraft:crafting_transmute`
  - `minecraft:crafting_special_bannerduplicate`
  - `minecraft:crafting_special_bookcloning`
  - `minecraft:crafting_decorated_pot`
  - `minecraft:crafting_special_firework_rocket`
  - `minecraft:crafting_special_firework_star_fade`
  - `minecraft:crafting_special_firework_star`
  - `minecraft:crafting_special_mapextending`
  - `minecraft:crafting_special_shielddecoration`

## Worldgen

Some minor changes have been made to world generation.

All configured figures are now supported`fallback`field, originally this field was only used by`disk`Type used.

`forest_rock`was renamed to`block_blob`, and supports parameters:

- `state`：block
- `can_place_on`: Where it can be placed

`ice_spike`was renamed to`spike`, and already supports any block.

`huge_red_mushroom`and`huge_brown_mushroom`Now has fields`can_place_on`, to define where giant mushrooms can be placed.

`alter_ground`tree decorator`provider`Now a test-based block state provider.

`tree`of`force_dirt`and`dirt_provider`Replaced with a single test-based block state provider`below_trunk_provider`：

- fallback: Optional block state provider.
- rules: a list of rules.
  - if_true: blockpredicate, check the block coordinate before placing the block.
  - then: a block state provider.

Added boolean field to dimension type definition`has_ender_dragon_fight`, controls whether there is an ender dragon to fight in this dimension.

## Miscellaneous

Joined`pig_sound_variant`、`cat_sound_variant`、`cow_sound_variant`and`chicken_sound_variant`Subfolders that allow the data pack to define different sound variations for pigs, cats, cows, and chickens.

`block.vsh`and`terrain.vsh`The vertex shader no longer accepts the Normal vertex attribute. \
shader`core/rendertype_item_entity_translucent_cull`was removed by`core/entity`replace. \
shader`core/rendertype_entity_alpha和core/rendertype_entity_decal`was removed and changed to`core/entity`Implemented DISSOLVE flag. \
Item rendering in UI and world is now done by`core/entity`Split to new shader`core/item`。

All block models can now support hollow or translucent (partially pixel transparent) textures.

Please check the update log for more details~

* 26.1-snapshot-4：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-4&gt;
* 26.1-snapshot-5：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-5&gt;
* 26.1-snapshot-6：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-6&gt;
* 26.1-snapshot-7：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-7&gt;

