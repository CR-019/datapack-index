---
next:
    text: '返回原文'
    link: '/feature/archive/202511/1/content'
---

# [使用数据包制作编译器或解释器: 以C语言子集C-Minus为例](./content.md)

## 四、语法分析(Parse)、语义分析与中间代码生成

### 4.4 表达式求值部分构建

#### 4.4.1 准备工作

与词法分析器相近的是，我们在此也会使用谓词简化一些需要复杂的execute判断才能完成的类型区分。

谓词 `c-:parse/type-specifier` (类型限定符，对于C-Minus而言只有`int`和`void`。)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":-4}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":-5}}]
}
```

谓词 `c-:parse/addop` (加法运算符，包含`+`和`-`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":43}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":45}}]
}
```

谓词 `c-:parse/mulop` (乘法运算符，包含`*`,`/`和`%`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":42}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":47}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":37}}]
}
```

谓词 `c-:parse/relop` (比较运算符，包含 `==`,`<=`,`>=`,`!=`,`>`和`<`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":60}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":62}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":{"min":75,"max":78}}}]
}
```

谓词 `c-:parse/movop` (赋值运算符，包含`=`,`+=`,`-=`,`*=`,`/=`和`%=`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":61}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":{"min":70,"max":74}}}]
}
```

#### 4.4.2 开始

由于有些情况下已经读取到表达式的第一个词素才能决定该式将使用表达式方式解析，我们在此处使用类似词法分析部分的方式，即表达式识别的"开始状态"是第一个词素已经识别并返回的状态。

同时，由于表达式内可以通过括号和函数调用的方式嵌入子表达式，我们把整体的初始化工作放在另一个函数中完成，并使用栈管理主表达式与子表达式的关系。每一层子表达式的识别开始都将在`now-expression`列表后增补一个列表，识别结束后会将其整理至上一层列表作为最后一位元素。

函数 `c-:parse/expression/start`

```mcfunction
data modify storage c-: now-expression set value []
scoreboard players set #tmpvar-count c- 0

function c-:parse/expression/
```

函数 `c-:parse/expression/`

```mcfunction
data modify storage c-: now-expression append value []

execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary

function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}
```

#### 4.4.3 变量与数字节点

由于我们通常需要看到变量的下一个运算符才能决定变量是否被归约，此处在读入变量或数字时不对其尝试进行任何归约操作。
更通俗地说，我们将始终"让运算符寻找与结合变量"。不过，有两件事是需要在此处完成的，即对读入的变量名确定其所在作用域，并附加作用域偏移值信息; 对读入的数字登记至常数计分板。

函数 `c-:parse/expression/number`

```mcfunction
# -- THIS --
data modify storage c-: now-expression[-1] append value {_:{__:-100}}
execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get @s c-
function c-:parse/constant-register with storage c-: now-expression[-1][-1]._

# -- NEXT --
function c-:lexical-analysis/node/
execute if predicate c-:parse/mulop run return run function c-:parse/expression/mulop
execute if predicate c-:parse/addop run return run function c-:parse/expression/addop
execute if predicate c-:parse/relop run return run function c-:parse/expression/relop

# -- ERROR --
execute if predicate c-:parse/movop run return run function c-:terminate {msg:"SyntaxError: lvalue required as left operand of assignment"}

# -- END --
return run function c-:parse/expression/end
```

函数 `c-:parse/constant-register`

```mcfunction
$scoreboard players set #$(_) c-data.-100 $(_)
```

函数 `c-:parse/expression/name`

```mcfunction
# -- THIS --
function c-:parse/find-name/
data modify storage c-: now-expression[-1] append value {}
data modify storage c-: now-expression[-1][-1]._ set from storage c-: extract

# -- NEXT --
function c-:lexical-analysis/node/
execute if predicate c-:parse/mulop run return run function c-:parse/expression/mulop
execute if predicate c-:parse/addop run return run function c-:parse/expression/addop
execute if predicate c-:parse/relop run return run function c-:parse/expression/relop
execute if predicate c-:parse/movop run return run function c-:parse/expression/mov
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/call/start

# -- ERROR --

# -- END --
return run function c-:parse/expression/end
```

我们将使用以下一组函数确定变量的作用域。需要注意的是，函数名属于全局变量，其位置将被用于存放该函数的返回值。
函数 `c-:parse/find-name/`

```mcfunction
execute store result score #visit-chain-len c- run data get storage c-: now-variable
scoreboard players set #var-offset c- 0
execute if score #visit-chain-len c- matches 1.. run function c-:parse/find-name/_
```

函数 `c-:parse/find-name/_`

```mcfunction
# Loop: Layered Local scope
scoreboard players remove #visit-chain-len c- 1
execute store result storage c-: extract.__ int 1 run scoreboard players get #visit-chain-len c-

execute store result score #__got c- run function c-:parse/find-name/__ with storage c-: extract
execute if score #__got c- matches 1 run return run execute store result storage c-: extract.__ int 1 run scoreboard players get #var-offset c-

# Fallback: global scope
scoreboard players add #var-offset c- 1
execute if score #visit-chain-len c- matches 1.. run return run function c-:parse/find-name/_

execute store result score #__got c- run function c-:parse/find-name/- with storage c-: extract
execute if score #__got c- matches 1 run return run data modify storage c-: extract.__ set value -1

