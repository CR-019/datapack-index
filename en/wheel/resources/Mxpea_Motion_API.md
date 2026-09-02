---
name: Mxpea-s-Multiplayer-Motion-API
author:
    -
        name: Mxpea
        char: author
description: Simply modify the data pack of non-playerentity momentum
tags: [momentum,Motion]
version: 1.3.0
gameversion: [1.20.2-1.21.11]
aside: left
wheel: true
repo: Mxpea/Mxpea-s-Multiplayer-Motion-API
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />

Added some convenient interfaces for operating non-playerentityMotion. Adding different tags to the entity can control the momentum of the entity in various ways.

Due to the use of tags as interfaces, this library's`#tick`There are multiple entries in function`@e[tag=&lt;tag&gt;]`Detection, if users want to save performance, they can turn it off and remove it`#tick`And manually call the function after adding the tag.

## usage

The following instructions may be out of date. Please refer to [Official Document](https://github.com/Mxpea/Mxpea-s-Multiplayer-Motion-API/tree/v1.3.0) shall prevail.

Add the following Tag tag to the entity to throw the entity in the direction you are facing:

`mot`: Launch the entity to your line of sight;

`random_mot`，`random_mot_mid`，`random_mot_big`: Add randomness to the emission. These three are different presets. Of course, you can also customize the randomness in the data pack file;

`random_exp`: Launch entities in random directions. Applying to multiple entities at once can make them look like explosions;

`trace`: Launch entity to the nearest player;

`away`: Emit entities in a direction away from the nearest player;

`one_random_mot`: Emit entities in random directions, but it cannot provide different randomness for multiple entities at the same time.
