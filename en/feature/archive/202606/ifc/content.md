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

### Library format preview function
Want to submit a manuscript but don't know if there is any problem with the format of your manuscript? You can check it out by heading to the preview page!
[Click here to go](/en/preview/)


## Command Flashlight Command Flashlight

### Warning - Danger of item directive
> by Karl

> Although recent performance tests have been saying that the performance of clearcommand with a quantity parameter that is not 0 is poor, while itemcommand performs very well, but itemcommand is not as secure as clearcommand. Because I found that although in theory the function executed by tick has the highest priority, there is an old synchronization problem between Mojang's client and the server, which leads to the bug of item brushing in any function that tries to use itemcommand to modify the player's backpack. Today I discovered that it was this synchronization problem that caused serious item bugs in my data pack. Therefore, itemcommand now loses to clearcommand in terms of security. Please note that authors!

The bug occurs when the item in the backpack is moved while the function scans and replaces the backpack. At this time, due to client synchronization issues, ghost item and brush item bugs may occur. This problem often occurs during high-frequency scanning of backpacks. Therefore, unless necessary, please do not place the scanning service in a high-frequency polling function.

<ColorLine :height="2"/>

## I ask you answer Quizs

:::warning This column is not a "you ask and I answer"!
In this column, we will ask several questions, and readers can give their own answers in the comment area (indicate the question number).
The answer will be announced in the next issue of Feature.

The questioner of this issue: Xu Muxian
:::

---

1. Due to a build error, the end dimension$(15,77,15)$A huge amount of armor stands spawned everywhere, causing the game to crash. Now you need to`.mca`Delete all these armor stands in the file. What is the path to this file? (Please use version 26.1 and above to answer)

---

2. will show the entity being rendered simultaneously along$x$、$y$and$z$Axis mirroring, write the corresponding`transformation`。

---

3. Try to block all vanilla recipes in the metadata file.

---

<ColorLine :height="2"/>

### Reference answers from last issue

> Note: The answer is not unique. Just solve the problem.

Question 1:

The sandstone staircase and the oak paneling bordering the surface were removed.

---

Question 2:

```mcfunction
execute store result score #player_count var if entity @a
```


or

```mcfunction
execute store result score #player_count var run list
```


---

Question 3:

A syntax error occurred in function and could not be loaded.

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
category="Chats"
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
