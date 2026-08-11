---
title: 'Starting with /stopwatch: some random thoughts about time detection'
---
<FeatureHead
    title = "Starting with /stopwatch: some random thoughts related to time detection"
    authorName = "leather sword"
    cover='../../../../../feature/archive/202510/_assets/5.png'
/>

## Summary

By comparing the differences between different timing methods in different states, this article provides a solution for time monitoring of behaviors such as player pausing the game, player computer hibernation, and exiting the world.

25w41a latest`/stopwatch`command can create a stopwatch for timing. In actual use, this command has some surprising features, but it also has very frustrating characteristics.

But if you think about it carefully, this instruction does provide a new way of time detection, which can be used in parallel with other methods to complement each other.
Therefore, I think it is time to briefly summarize all the solutions in the data pack that can be used to detect time.

## 1. Timing method
### 1.1 Command system-dependent timing
These timing methods depend on the operation of the command system. These timing methods will stop when the command system is suspended.
#### 1.1.1 Scoreboard auto-increment
This timing method is very simple and straightforward: take a scoreboard item and increment it by 1 every tick after initialization. This increment instruction can be completed by tick function or loop command block.
You can also increment each player separately in the scoreboard. In this case, you can use tag or target selector techniques to complete the filtering of specific player status.
#### 1.1.2 Gametime gametime`gametime`It records the number of game moments that have passed since the game started running. You can use`/time query gametime`Query and return to scoreboard.
### 1.2 Player-dependent timing
These timing methods rely on the player to run. These timing methods will stop when the player is not in the world.
#### 1.2.1 Play time play_time
scoreboard guidelines`minecraft.custom:play_time`Automatically record each player's playing time, accurate to the game moment.
#### 1.2.2 world time total_world_time
scoreboard guidelines`minecraft.custom:total_world_time`Record the actual opening time of the world for that player in each player's scoreboard, accurate to the game moment. To serverplayer this item is always equal to the previous item.
### 1.3 command block time
This approach will inevitably change the world. Place a command block to execute any command, and its output value will return a time, accurate to seconds. You can use string slicing and macros to transfer it to the scoreboard to complete analysis.
### 1.4 stopwatch stopwatch
new version`/stopwatch`The command can create a stopwatch that completes timing with millisecond precision, and can`/execute if stopwatch`Make a match.

