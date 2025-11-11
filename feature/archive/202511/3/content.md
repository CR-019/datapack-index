---
title: '队列在数据包中的使用'
---

<FeatureHead
    title = '队列在数据包中的使用'
    authorName = 洪旗
    avatarUrl = '../../_authors/洪旗.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/1808971083' }
    ]"
/>

## 问题背景

最近，笔者尝试用数据包制作一把具有以下功能的武器：

- 本体是一把弩，使用方法与弩相近
- 在主副手上时，会每隔一段时间从玩家的物品中自动装填一支箭
- 存在弹匣，弹匣内可存储 5 支箭（不包括已上膛的）

### 初始方案

- 使用计分板记录预装填的箭的数量
- 使用进度监听弩的使用
- 每次使用后，分数减 1，同时用物品修饰器填装一支普通的箭

### 存在的问题

1. **逻辑不合理**：使用计分板记录预装填数量意味着每次使用会消耗所有弩的箭矢
2. **功能受限**：无法获取预装填箭的信息，导致无法装填药箭等特殊箭矢

### 队列遍历方法

#### 队列概念的引入

数据结构中的**队列**算法概念：将数据以一定顺序储存再以相同的顺序处理（先进先出，First In First Out，FIFO）。

在数据包中，我们可以利用data命令处理nbt列表模拟出类似的遍历方法。如果忽略因数据形式导致的副手物品作为队头反而是最后一个入队，那么，这种方式和队列几乎一模一样。

#### 遍历方法

基本流程：

1. 将副手和玩家 `Inventory` 数据传入 `test` 列表

2. 检查 `test[0]`，如果不符合要求就用 `data remove` 去除

3. 在每次去除 `test[0]` 后，原本的 `test[1]` 将变成新的 `test[0]`，之后我们可以重复此过程

**流程说明：**

```mcfunction
function1:
    // 获取玩家物品栏数据
    data modify storage test inventory set from entity @s
    Inventory
    // 添加副手物品到列表开头
    data modify storage test inventory prepend from entity @s
    equipment.offhand
    // 进入处理循环
    function <function2>

function2:
    // 检查当前物品是否符合条件
    execute if <function test> return run <function end>
    // 不符合条件则移除当前物品
    data remove test[0]
    // 如果列表中还有物品，继续处理
    execute if data test[0] run <function2>
```

- `function test`：检测函数（简单情况下可直接使用data条件子命令）
- `function end`：后续处理函数

## 队列在数据包中的实际应用——以自动填装弩为例

### 核心思路

- 以队列形式将预装填箭矢数据写入弩的 `custom_data` 数据组件
- 每把弩独立记录箭矢信息
- 装填时，将队列的第一个元素处理后转入 `charged_projectiles` 数据组件

### 实现架构

#### 预装填部分

```mcfunction
// 预装填主函数
function main:
    // 获取已装填数据
    data modify storage test has_charged set from entity @s SelectedItem.components."minecraft.custom_data".charged
    // 执行物品检测函数
    function <function1>
    // 将检测到的物品添加到装填队列
    data modify storage test has_charged append from storage test inventory[0]
    // 执行物品修改
    function <function modify> with storage test

// 物品修改函数
function modify：
    // 使用物品修饰器更新弩的组件
    $item modify entity @s weapon.mainhand {
        function: "set_components",
        components: {
            custom_data: {
                charged: $(has_charged)  // 更新装填队列数据
            }
        }
    }
```

- `function1`：检测函数

#### 正式装填部分

```mcfunction
// 装填主函数
function main:
    // 获取弩的装填队列数据
    data modify storage test to_charge set from entity @s SelectedItem.components."minecraft:custom_data".charged
    // 初始化投射物数组
    data modify storage test project set value []
    // 从队列头部获取第一个项目
    data modify storage test project append from storage test to_charge[0]
    // 移除已处理的队列项目
    data remove storage test to_charge[0]
    // 执行装填操作
    function <function charge> with storage test

// 装填函数
function charge:
    // 更新弩的组件状态
    $item modify entity @s weapon.mainhand {
        function: "set_components",
        components: {
            custom_data: {
                charged: $(to_charge)  // 更新后的预装填队列
            },
            charged_projectiles: $(project)  // 设置已装填的投射物
        }
    }
```

::: warning 注意
此处仅为简单展示，未进行主副手的区分。
:::

## **队列相关的操作**

