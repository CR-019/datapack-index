<!-- .vitepress/theme/components/IframePreviewer.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
// 注意：直接导入 .vue 文件内容到字符串中比较困难。
// 通常需要 Vite 插件或者将样式提取到独立的 CSS 文件中。
// 这里我们假设你能以某种方式获取到编译后的 CSS。
// 一种简单方法是在 Vitepress 构建时提取样式到一个公共文件。
// 为了演示，我们先使用一个假设的 CSS 内容。
// 实际使用时，你需要配置 Vite 来生成这个 CSS 文件。

// --- 配置部分 ---
// 你的站点基础样式 (需要根据实际情况获取)
// 例如，可以通过 Vite 的 CSS 提取功能生成一个公共样式文件
const SITE_BASE_CSS_URL = '/styles/base.css'; // 假设你配置 Vite 生成了这个文件

// 你的全局组件定义 (简化示例)
// 实际应用中，你可能需要将这些组件编译成可以在 iframe 中运行的 JS bundle
// 这里仅展示概念
const GLOBAL_COMPONENTS_JS = `
  // 这里应该包含所有全局组件的定义和注册逻辑
  // 例如，使用 Vue 的 CDN 构建版本

  // 然后定义并注册你的组件
  // const { createApp } = Vue;
  // const MyButton = { template: '<button @click="count++">{{ count }}</button>', data() { return { count: 0 }; } };
  // const app = createApp({ template: '<my-button></my-button>' });
  // app.component('my-button', MyButton);
  // app.mount('#app');
  // 由于复杂性，这部分在简单示例中留空，你需要自行实现组件打包和注入。
  console.log('Global components JS would be injected here.');
`;

// --- 组件逻辑 ---
const props = defineProps({
  initialHtml: {
    type: String,
    default: '<p>在此输入 HTML 并查看渲染效果</p>'
  }
});

const inputHtml = ref(props.initialHtml);
const iframeRef = ref(null);
const iframeKey = ref(0); // 用于强制刷新 iframe

// 生成完整的 HTML 内容
const generateFullHtml = (userHtml) => {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vitepress Iframe Preview</title>
    <!-- 注入站点基础样式 -->
    <link rel="stylesheet" href="${SITE_BASE_CSS_URL}">
    <style>
        /* 可以在这里添加 iframe 内部的额外样式 */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            padding: 20px;
            margin: 0;
        }
        /* 示例：为用户内容添加默认样式 */
        .user-content p {
            color: #2c3e50;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="user-content">
            ${userHtml}
        </div>
    </div>

    <!-- 注入 Vue 运行时 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
    <script>
        ${GLOBAL_COMPONENTS_JS}
        // 初始化 Vue 应用 (如果需要)
        // 这部分逻辑需要根据你的组件定义来编写
        // window.addEventListener('DOMContentLoaded', (event) => {
        //     if (typeof initializeVueApp === 'function') {
        //         initializeVueApp(); // 假设 GLOBAL_COMPONENTS_JS 中定义了此函数
        //     }
        // });
    <\/script>
</body>
</html>
`;
};

// 将内容写入 iframe
const updateIframe = () => {
  if (iframeRef.value) {
    const iframeDoc = iframeRef.value.contentDocument || iframeRef.value.contentWindow.document;
    const fullHtml = generateFullHtml(inputHtml.value);
    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
  }
};

// 强制刷新 iframe (当需要完全重新加载时)
const refreshIframe = () => {
  iframeKey.value += 1;
  // 在下一个 tick 更新内容
  setTimeout(updateIframe, 0);
};

// 初始化
onMounted(() => {
  updateIframe();
});
</script>

<template>
  <div class="iframe-previewer">
    <h3>HTML 预览器 (Iframe)</h3>
    <textarea
      v-model="inputHtml"
      placeholder="请输入 HTML 代码，例如: <p>段落</p><div class='custom-class'>内容</div>"
      class="html-input"
      @input="updateIframe"
    ></textarea>
    <div class="controls">
      <button @click="updateIframe" class="btn">更新预览</button>
      <button @click="refreshIframe" class="btn btn-secondary">刷新 iframe</button>
    </div>
    <div class="preview-container">
      <h4>渲染预览:</h4>
      <!-- 使用 key 强制重新创建 iframe -->
      <iframe
        :key="iframeKey"
        ref="iframeRef"
        class="preview-iframe"
        sandbox="allow-scripts allow-same-origin"
        title="HTML Preview"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.iframe-previewer {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-family: Arial, sans-serif;
}

.html-input {
  width: 100%;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.controls {
  margin-top: 10px;
}

.btn {
  padding: 6px 12px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.btn:hover {
  background-color: #e0e0e0;
}

.btn-secondary {
  background-color: #e7f3ff;
  border-color: #a0cfff;
}

.btn-secondary:hover {
  background-color: #d0e1f9;
}

.preview-container {
  margin-top: 16px;
}

.preview-container h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.preview-iframe {
  width: 100%;
  height: 300px; /* 可根据需要调整 */
  border: 1px solid #999;
  border-radius: 4px;
}
</style>





