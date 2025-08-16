<FeatureHead
    title = 'clang-mc：面向 Minecraft 数据包的虚拟 CPU 和汇编开发框架'
    authorName = xia__mc
    avatarUrl = '../../_authors/xia__mc.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/526612694' }
    ]"
    cover='../_assets/7.png'
    resourceLink = 'https://github.com/xia-mc/clang-mc'
/>

## 摘要

由于 Minecraft 数据包的开发一直面临 **可读性差、维护困难、功能受限** 等问题，Project clang-mc试图通过构造一个与现代硬件类似的环境，与LLVM接轨以实现与高级语言的兼容性，从而改进 Minecraft 数据包开发体验。

为此，本文作为 `Project clang-mc` 的核心部分，提出并实现了一种基于 **mcfunction 的虚拟 CPU 架构**。该架构采用**寄存器-内存模型**，并配套设计了**专用的汇编语言及其汇编器**。编译器称为 `clang-mc`，汇编器是编译器中的一个模块；汇编语言称为 `mcasm`，语法类似 x86 汇编。

通过将底层命令逻辑抽象为 CPU 指令和内存访问，本工具链显著简化了部分场景下的开发流程，提高了代码可读性与可维护性。实验表明，该方案为构建高效、结构化的 Minecraft 自动化系统提供了一种可行的编译工具支持。

## 引言

LLVM 编译器基础设施及其优化技术主要面向**寄存器-内存架构**的物理硬件设计，其核心假设(如快速寄存器访问、明确的内存地址空间)与 Minecraft 的 `mcfunction` 命令执行环境存在**本质性差异**。`mcfunction` 本质上是一种基于**顺序执行命令和方块/实体状态**的脚本语言，缺乏对寄存器、统一内存地址空间等底层计算抽象的原生支持。

这种差异意味着，若要将 LLVM 的强大编译优化能力应用于 Minecraft 数据包开发，存在两条主要技术路径：

- **大幅改造 LLVM：** 重写其代码生成器和优化器，使其适应 `mcfunction` 的状态驱动、无寄存器模型。这个方案的工作量和难度巨大，且无法获得未来 LLVM 更新所带来的性能红利。

- **引入抽象层：** 在 `mcfunction` 之上构建一个 **虚拟 CPU (vCPU)** 抽象层。该 vCPU 模拟一个寄存器-内存架构，从而作为 LLVM 后端的编译目标。LLVM 只需面向此 vCPU 生成代码，然后再将指令编译为 `mcfunction`。

`Project clang-mc` **明确选择了后者**。这使得我们能够最大程度地利用现有 LLVM 成熟的前端、优化器，无需对其框架本身进行修改。

实现一个高效、可靠的 vCPU 是 `Project clang-mc` 成功的关键基石。本文的核心贡献即在于此：我们研究并实现了在 `mcfunction` 环境中运行一个**寄存器-内存**架构的**虚拟 CPU**。

具体来说，本文的主要贡献如下：

- **vCPU 指令集架构：** 定义一套精简、实用的指令集，该指令集需考虑 `mcfunction` 的执行特性(如延迟、命令限制)和作为 LLVM 后端的可行性。
- **配套汇编语言：** 设计一套人类可读的汇编语法，供开发者直接编写或作为 LLVM 后端的输出。
- **汇编器：** 构建一个将汇编代码翻译成 `mcfunction` 命令的工具。
- **vCPU 运行时：** 利用 `mcfunction` 原生数据结构，实现一个高效的运行时库。

在后续的章节，我们会逐一介绍：

- **vCPU 架构细节：** 寄存器、内存模型的设计细节
- **汇编语言与汇编器** 汇编语言语法和汇编器的设计与实现
- **vCPU 运行时机制** vCPU 运行时实现机制和性能
- **评估与应用** vCPU 指令集典型性能、开销、与典型裸mcfunction的比较。

## vCPU 架构细节


### 设计目标

- **表达力**：能支持 LLVM IR 所需的基本操作(整数算术、加载/存储、分支、函数调用、栈管理等)。
- **可编译性**：指令容易映射到 `mcfunction` 命令序列，且汇编器能够进行可预测的代码生成与优化(例如指令融合、常量折叠)。
- **有效性**：在 Minecraft 的命令限制(函数宏、函数调用、记分板/NBT操作开销)下尽量降低指令运行时开销。
- **可理解性**：汇编语法对熟悉 x86-64 的编程者友好，便于手工编写与调试。
- **与 LLVM 的契合**：便于将 LLVM 作为前端目标(例如实现一个简单的 LLVM 后端或目标描述)。

### 寄存器

