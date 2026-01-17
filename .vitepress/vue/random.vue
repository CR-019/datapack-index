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
    `数据包版本现在为<del>15</del> <del>18</del> <del>26</del> <del>41</del> <del>48</del> <del>57</del> <del>61</del> <del>71</del> <del>80</del> <del>81</del> <del>82.0</del> <del>88.0</del> 94.1!`,
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
    `Also try <a href=http://underline.icu/ target="_blank">Underline</a>!`,
    `你知道吗：如果《Feature》发布时视频还未做好，点击封面会链接到CR_019的动态页面`,
    `关注<a href=https://space.bilibili.com/85292644 target="_blank">CR_019</a>喵，关注<a href=https://space.bilibili.com/85292644 target="_blank">CR_019</a>谢谢喵！`,
    `关注<a href=https://space.bilibili.com/280394409 target="_blank">Alumopper</a>喵，关注<a href=https://space.bilibili.com/280394409 target="_blank">Alumopper</a>谢谢喵！`,
    `Expected a list, a list, a list, a list, a list, a list, a list, a list, a list, or a list.`,
    `Performance: 😅`,
    `冷知识：数据包里有@e不会让电脑爆炸`,
    `当前选中的数据包出现错误，导致世界无法加载。
    你可以尝试仅加载原版数据包（“安全模式”）或回到标题屏幕手动修复该问题`,
    `无法在安全模式下加载世界。
    这个存档包含无效或损坏的数据。`,
    
    `每个数据包或资源包都有其适用的版本号或版本区间。对于版本区间而言，总是存在可兼容的最低版本号和最高版本号。此版本区间仅是游戏兼容验证和允许使用覆盖子包的版本区间，数据包或资源包本体是否能正常工作取决于内容而非元数据。由于游戏以游戏版本1.21.8、数据包版本81或资源包版本64为界使用两种格式指定版本区间，因而版本验证与数据包或资源包的适用版本不同而不同。
    如果数据包或资源包仅适用于1.21.8后，即资源包最低版本号高于64时或数据包最低版本号高于81时：
    必须指定min_format和max_format来指定版本区间。
    不能指定pack_format或supported_formats，它们仅用于1.21.8及之前。
    如果数据包或资源包仅适用于1.21.8及之前，即资源包最高版本号低于65时或数据包最高版本号低于82时：
    必须指定pack_format来指定基础版本。
    如果指定了supported_formats来指定版本区间，则必须包含pack_format，且最高版本号不能低于15。
    不能指定min_format或max_format，它们仅用于1.21.8后。
    如果数据包或资源包同时适用于1.21.8前和1.21.8后，则上述四个字段必须同时指定，此时游戏会验证最低版本和最高版本的有效性：
    对最低版本号的验证：
    min_format的主要版本号和supported_formats的最小值必须相等，以保证最低版本号只有一个。
    对最高版本号的验证，二选一：
    max_format的主要版本号和supported_formats的最大值相等，以保证最高版本号只有一个。
    资源包supported_formats的最大值等于64，或数据包supported_formats的最大值等于81，以保证supported_formats只在1.21.8及之前使用，游戏会使用max_format作为实际的最高版本号。
    pack_format仍需要在版本区间内。[1]
    叠加目录NBT复合标签/JSON对象overlays加载版本的验证可类比推导基础信息NBT复合标签/JSON对象pack的验证。但与基础信息不同，即使叠加目录仅适用于1.21.8后，只要数据包或资源包整体适用于1.21.8及以前，就必须保留formats，以保证旧版本游戏的文件格式验证。[2]`,
    
    `1980/02/01`,
    `有人说，1.20.2之前的版本属于太古版本，所以在此之前的数据包作者都是太古达人，也有人认为不尽如此。对此，你怎么看？`
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