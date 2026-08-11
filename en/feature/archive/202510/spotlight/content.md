---
title: 'Vanilla News - Mojang Spotlight - October 2025'
---
<SpotlightHead
    title = "Vanilla News - Mojang Spotlight - October 2025"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202510/_assets/spotlight.png'
    type=0
/>

::: tip
This newsletter ***does not contain the content of***25w42awww~
:::

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

This month, Mojang released several preview versions of 1.21.9 and the official version of 1.21.9, and then quickly released 1.21.10 to fix some serious bugs. Mojang updated the first snapshot of 1.21.11 on Thursday, a week after the Minecraft Live broadcast ended: 25w41a. Now, the data packversion number has come to **89.0**, and the resource packversion number has come to **70.0**.

Let’s talk about the conclusion first. This month’s update is less destructive and more practical. It is generally at the **Super Large Cup** level.

<ColorLine />

> [!TIP]
>
> For more important destructive changes, they will be marked with 💥

## item component

In 25w41a, Mojang added a new weapon - [Spear](https://zh.minecraft.wiki/w/%E7%9F%9B), followed by various item components related to the spear.

**`use_effects`**

Contains two fields:

-`can_sprint`: Boolean value. Whether the player can sprint when using (long-pressing the right button) this item
-`speed_multiplier`:Single precision floating point number. The player's speed multiplier when using this item

**`minimum_attack_charge`**

It is a floating point value, indicating the minimum range that the attack indicator needs to be filled when this item can be used to attack (the shortest attack CD time)

**`damage_type`**

A string indicating the damage type (namespaceID) that can be caused by item attacks.

**`kinetic_weapon`**

Items with this item component can right-click to charge attacks, and the damage caused is defined below.`floor(relative_speed * velocity_multiplier)`. in`relative_speed`is the difference between the velocity vectors of the attacker and the target projected onto the attacker's sight vector axis.

<div class="nbttree">

<node type="compound" name="kinetic_weapon"/> data component
   + <node type="float" name="min_reach"/> The minimum distance from the attacker to the target at which an attack is considered valid.
   + <node type="float" name="max_reach"/> The maximum distance from the attacker to the target at which the attack is considered effective.
   + <node type="float" name="hitbox_margin"/> Checks the error of the target producing a valid collision when the attack collides.
   + <node type="int" name="delay_ticks"/> The number of game ticks before the weapon takes effect.
   + <node type="compound" name="dismount_conditions"/> When the following conditions are met, the target will be dismounted.
     + <node type="int" name="max_duration_ticks"/> (value ≥ 0) The maximum length of time to continue checking this condition after &lt;inline&gt;delay_ticks&lt;/inline&gt;.
     + <node type="float" name="min_speed"/> The attacker's minimum speed in the direction of his line of sight, in grids per second.
     + <node type="float" name="min_relative_speed"/> The minimum relative speed between the attacker and the target along the direction of his line of sight, in grids per second.
   + <node type="compound" name="knockback_conditions"/> Knocks back the target, the format is the same as dismount_conditions.
   + <node type="compound" name="damage_conditions"/> Damage the target, the format is the same as dismount_conditions.
   + <node type="compound" name="sound"/> ([sound event](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%A3%B0%E9%9F%B3%E4%BA%8B%E4%BB%B6)) The sound effect played when the weapon is occupied.
   + <node type="hitsound" name="hit_sound"/> (sound event) The sound effect played when the weapon hits the entity.
</div>

**`piercing_weapon`**

Items with this item component can stab attacks to damage multiple entities in a certain direction.

<div class="nbttree">

<node type="compound" name="piercing_weapon"/> Data component
   + <node type="float" name="min_reach"/> The minimum distance from the attacker to the target at which an attack is considered valid.
   + <node type="float" name="max_reach"/> The maximum distance from the attacker to the target at which the attack is considered effective.
   + <node type="float" name="hitbox_margin"/> Checks the error of the target producing a valid collision when the attack collides.
   + <node type="bool" name="deals_knockback"/> The number of game ticks before the weapon takes effect.
   + <node type="bool" name="dismounts"/> When the following conditions are met, the target will be dismounted.
   + <node type="compound" name="sound"/> (sound event) The sound effect played when the weapon hits the entity.
   + <node type="compound" name="hit_sound"/> (sound event) The sound effect played when the weapon hits the entity.
</div>

**`swing_animation`**

Specify the shaking animation when the item attacks or interacts. Contains two fields:

-`type`: String, animation ID. Optional values ​​are`none`、`whack`and`stab`
- `duration`: Integer, the duration of the animation.

## Curse related

Joined**`post_piercing_attack`**Component, controls the effect of item piercing attack.

Added entity effect`apply_impulse`, used to sprint towards the target entity (giving yourself a momentum)

:::warning The wheelchair made by ojng has no seat surface
Because [MC-302790](https://bugs.mojang.com/browse/MC/issues/MC-302790), the effect cannot be triggered within the context temporarily, so the momentum from multiple sources cannot be combined (later ones will overwrite the previous ones)
:::`play_sound`Can now be a list, with the index of the list corresponding to the level, allowing for sounds to be played with the level of the enchantment

Added level dependency function`exponent`
## Stopwatch (stopwatch)

Stopwatch is a new command mechanism added in 25w41a, which is used to record time independently of game ticks.

The stopwatch will only count when the game opens a map or enters a server. Esc pause does not pause the stopwatch.

:::tip do you know`stopwatch`This is compensation after Mojang fixed the world boundary timing method.

:::

[**`/stopwatch`**](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stopwatch)

`stopwatch`command is used to manage the stopwatch in the game. Its syntax is as follows:

-`stopwatch &lt;id&gt; create`:Create a stopwatch with specified namespaceID
-`stopwatch &lt;id&gt; query`: Display the elapsed time of the specified stopwatch in the chat bar, in seconds.
-`stopwatch &lt;id&gt; restart`:Restart the specified stopwatch
-`stopwatch &lt;id&gt; remove`: Delete the specified stopwatch

:::warning The wheelchair made by ojng has no seat surface`stopwatch`Command cannot directly store the current time of the stopwatch to the scoreboard, because its command return value is only related to whether the command execution is successful or not. If successful, either`store success`still`store result`will be saved`1`, otherwise`0`. Mojang's little ingenuity says yes.
:::

**`execute if|unless stopwatch &lt;id&gt; &lt;range&gt;`**

Compares the stopwatch's elapsed time to the provided range, with millisecond accuracy. For example`/execute if stopwatch foo:bar ..10.001 run say Stopwatch foo:bar has not reached 10.001 seconds yet`
## Miscellaneous

In addition to the stopwatch and new item components, there are a lot of details in this month's update.

- player model added`pose`、`immovable`、`hidden_description`、`description`field.

- The respawn point information in playerNBT now always records the vertical angle and dimension, and the corresponding`setworldspawn`command and`spawnpoint`Modification of command. at the same time,`setworldspawn`Now available in other dimensions.

- Component existence check

  Now, new syntax has been *expanded* for item component predicate and data component predicate, which are used to check whether the component exists. The form and function of the existing syntax remain unchanged.

  For the item component, the original syntax for detecting whether the component exists is similar to`&lt;id&gt;[&lt;component&gt;]`, and the syntax is`&lt;id&gt;[&lt;component&gt;~{}]`.

  For data component predicate, use`&lt;component&gt;:{}`to check if this component exists. For example`{predicates：{instrument：{}}`- Added entitypredicate:`is_in_water`，`is_fall_flying`- Added damage type:`spear`- itemmodel mapping now contains optional single precision floats`swap_animation_scale`, controls the speed multiplier of the switching animation when the player switches to holding the item.

- Added texture metadata information`darkened_cutout_mipmap`field. if for`true`And if the texture is cutout, MipMap will darken it to simulate the darker inside of the block.

- Glass plates and glass now support translucent pixels

- Added some new itemtags, blocktags and magic tags

- 💥Some renames

<ColorLine />

The above is the general content of this month’s update. For specific details, please check the Wiki and click the link below to enter. It is worth mentioning that this month’s *Feature* was released on Tuesday, which is the day when the snapshot is updated. Let’s see what Mojang will update?

- 1.21.9-pre1:&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre1&gt;
- 1.21.9-pre2：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre2&gt;
- 1.21.9-pre3：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre3&gt;
- 1.21.9-pre4：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-pre4&gt;
- 1.21.9-rc1：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.9-rc1&gt;
- 1.21.10：&lt;https://zh.minecraft.wiki/w/Java%E7%89%881.21.10&gt;
- 25w41a：&lt;https://zh.minecraft.wiki/w/25w41a&gt;
