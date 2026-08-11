---
title: 'Simple, lightweight and elegant - dc decoration model support library'
---
<FeaturedHead
    title = "Simple, lightweight and elegant - dc decoration model support library"
    authorName = "CR_019"
    resourceLink = https://www.mcmod.cn/class/14646.html
    cover='../../../../../feature/archive/202509/_assets/0.png'
/>

## Introduction

**Decoration Creator Kit (dc)** is a support library for decoration models of MC high version (1.20.5+). It allows developers to use at least two instructions to register an interactive model in the game.

This support library allows developers to easily define various attributes and interactive events of the model. Registered models can be directly placed, interacted and destroyed like blocks, and can also be moved, rotated like entities, and provide various feedback to the player's interaction. Therefore, this support library is very suitable for authors of decorative models.

### About the birth of DC...
This project originally came from a commission in March 2024. The client wanted me to create a data pack that can support custom model placement, movement and rotation. In fact, when I was developing CAM earlier, I considered the possibility of making decorative models.

> I once planned a "Sculpture Expansion Pack", which contained various decorative sculptures. However, with the termination of the CAM project, this plan has no further progress.

Therefore, I began to imagine making a unified framework that can uniformly manage the placement, destruction and interaction of models while having better performance. It just so happened that mj introduced display entities and interactive entities at that time, and the introduction of function macros also greatly facilitated the transfer of dynamic parameters. With these conveniences, I spent several weeks researching and debugging, and completed the first version of dc. By the way, the original commission was the predecessor of the **Senluo Story** data pack version, and the current Senluo data pack also relies on DC.

## Features and advantages of dc

The goal of dc is to strike a balance between ease of use, lightweight, high performance, and high degree of freedom. Therefore, dc's model has basic interactive functions, and also supports the introduction of external functions and predicates for easy expansion. dc has a very simple and clear index registration structure, and has introduced mcdoc to support automatic completion of index registration, making it more convenient for developers to register models and reduce memory costs.

A typical DC model consists of a markup entity, a presentation entity and an interaction entity. If it has a collision box or light source attribute, it may also have other auxiliary blocks or entities. They are logically connected via uid scoreboard.

dc uses index method to store model data. When you manually execute the install command, the support library will parse and store the index data of the model. When the model is generated, the marked entity will directly pull the index data from the storage and assign it to the display entity and interactive entity. In this way, we do not need to store a large amount of data in the model item, while reducing polling operations and ensuring performance under normal conditions.

## How to use dc

### Index (Index)
DC uses indexing to read model data. Before adding a model, you need to register the corresponding index.

#### Index registration
The registration of the index is to create a function and write data according to the following structure:

```mcfunction
data modify storage dc:index input.<name> set value <data>
data modify storage dc:index keylist append value "<name>"
```
in`&lt;name&gt;`is the index name that needs to be registered,`&lt;data&gt;`It is index data and is a compound tag with the following format:

> Note: The brackets in front of the key are key-value types, and the colon after compound is the structure template. Its structure is only parsed the first time it appears, and is omitted later;

:::details index data

<div class="nbttree">

