---
title: 'The use of queues in data pack'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
title = 'The use of queues in data pack'
authorName = Hong Qi
/>

## Problem background

Recently, the author tried to use data pack to make a weapon with the following functions:

- The body is a crossbow, and its use is similar to that of a crossbow.
- When in the main and deputy hands, an arrow will be automatically loaded from the player's item every once in a while.
- There is a magazine that can store 5 arrows (excluding loaded ones)

### Initial plan

- Use a scoreboard to record the number of preloaded arrows
- Use advancement to monitor crossbow usage
- After each use, the score is reduced by 1 and a normal arrow is filled with the item modifier.

### Problems

1. **Unreasonable logic**: Using a scoreboard to record the number of preloads means that each use consumes all the arrows of the crossbow.
2. **Limited functions**: Unable to obtain preloaded arrow information, resulting in the inability to load special arrows such as medicine arrows

### Queue traversal method

#### Introduction of queue concept

The concept of **queue** algorithm in data structure: store data in a certain order and then process it in the same order (First In First Out, FIFO).

In data pack, we can use datacommand to process the nbt list to simulate a similar traversal method. If the deputy item due to the data format is ignored as the head of the queue but is the last one to join the queue, then this method is almost exactly the same as the queue.

#### Traversal method

Basic process:

1. Place the deputy and player`Inventory`data incoming`test`list

2. examine`test[0]`, if it does not meet the requirements, use`data remove`Remove

3. Removed every time`test[0]`Later, the original`test[1]`will become new`test[0]`, we can then repeat this process

**Process Description:**

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


- `function test`: Detect function (in simple cases, the data condition subcommand can be used directly)
- `function end`：Subsequent processing function

## The practical application of queues in data pack - taking automatic loading of crossbows as an example

### Core idea

- Writes preloaded arrow data to the crossbow in a queue format`custom_data`data component
- Each crossbow independently records arrow information
- When loading, process the first element of the queue and transfer it to`charged_projectiles`data component

### Implementation architecture

#### pre-filled section

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


- `function1`: Detection function

#### Formal loading part

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


::: warning Notice
This is only a simple display without distinction between primary and secondary hands.
:::

## **Queue related operations**

In the queue data structure, a series of methods for operating the queue are usually defined. In data pack, we can also use some simple functions to operate on the queue.

### **Queue Initialization**

This operation requires that no queue exists and then allocates an empty queue.

*`queue:queue_init`*

```mcfunction
$execute if data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) set value []
```


::: tip Comment
Line 1 is used to determine whether there is already a corresponding queue. This is necessary for queue operations and will not be described again.

Line 2 is used to generate an empty list as the storage location for the queue.
:::

### **Check if the queue is an empty queue**

*`queue:queue_empty`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$execute if data storage queue:data $(name)[0] run return 0
return 1
```


::: tip Comment
Check whether the queue has item 1. If there is, it means that the queue is no longer empty.
:::

### **Element enqueue**

It is divided into two situations, one is given data, and the other is given path.

If given data, then:

*`queue:en_queue/value`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append value $(value)
```


::: tip Comment
This is used to insert the specified data at the end of the queue.
:::

If it is a given path, it should be:

*`queue:en_queue/from`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) append from $(type) $(target) $(pace)
```


::: tip Comment
The function is similar to the previous one, except that the inserted data becomes the specified path.
:::

### **Dequeue of elements**

*`queue:de_queue`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data de_queue set from storage queue:data $(name)[0]
$data remove storage queue:data $(name)[0]
```


::: tip Comment
Item 1 is the 1st item in the get queue.

Line 2 clears the first item in the queue to achieve the effect of dequeuing.
:::

### **Get the team leader**

*`queue:get_head`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data get_head set from storage queue:data $(name)[0]
```


::: tip Comment
Simply get item 1 of the queue.
:::

### **Get queue length**

*`queue:queue_length`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$return run data get storage queue:data $(name)
```


::: tip Comment
because`queue:data.$(name)`is a list, use`data get`The return value is the length of the queue.

Here the queue length is not stored, but can be used`execute store result`Get.
:::

### **Clear queue**

*`queue:clear_queue`*

```mcfunction
$execute unless data storage queue:data $(name) run return 0
$data modify storage queue:data $(name) set value []
```


::: tip Comment
Will`queue:data.$(name)`Set to an empty list, and the queue becomes an empty queue at this time.
:::

### **Other operations**

Of course, we can try to store the upper limit of the queue length in another area. For example, the crossbow made by the author sets the upper limit to 5. When the upper limit is reached, attempts to join the queue will be blocked.

## **Expand - Stack**

### **Element pushed onto stack**

We know that in addition to queues, stacks are also a commonly used data structure. They are similar in form to queues, but follow the Last In First Out (LIFO) processing principle. We can also think of adding the above elements into the queue:

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


in`append`Change to`prepend`After that, the element is pushed onto the stack:

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


All operations on the first element of the list will become operations on the top of the stack, thereby achieving the effect of operations on the stack.
In addition, we can also consider changing the operation on the first element of the list to the operation on the last element (without changing the order of adding to the list), for example:

### **Get the top element of the stack**

