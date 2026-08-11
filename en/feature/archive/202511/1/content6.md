---
next:
    text: 'Return to original text'
    link: '/feature/archive/202511/1/content'
---

# [Use data pack to make a compiler or interpreter: take the C language subset C-Minus as an example](/en/feature/archive/202511/1/content)

## 6. Run display

### 6.1 Code editing box

Use the following function to create the code editing dialog shown in the title picture.

![code edit box](../../../../../feature/archive/202511/1/2025-10-06_18.13.30.png)

::: warning note
Since the string passed from the dialog to the function must go through at least two levels of macros, and among the two levels of macros, only the macros inside the dialog will be escaped when the string is replaced (equivalent to one escape and one escape parsing offset), if the string is directly passed in as a function parameter, problems will arise due to an additional escape parsing.

Therefore, we use the method of passing in the compound tag to pass the string, so that there will be no second escape analysis.
:::

function`c-:display/`

```mcfunction
data modify storage c-: display._ set value {type:multi_action,title:"Enter C-Minus Code Here",can_close_with_escape:1b,inputs:[{type:text,label:Code,width:400,key:_,max_length:2147483647,multiline:{height:192}}],actions:[{label:Save,action:{type:"dynamic/run_command",template:"function c-:display/submit {_:{_:'$(_)'}}"}},{label:Run,action:{type:"run_command",command:"function c-:run/"}}]}
data modify storage c-: display._.inputs[0].initial set from storage c-: code._
function c-:display/_ with storage c-: display
```


function `c-:display/_`

```mcfunction
$dialog show @s $(_)
```


function `c-:display/submit`

```mcfunction
$data modify storage c-: code set value $(_)
function c-:parse/start
```
### 6.2 Intermediate code display

Use the following code to complete the intermediate code display as shown in the title picture, which can be used for some analysis.
Implementing this function can also help troubleshoot possible errors during the compilation process.

![Intermediate code display](../../../../../feature/archive/202511/1/2025-10-06_18.13.50.png)

function `c-:display/midcode/`

```mcfunction
data modify storage c-: variable-backup set from storage c-: variable
execute if data storage c-: variable-backup[0] run function c-:display/midcode/_
```


function `c-:display/midcode/_`

```mcfunction
execute if data storage c-: variable-backup[0].code run tellraw @s [{storage:'c-:',nbt:'variable-backup[0].type'},' function: ',{storage:'c-:',nbt:'variable-backup[0].name'}]
execute unless data storage c-: variable-backup[0].code unless data storage c-: variable-backup[0].initial run tellraw @s [{storage:'c-:',nbt:'variable-backup[0].type'},' variable: ',{storage:'c-:',nbt:'variable-backup[0].name'}]
execute unless data storage c-: variable-backup[0].code if data storage c-: variable-backup[0].initial run tellraw @s [{storage:'c-:',nbt:'variable-backup[0].type'},' variable: ',{storage:'c-:',nbt:'variable-backup[0].name'},' = ',{storage:'c-:',nbt:'variable-backup[0].initial'}]

execute if data storage c-: variable-backup[0].arg[0] run tellraw @s '  Parameters:'
execute if data storage c-: variable-backup[0].arg[0] run function c-:display/midcode/__

execute if data storage c-: variable-backup[0].code[0] run tellraw @s '  Code:'
execute if data storage c-: variable-backup[0].code[0] run function c-:display/midcode/___

data remove storage c-: variable-backup[0]
execute if data storage c-: variable-backup[0] run function c-:display/midcode/_
```


function `c-:display/midcode/__`

```mcfunction
tellraw @s ['    ',{storage:'c-:',nbt:'variable-backup[0].arg[0].type'},' parameter: ',{storage:'c-:',nbt:'variable-backup[0].arg[0].name'}]

data remove storage c-: variable-backup[0].arg[0]
execute if data storage c-: variable-backup[0].arg[0] run function c-:display/midcode/__
```


function `c-:display/midcode/___`

```mcfunction
function c-:display/midcode/____ with storage c-: variable-backup[0].code[0]

data remove storage c-: variable-backup[0].code[0]
execute if data storage c-: variable-backup[0].code[0] run function c-:display/midcode/___
```


function `c-:display/midcode/____`

```mcfunction
$function c-:display/midcode/_/$(v) with storage c-: variable-backup[0].code[0]
```


function `c-:display/midcode/_/add`(Other repeated similar operations are omitted here.)

```mcfunction
$tellraw @s ['    ',{text:add,color:aqua},' $(s)[$(s_)] , $(o)[$(o_)]']
```


function `c-:display/midcode/_/eq`(Other repeated similar operations are omitted here.)

```mcfunction
$tellraw @s ['    ',{text:eq,color:gold},'  $(s)[$(s_)] , ( $(o)[$(o_)] , $(o2)[$(o2_)] )']
```


function `c-:display/midcode/_/chain-add`(Other repeated similar operations are omitted here.)

```mcfunction
tellraw @s ['    ',{text:chain-add,color:"dark_green"}]
```


function `c-:display/midcode/_/call`

```mcfunction
$tellraw @s ['    ',{text:call,color:light_purple},' $(f)']
```


function `c-:display/midcode/_/if`(Actually, if you think about it, this whole section here can actually be omitted. If you can see this, do you still need me to provide these things?)

```mcfunction
$tellraw @s ['    ',{text:jmp-unless,color:green},' $(s)[$(s_)] , $(b)']
```

