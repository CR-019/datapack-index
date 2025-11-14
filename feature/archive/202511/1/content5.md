---
next:
    text: '返回原文'
    link: '/feature/archive/202511/1/content'
---

# [使用数据包制作编译器或解释器: 以C语言子集C-Minus为例](./content.md)

## 五、代码运行

现实架构中，由高级语言转化成的汇编代码或中间代码将进一步转化为机器语言进行执行。
而在此处，我们将使用宏把中间代码转化为mcfunction代码完成执行。

在这一阶段需要处理的主要问题有2个: 如何通过作用域确定变量所在的计分板; 如何实现跳转。

### 5.1 总体结构

我们将始终使用一个程序计数栈维护目前所在的函数和代码行数。计数栈中的每一个计数器存储pos和next-pos两个位置。
每次执行前使用上一次的next-pos覆盖pos作为执行的代码位置，并增加1位后覆盖next-pos。程序内的跳转指令可能覆写next-pos，而call指令则会向栈中新增一项。

函数 `c-:run/`

```mcfunction
scoreboard objectives add c-runtime dummy

scoreboard objectives remove c-data.-1
scoreboard objectives remove c-data.0

scoreboard objectives add c-data.-1 dummy
scoreboard objectives add c-data.0 dummy
scoreboard objectives add c-data.-100 dummy

execute store result score #tmp-chain c-runtime run data get storage c-: variable
scoreboard players set #i c-runtime 0
execute if score #i c-runtime < #tmp-chain c-runtime run function c-:run/initialize/

data modify storage c-:runtime program-counter set value [{f:main,next-pos:0,chain:-1}]
scoreboard players set #pos c-runtime -1
scoreboard players set #visit-chain c-runtime 0
function c-:run/_

tellraw @s ['Function main() returned ',{score:{name:'#main',objective:c-data.-1}}]
```

函数 `c-:run/_`

```mcfunction
execute store result score #pos c-runtime store result storage c-:runtime program-counter[-1].pos int 1 run data get storage c-:runtime program-counter[-1].next-pos
scoreboard players add #pos c-runtime 1
execute store result storage c-:runtime program-counter[-1].next-pos int 1 run scoreboard players get #pos c-runtime
function c-:run/_/ with storage c-:runtime program-counter[-1]
execute if data storage c-:runtime program-counter[-1].next-pos run function c-:run/_
```

### 5.2 全局变量初始化

函数 `c-:run/initialize/`

```mcfunction
execute store result storage c-:runtime _.i int 1 run scoreboard players get #i c-runtime
function c-:run/initialize/_ with storage c-:runtime _

scoreboard players add #i c-runtime 1
execute if score #i c-runtime < #tmp-chain c-runtime run function c-:run/initialize/
```

函数 `c-:run/initialize/_`

```mcfunction
$function c-:run/initialize/__ with storage c-: variable[$(i)]
```

函数 `c-:run/initialize/__`

```mcfunction
$scoreboard players set #$(name) c-data.-1 $(initial)
```

### 5.3 作用域-计分板转换

函数 `c-:run/_/`

```mcfunction
$data modify storage c-:runtime _ set from storage c-: variable[{name:'$(f)'}].code[$(pos)]
data modify storage c-:runtime _ merge value {_s:'',_o:'',_o2:''}
execute store result score #_ c-runtime run data get storage c-:runtime _.s_ -1
execute if score #_ c-runtime matches ..0 store result storage c-:runtime _.s_ int 1 run scoreboard players operation #_ c-runtime += #visit-chain c-runtime
data modify storage c-:runtime _{s_:-2}._s set value temp-
execute store result storage c-:runtime _{s_:-2}.s_ int 1 run scoreboard players get #visit-chain c-runtime
execute store result score #_ c-runtime run data get storage c-:runtime _.o_ -1
execute if score #_ c-runtime matches ..0 store result storage c-:runtime _.o_ int 1 run scoreboard players operation #_ c-runtime += #visit-chain c-runtime
data modify storage c-:runtime _{o_:-2}._o set value temp-
execute store result storage c-:runtime _{o_:-2}.o_ int 1 run scoreboard players get #visit-chain c-runtime
execute store result score #_ c-runtime run data get storage c-:runtime _.o2_ -1
execute if score #_ c-runtime matches ..0 store result storage c-:runtime _.o2_ int 1 run scoreboard players operation #_ c-runtime += #visit-chain c-runtime
data modify storage c-:runtime _{o2_:-2}._o2 set value temp-
execute store result storage c-:runtime _{o2_:-2}.o2_ int 1 run scoreboard players get #visit-chain c-runtime

function c-:run/_/_ with storage c-:runtime _
```

