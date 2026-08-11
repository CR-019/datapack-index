---
title: 'Katton - lightweight reloadable mod framework'
---

<FeatureHead
    title="Katton - lightweight reloadable Mod framework"
    authorName="Alumopper"
    resourceLink = 'https://github.com/Alumopper/Katton'/>

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

* **Easy to Use**: Katton's intuitive API and hot-reload capabilities allow modders of all levels to quickly create and test their mods.
* **Flexible**: With the power of Kotlin, you can create complex mods that interact with Minecraft.
* **High Performance**: Katton uses Kotlin scripts to interact directly with Java objects at the Minecraft runtime, ensuring high performance and seamless integration.
* **Powerful API**: Katton provides a comprehensive API, allowing you to access and modify all aspects of the game, from blocks and items to entity and world generation, and even code injection like Mixin, and all support hot reloading.

## Simple start

### Environment configuration

Katton only supports **Minecraft 26.1** and above, and requires **Java 25** or above.

We recommend using **IntelliJ IDEA** for development as it has the best support for Kotlin and Minecraft mod development. You can also use other IDEs that support Kotlin, but manual configuration may be required.

Katton will compile and execute all Kotlin scripts in the data pack, so your project structure should follow the standard Minecraft data pack format. At the same time, we recommend using build tools such as Gradle or Maven to manage dependencies. To build a Katton project, the easiest way is to copy the Katton Example repository locally and open it in the IDE. This example project has all necessary dependencies and settings configured, and development can begin immediately after the IDE is loaded.

### Create your first Katton script

Although we call them "Kotlin scripts", they are actually`.kt`rather than`.kts`Ordinary Kotlin files at the end for better IDE support. Within your namespace folder, create a new directory called scripts. Katton will automatically compile and execute all files in this directory`.kt`document.

If you are using the example project, remember to copy the necessary dependency jars to the libs folder, including the Minecraft jar (which can be found in the version folder of your .minecraft directory), as well as the Katton module's own jar file. You can also copy any other mod jars you want to use in your script. The sample project has been configured with dependency imports in Gradle, and the jar files in these libs will be used to provide code completion and type checking in the IDE.

As your first script, we will send a "Hello Katton" message to the player when they join the game. exist`scripts`Create a directory named`hello.kt`The content of the file is as follows:

```kotlin
//Imports required by the script
import net.minecraft.network.chat.Component
import top.katton.api.event.ServerPlayerEvent
import top.katton.api.event.PlayerArg

//The main function is the entry point of the script. Of course, it doesn’t have to be called main. After all, we call it manually and there are no regulations.
fun main(){
    //Register an event listener, which is triggered when the player joins the server
    ServerPlayerEvent.onPlayerJoin += onJoin@
    fun(arg: PlayerArg){
        //Get the joined player and send a message to it
        val player = arg.player
        //Same as you do in normal mods
        player.sendSystemMessage(Component.literal("Hello Katton"))
    }
}

//It will be called to execute the main function
@Suppress("unused")
val entryPoint = main()
```
When you enter, you should see a "Hello Katton" message in the chat. Yay, you just created your first scripted mod with Katton!

Change the message in hello.kt to something else, save the file, then use the reload command and you should see the new message when you join again. Modifications can be made without restarting the game, and are as flexible as a data pack.

### Debugging

Ktton supports debugging data pack Kotlin scripts through JVM remote debugging.

1. Add the following JVM parameters to start Minecraft:

```text
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```
2. In IntelliJ IDEA, create an Attach to remote JVM run configuration and connect to the same host and port.
3. Set breakpoints in the actual data pack script file (e.g.,`data/&lt;namespace&gt;/scripts/*.kt`).
4. Use the debugging tools that come with the IDE to debug your script.

## Data pack authors should also enjoy writing!

Katton is not only suitable for mod developers, but also for data pack developers who suffer from Mojang command. Katton's lightweight and flexible hot-reload features make it ideal for development such as maps. What follows is a quick start so that data pack authors can also enjoy the convenience of Katton.

### command encapsulation

The first step in Katton API development is actually to encapsulate all command functions into simple Kotlin functions, so that data pack authors can quickly get started with development even if they are not familiar with Mod's API, and at least realize the functions that can be achieved in data pack development. Take our most commonly used scoreboard operation as an example. In Katton, it looks like this:

```kotlin
import top.katton.api.dpcaller.getOrCreateObjective
import top.katton.api.dpcaller.setScore

fun scoreboardExampleMain(){
    //Get scoreboard object
    val obj = getOrCreateObjective("myscore")
    //Set the score of "test" to 100
    setScore("test", obj, 100)
    //The above code is equivalent to the command in
    // scoreboard players set test myscore 100
}

//Don't forget to execute the function
val scoreboardExampleMain = scoreboardExampleMain()
```
Isn't it very simple?

### Target selector

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

    //Build target selector
    val selector = EntitySelectorBuilder.allEntities()  //@e
        .type(EntityType.CREEPER)       //type = creeper
        .tag("qwq", false)              //tag = qwq
        .distanceBelow(16.0)            //distance = ..16
        .create()
    //So we got a target selector like this: @e[type=creeper,tag=qwq,distance=..16]

    //Then we need to build a command context for the target selector selected entity
    val source = requireServer().createCommandSourceStack()
        .withLevel(requireServer().overworld())     //Set dimensions
        .withPosition(Vec3(50.0, 70.0, 50.0))       //Set location

    //Get the entity selected by the selector
    val entities = selector.findEntities(source)

    //Once you have references to entities, you can access those entities from anywhere in your code
    for (entity in entities) {
        if(entity is LivingEntity){
            //Add some status effects to the entity
            addEffect(entity,
                MobEffects.GLOWING, //Effect
                200,    //Effect duration (**tick**)
                0,      //Effect level
                false,  //Whether to display particles
                false   //Whether to display the icon
            )
        }
    }
}

