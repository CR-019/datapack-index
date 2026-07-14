---
title: 'doom.schedule —— 原版服务端调度器'
---

<FeatureHead
    title='doom.schedule —— 原版服务端调度器'
    authorName='doom_decapitator'
    resourceLink = 'https://github.com/DoomDecapitator/doom.schedule'
/>


- [前置馆](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/doom.schedule.html)
- [GitHub](https://github.com/DoomDecapitator/doom.schedule)

> 您是否遇到过：服务器重启后定时任务全部消失、玩家掉线后任务无人执行、调度失败后没有重试机会……`/schedule` 的局限不止于此。doom.schedule 用四条队列、UUID 定位和离线恢复，把这些短板全补齐了——纯数据包，零依赖。

### Doom_Flare

doom.schedule 是一个面向 Minecraft 原版服务端的数据包调度框架。它在不依赖 Mod 的前提下，提供了基于 game time 的任务队列、执行上下文冻结、目标离线检测与自动恢复、以及失败重试等特性。

---

### 从 `/schedule` 的局限说起

原版命令 `/schedule function` 提供了最基础的延迟调用。在简单的机械或小规模场景中它够用——但在涉及持久化、跨维度执行、面向玩家的逻辑时，它的短板会很快暴露：

- **无持久化**：服务端重启后所有待执行的 schedule 消失
- **无目标追踪**：`/schedule` 只能记一个 function 名，无法关联到执行时的玩家或实体
- **无上下文**：执行时实体可能已离线或换人，无从判断
- **无取消或暂停**：一旦下发就无法撤销
- **无重试**：执行失败就是失败

doom.schedule 的目标就是填补这些空白，提供一个**可持久化、可追踪、可管理**的任务调度系统。它完全内置在数据包中，无需外部工具或 Mod。

---

### 核心设计

doom.schedule 以 **game time** 为时间基准，将任务组织为一条先进先出的队列。每个任务在入队时记录预期的执行时刻，tick 循环遍历全部到期任务，到期则执行。

```
         ┌─────────────────────┐
         │    queue[]          │
         │ [task, task, ...]   │
         └──────┬──────────────┘
                │ tick: 移动到 processing[]
                ▼
         ┌─────────────────────┐
         │  looper_scan        │
         │  遍历 processing[]  │
         └──────┬──────────────┘
                │
        ┌───────┴───────────────┐
        ▼                       ▼
   exec_time 到?           不到期
        │                   放回队尾
        ▼
  looper_exec 决策分流
```

每个任务的数据结构如下：

```json
{
  "run": "say hello",
  "time": 100,
  "unit": "t",
  "id": "my_task_001",
  "exec_time": 12345,
  "by": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "dim": "minecraft:overworld",
  "posX": 0.0, "posY": 64.0, "posZ": 0.0,
  "rotX": 0.0, "rotY": 0.0,
  "is_player": true,
  "retry": 3,
  "retry_delay": 20
}
```

`exec_time` 是入队时由 `get_time` 加上 `time` 换算（乘以 unit.scale）得到的目标 game time。tick 循环中 `looper_scan` 比较 `exec_time` 与当前 game time，到期则执行。

---

### 入队流程详解

`schedule` 函数的执行路径是理解整个系统的入口。它以宏参数接收 `{run, time, unit, id}`，然后走完以下流程：

#### 1. Unit 合法性验证

```mcfunction
$data modify storage doom.schedule:ctx _.unitEntry set from storage doom.schedule:const units[{name:'$(unit)'}]
execute unless data storage doom.schedule:ctx _.unitEntry run return fail
```

将传入的 unit 名（如 `"s"`）与常量表 `const.units` 匹配。匹配不到则直接 `return fail`。这个 lookup 表在 `__load__` 中初始化：

```json
[
  {name:"t", scale:1},       {name:"tick", scale:1},
  {name:"s", scale:20},      {name:"second", scale:20},
  {name:"m", scale:1200},    {name:"minute", scale:1200},
  {name:"h", scale:72000},   {name:"hour", scale:72000},
  {name:"d", scale:1728000}, {name:"day", scale:1728000}
]
```

为什么不用 if-else 链？storage filter 是 O(1) 的哈希查找，且新增 unit 只需在 `const.units[]` 加一条记录，无需改函数。

#### 2. 延迟计算

```mcfunction
# 提取 unit 对应的倍率
execute store result score #scale doom.schedule run data get storage doom.schedule:ctx _.unitEntry.scale
# 计算 delay = time × scale
execute if score #scale doom.schedule matches 1.. store result score #delay doom.schedule run data get storage doom.schedule:ctx _.time
execute if score #scale doom.schedule matches 1.. run scoreboard players operation #delay doom.schedule *= #scale doom.schedule
```

`time × unit.scale` 得到 tick 级延迟。

#### 3. 上下文冻结

```mcfunction
function doom.schedule:internal/schedule/context
```

读取 `@s` 的 UUID、维度、位置、朝向，存入 `ctx._`。UUID 通过 4 int → 16 byte → 16 hex → 拼接为字符串。维度优先读实体 NBT `Dimension`，若失败则 fallback 到 `execute if dimension` 检测三原维度，再失败则用 `known_dimensions` 函数标签。

#### 4. 执行时间

```mcfunction
execute store result score #time doom.schedule run function doom.schedule:get_time
scoreboard players operation #time doom.schedule += #delay doom.schedule
execute store result storage doom.schedule:ctx _.exec_time int 1 run scoreboard players get #time doom.schedule
```

`game_time + delay = exec_time`。入队后 `looper_scan` 在每 tick 比较 `game_time >= exec_time`，决定是否执行。

#### 5. 重试参数透传

`schedule_with_retry` 不重复入队逻辑，而是把 retry 参数暂存在 `ctx.temp_retry` 中，然后调用 `schedule`：

```mcfunction
$data modify storage doom.schedule:ctx temp_retry set value {retry:$(retry),retry_delay:$(retry_delay)}
$function doom.schedule:schedule {run:'$(run)',time:$(time),unit:'$(unit)',id:'$(id)'}
```

`schedule` 在计算完 `exec_time` 后检测 `temp_retry` 是否存在，若存在则转移到 `_.retry` / `_.retry_delay`，然后删除 `temp_retry`。这是一种**宏间的参数传参模式**——`schedule_with_retry` 预处理，`schedule` 消费。

#### 6. 清理与入队

```mcfunction
function doom.schedule:internal/cleanup_temp
data modify storage doom.schedule:data queue append from storage doom.schedule:ctx _
data remove storage doom.schedule:ctx _
```

`cleanup_temp` 删除 `ctx._` 内所有 UUID 中间字段（b0..bf、h0..hf、uuid0..uuid3），确保入队的任务不含瞬时数据。然后将干净的任务 `append` 到 `data.queue[]`，最后删除 `ctx._`。

---

### looper_exec 分流

`looper_exec` 将目标检测与命令执行分离为两阶段，`looper_exec` 内部清零 `#target_online` 和 `#success`，然后分路径处理：

```mcfunction
# 检测目标是否在线
scoreboard players set #target_online doom.schedule 0
$execute if entity $(by) run scoreboard players set #target_online doom.schedule 1

# 仅在线时才执行，并记录 success
$execute if score #target_online doom.schedule matches 1 store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) as $(by) at @s run $(run)
```

分流决策：

| 路径 | `#target_online` | `#success` | 有 `retry` | `is_player` | 结果 |
|---|---|---|---|---|---|
| 有 `by` | 0 | — | — | true | 移入 `offline[]` |
| 有 `by` | 0 | — | — | false | 静默丢弃 |
| 有 `by` | 1 | 1 | — | — | 完成，丢弃 |
| 有 `by` | 1 | 0 | true | — | `retry` 递减，重入队 |
| 有 `by` | 1 | 0 | false | true | 移入 `offline[]` |
| 有 `by` | 1 | 0 | false | false | 丢弃 |
| 无 `by` | — | 0 | true | — | 重试 |
| 无 `by` | — | 0 | false | — | 丢弃 |

无 `by` 路径由 `internal/execute/run_noentity` 处理，仅在保存的维度/坐标/朝向下执行命令，不绑定执行者。

这种分离解决了旧版的歧义：旧版无法区分"目标离线"和"目标在线但命令执行失败"，两者都会触发重试或下线。

---

### 四队列架构

系统维护四条并行队列，每条承担不同职责：

| 队列 | 用途 | 出队机制 |
|------|------|---------|
| `data.queue[]` | 等待调度的任务（FIFO） | 每 tick 整体移入 `processing[]` |
| `ctx.processing[]` | 当前 tick 正在处理的任务 | `looper_scan` 逐条检查，到期执行/不到期回 queue |
| `data.offline[]` | 玩家离线时冻结的任务 | `restore` 每 tick 最多恢复 10 个 |
| `data.paused[]` | 用户手动暂停的任务 | 仅 `resume` 手动恢复 |

**tick 循环**（`tick.mcfunction`）：

```mcfunction
execute if data storage doom.schedule:data queue[0] run function doom.schedule:internal/looper
scoreboard players set #restore_count doom.schedule 0
execute if data storage doom.schedule:data offline[0] run function doom.schedule:internal/restore
```

`looper` 将整个 `queue[]` 搬移到 `processing[]` 并清空队列，然后由 `looper_scan` 递归处理每个任务。这样设计的目的：如果到期任务执行中产生了新的调度（入队），不会导致当前 tick 的队列无限膨胀。

`looper_scan` 的每步：

```mcfunction
data modify storage doom.schedule:ctx task set from storage doom.schedule:ctx processing[0]
data remove storage doom.schedule:ctx processing[0]
execute store result score #exec_now doom.schedule run data get storage doom.schedule:ctx task.exec_time
execute if score #time_now doom.schedule >= #exec_now doom.schedule run function doom.schedule:internal/looper_exec
execute unless score #time_now doom.schedule >= #exec_now doom.schedule run data modify storage doom.schedule:data queue append from storage doom.schedule:ctx task
```

到期 → `looper_exec`（执行 + 分流）。未到期 → 放回 `queue[]`。无论到期与否，都从 `processing[]` 删除该条目。当 `processing[]` 为空时递归结束，`looper` 末尾的 `data remove storage doom.schedule:ctx processing` 清理空数组。

**队列间流转**：

```
入队 → queue[] ──tick──→ processing[] ──到期──→ 执行
                             │
                             ├── 不到期 → queue[]
                             │
                             └── 离线   → offline[]
                                              │
                                         restore ──online──→ queue[]
                                              │
                                         offline → 等待

pause → queue[] → paused[]
resume → paused[] → queue[]
```

---

### 离线恢复

若目标离线，任务被移至 `offline[]` 队列。每 tick 的 `restore` 函数以最多 10 个的速度扫描 `offline[]`：

```mcfunction
# doom.schedule:internal/restore — 每 tick 恢复离线任务
data modify storage doom.schedule:ctx task set from storage doom.schedule:data offline[0]
data remove storage doom.schedule:data offline[0]
function doom.schedule:internal/restore_check with storage doom.schedule:ctx task
scoreboard players set #restore_online doom.schedule 0
execute if data storage doom.schedule:ctx task.online run scoreboard players set #restore_online doom.schedule 1
data remove storage doom.schedule:ctx task.online
execute if score #restore_online doom.schedule matches 1 run data modify storage doom.schedule:data queue append from storage doom.schedule:ctx task
execute unless score #restore_online doom.schedule matches 1 run data modify storage doom.schedule:data offline append from storage doom.schedule:ctx task
data remove storage doom.schedule:ctx task
scoreboard players add #restore_count doom.schedule 1
execute if data storage doom.schedule:data offline[0] if score #restore_count doom.schedule matches ..9 run function doom.schedule:internal/restore
```

`#restore_count` 从 0 递增，`matches ..9` 允许 0-9 共 10 次递归。

---

### 重试机制

当命令执行失败（`#success = 0`），且任务定义了 `retry` 和 `retry_delay` 时，进入重试流程：

```mcfunction
# doom.schedule:internal/retry — 重试逻辑
execute store result score #retry doom.schedule run data get storage doom.schedule:ctx task.retry
scoreboard players remove #retry doom.schedule 1
execute if score #retry doom.schedule matches 0.. store result storage doom.schedule:ctx task.retry int 1 run scoreboard players get #retry doom.schedule
execute if score #retry doom.schedule matches 0.. run scoreboard players set #delay doom.schedule 1
execute if score #retry doom.schedule matches 0.. store result score #delay doom.schedule run data get storage doom.schedule:ctx task.retry_delay
execute if score #retry doom.schedule matches 0.. if score #delay doom.schedule matches ..0 run scoreboard players set #delay doom.schedule 1
execute if score #retry doom.schedule matches 0.. store result score #now doom.schedule run function doom.schedule:get_time
execute if score #retry doom.schedule matches 0.. run scoreboard players operation #now doom.schedule += #delay doom.schedule
execute if score #retry doom.schedule matches 0.. store result storage doom.schedule:ctx task.exec_time int 1 run scoreboard players get #now doom.schedule
execute if score #retry doom.schedule matches 0.. run data modify storage doom.schedule:data queue append from storage doom.schedule:ctx task
execute if score #retry doom.schedule matches ..-1 run tellraw @a [{"text":"[doom.schedule] Retry exhausted: ","color":"red"},{"nbt":"task.id","storage":"doom.schedule:ctx"}]
```

`retry` 表示额外尝试次数（`retry:3` = 失败后再试 3 次，共 4 次执行）。`retry_delay` 默认 1，≤0 自动修正为 1。耗尽时输出警告并丢弃任务。

---

### 上下文冻结

入队时冻结执行上下文：当前维度、坐标、朝向、执行者 UUID。UUID 通过 `UUID[0..3]` 读取 4 个 int，逐字节分解，查表拼接为 hex 字符串：

```mcfunction
# doom.schedule:internal/schedule/context — 冻结上下文
execute if entity @s store result storage doom.schedule:ctx _.uuid0 int 1 run data get entity @s UUID[0]
execute if entity @s store result storage doom.schedule:ctx _.uuid1 int 1 run data get entity @s UUID[1]
execute if entity @s store result storage doom.schedule:ctx _.uuid2 int 1 run data get entity @s UUID[2]
execute if entity @s store result storage doom.schedule:ctx _.uuid3 int 1 run data get entity @s UUID[3]
execute if entity @s[type=player] run data modify storage doom.schedule:ctx _.is_player set value 1b
execute if entity @s run function doom.schedule:internal/schedule/uuid_hex
execute if data storage doom.schedule:ctx _.b0 run function doom.schedule:internal/schedule/uuid_join with storage doom.schedule:ctx _
```

`uuid_hex` 将 4 个 int 分解为 16 个字节（b0..bf），`uuid_join` 宏查 `hex_chars[]` 得到 16 个 hex 对，`uuid_concat` 宏拼接为 UUID 字符串：

```mcfunction
$data modify storage doom.schedule:ctx _.by set value "$(h3)$(h2)$(h1)$(h0)-$(h7)$(h6)-$(h5)$(h4)-$(hb)$(ha)-$(h9)$(h8)$(hf)$(he)$(hd)$(hc)"
```

::: tip 注意

`uuid_hex` 中有个负值溢出修复。当 `#byte` 为负时，除修正 `#byte`（`add 256`）外，还需修正 `#temp`（`remove 1`），否则后续除法偏移 1：

```mcfunction
execute if score #byte doom.schedule matches ..-1 run scoreboard players remove #temp doom.schedule 1
execute if score #byte doom.schedule matches ..-1 run scoreboard players add #byte doom.schedule 256
```
:::

入队后自动清理所有 UUID 中间字段（b0..bf、h0..hf、uuid0..uuid3），不残留 storage。

**维度方案：**

| 层级 | 检测方式 | 适用范围 |
|---|---|---|
| 实体维度 | `data get entity @s Dimension` | 所有实体——自动支持任意维度 |
| dim_scan | `execute if dimension` | 3 原生维度，用于无实体执行者 |
| `known_dimensions` 标签 | 函数标签 | 用户自定义维度 |

实体调度自动支持任意维度。只有命令方块/控制台调度需要手动注册自定义维度：

```mcfunction
# 检测自定义维度
execute if dimension mymod:void run data modify storage doom.schedule:ctx _.dim set value "mymod:void"
```

```json
// data/doom.schedule/tags/function/known_dimensions.json
{"values": ["your_datapack:detect_void"]}
```

---

### API 参考

所有 API 均为函数，支持宏参数。除 `schedule_dynamic` 在 `api/` 下，其余均在根层级。

#### 基础调度

```mcfunction
function doom.schedule:schedule {run:'say hello',time:5,unit:'s',id:'hello_world'}
```

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `run` | string | ✅ | 执行的命令 |
| `time` | int | ✅ | 延迟数值 |
| `unit` | string | ✅ | 单位：`t`/`tick`、`s`/`second`、`m`/`minute`、`h`/`hour`、`d`/`day` |
| `id` | string | ✅ | 任务标识符，用于取消/暂停/恢复 |

无效 unit 会报错并 `return fail`。

#### 带重试

```mcfunction
function doom.schedule:schedule_with_retry {run:'say hi',time:20,unit:'t',id:'rt',retry:3,retry_delay:5}
```

`retry` — 额外尝试次数（3 = 最多 4 次执行）。`retry_delay` — 重试间隔 tick（≤0 自动修正为 1）。

#### 取消

```mcfunction
function doom.schedule:cancel_one {id:'hello_world'}    # 推荐
function doom.schedule:cancel_all {id:'group_a'}         # 全取消
function doom.schedule:clear                              # 清空所有
```

`cancel_one` — 按 `queue[]` → `offline[]` → `paused[]` 顺序扫描，只删第一条匹配（不含本 tick `processing[]`）。

`cancel_all` — 精确 ID 匹配，删除 `processing[]` + `queue[]` + `offline[]` + `paused[]` 中全部匹配项，返回累加计数。

`clear` — 无条件清空所有队列。

#### 暂停与恢复

```mcfunction
function doom.schedule:pause {id:'hello_world'}     # 从 queue 移入 paused
function doom.schedule:resume {id:'hello_world'}     # 从 paused 移回 queue
```

`paused[]` 独立于 `offline[]`，不受 restore 干扰。只处理 `queue[]`，不含本 tick `processing[]`。

#### 快速调度

```mcfunction
function doom.schedule:api/schedule_dynamic {run:'say hi',time:20,unit:'t',prefix:'demo'}
```

以 `prefix` 直接作为 `id`。需要唯一 ID 请直接用 `schedule`。

#### 其他

```mcfunction
function doom.schedule:get_time     # 返回当前 game time
function doom.schedule:__help__      # 聊天栏帮助
```

---

### 扫描模式

`cancel_one`、`pause`、`resume` 共用一种**扫描-重建**模式。以 `cancel_one` 为例：

```mcfunction
# cancel_one.mcfunction (简化)
data modify storage doom.schedule:ctx scan set from storage doom.schedule:data queue
data remove storage doom.schedule:data queue
data modify storage doom.schedule:data queue set value []
$execute if data storage doom.schedule:ctx scan[0] run function doom.schedule:internal/scan/cancel_queue {id:'$(id)'}
```

三步：复制源队列到 `ctx.scan[]` → 清空源队列 → 逐条检查。

`scan/cancel_queue` 对每条任务：

```mcfunction
data modify storage doom.schedule:ctx current set from storage doom.schedule:ctx scan[0]
data remove storage doom.schedule:ctx scan[0]
execute if score #removed doom.schedule matches 1.. run data modify ... queue append ...  # 已找到目标，剩余全部保留
$execute if score #removed doom.schedule matches 0 unless data ... current{id:'$(id)'} run data modify ... queue append ...  # 未找到且不匹配，保留
$execute if score #removed doom.schedule matches 0 if data ... current{id:'$(id)'} run scoreboard players set #removed 1  # 找到匹配，标记移除
$execute if data ... scan[0] run function ... cancel_queue {id:'$(id)'}  # 递归
```

这种模式维持了 FIFO 顺序，代价是 O(n) 复制整个队列。

`cancel_one` 依次扫描 `queue[]` → `offline[]` → `paused[]`，找到第一条即停止。`pause` 扫描 `queue[]` 将匹配任务移入 `paused[]`。`resume` 扫描 `paused[]` 移回 `queue[]`。

### cancel_all 的精确过滤

`cancel_all` 采用完全不同的策略——不扫描，而是用 NBT filter 一步到位：

```mcfunction
$execute store result score #removed_queue doom.schedule run data remove storage doom.schedule:data queue[{id:"$(id)"}]
$execute store result score #removed_offline doom.schedule run data remove storage doom.schedule:data offline[{id:"$(id)"}]
$execute store result score #removed_paused doom.schedule run data remove storage doom.schedule:data paused[{id:"$(id)"}]
$execute store result score #removed_processing doom.schedule run data remove storage doom.schedule:ctx processing[{id:"$(id)"}]
```

`data remove ... [{id:"$(id)"}]` 在 storage 中查找所有 id 匹配的元素并删除，`execute store result score` 捕获实际删除数量。四条队列各一行，累加后返回。这是 NBT filter 的典型应用——查找、删除、计数合为一步。

`clear` 更直接——无条件重置所有队列为空数组。

### 执行路径

任务到期时，`looper_exec` 根据是否有 `by` 字段分散到两条执行路径：

**有目标实体**（`execute/run`）：

```mcfunction
$execute if entity $(by) run scoreboard players set #target_online doom.schedule 1
$execute if score #target_online doom.schedule matches 1 store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) as $(by) at @s run $(run)
```

两阶段：先检测 `$(by)` 在线，仅在线时执行。`store success score #success` 捕获命令执行成功/失败，为 retry 分流提供依据。

注意 `as $(by) at @s` 中的 `at @s` 会覆盖前面的 `positioned` / `rotated`——这意味着有实体目标时，**用实体当前位置执行，忽略入队时保存的坐标**。保存的 `posX/Y/Z` 和 `rotX/Y` 仅在无实体路径（`run_noentity`）中起作用，用于命令方块/控制台下发的调度。

**无目标实体**（`execute/run_noentity`）：

```mcfunction
$execute store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) at @s run $(run)
```

直接在保存的维度、坐标、朝向下执行，不绑定 `@s`。适用于命令方块或控制台下发的调度。

执行后 `looper_exec` 根据 `#target_online`、`#success`、`retry`、`is_player` 的四维组合进行分流决策。这相当于一个在 mcfunction 中实现的状态机，四个布尔值决定 8 条出路的走向。

---

### 性能考虑

核心循环在 `tick.mcfunction` 中运行：

```mcfunction
execute if data storage doom.schedule:data queue[0] run function doom.schedule:internal/looper
execute if data storage doom.schedule:data offline[0] run function doom.schedule:internal/restore
```

`looper` 将整个 `queue[]` 移到 `processing[]`，由 `looper_scan` 递归遍历全部到期任务，不到期的放回队尾。单 tick 执行所有到期任务，而非逐个轮询。离线恢复每 tick 最多 10 个。

入队前自动清理 UUID 临时字段，无 storage 残留。

队列操作（`cancel_one` / `pause` / `resume`）使用扫描模式：复制源队列到 `ctx.scan[]`，清空源队列，逐条检查并决定保留或移出。保持 FIFO 顺序但需复制整个队列。

---

### mcdoc 自动补全

doom.schedule 提供了 3 个 mcdoc 文件支持 Spyglass / Misode's mcdoc 插件的 storage 补全：

| 文件                          | 补全场景                                          |
| --------------------------- | --------------------------------------------- |
| `mcdoc/doom.schedule.mcdoc` | `data modify storage doom.schedule:data ...`  |
|                             | `data modify storage doom.schedule:const ...` |
|                             | `data modify storage doom.schedule:ctx ...`   |

`doom.schedule:data` 补全 `queue[]`、`offline[]`、`paused[]` 中的任务字段（`run`, `time`, `unit`, `id`, `exec_time`, `by`, `dim`, `posX/Y/Z`, `rotX/Y`, `is_player`, `retry`, `retry_delay`, `online`）。

`doom.schedule:const` 补全 `units[]`（name + scale）和 `hex_chars[]`。

`doom.schedule:ctx` 补全 `task`、`processing[]`、`scan[]`、`current`、`unitEntry`、`temp_retry` 等运行时字段。

示例用法见 `function/mcdoc.mcfunction`。安装 mcdoc 插件后，在 `.mcfunction` 中输入：

```mcfunction
data modify storage doom.schedule:data queue append value {run:"say hi",time:20,unit:"t",id:"demo",exec_time:0}
```

输入到 `{` 时会自动提示所有任务字段。

---

### 实践：整合到现有数据包

doom.schedule 的典型用法是替代 `/schedule` 命令，特别是当需要**追踪玩家**时：

```mcfunction
# 代替 scoreboard timer 循环
function doom.schedule:schedule {
  run:'function your_pack:do_something',
  time:2,unit:'t',
  id:'task_$(unique_id)'
}
```

优势：不需占用记分板循环，玩家离线时任务自动冻结，上线自动恢复。

---

### 局限与展望

- **任务数据保存在 storage**：服务端重启后消失。可通过 `data modify` 持久化到文件，但这不是数据包范畴
- **精确度 ±1 tick**：与 game time 对比判断，不会累积漂移，但受单 tick 内执行顺序影响
- **重试机制是同步的**：重试也在同一 tick 链中重新入队，不跳过队列前面的任务
- **`cancel_one` / `pause` 不作用于本 tick 的 `processing[]`**：任务在其 `run` 内调用 `cancel_one` 无效
- **`offline[]` 不接受手动写入**：仅由 `looper_exec` 的离线分流自动管理

与同类方案对比：

| 特性 | bs.schedule | D-Better-Schedule | doom.schedule |
|---|---|---|---|
| 函数数 | ~20 | ~60 | 35 |
| 调度 | `/schedule` fire-once | `#tick` 轮询 | `#tick` 轮询 |
| UUID | 分数 + predicate | `gu` hex → `execute as` | 4int → hex → `execute as $(by)` |
| 离线 | ❌ | ✅ `offline[]` | ✅ `offline[]` + restore |
| 重试 | ❌ | ✅ | ✅ `schedule_with_retry` |
| 暂停 | ❌ | ✅ | ✅ `paused[]` 独立队列 |
| 外部依赖 | 无 | `gu` 库 | 无 |

---

### 相关链接

- [GitHub 仓库](https://github.com/DoomDecapitator/doom.schedule)
