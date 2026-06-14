---
pageClass: h2-no-border
---

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 图书馆上新 What's New

### 图书馆格式预览功能
想投稿但不知道自己的文稿格式有没有问题？你可以前往预览页面检查！  
[点这里前往](/preview/)


## 命令快闪 Command Flashlight

### 警告- item指令的危险性
> by 卡儿

> 虽然最近的性能测试一直都在说 clear命令后接的数量参数不为0的性能很差，而item命令性能很好，但是item命令的安全性不如clear命令。因为我发现，虽然理论上tick执行的函数的优先级最高，但是mojang的客户端与服务端的同步有陈年老问题，这导致了任何试图用item命令修改玩家背包的函数都存在刷物品的bug。今天我就发现了，就是这个同步问题，导致我的数据包出现了严重的刷物品bug。所以，item命令现在在安全性方面输给了clear命令，请各位作者注意！

该bug的出现时机为：在函数扫描并替换背包的过程中，移动背包内物品。此时由于客户端同步问题，可能导致幽灵物品和刷物品的bug产生。该问题多出现在高频扫描背包的过程中。因此如非必要，请不要将扫描业务放在高频轮询的函数中。  

<ColorLine :height="2"/>

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。  
答案会在下一期Feature公布。  

本期出题人：徐木弦
:::

---

1. 由于生成错误，末地维度内的 $(15,77,15)$ 处产生了巨量的盔甲架使得游戏崩溃，现需要在 `.mca` 文件中将这些盔甲架全部删除，这个文件的路径是什么？（请使用 26.1 及以上版本作答）

---

2. 将展示实体在渲染上同时沿 $x$、$y$ 和 $z$ 轴镜像，写出对应的 `transformation`。

---

3. 尝试在元数据文件内屏蔽原版的所有配方。

---

<ColorLine :height="2"/>

### 上期参考答案

> 注：答案并非唯一。能解决问题即可。

题目1：

砂岩楼梯和橡木木板接壤的面被剔除了。

---

题目2：

```mcfunction
execute store result score #player_count var if entity @a
```

或

```mcfunction
execute store result score #player_count var run list
```

---

题目3：

函数出现语法错误，无法加载。

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="71"
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