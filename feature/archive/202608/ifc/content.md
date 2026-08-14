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

狐狐正在睡觉……


<ColorLine :height="2"/>

## 我问你答 Quizs

:::warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。  
答案会在下一期Feature公布。  

本期出题人：徐木弦
:::

---

1. Realms 的实质是：   
A. 专用服务器  
B. 物理客户端  
C. 内置服务器  
D. 物理服务端  

---

2. 以下execute子命令无法创建新分支的是：    
A. summon  
B. at  
C. positioned  
D. rotated  

---

3. 一个进度仅使用了一个触发器为 `minecraft:tick` 的准则，此进度达成后，奖励内容是一个函数，其命名空间 ID 为 `minecraft:reload`。函数中含有撤销该进度的命令，则该进度的触发情况可能为：

I. 若游戏刻速率为 10，则进度每秒触发 10 次。

II. 若游戏刻被冻结，则进度在冻结期间不会触发。

III. 若游戏刻步进 40 刻，则进度在步进时会触发 40 次。

IV. 若游戏刻忽略速率快进执行，则快进期间进度每秒仍触发 20 次。

A. III、IV  
B. I、III  
C. I、II、III  
D. I、II、IV  

---

<ColorLine :height="2"/>

### 上期参考答案

> 注：答案并非唯一。能解决问题即可。

题目1：

高频执行：
```mcfunction
execute as @n[type=marker] at @s run rotate @s ~0.05 9.6
```

---

题目2：

位图字体右侧的透明部分会被自动剔除，因此U+E003至U+E008的字符宽度较其他字符而言更窄。

---

题目3：

62。

`/execute` 每一个执行到的非 `run` 子命令算 1 条，因此计 2 条。`run` 子命令的条数等于成功执行的分支数量，此处一共有 10 个标记，会产生 10 个正常执行的分支，因此计 10 条。这些分支每个分别运行了一次连锁执行数量为 5 的函数，计 50 条。故连锁执行命令的数量为 62。`max_command_sequence_length` 的值至少应该是 62。

---




<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="78"
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