与 `x86`, `RISC-V` 等流行硬件架构类似，`Project clang-mc` vCPU 具有 `caller-saved`, `callee-saved`, `special` 三种**寄存器**。

vCPU 有 32 个**通用寄存器**，包括 8 个**传参/临时寄存器** (r0~r7)、8 个**临时寄存器** (t0~t7)、16 个**持久寄存器** (x0~x15)。这个寄存器数量能够帮助 LLVM 充分优化代码，避免使用较慢的内存，同时确保 `HashMap` 工作在最佳性能下。

与 x86 不同，为了改进性能，vCPU 没有隐式的标志位寄存器。同时也没有专用浮点寄存器，寄存器是没有类型的，它们的宽度是 **32 位**。

寄存器基于 `mcfunction` 计分板实现，这也是 `mcfunction` 最快的存储单元。在 Minecraft 1.21 中，计分板内部使用 FastUtil 的 `Object2ObjectOpenHashMap` 实现，负载因子为 0.5。

vCPU 运行时实现中，寄存器被映射到名为 scoreboard objective 中，每个寄存器为一个**虚拟玩家**。

### 内存模型

- **线性虚拟内存**：vCPU 呈现为一个线性字节寻址空间，范围为 0~2147483647。
- **内存分区**：与 x86 不同，为了简化实现，vCPU 没有“代码段”的概念，所有内存都是可读可写的，并且没有任何差异。

为了实现对巨大的内存空间的映射，我们使用**函数宏**动态生成指令，这使得内存显著慢于寄存器。在 Minecraft 1.21 中，内存内部使用 Java STL 的 `ArrayList` 实现。

### 寻址模式(完整性与兼容性)

参考 x86-64 的寻址灵活性，vCPU 支持以下寻址表达式：

- 直接立即数：`[imm]`
- 寄存器间接：`[rbase]`
- 基址 + 偏移：`[rbase + disp]`
- 基址 + 索引 \* scale + 偏移：`[rbase + rindex*scale + disp]` (scale 值不受限)

mcfunction 不支持一次性进行多个数学计算，为了在汇编器与运行时之间保持简单与高效，复杂寻址最终会被翻译成一系列指令。

## 汇编语言

mcasm 的设计目标是对熟悉 x86 的开发者尽可能友好，同时加入便于映射到 mcfunction 的指令与伪指令。

### 基本语法要点

- 标签：`label:` (与 x86 一致)
- 标签修饰符：如 `export test:test:` 表示导出一个函数，导出函数的名称不会经过重命名，因此受 mcfunction 命名限制影响。
- 指令格式：`mnemonic operand1, operand2`(支持寄存器、立即数、内存表达式)
- 注释：`;` 或 `//`
- 伪指令：`static`(便于静态数据)
- 宏支持：用于生成重复模式或封装复杂的 mcfunction 片段

#### 示例

```mcasm
#include "stdio"

static greeting "Hello, World"

export test:main:
    mov r0, 10
    mov r1, 20
    add r0, r1
    ; 打印 r0 的值
    call printInt

    ; 打印 C 风格字符串
    mov r0, greeting
    call print
    ret
```

## vCPU 运行时

vCPU 运行时是将指令语义最终以 Minecraft 命令执行的核心组件，包含下列模块：

### 初始化与资源管理

- 运行时在首次加载时创建需要的 `scoreboard objectives`、`storage`等。
- 分配堆栈空间，初始化内存模型，以使 `malloc` 等方法正常工作。

### 内存读写

- 运行时提供接口以使用内存空间 (例如 `std:heap/expend` 扩展内存空间，`std:_internal/load_heap_custom` 读取内存等)。

### 延迟与可见性

- mcfunction 是单线程的，所有指令都是同步的。因此你完全不需要考虑这一点。

## 评估与应用

:::tip
TODO 由于某些尚未解决的问题，benchmark 还做不了，之后的论文和视频会单独提及，见谅**
:::

## 应用

在结构化代码、缩短行数等场景中，mcasm 已经有不错的表现。

