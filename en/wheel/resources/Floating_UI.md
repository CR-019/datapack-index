---
name: Floating-UI
author:
    -
        name: Alumopper
        char: author
description: Powerful heavyweight UI framework
tags: [UI, display entity]
version: 1.0-beta1
gameversion: [1.21.9, 1.21.10]
aside: left
wheel: true
repo: Alumopper/Floating-UI
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />

Floating UI is a heavyweight UI framework based on display entities, allowing you to create a floating interactive UI in Minecraft using a pure vanilla approach.

Before using Floating UI, you need to install [Xiaodou’s math library](https://github.com/xiaodou8593/math2.0) and [Xiaodou’s event queue](https://github.com/xiaodou8593/timelist). Floating UI uses Xiaodou's math library for calculations, and uses Xiaodou's event queue to host the timing triggering effect of events.

### quick start

To create a UI, the easiest way is to use functions`floating_ui:.player_new_ui`. This function will generate a player-oriented UI interface four blocks in front of the executor. Before calling this function, you need to pass in the layout data of the UI, for example:

```mcfunction

# Run as the player.

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


The easiest way to turn the UI off is`.player_dispose_ui`. This will clear all UI owned by the executor player.

