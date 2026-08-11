---
title: 'Vanilla News - Λojang Spotlight - April 2026'
---
<SpotlightHead
    title = "Vanilla News - Λojang Spotlight - April 2026"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202604/_assets/spotlight.png'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

This month Mojang released the official version of 26.1, and also released three snapshots 26.2-snapshot-1~3 belonging to 26.2. Currently, the data packversion has reached **102.0**, and the resource packversion has reached **86.0**.

Let’s talk about the conclusion first. This month’s update is moderately useful and moderately destructive. Overall, it falls within the **big cup** level.

## Welcome to Vulkan

In 26.2, Mojang added support for the Vulkan graphics API. The player can choose to use the Vulkan renderer instead of the default OpenGL renderer in the video settings options. Of course, this is also the default option.

Vulkan rendering is currently experimental. Although the Vulkan renderer performs well in most reports, there are also many reports that the Vulkan renderer is more prone to crashes or performance issues than the OpenGL renderer.

## New properties

With the addition of Brimstone, Mojang also added three configurable attributes to the entity: elasticity, friction correction coefficient and air resistance correction coefficient.

elasticity(`minecraft:bounciness`) determines the amount of horizontal speed retention after controlling the mob's collision, which is visually represented by the mob's rebound ability after collision. The value range is 0-1, with 0 indicating no elasticity at all and 1 indicating complete elasticity.

Friction correction coefficient (`minecraft:friction_modifier`) controls the resistance the mob receives when walking on the ground. The value range is 0-2048, 0 means no friction, and 1 means normal friction.

Air resistance correction coefficient (`minecraft:air_drag_modifier`) controls the resistance the mob encounters when moving in the air. The value range is 0-2048, 0 means no air resistance, 1 means normal air resistance.

## entitypredicate

The entitypredicate format has changed from a structure with multiple optional fields to a data component map-like structure.

For example, the previous`effect`The field was changed to`minecraft:effect`：

```json
{
    "minecraft:effects": {...}
}
```
This means that now all keys in the entitypredicate are namespaceIDs. because`minecraft`The namespace can be omitted, so existing fields are still valid.

But there are two exceptions:`type`The field is renamed to`minecraft:entity_type`.

The type subpredicate has been renamed and moved to the top level. For example:

```json
{
  "type_specific": {
    "type": "minecraft:player",
    "looking_at": {
      "type": "minecraft:ender_dragon"
    }
  }
}
```
became

```
{
  "minecraft:type_specific/player": {
    "looking_at": {
      "minecraft:type": "minecraft:ender_dragon"
    }
  }
}
```
Added`minecraft:entity_tags`entity sub-predicate, used to match entity tags. It has three matching modes:`all_of`(match all tags),`any_of`(matches any tag) and`none_of`(matches no tag specified).

## world generation

* Added feature types`sequence`, which generates features based on a predefined list of features.

* Added feature types`template`, which randomly places a structure template from a list of structure template IDs with a given weight.

* Feature type`lake`Now supported`can_place_feature`Field used to describe the blocks on which the feature can be placed. It also supports`can_replace_with_air_or_fluid`fields and`can_replace_with_barrier`Field used to describe which blocks of this feature can be replaced with air, specified fluid, or barrier blocks.

* Rename features`pointed_dripstone`for`speleothem`, and its content has been adjusted to suit the sulfur terrain.

* Rename features`dripstone_cluster`for`speleothem_cluster`, and its content has been adjusted to suit the sulfur terrain.

* Features`large_dripstone`、`geode`、`root_system`、`vegetation_patch`and`waterlogged_vegetation_patch`In addition to accepting tags, the related fields now also support IDs or lists of IDs.

* dimension type`infiniburn`and processor list`protected_blocks`In addition to accepting tags, now it also supports IDs or lists of IDs.

## Miscellaneous

Beds are now no longer blockentities, and the associated special model type has been removed.

shader`core/rendertype_text`、`core/rendertype_text_see_through`、`core/rendertype_text_intensity`、`core/rendertype_text_intensity_see_through`、`core/rendertype_text_background`and`core/rendertype_text_background_see_through`quilt`core/text`and`core/text_background`substitute.

Please check the update log for more details~

*26.2-snapshot-1:&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-1&gt;
* 26.2-snapshot-2：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-2&gt;
* 26.2-snapshot-3：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.2-snapshot-3&gt;
