---
title: 'Katton —— 轻量级可重载 Mod 框架'
---

<FeatureHead
    title='Katton —— 轻量级可重载 Mod 框架'
    authorName='Alumopper'
    resourceLink = 'https://github.com/Alumopper/Katton'
/>

:::danger 不这并不香草！
Katton 是一个基于 Fabric 和 NeoForge 的 **模组**，并不是原版内容，其支持的开发内容也非原版，借助 Katton 开发的内容无法在不安装 Katton 的环境中使用。
:::

## 简介
![alt text](image.png)
### 什么是Katton？

Katton 是一个轻量级的可热重载 Mod 开发框架。借助 Kotlin Script 的便利性和IDEA支持的先天优势，Katton 可以为开发者提供一个快速、灵活且工具链完善的开发环境。依赖 Kotlin Script 的动态编译和 JVM 交互特性，Katton 允许开发者在不重启游戏的情况下修改和测试 Mod 代码，大大提升了开发效率。

Katton 同时支持 Fabric 和 NeoForge 两大 Mod 加载器，并在两个平台中提供了尽可能一致的 API。

:::warning 早期开发阶段
Katton 目前处于早期开发阶段，功能尚不完善，API 可能会有较大变动，且存在不少 Bug。建议仅供有兴趣的开发者参考和试用。
:::

### 为什么选择Katton？

* **易用**：Katton 直观的 API 和热重载功能让各水平的模组开发者都能快速创建和测试他们的模组。
* **灵活**：借助 Kotlin 的强大功能，你可以创建与 Minecraft 交互的复杂模组。
* **高性能**：Katton 使用 Kotlin 脚本在 Minecraft 运行时直接与 Java 对象交互，确保高性能和无缝集成。
* **强大的 API**：Katton 提供了全面的 API，允许你访问和修改游戏的各个方面，从方块和物品到实体和世界生成，甚至包括类似 Mixin 的代码注入，并且全部支持热重载。

## 简单的开始

### 环境配置

Katton 仅支持 **Minecraft 26.1** 及以上版本，需要 **Java 25** 或更高版本。

我们推荐使用 **IntelliJ IDEA** 进行开发，因为它对 Kotlin 和 Minecraft 模组开发有最好的支持。你也可以使用其他支持 Kotlin 的 IDE，但可能需要手动配置。

Katton 会编译并执行所有数据包中的 Kotlin 脚本，因此你的项目结构应遵循标准的 Minecraft 数据包格式。同时，我们建议使用 Gradle 或 Maven 等构建工具来管理依赖。要构建一个Katton工程，最简单的办法是把 Katton Example 仓库复制到本地并在 IDE 中打开它。这个示例项目已经配置好所有必要的依赖和设置，等 IDE 加载完毕后就可以立即开始进行开发。

### 创建你的第一个 Katton 脚本

虽然我们称之为"Kotlin 脚本"，但它们实际上是以 `.kt` 而非 `.kts` 结尾的普通 Kotlin 文件，这样能获得更好的 IDE 支持。在你的命名空间文件夹下，创建一个名为 scripts 的新目录。Katton 会自动编译并执行此目录中的所有 `.kt` 文件。

如果你使用的是示例项目，记得将必要的依赖 jar 复制到 libs 文件夹，包括 Minecraft jar（可以在你的 .minecraft 目录的 version 文件夹中找到），以及 Katton 模组自身的 jar 文件。你也可以复制任何其他你想在脚本中使用的模组 jar。示例项目已经在Gradle中配置好依赖导入，这些libs中的 jar 文件将用于在 IDE 中提供代码补全和类型检查。

作为你的第一个脚本，我们将在玩家加入游戏时向他们发送一条"Hello Katton"消息。在 `scripts` 目录中创建一个名为 `hello.kt` 的文件，内容如下：

