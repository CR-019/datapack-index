---
title: 'MCFPP：面向 Minecraft 数据包的高级编程语言'
---

<FeaturedHead
  title="MCFPP：面向 Minecraft 数据包的高级编程语言"
  authorName="Alumopper"
  resourceLink="https://github.com/MinecraftFunctionPlusPlus/MCFPP"
/>

MCFPP 将变量、函数和数据结构引入 Minecraft 数据包开发。开发者可以用简单易读的代码设计地图流程、实现玩法功能，并随着项目扩展保持清晰的代码组织。编译器会将这些代码转换为 Minecraft 能够运行的数据包。同时，MCFPP 支持直接嵌入原版命令，已有的命令片段可以继续用于新的项目。

MCFPP 0.1.0 现已发布。作为 MCFPP 的首个测试版本，该版本包含了语言编译器、标准库、命令行工具和工程模板等基本功能，面向数据包开发者开放试用。

MCFPP 0.1.0 本次开放测试的主要内容包括：

- **玩法逻辑编写**：支持整数、小数、条件判断、循环，以及带参数和返回值的函数。
- **数据与功能复用**：用 `data` 组织相关属性，将常用代码封装为库。
- **Minecraft 数据交互**：直接使用原版命令，读取和修改记分板与 NBT 数据。
- **项目开发工具**：通过命令行工具创建工程、管理依赖，并按指定 Minecraft 版本生成数据包；在 IntelliJ IDEA 中通过 MCFPP 插件获得代码补全、错误提示等支持。

