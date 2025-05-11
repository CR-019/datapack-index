> —— 你为什么写数据包？是有什么受虐体质吗？
>
> —— 是。


# 原版模组体系结构

[数据包 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E5%8C%85)[（Bwiki镜像）](https://wiki.biligame.com/mc/数据包)
[资源包 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85)[（Bwiki镜像）](https://wiki.biligame.com/mc/资源包)
[命令 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4)[（Bwiki镜像）](https://wiki.biligame.com/mc/命令)

[Minecraft 原版模组入门教程 ](https://zhangshenxing.github.io/VanillaModTutorial/) ~~(坛内)~~

本文体系结构为上述教程的引用和补充。

读者清楚：数据包、资源包相关知识首先请查阅上述资料。



[~~数据包/资源包常见问题索引以及一点资源(JE~~](/datapack-index/save/1233623.html){target="_blank"}

## 数据包体系结构

### 逻辑结构

#### 函数/命令

- 古典思潮

  - [~~[CBL∫2b]指令方块进阶教程——模块（面向过程） §索引~~](/datapack-index/save/460476.html){target="_blank"}（索引内部链接已失效）
  - [[CBL]|秋一1.13函数命令系统：当命令脱离命令方块](/datapack-index/save/691100.html){target="_blank"}
  - [~~引言 · 命令进阶 (oschina.io)~~](https://mc-command.oschina.io/command-tutorial/output/)（疑似无法访问）
- 命令执行操作
  - [/execute](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute)
    - [【教程】[1.15] execute 命令入门教程 ](/datapack-index/save/989501.html){target="_blank"}
    - [【CBL|SYL】【1.13】新版本execute嵌套的改变](/datapack-index/save/770198.html){target="_blank"}
    - [【Minecraft】“新”execute你会用吗？应当如何正确食用新语法？](https://www.bilibili.com/video/BV1B14y187Zy)
    - (不推荐) [[1.13+]新版execute命令详解](/datapack-index/save/901364.html){target="_blank"}
    - (不推荐)[玩转1.13的新/execute](/datapack-index/save/770738.html){target="_blank"}
  - 修饰子命令：
    - 执行者 `as | on | summon`
      - 直接指定`as`
      - 设为相关实体`on`
      - 生成新实体并指定为执行者`summon`

    - 朝向 `rotated | rotated as | facing | facing entity`

    - 局部基准点 `anchored`

    - 维度 `in`

    - 执行位置 `at | positioned | positioned as`

    - 执行位置取整 `align`
      - [(二) 命令tp与相对，局部坐标与朝向锚](https://www.bilibili.com/read/cv34840247)
    - [坐标 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%9D%90%E6%A0%87)
      - 绝对坐标
      - 局部坐标 `^ ^ ^`
      - 相对坐标 `~ ~ ~`
  - 条件子命令 `if|unless`
  - 存储子命令`store`
  - 执行子命令`run`


- 命令逻辑

  - 命令方块 (淘汰)
      [1.12 连锁命令方块(CCB)新机制研究](/datapack-index/save/687963.html){target="_blank"}
  - 数据包结构逻辑
      ~~[https://www.mcbbs.net/thread-1143275-1-1.html]~~

- 函数运行 [/function](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/function)
  - 定时函数运行 [/schedule]()
    - 由/schedule执行的函数，是由服务器执行，执行坐标是世界重生点
    - [【1.15+】极简的定时器，利用schedule实现任意时刻的定时器](/datapack-index/save/1022317.html){target="_blank"}
  - [函数宏](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%87%BD%E6%95%B0#%E5%AE%8F)
    - [minecraft 函数宏 特性和用法](https://www.bilibili.com/video/BV1Ji421m7XN/)
- 数据操作
  - [NBT](https://zh.minecraft.wiki/w/NBT%E6%A0%BC%E5%BC%8F)(数据储存/修改)
    - 古典教程
      - [【CBL|SYL】NBT标签实战教程—索引贴(基本完工) ](/datapack-index/save/78479.html){target="_blank"}
      - [~~2.2 NBT及结构 · 命令进阶 (oschina.io)~~](https://mc-command.oschina.io/command-tutorial/output/common-format/nbt/nbt.html){target="_blank"}（疑似无法访问）
    - （不太）现代教程
      - [~~( X ) 我就不信不能用大白话讲清楚NBT~~](/datapack-index/save/1190947.html){target="_blank"}
      - [教程/NBT命令标签](https://zh.minecraft.wiki/w/教程/NBT命令标签)
      - [(十一)NBT通俗演义（雾）](https://www.bilibili.com/opus/947507675726348296)
    - ~~物品NBT~~ [物品组件](https://zh.minecraft.wiki/w/%E7%89%A9%E5%93%81%E5%A0%86%E5%8F%A0%E7%BB%84%E4%BB%B6)
      - [教程：物品堆叠组件 - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E7%89%A9%E5%93%81%E5%A0%86%E5%8F%A0%E7%BB%84%E4%BB%B6)

    - [方块实体NBT](https://zh.minecraft.wiki/w/%E6%96%B9%E5%9D%97%E5%AE%9E%E4%BD%93%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)

    - NBT路径
      - [【CBL|SPG】[1.14] NBT 路径：从入门到胡了)](https://github.com/SPGoding/mcbbs-threads/blob/master/tutorials/nbt-path/markdown.md)

    - 返回值类型
      - [Minecraft：Java 版命令返回值列表 ](https://spgoding.com/command/2021/03/26/command-result-value.html){target="_blank"} [(坛内(R.I.P))](/datapack-index/save/808124.html){target="_blank"}
    - [/data](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/data) 以下教程互为补充
      - [【教程】[1.15] 常见的数据操作方法：入门教程](/datapack-index/save/993805.html){target="_blank"}
      - [(十二) 数据运算三方法之一修改NBT/data](https://www.bilibili.com/read/cv36068052)
      - [~~data 命令中数据的筛选~~](/datapack-index/save/1220434.html){target="_blank"}

    - `/data storage`
      - ~~(https://www.mcbbs.net/thread-1143275-1-1.html){target="_blank"}~~

    - <span id="execute_store">`/execute store`</span>
      - [【教程】[1.15] execute 命令入门教程 ](/datapack-index/save/989501.html){target="_blank"}
    - 记分板(数据运算)<span id="scoreboard"></span>
      - [/scoreboard](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/scoreboard)
        - [[1.8+]记分板完整教程应用](/datapack-index/save/274969.html){target="_blank"}
        - [(五) 记分板与/scoreboard](https://www.bilibili.com/read/cv34854289)
      - [/trigger](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/trigger)
    - 生成随机数 [/random](https://zh.minecraft.wiki/w/命令/random)

  - ~~原始JSON文本(数据输出)~~ [文本组件](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
    - 例：
      - ​	{"text":"Hello"}
      - 1.14以后，转义不需要\\"直接'" "'
    - 工具：
      - [Minecraft Tool](https://minecraft.tools/en/tellraw.php)
      - [[1.14-1.16]JText Studio 聊天成书所见即所得|全新交互](https://www.mcbbs.net/thread-986663-1-1.html){target="_blank"}
      - [[1.14+]JText Studio Minus轻量级JSON文本编辑器](https://www.mcbbs.net/thread-1103385-1-1.html){target="_blank"}
    - 古典教程：
      - [【CB圣典计划】JSON圣典-最全面JSON教程](https://www.mcbbs.net/thread-431678-1-1.html){target="_blank"}
      - [2.1 JSON文本 · 命令进阶 (oschina.io)](https://mc-command.oschina.io/command-tutorial/output/common-format/json/json.html){target="_blank"}
      - [原始JSON文本格式 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
      - [教程/原始JSON文本 - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)
      - [教程/NBT与JSON - Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:NBT%E4%B8%8EJSON)
      - [原始json文本中“子对象”的使用](/datapack-index/save/1076989.html){target="_blank"}
    - [纯文本与翻译文本](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E7%BA%AF%E6%96%87%E6%9C%AC)
    - [文本组件样式 "bold" | "italic" | "underlined" | "strikethrough" | "obfuscated" | "color"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F)
    - 字体颜色 "color"（见上） / [格式化代码](https://zh.minecraft.wiki/w/%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81)
      - [用彩色字给物品命名](/resources/【1.14-1.16.1】用彩色字给物品命名%20_%20获取玩家头颅%20-%20Minecraft(我的世界)中文论坛%20-%20Powered%20by%20Discuz!.html){target="_blank"}
    - [键位信息"keybind"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%8C%89%E9%94%AE%E7%BB%91%E5%AE%9A)
    - [数据引用 "nbt"-"block"/"entity"/"storage"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#NBT%E6%A0%87%E7%AD%BE%E5%80%BC)
    - [分数引用 "score"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E8%AE%B0%E5%88%86%E6%9D%BF%E5%88%86%E6%95%B0)
    - [实体名称（选择器）"selector"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#NBT%E6%A0%87%E7%AD%BE%E5%80%BC)
    - [字体"font"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E5%AD%97%E4%BD%93)
      - [【1.13】地图制作技巧——字体艺术](/datapack-index/save/835539.html){target="_blank"}
      - [~~关于字体资源包强制使用等宽字符的问题~~](/datapack-index/save/1275778.html){target="_blank"}
    - 解析"interpret"
      - [【CBL|SPG】[1.15+] JSON 文本中的 interpret ](/datapack-index/save/921501.html){target="_blank"}
    - 分隔符 "separator"
    - 事件

      - 插入聊天框事件 "insertion"

      - [点击事件 "clickEvent"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6)
        |     **action**      |     描述     |     **value**      |       可用性       |
        | :-----------------: | :----------: | :----------------: | :----------------: |
        |     "open_url"      |   打开网页   | http://example.com |     聊天、成书     |
        |    "run_command"    |   发送命令   |       String       | 聊天、成书、告示牌 |
        |    "change_page"    |   切换页码   |        Int         |        成书        |
        |  "suggest_command"  |   输入命令   |       String       |        聊天        |
        | "copy_to_clipboard" | 复制至剪贴板 |       String       |     聊天、成书     |

      - [悬浮事件 "hoverEvent"](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6#%E6%82%AC%E5%81%9C%E4%BA%8B%E4%BB%B6)
        |  **action**   |   描述   |            **value**             |               content               |
        | :-----------: | :------: | :------------------------------: | :---------------------------------: |
        |  "show_text"  | 显示文字 |             JSON文本             |              JSON文本               |
        |  "show_item"  | 显示物品 |     '{id:"",Count:,tag:{}}'      |    {"id":"","count":"","tag":""}    |
        | "show_entity" | 显示实体 | '{type:"",id:"",name:"",tag:{}}' | {"name":JSON文本,"type":"","id":""} |

    - [聊天栏](https://zh.minecraft.wiki/w/%E8%81%8A%E5%A4%A9)

      - 私密信息 [/tell](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tell) [/msg](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/msg) [/w](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/w)

        - tell <*玩家|目标选择器*> <*信息…*>

      - 所在队伍信息 [/teammsg](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/teammsg) [/tm](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tm)

        - teammsg <*信息*>

      - 所有玩家信息 [/say](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/say)

        - say <*信息*>

      - JSON文本信息 [/tellraw](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tellraw)
        - [~~【CBL|SYL】Json/tellraw教程索引贴~~](/datapack-index/save/205332.html){target="_blank"}

      - 显示自己的信息 [/me](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/me)
        - me <*动作…*>

    - 标题 [/title](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/title)
      - [M1.8：指令方块新的/title教程](/datapack-index/save/276456.html){target="_blank"}

      - 标题 `title`

      - 副标题 `subtitle`

      - 活动栏 `actionbar`
        - [~~【原版模组】【前置】1.16.X 玩家栏~~](/datapack-index/save/1156574.html){target="_blank"}
        - [~~[1.16+]状态栏数值化条形显示数据包 - 让你的血量数字化~~](/datapack-index/save/1209691.html){target="_blank"}
        - [马大哈——小猫咪被我看得一清二楚！！！](/datapack-index/save/1047712.html){target="_blank"}`（非物质文化遗产）`

    - Boss栏 [/bossbar](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/bossbar)
      - [1.13Bossbar指令全用法](/datapack-index/save/781746.html){target="_blank"}
      - [~~玩家分离bossbar，每个玩家可以单独编辑了~~](/datapack-index/save/1179992.html){target="_blank"}
      - [[1.14]如何把bossbar和scoreboard联系在一起](/datapack-index/save/864877.html){target="_blank"}
        - /execute store result bossbar <boss栏id> value run scoreboard players get <实体> <计分板id>
      - [[18w05a]新命令/bossbar 自定义boss血条实现指向效果 [已稳定]](/datapack-index/save/778336.html){target="_blank"}

    - 分数栏 [/scoreboard](#scoreboard) objectives setdisplay <*槽位*> [*记分板ID*]
      - 侧边栏 `sidebar`
      - 人物名称 `below`
      - 玩家名单 `list`

    - 成书(值会被解析)
      - {pages:["first page","second page",'["",JSON文本]']}

    - 书与笔(值不会被解析，为String)
      - {pages:["first page","second page",'["",JSON文本]']}
      - [~~命令书~~](/datapack-index/save/1190418.html){target="_blank"}

    - 告示牌(值会被解析)
      - {Text1:"第一行文本",Text2:'{"text":"第二行文本"},Text3:"",Text4:""}
      - [【水教程】[1.14+] 告示牌黑科技 / 用战利品表实现 ](/datapack-index/save/1101560.html){target="_blank"}

    - 实体名字 `CustomName`
      - {CustomName:'{"text":"僵尸"}'}

    - 物品命名/注释~~display - Name / Lore~~ `"minecraft:item_name"/"minecraft:custom_name"/"minecraft:lore"`
      - ~~{display:{Name:'{"text":"钻石剑","color":"dark_red","italic":false}',Lore:"diamond_sword"}}~~

- 方块操作

  - [结构方块](https://zh.minecraft.wiki/w/%E7%BB%93%E6%9E%84%E6%96%B9%E5%9D%97)
    - [【1.10新特性】结构方块从入门到放弃](/datapack-index/save/585095.html){target="_blank"}
    - [[1.14+] 组合结构的随机生成及修饰](/datapack-index/save/899638.html){target="_blank"}
    - [如何使用结构方块](/datapack-index/save/652937.html){target="_blank"}
    - [【新手向】建筑党也能愉快享用结构方块-图文并茂教会你使用结构方块](/datapack-index/save/801350.html){target="_blank"}
  - 加载结构
      ```mcfunction
      execute at @p run setblock ~ ~ ~ structure_block{name:"woodland_mansion/1x1_a3",mode:"LOAD",powered:0}
      execute at @p run setblock ~ ~-1 ~ redstone_block
      ```

  - 放置方块 [/setblock](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setblock)
    - [(十)简单又新手（雾）的方块指令/setblock](https://www.bilibili.com/opus/942368755971784728)
  - 复制区域 [/clone](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/clone)
    - [(十五)复制一片区域：复制命令/clone](https://www.bilibili.com/read/cv38861264/)
  - 填充区域 [/fill](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/fill)
    - [(十四) 最接近神的一次：填充命令/fill](https://www.bilibili.com/read/cv37972439/)
  - 修改生物群系 [/fillbiome](https://zh.minecraft.wiki/w/命令/fillbiome)



- 物品操作

  - 清除物品 [/clear](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/clear)

  - 给予物品 [/give](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/give)

  - 置入战利品表 [/loot](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/loot)
    - [rua影盒](https://zhangshenxing.github.io/VanillaModTutorial/#%E4%BF%AE%E6%94%B9%E7%8E%A9%E5%AE%B6%E8%83%8C%E5%8C%85)
    - [[1.14]如何使用loot replace](/datapack-index/save/874755.html){target="_blank"}
    - 内联战利品表/谓词/物品修饰器

  - 附魔物品 [/enchant](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/enchant)

  - 修改物品栈
    - 1.17 [/item](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/item)
    - 1.16 [/replaceitem](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/replaceitem)

- 实体操作

  - [目标选择器](https://zh.minecraft.wiki/w/%E7%9B%AE%E6%A0%87%E9%80%89%E6%8B%A9%E5%99%A8)
    - [(一) 指令，选择器，与命令方块](https://www.bilibili.com/read/cv34839498)
    - [(六) /tag指令，与进阶选择器参数](https://www.bilibili.com/opus/937149730721366018)
    - [[1.14.4] 追根溯「源」——实体选择器 ](/datapack-index/save/891687.html){target="_blank"}

  - 实体生成 [/summon](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/summon)
    - [ [TCP|Jokey]关于summon时隐藏的实体和隐形矿车那些事](/datapack-index/save/926441.html){target="_blank"}

  - 实体清除 [/kill](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/kill)
  - 造成伤害 [/damage](https://zh.minecraft.wiki/w/命令/damage)

  - 粒子生成 [/particle](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/particle)
    - [particle指令（粒子指令）的大小、颜色、格式变化以及扩展](/datapack-index/save/625963.html){target="_blank"}
    - [【原版】particle指令参数对颗粒行为的影响](/datapack-index/save/852420.html){target="_blank"}
  - 骑乘 [/ride](https://zh.minecraft.wiki/w/命令/ride)
  - 传送
    - 随机传送 [/spreadplayers](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spreadplayers)
      - `spreadplayers <*x*> <*z*> <*分散间距*> <*最大范围*> [*under* *最大高度*] <*考虑队伍*> <*传送目标…*>`

    - 传送 [/teleport](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/teleport) [/tp](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tp)
      - [~~teleport 相对坐标 本地坐标 省略选择器~~](/datapack-index/save/1114273.html){target="_blank"}
  - 旋转 [/rotate](https://zh.minecraft.wiki/w/命令/rotate)

  - 状态效果 [/effect](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/effect)
    - [[1.13+]状态效果——effect命令详细介绍 - 游戏技巧 - Minecraft(我的世界)中文论坛 - (mcbbs.net)](/datapack-index/save/1068146.html){target="_blank"}
    - [~~请问effect 里面负级指令怎么调~~](/datapack-index/save/1201497.html){target="_blank"}

  - 属性 [/attribute](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/attribute)
    - [ [20w17a]attribute指令详解](/datapack-index/save/1026841.html){target="_blank"}
    - [（十三）属性管理，/attribute](https://www.bilibili.com/opus/957257796958552103)

  - 队伍 [/team](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/team)
    - [(四) 有关队伍命令/team的……差不多一切](https://www.bilibili.com/opus/936409278375264260)

  - 标签 [/tag](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tag)
    - [(六) /tag指令，与进阶选择器参数](https://www.bilibili.com/opus/937149730721366018)

  - 其他

    - 经验 [/experience](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/experience) [/xp](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/xp)
    - 旁观实体 [/spectate](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spectate)

- 音效

  - 播放 [/playsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/playsound)

    - playsound <*声音 entity.pig.ambient*> <*来源*> <*玩家名|目标选择器*> [<*方位x y z*>] [<*音量*>] [<*音调0.0~2.0*>] [<*最小音量0.0~1.0*>]
      来源：master,music,record,weather,block,hostile,neutral,player,ambient,voice

  - 停止 [/stopsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stopsound)

    - stopsound <*玩家名|目标选择器*> [*来源*] [*声音*]
          来源：可以为 “ * ”

- 世界操作

  - [游戏模式](https://zh.minecraft.wiki/w/%E6%B8%B8%E6%88%8F%E6%A8%A1%E5%BC%8F)

    - 世界模式 [/defaultgamemode](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/defaultgamemode)
    - 玩家模式 [/gamemode](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/gamemode)

  - 游戏难度 [/difficulty](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/difficulty)

  - 游戏规则 [/gamerule](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/gamerule)

  - 结构位置 [/locate <structure|biome>](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/locate)

  - 世界种子 [/seed](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/seed)

  - [出生点](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1182418&page=1#pid21460488)

    - 世界出生点 [/setworldspawn](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setworldspawn)
    - 玩家出生点 [/spawnpoint](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/spawnpoint)

  - 世界时间 [/time](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/time)

  - 主世界天气 [/weather](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/weather)

  - 世界边界 [/worldborder](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/worldborder)

  - 强制区块运行 [/forceload](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/forceload)

  - [(八) 区块与强制加载命令/forceload](https://www.bilibili.com/opus/937515275404705808)
  - 游戏刻速率 [/tick](https://zh.minecraft.wiki/w/命令/tick)

- 外部命令

  | 命令                                                                 | 描述                                   |
  | -------------------------------------------------------------------- | -------------------------------------- |
  | [/datapack](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/datapack) | 控制加载的数据包。                     |
  | [/debug](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/debug)       | 开始或结束调试会话。                   |
  | [/reload](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/reload)     | 从硬盘中重新加载战利品表、进度和函数。 |

- 服务器操作

  | 命令                                                                             | 描述                           | 语法                                                                                               |
  | -------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
  | [/ban](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/ban)                       | 将玩家加入封禁列表。           | ban <*玩家名\|UUID*> [<*理由…*>]                                                                   |
  | [/ban-ip](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/ban-ip)                 | 将IP地址加入封禁列表。         | ban-ip <*玩家名\|IP地址*> [<*理由…*>]                                                              |
  | [/banlist](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/banlist)               | 显示封禁列表。                 | banlist ips <br />banlist players                                                                  |
  | [/deop](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/deop)                     | 撤销玩家的管理员权限。         | deop <*玩家*>                                                                                      |
  | [/kick](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/kick)                     | 将玩家踢出服务器。             | kick <*玩家名\|目标选择器*> [*原因*]                                                               |
  | [/list](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/list)                     | 列出服务器中的玩家。           | list [*uuids*]                                                                                     |
  | [/op](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/op)                         | 授予玩家管理员权限。           | op <*玩家名\|目标选择器）*>                                                                        |
  | [/pardon](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/pardon)                 | 从封禁列表中移除玩家封禁项目。 | pardon <*玩家名*>                                                                                  |
  | [/pardon-ip](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/pardon-ip)           | 从封禁列表中移除IP封禁项目。   | pardon-ip <*IP地址*>                                                                               |
  | [/publish](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/publish)               | 向局域网开放单人游戏世界。     | publish [*端口0~65536*]                                                                            |
  | [/save-all](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-all)             | 保存服务器世界状态到硬盘。     | save-all [flush]<br />flush:服务器会立即保存所有的区块数据                                         |
  | [/save-off](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-off)             | 关闭服务器自动保存。           | save-off                                                                                           |
  | [/save-on](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/save-on)               | 开启服务器自动保存。           | save-on                                                                                            |
  | [/setidletimeout](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/setidletimeout) | 设置无操作玩家被踢出的延时。   | setidletimeout <*空闲分钟数0~2147483647*>                                                          |
  | [/stop](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/stop)                     | 关闭服务器。                   | stop                                                                                               |
  | [/transfer](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/transfer)             | 将玩家转移到另一个服务器上。   | transfer <*hostname*> [<*port*>] [<*players*>]                                                       |
  | [/whitelist](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/whitelist)           | 管理服务器白名单。             | whitelist add <*玩家*><br />whitelist remove <*玩家*><br />whitelist <list\|off\|on\|reload><br /> |



### 数据结构
  - 工具（通用）：
    - [[1.15-1.17] Data Pack Generators for Minecraft —— 数据包 JSON 文件生成器！](/datapack-index/save/897487.html){target="_blank"}
    - https://misode.github.io/

#### 战利品表
  - [战利品表 - Minecraft Wiki](https://zh.minecraft.wiki/w/战利品表)
  - [【CBL|SPG】[1.16] 战利品表 —— 数据包的组成文件之一](/datapack-index/save/831542.html){target="_blank"}
  - 远古教程：[[CBL∫2b]Loottable - 创造一个看脸讲玄的世界 总索引](https://www.mcbbs.net/forum.php?mod=viewthread&tid=619468)
  - [内联战利品表](#inline)

#### 谓词
  - [谓词 - Minecraft Wiki](https://zh.minecraft.wiki/w/谓词)
  - [【CBL|SPG】[1.16] ㄆㄧㄉㄧㄎㄞㄊㄜ —— 数据包的组成文件之一 ](/datapack-index/save/914817.html){target="_blank"}
  - [内联谓词](#inline)

#### 物品修饰器
  - [物品修饰器 - Minecraft Wiki](https://zh.minecraft.wiki/w/物品修饰器)
  - [~~物品修饰器的简单介绍~~](/datapack-index/save/1187947.html){target="_blank"}
  - [Minecraft 原版模组入门教程 - 物品修饰器](https://zhangshenxing.github.io/VanillaModTutorial/#物品修饰器)
  - [内联物品修饰器](#inline)

#### 进度
- 工具
  - VSCode插件：[~~Minecarft Json Viewer——基于vscode的数据包进度仿真插件~~](/datapack-index/save/1109032.html){target="_blank"}。
- [进度 - Minecraft Wiki](https://zh.minecraft.wiki/w/进度)
- [【烯方的那一套理论】猴子都能学会的自定义advancement！](/datapack-index/save/685310.html){target="_blank"}
- [【教程】[1.14] 自定义进度：从入门到弃坑](/datapack-index/save/892563.html){target="_blank"}
- [[20w20a]来看看最新的进度触发器](/datapack-index/save/1045395.html){target="_blank"}
- [[1.15] 新的进度触发器](/datapack-index/save/936174.html){target="_blank"}

#### 附魔（1.21+）
- [魔咒数据格式 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E9%AD%94%E5%92%92%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)
- [魔咒系统详解（自定义附魔）](https://etis.vcsofficial.site/d/23-mo-zhou-xi-tong-xiang-jie-zi-ding-yi-fu-mo)

#### 标签
  - [标签 - Minecraft Wiki](https://zh.minecraft.wiki/w/标签)
  - [【UIN】数据包——标签分类](/datapack-index/save/775667.html){target="_blank"}
  - [Minecraft 原版模组入门教程-标签](https://zhangshenxing.github.io/VanillaModTutorial/#标签)
  - [哪些命令中的哪些部分可以使用标签 ](/datapack-index/save/963143.html){target="_blank"}
  - [数据包标签的使用问题](/datapack-index/save/989540.html){target="_blank"}

#### 配方
- 工具：
  - [~~mc-recipe-editor——数据包配方编辑器~~](/datapack-index/save/1222437.html){target="_blank"}
- [配方 - Minecraft Wiki](https://zh.minecraft.wiki/w/配方)
- [Minecraft 原版模组入门教程-配方](https://zhangshenxing.github.io/VanillaModTutorial/#配方)

### 世界生成
- [[熟肉]Minecraft的地形是如何生成的？](https://www.bilibili.com/video/BV13u411j7KX/)
#### 结构
- 工具：
  - VSCode插件：NBT Viewer
- [Minecraft 原版模组入门教程 - 结构](https://zhangshenxing.github.io/VanillaModTutorial/#结构)
- [minecraft1.20版本自定义结构生成教程](https://www.bilibili.com/opus/987615832663130118)

#### 维度和维度类型
- [维度 - Minecraft Wiki](https://zh.minecraft.wiki/w/维度数据格式)
- [Minecraft 原版模组入门教程 - 维度和维度类型](https://zhangshenxing.github.io/VanillaModTutorial/#%E7%BB%B4%E5%BA%A6%E5%92%8C%E7%BB%B4%E5%BA%A6%E7%B1%BB%E5%9E%8B)

#### 自定义世界生成
- [自定义世界生成 - Minecraft Wiki](https://zh.minecraft.wiki/w/自定义世界生成)
- [【合集】用数据包自定义世界 - Alumooper](https://www.bilibili.com/read/readlist/)
- [Minecraft 原版模组入门教程 - 自定义世界生成](https://zhangshenxing.github.io/VanillaModTutorial/#%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%96%E7%95%8C%E7%94%9F%E6%88%90)
- 工具：
      [[1.16] Multi Noise Visualizer —— 实时预览多重噪声生物群系源的生成情况 ](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1080570&highlight=)
      ​	[worldgen——在线自定义世界生成器](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1129292&highlight=)
      https://misode.github.io/



- **生物群系**

- **雕刻**

- **地物**

- **结构特征**

- **地表生成器**

- **噪声设置**

- **方块处理器**

- **拼图**
    - [拼图方块 - Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%8B%BC%E5%9B%BE%E6%96%B9%E5%9D%97)
    - [[VCS] 拼图方块与拼图池教程（1.16.2+）](/datapack-index/save/1093331.html){target="_blank"}
    - [~~[1.17.1] 拼图池运用与结构生成~~](/datapack-index/save/1273515.html){target="_blank"}
    - [~~[转载][1.17+]如何用好拼图方块、拼图池、模板池~~](/datapack-index/save/1231185.html){target="_blank"}



## 资源包体系结构
- [森罗万象 —— 一个 Minecraft Java 版资源包制作指南](https://sqwatermark.com/resguide/)

### 模型
  - [模型 - Minecraft Wiki](https://zh.minecraft.wiki/w/模型)
  - 方块状态
  - 方块模型
  - 物品模型
    - [模型覆写(override) - 1.21.3及以前](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E6%A8%A1%E5%9E%8B%E8%A6%86%E5%86%99)
    - [物品模型映射 - 1.21.4](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E7%89%A9%E5%93%81%E6%A8%A1%E5%9E%8B%E6%98%A0%E5%B0%84)
  - [装备模型](https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E8%A3%85%E5%A4%87%E6%A8%A1%E5%9E%8B)
    - [【复刻计划】制作肘击球衣——自定义装备简介](https://www.bilibili.com/video/BV1G4SzYaEyv)&nbsp;&nbsp;&nbsp;(注：该视频基于1.21.2，在1.21.4及后续版本路径有改动，基础逻辑不变)

### 纹理
  - [纹理 - Minecraft Wiki](https://zh.minecraft.wiki/w/纹理)
  - 纹理
  - 皮肤

### 声音
  - [声音 - Minecraft Wiki](https://zh.minecraft.wiki/w/Sounds.json)
  - [Minecraft Sounds - 原版音效搜索与下载](https://o.xbottle.top/mcsounds/)

### 字体
  - [字体 - Minecraft Wiki](https://zh.minecraft.wiki/w/字体)
  - [自定义字体 - Minecraft Wiki](https://zh.minecraft.wiki/w/自定义字体)
  - [字体实践](#font)

### 着色器
  - [着色器 - Minecraft Wiki](https://zh.minecraft.wiki/w/着色器)
  - [原版着色器指导](/datapack-index/save/916150.html){target="_blank"} [<u>(网站)</u>](https://spgoding.com/translation/2021/03/12/guite-to-vanilla-shader.html){target="_blank"}
  - [Minecraft GLSL Shader着色器基础教程系列](https://www.bilibili.com/read/readlist/rl738651)
  - [MCJE着色器教程：从开发入门到游戏崩溃](#aopshader)
  - [香草着色器入门教程！(4/21)](https://etis.vcsofficial.site/d/17-xiang-cao-zhao-se-qi-ru-men-jiao-cheng-421)
  - [~~核心着色器浅析~~](/datapack-index/save/1181123.html){target="_blank"}
  - [Minecraft-Shaders-Wiki](https://github.com/McTsts/Minecraft-Shaders-Wiki/tree/main)
  - [几个原版着色器示例](/datapack-index/save/917679.html){target="_blank"}
  - [原版资源包着色器与动画研究心得](/datapack-index/save/863730.html){target="_blank"}
  - [不会有人看的深度缓冲着色器分析&用途](/datapack-index/save/1056196.html){target="_blank"}
  - [GAMES101-现代计算机图形学入门-闫令琪](https://www.bilibili.com/video/BV1X7411F744/)
  - [（可参考）OpenGL api手册](https://learnopengl.com/book/book_pdf.pdf)&nbsp;&nbsp;&nbsp;(Read The *\*Friendly\** Manual)


## 实践
### 数据包实践
#### 自定义物品/方块
- [Minecraft 原版模组入门教程 - 物品设计](https://zhangshenxing.github.io/VanillaModTutorial/#物品设计)
- [Minecraft 原版模组入门教程 - 方块设计](https://zhangshenxing.github.io/VanillaModTutorial/#方块设计)
- [Minecraft 原版模组入门教程 - 机器设计](https://zhangshenxing.github.io/VanillaModTutorial/#机器设计)
- [[MCJE]无需mod，纯原版五分钟自定义物品 | 数据包简明教程#3](https://www.bilibili.com/video/BV1Q24y1N7hY/)
- [我的世界 爆炸弓 数据包乱做视频](https://www.bilibili.com/video/BV14A411c78B/)
#### 数据包常用技术性实体
- 1.19.4以前（过时）：
  - [盔甲架](https://zh.minecraft.wiki/w/盔甲架)
  - [区域效果云](https://zh.minecraft.wiki/w/%E5%8C%BA%E5%9F%9F%E6%95%88%E6%9E%9C%E4%BA%91)
- [展示实体](https://zh.minecraft.wiki/w/%E5%B1%95%E7%A4%BA%E5%AE%9E%E4%BD%93)
  - 工具：
    - [展示实体四元数变换实时观测](https://misode.github.io/transformation/)
  - 科普：
    - [四元数如何控制物体旋转？](https://www.bilibili.com/video/BV14t421h7M4/)
  - [animated java - 原版制作实体动画](https://animated-java.dev/)
    - [官网文档](https://animated-java.dev/docs/introduction/what-is-animated-java)
    - [见识一下Java版的原版动画吧！Blockbench插件Animated Java作品合集](https://www.bilibili.com/video/BV12D4y1F7VM)
- [交互实体](https://zh.minecraft.wiki/w/%E4%BA%A4%E4%BA%92%E5%AE%9E%E4%BD%93)
- [marker](https://zh.minecraft.wiki/w/标记)

#### 常用数据运算

#### 玩家位移控制
- [[教程] 原版的/motion命令？教你如何用纯原版命令修改玩家动量](https://www.bilibili.com/video/BV1iYbLeqE1U/)
#### 其他
- [战利品表随机数](https://zhangshenxing.github.io/VanillaModTutorial/#%E9%9A%8F%E6%9C%BA%E6%95%B0)
- <span id="inline">[内联战利品表/谓词/物品修饰器](https://etis.vcsofficial.site/d/24-nei-lian-zhan-li-pin-biao-wei-ci-wu-pin-xiu-shi-qi-jian-yao-jie-shao)</span>

### 资源包实践

#### <span id="font">字体实践</span>
- [负空格字体](https://github.com/AmberWat/NegativeSpaceFont)
- [字体黑科技 —— 潜影盒内容预览](https://www.bilibili.com/video/av67508247)
- [【1.13】地图制作技巧——字体艺术](/datapack-index/save/835539.html){target="_blank"}

#### 模型实践
- [Minecraft 原版模组入门教程 - 模型](https://zhangshenxing.github.io/VanillaModTutorial/#%E6%A8%A1%E5%9E%8B)
- 绕开mj模型大小限制的方法：[旋转拼接](/datapack-index/save/637959.html){target="_blank"}&nbsp;&nbsp;[1200米大刀](https://www.bilibili.com/video/av24626290/)&nbsp;&nbsp;[【魔改材质包】数体积专用-3轴标尺](https://www.bilibili.com/video/av39646162/)

- [物品栏和手部显示不同模型](https://github.com/ShockMicro/CorePerspectiveModels)
- [【1.14】物品头部/背包/手持显示不同纹理/模型](/datapack-index/save/833056.html){target="_blank"}

#### 着色器实践
- [渲染玩家皮肤](https://github.com/JNNGL/vanilla-shaders/tree/main/fancy_player_models)
- [BetterTitle 屏幕文字展示](https://github.com/Huoyuyuyu/BetterTitle)&nbsp;&nbsp;&nbsp;[(展示视频)](https://www.bilibili.com/video/BV1AcvyeyECH/)

### 调试
#### 性能测试
- [【MC命令】一些宝贵的经验](https://www.bilibili.com/opus/996281238417309699)
- [性能测试标准化工具](https://github.com/xiaodou8593/perf_1.0)
#### 正确性测试
#### debug方法
- [Minecraft 原版模组入门教程 - 调试](https://zhangshenxing.github.io/VanillaModTutorial/#%E8%B0%83%E8%AF%95)
- [常用调试技巧-黑箱调试 - 小豆命令书](https://xdcmd.vari.fun/chapter2-%E5%B8%B8%E7%94%A8%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7/1.%E6%B5%8B%E8%AF%95%E6%96%B9%E6%B3%95/1.%E9%BB%91%E7%AE%B1%E6%B5%8B%E8%AF%95.html){target="_blank"}
- 工具：
  - [Data Debugger - 断点调试模组](#data_debugger)

### 其他
- MC神经网络
  - [用于Minecraft地图制作的神经网络部署库](https://github.com/AjjMC/ajjnn)
- [高精度时间获取](https://github.com/intsuc/get_millis)
- [检测玩家关闭容器](https://github.com/DefinitelyHighmore/sentinel)

### 实例教程
- [【教程合集】如何在原版MC种制作一把枪](https://www.bilibili.com/video/BV1PG4y1e7hx)
- [【Minecraft】数据包演示/数据包模拟mod物品管道](https://www.bilibili.com/video/BV1sw4m1k7dG)
- [仿原版工作台原理解析](https://www.mcmod.cn/post/2175.html){target="_blank"}



## 有用的工具和参考

以下为可供参考的综合教程链接和工具，其中可能包含上文中提到的教程和内容已整理入本文的教程。
### 工具
适当挑选合适的工具使用即可。

- [大憨批(Datapack Helper Plus by Spyglass) - 数据包开发VSCode插件]( https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
  - [[教程] 如何解决4.0.0最新版大憨批（Datapack Helper Plus）用不了的问题](https://www.bilibili.com/video/BV1XJhKeGEm7/)
- [misode的数据包生成器](https://misode.github.io/)
- [默认物品组件查看器](https://t0rnato.github.io/mc-components/)
- [GMCT命令生成器（1.10-1.17）](https://mc.metamo.cn/gmct/)
- [MCMOD命令方块生成器(1.10-1.14)](https://www.mcmod.cn/tools/cbcreator/)
- [CBHK - 数据包开发辅助软件](https://gitee.com/honghuangtaichu/minecraft-correlation/releases/latest )
- [Datamancer - 数据包开发辅助模组(1.20.2+)](https://modrinth.com/mod/datamancer)
- [Datapack Debugger - 断点调试辅助模组](https://github.com/Alumopper/Datapack-Debugger)&nbsp;&nbsp;[(展示视频)](https://www.bilibili.com/video/BV13m42137k9/)<span id="data_debugger"></span>
- 有用的前置数据包
  - [Bookshelf - 功能强大，简单易用的地图制作前置数据包](https://github.com/Gunivers/Bookshelf/)
  - 数学库：
    - [卡儿的数学库](https://github.com/kaer-3058/large_number)
      - [数学库wiki](https://github.com/kaer-3058/large_number/wiki/%E5%8D%A1%E5%84%BF%E7%9A%84%E6%95%B0%E5%AD%A6%E5%BA%93-Wiki%E2%80%90%E4%B8%AD%E6%96%87)
    - [小豆的数学库v2.0](https://github.com/xiaodou8593/math2.0)
    - [小豆的数学库v3.0(主体)](https://github.com/xiaodou8593/math3.0)&nbsp;&nbsp;[(几何运算库gelib)](https://github.com/xiaodou8593/math3.0_gelib)&nbsp;&nbsp;[(数据结构库dslib)](https://github.com/xiaodou8593/math3.0_dslib)&nbsp;&nbsp;[(线性算法库lalib)](https://github.com/xiaodou8593/math3.0_lalib)&nbsp;&nbsp;（开发中）
  - [Deco Creater kit - 简单交互性装饰模型支持库](https://www.mcmod.cn/class/14646.html){target="_blank"}~~(夹带私货踢了)~~
- [地图打包发布工具](https://github.com/aksiome/mcwpack)
- [MCFPP - 可编译为数据包的编程语言](https://www.mcfpp.top/)(开发中)&nbsp;&nbsp;&nbsp;[(宣传视频)](https://www.bilibili.com/video/BV1Kz421m76G)&nbsp;&nbsp;&nbsp;[(Github仓库)](https://github.com/MinecraftFunctionPlusPlus/MCFPP)
### 参考
- 零基础教程系列（其中有部分不完整，建议互补观看）
  - [Datapacks数据包教学笔记 - 小泠君丶](https://space.bilibili.com/166572139/channel/collectiondetail?sid=6211)
  - [我的世界指令、数据包入门 - 创小业](https://space.bilibili.com/133430292/channel/collectiondetail?sid=8272)
  - [MC命令教程“真”从零开始 - Dahesor ](https://www.bilibili.com/read/readlist/rl833427)
  - [快速入门上手系列 - 大佬萌茶](https://space.bilibili.com/320500029/channel/collectiondetail?sid=3167326)
  - [天豹星雲教程合集](#tianbao)
  - [数据包简明教程 - Alumooper](https://space.bilibili.com/280394409/channel/collectiondetail?sid=1398896)
  - [FAQ常见问题集](/resources/FAQ常见问题集.pdf)
- 进阶教程系列
  - [Minecraft 原版模组入门教程 - ruhuasiyu](https://zhangshenxing.github.io/VanillaModTutorial/)
  - [森罗万象 —— 一个 Minecraft Java 版资源包制作指南](https://sqwatermark.com/resguide/)
  - [命令方块新人手册&nbsp; &nbsp; ](https://commandtutorials.neocities.org/)[(Github仓库)](https://github.com/pca006132/CommandReference)
  - [小豆命令书](https://xdcmd.vari.fun/)&nbsp;&nbsp;&nbsp;(WIP)
- [原版命令学习资料合集 - 卡儿梦青涟](https://h5.qzone.qq.com/ugc/share/?sharetag=13CDCBFD5F18EA630A181BBBBDC17C86&loginfrom=4&jumptoqzone=1&subtype&ciphertext&blog_photo&g=85&res_uin=3315302995&cellid=1730644710&subid&bp1&bp2&bp7&appid=2&g_f=2000000103&_refluxos=a10)(qq空间访问与跳转受限，该贴内内容已整理入本贴中)
- [我的世界开发者中文指南](https://mouse0w0.github.io/MinecraftDeveloperGuide)


## 其他资源友情链接
- [遇见 · 像素茶艺下载站，一个简洁的Minecraft地图下载站](https://www.bilibili.com/video/BV1ew4m1o7GT)
- [Euphoria Patches - 光影定制模组](https://www.mcmod.cn/class/12160.html){target="_blank"}
- [时——2020-2022优秀游戏地图集锦](https://www.bilibili.com/opus/642602445575290884)
- [效果很好的原版着色器光影 - Vanilla DI](https://github.com/JNNGL/VanillaDI/)
- [Spider - 地形自适应动画插件](https://github.com/TheCymaera/minecraft-spider)






## 附录
- [天豹星雲](https://space.bilibili.com/19856853)教程合集<span id="tianbao"></span>
    - [【Minecraft教学】如何制作指令包/资料包！基础函数用法](https://www.bilibili.com/video/BV1B4411M76G)&nbsp;&nbsp;&nbsp;(数据包框架结构)
    - [【指令教学】关上门就会触发的随机传送亭！- 详细指令教学 + 懒人指令包下载](https://www.bilibili.com/video/BV1zb41167Sp)&nbsp;&nbsp;&nbsp;(execute指令应用)
    - [【Minecraft教学】射线移动指令包教学](https://www.bilibili.com/video/BV1Kx411R7H7/)&nbsp;&nbsp;&nbsp;(基础的射线移动（盔甲架tp法）)
    - [**【Minecraft命令教学】右键侦测**](https://www.bilibili.com/video/BV1xt411P7So)&nbsp;&nbsp;&nbsp;(胡萝卜钓竿法)
    - [如何在MC中做出一把枪？新手向详细指令包教学](https://www.bilibili.com/video/BV1R4411D7Qn/)&nbsp;&nbsp;&nbsp;(简单枪械)
    - [一个物品，多个材质 - CustomModelData【Minecraft教学】](https://www.bilibili.com/video/BV1fJ411T74H)&nbsp;&nbsp;&nbsp;(cmd基础应用) **(在1.21.2后有可平替特性)**
    - [弹药消耗 - clear指令与execute store的使用方法【MC命令教学】](https://www.bilibili.com/video/BV1EJ411c7P9)
    - [更好的侦测系统 - 通过tag优化你的指令包](https://www.bilibili.com/video/BV1dE411a7M9)
    - [巧用旋转角度做出特殊武器！ - execute rotated的操作方法](https://www.bilibili.com/video/BV1NJ411q7pa)
    - [完美抛物线！ Motion标签的操作方法【MC命令教学】](https://www.bilibili.com/video/BV15J411p77C)
    - [Bossbar的各种使用方法！【Minecraft命令教学】](https://www.bilibili.com/video/BV19E411M7aR/)
- [Alumooper](https://space.bilibili.com/280394409)的着色器教程合集——MCJE着色器教程：从开发入门到游戏崩溃<span id="aopshader"></span>
  - [（一）—— 了解着色器](https://alumopper.top/minecraftshader1/)
  - [（二）——GLSL](https://alumopper.top/minecraftshader2/)
  - [（三）—— 着色器程序JSON](https://alumopper.top/minecraftshader3/)
  - [（四）——后处理着色器（Post Json）](https://alumopper.top/minecraftshader4/)
  - [（五）——很多的栗子](https://alumopper.top/minecraftshader5/)