```kotlin
// 脚本所需的import
import net.minecraft.network.chat.Component
import top.katton.api.event.ServerPlayerEvent
import top.katton.api.event.PlayerArg

// main 函数是脚本的入口。当然，不一定非要是叫做main，毕竟是我们手动调用的，没有规定哦
fun main(){
    // 注册一个事件监听器，当玩家加入服务器时触发
    ServerPlayerEvent.onPlayerJoin += onJoin@
    fun(arg: PlayerArg){
        // 获取加入的玩家并向其发送消息
        val player = arg.player
        // 和你在普通模组中做的一样
        player.sendSystemMessage(Component.literal("Hello Katton"))
    }
}

// 它将被调用以执行 main 函数
@Suppress("unused")
val entryPoint = main()
```

当你进入的时候，你应该会在聊天中看到一条"Hello Katton"消息。好耶，你刚刚用 Katton 创建了你的第一个脚本模组！

将 hello.kt 中的消息更改为其他内容，保存文件，然后使用 reload 命令，当你再次加入时，你应该会看到新消息。无需重启游戏就可以进行修改，和数据包一样灵活喵。

### 调试

Ktton 支持通过 JVM 远程调试来调试数据包 Kotlin 脚本。

1. 添加如下 JVM 参数启动 Minecraft：
```text
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```
2. 在 IntelliJ IDEA 中，创建一个 Attach to remote JVM 运行配置，并连接到相同的主机和端口。
3. 在实际的数据包脚本文件中设置断点（例如，`data/<namespace>/scripts/*.kt`）。
4. 使用 IDE 自带的调试工具来调试你的脚本。

## 数据包作者也要爽写！

Katton 不仅适用于模组开发者，也适合饱受 Mojang 命令之苦的数据包开发者们。Katton 的轻量级和灵活的热重载特性让它非常适合用于地图之类的开发。接下来是一个快速入门，让数据包作者们也能享受 Katton 的便利。

### 命令封装

Katton API 开发时的第一步工作其实就是将所有命令的功能都封装为了简单的 Kotlin 函数，就是为了让数据包作者们即使不熟悉 Mod 的 API 也能快速的上手开发，至少能实现在数据包开发中能实现的功能。就拿我们最常用的记分板操作来说，在 Katton 中它是这样的：

```kotlin
import top.katton.api.dpcaller.getOrCreateObjective
import top.katton.api.dpcaller.setScore

fun scoreboardExampleMain(){
    // 获取计分板对象
    val obj = getOrCreateObjective("myscore")
    // 将 "test" 的分数设置为 100
    setScore("test", obj, 100)
    // 以上代码等价于命令中的
    // scoreboard players set test myscore 100
}

// 别忘了执行函数
val scoreboardExampleMain = scoreboardExampleMain()
```

是不是很简单呢？

### 目标选择器

在数据包的命令开发中我们也会经常用到目标选择器，当然在 Katton 中也对其进行了封装。不过，会比刚刚的例子稍微复杂那么一点。总之先来看看例子吧！

```kotlin
import net.minecraft.world.effect.MobEffects
import net.minecraft.world.entity.EntityType
import net.minecraft.world.entity.LivingEntity
import net.minecraft.world.phys.Vec3
import top.katton.api.dpcaller.addEffect
import top.katton.api.requireServer
import top.katton.util.EntitySelectorBuilder

fun targetSelectorExample(){

    // 构建目标选择器
    val selector = EntitySelectorBuilder.allEntities()  //@e
        .type(EntityType.CREEPER)       //type = creeper
        .tag("qwq", false)              //tag = qwq
        .distanceBelow(16.0)            //distance = ..16
        .create()
    // 于是我们就得到了一个这样的目标选择器：@e[type=creeper,tag=qwq,distance=..16]

    // 然后我们需要构建一个命令上下文，用于目标选择器选定实体
    val source = requireServer().createCommandSourceStack()
        .withLevel(requireServer().overworld())     // 设置维度
        .withPosition(Vec3(50.0, 70.0, 50.0))       // 设置位置

    // 获取选择器选中的实体
    val entities = selector.findEntities(source)

    // 一旦你获得了实体的引用，你就可以在代码的任何地方访问这些实体
    for (entity in entities) {
        if(entity is LivingEntity){
            // 给实体添加一些状态效果
            addEffect(entity,
                MobEffects.GLOWING, // 效果
                200,    // 效果持续时间（**tick**）
                0,      // 效果等级
                false,  // 是否显示粒子
                false   // 是否显示图标
            )
        }
    }
}

// 记得调用函数
val targetSelectorExample = targetSelectorExample()
```