<node type="compound" name=""/>Index data
  + <node type="string" name="type"/> ( &lt;`"regular"`|`"hitbox"`|`"fixed"`|`"light"`> ) (default is regular) model type.`hitbox`The type has a collision box, and additional collision box parameters need to be set.`fixed`The type has a complete collision box of 1 grid, which cannot be moved or scaled. The size of the interaction box is fixed at 1*1.`light`Type can provide lighting, others with`fixed`The type is similar, it cannot be moved or scaled, and the size of the interactive box is fixed at 1*1. Only models of the same type can be converted to each other.
  + <node type="compound" name="extra_data"/> in`type`No`regular`When required, additional data is required.
      when`type`for`"hitbox"`When:
    + <node type="float" name="width"/>Collision box width;
    + <node type="float" name="offset"/>The offset of the collision box, which can be a negative value;
     when`type`for`"light"`When:
    + <node type="byte" name="level"/> (value range 0-15, default value 15) light source brightness;
    + <node type="bool" name="hitbox"/> (default 0) Whether there is a collision box. When set to 1, it has a collision box.
  + <node type="string" name="template"/>(optional)[template](#模板-template) name;
  + <node type="compound" name="item"/> The displayed item data corresponding to the model, the format is the same as the general item format, no`slot`tag. <details><summary>item common tag</summary>
    
    + <node type="string" name="id"/>id of item
    + <node type="int" name="count"/>number of items
    + <node type="compound" name="components"/>item component format
      + <node type="any" name="item component ID"/>an item component
      +...
    </details>
  + <node type="string" name="loot_table"/>loot table, which can replace the above`item`Field, import item data from loot table. Will meet with`item`Merge data in, if there is a tag with the same name,`item`cover`loot_table`Hit the tag.
  + <node type="float_list" name="modsize"/> Three-dimensional array, item displays the length, width and height of the entity, which is equivalent to displaying the length, width and height of the entity.`scale`Properties
  + <node type="compound" name="interactsize"/> Interactive entity size:
    + <node type="float" name="height"/> The height of the interactive entity;
    + <node type="float" name="width"/> The width of the interactive entity;
  + <node type="compound" name="prop"/> Extra attributes of the model, where you can specify some model characteristics.
    + When <node type="bool" name="height_adaption"/> is set to 1, the height of the collision box will be adjusted when rotating vertically;
  + <node type="compound" name="events"/>Interactive event settings.
    + <node type="list" name="construct"/>Events executed by default when placed, such as playing sounds, etc.;
      + <node type="compound" name=""/>an [event](#事件-event), without conditional parameters.
        + <node type="string" name="event"/> Event name, see details below;
        + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
    + <node type="list" name="update"/>Events executed when the model is updated. Events such as rotation, scaling, and transformation will trigger update behaviors.
      + <node type="compound" name=""/>an [event](#事件-event) , without conditional parameters.
        + <node type="string" name="event"/> Event name, see details below;
        + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
    + <node type="compound" name="left_click"/>Left click event
        + <node type="compound" name="fallback"/>at`criteria`When none of the event criteria in are met, the default event is applied. an [event](#事件-event) , without conditional parameters.
          + <node type="string" name="event"/> Event name, see details below;
          + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
        + <node type="list" name="criteria"/>Conditional event, an event triggered when the player holds the corresponding item and clicks on the model
          + <node type="compound" name=""/>an [event](#事件-event)
            + <node type="string" name="event"/> Event name, see details below;
            + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
            + <node type="compound" name="item"/>Triggering this event requires the item held by the player master, and the id can be item or itemtag;
              + Structural outline
            + <node type="string" name="preidcate"/><node type="compound" name=""/><node type="list" name=""/>predicate condition, triggering the event requires the clicked player to meet the predicate requirement, which can be defined inline;
    + <node type="compound" name="right_click"/>right click event
        + <node type="compound" name="fallback"/>at`criteria`When none of the event criteria in are met, the default event is applied. an [event](#事件-event) , without conditional parameters.
          + <node type="string" name="event"/> Event name, see details below;
          + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
        + <node type="list" name="criteria"/>Conditional event, an event triggered when the player holds the corresponding item and clicks on the model
          + <node type="compound" name=""/>an [event](#事件-event)
            + <node type="string" name="event"/> Event name, see details below;
            + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
            + <node type="compound" name="item"/>Triggering this event requires the item held by the player master, and the id can be item or itemtag;
              + Structural outline
            + <node type="string" name="preidcate"/><node type="compound" name=""/><node type="list" name=""/>predicate condition, triggering the event requires the clicked player to meet the predicate requirement, which can be defined inline;
  


</div>

:::

After that, create a namespace named dc under your own data pack, create a functiontag named index (dc/tags/functions/index.json), and add the index registration function.
#### Index loading
After the index is registered, the index has not been built and cannot be used yet. At this point the index needs to be loaded.
implement

```
/reload

```
command and then execute

```
/function dc:api/install

```
The command loads the index.
Dynamic building may take some time, please be patient.

#### Index usage
After loading is complete, the index can be used to generate the model.
You can generate a marker or item display frame (item_frame) with specified data in any way (only supports 1.21.5+) (that is, with dc_placetag and the specified index in data) to generate the specified custom model.

```
mcfunction
/give @s minecraft:cow_spawn_egg[entity_data={id:"minecraft:marker",Tags:["dc_place"],data:{index:"#YOURINDEX#"}}]
```


```
mcfunction
/give @s minecraft:item_frame[entity_data={id:"minecraft:item_frame",Tags:["dc_place"],data:{index:"#YOURINDEX#"}}]
```
#### Model type
After dc2.0.0, three new model types are introduced, among which`Fixed`and`Light`The type is a fixed model, and it is recommended to generate it through the item display box.


#### Index data inheritance
An inheritance field can be used in the markup entity. The syntax is the same as the index registration data, and it will be merged into the data when the model is generated. Some data can be set individually for specific items.

Here is an example of a spawn egg:

```
mcfunction
/give @s minecraft:cow_spawn_egg[entity_data={id:"minecraft:marker",Tags:["dc_place"],data:{index:"#YOURINDEX#",inheritance:{item:{id:"apple"}}}}]
```
### Event
Currently supports basic events: rotation, translation, sitting, destruction, etc.  
Most parameters can be left out, in which case the default values ​​apply.  

#### Destruct
Destroy the model.

Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`destruct`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="particle"/>Particles generated when destroying the model;
  + <node type="string" name="sound"/>The sound effect played when destroying the model;
  + <node type="any" name=""/><node type="compound" name="item"/>Control the dropped items produced by destroying models in non-creative mode:
    <br>· If this parameter is not included, no drops will be generated;<br>· If a null value or any string is passed in, a default drop will be generated (in the index`item`The specified item, and also contains the index value that generated the model)<br>· If a compound tag is passed in, the dropped items will be modified according to the rules:
    + <node type="string" name="mode"/>(`add`|`replace`|`inherit`) determines item data and merging mode (default is`add`）：
        <br>· `add`: Change the following parameters (`item`or`loot_table`) merges the item data specified in **with the item data** in the **index<br>·`replace`: Directly use the item data specified in the parameter, discarding the item data in the index; **Note:** The item data will still be obtained from the index when repositioning;<br>·`inherit`: Discard the item data in the index and dynamically obtain the item data from the model's item display entity.
    + <node type="compound" name="item"/>Specifies the item data of the dropped object
    + <node type="string" name="loot_table"/>Use loot table to specify drop data, which will be the same as`item`Merge data in, if there is a tag with the same name,`item`cover`loot_table`middle tag;


</div>

#### Move
Mobile model.

Parameters:
<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`move`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="type"/>Translation event type. The following five values are accepted:
    <br>`X` | `Y` | `Z`:Absolute path movement, translation on the specified axis. <br>`R`: Move the model horizontally relative to the position of the player and model. <br>`V`: Move the model vertically relative to the position of the player and model.
  + <node type="float" name="distance"/>(-2f~2f) translation distance. The value needs to be between -2 and 2. If it exceeds it, it will be forced to the nearest boundary value. The default value is 0f.

</div>

If type is "X", "Y", "Z", then the positive value moves to the positive direction of the corresponding axis, and the negative value moves to the corresponding negative direction;
If type is "R" or "V", then positive values will move away from the player, and negative values will move towards the player.

#### Rotate
Rotate the model.

Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`rotate`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="type"/>Translation event type. Accepts the following two values:
    <br>"H": Horizontal rotation; "V": Vertical rotation. The default value is H.
  + <node type="float" name="distance"/>(-180f~180f) Angle of rotation. The value needs to be between -180 and 180, otherwise it is forced to the nearest boundary value. The default value is 0f.

</div>

#### sit
You can sit on the model.

Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`sit`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="compound" name="orient"/> is always an empty tag. When it exists, the orientation of the player at the moment he sits will be corrected to the orientation of the model.

</div>


#### sound
Make a sound.

Parameters:
<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`sound`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="sound"/>Sound effect id, the sound effect played;

</div>

#### Conversion (trans)
Converting a model to another registered model will overwrite the original data with all the data of the corresponding model.
Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`trans`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="index" required=true />The index of the model to be converted. If this parameter does not exist, event registration will fail; if this parameter points to a registered index name, no modification will be made.
  + <node type="string" name="func"/>(optional) After conversion, mark entity as the function executed by the executor.

</div>

> In the function of this event, the marked entity can be selected using @s; the bound display entity and interactive entity have`dc_trans_display`and`dc_trans_interaction`tag.

#### Scale
Models can be zoomed in and out.

Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`rotate`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="float" name="scale"/>The change value of the model size, positive value means enlarging, negative value means reducing.

</div>

Limitations: The scale itself has no range restrictions, but the model has the following restrictions after zooming in and out:
    - Model magnification is between 0.1 and 10
    - Either width or height of the interactive entity cannot be less than 0.1
    - The display entity height cannot be greater than 10

Remarks:
This event will call the update module to automatically update the model;

#### Prefabricated events (pre)

Prefabricated events are a type of special events, which are specific ordinary events with fixed parameters. Therefore, there is no need to specify additional arg (it has no effect if specified). Used to simplify operations.

During use, fill in events`pre/&lt;predefined event name>`That’s it.

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, fill in here`pre/&lt;predefined event name>`;

</div>

Currently available pre-made events:
-`move_r_1px`: Move horizontally by 1 pixel (push)
-`move_r_-1px`:Move horizontally -1 pixel (pull)
-`move_y_1px`: Move 1 pixel vertically (top)
-`move_y_-1px`: vertical movement -1 pixel (bottom)
-`rotate_h_225`: Rotate horizontally 22.5 degrees (clockwise)
-`rotate_h_-225`: Horizontal rotation -22.5 degrees (counterclockwise)
-`rotate_v_225`: Vertical rotation 22.5 degrees (clockwise)
-`rotate_v_-225`: Vertical rotation -22.5 degrees (counterclockwise)
-`scale_02`:Zoom 0.2x (large)
-`scale_-02`:Zoom -0.2x (small)

#### Debug event: update (update)
1. Update the data structure of the model to the version of dc, 2. And synchronize it with the current index information

Parameters: none

Remarks:
- After the update is completed, an update completion message will be output to the interactive player.`$silent_update`of`dc_options`If the scoring item is set to 1, the information will not be output.
- Use the debug stick to left-click the model to trigger update events

#### Debug event: information (info)
Output the model's attribute information to the player chat bar, including the model's uid, index, zoom factor, version, last update time, current time, etc.

Parameters: none

Remarks:
- Use the debugging stick to right-click the model to trigger information events

#### Process control event: group (group)
Execute a series of events in sequence.

Parameters:
<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`group`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="list" name="events"/> is a list, each item in it is an event, excluding event condition fields.
    + <node type="compound" name=""/>An event.
      + <node type="string" name="event"/> Event name, see details below;
      + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)

</div>


Remarks:
There is no check for the events in the list yet

#### Process control event: random (random)
Select an event from a series of events for execution based on weight.

Parameters:
<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`random`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="list" name="events"/> is a list, each item in it is an event, excluding event condition fields.
    + <node type="compound" name=""/>An event.
      + <node type="string" name="event"/> Event name, see details below;
      + <node type="compound" name="args"/> Parameters, the specific format is determined by the event (if some events do not have parameters, this item does not exist)
      + <node type="int" name="weight"/>Weight. Represents how likely the event is to be selected.

</div>

Remarks:
There is no check for the events in the list yet

#### Reserved words:`__nothing__`Do nothing. Can be used when creating an empty event.

#### Custom events (custom)
This event supports referencing external functions as event execution.

Parameters:

<div class="nbttree">

<node type="compound" name=""/> event.
+ <node type="string" name="event"/>Event name, here is`custom`;
+ <node type="compound" name="args"/>Event parameters:
  + <node type="string" name="func"/>Customized event function path. See below for event definition specifications.
  + <node type="any" name=""/>Optional, other parameters that need to be passed in depend on the event type.

</div>

> Custom event specification:
> The path of the custom event is a folder containing a`execute.mcfunction`file for execution, an optional`check.mcfunction`File used for parameter checking, and other optional helper functions.
> During index building, it will be called`check`The function checks the legality of the parameters; it will be executed when the interaction condition is triggered.`execute`function execution event.

> Some interface information you need to know:
> 1. The executed function can be a macro function, and the parameters will be passed in in the form of a function macro and can be called directly;
> If you don't want to use macro method calls, you can visit

```
storage dc events.temp.target.args

```
path.
> 2. When checking function execution, the parameters will be stored in

```
storage dc:temp event.args

```
Under the path, you can check and modify the parameter information in the path. After completion, the modified information will be merged into the index data. When problems such as incorrect parameter settings are detected, you can`#check`of`dc_temp`If the score item is set to 1, the event will not be added to the indexed event list.
> 3. Each model in this package consists of three entities, one with

```
dc_pivot

```
The tag entity of tag, a tag with

```
dc_display

```
Tag's display entity, one with

```
dc_interaction

```
tag’s interactive entity;
> The function takes the marked entity as the executor and its location as the execution location. In addition, the ycoordinate of the displayed entity is 0.5 blocks higher than the ycoordinate of the marked entity. You need to pay attention when moving the model.
> Available

```
dc_custom_pivot

```
，

```
dc_custom_display

```
，

```
dc_custom_interaction

```
To select the mark of the interactive model, display entity, and interactive entity respectively.
> 4. When executing (any) event, the player that triggered the click event has

```
dc_click_temp

```
tag, you can use this tag to find the corresponding player.


### Template (Template)
It is a development tool to assist in building model data and is part of the index data, which will be merged into the index data during index construction.
Repeated parts in the index can be registered as templates to reduce the use of repeated code.
#### Template registration
Create a new function and write template data in the following format:

```
mcfunction
data modify storage dc:template <name> set value <data>
```

`name`is the template name,`data`It is template data and is part of the (incomplete) data of the index. The format refers to [Index Data Format] (#index-index), does not include`template`option (i.e. nested template calls are not supported), and all keys are optional.

After completing the template registration, create a file named`template`functiontag(`dc/tags/functions/template.json`), add the template function.
Last executed

```
/reload

```
instruction.
#### Template usage
When registering the index, write the name of the registered template in the index`template`Just click on the options.
#### Existing template
DC has two built-in simple templates that can be called when registering the index.
basic:

```
snbt
{   
    modsize:[1f,1f,1f],
    interactsize:{height:1f,width:1f},
    events:{
        left_click:{
            fallback:{event:"destruct"},
            criteria:[]
        },
        right_click:{
            fallback:{event:"__nothing__"},
            criteria:[]
        }
    }
}
```
Basic model template, left click to destroy the model.

default:

```
snbt
{
    modsize:[1f,1f,1f],
    interactsize:{height:1f,width:1f},
    events:{
        left_click:{
            criteria:[
                {
                    event:"move",
                    item:{id:"minecraft:stick"},
                    args:{distance:-0.2f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:shears"},
                    args:{angle:-45.0f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:blaze_rod"},
                    args:{type:"V",angle:-22.5f}
                }
            ],
            fallback:{event:"destruct"},
        },
        right_click:{
            criteria:[
                {
                    event:"move",
                    item:{id:"minecraft:stick"},
                    args:{type:"R",distance:0.2f}
                },
                {
                    event:"rotate",
                    item:{id:"minecraft:shears"},
                    args:{angle:45.0f}
                },
                {   
                    event:"rotate",
                    item:{id:"minecraft:blaze_rod"},
                    args:{type:"V",angle:22.5f}
                }
            ],
            fallback:{event:"__nothing__"}
        }
    }
}
```
The default model template, based on the basic template, adds the events of moving the model with a wooden stick, rotating the model horizontally with scissors, and rotating the model vertically with a flaming rod. Left and right clicks can exert opposite effects.

### Settings
in`dc_options`There are some setting options within the scoreboard.

Already set:`$auto_install`: Set to 1 to automatically load model index data during reload;`$silent_update`: Set to 1 to no longer output information to the player when updating the model;`$silent_register`: Set to 1 to no longer output information to the player when registering a new model;

Visual setting interface: input

```
/function dc:menu/main

```
, call out the settings page and you can visually adjust the above options.
