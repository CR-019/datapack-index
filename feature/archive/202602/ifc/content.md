<script setup>
import { useData } from 'vitepress'
import ColorLine from '/.vitepress/vue/ColorLine.vue'
const { isDark } = useData()
</script>

# 封二
<ColorLine :height="4"/>

## 写在前面
不知不觉我们Feature即将创办满一年了。在这一年我们收到了很多有价值的投稿，不过也遇到了一些问题。  
在群内交流的时候，我经常听说一些作者明明做出了很有趣的发现和项目，**却误以为《Feature》的投稿门槛很高而不敢投稿**，这是很大的误解。  
**《Feature》鼓励一切原版MC相关的发现、教程和作品的投稿。**其实际投稿门槛非常低。只要你做出了任何微小的发现或写了某个哪怕是很小的知识点的教程，都可以积极向《Feature》投稿。我们创办平台的初衷便是为了交流。投稿即是交流活力的源头。**不要害怕投稿！**  
另外，另一些作者可能苦于没有时间去将自己的发现写成文章，确实令人惋惜。**我们鼓励作者在AI的辅助下完成投稿的编写，但作者也需要对文章的真实性负责。**  
最后，很多人认为《Feature》的影响力还很有限，这确实是事实，我们还在努力。如果你想为宣传香草图书馆和《Feature》出一份力，**请将它们推荐给你身边写数据包的伙伴吧！**

## 图书馆上新 What's New

本月香草前置馆新增了下列前置：
- [DFL数据包函数支持库](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/DFL_Functions.html) - 提供一些杂项函数封装
- [Player Data Expansion](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/PlayerDataExpansion.html) - 在storage中创建玩家专有数据空间
- [Better Custom Tools](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/BetterCustomTools.html) - 允许用户更简单的配置物品的交互效果



## 命令快闪 Command Flashlight


### SNBT操作
SNBT可以接受一些未经处理的数据，从而讲它们转换为NBT可以接受的值，这就是SNBT的语法糖——**SNBT操作（SNBT Operations）**，大小写均可，格式为：

````
<操作名>(<参数>)
````

将其写在SNBT的值中：

````
<标签名>:<操作名>(<参数>)
````

现在一共有两种可用的SNBT操作：

- 将参数转换为布尔值，格式为

  ````
  bool(<arg>)
  ````

  其中 `<arg>` 必须为布尔值或数字。若输入布尔值，则直接使用该值；若输入数字，则将非 `0` 的数据转换为 `true`，`0` 转换为 `false`；若输入的不是布尔值或数字，则转换失败。例如：

  `bold:bool(true)` → `bold:true`

  `NoAI:bool(0)` → `NoAI:false`

  `Invulnerable:bool(5)` → `Invulnerable:true`

  `italic:bool("italic")` → 转换失败

- 将有连字符的十六进制形式的UUID转换为 #icon(name: "nbt-int_array") 整型数组，格式为

  ````
  uuid(<str>)
  ````

  其中 `<str>` 必须是有连字符的十六进制形式的UUID。例如：

  `UUID:uuid("8890812a-c393-41e0-a9aa-4b93aa46927f")` → `UUID:[I;-2003795670,-1013759520,-1448457325,-1438215553]")`

### 一条指令对任意storage的int做(x*a-1)*b的运算: 如果x是正数： 

```mcfunction
execute store result storage io var int b run data get storage io var a-.0000000001 
```

如果x是负数： 

```mcfunction
execute store result storage io var int b run data get storage io var a+.0000000001
```
特殊情况： x不能为0  

例如： `x*3-5`   
可知`b=5,a=3/5=0.6`

execute store result storage io var int 5 run data get storage io var .5999999999 
 
验算一下10   
目标值：`10*3-5=25`  
`10*.5999999999 = 5.999999999 => 5 5*5=25`，和目标值一致   
验算一下-10  
目标值：`-10*3-5=-35 -10*.6000000001 = -6.000000001 => -7 -7*5=-35`，和目标值一致



## 你问我答 Q & A
Q：如何使用apply_impluse魔咒效果器沿固定方向施加动量？

A：实际原理较为复杂，并会遇到特定朝向失效的bug，推荐使用[`fptrick_impulse_v2`](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/fptrick_impulse.html)前置库解决。

> 我成功解决了 MC-303789 这个问题。我发现了一个比最初设想好得多的方法！ 
> 所以现在它已经可以实际使用了。它通过了我准备的全部 640 个测试用例，所以应该能行……我想。使用方法和之前一样： 
> ``` 
> scoreboard players set #x fptrick_impulse 10000 
> scoreboard players set #y fptrick_impulse 20000 
> scoreboard players set #z fptrick_impulse 30000 
> execute as @p run function fptrick_impulse:launch_global 
> ```

<ClientOnly>
  <GiscusComment
    repo="CR-019/datapack-index"
    repoId="R_kgDONRhuqw"
    category="闲聊 Chats"
    categoryId="DIC_kwDONRhuq84CkchW"
    mapping="number"
    term="49"
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