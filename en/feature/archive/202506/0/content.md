---
title: 'Front-end framework for Minecraft - Floating UI'
---
<!-- markdownlint-disable MD033 MD041 -->
<FeaturedHead
    title = "Front-end framework for Minecraft - Floating UI"
    authorName = "Alumopper"
    resourceLink = 'https://github.com/Alumopper/Floating-UI'
    cover='../../../../../feature/archive/202506/_assets/0.png'
/>

Display entity is a feature officially introduced in 1.19.4. It can be used to display block item text and so on. In a sense, its potential as a UI development is basically comparable to that of container GUI, and it can even surpass container UI in terms of flexibility. In fact, there are many data packs or maps that implement UIs made with display entities. However, surprisingly, until now, there is no display entityUI library that supports dynamic parsing. Thus, Floating UI was born~

This UI library was originally part of a larger project, and its name *Floating* also comes from this project. But, in the end, I decoupled it and made it an independent project, called Floating UI.

Floating UI allows developers to define and render UI using SNBT format, and provides an event system for reading input operations such as user clicks. At the same time, it also supports developers to define custom user controls and automatic layout, simplifying UI drawing.

::: tip pre-library tip

Floating UI uses [Xiaodou’s math library](https://github.com/xiaodou8593/math2.0) and [Xiaodou’s event queue](https://github.com/xiaodou8593/timelist), use Xiaodou's math library to perform precise floating point calculations and intersection calculations, and use Xiaodou's event queue to host the timing triggering effect of events.

:::

## Basic usage

::: warning prompt

Before using Floating UI, please manually call`function floating_ui:load`Initialize the floating UI library!

:::

If you want to create a UI, the easiest way is to use`floating_ui:.player_new_ui`function. This function will read the pre-entered layout data and generate a player-oriented UI interface in front of the executor.

```mcfunction
#Write UI layout data
data modify floating_ui:input data set value {\
    "type":"panel",\
    "size":[5f,5f],\
    "child":[\
        {\
            "type":"button",\
            "y":0.3,\
            "size":[2.5f,2.5f],\
            "item":{"id":"apple"}\
        }\
    ]\
}

#Show UI
function floating_ui:.player_new_ui
```
::: tip tip

If you are running with the functions in the data pack, you can use`\`Write layout data in new lines to improve the readability of layout data.

:::

After calling this function, in`_`scoreboard`return`The unique numeric UID of the root entity of this UI will be stored in the score item, which can be saved for subsequent operations after the call. But——, this value will be overwritten every time it is called, so be sure to save it in time.

If you want to close a UI, there are two methods. The first is to call directly`function floating_ui:.player_dispose_ui`function, which will close all UI owned by the executor player.

Or, if you want to clear a certain UI, the previously saved UID will be useful. Suppose you want to clear the UI with UID 0, you can do this:

```mcfunction
execute as @e[tag=floating_ui_root] \
    if score @s floating_ui.uid matches 0 \
    run function floating_ui:_dispose_ui
```


`floating_ui:.player_new_ui`The created UI can only be interacted with by the player that created it (the player that performs this function). If you want to create a UI that all players can interact with, you can use`floating_ui:.world_new_ui`. But be careful, the UI created in this way can only be deleted by selecting it by UID, so be sure to save its UID.

## Data structure

### Controls

Floating UI **layout data** is composed of **UI control data**.

The most basic class of all controls is`basecontrol`, which contains the basic properties of all controls. This class is an abstract class and cannot be instantiated.

<div class="nbttree">

<node type="compound" name="basecontrol" />The base class for all controls
- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. Default is`[0f,1f,0f,0f]`- <node type="homolist" name="tag" />The tag of the control
- <node type="homolist" name="anims" />
  - <node type="compound" name="(list element)" :colon="false" /> <details><summary>Animation common tags</summary>

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" /> <details><summary>Common tag</summary>

        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
        </details>

    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.
    </details>
- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control

</div>`control`It is the parent class of most controls and contains basic properties. This class is an abstract class and cannot be instantiated. exist`control`In all subsequent data formats, the data related to UIcoordinate defaults to a block length.

<div class="nbttree">

<node type="compound" name="control" />The base class for all non-text component UI controls
<details><summary>tags common to basic controls</summary>

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. Default is`[0f,1f,0f,0f]`- <node type="homolist" name="tag" />The tag of the control
- <node type="homolist" name="anims" />
  - <node type="compound" name="(list element)" :colon="false" /> <details><summary>Animation common tags</summary>

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" /> <details><summary>Common tag</summary>

        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
        </details>

    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.
    </details>
- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control
</details>

- <node type="string" name="display" />corresponds to the item display entity`item_display`- <node type="compound" name="item" />item displays the item that the entity will display <details><summary>item common tag</summary>
    
    - <node type="string" name="id" />item's id. If namespace is`minecraft`Can be omitted. If this item is omitted, the default is`glass_pane`- <node type="byte" name="count" />item's id. If omitted, it defaults to`1b`. Basically useless meow
    - <node type="compound" name="tex" /> (deprecated) CustomModelData for item
    - <node type="compound" name="data" />A compound tag, corresponding to the vanilla item format`components.minecraft:custom_data`- <node type="compound" name="components" />An item component

    </details>

</div>


After creating the control, additional data that can be accessed is:

<div class="nbttree">

<node type="compound" name="control" />The base class for all non-text component UI controls
- <node type="homolist" name="x" />UUID array list of all possible child controls of this control.

</div>`textcontrol`It is the parent class of text control and contains some basic properties. Since it is difficult for the text display entity to store customized information, the textcontrol is divided into two entities: the marker and the text display entity. The marker is used to store information and is also a component of the UI interface node. The corresponding text display entity can be accessed through the marker.

<div class="nbttree">

<node type="compound" name="textcontrol" />The base class for all non-text component UI controls


</div>

After creating a text control, additional data that can be accessed is:

<div class="nbttree">

<node type="compound" name="textcontrol" />The base class for all text component UI controls
- <node type="int_list" name="parent" />The UUID of the parent control of this control
- <node type="int_list" name="displayEntity" />The text corresponding to this control displays the UUID of the entity

</div>

These two base class controls are **abstract**, that is, they cannot be created and displayed directly. The following control types can all be instantiated.`panel`Is a simple container control in which other subspaces can be placed.

<div class="nbttree">

<node type="compound" name="panel" />
**Common tags for controls**

**Common tags for basic controls**

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
- <node type="homolist" name="tag" />The tag of the control
- Animation effects of <node type="homolist" name="anims" /> controls
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for animation**

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" />
        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.

- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


- <node type="string" name="display" />corresponds to the item display entity`item_display`- <node type="compound" name="item" />item displays the item that the entity will display
  **item common tag**

  - <node type="string" name="id" />item's id. If namespace is`minecraft`Can be omitted. If this item is omitted, the default is`glass_pane`- <node type="byte" name="count" />item's id. If omitted, it defaults to`1b`. Basically useless meow
  - <node type="compound" name="tex" /> (deprecated) CustomModelData for item
  - <node type="compound" name="data" />A compound tag, corresponding to the vanilla item format`components.minecraft:custom_data`- <node type="compound" name="components" />An item component


- <node type="homolist" name="child" />child control
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for basic controls**

    - <node type="string" name="type" />The type of control
    - <node type="double" name="x" />xcoordinate. The origin is the center
    - <node type="double" name="y" />ycoordinate. The origin is the center
    - <node type="double" name="z" />zcoordinate. The origin is the center
    - <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
    - <node type="homolist" name="tag" />The tag of the control
    - Animation effects of <node type="homolist" name="anims" /> controls
      - <node type="compound" name="(list element)" :colon="false" />
        **Common tags for animation**

        - <node type="homolist" name="value" />The target key-value pair of the animation
          - <node type="compound" name="(list element)" :colon="false" />
            - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
            - <node type="any" name="value" />The NBT target value to be modified by the animation
        - <node type="float" name="time" />Animation duration
        - <node type="string" name="start" /> event. Fired when animation starts.
        - <node type="string" name="end" /> event. Fires when the animation ends.

    - <node type="string" name="name" />The unique string name of the control, used to save the UUID
    - <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
    - <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


</div>`button`It is a basic button control that can be clicked and trigger click events.

<div class="nbttree">

<node type="compound" name="button" />
**Common tags for controls**

**Common tags for basic controls**

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
- <node type="homolist" name="tag" />The tag of the control
- Animation effects of <node type="homolist" name="anims" /> controls
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for animation**

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" />
        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.

- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


- <node type="string" name="display" />corresponds to the item display entity`item_display`- <node type="compound" name="item" />item displays the item that the entity will display
  **item common tag**

  - <node type="string" name="id" />item's id. If namespace is`minecraft`Can be omitted. If this item is omitted, the default is`glass_pane`- <node type="byte" name="count" />item's id. If omitted, it defaults to`1b`. Basically useless meow
  - <node type="compound" name="tex" /> (deprecated) CustomModelData for item
  - <node type="compound" name="data" />A compound tag, corresponding to the vanilla item format`components.minecraft:custom_data`- <node type="compound" name="components" />An item component


- <node type="string" name="left_click" /> event. Triggered when this button is clicked with the left mouse button
- <node type="string" name="right_click" /> event. Fires when this button is clicked with the right mouse button
- The content of the <node type="compound" name="content" /> button is a control. Ignored if specified`item`, and displays the button as the specified control.
  **Common tags for basic controls**

  - <node type="string" name="type" />The type of control
  - <node type="double" name="x" />xcoordinate. The origin is the center
  - <node type="double" name="y" />ycoordinate. The origin is the center
  - <node type="double" name="z" />zcoordinate. The origin is the center
  - <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
  - <node type="homolist" name="tag" />The tag of the control
  - Animation effects of <node type="homolist" name="anims" /> controls
    - <node type="compound" name="(list element)" :colon="false" />
      **Common tags for animation**

      - <node type="homolist" name="value" />The target key-value pair of the animation
        - <node type="compound" name="(list element)" :colon="false" />
          - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
          - <node type="any" name="value" />The NBT target value to be modified by the animation
      - <node type="float" name="time" />Animation duration
      - <node type="string" name="start" /> event. Fired when animation starts.
      - <node type="string" name="end" /> event. Fires when the animation ends.

  - <node type="string" name="name" />The unique string name of the control, used to save the UUID
  - <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
  - <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


</div>`textblock`It is a basic text control that can display specified text

<div class="nbttree">

<node type="compound" name="textblock" />
**Common tags for text controls**

**Common tags for basic controls**

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
- <node type="homolist" name="tag" />The tag of the control
- Animation effects of <node type="homolist" name="anims" /> controls
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for animation**

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" />
        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.

- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


- <node type="float" name="fontsize" />The size of the font. only for input

- <node type="string" /><node type="homolist" name="text" />The string to be displayed. If it is a list, it represents multiple lines of text
- <node type="string" name="align" />Text alignment, yes`left`，`right`，`center`Three types. Default is`left`

</div>

`list`It is a container control that can display a scrolling series of controls. The controls can be scrolled using the mouse wheel.

<div class="nbttree">

<node type="compound" name="list" />
**Common tags for controls**

**Common tags for basic controls**

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
- <node type="homolist" name="tag" />The tag of the control
- Animation effects of <node type="homolist" name="anims" /> controls
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for animation**

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" />
        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.

- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


- <node type="string" name="display" />corresponds to the item display entity`item_display`- <node type="compound" name="item" />item displays the item that the entity will display
  **item common tag**

  - <node type="string" name="id" />item's id. If namespace is`minecraft`Can be omitted. If this item is omitted, the default is`glass_pane`- <node type="byte" name="count" />item's id. If omitted, it defaults to`1b`. Basically useless meow
  - <node type="compound" name="tex" /> (deprecated) CustomModelData for item
  - <node type="compound" name="data" />A compound tag, corresponding to the vanilla item format`components.minecraft:custom_data`- <node type="compound" name="components" />An item component


- <node type="homolist" name="child" />child control
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for basic controls**

    - <node type="string" name="type" />The type of control
    - <node type="double" name="x" />xcoordinate. The origin is the center
    - <node type="double" name="y" />ycoordinate. The origin is the center
    - <node type="double" name="z" />zcoordinate. The origin is the center
    - <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
    - <node type="homolist" name="tag" />The tag of the control
    - Animation effects of <node type="homolist" name="anims" /> controls
      - <node type="compound" name="(list element)" :colon="false" />
        **Common tags for animation**

        - <node type="homolist" name="value" />The target key-value pair of the animation
          - <node type="compound" name="(list element)" :colon="false" />
            - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
            - <node type="any" name="value" />The NBT target value to be modified by the animation
        - <node type="float" name="time" />Animation duration
        - <node type="string" name="start" /> event. Fired when animation starts.
        - <node type="string" name="end" /> event. Fires when the animation ends.

    - <node type="string" name="name" />The unique string name of the control, used to save the UUID
    - <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
    - <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


</div>`sprite`and`control`There is almost no new control data that can be used to display an item, which can be used to display some pictures by modifying the texture.`stackpanel`It is an auto-layout container that can automatically arrange internal controls in a specified layout.

<div class="nbttree">

<node type="compound" name="stackpanel" />
**Common tags for controls**

**Common tags for basic controls**

- <node type="string" name="type" />The type of control
- <node type="double" name="x" />xcoordinate. The origin is the center
- <node type="double" name="y" />ycoordinate. The origin is the center
- <node type="double" name="z" />zcoordinate. The origin is the center
- <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
- <node type="homolist" name="tag" />The tag of the control
- Animation effects of <node type="homolist" name="anims" /> controls
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for animation**

    - <node type="homolist" name="value" />The target key-value pair of the animation
      - <node type="compound" name="(list element)" :colon="false" />
        - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
        - <node type="any" name="value" />The NBT target value to be modified by the animation
    - <node type="float" name="time" />Animation duration
    - <node type="string" name="start" /> event. Fired when animation starts.
    - <node type="string" name="end" /> event. Fires when the animation ends.

- <node type="string" name="name" />The unique string name of the control, used to save the UUID
- <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
- <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control


- <node type="string" name="display" />corresponds to the item display entity`item_display`- <node type="compound" name="item" />item displays the item that the entity will display
  **item common tag**

  - <node type="string" name="id" />item's id. If namespace is`minecraft`Can be omitted. If this item is omitted, the default is`glass_pane`- <node type="byte" name="count" />item's id. If omitted, it defaults to`1b`. Basically useless meow
  - <node type="compound" name="tex" /> (deprecated) CustomModelData for item
  - <node type="compound" name="data" />A compound tag, corresponding to the vanilla item format`components.minecraft:custom_data`- <node type="compound" name="components" />An item component


- <node type="string" name="align" />The layout method of the control. There are three values: right, left, and center.
- <node type="homolist" name="child" />child control
  - <node type="compound" name="(list element)" :colon="false" />
    **Common tags for basic controls**

    - <node type="string" name="type" />The type of control
    - <node type="double" name="x" />xcoordinate. The origin is the center
    - <node type="double" name="y" />ycoordinate. The origin is the center
    - <node type="double" name="z" />zcoordinate. The origin is the center
    - <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
    - <node type="homolist" name="tag" />The tag of the control
    - Animation effects of <node type="homolist" name="anims" /> controls
      - <node type="compound" name="(list element)" :colon="false" />
        **Common tags for animation**

        - <node type="homolist" name="value" />The target key-value pair of the animation
          - <node type="compound" name="(list element)" :colon="false" />
            - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
            - <node type="any" name="value" />The NBT target value to be modified by the animation
        - <node type="float" name="time" />Animation duration
        - <node type="string" name="start" /> event. Fired when animation starts.
        - <node type="string" name="end" /> event. Fires when the animation ends.

    - <node type="string" name="name" />The unique string name of the control, used to save the UUID
    - <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
    - <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control

- <node type="int" name="gap" /> (TODO) spacing between child controls

</div>

### Event

The event mechanism of Floating UI is quite simple. Wherever the event is marked in the data format, you can write the namespaceID or functiontag of a function, so that the specified function can be executed when needed.

For example, we can add a click event to a button like this:

```json
{
    "type":"button",
    "left_click":"example:event/click"
}
```
When we click the button, it will be executed`example:event/click`The content in the function.

In a function, the executor of the function is the control where the event is located, not the player. If you want to access the player, you can use`floating_ui_owner`tag.

### Animation

Since it is a UI library, of course animation support is indispensable! Floating UI provides some basic animation functions with the interpolation function of Minecraft display entity. Animations are usually executed when an event is triggered. The data format of animation is as follows:

<div class="nbttree">

<node type="compound" name="animation" />
- <node type="homolist" name="value" />The target key-value pair of the animation
  - <node type="compound" name="(list element)" :colon="false" />
    - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
    - <node type="any" name="value" />The NBT target value to be modified by the animation
- <node type="float" name="time" />Animation duration
- <node type="string" name="start" /> event. Fired when animation starts.
- <node type="string" name="end" /> event. Fires when the animation ends.

</div>

For example, to have a`panel`To increase the size when the mouse enters, you can write:

```json
{
    "type":"panel",
    "anim":{
        "move_in":{
            "value":[
                {
                    "key":"transformation.scale[]",
                    "value":3f
                }
            ],
            "time":3,
            "start":"example:event/anim/start",
            "end":"example:event/anim/end"
        }
    }
}
```
However, unlike other events, the two events in the animation`start`and`end`It cannot be used to trigger animations.

### Control template

Generally speaking, a useful UI library must not lack custom controls, user controls, or templates, and Floating UI is certainly no exception. Through control templates, multiple controls can be packaged together, so that you don't have to write the same code repeatedly. The definition and use of control templates in Floating UI are very simple.

<div class="nbttree">

<node type="compound" name="template" />
- <node type="compound" name="content" />Template packaged controls
  **Common tags for basic controls**

  - <node type="string" name="type" />The type of control
  - <node type="double" name="x" />xcoordinate. The origin is the center
  - <node type="double" name="y" />ycoordinate. The origin is the center
  - <node type="double" name="z" />zcoordinate. The origin is the center
  - <node type="homolist" name="rotation" />The rotation of the control. is a quaternion. The default is [0f,1f,0f,0f]
  - <node type="homolist" name="tag" />The tag of the control
  - Animation effects of <node type="homolist" name="anims" /> controls
    - <node type="compound" name="(list element)" :colon="false" />
      **Common tags for animation**

      - <node type="homolist" name="value" />The target key-value pair of the animation
        - <node type="compound" name="(list element)" :colon="false" />
          - <node type="string" name="key" />The NBT key of the UI control entity to be modified by animation
          - <node type="any" name="value" />The NBT target value to be modified by the animation
      - <node type="float" name="time" />Animation duration
      - <node type="string" name="start" /> event. Fired when animation starts.
      - <node type="string" name="end" /> event. Fires when the animation ends.

  - <node type="string" name="name" />The unique string name of the control, used to save the UUID
  - <node type="string" name="move_in" />The namespaceid of a function or functiontag. Executed when the mouse standard star enters this control
  - <node type="string" name="move_out" />The namespaceid of a function or functiontag. Executed when the mouse star leaves this control

- <node type="compound" name="params" />A series of key-value pairs that define the parameters in the template. The key name represents the parameter name, and the key value represents the NBT relative path starting from content.

</div>

Pass in this NBT data`floating_ui:data custom.&lt;template name>`to register this template, and then you can directly`type`The template name is used in the field and parameters are passed in.

Here's an example:

```mcfunction
data modify storage floating_ui:data custom.test set value {\
    "content": {\
        "type": "panel",\
        "name": "test",\
        "size": [5f, 5f],\
        "child": [\
            {\
                "type": "textblock",\
                "text": "default"\
            }\
        ]\
    },\
    "params": {\
        "text": "child[0].text"\
    }\
}

data modify storage floating_ui:input data set value {\
    "type": "test",\
    "params":[\
        {"key":"text", "value":"Hello FloatingUI"}\
    ],\
}
```
## Floating API (Floating UI API)

### Control access

There are two ways to access controls, one is to use one-to-one name list access, and the other is to use tags to access multiple controls.

#### name

To access a control using a name list, you need to add the corresponding name attribute to the layout data.

```json
{
    "type":"panel",
    "size":[5f,5f],
    "child":[
        {
            "name":"apple_button",
            "type":"button",
            "y":-1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"apple"
            }
        }
    ]
}
```
Afterwards, you can access the`data.names.&lt;name&gt;`This nbt is used to obtain the uuid of the corresponding control. Well, if there are multiple controls with the same`name`What to do? Naturally, the later ones will overwrite the previous ones, and only the last control will be accessed.

#### tag

Of course, you can also set`tag`Property, add a tag to the control to achieve access to multiple controls.

```json
{
    "type":"panel",
    "size":[5f,5f],
    "child":[
        {
            "tag":"fruit_button",
            "type":"button",
            "y":-1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"apple"
            }
        },
        {
            "tag":"fruit_button",
            "type":"button",
            "y":1,
            "size":[1.2f,1.2f],
            "item":{
                "id":"carrot"
            }
        }
    ]
}
```
After that, we can use the tag option of the target selector to select the control we need.

```mcfunction
execute as @e[tag=fruit_button] run ...
```
### Floating function

Floating UI provides some functions that are easy to call. Ignore all the following functions`floating_ui`namespace. APIs marked **Non-Public** are subject to breaking changes.

####`.player_new_ui`According to the layout data in floating_ui:input data, a new UI belonging to the command executor is generated.

Call directly.

####`.player_dispose_ui`Destroy all UI owned by this player

call directly

####`_new_ui`(non-public)

According to the layout data in floating_ui:input data, generate the UI belonging to \[tag=floating_ui_owner\]player.

need`execute summon item_display run function this`Make a call

####`_dispose_ui`Delete this UI as the function executor.

need`execute as UI entity run function this`Make a call

####`.player_tree`Output the structure of this player's UI.

Call directly.

####`util/_tree`(non-public)

Output the structure of the UI as the function executor in the chat bar.

need`execute as UI entity run function this`Make a call

## Use XML&lt;Badge type="warning" text="Feature under development" /&gt;

Do you think writing NBT is too troublesome? It doesn't matter, mcdoc is built into Floating UI's data pack, which can realize automatic completion. But line breaks in command are still troublesome. What to do, maybe you can also use json. Floating UI's data pack also contains a series of json schemas. Just write the json, copy it, and then hold down the middle mouse button to add line breaks at the end in batches.`\`La.

It still feels troublesome, it doesn't matter, we still have the ultimate weapon-XML.

Let’s go straight to the example:

:::details

```
xml
<?xml version="1.0" encoding="UTF-8" ?>
<?xml version="1.0" encoding="UTF-8" ?>
<UI xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="schema.xml">
    <Window>
        <Panel width="6" height="6">
            <Panel.Item tex="11451000"/>
            <Panel width="5" height="2.1" y="-2">
                <Panel.Item tex="11451000"/>
                <Panel.Anim>
                    <Animation trigger="new"/>
                </Panel.Anim>
                <Sprite name="bg1" x="-2.5" width="0" height="2.1">
                    <Sprite.Item tex="11451002" id="yellow_stained_glass_pane"/>
                    <Sprite.Anim>
                        <Animation trigger="new" time="3" end="floating:ui/1/anim/new_next">
                            <Property key="transformation.translation[0]" value="0"/>
                            <Property key="transformation.translation[1]" value="5"/>
                        </Animation>
                    </Sprite.Anim>
                </Sprite>
                <Sprite name="bg2" x="-2.5" width="0" height="2.1">
                    <Sprite.Anim>
                        <Animation trigger="new" time="3" delay="3">
                            <Property key="transformation.translation[0]" value="-0.1"/>
                            <Property key="transformation.translation[1]" value="4.8"/>
                        </Animation>
                    </Sprite.Anim>
                </Sprite>
                <TextButton y="0.7" x="1">选择1</TextButton>
                <TextButton x="1">选择2</TextButton>
                <TextButton y="-0.7" x="1">选择2</TextButton>
            </Panel>
            <Sprite name="character" x="-4" z="0.002">
                <Sprite.Item id="paper" tex="11450001"/>
                <Sprite.Anim>
                    <Animation trigger="new" time="3">
                        <Property key="transformation.translation[0]" value="-3"/>
                    </Animation>
                </Sprite.Anim>
            </Sprite>
            <TextBlock name="character_name" fontsize="3" align="center" y="-1" x="-1.5" z="0.002">霜叶</TextBlock>
        </Panel>
    </Window>

    <Template id="TextButton" params="value">
        <Button width="3" height="0.7">
            <Button.Anim>
                <Animation trigger="new"/>
            </Button.Anim>
            <TextBlock fontsize="1" align="center">{value}</TextBlock>
        </Button>
    </Template>
