---
title: 'doom.schedule - vanilla server scheduler'
---

<FeatureHead
    title="doom.schedule - vanilla server-side scheduler"
    authorName="doom_decapitator"
    resourceLink = 'https://github.com/DoomDecapitator/doom.schedule'/>



- [Pre-store](https://vanillalibrary.mcfpp.top/datapack-index/wheel/resources/doom.schedule.html)
- [GitHub](https://github.com/DoomDecapitator/doom.schedule)

> Have you ever encountered: all scheduled tasks disappeared after the server restarted, tasks were not executed after the player went offline, and there was no chance to retry after the scheduling failed...`/schedule`The limitations don't stop there. doom.schedule uses four queues, UUID positioning and offline recovery to make up for all these shortcomings - pure data pack, zero dependencies.

### Doom_Flare

doom.schedule is a data pack scheduling framework for the Minecraft vanilla server. It provides features such as game time-based task queue, execution context freezing, target offline detection and automatic recovery, and failure retry without relying on Mods.

---

### from`/schedule`Speaking of the limitations of

vanillacommand`/schedule function`Provides the most basic delayed call. It is sufficient in simple machinery or small-scale scenarios - but when it comes to persistence, cross-dimension execution, and player-oriented logic, its shortcomings will be quickly exposed:

- **No persistence**: All schedules to be executed disappear after the server is restarted.
- **NO TARGET TRACKING**:`/schedule`Only one function name can be remembered and cannot be associated with the player or entity during execution.
- **No context**: The entity may be offline or replaced during execution, so there is no way to judge.
- **No Cancellation or Suspension**: Once issued it cannot be revoked
- **No Retry**: Failure to execute is a failure

The goal of doom.schedule is to fill these gaps and provide a task scheduling system that is durable, trackable, and manageable. It's completely built into the data pack, no external tools or mods required.

---

### Core Design

doom.schedule uses **game time** as the time base to organize tasks into a first-in, first-out queue. Each task records the expected execution time when it is added to the queue. The tick loop traverses all expired tasks and executes them when they expire.

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
The data structure of each task is as follows:

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


`exec_time`is the reason for joining the team`get_time`plus`time`Target game time converted (multiplied by unit.scale). tick in loop`looper_scan`Compare`exec_time`With the current game time, it will be executed when it expires.

---

### Detailed explanation of the process of joining the team`schedule`The execution path of a function is the entrance to understanding the entire system. It receives as macro argument`{run, time, unit, id}`, and then complete the following process:

#### 1. Unit legality verification

```
mcfunction
$data modify storage doom.schedule:ctx _.unitEntry set from storage doom.schedule:const units[{name:'$(unit)'}]
execute unless data storage doom.schedule:ctx _.unitEntry run return fail
```
Will pass in the unit name (such as`"s"`) and constant table`const.units`match. If no match is found, directly`return fail`. This lookup table is in`__load__`Medium initialization:

```json
[
  {name:"t", scale:1},       {name:"tick", scale:1},
  {name:"s", scale:20},      {name:"second", scale:20},
  {name:"m", scale:1200},    {name:"minute", scale:1200},
  {name:"h", scale:72000},   {name:"hour", scale:72000},
  {name:"d", scale:1728000}, {name:"day", scale:1728000}
]
```
Why not use if-else chains? The storage filter is an O(1) hash search, and adding a new unit only requires`const.units[]`Add a record without changing the function.

#### 2. Delayed calculation

```mcfunction
#Extract the magnification corresponding to unit
execute store result score #scale doom.schedule run data get storage doom.schedule:ctx _.unitEntry.scale
#Calculate delay = time × scale
execute if score #scale doom.schedule matches 1.. store result score #delay doom.schedule run data get storage doom.schedule:ctx _.time
execute if score #scale doom.schedule matches 1.. run scoreboard players operation #delay doom.schedule *= #scale doom.schedule
```


`time × unit.scale`Get tick-level latency.

#### 3. Context Freeze

```mcfunction
function doom.schedule:internal/schedule/context
```
read`@s`UUID, dimension, location, orientation, stored`ctx._`. UUID is concatenated into a string through 4 int → 16 byte → 16 hex →. Dimension reads entity NBT first`Dimension`, if it fails, fallback to`execute if dimension`Detect Mihara dimension, and if it fails, use`known_dimensions`functiontag.

#### 4. Execution time

```mcfunction
execute store result score #time doom.schedule run function doom.schedule:get_time
scoreboard players operation #time doom.schedule += #delay doom.schedule
execute store result storage doom.schedule:ctx _.exec_time int 1 run scoreboard players get #time doom.schedule
```


`game_time + delay = exec_time`. After joining the team`looper_scan`Compare at every tick`game_time >= exec_time`, decide whether to execute.

#### 5. Retry parameter transparent transmission`schedule_with_retry`Instead of repeating the enqueuing logic, temporarily store the retry parameter`ctx.temp_retry`, then call`schedule`：

```mcfunction
$data modify storage doom.schedule:ctx temp_retry set value {retry:$(retry),retry_delay:$(retry_delay)}
$function doom.schedule:schedule {run:'$(run)',time:$(time),unit:'$(unit)',id:'$(id)'}
```


`schedule`After calculating`exec_time`post-test`temp_retry`Does it exist? If it exists, transfer to`_.retry` / `_.retry_delay`, then delete`temp_retry`. This is a **parameter transfer mode between macros**——`schedule_with_retry`preprocessing,`schedule`Consumption.

#### 6. Cleaning and joining the team

```mcfunction
function doom.schedule:internal/cleanup_temp
data modify storage doom.schedule:data queue append from storage doom.schedule:ctx _
data remove storage doom.schedule:ctx _
```


`cleanup_temp`delete`ctx._`All UUID intermediate fields (b0..bf, h0..hf, uuid0..uuid3) in the queue ensure that the queued tasks do not contain transient data. Then add the clean task`append`arrive`data.queue[]`, and finally delete`ctx._`.

---

### looper_exec shunt`looper_exec`Separate target detection and command execution into two stages,`looper_exec`Internally cleared`#target_online`and`#success`, and then process it by path:

```mcfunction
#Check if the target is online
scoreboard players set #target_online doom.schedule 0
$execute if entity $(by) run scoreboard players set #target_online doom.schedule 1

#Only execute when online and record success
$execute if score #target_online doom.schedule matches 1 store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) as $(by) at @s run $(run)
```
Diversion decision:

| path |`#target_online` | `#success`| Yes`retry` | `is_player`| Results |
|---|---|---|---|---|---|
| Yes`by`| 0 | — | — | true | move in`offline[]`|
| Yes`by`| 0 | — | — | false | Silently discard |
| Yes`by`| 1 | 1 | — | — | complete, discard |
| Yes`by` | 1 | 0 | true | — | `retry`Decrease, re-enqueue |
| Yes`by`| 1 | 0 | false | true | move in`offline[]`|
| Yes`by`| 1 | 0 | false | false | discard |
| None`by`| — | 0 | true | — | Retry |
| None`by`| — | 0 | false | — | discard |

None`by`Path consists of`internal/execute/run_noentity`Processing, the command is only executed under the saved dimension/coordinate/orientation, and the executor is not bound.

This separation solves the ambiguity of the old version: the old version could not distinguish between "target offline" and "target online but command execution failed", both of which would trigger a retry or offline.

---

### Four queue architecture

The system maintains four parallel queues, each with different responsibilities:

| Queue | Purpose | Dequeue mechanism |
|------|------|---------|
|`data.queue[]`| Tasks waiting for scheduling (FIFO) | Move in as a whole every tick`processing[]` |
| `ctx.processing[]`| Tasks being processed at the current tick |`looper_scan`Check items one by one, execute when expired/return if not expired queue |
|`data.offline[]`| Tasks frozen when player is offline |`restore`Recover up to 10 per tick |
|`data.paused[]`| Tasks paused manually by the user | Only`resume`Manual recovery |

**tick loop**(`tick.mcfunction`）：

```mcfunction
execute if data storage doom.schedule:data queue[0] run function doom.schedule:internal/looper
scoreboard players set #restore_count doom.schedule 0
execute if data storage doom.schedule:data offline[0] run function doom.schedule:internal/restore
```


`looper`will the entire`queue[]`Move to`processing[]`and clear the queue, followed by`looper_scan`Process each task recursively. The purpose of this design is: if a new schedule (enqueue) is generated during the execution of an expired task, it will not cause the queue of the current tick to expand infinitely.`looper_scan`Each step of:

```mcfunction
data modify storage doom.schedule:ctx task set from storage doom.schedule:ctx processing[0]
data remove storage doom.schedule:ctx processing[0]
execute store result score #exec_now doom.schedule run data get storage doom.schedule:ctx task.exec_time
execute if score #time_now doom.schedule >= #exec_now doom.schedule run function doom.schedule:internal/looper_exec
execute unless score #time_now doom.schedule >= #exec_now doom.schedule run data modify storage doom.schedule:data queue append from storage doom.schedule:ctx task
```
Expiration →`looper_exec`(Execute + Triage). Not expired → put back`queue[]`. Regardless of whether it is due or not,`processing[]`Delete this entry. when`processing[]`The recursion ends when it is empty,`looper`at the end`data remove storage doom.schedule:ctx processing`Clean empty arrays.

**Transfer between queues**:

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

### Offline recovery

If the target is offline, the task is moved to`offline[]`queue. per tick`restore`function scans at a rate of up to 10`offline[]`：

```mcfunction
#doom.schedule:internal/restore — Restore offline tasks every tick
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


`#restore_count`Increasing from 0,`matches ..9`A total of 10 recursions from 0 to 9 are allowed.

---

### Retry mechanism

When command execution fails (`#success = 0`), and the task is defined`retry`and`retry_delay`When, enter the retry process:

```mcfunction
#doom.schedule:internal/retry — retry logic
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


`retry`Represents the number of additional attempts (`retry:3`=Try 3 more times after failure, for a total of 4 executions).`retry_delay`Default is 1, ≤0 is automatically corrected to 1. Output a warning and discard the task when exhausted.

---

### Context Freeze

Freeze execution context when enqueuing: current dimension, coordinate, orientation, executor UUID. UUID passed`UUID[0..3]`Read 4 ints, decompose them byte by byte, look up the table and concatenate them into a hex string:

```mcfunction
#doom.schedule:internal/schedule/context — freeze context
execute if entity @s store result storage doom.schedule:ctx _.uuid0 int 1 run data get entity @s UUID[0]
execute if entity @s store result storage doom.schedule:ctx _.uuid1 int 1 run data get entity @s UUID[1]
execute if entity @s store result storage doom.schedule:ctx _.uuid2 int 1 run data get entity @s UUID[2]
execute if entity @s store result storage doom.schedule:ctx _.uuid3 int 1 run data get entity @s UUID[3]
execute if entity @s[type=player] run data modify storage doom.schedule:ctx _.is_player set value 1b
execute if entity @s run function doom.schedule:internal/schedule/uuid_hex
execute if data storage doom.schedule:ctx _.b0 run function doom.schedule:internal/schedule/uuid_join with storage doom.schedule:ctx _
```


`uuid_hex`Break 4 ints into 16 bytes (b0..bf),`uuid_join`Hongcha`hex_chars[]`Get 16 hex pairs,`uuid_concat`Macros are concatenated into UUID strings:

```mcfunction
$data modify storage doom.schedule:ctx _.by set value "$(h3)$(h2)$(h1)$(h0)-$(h7)$(h6)-$(h5)$(h4)-$(hb)$(ha)-$(h9)$(h8)$(hf)$(he)$(hd)$(hc)"
```
::: tip note`uuid_hex`There is a negative value overflow fix. when`#byte`When negative, except the correction`#byte`（`add 256`), it also needs to be corrected`#temp`（`remove 1`), otherwise subsequent divisions are offset by 1:

```mcfunction
execute if score #byte doom.schedule matches ..-1 run scoreboard players remove #temp doom.schedule 1
execute if score #byte doom.schedule matches ..-1 run scoreboard players add #byte doom.schedule 256
```
:::

After joining the queue, all UUID intermediate fields (b0..bf, h0..hf, uuid0..uuid3) are automatically cleaned, and no storage remains.

**dimension scheme:**

| Level | Detection method | Scope of application |
|---|---|---|
| entitydimension |`data get entity @s Dimension`| All entities - automatically support any dimension |
| dim_scan |`execute if dimension`| 3 native dimension, used for entityless executors |
|`known_dimensions`tag | functiontag | user-defined dimension |

Entity scheduling automatically supports any dimension. Only command block/console scheduling requires manual registration of custom dimensions:

```
mcfunction
#Detect custom dimensions
execute if dimension mymod:void run data modify storage doom.schedule:ctx _.dim set value "mymod:void"
```


```
json
// data/doom.schedule/tags/function/known_dimensions.json
{"values": ["your_datapack:detect_void"]}
```
---

### API Reference

All APIs are functions and support macro parameters. remove`schedule_dynamic`exist`api/`below, and the rest are at the root level.

#### Basic Scheduling

```
mcfunction
function doom.schedule:schedule {run:'say hello',time:5,unit:'s',id:'hello_world'}
```
| Parameters | Type | Required | Description |
|---|---|---|---|
|`run`| string | ✅ | executed command |
|`time`| int | ✅ | Delay value |
|`unit`| string | ✅ | Unit:`t`/`tick`、`s`/`second`、`m`/`minute`、`h`/`hour`、`d`/`day` |
| `id`| string | ✅ | Task identifier, used to cancel/pause/resume |

Invalid unit will report an error and`return fail`.

#### With retry

```
mcfunction
function doom.schedule:schedule_with_retry {run:'say hi',time:20,unit:'t',id:'rt',retry:3,retry_delay:5}
```


`retry`— Number of additional attempts (3 = maximum 4 executions).`retry_delay`— Retry interval tick (≤0 automatically corrected to 1).

#### Cancel

```
mcfunction
function doom.schedule:cancel_one {id:'hello_world'}    #recommend
function doom.schedule:cancel_all {id:'group_a'}         #Cancel all
function doom.schedule:clear                              #Clear all
```


`cancel_one`- according to`queue[]` → `offline[]` → `paused[]`Scan sequentially, delete only the first match (excluding this tick`processing[]`）。

`cancel_all`— Exact ID match, delete`processing[]` + `queue[]` + `offline[]` + `paused[]`All matching items in , return the cumulative count.`clear`— Clear all queues unconditionally.

#### Pause and resume

```
mcfunction
function doom.schedule:pause {id:'hello_world'}     #move from queue into paused
function doom.schedule:resume {id:'hello_world'}     #Move back to queue from paused
```


`paused[]`independent from`offline[]`, not interfered by restore. only handle`queue[]`, excluding this tick`processing[]`.

#### Quick scheduling

```
mcfunction
function doom.schedule:api/schedule_dynamic {run:'say hi',time:20,unit:'t',prefix:'demo'}
```
by`prefix`directly as`id`. If you need a unique ID, please use it directly.`schedule`.

#### other

```
mcfunction
function doom.schedule:get_time     #Return current game time
function doom.schedule:__help__      #Chat bar help
```
---

### Scan mode`cancel_one`、`pause`、`resume`Share a **Scan-Rebuild** mode. by`cancel_one`For example:

```
mcfunction
#cancel_one.mcfunction (simplified)
data modify storage doom.schedule:ctx scan set from storage doom.schedule:data queue
data remove storage doom.schedule:data queue
data modify storage doom.schedule:data queue set value []
$execute if data storage doom.schedule:ctx scan[0] run function doom.schedule:internal/scan/cancel_queue {id:'$(id)'}
```
Step 3: Copy the source queue to`ctx.scan[]`→ Clear the source queue → Check each item.`scan/cancel_queue`For each task:

```mcfunction
data modify storage doom.schedule:ctx current set from storage doom.schedule:ctx scan[0]
data remove storage doom.schedule:ctx scan[0]
execute if score #removed doom.schedule matches 1.. run data modify ... queue append ... # The target has been found, and all the rest are retained
$execute if score #removed doom.schedule matches 0 unless data ... current{id:'$(id)'} run data modify ... queue append ... # Not found and does not match, retained
$execute if score #removed doom.schedule matches 0 if data ... current{id:'$(id)'} run scoreboard players set #removed 1 # Match found, mark removed
$execute if data ... scan[0] run function ... cancel_queue {id:'$(id)'}  #recursion
```
This mode maintains FIFO order at the cost of O(n) copying the entire queue.`cancel_one`Scan in sequence`queue[]` → `offline[]` → `paused[]`, it will stop when it finds the first one.`pause`scanning`queue[]`Move matching tasks into`paused[]`。`resume`scanning`paused[]`move back`queue[]`.

### Exact filtering of cancel_all`cancel_all`Adopt a completely different strategy - don't scan, but use NBT filter to get it right in one step:

```mcfunction
$execute store result score #removed_queue doom.schedule run data remove storage doom.schedule:data queue[{id:"$(id)"}]
$execute store result score #removed_offline doom.schedule run data remove storage doom.schedule:data offline[{id:"$(id)"}]
$execute store result score #removed_paused doom.schedule run data remove storage doom.schedule:data paused[{id:"$(id)"}]
$execute store result score #removed_processing doom.schedule run data remove storage doom.schedule:ctx processing[{id:"$(id)"}]
```


`data remove ... [{id:"$(id)"}]`Find all elements matching id in storage and delete them,`execute store result score`Capture the actual number of deletions. Each of the four queues has one line, and is returned after accumulation. This is a typical application of NBT filter - search, delete and count in one step.`clear`More directly - unconditionally reset all queues to empty arrays.

### Execution path

When the task is due,`looper_exec`According to whether there is`by`The fields are scattered into two execution paths:

**has target entity**(`execute/run`）：

```mcfunction
$execute if entity $(by) run scoreboard players set #target_online doom.schedule 1
$execute if score #target_online doom.schedule matches 1 store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) as $(by) at @s run $(run)
```
Two stages: detect first`$(by)`Online, only executed when online.`store success score #success`Capture command execution success/failure to provide a basis for retry diversion.

Notice`as $(by) at @s`in`at @s`will cover the previous`positioned` / `rotated`——This means that when there is an entity target, the current position of the entity is used for execution, and the coordinate saved when joining the queue is ignored. saved`posX/Y/Z`and`rotX/Y`Only if there is no entity path (`run_noentity`), used for scheduling issued by command block/console.

**No target entity**(`execute/run_noentity`）：

```mcfunction
$execute store success score #success doom.schedule in $(dim) positioned $(posX) $(posY) $(posZ) rotated $(rotX) $(rotY) at @s run $(run)
```
Execute directly under the saved dimension, coordinate, and orientation without binding.`@s`. Suitable for scheduling issued by command block or console.

after execution`looper_exec`according to`#target_online`、`#success`、`retry`、`is_player`The four-dimensional combination is used to make diversion decisions. This is equivalent to a state machine implemented in mcfunction, with four Boolean values ​​​​determining the direction of the 8 exits.

---

### Performance considerations

The core loop is in`tick.mcfunction`Running in:

```mcfunction
execute if data storage doom.schedule:data queue[0] run function doom.schedule:internal/looper
execute if data storage doom.schedule:data offline[0] run function doom.schedule:internal/restore
```


`looper`will the entire`queue[]`move to`processing[]`,Depend on`looper_scan`Recursively traverse all expired tasks and put those that have not expired at the end of the queue. Execute all due tasks in a single tick instead of polling one by one. Offline recovery is limited to 10 per tick.

The UUID temporary field is automatically cleared before joining the queue, leaving no storage residue.

Queue operations (`cancel_one` / `pause` / `resume`) using scan mode: copy the source queue to`ctx.scan[]`, clear the source queue, check each item one by one and decide to keep or remove it. Maintain FIFO order but copy the entire queue.

---

### mcdoc auto-completion

doom.schedule provides 3 mcdoc files to support storage completion of Spyglass / Misode's mcdoc plug-in:

| File | Completion Scene |
|--------------------------------|------------------------------------------------|
|`mcdoc/doom.schedule.mcdoc` | `data modify storage doom.schedule:data ...`  |
|                             | `data modify storage doom.schedule:const ...` |
|                             | `data modify storage doom.schedule:ctx ...`   |

`doom.schedule:data`Complete`queue[]`、`offline[]`、`paused[]`Task field in (`run`, `time`, `unit`, `id`, `exec_time`, `by`, `dim`, `posX/Y/Z`, `rotX/Y`, `is_player`, `retry`, `retry_delay`, `online`）。

`doom.schedule:const`Complete`units[]`(name + scale) and`hex_chars[]`。

`doom.schedule:ctx`Complete`task`、`processing[]`、`scan[]`、`current`、`unitEntry`、`temp_retry`Wait for runtime fields.

For example usage see`function/mcdoc.mcfunction`. After installing the mcdoc plug-in, in`.mcfunction`Enter:

```mcfunction
data modify storage doom.schedule:data queue append value {run:"say hi",time:20,unit:"t",id:"demo",exec_time:0}
```
input to`{`All task fields will be automatically prompted.

---

### Practice: Integrate into existing data pack

Typical usage of doom.schedule is to replace`/schedule`command, especially when you need to track the player:

```mcfunction
#Instead of scoreboard timer loop
function doom.schedule:schedule {
  run:'function your_pack:do_something',
  time:2,unit:'t',
  id:'task_$(unique_id)'
}
```
Advantages: No need to occupy the scoreboard loop, tasks are automatically frozen when the player is offline, and automatically restored when online.

---

### Limitations and prospects

- **Task data is saved in storage**: It disappears after the server restarts. Passable`data modify`Persistence to file, but this is not the scope of data pack
- **Accuracy ±1 tick**: compared with game time, no drift will accumulate, but will be affected by the execution order within a single tick
- **The retry mechanism is synchronous**: retries are also requeued in the same tick chain, without skipping tasks in front of the queue
- **`cancel_one` / `pause`Does not apply to this tick`processing[]`**: The task is in it`run`call within`cancel_one`Invalid
- **`offline[]`Manual writes are not accepted**: only by`looper_exec`Automatic management of offline offloading

Compare with similar solutions:

| Features | bs.schedule | D-Better-Schedule | doom.schedule |
|---|---|---|---|
| Number of functions | ~20 | ~60 | 35 |
| Scheduling |`/schedule` fire-once | `#tick`Poll |`#tick`Poll |
| UUID | score + predicate |`gu` hex → `execute as` | 4int → hex → `execute as $(by)`|
| Offline | ❌ | ✅`offline[]` | ✅ `offline[]`+ restore |
| Try again | ❌ | ✅ | ✅`schedule_with_retry`|
| Pause | ❌ | ✅ | ✅`paused[]`Independent Queue |
| External dependencies | None |`gu`Library | None |

---

### Related links

- [GitHub repository](https://github.com/DoomDecapitator/doom.schedule)
