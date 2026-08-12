---
title: 'Development sharing of Void Data Core "Retrieval Dog" module'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeatureHead
    title = "Development sharing of Void Data Core &quot;Retrieval Dog&quot; module"
    authorName = "Rainbow_"
    cover='../../../../../feature/archive/202509/_assets/4.jpg'
/>

## summary

A monitoring and retrieval module developed to prevent entity loss.
Random thoughts about tick crossing and some features.
I discovered the method of finding the uninstalled entity through execute on origin and conducted a simple test.
The test results are: the entity that was uninstalled five minutes ago can be found at least five minutes ago. The origin cannot be changed when the entity has been uninstalled, and can only be locked in advance.

## Preface

During the development of data pack, pigeons are always worried that their world entity will be lost accidentally. For example, batch cleaning by the administrator's kill may cause tp to some unloaded chunk due to coin minting operation. For example, after the entity follows the player into a certain chunk, it is unloaded because the player leaves.

The entity accidentally enters an unloaded chunk and cannot be found and summoned. The Dove Institute calls it a "chunk security issue" or "leakage issue."

If it was just deleted, that's okay, just summon it again. However, if it is TPed to an unloaded chunk, it will be difficult to retrieve it, and it cannot be summoned due to duplicate UUIDs. The entire system will face the threat of vicious bugs.

(Although it is possible to reset the UUID table by retreating, allowing resummoning)

To this end, I wrote the "Retrieval Dog" module for my front-end "Void Data Core" to monitor and retrieve important entities. Including but not limited to world entities, entities that store important information, special NPCs, pets, etc.

## Usage tutorial and function introduction

#### Monitor mark function (view rape function)

Let the monitored entity perform the following functions to make it monitored.

```mcfunction
function vdc:built_in/retriever/_monitor
```


The monitored entity and coordinate information (excluding dimension) will be continuously recorded in the scoreboard. However, only tracking cannot detect sudden coordinate changes. It needs to be used in conjunction with the following function.

This function creates a random id /* scb(xid) */ for the executor, transcribes its UUID array into a score entry, and maintains a mapping table of array UUIDs and hexadecimal string UUIDs.

The mapping table looks like

```txt
storage vdc:sys retriever[{array:[I;0,0,0,1] ,str:"0-0-0-0-1"}]
```


#### Pathological rape function

#### Monitor function

With just a little extra performance, your target can get more powerful ~~>!viewing!<surveillance~~ care.

Let the monitored object execute

```mcfunction
function vdc:built_in/retriever/_watcher.creating
```


You can create a dedicated monitor. This is an ender pearl located at the coordinate origin.

When the monitor detects that the target is lost, an emergency plan will be executed.

You can modify the emergency plan by changing the target's vdc.rtvr.plan plan before executing this function.

Different values ​​correspond to different plans.

0. [NULL]
- Default scheme, destroy the monitor after recording the last coordinate.
1. [1]
- Force loading. This plan will force loading the chunk when the entity enters an unloaded chunk.
// If the entity is flying around, a lot of chunks may be forced to be loaded. Fortunately, it will also record which chunks have been temporarily force-loaded for easy cleaning.
2. [-1]
- Execute dynamic command. For example, returning the entity tp to the birth point.
// To execute a dynamic command, the command needs to be recorded in the mapping table.
// If you just marked this entity, the path is storage vdc:sys retriever-map[-1].cmd.
//The executor is the monitoring target, and the execution coordinate is the world birth point.
3. [-2]
- Same as above, but the monitor will be destroyed after executing the dynamic command.

#### Retrieval function

Provide the target's UUID array, execution mode and other parameters, and then this function will force load the chunk where the target is located.

Write the parameters in the path storage_import, and then execute the command. After a few seconds, the chunk is loaded and the target can be found.

The parameters are in the form

```txt
storage _ import{target:[I;0,0,0,1], mode:0, cmd:"say coo-co cola"}
```


Mode code corresponding operations:

0. [0]
- Retrieve only (unload the chunk as soon as it is found)
1. [1]
- Retrieve and execute dynamic commands
2. [2]
- Retrieve, execute dynamic command without unloading chunk.

## Behind the scenes gossip

### Retrieval function and cross-tick operation

When writing data pack, occasionally you will encounter operations that need to be performed across ticks.

