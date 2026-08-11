---
title: "Implementing data binding in MC's UI"
---

<FeatureHead
    title = "Implementing data binding in MC's UI"
    authorName = "Alumopper"
    resourceLink = 'https://github.com/Alumopper/Floating-UI'/>


## Introduction

> If you still don’t know what Floating UI is, see [here](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202506/0/content.html) will do.

Book continues above. Floating UI uses NBT data to define layout data. Just imagine, suppose we want to make a scrolling list whose content is the player's backpack items. How should we do it?`list`one of them`child`List field, which defines the elements to be displayed in the list. So, we just need to iterate through the player backpack list and add it based on the content`sprite`Control data is just fine.

Hmm... "Just need", it sounds like traversal is very convenient (

As we all know, it is very troublesome to complete a traversal operation in MC, and it can only be completed by recursion. Moreover, it is obvious that this requirement is very common, and we need to write repeated code many times. Although this is a must-evaluate part of the data pack, we are not Mojang and will not let you taste a bunch of things, so we definitely need to provide a very convenient thing.

Let's see how this kind of problem is solved in other UI frameworks. WPF, the most powerful Windows desktop development framework in the universe, provides two things: template (Template) and data binding (Data Binding) to elegantly solve such problems.

```xml
<!--ItemsControl is used to display the data collection, and ItemsSource is bound to the data source of the ViewModel.-->
<ItemsControl x:Name="listControl" ItemsSource="{Binding ItemList}">

    <!--Define the display template for each data item-->
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <!--Each data item appears as a bordered block of text-->
            <Border Margin="5" Padding="10" Background="LightBlue">
                <TextBlock Text="{Binding Name}" FontSize="16"/>
            </Border>
        </DataTemplate>
    </ItemsControl.ItemTemplate>
</ItemsControl>
```


```cs
// MainWindow.xaml.cs
using System.Collections.Generic;
using System.Windows;

namespace WpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            //Create test data
            var items = new List<Item>
            {
                new Item { Name = "项目1" },
                new Item { Name = "项目2" },
                new Item { Name = "项目3" },
                //You can continue to add more items to test the scrolling effect
            };

            //Set data context
            DataContext = new ViewModel { ItemList = items };
        }
    }

    //Data model class
    public class Item
    {
        public string Name { get; set; }
    }

    //ViewModel class
    public class ViewModel
    {
        public List<Item> ItemList { get; set; }
    }
}
```
can't read? It’s okay, meow. To put it simply, a template is defined, which will generate corresponding UI elements based on the data in the data source. Isn’t it very convenient? Therefore, we also need to make such a function.

## Results

In Floating UI, there is`list`and`stackpanel`Both controls have`child`List fields, both controls support templates and data binding. If`child`The field is defined as a *data source*, and an additional`template`Field, Floating UI will automatically generate UI elements based on the template and data source.

```json
{
    "type": "list",
    "size":[5f,5f],
    "template": {   //template
        "type":"button",
        "size":[1.2f,1.2f],
        "item":{
            "id":"apple"
        }
    },
    "child": {
        "path": "temp qwq.value",   //data source
        "binds": [  //Binding relationship
            {
                "source": "id",
                "target": "item.id",
            }
        ]
    }
}
```
In the above example,`template`in is a control, that is, a template, and`child`It should have been a list, but here it is defined as a composite tag, indicating a data source reference.`child.path`is a`storage`Path, the first half separated by spaces is the namespaceID of the storage, and the second half is the nbt path in this storage, which must correspond to a list.`child.binds`The list describes a binding relationship in which`source`The field represents the path in the data source,`target`The field represents the path in the template. In this binding relationship, the`minecraft:temp`middle`qwq.value`A list serves as a data source, in which each element`id`fields will be included in the template`item.id`The value of the field, thereby generating a button.

At this point, the UI is still only generated from an existing data. If the content in the data source changes, the UI will not be automatically updated. At this time, it is`set_property`It’s time for function to appear. By using`floating_ui:datasource/set_property`The function sets the content in the data source and can automatically trigger UI updates. Of course, this function must be set up. After all, it is impossible for us to poll the content in the data source every tick. This would be too expensive. In fact, in WPF, it is also used`SetProperty`This method triggers events to notify the UI to update.

Use it like this`set_property`function：

```mcfunction
data modify storage floating_ui:temp binding.path set value "minecraft:temp qwq.value"
data modify storage floating_ui:temp binding.value set from entity @p Inventory
floating_ui:datasource/set_property
```
It's that simple~

## Principle

to`stackpanel`For example. in its`_new`In function, it will be judged`child`Whether the field is a list. If it is not a list, it means it is a data source, then data binding may be used, so enter`./template/append_template`in function.

```mcfunction
# template: (string|compound)
#If not inline data, get the data template
execute unless data storage floating_ui:input temp.template.type run return run function log:_error {msg: "无效的模板"}
# temp.child: {value: [...], path:xxx, binds: [source:xxx, target: xxx]}
#If there is binding, register the binding, obtain the binding data, and store it in source.value. If there is no binding, it means that the data source is declared directly and does not participate in binding.
execute if data storage floating_ui:input temp.child.path if function floating_ui:element/stackpanel/template/register_binding run function floating_ui:element/stackpanel/template/set_source with storage floating_ui:temp binding
#Parse the source data saved in temp.child.value
function floating_ui:element/stackpanel/template/update_source
```
This function is divided into three steps. The first step is to register data binding; the second step is to parse the content in the data source for the first time; the third step is to update the UI according to the content of the data source.

### Register data binding

First, pass`if function`Subcommand call`floating_ui:element/stackpanel/template/register_binding`function。

```mcfunction
# floating_ui:element/stackpanel/template/register_binding

#Register binding
data modify storage floating_ui:temp binding.path set from storage floating_ui:input temp.child.path
function floating_ui:datasource/register_binding
#Write binding information in entity
function floating_ui:element/stackpanel/template/register_binding_1 with storage floating_ui:input temp.child
return 1
```


```mcfunction
# floating_ui:element/stackpanel/template/register_binding_1

$data modify entity @s item.components."minecraft:custom_data".register_binding."$(path)" set value 'function floating_ui:element/stackpanel/template/before_update_source'
```


`floating_ui:datasource/register_binding`Function is used to register a data binding globally and bind this UI control to this path. We will look at the details of this function later. and`floating_ui:element/stackpanel/template/register_binding_1`is a macro function. previously`_new`The function uses the display entity corresponding to the current control as the context, so in the macro function, the information of the data binding event is written - when`$(path)`When the content in the corresponding data source changes, it will be executed`floating_ui:element/stackpanel/template/before_update_source`function.

:::tip
You may find that almost all content related to macro functions in Floating UI will open a separate function to ensure that the amount of commands in a single macro function is as small as possible. This is because in macro functions, even ordinary commands will occupy the macro's parsing events, and short macro functions are of great help to improve the overall execution efficiency.
:::

Look back`floating_ui:datasource/register_binding`function. What needs to be remembered is that the execution context of this function should also be the display entity corresponding to the control.

```mcfunction
# floating_ui:datasource/register_binding

execute store result score _ int run function floating_ui:datasource/get_or_create_data_id with storage floating_ui:temp binding
#Set entity binding
function floating_ui:datasource/register_binding_1
```


```mcfunction
# floating_ui:datasource/get_or_create_data_id

$execute unless data storage floating_ui:data binding.id."$(path)" store result storage floating_ui:data binding.id."$(path)" int 1.0 run scoreboard players add _static_index floating_ui.data_id 1
$return run data get storage floating_ui:data binding.id."$(path)"
```


```mcfunction
function floating_ui:datasource/register_binding_1

#This control has data binding
scoreboard players set @s floating_ui.data_id 0
execute unless score @s floating_ui.data_id_0 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_0 = _ int
execute unless score @s floating_ui.data_id_1 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_1 = _ int
#...The exhaustive part is omitted
execute unless score @s floating_ui.data_id_20 matches -2147483648..2147483647 run return run scoreboard players operation @s floating_ui.data_id_20 = _ int
function log:_error {msg: "Failed to register binding: No data_id is available"}
#Binding failed, remove binding tag
scoreboard players reset @s floating_ui.data_id
```


`get_or_create_data_id`The function will get the unique ID value of the data source (actually the path), and if it does not exist, create an ID. Unfortunately, if the scoreboard is used to store IDs, the performance here should be greatly improved, but our data source contains spaces, and the scoreboard's points cannot contain spaces. So, you can only use storage to store IDs. function use`return`command returns the ID of this data source, and in`register_binding`Save it temporarily.

Next, in`register_binding_1`, it is to bind the control (that is, the display entity) and the ID of this data source (that is, the path). entity`floating_ui.data_id_x`The value corresponds to the data source to which it is bound. There are 20 entities`data_id`scoreboard, from`data_id_0`arrive`data_id_20`, which means that a control can support the binding of up to 21 data sources. If there are no free binding bits, the binding will fail and a prompt will be given. In fact, this approach is equivalent to using a static array with a length of 21. From the perspective of generality, a variable-length list should be used here, that is, a list type NBT should be used for storage. But accessing the list is expensive, and 21 binding bits are enough in most cases.

### Obtain content from the data source for the first time

back to the beginning`append_template`function. The next step is to use`function floating_ui:element/stackpanel/template/set_source with storage floating_ui:temp binding`to parse the content in the data source. This step is very simple and only uses a macro command.

```mcfunction
$data modify storage floating_ui:input temp.child.value set from storage $(source)
```
It temporarily stores the parsed results`value`in the field. The later parsing part updates the UI based on this content.

### Update the content in the data source

Let's not talk about parsing first, let's talk about what happens when the data source is updated. Because whether it is initialization or update, the same function is called for parsing, so it is better to talk about it later.

To update the contents of the data source is to use`function floating_ui:datasource/set_property`function is completed. We said before that before using this function, you need to give`floating_ui:temp binding`in`path`and`value`Copy respectively represents the data source path and the content to be assigned. The function looks like this:

```mcfunction
# floating_ui:temp binding
# {path: xxx, value: xxx}
execute store result score _ int run function floating_ui:datasource/get_or_create_data_id with storage floating_ui:temp binding
#Set value
function floating_ui:datasource/set_value with storage floating_ui:temp binding
execute if score isChanged _ matches 0 run return 0
#Notify all UI refreshes
scoreboard players operation now floating_ui.notify_id = SOURCE_UPDATE floating_ui.notify_id
execute as @e[tag=floating_ui_control] run function floating_ui:datasource/set_property_1
```
First of all, it’s familiar`floating_ui:datasource/get_or_create_data_id`, obtain the unique ID of the data source. Then use a simple macro command to set the value of the data source. A little trick is used here, that is, if the value to be set is the same as the original value,`data`The command will return failure. By getting the return value of command, we can know whether the data source has changed before and after setting it, so as to decide whether to refresh the UI, thus saving performance.

After that, all UIs are notified to refresh. From the perspective of scalability, considering that in addition to data source updates, there may be other notification events in the future, here use`floating_ui.notify_id`The scoreboard represents the event ID, while`SOURCE_UPDATE`Constants represent data source update events. After that, all UIs are traversed and the UI bound to the corresponding data source is notified to refresh, that is,`set_property_1`function. This function is still a lengthy exhaustive process, which can be understood at a glance.

```mcfunction
#Check the binding slots in turn to determine whether the data source is bound.
execute if score @s floating_ui.data_id_0 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
execute if score @s floating_ui.data_id_1 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
# ...
execute if score @s floating_ui.data_id_20 = _ int run return run function floating_ui:macro/notify with entity @s item.components."minecraft:custom_data".data.ui
```


`floating_ui:macro/notify`The content is like this:

```mcfunction
$function floating_ui:element/$(type)/_notified
```
This is actually a trick similar to *polymorphism*. Each control stores a`type`The field represents the type of control. The command built based on this field can call the function of the corresponding control. for`stackpanel`For example, its function is like this:

```mcfunction
function floating_ui:element/control/_notified

#0 - Source update notification
execute if score now floating_ui.notify_id = SOURCE_UPDATE floating_ui.notify_id run function floating_ui:element/list/binding/update_source
```
First, the first step is to call the function of its base control (parent class), because generally the child control should inherit the event processing logic of the parent control, and then its own logic, that is, to handle the notification event of the data source update, call`floating_ui:element/list/binding/update_source`function。

```
mcfunction
#Get the update behavior of bound data
function floating_ui:element/list/binding/update_source_1 with storage floating_ui:temp binding
#perform update
function floating_ui:macro/action with storage floating_ui:temp binding_info
```
Still considering it from the perspective of scalability, since there may be multiple bindings, not all field bindings necessarily call one method, or it should be said that only`child`Only the binding of fields will call the function of updating the list control, so first you need to pass`update_source_1`The macro function obtains the update behavior of the bound data. When we registered data binding before, the things we wrote into the entity came into use here.

```mcfunction
$data modify storage floating_ui:temp binding_info.action set from entity @s item.components."minecraft:custom_data".register_binding."$(path)"
```
followed by a brief`floating_ui:macro/action`Tool function, just used to execute`binding_info.action`command stored in .

```mcfunction
$$(action)
```
(It’s really short, meow)

So we will actually call the target function previously written in the entity, that is`floating_ui:element/stackpanel/template/before_update_source`function。

```
mcfunction
#floating_ui:temp binding
#{path: xxx, value: xxx}
data modify storage floating_ui:input temp.template set from entity @s item.components."minecraft:custom_data".data.ui.template
data modify storage floating_ui:input temp.source.binds set from entity @s item.components."minecraft:custom_data".data.ui.source.binds
data modify storage floating_ui:input temp.source.value set from storage floating_ui:temp binding.value
#Remove all existing child controls
#Delete child node
execute on passengers run function floating_ui:dispose_control with entity @s item.components.minecraft:custom_data.data.ui
#update source
function floating_ui:element/stackpanel/template/update_source
```
This is for compatibility`floating_ui:element/stackpanel/template/update_source`Perform a series of assignments on the required NBT data structure pattern, and remove existing sub-controls on the current control to prepare for subsequent updates. Finally, call`update_source`function to update the UI.

Now, we can finally talk about`update_source`function.

### Analysis`floating_ui:element/stackpanel/template/update_source`The content is as follows:

```
mcfunction
# floating_ui:input temp.child: {value: [...], path:xxx, binds: [{source:xxx, target: xxx}]}

#Traverse function and determine parameters
data modify storage floating_ui:temp temp.source.value set from storage floating_ui:input temp.source.value
execute unless data storage floating_ui:temp temp.source.value[0] run return run function log:_error {"message":"Data source must be a list"}

#Override manually defined child elements
data modify storage floating_ui:input temp.child set value []

function floating_ui:element/stackpanel/template/update_source/loop

scoreboard players set isUpdate _ 1

#child element
function floating_ui:element/stackpanel/child
```
That's right, the tedious traversal is completed here. There are a total of two traversal processes here, the first one is traversal`value`The data in the list, the second one is traversed`binds`Binding relationships in the list, and apply each relationship to the template to obtain the new subspace layout data, stored in`child`in the list.

::: details related functions

```
mcfunction
# floating_ui:element/stackpanel/template/update_source/loop

#There are no elements left, return
execute unless data storage floating_ui:temp temp.source.value[0] run return 0

#Make a copy of the template
data modify storage floating_ui:temp temp.template set from storage floating_ui:input temp.template
#Copy binding parameter table
data modify storage floating_ui:temp temp.source.binds set from storage floating_ui:input temp.source.binds

#binding replacement
function floating_ui:element/stackpanel/template/update_source/params_loop

#Get the template and add it to the child list
data modify storage floating_ui:input temp.child append from storage floating_ui:temp temp.template

data remove storage floating_ui:temp temp.source.value[0]

function floating_ui:element/stackpanel/template/update_source/loop
```


```
mcfunction
# function floating_ui:element/stackpanel/template/update_source/params_loop

#There are no elements left, return
execute unless data storage floating_ui:temp temp.source.binds[0] run return 0

#binding replacement
function floating_ui:element/stackpanel/template/update_source/get_source with storage floating_ui:temp temp.source.binds[0]

data remove storage floating_ui:temp temp.source.binds[0]

function floating_ui:element/stackpanel/template/update_source/params_loop
```


```
mcfunction
# function floating_ui:element/stackpanel/template/update_source/get_source

$data modify storage floating_ui:temp temp.template.$(target) set from storage floating_ui:temp temp.source.value[0].$(source)
```
:::

When all child control layout data is written`child`After the list, call`function floating_ui:element/stackpanel/child`function, generates child controls. At this step, it is the same as directly declaring`child`The list is the same, so I won’t go into details here.

## Summary

Through data binding and templates, we can easily dynamically generate UI elements based on the data source, and automatically update the UI when the data source changes. In this way, we can easily implement functions such as scrolling lists. Within this framework, not only`child`fields, other attributes, such as`text`，`item`Wait, you can also use data binding to dynamically update, but it has not been implemented yet. In the future, Floating UI will continue to improve functions in this area, making it easier for everyone to use data binding to implement dynamic UI.
