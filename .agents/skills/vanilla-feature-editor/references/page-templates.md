# 页面模板

按目标路径和真实材料替换中文示例值与 `YYYYMM`。只复制所需页头，不用模板正文替换投稿正文；保留原编号，主 Markdown 统一命名为 `content.md`。标题优先使用投稿正文的大标题。

## 普通稿件 / 精选

目标：`feature/archive/YYYYMM/<ID>/content.md`。

````markdown
---
title: '稿件标题'
---

<FeatureHead
  title="稿件标题"
  authorName="作者署名"
/>

从原稿大标题之后开始的正文原样保留，仅移除独立作者信息。
````

- 精选文章将 `FeatureHead` 换成 `FeaturedHead`，不另加重复的 `# 稿件标题`。
- 有真实头图时，在页头增加 `cover="../_asset/编号/cover.png"`；有共同作者时增加 `:extraAuthors="['共同作者注册键']"`；有示例包时必须增加 `resourceLink="../_asset/编号/示例数据包.zip"`。封面和示例包同步备份到 public 同路径。
- 没有本地示例包但有对应项目链接时，可将实际仓库、博客原文或发布页填入 `resourceLink`。正文已有摘要与章节原样保留，不新增或改写。
- 需要局部 NBT 别名时，将下面的脚本放在 frontmatter 后、正文组件前，且只保留实际使用项：

```vue
<script setup>
import ns from '/.vitepress/vue/nbt/namespace.vue'
import obj from '/.vitepress/vue/nbt/object.vue'
</script>
```

## 香草快讯

目标：`feature/archive/YYYYMM/spotlight/content.md`。

```markdown
---
title: '香草快讯 - Mojang Spotlight - 年月'
---

<SpotlightHead
  title="香草快讯 - Mojang Spotlight - 年月"
  authorName="作者署名"
/>

当期投稿正文原样保留。
```

存在对应素材时再增加 `cover` 和数值型 `:type`。快照名、数据包/资源包格式版本必须来自当期原稿或核实过的来源，不能从上一期推算。

## 当期目录

目标：`feature/index/YYYYMM.md`。下例展示一个栏目和一张卡片，其余实际栏目按同样方式增加。

```markdown
---
title: '《Feature》 YYYY.MM期'
---

<JournalHead
  cover="../archive/YYYYMM/_asset/cover-placeholder.png"
  :editors="[]"
/>

# 洞见 Insights

<IndexCompatible
  title="稿件标题"
  url="../archive/YYYYMM/0/content"
  authorName="作者署名"
  abstract="与稿件一致、根据正文提炼的目录摘要。"
/>
```

index 初稿封面使用仓库已有 `feature/cover/placeholder.png` 的副本，不使用旧刊正式封面，并将副本放在当期 `_asset/cover-placeholder.png`、镜像到 public 同路径。收到当期正式封面后，按用户要求替换两份副本。提供编辑名单时替换空数组。编辑整期时始终预留当期封二并添加 `:launchLink="{ link: '../archive/YYYYMM/ifc/content', text: '封二' }"`；预留 Spotlight 入口，缺稿时标注“编辑中”，不虚构署名或摘要卡片。卡片可添加真实 `background` 和 `:extraAuthors`，与对应文章的署名一致。

按投稿目录的既有栏目和数值编号顺序排列，不为凑齐栏目创建空卡片。目录可从原稿提炼摘要，但不将其补写回正文。侧栏与目录顺序一致，标题以文章内部大标题为准。

## 封二

目标：`feature/archive/YYYYMM/ifc/content.md`。编辑整期时即使未收稿也建立此文档，只保留栏目骨架和“编辑中”说明；有当期材料后填入实际栏目。Spotlight 同样预留文档，署名未知时先使用普通大标题，不触发组件默认的虚构作者。

```markdown
---
pageClass: h2-no-border
---

# 封二

<ColorLine :height="4" />

## 命令快闪 Command Flashlight

当期提供的技巧、说明与来源。

<ColorLine :height="2" />

## 我问你答 Quizs

注明本期出题人，按题号排版题目。

### 上期参考答案

与上一期题号对应的已提供答案。
```

不要自行替作者编造题目或答案；缺稿栏目不沿用旧内容冒充新稿。

## 评论区（始终预留）

目录、封二和 Spotlight 均使用下列组件。从同类页面复制项目和类别配置，已知当期讨论编号时将其作为字符串填入 `discussionNumber`；未知时保留空字符串及 `v-if`，避免挂载无效评论区。三页可共用同一 Discussion，不能套用上期编号。创建前检索现有讨论，缺少登录或权限时告知用户所需授权。脚本可以并入已有 `<script setup>`，无需增加第二个同类脚本块。

```vue
<script setup>
import { useData } from 'vitepress'
const { isDark } = useData()
const discussionNumber = ''
</script>

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
```

检查当前 `.vitepress/theme/style.css` 和同类页面是否需要 `giscus-wrapper` 样式；只有确有需要时沿用局部样式，不为单次稿件修改全站样式。
