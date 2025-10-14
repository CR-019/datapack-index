---
title: '《MOT 无人机实例教程》摘要'
---

<FeaturedHead
    title = '《MOT 无人机实例教程》摘要'
    authorName = 小豆8593
    avatarUrl = '../../_authors/小豆8593.jpg'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/206987540' },
        { name: 'GitHub', url: 'https://github.com/xiaodou8593' }
    ]"
    resourceLink = https://github.com/xiaodou8593/mot_1.0
    cover='../_assets/0.png'
/>

::: tip    
适用版本：Minecraft Java Edition 1.21.4  
项目架构：MOT + MOT-Memory + MOT-Math3.1 + MOT-Perf + iframe  
语言：Minecraft 函数（mcfunction）+ MOT 模板语法 + 线性代数库  
目标：从零开始构建一套**可遥控、可编程、可扩展**的无人机系统，并支持外接设备与 GUI 交互。
:::

### 我为什么要写这篇教程？

随着JAVA版1.19.4更新的物品展示实体（IDE）、文本展示实体（TDE）、方块展示实体（BDE）相关技术的兴起，原版开发者们遇到了两大迫切的现实需要：

* **清晰的模块化管理**
* **高性能数学计算**

前者以面向对象技术为代表，主要用于将多个展示实体封装为一个整体，人工规定对象格式、对象协议，并实现模块之间、对象之间的通信。

后者以局部坐标系算法、四元数算法、自动控制算法为代表，主要用于三维对象空间模型的构建，以及展示实体的transformation姿态计算，从而实现流畅、灵活、具有交互性的程序动画。

### 在这篇教程中你可以学习到什么？

---
* mcfunction面向对象思想的实践
* 模块协议与模块通信
* 使用mot程序进行模板化项目构建
* 标准化测试实践
---
* 四元数与局部坐标系
* 运动学与物理计算
* 自动控制算法的应用
---

### 如何获取教程？

&gt; 仓库地址：https://github.com/xiaodou8593/mot_1.0

&gt; source_files是mcfunction模板辅助程序源文件（本项目需要用到）


&gt; example_tutorial是教程的markdown文档（请按[.mot_example.md](https://github.com/xiaodou8593/mot_1.0/blob/main/example_tutorial/.mot_example.md)、[chapter1.md](https://github.com/xiaodou8593/mot_1.0/blob/main/example_tutorial/.chapter1.md)、[chapter2.md](https://github.com/xiaodou8593/mot_1.0/blob/main/example_tutorial/.chapter2.md)、[chapter3.md](https://github.com/xiaodou8593/mot_1.0/blob/main/example_tutorial/.chapter3.md)顺序阅读）


&gt; example_datapack是成品数据包（项目构建过程中遇到疑惑可以进行对照）

---


## 1. 项目总览

| 模块 | 功能 | 备注 |
|---|---|---|
| **mot_uav** | 无人机本体 | 运动学、动力学、碰撞、静体优化、GUI |
| **mot_lamp** | 红石灯 | 左右下三插槽，开关状态同步 |
| **mot_scatter** | 六管机枪 | 连续子弹+散射角度+音效 |
| **mot_laser** | 激光枪 | 冷却机制+穿透伤害 |
| **mot_mover** | 方块搬运器 | 读取/放置方块+NBT 保存 |
| **mot_dropper** | 投弹器 | 仅允许 TNT，自动引信 |
| **mot_boat** | 栓绳船 | 与无人机建立 leash，支持拖拽 |
| **mot_scenes** | 展览场景 | 状态机编排，一键演示全部设备 |

---

## 2. 技术亮点

| 类别 | 实现 | 说明 |
|---|---|---|
| **运动学** | 四元数+局部坐标系 | 10000 定点小数，角速度/线速度迭代 |
| **动力学** | 冲量-响应系统 | 支持多碰撞点、法向量、弹性系数 |
| **静体优化** | 冻结静止实体 | 节省算力，火焰图验证 |
| **设备协议** | `_sync_request / _sync_coord / _use_signal` | 三插槽即插即用 |
| **GUI** | iframe 背包替换 | 视线追踪+权限物品+按钮事件 |
| **控制程序** | 状态机+组合程序 | 高度/旋转/位移/瞄准/等待/连接/断开 |
| **子弹模块** | 子实体递归 | 粒子+伤害+穿透方块 |
| **编号池** | 模块级 `free_addr` | 避免 int 上限，支持动态注册/注销 |
| **性能** | perf 管线集成 | `if_block` 仅 4~5 条记分板开销 |

---

## 3. 无人机控制程序清单

| 程序 | 功能 | 状态 |
|---|---|---|
| `height` | 定高悬停 | 0/1/2 |
| `rotation` | 偏航角锁定 | 0/1/2 |
| `position` | 水平位移 | 0/1/2 |
| `facing` | 瞄准目标点 | 0/1/2 |
| `compose` | 多程序串行 | 0/1/2 |
| `up / turn / forward` | 瞬时增量 | 转存为以上程序 |
| `left_connect / left_deconnect / left_use` | 左插槽 | 0/-1/2 |
| `down_* / right_*` | 另两插槽 | 同上 |
| `waiting` | 等待 N 刻 | 倒计时 |
| `landing / near_landing` | 近地着陆 | 自动修正高度 |

---

## 4. 外接设备插槽坐标

| 插槽 | 局部坐标 (u,v,w) | 说明 |
|---|---|---|
| left | (2500,0,0) | 无人机左侧 0.25 格 |
| down | (0,-2500,0) | 无人机下方 0.25 格 |
| right | (-2500,0,0) | 无人机右侧 0.25 格 |

&gt; 设备只需实现 `_sync_request / _sync_coord / _use_signal` 即可被自动识别。

---

## 5. 生成设备实例

### 生成无人机

```mcfunction
# 导入数据模板
data modify storage mot_uav:io input set from storage mot_uav:class test
# 指定生成位置
tp @e[tag=math_marker,limit=1] 0 0 0
data modify storage mot_uav:io input.position set from entity @e[tag=math_marker,limit=1] Pos
# 解析数据模板，构造实例
function mot_uav:_new
```

---
### 生成机枪

```mcfunction
# 导入数据模板
data modify storage mot_scatter:io input set from storage mot_scatter:class test
# 指定生成位置
tp @e[tag=math_marker,limit=1] 0 0 0
data modify storage mot_scatter:io input.position set from entity @e[tag=math_marker,limit=1] Pos
# 解析数据模板，构造实例
function mot_scatter:_new
```

&gt; 构造其它设备实例的方法同上

---
### 通用测试场景

```mcfunction
function mot_uav:test/general/start
```

---
### 瞄准测试场景

```mcfunction
function mot_uav:test/facing/start
```

---
### 一键展览场景

```mcfunction
function mot_scenes:exhibition/start
```