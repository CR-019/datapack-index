---
title: 'Sequencer Helper'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "Sequencer Helper"
    authorName = "CR_019"
    resourceLink = 'https://cr-019.github.io/index/%E5%89%8D%E7%BD%AE/1-sh/page.html'
/>


Sequencer Helper is a tool for encapsulation and management by [Java Block Sequencor](https://www.blockbench.net/plugins/java_block_sequencer) This Block Bench plugin is a data pack and python script tool.
Java Block Sequencor can generate frame animation models, and Sequencer Helper can easily and automatically generate corresponding item model mapping files, and use concise and unified parameters to call and play animations.

## File structure
Sequencer Helper contains two parts: a python script for item model mapping generation, and a data pack for playing animations.

## item model mapping generation
Generate script`generate.py`Designed specifically for Vs Code, you need to open the folder where the frame animation resource pack is located, and install Python3 and the corresponding vsc plug-in to ensure that vscode can execute python scripts. \
First, you need to use Java Block Sequencor to create and export frame animation models, and place all animations in the same parent directory to ensure that they are`模型目录/动画目录/帧.json`, and pay attention to specifying the texture position;\
Then put the generated script into the resource pack directory, use the resource pack root directory as the execution location, and specify the following parameters. An example is given here.

```python
"""
Minecraft帧动画序列模型映射文件生成脚本

参数说明:
- 源路径SOURCE_PATH: 指定帧动画的目录，为一相对路径，格式必定为<任意路径>/assets/<命名空间>/models/<其他路径>
- 目标路径TARGET_PATH: 生成模型映射文件的路径，相对路径（不需要带./）
- 文件名FILE_NAME: 映射文件的名字，程序会自动添加.json后缀
- 动画列表ANIMATION_LIST: 字符串列表，每一个项代表一个动画，表示原路径下的一个文件夹，内部为按数字标识的帧动画模型文件
- 回落映射FALLBACK_MAPPING: 可选，字符串，表示在不播放动画时的模型；若不存在则使用动画列表第一项的第一个模型
- 动画索引ANIMATION_INDEX: 影响动画索引字符串在物品custom_model_data.strings的第几项，例如0表示决定模型播放哪个动画的字符串在对应cmd的第一项
- 帧索引FRAME_INDEX: 影响帧索引字符串在物品custom_model_data.floats的第几项
"""

# 输入参数配置区 - 修改这里的参数来生成不同的映射文件
SOURCE_PATH = "assets\kaleidoscope_lab\models\leave_me_alone_box"  # 源路径：指定帧动画的目录
TARGET_PATH = "assets\kaleidoscope_lab\items"  # 目标路径：生成模型映射文件的路径
FILE_NAME = "leave_me_alone_box"  # 文件名：映射文件的名字（不含.json后缀）
ANIMATION_LIST = ["open", "close1", "close2", "close3", "close4"]  # 动画列表：每个项代表一个动画
FALLBACK_MAPPING = None  # 回落映射：可选，表示在不播放动画时的模型
ANIMATION_INDEX = 0  # 动画索引：影响最外层index
FRAME_INDEX = 0  # 帧索引：影响内层帧对应的index
```


After completing the parameter filling and execution, the generated item model mapping file can be found in the corresponding target path.


## data pack management

The data pack is used to play the exported frame animation model mapping. Data pack provides three APIs:`sh:init`，`sh:start`,and`sh:end`. The remaining functions are internal functions and users do not need to know about them. \
When using this data pack, users need to first generate an item display entity that references the above model, and ensure that the referenced cmd serial number exists.

Use the display entity as the executor to execute parameter configuration and start playback instructions:

```mcfunction
#初始化所有参数
function sh:init

#在指定的storage指定参数
data modify storage sh:props data merge value {\
  id:"open",frames:5,type:2,anim_index:0,frame_index:0,\
  function:"kaleidoscope:lab/trans/leave_me_alone_box/roll_close"\
}

#执行开始动画函数
function sh:start
```


`sh:init`function is used to initialize all animation related parameters; \
The specified parameters are located in`sh:props data`In this storage, users need to use`data modify ... merge ...`The command merges parameters into it;\
`sh:start`Function is used to perform animation playback behavior according to the parameters after specifying the parameters.

### Parameters and explanations
All possible parameters, their types and explanations are as follows:
- `id`(string): String, indicating the animation played this time, corresponding to an item in ANIMATION_LIST;
- `frames`(int): Indicates the total number of frames of the animation, counting from 0, consistent with the frame animation number exported by the plug-in;
- `type`(enum int): The type of operation performed after the animation is played:
  - 1 means loop, reset to the first frame and play again;
  - 2 means simple stop, retain all parameters and stay at the last frame;
  - Other values ​​represent a reset, clearing all parameters and returning to the model represented by the fallback map.
- `anim_index`(int): animation index, same as ANIMATION_INDEX;
- `frame_index`(int): Frame index, same as FRAME_INDEX;
- `function`(string): Optional, callback function, a function executed with the model as the executor at the location of the model after the animation is played.
  - It can be a macro function, and the parameters are filled in directly after the function path, and the double quotes need to be escaped.
  - like:`{function:"foo:bar with entity @s data"}`

### Other api information
- functionapi：
  - `sh:init`function is used to initialize all animation related parameters;
  - `sh:start`Function is used to perform animation playback behavior according to the parameters after specifying the parameters.
  - `sh:end`The function is automatically called after the animation is completed. It can also be called in the middle of the animation to clear all parameters and return to the fallback mapping.
- **Read only data**:
  - Note: The data pack mechanism relies on these data to operate! Don't change these values ​​unless you are sure of the consequences of your actions!
  - `sh_frame`Scoreboard: Indicates the frame currently played by the model. You can read this value and perform operations such as playing sound effects;
  - `sh_max_frame`Scoreboard: Indicates the total number of frames of the current animation;
  - `sh_type`Scoreboard: Indicates the operations performed after the animation is played, corresponding to the parameters in`type`；
  - entity`data.sh_animation`Storage: Incoming parameters are stored here, data structures and`storage sh:props data`Exactly the same, animation id, etc. can be read here.