*`stack:get_top`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data get_top set from storage stack:data $(name)[-1]
```


::: tip Comment
Here we use a setting that when the -1th element is selected in a list, it will be recognized as the last element, similar to`$(name)[-2]`It is the penultimate element of this list.
:::

as well as:

### **Element pops**

*`stack:pop`*

```mcfunction
$execute unless data storage stack:data $(name) run return 0
$data modify storage stack:data pop set from storage stack:data $(name)[-1]
$data remove storage stack:data $(name)[-1]
```


## **Queue traversal**

For this problem, we can obviously use macros to read sequentially, but if we don't use macros, we also have other ways to traverse and operate.

### **One: Use backup list**

This method refers to copying the queue that needs to be processed to an auxiliary queue, and then performing queue processing on the auxiliary queue, such as dequeuing elements.
*`main`*

```mcfunction
$data modify set storage queue:data back set from storage queue:data $(name)
function <operation>
```


::: tip Comment
here,`back`It is a standby list, that is, the auxiliary queue. We copy the list that needs to be processed to`back`Prepare for subsequent processing.
:::

*`operation`*

```mcfunction
<对back[0]的处理>
data remove storage queue:data back[0]
execute if data storage queue:data back[0] run function operation
```


::: tip Comment
After processing, the`back[0]`Remove and repeat to complete the traversal.
:::

We can find that this method does not affect the original queue at all, but it also means that if we want to directly affect the original queue, it will be more troublesome to use this method to return the processed data to the original queue.

### **Two: Enter the processed data into the queue again**

This method refers to taking out the first data from the queue, processing it and then adding it to the queue again. This operation is repeated for the length of the queue. Here, we use`test`As an example of a queue name.

*`main`*

```mcfunction
execute store result score #length queue_data run function queue:queue_length {name:test}
function operation {name:test}
```


::: tip Comment
Here we first obtain the length of the queue test and store it in the #length of the scoreboard queue_data as the termination condition for the recursion.
:::

*`operation`*

```mcfunction
scoreboard players remove #length queue:queue_data 1
function queue:de_queue {name:$(name)}
<对de_queue的操作>
function queue:en_queue/from {name:$(name),type:"storage",target:"queue:data",pace:"de_queue"}
execute if score #length queue_data matches 1.. run function operation {name:$(name)}
```


::: tip Comment
We first dequeue the data, and then put the data into the queue after processing. At this time, the processed data is at the position of test[-1]. This process will be repeated for the queue length times. When it terminates, the first processed data will return exactly to the position of test[-1].`test[0]`Complete traversal and modification of queue data.
:::

This method can easily modify the queue, but since all data in the queue will be processed, special attention should be paid when writing functions to avoid unplanned effects.

## **Integrated use of queues and stacks**

In the previous content, we have already understood the role of queues, so in order to better use the two comprehensively, we need to clarify the characteristics of the stack.

Since the stack has a last-in-first-out (LIFO) data processing method, it is actually very suitable for recording required operations, because we can easily undo the last operation by popping the stack.

### An instance of a stack

Imagine a scenario where we need to operate a drone. The operation method is to pre-input the required movements according to the terrain, and the requirements can be revoked.

At this point, we have implemented input, storage and other functions through the stack. What we need to do is to add the two functions of undo and undo. Here, we use`drone`Take as an example the name of a stack.

*`drone:delete`*

```mcfunction
function stack:pop {name:"drone"}
```


::: tip Comment
`pop`is the function name of popping the stack. Its function is to store the element on the top of the stack from the stack to the outside of the stack. Here, we store it in the command storage.`stack:data`of`pop`in the data.
:::

*`drone:de_delete`*

```mcfunction
function stack:push/from {name:"drone",type:"storage",target:"stack:data",pace:"pop"}
```


::: tip Comment
we will`pop`Pushing it onto the stack again completes the single undo.
:::

However, if we need to cancel these undo operations after multiple undo operations, it is obviously not enough, so we need to make some improvements.

---

### Use the stack to support complex undo operations

*`drone:delete`*

```mcfunction
function stack:pop {name:"drone"}
function stack:push/from {name:"delete",type:"storage",target:"stack:data",pace:"pop"}
```


::: tip Comment
we will`pop`Data is stored in another stack`delete`middle, this`delete`This is the stack we use to record all consecutive undo operations.
:::

*`drone:de_delete`*

```mcfunction
function stack:pop {name:"delete"}
function stack:push/from {name:"drone",type:"storage",target:"stack:data",pace:"pop"}
```


::: tip Comment
Let's deal with it first`delete`Perform a pop operation and then push the popped element onto the stack`drone`, we have completed an undo. because`delete`Continuous undo operations will be recorded, and we can continue to cancel the undo operations until`delete`becomes an empty stack.
:::

In this way, we use the stack to complete the processing of the undo operation.

---

In general, because the queue has the characteristics of first in, first out (FIFO), it is suitable for processing data in a certain order.

The stack has the characteristics of last-in-first-out (LIFO), which is very suitable for recording operations and facilitating undoing.

The combined use of these two data structures in data pack will be of great help to us in processing data.

## Summarize

By using data structure thinking and introducing common data structures such as queues and stacks, we can process data more conveniently, systematically, and clearly.

In addition to basic data processing, the orderliness of queues can also be used to sort events. When we need to trigger some events in sequence, we can choose to use the queue to record the triggering order of events, dequeue them in sequence, and cause events to occur.

Of course, using macros as a format here allows readers to more clearly understand the structure and required content of the function. In fact, these functions can be embedded in their own data pack.

