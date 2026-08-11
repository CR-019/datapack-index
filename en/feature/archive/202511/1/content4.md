---
next:
    text: 'Return to original text'
    link: '/feature/archive/202511/1/content'
---

# [Use data pack to make a compiler or interpreter: take the C language subset C-Minus as an example](/en/feature/archive/202511/1/content)

## 4. Syntax analysis (Parse), semantic analysis and intermediate code generation

### 4.4 Expression evaluation part construction

#### 4.4.1 Preparation

Similar to the lexical analyzer, we will also use predicate here to simplify some type distinctions that require complex execute judgments.

predicate`c-:parse/type-specifier`(Type qualifier, for C-Minus only`int`and`void`。)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":-4}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":-5}}]
}
```


predicate `c-:parse/addop`(Addition operator, including`+`and`-`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":43}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":45}}]
}
```


predicate `c-:parse/mulop`(Multiplication operator, including`*`,`/`and`%`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":42}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":47}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":37}}]
}
```


predicate `c-:parse/relop`(comparison operator, including`==`,`&lt;=`,`>=`,`!=`,`>`and`&lt;`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":60}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":62}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":{"min":75,"max":78}}}]
}
```


predicate `c-:parse/movop`(Assignment operator, including`=`,`+=`,`-=`,`*=`,`/=`and`%=`)

```json
{"condition":"any_of","terms":[
    {"condition":"entity_scores","entity":"this","scores":{"c-token":61}},
    {"condition":"entity_scores","entity":"this","scores":{"c-token":{"min":70,"max":74}}}]
}
```
#### 4.4.2 Start

Since in some cases the first lexeme of an expression has been read before it can be determined that the expression will be parsed using the expression method, we use a method similar to the lexical analysis part here, that is, the "start state" of expression recognition is the state in which the first lexeme has been recognized and returned.

At the same time, since subexpressions can be embedded in expressions through parentheses and function calls, we complete the overall initialization work in another function and use the stack to manage the relationship between the main expression and subexpressions. The recognition of sub-expressions at each level will start at`now-expression`A list is added after the list, and after the recognition is completed, it will be sorted to the upper level list as the last element.

function`c-:parse/expression/start`

```mcfunction
data modify storage c-: now-expression set value []
scoreboard players set #tmpvar-count c- 0

function c-:parse/expression/
```


function `c-:parse/expression/`

```mcfunction
data modify storage c-: now-expression append value []

execute if score @s[tag=c-exp-constant] c-token = #name c-token run return run function c-:terminate {msg:"SyntaxError: initializer element is not constant"}
execute if score @s c-token = #name c-token run return run function c-:parse/expression/name
execute if score @s c-token = #number c-token run return run function c-:parse/expression/number
execute if score @s c-token = #( c-chr run return run function c-:parse/expression/bracket
execute if predicate c-:parse/addop run return run function c-:parse/expression/unary

function c-:terminate {msg:"SyntaxError: expected expression before '%3$s' token"}
```
#### 4.4.3 Variables and Numeric Nodes

Since we usually need to see the next operator on a variable to decide whether it is reduced, no reduction is attempted on a variable or number when it is read in.
More informally, we will always "let operators find and combine variables". However, there are two things that need to be done here, namely, determine the scope of the read variable name and append the scope offset value information; register the read number to the constant scoreboard.

function`c-:parse/expression/number`

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


function `c-:parse/constant-register`

```mcfunction
$scoreboard players set #$(_) c-data.-100 $(_)
```


function `c-:parse/expression/name`

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
We will use the following set of functions to determine the scope of variables. It should be noted that the function name belongs to a global variable, and its location will be used to store the return value of the function.
function`c-:parse/find-name/`

```mcfunction
execute store result score #visit-chain-len c- run data get storage c-: now-variable
scoreboard players set #var-offset c- 0
execute if score #visit-chain-len c- matches 1.. run function c-:parse/find-name/_
```


function `c-:parse/find-name/_`

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


function `c-:parse/find-name/__`

```mcfunction
$return run execute if data storage c-: now-variable[$(__)][{name:"$(_)"}]
```


