# 我的世界原版视频播放器

[English](README/README_en.md) [简体中文](README.md)
> by 洛风澜_Sea(WindWaves_Sea)
>
> 本文亦发布于作者[Blog](https://blog.windwaves.top/post/minecraft_vanilla_video_player)和[B站专栏](https://www.bilibili.com/opus/1182083830058582057)以及此项目的[GitHub](https://github.com/WindWavesSea/Minecraft-Vanilla-Video-Player/)仓库
>
***

## 目录

- [我的世界原版视频播放器](#我的世界原版视频播放器)
	- [目录](#目录)
	- [序言](#序言)
		- [警告](#警告)
	- [下载](#下载)
	- [视频要求](#视频要求)
		- [使用加速游戏刻播放60帧视频](#使用加速游戏刻播放60帧视频)
		- [使用插帧播放60帧视频](#使用插帧播放60帧视频)
	- [对话框](#对话框)
	- [配置](#配置)
		- [参数解析](#参数解析)
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
				- [语言翻译文本](#语言翻译文本)
		- [示例](#示例)
			- [视频播放配置](#视频播放配置)
				- [Function](#function)
				- [资源包配置](#资源包配置)
			- [sounds.json](#soundsjson)
	- [原理](#原理)
	- [指令](#指令)
		- [播放](#播放)
			- [开始播放](#开始播放)
		- [终止播放](#终止播放)
		- [暂停播放](#暂停播放)
		- [继续播放](#继续播放)
		- [删除单个玩家的播放设置](#删除单个玩家的播放设置)
		- [删除所有玩家的播放设置](#删除所有玩家的播放设置)
		- [删除单一视频配置](#删除单一视频配置)
		- [删除所有视频配置](#删除所有视频配置)
	- [关于序列图片](#关于序列图片)
		- [如何导出序列图片](#如何导出序列图片)
		- [推荐尺寸](#推荐尺寸)
	- [注意事项](#注意事项)

***

## 序言

本项目基于数据包提供了一个在原版Minecraft中播放序列图片实现伪播放视频效果

***

数据包主要有以下用途

- 自动化计算帧率、批量处理帧文件

- 提供自适应帧率以提升性能 提供接口用于快速配置，播放资源包中的序列图片

也提供了一些**变量**用于快速添加[资源包](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85)中的序列图片实现快速播放

***

### 警告

此**数据包**默认使用装备头部来触发装备遮罩，如果不想使用头部装备栏可以自行在dp中更改(目前V2.0需要这样做)

资源包中添加了一个透明模型用于给与装备遮罩物品来达到"伪"无物品给与即可播放的效果

> **序列图片**指将**视频**或**动画**的每一帧保存为独立的**静态图像文件**，并按帧序号顺序排列的一组图片文件。它常用于影视后期、3D 动画、特效制作等领域，因其跨平台兼容性高、画质无损而被广泛采用。
>

***

## 下载

可以前往[Modrinth](https://modrinth.com/datapack/vanilla-video-player/)和[Github](https://github.com/WindWavesSea/Minecraft-Vanilla-Video-Player/)下载此前置包

***

## 视频要求

需要为图片序列(.png格式）
***

### 使用加速游戏刻播放60帧视频

视频最好为20帧的，如果使用60帧的视频需要将[tick](http://https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tick)设置为60

```Minecraft_Command
/tick rate 60
```

设置目标[游戏刻](https://zh.minecraft.wiki/w/%E5%88%BB?variant=zh-cn#%E6%B8%B8%E6%88%8F%E5%88%BB)速率。

***

### 使用插帧播放60帧视频

视频配置中frame_rate是原视频帧率，如果视频为60帧可以这样配置

```frame_rate:60```

***

## 对话框

可以使用快捷键G或者在游戏菜单打开

视频播放必须使用**G键**或者使用**指令**打开
```dialog show @s animations:open_menu```

玩家需要选择视频尺寸
1920*1080为16:9
2560*1080为16:10

如果要使用**视频播放页面**请先在**语言设置**中选择语言

## 配置

<div class="nbttree">

<node type="compound" name="video_name"/> <br>这是data storage命名(一般与下文的name保持一致)

- <node type="string" name="frame_zero" required=false /> <br>自动处理视频帧，默认不用填写，播放时自动根据帧数填写
- <node type="int" name="frame" required=true /> <br>帧数 控制玩家目前播放的视频帧的物品
- <node type="string" name="path" required=true /> <br>路径 指定序列图片在资源包纹理文件夹的位置
- <node type="string" name="name" required=true /> <br>视频名称 匹配帧号前的名称
- <node type="bool" name="blender" required=true /><br>使用blender输出的图片序列请开启此选项
- <node type="string" name="blender_name" required=false /> <br>使用blender请留空
- <node type="string" name="frame_rate" required=true /> <br>帧率 用于自定义帧率
- <node type="string" name="sound" required=false /> <br>视频声音 需要开启sound_switch才能使用
- <node type="bool" name="sound_switch" required=true /> <br>声音是否启用
- <node type="string" name="max_frame" required=true /> <br>最大帧数
- <node type="string" name="slot" required=true /> <br>设置物品穿戴在哪时启用遮罩<br>此值应为:head,body,chest,feet,legs,mainhand,offhand,saddle其中之一
- <node type="compound" name="resolution" required=true /> <br>视频尺寸
- - <node type="bool" name="switch" required=true /> <br>是否开启此功能
- - <node type="bool" name="default_size" required=true /> <br>默认视频尺寸
- - <node type="compound" name="size_list" required=true /> <br>是否启用一下尺寸
- - - <node type="bool" name="1" required=true /> <br>是否支持16:9的播放尺寸
- - - <node type="bool" name="2" required=true /> <br>是否支持16:10的播放尺寸
- - - <node type="bool" name="1" required=true /> <br>是否支持3:2的播放尺寸
- - - <node type="bool" name="1" required=true /> <br>是否支持4:3的播放尺寸
- <node type="compound" name="language" required=true /> <br>视频名称显示语言
- - <node type="string" name="default_language" required=true /> <br>默认显示语言(填写语言代码)
- - <node type="string" name="zh-cn" required=true /> 填写翻译文本，其它语言也相同

</div>

### 参数解析

#### frame_zero

查看第一个图片的变化一般为全0，查看最后一个0前面有几个0，将这些0写到frame_zero里，如video0000.png应该将000写如，
如下

```{frame_zero:"000"}```

***

#### frame

帧数
用来控制玩家目前播放的视频帧(图片)
例如{frame:1}

***

#### path

路径

用来指定视频输出的物品文件位置
例如

```{video:text_video/}```

***

#### name

视频名称
用来匹配帧号前的名称,需要和命令存储名称一致即video:后面的名称**注意: 如果使用blender请按照情况填写blender_name**
例如 video0000.png 数字前面的video就是名称，因此此处应该这样写

```{name:"video"}```

名称建议越短越好(因为使用宏，字符越少性能消耗越少)

***

#### blender

使用blender输出的图片序列请开启此选项
```{blender:"true/false"}```

***

#### blender_name

使用blender请留空(不用blender无限填写)
**如果帧号前有名称请按照上方视频名称提到的方式填写**
```{blender_name:""}```

***

#### frame_rate

帧率

用于**自定义帧率**, **只支持服务器**使用，服务器使用需要设置
```function-permission-level=3```
如果**不是服务器也需要填写视频实际帧率用于自适应帧率**，如果服务器需要使用请**自行在start/start_macros0开启$tick rate $(frame_rate)将井号删除即可**，**如果需要还原游戏刻请在stop里写上\$tick rate 20**

***

#### sound

视频声音
**需要开启sound_switch才能使用**
如果视频有声音需要在此写上sounds.json定义的视频声音播放
参考[playsound](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/playsound?variant=zh-cn)来写

***

#### sound_switch

声音是否启用
输入false/true来控制声音是否开启/视频是否需要播放声音
```{sound_switch:"false/true"}```

***

#### max_frame

最大帧数
视频的最大帧数

***

#### slot

装备槽

设置物品穿戴在哪时启用遮罩此值应为:**head,body,chest,feet,legs,mainhand,offhand,saddle**其中之一

详情可看[equippable:camera_overlay](https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E7%BB%84%E4%BB%B6#equippable)
***

#### resolution

视频尺寸设置

视频路径应为
**path**填写的路径/视频尺寸/图片序列文件
如
```video:text_video/16:9/0001.png```

##### switch

是否开启多视频尺寸功能(必须要支持多视频尺寸才能开启)
(true/false)

##### default_size

默认尺寸，填写数字代号即size_list的键名
```default_size:1```

##### size_list

是否支持其中的视频尺寸(true/false)
**注意!**
**1**代表的是**16:9**
**2**代表的是**16:10**
**3**代表的是**3:2**
**4**代表的是**4:3**
**请勿随便开启选项**

***

#### language

在dialog中视频名称显示的语言文字以及对应的翻译

##### default_language

默认语言，值为以下的键名
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

键名后面对应的是支持的语言代码，和下文提到的语言代码相同

##### 语言翻译文本

应该在language列表中填写
按照以下格式:
**语言代码:"翻译文本"**
例如:```en-us:"School"```

***

### 示例

#### 视频播放配置

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

**最后一行function必须在配置文件结尾写，且video:后面的命名必须和name值相同**

##### 资源包配置

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

其中**video_text**应写在sound配置项中

```{sound:"video_text"}```

你可以添加很多这种配置来添加新的视频声音
事例下方为空白模板

更多配置内容可以看

[**JAVA版声音事件**](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%A3%B0%E9%9F%B3%E4%BA%8B%E4%BB%B6)

***

你可以在[资源包](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85)内的材质文件夹里新建一个名为Video的视频文件夹存放图片序列

```video/video_text/video0000.png```

```video/video_text/video....```

如果**命名空间**为video
那么**path**可以这样写
```{video:video/video_text}```

***

## 原理

可以参考

[装备遮罩（camera_overlay）的一点研究](https://vanillalibrary.mcfpp.top/datapack-index/resources/dust/2/2-%E8%A3%85%E5%A4%87%E9%81%AE%E7%BD%A9.html)

By CR_019

***

## 指令

### 播放

***

#### 开始播放

```Minecraft_Command
/function animations:start {video_name:"video_name"}
```

**video_name**就是上文data中写入的字符串

***

### 终止播放

```Minecraft_Command
/function animations:stop
```

***

### 暂停播放

```Minecraft_Command
/function animations:pause
```

***

### 继续播放

```Minecraft_Command
/function animations:continue_play
```

***

### 删除单个玩家的播放设置

```Minecraft_Command
/function animations:player_video_play/storages/delete/delete_player {name:"name"}
```

**name**为玩家名

***

### 删除所有玩家的播放设置

```Minecraft_Command
/function animations:player_video_play/storages/delete/all_storages/delete
```

***

### 删除单一视频配置

```Minecraft_Command
/function animations:video_list/delete_only {name:"name"}
```

**name**为视频配置项中的name

***

### 删除所有视频配置

```Minecraft_Command
/function animations:video_list/delete_all
```

***

## 关于序列图片

### 如何导出序列图片

**使用Adobe Animate导出PNG序列图**
步骤:
打开您要导出的项目。
选择“文件”>“导出”>“导出图像序列”。
选择导出格式（如PNG）并设置文件名和保存位置。
点击“导出”以完成操作。

***

**使用Premiere Pro导出序列图片**
步骤:
在Premiere Pro中打开您的项目。
选择“文件”>“共享”>“导出图像序列”。
在弹出的窗口中选择导出格式（如PNG、TIFF等）并设置相关参数。
点击“导出”以保存图像序列。

***

**使用Apple Motion导出图像序列**
步骤:
打开您的Motion项目。
选择“文件”>“共享”>“导出图像序列”。
在“导出图像序列”窗口中，选择所需的导出格式和色彩空间。
点击“导出”以完成操作。

***

**使用Processing导出图像序列**
步骤:
在Processing中编写代码以处理图像。
使用saveFrame("frame-####.png");命令导出图像序列。
运行程序以生成图像序列。

***

**使用Aseprite导出图像序列**
步骤:
打开您的精灵文件。
选择“文件”>“导出”>“另存为”。
输入文件名并选择文件格式（如PNG），确保文件名包含编号。
点击“导出”以保存图像序列。

>以上是几种常见软件导出图像序列的方法，您可以根据自己的需求选择合适的软件和步骤进行操作。

***

### 推荐尺寸

由于我的世界支持自适应纹理，推荐导出较小尺寸的图片以节约硬盘空间减小资源包大小
推荐导出**960 * 540**大小的图片

***

## 注意事项

由于mojang石山代码，导致播放完的图片会一直在内存中无法清理，容易触发爆内存的问题，不建议在内存过小的情况下使用
Bug:[MC-277837](https://bugs.mojang.com/browse/MC/issues/MC-277837)