//Remember to call function
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
    //Executed when the entity is loaded
    //In this way, we can subscribe to an event!
    ServerEntityEvent.onAfterEntityLoad += load@
    fun(arg: EntityLoadArg) {   //When the event is triggered, the parameters will be passed into this function.
        val (entity, _) = arg   //The parameters contain information when the entity is loaded, such as the loaded entity
        if (entity !is Arrow) return    //The loaded entity is an arrow, so we continue execution.
        //If the player shoots an arrow, check the data of the held bow
        val owner = entity.owner    //Can check who the arrow came from
        if (owner is ServerPlayer) {    //Only the player can shoot explosive arrows
            onArrowShot(owner, entity)  //In this function we will check the player's bow and mark the arrows
        }
    }
}
```
Next, we implement`onArrowShot` function。

```kotlin
//A collection that temporarily stores all arrow entities marked as TNT arrows
//In this way, we don't need to get all entities and filter the arrow entities with specified tags.
val tntArrow = HashSet<Arrow>()

fun onArrowShot(player: ServerPlayer, arrow: Arrow) {
    //Send information about the item being held to the player when shooting an arrow
    tell(player, Component.empty() + "你手中的武器是: " + player[Weapon.MainHand]?.itemName)
    //Check the nbt of the item held by the player (that is, the content in the custom_data item component)
    //What this means is to get the value of the tnt tag in custom_data. If it does not exist, it will return false by default.
    //Explosive arrows will be shot only when {tnt: true}, that is, the shot arrows will be added to the set.
    if (player.mainHandItem.nbt["tnt"](false)) {
        tntArrow.add(arrow)
    }
}
```
Now that we have implemented the processing of the player's archery process, next we implement the function of making the arrow explode. Katton does not provide an event for arrows to land, so we need to loop through all the exploding arrows at each tick to see if they have landed. But because we directly store the reference to the Explosive Arrow entity in the collection, we no longer need to use the target selector to continuously obtain all entities for judgment.

```kotlin
fun main(){
    //Subscribe to tick event
    //Executed every tick
    ServerEvent.onStartServerTick += tick@
    fun(_) {
        //Check if the TNT arrow hits the ground and causes it to explode
        processTNTArrow()
    }
}
```
and then implement`processTNTArrow` function。

```
kotlin
fun processTNTArrow() {
    //Let’s go through all the explosive arrow entities
    val iterator = tntArrow.iterator()
    while (iterator.hasNext()) {
        val arrow = iterator.next()

        //Check if arrow hit the ground by checking NBT data
        if (getEntityNbt(arrow).getBooleanOr("inGround", false)) {
            //Make the arrow explode
            //This method comes from vanilla code
            //Of course, you can also generate a tnt entity or something like in data pack, but this is simpler.
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
            //Remove arrow entity after explosion
            arrow.kill(arrow.level() as ServerLevel)
        }
    }
}
```
Finally, an overview of our entire script should look like this:

```kotlin
fun main() {
    //Executed when the entity is loaded
    ServerEntityEvent.onAfterEntityLoad += load@
    fun(arg: EntityLoadArg) {
        val (entity, _) = arg
        if (entity !is Arrow) return
        //If the player shoots an arrow, check the data of the held bow
        val owner = entity.owner
        if (owner is ServerPlayer) {
            onArrowShot(owner, entity)
        }
    }
    
    //Executed every tick
    onStartServerTick += tick@
    fun(_) {
        //Check if the TNT arrow hits the ground and causes it to explode
        processTNTArrow()
    }
}

//A collection that temporarily stores all arrow entities marked as TNT arrows
val tntArrow = HashSet<Arrow>()

fun onArrowShot(player: ServerPlayer, arrow: Arrow) {
    tell(player, Component.empty() + "你手中的武器是: " + player[Weapon.MainHand]?.itemName)
    //This arrow is fired from a TNT bow and will explode upon hitting the ground
    if (player.mainHandItem.nbt["tnt"](false)) {
        tntArrow.add(arrow)
    }
}

fun processTNTArrow() {
    val iterator = tntArrow.iterator()
    while (iterator.hasNext()) {
        val arrow = iterator.next()

        //Check if arrow hit the ground by checking NBT data
        if (getEntityNbt(arrow).getBooleanOr("inGround", false)) {
            //Make the arrow explode
            //This method comes from vanilla code
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
            //Remove arrow entity after explosion
            arrow.kill(arrow.level() as ServerLevel)
        }
    }
}
```
This example is also included in our example project.

Enter the game now, or use it directly in the game`reload`Command, use command to give yourself a bow with the correct NBT, and you can start bombing the world.

<ColorLine/>

Of course, Katton no longer belongs to the category of vanilla content, so we say, **it is not vanilla at all**. However, the development of data pack is really cumbersome and restrictive. Even those who are quite familiar with data pack development often need to consume a large number of events to implement some simple functions. And Mod development is very cumbersome, and hot reload support is a very high priority. Although it is powerful, it still feels like a cannon to swat mosquitoes when used to achieve some simple needs. KubeJS may be a good choice, but the development experience of javascript is also really disappointing. We hope that Katton can provide a new choice for the majority of developers, ~~ Attract more people to get into Kotlin~~ Enjoy the creative process more~