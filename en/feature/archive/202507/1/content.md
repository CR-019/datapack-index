---
title: 'Better plot dialogue'
---
<FeaturedHead
    title = "better plot dialogue"
    authorName = "icuqALT10"
    resourceLink = 'https://b3logfile.com/file/2025/06/更好的对话框（数据包+资源包）-cywDG0h.zip'
    cover='../../../../../feature/archive/202507/_assets/1.png'
/>

Made based on /dialog ~~You can also call it galgame style dialog()~~

## How to use

You can customize a dialog with any vertical drawing, any name, any content, and any options according to the template.

### 1. Create a conversation object

First of all, this dialog is triggered by right-clicking on the interactive entity. So you just need to generate a file with "`dialog`"tag's interactive entity and edit the following content:`dialog_path`: the conversation content function pointed to

Other content can be modified at will. The example NPC is as follows:

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
Sample NPCs are also written in the data pack, which can be accessed through`/function icu:npcs/test`to generate

### 2. Edit basic dialogue function

After generating the dialogue object, we need to edit our own dialogue content

You need to edit a function in the following format and fill in the function path into the dialog_path in the previous step (the path is the /function callable function path)

```mcfunction
#Set name required
data modify storage icu:dialog dialog.name set value "name"

#Set up vertical painting Required fields
data modify storage icu:dialog dialog.char set value "lihui"

#Set conversation content. Required fields. No more than 23x5=115 Chinese characters.
data modify storage icu:dialog dialog.dialog set value "content"

#Set the option name. If not required, set it to an empty string.
data modify storage icu:dialog dialog.choose1 set value ""
data modify storage icu:dialog dialog.choose2 set value ""
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#Sound effect Required field The content is a complete /playsound command
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

#Don’t worry about calling function
function icu:dialog/main

#Disable clicking the "Previous" button. Optional. If you don't want or cannot let the player return to the previous conversation, just give it the following tag.
tag @s add dialog_not_up

#Disable clicking the "Next" button. Optional. If you don't want or cannot let the player go to the next dialogue, just give it the following tag.
tag @s add dialog_not_down
```
You can also unpack it yourself and view the examples I stuffed in the data pack (path:`data/icu/function/npcs/test/1`)

### 3. Set up and down dialogue function

The serial number of the dialogue is determined by the player's "`dialog_phase`"The scoreboard determines`dialog_not_up`The initial scoreboard is 1 point

When clicking the "Previous" button`dialog_phase`The scoreboard decreases by one when the "Next" button is clicked.`dialog_phase`Add one to the scoreboard (Note: If the current dialogue has not finished playing, clicking "Next" will give priority to playing the current dialogue directly instead of giving`dialog_phase`Scoreboard plus one)

If you don't want this conversation to jump to the previous or next conversation, you can add the "`dialog_not_up`"and"`dialog_not_down`"tag

According to the above format, you can write functions according to your own preferences

Note: When you need to apply the method in this chapter for multiple dialogue contents, you need to`dialog_path`The pointed function is changed to judgment`dialog_phase`The function of the scoreboard score is called the main function

Example:

```mcfunction
execute if score @s dialog_phase matches 1 run return run function icu:npcs/test/1

execute if score @s dialog_phase matches 2 run return run function icu:npcs/test/2
```
You can also unpack it yourself and view the examples I stuffed in the data pack (path:`data/icu/function/npcs/test/main`)

#### 4. Set options

Up to 4 options can be set (to create an option, you only need to fill in the option name into the corresponding string in the function edited in step 2)

The scoreboard for options is`dialog_choose_trigger`Options 1 to 4 will set the scoreboard to 1 to 4 points respectively.

At the same time, it was modified`dialog_choose_trigger`After the score, the data pack will automatically detect and jump to the function edited in the third step, and then pass`dialog_phase`The scoreboard again points to the dialogue function of the corresponding stage (i.e. the dialogue stage for which the option currently exists)

Therefore, you need to detect the`dialog_choose_trigger`If the score on the scoreboard is between 1 and 4, just terminate this function and jump to the dialogue content of the corresponding option.

You need to change it manually after the jump`dialog_phase`scoreboard scores

For example, if you start from`dialog_phase=2`Jumped to the dialogue function of "choose1", you can change it to`dialog_phase=100`Then click "Next",`dialog_phase`will become 101 points, and the corresponding`dialog_phase=101`dialogue function