唔……看起来有点麻烦？不管是创建目标选择器还是获取实体都需要写好多代码。但是——不要被数据包思维带偏啦，你在这里声明的任何变量都可以直接在后续的代码中继续使用，同时你获取到实体以后，也可以继续在后续的代码中访问，不像在数据包中一样，需要不断的重复写目标选择器，重复的选择实体，造成大量的性能浪费。

### 爆炸箭！

接下来我们看一个更复杂的例子喵，就用每个数据包作者刚刚入门的时候大概都写过的，爆炸箭~

首先我们需要知道事件系统的概念。事件用于在特定的游戏事件发生时触发代码执行。比如说，数据包中常用的`load`和`tick`标签，在 Katton 中被定义为了事件。

我们回顾一下，一般来说一个简单的爆炸箭是怎么实现的。首先，我们需要做一个简单的限制，比如说当玩家拿着`{tnt:true}`的弓的时候，才能射出爆炸箭，不然会乱套的。然后，当玩家射箭的时候，我们会给射出的箭做一个标记，一般是用标签（`tag`），当带有这个标签的箭击中地面或者说方块后，通过召唤 TNT 等方式，造成一场大爆炸！

那按照这个思路，我们尝试着在 Katton 中也实现一下吧。

先实现给玩家射出的箭打上标记。我们不用去每个 tick 检查一下记分板什么的（当然你也可以继续这样做，当然是支持的喵，只是我们现在有更简单的实现），因为 Katton 提供了一个叫作 `onAfterEntityLoad` 的事件，会在一个实体被创建的时候（被加载到世界的时候）触发。因此，我们可以这样写：

```kotlin
fun main(){
    // 当实体加载时执行
    // 用这样的方式，我们可以订阅一个事件！
    ServerEntityEvent.onAfterEntityLoad += load@
    fun(arg: EntityLoadArg) {   // 事件触发的时候，会将参数传入这个函数
        val (entity, _) = arg   // 参数中包含了实体加载时候的信息，比如——被加载的实体
        if (entity !is Arrow) return    // 被加载的实体是箭，我们才继续执行
        // 如果玩家射出一支箭，检查手持弓的数据
        val owner = entity.owner    // 可以检查箭的来源是谁
        if (owner is ServerPlayer) {    // 只有玩家能射出爆炸箭
            onArrowShot(owner, entity)  // 我们将会在这个函数中对玩家的弓进行检查，以及对箭进行标记
        }
    }
}
```

接下来，我们实现 `onArrowShot` 函数。

```kotlin
// 一个集合，暂存了所有被标记为 TNT 箭的箭实体
// 这样我们就不需要去获取所有实体，筛选带有指定标签的箭实体了
val tntArrow = HashSet<Arrow>()

fun onArrowShot(player: ServerPlayer, arrow: Arrow) {
    // 在射箭的时候给玩家发送手持物品的信息
    tell(player, Component.empty() + "你手中的武器是: " + player[Weapon.MainHand]?.itemName)
    // 检查玩家手持物品的 nbt（也就是 custom_data 物品组件中的内容）
    // 这里的意思是获取 custom_data 中 tnt 标签的值，如果不存在则默认返回 false
    // 只有 {tnt: true} 的时候才会射出爆炸箭，也就是将被射出的箭加入到集合中
    if (player.mainHandItem.nbt["tnt"](false)) {
        tntArrow.add(arrow)
    }
}
```

现在，我们已经实现了对玩家射箭过程的处理，接下来我们实现让箭爆炸的功能。Katton 没有提供箭落地的事件，所以我们需要在每个 tick 遍历所有的爆炸箭，看看它们落地没有。但是因为我们直接把爆炸箭实体的引用存在了集合中，所以我们也不用再使用目标选择器不断的去获取所有的实体进行判断了。

