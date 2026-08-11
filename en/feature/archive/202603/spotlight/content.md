---
title: 'Vanilla News - Λojang Spotlight - March 2026'
---
<SpotlightHead
    title = "Vanilla News - Mojang Spotlight - March 2026"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202603/_assets/spotlight.jpeg'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

Mojang released a total of five snapshots this month, namely snapshots 8-11 of 26.1 and preview version 26.1-pre-1. Currently, the data packversion has reached **101.0**, and the resource packversion has reached **84.0**.

Let’s talk about the conclusion first. This month’s update has medium practicality and average destructiveness. Overall, it belongs to the **big cup** level.

## itemmodel mapping

In 26.1-snapshot-11, this is`minecraft:model`、`​minecraft:special`、`​minecraft:range_dispatch`、`​minecraft:composite`、`​minecraft:select`and`​minecraft:condition`item model type added`transformation`field. The format and display of these fields are of entity`transformation`The fields are the same. The transformation of the item model will be performed after the item rendering transformation.

Some special item model transformations are extracted into special model types, including:

*`minecraft:bell`: Added. Render the animation part of the clock block
*`minecraft:book`: Added. Books that render enchantment tables and lecterns.
*`minecraft:bed`: Only half of the bed is now rendered. new field`part`Controls which half of the bed is rendered.
*`minecraft:banner`: new field`attachment`Controls the model used for flag rendering
*`minecraft:chest`: new field`chest_type`Control the model used for rendering
*`minecraft:hanging_sign`: new field`attachment`Control the model used
*`minecraft:standing_sign`: new field`attachment`Control the model used
*`minecraft:shulker_box`: Removed`orientation`Field
*`minecraft:end_cube`: Render end portal and end portal blocks

At the same time, some changes have been made to the block state rendering of some scenes, such as the block held by the Enderman and the block display entity block, but not the falling block and moving pistons. For details, please view the change log in the Wiki.

## Timeline

In the previous snapshot, the concept of timeline was added, as well as the`time`The command has been modified to adapt to the new timeline mechanism. And in 26.1-pre-1, it is`time`command has been further enhanced. new`time [of &lt;clock&gt;] rate &lt;rate&gt;`The subcommand allows the player to set the rate at which time passes for a clock. With this command, you can control the timeline-related functions in the game, such as the speed of day and night replacement. But note that this command will not be like`tick`Command can directly change the flow speed of game moments.

## Environment properties

In 26.1-pre-1, new value providers are provided to get the value of an environment property at the current context location. At the same time, the loot tablepredicate was added`minecraft:environment_attribute_check`, used to accurately match the value of an environment attribute at a given context location.

## Miscellaneous

for`fectchprofile`command new`entity`Subcommand, used to output the file information of the entity in the world (currently only player and player models are supported).

Added new block state provider`rule_based_state_provider`, determine the provided block according to the blockpredicate rules.

Features that can be generated using bone meal are made of`#can_spawn_from_bone_meal`tag control, no longer limited to`flower`type of features.`object`The component now supports`fallback`Field that allows alternative text to be provided when the object component cannot be rendered.`nbt`Text component of type in`interpret`for`false`When the time comes, typesetting and printout will be carried out. Also added`plain`Field to remove the fine print text style.`minecraft:provides_banner_patterns`components,`minecraft:blocks_attacks`component`bypassed_by`fields,`minecraft:damage_resistant`component`types`fields and`minecraft:set_instrument`loot table function`options`In addition to accepting tags, fields now also support IDs or lists of IDs.

New integer provider added`trapezoid`, select random numbers according to the trapezoidal distribution.

New particles added`pause_mob_growth`and`reset_mob_growth`。

shader`core/rendertype_translucent_moving_block`was removed.

Please check the update log for more details~

*26.1-snapshot-8:&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-8&gt;
* 26.1-snapshot-9：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-9&gt;
* 26.1-snapshot-10：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-10&gt;
* 26.1-snapshot-11：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-snapshot-11&gt;
* 26.1-pre-1：&lt;https://zh.minecraft.wiki/w/Java%E7%89%8826.1-pre-1&gt;
