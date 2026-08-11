---
title: 'My worldvanilla video player'
---
<FeatureHead
    title="My worldvanilla video player"
    authorName="Luo Fenglan_Sea"
	cover = '../../../../../feature/archive/202604/_assets/6.png'
	resourceLink= 'https://github.com/WindWavesSea/Minecraft-Vanilla-Video-Player/'
/>

::: tip see
[A little research on equipment mask (camera_overlay) - CR_019](/en/resources/dust/2/2-装备遮罩.md)
:::



## Directory

-[catalogue](#目录)
- [Preface](#序言)
	- [warn](#警告)
- [download](#下载)
- [Video Request](#视频要求)
	- [Use game acceleration to play 60-frame video](#使用加速游戏刻播放60帧视频)
	- [Play 60-frame video using frame insertion](#使用插帧播放60帧视频)
- [dialog](#对话框)
-[Configuration](#配置)
	- [Parameter analysis](#参数解析)
		- [frame\_zero](#frame_zero)
		- [frame](#frame)
		- [path](#path)
		- [name](#name)
		- [blender](#blender)
		- [blender\_name](#blender_name)
		- [frame\_rate](#frame_rate)
		- [sound](#sound)
		- [sound\_switch](#sound_switch)
		- [max\_frame](#max_frame)
		- [slot](#slot)
		- [resolution](#resolution)
			- [switch](#switch)
			- [default\_size](#default_size)
			- [size\_list](#size_list)
		- [language](#language)
			- [default\_language](#default_language)
			- [language translation text](#语言翻译文本)
	- [Example](#示例)
		- [Video playback configuration](#视频播放配置)
			- [Function](#function)
			- [resource pack configuration](#资源包配置)
		- [sounds.json](#soundsjson)
-[Principle](#原理)
-[Command](#指令)
	- [Play](#播放)
		- [Start playing](#开始播放)
	- [End playback](#终止播放)
	- [Pause play](#暂停播放)
	- [Continue playing](#继续播放)
	- [Delete playback settings of a single player](#删除单个玩家的播放设置)
	- [Delete all player playback settings](#删除所有玩家的播放设置)
	- [Delete single video configuration](#删除单一视频配置)
	- [Delete all video configurations](#删除所有视频配置)
- [About sequence pictures](#关于序列图片)
	- [How to export sequence images](#如何导出序列图片)
	- [Recommended size](#推荐尺寸)
-[Notes](#注意事项)



## Preface

Based on the data pack, this project provides a sequence of images played in vanillaMinecraft to achieve pseudo-playing video effects.

***

Data pack mainly has the following uses

- Automatically calculate frame rate and batch process frame files

- Provide adaptive frame rate to improve performance. Provide interface for quick configuration and playback of sequence pictures in resource pack.

Some **variables** are also provided for quickly adding [resource pack](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85) to achieve fast playback of sequence pictures

***

### Warning

This **data pack** uses the equipment head to trigger the equipment mask by default. If you don't want to use the head equipment bar, you can change it in dp (currently V2.0 requires this)

A transparent model has been added to the resource pack to provide equipment with mask items to achieve a "pseudo" effect of being playable without providing items.

> **Sequence pictures** refers to a set of picture files that save each frame of **video** or **animation** as an independent **static image file** and are arranged in sequence by frame number. It is often used in film and television post-production, 3D animation, special effects production and other fields. It is widely used because of its high cross-platform compatibility and lossless image quality.
>


## Download

You can go to [Modrinth](https://modrinth.com/datapack/vanilla-video-player/) and [Github](https://github.com/WindWavesSea/Minecraft-Vanilla-Video-Player/)Download this prepackage


## Video requirements

It needs to be a picture sequence (.png format)
***

### Use game acceleration to play 60 frames video

The best video is 20 frames. If you use 60 frames video, you need to change [tick](http://https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tick) is set to 60

```mcfunction
/tick rate 60
```
Set goal [game tick](https://zh.minecraft.wiki/w/%E5%88%BB?variant=zh-cn#%E6%B8%B8%E6%88%8F%E5%88%BB)rate.

***

### Use frame insertion to play 60-frame video

In the video configuration, frame_rate is the frame rate of the original video. If the video is 60 frames, it can be configured like this

```
frame_rate:60

```
## dialog

You can use the shortcut key G or open it in the game menu

Video playback must be opened using the **G key** or the **command**

```
dialog show @s animations:open_menu

```
Player needs to select video size
1920*1080 is 16:9
2560*1080 is 16:10

If you want to use the **video playback page**, please first select the language in **Language Settings**

## Configuration

<div class="nbttree">

<node type="compound" name="video_name"/> This is the data storage name (generally consistent with the name below)

- <node type="string" name="frame_zero" required=false /> Automatically processes video frames, no need to fill in by default, automatically fills in according to the number of frames during playback
- <node type="int" name="frame" required=true /> Frame number controls the item of the video frame currently played by the player.
- <node type="string" name="path" required=true /> Path specifies the location of the sequence image in the resource pack texture folder
- <node type="string" name="name" required=true /> Video name matches the name before the frame number
- <node type="bool" name="blender" required=true />Please turn this option on when using image sequences output by blender
- <node type="string" name="blender_name" required=false /> Please leave blank when using blender
- <node type="string" name="frame_rate" required=true /> Frame rate is used to customize the frame rate
- <node type="string" name="sound" required=false /> Video sound needs to be turned on to use sound_switch.
- <node type="bool" name="sound_switch" required=true /> Whether the sound is enabled
- <node type="string" name="max_frame" required=true /> Maximum number of frames
- <node type="string" name="slot" required=true /> Set the mask when the item is worn. This value should be one of: head, body, chest, feet, legs, mainhand, offhand, saddle.
- <node type="compound" name="resolution" required=true /> Video size
  - <node type="bool" name="switch" required=true /> Whether to enable this function
  - <node type="bool" name="default_size" required=true /> Default video size
  - <node type="compound" name="size_list" required=true /> Whether to enable the size
    - <node type="bool" name="1" required=true /> Whether to support 16:9 playback size
    - <node type="bool" name="2" required=true /> Whether to support 16:10 playback size
    - <node type="bool" name="3" required=true /> Whether to support 3:2 playback size
    - <node type="bool" name="4" required=true /> Whether to support 4:3 playback size- <node type="compound" name="language" required=true /> Video name display language
  - <node type="string" name="default_language" required=true /> Default display language (fill in the language code)
  - <node type="string" name="zh-cn" required=true /> Fill in the translation text, the same for other languages

</div>

### Parameter analysis

#### frame_zero

Check the change of the first picture, which is generally all 0s. Check how many 0s there are before the last 0, and write these 0s into frame_zero. For example, video0000.png should write 000 like this,
As follows

```
{frame_zero:"000"}

```
***

#### frame

Frames
Used to control the video frame (picture) currently played by the player
For example {frame:1}

***

#### path

path

Used to specify the item file location for video output
For example

```
{video:text_video/}

```
***

#### name

Video name
Used to match the name before the frame number, which needs to be consistent with the command storage name, that is, the name after video: **Note: If you use blender, please fill in blender_name according to the situation**
For example, video0000.png video in front of the number is the name, so it should be written like this here

```
{name:"video"}

```
It is recommended that the name be as short as possible (because macros are used, the fewer characters, the less performance consumption)

***

#### blender

Please turn this option on when using image sequences output by blender.

```
{blender:"true/false"}

```
***

#### blender_name

If you use blender, please leave it blank (if you don’t use blender, fill in unlimitedly)
**If there is a name before the frame number, please fill it in as mentioned in the video name above**

```
{blender_name:""}

```
***

#### frame_rate

Frame rate

Used for **custom frame rate**, **only supports server** use, server use needs to be set

```
function-permission-level=3

```
If ** it is not a server, you also need to fill in the actual frame rate of the video for adaptive frame rate **. If the server needs to use it, please ** enable it yourself in start/start_macros0$tick rate $(frame_rate) Just delete the hash sign**, **If you need to restore the game, please write \$tick rate 20** in stop.

***

#### sound

video sound
**Sound_switch needs to be turned on to use**
If the video has sound, you need to write the video sound playback defined by sounds.json here.
Reference[playsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/playsound?variant=zh-cn) to write

***

#### sound_switch

Is sound enabled?
Enter false/true to control whether the sound is turned on/whether the video needs to play sound

```
{sound_switch:"false/true"}

```
***

#### max_frame

Maximum number of frames
Maximum number of frames for video

***

#### slot

Equipment slot

Set the mask when the item is worn. This value should be one of: **head, body, chest, feet, legs, mainhand, offhand, saddle**

For details, see [equippable:camera_overlay](https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E7%BB%84%E4%BB%B6#equippable)
***

#### resolution

Video size settings

The video path should be
**path** filled in path/video size/picture sequence file
Such as

```
video:text_video/16:9/0001.png

```
##### switch

Whether to enable the multi-video size function (must support multiple video sizes to enable it)
(true/false)

##### default_size

Default size, fill in the numeric code, which is the key name of size_list

```
default_size:1

```
##### size_list

Whether to support the video size (true/false)
**ATTENTION!**
**1** represents **16:9**
**2** represents **16:10**
**3** stands for **3:2**
**4** stands for **4:3**
**Please do not enable options at will**

***

#### language

The language and text displayed by the video name in the dialog and the corresponding translation

##### default_language

Default language, the value is the following key name

```

    1:"en-us",
    2:"zh-cn",
    3:"zh-hk",
    4:"zh-mo",
    5:"zh-sg",
    6:"zh-tw",
    7:"en-au",
    8:"en-ca",
    9:"en-in",
    10:"en-gb",
    11:"fr-fr",
    12:"de-de",
    13:"ja",
    14:"kn",
    15:"es-es",
    16:"ar",
    17:"ko",
    18:"in-in"
```
The key name corresponds to the supported language code, which is the same as the language code mentioned below.

##### Language translation text

Should be filled in the language list
Follow the following format:
**Language code: "Translated text"**
For example:

```
en-us:"School"

```
***

### Example

#### Video playback configuration

##### Function

```mcfunction

data merge storage video:school \
{video:\
{frame_zero:"000",\
frame:"0",\
path:"animation:school/",\
name:"school",\
blender_name:"",\
frame_rate:"60",\
sound:"",\
sound_switch:false,\
max_frame:740,\
blender:true,\
slot:"head",\
resolution:{\
switch:false,\
default_size:1,\
size_list:{\
1:true,\
2:false,\
3:false,\
4:false\
}\
},\
language:{\
default_language:"en-us",\
en-us:"School",\
zh-cn:"学校"\
}\
}\
}

function animations:video_add/main with storage video:school video

```
**The last line of function must be written at the end of the configuration file, and the name after video: must be the same as the name value**

##### resource pack configuration

#### sounds.json

```json

 {
  "video_text":{
  "sounds":[
	{
	 "name": "animation:video/video_text",
	 "stream": true,
	 "volume": 0.8,
	 "weight": 1
	}
	]
	},
	"":{
	 "name": "",
	 "stream": true,
	 "volume": 0.8,
	 "weight": 1
	}
 }

```
Among them, **video_text** should be written in the sound configuration item

```
{sound:"video_text"}

```
You can add a lot of this configuration to add new video sounds
Below the case is a blank template

More configuration content can be seen

[**JAVA version sound event**](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%A3%B0%E9%9F%B3%E4%BA%8B%E4%BB%B6)

***

You can do this in [resource pack](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85) in the texture folder to create a new video folder named Video to store the image sequence

```
video/video_text/video0000.png

```


```
video/video_text/video....

```
If **namespace** is video
Then **path** can be written like this

```
{video:video/video_text}

```
## Principle

Can refer to

[A little research on equipment mask (camera_overlay)](https://vanillalibrary.mcfpp.top/datapack-index/resources/dust/2/2-%E8%A3%85%E5%A4%87%E9%81%AE%E7%BD%A9.html)

By CR_019


## Commands

### Play

***

#### Start playing

```
mcfunction
function animations:start {video_name:"video_name"}
```
**video_name** is the string written in the data above

***

### Terminate playback

```
mcfunction
function animations:stop
```
***

### Pause playback

```
mcfunction
function animations:pause
```
***

### Continue playing

```
mcfunction
function animations:continue_play
```
***

### Delete the playback settings of a single player

```
mcfunction
function animations:player_video_play/storages/delete/delete_player {name:"name"}
```
**name** is the player name

***

### Delete all player playback settings

```
mcfunction
function animations:player_video_play/storages/delete/all_storages/run
```
***

### Delete a single video configuration

```
mcfunction
function animations:video_list/delete_only {name:"name"}
```
**name** is the name in the video configuration item

***

### Delete all video configurations

```
mcfunction
function animations:video_list/delete_all
```
## About sequence pictures

### How to export sequence images

**Export PNG sequence diagram using Adobe Animate**
Steps:
Open the project you want to export.
Choose File > Export > Export Image Sequence.
Choose an export format (such as PNG) and set the file name and save location.
Click "Export" to finish.

***

**Use Premiere Pro to export sequence images**
Steps:
Open your project in Premiere Pro.
Select File > Share > Export Image Sequence.
In the pop-up window, select the export format (such as PNG, TIFF, etc.) and set relevant parameters.
Click "Export" to save the image sequence.

***

**Export image sequence using Apple Motion**
Steps:
Open your Motion project.
Select File > Share > Export Image Sequence.
In the Export Image Sequence window, select the desired export format and color space.
Click "Export" to finish.

***

**Export image sequence using Processing**
Steps:
Write code in Processing to process images.
Use the saveFrame("frame-####.png"); command to export the image sequence.
Run the program to generate a sequence of images.

***

**Export image sequence using Aseprite**
Steps:
Open your sprite file.
Select File > Export > Save As.
Enter a file name and select a file format (such as PNG), making sure the file name includes a number.
Click "Export" to save the image sequence.

>The above are several common software methods for exporting image sequences. You can choose the appropriate software and steps according to your needs.

***

### Recommended size

Since my world supports adaptive textures, it is recommended to export smaller-sized images to save hard disk space and reduce resource pack size.
It is recommended to export images with **960 * 540** size

## Notes

Due to the mojang Shishan code, the played pictures will always be in the memory and cannot be cleaned, which can easily trigger the problem of memory explosion. It is not recommended to use it when the memory is too small.
Bug:[MC-277837](https://bugs.mojang.com/browse/MC/issues/MC-277837)
