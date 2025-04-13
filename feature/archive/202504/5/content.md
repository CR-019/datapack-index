# Java版1.21.5-SNBT语法概览
> by [luobojuo](https://space.bilibili.com/3461565177137515)


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

![image-20250327213612697](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213612697.png)

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

![image-20250327213643079](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213643079.png)

![image-20250327213707511](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213707511.png)

## ![image-20250327213748600](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213748600.png)

![image-20250327213821832](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213821832.png)

![image-20250327213841348](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213841348.png)

![image-20250327213901008](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213901008.png)

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

![image-20250327213939428](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213939428.png)

![image-20250327213953651](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213953651.png)

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

![image-20250327214318160](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214318160.png)

![image-20250327214044945](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214044945.png)

![image-20250327214057370](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214057370.png)

![image-20250327214140136](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214140136.png)

![image-20250327214218573](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214218573.png)

![image-20250327214252904](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214252904.png)

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

![image-20250327214343371](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214343371.png)

![image-20250327214416964](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214416964.png)

![image-20250327214541240](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214541240.png)



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

![image-20250327214626742](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214626742.png)

![image-20250327214816845](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214816845.png)

![image-20250327214900890](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214900890.png)

![image-20250327214913679](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214913679.png)

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

![image-20250327213016667](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327213016667.png)

![image-20250327214959145](C:\Users\18428\AppData\Roaming\Typora\typora-user-images\image-20250327214959145.png)