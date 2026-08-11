---
title: 'Better right-click detection: Halving method'
---

<FeatureHead
    title="Better right-click detection: Halving method"
    authorName="Esan Sang Sang Sang"
/>



Let’s look at a performance improvement solution for right-click detection:

# Right-click detection (halving method)
Before we start, let’s do an experiment: If a scoreboard value initially is$\color{blue}0$, add it first every time$\color{blue}4$, then divided by$\color{blue}2$, and see what happens:

- Initial:$\color{blue}0$
- $0+4=4$，$4 \div 2=\color{blue}2$
- $2+4=6$，$6 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$-...

You'll notice that the last value always seems to be$\color{blue}3$. \
If we don't continue to add$4$, what will happen?

- Initial:$\color{blue}0$
- $0+4=4$，$4 \div 2=\color{blue}2$
- $2+4=6$，$6 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3+4=7$，$7 \div 2=\color{blue}3$
- $3 \div 2=\color{blue}1$
- $1 \div 2=\color{blue}0$
- $0 \div 2=\color{blue}0$-...


If we don't continue to add$4$, this value will change from$3$become$1$, and then return to the initial$0$Did you notice anything strange? \
Let’s look directly at the resulting numbers:$\color{blue}0$\
$\color{blue}2$\
$\color{blue}3$\
$\color{blue}3$\
$\color{blue}3$\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$You will find that when the value is added$4$During this period of time, the value will look like$23331$, that is, starting with$2$, the middle is$3$, ending with$1$.
In other words, we only need to add$4$, and then continue to divide by$2$, you can get the right-click status. This is where the name "halving method" comes from.

However, players who are familiar with command will say that right-click advancement detection is very unstable and often disconnects.
In this way, during a long press, the detection will start immediately after the end due to disconnection.
So this method cannot be used?
No, we can add it to the process$4$Change to plus$6$：

$\color{blue}0$\
$\color{blue}3$\
$\color{blue}4$\
$\color{blue}5$\
$\color{blue}5$\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$If the value is$3$, it means starting to press and hold the right button
If the value is$1$, it means release the right button
Otherwise as long as it is not$0$, indicating that you are pressing and holding the right button
But some people will say, what will happen if I press and release it immediately?$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$What if you press it longer?$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}4$ 🕹️\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$\
$\color{blue}0$What if contact is discontinued?$\color{blue}0$\
$\color{blue}0$\
$\color{blue}3$ 🕹️\
$\color{blue}4$ 🕹️\
$\color{blue}5$ 🕹️\
$\color{blue}2$\
$\color{blue}5$ 🕹️\
$\color{blue}2$\
$\color{blue}1$\
$\color{blue}0$You will find that as long as$+4$or$+6$back$\div 2$, no matter how you do it, this value is based on$2$or$3$Start with$1$ended. This property can only be satisfied by dividing by 2, which is why it is called the "halving method". \
Why is this? In this process, only$3$and$2$Divide by$2$will get$1$, other numbers will not. And other numbers are divided multiple times by$2$After that, you will eventually come back to$2$. \
Due to space limitations, this video does not carry out strict mathematical proofs. If you are interested you can prove it yourself.

Next, I will post the complete code without further explanation.

```bash
# example:rmb/using_item
#...Right-click to run the advancement of example:rmb/run

# example:load
scoreboard objectives add rmb_flag dummy
scoreboard objectives add example dummy
scoreboard players set 2 example 2

# example:rmb/run
scoreboard players add @s rmb_flag 4
advancement revoke @s only example:rmb/using_item

# example:tick
execute as @a at @s run function example:rmb/player_tick

# example:rmb/player_tick
scoreboard players operation @s rmb_flag /= 2 example
execute if score @s rmb_flag matches 2 run say 开始长按右键
execute if score @s rmb_flag matches 3 run say 正在长按右键
execute if score @s rmb_flag matches 1 run say 松开右键
```
# Summary
In this tutorial, we learned a high-performance right-click detection scheme-the halving method. The knowledge points involved are:

- Halving method:
  - Taking advantage of the properties of integer division, by$(\text{current value} + \text{input value}) \div 2$The formula of , completes the state flow within a variable
  - If you need touch-off protection, you only need to modify the numbers and do not need to add new logic.

- Status mapping table

    | Scheme | Value | Meaning |
    |----------|----|----------------|
    |$+4$Halving |$2$|Start by right-clicking |
    | |$3$| Long pressing the right button |
    | |$1$| Release the right button |
    | |$0$| No operation |
    |$+6$Halving |$3$|Start by right-clicking |
    | |$1$| Release the right button |
    | |$0$| No operation |
    | |Other values| Long pressing the right button |

- Scoreboard calculations
  - Constant setting: The scoreboard operation does not support direct division by numbers. A "constant fraction" must be set first (such as setting`example`The score is`2`) as the divisor.
  - Operation instructions:
    - Input signal:`scoreboard players add @s rmb_flag 4`(Executed in the function triggered by advancement)
    - Status decay:`scoreboard players operation @s rmb_flag /= 2 example`(Executed in Tickfunction)