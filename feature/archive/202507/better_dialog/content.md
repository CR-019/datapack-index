<FeatureHead
    title = '更好的对话框'
    authorName = icuqALT10
    avatarUrl = '../../_authors/xxx.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/286192403' }
    ]"
    resourceLink = 'https://b3logfile.com/file/2025/06/更好的对话框（数据包+资源包）-cywDG0h.zip/'
    cover='icon.png'
/>

基于/dialog制作 ~~你也可以叫他galgame式对话框（）~~

## 使用方法

根据模板即可自定义一个 任意立绘、任意名称、任意内容、任意选项 的对话框

### 1. 创建一个对话对象

首先，本对话框的触发采用的是与交互实体右键。因此你只需要在合适的地方生成一个带有“`dialog`”标签的交互实体，并编辑以下内容即可：

`dialog_path`：指向的对话内容函数

其他内容可任意修改，示例npc如下：

```mcfunction
summon villager ~ ~ ~ \
{\
    CustomName:{"translate":"npc"},\
    Passengers:[\
        {id:"interaction",Tags:["dialog"],height:-0.7,width:1,response:1b,\
            data:{\
            \
                dialog_path:"icu:npcs/test/main"\
            \
            }\
        },\
        {id:"text_display",transformation:{scale:[1f,1f,1f],translation:[0f,0.2f,0f],right_rotation:[0f,0f,0f,1f],left_rotation:[0f,0f,0f,1f]},alignment:center,billboard:center,\
            \
            text:{"translate":"npc"}\
            \
        }\
    ]\
}

```

数据包中也写了示例npc，可通过`/function icu:npcs/test`来生成

### 2. 编辑基础对话函数

生成完对话对象后，就需要编辑我们自己的对话内容了

你需要按照以下格式编辑一个函数，并将函数路径填写至上一步中的dialog_path中（路径为 /function 可调用的函数路径）

```mcfunction
#设置名字		必填项
data modify storage icu:dialog dialog.name set value "name"

#设置立绘		必填项
data modify storage icu:dialog dialog.char set value "lihui"

#设置对话内容		必填项   不超过23x5=115个汉字
data modify storage icu:dialog dialog.dialog set value "content"

#设置选项名称		选填项 不需要的话设置为空字符串即可
data modify storage icu:dialog dialog.choose1 set value ""
data modify storage icu:dialog dialog.choose2 set value ""
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#音效			必填项 内容为一个完整的/playsound指令
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

#调用函数		不用管
function icu:dialog/main

#禁止点击“上一步”按钮	选填项 若不想或无法让玩家返回到上一段对话，给予以下tag即可
tag @s add dialog_not_up

#禁止点击“下一步”按钮	选填项 若不想或无法让玩家跑到下一段对话，给予以下tag即可
tag @s add dialog_not_down
```

你也可以自行拆包查看我在数据包中塞的示例（路径：`data/icu/function/npcs/test/1`）

### 3. 设置上下对话函数

对话的序号由玩家的“`dialog_phase`”计分板决定

`dialog_not_up`计分板初始为1分

点击“上一步”按钮时 `dialog_phase`计分板减一，点击“下一步”按钮时 `dialog_phase`计分板加一（注：若当前对话未播放完，点击“下一步”会优先将本次对话直接播放完 而不是给 `dialog_phase`计分板加一）

若你不想让本次对话能跳到上一段或下一段对话，可为玩家添加前文所说的“`dialog_not_up`”与“`dialog_not_down`”标签

按照以上格式你可以凭自己喜好来写函数

注意：当你有多段对话内容的需要而应用本章的方法时，你需要将 `dialog_path`指向的函数改为判断 `dialog_phase`计分板分数的函数，称之为主函数

示例：

```mcfunction
execute if score @s dialog_phase matches 1 run return run function icu:npcs/test/1

execute if score @s dialog_phase matches 2 run return run function icu:npcs/test/2
```

你也可以自行拆包查看我在数据包中塞的示例（路径：`data/icu/function/npcs/test/main`）

#### 4. 设置选项

选项最多可设置4个（创建选项只需要在第2步中所编辑的函数里将选项名填写到对应字符串中即可）

选项的计分板为 `dialog_choose_trigger`第1到第4个选项分别会将此计分板设置为1到4分

同时在修改了 `dialog_choose_trigger`的分数后，数据包会自动检测并跳跃至第三步所编辑的函数中，而后通过 `dialog_phase`计分板再次指向对应阶段的对话函数（即当前存在选项的对话阶段）

