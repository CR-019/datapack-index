---
next:
    text: '返回原文'
    link: '/feature/archive/202511/1/content'
---

# [使用数据包制作编译器或解释器: 以C语言子集C-Minus为例](./content.md)

## 六、运行展示

### 6.1 代码编辑框

使用以下函数创建如题图所示的代码编辑对话框。

![代码编辑框](2025-10-06_18.13.30.png)

::: warning 注意
由于从对话框传入函数的字符串必然经过至少两层宏，而这两层宏中只有对话框内部的宏在字符串替换时会进行转义（相当于一次转义与一次转义解析抵消），如果直接以函数参数传入字符串则会由于额外的一次转义解析而出现问题。

因此我们采用传入复合标签的方式传字符串，这样就不会有第二次转义解析。
:::

函数 `c-:display/`

```mcfunction
data modify storage c-: display._ set value {type:multi_action,title:"Enter C-Minus Code Here",can_close_with_escape:1b,inputs:[{type:text,label:Code,width:400,key:_,max_length:2147483647,multiline:{height:192}}],actions:[{label:Save,action:{type:"dynamic/run_command",template:"function c-:display/submit {_:{_:'$(_)'}}"}},{label:Run,action:{type:"run_command",command:"function c-:run/"}}]}
data modify storage c-: display._.inputs[0].initial set from storage c-: code._
function c-:display/_ with storage c-: display
```

函数 `c-:display/_`

```mcfunction
$dialog show @s $(_)
```

函数 `c-:display/submit`

```mcfunction
$data modify storage c-: code set value $(_)
function c-:parse/start
```

### 6.2 中间代码展示

使用以下代码完成如题图所示的中间代码展示，可用于一些分析。
实现该功能也有助于排查编译过程可能出现的错误情况。

![中间代码展示](2025-10-06_18.13.50.png)

函数 `c-:display/midcode/`

```mcfunction
data modify storage c-: variable-backup set from storage c-: variable
execute if data storage c-: variable-backup[0] run function c-:display/midcode/_
```

函数 `c-:display/midcode/_`

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

函数 `c-:display/midcode/__`

```mcfunction
tellraw @s ['    ',{storage:'c-:',nbt:'variable-backup[0].arg[0].type'},' parameter: ',{storage:'c-:',nbt:'variable-backup[0].arg[0].name'}]

data remove storage c-: variable-backup[0].arg[0]
execute if data storage c-: variable-backup[0].arg[0] run function c-:display/midcode/__
```

函数 `c-:display/midcode/___`

```mcfunction
function c-:display/midcode/____ with storage c-: variable-backup[0].code[0]

data remove storage c-: variable-backup[0].code[0]
execute if data storage c-: variable-backup[0].code[0] run function c-:display/midcode/___
```

函数 `c-:display/midcode/____`

```mcfunction
$function c-:display/midcode/_/$(v) with storage c-: variable-backup[0].code[0]
```

函数 `c-:display/midcode/_/add` （此处省略其他重复的同类运算。）

```mcfunction
$tellraw @s ['    ',{text:add,color:aqua},' $(s)[$(s_)] , $(o)[$(o_)]']
```

函数 `c-:display/midcode/_/eq` （此处省略其他重复的同类运算。）

```mcfunction
$tellraw @s ['    ',{text:eq,color:gold},'  $(s)[$(s_)] , ( $(o)[$(o_)] , $(o2)[$(o2_)] )']
```

函数 `c-:display/midcode/_/chain-add` （此处省略其他重复的同类运算。）

```mcfunction
tellraw @s ['    ',{text:chain-add,color:"dark_green"}]
```

函数 `c-:display/midcode/_/call`

```mcfunction
$tellraw @s ['    ',{text:call,color:light_purple},' $(f)']
```

函数 `c-:display/midcode/_/if` （其实想想看这边一整块其实都可以省略了。能看到这里的还需要我把这些东西再提供过来? ）

```mcfunction
$tellraw @s ['    ',{text:jmp-unless,color:green},' $(s)[$(s_)] , $(b)']
```
