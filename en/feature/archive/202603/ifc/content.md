---
pageClass: h2-no-border
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# Second cover
<ColorLine :height="4"/>

## What's New in the Library?
- [NBT Autocomplete - Provides in-game nbt automatic completion](https://modrinth.com/mod/nbt-autocomplete)
- [vanilla technology development tutorial - Xu Muxian](https://github.com/xu-mu-xian/Minecraft-Vanilla-Techincal-Development-Tutorial)
- [Where can I find the historical version of my worldwiki? ](https://www.bilibili.com/video/BV11if5BcEgs)
- [[Minecraft] Animated Javavanilla model animation production basic tutorial ①--taking version 1.20.1 as an example](https://www.bilibili.com/video/BV16zfHBGEi2)
- [blockbench modeling software quick start tutorial document - Ita Miaoah](https://pcn6fq3p3rgn.feishu.cn/wiki/KYbDwKtyUi5VNZkw61wcuW50nTe?from=from_copylink)
- [NexusMC - Minecraft Community](https://www.nexusmc.cn/)
- [VM Chinese group](https://vmct-cn.top/)
- [CTM Map Resource Station](http://omgctm.top/)

<ColorLine :height="2"/>

## Command Flashlight Command Flashlight

### Fast entity accessor

We know that using Itementity's Throwertag can save the UUID reference of the entity and access it efficiently:

```mcfunction
# 将当前实体的UUID保存到物品NBT中
# 假设我们物品实体的uuid固定为0-0-0-0-1
data modify entity 0-0-0-0-1 Thrower set from entity @s UUID
```


As long as this entity still exists, we can access this entity through this item anywhere in our data pack:

```mcfunction
execute as 0-0-0-0-1 on origin run <命令>
```


But what if you want to store references to multiple entities? We can let multiple items ride on a world entity and access it with the help of world entity:

```mcfunction
# 假设世界实体是0-0-0-0-2
execute as 0-0-0-0-2 on passengers on origin run <命令>
```


When we want to add a new entity reference, we only need to let a new itemity ride on the world entity without limiting the UUID of the itemity.


<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
category="Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="56"
    :strict="false"
    :reactionsEnabled="true"
    emitMetadata="0"
    inputPosition="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy"
    class="giscus-wrapper"
  />
</ClientOnly>