function `c-:parse/find-name/-`

```mcfunction
$return run execute if data storage c-: variable[{name:"$(_)"}]
```
#### 4.4.4 Operator Node

Operator nodes will try to perform all possible feasible reduction operations (except unary operators, we will treat unary positive and negative operators directly as addition and subtraction with operands of 0). For example, multiplication nodes will try to perform multiplicative reduction, while addition nodes will try to perform multiplication and additive reduction. Since both addition and multiplication are left associative operations, each reduction attempt is only performed once.

function`c-:parse/expression/unary`

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


function `c-:parse/expression/mulop`

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


function `c-:parse/expression/addop`

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


function `c-:parse/expression/relop`

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
The assignment statement is special. Since the assignment is a right associative operation, the reduction can only start after the entire statement is completed, so it can only be registered when the equal sign is read.

function`c-:parse/expression/mov`

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
#### 4.4.5 End node

Reading characters other than operators such as commas, parentheses, and semicolons will trigger the end of the expression in this layer (the exception is the left parenthesis, whose behavior is to start a new expression layer). At the end, addition and multiplication reduction will be attempted again, and finally assignment statement reduction will be performed.
Due to the right associativity of the assignment statement, the reduction operation of the assignment statement here will be performed in a loop.
function`c-:parse/expression/end`

```mcfunction
function c-:parse/expression/reduction/mulop/
function c-:parse/expression/reduction/addop/
function c-:parse/expression/reduction/relop/
function c-:parse/expression/reduction/mov/
```
#### 4.4.6 Subexpression node

A subexpression node begins with the parentheses that are not appended to the variable name and ends with the right parenthesis.
During the subexpression recognition process, it will be on the stack`now-expression`A new item is appended to the item, and after the recognition is completed, the final element of the item will be appended to the end of the previous layer as one of the elements and continue to participate in the operation of the previous layer.

::: warning note
The C language has a less common syntax that allows multiple expressions to be separated by commas, and only the value of the last expression will be returned. This grammatical situation is considered here.
:::

function`c-:parse/expression/bracket`

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


function `c-:parse/expression/bracket_sep`

```mcfunction
data remove storage c-: now-expression[-1]
return run function c-:parse/expression/bracket
```
#### 4.4.7 function call node

The function call node starts with the parentheses appended to the variable name and ends with the closing parenthesis. Each of these parameters will be a subexpression.

function`c-:parse/expression/call/start`

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


function `c-:parse/expression/call/start_`

```mcfunction
$execute unless data storage c-: variable[{name:"$(_)"}] run return run function c-:terminate {msg:"implicit declaration of function '$(_)'"}
$data modify storage c-: now-expression[-1][-1]._.arg set from storage c-: variable[{name:"$(_)"}].arg
$data modify storage c-: now-expression[-1][-1]._.__ set from storage c-: variable[{name:"$(_)"}].type
```


function `c-:parse/expression/call/expr`

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


function `c-:parse/expression/call/sep`

```mcfunction
function c-:lexical-analysis/node/
return run function c-:parse/expression/call/expr
```


function `c-:parse/expression/call/end`

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
#### 4.4.8 Reduction part

##### 4.4.8.1 Addition and reduction

We will divide the addition part into the following four categories:

- The previous item is a temporary variable. At this time, we directly add and subtract the latter item to the previous item, and the result item is the previous item.
- Both the preceding and following terms are constants. At this time, we directly perform constant calculations, and the result term is the operation result.
- One of the before and after items is of type`void`(from void type function), error reported.
- For the rest, create a new temporary variable equal to the previous item, add or subtract the latter item to the temporary variable, and the result item is the temporary variable.

function`c-:parse/expression/reduction/addop/`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:43b} run data modify storage c-: now-codeline.v set value add
execute if data storage c-: now-expression[-1][-2]._{v:45b} run data modify storage c-: now-codeline.v set value sub
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/addop/_
```


function `c-:parse/expression/reduction/addop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/addop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/addop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/addop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```


function `c-:parse/expression/reduction/addop/_1`

```mcfunction
data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
```


function `c-:parse/expression/reduction/addop/_2`

```mcfunction
execute store result score #tmp_number0 c- run data get storage c-: now-expression[-1][-2]._._
execute store result score #tmp_number1 c- run data get storage c-: now-expression[-1][-1]._._

