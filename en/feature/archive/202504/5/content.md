---
title: 'Java Edition 1.21.5-SNBT Syntax Overview'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "Java Edition 1.21.5-SNBT Syntax Overview"
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

- Integer Literal
- Float Literal
- List Literal
- Map Literal

Any combination of the above types of literals is an SNBT literal.

## Bool - Boolean value

* `true`
  * Case is ignored. For example, `TRue` is also legal.

* `false`
  * Case is ignored.

Example:
In the following example, `True`is equivalent to`true`:
```mcfunction
data modify storage generic:test temp set value True
```


## Integer - integer

Integer literals contain the following syntax atoms:

- Sign: the positive `+`negative`
- ` sign of a number.
- Integer suffix (Integer Suffix): used to represent the specific type of integer, generally the first letter of the English corresponding to its type.
  - Byte type (Bool): `B`or`b`.
  - Integer: `I`or`i`.
  - Short (Short): `S`or`s`.
  - Long integer (Long): `L`or`l`.
- Binary Numeral: Binary numbers must start with `0b`, and subsequent values ​​can only be represented by the two characters `0`and`1`.
- Decimal numbers (Decimal Numeral): Decimal numbers do not have special leading symbols and cannot start with `0`. Values ​​are represented by `0`to`9`.
- Hexadecimal numbers (Hex Numeral): Hexadecimal numbers must start with `0x`, and the values ​​​​are represented by `0`to`9`and`A`to`F`.

Syntax format: `[&lt;number character&gt;](0b&lt;二进制数字>|0x&lt;十六进制数字>|&lt;十进制数字>)[&lt;integer suffix&gt;]`

The `1b` at the end of the first command above is an integer literal, and the data type it represents is byte type.

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

The following example does not represent a hexadecimal signed byte type, but will be deduced to a hexadecimal signed integer type (the `B`in`0xAB` is treated as a hexadecimal number rather than a type suffix):
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
  - Single precision floating point number (Float): `f`or`F`
  - Double precision floating point number (Double): `d`or`D`
- Float Exponent Part
  - Syntax format: `(e|E)[&lt;number character&gt;]&lt;decimal number&gt;`
- The integer part of floating point numbers: the same syntax rules as decimal numbers.
- The decimal part of floating point numbers: the same syntax rules as decimal numbers.

Syntax format:

- Full form: `[&lt;number symbol&gt;]&lt;integer part of floating point number&gt;.[&lt;fractional part of floating point number&gt;][&lt;exponent part of floating point number&gt;]&lt;floating point number suffix&gt;`
- Decimal form: `[&lt;number symbol&gt;].&lt;decimal part of floating point number&gt;[&lt;exponent part of floating point number&gt;][&lt;floating point number suffix&gt;]`
- Integer form: `[&lt;number symbol&gt;]&lt;integer part of floating point number&gt;[&lt;exponent part of floating point number&gt;]&lt;floating point number suffix&gt;`

Example:
The following example shows the exponential form of a floating point number. If the suffix is ​​not written, it will be deduced as a double-precision floating point number by default. Therefore, the data set below is `100.0d`

```mcfunction
data modify storage generic:test temp set value 10E1
```


Part of the mantissa of the single-precision floating point number is omitted, and the actual SNBT obtained is `123.12312f`:
```mcfunction
data modify storage generic:test temp set value 123.123123f
```


## String - string

The syntax atoms related to String are as follows:

- 2-digit hexadecimal sequence
  - Matches 2 consecutive characters `C`. The character `C` must be one of the following characters:
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- 4-digit hexadecimal sequence
  - Matches 4 consecutive characters `C`. The character `C` must be one of the following characters:
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- 8-digit hexadecimal sequence
  - Matches 8 consecutive characters `C`. The character `C` must be one of the following characters:
    - `0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F`
- Naming Unicode Sequences
  - Unicode names must satisfy the regular expression `[-a-zA-Z0-9]+`
- string escape sequence
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
  - `\N{&lt;named Unicode sequence&gt;}`
- String content
  - Simple string content
    - If the character does not belong to any of `\|"'\`, it belongs to simple string content.
  - Single quoted string content
    - It is composed of multiple single quoted string sequence groups.
    - single quoted string sequence group
      - `&lt;simple string content&gt;`or`"`or`\`&lt;string escape sequence&gt;`
  - Double quoted string content
    - It is composed of multiple double-quoted string sequence groups.
    - Double quoted string sequence group
      - `&lt;simple string content&gt;`or`''`or`\`&lt;string escape sequence&gt;`
- Quoted string literal
	- `"\&lt;double quoted string content&gt;"`
	- `'\&lt;single quoted string content&gt;'`
- Naked string (Unquoted String, "unquoted string" in the game)
  - It can only be a character sequence composed of numbers, plus sign, minus sign, and period, and cannot start with numbers, plus sign `+`, minus sign ``
- `, or period `.`.

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


An example of item description (here `\u00a7`will be escaped into the format character`§`. `§a` will render subsequent characters in green):
```mcfunction
give @s stone[lore=['\u00a7a你好']]
```


Use `\n` to break new lines:
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
  - is `&lt;quoted string literal&gt;`or`&lt;naked string&gt;`
- Map Entry
  - `&lt;mapping table key&gt;:&lt;literal&gt;`
- Map Entries
  - `&lt;mapping table entry&gt;, &lt;mapping table entry&gt;, ...`
- mapping table literal
  - `{&lt;Mapping table traditional items&gt;}`

Example:

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

- linear expression
  - `&lt;literal&gt;, &lt;literal&gt;, ...`
- array header
  - `B|L|I`
    - Represents byte type, long integer type and integer type respectively.
- Integer array traditional items
  - `&lt;integer literal&gt;, &lt;integer literal&gt;, ...`
- linear expression literal
  - `[ (&lt;array header&gt;;&lt;array traditional item&gt;)|(linear expression traditional item), ... ]`

Example:
A common list of homogeneous element types:
```mcfunction
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


Arrays are only allowed to take on different types within the upper limit of their type range. In the following example, `0L`is a long integer, which exceeds the upper limit of`B` byte type.
```mcfunction
data modify storage generic:test temp set value [B;1b,123,0L]
```


The following example is the correct way to write it. Each array element does not exceed the upper limit of byte type specified in the array header.
```mcfunction
data modify storage generic:test temp set value [B;1b,123,0]
```


## SNBT data operations

The syntax of an SNBT data operation (SNBT Operation) is:

- `&lt;naked string&gt;(&lt;multiple parameters&gt;)`
  - `&lt;naked string&gt;` must be a legal SNBT operation name.
  - The syntax of `&lt;multiple parameters&gt;`is`&lt;parameter1&gt;, &lt;parameter2&gt;, ...`

Built-in data operations:

As of 1.21.5, only the following two built-in operations are currently allowed, each of which allows only one parameter to be entered:

* `bool`: Convert data to a Boolean value. The data must be an integer, string literal, or boolean.
* `uuid`: Convert a hexadecimal uuid string to a UUID array.

Example:
The derivation rules for parameters are the same as the SNBT literals introduced above. `123` will be deduced to an integer and then converted to a boolean:

```mcfunction
data modify storage generic:test temp set value bool(123)
```


The parameter entered in the uuid conversion operation should be a string. In order to avoid it being deduced as a number, it is best to add quotes:
```mcfunction
data modify storage generic:test temp set value uuid('1-2-3-4-5')
```
