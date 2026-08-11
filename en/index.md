---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: h2-no-border

hero:
  name: "Vanilla Library"
  tagline: Vanilla mod development resource index
  image:
    src: /icons/bg5.png
  actions:
    - theme: brand
      text: Enter the site
      link: /en/index/绪论
    - theme: brand
      text: Search prerequisites
      link: /en/wheel/
    - theme: alt
      text: Format preview
      link: /en/preview/
features:
  - icon:
      src: /icons/vt.png
    title: Quick Start
    details: A brief introduction to vanilla development and how to get started quickly
    linkText: New to vanilla mods? Start here
    link: /en/index/quick_start/mod
  - icon:
      src: /icons/echo_prism.png
    title: "Feature"
    details: A monthly collection of short data pack articles
    linkText: The latest issue is now available!
    link: /en/feature/index/202607
  - icon:
      src: /icons/totem_of_recovery.png
    title: Toolbox
    details: An index of tools that make data pack development easier
    link: /en/index/工具
  - icon:
      src: /icons/ocean_clock.png
    title: Newsstand
    details: Browse previous issues of "Feature"
    link: /en/feature/_index
  - icon:
      src: /icons/green_apple.png
    title: Data Pack Practice
    details: Practical and example-based tutorials
    link: /en/index/数据包实践
  - icon:
      src: /icons/sweetbarry_stew.png
    title: Update Change Quick Reference
    details: See what may break when you update your data pack
    link: /en/index/changelog_breaking
---
<script setup>
import { useData } from 'vitepress'
import RandomParagraph from '/.vitepress/vue/random.vue'
const { isDark } = useData()
const { frontmatter } = useData()
</script>

<ColorLine :height="4"/>

> <RandomParagraph />




<div class="spacer"></div>

## 🍀 Welcome
<ColorLine />

Welcome to Vanilla Library.
“Vanilla” means `Vanilla`. This site indexes resources related to vanilla mods, and aims to provide as comprehensive an index as possible for developing vanilla mods (that is, data packs + resource packs) for Minecraft: Java Edition.
This site was originally named “Vanilla Mod Architecture”, adapted and expanded from the article of the same name.
Our vision is to collect as many comprehensive tutorial resources as possible, like a library with something for everyone.
Readers can choose suitable resources to study and use from the links provided here according to their preferences and needs.

## 📚 Resources
<ColorLine />

### MCBBS Resources
Since MCBBS closed, many of its resources have been lost.
We found some of them; clicking those links now takes you to an archive page where you can browse the content.
However, we have not yet found a considerable number of MCBBS posts. We mark links to those posts with strikethrough. If you are the original author of one of these posts, or know where it has been archived, please contact us.

> Although the BBS has made a comeback, the data is still missing and urgently needs to be supplemented.

### Expanding the collection
The site's resources are continuously being expanded. The closure of MCBBS, together with the technical changes Mojang has made to the Java Edition in recent versions, has left relatively few tutorials and introductions for new-version features.
In addition, topics related to vanilla mod development theory, such as debugging techniques and performance testing, are also short on material.
We welcome experienced vanilla mod authors to write tutorials for these missing sections. If you have relevant material, please contact us; we would be happy to enrich our collection.

### Article hosting
We recommend that contributors publish their articles on another platform first and then add a link to this site;
however, if an author would rather publish the document directly on this platform, we also provide article hosting:
- We accept documents in Markdown format;
- We store your article in the repository and reference it in the body through an internal site link;
- Of course, we still recommend that authors keep a local archive.

## ☎️ Contact us
<ColorLine />

📧 **Suggestion box** (new link entries or document-change suggestions):
[GitHub Issues](https://github.com/CR-019/datapack-index/issues)

📖 Librarian @CR_019:
- QQ: 1703467028
- Bilibili: https://space.bilibili.com/85292644
- GitHub: https://github.com/CR-019

🏡 Landlord @Alumopper:
- Bilibili: https://space.bilibili.com/280394409
- GitHub: https://github.com/Alumopper


## New domestic mirror
<ColorLine />

In cooperation with @红石中继站, Vanilla Library's domestic mirror is now online!
You can access it at https://cr-109.docs.repeater.red/datapack-index/

## Vanilla Awards 2025
<ColorLine />

<p class="float-right-image">
  

<img src="/icons/tva2025.png" alt="Vanilla Awards 2025">
</p>

The most vanilla awards in the entire MC community are being presented now!
Come see whether the work you consider the most vanilla has won an award!

[Take a look ->](/en/feature/tva/tva2025.md)

