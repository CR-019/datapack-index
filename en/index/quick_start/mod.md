# Quick Start

::: tip
This article briefly discusses what vanilla mods are and how to get started.

If you prefer, you can go directly to [Browse the Collection](/en/index/绪论).
:::

## What is a data pack?

A data pack is a way to modify or add gameplay to `Minecraft: Java Edition` without changing the Java source code. It is an officially supported, lightweight modification system that also supports hot reloading.

A data pack can generally be divided into two components. The first consists of configuration files written in `JSON`, which modify the game's registries—for example, by changing or adding advancements and crafting recipes. The second consists of programs written in the `mcfunction` language, which execute a series of commands in order to implement logic ranging from simple to complex.

After years of development, data packs have become capable of solving most game-modification needs. They can approach or even match the functionality of mods and plugins, and have become a mainstream tool for map development. As versions continue to update, the data pack system will become more complete.

## What is a resource pack?

A resource pack is a way to modify game resources, such as by changing or adding textures, models, and fonts, or even modifying the game's shader programs. Because data packs can modify only game logic and cannot easily provide new visual elements, vanilla developers work with data packs and resource packs together to create more attractive game experiences. Modifying the game with both resource packs and data packs is generally called vanilla modding or vanilla development.

## Advantages and disadvantages of vanilla development

As a way to modify Minecraft: Java Edition, vanilla development has the following advantages and disadvantages compared with mods based on third-party APIs such as Forge, Fabric, and NeoForge, and plugins for server software such as Bukkit:
- Advantages:
  - officially supported, with comprehensive documentation;
  - easy to start with, with simple syntax;
  - runs entirely on the server, requiring the client to install only the resource pack;
  - good cross-platform compatibility, supporting many different modded clients and servers and allowing cross-platform multiplayer;
  - supports hot reloading and offers high development efficiency.
- Disadvantages:
  - limited functionality, with few ways to reach lower-level systems; achievable functionality depends heavily on the interfaces Mojang provides;
  - performance overhead, since command-based systems incur additional cost.

## Getting started quickly

If you have some programming experience and background, go directly to [A Brief Introduction to Data Packs for Readers with Programming Experience](./对有基础者简述). It briefly explains how to set up a development environment and introduces the basics of the `mcfunction` language.

If you have no background at all, do not worry! Read [Recommended Reading for Beginners](./零基础阅读推荐). It explains how to get started and where to begin among the Vanilla Library's extensive collection.

Have fun!