~~But the very frustrating thing is that,`/stopwatch query`Always returns 1 to the scoreboard, and this is official intention (see [MC-302701](https://bugs.mojang.com/browse/MC/issues/MC-302701)). ~~
~~Therefore, if we need to get the current time of the stopwatch, we still need to place the command block and get its output value (stored in double form, accurate to milliseconds), so the world will still be changed. ~~

::: tip supplementary note
In the official snapshot version25w42a the day before this article was published,`/stopwatch query`Commands can now return the current time value (an integer) and can be scaled, so it is no longer necessary to obtain the command block output to get a stopwatch reading accurate to milliseconds.
:::

### 1.5 (Supplementary) worldborder timing
Some readers may be curious about the introduction of 25w41a in the official update log.`/stopwatch`Time is`Developer's Note`mentioned everywhere`/worldborder`What does the timing look like.

Since the author has no experience in using related timing methods, the author consulted the giant **[@小豆8593](https://space.bilibili.com/206987540)**, the answer is as follows: (slightly modified)
> world boundaries always expand/contract in milliseconds, use command`/worldborder set &lt;distance&gt; [&lt;time&gt;]`You can control the expansion/shrinking process by using command`/worldborder get`You can get the distance number of the current world boundary.
> Therefore, by appropriately setting the expansion/contraction speed of the world boundary, we can obtain the boundary distance difference between the two operations before and after the difference method, divide it by the speed and convert it into a time difference.
> For example, it takes 1000 seconds to expand the 1,000,000-block world boundary, that is, the expansion speed is **1 block/millisecond** (`/worldborder set 1000000 1000`), the difference between the world boundaries obtained twice before and after is the time difference accurate to milliseconds.
>
> Here is an example:
>

```mcfunction
> #Set the initial position instantly
> worldborder set 1000000 0
> #Start measuring time
> worldborder set 5000000 4000
> #The command context of the test time
> ...
> #restore boundaries
> worldborder set 5000000 0
> 

```
Before 25w41aversion, this timing method was based on real time, that is, its timing interval could be regarded as the same as`/stopwatch`same. But according to`Developer's Note`, in subsequent versions worldborder will run based on the game tick, that is, its timing interval and accuracy will be changed to the same as the command system-dependent timing method.

## 2. Time status
### 2.1 Run the game within seconds
For single-player mode, the running game is not in the tick freeze state and is not in the pause interface. (In single-player mode, except for the pause menu, pause dialog and`F3+Esc`All UI interfaces other than pause will keep the game running. )
For multiplayer or LAN modes, the game will continue to run in the pause interface and the player will be counted as still playing.

In this state, the game itself and the command system will run at the default speed of 20 tick/s, so the above six timing methods all run normally.
### 2.2 Running but not within the game session
This state exists in a server without a player logged in. Player-dependent timing is not available, but other methods are still available.
### 2.3 Played but not within the running time
Use /tick freeze to achieve a game state without a running game. At this time, the command system-dependent timing will be suspended, but since the player is still in the world, all player-dependent timing methods will continue.
### 2.4 The time when the world is neither running nor playing but still open
Pausing the game in single-player mode will enter this state (regardless of tick freeze or not). At this time, the first three timing methods are paused, and the last three are continued.
### 2.5 During burning or computer sleep time
Although the first four timing methods may or may not rely on running game ticks, these methods all rely on non-running game ticks rather than system time for timing.
In other words, when disconnecting in the paused state (the world is still open), none of the first four methods will run.
Computer sleep/hibernation will be recorded as ticks by the server, and the number of ticks may reach tens of thousands or even hundreds of thousands of ticks.

This ticking is registered by the server, and a line of message is printed in the log when it occurs.
### 2.6 Time to close the world or close the game
Since the command block method directly obtains the real time, we can use this to track the time from closing the world to reopening within a 24-hour range. At this time, none of the first five methods are running.
### 2.7 Summary
| Game status | Scoreboard increment |`/time query gametime` | `play_time` | `total_world_time` | `/stopwatch`| command block |
| - | - | - | - | - | - | - |
| Single player mode runs normally | √ | √ | √ | √ | √ | √ |
| Pause the game in single player mode |||| √ | √ | √ |
| In single player mode`/tick freeze`||| √ | √ | √ | √ |
| Multiplayer mode runs normally (with player) | √ | √ | √ | √ | √ | √ |
| Multiplayer mode player enters pause menu | √ | √ | √ | √ | √ | √ |
| Multiplayer mode runs normally (no player) ||||| √ | √ |
| Erase or computer hibernate ||||| √ | √ |
| Exit world |||||| √ |
## 3. Time comparison
Based on the above conclusions, we can use the differences between different timing methods to track some time periods that are difficult to reach by the command system itself.
### 3.1 Single player mode player paused
The total duration of the paused game in single-player mode can be determined by the still-running timing method (e.g.`total_world_time`or`/stopwatch`) tracking, the first three timing methods will not run at this time. Therefore, the duration of the pause can be determined by simply comparing the differences between the first three timing methods and the last three timing methods during a specific period. The sample code is as follows:

```mcfunction
#initialization (load)
scoreboard objectives add test0 minecraft.custom:total_world_time
scoreboard objectives add test1 minecraft.custom:play_time
scoreboard objectives add test00 dummy
scoreboard objectives add test11 dummy
scoreboard objectives add test01 dummy

#Executed every tick at the player
scoreboard players operation @s test01 = @s test0
scoreboard players operation @s test01 -= @s test00
scoreboard players operation @s test01 -= @s test1
scoreboard players operation @s test01 += @s test11

scoreboard players operation @s test00 = @s test0
scoreboard players operation @s test11 = @s test1
```
After running, when the single-player mode game is paused, the player's test01 scoreboard value will store its pause duration in ticks. (Always 0 when not paused)

Of course, you can also reset it every time the command system is run.`stopwatch`to detect this difference, but it is not very convenient to operate.
### 3.2 Single-player mode player computer sleep/hibernation
The difference between computer hibernation and game suspension is reflected in`total_world_time`on the scoreboard. Therefore, we can compare`total_world_time`Timing method and`stopwatch`The difference in timing methods determines how long the computer will sleep.

Due to the aforementioned reasons,`stopwatch`The timing method requires placing a command block to obtain the corresponding time, which is a little troublesome. No sample code is provided here.
### 3.3 Re-enter the world within 24 hours
By continuously detecting the command block time, we can obtain the specific time when the world is not open. In order to avoid interference when the command system is not running, we will compare the time difference with`stopwatch`Compare the timing method. At this time, you can directly merge the two and execute them in a loop command block (the command block continues to execute`/stopwatch query`, the data required for both timing methods can be obtained at the output position at the same time).

Of course, since this method can only return time but not date, this method will also cause errors when the world is closed for more than 24 hours.
## 4. Summary
The author is really not sure what kind of maps/requirements would require detecting the time when the player sleeps or exits the world, but since this possibility exists, it can be considered as providing you with an inspiration.