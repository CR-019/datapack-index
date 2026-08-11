---
title: 'Vanilla News - Λojang Spotlight - December 2025'
---
<SpotlightHead
    title = "Vanilla News - Λojang Spotlight - December 2025"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202512/_assets/spotlight.png'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

This month Mojang released a total of eight snapshots, namely the pre-release version and release candidate version of 1.21.11, and released the official version of 1.21.11 on December 9. The data packversion number came to **94.1**, and the resource packversion number came to **75.0**.

Since the main content has been updated in November, this month’s update does not add much new content, and most of it is minor repairs.

Let’s talk about the conclusion first. This month’s update contains a small amount of content and is less destructive. It is generally at the level of **Big Cup**.

<ColorLine />

> [!TIP]
>
> For more important destructive changes, they will be marked with 💥

## Miscellaneous

###`minecraft:attack_range`Allow items to have custom attack ranges. This component will override the player's entity interaction distance attribute. The fields included are:

*`min_range`: Minimum effective distance from attacker to target. This distance is equal to the minimum distance from the attacker's eye position to the attacked box along the viewing angle.
*`max_range`: The maximum effective distance from the attacker to the target.
*`hitbox_margin`: Determines the size of the attack box. The game expands the entity's collision box by this distance in all directions to obtain an attack determination box.
*`mob_factor`: For non-playermobs, the scaling multiplier for the minimum and maximum effective distances used.
*`min_creative_reach`: same`min_range`, but it controls the relevant attributes of the creative mode player.
*`max_creative_reach`: same`max_range`, but it controls the relevant attributes of the creative mode player.

original`piercing_weapon`and`kinetic_weapon`Relevant fields from the component have been moved to this component.

### in texture metadata`alpha_cutoff_bias`Used to add a small offset to the cutout decision to compensate for sampling and accuracy errors, thereby making the texture edges more stable. When the texture is too transparent in the distance, you can increase this value appropriately, such as 0.1 for kelp texture.

Please check the update log for more details~

*1.21.11-pre1:&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre1&gt;
* 1.21.11-pre2：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre2&gt;
* 1.21.11-pre3：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre3&gt;
* 1.21.11-pre4：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre4&gt;
* 1.21.11-pre5：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-pre5&gt;
* 1.21.11-rc1：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc1&gt;
* 1.21.11-rc2：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc2&gt;
* 1.21.11-rc3：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11-rc3&gt;
* 1.21.11：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.11&gt;