```kotlin
fun main(){
    // 订阅 tick 事件
    // 每 tick 执行
    ServerEvent.onStartServerTick += tick@
    fun(_) {
        // 检查 TNT 箭是否击中地面并使其爆炸
        processTNTArrow()
    }
}
```

然后实现 `processTNTArrow` 函数。

```kotlin
fun processTNTArrow() {
    // 来遍历一下所有的爆炸箭实体
    val iterator = tntArrow.iterator()
    while (iterator.hasNext()) {
        val arrow = iterator.next()

        // 通过检查 NBT 数据来检查箭是否击中地面
        if (getEntityNbt(arrow).getBooleanOr("inGround", false)) {
            // 让箭爆炸
            // 这个方法来自原版代码
            // 当然你也可以和在数据包中一样生成一个 tnt 实体什么的，只是这样更简单啦
            arrow.level().explode(
                arrow,
                arrow.damageSources().explosion(arrow, arrow.owner),
                null,
                arrow.position(),
                16.0f,
                false,
                Level.ExplosionInteraction.TNT
            )
            iterator.remove()
            // 爆炸后移除箭实体
            arrow.kill(arrow.level() as ServerLevel)
        }
    }
}
```

最后，总览我们整个脚本，应该是长这样的：


```kotlin
fun main() {
    // 当实体加载时执行
    ServerEntityEvent.onAfterEntityLoad += load@
    fun(arg: EntityLoadArg) {
        val (entity, _) = arg
        if (entity !is Arrow) return
        // 如果玩家射出一支箭，检查手持弓的数据
        val owner = entity.owner
        if (owner is ServerPlayer) {
            onArrowShot(owner, entity)
        }
    }
    
    // 每 tick 执行
    onStartServerTick += tick@
    fun(_) {
        // 检查 TNT 箭是否击中地面并使其爆炸
        processTNTArrow()
    }
}

// 一个集合，暂存了所有被标记为 TNT 箭的箭实体
val tntArrow = HashSet<Arrow>()

fun onArrowShot(player: ServerPlayer, arrow: Arrow) {
    tell(player, Component.empty() + "你手中的武器是: " + player[Weapon.MainHand]?.itemName)
    // 这支箭是由 TNT 弓射出的，将会在击中地面后爆炸
    if (player.mainHandItem.nbt["tnt"](false)) {
        tntArrow.add(arrow)
    }
}

fun processTNTArrow() {
    val iterator = tntArrow.iterator()
    while (iterator.hasNext()) {
        val arrow = iterator.next()

        // 通过检查 NBT 数据来检查箭是否击中地面
        if (getEntityNbt(arrow).getBooleanOr("inGround", false)) {
            // 让箭爆炸
            // 这个方法来自原版代码
            arrow.level().explode(
                arrow,
                arrow.damageSources().explosion(arrow, arrow.owner),
                null,
                arrow.position(),
                16.0f,
                false,
                Level.ExplosionInteraction.TNT
            )
            iterator.remove()
            // 爆炸后移除箭实体
            arrow.kill(arrow.level() as ServerLevel)
        }
    }
}
```

这个例子也包含在我们的实例项目中哦。

现在进入游戏，或者直接中游戏中使用`reload`命令，用命令给自己一把带有正确 NBT 的弓，你就可以开始轰炸世界啦。

<ColorLine/>

当然啦，Katton 已经不属于原版内容的范畴了，所以我们说，**它一点也不香草**。但是数据包的开发实在繁琐又限制多，即使是对数据包开发相当熟悉的让也常常需要在一些简单的功能实现上消耗掉大量的事件。而 Mod 开发又很笨重，热重载的支持非常的优先，虽然功能强大，但是用来实现一些简单需求的时候也会也大炮打蚊子的感觉。KubeJS可能是一个好选择，但是 javascript 的开发体验也着实让人糟心，我们希望 Katton 能给广大开发者提供一个新的选择，~~吸引更多的人入坑 Kotlin~~ 更加享受创作的过程~