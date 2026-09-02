---
name: Nutlet-MCDatapack
author:
    -
        name: PickLeaf
        char: author
description: API and miscellaneous prerequisites for creating simple multi-block machines
tags: [multi-block structure, projection, machine]
version: 1.1.2
gameversion: [1.21.1~1.21.11]
aside: left
wheel: true
repo: PickLeaf/Nutlet-MCDatapack
cover: /datapack-index/wheel/Nutlet_pack.png
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />

An API for creating simple multi-block machines, including
 - Simple enhancement`schedule`(NBT can be transferred via command storage)
 - Create a temporary projection (to display the entity, it will disappear periodically even if the chunk is unloaded)
 - Adjust the command context execution angle according to the block orientation (in order to enable multi-block machines to be placed in different orientations)
 - UUID conversion (from array format to hyphen format)
 - Execute position brightness acquisition
 - Registration of configuration items that can be modified in the game.
An additional book with custom enchantments has been added, and text can be written in the book to call the corresponding function. In this way, the block of the player's left click can be obtained without advancement or ray tracing, which can be used for the creation and projection display of multi-block machines. You can add a function for registration through #nutlet:spellsfunctiontag, and register the function for book calling and its corresponding text in the registration function.

Read its official documentation ([Github](https://github.com/PickLeaf/Nutlet-MCDatapack)) or view [show video](https://www.bilibili.com/video/BV1fPcizJESJ/) for more information.
