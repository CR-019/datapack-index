# 仓库与组件约定

这些约定来自现有源文件，不是新的站点规范。仓库变化时以当前实现为准。

## 路径与样本

| 用途 | 位置 | 注意事项 |
| --- | --- | --- |
| 月刊总入口 | `feature/_index.md` | 最新、往期、封面入口 |
| 当期目录 | `feature/index/YYYYMM.md` | 头图、编辑、栏目、摘要卡片 |
| 普通稿件 | `feature/archive/YYYYMM/<ID>/content.md` | 投稿主 md 统一改名；保留投稿编号及数值顺序 |
| 封二 | `feature/archive/YYYYMM/ifc/content.md` | 快闪、问答、上期答案，随材料变化 |
| 香草快讯 | `feature/archive/YYYYMM/spotlight/content.md` | 当期新闻与具体适用版本 |
| 本期附加资源 | `feature/archive/YYYYMM/_asset/` | 封面、示例包；可按编号建子目录，并镜像到 public 同路径 |
| 附加资源备份 | `public/feature/archive/YYYYMM/_asset/` | 与源目录逐文件一致，确保静态下载可访问；历史 `_assets/` 不迁移 |
| 文章私有资源 | 文章目录下的 `img/`、`image/`、`reference/` 等 | 沿用源稿结构，不统一重命名 |
| 目录页封面 | `feature/cover/placeholder.png` | 新整理的 index 使用此占位图，可复制进当期 `_asset/` 并备份；旧刊封面不迁移 |
| 年度文章导航 | `.vitepress/sidebar_featureYYYY.ts` | 显式导出各期 `sidebar_YYYYMM` |
| 月刊导航 | `.vitepress/sidebar_feature.ts` | 最新、往期、更早等 |
| 路由配置 | `.vitepress/config.mts` | 显式导入并映射每期文章侧栏 |
| 作者资料 | `public/authors/<署名>.json` | 组件按署名取 JSON，注意大小写 |
| 作者头像 | `public/_authors/` | 作者 JSON 的 `avatar` 引用此处 |

可定位的历史样本：

- `feature/index/202610.md`：四类常见栏目及多作者卡片。
- `feature/archive/202610/0/content.md`：`FeaturedHead`、局部 NBT 图标导入、正文摘要。
- `feature/archive/202610/1/content.md`：`FeatureHead`、多作者、技术文章。
- `feature/archive/202610/4/content.md`：普通页头与资源下载。
- `feature/archive/202610/ifc/content.md`：封二结构及评论区。
- `feature/archive/202610/spotlight/content.md`：`SpotlightHead`。
- `feature/index/202609.md` 及对应文章：用于判断哪些是稳定约定、哪些是当期特例。

## Vue 组件

查看 `.vitepress/theme/index.ts` 的 `enhanceApp`。当前全局可用 `FeaturedHead`、`FeatureHead`、`JournalHead`、`JournalIndex`、`IndexCompatible`、`SpotlightHead`、`ColorLine`、`GiscusComment`、`node`、`nbt`、`cmd` 等，无须逐篇导入。

| 组件 | 作用与属性 |
| --- | --- |
| `FeatureHead` | 普通文章：`title`、`authorName`、可选 `cover`、`resourceLink`、`abstractText`；额外作者由根组件属性透传给 `FeatureHeadBase` |
| `FeaturedHead` | 精选文章：基本属性同上，增加精选装饰；不要把“巧匠”误当成另一个页头组件 |
| `SpotlightHead` | 香草快讯：基本属性同上；`type` 为数字，须写 `:type="1"` 等有效绑定，并确认对应图标文件存在 |
| `IndexCompatible` | 目录卡片：必填 `title`、`url`、`abstract`、`authorName`；可选 `background`、`:extraAuthors` |
| `JournalHead` | 当期目录页头：必填 `cover`；可选 `coverLink`、`:editors`、`:credits`、`:launchLink` |
| `JournalIndex` | 月刊总入口的封面卡片：`cover`、`coverLink` |
| `ColorLine` | 分隔线，数值高度示例 `:height="4"` |

`JournalHead` 的 `launchLink` 为 `{ link, text }` 对象，常用于“封二”；`editors` 为编辑署名数组。按本次真实材料填写，未提供时传 `:editors="[]"`，不能保留组件默认的“编辑A/编辑B”。

属性使用规则：

- 字符串加引号：`authorName="作者署名"`，不要照搬旧稿中的裸属性值。
- 数组、对象、数字和布尔值使用 `:`：`:extraAuthors="['另一位作者']"`、`:cover="false"`。`extraAuthors="[...]"` 是字符串。
- `cover` 可以省略，默认 `false`；无头图时不要传空字符串，否则基础组件仍可能渲染图片。
- 索引卡片使用 `abstract`，页头声明的是 `abstractText`。基础页头目前不直接渲染后者，摘要仍应放正文。
- 标题和摘要中的引号、`&`、`<` 等须正确转义；不要把投稿文本直接拼入 Vue 表达式。

## 作者资料

