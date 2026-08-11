---
title: 'Vanilla News - Λojang Spotlight - August 2025'
---
<SpotlightHead
    title = "Vanilla News - Λojang Spotlight - August 2025"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202508/_assets/spotlight.jpg'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

This month Mojang released a total of three snapshots: 25w31a-33a, all belonging to 1.21.9. The data packversion number came to **83.1**, and the resource packversion number came to **65.2**.

Let’s talk about the conclusion first. This month’s update is moderately destructive and of average practicality. Overall, it falls within the **big cup** level.

This month’s update basically revolves around new copper products, such as copper tools, copper armor, copper puppets, etc. Well said, copper products have now become the item with the largest variety of spawned mobs in Minecraft (

I won’t say much about copper products in the vanilla newsletter. After all, this column is focused on technical changes. Let’s take a look at the data pack changes in the distance.

<ColorLine />

> [!TIP]
>
> For more important destructive changes, they will be marked with 💥

## 💥data packversion number

Starting from 25w31a, Mojang also added a small version number to the data pack, which means that there will be`83.0`，`83.1`Such data pack version number is the same as resource pack. Maybe Mojang also realized that the version number was refreshed too quickly and thought of ways to sort out the versions.

Correspondingly,`pack.mcmeta`The format of the files has also changed. First it was removed`support_formats`fields, at the same time`pack_format`Became an optional field.`support_format`The function of the field is`min_format`and`max_format`Two fields are replaced, representing the highest version number and the lowest version number respectively. But note that these two fields are not a floating point number, but a list of length 2 to represent the large version number and the small version number. For example`[74, 1]`express`74.1`. Of course, you can also just fill in an integer or just a number in the list. At this time, for`min_format`field is equivalent to a small version number of 0, and for`max_format`field, it is regarded as`0x7fffffff`, which means that any small version number can be accepted.

:::danger 💥About multi-version adaptation...
Since the key name of the format version has been modified, if you pull an old version's data pack\resource pack directly to a new snapshot, "wrong or incompatible version" will be displayed.  
If you want your package to support both 1.21.9 and previous versions, you need to:
will`min_format`Set to a value no higher than 64 (resource pack) or 81 (data pack) and no lower than 16, and contains`pack_format`and`support_formats`field.  
at the same time,`support_formats`Fields must use binary arrays (i.e. of the form`[18,48]`) in the form rather than the object form (that is, in the form`{"min_inclusive":18,"max_inclusive":48}`)
:::

now, complete`pack.mcmeta`The format is as follows:

<div class="nbttree">

<node type="compound" name="pack" />root object
- <node type="compound" name="pack" /> stores data pack information
  - <node type="string" /><node type="compound" /><node type="homolist" name="description" /> (text component) Description information of the data pack. This description is displayed on the data pack page for creating a world, or when the cursor is hovering over a data pack name listed in the /datapack listcommand.
  - <node type="int" /><node type="int_list" name="min_format" />The lowest version number compatible with data pack, which is an array of two integers, namely the primary version number and the secondary version number, which must be greater than 81.
  - <node type="int" /><node type="int_list" name="max_format" />The highest version number compatible with the data pack, which is an array of two integers, followed by the primary version number and the secondary version number.
- <node type="compound" name="filter" />Packet filter, used to specify files to be ignored by data pack. Any pattern matched within the NBT list/JSON array block will appear as if it does not exist in the data pack.
  - <node type="homolist" name="block" />Pattern list
    - <node type="compound" name="(list element)" :colon="false" />
      - <node type="string" name="namespace" />A regular expression indicating the namespace of files to be filtered. If omitted, all namespaces are matched.
      - <node type="string" name="path" />A regular expression indicating the path of files to be filtered. If omitted, all files are matched.
- <node type="compound" name="features" />Experimental content to enable. Note: If this field is added, the data pack needs to be added when creating a new world, otherwise it cannot be added before changing the level.dat of the old world.
  - <node type="homolist" name="enabled" />Enabled content
- <node type="compound" name="overlay" />Specifies the parts to overlay, i.e. subpackages that apply to the "standard" package contents. Its directories are its own resources and data directories (stored in the root directory of the package).
  - <node type="homolist" name="entries" />overrides the list. The order is important, the first object in the list will be applied first
    - <node type="compound" name="(list element)" :colon="false" />
      - <node type="int" /><node type="int_list" name="min_format" />The minimum version number for this overlay data pack to take effect. The format is the same as that in NBT composite tag/JSON object pack- <node type="int" /><node type="int_list" name="max_format" />The highest version number in which this overlay data pack takes effect
      - <node type="string" name="directory" />The relative path where this subpackage is located.

</div>

## loot table context

Two new context parameter sets have been added for the loot table:`entity_interact`and`block_interact`.

in`entity_interact`The parameters provided are as follows:

|parameter name| is called |description| in predicate
|-|-|-|
|`target_entity`|`target_entity`|The entity being interacted|
|`interacting_entity`|`interacting_entity`| (optional) and`target_entity`interactive entity|
|`tool`| *predicate cannot be accessed* | with`target_entity`Tools used for interaction |`block_interact`The parameters provided are as follows:

|parameter name| is called |description| in predicate
|-|-|-|
|`block_state`|*predicate cannot be accessed*|block status of the interacted blockentity|
|`block_entity`|*predicate cannot access*|the blockentity being interacted|
|`interacting_entity`| `interacting_entity`| (optional) and`block_state`interactive entity|
|`tool`| *predicate cannot be accessed* | with`block_state`Tools used for interaction |

## Text component

Added a new text component type in 25w32a`object`, you can directly display a texture map in the form of characters, but it will always be displayed as a size of 8\*8 pixels and cannot be changed. So the method of using fonts to display images will not be solved for a while, but this component does provide great convenience for displaying icons.

The format of the object text component is as follows:

<div class="nbttree">

<node type="compound" name="root" />
- <node type="string" name="type" /> is object
- <node type="string" name="atlas" /> (default minecraft:blocks) namespaceID of the texture atlas
- <node type="string" name="sprite" />The namespaceID of the sprite in the atlas. Example: item/porkchop.

</div>

A contribution in this issue of "feature" researched this feature, you can check it out:

[Example·New snapshot playing with shulker box display, item display and composite input](/en/feature/archive/202508/4/content.md)

## Miscellaneous

Beyond that, there are quite a few small changes in this month’s snapshot:

* Changes to noise settings fields
* Addition of new density function
* Debug screen enhancement
*`summon`Generating hostile mobs in peaceful mode will fail.
*`test`Change of command scope
* Puzzle structure`max_distance_from_center`Fields can now specify different limits on the vertical versus horizontal axis
*`block_attacks`The item component will no longer trigger for damage no greater than 0
* Joined`copper_fire_flame`particle effects
* for`explode`Enchantment effect added`block_particles`Field, specify the particle effect produced when exploding

There are many small changes, so I won’t go into details. Here is a link to this month’s snapshot. It is worth mentioning that Mojang said that it has completed updating the content of 1.21.9, so the next snapshot is probably not going to be anything big.

&lt;https://zh.minecraft.wiki/w/25w31a&gt;\
&lt;https://zh.minecraft.wiki/w/25w32a&gt;\
&lt;https://zh.minecraft.wiki/w/25w33a&gt;
