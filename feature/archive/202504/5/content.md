<script setup>
    import FeatureHead from '/.vitepress/vue/FeatureHead.vue'
</script>

<FeatureHead
    title = Java版1.21.5-SNBT语法概览
    authorName = luobojuo
    avatarUrl = '../../_authors/_default.png'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/3461565177137515' }
    ]"
/>


先给出一段函数代码：

```mcfunction
data modify storage generic:test test set value 1b

data merge storage generic:test map_value {"标签1":1,"标签2":true,"复合标签":{test_list:[1,2,3], test_value:2.0d, test_string:"hello"}}

data modify storage generic:data arg.uuid set value uuid($(uuid))
```

以上函数包含3条命令，每条命令的最后一个参数均为SNBT。可见SNBT格式是很重要的。

## Literal - SNBT字面量

SNBT字面量（Literal）是一段以特定规则组合而成的字符序列。SNBT语法中包含下列字面量：

- 整数字面量（Integer Literal）
- 浮点数字面量（Float Literal）
- 列表字面量（List Literal）
- 映射表字面量（Map Literal）

以上类型的字面量经过任意组合即为SNBT字面量。

## Bool - 布尔值

* `true`
  * 忽略大小写。例如`TRue`也是合法的。

* `false`
  * 忽略大小写。

示例：
下例中，`True`等效于`true`：
```
data modify storage generic:test temp set value True
```

## Integer - 整数

整数字面量包含以下语法原子：

- 数符（Sign）：即数字的正`+`负`-`号。
- 整数后缀（Integer Suffix）：用以表示整数的具体类型，一般为其类型所对应英文的首字母。
  - 字节型（Bool）：`B`或`b`。
  - 整型（Integer）：`I`或`i`。
  - 短整型（Short）：`S`或`s`。
  - 长整型（Long）：`L`或`l`。
- 二进制数字（Binary Numeral）：二进制数字必须以`0b`开头，之后的数值只能以`0`、`1`两个字符来表示。
- 十进制数字（Decimal Numeral）：十进制数字不带特殊的前导符号，且不能以`0`开头，数值使用`0`到`9`表示。
- 十六进制数字（Hex Numeral）：十六进制数字必须以`0x`开头，数值使用`0`到`9`以及`A`到`F`来表示。

语法格式：`[<数符>](0b<二进制数字>|0x<十六进制数字>|<十进制数字>)[<整数后缀>]`

前文第一条命令中末尾的`1b`是一个整数字面量，其代表的数据类型为字节型。

示例：
十六进制有符号整型：
```
data modify storage generic:test temp set value 0xF
```
二进制无符号字节型：
```
data modify storage generic:test temp set value 0b10000000ub
```
十进制有符号长整型：
```
data modify storage generic:test temp set value 12345456789L
```
下例并非表示十六进制有符号字节型，而是会被推导为十六进制有符号整型（`0xAB`中的`B`被视为十六进制数而非类型尾缀）：
```
data modify storage generic:test temp set value 0xAb
```
为了表示十六进制字节型，必须显式指定符号类别：
```
data modify storage generic:test temp set value 0xAsb
```

## Float - 浮点数

浮点数字面量（Float Literal）包含以下语法原子：

- 浮点数类型后缀（Float Type Suffix）
  - 单精度浮点数（Float）：`f`或`F`
  - 双精度浮点数（Double）：`d`或`D`
- 浮点数指数部分（Float Exponent Part）
  - 语法格式：`(e|E)[<数符>]<十进制数字>`
- 浮点数整数部分：和十进制数字的语法规则一致。
- 浮点数小数部分：和十进制数字的语法规则一致。

语法格式：

- 完整形式：`[<数符>]<浮点数整数部分>.[<浮点数小数部分>][<浮点数指数部分>]<浮点数后缀>`
- 小数形式：`[<数符>].<浮点数小数部分>[<浮点数指数部分>][<浮点数后缀>]`
- 整数形式：`[<数符>]<浮点数整数部分>[<浮点数指数部分>]<浮点数后缀>`

示例：
下例为浮点数的指数形式。未写尾缀，将被默认推导为双精度浮点数。故以下设置的数据为`100.0d`

```
data modify storage generic:test temp set value 10E1
```

单精度浮点数的部分尾数被省略，实际所获取到的SNBT为`123.12312f`：
```
data modify storage generic:test temp set value 123.123123f
```

## String - 字符串

字符串（String）相关的语法原子如下：

- 2位十六进制序列
  - 匹配2个连续的字符`C`，字符`C`必须为以下字符之一：
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- 4位十六进制序列
  - 匹配4个连续的字符`C`，字符`C`必须为以下字符之一：
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- 8位十六进制序列
  - 匹配8个连续的字符`C`，字符`C`必须为以下字符之一：
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- 命名Unicode序列
  - Unicode名称必须满足正则表达式`[-a-zA-Z0-9 ]+`
