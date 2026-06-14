---
title: 'mcfunction 语言规范（简版）'
---

<FeatureHead
    title='mcfunction 语言规范（简版）'
    authorName='伊桑桑桑桑桑'
/>

:::warning 编者注
这是一套命名约定，用于让数据包结构更容易阅读。它不是语法规则，也不会被游戏检查。  
读者并非被要求必须遵守下列约定，但简洁规范的命名方式显然会使得数据包更整洁易读，也能显著地提高开发效率和可维护性。因此推荐读者认真阅读。
:::

## 基本原则

1. 优先使用简短名称。
2. 名称不能产生歧义。
3. 没有实际冲突时，不增加多余层级。

## 字段

字段是一组命名和数据形式的约定，也可以理解为类。

任何符合约定的数据、实体或方块，都可以视为该字段的对象。

例如，`projectile` 字段可以出现在：

```text
score(@s projectile)
storage(<namespace>:io projectile)
storage(<namespace>:data projectile)
tag(<namespace>.projectile)
function <namespace>:projectile/create
```

实体 tag 必须手动添加命名空间前缀：

```text
tag(<namespace>.projectile)
```

### 属性和继承

属性表示字段的一部分数据：

```text
projectile.speed
projectile.life
```

继承表示字段的一种完整类型：

```text
projectile.fire
projectile.ice
```

当长期数据发生路径冲突时，增加一层属性，如 `default`、`dummy` 或 `value` 等，来消除冲突。
如 `character.knight.max_health` 和 `character.max_health` 冲突。`character.max_health` 应该写成`character.default.max_health`。

## 函数结构

```text
类/方法/中间过程
```

例如：

```text
projectile/create
projectile/create/validate
projectile/create/write_data
projectile/delete
...
```

- 方法允许字段外调用。
- 中间过程如`projectile/create/write_data`，只属于`create`，其他函数不能调用。
- 多个方法需要共享同一个中间过程时，将它提升为私有方法。

```text
projectile/__validate
projectile/create
projectile/create/write_data
projectile/delete
```

结构可更改为这样。私有方法`__validate`允许 `projectile` 内的所有方法（仅`create`和`delete`，不包括`create/write_data`）调用，但不对字段外开放。

## 特殊标记

特殊标记不是名称的一部分。判断名称冲突时，应忽略标记。

```text
__tick__       自动方法：由游戏特性或游戏内入口调用
__validate     私有方法：仅供当前字段内部调用
__id__         长期变量：需要跨 tick 保存，不应随意修改
```

`__xx__`，`__xx` 和 `xx` 被视为同一名称，可以同时创建，但功能必须完全相同，如：
```
# __a__
function a

# __a
function a

# a
say 1
```

## 方法输入

方法输入默认只读。需要修改输入时，必须在头文档中说明。

```mcfunction
#> projectile/create
#   创建投射物
# @input
#   storage <namespace>:io projectile
# @output
#   新创建的投射物
```
或更短：
```mcfunction
#> projectile/create
#   创建投射物，输入为io projectile
```

## 临时变量

常见临时变量：

```text
score(#temp <namespace>)
storage(<namespace>:io temp.projectile)
tag(<namespace>.this)
tag(<namespace>.init)
```

调用普通方法后，已有临时变量应视为内容未知，不得继续读取。

私有方法和调用者共享变量，不影响临时变量的调用。

## 速查

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