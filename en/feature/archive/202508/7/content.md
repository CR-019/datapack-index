---
title: 'clang-mc: Virtual CPU and assembly development framework for Minecraft data pack'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "clang-mc: Virtual CPU and assembly development framework for Minecraft data pack"
    authorName = "xia__mc"
    cover='../../../../../feature/archive/202508/_assets/7.png'
    resourceLink = 'https://github.com/xia-mc/clang-mc'
/>

## summary

Since the development of Minecraft data pack has always faced problems such as poor readability, difficulty in maintenance, and limited functionality, Project clang-mc attempts to improve the Minecraft data pack development experience by constructing an environment similar to modern hardware and integrating it with LLVM to achieve compatibility with high-level languages.

For this reason, this article serves as`Project clang-mc`As the core part, a virtual CPU architecture based on **mcfunction** is proposed and implemented. This architecture adopts the **register-memory model** and designs a **dedicated assembly language and its assembler**. The compiler is called`clang-mc`, the assembler is a module in the compiler; assembly language is called`mcasm`, the syntax is similar to x86 assembly.

By abstracting the underlying command logic into CPU instructions and memory access, this tool chain significantly simplifies the development process in some scenarios and improves code readability and maintainability. Experiments show that this solution provides a feasible compilation tool support for building an efficient and structured Minecraft automation system.

## introduction

The LLVM compiler infrastructure and its optimization techniques are mainly oriented to the physical hardware design of the **register-memory architecture**, and its core assumptions (such as fast register access, explicit memory address space) are consistent with Minecraft's`mcfunction`There are **substantial differences** in the command execution environment.`mcfunction`It is essentially a scripting language based on sequential execution of commands and block/entity states, and lacks native support for underlying computing abstractions such as registers and unified memory address spaces.

This difference means that there are two main technical paths to apply LLVM's powerful compilation optimization capabilities to Minecraft data pack development:

- **Significant revamp of LLVM:** Rewrite its code generator and optimizer to adapt`mcfunction`state-driven, register-less model. The workload and difficulty of this solution are huge, and the performance dividends brought by future LLVM updates will not be obtained.

- **Introduction of abstraction layer:** in`mcfunction`Build a **virtual CPU (vCPU)** abstraction layer on top. This vCPU emulates a register-memory architecture and thus serves as a compilation target for the LLVM backend. LLVM simply generates code for this vCPU and then compiles the instructions into`mcfunction`。

`Project clang-mc`**Clearly chose the latter**. This allows us to take maximum advantage of existing LLVM's mature front-end, optimizer without requiring modifications to the framework itself.

Implementing an efficient and reliable vCPU is`Project clang-mc`Key building blocks for success. This is the core contribution of this paper: we study and implement`mcfunction`The environment runs a **virtual CPU** with a **register-memory** architecture.

Specifically, the main contributions of this article are as follows:

- **vCPU instruction set architecture:** Define a streamlined and practical instruction set that needs to be considered`mcfunction`Execution characteristics (such as latency, command limits) and feasibility as an LLVM backend.
- **Companion Assembly Language:** Design a set of human-readable assembly syntax for developers to write directly or as output from the LLVM backend.
- **Assembler:** Builds an assembly code that translates into`mcfunction`command tool.
- **vCPU runtime:** Utilization`mcfunction`Native data structures to implement an efficient runtime library.

In subsequent chapters, we will introduce them one by one:

- **vCPU architecture details:** Design details of registers and memory models
- **Assembly language and assembler** Assembly language syntax and assembler design and implementation
- **vCPU runtime mechanism** vCPU runtime implementation mechanism and performance
- **Evaluation and Application** Comparison of typical performance, overhead, and typical bare mcfunction of the vCPU instruction set.

## vCPU architectural details


### design goals

