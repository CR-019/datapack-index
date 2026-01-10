---
name: Floating UI
author:
    -
        name: Alumopper
        char: 作者
description: 功能强大的重量级UI框架
tags: [UI, 展示实体]
version: 1.0-beta1
gameversion: [1.21.9, 1.21.10]
aside: left
wheel: true
repo: Alumopper/Floating-UI
---

<InfoCard />

Floating UI是一个基于展示实体实现的重量级UI框架，允许你使用纯原版的方式在Minecraft中创建一个浮空可交互UI。

在使用Floating UI之前，你需要安装[小豆的数学库](https://github.com/xiaodou8593/math2.0)和[小豆的事件队列](https://github.com/xiaodou8593/timelist)。Floating UI使用小豆的数学库进行计算，使用小豆的事件队列托管事件的定时触发效果。

### 快速开始

要创建一个UI，最简单的方式是使用函数`floating_ui:.player_new_ui`。这个函数将会在执行者前方四格远的地方生成一个面向玩家的UI界面。在调用这个函数之前，你需要传入UI的布局数据，例如：

```mcfunction

# 玩家执行

data modify floating_ui:input data set value {\
    "type":"panel",\
    "size":[5f,5f],\
    "child":[\
        {\
            "type":"button",\
            "y":0.3,\
            "size":[2.5f,2.5f],\
            "item":{"id":"apple"}
        }
    ]
}

function floating_ui:.player_new_ui
```

将UI关闭最简单的方法是`.player_dispose_ui`。这将会清除执行者玩家拥有的所有UI。
