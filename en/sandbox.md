---
title: Vanilla Sandbox
outline: false
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

Vanilla Library testing ground.

<script setup lang="ts">
import DpsPlayground, {
  type PlaygroundNotebook,
} from '@datapack-sandbox/vitepress-playground'

import DpsCell from '@datapack-sandbox/vitepress-playground/cell'
import { ref } from 'vue'

const source = ref('')
const notebook: PlaygroundNotebook = {
  version: '26.2',
  cells: [
    {
      id: 'welcome',
      type: 'markdown',
      source: '### Test Sandbox\n\nMeow Meow Meow Meow Meow.',
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
<h1 class="feature-sandbox-title">Test Meow</h1>
    <p class="feature-sandbox-lead">
Text test meow
    </p>
    <div class="feature-sandbox-palette" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
</header>

Put a complete notebook.
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

Or a small one that can be inlined
<div>
    <ClientOnly>
        <DpsCell
        v-model="source"
        version="26.2"
        />
    </ClientOnly>
</div>