- **Expressiveness**: Can support the basic operations required by LLVM IR (integer arithmetic, load/store, branch, function call, stack management, etc.).
- **Compilability**: instructions are easily mapped to`mcfunction`command sequence, and the assembler can perform predictable code generation and optimization (such as instruction fusion, constant folding).
- **Effectiveness**: Try to reduce the command runtime overhead under Minecraft's command restrictions (function macros, function calls, scoreboard/NBT operation overhead).
- **Comprehensibility**: Assembly syntax is friendly to programmers familiar with x86-64, making it easy to write and debug manually.
- **Fitness with LLVM**: Facilitates using LLVM as a front-end target (such as implementing a simple LLVM backend or target description).

### register

and`x86`, `RISC-V`Similar to other popular hardware architectures,`Project clang-mc`vCPU has`caller-saved`, `callee-saved`, `special`Three kinds of **registers**.

vCPU has 32 **general registers**, including 8 **parameter/temporary registers** (r0~r7), 8 **temporary registers** (t0~t7), and 16 **persistent registers** (x0~x15). This number of registers helps LLVM fully optimize the code to avoid using slower memory while ensuring`HashMap`Work at peak performance.

Unlike x86, vCPU does not have an implicit flag register to improve performance. There are also no dedicated floating point registers, the registers are untyped and their width is **32 bits**.

Register based on`mcfunction`Scoreboard implementation, which is also`mcfunction`The fastest storage unit. In Minecraft 1.21, the scoreboard uses FastUtil internally`Object2ObjectOpenHashMap`Implemented with a load factor of 0.5.

In the vCPU runtime implementation, registers are mapped to a named scoreboard objective, and each register is a **virtual player**.

### memory model

- **Linear virtual memory**: vCPU is presented as a linear byte addressing space, ranging from 0~2147483647.
- **Memory Partitioning**: Unlike x86, to simplify implementation, vCPU has no concept of "code segments", all memory is readable and writable without any differences.

In order to achieve mapping of huge memory spaces, we use **function macro** to dynamically generate instructions, which makes memory significantly slower than registers. In Minecraft 1.21, Java STL is used internally in memory`ArrayList`accomplish.

### Addressing modes (integrity and compatibility)

Referring to the addressing flexibility of x86-64, vCPU supports the following addressing expressions:

- Direct immediate number:`[imm]`
- Register indirection:`[rbase]`
- Base address + offset:`[rbase + disp]`
- Base + index \* scale + offset:`[rbase + rindex*scale + disp]`(scale value is not limited)

mcfunction does not support multiple mathematical calculations at once. In order to maintain simplicity and efficiency between the assembler and the runtime, complex addressing will eventually be translated into a series of instructions.

## assembly language

The design goal of mcasm is to be as friendly as possible to developers familiar with x86, while adding instructions and directives that are easy to map to mcfunctions.

### Basic grammar points

- tag：`label:`(Consistent with x86)
- tag modifier: such as`export test:test:`Indicates that a function is exported. The name of the exported function will not be renamed and is therefore affected by the mcfunction naming restriction.
- Instruction format:`mnemonic operand1, operand2`(Supports registers, immediate numbers, and memory expressions)
- Note:`;`or`//`
- Directive:`static`(convenient for static data)
- Macro support: for generating repeating patterns or encapsulating complex mcfunction fragments

#### Example

```
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


## vCPU runtime

The vCPU runtime is the core component that ultimately executes command semantics as Minecraft commands and includes the following modules:

### Initialization and resource management

- The runtime creates the required`scoreboard objectives`、`storage`wait.
- Allocate stack space and initialize the memory model so that`malloc`etc. methods work normally.

### Memory read and write

- The runtime provides an interface to use memory space (e.g.`std:heap/expend`Extend memory space,`std:_internal/load_heap_custom`read memory, etc.).

### Latency and visibility

- mcfunction is single-threaded and all instructions are synchronized. So you don't need to think about this at all.

## Assessment and Application

:::tip
TODO Due to some unresolved issues, the benchmark cannot be done yet. Later papers and videos will be mentioned separately. Forgive me**
:::

## application

mcasm has performed well in scenarios such as structuring code and shortening the number of lines.

[A video player based on data pack](https://www.bilibili.com/video/BV1XM8wzSE6d)

[Learn about mcasm in 100 seconds](https://www.bilibili.com/video/BV1bhtrznEzE)

### case study

An example of **matrix multiplication** is given below to show the`mcasm`arrive`mcfunction`Conversion example.

Video: [100 seconds to learn about mcasm: 01:04](https://www.bilibili.com/video/BV1bhtrznEzE/?t=64)

#### mcasm

```
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


