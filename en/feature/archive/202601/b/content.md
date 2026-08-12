---
title: 'Summary of common sense about vanilla development'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
title='Summary of common sense in vanilla development (Part 1)'
    authorName="Rainbow_"
/>

- This is a guide-style tool book that records the author's **overall summary** of vanilla development.
- The goal is to allow readers to quickly **check for gaps**, understand the overall situation, and **follow the pictures to find answers** when they are confused about how to do something.
- For this reason, this article is **as brief as possible** to reduce reading costs.
- Therefore, this article only provides implementation within three lines. More complex content is only used here as **keyword collection and index**. Readers** need to search by themselves** for detailed tutorials on websites such as Wiki or Vanilla Library.
- If there are any omissions or errors, you can point them out below, or work with the author (hereinafter referred to as "I") to edit.
- This article may contain self-made vocabulary and other private goods, or some temporarily fabricated vocabulary, please identify it yourself.

Original post address:https://etis.vcsofficial.site/d/131

## What tools are used?

> Tools starting with ◇ are strongly recommended.

### || data pack editor

#### ◇ VSCode
##### Tool introduction
Fully extended code editor. You can also open pictures and the like, as long as they are not too big. \
Can use Git and Github for source code management (backup, team collaboration). \
You can use the built-in`liveshare`Function for collaborative editing, similar to the editing experience of cloud documents such as Graphite Documents and Tencent Documents. \
If you are developing on the server, you can also use it`ssh-remote`The plug-in remotely connects to the server for editing.

 - ◇ **`Datapack Helper Plus by Spyglass`Plug-in** (Chinese name: Dahan batch)
   - Provides automatic completion of functions and various files
   - (Although the name is Datapack, resource pack also has completion)
   - Yes, the Chinese name is really Dahanpi. Perhaps this is the acronym link that the MCBBScommand/data pack section likes to see.
 - **`Insert Numbers Pro`Plugin**
   - More useful when exhaustive. Commands can be inserted in batches
   - Middle-drag with the mouse to select multiple lines, and then`Ctrl+Alt+N`The completion format window will pop up.
 - **`Markdown All In One`Plugin**
   - Convenient for writing documents
   - Nothing, just wanted to let you know...

---
#### MCFPP
A high-level data pack language developed by Alumopper.
 - It is an original language and has a syntax close to that of a high-level programming language.
 - You can also use the syntax of data pack directly, just as a tool to facilitate exhaustive enumeration
 - The biggest problem is that there is no VSCode plug-in, so there is no automatic completion.

---
#### Beet/Bolt
The development scripts recommended by Ethanout may be simpler and lighter than heavy tools like MCFPP. \
It seems to be the mainstream data pack scripting language abroad.
 - Command and function can be controlled using the mixed syntax of Python and mcfunction

