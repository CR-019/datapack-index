---
title: 香草沙盒
outline: false
---

香草图书馆测试场。

<script setup lang="ts">
import DpsPlayground, {
  type PlaygroundNotebook,
} from '@datapack-sandbox/vitepress-playground'

import DpsCell from '@datapack-sandbox/vitepress-playground/cell'

const notebook: PlaygroundNotebook = {
  version: '26.2',
  cells: [
    {
      id: 'welcome',
      type: 'markdown',
      source: '### 测试沙盒\n\n喵喵喵喵喵。',
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

<header class="feature-sandbox-hero">
    <p class="feature-sandbox-eyebrow">FEATURE · LAB</p>
    <h1 class="feature-sandbox-title">测试喵</h1>
    <p class="feature-sandbox-lead">
        文本测试喵
    </p>
    <div class="feature-sandbox-palette" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
</header>

放一个完整的notebook.
<div>
    <ClientOnly>
        <DpsPlayground
        :notebook="notebook"
        :allow-import="false"
        :render="{ auto: false }"
        theme="auto"
        layout="compact"
        checkpoint-name="feature-test"
        site-id="vanilla-library"
        />
    </ClientOnly>
</div>

或者可以内联的小号的
<div>
    <ClientOnly>
        <DpsCell
        v-model="source"
        version="26.2"
        />
    </ClientOnly>
</div>
