---
title: '基于按位操作及多进制编码的对话框多输入控件设计'
---

<FeatureHead
    title = '基于按位操作及多进制编码的对话框多输入控件设计'
    authorName = 徐木弦
    avatarUrl = '../../_authors/徐木弦.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/449298404' }
    ]"
    cover='../_assets/4.png'
/>

## 摘要

对话框的操作、提交行为总是会受到玩家权限等级的限制，为此在点击事件中必须使用命令`/trigger`，但是一个记分板命令一次只能提交一个分数，这对于具有多个输入控件的对话框而言是一种限制。本文将按位操作及多进制编码使用在对话框输入控件上，并将其应用在实际开发的数据包中。

::: tip 编者注
![`/trigger settings set $(input1)$(input2)$(input3)`](编者注.png)
用一条命令`/trigger settings set $(input1)$(input2)$(input3)`解决了多个输入控件的提交。
:::

## 引言

权限等级是游戏中规定玩家可以使用什么命令的一套机制。一方面，它可以有效防止玩家在游戏中做出越权行为；而另一方面，它又会对数据包开发造成一定程度的阻碍。开发者在编写命令的时候，有时需要考虑执行上下文是否满足权限等级的要求，进而选取相应的命令。在命令系统中，绝大多数命令需要的权限等级为2，这些命令构成了数据包开发的主体内容。然而在一些情况下，开发者希望对玩家关闭命令，即让玩家的权限等级为0，这样可以防止玩家任意执行命令对数据包或地图造成一定破坏。如果命令是在函数中执行的，函数的权限等级通常为2，能满足绝大多数命令执行的需求。如果涉及到玩家提交内容的操作，那就需要慎重考虑。以文本组件的`click_event`为例，玩家点击文本执行命令需要的文本组件片段为：

```snbt
{
  click_event:{
    action:"run_command",
    command:"<命令>"
  }
}
```

当玩家在聊天栏中执行点击事件时，执行者为玩家，执行位置为玩家所在的位置，执行权限等级为该玩家的权限等级。如果玩家的权限等级为0，那么`<命令>`中将不能使用任何权限等级大于0的命令。解决办法就是改用命令`/trigger`，这就需要开发者建立一个准则为`trigger`的记分项，并高频监听该记分项内的分数变动，从而建立记分板分数与实际所需命令的联系。

Java 1.21.6向数据包添加了对话框注册表，对话框也提供了玩家与命令、游戏数据之间的互动途径，比如静态操作中的`run_command`：

```json
{
  "action": {
    "command": "<命令>",
    "type": "minecraft:run_command"
  }
}
```

还有动态操作中的`dynamic/run_command`：

```json
{
  "action": {
    "template": "<带参数的命令>",
    "type": "minecraft:dynamic/run_command"
  }
}
```

这些上下文的权限等级都由触发点击事件的玩家决定，因此玩家权限等级为0时，也需要在这些片段中使用`/trigger`。现回顾命令`/trigger`的语法：

```mcfunction
trigger <objective>
trigger <objective> add <value>
trigger <objective> set <value>
```

在聊天栏中执行点击事件的情况比较简单，因为玩家每次只需提交一个数据即可，因此一个`/trigger`就能完全应对。而对于对话框来说，其中的输入控件不止一个，每个输入控件都会产生相应的待提交数据。操作按钮被使用的时候，这些数据会被同时一起提交上去，而`/trigger`的一个记分项一次只能提交一个分数`<value>`。而因为这个问题将一页的输入控件缩减为1个又不太现实。
<div style="text-align:center">
<img src="./对话框输入控件.png" alt="" style="zoom:50%;" />
</div>
<center style="color:gray;">
图1：具有多个输入控件的对话框。图中“模块1”、“模块2”、“模块3”均为输入控件，最下方3个按钮为提交操作，可接受来自上方三个输入控件的数据
</center>

有一个解决办法是，将部分提交数据放在记分项参数中。在`/trigger`的语法中，`<value>`可以容纳一个提交数据，`<objective>`也可以容纳提交数据，例如：