# Error
function c-:terminate {msg:"NameError: name '%3$s' is not defined (first use in this function)"}
```

函数 `c-:parse/find-name/__`

```mcfunction
$return run execute if data storage c-: now-variable[$(__)][{name:"$(_)"}]
```

函数 `c-:parse/find-name/-`

```mcfunction
$return run execute if data storage c-: variable[{name:"$(_)"}]
```

#### 4.4.4 运算符节点

运算符节点将尝试进行所有可能可行的归约操作（单目运算符除外，我们将把单目正负运算符直接视为操作数为0的加减法处理），如乘法节点将尝试进行乘法归约，而加法节点将尝试进行乘法和加法归约。由于加法和乘法均为左结合运算，每一次归约尝试只会进行一次。

函数 `c-:parse/expression/unary`

```mcfunction
# -- THIS --
data modify storage c-: now-expression[-1] append value {_:{_:0,__:-100}}
execute store result storage c-: now-expression[-1][-1]._.v byte 1 run scoreboard players get @s c-token

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}

# -- END --
```

函数 `c-:parse/expression/mulop`

```mcfunction
# -- THIS --
function c-:parse/expression/reduction/mulop/
execute store result storage c-: now-expression[-1][-1]._.v byte 1 run scoreboard players get @s c-token

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}

# -- END --
```

函数 `c-:parse/expression/addop`

```mcfunction
# -- THIS --
function c-:parse/expression/reduction/mulop/
function c-:parse/expression/reduction/addop/
execute store result storage c-: now-expression[-1][-1]._.v byte 1 run scoreboard players get @s c-token

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}

# -- END --
```

函数 `c-:parse/expression/relop`

```mcfunction
# -- THIS --
function c-:parse/expression/reduction/mulop/
function c-:parse/expression/reduction/addop/
function c-:parse/expression/reduction/relop/
execute store result storage c-: now-expression[-1][-1]._.v byte 1 run scoreboard players get @s c-token

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}

# -- END --
```

赋值语句较为特殊，由于赋值为右结合性运算，归约只能在整段语句全部完成后开始，因此在读入等号时只能作登记。

函数 `c-:parse/expression/mov`

```mcfunction
# -- THIS --
execute store result storage c-: now-expression[-1][-1]._.v byte 1 run scoreboard players get @s c-token

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}

# -- END --
```

#### 4.4.5 结束节点

读入逗号、括号和分号等运算符之外的字符均会触发本层表达式的结束（例外为左括号，其行为是开始一个新的表达式层），结束时会再次尝试进行加法和乘法归约，并最终进行赋值语句归约。
由于赋值语句的右结合性，赋值语句在此的归约操作会循环进行。
函数 `c-:parse/expression/end`

```mcfunction
function c-:parse/expression/reduction/mulop/
function c-:parse/expression/reduction/addop/
function c-:parse/expression/reduction/relop/
function c-:parse/expression/reduction/mov/
```

#### 4.4.6 子表达式节点

子表达式节点由不附加于变量名之后的括号开始，到右括号止。
子表达式识别过程中会在栈`now-expression`中附加新的一项，而在识别结束后该项的最终元素会被附加至上一层末尾作为其中一个元素，继续参与上一层的运算。

::: warning 注意
C语言有一个不太常用的语法，允许使用逗号分隔放置多个表达式，最终只会返回最后一个表达式的值。此处对该语法情况作了考虑。
:::

函数 `c-:parse/expression/bracket`

```mcfunction
# -- THIS --
function c-:lexical-analysis/node/
function c-:parse/expression/

execute if score @s c-token = #, c-chr run return run function c-:parse/expression/bracket_sep
execute unless score @s c-token = #) c-chr run return run function c-:terminate {msg:"SyntaxError: expected ')' before '%3$s' token"}

data modify storage c-: now-expression[-2] append from storage c-: now-expression[-1][0]
data remove storage c-: now-expression[-1]

# -- NEXT --
function c-:lexical-analysis/node/
execute if predicate c-:parse/mulop run return run function c-:parse/expression/mulop
execute if predicate c-:parse/addop run return run function c-:parse/expression/addop
execute if predicate c-:parse/relop run return run function c-:parse/expression/relop

# -- ERROR --
execute if predicate c-:parse/movop run return run function c-:terminate {msg:"SyntaxError: lvalue required as left operand of assignment"}

# -- END --
return run function c-:parse/expression/end
```

函数 `c-:parse/expression/bracket_sep`

```mcfunction
data remove storage c-: now-expression[-1]
return run function c-:parse/expression/bracket
```

#### 4.4.7 函数调用节点

函数调用节点由附加于变量名之后的括号开始，到右括号为止。其中每一个参数都将是一个子表达式。

函数 `c-:parse/expression/call/start`

```mcfunction
# -- THIS --
function c-:parse/expression/call/start_ with storage c-: now-expression[-1][-1]._

function c-:parse/expression/reduction/call/start

# -- NEXT --
function c-:lexical-analysis/node/
execute unless score @s c-token = #) c-chr run return run function c-:parse/expression/call/expr
return run function c-:parse/expression/call/end

# -- ERROR --

# -- END --
```

函数 `c-:parse/expression/call/start_`

```mcfunction
$execute unless data storage c-: variable[{name:"$(_)"}] run return run function c-:terminate {msg:"implicit declaration of function '$(_)'"}
$data modify storage c-: now-expression[-1][-1]._.arg set from storage c-: variable[{name:"$(_)"}].arg
$data modify storage c-: now-expression[-1][-1]._.__ set from storage c-: variable[{name:"$(_)"}].type
```

函数 `c-:parse/expression/call/expr`

```mcfunction
# -- THIS --
function c-:parse/expression/
execute if data storage c-: now-expression[-2][-1]._.arg run function c-:parse/expression/reduction/call/arg
data remove storage c-: now-expression[-1]

