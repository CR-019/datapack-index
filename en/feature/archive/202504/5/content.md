---
title: 'Java Edition 1.21.5-SNBT Syntax Overview'
---

<FeatureHead
    title = "Java Edition 1.21.5 - SNBT Syntax Overview"
    authorName = "luobojuo"
/>



First give a piece of function code:

```mcfunction
data modify storage generic:test test set value 1b

data merge storage generic:test map_value {"标签1":1,"标签2":true,"复合标签":{test_list:[1,2,3], test_value:2.0d, test_string:"hello"}}

data modify storage generic:data arg.uuid set value uuid($(uuid))
```
The above function contains 3 commands, and the last parameter of each command is SNBT. It can be seen that the SNBT format is very important.

## Literal - SNBT literal

SNBT literal is a sequence of characters combined according to specific rules. The SNBT syntax contains the following literals:

- Integer Literal (Integer Literal)
- Float Literal
- List Literal
-Map Literal

Any combination of the above types of literals is an SNBT literal.

## Bool - Boolean value

*`true`* Ignore case. For example`TRue`It's also legal.

*`false`* Ignore case.

Example:
In the following example,`True`Equivalent to`true`：
```mcfunction
data modify storage generic:test temp set value True
```
## Integer - Integer

Integer literals contain the following syntax atoms:

- Sign: the positive number`+`burden`-`Number.
- Integer suffix (Integer Suffix): used to represent the specific type of integer, generally the first letter of the English corresponding to its type.
  - Byte type (Bool):`B`or`b`.
  - Integer:`I`or`i`.
  -Short:`S`or`s`.
  - Long type (Long):`L`or`l`.
-Binary Numeral: Binary numbers must start with`0b`Begins with, and subsequent values ​​can only start with`0`、`1`represented by two characters.
- Decimal Numeral: Decimal numbers do not have special leading symbols and cannot be`0`At the beginning, the numerical value is used`0`arrive`9`express.
- Hex Numeral: Hexadecimal numbers must start with`0x`At the beginning, the numerical value is used`0`arrive`9`as well as`A`arrive`F`to express.

Syntax format:`[&lt;sign>](0b&lt;binary digits>|0x&lt;hexadecimal digits>|&lt;decimal digits>)[&lt;integer suffix>]`The last part of the first command in the previous article`1b`Is an integer literal, the data type it represents is byte type.

Example:
Hexadecimal signed integer type:

```mcfunction
data modify storage generic:test temp set value 0xF
```
Binary unsigned byte type:

```mcfunction
data modify storage generic:test temp set value 0b10000000ub
```
Decimal signed long:

```mcfunction
data modify storage generic:test temp set value 12345456789L
```
The following example does not represent a hexadecimal signed byte type, but will be deduced to a hexadecimal signed integer type (`0xAB`in`B`Treated as a hexadecimal number rather than a type suffix):

```mcfunction
data modify storage generic:test temp set value 0xAb
```
To represent a hexadecimal byte type, the symbol class must be specified explicitly:

```mcfunction
data modify storage generic:test temp set value 0xAsb
```
## Float - floating point number

Float literals contain the following syntax atoms:

- Float Type Suffix
  - Single precision floating point number (Float):`f`or`F`- Double precision floating point number (Double):`d`or`D`- Float Exponent Part
  - Grammar format:`(e|E)[&lt;sign>]&lt;decimal digits>`- The integer part of floating point numbers: consistent with the syntax rules of decimal numbers.
- The decimal part of floating point numbers: the same syntax rules as decimal numbers.

Syntax format:

- Full form:`[&lt;sign>]&lt;floating-point integer part>.[&lt;floating-point fractional part>][&lt;floating-point exponent part>]&lt;floating-point suffix>`- Decimal form:`[&lt;sign>].&lt;floating-point fractional part>[&lt;floating-point exponent part>][&lt;floating-point suffix>]`- Integer form:`[&lt;sign>]&lt;floating-point integer part>[&lt;floating-point exponent part>]&lt;floating-point suffix>`Example:
The following example shows the exponential form of a floating point number. If the suffix is ​​not written, it will be deduced as a double-precision floating point number by default. Therefore, the data set below is`100.0d`

```mcfunction
data modify storage generic:test temp set value 10E1
```
Part of the mantissa of the single-precision floating point number is omitted, and the actual SNBT obtained is`123.12312f`：
```mcfunction
data modify storage generic:test temp set value 123.123123f
```
## String - String

The syntax atoms related to String are as follows:

