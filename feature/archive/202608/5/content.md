<FeatureHead
  title="简单NPC"
  authorName="洛风澜_Sea"
  abstractText="Markdown 中的 Vue 组件会作为真实组件渲染。"
  cover="https://cloud-photo.windwaves.top/Simple_NPC.png"
/>

# 序言
 此数据包使原版配置NPC更加简单，只需要写storage并执行生成函数即可配置一个属于你的NPC

# 功能
支持以下功能：

* 自定义NPC上方的悬浮字。
* 自定义NPC皮肤。
* 右键NPC运行指令或函数。

# Storage结构
## 默认结构(不开启自定义配置)
<div class="nbttree">

<node type="compound" name="name" /> 此键名需和name标签一致。
- <node type="string" name="name" required=true />NPC名称。
- <node type="string" name="zone" required=true />NPC生成的区域。
- <node type="compound" name="config" /> 配置选项。
  - <node type="bool" name="custom_settings" required=true />自定义配置。
  - <node type="bool" name="look_player" />NPC是否看向玩家。
  - <node type="string" name="default_orientation" />默认朝向( 如果使用look_player此项为必填)。
- <node type="compound" name="text" required=true />悬浮字。
  - <node type="compound" name="pos" required=true />坐标。
    - <node type="float" name="x" required=true /> x坐标。
    - <node type="float" name="y" required=true /> y坐标。
    - <node type="float" name="z" required=true /> z坐标。
  - <node type="list" name="text" required=true /> 内含[文本组件](https://zh.minecraft.wiki/w/%E6%96%87%E6%9C%AC%E7%BB%84%E4%BB%B6)。
- <node type="compound" name="npc" required=true />玩家模型配置。
  - <node type="compound" name="pos" required=true />坐标。
    - <node type="float" name="x" required=true /> x坐标。
    - <node type="float" name="y" required=true /> y坐标。
    - <node type="float" name="z" required=true /> z坐标。
  - <node type="string" name="model" required=true /> 玩家模型类型。
  - <node type="string" name="texture" required=true /> 玩家皮肤<命名空间>:textures/<路径>.png或皮肤链接。
- <node type="compound" name="right_click"/>右键NPC执行。
  - <node type="string" name="command" />右键执行的指令( 与function任选其一配置)。
  - <node type="string" name="function" />右键执行的函数( 与command任选其一配置)。

</div>

## 自定义配置结构(开启自定义配置)
<div class="nbttree">

<node type="compound" name="name" /> 此键名需和name标签一致。
- <node type="string" name="name" required=true />NPC名称。
- <node type="string" name="zone" required=true />NPC生成的区域。
- <node type="compound" name="config" /> 配置选项。
  - <node type="bool" name="custom_settings" required=true />自定义配置( 应该为true )。
  - <node type="bool" name="look_player" />NPC是否看向玩家。
  - <node type="string" name="default_orientation" />默认朝向(如果使用look_player此项为必填)。
- <node type="compound" name="text" required=true />悬浮字。
  - <node type="compound" name="pos" required=true />坐标。
    - <node type="float" name="x" required=true /> x坐标。
    - <node type="float" name="y" required=true /> y坐标。
    - <node type="float" name="z" required=true /> z坐标。
  - <node type="compound" name="data" required=true /> 参看文本展示实体的[实体数据](https://zh.minecraft.wiki/w/%E5%B1%95%E7%A4%BA%E5%AE%9E%E4%BD%93#%E5%AE%9E%E4%BD%93%E6%95%B0%E6%8D%AE)配置
- <node type="compound" name="npc" required=true />玩家模型配置。
  - <node type="compound" name="pos" required=true />坐标。
    - <node type="float" name="x" required=true /> x坐标。
    - <node type="float" name="y" required=true /> y坐标。
    - <node type="float" name="z" required=true /> z坐标。
  - <node type="compound" name="data" required=true /> 参看玩家模型[实体数据](https://zh.minecraft.wiki/w/%E7%8E%A9%E5%AE%B6%E6%A8%A1%E5%9E%8B#%E5%AE%9E%E4%BD%93%E6%95%B0%E6%8D%AE)配置
- <node type="compound" name="right_click"/>右键NPC执行。
  - <node type="string" name="command" />右键执行的指令(与function任选其一配置)。
  - <node type="string" name="function" />右键执行的函数(与command任选其一配置)。

</div>

## 示例storage

默认配置
~~~mcfunction
data modify storage windwaves_sea:npc root.npc_setting merge value {\
    test:{\
        name:"test",\
        zone:"test",\
        config:{\
            custom_settings:false,\
            look_player:true\
        },\
        text:{\
            pos:{x:1,y:1,z:1},\
            text:[{text:"1"}]\
        },\
        npc:{\
            pos:{x:1,y:1,z:1},\
            model:"wide",\
            texture:"lobby:npc/start_game",\
            rotation:[180,0]\
        },\
        right_click:{\
            command:"",\(function:""\)
        }\
    }\
}
~~~
自定义配置
~~~mcfunction
data modify storage windwaves_sea:npc root.npc_setting merge value {\
    test_custom:{\
        name:"test_custom",\
        zone:"test",\
        config:{\
            custom_settings:true,\
            look_player:true,\
            default_orientation:"north" \
        },\
        text:{\
            pos:{x:1,y:1,z:1},\
            data:{}\
        },\
        npc:{\
            pos:{x:1,y:1,z:1},\
            data:{}\
        },\
        right_click:{\
            function:""\(command:""\)
        }\
    }\
}
~~~
## 指令解析

### 生成NPC
~~~mcfunction
function npc:summon {name:"name"}
~~~

生成NPC，需先写入配置，不可重复生成，name为上方配置中的NPC名称（下文相同）。

### 清除NPC
~~~mcfunction
function npc:remove/npc {name:"name"}
~~~

## 删除配置( 同时清除NPC )
~~~mcfunction
function npc:remove/setting {name:"name"}
~~~

---
# 下载
QQ群：117464315

Github：https://github.com/WindWavesSea/Simple-NPC/

Modrinth: https://modrinth.com/datapack/simple-npc/

## 鸣谢
感谢[NOX OBSCURA](https://space.bilibili.com/1184771713)提供的交互实体大小, 使其可以贴合NPC碰撞箱

感谢[轩宇1725](https://space.bilibili.com/104432208)提供的storage检测思路，使字符串可以检测