<!-- .vitepress/theme/RandomParagraph.vue -->
<template>
    <p :class="$style.paragraph" v-html="formattedParagraph"></p>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  
  // 定义多个段落，每个段落可以是多行文本，并包含HTML标签
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
    `数据包版本现在为<del>15</del> <del>18</del> <del>26</del> <del>41</del> <del>48</del> <del>57</del> 61! `,
    `着色器！`,
    `物品组件！`,
    `神 金 包`,
    `这是Datapack，它散架辣！`,
    `upup，为什么我1.21的数据包不识别函数`,
    `别想不开写生存包`
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