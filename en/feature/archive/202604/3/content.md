---
title: 'Development experience sharing: entity tree and object-oriented'
---

<FeatureHead
    title="Development experience sharing: entity tree and object-oriented"
    authorName="Xuanyu1725"
/>


## Summary

This article refers to the content included in the site [You must immediately abandon all worldentity to use the new generation of shadow operators - Rainbow](https://etis.vcsofficial.site/d/62) and [minecraft instructions cooking guide: cold entityselector - Chuang Xiaoye](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/2/content.html) Two articles share an entity management and operation method based on a similar **Tree** structure.

## Agreement

Since the referenced article uses different names for the same concept, here we use **worldentity** to refer to the **operator** in the first article, which is defined as the only object with a fixed UUID that exists in the world. The discussion of **entity pointers** will no longer be limited to worldentities. Any object that can serve as a quick access to another entity within the context can be called an entity pointer.

## Introduction to entity pointers

The entity pointer is an object that quickly accesses another entity, usually an entity. Thanks to Mojang`execute on`Subcommand to switch the executor to another entity that is related to the entity. This search is far better than the one optimized with the selector parameter.`@e`Soon, we will use this feature to establish connections between different objects.

In our example we used`passenger`pointers and`origin`Pointers, the former is a pointer with location binding, and the latter is a pure access pointer. Note that the entity tree introduced in this article is only built on`passengers`Based on the pointer, this kind of pointer can guarantee the legality of the tree (it has a unique root, and a passenger cannot point to its mount entity (vehicle) or entities on other branches through the Passengers pointer)

Note that the root entity of the entity tree is currently very limited, because the root entity is unique and plays an important role, but the interpolation function of the display entity and the physical functions of most other entities cannot be combined (this may be solved after Mojang introduces the entity component). Additionally, in situations where the riding anchor is required to be non-unique, the entity tree will not be suitable for use only`passenger`Pointer construction, even the entity group may no longer be a tree structure.

## The core idea of entity tree

"Tree" is a concept in graph theory. It is a way of connecting nodes that satisfies:

1. There is only one root node (Root) and no parent node.

2. Each node has zero or more child nodes (Children), but only one parent node (Parent).

3. There is no cycle (Cycle), that is, there is no node that is both the ancestor and the descendant of another node.

This is caused by`passenger`Pointers are naturally satisfied because each entity can only have one mount.

The entity tree uses riding relationships to make different entities a connected whole on the client and server. As long as the bottom entity (called **root entity (Root)**) can be accessed, all entities in the tree can be accessed through riding relationships. By executing on the root entity`execute on passengers`To access other entities on the tree, we can achieve very efficient entity access and operations. Note that there are a few entities that cannot be`/ride`To control riding, these entities must be leaf entities on the tree (that is, entities without child nodes).

> (command/ride - Minecraft Wiki) The command cannot be player or tag$^\text{[Java Edition only]}$, tether knots, lightning beams and floats to add passengers.

## Project Example

In order to show the advantages of the entity tree, let's first look at a complex entity usage scenario, which is also my original intention of using the entity tree method:

In this scenario, we require the user to look at an entity from a certain distance and control its behavior through input operations. Although it seems simple, it is more troublesome to implement. We need:

1. Multiplayer compatibility: How can each player correspond to an entity one-to-one? We need a mechanism to ensure that each player can correctly find and operate its own entity.

2. Control the player: Since the player must act as a camera here, we need to introduce other entities, through`/ride`The command fixes the player's position.

3. Operation mapping: We must first find the player in the context, process his input operations, and then find the corresponding entity to implement the operation. If used every time`@e`To find the entity, the efficiency will be very low.

It can be seen that although the problem is very simple, the specific operation is more complicated (especially when we want to use less than`@e^2`complexity to implement). Since the problem is very simple after abstraction, we might as well use object-oriented thinking to solve this problem.

There are two types of objects in this scene (it will be more if the communication between classes is also encapsulated. We discuss a more direct implementation here), **Camera** and **Character**. We only need to implement the functions of these two types of objects respectively and enable them to communicate with each other.

## Definition of camera class

The camera class needs to undertake the following functions:

1. Smooth motion: This requires that the entity that determines coordinates is **interpolatable**. Currently, only the display entity satisfies this function. We hope that the interpolation will be as smooth as possible, and the **item display entity (Item Display)**'s interpolation mechanism based on the current frame is very suitable for this requirement. (Different from the interpolation mechanism of **block display entity**). So we let the item display entity as the root entity that determines coordinates.

2. Imaging: Only the player itself can "see things", but due to the special nature of the player, each camera class will dynamically bind the player in the program. Therefore, we do not include the player when instantiating the class, and the camera object that operates normally must bind the player in a certain way.

3. Observation target pointer: The camera class needs to have an attribute to record the object it is observing. This object is an instance of the character class we mentioned above. This function can be achieved by introducing an entity pointer. We use **drop (Item)** here, which`Thrower`The entity pointed to by nbt can pass`execute on origin`for quick access.

4. Player pointer: The camera class needs to have an attribute to record the player it is bound to. This attribute can also be implemented by introducing an entity pointer, and can also be implemented using dropped objects.

Then the various parts of the camera class are as shown in the schematic diagram: (each arrow is a`execute on`operation, despite`execute on passengers`Not a strict mapping...):

![alt text](../../../../../feature/archive/202604/3/tmpbxiefo2.svg)

## Definition of role class

The role class needs to undertake the following functions:

1. Physical functions: The character class needs an entity to undertake physical functions, so that we can handle operations such as collision and movement. We can use entities such as player models, armor stands, dropped objects, etc. to undertake this function. (The armor stand is chosen here because it can be equipped with an item on the head to display the model facing the entity)

2. Display function: For a simple character, the physical function and the display function can be undertaken by the same entity (such as armor stand and player model), but you can also use the display entity of Animated Java to assume the display function, usually by riding him on dropped objects, because the data volume of dropped objects is smaller.

3. Operator pointer: The character class needs to have an attribute to record its operator. This attribute can also be implemented by introducing an entity pointer, and can also be implemented using dropped objects.

Schematic diagram:

Animated Java solution

![alt text](../../../../../feature/archive/202604/3/tmpbxiefo3svg.svg)

or armor stand scheme

![alt text](../../../../../feature/archive/202604/3/tmpbxiefo1.svg)

## Class instantiation and management

Instantiating objects calls out corresponding entities and maintains information about these objects. Although it can also be used`execute summon ... run function`to avoid using`@e`of use. However, for the purposes of this tutorial, we will first use`@e`to find entities. (In fact, object creation is not frequent, so use`@e`There won’t be much performance problem if you look for entities)

### Role class

Taking the role class as an example, the implementation of the initialization function is as follows:

```mcfunction
# character:init
#Create role object
summon armor_stand ~ ~ ~ {\
    Invisible:1b,\
    Tags: ["CharacterObject"],\
    attributes:[\
        {id:"step_height",base:1.0}\
    ],\
    Passengers: [\
        {\
            id: "item",\
            PickupDelay: 32767,\
            Age: -32768,\
            Item: {id: "music_disc_11", components: {"item_model": "air"}, count: 1},\
            Tags: ["EntityPointer","CharacterController"]\
        }\
    ]\
}

#Assign id recursively
scoreboard players add #Pointer ObjectID 1
execute as @e[tag=CharacterObject,distance=..1,type=armor_stand] run function object:__assign_id
```
For @e optimization guidelines here, please refer to [minecraft instruction cooking guide: cold entityselector - Chuang Xiaoye](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/2/content.html) about selector optimization, please note that you must not use it here.`[nbt={}]`, when serializing and deserializing the nbt of the root entity, all passenger entities will be accessed at the same time, resulting in extremely low efficiency.

```mcfunction
# object:__assign_id
scoreboard players operation @s ObjectID = #Pointer ObjectID
#Recursion, since passenger is a tree structure, there is no need to write additional conditions, and the recursion will automatically stop at the leaf node.
execute on passengers run function object:__assign_id
```
> Note: In my project, the character class actually consists of 1 root entity and 5 leaves. I will introduce other unmentioned object functions in the second part of "Building a Simple 2D Scene".

Next we need to define some methods for the entity. The first is the destruction method. This method only destroys the nodes on the tree. If your object has more than one tree, then you may need to destroy it based on the ObjectID:

```
mcfunction
# character:destroy
#Destroy the entire entity tree
execute on passengers run function character:destroy
kill @s
```
The following is the method for binding the player. This method also needs to be implemented on the camera object:

```mcfunction
# character:method/bind_player
#Bind the player, assuming that the context coordinate for executing the method is at the position of the player, and the context executor is the root entity of the object.
execute on passengers if entity @s[tag=CharacterController] run data modify entity @s Thrower set from entity @p UUID
```
The following various methods are commonly used. Since the purpose of this article is to introduce the concept and usage of the entity tree, we will not discuss too much about the implementation details of the function:

 -`character:method/pull_event`: Capture all input events of the controller and process them.
 -`character:method/move_(direction)`:Move function, direction can be forward/backward/left/right/up/down or a combination of both directions.
 -`character:method/look_(direction)`:Turn function, direction can be left/right/up/down or a combination of both directions.
 -...

### Camera class

The instantiation and method definition of the camera class are similar to those of the character class, so we won’t go into details here.

```mcfunction
# camera:init
#Create camera object
summon item_display ~ ~ ~ {\
    data: {rx: 45,ry: 30, distance: 32},\
    Tags: ["CameraObject"],\
    teleport_duration: 5,\
    Passengers: [\
        {\
            id: "item",\
            PickupDelay: 32767,\
            Age: -32768,\
            Item: {id: "music_disc_11", components: {"item_model": "air"}, count: 1},\
            Tags: ["EntityPointer","CameraEntity"]\
        },\
        {\
            id: "item",\
            PickupDelay: 32767,\
            Age: -32768,\
            Item: {id: "music_disc_11", components: {"item_model": "air"}, count: 1},\
            Tags: ["EntityPointer","TracingTarget"]\
        }\
    ]\
}

#Assign id recursively
scoreboard players add #Pointer ObjectID 1
execute as @e[tag=CameraObject,distance=..1,type=item_display] run function object:__assign_id
```
The following methods need to be implemented

 -`camera:destroy`: Method to destroy an object
 -`camera:method/update_location`: Update the position of the camera object root entity
 -`camera:method/update_player`: Force the player to ride again and update the player's orientation
 -`camera:method/bind_player`: Bind player
 -`camera:method/bind_target`: Bind observation target
 -`camera:method/pull_event`: Method to capture player input events (mainly mouse movement)
 -...

## The case of multiple trees

We introduce a new object into the above character object. This object serves as the mouse pointer of the character. It must be unbound from the position of the root entity and become a free entity (itself may also be a tree). We will introduce how to efficiently access entities outside this tree. We treat the mouse pointer as a class and use it as a subclass of the character entity to demonstrate the specialness. Of course, you can also implement it as an independent class (this will be simpler).

The mouse pointer must implement the following functions:

1. Provide a location indicator: you can use`marker`, this entity is best when only the location is needed, but it cannot be ridden. If a presentation entity is used, the presentation entity can provide both location indication and appearance.

2. Provide an appearance: just use the display entity.

Readers may think that since this entity is not on the tree, we cannot pass`execute on passengers`to access it, so that we cannot use the entity pointer to access it. In fact, we can introduce a new entity pointer in the role class to point to this entity (or the root entity of another tree). This pointer can also be passed`execute on origin`Come visit.

### Solution using worldentity

Due to the particularity of the problem, it is more suitable to use marker+display entity in our scenario than to use only display entity, because this display entity can be placed on our original tree, and marker can use **worldentity** thinking to use a globally shared object as our mouse pointer position indicator, which can reduce the number of trees to a small size. In the case of using worldentity, we no longer need a special pointer to point to it, but can use the faster`UUID`for a visit.

We will not go into details about the transformation calculation of the display entity (it will be introduced in the second part of "Building a Simple 2D Scene"). We assume that we have obtained the position of the mouse pointer relative to the character, then we can update the position of the mouse pointer through the following function:

```mcfunction
#Query and ensure that the worldentity is summoned. If absolute safety can be guaranteed, it can be omitted.
execute unless entity 0-0-0-0-0 run summon marker 0.0 0.0 0.0 {UUID:[I;0,0,0,0]}
#We will not discuss the specific internal implementation. After executing this function, 0-0-0-0-0 should be at the position of our mouse pointer.
execute as 0-0-0-0-0 run function we:mouse_event
```
> **Worldentity Security**
> Worldentity is a globally shared object. Command only pays attention to the interface return value it provides in the context. However, if the implementation of the interface is unsafe, causing the worldentity to be uninstalled or died, then the functions that rely on this worldentity will have undefined behavior or directly obtain wrong results.
> Therefore, when implementing the worldentity interface, its security must be ensured, mainly including: dimension security, chunk security, entity security, etc. And put the worldentity in a safe location after each call.
>
> When selecting the UUID of the worldentity, in order to avoid being borrowed by other packages, we can use a UUID that looks more random but violates the UUID specification (naturally generated entities will not have such a UUID). But for the purpose of this tutorial, we will directly use the UUID starting from 0-0-0-0-0 as the UUID of our worldentity.

> Tips
> used in nbt`uuid("hyphenated hexadecimal UUID")`It can be automatically converted to a UUID in integer array format, such as`{UUID:uuid("dab4d1cd-223b-41bd-8084-59d890d935e4")}`will be automatically converted to`{UUID:[I;-625684019,574308797,-2138809896,-1864813084]}`, this writing method does not seem to be recognized in Datapack Helper Plus, but in Minecraft 1.21.5+$^\text{(requires verification)}$is completely legal.

The operation here needs to ensure that the worldentity is not occupied too much and does not stay in chunks that may be unloaded, so we must complete all operations that depend on the mouse pointer position within we:mouse_event and return it to a safe location. If it is just an ordinary position indicator, strict guarantees of safety can be omitted.

Implement the following method on the mouse pointer class:

-`mouse:destroy`
- `mouse:method/update_location`-...

## Main loop scheduling

After implementing all the above classes, we can use the unique`@e`The entrance is used to handle various events.

```mcfunction
# #tick
#This provides the only @e entry. If @e is no longer used internally, the entity access efficiency of the entire system will be very efficient.
execute as @e[...] run function app:main
```


```mcfunction
# app:main
#Let the camera object capture the player's input event
execute as @s[tag=CameraObject] run function camera:method/pull_event
#Let the character object capture the player's input event
execute as @s[tag=CharacterObject] run function character:method/pull_event
```


```mcfunction
# camera:method/pull_event

#Grab the offset of the player mouse
...

#Update the position of the mouse pointer
    #(General solution) First index the possible target role, and then access the mouse pointer entity through the pointer of the role object.
    execute on passengers if entity @s[tag=TracingTarget] on origin \
        on passengers if entity @s[tag=MouseTarget] on origin \
        run function camera:method/update_location
    
    ...

    #(worldentity scheme)
    execute as 0-0-0-0-0 run function we:mouse_event
```


```mcfunction
# character:method/pull_event
#Capture the input event of the player, first index to possible cameras, and then index to the player through the camera
execute on passengers if entity @s[tag=CharacterController] on origin \
    on passengers if entity @s[tag=CameraEntity] on origin \
    if entity @s[predicate=(玩家移动事件的谓词)] run function character:method/move

...
```
This is just an example, in fact we are free to call different methods of the object depending on the scenario.

## Multiplayer Compatibility

All the above implementations only regard the player as part of the object. Since our objects are originally different instances derived from the same class, the entire system is naturally compatible with multiple people in theory.

But please note that after the player is bound to the camera, the player's offline will cause the entire camera tree to disappear and cannot be indexed. Therefore we must treat the tree where there is a record in the ObjectID but cannot be found as a special case and handle it.

## Summary

This article mainly shares a method based on`passenger`and`origin`The way pointers access entities, and based on this, the concepts and usage of **entity tree** and **worldentity** are proposed. In the article, object-oriented thinking is used to simplify the problem. This idea can make complex scenes very simple and is very conducive to multi-person compatibility (when considering the relationship between objects, the relationship between players is already included)

Use`execute on`and`UUID`Visits are better than`@e`efficient, among which`UUID`It is the most efficient. Introducing these pointers into the project will greatly improve the efficiency of entity access. Some complex dependencies may no longer require frequent use of @e mutual references, thus greatly improving performance.

But because`passenger`While the pointer binds the location of the entity, it also binds the nbt. Serializing/deserializing the nbt of the root entity will cause a serious performance bottleneck. It is recommended to store a large amount of information on the leaf entity so that there is no need to access the information of other nodes.