After an update, /forceload is no longer an immediate operation. That is, the version where ender pearls can load chunks.

At the same time, the operations that need to be performed may often be in parallel, such as finding and replying to several entities at the same time.

However, after crossing ticks, saving not only the executor and other contexts is a troublesome matter. How to pass the command that is decided to be executed after a few ticks after going through many judgments? In older versions, the command block is used to execute dynamic commands. However, the modification and triggering of the command block itself is a cross-tick (or cross-main loop) operation. Earlier versions could only pass some signals and then judge them one by one.

Now, all you need to do is create a function and pass the command. You just need to write in it`$$(cmd)`, you can convert the string into command for execution.

In short, my approach is to continue the form of the task system written before, and write the executor, execution mode, ID, dynamic command and other parameters into a table. This is a composite tag list, or in mcfpp parlance, a map.

The **loading time of chunks is not fixed** (depends on server performance, generally spans 1,2 ticks.), so unlike the task system as an enhanced version of schedule, each row of the table here needs to be executed once to check whether the corresponding chunk is loaded. A simple recursion.

Forgive me for not keeping up with the times. The last pitfall I finished writing was meow in 1.20.2, so here I would like to express my feelings again. Return can disconnect the function in the middle, which reduces the execution amount by half. It is so beautiful.

### Timing and monitor and grabbing entities outside the world

Originally, I ran out of ideas when it came to the retrieval function, so I called it a day. But it was unable to effectively solve the leakage problem, and the value was reduced by more than half. But when I was facing a deadline, I suddenly thought, can I use the "execution function" effect of a custom spell to pull the entity back after the #tick function as the main process and before the chunk is uninstalled? After all, we know that the tick function is always executed at the beginning of each moment. In the past, entities outside the chunk could not be captured, mainly because only @s could select non-player entities outside the world. How about letting the entity execute the function by itself through the magic spell, and then use @s to select the entity to catch it back in such a subtle time difference outside the main process after the misoperation and before the chunk is unloaded?

I tried it when I thought of it, and then found that it didn’t work. Maybe it's because the loading level after going beyond the world is too low, the entity is not calculated, and the spell is executed when the entity is calculated; maybe the chunk is unloaded before the calculation. Then I tried again to see if Schedule could adjust the time difference, but found that it couldn't either. So I thought again, if the owner of the ender pearl is changed to the target entity, can I bring the entity back when it lands and triggers? Nope either.

Just when I was about to give up, I suddenly found that the wither used for testing was ** after tp for the first time and was ** after tp came back.

At first I thought it was due to a magic spell or schedule. After testing for a while, I found that **on origin can capture the entity outside the chunk**! After testing for a while, I found that even after five minutes, the target entity can still be found. The origin of the dropped object entity is also acceptable, but it is also acceptable if it is not wither. However, it is too late to change the Owner or Thrower after the entity is moved outside the chunk. **You cannot specify the entity after the leak**. In addition, it will not work after a big exit (restarting the server).

In short, I found a way to bring entities outside the world back into the world outside of time. (However, dimension security issues were not tested.) The only problem is that an entity needs to be reserved to specifically monitor the target, which increases the performance burden. This is one of the reasons why I specially set up the "monitor" entity and set it to not be enabled by default.

But if you want to add additional entities, then directly letting **Ender Pearl Ride** on the entities can solve the problem, and there is no need to make complicated judgments. This is also one of my ideas, that is, monitor.sick is a pathological rape mode. Although this mode has been written, it has not been tested yet, and there is no interface left. (Although it is just a matter of adding a tag add vdc.rtvr.monit.sick to the ordinary _monitorfunction.)

Another option is to use entities such as dropped objects that naturally exist in the world to monitor targets, and add dedicated monitors when the natural entities are insufficient. Because this solution may pollute the normal game process (such as the announcement and statistical errors when killing with a bow and arrow.), the function name is watching.dirty. It is done using drops with relatively minimal impact.

In fact, this was the plan I wrote at the beginning, but I didn’t put it into testing in the end, which was a bit lazy. After all, the core features and functions have been written, and these optimizations are just minutiae.

## other

This is the first time to submit a Feature. It has been four months since I agreed to submit the article before the first issue came out.

If there are readers who have come across the workshop forum from the Vanilla Library, I hope you won’t hit me because you found it through the article link above and found that it was half-written, just like that (run away)

