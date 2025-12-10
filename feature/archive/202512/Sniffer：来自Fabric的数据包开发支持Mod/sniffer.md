<FeatureHead
    title = 'Sniffer: 来自Fabric的数据包开发支持Mod'
    authorName = Alumopper
    avatarUrl = '../../_authors/alumopper.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/280394409' },
        { name: 'GitHub', url: 'https://github.com/Alumopper' }
    ]"
    resourceLink = 'https://github.com/mcbookshelf/sniffer'
    cover='911f22c9710946624cc42a4fc3436ace.png'
/>

数据包开发者使用最多的命令是什么？`scoreboard`？ `execute`？`data`？还是`function`？什么叫做使用最多的是`say`和`tellraw`？

试想一下，假设你的数据包遇到了问题，比如说，没有执行到某个命令，比如说某个过程量可能有问题，那你会怎么做呢？`say hi`或者`say 123`之类的，想必大部分数据包作者都干过。如果你还写过Java之类的，你会注意到Java调试bug更多用的是断点，而不是每次都更改一下代码的内容然后不停的编译运行编译运行——效率太低了。

所以，为什么不让数据包的开发也能享受到断点调试的便利呢？

这就是Sniffer的前身，Datapack-Debugger。Datapack-Debugger提供了基本的游戏内断点调试的功能，而后bookshelf的theo接手了此项目，并为其添加了vscode支持，于是得到了现在的Sniffer。在经过我的两次修补和更新贡献后，Sniffer已经成为了功能丰富的数据包调试mod，直击数据包开发者调试过程中的痛点。

# Sniffer

Sniffer是一个基于Fabric的数据包开发辅助mod，配合VSCode插件，除了实现最基本的断点调试功能外，还提供了调试命令、热重载、溢出警告等功能。

Sniffer旨在，不破坏原有数据包的情况下，最大程度地为数据包开发添加各种便利功能。

Sniffer需要前置Mod：cloth-config和fabric-api。

目前仅支持1.21.10，但是适配其他版本应该不是很大的难事喵（

## 断点调试

作为这个Mod最基本也是最招牌的功能，断点调试自然是首先介绍的啦。

有两种方法可以启用断点。一种是在VSCode插件的支持下设置，一种是手动在函数文件中写断点命令。

不过，不管怎么样，首先得打开游戏，进入存档，然后还得有一个数据包。

### VSCode支持

Sniffer的插件现在并没有直接发布在插件市场，所以你需要从这里手动下载然后安装给VSCode。

随后，你需要在工作区根目录的`.vscode`文件夹下创建一个`launch.json`文件，内容如下：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "sniffer",
      "request": "attach",
      "name": "Connect to Minecraft",
      "address": "ws://localhost:25599/dap"
    }
  ]
}
```

随后，点击调试按钮，或者按`F5`键，VSCode就会尝试连接到Minecraft。如果连接成功，游戏的聊天栏里面会输出信息，并且你能看到VSCode也进入了调试状态。现在，你就可以开始断点调试啦！点击代码区域左侧即可设置断点，就像你在其他任何语言开发时候使用断点一样，然后当函数运行到这个地方的时候，断点就会触发，游戏会被冻结，你可以在这个时候执行步进等来一行行执行命令，观察命令的执行过程以及中间过程量的值。

![alt text](911f22c9710946624cc42a4fc3436ace.png)

### 无插件

如果不想使用插件，或者在使用VSCode以外的文本编辑器，你可以使用手动插入断点命令的方式在数据包中设置断点。在你想要触发断点的地方插入一行`#!breakpoint`，即可在函数运行到这个地方时触发断点。之后，你就可以在游戏中执行Sniffer提供的命令，来控制命令的执行。

Sniffer提供了如下和断点调试相关的命令：

* `breakpoint continue`：在触发断点后，解除冻结状态继续执行
* `breakpoint step`：在触发断点后，执行下一条命令并保持冻结状态（逐步）
* `breakpoint step_over`：在触发断点后，执行当前函数的下一条命令并保持冻结状态（逐过程）
* `breakpoint step_out`：在触发断点后，一直执行到函数返回并保持冻结状态（逐出）

在游戏处于断点状态下时，你仍然可以通过聊天栏执行任何命令并观察命令的返回，从而获取命令执行过程中的任何过程量。