- 2-digit hexadecimal sequence
  - Match 2 consecutive characters`C`,character`C`Must be one of the following characters:
    -`0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`- 4-digit hexadecimal sequence
  - Match 4 consecutive characters`C`,character`C`Must be one of the following characters:
    -`0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`- 8-digit hexadecimal sequence
  - Match 8 consecutive characters`C`,character`C`Must be one of the following characters:
    -`0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`- Named Unicode sequences
  - Unicode names must satisfy regular expressions`[-a-zA-Z0-9 ]+`- string escape sequence
  -`\b`
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
  - `\N{&lt;named Unicode sequence>}`- string content
  - Simple string content
    - if the character does not belong to`\|"'\`Any one of them is a simple string content.
  - Single quoted string content
    - Composed of multiple single-quoted string sequence groups.
    - single quoted string sequence group
      -`&lt;simple string content>`or`"`or`\`&lt;String escape sequence&gt;`
  - Double quoted string content
    - Composed of multiple double-quoted string sequence groups.
    - Double quoted string sequence group
      -`&lt;simple string content>`or`'`or`\`&lt;String escape sequence&gt;`
- Quoted string literals
	-`"\&lt;double-quoted string content>"`
	- `'\&lt;single-quoted string content>'`- Naked string (Unquoted String, "unquoted string" in the game)
  - It can only be a character sequence composed of numbers, plus signs, minus signs, and periods, and cannot be composed of numbers or plus signs.`+`, minus sign``-`, dot sign`.`beginning.

Example:

```mcfunction
tellraw @s hello
```


```mcfunction
tellraw @s '你好'
```
Failure to quote will result in a Chinese error (does not comply with bare string rules):

```mcfunction
tellraw @s 你好
```
An example of item description (here`\u00a7`will be escaped as format characters`§`。`§a`That is, subsequent characters are rendered in green):

```mcfunction
give @s stone[lore=['\u00a7a你好']]
```
use`\n`To wrap:

```mcfunction
tellraw @s '\na\nb'
```
Output named Unicode characters:

```mcfunction
tellraw @s '\N{Snowman}'
```
## Map - mapping table

The syntax atoms contained in Map Literal are as follows:

- Map Key
  - for`&lt;quoted string literal>`or`&lt;unquoted string>`-Map Entry
  -`&lt;map key>:&lt;literal>`- Map Entries
  -`&lt;map entry>, &lt;map entry>, ...`- Mapping table literals
  -`{&lt;map entry>}`Example:

The plain text component itself is a mapping table:

```mcfunction
tellraw @s {text:'hhh'}
```
Construct a custom mapping and store it in command storage:

```mcfunction
data modify storage generic:test temp set value {"`(@_@)'":233}
```
## List - linear list

The syntax atoms related to lists or arrays are as follows:

- Linear representation terms
  -`&lt;literal>, &lt;literal>, ...`- array header
  -`B|L|I`- Represents byte type, long integer type and integer type respectively.
- Traditional items of integer array
  -`&lt;integer literal>, &lt;integer literal>, ...`- linear expression literal
  -`[ (&lt;array prefix>;&lt;array element>)|(list element), ... ]`Example:
A common list of homogeneous element types:

```
mcfunction
data modify storage generic:test temp set value [1,2,3]
```
Lists also allow element heterogeneity and nesting (see below). But be aware that element isomorphism is not allowed in low versions, that is, all elements must be of the same type as the first element.

```mcfunction
data modify storage generic:test temp set value [1,'a',[1, 2, 3]]
```
A text component can be described using a list. The first element will be considered the parent component and subsequent elements will inherit its color.

```mcfunction
tellraw @s [{text:'',color:'gold'}, '是"cber"，还是"datapackpacker"，也是"vanilla lover"。']
```
Arrays are only allowed to take on different types within the upper limit of their type range, in the following example`0L`is a long integer, exceeding`B`Byte upper limit.

```mcfunction
data modify storage generic:test temp set value [B;1b,123,0L]
```
The following example is the correct way to write it. Each array element does not exceed the upper limit of byte type specified in the array header.

```mcfunction
data modify storage generic:test temp set value [B;1b,123,0]
```
## SNBT data operation

The syntax of an SNBT data operation (SNBT Operation) is:

-`&lt;unquoted string>(&lt;multiple arguments>)`
  - `&lt;unquoted string>`Must be a legal SNBT operation name.
  -`&lt;multiple arguments>`The syntax is`&lt;parameter 1>, &lt;parameter 2>, ...`Built-in data operations:

As of 1.21.5, only the following two built-in operations are currently allowed, each of which allows only one parameter to be entered:

*`bool`: Convert data to a Boolean value. The data must be an integer, string literal, or boolean.
*`uuid`: Convert a hexadecimal uuid string to a UUID array.

Example:
The derivation rules for parameters are the same as the SNBT literals introduced above.`123`will be deduced to an integer first and then converted to a boolean:

```
mcfunction
data modify storage generic:test temp set value bool(123)
```
The parameter entered in the uuid conversion operation should be a string. In order to avoid it being deduced as a number, it is best to add quotes:

```mcfunction
data modify storage generic:test temp set value uuid('1-2-3-4-5')
```