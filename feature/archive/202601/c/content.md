---
title: '基于非对称加密的只能游玩一次的MC地图'
---

<FeatureHead
    title='基于非对称加密的只能游玩一次的MC地图'
    authorName='WinsreWu'
    cover = '../_assets/c.png'
/>

[BiliBili演示&原理视频](https://www.bilibili.com/video/BV1AweAzEEPY)\
[GitHub仓库](https://github.com/winsrewu/yopo-datapack)

yopo(You Only Play Once)是一个Minecraft数据包，它可以让玩家在游戏中只玩一次。

# 如何使用

`yopo:encrypt_message`是入口函数。执行它，其余的它会自动处理，最后告诉你到底那没拿到许可。\
建议配合https://github.com/winsrewu/yopo-web 使用。它应该被我部署在https://yopo.jawbts.org 上。\
注意，这个数据包使用https://mcbuild.dev 构建。

# 原理

数据包内置公钥，通过每次加载随机生成id，然后用公钥加密id，并将加密后的id发送给服务器。\
服务器收到加密后的id后，先用私钥解密，判断id是否有效。\
如果有效，则允许玩家进入游戏，也就是使用私钥签名(id + 1)返回给客户端，否则拒绝进入。客户端会验证签名有效性。

# 限制

由于MC性能限制，演示用密钥是64位的。\
我不建议使用更高位数的密钥，因为这会导致性能的急剧下降，并触发看门狗。\
由于代码架构设计的原因，我很难让整个操作继续细分到不同的tick\
总之，拿来玩玩即可，给你的地图加一点破译难度 =)

# 能干什么

用处还是很多的，比如说有些地图让玩家只玩一次确实能获得更好的，或者说更特殊的游戏体验。\
当然，为了保证地图总是能玩的，我的建议是留一个比较明显的"后门"，因为你的服务不可能100%在线，玩家也有可能中途由于不可抗力退出游戏之类的。

如果你要对玩家进行正版验证，我建议你使用 [MC-Auth](https://mc-auth.com/) 或者是基于皮肤的正版验证来保护隐私。

# 还能干什么
这个项目内置了一个我写的高精度正整数，所以如果有类似需求可以来这里复制点代码。