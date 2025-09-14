<!-- .vitepress/theme/RandomParagraph.vue -->
<template>
    <p :class="$style.paragraph" v-html="formattedParagraph"></p>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  
  // 定义多个段落，每个段落可以是多行文本，并包含HTML标签
  /*
  `/*愚人节限定`,
     `当你觉得会整活的时候，我没有整活，这也未尝不是一种整活`,
     `<a href=https://ys.mihoyo.com/ target="_blank">点我自动下载原神</a>`,
     `数据包是世界上最优雅、最精确、最强大的编程语言`,
     `香草泥`,
     `香草图书馆现在推出专属会员“香草泥”，成为香草泥，以获得观看文档权限`,
     `你知道吗？mc刚刚更新了，并且加入了新的指令<a href=https://vanillalibrary.mcfpp.top/datapack-index/resources/是真的.html>/sex</a>,我试过了，是真的，你也快试试看吧！`,
     `《feature》创刊号今日发布！<a href=https://www.bilibili.com/video/BV1GJ411x7h7/ target="_blank">点我查看</a>`,
    ``*/
  
  
  const paragraphs = [
     `—— 你为什么写数据包？是有什么受虐体质吗？  
     —— 是。`,
    `你本来应该下地狱的，但因为你生前写 <b>Minecraft数据包</b> ，我们就当做你已经服完刑期了`,
    `我升级地图，Spyglass给我报了1600个错误……`,
    `Also try MCFPP!`,
    `Mojang 'Rename' Studios!`,
    `Bugjump Studios!`,
    `数据包开发者：（夜半惊醒）不是，它这么做就是为了恶心我一下吗？`,
    `Mojang教你可数和不可数`,
    `数据包版本现在为<del>15</del> <del>18</del> <del>26</del> <del>41</del> <del>48</del> <del>57</del> <del>61</del> <del>71</del> <del>80</del> <del>81</del> 82.0! `,
    `着色器！`,
    `物品组件！`,
    `神 金 包`,
    `这是Datapack，它散架辣！`,
    `upup，为什么我1.21的数据包不识别函数`,
    `别想不开写生存包`,
    `听说了吗？MCBBS打赢复活赛了 <a href=https://forum.mczwlt.net/ target="_blank">点这里前往-></a>`,
    `数据包笑传之Change Change 版本号`,
    `STFW stands for "Search the <i>Friendly</i> <a href=https://zh.minecraft.wiki/ target="_blank">Wiki</a>!"`,
    `—— 你家有精神病史吗？  
     —— 我有一个写数据包的舅舅。`,
    `我奶奶都比mojang会整理东西`,
    `mojang把代码当铁锅疯狂颠勺，API像葱花满天飞
    开发者刚学会的菜谱（开发方案）秒变厨余垃圾`,
    `寻物启事：寻找我的理智，自从开始写数据包后就再也没见过它。`,
    `当你感觉自己很没用的时候，想一想mojang的数据包文件管理`,
    `现在，数据包的根目录里有进度、变种、函数、变种、战利品表、变种、声音变种、和变种。`,
    `Mojang憋出点东西就要拉出来，可能是夜鹭`,
    `微软大战代码！`,
    `命名笑传之次次变`,
    `Mojang员工小时候上三年级，发现二年级时候写的暑假作业broken or incompatible`,
    `Mojang会平等地肘击每一个使用了游戏特性的开发者
    ——骗你的不使用也肘（随便地重命名）`,
    `ojang小时候煮饭洗米的时候不小心掉了一粒米，然后给米全部倒掉了煮了一锅空气`,
    `Mojang：我重命名了1,000个键名！`,
    `Mojang：不是我喜欢的键名，直接重命名`,
    `数据包作者只是检测了一下物品数据，就被Mojang活活打断了兼容性`,
    `Mojang只是重命名了一堆键名，就被数据包作者活活打断了双腿`,
    `你有没有听见数据包作者的悲鸣？`,
    `你有没有感受到数据包在分崩离析？`,
    `你不曾注意重命名得逞者在狞笑。`,
    `Also try <a href=http://underline.icu/ target="_blank">Underline</a>!`
  ];
  
  // 用于存储选中的段落
  const selectedParagraph = ref('');
  
  // 在组件挂载时随机选择一个段落
  onMounted(() => {
    selectRandomParagraph();
  });
  
  // 随机选择一个段落的函数
  function selectRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    selectedParagraph.value = paragraphs[randomIndex];
  }
  
  // 计算属性：确保正确处理换行符
  const formattedParagraph = computed(() => {
    return selectedParagraph.value.replace(/\n/g, '<br>');
  });
  </script>
  
  <style module>
  /* 使用 CSS Modules */
  .paragraph {
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-line; /* 确保换行符生效 */
  }
  </style>