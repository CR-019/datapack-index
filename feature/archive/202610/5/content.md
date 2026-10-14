---
name: WindWaves_Sea'Chest Minecart GUI
title: '运输矿车GUI'
---

<FeatureHead
  title="运输矿车GUI"
  authorName="洛风澜_Sea"
  cover="https://cloud-photo.windwaves.top/Chest_GUI/Chest_GUI.png"
/>

## 序言
此数据包让运输矿车GUI配置更加简单快捷，只需要在storage配置并执行生成函数即可快速配置一个GUI。

## 功能
支持以下功能：

* 单击物品执行指令/切换菜单

## Storage结构
<div class="nbttree">

<node type="compound" name="name" /> 配置名称
- <node type="string" name="mode" required=true /> 模式。默认填`normal`，如果使用NPC请在此填写`npc`
- <node type="list" name="slot_id" required=true />槽位列表。参照[WIKI](https://zh.minecraft.wiki/w/%E6%A7%BD%E4%BD%8D#%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0)填写(只需填写槽位编号)。
- <node type="compound" name="slot" required=true /> 配置选项。
  - <node type="compound" name="1" required=true /> 槽位编号。
    - <node type="compound" name="item" required=true />物品。
      - <node type="string" name="id" required=true /> 物品ID。
      - <node type="compound" name="components" required=true /> 物品数据组件，参考[WIKI](https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E7%BB%84%E4%BB%B6#%E6%95%B0%E6%8D%AE%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B)填写。
      - <node type="int" name="count" required=true /> 物品数量。
    - <node type="compound" name="click_event" required=true />默认朝向( 如果使用look_player此项为必填 )。
      - <node type="string" name="action" required=true /> 行为。可以为`run_command`(执行指令)/`show_ui`(显示GUI)。
      - <node type="string" name="value" required=true /> 值。如果为`run_command`此处应为一条指令。如果为`show_ui`应该填写配置名称。
   - <node type="string" name="2" required=true /> 槽位编号
     - <node type="" name="" required=true /> 格式与"1"相同。

</div>

## 示例storage

默认配置
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


::: details 查看[mcdoc](../0/content)

```mcdoc
dispatch minecraft:storage["windwaves_sea:chest_gui"] to struct{
    config?: struct{
        [GuiConfigID]?: GuiConfig,
    }
}

/// 配置ID。每个配置对应了一个页面
type GuiConfigID = #[id(registry="windwaves_sea:chest_gui_config_id",definition=true)] string

/// 每个配置项
struct GuiConfig {
    /// 模式。可以为`normal`或`npc`
    mode?: ("normal" | "npc"),
    /// 本页面需要监听的槽位列表
    slot_id?: [(#[match_regex="^[0-9]*$"] string @ 1..)],
    /// 对于每个槽位的设置
    slot?: struct{
        /// 任意槽位ID，如`1`
        [(#[match_regex="^[0-9]*$"] string @ 1..)]?: struct{
            /// 本槽位上的物品
            item?: ::java::world::item::ItemStack,
            /// 本槽位上的点击事件
            click_event?: struct{
                /// 点击事件的动作类型，可以为`run_command`（执行任意命令）或`show_ui`（跳转到其他页面）
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


## 指令解析

### 生成运输矿车GUI
```mcfunction
function chest_gui:command/summon {name:"name",x:1,y:1,z:1}
```

生成运输矿车GUI，需先写入配置，name为上方配置中的配置名称（下文相同）。x、y、z均为坐标值。

### 清除运输矿车GUI
```mcfunction
function chest_gui:command/remove {name:"name"}
```

### 删除配置( 同时清除运输矿车GUI )
```mcfunction
function chest_gui:command/delete_setting {name:"name"}
```

---
## 下载
QQ群：117464315

Github：https://github.com/WindWavesSea/Chest-Minecart-GUI/

Modrinth: https://modrinth.com/datapack/chest-minecart-gui/

## 鸣谢
感谢[NOX OBSCURA](https://space.bilibili.com/1184771713)提供的矿车打开检测思路