因此，你需要在对应的对话阶段的函数中，检测 `dialog_choose_trigger`计分板的分数是否在1到4之间，终止本函数并跳转至对应选项的对话内容即可

跳转后你需要手动更改 `dialog_phase`计分板的分数

比如你从 `dialog_phase=2`跳转到了 “choose1”的对话函数，你可以将其改为 `dialog_phase=100`

而后点击“下一步”后， `dialog_phase`会变为101分，并检测对应 `dialog_phase=101`的对话函数

示例：

当前存在选项的对话阶段的函数

```mcfunction
#如果有选项
execute if score @s dialog_choose matches 1 run return run function icu:npcs/test/choose1
execute if score @s dialog_choose matches 2 run return run function icu:npcs/test/choose2

#设置名字
data modify storage icu:dialog dialog.name set value "§a霞露零"

#设置立绘
data modify storage icu:dialog dialog.char set value "xll"

#设置对话内容   不超过23x5=115个汉字
data modify storage icu:dialog dialog.dialog set value "§f我是§a霞露零§f。"

#设置选项
data modify storage icu:dialog dialog.choose1 set value "这是什么"
data modify storage icu:dialog dialog.choose2 set value "没事了"
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#音效
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

#禁止下一步
tag @s add dialog_not_down
```

上述函数中的choose1选项对话函数

```mcfunction
#设置名字
data modify storage icu:dialog dialog.name set value "§a霞露零"

#设置立绘
data modify storage icu:dialog dialog.char set value "xll"

#设置对话内容   不超过23x5=115个汉字
data modify storage icu:dialog dialog.dialog set value "§f这是一个对话测试。"

#设置选项
data modify storage icu:dialog dialog.choose1 set value ""
data modify storage icu:dialog dialog.choose2 set value ""
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#音效
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

scoreboard players set @s dialog_phase 100

#禁止上一步
tag @s add dialog_not_up
```

第三步的主函数 与 `dialog_phase=101`所指向的函数

```mcfunction
execute if score @s dialog_phase matches 1 run return run function icu:npcs/test/1
execute if score @s dialog_phase matches 2 run return run function icu:npcs/test/2

execute if score @s dialog_phase matches 101 run return run function icu:npcs/test/3
```

```mcfunction
#如果有选项
execute if score @s dialog_choose matches 1 run return run function icu:npcs/test/choose1
execute if score @s dialog_choose matches 2 run return run function icu:npcs/test/choose2

#设置名字
data modify storage icu:dialog dialog.name set value "§a霞露零"

#设置立绘
data modify storage icu:dialog dialog.char set value "xll"

#设置对话内容   不超过23x5=115个汉字
data modify storage icu:dialog dialog.dialog set value "§f还有什么事吗？"

#设置选项
data modify storage icu:dialog dialog.choose1 set value "这是什么"
data modify storage icu:dialog dialog.choose2 set value "没事了"
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#音效
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

#禁止上一步
tag @s add dialog_not_up
```

## 立绘相关

::: warning 立绘图片相关问题
由于对话功能是靠修改字体图片来制作，所以 立绘图片 需要按照231x256像素来保存
若你的图片满足了 231像素宽度 但是最左与最右边的一列都没有像素，你可以在最左与最右侧空白处均点上一个1%透明度的黑点，这样在游戏中不会显示这两个黑点，并且图片宽度也满足231像素
并且需要在资源包中自己写字体对应的json文件
:::

### 使用方式

#### 创建json部分

请根据“\对话框资源包\assets\photo\font\dialog\char\”文件夹中的任意一个json文件为示例，并在当前文件夹中创建一个json文件
其中：
`file`：指向对应的图片立绘的路径
`height`：图片的高度缩放，在按照231x256像素设置图片后此项只能为110
`ascent`：图片的垂直偏移值，>0则向上偏移，<0则向下偏移
wiki详情：<https://zh.minecraft.wiki/w/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93#bitmap>

#### 应用部分

在文本组件中将“font”指向上述创建的自定义字体json文件
例如：{"font":"photo:dialog/char/`你的json文件名`",text:" "}
若你是按照我给出的示例创建的json，即”chars“列表中包含“\u0020”，则text中的空格不可省略且只能有一个空格

## 结尾

### 数据包与资源包下载

[更好的对话框数据包资源包.zip](https://b3logfile.com/file/2025/06/更好的对话框（数据包+资源包）-cywDG0h.zip)

由于是匆匆忙忙地写匆匆忙忙地做，性能上可能会比较差，以及教程不会太详细，还请见谅