---
#### other
See [relevant sections below](#自己写基础功能太累了or写不出来，有没有写好的)

---
### || Art resource production

#### ◇ Blockbench
##### Tool introduction
MC voxel modeling software is used by Mojang. \
Used for modeling, texturing, and animation. You can also paint skin. In addition to vanilla development, you can also use it to make`Yes Steve Model`Model.
 - ◇`Animated Java`plug-in
   - Able to output skeletal animation packages that can be run on vanilla Java version of MC.

You can also download other plug-ins such as brushes, and there is a built-in plug-in market.
##### Tips
 - Complete the modeling first, then select all elements and click Create Texture to automatically generate a UV-bound texture~(old translation: material)~.
 - The element size should not be a non-integer multiple of the fineness, unless you do not intend to texture that area and maintain a solid color.
 - `文件-编辑会话`The option theoretically allows you to make models online with other people, but in actual testing it seems that it is not available in China.
 - `文件-转换项目`The general model can be`.bbmodel`Convert to`Animated Java`Model.
 - It seems that there are also plug-ins that can`.obj`file converted to`.bbmodel`document.
     - So there are people`Blender`Mix animations and the like in a blender and send them back`Blockbench`。

---
#### Aseprite, PS and other texture drawing software
Optional.
Blockbench’s built-in painting mode may be a bit lacking in functionality. Maybe some plugins can be used to complete it. \
In short, it is not a bad idea to prepare a special pixel art drawing software for drawing pixel art and making UI.

---
#### Objmc
One uses shader driver and is rendered directly in MC`obj 模型及动画`**Project\
Since the upward compatibility of the shader is very poor, and it also prevents the player from using opti or modapi client to install the light and shadow package, and the update of this project is not fast enough, so in most cases it is recommended to use`Animated Java`
>(In fact, shader is light and shadow, and light and shadow is shader)

---
#### ◇ Axiom Fabric Mod
 - As a god of building terrain, there is almost no threshold to get started. Just try it and you will know how to use it.
 - Can edit, combine and display entities
 - Station B has tutorials
 - Updates are fast, and the new version will be updated about 3 to 7 days after the latest version is released.
 - If you must pursue the development of the snapshot version, you can upgrade first and then migrate the terrain and features, which is not a big problem. \
As for the issue of vanilla mysophobia, my evaluation is: you can insist on purity at the publishing and gaming levels, but if you insist on pure vanilla in development, it will be very troublesome to achieve close development efficiency, and you will have to develop your own tools. And if you don’t have to be a small hexagon yourself, you can’t let the artists who come to help also learn to use homemade simple tools that may not necessarily have a UI.

---
#### World Machine
Terrain generation tools
 - Generally it seems to be used to generate grayscale images, which are then imported into other tools such as Axiom and then "printed" onto the map.


## Where does the data exist?

### || Fraction (integer variable)
scoreboard **`/scoreboard`**
 - **The scoreboard score item is equivalent to an int variable**.
> "Score" and "score item" are unlikely to refer to "a score holder's score in a certain scoring item", so here we temporarily use "scoreboard score item" (or "score item") to refer to it.

 - Only **integers** can be stored, and the calculation results are **rounded down**.
 - The pointed player may not exist and does not have to be a player.
   - Although the subcommand is called `players`, autocompletion only supports players.
   - Therefore, the wiki uses “Score Holder” instead of player.
 - Temporary data whose name starts with `#` is not displayed in the sidebar, and its performance seems to be optimized to some extent.
 - All operations except addition, subtraction and setting fixed values ​​require the use of`scoreboard players operation`subcommand.
   - `operation`Operations can only be performed between fractional terms. For example, to calculate`a*2`, it must be in the form of`a score *= 2 score`
   - So I usually`load`A large number of constants are registered in the function for later use.
 - It's useful to create a **temporary scoreboard** to save you having to think about where the scores for some small steps are.
  - For reference I would use`_`as the name of all temporary storage locations, such as`score return _`And the little damselfly will use`int`. Dahesor uses`calculator`or`calc.namespace`
 - There are many types of **scoreboard guidelines**.
   - general use`dummy`to store variables.
   - `trigger`Players are allowed to modify themselves, but they need to be used`scoreboard players enable`given to player
   - some others like`health`The criteria will automatically change the score. Includes everything that can be found under "Statistics" in the ESC menu.
> We usually use`n条scb`To measure and express the consumption of a command or a module. This refers to once`scoreboard player add | remove`The energy consumption is a sufficiently small and stable benchmark.

---
### || NBT (key value pair)

#### 1. Pure NBT
NBT storage`/data modify storage`
 - There are many **data types** that can be stored. NBT is generally used to store and manage data. In most cases, scoreboard is only used for temporary storage and calculation, except when the data is strongly bound to the entity, it is used to store data (such as storing scores, entity coordinates, and needs to be calculated and updated at any time).
 - Compared with entity NBT, it is **very efficient**.`data modify storage name path set value "233"`The consumption is almost the same as a single simple scoreboard.
   - But efficiency is linked to the number of layers and complexity of the path. Such as operation`storage data a.b.c`consumption will be higher than`storage data a`Higher.
>I don't have precise data for the time being, but my current understanding is that each layer increases the loss by 10% to 30%. In most cases you don't need to worry about this.

---
#### 2. Non-playerentity
##### 1.21.5+
NBT paths of all entities entity @s`data`
##### AImob
entity @s (`ArmorItems`(old 1.21.4-) |`equipments`(1.21.5+))
##### item related entity
`entity @s (item | Item)`*(The difference is case)*

---
#### 3. player
##### Storage player space
exist`NBT 存储`Create a player-specific path in it, called the player space.
like:
 - `VDC>pllib`Module usage`storage vdc:pllib 0[{uid:1, name:"VRainbow_",UUID:{...} }]`This form is used to store player space.
 - You can also use macro functions to create and direct paths, such as`storage proj:player $(name).skill`

The advantage is that it is easy to manage and use. Data can be accessed and processed even if the player is offline. \
The disadvantage is that if people come and go, the files stored in this NBT will become larger and larger.
 - If it is large enough (for small private servers or LAN online maps, it is basically impossible unless the data overflows), such as 20MB, it will cause the game to periodically cause a momentary freeze during auto-save, which may last for hundreds of milliseconds.

##### invisible item
Place invisible items that do not affect the game experience in the player's item column and store the data there.
(use`data entity @s &lt;item&gt;.components.minecraft:custom_data.&lt;nbt&gt;``if items ... *[custom_data~{}]` `item modify ... `to judge or operate. Here &lt; > refers to a certain path)
 - like`VDC>pllib`The predecessor of the module, 1.15 ~ 1.19`EDLib`Pre-positioning means placing two items in the end box to back up each other.
 - **1.20.5+** | More commonly used now`armor.body`or`armor.saddle`(1.21.5+) slot
   - use`item`command to place and modify its content
   - Open`保存物品栏`(Not dropped upon death) to avoid accidental loss. If you only store temporary data, you can also use the disappearing curse.
      - Yes, this slot can also be used to make some enchantments take effect. Therefore, it can be used to enchant some effects that you want to bind to the player itself rather than the wearable item.
   - **1.21.2+** | in`equippable`Data component~~(item component)~~After updating, modify the item`equippable.slot`It can be allowed to be placed into these two grids that were originally unable to be placed, so other items can also be used.
     - In the ongoing development of "Suspension Proj.", I use nameplates and call them "Character Nameplates".
 - This solution can also be used in parallel with player space for:
    - **Storing temporary data**: Not necessarily faster, but maybe convenient. If you use item prototypes such as storage bags, you can also use them to fold some items while still using them.`if items *[bundle_contents~[{}]]`Determine or use item modifier to operate.
    - **Storage some data that will definitely not be used as long as the player goes offline**.
        - Counterexample: basic information of the player (used for table comparison), data that can be managed (add, delete, reset, upgrade version) even if it is offline.
        - Positive example: player's in-game data, data that is determined not to be updated or can be updated after going online (such as a collapsed item column).

## How to trigger effects when needed (system entry and broadcast event summary)

### || High-frequency loop detection + condition determination

#### Cycle execution mode

Simple sequence: tickfunction >> schedule added by loadfunction >> schedule added manually >> function triggered by advancement >> function triggered by magic\
[Click me for details (may require technology)](https://gist.github.com/misode/77ee37217a69a3c74032679d8084d6c6#file-tick_order-md)

##### Tick ​​function set (function within tick.json function tag)
> This is also a private fabrication.

 - The Tick function set is executed every tick
 - It is executed very early in the main program loop of the game, compared to`time query gametime`of`gametime`It's still early to update. If it is not processed, it will be roughly equivalent to the last execution under the same tick.
 - If you need to further differentiate the execution priorities of tick functions of multiple data packs, you can call other function tags in the tick function set, and the tick functions of other data packs are hung under child function tags.

##### Schedule cycle
`/schedule function &lt;This&gt; 1t`
Used in function`schedule`Timing itself allows it to execute in a loop.
 - The execution sequence is the same as`schedule function`The order of execution is the same.
 - Adding conditional judgment can automatically terminate the loop
    - Can also be used`/schedule clear`to actively terminate the cycle
 - if you don't`/schedule function`function in`&lt;This&gt;`Execution, but timing in the Tick function set, then this loop will be postfixed every Tick~~Theoretically, it has not been fully tested~~.
 - The time parameters can be modified to **extend the execution cycle**
 - You can execute such a loop every 1 tick or several ticks, and divide some instantaneous functions into multiple blocks for execution across ticks.
    - This smoothes the pressure calculation and clips the tps flame graph. In human terms: reduce 1% low frame rate, but tps.


##### curse cycle
use`tick`The item of the spell effect component, and place the item in the triggerable slot of the target entity (as mentioned above`armor.body`). The effect is set to execute function.
 - Comes with execution context
     - You can skip the initial screening of entities, and only the entities that need to be checked will be executed.
 - Use item decorators`{function:"set_enchantment"}`The cycle can be terminated by removing the enchantment (setting the level to 0) or simply deleting the item.

##### advancement cycle
 - Similar to the curse cycle
 - No item required
 - Can only be used for players
 - Give the player this advantage without using`revoke`Reset the state to terminate the cycle
 - It is said`/advancement revoke`In fact, the consumption is not low, around 100 scb.

---
#### conditional judgment
These conditions determine whether the tick performs a specific effect.
##### execute (if|unless)
The most commonly used condition determination method. Predicate can also be called. Here are some points that are easy to miss.
 - **`if data`** If at the end of the entire instruction, the NBT quantity will be returned **.
::: details Additional information
So you can use the form`execute store result score return _ if data storage _ List[{type:"b"}]`command to get the number of elements in the list that meet the conditions. \
and`data get ... List`(Note that there is no`[]`) can only get the total number of elements, if the path specified is`List[]`will report an error
:::
 - **`if items`** is more efficient than`if data &lt;target&gt; item{}`Much higher. The function should also be stronger.
::: details Additional information
Use wildcards`*`to refer to any slot or item\
use`~`Replacement equals sign`=`with fuzzy matching. like`*[custom_data~{ a:b }]`can match`{a:b, c:d}`. Use it instead`=`can only match`{a:b}`And cannot match the aforementioned components. \
Some components can specify a range of values ​​instead of a fixed value: \
`*[count~{min:1,max:24}]`\
`*[enchantments~[{id:"sharpness",level:{min:3}}]]`\
**`if function`** You can execute the function in the sentence, and decide whether to continue execution based on the return value of the function. \
Macro functions cannot be executed and a shell is required\
It will not pass without a return value
:::
 - **`if/unless`** **No`else`** and`elif`statement. but:
::: details Additional information
You can open a new function (set to`cond.mcf`), and write at the beginning of function`execute if/unless ... run return run function pass_func`,so`function pass_func`It will be executed when the judgment passes, and the following is the else part. (`return`The function will be terminated when running and the following content will not be executed)\
OK`...run return 1`Then use it in the previous function or command`... if function cond run function pass_func`Call this function. As such`if function cond`If it does not pass, it will be executed`cond.mcf`, which will be executed when passing`function pass_func`。
```
只有套娃或者整理强迫症的时候会这样写吧。
```

:::
 - `if blocks`In addition to detecting whether the area conforms to a specific structure (used for multi-block structures and the like), you can also specify a tool area full of air to detect whether the target location is completely unobstructed.
    - `execute at @s if blocks ~ ~ ~ ~ 320 ~ x ~ z masked run say 上方无遮挡`, where the region from x -64 z to x 320 z is a column of air.

##### target selector
- selector and`if entity`The choice:
::: details Details
Although generally the more common form is
```
execute as @e run function a
    #------
    # a.mcf
    ...if entity @s run function...
    ....scoreboard players operation @s...
```

But when all entities need to be judged once, use`@e`better. \
That is to say`clear @a[scores={a=1}] `Than`execute as @a if score @s a matches 1 run clear @s`better. \
> This is because execute will create many branches, causing additional overhead.

What we **don’t recommend** is actually
```
execute as @e[tag=a] if data entity @s item run say 1
execute as @e[tag=a] if data entity @s item run say 2
execute as @e[tag=a] if data entity @s item run say 3
```

Such **repeated judgment**.
:::


- **variable**
 - `@a`Dead players can be selected, but`@e[type=player]`cannot. This is a way to detect whether the player is resurrected.
 - `@s`Entities outside the world (unloaded chunks) and dead entities can be captured. But this context must be formed before other selectors cannot be selected. This technique was used to achieve effects such as teleporting to the save point (such as home coordinate) before macros existed.
::: details Case
```
tag @s add temp
execute as 0-0-0-0-3 run function a
    #------
    # a.mcf
    # 坐标 <x y z> 未加载
    execute store result entity @s Pos[0] run scoreboard players get @p[tag=temp] home_x
    execute store result entity @s Pos[1] run scoreboard players get @p[tag=temp] home_y
    execute store result entity @s Pos[2] run scoreboard players get @p[tag=temp] home_z
    tp @p[tag=temp] @s
    #------
tag @s remove temp
```

:::
- **parameter**
    - The coordinate points and entities used for judgment will follow.`/execute`Subcommand changes\
Not necessarily the executor or position of selecting the target
    - `distance`The parameter is **Spherical Determination**\
What is determined is the origin of the **entity**^ (the intersection of the diagonals at the bottom of the collision box)^. Is it within the range with the determination point as the center of the sphere?
    - and`distance`different,`[dx=0.0,dy=0.0,dz=0.0]`Is the cuboid range, and determines the intersection of the collision box. \
The edge length of the judgment range is dx+1 dy+1 dz+1, which means that the above parameters will frame a`1x1x1`The cube range\
In other words, if you need to pass the judgment range at any part of the entity, choose dxdydz.
    - To detect whether a certain point is within the **collision box** of the entity, you can use two`distance`Determination of the AND gate of the phase clip\
shaped like`execute at @s as @n if entity @s[dx=0, dy=0, dz=0] if entity @s[x=~0.999, y=~-0.999, z=~-0.999, dx=0, dy=0, dz=0]`
    - Angle dependent,`x_rotation`It is to detect pitch and rotation`y_rotation`It is to detect left and right rotation.`x_rotation`Looking up is a negative number, looking down is a positive number.

---
##### predicate
"Judgment conditions" used in almost all data files (.json files)
::: details Xiao2 press
Predicate is the one in logic, the first-order predicate calculus. Simply put, it is a bool function, a function that returns true or false. \
predicate is directly translated as "conditional function"\
It's just that we are exposed to MC's predicate first, and then we can learn logic or discrete mathematics when we have the opportunity, or lambda's predicate in Java\
It's really called "predicate" there.
:::
- [Xiao2 recommended video](https://ri-nai-bit-se.github.io/Discrete-Math-Notes/%E6%95%B0%E7%90%86%E9%80%BB%E8%BE%91/%E4%B8%80%E9%98%B6%E8%B0%93%E8%AF%8D%E9%80%BB%E8%BE%91/)

The translation of predicate is too unintuitive. I still prefer the old translation "assert". A little more lively would be "Raddy Carter". \
This name can be simply understood as: "Make a description (declarative sentence omitting the subject). If the current situation matches the description, it will pass. If it does not match the description, it will not pass."\
The subject (context) is the current situation, which is given by the component that calls predicate. in many`XX定义格式`It can be seen under the sub-entries of`战利品上下文`The annotation is the subject (context) of this description (predicate)\
**The method of use with high-frequency cycle detection** is`/execute (if|unless) predicate`. It is not impossible to write it in the inline loot table and item decorator.
 - Can detect **light level**, **damage type**, **weather**, etc.`execute if|unless`Simple detection of parameters that cannot be obtained
    - The detection of **player key input** also needs to rely on predicate\
But now it can only detect motion-related buttons.`WASD` `Space` `Shift` `Ctrl`\
>!This is something OJNG just gave away when updating the minecart! (`entity_properties`playerentity subpredicate`{"type_specific": {"type":"player", "input":{}}`）
 - It is used extensively throughout the game, to the point of exploiting every opportunity. Therefore, many condition determinations in vanilla (as long as they are data-driven) use predicate. You can get it and use it in your own system.
    - Unzip`version/版本.json`You can get the vanilla data file in`/data`Down.
At the same time, you can also get the built-in resources of vanilla.`/asset`

###### advancement predicate
There are some predicates that only exist in specific scenarios. For example, the **damage predicate** in advancement
 - **damage predicate**
    - exist in`player_hurt_entity`Wait for the advancement related to the injury.
    - Can detect the value of the damage received, whether it was blocked, the total amount of damage before being reduced by the defense mechanism, etc.
    - In predicate files and inline predicates, there are only`伤害类型谓词`No`伤害谓词`

---
##### scoreboard guidelines
 - `trigger`The value can be changed by the player, but it needs to be used after each change.`/scoreboard players enable`Give the player one-time permissions
 - `health` `food` `air` `level` `xp`The criteria will change automatically, so there is no need to read playerNBT every time it is detected.
    - Can be used to create simple score effects such as kill list, death list, player blood volume display, etc.
    - at the same time,`health`Scores bound to player status cannot be`/scoreboard players`Modified
 - `minecraft.`The ones starting with **Statistical Information Composite Criteria** can be accompanied by the corresponding`统计信息`Automatically increase.
    - The player itself is related to`minecraft.custom:`beginning
    - Example: The player accumulates climbing ladders or vines$1000$After meters, use`minecraft.custom:minecraft.climb_one_cm`The points for the criterion will be increased to`100000`
    - The **carrot fishing rod right-click trigger** commonly used in the old version is implemented using the scoreboard criterion + high-frequency detection.

---
### || Conditional trigger (broadcast event)
Some effects are only triggered when certain conditions are met.
 - Try to write it in such a form that relevant tasks will not be performed when the system is running smoothly. This can greatly reduce the load on the system during operation, which means that it is an optimization in most cases.

Broadcasting an event means that when this event occurs, it will be "broadcast".
 - "Broadcasting" will cause relevant systems to be triggered, and then determine whether some corresponding processing is needed.

---
#### function tag broadcast
In some encapsulated front-end modules, **function tag** is sometimes used as the interface. Users can add functions to this tag so that their functions can be called in a specific process.

---
#### advancement guidelines
Monitor some events that can only be played by the player. After triggering, the player can execute the function, give the player loot rewards, and give experience points.
 - Use after triggering`advancement revoke`Remove the function to trigger again
 - You can also do the opposite and give the player the advantage without removing it to prevent the player from triggering the advantage when it is not needed.
 - Set a parent advancement and write it in the main loop`advancement revoke @a from &lt;父系进度>`All advancements that need to be automatically reset can be processed at once.
 - once`advancement revoke only`The consumption is approximately`100 scb ±30`. This data is very rough and is for general consideration only.

##### Basic function
Basically, you can know what effects can be achieved by looking at the advantages of vanilla. Let’s pick some commonly used ones to talk about.
 - **Detect playeritem column changes**`inventory_changed`
 - **Detect player causing damage**`player_hurt_entity`
 - **Detect player eating, taking medicine, etc.**`consume_item`
 - **Detect player using item (long press)**`using_item`
 - **Detect player right click block**`any_block_use` `default_block_use` `item_used_on_block`
 - **Detect player synthesis item**`recipe_crafted`

 

##### use
Advancement is generally used to achieve **these effects**:
- **Right-click interaction**: use`consume_item`or`using_item`and`consumable`or`blocks_attacks`With the cooperation of other data components (item components), it can detect when the player right-clicks on the item.
    - **Guidelines for consuming items**`consume_item`+ **Consumable Components**`consumable`It will be triggered after the player presses and hold for a certain period of time. **Use Cooling Component** can also be triggered at this time.`use_cooldown`
    - **Use item component**`using_item`+ **Consumable Components**`consumable`You can continuously monitor whether the player is holding the item and holding down the right mouse button. Can flexibly detect clicks and long presses$n$seconds, long press$n$Put it down after seconds and wait for conditions.
        - Sometimes the consumption time is set to almost infinite, so there is no need to adjust it. It is very convenient to detect long press at any time.
        - But it will make the animation on your hand very slow.

 - **Interaction with interactive entities**
    - **Left click**: **Player damage entity guidelines**`player_hurt_entity`+`/execute as &lt;interaction&gt; on attacker`
    - **Right click**: **Guidelines for interaction between player and entity**`player_interacted_with_entity`+`/execute as &lt;interaction&gt; on target`

---
#### Spell effect components
 - The effect of the spell is bound to the item. It is suitable for writing some effects related to **item**. \
Due to Mojang's unique patchwork, components and spells often need to be put together to cover item customization needs. Sometimes advancement is required.
 - The implementation of some functions, although unrelated to the item at the design level, still requires magic spells, and there is no independent command to implement them directly.
    - However, the magic spell must be held or equipped to be triggered. In this case, you can use`armor.body`(horse armor) or`armor.saddle`(saddle) to trigger.
    - For entities that generally do not have these slots, items can still be placed in these slots and take effect. **Includes player**
 - In addition to the "conditional trigger" theme of this chapter, spells also have many passive effects. However, the passive that "takes effect when equipped" can be considered a conditional trigger.
 - The effects of functions triggered by the same spell component are executed in list order.
##### Basic function
Enchantments can do some passive things that take effect when equipped:
 - Immune to damage (invincible to specific damage types)`damage_immunity`
 - Set value
  - Number of arrows consumed in archery
  - The base attack power of the current melee attack
  - Armor reduction coefficient (damage reduction provided by armor) and damage reduction provided by magic
  - Experience repair efficiency
  - Knockback efficiency
  - The number of experience drops when killing enemies
  - Number of projectiles
  - The probability of non-playermob equipment exploding

Enchantments can conditionally trigger under these circumstances:
 - **High frequency trigger when equipped**`tick`
 - **Triggered by attacking or being attacked**`post_attack`
    - Including flame addition, thorns, lightning and other effects
 - **Triggered when projectiles are generated**`projectile_spawned`
    - Such as shooting arrows and launching tridents. Some projectiles don't seem to trigger.
 - **Piercing Weapon Left Click**`post_piercing_attack`^(1.21.11)
 - **player starts to destroy (left click) block**`hit_block`
 - **Triggered when moving to another block, landing, equipping, or switching back from spectator mode**`location_changed`

Enchantments can **trigger** these effects:
(All the conditional trigger components mentioned above can be used)
(Only the most irreplaceable effects are listed)
 - **Execute function**`run_function`
 - **Apply consumption (make player hungry)**`apply_exhaustion`
 - **Apply impulse (change entityMotion)**`apply_impulse`
    - Generally used to control the player's momentum. entity's direct`/data`That's it
    - Only local coordinate systems can be used`^u ^v ^w`. Want to use absolute coordinate system or local coordinate`~x ~y ~z`Need to depend on [prefix](/en/wheel/resources/fptrick_impulse.md)。
 - **Produce explosion effect**`explode`
 - **ignite entity**`ignite`
 - **Generate disc or cylindrical block structure**`replace_disk`
 - **Summon entity**`summon_entity`

 

##### use
Advancement is generally used to achieve **these effects**:
 - **Left button detection (including air swiping)**: Use`post_piercing_attack`Enchantment component, match`piercing_weapon`The item component can detect the left click of the player. This effect requires the **main hand to hold an enchanted item** to take effect.
 - **Left-click block**: When the player can destroy the specified block (there is a frame when pointing to the block), the player can be detected clicking on the block. Can cooperate`can_destory`Item components, as well as components or entity attributes that adjust the mining speed are used.
    - For example, in my snapshot introductory video, the flame attached sword can be used to ignite the fire, and the ground can be clicked to summon the snow golem.
 - **Detect Hit or Being Hit**: Use`post_attack`A enchantment that can detect the occurrence of an attack.
    - Simple effects such as **intervention of entities hit by arrows or snowballs** that were difficult to handle perfectly in the past (small toy effects such as jumping up when hit by snowballs), and random teleportation when the player is hit
    - Complex ones such as **Virtual HP System**, **Overhead Attack and Defense System**
    - Advancements and enchantments take effect very instantaneously. What I mean is **the arrow hasn't disappeared when the effect is triggered**
    - The effects are executed sequentially, so the function written above will be triggered first.
 - **Control player movement**: use`apply_impulse`The effect can perfectly solve the problem of controlling player momentum. This can be used to do **sprint**, **dodge**, **double jump** and other effects. General cooperation`tick`or`location_changed`Enchantment components are used.
 - **Affecting the player's status (igniting the player, making the player hungry)**: These two functions that are not effective in other implementation methods can be more perfectly achieved by using magic spells.