函数 `c-:run/_/_`

```mcfunction
$function c-:run/_/$(v) with storage c-:runtime _
```

### 5.4 运算指令

函数 `c-:run/_/add`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) += #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/sub`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) -= #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/mul`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) *= #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/div`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) /= #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/mod`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) %= #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/mov`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) = #$(_o)$(o) c-data.$(o_)
```

函数 `c-:run/_/eq`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) = #$(_o2)$(o2) c-data.$(o2_)
```

函数 `c-:run/_/ne`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) unless score #$(_o)$(o) c-data.$(o_) = #$(_o2)$(o2) c-data.$(o2_)
```

函数 `c-:run/_/le`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) <= #$(_o2)$(o2) c-data.$(o2_)
```

函数 `c-:run/_/ge`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) >= #$(_o2)$(o2) c-data.$(o2_)
```

函数 `c-:run/_/lt`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) < #$(_o2)$(o2) c-data.$(o2_)
```

函数 `c-:run/_/gt`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) > #$(_o2)$(o2) c-data.$(o2_)
```

### 5.5 跳转指令

函数 `c-:run/_/jmp`

```mcfunction
$data modify storage c-:runtime program-counter[-1].next-pos set value $(b)
```

函数 `c-:run/_/if`

```mcfunction
$execute if score #$(_s)$(s) c-data.$(s_) matches 0 run data modify storage c-:runtime program-counter[-1].next-pos set value $(b)
```

### 5.6 作用域增删指令

函数 `c-:run/_/chain-add`

```mcfunction
execute store result storage c-:runtime __._ int 1 run scoreboard players add #visit-chain c-runtime 1
function c-:run/_/chain-add_ with storage c-:runtime __
```

函数 `c-:run/_/chain-add_`

```mcfunction
$scoreboard objectives add c-data.$(_) dummy
```

函数 `c-:run/_/chain-remove`

```mcfunction
function c-:run/_/chain-remove_ with storage c-:runtime __
execute store result storage c-:runtime __._ int 1 run scoreboard players remove #visit-chain c-runtime 1
```

函数 `c-:run/_/chian-remove_`

```mcfunction
$scoreboard objectives remove c-data.$(_)
```

### 5.7 调用与返回指令

函数 `c-:run/_/call`

```mcfunction
$data modify storage c-:runtime program-counter append value {f:$(f),next-pos:0}
execute store result storage c-:runtime program-counter[-1].chain int 1 run scoreboard players get #visit-chain c-runtime
```

函数 `c-:run/_/ret`

```mcfunction
$scoreboard players operation #$(f) c-data.-1 = #$(_s)$(s) c-data.$(s_)
execute store result score #tmp-chain c-runtime run data get storage c-:runtime program-counter[-1].chain
execute if score #visit-chain c-runtime > #tmp-chain c-runtime run function c-:run/_/ret_
data remove storage c-:runtime program-counter[-1]
```

函数 `c-:run/_/ret_`

```mcfunction
execute store result storage c-:runtime _._ int 1 run scoreboard players get #visit-chain c-runtime
function c-:run/_/chain-remove_ with storage c-:runtime _
scoreboard players remove #visit-chain c-runtime 1
execute if score #visit-chain c-runtime > #tmp-chain c-runtime run function c-:run/_/ret_
```
