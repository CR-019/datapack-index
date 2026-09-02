---
name: Chest Minecart GUI
author:
    -
        name: WindWavesSea
        char: Author
description: Configure and create chest minecart GUIs through storage
tags: [GUI]
version: 1.1.0
gameversion: [1.21-26.2]
aside: left
wheel: true
repo: WindWavesSea/Chest-Minecart-GUI
cover: /datapack-index/wheel/ChestMinecartGUI.jpg
---

::: tip Translation notice
This page is maintained in English from the original project documentation. Please report any inaccurate technical wording.
:::

<InfoCard />

This data pack makes chest minecart GUIs easier to configure. Define a GUI in storage, then call the generation function to create it. Item clicks can run any command or open another page.

The following instructions may be outdated. Refer to the [official GitHub documentation](https://github.com/WindWavesSea/Chest-Minecart-GUI) for the latest information.

## Storage structure

Write the following structure to the designated storage before generating a GUI.

::: details View NBT tree
<div class="nbttree">

<node type="compound" name="name" /> Configuration name
- <node type="string" name="mode" required=true /> Mode. Use `normal` by default or `npc` for an NPC interface.
- <node type="list" name="slot_id" required=true /> Slot IDs to monitor. Enter only the numeric IDs listed in the [slot reference](https://minecraft.wiki/w/Slot#Command_argument).
- <node type="compound" name="slot" required=true /> Slot configuration.
  - <node type="compound" name="1" required=true /> Slot ID.
    - <node type="compound" name="item" required=true /> Item shown in the slot.
      - <node type="string" name="id" required=true /> Item ID.
      - <node type="compound" name="components" required=true /> Item [data components](https://minecraft.wiki/w/Data_component_format#Component_types).
      - <node type="int" name="count" required=true /> Item count.
    - <node type="compound" name="click_event" required=true /> Click event configuration.
      - <node type="string" name="action" required=true /> Either `run_command` or `show_ui`.
      - <node type="string" name="value" required=true /> A command for `run_command`, or the target configuration name for `show_ui`.
   - <node type="string" name="2" required=true /> Another slot ID.
     - <node type="any" name="2" required=true /> Uses the same structure as `1`.
</div>
:::

::: details View [mcdoc](/en/feature/archive/202505/3/content_)

```mcdoc
dispatch minecraft:storage["windwaves_sea:chest_gui"] to struct{
    config?: struct{
        [GuiConfigID]?: GuiConfig,
    }
}

/// Configuration ID. Each configuration represents one page.
type GuiConfigID = #[id(registry="windwaves_sea:chest_gui_config_id",definition=true)] string

/// One GUI configuration.
struct GuiConfig {
    /// Interface mode: `normal` or `npc`.
    mode?: ("normal" | "npc"),
    /// Slots monitored on this page.
    slot_id?: [(#[match_regex="^[0-9]*$"] string @ 1..)],
    /// Settings for each slot.
    slot?: struct{
        /// Any numeric slot ID, such as `1`.
        [(#[match_regex="^[0-9]*$"] string @ 1..)]?: struct{
            /// Item displayed in this slot.
            item?: ::java::world::item::ItemStack,
            /// Click event for this slot.
            click_event?: struct{
                /// `run_command` executes a command; `show_ui` opens another page.
                action?: ("run_command"|"show_ui"),
                value?: windwaves_sea:action[[action]]
                //(#[command] string | #[id="windwaves_sea:chest_gui_config_id"] string)
            }
        }
    }
}
dispatch windwaves_sea:action["run_command"] to #[command] string
dispatch windwaves_sea:action["show_ui"] to #[id="windwaves_sea:chest_gui_config_id"] string
```
:::

::: details View example
```mcfunction
data merge storage windwaves_sea:chest_gui {\
config:{\
    "test":{\
        "mode":"npc",\
        "slot_id":["1"],\
        "slot":{\
                "1":{\
                    "item":{\
                        "id": "minecraft:diamond",\
                        "components":{},\
                        "count": 1 \
                    },\
                    "click_event":{\
                        "action":"show_ui", \
                        "value":"test1" \
                    }\
                }\
        }\
    }\
}\
}
```
:::

## Command reference

### Generate a chest minecart GUI
```mcfunction
function chest_gui:command/summon {name:"name",x:1,y:1,z:1}
```

Write the configuration first, then generate the GUI. `name` is the configuration name used above and by the following commands; `x`, `y`, and `z` are coordinates.

### Remove a chest minecart GUI
```mcfunction
function chest_gui:command/remove {name:"name"}
```

### Delete a configuration and its GUI
```mcfunction
function chest_gui:command/delete_setting {name:"name"}
```