```json
{
  "action": {
    "template": "trigger tri$(input1) set $(input2)",
    "type": "minecraft:dynamic/run_command"
  }
}
```

其中的`$(input1)`和`$(input2)`均为模板参数，或称之为输入控件的对应键，他们可容纳来自输入控件对应键的真实值。此处`$(input2)`被传入了记分项分数，而`$(input1)`被传入了记分项名称，这就必须要遍历`$(input1)`所有可能值，建立所有可能会出现的记分项。当`$(input1)`的可能值不多的时候，这种方法也不算过于低效。如果`$(input1)`的可用值很多，甚至于出现了多于2个的输入控件键，且组合情况较多的，这种方法就显得有些繁琐了。因此迫切需要一种能有效容纳多个输入值的方法。为此，本研究提出了一种按位操作的方法，此举仅通过`/trigger`的分数`<value>`就能传输一页对话框的所有提交数据。

## 项目案例

本研究最初于AMR Bot数据包上进行，该项目由CR_019、Alumopper等开发。由于本文所述方法在AMR Bot上行之有效，故将其应用于跑酷地图《跃动晶界2》（Leap of Crystal Realm II）的制作。除非另有说明，本文的所有实例内容均基于此地图开发过程所用的数据包。本文撰写之时此地图尚未完成，因此内容可能与发布后实际内容有所差异。
<div style="text-align:center">
<img src="./项目案例对话框.png" alt="" style="zoom:50%;" />
</div>
<center style="color:gray;">
图2：《跃动晶界2》“设置”一项所用的对话框
</center>

该地图中有“设置”这一对话框，允许玩家在其中调整地图中音效、粒子、过场动画这些选项，此对话框类型为`multi_action`。每个选项均为`single_option`类型的输入控件，每个控件都有两个可用值：“开”与“关”。输入控件`inputs`字段的值如下：

```json
"inputs": [
  {
    "label": {
      "bold": true,
      "color": "black",
      "shadow_color": 0,
      "translate": "dialog.leap_of_crystal_realm.settings.sounds"
    },
    "key": "sounds",
    "options": [
      {
        "display": {
          "bold": true,
          "color": "dark_green",
          "shadow_color": 0,
          "translate": "options.on"
        },
        "id": "1"
      },
      {
        "display": {
          "bold": true,
          "color": "red",
          "shadow_color": 0,
          "translate": "options.off"
        },
        "id": "0"
      }
    ],
    "type": "minecraft:single_option"
  },
  {
    "label": {
      "bold": true,
      "color": "black",
      "shadow_color": 0,
      "translate": "dialog.leap_of_crystal_realm.settings.particle"
    },
    "key": "particle",
    "options": [
      {
        "display": {
          "bold": true,
          "color": "dark_green",
          "shadow_color": 0,
          "translate": "options.on"
        },
        "id": "1"
      },
      {
        "display": {
          "bold": true,
          "color": "red",
          "shadow_color": 0,
          "translate": "options.off"
        },
        "id": "0"
      }
    ],
    "type": "minecraft:single_option"
  },
  {
    "label": {
      "bold": true,
      "color": "black",
      "shadow_color": 0,
      "translate": "dialog.leap_of_crystal_realm.settings.animation"
    },
    "key": "animation",
    "options": [
      {
        "display": {
          "bold": true,
          "color": "dark_green",
          "shadow_color": 0,
          "translate": "options.on"
        },
        "id": "1"
      },
      {
        "display": {
          "bold": true,
          "color": "red",
          "shadow_color": 0,
          "translate": "options.off"
        },
        "id": "0"
      }
    ],
    "type": "minecraft:single_option"
  }
]
```

输入控件下方有两个操作按钮：“应用修改”和“取消修改并返回”。点击“应用修改”之后，游戏会将这3个数据存储至命令存储内以便地图其他板块调用。使用的命令存储为`leap_of_crystal_realm:main`，其中相应的字段如下：
<div class="nbttree">

<node type="compound" name=""/> 根标签