## 调试命令行

在数据包中，`#`开头的一行会被识别为注释，而在Sniffer中，基于此进一步添加了调试命令行。

使用`#!`开头的一行命令会被识别为**调试命令行**。在安装Sniffer后，调试命令行会被当作普通命令去执行，而不安装Sniffer时，则会被游戏直接当作注释忽略。所以，调试命令行提供了一种非破坏性的在数据包中使用Sniffer特有的调试命令的方式。还记得之前不用插件使用断点调试的方法嘛，我们在命令中插入`#!breakpoint`，其实就是使用了调试命令行哦，只有在安装了Sniffer的情况下这里才会被认为是一个断点，而原版游戏则会直接把它当作注释忽略掉，所以不会对数据包发布后的使用产生任何的影响，除非用户也安装了Sniffer（

调试命令行可以执行任何命令，所以我们可以实现一些很有趣的东西，比如条件断点：

```mcfunction
say 1
#! execute if score @s test_score matches 0 run breakpoint
say 2
```

没错喵，既然`breakpoint`本身是一个命令，它当然可以结合`execute`使用来实现条件断点。在这里，只有当执行者的`test_score`的值为0时，才会触发断点，否则游戏会继续执行。

## Assert

当你想要确定函数运行到某个位置，过程量的值是不是符合预期时，你可能就会需要`assert`命令。

`assert`命令的格式为`assert <条件>`。当条件的返回值不是`true`或者`0b`时，游戏则会输出一条错误信息，同时输出函数的调用栈。

栗子：

```mcfunction
say 1
say 2
say 3

#!assert {(score @s test ) <= 10}
say 4
say 5
```

其中这个条件参数可是大有玄机，它其实是一个以`{}`包裹的表达式，而在这个表达式中，又可以获取一些数据，并且对它们进行一些基本的计算。使用`()`包裹的算式来获取一个NBT或者计分板等数据，而括号内的格式和`execute if`子命令后的格式非常相似。现在，Sniffer共支持获取以下数据：

* `score <score_holder> <objective>` 获取`holder`在计分板`objective`中的值。返回`int`类型的nbt。
* `data (entity <selector>/storage <id>/block <pos>) <path>` 获取指定的NBT数据。返回对应类型的nbt值。
* `name <entity>` 获取指定实体的名字。返回一个文本组件。

:::warning 缺陷
由于技术原因，`)`在命令系统中会被解析为一个合法NBT路径的一部分，因此诸如`(data storage io test)`这样的表达式会因为末尾的`)`被解析为NBT路径，导致解析错误。目前临时的解决办法是，在末尾括号前添加一个空格：`(data storage io test )`，虽然看起来很丑，但是确实是目前最简单有效的办法了（如果觉得不好看可以在前面也加一个空格`( data storage io test )`（x）
:::

在获取到数据以后，Sniffer还支持对这些数据进行一些基本的运算，而有哪些运算呢？

目前Sniffer支持的运算符有：

* `+`, `-`, `*`, `/`, `%`: 基本的数学运算符
* `==`, `!=`, `<`, `<=`, `>`, `>=`: 比较运算符
* `&&`, `||`, `!`: 用于布尔值的逻辑运算符
* `is`: 检测一个值是不是指定的类型。返回一个布尔NBT。可以使用的类型有: `nbt`, `text`, `string`, `number`, `byte`, `short`, `int`, `long`, `float`, `double`, `int_array`, `long_array`,` byte_array`, `list`, `compound`

![alt text](9baee370194fcb86c01471d0521172ac.png)

:::note 注意
在Sniffer的表达式中没有运算优先级——处于命令系统的限制以及简化解析过程，Sniffer永远会从左到右完成表达式的计算。如果想要优先计算某些值，在表达式内嵌套表达式，例如`{a + {b * c}}`这样的形式
:::

## Log

基于表达式，Log命令提供了比`tellraw`命令更简便更丰富的调试输出方式。

其格式为`log <内容>`。log可以是包含表达式的文本或者任意纯文本。

栗子：

```mcfunction
say 1
say 2
say 3

#!log The score of @s in test objective is {(score @s test )}
say 4
say 5
```

