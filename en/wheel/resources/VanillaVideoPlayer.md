---
name: Vanilla Video Player
author:
    -
        name: Luo Fenglan_Sea
        char: author
description: Video playback front-end based on data pack and resource pack
tags: [video,GUI]
version: "2.0"
gameversion: [1.21.11+]
aside: left
wheel: true
repo: WindWavesSea/Minecraft-Vanilla-Video-Player
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

The following usage instructions may not be the latest, please refer to the documentation in Github.

## Instructions for use
### Video requirements
-  Use accelerated gaming to play 60fps video
-  Use frame insertion to play 60-frame video

### Configuration in data pack
- Parameter analysis
###	principle

## Video requirements

It needs to be a picture sequence (.png format)

### Play 60fps video using game acceleration ###

The best video is 20 frames. If you use 60 frames video, you need to change [tick](http://https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/tick) is set to 60

    /tick rate 60
Set goal [game tick](https://zh.minecraft.wiki/w/%E5%88%BB?variant=zh-cn#%E6%B8%B8%E6%88%8F%E5%88%BB)rate.

### Use frame insertion to play 60-frame video ###

In the video configuration, frame_rate is the frame rate of the original video. If the video is 60 frames, it can be configured like this

    frame_rate:60

## Configuration in data pack
### Parameter analysis
#### frame_zero
Check the change of the first picture, which is generally all 0s. Check how many 0s there are before the last 0, and write these 0s into frame_zero. For example, video0000.png should write 000 like this,
as follows
     {frame_zero:"000"}
#### frame(number of frames)
Used to control the video frame (picture) currently played by the player
For example {frame:1}
#### path
Used to specify the item file location for video output
For example
     {video:text_video/}

#### name (video name)
Used to match the name before the frame number, **Note: If you use blender, please fill in blender_name according to the situation**
For example, video0000.png video in front of the number is the name, so it should be written like this here
     {name:"video"}
It is recommended that the shorter the name, the better (because macros are used, the fewer characters, the less performance consumption)

#### blender
Please turn this option on when using image sequences output by blender.
	{blender:"true/false"}

#### blender_name
If you use blender, please leave it blank (if you don’t use blender, fill in unlimitedly)
**If there is a name before the frame number, please fill it in as mentioned in the video name above**
	{blender_name:""}

#### frame_rate(frame rate)
Used for **custom frame rate**, **only supports server** use, server use needs to be set
       function-permission-level=3
If ** it is not a server, you also need to fill in the actual frame rate of the video for adaptive frame rate **. If the server needs to use it, please ** enable it yourself in start/start_macros0$tick rate $(frame_rate) Just delete the account**, **If you need to restore the game, please write $tick rate 20 in stop**
#### sound(video sound)
**Sound_switch needs to be turned on to use**
If the video has sound, you need to write the video sound playback defined by sounds.json here. Please refer to playsound to write it.
#### sound_switch (whether sound is enabled)
Enter false/true to control whether the sound is turned on/whether the video needs to play sound {sound_switch:"false/true"}
#### max_frame (maximum number of frames)
Maximum number of frames for video

### Example
#### Video playback configuration
##### Function
```mcfunction
    data merge storage video:video_text \
	{\
	frame_zero:"000",\
	frame:"0",\
	path:"animation:video_text/",\
	name:"video",\
	frame_rate:"60",\
	sound:"animation:video_text",\
	sound_switch:true,\
	max_frame:6739,\
	blender:"false",\
	blender_name:"",\
	}

	scoreboard players set #video_text video_frame 6739
```
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

	{sound:"video_text"}

You can add a lot of this configuration to add new video sounds
Below the case is a blank template

More configuration content can be seen
[JAVA version sound event](https://zh.minecraft.wiki/w/Java%E7%89%88%E5%A3%B0%E9%9F%B3%E4%BA%8B%E4%BB%B6)

You can do this in [resource pack](https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85) in the texture folder to create a new video folder named Video to store the image sequence
     video/video_text/video0000.png
     video/video_text/video....
If **namespace** is video
Then **path** can be written like this
     {video:video/video_text}

## principle
### **You can refer to it**

### A little research on equipment mask (camera_overlay)

##### by CR_019

[Click to view](https://vanillalibrary.mcfpp.top/datapack-index/resources/dust/2/2-%E8%A3%85%E5%A4%87%E9%81%AE%E7%BD%A9.html)

# instruction

## play

### Use /function to play

	/function animations:start {video_name:"video_name"}

### video_name is the string written in the data above

## Terminate playback
	/function animations:stop

## Pause playback
	/function animations:pause

## continue playing
	/function animations:continue_play

## Delete the playback settings of a single player
	function animations:player_video_play/storages/delete/delete_player {name:"name"}

**name** is the player name

## Delete all player playback settings
	function animations:player_video_play/storages/delete/all_storages/delete