- <node type="compound" name="settings"/>此标签存储设置中的选项。
  - <node type="bool" name="sounds"/>声音是否开启。
  - <node type="bool" name="particle"/>粒子是否开启。
  - <node type="bool" name="animation"/>过场动画是否开启。

</div>

这个案例一共有3个需要输入的数据，下文会介绍将这3个数据整合到一条`/trigger`命令中的方法。

## 方法及原理

仔细观察命令模板，如“引言”一节中所述的将部分提交数据放在`<objective>`参数的方法，不难发现命令模板实际上就是将多个数据拼凑起来，形成一条能够执行的命令。如果将数据全部塞在分数`<value>`参数中，那就可以使用本研究所述的方法：按位操作及多进制编码。由于记分板分数是十进制的，这里的“多进制编码”在本文中实际为十进制。

下面先描述一下按位操作的概念：对于多个0或1的数据，不妨把它们拼成一个仅由0和1组成的数据串，如1011001，这样每一位都可以用作独立的存储空间，在整体上又可以视作一个唯一的二进制数值。按位运算的核心是数据中的每一个位，它允许开发者将一个完整的数值当作一组相互独立的布尔状态。

为此，开发者可以固定这串数据中每一位映射到一个特定的游戏实例。对本文的案例而言，可以使用3位的二进制数据，并规定：从右到左的第1位控制`sounds`（音效）、第2位控制`particle`（粒子）、第3位控制`animation`（过场动画）。例如，音效为开、粒子为关、过场动画为开的二进制数据可表示为`101`，音效为关、粒子为开、过场动画为开的二进制数据可表示为`110`。

不过，在这个情境中，每一位接受从0到9的数字，不一定必须为二进制的数字，可以是多进制编码。

于是，对话框定义中的“应用修改”操作按钮可以写成以下的形式：

```json
{
  "action": {
    "template":"trigger leap_of_crystal_realm.dialog.settings set $(animation)$(particle)$(sounds)",
    "type": "minecraft:dynamic/run_command"
  },
  "label": {
    "bold": true,
    "color": "black",
    "shadow_color": 0,
    "translate": "dialog.leap_of_crystal_realm.settings.apply"
  }
}
```

此处仅使用了`leap_of_crystal_realm.dialog.settings`这一个记分项，其准则为`trigger`。

玩家在设置对话框中做好相应调整、点击“应用修改”之后，其在`leap_of_crystal_realm.dialog.settings`上的分数就会被设为一个长度为3位、每一位上都是0或1的分数。Minecraft的命令系统并没有直接提供按位操作的运算方式。所有现在需要设计一定的算法处理这个数据。

在本案例中，输入的位数为3，这意味着全部的排列组合方式仅有$2\times2\times2=8$种，可以考虑穷举所有可能的设置组合。但为了后续能增添更多设置输入，这里不使用穷举的方法。

首先需要建立一个`tick`函数，高频检测`leap_of_crystal_realm.dialog.settings`分数，此函数相对于源文件而言所有删减：

```mcfunction
execute as @a unless score @s leap_of_crystal_realm.dialog.settings matches -1 run function leap_of_crystal_realm:dialog/settings/trigger
```

这里的条件子命令判断的是`leap_of_crystal_realm.dialog.settings`分数不为-1，-1被设为了这个分数的初始值。当3个输入都为0时，0也是一个有效数据，因此不能用作初始值。

接下来编写`leap_of_crystal_realm:dialog/settings/trigger`函数：

```mcfunction
#判断输入内容
scoreboard players operation #settings leap_of_crystal_realm.var = @s leap_of_crystal_realm.dialog.settings
scoreboard players set #bit leap_of_crystal_realm.var 0
function leap_of_crystal_realm:dialog/settings/bitwise/main

#重置分数
scoreboard players set @s leap_of_crystal_realm.dialog.settings -1
scoreboard players enable @s leap_of_crystal_realm.dialog.settings
```