### limitation

- **Performance lower limit**: Although it is conceptually possible to map many calculations to vCPU, Minecraft's command execution model is destined to have a throughput that cannot be compared with real hardware;`Project clang-mc`The performance upper limit of mcfunction cannot be increased, and performance will still be reduced for certain operations that are difficult to simulate (IEEE 754 floating point, unsigned math calculations, etc.).
- **Debugging Complexity**: Although mcasm improves readability when coding, runtime errors are still limited by ojang's debugging tool support. even though`clang-mc`The compiler provides **debugging symbols** to help establish the connection between mcfunction code and mcasm, but the debugging difficulty is still not lower than that of bare mcfunction.
- **ABI and compatibility issues**: In order to better integrate with LLVM, we still need to define more detailed ABI documentation and test suites in subsequent work. Current documentation and other infrastructure are still severely lacking.

### future work

- **More Advanced Instruction Optimization**: Implement stronger local/global optimizations on the assembler side (optimized register allocation, data flow analysis, compile-time calculations, etc.).
- **Richer standard library**: Implements string processing, I/O abstraction, asynchronous event processing, and Minecraft command binding.
- **Toolchain integration**: Develop LLVM backend and improve the compilation toolchain from C/C++/Rust and other frontends to mcasm.
- **Performance and Debugging Tools**: Provides improved mcfunction interpreter, register and memory visualization, debugger (based on Minecraft Mod).

## in conclusion

This article is in`Project clang-mc`Against the background of`x86-64`Feature inspiration, orientation`mcfunction`environmental`vCPU`Design and`mcasm`Assembly language template.

Through the **register-memory** abstraction, we provide a feasible intermediate representation for applying the LLVM optimizer to Minecraft automation scenarios.

Although limited by Minecraft's command execution model, this design can significantly improve the structure and maintainability of the code in many practical scenarios through collaborative optimization of the assembler and runtime, becoming a link between high-level languages ​​and`mcfunction`bridge.

## Acknowledgments

- [Minecraft](https://www.minecraft.net): Minecraft game developed by Mojang Studios`clang-mc`Follow [Minecraft EULA](https://www.minecraft.net/en-us/eula) and related terms of use.
- [LLVM](https://llvm.org): Advanced compiler infrastructure, open source under the Apache License 2.0.
- [ankerl::unordered_dense](https://github.com/martinus/unordered_dense): A modern C++ high-performance, low-memory hash table implementation, licensed under the [MIT License](https://github.com/martinus/unordered_dense/blob/main/LICENSE)。
- [fmt](https://fmt.dev/): A fast and secure C++ formatting library, compliant with [MIT License](https://github.com/fmtlib/fmt/blob/master/LICENSE.rst)。
- [spdlog](https://github.com/gabime/spdlog): A high-performance C++ logging library, compliant with [MIT License](https://github.com/gabime/spdlog/blob/v1.x/LICENSE)。
- [yaml-cpp](https://github.com/jbeder/yaml-cpp): A C++ YAML parsing and generation library, compliant with [MIT License](https://github.com/jbeder/yaml-cpp/blob/master/LICENSE)。

## refer to

1. [Minecraft Wiki](https://zh.minecraft.wiki/)
2. [LLVM Compiler Infrastructure Project](https://llvm.gnu.ac.cn/)
3. [MCFPP](https://www.mcfpp.top/)

## Appendix: Sample mcasm file template

```
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


