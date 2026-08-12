::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

# quick start

::: tip
This article briefly discusses what vanilla mod is and how to get started easily.

If you want, you can go directly to [View Collection](/en/index/绪论)
:::

## What is a data pack?

data pack is a method that can be used for`Minecraft：Java`Methods to modify the version or add new gameplay. It is an officially supported lightweight modification system and allows hot reloading.

The data pack can be roughly divided into two components. One is to use`JSON`The written configuration file is used to modify the game's registry, such as changing or adding new advancements, synthesizing recipes, etc.; the second is to use`mcfunction`A program written in a language that can execute a series of commands in sequence to implement a variety of logic from simple to complex.

After years of development, data pack has been able to provide solutions for most needs for game modification, can approach or even reach the functions of mods and plug-ins, and has become a mainstream tool in the field of map development. With the continuous updating of version, the data pack system will become more and more perfect.


## What is a resource pack?

Resource pack is a means to modify game resources, such as modifying or adding textures, models, fonts, and even modifying the game's shader program. Since data pack can only modify game logic and cannot simply provide new visual elements for the game, vanilla developers will deal with data pack and resource pack at the same time to achieve more beautiful game effects. The method of modifying the game through resource packs and data packs together is generally called vanilla mod or vanilla development.


## Advantages and disadvantages of vanilla development
Also as a solution for modifying the Java version of Minecraft, compared with mods based on third-party APIs such as forge/fabric/neoforge, and server-side plug-ins such as bukkit, vanilla development has the following advantages and disadvantages:
- Advantages:
  - Officially supported and well documented;
  - Easy to get started with simple syntax;
  - Fully server-side operation, the client only needs to install the resource pack;
  - It has good horizontal compatibility, supports a variety of different mod terminals and servers, and can be connected across terminals;
  - Supports hot reloading and high development efficiency.
- Disadvantages:
  - The functions are limited and there are few means of reaching the bottom layer. The functions that can be realized are highly dependent on the interface provided by Mojang;
  - Performance cost, the system implemented based on command will incur additional consumption.

## Get started quickly

If you have certain programming experience and foundation, please go directly to [A brief introduction to data pack for those with programming foundation](./对有基础者简述). Here we will briefly introduce how to set up the development environment and give`mcfunction`A basic introduction to language.

If you don’t have any background, no need to stress! Please check [Recommended Reading for Zero Basics](./零基础阅读推荐). Here we'll tell you how to get started and where to start reading among Vanilla Library's extensive collections.

Have fun.
