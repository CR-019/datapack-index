---
title: 'The best spell to match a spear so far! '
---
<FeatureHead
    title = "The best spell to go with a spear so far!"
    authorName = "Patrick"
    resourceLink = '../_assets/冲刺魔咒.zip'
    cover='../../../../../feature/archive/202510/_assets/8.png'
/>

Spear has been out for two days (until writing the article). Videos about researching new version features have been posted all over Bilibili, especially in the parkour circle. Datapackers have also published many of their research results in the media. From a technical perspective, it seems that everyone is more inclined to study the new interaction methods brought by spears. I also feel very...comfortable with this new left-click detection method added by Mojang? Now there is no need to put an interactive entity on each player's head!

However, it seems that few people have developed data packs for the spear itself... (It seems that there is really nothing to write about compared to the left-click detection of the spear itself) I thought about it, the spear itself should also receive attention!

Considering that the spear itself has the characteristic of "the faster the relative speed, the higher the damage", I made the magic spell that best matches the spear so far - sprint!

When you wear an item with this enchantment, your **sprint speed** will continue to increase with the sprint time.

It doesn't quite make sense considering that the spear gives you a speed bonus, so it's not enchanted on the spear itself, but on the leggings.

Since it is slightly OP, it has a side effect: extra durability is consumed when sprinting, and the higher the spell level, the greater the consumption (the highest level is V).

::: tip detailed data
namespaceID: rainbow_trials:rush

Highest level: V

Applicable items: leg armor

Anvil cost: 2 experience levels/enchantment level

Effective slot: Legs

Effect:
1. When sprinting, the movement_speed attribute of the player wearing an item with this enchantment increases by 0.02*enchantment level every game tick.
2. When the item with this enchantment is in the correct slot, the following three checks will be triggered every time the wearer moves. When all checks are passed, 2^(1+enchantment level) points of durability will be deducted from the item.
    1. There is a 0.03 probability of passing this check
    2. Check if the wearer is sprinting
    3. Check if the wearer is on the ground
:::

From this, you can use the spear at the same time as this enchantment. As long as you sprint long enough, you can deal high damage!

Please see [attachment](../../../../../feature/archive/202510/_assets/冲刺魔咒.zip) to receive the data pack!