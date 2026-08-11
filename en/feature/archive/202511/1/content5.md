---
next:
    text: 'Return to original text'
    link: '/feature/archive/202511/1/content'
---

# [Use data pack to make a compiler or interpreter: take the C language subset C-Minus as an example](/en/feature/archive/202511/1/content)

## 5. Code execution

In real architecture, the assembly code or intermediate code converted from high-level language will be further converted into machine language for execution.
Here, we will use macros to convert the intermediate code into mcfunction code to complete execution.

There are two main issues that need to be dealt with at this stage: how to determine the scoreboard where the variable is located through the scope; how to implement the jump.

### 5.1 Overall structure

We will always use a program counter stack to maintain the current function and line of code. Each counter in the counting stack stores two positions: pos and next-pos.
Before each execution, use the last next-pos to overwrite pos as the executed code position, and add 1 bit to overwrite next-pos. The jump instruction in the program may overwrite next-pos, while the call instruction will add an item to the stack.

function`c-:run/`

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


function `c-:run/_`

```mcfunction
execute store result score #pos c-runtime store result storage c-:runtime program-counter[-1].pos int 1 run data get storage c-:runtime program-counter[-1].next-pos
scoreboard players add #pos c-runtime 1
execute store result storage c-:runtime program-counter[-1].next-pos int 1 run scoreboard players get #pos c-runtime
function c-:run/_/ with storage c-:runtime program-counter[-1]
execute if data storage c-:runtime program-counter[-1].next-pos run function c-:run/_
```
### 5.2 Global variable initialization

function`c-:run/initialize/`

```mcfunction
execute store result storage c-:runtime _.i int 1 run scoreboard players get #i c-runtime
function c-:run/initialize/_ with storage c-:runtime _

scoreboard players add #i c-runtime 1
execute if score #i c-runtime < #tmp-chain c-runtime run function c-:run/initialize/
```


function `c-:run/initialize/_`

```mcfunction
$function c-:run/initialize/__ with storage c-: variable[$(i)]
```


function `c-:run/initialize/__`

```mcfunction
$scoreboard players set #$(name) c-data.-1 $(initial)
```
### 5.3 Scope-scoreboard conversion

function`c-:run/_/`

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


function `c-:run/_/_`

```mcfunction
$function c-:run/_/$(v) with storage c-:runtime _
```
### 5.4 Operation instructions

function`c-:run/_/add`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) += #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/sub`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) -= #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/mul`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) *= #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/div`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) /= #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/mod`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) %= #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/mov`

```mcfunction
$scoreboard players operation #$(_s)$(s) c-data.$(s_) = #$(_o)$(o) c-data.$(o_)
```


function `c-:run/_/eq`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) = #$(_o2)$(o2) c-data.$(o2_)
```


function `c-:run/_/ne`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) unless score #$(_o)$(o) c-data.$(o_) = #$(_o2)$(o2) c-data.$(o2_)
```


function `c-:run/_/le`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) <= #$(_o2)$(o2) c-data.$(o2_)
```


function `c-:run/_/ge`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) >= #$(_o2)$(o2) c-data.$(o2_)
```


function `c-:run/_/lt`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) < #$(_o2)$(o2) c-data.$(o2_)
```


function `c-:run/_/gt`

```mcfunction
$execute store result score #$(_s)$(s) c-data.$(s_) if score #$(_o)$(o) c-data.$(o_) > #$(_o2)$(o2) c-data.$(o2_)
```
### 5.5 Jump instructions

function`c-:run/_/jmp`

```mcfunction
$data modify storage c-:runtime program-counter[-1].next-pos set value $(b)
```


function `c-:run/_/if`

```mcfunction
$execute if score #$(_s)$(s) c-data.$(s_) matches 0 run data modify storage c-:runtime program-counter[-1].next-pos set value $(b)
```
### 5.6 Scope addition and deletion instructions

function`c-:run/_/chain-add`

```mcfunction
execute store result storage c-:runtime __._ int 1 run scoreboard players add #visit-chain c-runtime 1
function c-:run/_/chain-add_ with storage c-:runtime __
```


function `c-:run/_/chain-add_`

```mcfunction
$scoreboard objectives add c-data.$(_) dummy
```


function `c-:run/_/chain-remove`

```mcfunction
function c-:run/_/chain-remove_ with storage c-:runtime __
execute store result storage c-:runtime __._ int 1 run scoreboard players remove #visit-chain c-runtime 1
```


function `c-:run/_/chian-remove_`

```mcfunction
$scoreboard objectives remove c-data.$(_)
```
### 5.7 Call and return instructions

function`c-:run/_/call`

```mcfunction
$data modify storage c-:runtime program-counter append value {f:$(f),next-pos:0}
execute store result storage c-:runtime program-counter[-1].chain int 1 run scoreboard players get #visit-chain c-runtime
```


function `c-:run/_/ret`

```mcfunction
$scoreboard players operation #$(f) c-data.-1 = #$(_s)$(s) c-data.$(s_)
execute store result score #tmp-chain c-runtime run data get storage c-:runtime program-counter[-1].chain
execute if score #visit-chain c-runtime > #tmp-chain c-runtime run function c-:run/_/ret_
data remove storage c-:runtime program-counter[-1]
```


function `c-:run/_/ret_`

```mcfunction
execute store result storage c-:runtime _._ int 1 run scoreboard players get #visit-chain c-runtime
function c-:run/_/chain-remove_ with storage c-:runtime _
scoreboard players remove #visit-chain c-runtime 1
execute if score #visit-chain c-runtime > #tmp-chain c-runtime run function c-:run/_/ret_
```

