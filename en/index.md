---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: h2-no-border

hero:
  name: "Vanilla Library"
  tagline: Vanilla development resource index site
  image:
    src: /icons/bg5.png
  actions:
    - theme: brand
      text: Get Started
      link: /en/index/绪论
    - theme: brand
      text: Wheel Search
      link: /en/wheel/
    - theme: alt
      text: Format Preview
      link: /en/preview/
features:
  - icon:
      src: /icons/vt.png
    title: Quick start
    details: A brief introduction to the concept of vanilla development and how to get started quickly
    linkText: First time coming into contact with vanilla mod? Click here
    link: /en/index/quick_start/mod
  - icon:
      src: /icons/echo_prism.png
    title: "Feature"
    details: Data pack Monthly Journal
    linkText: The latest issue has been released!
    link: /en/feature/index/202607
  - icon:
      src: /icons/totem_of_recovery.png
    title: toolbox
    details: Tool index that facilitates data pack development
    link: /en/index/工具
  - icon:
      src: /icons/ocean_clock.png
    title: Newsstand
    details: Browse past issues of "Feature"
    link: /en/feature/_index
  - icon:
      src: /icons/green_apple.png
    title: data pack practice
    details: practical and example tutorials
    link: "/en/index/数据包实践"
  - icon:
      src: /icons/sweetbarry_stew.png
    title: Quick review of update changes
    details: See what breaks after updating your data pack
    link: /en/index/changelog_breaking
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<script setup>
import { useData } from 'vitepress'
import RandomParagraph from '/.vitepress/vue/random.vue'
const { isDark } = useData()
const { frontmatter } = useData()
</script>

<ColorLine :height="4"/>

> <RandomParagraph />




<div class="spacer"></div>

## 🍀Welcome
<ColorLine />

Welcome to Vanilla Library.
"Vanilla" i.e.`Vanilla`. This site is an index site for resources related to vanilla mods. It strives to provide as comprehensive a resource index as possible for the development of vanilla mods (i.e. data pack + resource pack) for the Minecraft Java version.
The original name of this site is "vanilla mod architecture", which was modified and supplemented from the article of the same name.
Our vision is to collect as many and comprehensive tutorial resources as possible, like a library, all-encompassing.
Readers can choose appropriate resources to study and use from the links given on this site according to their own preferences and needs.

## 📚Resource related
<ColorLine />

### MCBBS resources
Due to the closure of MCBBS, many of its resources have been lost.
We found some of these resources, clicking on them now will jump to the archive page to browse the content.
However, there is a significant proportion of MCBBS posts that we have yet to find. We've struck through the links in these posts. If you are the original author of the posts, or know where these posts are archived, please feel free to contact us.

> Although bbs won the rematch, the data is still missing and needs to be supplemented urgently.

### Expand resources
Site resources are being continuously added. Due to the closure of MCBBS and the recent technical changes made by several versionmojang to the Java version, there is a lack of tutorials and introductions to the new version-related features.
In addition, content related to vanilla mod development theory, such as debugging skills, performance testing and other sections, is also in a state of lack of information.
We welcome experienced vanilla mod authors to write tutorials for these missing sections. If you have relevant materials, please feel free to contact us and we will be happy to add to our collection.

### Article temporary storage
We recommend that submitting authors publish their articles on other platforms first, and then add links to this site;
However, if the author wishes to publish the document directly on this platform, we also provide article temporary storage services:
- We accept documents in markdown format;
- We will store your article in the warehouse and cite the document as an in-site link in the text.
- Of course, we still recommend that authors keep archives locally.

## ☎️Contact us
<ColorLine />

📧**Suggestion box** (new link entries/document modification suggestions):
[Github issues](https://github.com/CR-019/datapack-index/issues)

📖Librarian @CR_019:
- QQ:1703467028
- Bilibili：https://space.bilibili.com/85292644
- Github：https://github.com/CR-019

🏡Landlord @Alumopper:
- Bilibili：https://space.bilibili.com/280394409
- Github：https://github.com/Alumopper


## Domestic node update
<ColorLine />

In cooperation with @红石综合站, Vanilla Library’s domestic node is online!
Can be usedhttps://cr-109.docs.repeater.red/datapack-index/access

## Vanilla Awards 2025
<ColorLine />

<p class="float-right-image">
  

<img src="/icons/tva2025.png" alt="Text describing the image">
</p>

The most vanilla award in the entire MC circle is now being awarded!
Come and see if your most vanilla work has won an award!

[Go and have a look->](/en/feature/tva/tva2025.md)
