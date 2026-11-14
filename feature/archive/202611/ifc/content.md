---
title: '封二 - 2026年11月'
pageClass: h2-no-border
---

<script setup>
import { useData } from 'vitepress'
const { isDark } = useData()
// 确认本期 Discussion 编号后填写；目录、封二与 Spotlight 共用。
const discussionNumber = ''
</script>

# 封二

<ColorLine :height="4" />

<!-- 编辑预留：命令快闪收到当期材料后再补充。出题人署名待确认。 -->

## 我问你答 Quizs

::: warning 本栏目不是“你问我答”！
在这一栏目中，我们将会提出几道题目，读者可以在评论区给出自己的解答（标明题号）。
答案会在下一期 Feature 公布。

本期题目以 **Minecraft Java 版 26.3** 为准。
:::

<!-- 本期选题对应原始《题目.md》的第 2、7、8、14 题；参考解析留待下期公布。 -->

---

1. 生成一个“僵尸堆”，使得一个僵尸骑在下面的僵尸身上，下面的僵尸又骑在它下面的僵尸身上，要求“僵尸堆”一共有5只僵尸。

---

2. 生成一个盔甲架，使之呈现走路的姿势，并且右手持有一个红石火把，该部位不能与玩家产生任何互动。

---

3. 生成一个掉落物形式的钻石，使其拥有自定义名称只有合适的玩家才能捡起这个钻石，并设定UUID为 `[I;123456789,123456789,123456789,123456789]` 的玩家才能捡起该钻石，在钻石被捡起之前该钻石不会自行消失。

---

4. 设计一串命令，使得玩家物品存储槽位编号 `9` \~ `35` 的物品按顺序存储在位于$(0,56,0)$的箱子的 `0` \~ `26` 号槽位中。

<ColorLine :height="2" />

### 上期参考答案

> 答案并非唯一，能解决问题即可。

#### 1. 菜单按钮点击声音文件的地址

【答案】`.minecraft\assets\objects\34\3455ca942556c7d5eac7dd5e458e7fb3bad564c9`

---

#### 2. 只有 \n 的闪烁标语文件

【答案】只会有一条文本为 `\n` 的闪烁标语。

---

#### 3. 水平圆周上等间隔生成 12 个交互实体

【答案】先在执行位置生成一个辅助标记，然后不断旋转这个标记，用局部坐标在标记前方2格远处生成交互实体，函数可以为：

```mcfunction
execute summon marker at @s run function summon
```

```mcfunction
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
rotate @s ~30 ~
summon interaction ^ ^ ^2
kill @s
```

<ClientOnly>
  <GiscusComment
    v-if="discussionNumber"
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    :term="discussionNumber"
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