在队列数据结构中，通常定义了一系列操作队列的方法。在数据包中，我们同样可以用一些简单的函数来进行对队列的操作。

### **队列的初始化**

这一操作要求不存在队列，然后分配一个空队列。

*`queue:queue_init`*

```mcfunction
$execute if data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) set value []
```

::: tip 注释
第 1 行用于判断是否已经有对应队列，这对于队列的操作是必须的，此后不再赘述。

第 2 行用于生成一个空的列表作为队列的存储位置。
:::

### **检查队列是否为空队列**

*`queue:queue_empty`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$execute if data storage queue:data $(name)[0] run return 0
return 1
```

::: tip 注释
检查队列是否有第 1 项，如果有，就说明已经不是空队列。
:::

### **元素的入队**

分为两种情况，一是给定数据，二是给定路径。

如果为给定数据，则为：

*`queue:en_queue/value`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append value $(value)
```

::: tip 注释
这用于在队列的末尾插入指定的数据。
:::

若为给定路径，则应为：

*`queue:en_queue/from`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append from $(type) $(target) $(pace)
```

::: tip 注释
与上一条作用类似，只是插入的数据变成了指定的路径。
:::

### **元素的出队**

*`queue:de_queue`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data de_queue set from storage queue:data $(name)[0]
$data remove storage queue:data $(name)[0]
```

::: tip 注释
第 1 条在获取队列的第 1 项。

第 2 行将队列的第 1 项清除，达成出队的效果。
:::

### **获取队头**

*`queue:get_head`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data get_head set from storage queue:data $(name)[0]
```

::: tip 注释
简单地获取队列的第 1 项。
:::

### **获取队列长度**

*`queue:queue_length`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$return run data get storage queue:data $(name)
```

::: tip 注释
由于 `queue:data.$(name)` 是一个列表，用 `data get` 后返回值为队列的长度。

这里队列长度没有被存储，但可以用 `execute store result` 获取。
:::

### **清空队列**

*`queue:clear_queue`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) set value []
```

::: tip 注释
将 `queue:data.$(name)` 设为空列表，此时队列也变成了空队列。
:::

### **其他操作**

当然，我们可以尝试在另外的区域存储队列的长度上限，譬如，笔者制作的弩将上限设为了 5，当达到上限后尝试入队的操作会被阻止。

## **拓展——栈**

### **元素入栈**

我们知道，除了队列，栈也是一个常用的数据结构，他与队列的形式相近，只不过遵循后进先出（Last In First Out，LIFO）的处理准则，我们也能想到，将上述的**元素入队**：

*`queue:en_queue/value`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append value $(value)
```

*`queue:en_queue/from`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append from $(type) $(target) $(pace)
```

中的 `append` 改为 `prepend` 后，即**元素入栈**：

*`stack:push/value`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data $(name) prepend value $(value)
```

*`stack:push/from`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data $(name) prepend from $(type) $(target) $(pace)
```

所有对列表第一个元素的操作，都会变为对栈顶的操作，以此达成对栈的操作的效果。
除此以外，我们也可以考虑将对列表第一个元素的操作改为对最后一个元素的操作（不更改加入列表的顺序），例如：

### **获取栈顶元素**

*`stack:get_top`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data get_top set from storage stack:data $(name)[-1]
```

::: tip 注释
这里利用了一个列表选中第 -1 个元素时会识别为最后一个元素的设定，类似的 `$(name)[-2]` 就是这一列表的倒数第二个元素。
:::

以及：

### **元素出栈**