# -- NEXT --
execute if score @s c-token = #, c-chr run return run function c-:parse/expression/call/sep
execute if score @s c-token = #) c-chr run return run function c-:parse/expression/call/end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected ')' before '%3$s' token"}
```

函数 `c-:parse/expression/call/sep`

```mcfunction
function c-:lexical-analysis/node/
return run function c-:parse/expression/call/expr
```

函数 `c-:parse/expression/call/end`

```mcfunction
# -- THIS --
function c-:parse/expression/reduction/call/end

# -- NEXT --
function c-:lexical-analysis/node/
execute if predicate c-:parse/mulop run return run function c-:parse/expression/mulop
execute if predicate c-:parse/addop run return run function c-:parse/expression/addop
execute if predicate c-:parse/relop run return run function c-:parse/expression/relop

# -- ERROR --
execute if predicate c-:parse/movop run return run function c-:terminate {msg:"SyntaxError: lvalue required as left operand of assignment"}

# -- END --
return run function c-:parse/expression/end
```

#### 4.4.8 归约部分

##### 4.4.8.1 加法归约

我们将对加法部分分成以下四类情况处理:

- 前项为临时变量，此时我们直接将后一项对前一项进行加减操作，结果项为前一项。
- 前后项均为常数，此时我们直接进行常数计算，结果项为运算结果。
- 前后项其中有一项类型为`void`（来自void类型函数），报错。
- 余下，新建一个临时变量等于前一项，将后一项对临时变量加减，结果项为该临时变量。

函数 `c-:parse/expression/reduction/addop/`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:43b} run data modify storage c-: now-codeline.v set value add
execute if data storage c-: now-expression[-1][-2]._{v:45b} run data modify storage c-: now-codeline.v set value sub
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/addop/_
```

函数 `c-:parse/expression/reduction/addop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/addop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/addop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/addop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```

函数 `c-:parse/expression/reduction/addop/_1`

```mcfunction
data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/addop/_2`

```mcfunction
execute store result score #tmp_number0 c- run data get storage c-: now-expression[-1][-2]._._
execute store result score #tmp_number1 c- run data get storage c-: now-expression[-1][-1]._._

execute if data storage c-: now-expression[-1][-2]._{v:43b} run scoreboard players operation #tmp_number0 c- += #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:45b} run scoreboard players operation #tmp_number0 c- -= #tmp_number1 c-

execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get #tmp_number0 c-
function c-:parse/constant-register with storage c-: now-expression[-1][-1]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/addop/_3`

```mcfunction
data modify storage c-: now-function.code append value {s_:-2,v:mov}
execute store result storage c-: now-function.code[-1].s int 1 run scoreboard players add #tmpvar-count c- 1
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-function.code[-1].o_ set from storage c-: now-expression[-1][-2]._.__

data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-function.code[-1].s
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._._ set from storage c-: now-codeline.s
data modify storage c-: now-expression[-1][-1]._.__ set value -2
data remove storage c-: now-expression[-1][-2]
```

##### 4.4.8.2 乘法归约

乘法归约的基本情况与加法完全一致。

函数 `c-:parse/expression/reduction/mulop/`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:42b} run data modify storage c-: now-codeline.v set value mul
execute if data storage c-: now-expression[-1][-2]._{v:47b} run data modify storage c-: now-codeline.v set value div
execute if data storage c-: now-expression[-1][-2]._{v:37b} run data modify storage c-: now-codeline.v set value mod
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/mulop/_
```

函数 `c-:parse/expression/reduction/mulop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/mulop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/mulop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/mulop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```

函数 `c-:parse/expression/reduction/mulop/_1`

```mcfunction
data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/mulop/_2`

```mcfunction
execute store result score #tmp_number0 c- run data get storage c-: now-expression[-1][-2]._._
execute store result score #tmp_number1 c- run data get storage c-: now-expression[-1][-1]._._

execute if data storage c-: now-expression[-1][-2]._{v:42b} run scoreboard players operation #tmp_number0 c- *= #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:47b} run scoreboard players operation #tmp_number0 c- /= #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:37b} run scoreboard players operation #tmp_number0 c- %= #tmp_number1 c-

execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get #tmp_number0 c-
function c-:parse/constant-register with storage c-: now-expression[-1][-1]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/mulop/_3`

```mcfunction
data modify storage c-: now-function.code append value {s_:-2,v:mov}
execute store result storage c-: now-function.code[-1].s int 1 run scoreboard players add #tmpvar-count c- 1
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-function.code[-1].o_ set from storage c-: now-expression[-1][-2]._.__

data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-function.code[-1].s
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._._ set from storage c-: now-codeline.s
data modify storage c-: now-expression[-1][-1]._.__ set value -2
data remove storage c-: now-expression[-1][-2]
```

##### 4.4.8.3 比较运算归约

比较运算归约的基本情况同前两者，尽管该运算在中间语言实现上有3个操作数。

函数 `c-:parse/expression/reduction/relop/`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:60b} run data modify storage c-: now-codeline.v set value lt
execute if data storage c-: now-expression[-1][-2]._{v:62b} run data modify storage c-: now-codeline.v set value gt
execute if data storage c-: now-expression[-1][-2]._{v:75b} run data modify storage c-: now-codeline.v set value ne
execute if data storage c-: now-expression[-1][-2]._{v:76b} run data modify storage c-: now-codeline.v set value ge
execute if data storage c-: now-expression[-1][-2]._{v:77b} run data modify storage c-: now-codeline.v set value le
execute if data storage c-: now-expression[-1][-2]._{v:78b} run data modify storage c-: now-codeline.v set value eq
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/relop/_
```

