---
title: 'Fast Motion'
---

<FeatureHead
    title="Fast Motion"
    authorName="Cree who can’t draw"
    cover = '../../../../../feature/archive/202605/_assets/5_cover.png'
/>

This is a data pack that allows you to more easily assign speed to the player. It supports Minecraft Java version 1.21.11 and above.
[Click to download data pack](https://pan.baidu.com/s/1ELnB5z4DatqJK8mFGImNJg?pwd=Cree)

::: warning Defects in this data pack
There is an error in the speed assigned, and the error value is scattered within -0.001~0.001.
Limited by the author's ability, this data pack is not optimized and has poor performance.
:::

## Usage
We can give the player speed by performing the following two functions.

```mcfunction
function motion:apply_arguments
function motion:apply_scoreboard
```
When the data pack executes these two functions, it will give the executor the speed of pointing in the three directions of right left, right up, and right in front of the execution direction (the executor must be a player).

Therefore, we need to use`/function`When the command executes these two functions, it passes in two sets of parameters: **execution direction** and **velocity in each direction**.
### Execution direction
The execution direction is passed directly through the command context.

Example:
Give a player the speed of pointing in three directions: directly left, directly up, and directly in front of him.

```mcfunction
execute as @r at @s run function motion:apply_arguments {x:100,y:100,z:100}
```
Give a player the speed of pointing in the three directions of due east, due up, and due south of the world.

```mcfunction
execute as @r rotated 0 0 run function motion:apply_arguments {x:100,y:100,z:100}
```
### Velocity in each direction
The unit of speed is **frame per tick**, and its input has the following regulations:
- The range is -10000~10000
- must be an integer
- Must be 1000 times the actual output speed

The passing method needs to be determined based on the difference between the two functions.
#### motion:apply_arguments
For motion:apply_argumentsfunction, we need to use`/function`The command passes in a composite tag to pass in the speed in each direction.
The content of the composite tag is as follows:

<div class=nbttree>

<node type="compound" name="" required=true></node>
- <node type="int" name="x" required=true></node> points to the speed of execution towards the direct left.
- <node type="int" name="y" required=true></node> points to the speed of the execution direction directly upward.
- <node type="int" name="z" required=true></node> points to the speed of execution heading straight ahead.

</div>

::: warning note
The speed in three directions cannot be omitted. If you do not need to give the axis speed, please set its size to 0.
:::

Example:
Give a player a speed of 0.1 squares per tick pointing directly below the world.

```
mcfunction
execute as @r rotated 0 0 run function motion:apply_arguments {x:0,y:-100,z:0}
```
#### motion:apply_scoreboard
For motion:apply_scoreboardfunction, we need to pass in the speed in each direction by setting the scores of the following three scoreboards of the executor:

    motion.x
    motion.y
    motion.z
They respectively represent the speeds pointing directly to the left, directly up, and directly forward of the execution direction.

::: tip tip
The scoreboard with no score set will automatically be regarded as 0 points, that is, the speed size is 0.
:::

Example:
Give each player a speed of 5.085 squares per tick pointing directly below the world.

```
mcfunction
scoreboard players set @a motion.z -5085
execute as @a rotated 0 0 run function motion:apply_scoreboard
```
Modify each player's Motiontag roughly to [0.9d,-4.0d,3.0d].

```mcfunction
scoreboard players set @a motion.x 900
scoreboard players set @a motion.y -4000
scoreboard players set @a motion.z 3000
execute as @a rotated 0 0 run function motion:apply_scoreboard
```
---

Finally, click [here](https://www.bilibili.com/video/BV1Zgwyz3EPu/?share_source=copy_web&vd_source=8181862500e323499406c784dd72c4e7 "bilibili: [My World] A data pack helps you easily modify the player speed!") Watch a more detailed video explanation