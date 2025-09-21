<!-- public/preview.html -->
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Live Preview</title>

  <!--
    使用相对路径加载 Vite 客户端和样式
    假设 VitePress 构建后会将这些资源放在 /datapack-index/assets/ 下
    开发时，Vite 会处理这些路径
    生产时，确保这些路径正确
  -->
  <script type="module" src="/datapack-index/@vite/client"></script>
  <!-- 尝试加载默认的 VitePress 样式 -->
  <!-- 注意：实际构建后的文件名会有 hash，这里只是一个示例 -->
  <!-- 你可能需要在构建后检查实际的文件名并更新这里 -->
  <link rel="stylesheet" href="/datapack-index/assets/style.css" />

  <style>
    /* 基础预览样式，保持简洁，匹配 VitePress 主题 */
    html, body {
      /* 移除默认 margin/padding */
      margin: 0;
      padding: 16px; /* 与 LivePreview.vue 中的 padding 保持一致 */
      /* 尝试使用 VitePress 的 CSS 变量以匹配主题 */
      font-family: var(--vp-font-family-base);
      background-color: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      line-height: var(--vp-line-height);
    }
    #preview-root {
      /* 可以在这里添加额外的沙箱容器样式 */
    }
    /* 如果 VitePress 的 CSS 变量未加载，提供后备样式 */
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      html, body {
         background-color: #1b1b1f;
         color: #f1f1f1;
      }
    }
  </style>
</head>
<body>
  <!-- 这个 div 是用户内容将被渲染到的地方 -->
  <div id="preview-root"></div>

  <script type="module">
    import { createApp, h, defineAsyncComponent } from 'vue'

    // 👇 定义你的全局组件
    // 使用相对路径并加上 /datapack-index/ 前缀
    // 假设 .vitepress/theme/components/ 在构建后会被处理
    // `/@fs/` 在构建后可能不适用，需要使用构建后的路径或别名
    // 这里假设组件可以通过相对路径访问
    // 如果组件在 .vitepress/theme/components/MyButton.vue
    // 构建后可能需要根据实际结构调整
    // 一种方法是确保这些组件被打包或可以通过 HTTP 访问
    // 暂时保留原始逻辑，但路径需要调整

    // 注意：在 VitePress 构建环境中，直接从 public 目录引用 .vitepress 内部文件可能比较复杂
    // 更稳健的方法是在 VitePress 主题中定义一个“库”对象，然后通过 iframe 通信传递组件定义
    // 或者将需要预览的组件单独打包成一个库

    // 为了演示，我们假设有一个方法可以获取到这些组件的定义
    // 这里我们简化处理，假设组件可以通过某种方式加载
    // 实际应用中，你可能需要更复杂的逻辑或服务端支持

    // --- 模拟组件定义加载 ---
    // 在实际 Vite/Vue 项目中，这部分通常在构建时处理
    // 我们在这里模拟一个异步加载过程
    const loadGlobalComponents = async () => {
        // 这个对象将在 iframe 加载时被填充
        // 实际加载逻辑可能需要根据你的项目结构调整
        // 例如，通过父窗口 postMessage 发送组件定义
        // 或者预定义一个全局变量
        // 暂时返回一个空对象或默认组件
        return {
            // MyButton: defineAsyncComponent(() => import('./path/to/MyButton.vue')) // 相对路径可能不适用于 public
            // 由于在 public 目录下，直接 import .vitepress 内部文件可能有问题
            // 需要 Vite 配置支持或使用别名
            // 作为替代，我们可以定义一个简单的组件用于测试
            MyButton: {
                props: ['type', 'size'],
                template: `
                 <button
                   :class="[
                     'px-4 py-2 rounded font-medium transition-colors',
                     size === 'large' ? 'text-lg px-6 py-3' : '',
                     type === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                     type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
                     'bg-gray-200 text-gray-800 hover:bg-gray-300'
                   ]"
                 >
                   <slot />
                 </button>
               `
            }
            // 添加更多组件...
        };
    };

    let globalComponents = {}; // 全局组件缓存

    // 接收来自主页面的消息
    window.addEventListener('message', async (event) => {
      // 消息格式: { type: 'update', html: '...' } 或 { type: 'init', components: {...} }
      const message = event.data;

      if (message.type === 'init') {
          // 初始化消息，包含全局组件定义
          // 这里可以根据 message.components 动态注册组件
          // 为了简化，我们直接使用 loadGlobalComponents
          globalComponents = await loadGlobalComponents();
          console.log('Preview: Global components initialized.');
          return;
      }

      if (message.type === 'update') {
          const htmlContent = message.html;

          // 获取渲染容器
          const rootElement = document.getElementById('preview-root');
          if (!rootElement) {
              console.error('Preview: Could not find #preview-root element');
              return;
          }

          // 清空之前的内容
          rootElement.innerHTML = '';

          if (htmlContent === undefined || htmlContent === null) {
              return;
          }

          try {
              // 将用户 HTML 包裹在一个 div 中以确保 Vue 挂载点有效
              const wrappedContent = `<div id="__vp_live_preview_wrapper__">${htmlContent}</div>`;
              rootElement.innerHTML = wrappedContent;
              const wrapperElement = document.getElementById('__vp_live_preview_wrapper__');

              if (wrapperElement) {
                  // 创建一个临时的 Vue 应用实例
                  const tempApp = createApp({
                      components: globalComponents // 使用动态加载或初始化的组件
                  });

                  // 注册所有全局组件到这个临时应用
                  Object.keys(globalComponents).forEach(name => {
                      // 确保组件是有效的 Vue 组件选项对象或构造函数
                      if (globalComponents[name]) {
                          tempApp.component(name, globalComponents[name]);
                      }
                  });

                  // 将临时应用挂载到包装器上，以激活其中的 Vue 组件
                  tempApp.mount(wrapperElement);
              } else {
                  console.error('Preview: Failed to create wrapper element.');
              }

          } catch (err) {
              console.error('Preview: Error rendering content:', err);
              // 在预览区域显示错误信息
              const errorEl = document.createElement('p');
              errorEl.style.color = 'red';
              errorEl.textContent = `渲染错误: ${err.message}`;
              rootElement.appendChild(errorEl);
          }
      }
    });

    // 可选：向父窗口发送就绪消息
    window.parent.postMessage({ type: 'preview-ready' }, '*');
  </script>
</body>
</html>