函数 `c-:parse/expression/reduction/relop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/relop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/relop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/relop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```

函数 `c-:parse/expression/reduction/relop/_1`

```mcfunction
data modify storage c-: now-codeline merge value {s_:-2,o_:-2}
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o2 set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o2_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/relop/_2`

```mcfunction
execute store result score #tmp_number0 c- run data get storage c-: now-expression[-1][-2]._._
execute store result score #tmp_number1 c- run data get storage c-: now-expression[-1][-1]._._

execute if data storage c-: now-expression[-1][-2]._{v:60b} store result score #tmp_number0 c- if score #tmp_number0 c- < #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:62b} store result score #tmp_number0 c- if score #tmp_number0 c- > #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:75b} store result score #tmp_number0 c- unless score #tmp_number0 c- = #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:76b} store result score #tmp_number0 c- if score #tmp_number0 c- >= #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:77b} store result score #tmp_number0 c- if score #tmp_number0 c- <= #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:78b} store result score #tmp_number0 c- if score #tmp_number0 c- = #tmp_number1 c-

execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get #tmp_number0 c-
function c-:parse/constant-register with storage c-: now-expression[-1][-1]._
data remove storage c-: now-expression[-1][-2]
```

函数 `c-:parse/expression/reduction/relop/_3`

```mcfunction
data modify storage c-: now-codeline.s_ set value -2
execute store result storage c-: now-codeline.s int 1 run scoreboard players add #tmpvar-count c- 1
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-2]._.__
data modify storage c-: now-codeline.o2 set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o2_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._._ set from storage c-: now-codeline.s
data modify storage c-: now-expression[-1][-1]._.__ set value -2
data remove storage c-: now-expression[-1][-2]
```

##### 4.4.8.4 赋值归约

赋值归约只会有一种情况，不做分类。但由于赋值的右结合性，其需要循环运行。

函数 `c-:parse/expression/reduction/mov/`

```mcfunction
execute if function c-:parse/expression/reduction/mov/_ unless data storage c-: now-expression[-1][-1]._{__:void} run return run function c-:parse/expression/reduction/mov/
```

函数 `c-:parse/expression/reduction/mov/_`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:61b} run data modify storage c-: now-codeline.v set value mov
execute if data storage c-: now-expression[-1][-2]._{v:70b} run data modify storage c-: now-codeline.v set value add
execute if data storage c-: now-expression[-1][-2]._{v:71b} run data modify storage c-: now-codeline.v set value sub
execute if data storage c-: now-expression[-1][-2]._{v:72b} run data modify storage c-: now-codeline.v set value mul
execute if data storage c-: now-expression[-1][-2]._{v:73b} run data modify storage c-: now-codeline.v set value div
execute if data storage c-: now-expression[-1][-2]._{v:74b} run data modify storage c-: now-codeline.v set value mod
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/mov/__
return fail
```

函数 `c-:parse/expression/reduction/mov/__`

```mcfunction
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.s_ set from storage c-: now-expression[-1][-2]._.__
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
return 1
```

##### 4.4.8.5 函数调用归约

每一个参数都将是一个子表达式，每个参数的最终值均会被赋值至新创建的计分板，随后会正式开始函数调用并返回一个值（存储在该函数对应的全局计分板位置）。

为方便理解，此处将可能产生的中间代码列出如下:

```asm
chain-add ; 在访问链上新增一层。
; <第一个参数的计分板运算>
mov arg1[0] , 5[temp] ; 将以上表达式的最终结果存入新建层的参数变量处。
; <第二个参数的计分板运算>
mov arg2[0] , 7[temp] ; 将以上表达式的最终结果存入新建层的参数变量处。
; ...
; <第n个参数的计分板运算>
mov argn[0] , 18[temp]
call function1 ; 运行函数（函数开始时会移动访问链标号与临时计分板标号）。
mov 19[temp] , function1[global] ; 将其返回值存入本函数的temp层。
```

由于该过程中有新建层级，此处向`now-variable`中添加一个空列表以确保变量作用域正确。

函数`c-:parse/expression/reduction/call/start`

```mcfunction
data modify storage c-: now-function.code append value {v:chain-add}
data modify storage c-: now-variable append value []
```

函数`c-:parse/expression/reduction/call/arg`

```mcfunction
execute unless data storage c-: now-expression[-2][-1]._.arg[0] run return run function c-:terminate {msg:"TypeError: too many arguments to function"}

data modify storage c-: now-function.code append value {v:mov,s_:0}
data modify storage c-: now-function.code[-1].s set from storage c-: now-expression[-2][-1]._.arg[0].name
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[-1][0]._._
data modify storage c-: now-function.code[-1].o_ set from storage c-: now-expression[-1][0]._.__

data remove storage c-: now-expression[-2][-1]._.arg[0]
```

函数`c-:parse/expression/reduction/call/end`

```mcfunction
execute if data storage c-: now-expression[-1][-1]._.arg[0] run return run function c-:terminate {msg:"TypeError: too few arguments to function"}

data modify storage c-: now-function.code append value {v:call}
data modify storage c-: now-function.code[-1].f set from storage c-: now-expression[-1][-1]._._

data modify storage c-: now-function.code append value {s_:-2,v:mov,o_:-1}
execute store result storage c-: now-function.code[-1].s int 1 run scoreboard players add #tmpvar-count c- 1
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[-1][-1]._._

data remove storage c-: now-variable[-1]

execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get #tmpvar-count c-
data modify storage c-: now-expression[-1][-1]._{__:int}.__ set value -2
```

### 4.5 非表达式部分的自上而下构建

按照前面所述，我们将在非表达式部分采用自上而下的构建方式。

由于每一层分析过程都有可能产生错误，我们将在每一层递归中跟踪一个错误标记，若某一层分析执行时遇到错误则会中止递归。
该错误标记与词法分析的错误标记相同，也就是说，在语法分析出错时也会将玩家的c-token计分板分数覆盖为错误分数（127），并终止任何正在进行的分析过程。

::: warning 注意
由于一些初始化要求，之后分析过程的每层入口都是"这一个词素"（现在已经读入到c-token等计分板的词素）而不是"下一个词素"。

因此，若某一层在当前词素位置即可断定其部分结束，对应函数仍然需要再执行一次"获取词素"的操作，以避免死循环和异常行为。
:::

#### 4.5.1 程序层

我们定程序层(`<program>`)为第0层，循环查找全局定义。该层的bnf表示如下:

```bnf
<program> ::= <declaration-list>
<declaration-list> ::= <declaration-list> <declaration> | <declaration>
```

翻译过来就是，一个程序`<program>`总是由一个列表构成，列表中的每一项都是一个声明`<declaration>`。

函数 `c-:parse/start`

```mcfunction
data modify storage c-: variable set value []
data modify storage c-: now-variable set value []
data modify storage c-: now-function set value {}
data modify storage c-: now-declaration set value {}
data modify storage c-: now-expression set value []
scoreboard objectives remove c-data.-1
scoreboard objectives add c-data.-1 dummy
scoreboard objectives remove c-data.-100
scoreboard objectives add c-data.-100 dummy
function c-:lexical-analysis/start
function c-:parse/node/program
```

函数 `c-:parse/node/program`

```mcfunction
execute if score @s c-token = #end c-token run return 0
execute unless predicate c-:parse/type-specifier run return run function c-:terminate {msg:"SyntaxError: expected type-identifier before '%3$s' token"}

execute if predicate c-:parse/type-specifier run function c-:parse/node/declaration/type-specifier
execute unless score @s c-token = #error c-token run function c-:parse/node/program
```

#### 4.5.2 全局定义层

以下是C-Minus语言全局定义的bnf表示: （数组功能已经属于C-Minus扩展变体的范畴了，具体实现中我们暂时不会支持数组。）

```bnf
<declaration> ::= <var-declaration> | <fun-declaration>

<var-declaration> ::= <type-specifier> ID ; | <type-specifier> ID [ NUM ] ;
<type-specifier> ::= int | void

<fun-declaration> ::= <type-specifier> ID ( <params> ) <compound-stmt>
<params> ::= <param-list> | void
<param-list> ::= <param-list> , <param> | <param>
<param> ::= <type-specifier> ID | <type-specifier> ID [ ]
```

大概翻译一下:

- 一个C-Minus代码文件是由一系列全局声明(`<declaration>`)构成的，这些全局声明有两类: 变量声明(`<var-declaration>`)与函数定义(`<fun-declaration>`)。
- 一条声明语句的前两个词素分别为一个类型标识(`<type-specifier>`)与一个变量名(`ID`)，但从第三项起开始分家:
  - 函数定义的第三项为左小括号，代表参数列表的起始（注意: C无法设置参数初始值）;
  - 变量声明的第三项可能为`=`（赋初始值，只能为常量）、`,`（下一项同类型变量声明）或`;`（声明结束）。

为识别这些内容，我们采取与词法分析阶段十分类似的方式，为这一过程构建节点。

##### 4.5.2.1 共同内容

函数 `c-:parse/node/declaration/type-specifier`

```mcfunction
# -- THIS --
data modify storage c-: now-declaration set value {}
execute unless score @s c-token = #void c-reserved run data modify storage c-: now-declaration.type set value "int"

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #name c-token run return run function c-:parse/node/declaration/name with storage c-: extract

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected identifier before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/name`

```mcfunction
# -- THIS --
$execute if data storage c-: variable[{name:"$(_)"}] run return run function c-:terminate {msg:"SyntaxError: redifinition of '%3$s'"}
data modify storage c-: now-declaration.name set from storage c-: extract._

# -- NEXT --
function c-:lexical-analysis/node/
$execute unless score @s c-token = #( c-chr unless data storage c-: now-declaration.type run return run function c-:terminate {msg:"TypeError: variable or field '$(_)' declared void"}
execute if score @s c-token = #( c-chr run return run function c-:parse/node/declaration/arg/start
execute if score @s c-token = #, c-chr run return run function c-:parse/node/declaration/sep
execute if score @s c-token = #= c-chr run return run function c-:parse/node/declaration/equal
execute if score @s c-token = #; c-chr run return run function c-:parse/node/declaration/var-end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected '=', ',' or ';' before '%3$s' token"}

# -- END --
```

##### 4.5.2.2 变量声明分支

函数 `c-:parse/node/declaration/equal`

```mcfunction
# -- THIS --

# -- NEXT --
function c-:lexical-analysis/node/
tag @s add c-exp-constant
function c-:parse/expression/start
tag @s remove c-exp-constant

# -- ERROR --

# -- END --
execute unless score @s c-token = #error c-token run return run function c-:parse/node/declaration/value
```

函数 `c-:parse/node/declaration/value`

```mcfunction
# -- THIS --
data modify storage c-: now-declaration.initial set from storage c-: now-expression[-1][0]._._

# -- NEXT --
execute if score @s c-token = #, c-chr run return run function c-:parse/node/declaration/sep
execute if score @s c-token = #; c-chr run return run function c-:parse/node/declaration/var-end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected ',' or ';' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/sep`

