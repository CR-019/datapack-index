---
title: 'Say goodbye to delayed tailing: Use linear prediction to implement low-latency following of Display entity'
---

<FeatureHead
    title="Farewell to delayed tailing: using linear prediction to implement low-latency following of Display entity"
    authorName="Esan Sang Sang Sang"
    resourceLink = '../_assets/tp.zip that can fully keep up with the player'
/>


::: tip This method has flaws
This method does not work on any model. See Method Limitations and Editor's Note for details.
:::

Anyone who has ever made a vanilla firearm or customized HUD knows that if you want a`item_display`How difficult is it to follow the player's perspective?

The crudest approach is to execute it every tick`tp @e ^ ^ ^`. But there is a dilemma: if you don’t give`teleport_duration`, there is no interpolation for entity movement, and only a refresh rate of 20fps, which looks very laggy; if given`teleport_duration: 1`Smoothing is forced because it takes time (50ms) for the client to play the animation. As soon as the player runs or turns his head, the model will slow down by half a beat, resulting in extremely uncomfortable smearing.

This article shares an idea that basically "eats up" this delay by using client rendering features and simple linear motion prediction.

### 1. Perspective rotation: don’t use server side calculation

Many people try to use high-frequency TP to forcibly synchronize the player's viewing angle, but this part can actually be completely exploited by the client's own rendering mechanism.

Add to Display entity`billboard: "center"`, it will always automatically face the player screen at the client level. If you want the model to be offset from the center of the screen (such as placing the gun in the lower right corner), adjust`transformation.translation`Matrix, never use it`^ ^ ^`The calculated absolute coordinate is used to control the offset.

After the rotation is handed over to the client, no matter how fast the player moves the mouse, the relative position of the model on the screen is absolutely stationary, with zero delay.

### 2. Mobile following: predict the next frame

The problem of perspective is solved, and all that remains is the movement of coordinates. Why does interpolation cause tailing? Because when the server-side command moves to the current coordinate, the client needs to spend time playing animation. By the time it reaches it, the player will have already moved to the next position.

So the core idea is: **Prediction**. Assuming that the player is moving in a straight line at a constant speed at a moment, we do not let the entity fly to the player's current position, but directly tp it to the position where the player will go in the next tick**. In this way, when the client slowly plays the interpolation animation, it just happens to coincide with the actual movement trajectory of the player.

The formula is very simple: suppose the position of the player's previous tick is$A$(That is, the starting point of the entity's current display), the current tick position is$B$.
Displacement (velocity) of this frame$V = B - A$.
We want to predict the target position of the next frame$C = B + V = 2B - A$.

The running process becomes: calculate every tick$2B - A$, pass the entity tp, and then save the player position of this frame and leave it to the next frame.$A$use.

### 3. Coordinate subtraction in macro instructions (space folding method)$2B - A$Of course there is no problem in using the integral version of this equation, but is there a more accurate way?

We can use macros to achieve this. In vanillacommand, coordinate addition is easy to write using macros.`positioned ~$(B_x) ~$(B_y) ~$(B_z)`That’s it. But subtraction cannot be written directly, because if$A$The coordinate passed in is a negative number (such as -50), and the macro replaces`~-$(A_x)`will become illegal`~--50`, report an error directly.

Here is a technique to use **local coordinate with perspective rotation** to do pure geometric subtraction: regardless of the plus or minus sign, directly "turn over" the local coordinate axis and align it with the negative direction of the global coordinate.

```mcfunction
#Assume target_xyz represents the current position B
#prev_xyz represents the previous frame position A

positioned 0. 0. 0. rotated 180 0 run function latch:follower/__tick__/run_at_owner_eyes_tp with storage latch:io temp.vars:
    $execute \
        positioned ~$(target_x) ~$(target_y) ~$(target_z) \
        positioned ~$(target_x) ~$(target_y) ~$(target_z) \
        positioned ^$(prev_x) ^ ^$(prev_z) \
        rotated 0 90 positioned ^ ^ ^$(prev_y) \
        run function latch:follower/tp_here
```
**Principle explanation:**
1. The first two times`positioned ~$(target_x)...`It is an ordinary coordinate superposition, and it is calculated$2B$.
2. At this time, due to the settings at the beginning, the execution environment is`rotated 180 0`(horizontally turned backward) perspective. From this perspective, the left side of the local coordinate (`^X`) and front (`^Z`) just corresponds to -X and -Z of global coordinate. So execute`positioned ^$(prev_x) ^ ^$(prev_z)`When , no matter whether the parameter passed in is negative, it is equivalent to subtracting the value from the global coordinate.$A_x$and$A_z$.
3. In the same way, use`rotated 0 90`Look down vertically at the ground, in front of the local coordinate (`^Z`) corresponds to the global -Y. Execute again`positioned ^ ^ ^$(prev_y)`It's equivalent to subtracting$A_y$.

Using this kind of space folding, precise vector subtraction with negative numbers can be accomplished in just a few lines of code.

### 4. Limitations of the solution

Of course, the prediction algorithm is not omnipotent. This scheme has two objective shortcomings in actual games:

* **Emergency stop overshoot**: Because it is blindly guessed based on historical speed, when the player suddenly stops while sprinting, the entity will rush forward slightly due to "inertia", and it will not bounce back to the correct position until the next tick.
* **Eat TPS/Frames**: This approach highly relies on a stable tick axis. If the server freezes or the client drops frames severely, the predicted trajectory will have visual deviations (but to be honest, when the server freezes, the traditional direct TP solution cannot be seen).

Putting aside these two points, this method currently works quite well in single-player maps. It is recommended to try it when developing first-person arm models and the like.

::: warning Editor's note
This method only has the best effect on the **vanilla default item model**. When using a custom item model, you need to ensure that the **billboard rotation pivot point** is at the player's eye position.  
As for how to ensure this, this principle has not been proven yet and is left to the readers to explore;
:::