---
name: Big-faced cat
author:
    -
        name: Dahesor
        char: author
description: Work order forceload operation and compatibility library
tags: [chunk,forceload,chunkload]
version: 1.0.0
gameversion: [1.21.5+]
aside: left
wheel: true
repo: Dahesor/Leopard-Cat
---

<InfoCard />

Big-faced cat adds a shell to vanilla's forceloadcommand. When using Big Face Cat, all forceload instructions should be issued through Big Face Cat.

Users can create requests to load a specific chunk, or specify multiple chunks within a rectangular range. As long as there is at least one request on a chunk, it will be loaded continuously.

Minecraft's forceloadcommand is asynchronous, which means that the chunk may not finish loading immediately after forceload is executed. Big Face Cat allows users to provide a list of on_loadcommands and automatically execute these commands after all requested chunks are loaded.

Each request can also specify its own lifecycle.

## Instructions for use

Read its [documentation](https://github.com/Dahesor/Leopard-Cat/blob/main/docs/zh_cn.md) for usage instructions