execute if data storage c-: now-expression[-1][-2]._{v:43b} run scoreboard players operation #tmp_number0 c- += #tmp_number1 c-
execute if data storage c-: now-expression[-1][-2]._{v:45b} run scoreboard players operation #tmp_number0 c- -= #tmp_number1 c-

execute store result storage c-: now-expression[-1][-1]._._ int 1 run scoreboard players get #tmp_number0 c-
function c-:parse/constant-register with storage c-: now-expression[-1][-1]._
data remove storage c-: now-expression[-1][-2]
```


function `c-:parse/expression/reduction/addop/_3`

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
##### 4.4.8.2 Multiplicative reduction

The basic case of multiplicative reduction is exactly the same as that of addition.

function`c-:parse/expression/reduction/mulop/`

```mcfunction
data modify storage c-: now-codeline set value {}
execute if data storage c-: now-expression[-1][-2]._{v:42b} run data modify storage c-: now-codeline.v set value mul
execute if data storage c-: now-expression[-1][-2]._{v:47b} run data modify storage c-: now-codeline.v set value div
execute if data storage c-: now-expression[-1][-2]._{v:37b} run data modify storage c-: now-codeline.v set value mod
execute if data storage c-: now-codeline.v run return run function c-:parse/expression/reduction/mulop/_
```


function `c-:parse/expression/reduction/mulop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/mulop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/mulop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/mulop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```


function `c-:parse/expression/reduction/mulop/_1`

```mcfunction
data modify storage c-: now-codeline.s_ set value -2
data modify storage c-: now-codeline.s set from storage c-: now-expression[-1][-2]._._
data modify storage c-: now-codeline.o set from storage c-: now-expression[-1][-1]._._
data modify storage c-: now-codeline.o_ set from storage c-: now-expression[-1][-1]._.__
data modify storage c-: now-function.code append from storage c-: now-codeline

data modify storage c-: now-expression[-1][-1]._ set from storage c-: now-expression[-1][-2]._
data remove storage c-: now-expression[-1][-2]
```


function `c-:parse/expression/reduction/mulop/_2`

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


function `c-:parse/expression/reduction/mulop/_3`

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
##### 4.4.8.3 Comparison operation reduction

The basic situation of comparison operation reduction is the same as the previous two, although this operation has three operands in the intermediate language implementation.

function`c-:parse/expression/reduction/relop/`

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


function `c-:parse/expression/reduction/relop/_`

```mcfunction
execute if data storage c-: now-expression[-1][-2]._{__:-2} run return run function c-:parse/expression/reduction/relop/_1
execute if data storage c-: now-expression[-1][-2]._{__:-100} if data storage c-: now-expression[-1][-1]._{__:-100} run return run function c-:parse/expression/reduction/relop/_2
execute unless data storage c-: now-expression[-1][-2]._{__:-2147483648} unless data storage c-: now-expression[-1][-1]._{__:-2147483648} run return run function c-:parse/expression/reduction/relop/_3
return run function c-:terminate {msg:"TypeError: void value not ignored as it ought to be"}
```


function `c-:parse/expression/reduction/relop/_1`

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


function `c-:parse/expression/reduction/relop/_2`

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


function `c-:parse/expression/reduction/relop/_3`

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
##### 4.4.8.4 Assignment reduction

There will only be one case of assignment reduction and no classification will be done. However, due to the right associativity of assignment, it needs to be run in a loop.

function`c-:parse/expression/reduction/mov/`

```mcfunction
execute if function c-:parse/expression/reduction/mov/_ unless data storage c-: now-expression[-1][-1]._{__:void} run return run function c-:parse/expression/reduction/mov/
```


function `c-:parse/expression/reduction/mov/_`

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


function `c-:parse/expression/reduction/mov/__`

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
##### 4.4.8.5 function call reduction

Each parameter will be a subexpression, and the final value of each parameter will be assigned to the newly created scoreboard. Then the function call will be officially started and a value will be returned (stored in the global scoreboard location corresponding to the function).

For ease of understanding, the possible intermediate codes are listed here as follows:

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
Since there are new levels in this process, here is the`now-variable`Add an empty list to ensure correct variable scope.

function`c-:parse/expression/reduction/call/start`

```mcfunction
data modify storage c-: now-function.code append value {v:chain-add}
data modify storage c-: now-variable append value []
```


function`c-:parse/expression/reduction/call/arg`

```mcfunction
execute unless data storage c-: now-expression[-2][-1]._.arg[0] run return run function c-:terminate {msg:"TypeError: too many arguments to function"}

