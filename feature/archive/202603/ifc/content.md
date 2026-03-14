<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 命令快闪 Command Flashlight

### 快速实体访问器

我们知道，用Item实体的Thrower标签可以保存实体的UUID引用并进行高效的访问：

```mcfunction
# 将当前实体的UUID保存到物品NBT中
# 假设我们物品实体的uuid固定为0-0-0-0-1
data modify entity 0-0-0-0-1 Thrower set from entity @s UUID
```

只要这个实体还存在，接下来在我们数据包的任何位置，我们都可以通过这个物品实体来访问这个实体：

```mcfunction
execute as 0-0-0-0-1 on origin run <命令>
```

但是如果要储存多个实体的引用呢？我们可以让多个物品实体骑乘在一个世界实体上，借助世界实体进行访问：

```mcfunction
# 假设世界实体是0-0-0-0-2
execute as 0-0-0-0-2 on passengers on origin run <命令>
```

当我们要添加新的实体引用时，只需要让一个新的物品实体骑乘在世界实体上即可，无需限定物品实体的UUID。