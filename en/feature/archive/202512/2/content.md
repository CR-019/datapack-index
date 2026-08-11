---
title: Infinite architectural structure with infinite degrees of freedom based on world generation structure set
---
<FeatureHead
    title = "An infinite architectural structure with unlimited degrees of freedom based on the world generation structure set."
    authorName = "XiaofengMatuvent_"
    cover = '../../../../../feature/archive/202512/_assets/2.webp'
/>

## Probably a little prerequisite knowledge

[Basic tutorial on structure generation of Fox Roast](https://www.bilibili.com/video/BV1DUtkzoEwh/?spm_id_from=333.337.search-card.all.click&vd_source=5b4d28c9da915c1aebfdedf0be74077f)

## Introduction
Terrain is an essential part of my world, but using noise values alone cannot always carve out the environment we want. Especially when you want to customize each location. At this time, the puzzle block that comes with my world appeared in front of us. But if you want to achieve a truly infinite, seamless and flawless splicing of structures throughout the world, this requires some special means.

## Project Case
In the Deep Dream Oneiros integration package I am making, in order to experience the real world of meat pigeons, I made many dimensions, among which there was a need to generate unlimited splicing structures. I used the world generation module of the data pack to complete this requirement.

## Original strategy
First, notice that the structure set definition file under namespace/worldgen/structure_set can adjust the structure minimum distance separation and average distance spacing

```json
    {
      "placement": {
            "type": "minecraft:random_spread",
            "salt": 20073321,
            "separation": 1,
            "spacing": 2
        },
        "structures": [
            {
                "structure": "minecraft:temp",
                "weight": 1
            }
        ]
    }
```
Experiments show that when the minimum distance = average distance -1, all the structures of this structure set will be in a square matrix with the side length of the matrix being the average distance spacing.  
At the same time, note that the number of layers of the structure size and the maximum distance from the center max_distance_from_center can be defined in the structure definition file under namespace/worldgen/structure.

```json
    {
        "type": "minecraft:jigsaw",
        "biomes": "minecraft:plains",
        "max_distance_from_center": 116,
        "size": 20,
        "spawn_overrides": {},
        "project_start_to_heightmap": "MOTION_BLOCKING_NO_LEAVES",
        "start_height": {
            "type": "minecraft:constant",
            "value": {
                "absolute": 3
            }
        },
        "start_pool": "minecraft:tempstart",
        "step": "surface_structures",
        "terrain_adaptation": "none",
        "use_expansion_hack": false
    }
```
This makes it possible to achieve a roughly infinite structure by simply adjusting the maximum value of the maximum distance to be greater than the average distance. However, after the experiment, because the starting template would uncontrollably rotate around its northwest corner, it was impossible to obtain a flawless infinite structure directly through architectural construction.
## In-depth research
By saving a single puzzle block pointing upwards and using it as a structure to generate other structures, it was successfully rotated only around the center.
![Generate successful picture 1](https://img.cdn1.vip/i/69382804d8881_1765287940.webp)
Just take the position shown in the green wool as the geometric center, make the base a square, and make the peripheries of adjacent cuboids exactly connect to each other. Therefore we can achieve the following effect
![Generate successful picture 2](https://img.cdn1.vip/i/69382d4875590_1765289288.webp)
![Generate successful picture 3](https://img.cdn1.vip/i/69382d4e7f673_1765289294.webp)
![Generate successful picture 4](https://img.cdn1.vip/i/69382d5355d31_1765289299.webp)
The limit does not stop there. Not only can these structures be randomly selected, but the template pool can also be randomly selected. By nesting the structures again internally, unlimited degrees of freedom can be achieved.
## Practical demonstration
This principle was used to create the floor and ceiling of the True Infinite City, which were perfectly pieced together.
![Infinite City 1](https://img.cdn1.vip/i/693bf53221957_1765537074.webp)
![Infinity City 2](https://img.cdn1.vip/i/693bf532f0359_1765537074.webp)
![Infinity City 3](https://img.cdn1.vip/i/693bf524eabc8_1765537060.webp)
~Actually, because the construction level is not that perfect~
[Infinite City display video link](https://www.bilibili.com/video/BV1AKm5BYE94/?spm_id_from=333.1387.homepage.video_card.click&vd_source=5b4d28c9da915c1aebfdedf0be74077f)
## Summary
In summary, the infinite structure achieved through structure sets and puzzle blocks has a lot of room for development in projects such as ctm. I will also continue to improve my integration package through this theory.
## References
[structure set link](https://zh.minecraft.wiki/w/%E7%BB%93%E6%9E%84%E9%9B%86)
[Structure definition format link](https://zh.minecraft.wiki/w/%E7%BB%93%E6%9E%84%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F)