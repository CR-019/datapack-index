::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

> ——Why did you write data pack? Do you have a masochistic constitution?
>
> -- yes.


# vanilla mod architecture

[data pack - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E5%8C%85)[(Bwiki mirror)](https://wiki.biligame.com/mc/数据包)
[resource pack - Minecraft Wiki](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85)[(Bwiki mirror)](https://wiki.biligame.com/mc/资源包)
[command - Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4)[(Bwiki mirror)](https://wiki.biligame.com/mc/命令)

[Minecraft vanilla mod getting started tutorial](https://zhangshenxing.github.io/VanillaModTutorial/) ~~(Inside the altar)~~

The architecture of this article is a reference and supplement to the above tutorial.

Readers should be aware: for knowledge about data pack and resource pack, please first consult the above information.



[~~data pack/resource pack FAQ index and some resources (JE~~](/datapack-index/save/1233623.html){target="_blank"}

## data pack architecture

### logical structure

#### function/command

- classical thought

  - [~~[CBL∫2b] Instruction block advanced tutorial - module (process-oriented) §Index~~](/datapack-index/save/460476.html){target="_blank"} (index internal link has expired)
  - [[CBL]|Qiuyi 1.13 function command system: when command leaves command block](/datapack-index/save/691100.html){target="_blank"}
  - [~~Introduction · Command Advanced (oschina.io)~~](https://mc-command.oschina.io/command-tutorial/output/) (suspected to be inaccessible)
- command performs operations
  - [/execute](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute)
    - [[Tutorial][1.15] Execute command introductory tutorial](/datapack-index/save/989501.html){target="_blank"}
    - [[CBL|SYL][1.13] New version execute nesting changes](/datapack-index/save/770198.html){target="_blank"}
    - [[Minecraft] Can you use the "new" execute? How to consume the new grammar correctly? ](https://www.bilibili.com/video/BV1B14y187Zy)
    - (Not recommended) [[1.13+] Detailed explanation of the new version of execute command](/datapack-index/save/901364.html){target="_blank"}
    - (Not recommended)[Play with 1.13’s new/execute](/datapack-index/save/770738.html){target="_blank"}
  - Modifier command:
    - Executor `as | on | summon`
      - Directly specify `as`
      - Set related entity`on`
      - Generate a new entity and specify it as the executor `summon`

    - `rotated | rotated as | facing | facing entity`

    - Local datum point `anchored`

    - dimension `in`

    - Execution position `at | positioned | positioned as`

    - Perform positional rounding `align`
      - [(2) command TP and relative, local coordinate and orientation anchor](https://www.bilibili.com/read/cv34840247)
    - [coordinate - Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%9D%90%E6%A0%87)
      - absolute coordinate
      - local coordinate `^ ^ ^`
      - Relative coordinate `~ ~ ~`
  - Conditional subcommand `if|unless`
  - Storage subcommand`store`
  - Execute subcommand`run`


- command logic

  - command block (elimination)
[1.12 Research on the new mechanism of chain command block (CCB)](/datapack-index/save/687963.html){target="_blank"}
  - data pack structure logic
      ~~[https://www.mcbbs.net/thread-1143275-1-1.html]~~

- function run [/function](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/function)
  - Scheduled function operation [/schedule]()
    - The function executed by /schedule is executed by the server, and the execution coordinate is the world rebirth point.
    - [[1.15+] Minimalist timer, use schedule to implement timer at any time](/datapack-index/save/1022317.html){target="_blank"}
  - [function macro](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%87%BD%E6%95%B0#%E5%AE%8F)
    - [minecraft function macro features and usage](https://www.bilibili.com/video/BV1Ji421m7XN/)
- Data operations
  - [NBT](https://zh.minecraft.wiki/w/NBT%E6%A0%BC%E5%BC%8F)(data storage/modification)
    - Classical Tutorial
      - [[CBL|SYL]NBTtag practical tutorial—index post (basically completed)](/datapack-index/save/78479.html){target="_blank"}
      - [~~2.2 NBT and structure · command advanced (oschina.io)~~](https://mc-command.oschina.io/command-tutorial/output/common-format/nbt/nbt.html){target="_blank"} (suspected to be inaccessible)
    - (Not so) modern tutorial
      - [~~(/datapack-index/save/1190947.html){target="_blank"}
      - [Tutorial/NBTcommandtag](https://zh.minecraft.wiki/w/教程/NBT命令标签)
      - [(11)NBT Popular Romance (Fog)](https://www.bilibili.com/opus/947507675726348296)
    - ~~itemNBT~~ [item component](https://zh.minecraft.wiki/w/%E7%89%A9%E5%93%81%E5%A0%86%E5%8F%A0%E7%BB%84%E4%BB%B6)
      - [Tutorial: item stacking component - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E7%89%A9%E5%93%81%E5%A0%86%E5%8F%A0%E7%BB%84%E4%BB%B6)

    - [blockentityNBT](https://zh.minecraft.wiki/w/%E6%96%B9%E5%9D%97%E5%AE%9E%E4%BD%93%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)

    - NBT path
      - [[CBL|SPG][1.14] NBT path: from beginner to crazy)](https://github.com/SPGoding/mcbbs-threads/blob/master/tutorials/nbt-path/markdown.md)

    - Return value type
      - [Minecraft: Java version command return value list](https://spgoding.com/command/2021/03/26/command-result-value.html){target="_blank"} [(In the altar (R.I.P))](/datapack-index/save/808124.html){target="_blank"}
    - [/data](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/data) The following tutorials complement each other
      - [[Tutorial][1.15] Common data manipulation methods: introductory tutorial](/datapack-index/save/993805.html){target="_blank"}
      - [(12) One of the three data operation methods to modify NBT/data](https://www.bilibili.com/read/cv36068052)
      - [~~Filtering of data in data command~~](/datapack-index/save/1220434.html){target="_blank"}

    - `/data storage`
      - ~~(https://www.mcbbs.net/thread-1143275-1-1.html){target="_blank"}~~

    - <span id="execute_store">`/execute store`</span>
      - [[Tutorial][1.15] Execute command introductory tutorial](/datapack-index/save/989501.html){target="_blank"}
    - scoreboard(data operation)<span id="scoreboard"></span>
      - [/scoreboard](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/scoreboard)
        - [[1.8+]scoreboard complete tutorial application](/datapack-index/save/274969.html){target="_blank"}
        - [(5) scoreboard and /scoreboard](https://www.bilibili.com/read/cv34854289)
      - [/trigger](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/trigger)
    - Generate random numbers [/random](https://zh.minecraft.wiki/w/命令/random)

  - ~~Original JSON text (data output)~~ [Text component](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
    - example:
      - ​	{"text":"Hello"}
      - After 1.14, escaping does not require \\"direct'" "'
    - tool:
      - [Minecraft Tool](https://minecraft.tools/en/tellraw.php)
      - [[1.14-1.16]JText Studio Chat into a book WYSIWYG|New interaction](https://www.mcbbs.net/thread-986663-1-1.html){target="_blank"}
      - [[1.14+]JText Studio Minus lightweight JSON text editor](https://www.mcbbs.net/thread-1103385-1-1.html){target="_blank"}
    - Classical Tutorial:
      - [[CB Holy Code Project] JSON Holy Code-the most comprehensive JSON tutorial](https://www.mcbbs.net/thread-431678-1-1.html){target="_blank"}
      - [2.1 JSON text · command advanced (oschina.io)](https://mc-command.oschina.io/command-tutorial/output/common-format/json/json.html){target="_blank"}
      - [Raw JSON text format - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
      - [Tutorial/Raw JSON Text - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
      - [Tutorial/NBT and JSON - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:NBT%E4%B8%8EJSON)
      - [Use of "sub-object" in original json text](/datapack-index/save/1076989.html){target="_blank"}
    - [Plain text vs translated text](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E7%BA%AF%E6%96%87%E6%9C%AC)
    - [Text component style "bold" | "italic" | "underlined" | "strikethrough" | "obfuscated" | "color"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F)
    - Font color "color" (see above) / [formatting code](https://zh.minecraft.wiki/w/%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81)
      - [Name the item with colored words](/en/resources/【1.14-1.16.1】用彩色字给物品命名%20_%20获取玩家头颅%20-%20Minecraft(我的世界)Chinese forum%20-%20Powered%20by%20Discuz!.html){target="_blank"}
    - [key information "keybind"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%8C%89%E9%94%AE%E7%BB%91%E5%AE%9A)
    - [Data reference "nbt"-"block"/"entity"/"storage"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#NBT%E6%A0%87%E7%AD%BE%E5%80%BC)
    - [score reference "score"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E8%AE%B0%E5%88%86%E6%9D%BF%E5%88%86%E6%95%B0)
    - [entity name (selector) "selector"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#NBT%E6%A0%87%E7%AD%BE%E5%80%BC)
    - [font "font"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E5%AD%97%E4%BD%93)
      - [[1.13] Map making skills - font art](/datapack-index/save/835539.html){target="_blank"}
      - [~~About the problem of forcing the use of equal-width characters in font resource pack~~](/datapack-index/save/1275778.html){target="_blank"}
    - Parse "interpret"
      - [[CBL|SPG][1.15+] interpret in JSON text ](/datapack-index/save/921501.html){target="_blank"}
    - Separator "separator"
    - event

      - Insert chat box event "insertion"

      - [Click event "clickEvent"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6)
| **action** | description | **value** | availability |
        | :-----------------: | :----------: | :----------------: | :----------------: |
| "open_url" | Open web page |http://example.com| Chatting, writing books |
| "run_command" | Send command | String | Chat, book, notice board |
| "change_page" | Switch page number | Int | Completed book |
| "suggest_command" | Enter command | String | Chat |
| "copy_to_clipboard" | Copy to clipboard | String | Chat, book |

      - [hover event "hoverEvent"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%82%AC%E5%81%9C%E4%BA%8B%E4%BB%B6)
| **action** | description | **value** | content |
        | :-----------: | :------: | :------------------------------: | :---------------------------------: |
| "show_text" | Show text | JSON text | JSON text |
| "show_item" | Show item | '{id:"",Count:,tag:{}}' | {"id":"","count":"","tag":""} |
| "show_entity" | Show entity | '{type:"",id:"",name:"",tag:{}}' | {"name":JSON text,"type":"","id":""} |

    - [Chat bar](https://zh.minecraft.wiki/w/%E8%81%8A%E5%A4%A9)

      - Private message [/tell](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tell) [/msg](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/msg) [/w](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/w)

        - tell &lt;*player|target selector*> &lt;*information…*>

      - Team information [/teammsg](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/teammsg) [/tm](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tm)

        - teammsg &lt;*message*>

      - All player information [/say](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/say)

        - say &lt;*information*>

      - JSON text information [/tellraw](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tellraw)
        - [~~[CBL|SYL]Json/tellraw tutorial index post~~](/datapack-index/save/205332.html){target="_blank"}

      - Show your own information [/me](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/me)
        - me &lt;*action…*>

    - title [/title](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/title)
      - [M1.8: Command block new /title tutorial](/datapack-index/save/276456.html){target="_blank"}

      - Title `title`

      - subtitle `subtitle`

      - Activity bar `actionbar`
        - [~~[vanilla mod][front]1.16.X player bar~~](/datapack-index/save/1156574.html){target="_blank"}
        - [~~[1.16+] Numerical bar display in the status bar data pack - digitize your blood volume~~](/datapack-index/save/1209691.html){target="_blank"}
        - [Ma Daha - I can see the kitten clearly! ! ! ](/datapack-index/save/1047712.html){target="_blank"}`(intangible cultural heritage)`

    - Boss bar [/bossbar](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/bossbar)
      - [1.13Full usage of Bossbar command](/datapack-index/save/781746.html){target="_blank"}
      - [~~The player separates the bossbar, and each player can be edited independently~~](/datapack-index/save/1179992.html){target="_blank"}
      - [[1.14]How to connect bossbar and scoreboard](/datapack-index/save/864877.html){target="_blank"}
        - /execute store result bossbar &lt;boss column id&gt; value run scoreboard players get &lt;entity&gt; &lt;scoreboard id&gt;
      - [[18w05a] New command/bossbar Customize boss health bar to achieve pointing effect [Stabilized]](/datapack-index/save/778336.html){target="_blank"}

    - Score board [/scoreboard](#scoreboard) objectives setdisplay &lt;*slot*> [*scoreboardID*]
      - Sidebar `sidebar`
      - Character name `below`
      - player list `list`

    - Written (value will be parsed)
      - {pages:["first page","second page",'["",JSON text]']}

    - Book and pen (the value will not be parsed and is a String)
      - {pages:["first page","second page",'["",JSON text]']}
      - [~~command book~~](/datapack-index/save/1190418.html){target="_blank"}

    - Notice board (value will be parsed)
      - {Text1:"The first line of text",Text2:'{"text":"The second line of text"},Text3:"",Text4:""}
      - [[Water Tutorial][1.14+] Notice board black technology / implemented with loot table ](/datapack-index/save/1101560.html){target="_blank"}

    - entity name `CustomName`
      - {CustomName:'{"text":"Zombie"}'}

    - item naming/annotation~~display - Name / Lore~~ `"minecraft:item_name"/"minecraft:custom_name"/"minecraft:lore"`
      - ~~{display:{Name:'{"text":"Diamond Sword","color":"dark_red","italic":false}',Lore:"diamond_sword"}}~~

- block operation

  - [structure block](https://zh.minecraft.wiki/w/%E7%BB%93%E6%9E%84%E6%96%B9%E5%9D%97)
    - [[1.10 New Features] Structure block from getting started to giving up](/datapack-index/save/585095.html){target="_blank"}
    - [[1.14+] Random generation and modification of combined structures](/datapack-index/save/899638.html){target="_blank"}
    - [How to use structure block](/datapack-index/save/652937.html){target="_blank"}
    - [[For Beginners] Architects can also happily enjoy structural blocks - pictures and texts teach you how to use structural blocks](/datapack-index/save/801350.html){target="_blank"}
  - load structure
      ```mcfunction
      execute at @p run setblock ~ ~ ~ structure_block{name:"woodland_mansion/1x1_a3",mode:"LOAD",powered:0}
      execute at @p run setblock ~ ~-1 ~ redstone_block
      ```


  - Place block [/setblock](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setblock)
    - [(10) Simple and novice (fog) block command/setblock](https://www.bilibili.com/opus/942368755971784728)
  - Copy region [/clone](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/clone)
    - [(15) Copy an area: copy command/clone](https://www.bilibili.com/read/cv38861264/)
  - fill area [/fill](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/fill)
    - [(Fourteen) The closest to God: fill command/fill](https://www.bilibili.com/read/cv37972439/)
  - Modify mob biome [/fillbiome](https://zh.minecraft.wiki/w/命令/fillbiome)



- item operation

  - Clear item [/clear](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/clear)

  - give item [/give](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/give)

  - Place loot table [/loot](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/loot)
    - [rua shadow box](https://zhangshenxing.github.io/VanillaModTutorial/#%E4%BF%AE%E6%94%B9%E7%8E%A9%E5%AE%B6%E8%83%8C%E5%8C%85)
    - [[1.14]How to use loot replace](/datapack-index/save/874755.html){target="_blank"}
    - Inline loot table/predicate/item decorators

  - Enchant item [/enchant](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/enchant)

  - Modify item stack
    - 1.17 [/item](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/item)
    - 1.16 [/replaceitem](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/replaceitem)

- entity operation

  - [target selector](https://zh.minecraft.wiki/w/%E7%9B%AE%E6%A0%87%E9%80%89%E6%8B%A9%E5%99%A8)
    - [(1) Instructions, selector, and command block](https://www.bilibili.com/read/cv34839498)
    - [(6) /tag command, and advanced selector parameters](https://www.bilibili.com/opus/937149730721366018)
    - [[1.14.4] Tracing back to the "source" - entityselector ](/datapack-index/save/891687.html){target="_blank"}

  - entity generation [/summon](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/summon)
    - [[TCP|Jokey]Things about the hidden entities and invisible minecarts during summon](/datapack-index/save/926441.html){target="_blank"}

  - entity clear [/kill](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/kill)
  - Cause damage [/damage](https://zh.minecraft.wiki/w/命令/damage)

  - Particle generation [/particle](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/particle)
    - [Size, color, format changes and expansions of the particle command](/datapack-index/save/625963.html){target="_blank"}
    - [[vanilla]The impact of particle command parameters on particle behavior](/datapack-index/save/852420.html){target="_blank"}
  - ride [/ride](https://zh.minecraft.wiki/w/命令/ride)
  - transmit
    - Random teleportation [/spreadplayers](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spreadplayers)
      - `spreadplayers &lt;*x*> &lt;*z*> &lt;*Spread spacing*> &lt;*Maximum range*> [*under* *Maximum height*] &lt;*Consider team*> &lt;*Teleport target...*>`

    - Teleport [/teleport](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/teleport) [/tp](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tp)
      - [~~teleport relative coordinate local coordinate omit selector~~](/datapack-index/save/1114273.html){target="_blank"}
  - Rotate [/rotate](https://zh.minecraft.wiki/w/命令/rotate)

  - status effect [/effect](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/effect)
    - [[1.13+] Status effects - detailed introduction to effectcommand - Game skills - Minecraft (my world) Chinese forum - (mcbbs.net)](/datapack-index/save/1068146.html){target="_blank"}
    - [~~How to adjust the negative level command in effect~~](/datapack-index/save/1201497.html){target="_blank"}

  - attribute [/attribute](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/attribute)
    - [[20w17a]Detailed explanation of attribute command](/datapack-index/save/1026841.html){target="_blank"}
    - [(13) Attribute management,/attribute](https://www.bilibili.com/opus/957257796958552103)

  - Team [/team](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/team)
    - [(4) About team command/team...almost everything](https://www.bilibili.com/opus/936409278375264260)

  - tag [/tag](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tag)
    - [(6) /tag command, and advanced selector parameters](https://www.bilibili.com/opus/937149730721366018)

  - other

    - Experience [/experience](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/experience) [/xp](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/xp)
    - Spectate entity [/spectate](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spectate)

- Sound effects

  - play [/playsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/playsound)

    - playsound &lt;*sound entity.pig.ambient*> &lt;*source*> &lt;*player name|target selector*> [&lt;*azimuth x y z*>] [&lt;*volume*>] [&lt;*pitch 0.0~2.0*>] [&lt;*minimum volume 0.0~1.0*>]
Source: master,music,record,weather,block,hostile,neutral,player,ambient,voice

  - Stop [/stopsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stopsound)

    - stopsound &lt;*player name|target selector*> [*source*] [*sound*]
Source: can be " * "

- world operation

  - [Game Mode](https://zh.minecraft.wiki/w/%E6%B8%B8%E6%88%8F%E6%A8%A1%E5%BC%8F)

    - world mode [/defaultgamemode](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/defaultgamemode)
    - player mode [/gamemode](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/gamemode)

  - Game difficulty [/difficulty](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/difficulty)

  - Game Rules [/gamerule](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/gamerule)

  - Structure location [/locate &lt;structure|biome&gt;](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/locate)

  - world seed [/seed](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/seed)

  - [birth point](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1182418&page=1#pid21460488)

    - world spawn point [/setworldspawn](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setworldspawn)
    - player spawn point [/spawnpoint](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spawnpoint)

  - world time [/time](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/time)

  - Main world weather [/weather](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/weather)

  - world border [/worldborder](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/worldborder)

  - Force chunk to run [/forceload](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/forceload)

  - [(8) Chunk and forced loading command/forceload](https://www.bilibili.com/opus/937515275404705808)
  - Game tick rate [/tick](https://zh.minecraft.wiki/w/命令/tick)

- external command

| command | description |
  | -------------------------------------------------------------------- | -------------------------------------- |
  | [/datapack](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/datapack) | Controls the loaded data pack.                     |
  | [/debug](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/debug) | Start or end a debugging session.                   |
  | [/reload](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/reload) | Reload the loot table, advancement and functions from the hard disk. |

- server operation

| command | description | syntax |
  | -------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
  | [/ban](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/ban) | Add player to ban list.           | ban &lt;*player name\|UUID*> [&lt;*reason...*>] |
  | [/ban-ip](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/ban-ip) | Add the IP address to the banned list.         | ban-ip &lt;*player name\|IP address*> [&lt;*reason...*>] |
  | [/banlist](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/banlist) | Show ban list.                 | banlist ips <br />banlist players |
  | [/deop](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/deop) | Revoke the player's administrator rights.         | deop &lt;*player*> |
  | [/kick](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/kick) | Kick the player out of the server.             | kick &lt;*player name\|target selector*> [*reason*] |
  | [/list](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/list) | List the players in the server.           | list [*uuids*] |
  | [/op](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/op) | Grant the player administrator rights.           | op &lt;*player name\|target selector)*> |
  | [/pardon](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/pardon) | Remove player ban items from the ban list. | pardon &lt;*player name*> |
  | [/pardon-ip](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/pardon-ip) | Remove IP banned items from the banned list.   | pardon-ip &lt;*IP address*> |
  | [/publish](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/publish) | Open the single-player world to the LAN.     | publish [*port 0~65536*] |
  | [/save-all](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-all) | Save server world state to hard disk.     | save-all [flush]<br />flush: server will save all chunk data immediately |
  | [/save-off](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-off) | Turn off server automatic saving.           | save-off |
  | [/save-on](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-on) | Turn on server automatic saving.           | save-on |
  | [/setidletimeout](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setidletimeout) | Set the delay for the player to be kicked out if there is no operation.   | setidletimeout &lt;*idle minutes 0~2147483647*> |
  | [/stop](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stop) | Close the server.                   | stop |
  | [/transfer](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/transfer) | Transfer the player to another server.   | transfer &lt;*hostname*> [&lt;*port*>] [&lt;*players*>] |
  | [/whitelist](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/whitelist) | Manage server whitelist.             | whitelist add &lt;*player*><br />whitelist remove &lt;*player*><br />whitelist &lt;list\|off\|on\|reload&gt;<br /> |



### data structure
  - Tools (general):
    - [[1.15-1.17] Data Pack Generators for Minecraft - data pack JSON file generator! ](/datapack-index/save/897487.html){target="_blank"}
    - https://misode.github.io/

#### loot table
  - [loot table - Minecraft Wiki](https://zh.minecraft.wiki/w/战利品表)
  - [[CBL|SPG][1.16] loot table - one of the components of the data pack](/datapack-index/save/831542.html){target="_blank"}
  - Ancient Tutorial: [[CBL∫2b]Loottable - Create a world that looks at people’s faces and talks about mysteries. Total index](https://www.mcbbs.net/forum.php?mod=viewthread&tid=619468)
  - [inline loot table](#inline)

#### predicate
  - [predicate - Minecraft Wiki](https://zh.minecraft.wiki/w/谓词)
  - [[CBL|SPG][1.16] ㄆㄧㄉㄧㄎㄞㄊㄜ——One of the component files of the data pack](/datapack-index/save/914817.html){target="_blank"}
  - [inline predicate](#inline)

#### item decorator
  - [item modifier - Minecraft Wiki](https://zh.minecraft.wiki/w/物品修饰器)
  - [~~A brief introduction to item modifiers~~](/datapack-index/save/1187947.html){target="_blank"}
  - [Minecraft vanilla mod getting started tutorial - item modifier](https://zhangshenxing.github.io/VanillaModTutorial/#物品修饰器)
  - [inline item modifier](#inline)

#### advancement
- tool
  - VSCode plug-in: [~~Minecarft Json Viewer——data packadvancement simulation plug-in based on vscode~~](/datapack-index/save/1109032.html){target="_blank"}。
- [advancement - Minecraft Wiki](https://zh.minecraft.wiki/w/进度)
- [[Enfang’s theory] A custom advancement that even a monkey can learn! ](/datapack-index/save/685310.html){target="_blank"}
- [[Tutorial][1.14] Custom advancement: from entry to abandonment](/datapack-index/save/892563.html){target="_blank"}
- [[20w20a]Let’s take a look at the latest advancement trigger](/datapack-index/save/1045395.html){target="_blank"}
- [[1.15] New advancement trigger](/datapack-index/save/936174.html){target="_blank"}

#### Enchantment (1.21+)
- [Charms Data Format - Minecraft Wiki](https://zh.minecraft.wiki/w/%E9%AD%94%E5%92%92%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)
- [Detailed explanation of the spell system (custom enchantment)](https://etis.vcsofficial.site/d/23-mo-zhou-xi-tong-xiang-jie-zi-ding-yi-fu-mo)

#### tag
  - [tag - Minecraft Wiki](https://zh.minecraft.wiki/w/标签)
  - [[UIN]data pack——tag classification](/datapack-index/save/775667.html){target="_blank"}
  - [Minecraft vanilla mod getting started tutorial-tag](https://zhangshenxing.github.io/VanillaModTutorial/#标签)
  - [Which parts of commands can use tags](/datapack-index/save/963143.html){target="_blank"}
  - [Problems using data pack tag](/datapack-index/save/989540.html){target="_blank"}

#### recipe
- tool:
  - [~~mc-recipe-editor——data packrecipe editor~~](/datapack-index/save/1222437.html){target="_blank"}
- [recipe - Minecraft Wiki](https://zh.minecraft.wiki/w/配方)
- [Minecraft vanilla mod getting started tutorial-recipe](https://zhangshenxing.github.io/VanillaModTutorial/#配方)

### world generation
- [[Cooked Meat] How is Minecraft’s terrain generated? ](https://www.bilibili.com/video/BV13u411j7KX/)
#### structure
- tool:
  - VSCode plug-in: NBT Viewer
- [Minecraft vanilla mod getting started tutorial - Structure](https://zhangshenxing.github.io/VanillaModTutorial/#结构)
- [minecraft1.20version custom structure generation tutorial](https://www.bilibili.com/opus/987615832663130118)

#### dimension and dimension type
- [dimension - Minecraft Wiki](https://zh.minecraft.wiki/w/维度数据格式)
- [Minecraft vanilla mod getting started tutorial - dimension and dimension type](https://zhangshenxing.github.io/VanillaModTutorial/#%E7%BB%B4%E5%BA%A6%E5%92%8C%E7%BB%B4%E5%BA%A6%E7%B1%BB%E5%9E%8B)

#### Custom world generation
- [Custom world generation - Minecraft Wiki](https://zh.minecraft.wiki/w/自定义世界生成)
- [[Collection] Customize the world with data pack - Alumooper](https://www.bilibili.com/read/readlist/)
- [Minecraft vanilla mod getting started tutorial - Custom world generation](https://zhangshenxing.github.io/VanillaModTutorial/#%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%96%E7%95%8C%E7%94%9F%E6%88%90)
- tool:
[[1.16] Multi Noise Visualizer - Real-time preview of the generation of multiple noise mob sources ](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1080570&highlight=)
​[worldgen——Online custom world generator](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1129292&highlight=)
      https://misode.github.io/



- **mob group**

- **engraving**

- **Land Features**

- **Structural Characteristics**

- **Surface Generator**

- **Noise Settings**

- **block processor**

- **puzzle**
    - [Puzzle block - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%8B%BC%E5%9B%BE%E6%96%B9%E5%9D%97)
    - [[VCS] Puzzle block and puzzle pool tutorial (1.16.2+)](/datapack-index/save/1093331.html){target="_blank"}
    - [~~[1.17.1] Use of puzzle pool and structure generation~~](/datapack-index/save/1273515.html){target="_blank"}
    - [~~[Reprint][1.17+]How to make good use of puzzle blocks, puzzle pools, and template pools~~](/datapack-index/save/1231185.html){target="_blank"}



## resource pack architecture
- [Sen Luo Xian - A Minecraft Java version resource pack production guide](https://sqwatermark.com/resguide/)

### Model
  - [Model - Minecraft Wiki](https://zh.minecraft.wiki/w/模型)
  - block status
  - block model
  - item model
    - [Model override - 1.21.3 and before](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E6%A8%A1%E5%9E%8B%E8%A6%86%E5%86%99)
    - [item model mapping - 1.21.4](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E7%89%A9%E5%93%81%E6%A8%A1%E5%9E%8B%E6%98%A0%E5%B0%84)
  - [Equipment model](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E8%A3%85%E5%A4%87%E6%A8%A1%E5%9E%8B)
    - [[Reproduction Plan] Making Elbow Baseball Jerseys—Introduction to Customized Equipment](https://www.bilibili.com/video/BV1G4SzYaEyv) (Note: This video is based on 1.21.2. The path has been changed in 1.21.4 and subsequent versions, but the basic logic remains unchanged)

### texture
  - [Textures - Minecraft Wiki](https://zh.minecraft.wiki/w/纹理)
  - texture
  - skin

### sound
  - [Sounds - Minecraft Wiki](https://zh.minecraft.wiki/w/Sounds.json)
  - [Minecraft Sounds - vanilla sound effects search and download](https://o.xbottle.top/mcsounds/)

### font
  - [Font - Minecraft Wiki](https://zh.minecraft.wiki/w/字体)
  - [Custom Fonts - Minecraft Wiki](https://zh.minecraft.wiki/w/自定义字体)
  - [Font Practice](#font)

### shader
  - [shader - Minecraft Wiki](https://zh.minecraft.wiki/w/着色器)
  - [vanilla shader guidance](/datapack-index/save/916150.html){target="_blank"} [<u>(website)</u>](https://spgoding.com/translation/2021/03/12/guite-to-vanilla-shader.html){target="_blank"}
  - [Minecraft GLSL Shadershader basic tutorial series](https://www.bilibili.com/read/readlist/rl738651)
  - [MCJEshader Tutorial: From Getting Started with Development to Game Crash](#aopshader)
  - [Vanilla shader introductory tutorial! (4/21)](https://etis.vcsofficial.site/d/17-xiang-cao-zhao-se-qi-ru-men-jiao-cheng-421)
  - [~~A brief analysis of core shaders~~](/datapack-index/save/1181123.html){target="_blank"}
  - [Minecraft-Shaders-Wiki](https://github.com/McTsts/Minecraft-Shaders-Wiki/tree/main)
  - [A few vanilla shader examples](/datapack-index/save/917679.html){target="_blank"}
  - [Research experience on vanilla resource pack shader and animation](/datapack-index/save/863730.html){target="_blank"}
  - [Analysis & usage of depth buffer shader that no one will see](/datapack-index/save/1056196.html){target="_blank"}
  - [GAMES101-Introduction to Modern Computer Graphics-Yan Lingqi](https://www.bilibili.com/video/BV1X7411F744/)
  - [(Refer to) OpenGL api manual](https://learnopengl.com/book/book_pdf.pdf)&nbsp;&nbsp;&nbsp;(Read The *\*Friendly\** Manual)


## practice
### data pack practice
#### Custom item/block
- [Minecraft vanilla mod introductory tutorial - item design](https://zhangshenxing.github.io/VanillaModTutorial/#物品设计)
- [Minecraft vanilla mod getting started tutorial - block design](https://zhangshenxing.github.io/VanillaModTutorial/#方块设计)
- [Minecraft vanilla mod introductory tutorial - Machine design](https://zhangshenxing.github.io/VanillaModTutorial/#机器设计)
- [[MCJE] No mod required, pure vanilla five-minute custom item | data pack concise tutorial #3](https://www.bilibili.com/video/BV1Q24y1N7hY/)
- [My world explosive bow data pack random video](https://www.bilibili.com/video/BV14A411c78B/)
#### Data pack commonly used technical entities
- Before 1.19.4 (obsolete):
  - [armor stand](https://zh.minecraft.wiki/w/盔甲架)
  - [Regional Effect Cloud](https://zh.minecraft.wiki/w/%E5%8C%BA%E5%9F%9F%E6%95%88%E6%9E%9C%E4%BA%91)
- [display entity](https://zh.minecraft.wiki/w/%E5%B1%95%E7%A4%BA%E5%AE%9E%E4%BD%93)
  - tool:
    - [Show real-time observation of entity quaternion transformation](https://misode.github.io/transformation/)
  - Popular science:
    - [How does quaternion control object rotation? ](https://www.bilibili.com/video/BV14t421h7M4/)
  - [animated java - vanilla entity animation](https://animated-java.dev/)
    - [Official website document](https://animated-java.dev/docs/introduction/what-is-animated-java)
    - [Experience the Java version of vanilla animation! Collection of Blockbench plug-in Animated Java works](https://www.bilibili.com/video/BV12D4y1F7VM)
- [interactive entity](https://zh.minecraft.wiki/w/%E4%BA%A4%E4%BA%92%E5%AE%9E%E4%BD%93)
- [marker](https://zh.minecraft.wiki/w/标记)

#### Commonly used data operations

#### player displacement control
- [[Tutorial] vanilla/motioncommand? Teach you how to use pure vanilla command to modify player momentum](https://www.bilibili.com/video/BV1iYbLeqE1U/)
#### other
- [loot table random number](https://zhangshenxing.github.io/VanillaModTutorial/#%E9%9A%8F%E6%9C%BA%E6%95%B0)
- <span id="inline">[Inline loot table/predicate/item modifier](https://etis.vcsofficial.site/d/24-nei-lian-zhan-li-pin-biao-wei-ci-wu-pin-xiu-shi-qi-jian-yao-jie-shao)</span>

### resource pack practice

#### <span id="font">Font Practice</span>
- [negative space font](https://github.com/AmberWat/NegativeSpaceFont)
- [Font Black Technology——Shulker Box Content Preview](https://www.bilibili.com/video/av67508247)
- [[1.13] Map making skills - font art](/datapack-index/save/835539.html){target="_blank"}

#### model practice
- [Minecraft vanilla mod getting started tutorial - model](https://zhangshenxing.github.io/VanillaModTutorial/#%E6%A8%A1%E5%9E%8B)
- Method to bypass the size limit of mj model: [Rotation splicing](/datapack-index/save/637959.html){target="_blank"} [1200-meter sword](https://www.bilibili.com/video/av24626290/) [[Magic Modified Texture Pack] Number Volume Special-3-Axis Ruler](https://www.bilibili.com/video/av39646162/)

- [The item bar and hands display different models](https://github.com/ShockMicro/CorePerspectiveModels)
- [[1.14] Item head/backpack/handheld display different textures/models](/datapack-index/save/833056.html){target="_blank"}

#### shader practice
- [Render player skin](https://github.com/JNNGL/vanilla-shaders/tree/main/fancy_player_models)
- [BetterTitle screen text display](https://github.com/Huoyuyuyu/BetterTitle) [(Show video)](https://www.bilibili.com/video/BV1AcvyeyECH/)

### debug
#### Performance testing
- [[MCcommand]Some valuable experience](https://www.bilibili.com/opus/996281238417309699)
- [Performance Test Standardization Tool](https://github.com/xiaodou8593/perf_1.0)
#### Correctness test
#### debug method
- [Minecraft vanilla mod getting started tutorial - debugging](https://zhangshenxing.github.io/VanillaModTutorial/#%E8%B0%83%E8%AF%95)
- [Common debugging skills - black box debugging - Xiaodou command book](https://xdcmd.vari.fun/chapter2-%E5%B8%B8%E7%94%A8%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7/1.%E6%B5%8B%E8%AF%95%E6%96%B9%E6%B3%95/1.%E9%BB%91%E7%AE%B1%E6%B5%8B%E8%AF%95.html){target="_blank"}
- tool:
  - [Data Debugger - Breakpoint debugging module](#data_debugger)

### other
- MC neural network
  - [Neural network deployment library for Minecraft map production](https://github.com/AjjMC/ajjnn)
- [High-precision time acquisition](https://github.com/intsuc/get_millis)
- [Detect player closing container](https://github.com/DefinitelyHighmore/sentinel)

### Example tutorial
- [[Tutorial Collection] How to make a gun in vanillaMC](https://www.bilibili.com/video/BV1PG4y1e7hx)
- [[Minecraft]data pack demo/data pack simulation moditem pipeline](https://www.bilibili.com/video/BV1sw4m1k7dG)
- [Analysis of the principle of imitation vanilla workbench](https://www.mcmod.cn/post/2175.html){target="_blank"}



## Useful tools and references

Below are comprehensive tutorial links and tools for reference, which may include tutorials mentioned above and tutorials whose content has been compiled into this article.
### tool
Just choose the right tool and use it appropriately.

- [DahanBi (Datapack Helper Plus by Spyglass)
- VSCode plug-in developed by data pack](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
  - [[Tutorial] How to solve the problem that the latest version of 4.0.0 Dahanbatch (Datapack Helper Plus) cannot be used](https://www.bilibili.com/video/BV1XJhKeGEm7/)
- [misode’s data pack generator](https://misode.github.io/)
- [Default item component viewer](https://t0rnato.github.io/mc-components/)
- [GMCTcommand Generator (1.10-1.17)](https://mc.metamo.cn/gmct/)
- [MCMODcommand block generator (1.10-1.14)](https://www.mcmod.cn/tools/cbcreator/)
- [CBHK - data pack development assistance software](https://gitee.com/honghuangtaichu/minecraft-correlation/releases/latest )
- [Datamancer - data pack development assistant module (1.20.2+)](https://modrinth.com/mod/datamancer)
- [Datapack Debugger - Breakpoint debugging auxiliary module](https://github.com/Alumopper/Datapack-Debugger) [(Show video)](https://www.bilibili.com/video/BV13m42137k9/)<span id="data_debugger"></span>
- Useful front-end data pack
  - [Bookshelf - Powerful, easy-to-use map production front-end data pack](https://github.com/Gunivers/Bookshelf/)
  - Math library:
    - [Karl’s Math Library](https://github.com/kaer-3058/large_number)
      - [Math library wiki](https://github.com/kaer-3058/large_number/wiki/%E5%8D%A1%E5%84%BF%E7%9A%84%E6%95%B0%E5%AD%A6%E5%BA%93-Wiki%E2%80%90%E4%B8%AD%E6%96%87)
    - [Xiaodou’s math library v2.0](https://github.com/xiaodou8593/math2.0)
    - [Xiaodou’s math library v3.0 (main body)](https://github.com/xiaodou8593/math3.0) [(geometric operation library gelib)](https://github.com/xiaodou8593/math3.0_gelib) [(data structure library dslib)](https://github.com/xiaodou8593/math3.0_dslib) [(Linear algorithm library lalib)](https://github.com/xiaodou8593/math3.0_lalib) (under development)
  - [Deco Creater kit - Simple interactive decoration model support library](https://www.mcmod.cn/class/14646.html){target="_blank"}~~(Kicked with private goods)~~
- [Map packaging and publishing tool](https://github.com/aksiome/mcwpack)
- [MCFPP - a programming language that compiles to data pack](https://www.mcfpp.top/)(Under development) [(Promotional video)](https://www.bilibili.com/video/BV1Kz421m76G) [(Github repository)](https://github.com/MinecraftFunctionPlusPlus/MCFPP)
### refer to
- Zero-based tutorial series (some of them are incomplete, it is recommended to watch them complementaryly)
  - [Datapacksdata pack teaching notes - Xiao Lingjun丶](https://space.bilibili.com/166572139/channel/collectiondetail?sid=6211)
  - [Introduction to my world command and data pack - Chuang Xiaoye](https://space.bilibili.com/133430292/channel/collectiondetail?sid=8272)
  - [MCcommand tutorial "real" starting from scratch - Dahesor ](https://www.bilibili.com/read/readlist/rl833427)
  - [Quick Start Series - Big Brother Mengcha](https://space.bilibili.com/320500029/channel/collectiondetail?sid=3167326)
  - [Tianbao Nebula tutorial collection](#tianbao)
  - [Data pack concise tutorial - Alumooper](https://space.bilibili.com/280394409/channel/collectiondetail?sid=1398896)
  - [FAQ Frequently Asked Questions](/resources/FAQ常见问题集.pdf)
- Advanced tutorial series
  - [Minecraft vanilla mod introductory tutorial - ruhuasiyu](https://zhangshenxing.github.io/VanillaModTutorial/)
  - [Sen Luo Xian - A Minecraft Java version resource pack production guide](https://sqwatermark.com/resguide/)
  - [command block newbie manual ](https://commandtutorials.neocities.org/)[(Github repository)](https://github.com/pca006132/CommandReference)
  - [Adzuki Dou command book](https://xdcmd.vari.fun/)&nbsp;&nbsp;&nbsp;(WIP)
- [Collection of vanillacommand learning materials - Karl Meng Qinglian](https://h5.qzone.qq.com/ugc/share/?sharetag=13CDCBFD5F18EA630A181BBBBDC17C86&loginfrom=4&jumptoqzone=1&subtype&ciphertext&blog_photo&g=85&res_uin=3315302995&cellid=1730644710&subid&bp1&bp2&bp7&appid=2&g_f=2000000103&_refluxos=a10)(QQ space access and jump are limited, the content of this post has been organized into this post)
- [My world developer Chinese guide](https://mouse0w0.github.io/MinecraftDeveloperGuide)


## Other resource links
- [Meet · Pixel Tea Art Download Site, a simple Minecraft map download site](https://www.bilibili.com/video/BV1ew4m1o7GT)
- [Euphoria Patches - Light and shadow customization module](https://www.mcmod.cn/class/12160.html){target="_blank"}
- [Time—2020-2022 Excellent Game Map Collection](https://www.bilibili.com/opus/642602445575290884)
- [Vanillashader light and shadow with good effect - Vanilla DI](https://github.com/JNNGL/VanillaDI/)
- [Spider - terrain adaptive animation plug-in](https://github.com/TheCymaera/minecraft-spider)






## appendix
- [Celestial Leopard Nebula](https://space.bilibili.com/19856853) Tutorial Collection<span id="tianbao"></span>
    - [[Minecraft Tutorial] How to make an instruction package/data package! Basic function usage](https://www.bilibili.com/video/BV1B4411M76G) (data pack framework structure)
    - [[Command Tutorial] A random teleportation booth that will be triggered when the door is closed! - Detailed instruction teaching + lazy instruction package download](https://www.bilibili.com/video/BV1zb41167Sp) (execute command application)
    - [[Minecraft Tutorial] Ray Movement Instruction Package Tutorial](https://www.bilibili.com/video/BV1Kx411R7H7/) (Basic ray movement (armor stand tp method))
    - [**[Minecraftcommand tutorial] Right-click detection**](https://www.bilibili.com/video/BV1xt411P7So) (Carrot fishing rod method)
    - [How to make a gun in MC? Novice tutorial to detailed instruction package](https://www.bilibili.com/video/BV1R4411D7Qn/) (Simple firearms)
    - [One item, multiple materials - CustomModelData [Minecraft Tutorial]](https://www.bilibili.com/video/BV1fJ411T74H) (cmd basic application) **(has replaceable features after 1.21.2)**
    - [Ammunition consumption - How to use clear command and execute store [MCcommand tutorial]](https://www.bilibili.com/video/BV1EJ411c7P9)
    - [Better detection system - optimize your command package through tags](https://www.bilibili.com/video/BV1dE411a7M9)
    - [Use the rotation angle skillfully to make special weapons! -Execute rotated operation method](https://www.bilibili.com/video/BV1NJ411q7pa)
    - [Perfect parabola! How to operate Motiontag [MCcommand tutorial]](https://www.bilibili.com/video/BV15J411p77C)
    - [Various ways to use Bossbar! 【Minecraftcommand Tutorial】](https://www.bilibili.com/video/BV19E411M7aR/)
- [Alumooper](https://space.bilibili.com/280394409)'s shader tutorial collection - MCJEshader tutorial: from entry to development to game crash <span id="aopshader"></span>
  - [(1)——Understanding shader](https://alumopper.top/minecraftshader1/)
  - [（二）——GLSL](https://alumopper.top/minecraftshader2/)
  - [(3)——shader program JSON](https://alumopper.top/minecraftshader3/)
  - [(4)——Post-processing shader (Post Json)](https://alumopper.top/minecraftshader4/)
  - [（五）——Many chestnuts](https://alumopper.top/minecraftshader5/)