Example:

The functionality of the conversation phase for which options currently exist

```mcfunction
#If there is an option
execute if score @s dialog_choose matches 1 run return run function icu:npcs/test/choose1
execute if score @s dialog_choose matches 2 run return run function icu:npcs/test/choose2

#Set name
data modify storage icu:dialog dialog.name set value "§a霞露零"

#Set up vertical painting
data modify storage icu:dialog dialog.char set value "xll"

#Set the conversation content to no more than 23x5=115 Chinese characters
data modify storage icu:dialog dialog.dialog set value "§f我是§a霞露零§f。"

#Set options
data modify storage icu:dialog dialog.choose1 set value "这是什么"
data modify storage icu:dialog dialog.choose2 set value "没事了"
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#Sound effects
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

#Disable next step
tag @s add dialog_not_down
```
choose1 option dialog function in the above function

```mcfunction
#Set name
data modify storage icu:dialog dialog.name set value "§a霞露零"

#Set up vertical painting
data modify storage icu:dialog dialog.char set value "xll"

#Set the conversation content to no more than 23x5=115 Chinese characters
data modify storage icu:dialog dialog.dialog set value "§f这是一个对话测试。"

#Set options
data modify storage icu:dialog dialog.choose1 set value ""
data modify storage icu:dialog dialog.choose2 set value ""
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#Sound effects
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

scoreboard players set @s dialog_phase 100

#Disable previous step
tag @s add dialog_not_up
```
The main function of the third step is the same as`dialog_phase=101`the function pointed to

```mcfunction
execute if score @s dialog_phase matches 1 run return run function icu:npcs/test/1
execute if score @s dialog_phase matches 2 run return run function icu:npcs/test/2

execute if score @s dialog_phase matches 101 run return run function icu:npcs/test/3
```


```mcfunction
#If there is an option
execute if score @s dialog_choose matches 1 run return run function icu:npcs/test/choose1
execute if score @s dialog_choose matches 2 run return run function icu:npcs/test/choose2

#Set name
data modify storage icu:dialog dialog.name set value "§a霞露零"

#Set up vertical painting
data modify storage icu:dialog dialog.char set value "xll"

#Set the conversation content to no more than 23x5=115 Chinese characters
data modify storage icu:dialog dialog.dialog set value "§f还有什么事吗？"

#Set options
data modify storage icu:dialog dialog.choose1 set value "这是什么"
data modify storage icu:dialog dialog.choose2 set value "没事了"
data modify storage icu:dialog dialog.choose3 set value ""
data modify storage icu:dialog dialog.choose4 set value ""

#Sound effects
data modify storage icu:dialog dialog.sound set value "playsound entity.experience_orb.pickup ambient @s ~ ~ ~ 5 1.5"

function icu:dialog/main

#Disable previous step
tag @s add dialog_not_up
```
## Vertical painting related

::: warning Problems related to vertical drawing pictures
Since the dialogue function is created by modifying the font image, the vertical drawing image needs to be saved at 231x256 pixels.
If your image meets the width of 231 pixels but there are no pixels in the leftmost and rightmost columns, you can click a black dot with 1% transparency in the leftmost and rightmost blank spaces, so that these two black dots will not be displayed in the game, and the image width also meets 231 pixels.
And you need to write the json file corresponding to the font in the resource pack.
:::

### How to use

#### Create json part

Please use any json file in the "\dialogresource pack\assets\photo\font\dialog\char\" folder as an example and create a json file in the current folder
Among them:`file`: The path pointing to the corresponding image rendering`height`: Height scaling of the image. After setting the image to 231x256 pixels, this item can only be 110.`ascent`: The vertical offset value of the image, >0 means upward offset, &lt;0 means downward offset
wiki details: &lt;https://zh.minecraft.wiki/w/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93#bitmap&gt;

#### Application section

In the text component point "font" to the custom font json file created above
For example: {"font":"photo:dialog/char/`your JSON file name`",text:" "}
If you create json according to the example I gave, that is, the "chars" list contains "\u0020", the spaces in the text cannot be omitted and there can only be one space.

## End

### Data pack and resource pack download

[Better dialogdata packresource pack.zip](https://b3logfile.com/file/2025/06/更好的对话框（数据包+资源包）-cywDG0h.zip)

Since I wrote it in a hurry and finished it in a hurry, the performance may be poor, and the tutorial will not be too detailed. Please forgive me.