[一种基于数据包的视频播放器](https://www.bilibili.com/video/BV1XM8wzSE6d)

[100 秒了解 mcasm](https://www.bilibili.com/video/BV1bhtrznEzE)

### 案例研究

下面给出一个**矩阵乘法**的例子，展示从 `mcasm` 到 `mcfunction` 转换示例。

视频: [100 秒了解 mcasm: 01:04](https://www.bilibili.com/video/BV1bhtrznEzE/?t=64)

#### mcasm

```mcasm
// void matmul(int32_t *A, int32_t *B, int32_t *C, int M, int N, int K)
export test:matmul:
    mov t0, 0  // int i;
.loopM:
    mov t1, 0  // int j;
.loopK:
    mov t2, 0  // int k;
    mov t3, 0  // int sum;
.loopN:
    // sum += A[i*N + k] * B[k*K + j]
    mov t4, t0
    mul t4, r4
    add t4, t2
    mov t4, [r0 + t4]  // A[i*N + k]
    mov t5, t2
    mul t5, r5
    add t5, t1
    mov t5, [r1 + t5]  // B[k*K + j]
    mul t4, t5
    add t3, t4

    add t2, 1
    jl t2, r4, .loopN

    // C[i*K + j] = sum;
    mov t4, t0
    mul t4, r5
    add t4, t1
    mov [r2 + t4], t3

    add t1, 1
    jl t1, r5, .loopK
    add t0, 1
    jl t0, r3, .loopM
    ret
```

#### mcfunction

```mcfunction
#
# file: "test.mcasm"
# label: "test:matmul"
#

# mov t0, 0  // int i;
# aka 'mov t0, 0'
scoreboard players set t0 vm_regs 0
execute if function output:a run return 1
execute if function output:b run return 1
return run function output:c
```

```mcfunction
#
# file: "test.mcasm"
# label: "test:matmul.loopM"
#

# mov t1, 0  // int j;
# aka 'mov t1, 0'
scoreboard players set t1 vm_regs 0
execute if function output:b run return 1
return run function output:c
```

```mcfunction
#
# file: "test.mcasm"
# label: "test:matmul.loopK"
#

# mov t2, 0  // int k;
# aka 'mov t2, 0'
scoreboard players set t2 vm_regs 0
# mov t3, 0  // int sum;
# aka 'mov t3, 0'
scoreboard players set t3 vm_regs 0
return run function output:c
```

```mcfunction
#
# file: "test.mcasm"
# label: "test:matmul.loopN"
#

# mov t4, t0
scoreboard players operation t4 vm_regs = t0 vm_regs
# mul t4, r4
scoreboard players operation t4 vm_regs *= r4 vm_regs
# add t4, t2
scoreboard players operation t4 vm_regs += t2 vm_regs
# mov t4, [r0 + t4]  // A[i*N + k]
# aka 'mov t4, [r0 + t4]'
data modify storage std:vm s2 set value {result: "t4", ptr: -1}
scoreboard players set s0 vm_regs 1
scoreboard players operation s0 vm_regs *= t4 vm_regs
scoreboard players operation s0 vm_regs += r0 vm_regs
execute store result storage std:vm s2.ptr int 1 run scoreboard players get s0 vm_regs
function std:_internal/load_heap_custom with storage std:vm s2
# mov t5, t2
scoreboard players operation t5 vm_regs = t2 vm_regs
# mul t5, r5
scoreboard players operation t5 vm_regs *= r5 vm_regs
# add t5, t1
scoreboard players operation t5 vm_regs += t1 vm_regs
# mov t5, [r1 + t5]  // B[k*K + j]
# aka 'mov t5, [r1 + t5]'
data modify storage std:vm s2 set value {result: "t5", ptr: -1}
scoreboard players set s0 vm_regs 1
scoreboard players operation s0 vm_regs *= t5 vm_regs
scoreboard players operation s0 vm_regs += r1 vm_regs
execute store result storage std:vm s2.ptr int 1 run scoreboard players get s0 vm_regs
function std:_internal/load_heap_custom with storage std:vm s2
# mul t4, t5
scoreboard players operation t4 vm_regs *= t5 vm_regs
# add t3, t4
scoreboard players operation t3 vm_regs += t4 vm_regs
# add t2, 1
scoreboard players add t2 vm_regs 1
# jl t2, r4, .loopN
# aka 'jl t2, r4, test:matmul.loopN'
execute if score t2 vm_regs < r4 vm_regs run return run return run function output:c
# mov t4, t0
scoreboard players operation t4 vm_regs = t0 vm_regs
# mul t4, r5
scoreboard players operation t4 vm_regs *= r5 vm_regs
# add t4, t1
scoreboard players operation t4 vm_regs += t1 vm_regs
# mov [r2 + t4], t3
data modify storage std:vm s2 set value {ptr: -1, value: "t3"}
scoreboard players set s0 vm_regs 1
scoreboard players operation s0 vm_regs *= t4 vm_regs
scoreboard players operation s0 vm_regs += r2 vm_regs
execute store result storage std:vm s2.ptr int 1 run scoreboard players get s0 vm_regs
function std:_internal/store_heap_custom with storage std:vm s2
# add t1, 1
scoreboard players add t1 vm_regs 1
# jl t1, r5, .loopK
# aka 'jl t1, r5, test:matmul.loopK'
execute if score t1 vm_regs < r5 vm_regs run return run execute if function output:b run return 1
execute if score t1 vm_regs < r5 vm_regs run return run return run function output:c
# add t0, 1
scoreboard players add t0 vm_regs 1
# jl t0, r3, .loopM
# aka 'jl t0, r3, test:matmul.loopM'
execute if score t0 vm_regs < r3 vm_regs run return run execute if function output:a run return 1
execute if score t0 vm_regs < r3 vm_regs run return run execute if function output:b run return 1
execute if score t0 vm_regs < r3 vm_regs run return run return run function output:c
# ret
return 1
```

### 局限性

- **性能下限**：尽管理念上能把很多计算映射到 vCPU，但 Minecraft 的命令执行模型注定其吞吐无法与真实硬件相提并论；`Project clang-mc` 不能提高 mcfunction 的性能上限，对于某些难以模拟的操作（IEEE 754 浮点、unsigned 数学计算等），性能仍然会降低。
- **调试复杂度**：尽管 mcasm 提高了编码时的可读性，但运行时错误仍受限于 ojang 的调试工具支持。即使 `clang-mc` 编译器提供了**调试符号**帮助建立 mcfunction 代码与 mcasm 的联系，但调试难度仍然不会低于裸 mcfunction。
- **ABI 与兼容性问题**：为了与 LLVM 更好结合，我们仍需在后续工作中定义更详尽的 ABI 文档与测试套件。现在的文档等基础设施仍然严重欠缺。

### 未来工作

- **更高级的指令优化**：在汇编器端实现更强的局部/全局优化(优化寄存器分配、数据流分析、编译时计算等)。
- **更丰富的标准库**：实现字符串处理、I/O 抽象、异步事件处理、Minecraft 指令绑定。
- **工具链整合**：开发 LLVM 后端，完善从 C/C++/Rust 等前端到 mcasm 的编译工具链。
- **性能与调试工具**：提供改进的 mcfunction 解释器、寄存器和内存可视化、调试器 (基于 Minecraft Mod)。

## 结论

本文在 `Project clang-mc` 的背景下，提出了一个受 `x86-64` 特性启发、面向 `mcfunction` 环境的 `vCPU` 设计与 `mcasm` 汇编语言模板。

通过**寄存器-内存**抽象，我们为将 LLVM 优化器应用于 Minecraft 自动化场景提供了可行的中间表示。

尽管受限于 Minecraft 的命令执行模型，本设计通过汇编器与运行时的协同优化，能够在许多实际场景中显著提升代码的结构性与可维护性，成为连接高级语言与 `mcfunction` 的桥梁。

## 致谢

- [Minecraft](https://www.minecraft.net): Mojang Studios 开发的 Minecraft 游戏`clang-mc` 遵循 [Minecraft EULA](https://www.minecraft.net/en-us/eula) 及相关使用条款。
- [LLVM](https://llvm.org): 先进的编译器基础设施，遵循 Apache License 2.0 开源协议。
- [ankerl::unordered_dense](https://github.com/martinus/unordered_dense): 一个现代 C++ 的高性能、低内存占用的哈希表实现，遵循 [MIT License](https://github.com/martinus/unordered_dense/blob/main/LICENSE)。
- [fmt](https://fmt.dev/): 一个快速、安全的 C++ 格式化库，遵循 [MIT License](https://github.com/fmtlib/fmt/blob/master/LICENSE.rst)。
- [spdlog](https://github.com/gabime/spdlog): 一个高性能的 C++ 日志库，遵循 [MIT License](https://github.com/gabime/spdlog/blob/v1.x/LICENSE)。
- [yaml-cpp](https://github.com/jbeder/yaml-cpp): 一个 C++ 的 YAML 解析和生成库，遵循 [MIT License](https://github.com/jbeder/yaml-cpp/blob/master/LICENSE)。

## 参考

1. [Minecraft Wiki](https://zh.minecraft.wiki/)
2. [LLVM 编译器基础设施项目](https://llvm.gnu.ac.cn/)
3. [MCFPP](https://www.mcfpp.top/)

## 附录：示例 mcasm 文件模板

```mcasm
#include "stdlib"
#include <stdio>

#define A_CONSTANT 123
static aGlobalMessage "message"

extern aExternLabel:
    // no impl

aGlobalLabel:
    ret

export test:main:
    call aGlobalLabel

    ; do something
    jmp .aLocalLabel

.aLocalLabel:
    static .aLocalMessage "message2"
    mov r0, .aLocalMessage
    // print char * at r0
    call print
    ret
```