data modify storage c-: now-function.code append value {v:mov,s_:0}
data modify storage c-: now-function.code[-1].s set from storage c-: now-expression[-2][-1]._.arg[0].name
data modify storage c-: now-function.code[-1].o set from storage c-: now-expression[-1][0]._._
data modify storage c-: now-function.code[-1].o_ set from storage c-: now-expression[-1][0]._.__

data remove storage c-: now-expression[-2][-1]._.arg[0]
```


function`c-:parse/expression/reduction/call/end`

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
### 4.5 Top-down construction of non-expression parts

As mentioned before, we will use a top-down construction method for the non-expression part.

Since errors may occur during each level of analysis, we will track an error tag in each level of recursion. If an error is encountered during the execution of a certain level of analysis, the recursion will be terminated.
This error flag is the same as the error flag of lexical analysis, that is, when the syntax analysis fails, the player's c-token scoreboard score will also be overwritten as the error score (127), and any ongoing analysis process will be terminated.

::: warning note
Due to some initialization requirements, the entrance to each layer of the subsequent analysis process is "this morpheme" (the morpheme that has been read into the scoreboard such as c-token) instead of "the next morpheme".

Therefore, if a certain layer is at the current morpheme position, it can be concluded that its part is over, and the corresponding function still needs to perform the "get morpheme" operation again to avoid infinite loops and abnormal behaviors.
:::

#### 4.5.1 Program layer

We determine the program layer (`&lt;program&gt;`) is level 0, looping to find global definitions. The bnf of this layer is expressed as follows:

```
<program> ::= <declaration-list>
<declaration-list> ::= <declaration-list> <declaration> | <declaration>
```
Translated, it is a program`&lt;program&gt;`Always consists of a list, each item in the list is a statement`&lt;declaration&gt;`。

function `c-:parse/start`

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


function `c-:parse/node/program`

```mcfunction
execute if score @s c-token = #end c-token run return 0
execute unless predicate c-:parse/type-specifier run return run function c-:terminate {msg:"SyntaxError: expected type-identifier before '%3$s' token"}

execute if predicate c-:parse/type-specifier run function c-:parse/node/declaration/type-specifier
execute unless score @s c-token = #error c-token run function c-:parse/node/program
```
#### 4.5.2 Global definition layer

The following is the bnf representation of the C-Minus language global definition: (The array function already belongs to the category of C-Minus extended variants, and we will not support arrays in the specific implementation for the time being.)

```
<declaration> ::= <var-declaration> | <fun-declaration>

<var-declaration> ::= <type-specifier> ID ; | <type-specifier> ID [ NUM ] ;
<type-specifier> ::= int | void

<fun-declaration> ::= <type-specifier> ID ( <params> ) <compound-stmt>
<params> ::= <param-list> | void
<param-list> ::= <param-list> , <param> | <param>
<param> ::= <type-specifier> ID | <type-specifier> ID [ ]
```
Roughly translated:

- A C-Minus code file is composed of a series of global declarations (`&lt;declaration&gt;`), these global declarations are of two types: variable declarations (`&lt;var-declaration&gt;`) and function definition (`&lt;fun-declaration&gt;`).
- The first two morphemes of a declaration statement are each a type identifier (`&lt;type-specifier&gt;`) with a variable name (`ID`), but starting from the third item:
  - The third item in the function definition is the left parenthesis, which represents the beginning of the parameter list (note: C cannot set the initial value of the parameter);
  - The third item in the variable declaration may be`=`(Assign an initial value, which can only be a constant),`,`(next variable declaration of the same type) or`;`(end of statement).

To identify these, we build nodes for this process in a very similar way to the lexical analysis stage.

##### 4.5.2.1 Common content

function`c-:parse/node/declaration/type-specifier`

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


function `c-:parse/node/declaration/name`

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
##### 4.5.2.2 Variable declaration branch

function`c-:parse/node/declaration/equal`

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


function `c-:parse/node/declaration/value`

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


function `c-:parse/node/declaration/sep`

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


function `c-:parse/node/declaration/var-end`

```mcfunction
# -- THIS --
data modify storage c-: variable append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/

