---
name: Nutlet（小坚果）
author:
    -
        name: PickLeaf
        char: 作者
description: 用于创建简单多方块机器的API与杂项前置
tags: [多方块结构,投影,机器]
version: 1.1.2
gameversion: [1.21.1~1.21.11]
aside: left
wheel: true
repo: PickLeaf/Nutlet-MCDatapack
cover: /datapack-index/wheel/Nutlet_pack.png
---

<InfoCard />

一个用于创建简单多方块机器的API，包含
 - 简易的增强`schedule`(可以通过命令存储转存NBT)
 - 创建临时投影(展示实体，即使区块卸载也会定时消失)
 - 根据方块朝向调整命令上下文执行角度(为了使多方块机器能不同朝向放置)
 - UUID转换(从数组格式至连字符格式)
 - 执行位置亮度获取
 - 游戏内可修改的配置项注册。
额外添加了一个带有自定义附魔的书，可以在书中写入文本调用对应函数。这样可以不用进度或射线追踪获取玩家左键的方块，用于多方块机器的创建及投影显示。可以通过#nutlet:spells函数标签添加注册用的函数,并在注册用的函数中注册书调用用的函数及其对应文本。

阅读其官方说明文件([Github](https://github.com/PickLeaf/Nutlet-MCDatapack))或查看[展示视频](https://www.bilibili.com/video/BV1fPcizJESJ/)以获取更多信息。