::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# Second cover
<ColorLine :height="4"/>

## What's New in the Library?

**[Vanilla Pre-installation Hall](/en/wheel/index.md) is now open! If you know of a useful front-end data pack or resource pack, you are welcome to contribute (whether it is yours or not)! **

## Command Flashlight Command Flashlight

### Explanation on the issue of entityselector failure when restarting Minecraft world

**Phenomena description**

After starting or restarting a Minecraft world (either single player or multiplayer server), there is a brief "blank period". During this period, any use`@e`The selector command cannot select any existing entity, including player, mob or item. \
used during this period`summon`If the entity summoned by the command is already in the loading state, it can be selected by the selector, but not vice versa. \
`execute summon`It works fine.

This phenomenon is not a game crash or bug, but an inherent characteristic of the engine's internal loading mechanism.

**Core reason: asynchronous loading mechanism of entity and chunk**

The root cause of this phenomenon is that the Minecraft engine adopts an asynchronous and staged loading strategy for chunks (Blocks) and entities (Entities) to optimize performance and avoid game lags.

1.  **The loading action is an asynchronous task**: According to code analysis, the actual loading process of chunks and entities is performed through background tasks (Task). The engine will queue these tasks and execute them step by step in subsequent ticks.
2.  **entity tracking status determines optionality**: whether an entity can be`@e`The selector is selected, depending on whether the chunk is loaded.
3.  **Uncertain loading order**: The loading tasks of chunks and entities are scheduled by the engine, and the loading order of blocks and entities needs to be verified. *Verification required*
4.  **forceload asynchronous**:`forceload`It will only mark force loading without starting loading immediately, so it will not take effect within the function context.

### Conclusions on the performance testing of two methods for detecting whether an item exists in a backpack

Reprinted from [this Discord discussion](https://discord.com/channels/154777837382008833/157097006500806656/1455993798399098902)

Performance test conclusions of two methods for detecting whether an item exists in a backpack:

1. `execute if items`exhaustive sum`clear ... 0`The magnitudes are generally similar, with little difference.
2. `execute if items`Exhausting all backpack slots is completely safe and will not have any unexpected impact on the playeritem column.
3. `execute if items`The performance is unstable, and it is faster when detecting the presence of a target. However, when all detection conditions are not met (such as the inventory is empty), all judgments need to be run, and the performance is the worst.
4. `clear ... 0`Under most normal circumstances (especially when the item column and synthesis grid are empty), the performance is stable and excellent, and the detection speed is usually faster than exhaustive`if items`Slightly faster.
5. when`player.crafting`When item exists in (player synthesis grid),`clear 0`The performance consumption will increase sharply, and the consumption may increase close to$10$times, causing the speed at this time to be much slower than`execute if items`method.

suggestion:
1. Detect all backpack items, including off-hands, equipment, synthesis slots, etc. It is recommended to use`execute if items`Detect the synthesis column first, if detected then`return 1`, and then`return run clear ... 0`。
2. If you only need to detect the backpack and shortcut bar (when the slot range is not so many), it is recommended to use it directly.`execute if items`, in most cases than`clear ... 0`Faster.

## Q&A
Q: I made a texture, how can I render it like a vanilla item?
A: There is a parent field in the model file of the resource pack, which can specify the path of a model file. After specifying, the model can inherit some data of the parent model.

> A model can be specified to inherit from another model, and the child model can inherit some data of the parent model:
> - If the child model does not define boolean ambientocclusion, NBT list/JSON array elements or string gui_light, the data of the parent model will be used directly. If the submodel has these data defined, the submodel data is used.
> - If the child model does not define one of the display formats in the NBT composite tag/JSON object display, the corresponding display format of the parent model will be used. If the submodel has this display format defined then the submodel data is used.
> - The NBT composite tag/JSON object textures of the child model will be parsed together with the NBT composite tag/JSON object textures of the parent model. See texture variables below.
>
> https://zh.minecraft.wiki/w/%E6%A8%A1%E5%9E%8B#%E6%A8%A1%E5%9E%8B%E7%BB%A7%E6%89%BF

The "item/generated" model is the default model of vanillaitem. Use this as the parent model and declare the "layer0" texture variable under the textures field to call the vanilla rendering engine to render the texture.

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
category="Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="44"
    :strict="false"
    :reactionsEnabled="true"
    emitMetadata="0"
    inputPosition="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy"
    class="giscus-wrapper"
  />
</ClientOnly>
