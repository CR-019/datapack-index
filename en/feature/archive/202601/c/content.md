---
title: 'A MC map that can only be played once based on asymmetric encryption'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title="A MC map that can only be played once based on asymmetric encryption"
    authorName="WinsreWu"
    cover = '../../../../../feature/archive/202601/_assets/c.png'
/>

[BiliBili demonstration & principle video](https://www.bilibili.com/video/BV1AweAzEEPY)\
[GitHub repository](https://github.com/winsrewu/yopo-datapack)

yopo (You Only Play Once) is a Minecraft data pack that allows players to play the game only once.

# How to use

`yopo:encrypt_message`It is the entry function. Execute it, and it will handle the rest automatically, and finally tell you whether you got the permission or not. \
It is recommended to cooperatehttps://github.com/winsrewu/yopo-webuse. It should be deployed by me inhttps://yopo.jawbts.orgsuperior. \
Note that this data pack useshttps://mcbuild.devBuild.

# principle

The data pack has a built-in public key, which randomly generates an ID every time it is loaded, then encrypts the ID with the public key, and sends the encrypted ID to the server. \
After the server receives the encrypted ID, it first decrypts it with the private key to determine whether the ID is valid. \
If it is valid, the player is allowed to enter the game, that is, the private key signature (id + 1) is used to return it to the client, otherwise entry is denied. The client will verify the validity of the signature.

# limit

Due to MC performance limitations, the demo key is 64-bit. \
I don't recommend using higher digit keys as this will cause a drastic drop in performance and trigger the watchdog. \
Due to the design of the code architecture, it is difficult for me to continue to subdivide the entire operation into different ticks\
In short, just use it for fun and make your map a little more difficult to decipher =)

# what can be done

There are still many uses. For example, if you only play some maps once, you can really get a better or more special game experience. \
Of course, in order to ensure that the map is always playable, my suggestion is to leave a more obvious "backdoor", because your service cannot be 100% online, and the player may also quit the game midway due to force majeure.

If you want to authenticate the player, I suggest you use [MC-Auth](https://mc-auth.com/) or skin-based genuine verification to protect privacy.

# What else can you do
This project has a built-in high-precision positive integer written by me, so if you have similar needs, you can copy some code here.