- 字符串转义序列
  - `\b`
  - `\s`
  - `\t`
  - `\n`
  - `\f`
  - `\r`
  - `\'`
  - `\"`
  - `\\`
  - `\r`
  - `\x`
  - `\u`
  - `\U`
  - `\N{<命名Unicode序列>}`
- 字符串内容
  - 简单字符串内容
    - 若字符不属于`\|"'\`中的任何一个，则属于简单字符串内容。
  - 单引号字符串内容
    - 由多个单引号字符串序列组组合而成。
    - 单引号字符串序列组
      - `<简单字符串内容>`或`"`或`\`<字符串转义序列>`
  - 双引号字符串内容
    - 由多个双引号字符串序列组组合而成。
    - 双引号字符串序列组
      - `<简单字符串内容>`或`'`或`\`<字符串转义序列>`
- 引号字符串字面量
	- `"\<双引号字符串内容>"`
	- `'\<单引号字符串内容>'`
- 裸字符串（Unquoted String，游戏内为“无引号字符串”）
  - 仅能为数字、加号、减号、点号组成的字符序列，且不能以数字、加号`+`、减号``-`、点号`.`开头。

示例：

```
tellraw @s hello
```

```
tellraw @s '你好'
```
未加引号将导致中文错误（不符合裸字符串规则）：
```
tellraw @s 你好
```

一个关于物品描述的例子（这里`\u00a7`将被转义为格式字符`§`。`§a`即将后续字符渲染为绿色）：
```
give @s stone[lore=['\u00a7a你好']]
```

使用`\n`来换行：
```
tellraw @s '\na\nb'
```

输出命名Unicode字符：
```
tellraw @s '\N{Snowman}'
```



## Map - 映射表

映射表字面量（Map Literal）包含的语法原子如下：

- 映射表键（Map Key）
  - 为`<引号字符串字面量>`或`<裸字符串>`
- 映射表项（Map Entry）
  - `<映射表键>:<字面量>`
- 映射表繁项（Map Entries）
  - `<映射表项>, <映射表项>, ...`
- 映射表字面量
  - `{<映射表繁项>}`

示例：

纯文本型文本组件本身即为一个映射表：
```
tellraw @s {text:'hhh'}
```

构造自定义的映射，并存入命令存储：
```
data modify storage generic:test temp set value {"`(@_@)'":233}
```



## List - 线性列表

列表或数组相关的语法原子如下：

- 线性表繁项
  - `<字面量>, <字面量>, ...`
- 数组头标
  - `B|L|I`
    - 分别表示字节型、长整型、整型。
- 整型数组繁项
  - `<整型字面量>, <整型字面量>, ...`
- 线性表字面量
  - `[ (<数组头标>;<数组繁项>)|(线性表繁项), ... ]`

示例：
一个常见的齐元素类型列表：
```
data modify storage generic:test temp set value [1,2,3]
```

列表也允许元素异构和嵌套（如下）。但要注意，在低版本并不允许元素异构，即所有元素必须与第一个元素类型一致。
```
data modify storage generic:test temp set value [1,'a',[1, 2, 3]]
```

可使用列表描述文本组件，首元素将被视为父组件，后续元素将继承其颜色。
```
tellraw @s [{text:'',color:'gold'}, '是"cber"，还是"datapackpacker"，也是"vanilla lover"。']
```

数组只允许在其类型范围上限内采取不同的类型，下例中`0L`为长整型，超出`B`字节型上限。
```
data modify storage generic:test temp set value [B;1b,123,0L]
```

下例是正确的写法，每个数组元素都未超过数组头所规定的字节型上限。
```
data modify storage generic:test temp set value [B;1b,123,0]
```

## SNBT数据操作

一个SNBT数据操作（SNBT Operation）的语法为：

- `<裸字符串>(<多个参数>)`
  - `<裸字符串>`必须为一个合法的SNBT操作名。
  - `<多个参数>`的语法为`<参数1>, <参数2>, ...`

内置数据操作：

截止1.21.5，目前仅允许以下两种内置操作，每个操作都仅允许输入一个参数:

* `bool`：转换数据为一个布尔值。数据必须为一个整数、字符串字面量或布尔值。
* `uuid`：转换一个十六进制uuid字符串为一个UUID数组。

示例：
参数的推导规则与前文所介绍的SNBT字面量无异。`123`将被先推导为整型，然后再转换为布尔值：

```
data modify storage generic:test temp set value bool(123)
```

uuid转换操作内所输入的参数应为一个字符串，为了避免其被推导为数字，最好加上引号：
```
data modify storage generic:test temp set value uuid('1-2-3-4-5')
```