> [!NOTE]
> [项目仓库](https://github.com/MinecraftFunctionPlusPlus/MCFPP) · [使用文档](https://www.mcfpp.top)

## 围绕玩法组织代码

数据包中的一条玩法规则，往往包含计算、判断和执行效果几个步骤。MCFPP 可以将这些步骤写在同一个函数中，并通过参数传入所需数据。

例如，按击杀数计算奖励积分，达到 100 分时发放一颗钻石：

```mcfpp
func reward(kills: int) {
    var points = kills * 5 + 10

    if (points >= 100) {
        /give @s minecraft:diamond 1
        /tellraw @s {"text":"获得一颗钻石！","color":"gold"}
    }
}
```

以玩家为执行者调用这个函数时，奖励计算、领取条件和命令效果会按代码中的顺序执行。计算规则与对应效果集中在一起，便于调整奖励数值，也便于在多个关卡中复用。

这也是 MCFPP 的基本设计思路：让开发者能专注于逻辑和玩法实现，而无需考虑更多的mcfunction代码组织和结构问题。在 mcfunction 中需要被拆分为多个碎片小文件的逻辑，在 MCFPP 中可以通过同一个函数中的几行简单代码实现。

## 语法简介

>[!NOTE]
> 如果你有其他高级语言，例如 Kotlin、Rust、Java、Typescript 等，的开发经验，你多半能对 MCFPP 的大部分语法感到熟悉owo

MCFPP 使用大括号 `{}` 组织代码块，通常每行写一条语句，也可以使用分号分隔。普通注释以 `//` 开头，用来记录代码的用途。下面从变量开始，介绍编写玩法时最常用的几种写法。

### 变量与运算

变量用于给数据起一个名字，方便在后续计算中读取和修改。`var` 声明变量，`const` 声明常量。

```mcfpp
func prepareReward() {
    const base = 10       // 基础奖励
    var bonus: int = 20   // 额外奖励

    bonus += 5
    var total = base + bonus
}
```

`bonus: int` 表示这个变量保存整数；`total` 的类型则由编译器根据右侧的计算结果确定。常见的数据类型包括：

| 类型 | 表示的数据 | 示例 |
| --- | --- | --- |
| `int` | 整数，适合积分、等级和次数 | `20` |
| `float` | 小数，适合倍率和带小数的数值 | `1.5` |
| `bool` | 条件是否成立 | `true`、`false` |
| `string` | 文本，适合名称和提示内容 | `"森林试炼"` |
| `nbt` | Minecraft 中的 NBT 数据 | `{a: 1, b: "qwq"}` |

可以直接使用 `+`、`-`、`*`、`/` 和 `%` 进行变量之间的运算。对于数值变量来说，这些运算符分别表示加、减、乘、除和取余。`bonus += 5` 表示在原值上加 5，类似的写法还有 `-=`、`*=`、`/=` 和 `%=`。

### 条件判断与循环

`if` 根据条件选择要执行的代码，`else if` 和 `else` 用来安排其他分支。例如，为不同积分区间显示结算结果：

```mcfpp
func announceResult(points: int) {
    if (points >= 100) {
        /say 达成金牌评价
    } else if (points >= 50) {
        /say 达成银牌评价
    } else {
        /say 挑战完成
    }
}
```

比较时可以使用 `==`、`!=`、`>`、`<`、`>=` 和 `<=`。多个条件可以通过 `&&`（同时成立）和 `||`（至少一个成立）组合，`!` 用于将条件取反。

重复执行一段逻辑时，可以使用 `while`。下面的函数会在调用位置生成三只僵尸：

```mcfpp
func summonTargets() {
    var count = 0
    while (count < 3) {
        /summon minecraft:zombie ~ ~ ~
        count += 1
    }
}
```

每轮执行后，`count` 增加 1；达到 3 时，循环结束。这里的三次生成会在一次函数调用中连续完成。需要按游戏刻推进的刷怪或倒计时流程，可以结合 tick 函数或原版 `schedule` 安排。

### 函数、参数与返回值

`func` 用来声明函数。参数写在圆括号中，用于接收调用时传入的数据；函数名和参数之后的 `: int` 表示返回一个整数，`return` 用来给出结果。

```mcfpp
func calculateReward(kills: int): int {
    return kills * 5 + 10
}

func previewReward() {
    var points = calculateReward(8) // 计算结果为 50
}
```

`calculateReward` 只负责计算奖励，调用它的代码可以继续用结果判断奖励档位、更新积分或显示提示。只执行效果的函数，如前面的 `summonTargets`，可以省略返回类型。

把重复出现的计算和效果提取为函数后，同一套规则就能在多个关卡中使用。修改计算公式时，各个调用位置也会随之采用新的规则。

### 数据结构与方法

`data` 用于描述一组相关的数据及其操作。技能等级、伤害和冷却时间可以放在同一个结构中，并添加计算伤害的方法：

```mcfpp
data Skill {
    var level: int = 1
    var damage: int = 10
    var cooldown: int = 20

    constructor(level: int) {
        this.level = level
    }

    func getDamage(): int {
        return this.damage * this.level
    }
}
                                                       
func useSkill() {
    var fireball = Skill(3)
    var damage = fireball.getDamage()
}
```

这里的 `Skill(3)` 创建了一份等级为 3 的技能数据，`constructor` 负责设置初始等级。`this` 指向当前这份技能数据，`fireball.getDamage()` 则调用其中的方法，得到 30 点伤害。

同一种数据结构可以创建多份数据，分别记录不同技能的属性。装备、任务和关卡状态也可以采用这种方式组织，让数据与相关逻辑集中维护。

## 与原版命令配合

MCFPP 中以 `/` 开头的一行就是原版命令。选择器、粒子、音效、实体生成等数据包开发者更加熟悉的写法，可以直接放进函数、条件判断和循环中。已有的命令片段也可以整理成 MCFPP 函数，逐步加入参数和计算逻辑。

命令中还可以通过 `${变量名}` 插入 MCFPP 的值。例如，将关卡名称写入提示：

```mcfpp
func announceStage() {
    const stageName = "森林试炼"
    /say 正在进入：${stageName}
}
```

命令中的 `@s`、相对坐标等仍然沿用原版含义：`@s` 指向当前执行者，`~ ~ ~` 使用当前执行位置。编写奖励、传送或生成实体等功能时，可以沿用原版 `execute` 对执行者和位置的安排。

记分板与 NBT 数据同样可以参与 MCFPP 程序。通过对应的读写接口，代码可以获取游戏中的数值、完成计算，再将结果写回。这使 MCFPP 编写的逻辑能够与数据包已有的数据配合使用。

项目配置还可以指定目标 Minecraft 版本，编译器会选择对应版本的标准库。需要针对不同版本采用不同写法时，可以在源码中设置版本条件，让编译器选取相应的内容。

## 项目组织与开发工具

当项目扩展到多个文件时，可以通过命名空间和 `import` 组织代码。常用函数与数据结构还可以打包为库，通过项目依赖引入，让奖励计算、数据处理等公共功能在不同地图或小游戏中共享。

配套的 IntelliJ IDEA 插件提供代码补全、错误提示、跳转定义、重命名和格式化功能，帮助开发者阅读和维护项目。

## 获取与使用

0.1.0 提供 ZIP 和 TAR.XZ 发行包，运行环境为 JDK 25。按照发行包中的安装说明配置环境后，执行以下命令即可创建并编译示例工程：

```shell
mcfpp init hello
cd hello
mcfpp build
```

对于 Windows 开发者，也可以使用 [Chocolatey](https://community.chocolatey.org/) 进行安装

```shell
choco install mcfpp -y
```

>[!NOTE]
> 截至本文完成的时候，Chocolatey 仓库尚未将 MCFPP 包审核完毕，暂时无法使用 choco 进行安装。但是总之，你现在可以试试。

生成的数据包位于 `build/hello`。将这个目录复制到对应版本存档的 `datapacks` 文件夹，执行 `/reload`，再通过 `/function hello:main` 调用示例入口。源码位于 `src/main/mcfpp`，修改后再次运行 `mcfpp build`，即可生成更新后的数据包。

完整的安装步骤随发行包提供，更多语法和使用方式可以查阅 [MCFPP 文档](https://www.mcfpp.top)。

## 参与测试与反馈

0.1.0 开启了 MCFPP 的公开测试。后续改进将结合实际数据包项目中的使用反馈，继续完善语言、标准库和开发工具。欢迎通过 [GitHub Issues](https://github.com/MinecraftFunctionPlusPlus/MCFPP/issues) 提交问题与建议，也欢迎分享使用 MCFPP 编写的功能和项目。
