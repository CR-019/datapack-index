---
title: '论 Minecraft 环境下 Brainduck 解释器的实现与性能优化'
---

<FeatureHead
    title='论 Minecraft 环境下 Brainduck 解释器的实现与性能优化'
    authorName='斑海awa'
    cover = '../_assets/6.png'
/>

:::warning 编者注
本文的部分名词因审查因素进行和谐。
:::

## 摘要

本文旨在探讨如何在 Minecraft 数据包（Datapack）环境中构建一个完整的 Brainduck 解释器。通过引入“跳转表（Jump Table）”预处理机制、异步执行队列以及 8-bit 模拟内存管理，成功在 mcfunction 中实现了图灵完备语言的运行，解决了递归过深以及命令执行上限等原版开发痛点，同时研究了更多的编译优化策略。

---

## 一、 引言

Brainduck 是一门极简的编程语言，仅由 $8$ 种字符组成。尽管其语法简单，但其对内存操作和跳转逻辑的要求，使其成为一个探索数据包编写编程语言解释器可行性的绝佳案例。本文将讲述从词法分析到指令执行的全过程。

由于本文作者并非计算机专业学生，文中所述难免有疏漏，思路仅供参考，相信各位读者奆佬定能通过数据包用更优的算法实现一个完整的 C 语言编译器。

### Brainduck 介绍

这种语言基于一个简单的机器模型。这个机器除了指令以外，还包括：一个以字节（ `byte` ）为单位、已初始化为零的数组、一个指向该数组的指针（开始时指向数组的第 $0$ 个字节）、以及用于输入输出的两个字节流。

### 命令

| 字符 | 含义 |
| ----------- | ----------- |
| `>` | 指针加一 |
| `<` | 指针减一 |
| `+` | 指针所指字节的值加一 |
| `-` | 指针所指字节的值减一 |
| `.` | 输出指针所指字节内容（ASCII码） |
| `,` | 向指针所指的字节输入内容（ASCII码） |
| `[` | 若指针所指字节的值为零，则向后跳转，跳转到其对应的 `]` 的下一个指令处 |
| `]` | 若指针所指字节的值不为零，则向前跳转，跳转到其对应的 `[` 的下一个指令处 |

## 二、 数据结构设计 (Storage & Scoreboard)

在案例中，数据存储在 **Storage**（持久化、结构化）和 **Scoreboard**（运算）中。

### 2.1 存储层 (Storage)

我们使用 `Brainduck:re` 命名空间作为运行时环境：

<div class="nbttree">

<node type="compound" name="Brainduck:re"/>根标签。
- <node type="compound" name="code"/>存放运行时的代码。
  - <node type="string" name="string"/>预处理前的字符串代码。
  - <node type="list" name="list"/>预处理后的指令序列。
- <node type="int_list" name="array"/>模拟纸带。
- <node type="int_list" name="jump_table"/>存储对应括号跳转位置的索引。
- <node type="int_list" name="stack"/> 用于预处理阶段括号匹配的辅助栈。
- <node type="compound" name="output"/>输出
  - <node type="list" name="list"/> 储存输出。

</div>

### 2.2 运算层 (Scoreboard)

利用计分板进行指针与临时值的计算：

* `#ip`: 程序计数器（Instruction Pointer）。
* `#ptr`: 纸带指针（Data Pointer）。
* `#tmp_value`: 运算中间变量。

---

## 三、 积分板与命令存储转换

由于在 Minecraft 中，只有积分板能够进行最直观的运算操作，同时Brainduck亦有进行运算的需求，遂在本文案例的实现中有一些函数专门用于二者间的转换，例如 `ascii_to_score` 与 `score_to_ascii`，在此不详述，如有调用相关函数则会提及。



## 四、 初始化与预处理

### 4.1 初始化列表

将列表所有项设为 0ub。
::: tip 性能优化
可以采用二分法减少递归命令执行次数。
~~当然可以直接set列表而不是动态生成~~
:::

### 4.2 代码处理