比如说，命令执行者的`test`计分板中的值是10，那么这个命令执行后，会在聊天栏输出：`The score of @s in test objective is 10`。

这个例子相信大家一看就懂，这里就不过多赘述啦。

![alt text](273816be46e8cb49bd342bf9d60f1fd7.png)

![alt text](0a2acc45e3911c3953df7871b1c28458.png)

## Jvmtimer

Sniffer提供了一种简易的基于`System.nanoTime()`方法的命令性能测试工具。其命令格式如下：

* `jvmtimer start <id>`：启动指定id的计时器。
* `jvmtimer end <id>`：停止指定id的计时器。结果将会保存至游戏中，多次运行以获得更准确的平均结果。
* `jvmtimer get <id>`：获取指定id的计时器的结果。
* `jvmtimer reset <id>`：清除指定id的计时器的结果，并将其状态重置。
* `jvmtimer disable <id>`：禁用指定id的计时器。

例如，我们要测试一段命令执行所花费的时间，可以这样：

```mcfunction
#!jvmtimer start test
say 1
say 2
function test:test
#!jvmtimer end test
```

在反复运行多次以后（通常是用tick运行数百次），使用`jvmtimer get test`命令，即可获得该计时器的结果。

![alt text](9311d455ea5dafcd1fb99a4698dd1a86.png)

如果在一个tick结束后，计时器仍然没有被停止，并且在下一个tick这个计时器被重复启动，Sniffer会认为这个计时器发生了泄露，并将其禁用。需要在确认计时器被正确终止后，使用`jvmtimer reset test`命令来重置计时器。

## 热重载

对任何数据包开发者来说，相信每天少不了的事情就是`reload`，不停的`reload`。发现bug，在这里加一个`say hi`，然后`reload`，修好后删掉在`reload`，然后发现还是有问题，又添加一个`say hi`，然后`reload`。要说在聊天栏运行最多次的命令，`reload`大概能保二争一。

对于小项目来说，重载数据包花费不了什么时间，但是对于比较大型的项目，`reload`可能就会让游戏卡上那么一两秒，甚至好几秒。每次都要等上那么几秒，着实让人有些着急。而且每次在`reload`执行完毕以后，带有`load`标签的命令都会被重新执行一次，有时候也会比较烦人。

所以，Sniffer提供了一种热重载数据包中函数文件的办法。在开启对数据包文件夹的监视之后，无需重载数据包，Sniffer即可将改动快速应用到游戏中。

使用Watcher命令来控制Sniffer的数据包监视器。其格式如下：

* `watch start <数据包文件夹名>`：开始监控指定文件夹下的所有有效命令函数文件（路径正确，能被解析为有效命名空间）
* `watch stop <数据包文件夹名>`：停止监控指定文件夹
* `watch reload`：进行一次热重载，立刻应用所有监视器监视到的改动
* `watch auto [true|false]`：设置是否开启自动热重载。开启以后，只要监视器发现文件改动，就会立刻尝试应用更改，否则需要手动执行`watch reload`命令。

每一次热重载完成，都会在聊天栏输出一个提示信息。如果在尝试应用热重载时遇到了问题，例如函数文件的命令格式解析错误，Sniffer会在日志输出一个错误信息，并放弃应用本次修改。

![alt text](1c7f5660d08f0c189c5baa8aae83f804.png)

:::warning 已知的问题
目前监视器无法监视子包中函数文件的改动，也无法监视json文件的改动。

当处于断点状态下，并且执行位置在宏函数中时，对宏函数的改动将不会影响到当前正在执行的被解析过的宏函数。
:::

<ColorLine/>

## 未来特性

:::note 未发布的特性
这些特性已经被推送，但尚未被主分支合并，或者仍然再开发中
:::

### VSCode 表达式计算

Sniffer的VSCode插件支持在VSCode调试栏的表达式计算界面中，输入一个和`assert`和`log`中表达式格式一样的表达式，并返回一个计算结果。在调试逐步执行的过程中，这个值会被即时计算实时更新。简便起见，在VSCode中输入的表达式可以不包含首尾的括号。

![alt text](01bdf286a45e2888f08a7ca43aa56948.png)

<ColorLine/>

目前Sniffer还处于开发阶段，如果在使用过程中遇到任何问题，欢迎在仓库中提出Issue哦~

Happy debugging!
