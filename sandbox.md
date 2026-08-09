---
title: 数据包交互沙盒
outline: false
---

<script setup lang="ts">
import DpsPlayground, {
  type PlaygroundNotebook,
} from '@datapack-sandbox/vitepress-playground'

const notebook: PlaygroundNotebook = {
  version: '26.2',
  cells: [
    {
      id: 'welcome',
      type: 'markdown',
      source: '### Feature 测试场\n\n代码单元共享同一个浏览器本地世界；无需启动 Minecraft 服务端。',
    },
    {
      id: 'setup',
      type: 'code',
      source: [
        'scoreboard objectives add feature_reads dummy',
        'scoreboard players set #visitor feature_reads 1',
        'say Feature sandbox is ready',
      ].join('\n'),
    },
    {
      id: 'inspect',
      type: 'code',
      source: 'execute if score #visitor feature_reads matches 1 run say Welcome to Feature',
    },
  ],
}
</script>

<div class="feature-sandbox-page">
  <header class="feature-sandbox-hero">
    <p class="feature-sandbox-eyebrow">FEATURE · INTERACTIVE LAB</p>
    <h1 class="feature-sandbox-title">数据包交互沙盒</h1>
    <p class="feature-sandbox-lead">
      直接编辑并运行 MCFunction，检查命令补全、诊断、状态快照与执行结果。所有计算都在浏览器本地完成。
    </p>
    <div class="feature-sandbox-palette" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  </header>

  <div class="feature-sandbox-guide">
    <div class="feature-sandbox-guide-item">
      <strong>运行：</strong>使用单元格按钮，或按 <kbd>Ctrl/⌘</kbd> + <kbd>Enter</kbd>。
    </div>
    <div class="feature-sandbox-guide-item">
      <strong>测试补全：</strong>在代码行中输入 <code>execute</code> 或 <code>scoreboard players</code>。
    </div>
  </div>

  <ClientOnly>
    <div class="feature-sandbox-shell">
      <DpsPlayground
        class="feature-sandbox"
        :notebook="notebook"
        :allow-import="false"
        :render="{ auto: false }"
        theme="auto"
        layout="compact"
        checkpoint-name="feature-test"
        site-id="vanilla-library"
      />
    </div>
    <template #fallback>
      <div class="feature-sandbox-fallback">正在加载浏览器沙盒……</div>
    </template>
  </ClientOnly>
</div>