*`stack:pop`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data pop set from storage stack:data $(name)[-1]
$data remove storage stack:data $(name)[-1]
```

## **队列的遍历**

对于这个问题，我们显然可以利用宏来进行依次的读取，但如果不使用宏，我们也有其他的方式进行遍历和操作。

### **一：使用备用列表**

这一方法指的是将需要处理的队列复制到一辅助队列中，然后对辅助队列进行如元素出队等队列处理。
*`main`*

```mcfunction
$data modify set storage queue:data back set from storage queue:data $(name)
function <operation>
```

::: tip 注释
这里，`back` 就是一个备用列表，也就是辅助队列，我们将需要处理的列表复制到 `back` 准备后续处理。
:::

*`operation`*

```mcfunction
<对back[0]的处理>
data remove storage queue:data back[0]
execute if data storage queue:data back[0] run function operation
```

::: tip 注释
在处理后，将 `back[0]` 去除并重复，以此完成遍历。
:::

我们可以发现，这种方法完全没有影响原本的队列，但这也意味着我们如果希望直接影响原本的队列，使用这种方法在将处理后的数据返回原队列时会比较麻烦。

### **二：将处理后的数据再次入队**

这一方法是指的将队列的第一个数据取出，再处理后再次入队，这一操作重复队列长度次,这里以 `test` 作为队列名来举例。

*`main`*

```mcfunction
execute store result score #length queue_data run function queue:queue_length {name:test}
function operation {name:test}
```

::: tip 注释
这里我们先获取了队列test的长度，并存入计分板queue_data的#length中，作为等一下递归的终止条件
:::

*`operation`*

```mcfunction
scoreboard players remove #length queue:queue_data 1
function queue:de_queue {name:$(name)}
<对de_queue的操作>
function queue:en_queue/from {name:$(name),type:"storage",target:"queue:data",pace:"de_queue"}
execute if score #length queue_data matches 1.. run function operation {name:$(name)}
```

::: tip 注释
我们先将数据出队，处理后再将数据入队，此时处理后的数据在test[-1]的位置，这一过程将重复队列长度次，终止时，第一个被处理的数据将恰好回到`test[0]` 完成对队列数据的遍历修改。
:::

这一方法能方便地对队列进行修改，但是由于会对队列的所有数据都进行处理，在编写函数时要尤其注意，避免产生计划外的影响。

## **队列和栈的综合使用**

在前面的内容中，我们已经了解了队列的作用，所以为了更好地综合使用这两者，我们需要明确栈的特点。

由于栈具有后进先出（LIFO）的数据处理方式，实际上很适合用于记录需要的操作，因为我们很容易以出栈的方式撤销最后的操作。

### 一个栈的实例

假想一个场景，我们需要对一个无人机进行操作，操作方式为根据地形将需要进行的移动预输入，并要求可以撤销。

此时，我们已经通过栈实现了输入、存储等功能，我们需要做的是加入撤销和取消撤销这两个功能，在这里，我们以 `drone` 作为栈的名称来举例。

*`drone:delete`*

```mcfunction
function stack:pop {name:"drone"}
```

::: tip 注释
`pop` 是出栈的函数名，作用是将栈顶的元素从栈中存储到栈外，在这里，我们将其存于命令存储 `stack:data` 的 `pop` 数据中。
:::

*`drone:de_delete`*

```mcfunction
function stack:push/from {name:"drone",type:"storage",target:"stack:data",pace:"pop"}
```

::: tip 注释
我们将 `pop` 再次入栈，就完成了单次的撤销。
:::

但是，如果我们需要在进行多次撤销操作后将这些撤销取消，显然就不够了，因此我们需要进行一些改进。

---

### 利用栈支持复杂的撤销操作

*`drone:delete`*

```mcfunction
function stack:pop {name:"drone"}
function stack:push/from {name:"delete",type:"storage",target:"stack:data",pace:"pop"}
```

::: tip 注释
我们将 `pop` 数据存入另一个栈 `delete` 中，这个 `delete` 就是我们用来记录所有连续的撤销操作的栈。
:::

*`drone:de_delete`*

```mcfunction
function stack:pop {name:"delete"}
function stack:push/from {name:"drone",type:"storage",target:"stack:data",pace:"pop"}
```

::: tip 注释
我们先对 `delete` 执行出栈操作，然后将出栈的元素入栈 `drone`，我们就完成了一次撤销。由于 `delete` 会记录连续的撤销操作，我们可以继续进行取消撤销的操作，直到 `delete` 变为空栈。
:::

这样我们就利用栈完成了对撤销这一操作的处理。

---

总的来说，由于队列具有先进先出（FIFO）的特点，适合用来处理有一定顺序的数据。

而栈则是有后进先出（LIFO）的特点，很适合用于记录操作，方便撤销。

在数据包中综合使用这两种数据结构，对我们处理数据将有很大的帮助。

## 总结

通过使用数据结构的思维，引入队列、栈等常见的数据结构能够让我们更便利、更系统、清晰地对数据进行处理。

除了基础的数据处理外，队列的有序性也可以用于事件的排序，当我们需要依次触发一些事件时，我们可以选择用队列记录事件的触发顺序，依次出队并发生事件。

当然，在这里使用宏作为格式是让读者更清楚地了解函数的结构和需要的内容，实际可以将这些函数嵌入自己的数据包内。