</UI>
```
:::

In Floating UI XML, the root node is`UI`and a`Window`,exist`Window`Writing Floating UI in . Apart from`Windows`Everything else inside can be copied directly. and`UI`There is another one below`Template`Nodes are used to define templates.

Moving from NBT to XML is easy. For simple attribute values ​​(such as strings, numbers, etc.), just remember this form:`&lt;control type attribute=value>&lt;/control type&gt;`, and for attribute values ​​of type composite tag, for example`item`, write in the control tag`&lt;control type.attribute ID key=value>&lt;/control type&gt;`. In the above example, basically all the formats have been explained clearly, you can compare them yourself.

:::tip
For templates in XML form, there is a special syntactic sugar, which is named`value`properties. It corresponds to the value written directly in the slot when using the template.

For example, in the above example there is the template:

```
xml
<Template id="TextButton" params="value">
    <Button width="3" height="0.7">
        <Button.Anim>
            <Animation trigger="new"/>
        </Button.Anim>
        <TextBlock fontsize="1" align="center">{value}</TextBlock>
    </Button>
</Template>
```
The params define`value`attribute, in the template at`TextBlock`text position, so it will replace`TextBlock`text in . And when using:

```xml
<TextButton y="0.7" x="1">选择1</TextButton>
```
Text at this time`选择1`will default to`value`The value is passed into the template without writing`value="选择1"`

:::