本文案例将输入的代码字符串转换为列表，方便进行跳转。此逻辑参考了2025年11月刊，皮革剑大佬所著[使用数据包制作编译器或解释器: 以C语言子集C-Minus为例](https://cr-019.github.io/datapack-index/feature/archive/202511/1/content.html)中的实现。在实践中此部分可以与下文[跳转逻辑](#跳转逻辑)写在一起。

```mcfunction
data remove storage Brainduck:re code.tmp_char
data modify storage Brainduck:re code.tmp_char set string storage Brainduck:re code.string 0 1
data modify storage Brainduck:re code.string set string storage Brainduck:re code.string 1

data modify storage Brainduck:re code.list append from storage Brainduck:re code.tmp_char
```

### 4.3 跳转逻辑

预处理 `[]` 的跳转对应逻辑可以显著减少运行时的开销。

#### 跳转表建立算法

在 `string_to_list` 阶段，我们遍历代码并维护一个索引计数 `#ip` ：

1. **遇到 `[`**：将当前 `#ip` 压入 `stack`。
2. **遇到 `]`**：
* 若 `stack` 为空，抛出 `syntax/close_bracket` 错误并终止程序。
* 若不为空，建立双向映射并执行弹出操作。设置 `jump_table[open_idx] = close_idx` 且 `jump_table[close_idx] = open_idx`。
3. **收尾**：遍历结束后若 `stack` 不为空，抛出 `syntax/open_bracket` 错误。

下面是伪代码逻辑参考：
```cpp
//code为存放代码的数组
stack<int> s;
for (int i = 0; i < code.size(); i++) {
    switch (code[i]) {
        case '[':
            s.push(i); // 将'['的位置压栈
            break;
        case ']': {
                if (s.empty()) throw SyntaxError("Unmatched ']'");
                int match_pos = s.top();
                s.pop();
                jump_table[i] = match_pos; // ']' 跳转到匹配的'['
                jump_table[match_pos] = i; // '[' 跳转到匹配的']'
                break;
            }
        default:
            break;
    }
}
if (!s.empty()) {
    throw SyntaxError("Unmatched '['");
}
```

在 `mcfunction` 中，由于访问列表成员仅能使用数字作为下标，本案例使用 **宏（Macros）** 来近似实现动态访问列表成员。

* 遇到 `[` 时压栈：

```mcfunction
#将程序指针转换成 Storage 以便压栈
function Brainduck:compile/convert/score_to_storage/ip
data modify storage Brainduck:re stack append from storage Brainduck:re ip
```

* 遇到 `]` 时建立双向映射并弹栈：
```mcfunction
execute if data storage Brainduck:re {stack:[]} run return fail
#]匹配到的[一定是stack里的最后一个
#将程序指针转换成 Storage 以便调用宏函数
function Brainduck:compile/convert/score_to_storage/ip
data modify storage Brainduck:re match_pos set from storage Brainduck:re stack[-1]
data remove storage Brainduck:re stack[-1]
function Brainduck:compile/preprocess/match/stack_pop/set_jump_table with storage Brainduck:re
return 1
```
compile/preprocess/match/stack_pop/set_jump_table.mcfunction中的内容：

```mcfunction
#建立映射
$data modify storage Brainduck:re jump_table[$(ip)] set from storage Brainduck:re match_pos
$data modify storage Brainduck:re jump_table[$(match_pos)] set from storage Brainduck:re ip
```

## 五、 核心指令的函数化实现

由于 mcfunction 不支持动态数组下标（如 `array[#ptr]`），我们必须使用**宏（Macros）或递归分治**来桥接 Storage 与 Scoreboard。本文案例直接使用宏来处理。

### 5.1 指令分发逻辑

1. **数值增减 (`+`, `-`)**:
* 将 Storage `array[#ptr]` 存到 Scoreboard `#tmp_value` 中。
* 对 `#tmp_value` 进行加减运算。
* 溢出处理，可使用 execute if score 判断，保证值在 $0$ ~ $255$ 之间。
* 将 `#tmp_value` 存回 Storage。

2. **左移右移 (`<`, `>`)**:
* 对 `#ptr` 进行加减运算。
* 溢出处理，可使用 execute if score 判断，保证值在 $0$ ~ 纸带长度-$1$ 之间。

左移的实现示例

```mcfunction
scoreboard players remove #ptr Brainduck.re 1
execute if score #ptr Brainduck.re matches 0.. run return 1
#溢出处理
scoreboard players operation #ptr Brainduck.re = #array_length Brainduck.re
#减一，因为下标从0开始
scoreboard players remove #ptr Brainduck.re 1
```


3. **输入输出 (`,`, `.`)**:
* 输出时将数值追加到输出列表。
* 输入时截取 `input` 字符串的首位，执行 `ascii_to_score` 转换，若无法截取到输入则输出并终止程序。

::: tip 提示
输入截取实现亦可参考[上文所述](#42-代码处理)。
:::

4. **跳转循环 (`[`, `]`)**:
* 读取当前 `array[#ptr]` 并存入计分板判断是否为 $0$ ，利用宏读取 `jump_table[#ip]` 跳转。

### 5.2 程序结束

* 调用 `score_to_ascii` ，将输出转换为 JSON 文本。
* 输出输出列表中的内容。
* 将输出列表清空。
* 将 `#running` 设为 `0` 。

---

## 六、 运行时保护与并行限制

Minecraft 的单线程以及其他~~bug~~特性要求我们必须在性能与稳定性之间取得平衡。

### 6.1 异步挂起机制 (Schedule)

为了防止单 Tick 执行指令过多导致游戏卡死或者超出命令执行上限，我们引入了双重计数：

* **单次执行保护**：设置 `#count_c` 计数器，当单 Tick 执行指令超过 `#max_single_command_count`（如 $100$ 次）时，执行 `schedule` 并在 1 Tick 后恢复运行。
* **总运行保护**：设置 `#max_total_command_count`，防止代码死循环耗尽资源。

### 6.2 单线程锁

在程序启动时将 `#running` 设置为 `1`，执行完毕或手动中止（`#cmd_stop = 1`）时重置。

---

## 七、 其他编译优化
为了克服 Minecraft 环境下 NBT 访问以及宏函数及时编译的性能开销，本文研究了 **词法折叠（Lexical Folding）** 技术。
通过在预处理阶段对算术指令串进行语义提取，解释器能够以 $O(1)$ 的计分板操作替代原本 $O(n)$ 的递归执行。

### 7.1 算术指令折叠 (Arithmetic Folding)
Brainduck 程序经常出现连续 `+` `-` `>` `<`。

* **中间表示 (IR)**：将 code.list 从字符串数组改为对象数组，例如 {"cmd":"+","val":5}。

### 7.2 归零循环优化 (Clear Loop Optimization)
Brainduck 程序中一种极其常见的模式是 `[-]` 或 `[+]` ，其作用是将当前单元格清零。最极端的情况可能会运行超过 $500$ 次。

* 将其标记为特有指令，直接将当前单元格设置成 $0$ 并跳转到 `]` 。

### 7.3 扫描寻址优化 (Scanline Optimization)
Brainduck 程序经常使用 `[>]` 或 `[<]` 来寻找下一个为 $0$ 的单元格。

* 将其标记为特有指令并直接定位到值为 $0$ 的单元格，更新 `#ptr`。

### 7.4 跳转指令的静态化 (Static Jump Table)

* 指令格式设为 {"cmd":"[", "target": 25}，直接读取 `target`，消除了对 `jump_table` 列表的二次查询开销。

### 7.5 乘法循环/数据搬移优化 (Copy/Multiply Loop)
常见的 Brainduck 程序结构如 `[->+++<]` ，其意图是将当前单元格的值乘以 3 加到下一个单元格，并将原单元格清零。

* 将其转化为一个“乘法搬移”指令，公式化执行 $target\_cell = target\_cell + (source\_cell \times n)$
$source\_cell = 0$，其中 $n$ 为 `+` 或 `-` 的数量。

## 八、 运行展示
我们需要一个代码编辑框，用于输入 Brainduck 源码。

![Brainduck 输入框](./image/brainfuck_dialog.png)

## 九、 结论

通过对 mcfunction 的优化，本文再次证明了在 Minecraft 中实现编译器是可行的。跳转表的引入优化了嵌套循环的执行效率，异步调度机制则保证了程序运行，词法折叠的引入极大优化了运行效率。

## 十、 参考文献
[1] 皮革剑. 使用数据包制作编译器或解释器: 以C语言子集C-Minus为例[EB/OL]. Feature, (2025-11)[2026-02-02]. https://cr-019.github.io/datapack-index/feature/archive/202511/1/content.html.

[2] 维基百科编者. Brainduck[EB/OL]. (2025-08-15)[2026-02-02]. https://zh.wikipedia.org/wiki/Brainduck.

[3] Minecraft Wiki 编者. 命令/data[EB/OL]. (2025-12-26)[20206-02-02]. https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/data.

[4] Minecraft Wiki 编者. Java版函数[EB/OL]. (2026-01-16)[20206-02-02]. https://zh.minecraft.wiki/w/Java%E7%89%88%E5%87%BD%E6%95%B0.

[5] Minecraft Wiki 编者. 命令/execute[EB/OL]. (2026-01-24)[20206-02-02]. https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/data.

[6] Minecraft Wiki 编者. 命令/scoreboard[EB/OL]. (2026-01-22)[20206-02-02]. [3] Minecraft Wiki 编者. 命令/data[EB/OL]. (2025-12-26)[20206-02-02]. https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/data.

[7] Panu Kalliokoski. Index of /Brainduck/impl/interp[EB/OL]. (2002)[2026-01-25]. https://esoteric.sange.fi/Brainduck/impl/interp/.

---

### 附录：错误代码参考表

::: details 点击展开错误代码定义
* **SyntaxError (Preprocess)**
* `close_bracket` - 多余的 `]`
* `open_bracket` - 缺少 `]` 匹配

* **RuntimeError**
* `already_running` - 已有程序正在运行
* `too_many_executions` - 命令执行总数超过上限
:::

### 后记

* 你知道吗，要使得 Brainduck 完全图灵完备，模拟纸带需要无限长；但如果按照这个标准来看，人类到目前为止还没有造出一台真正图灵完备的机器。

---