# -- ERROR --

# -- END --
```
##### 4.5.2.3 function definition branch

function`c-:parse/node/declaration/arg/start`

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


function `c-:parse/node/declaration/arg/type-specifier`

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


function `c-:parse/node/declaration/arg/void`

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


function `c-:parse/node/declaration/arg/name`

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


function `c-:parse/node/declaration/arg/sep`

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


function `c-:parse/node/declaration/arg/end`

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


function `c-:parse/node/declaration/func`

```mcfunction
data modify storage c-: now-block set value [{chain:1b,func:1b}]
function c-:lexical-analysis/node/
function c-:parse/node/local/
```
#### 4.5.3 Local layer

The local layer is within a single function or block of code. For C-Minus, the following statement types may appear in the local layer: (For the convenience of readers, we do not use bnf format to express this part of the code format here.)

```c
if (<expr>)<local>
while (<expr>)<local>
{<block>}
return <expr>;
return;
int <name>[=<expr>][,<name>[=<expr>]];
<expr>;
```


function `c-:parse/node/local/block-start`(Note: The lexeme read at the beginning of the code block is curly brackets, so you need to jump back one lexeme before starting.)

```mcfunction
function c-:lexical-analysis/node/
function c-:parse/node/local/start
```


function `c-:parse/node/local/start`

```mcfunction
data modify storage c-: now-block append value {}
return run function c-:parse/node/local/
```


function `c-:parse/node/local/`

```mcfunction
execute if score @s c-token = #} c-chr run return run function c-:parse/node/local/end
function c-:parse/node/local/_
execute unless score @s c-token = #error c-token run function c-:parse/node/local/
```


function `c-:parse/node/local/_`

```mcfunction
execute if score @s c-token = #{ c-chr run return run function c-:parse/node/local/block-start
execute if predicate c-:parse/type-specifier run return run function c-:parse/node/local/declaration/type-specifier
execute if score @s c-token = #if c-reserved run return run function c-:parse/node/local/if/
execute if score @s c-token = #while c-reserved run return run function c-:parse/node/local/while/
execute if score @s c-token = #return c-reserved if data storage c-: now-function.type run return run function c-:parse/node/local/return/
execute if score @s c-token = #return c-reserved unless data storage c-: now-function.type run return run function c-:parse/node/local/return/void
return run function c-:parse/node/local/expression
```


function `c-:parse/node/local/end`(We only add scope to the code block where the variable declaration appears, so remove the scope at the end of the code block. For functions, add a return 0 statement at the end.)

```mcfunction
execute if data storage c-: now-block[-1].chain unless data storage c-: now-block[-1].func run data modify storage c-: now-function.code append value {v:chain-remove}
execute if data storage c-: now-block[-1].func run data modify storage c-: now-function.code append value {v:ret,s:0,s_:-100}
execute if data storage c-: now-block[-1].chain run data remove storage c-: now-variable[-1]
data remove storage c-: now-block[-1]

execute unless data storage c-: now-block[0] run function c-:parse/node/declaration/func_ with storage c-: now-function

function c-:lexical-analysis/node/
```


function `c-:parse/node/declaration/func_`(If it is a function definition, move the code into the global variable storage variable.)

```mcfunction
$data modify storage c-: variable[{name:"$(name)"}].code set from storage c-: now-function.code
```
##### 4.5.3.1 Single expression

function`c-:parse/node/local/expression`

```mcfunction
# -- EXPR --
function c-:parse/expression/start

