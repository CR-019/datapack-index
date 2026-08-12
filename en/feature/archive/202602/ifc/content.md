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

## write in front
Before we know it, it will be one year since Feature was founded. We received many valuable submissions this year, but we also encountered some problems.  \
When communicating in the group, I often hear that some authors have made very interesting discoveries and projects, but they mistakenly believe that the submission threshold for "Feature" is very high and dare not submit articles. This is a big misunderstanding.  \
**"Feature" encourages the submission of all vanillaMC-related discoveries, tutorials and works. **The actual submission threshold is very low. As long as you make any small discovery or write a tutorial on even a small knowledge point, you can actively contribute to "Feature". The original intention of our platform was to communicate. Contribution is the source of vitality for communication. **Don’t be afraid to contribute! **\
In addition, other authors may suffer from lack of time to write articles about their findings, which is indeed a pity. **We encourage authors to write submissions with the assistance of AI, but authors are also responsible for the authenticity of their articles. **\
Finally, many people think that the influence of "Feature" is still very limited. This is indeed true, and we are still working hard. If you want to contribute to the promotion of Vanilla Library and "Feature", please recommend them to your friends who write data packs! **\

## What's New in the Library?

This month the vanilla prefab library has added the following prefabs:
- [DFLdata packfunction support library](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/DFL_Functions.html)
- Provides some miscellaneous function encapsulation
- [Player Data Expansion](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/PlayerDataExpansion.html)
- Create a player-specific data space in storage
- [Better Custom Tools](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/BetterCustomTools.html)
- Allows users to more easily configure the interactive effects of items



## Command Flashlight Command Flashlight


### SNBT operation
SNBT can accept some unprocessed data and convert them into values ​​that NBT can accept. This is the syntax sugar of SNBT - SNBT Operations (SNBT Operations), both upper and lower case, the format is:

````
<操作名>(<参数>)
````


Write this in the value of SNBT:

````
<标签名>:<操作名>(<参数>)
````


There are currently two SNBT operations available:

- Convert the parameter to a Boolean value in the format

  ````
  bool(<arg>)
  ````


where `&lt;arg&gt;` must be a boolean or number. If a Boolean value is entered, the value will be used directly; if a number is entered, non-`0`data will be converted to`true`, and `0`will be converted to`false`; if the input is not a Boolean value or a number, the conversion will fail. For example:

  `bold:bool(true)`→`bold:true`

  `NoAI:bool(0)`→`NoAI:false`

  `Invulnerable:bool(5)`→`Invulnerable:true`

`italic:bool("italic")` → Conversion failed

- Convert the hyphenated hexadecimal UUID to an #icon(name: "nbt-int_array") integer array in the format

  ````
  uuid(<str>)
  ````


where `&lt;str&gt;` must be a hyphenated hexadecimal UUID. For example:

  `UUID:uuid("8890812a-c393-41e0-a9aa-4b93aa46927f")`→`UUID:[I;-2003795670,-1013759520,-1448457325,-1438215553]")`

### An instruction performs the operation of (x*a-1)*b on any int of storage: If x is a positive number:

```mcfunction
execute store result storage io var int b run data get storage io var a-.0000000001 
```


If x is negative:

```mcfunction
execute store result storage io var int b run data get storage io var a+.0000000001
```

Special case: x cannot be 0

For example: `x*3-5`
It can be seen that `b=5,a=3/5=0.6`

execute store result storage io var int 5 run data get storage io var .5999999999 
 
Check the calculation 10
Target value: `10*3-5=25`
`10*.5999999999 = 5.999999999 => 5 5*5=25`, consistent with the target value
Check it -10
Target value: `
- 10*3-5=-35 -10*.6000000001 = -6.000000001 => -7 -7*5=-35`, consistent with the target value



## Q&A
Q: How to use the apply_impluse magic effector to apply momentum in a fixed direction?

A: The actual principle is more complicated, and you will encounter bugs that cause specific directions to fail. It is recommended to use [`fptrick_impulse_v2`](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/fptrick_impulse.html) pre-library solution.

> I successfully resolved MC-303789. I discovered a way that works much better than I originally thought!
> So now it's ready for practical use. It passed all 640 test cases I prepared, so it should work...I thought. The usage is the same as before:
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
    category="Chats"
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
