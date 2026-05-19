---
title: '挖掘在地下'
---

<FeatureHead
    title='挖掘在地下'
    authorName='sao_you'
    cover = '../_assets/4_cover.png'
/>


⛏《挖掘在地下》是一张生存PVP地图，游戏开始时玩家将在洞穴挖掘矿石，制作不同装备武器，途中与其他玩家进行PVP，最终取得胜利。
 - 地图版本：1.21.11
 - 人数建议：4+
 - 地图包含：
   - 34种特殊角色
   - 100+独特道具
   - 8种不同矿井
   - 60种随机事件
   - 支持超多自定义设置!

::: details 下载
 - DiggingUnderground v1.0
 - minebbs：https://www.minebbs.com/resources/digging-underground-pvp.16342/
 - 下载链接：
   - [https://wwapv.lanzn.com/b00mqbv6ve](https://wwapv.lanzn.com/b00mqbv6ve) 网盘密码:5w19
:::

## 视频介绍:
[[MC多人PVP地图] 挖掘在地下 正式版发布!!! | Digging Underground-哔哩哔哩](https://www.bilibili.com/video/BV1Hj9ZBKEqq)


## 游戏简介

 - 采集矿石：在游戏中最重要的就是矿石资源，这是一切制造的核心，其中矿石的生成会随着高低有规律的分布，你可以打开[进度]的以查看不同地图矿石的分布。
 - 制作道具：在收集矿石的过程中，玩家可制作不同的道具，不同道具可为自身提供有效帮助，例如[钻头]用于开采前方矿石。
 - 盔甲纹饰：锻造模板可以为玩家提供增益buff，让玩家在PVP中获得优势。每当玩家有一件相同模板装备时，对应模板等级+1，多余的模板可拆解为钻石。
 - 附魔书本：本地图舍弃了原版附魔机制，玩家可以使用矿石制作对应附魔书，需要将武器放在副手或穿戴。每使用一本附魔书，即可为装备提升对应附魔等级。

## 地图指令

命令：
 - 解锁所有内容：`function command:unlock_everything`
 - 开启里世界里角色：`function digging_underground:advancement/inner_world/run`
 - 所有玩家准备：`function command:team_change/join_gameplayer`
 - 结束游戏：`function command:stop_game`
 - 重置地图：`function command:reset_map`

计分板:
 - `coin_score`：钱币
 - `life_count`：复活机会
 - `chip`：筹码

标签:

 - `init`：初始化标签(移除后|重置玩家所有内容)
 - `GameOwner`：房主(移除后优先选择创造玩家作主，房主可选择所有设置)
 - `GP`：加入对局(对局内增加后加入游戏)
 - `SP`：移除对局(对局内增加后退出对局)