`FeatureHeadBase.vue` 与 `IndexCompatible.vue` 在客户端从站点 base 下的 `authors/<authorName>.json` 取资料。优先复用已有署名和 JSON；新增资料只填作者明确提供的信息。

查找时同时比较文件名和 JSON 的 `name`，必要时以投稿提供的社媒 UID 核对身份。例如 `洪旗.json` 内的 `name` 是“洪色羽毛”，应复用 `authorName="洪旗"`，组件显示 JSON 中的真实署名，不重复注册。

```json
{
  "name": "作者署名",
  "socialLinks": [
    { "name": "社媒平台", "url": "https://example.com/author" }
  ],
  "avatar": "/_authors/author-avatar.png"
}
```

此处仅展示结构，不能将示例地址写进正式资料。`public` 不出现在对外 URL 中。JSON 中的头像路径沿用不含部署 base 的形式，由组件处理前缀。新增作者按投稿目录资料自动注册，署名以投稿为准，不被 B 站昵称覆盖。通过作者提供的 B 站 UID 查用户资料（例如 `https://api.bilibili.com/x/web-interface/card?mid=<UID>`）取 `card.face`，下载并验证为图片后保存到 `public/_authors/`。账号不可用时说明具体缺项，不填无关头像。

## Markdown、NBT 与资源

- 常见栏目按材料选用：`精选 Featured`、`香草快讯 Mojang Spotlight`、`洞见 Insights`、`巧匠 Masterpieces`。按投稿已有栏目和数值编号编排；文章的大标题转为页头后，其余正文标题层级保留原样。
- 普通稿件至少填写 frontmatter `title`。不要机械复制旧目录里的 `outline: Outline[1]`：它是普通 YAML 字符串，不是层级数组；需要控制大纲时使用 VitePress 支持的形式，并验证显示。
- `mcfunction`、`snbt`、`mcdoc` 已注册高亮。保留代码语言及缩进，不因排版改动标识符、命令参数、SNBT 类型或宏语法。
- 支持 `::: tip`、`::: warning`、`::: danger`、`::: details`、脚注与 KaTeX。具体例子查 `feature/_格式指导.md`；公式定界符不要误伤命令、货币或普通文本中的 `$`。
- `cmd`、`nbt`、`node` 已全局注册；`ns`、`int`、`obj`、`str` 等短别名通常需要在 `<script setup>` 中从 `/.vitepress/vue/nbt/*.vue` 局部导入。只导入本篇实际使用的组件，也可以使用已注册的 `<nbt type="..." />`。
- NBT 树使用 `<div class="nbttree">` 后空一行，再写列表；查当前 `Node.vue` 与 NBT 树插件确认类型和选项，不猜属性。
- 原稿中的占位符、插值或未闭合 HTML 若导致 Vue 编译错误，准确定位并说明，不因“排版”擅自改正文。仅做用户明确允许的技术性修正，并在正文对照时单独列出。
- 正文图片保持原引用，如 `![图注](./img/filename.png)`。新存档文章页头可用 `cover="../_asset/4/cover.png"`；目录背景为 `background="../archive/YYYYMM/_asset/4/cover.png"`。封面与示例包均须有 public 同路径备份。
- 正文若引用 `http(s)` 图片，先下载到当前编号目录的图片子目录，再改成相对路径；全期扫描确认无遗漏。普通外部网页、仓库和参考文献链接不因这一规则改写。
- `.vitepress/config.mts` 的 `htmlImagePlugin` 会处理原始 `<img>` 及字符串 `cover`/`background` 的相对图片路径。使用明确、带引号的字符串路径，改名或换层级后检查构建产物。
- 示例包必须填写页头 `resourceLink="../_asset/4/示例数据包.zip"`，并确认 public 中存在对应文件及生产输出可访问。无本地示例包时可填文章对应的外部仓库、博客或发布页；`resourceLink` 当前为单个字符串，不拼接多个 URL 冒充一个地址，正文原有项目链接保持原样。
- 页面链接沿用站内 `/feature/...` 或相对路径且通常不带扩展名。不要给所有 URL 硬加 `/datapack-index/`；当前 base 可由 `VITEPRESS_BASE` 覆盖。

## 评论区与英文页

目录、封二和 Spotlight 使用 `<ClientOnly>` 包裹 `GiscusComment`，并用 `useData().isDark` 切换主题。`mapping="number"` 对应的 `term` 是 GitHub Discussion 编号，不是月份或期号。同一期可以共用一个讨论，但不能套用上期编号。缺少新讨论信息时仍预留完整组件：在 `<script setup>` 中定义 `const discussionNumber = ''`，组件使用 `v-if="discussionNumber"` 和 `:term="discussionNumber"`，避免挂载无效评论区。取得真实编号后同步填写三页；创建前先检索现有讨论，缺少 GitHub 登录或权限时告知用户所需授权。

英文导航有独立的显式映射，中文导航更新不意味着英文文章和导航已经齐全。用户要求英文同步时检查 `en/feature/`、`.vitepress/sidebar_en.ts` 及翻译脚本支持的文件筛选，不在普通中文文稿整理中扩大到全仓翻译。