```mcfunction
# -- THIS --
data modify storage c-: variable append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #name c-token run return run function c-:parse/node/declaration/name with storage c-: extract
# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected identifier before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/var-end`

```mcfunction
# -- THIS --
data modify storage c-: variable append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/

# -- ERROR --

# -- END --
```

##### 4.5.2.3 函数定义分支

函数 `c-:parse/node/declaration/arg/start`

```mcfunction
# -- THIS --
data modify storage c-: now-function set from storage c-: now-declaration
data modify storage c-: now-variable append value []
data remove storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #int c-reserved run return run function c-:parse/node/declaration/arg/type-specifier
execute if score @s c-token = #void c-reserved run return run function c-:parse/node/declaration/arg/void
execute if score @s c-token = #) c-chr run return run function c-:parse/node/declaration/arg/end

# -- ERROR --

function c-:terminate {msg:"SyntaxError: expected identifier or ')' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/arg/type-specifier`

```mcfunction
# -- THIS --
data modify storage c-: now-declaration set value {type:"int"}

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #name c-token run return run function c-:parse/node/declaration/arg/name with storage c-: extract

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected identifier"}

# -- END --
```

函数 `c-:parse/node/declaration/arg/void`

```mcfunction
# -- THIS --
data modify storage c-: now-function.arg set value []

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #) c-chr run return run function c-:parse/node/declaration/arg/end

# -- ERROR --
execute if score @s c-token = #name c-token run return run function c-:terminate {msg:"TypeError: parameter has incomplete type"}
execute if score @s c-token = #, c-chr run return run function c-:terminate {msg:"TypeError: 'void' must be the only parameter"}
function c-:terminate {msg:"SyntaxError: expected ')'"}

# -- END --
```

函数 `c-:parse/node/declaration/arg/name`

```mcfunction
# -- THIS --
$execute if data storage c-: now-function.arg[{name:"$(_)"}] run return run function c-:parse/terminate {msg:"SyntaxError: redifinition of parameter '$(_)'"}
data modify storage c-: now-declaration.name set from storage c-: extract._

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #, c-chr run return run function c-:parse/node/declaration/arg/sep
execute if score @s c-token = #) c-chr run return run function c-:parse/node/declaration/arg/end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected ',' or ')' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/arg/sep`

```mcfunction
# -- THIS --
data modify storage c-: now-function.arg append from storage c-: now-declaration
data modify storage c-: now-variable[-1] append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #int c-reserved run return run function c-:parse/node/declaration/arg/type-specifier
execute if score @s c-token = #) c-chr run return run function c-:parse/node/declaration/arg/end

# -- ERROR --
execute if score @s c-token = #void c-reserved run return run function c-:terminate {msg:"TypeError: parameter has incomplete type"}
function c-:terminate {msg:"SyntaxError: expected identifier or ')' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/declaration/arg/end`

```mcfunction
# -- THIS --
data modify storage c-: now-function.arg append from storage c-: now-declaration
data modify storage c-: variable append from storage c-: now-function
data modify storage c-: now-variable[-1] append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/

# -- ERROR --
execute unless score @s c-token = #{ c-chr run return run function c-:terminate {msg:"SyntaxError: expected declaration specifiers before '%3$s' token"}

# -- END --
return run function c-:parse/node/declaration/func
```

函数 `c-:parse/node/declaration/func`

```mcfunction
data modify storage c-: now-block set value [{chain:1b,func:1b}]
function c-:lexical-analysis/node/
function c-:parse/node/local/
```

#### 4.5.3 局部层

局部层即单个函数或代码块内部。对于C-Minus而言，局部层可能出现以下几种语句类型:（方便读者观看，此处先不使用bnf格式表达这部分代码格式。）

```c
if (<expr>)<local>
while (<expr>)<local>
{<block>}
return <expr>;
return;
int <name>[=<expr>][,<name>[=<expr>]];
<expr>;
```

函数 `c-:parse/node/local/block-start` （注: 代码块开始时读入的词素是大括号，因此需要向后跳一位词素再开始。）

```mcfunction
function c-:lexical-analysis/node/
function c-:parse/node/local/start
```

函数 `c-:parse/node/local/start`

```mcfunction
data modify storage c-: now-block append value {}
return run function c-:parse/node/local/
```

函数 `c-:parse/node/local/`

```mcfunction
execute if score @s c-token = #} c-chr run return run function c-:parse/node/local/end
function c-:parse/node/local/_
execute unless score @s c-token = #error c-token run function c-:parse/node/local/
```

函数 `c-:parse/node/local/_`

```mcfunction
execute if score @s c-token = #{ c-chr run return run function c-:parse/node/local/block-start
execute if predicate c-:parse/type-specifier run return run function c-:parse/node/local/declaration/type-specifier
execute if score @s c-token = #if c-reserved run return run function c-:parse/node/local/if/
execute if score @s c-token = #while c-reserved run return run function c-:parse/node/local/while/
execute if score @s c-token = #return c-reserved if data storage c-: now-function.type run return run function c-:parse/node/local/return/
execute if score @s c-token = #return c-reserved unless data storage c-: now-function.type run return run function c-:parse/node/local/return/void
return run function c-:parse/node/local/expression
```

函数 `c-:parse/node/local/end` （我们只对出现了变量声明的代码块添加作用域，因此在代码块结束时移除该作用域。对于函数则在末尾添加return 0语句。）

