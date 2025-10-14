---
title: '文本动画资源库'
---

<FeatureHead
    title = '文本动画资源库'
    authorName = CoolGaston
    avatarUrl = '../../_authors/CoolGaston.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/648638421' }
    ]"
    resourceLink = 'https://www.bilibili.com/video/BV1Jra8zUEVQ'
    cover='../_assets/7.png'
/>



“文本动画资源库”是基于展示实体、title命令，以纯指令驱动运行的数据包模组。

支持版本：minecraft java edition 1.21.6+

[Demonstrate](https://www.bilibili.com/video/BV1Jra8zUEVQ)

## 动画展示

### 展示实体动画

![20250913mp4.gif](https://b3logfile.com/file/2025/09/2025-09-13mp4-P9dogvL.gif)

### title栏动画

![202509132mp4.gif](https://b3logfile.com/file/2025/09/2025-09-13-2mp4-xDtlBeG.gif)

> 快来制作属于你自己的剧情动画吧！

## 使用方法

### 安装Special Texts 特效字体资源库

> **最新版本V2.0**
> 
> [下载链接 https://wwql.lanzout.com/iEJlQ3639fre](https://wwql.lanzout.com/iEJlQ3639fre)
> 
> 安装到存档请见[Minecraft Wiki 数据包-使用](https://zh.minecraft.wiki/w/数据包#使用)

---

### 使用方法

* **生成文字**
  * 确定执行维度、位置与朝向
    * `execute in xxx at/positioned xxx rotated/facing xxx`
  * 选择模板函数（详见下文）preload指令，使用参数组件：初始化+投射title文字或生成实体
    * `run function textanimation:xxx/preload {}`
* 如需结束全部文本展示实体文字，使用function textanimation:killall，或者在进入游戏的面板中点击清除全部文字动画

### 模板说明

**每个模板都有特定的组件，不可以缺失参数！！！**

**文本展示实体模板**（此处英文名称即为上文所说xxx/preload的名称）

* **fade**
  
  * 基础淡入淡出（基础组件）
* **cener_diffuse**
  
  * 基础中心扩散淡入淡出（基础组件）
* **step_diffuse**
  
  * 中心打字机（基础组件）
* **print**
  
  * 打字机效果（打字机组件）
* **print2**
  
  * 打字机效果+退格消失（打字机组件）
* **print3**
  
  * 打字机效果+双向退格消失（打字机组件）
* **cener_diffuse_more**
  
  * 中心扩散淡入淡出（详细组件）
* **slidedown**
  
  * 自上下滑效果（详细组件）
* **slideup**
  
  * 自下上滑效果（详细组件）
* **sliderandom**
  
  * 自右向左滑效果（详细组件）
* **slideleft**
  
  * 随机滑动效果（详细组件）
* **increase**
  
  * 自小扩大效果（详细组件）
* **increase2**
  
  * 自小扩大，随后落地（详细组件）
* **turnover**
  
  * 翻页效果（详细组件）

**title栏模板**

* **printer_more**
  
  * 动作栏打字机效果（title组件）
* **printer_title**
  
  * 标题栏打字机效果（title组件）
* **printer_subtitle**
  
  * 副标题栏打字机效果（subtitle组件）

**记分板模板**

* **scoreboardprinter**
  
  * 记分板打字机效果（记分板组件）

### 组件说明

* **基础组件**
  * `{text:"字符串",color:"颜色",time:持续的游戏刻一半}`
* **详细组件**
  * `{text:'[{文本组件}]',time:持续的游戏刻,scale:缩放大小（不缩放为1）,sound:声音序号(须在print/sounds文件自定义,否则为0),speed:动画速度（默认为100，越大越快）}`
* **打字机组件**
  * `{text:'[{文本组件}]',time:持续的游戏刻,scale:缩放大小（不缩放为1）,length:最大横向长度（仅打印机效果可使用）,sound:声音序号(须在print/sounds文件自定义,否则为0),speed:动画速度（默认为100，越大越慢）}`
* **title组件**
  * `{text:'[{文本组件}]',sound:声音序号(须在print/sounds文件自定义,否则为1)}`
* **subtitle组件**
  * `{text:'[{文本组件}]',sound:声音序号(须在print/sounds文件自定义,否则为1),title:【0或1】(0表示subtitle打字时无正在播放的title，1表示subtitle打字时正在播放title)}`
* **记分板组件**
  * `{text:'[{文本组件}]',sound:声音序号(须在print/sounds文件自定义,否则默认为0)}`

### 文本组件生成

* 快捷生成工具

> 加载数据包进入游戏后，系统提示可以点击获取文本组件生成工具，或者使用/function textanimation:001trigger获得。将需要转化的文本写在第一页，颜色写在第二页即可快速生成文本组件列表，将文本复制后直接写入text:'[*这里*]'中便可加载函数。

* 更全面的生成工具

> 有能力者可以自行编写用于分离每个字符并将其写入一个花括号包围的文本组件中，同时每个字符的颜色、特殊效果（下划线、加粗……）、背景色均可自定义，甚至可以为翻译组件或实体nbt组件等等。
> 
> 若仍需快速生成文本组件，可以使用在线网站[渐变文字生成器](https://mcg.tuanzi.ink/)，需要同样颜色将初始色与结束色设置为同一色号即可！

### 自定义音效

在每种动画的函数文件夹的sounds.mcfunction中，可以仿照已有指令编写新的声音，以下是实例：

> 在turnover动画增加拾起经验球的音效，作为声音序号2，可以写下指令
```mcfunction
execute if score @s textanimation_sound matches 2 as @a at @s run playsound minecraft:item.bundle.drop_contents master @a ~ ~ ~ 0.8 1.4 0.4
```

随后在游戏中调用函数`textanimation:turnover/preload {sounds:2……}`，sounds对应的值即为检测新增音效定义的记分板的值

* 每种动画的声音都是相互独立的，所以请务必确保在相应的sounds文件中添加了音效，否则无法播放声音！！！

### 使用实例

* 在面前2格生成面朝自己的白色字符Hello（使用slidedown模板，无缩放，无加速，无特殊音效）

```mcfunction
execute anchored eyes positioned ^ ^ ^2 facing entity @s eyes run function textanimation:slidedown/preload {text:'[{text:"H",color:"white"},{text:"e",color:"white"},{text:"l",color:"white"},{text:"l",color:"white"},{text:"o",color:"white"}]',time:170,scale:1,sound:0,speed:100}
```

* 在title栏生成金色字符Title（使用printer_title模板）

```mcfunction
function textanimation:print_title/preload {text:'[{text:"H",color:"gold"},{text:"e",color:"gold"},{text:"l",color:"gold"},{text:"l",color:"gold"},{text:"o",color:"gold"}]',time:170,scale:1,sound:0}
```

![演示视频](https://b3logfile.com/file/2025/09/2025-09-13-3mp4-n5mhYBi.gif)

## 设计思路

### 灵感来源

> PowerPoint 文字播放
> Aftereffect 动画字幕

### 设计参考

> 在Minecraft中製作出屬於自己的📚劇情📚！对话生成器——纸圆Paper[对话生成器v2](https://www.youtube.com/watch?v=I-17u_JJ3aI&t=1s))

> 打字机效果 文字浮现——凛冬初十[打字机效果](https://www.bilibili.com/video/BV1QL4y1A7PD)

### 实现思路

* 传入文本组件（每个字分为一个组件）
* 以函数执行位置生成透明度为0的隐形展示实体（text_display）作为基准点，存储文本组件
* 生成标记（marker）作为动画起始位置
* 以基准点向左偏移(文字数量/2)*0.23格，作为第一个字生成位置
* 同一游戏刻内
  * 重复执行生成文字的展示实体（透明度为0）
  * 存储相应的文本组件、数据标签与记分板分数
  * 向右偏移一个字宽度的格数

> 每个文字对应一个展示实体容易造成大量卡顿，请勿传入过长文本！

* 根据文本展示实体的标签，确定将执行什么动画，并通过记分板值决定启动动画的顺序
* 完成动画后：将透明度逐渐设置为0（淡出），或逐步减少展示的文本组件数（退格打字）
* 全部透明后，将此句文字的展示实体与标记全部移除

### 制作鸣谢

> [纸圆Paper](https://x.com/CricelPaper)
> [凛冬初十](https://space.bilibili.com/437726454)
> [烦伪](https://space.bilibili.com/418369418)
> [Axiom Mod](https://https://modrinth.com/mod/axiom)
> [DatapackHelperPlus](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
> [PCL2](https://afdian.com/a/LTCat)
> [Minecraft 渐变文字生成器](https://mcg.tuanzi.ink)
> [MinecraftWiki](https://zh.minecraft.wiki)

## 总结与展望

* 数据包完全免费开源，且已经停止更新内容[点此下载](https://wwql.lanzout.com/iEJlQ3639fre)
* 合作与Bug反馈请移步[CoolGaston个人空间](https://space.bilibili.com/648638421)私聊作者或加入QQ群聊1049824637
* 最后，衷心希望此资源库数据包能为各位开发者的地图创作带来便利！


