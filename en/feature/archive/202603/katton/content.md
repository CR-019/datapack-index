---
title: 'Katton - lightweight reloadable mod framework'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<FeatureHead
title='Katton - lightweight reloadable Mod framework'
    authorName="Alumopper"
    resourceLink = 'https://github.com/Alumopper/Katton'
/>

:::danger No this is not vanilla!
Katton is a **module** based on Fabric and NeoForge. It is not vanilla content, and the development content it supports is also non-vanilla. Content developed with Katton cannot be used in an environment where Katton is not installed.
:::

## Introduction
![alt text](../../../../../feature/archive/202603/katton/image.png)
### What is Katton?

Katton is a lightweight hot-reloadable mod development framework. With the convenience of Kotlin Script and the inherent advantages of IDEA support, Katton can provide developers with a fast, flexible and complete tool chain development environment. Relying on the dynamic compilation and JVM interaction features of Kotlin Script, Katton allows developers to modify and test Mod code without restarting the game, greatly improving development efficiency.

Katton supports both Fabric and NeoForge Mod Loaders, and provides an API that is as consistent as possible in both platforms.

:::warning early development stage
Katton is currently in the early development stage, its functions are not yet complete, the API may undergo major changes, and there are many bugs. It is recommended for reference and trial use only by interested developers.
:::

### Why choose Katton?

* **Easy to Use**: Katton’s intuitive API and hot-reload capabilities allow modders of all skill levels to quickly create and test their mods.
* **Flexible**: With the power of Kotlin, you can create complex mods that interact with Minecraft.
* **High Performance**: Katton uses Kotlin scripts to interact directly with Java objects at the Minecraft runtime, ensuring high performance and seamless integration.
* **Powerful API**: Katton provides a comprehensive API, allowing you to access and modify all aspects of the game, from blocks and items to entity and world generation, and even code injection like Mixin, and all support hot reloading.

## Simple start

### Environment configuration

Katton only supports **Minecraft 26.1** and above, and requires **Java 25** or above.

We recommend using **IntelliJ IDEA** for development because it provides the best support for Kotlin and Minecraft mod development. You can also use other IDEs that support Kotlin, but manual configuration may be required.

Katton compiles and executes all Kotlin scripts in the data pack, so your project structure should follow the standard Minecraft data pack format. At the same time, we recommend using build tools such as Gradle or Maven to manage dependencies. To build a Katton project, the easiest way is to copy the Katton Example repository locally and open it in the IDE. This example project has all necessary dependencies and settings configured, and development can begin immediately after the IDE is loaded.

### Create your first Katton script

Although we call them "Kotlin scripts", they are actually`.kt`rather than`.kts`Ordinary Kotlin files at the end for better IDE support. Within your namespace folder, create a new directory called scripts. Katton will automatically compile and execute all files in this directory`.kt`document.

If you are using the example project, remember to copy the required dependency JARs into the libs folder, including the Minecraft JAR (which can be found in the version folder of your .minecraft directory) and the Katton mod's own JAR file. You can also copy any other mod JARs you want to use in your script. The sample project has been configured with dependency imports in Gradle, and the JAR files in libs provide code completion and type checking in the IDE.

As your first script, we will send a "Hello Katton" message to the player when they join the game. exist`scripts`Create a directory named`hello.kt`The content of the file is as follows:

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

When you enter, you should see a "Hello Katton" message in the chat. Yay, you just created your first scripted mod with Katton!

Change the message in hello.kt to something else, save the file, then use the reload command and you should see the new message when you join again. Modifications can be made without restarting the game, and are as flexible as a data pack.

### debug

Ktton supports debugging data pack Kotlin scripts through JVM remote debugging.

1. Add the following JVM parameters to start Minecraft:
```text
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```
2. In IntelliJ IDEA, create an Attach to remote JVM run configuration and connect to the same host and port.
3. Set breakpoints in the actual data pack script file (e.g.,`data/&lt;namespace&gt;/scripts/*.kt`）。
4. Use the IDE's built-in debugging tools to debug your scripts.

## Data pack authors should also have fun writing!

Katton is not only suitable for mod developers, but also for data pack developers who suffer from Mojang command. Katton's lightweight and flexible hot-reload features make it ideal for development such as maps. What follows is a quick start so that data pack authors can also enjoy the convenience of Katton.

### command encapsulation

The first step in Katton API development is actually to encapsulate all command functions into simple Kotlin functions, so that data pack authors can quickly get started with development even if they are not familiar with Mod's API, and at least realize the functions that can be achieved in data pack development. Take our most commonly used scoreboard operation as an example. In Katton, it looks like this:

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

Isn't it very simple?

### target selector

In the command development of data pack, we also often use the target selector, and of course it is also encapsulated in Katton. However, it will be a little more complicated than the example just now. Anyway, let’s take a look at an example first!

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

Hmm...it looks a bit troublesome? Whether it is creating a target selector or obtaining an entity, a lot of code needs to be written. But - don't be biased by the data pack thinking. Any variables you declare here can be directly used in subsequent codes. At the same time, after you obtain the entity, you can also continue to access it in subsequent codes. Unlike in data pack, you need to repeatedly write the target selector and select the entity repeatedly, causing a lot of waste of performance.

### Explosive arrow!

Next, let’s look at a more complex example, using what every data pack author has probably written when they first started, the explosive arrow~

First we need to know the concept of event system. Events are used to trigger code execution when specific game events occur. For example, commonly used in data pack`load`and`tick`Tags are defined as events in Katton.

Let's review how a simple explosive arrow is generally implemented. First, we need to make a simple restriction, for example, when the player holds`{tnt:true}`Only when you have a bow can you shoot explosive arrows, otherwise things will go haywire. Then, when the player shoots an arrow, we will mark the arrow, usually with tag (`tag`), when the arrow with this tag hits the ground or block, it will cause a big explosion by summoning TNT or other methods!

According to this idea, let’s try to implement it in Katton.

First, mark the arrows shot by the player. We don’t need to check the scoreboard every tick (of course you can continue to do this, of course it is supported, but we have a simpler implementation now), because Katton provides a function called`onAfterEntityLoad`The event will be triggered when an entity is created (when it is loaded into the world). Therefore, we can write:

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

Next, we implement`onArrowShot` function。

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

Now that we have implemented the processing of the player's archery process, next we implement the function of making the arrow explode. Katton does not provide an event for arrows to land, so we need to loop through all the exploding arrows at each tick to see if they have landed. But because we directly store the reference to the Explosive Arrow entity in the collection, we no longer need to use the target selector to continuously obtain all entities for judgment.

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

and then implement`processTNTArrow` function。

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

Finally, an overview of our entire script should look like this:


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

This example is also included in our example project.

Enter the game now, or use it directly in the game`reload`command, use command to give yourself a bow with the correct NBT, and you can start bombing the world.

<ColorLine/>

Of course, Katton no longer belongs to the category of vanilla content, so we say, **it is not vanilla at all**. However, the development of data pack is really cumbersome and restrictive. Even those who are quite familiar with data pack development often need to consume a large number of events to implement some simple functions. And Mod development is very cumbersome, and hot reload support is a very high priority. Although it is powerful, it still feels like a cannon to swat mosquitoes when used to achieve some simple needs. KubeJS may be a good choice, but the development experience of javascript is also really disappointing. We hope that Katton can provide a new choice for the majority of developers, ~~ Attract more people to get into Kotlin~~ Enjoy the creative process more~