```mcfunction
execute if data storage c-: now-block[-1].chain unless data storage c-: now-block[-1].func run data modify storage c-: now-function.code append value {v:chain-remove}
execute if data storage c-: now-block[-1].func run data modify storage c-: now-function.code append value {v:ret,s:0,s_:-100}
execute if data storage c-: now-block[-1].chain run data remove storage c-: now-variable[-1]
data remove storage c-: now-block[-1]

execute unless data storage c-: now-block[0] run function c-:parse/node/declaration/func_ with storage c-: now-function

function c-:lexical-analysis/node/
```

函数 `c-:parse/node/declaration/func_` （如果是函数定义则将代码移入全局变量存储 variable 中。）

```mcfunction
$data modify storage c-: variable[{name:"$(name)"}].code set from storage c-: now-function.code
```

##### 4.5.3.1 单个表达式

函数 `c-:parse/node/local/expression`

```mcfunction
# -- EXPR --
function c-:parse/expression/start

# -- , --
execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/expression_sep

# -- ; --
execute unless score @s c-token = #; c-chr run return run function c-:terminate {msg:"SyntaxError: expected ';' before '%3$s' token"}
function c-:lexical-analysis/node/
```

函数 `c-:parse/node/local/expression_sep`

```mcfunction
function c-:lexical-analysis/node/
return run function c-:parse/node/local/expression
```

##### 4.5.3.2 局部变量声明

局部变量声明部分除不可定义函数以及初值可以不是常数外与全局变量声明的结构没有太大差别。
效率起见，我们将只会给存在局部变量声明的代码块添加单独的作用域层级。

函数 `c-:parse/node/local/type-identifier`

```mcfunction
# -- THIS --
data modify storage c-: now-declaration set value {}
data modify storage c-: now-declaration.type set value "int"

execute unless data storage c-: now-block[-1].chain run data modify storage c-: now-function.code append value {v:chain-add}
execute unless data storage c-: now-block[-1].chain run data modify storage c-: now-variable append value []
execute unless data storage c-: now-block[-1].chain run data modify storage c-: now-block[-1].chain set value 1b

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #name c-token run return run function c-:parse/node/local/declaration/name with storage c-: extract

# -- ERROR --
function c-:terminate {msg:"SyntaxError: expected identifier before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/local/name`

```mcfunction
# -- THIS --
$execute if data storage c-: now-block.variable[{name:"$(_)"}] run return run function c-:terminate {msg:"SyntaxError: redifinition of '%3$s'"}
data modify storage c-: now-declaration.name set from storage c-: extract._

# -- NEXT --
function c-:lexical-analysis/node/
$execute unless data storage c-: now-declaration.type run return run function c-:terminate {msg:"TypeError: variable or field '$(_)' declared void"}
execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/declaration/sep
execute if score @s c-token = #= c-chr run return run function c-:parse/node/local/declaration/equal
execute if score @s c-token = #; c-chr run return run function c-:parse/node/local/declaration/var-end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected '=', ',' or ';' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/local/equal`

```mcfunction
# -- THIS --

# -- NEXT --
function c-:lexical-analysis/node/
function c-:parse/expression/start

# -- ERROR --

# -- END --
execute unless score @s c-token = #error c-token run return run function c-:parse/node/local/declaration/value
```

函数 `c-:parse/node/local/value`

```mcfunction
# -- THIS --
data modify storage c-: now-function.code append value {s_:0,v:mov}
data modify storage c-: now-function.code[-1].s set from storage c-: now-declaration.name
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[0][0]._._
data modify storage c-: now-function.code[-1].o_ set from storage c-: now-expression[0][0]._.__

# -- NEXT --
execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/declaration/sep
execute if score @s c-token = #; c-chr run return run function c-:parse/node/local/declaration/var-end

# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected ',' or ';' before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/local/sep`

```mcfunction
# -- THIS --
data modify storage c-: now-variable[-1] append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/
execute if score @s c-token = #name c-token run return run function c-:parse/node/local/declaration/name with storage c-: extract
# -- ERROR --
return run function c-:terminate {msg:"SyntaxError: expected identifier before '%3$s' token"}

# -- END --
```

函数 `c-:parse/node/local/var-end`

```mcfunction
# -- THIS --
data modify storage c-: now-variable[-1] append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/

# -- ERROR --

# -- END --
```

##### 4.5.3.3 if-else语句和while语句

if-else语句和while语句遵循相当固定的格式，因此我们可以合并几乎所有节点到一两个函数中连续执行。
由于我们需要在确定代码块规模之后才能回到上文添加跳转，此处先使用栈记录需要添加跳转的位置（if有1个，if-else有2个，while有2个）。

具体中间代码结构可参考如下:

```asm
; if
if temp3 , label1 ; 若temp3为0则跳转至label1
; <if代码块内的内容>
jmp label2 ; 跳转至label2
; <label1>
; <else代码块内的内容>
; <label2>

; while
; <label0>
; <表达式计算结果至temp3>
if temp3 , label1 ; 若temp3为0则跳转至label1
; <while代码块内的内容>
jmp label0 ; 跳转至label0
; <label1>
```

函数 `c-:parse/node/local/while/`

```mcfunction
# -- WHILE --
data modify storage c-: now-declaration set value {v:if}

data modify storage c-: now-block append value {}
execute store result storage c-: now-block[-1].0 int 1 run data get storage c-: now-function.code

# -- ( --
function c-:lexical-analysis/node/
execute unless score @s c-token = #( c-chr run return run function c-:terminate {msg:"SyntaxError: expected '(' before '%3$s' token"}

# -- EXPR --
function c-:parse/node/local/while/expr

# -- ) --
execute unless score @s c-token = #) c-chr run return run function c-:terminate {msg:"SyntaxError: expected ')' before '%3$s' token"}

# -- EXPR / BLOCK / ; --
function c-:lexical-analysis/node/
function c-:parse/node/local/while/_

# -- LOOP --
data modify storage c-: now-function.code append value {v:jmp}
data modify storage c-: now-function.code[-1].b set from storage c-: now-block[-1].0

# -- JUMP --
function c-:parse/node/local/while/__ with storage c-: now-block[-1]

data remove storage c-: now-block[-1]
```

