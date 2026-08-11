---
title: 'mcfunction language specification (short version)'
---

<FeatureHead
    title="mcfunction Language Specification (Simplified Version)"
    authorName="Esan Sang Sang Sang"
/>


:::warning Editor's Note
This is a set of naming conventions used to make the data pack structure easier to read. It is not a grammar rule and is not checked by the game.  
Readers are not required to abide by the following conventions, but concise and standardized naming will obviously make the data pack cleaner and easier to read, and can also significantly improve development efficiency and maintainability. Therefore, readers are recommended to read it carefully.
:::

## Basic principles

1. Prefer short names.
2. The name cannot be ambiguous.
3. When there is no actual conflict, no redundant levels will be added.

## Field

Fields are a set of naming and data format conventions, which can also be understood as classes.

Any data, entity or block that conforms to the contract can be regarded as the object of this field.

For example,`projectile`Fields can appear in:

```text
score(@s projectile)
storage(<namespace>:io projectile)
storage(<namespace>:data projectile)
tag(<namespace>.projectile)
function <namespace>:projectile/create
```
The entity tag must be manually added with the namespace prefix:

```text
tag(<namespace>.projectile)
```
### Properties and inheritance

Attributes represent part of the data of a field:

```
text
projectile.speed
projectile.life
```
Inheritance represents a complete type of field:

```text
projectile.fire
projectile.ice
```
When path conflicts occur in long-term data, add a layer of attributes, such as`default`、`dummy`or`value`Wait, to eliminate the conflict.
like`character.knight.max_health`and`character.max_health`conflict.`character.max_health`should be written as`character.default.max_health`.

## function structure

```text
类/方法/中间过程
```
For example:

```text
projectile/create
projectile/create/validate
projectile/create/write_data
projectile/delete
...
```
- Methods are allowed to be called outside the field.
- Intermediate processes such as`projectile/create/write_data`, only belongs to`create`, other functions cannot be called.
- When multiple methods need to share the same intermediate process, promote it to a private method.

```
text
projectile/__validate
projectile/create
projectile/create/write_data
projectile/delete
```
The structure can be changed to this. private method`__validate`allow`projectile`All methods within (only`create`and`delete`, excluding`create/write_data`) call, but not open outside the field.

## Special tags

Special markers are not part of the name. Tags should be ignored when determining name conflicts.

```
text
__tick__       自动方法：由游戏特性或游戏内入口调用
__validate     私有方法：仅供当前字段内部调用
__id__         长期变量：需要跨 tick 保存，不应随意修改
```


`__xx__`，`__xx`and`xx`Considered to have the same name, they can be created at the same time, but the functions must be exactly the same, such as:

```

# __a__
function a

# __a
function a

# a
say 1
```
## Method input

Method inputs are read-only by default. When the input needs to be modified, it must be stated in the header document.

```
mcfunction
#> projectile/create
#Create projectiles
# @input
#   storage <namespace>:io projectile
# @output
#Newly created projectile
```
or shorter:

```mcfunction
#> projectile/create
#Create a projectile, input is io projectile
```
## Temporary variables

Common temporary variables:

```text
score(#temp <namespace>)
storage(<namespace>:io temp.projectile)
tag(<namespace>.this)
tag(<namespace>.init)
```
After calling a normal method, existing temporary variables should be regarded as having unknown contents and should not be read further.

Private methods share variables with the caller and do not affect the call of temporary variables.

## Quick Check

```text
字段的一部分数据                 属性
字段的一种完整类型               继承
允许字段外调用                   方法
只属于一个方法                   中间过程
允许同一字段内多个方法调用       私有方法
由游戏特性或游戏内入口调用       自动方法
跨 tick 保存且不应随意修改       长期变量
当前逻辑中短暂使用               临时变量
```