# -- , --
execute if score @s c-token = #, c-chr run return run function c-:parse/node/local/expression_sep

# -- ; --
execute unless score @s c-token = #; c-chr run return run function c-:terminate {msg:"SyntaxError: expected ';' before '%3$s' token"}
function c-:lexical-analysis/node/
```


function `c-:parse/node/local/expression_sep`

```mcfunction
function c-:lexical-analysis/node/
return run function c-:parse/node/local/expression
```
##### 4.5.3.2 Local variable declaration

The local variable declaration part is not much different from the structure of the global variable declaration except that the function cannot be defined and the initial value may not be a constant.
For efficiency, we will only add separate scope levels to blocks of code where local variable declarations exist.

function`c-:parse/node/local/type-identifier`

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


function `c-:parse/node/local/name`

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


function `c-:parse/node/local/equal`

```mcfunction
# -- THIS --

# -- NEXT --
function c-:lexical-analysis/node/
function c-:parse/expression/start

# -- ERROR --

# -- END --
execute unless score @s c-token = #error c-token run return run function c-:parse/node/local/declaration/value
```


function `c-:parse/node/local/value`

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


function `c-:parse/node/local/sep`

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


function `c-:parse/node/local/var-end`

```mcfunction
# -- THIS --
data modify storage c-: now-variable[-1] append from storage c-: now-declaration

# -- NEXT --
function c-:lexical-analysis/node/

# -- ERROR --

# -- END --
```
##### 4.5.3.3 if-else statement and while statement

if-else statements and while statements follow a fairly fixed format, so we can consolidate almost all nodes into one or two functions for continuous execution.
Since we need to determine the size of the code block before going back to the above to add jumps, here we first use the stack to record the locations where jumps need to be added (if has 1, if-else has 2, and while has 2).

The specific intermediate code structure can be referred to as follows:

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


function `c-:parse/node/local/while/`

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


function `c-:parse/node/local/if/`

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


function `c-:parse/node/local/if/else`

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
Some auxiliary functions are as follows: (To save debugging overhead, if-else code blocks share some auxiliary functions with while code blocks.)
function`c-:parse/node/local/while/expr`

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


function `c-:parse/node/local/while/_`(Actually, the local entry removes a variable declaration type.)

```mcfunction
execute if score @s c-token = #{ c-chr run return run function c-:parse/node/local/block-start
execute if score @s c-token = #if c-reserved run return run function c-:parse/node/local/if/
execute if score @s c-token = #while c-reserved run return run function c-:parse/node/local/while/
execute if score @s c-token = #return c-reserved if data storage c-: now-function.type run return run function c-:parse/node/local/return/
execute if score @s c-token = #return c-reserved unless data storage c-: now-function.type run return run function c-:parse/node/local/return/void
return run function c-:parse/node/local/expression
```


function `c-:parse/node/local/while/__`(Used to handle jump 1.)

```
$execute store result storage c-: now-function.code[$(1)].b int 1 run data get storage c-: now-function.code
```


function `c-:parse/node/local/if/_`(For handling jump 2.)

```mcfunction
$execute store result storage c-: now-function.code[$(2)].b int 1 run data get storage c-: now-function.code
```
##### 4.5.3.4 return statement

The return statement has different entries for different types of functions. A function without a return value can only have a return statement without a return value, and a function with a return value must return with a return value.
function`c-:parse/node/local/return/void`(Functions without return values ​​use this entry.)

```mcfunction
# -- RETURN (VOID) --
data modify storage c-: now-function.code append value {v:ret,s:0,s_:-100}
data modify storage c-: now-function.code[-1].f set from storage c-: now-function.name

# -- ; --
function c-:lexical-analysis/node/
execute unless score @s c-token = #; c-chr run return run function c-:terminate {msg:"TypeError: 'return' with a value, in function returning void"}
```


function `c-:parse/node/local/return/`(Functions with return values ​​use this entry.)

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


function `c-:parse/node/local/return/sep`

```mcfunction
function c-:lexical-analysis/node/
function c-:parse/node/local/return/
```