现在数据已经被转换为`#settings`在`leap_of_crystal_realm.var`上的分数，对于每一种数据组合，这个分数都是唯一的。下面需要编写`leap_of_crystal_realm:dialog/settings/bitwise/main`函数提取对应数据上的每一位数字。

此处简要介绍一下这个函数的编写思路及其数学原理：对这个十进制的数据$N=(b_{2}b_{1}b_{0})_{10}$，其中$b_{i}\in \{0,1,2,3,4,5,6,7,8,9\}$。

则$N$可由$b_{i}$表示为
$$
N=b_{0}\cdot 10^{0}+b_{1}\cdot 10^{1}+b_{2}\cdot 10^{2}=\sum^{2}_{i=0}{b_{i}\cdot 10^{i}}
$$
先将$N$除以10，即
$$
\frac{N}{10}=\frac{b_{0}}{10}+b_{1}\cdot 10^{0}+b_{2}\cdot 10^{1}
$$
对$N$除以10并进行取模（`%=`）运算，上式中$\cfrac{b_{0}}{10}$为小数部分，取模结果为$b_{0}$，因此，除以10取模这一步操作即获取这个数据对应二进制的最右边一位。

整数部分是对$N$除以10取整的运算（`/=`），结果为
$$
N'=b_{1}\cdot 10^{0}+b_{2}\cdot 10^{1}
$$
这个即为对原数据$N$去掉了最右边一位的结果$(b_{2}b_{1})_{10}$。接下来只需要重复上述流程以从右向左依次提取各位上的数据，直到所有位都被提取完毕。所以，`leap_of_crystal_realm:dialog/settings/bitwise/main`需要是一个递归函数。

```mcfunction
#从低位到高位提取
scoreboard players operation #temp leap_of_crystal_realm.var = #settings leap_of_crystal_realm.var
scoreboard players operation #temp leap_of_crystal_realm.var %= #10 constant
scoreboard players operation #settings leap_of_crystal_realm.var /= #10 constant

#读取这一位的数据
function leap_of_crystal_realm:dialog/settings/bitwise/read

#读取下一位：
scoreboard players add #bit leap_of_crystal_realm.var 1
execute if score #bit leap_of_crystal_realm.var matches ..2 run function leap_of_crystal_realm:dialog/settings/bitwise/main
```

其中`#10`在`constant`上的分数为10，这是一个常量。`#bit`在`leap_of_crystal_realm.var`上的分数就是当前循环提取的位数，放在函数中用于控制递归终止，防止命令链长度超过`maxCommandChainLength`以对后续命令的执行造成影响。

函数`leap_of_crystal_realm:dialog/settings/bitwise/read`用于读取每个固定位上的数据从而存入命令存储：

```mcfunction
#第0位：声音
execute if score #bit leap_of_crystal_realm.var matches 0 store result storage leap_of_crystal_realm:main settings.sounds byte 1.0 run return run scoreboard players get #temp leap_of_crystal_realm.var
#第1位：粒子
execute if score #bit leap_of_crystal_realm.var matches 1 store result storage leap_of_crystal_realm:main settings.particle byte 1.0 run return run scoreboard players get #temp leap_of_crystal_realm.var
#第2位：过场动画
execute if score #bit leap_of_crystal_realm.var matches 2 store result storage leap_of_crystal_realm:main settings.animation byte 1.0 run return run scoreboard players get #temp leap_of_crystal_realm.var
```

至此，按位操作的整个系统已大致编写完毕。