函数 `c-:parse/node/local/if/`

```mcfunction
# -- IF --
data modify storage c-: now-declaration set value {v:if}

data modify storage c-: now-block append value {}

# -- ( --
function c-:lexical-analysis/node/
execute unless score @s c-token = #( c-chr run return run function c-:terminate {msg:"SyntaxError: expected '(' before '%3$s' token"}

# -- EXPR --
function c-:parse/node/local/while/expr

# -- ) --
execute unless score @s c-token = #) c-chr run return run function c-:terminate {msg:"SyntaxError: expected ')' before '%3$s' token"}

# -- EXPR / BLOCK / ; --
function c-:lexical-analysis/node/
function c-:parse/node/local/while/_

# -- ELSE? --
execute if score @s c-token = #else c-reserved run return run function c-:parse/node/local/if/else

# -- JUMP --
function c-:parse/node/local/while/__ with storage c-: now-block[-1]

data remove storage c-: now-block[-1]
```

函数 `c-:parse/node/local/if/else`

```mcfunction
# -- ELSE --
execute store result storage c-: now-block[-1].2 int 1 run data get storage c-: now-function.code
data modify storage c-: now-function.code append value {v:jmp}

# -- JUMP1 --
function c-:parse/node/local/while/__ with storage c-: now-block[-1]

# -- EXPR / BLOCK / ; --
function c-:lexical-analysis/node/
function c-:parse/node/local/while/_

# -- JUMP2 --
function c-:parse/node/local/if/_ with storage c-: now-block[-1]

data remove storage c-: now-block[-1]
```

一些辅助函数如下: (为节省调试开销，if-else代码块与while代码块共享部分辅助函数。)
函数 `c-:parse/node/local/while/expr`

```mcfunction
function c-:lexical-analysis/node/
function c-:parse/expression/
data modify storage c-: now-declaration.s set from storage c-: now-expression[-1][0]._._
data modify storage c-: now-declaration.s_ set from storage c-: now-expression[-1][0]._.__
data remove storage c-: now-expression[-1]

execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/while/expr

execute store result storage c-: now-block[-1].1 int 1 run data get storage c-: now-function.code
data modify storage c-: now-function.code append from storage c-: now-declaration
```

函数 `c-:parse/node/local/while/_` （其实就是local入口去掉一个变量声明类型。）

```mcfunction
execute if score @s c-token = #{ c-chr run return run function c-:parse/node/local/block-start
execute if score @s c-token = #if c-reserved run return run function c-:parse/node/local/if/
execute if score @s c-token = #while c-reserved run return run function c-:parse/node/local/while/
execute if score @s c-token = #return c-reserved if data storage c-: now-function.type run return run function c-:parse/node/local/return/
execute if score @s c-token = #return c-reserved unless data storage c-: now-function.type run return run function c-:parse/node/local/return/void
return run function c-:parse/node/local/expression
```

函数 `c-:parse/node/local/while/__` （用于处理跳转1。）

```
$execute store result storage c-: now-function.code[$(1)].b int 1 run data get storage c-: now-function.code
```

函数 `c-:parse/node/local/if/_` （用于处理跳转2。）

```mcfunction
$execute store result storage c-: now-function.code[$(2)].b int 1 run data get storage c-: now-function.code
```

##### 4.5.3.4 return语句

return语句对不同类型的函数有不同的入口。无返回值的函数只能有无返回值的return语句，有返回值的函数必须带返回值返回。
函数 `c-:parse/node/local/return/void` （无返回值的函数使用该入口。）

```mcfunction
# -- RETURN (VOID) --
data modify storage c-: now-function.code append value {v:ret,s:0,s_:-100}
data modify storage c-: now-function.code[-1].f set from storage c-: now-function.name

# -- ; --
function c-:lexical-analysis/node/
execute unless score @s c-token = #; c-chr run return run function c-:terminate {msg:"TypeError: 'return' with a value, in function returning void"}
```

函数 `c-:parse/node/local/return/` （有返回值的函数使用该入口。）

```mcfunction
# -- RETURN (INT) --
data modify storage c-: now-declaration set value {v:ret}

# -- EXPR --
function c-:lexical-analysis/node/
execute if score @s c-token = #; c-chr run return run function c-:terminate {msg:"TypeError: 'return' with no value, in function returning non-void"}
function c-:parse/expression/start

data modify storage c-: now-declaration.s set from storage c-: now-expression[-1][0]._._
data modify storage c-: now-declaration.s_ set from storage c-: now-expression[-1][0]._.__
data modify storage c-: now-declaration.f set from storage c-: now-function.name
data remove storage c-: now-expression[-1]

# -- , --
execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/return/sep

# -- ; --
execute unless score @s c-token = #; c-chr run return run function c-:terminate {msg:"SyntaxError: expected ';' before '%3$s' token"}
data modify storage c-: now-function.code append from storage c-: now-declaration
function c-:lexical-analysis/node/
```

函数 `c-:parse/node/local/return/sep`

```mcfunction
function c-:lexical-analysis/node/
function c-:parse/node/local/return/
```