本文案例中只有3个输入数据。如果增大输入数据的数量，当有$m$（$1\le m\le 9$，$m\in \mathbb{Z}^{+}$）个输入时，可以使用$m$位的十进制数据$N$。$N=(b_{m-1}b_{m-2}\cdots b_{1}b_{0})_{10}$，其中其中$b_{i}\in\{0,1,2,3,4,5,6,7,8,9\}$。则
$$
N=b_{0}\cdot 10^{0}+b_{1}\cdot 10^{1}+\cdots+b_{m-1}\cdot 10^{m-1}=\sum^{m-1}_{i=0}{b_{i}\cdot 10^{i}}
$$
将$N$除以10，即
$$
\frac{N}{10}=\frac{b_{0}}{10}+b_{1}\cdot 10^{0}+\cdots+b_{m-1}\cdot 10^{m-2}
$$
取模运算的结果为$b_{0}$，取整结果为$b_{1}\cdot 10^{0}+\cdots+b_{m-1}\cdot 10^{m-2}$，取整后的值
$$
N'=b_{1}\cdot 10^{0}+\cdots+b_{m-1}\cdot 10^{m-2}
$$
此即为对原数据$N$去掉了最右边一位的结果。对新数据重复上述过程，即可提取每一位的结果$b_{i}$。根据这个原理，函数`leap_of_crystal_realm:dialog/settings/bitwise/read`的内容可以为

```mcfunction
#从低位到高位提取
scoreboard players operation #temp leap_of_crystal_realm.var = #settings leap_of_crystal_realm.var
scoreboard players operation #temp leap_of_crystal_realm.var %= 10 constant
scoreboard players operation #settings leap_of_crystal_realm.var /= 10 constant

#读取这一位的数据
function leap_of_crystal_realm:dialog/settings/bitwise/read

#读取下一位：
scoreboard players add #bit leap_of_crystal_realm.var 1
execute if score #bit leap_of_crystal_realm.var matches ..<m-1> run function leap_of_crystal_realm:dialog/settings/bitwise/main
```

注意函数中的`<m-1>`，这个参数即为上文中的$m-1$，$m-1$即为防止溢出`maxCommandChainLength`所用的位数递归限制。对于规定范围内任意的$m$值，都可以用上述函数提取各位上的数据。

## 展望与不足

上文规定了$m$这个参数的限制：$m$只能是介于1到9（包含端点）之间的整数，这是因为记分板分数分数使用32位有符号整数，其上限为2147483647（$2^{32}-1$），伪二进制或多进制数据存入准则为`trigger`的记分板时，会占用2147483647这个数字的位数，虽然2147483647有10位，能完整使用0~9之间数字的位数只有右边9位，如果使用第10位，这一位严格意义上只能容纳0和1两个值，为2时会对每一位的最大可用值有所限制。反映到对话框上，就是一页最多能包含10个输入控件，为使按位操作正常工作，其中必须有1个控件只能包含两个可用值，包含3个时会对其他控件的可用值数量作出限制，且这个控件使用的位置为第10位。

因为数值$N$每一位最多也只能容纳0到9（包含端点）的整数，因此对话框一个输入控件最多只能接受10个可用的真实值。`boolean`类型输入控件的可用真实值总是只有两个，可不作限制；`number_range`和`single_option`类型的输入控件必须把它们的可用真实值数量严格限定在10个及以内；`text`类型的输入控件不可控，故本研究方法并不能用于这种输入控件。

此外，记分板分数支持有符号整数，而本文所述的方法并没有使用负数。负数需要在数字前添加一个`-`，这其实也可以作为一个输入控件使用的真实值传入命令模板种，从而添加一个可用的输入控件。但这个输入控件只能支持2个可用值，需要为正数时，该控件的真实值应为空`"id": ""`。但是使用负数会有一个问题：数字部分为0时，正数的0和带`-`的0会产生冲突，此冲突必须考虑。

可以看到，本研究方法虽然省略了完全穷举或部分穷举的过程，但它仍然对对话框内输入控件的数量和每个输入控件可用值数量作了限制，且它完全不支持`text`类型的输入控件。超出这个范围的依旧需要穷举记分项名称。未来的研究方向可以是穷举与按位操作的结合。

## 致谢

[皮革剑](https://space.bilibili.com/2127740148?spm_id_from=333.1387.follow.user_card.click)为本研究提供了数学计算依据及原始代码。

## 参考文献

[1] <https://zh.minecraft.wiki/w/%E5%AF%B9%E8%AF%9D%E6%A1%86%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F>

[2] <https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/trigger>

[3] <https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6>

[4] <https://www.cnblogs.com/LuckyWinty/p/7050510.html>
