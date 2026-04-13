# 开发经验分享：实体树及面向对象

>轩宇1725

## 摘要

本文参考站内收录的 [你必须立刻抛下一切世界实体，来使用新一代的影算子 - Rainbow](https://etis.vcsofficial.site/d/62) 和 [minecraft指令烹饪指南：凉拌实体选择器 - 创小业](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/2/content.html) 两篇文章，分享一种基于类似 **树(Tree)** 结构的实体管理和操作方法。

## 约定

由于参考的一篇文章中对同一个概念使用了不同的叫法，这里统一使用 **世界实体** 代指第一篇文章中的 **算子**，定义为在世界中存在的有固定UUID的唯一对象。而对 **实体指针** 的讨论将不再局限于世界实体，任何能充当在上下文内快速访问另一个实体的对象都可以被称为实体指针。

## 实体指针简介

实体指针是一种快速访问另一个实体的对象，一般是一个实体。由于 Mojang 提供了 `execute on` 子命令来将执行者切换为与该实体有一定关联的另一实体上，这个查找远比用选择器参数优化后的 `@e` 还快，我们将使用这个特性来将不同的对象之间建立联系。

在我们的例子中使用了 `passenger` 指针和 `origin` 指针，前者是一种连带位置绑定的指针，后者则是一个纯粹的访问指针。注意，本文介绍的实体树仅建立在 `passengers` 指针的基础上，这种指针能够保证树的合法性（具有唯一根，且一个乘客不可能通过Passengers指针指向它的坐骑实体(vehicle)或其他枝上的实体）

注意，实体树的根实体目前十分受限，因为根实体唯一且承担重要作用，但展示实体的插值功能和其他大多数实体的物理功能并不能兼备（这可能会在 Mojang 引入实体组件后解决）。此外，在需要的骑乘锚点不唯一的情况，实体树将不适合只使用 `passenger` 指针构建，甚至实体组可能不再是树形结构。

## 实体树的核心思想

“树”是图论中的一种概念，是各个节点的一种连接方式，满足：

1. 只有一个根节点（Root），没有父节点。

2. 每个节点有零个或多个子节点（Children），但只有一个父节点（Parent）。

3. 没有环路（Cycle），即不存在一个节点既是另一个节点的祖先又是它的后代。

这由 `passenger` 指针自然满足，因为每个实体只能有一个坐骑

实体树是通过骑乘关系来让不同的实体在客户端和服务端上都成为一个连通的整体，只要能访问到最下面的实体（称为 **根实体(Root)**），就能通过骑乘关系访问到树上所有的实体。通过在根实体上执行 `execute on passengers` 来访问树上的其他实体，我们可以实现非常高效的实体访问和操作。注意，有少数几个实体不能被 `/ride` 控制骑乘，这些实体必定是树上的叶子实体（即没有子节点的实体）。

> (命令/ride - Minecraft Wiki) 该命令不能为玩家、标记$^\text{[仅Java版]}$、拴绳结、闪电束和浮漂添加乘客。

## 项目实例

为了显示出实体树的优势，我们先来看一个复杂的实体使用场景，也是我采用实体树方法的初衷：

这个场景中，我们要求用户能在一定距离外看着一个实体，并通过输入操作来控制它的行为。虽然看上去很简单，但实现起来却比较麻烦。我们需要：

1. 多人兼容：每个玩家如何能与一个实体一一对应？我们需要一个机制来确保每个玩家都能正确地找到并操作自己的实体。

2. 控制玩家：由于玩家在这里必须充当摄像头，我们需要引入其他的实体，通过 `/ride` 指令固定玩家的位置。

3. 操作映射：我们在上下文中要先找到玩家，处理他的输入操作，然后再找到对应的实体进行操作的实现。如果每次都使用 `@e` 来寻找实体，效率会非常低下。

可以看到，虽然问题很简单，但具体的操作却比较复杂（特别是当我们希望用少于 `@e^2` 的复杂度来实现时）。既然问题抽象之后很简单，那么我们不妨使用一下面向对象的思维来解决这个问题。

在这个场景中有两类对象（如果将类之间的交流也封装起来那就更多，我们这里讨论更直接的实现），**摄像机对象(Camera)** 和 **角色(Character)**，我们只需要分别实现这两类对象的功能，并让它们之间能够互相通信就可以了。

## 摄像机类的定义

摄像机类需要承担下面的功能：

1. 平滑运动：这要求决定坐标的实体是 **可插值的(interpolatable)** 目前只有展示实体满足这个功能，我们希望插值越平滑越好，而 **物品展示实体(Item Display)** 的根据当前帧来插值的机制就非常适合这个需求。（区别于 **方块展示实体** 的插值机制）。所以我们让物品展示实体作为决定坐标的根实体。

2. 成像：只有玩家本身才能“看到东西”，但由于玩家的特殊性，因此每个摄像机类会在程序中动态绑定玩家。因此我们在实例化类的时候不包括玩家，而正常运作的摄像机对象则要通过某个方式绑定玩家。

3. 观察目标指针：摄像机类需要有一个属性来记录它正在观察的对象，这个对象就是我们上面提到的角色类的实例。可以通过引入一个实体指针来实现这个功能。我们这里采用 **掉落(Item)** ，其 `Thrower` nbt 指向的实体可以通过 `execute on origin` 来快速访问。

4. 玩家指针：摄像机类需要有一个属性来记录它绑定的玩家，这个属性同样可以通过引入一个实体指针来实现，同样使用掉落物来实现。

那么摄像机类的各个部分如示意图：（每个箭头为一个 `execute on` 操作，尽管 `execute on passengers` 不是一个严格的映射……）：

![alt text](tmpbxiefo2.svg)

## 角色类的定义

角色类需要承担下面的功能：

1. 物理功能：角色类需要有一个实体来承担物理功能，方便我们处理碰撞和移动等操作。我们可以用玩家模型、盔甲架、掉落物等实体来承担这个功能。（这里选用盔甲架，因为它可以在头部上装备物品用于显示朝向实体方向的模型）

2. 显示功能：对简单的角色来说，物理功能和显示功能可以由同一个实体来承担（比如盔甲架和玩家模型），但你也可以使用 Animated Java 的展示实体来承担显示功能，通常将他骑在掉落物上，因为掉落物的数据量更小。

3. 操作者指针：角色类需要有一个属性来记录它的操作者，这个属性同样可以通过引入一个实体指针来实现，同样使用掉落物来实现。

示意图：

Animated Java 的方案

![alt text](tmpbxiefo3svg.svg)

或盔甲架的方案

![alt text](tmpbxiefo1.svg)

## 类的实例化及管理

实例化对象即将对应的实体召唤出来，并维护关于这些对象的信息。虽然也可以利用 `execute summon ... run function` 来避免使用 `@e` 的使用。不过，出于教程的目的，我们这里先使用 `@e` 来寻找实体。（事实上创建对象不是频繁的，所以使用 `@e` 来寻找实体并不会有太大的性能问题）

### 角色类

以角色类为例，初始化函数的实现如下：

```mcfunction
# character:init
# 创建角色对象
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

# 递归赋予 id
scoreboard players add #Pointer ObjectID 1
execute as @e[tag=CharacterObject,distance=..1,type=armor_stand] run function object:__assign_id
```

这里的 @e 优化准则可参考 [minecraft指令烹饪指南：凉拌实体选择器 - 创小业](https://vanillalibrary.mcfpp.top/datapack-index/feature/archive/202507/2/content.html) 中关于选择器优化的部分，注意，千万不要在这里使用 `[nbt={}]`，对根实体的 nbt 进行序列化和反序列化时会同时访问全部的乘客实体，导致效率极度低下。

```mcfunction
# object:__assign_id
scoreboard players operation @s ObjectID = #Pointer ObjectID
# 递归, 由于 passenger 是树形结构，所以不需要额外写条件，递归会自动在叶子节点处停下
execute on passengers run function object:__assign_id
```

> 注：在我的项目中，角色类其实由 1 个根实体和 5 个叶子组成，关于其他未提到的对象功能我会在 “简单2D场景的搭建” 后篇中介绍。

下面我们要给该实体定义一些方法，首先是销毁方法，这个方法仅销毁树上的节点，如果你的对象不止一棵树，那么你可能需要根据ObjectID来销毁：

```mcfunction
# character:destroy
# 销毁整个实体树
execute on passengers run function character:destroy
kill @s
```

下面是绑定玩家的方法，这个方法也需要在摄像机对象上实现:

```mcfunction
# character:method/bind_player
# 绑定玩家，假设执行该方法的上下文坐标在玩家的位置，上下文执行者则是该对象的根实体
execute on passengers if entity @s[tag=CharacterController] run data modify entity @s Thrower set from entity @p UUID
```

下面的各类方法是常用的，由于本文的目的是介绍实体树的概念和使用方法，所以我们不对函数的实现细节进行过多的讨论了：

 - `character:method/pull_event`: 抓取控制者的全部输入事件，并对其处理。
 - `character:method/move_(direction)`:移动函数，direction 可以是 forward/backward/left/right/up/down 或两个方向的组合。
 - `character:method/look_(direction)`:转向函数，direction 可以是 left/right/up/down 或两个方向的组合。
 - ...

### 摄像机类

摄像机类的实例化和方法定义与角色类类似，这里不再赘述了。

```mcfunction
# camera:init
# 创建摄像机对象
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

# 递归赋予 id
scoreboard players add #Pointer ObjectID 1
execute as @e[tag=CameraObject,distance=..1,type=item_display] run function object:__assign_id
```

需要实现下面的方法

 - `camera:destroy`: 销毁对象的方法
 - `camera:method/update_location`: 更新摄像机对象根实体的位置
 - `camera:method/update_player`: 重新强制玩家骑乘，并更新玩家的朝向
 - `camera:method/bind_player`: 绑定玩家
 - `camera:method/bind_target`: 绑定观察目标
 - `camera:method/pull_event`: 抓取玩家输入事件的方法(主要是鼠标移动)
 - ...

## 多个树的情况

我们在上面的角色对象中再引入一个新的对象，这个对象作为角色的鼠标指针，它必须与根实体的位置解绑，成为一个自由的实体（本身可能也是一个树）。我们将介绍如何对这个树外的实体进行高效访问。我们把鼠标指针也看做一个类，并将其作为角色实体的子类以演示特殊性，当然你也可以将它作为一个独立的类来实现（这样会更简单）。

鼠标指针必须实现下面的功能:

1. 提供一个位置指示器：可以利用 `marker`, 当只需要位置时，这个实体最好，但它不能被骑乘。如果使用展示实体，那么展示实体可以同时提供位置指示和外观。

2. 提供一个外观：利用展示实体即可。

读者可能会认为，既然这个实体不在树上，那么我们就不能通过 `execute on passengers` 来访问它了，这样我们就无法利用实体指针来访问它了。其实不然，我们完全可以在角色类中引入一个新的实体指针来指向这个实体（或另一棵树的根实体），这个指针同样可以通过 `execute on origin` 来访问。

### 使用世界实体的解决方案

由于问题的特殊性，在我们这里的场景使用marker+展示实体会比只使用展示实体更适合，因为这个展示实体可以放在我们原来的树上，而 marker 则可以利用 **世界实体** 的思维，将一个全局共享的对象作为我们的鼠标指针位置指示器，这样可以将树的数量降到很小。在使用世界实体的情况下，我们就不再需要一个专门的指针来指向它，而是可以使用更快的 `UUID` 进行访问。

对于展示实体的变换计算我们不再赘述（会在 “简单2D场景的搭建” 后篇中介绍）。我们假定已经得到了鼠标指针相对于角色的位置，那么我们就可以通过下面的函数来更新鼠标指针的位置：

```mcfunction
# 查询并保证世界实体被召唤，如果能保证绝对安全则可省略
execute unless entity 0-0-0-0-0 run summon marker 0.0 0.0 0.0 {UUID:[I;0,0,0,0]}
# 我们不讨论内部的具体实现，执行这个函数后 0-0-0-0-0 应该位于我们鼠标指针的位置
execute as 0-0-0-0-0 run function we:mouse_event
```

> **世界实体的安全性**
> 世界实体是一个全局共享的对象，命令在上下文中只关注它提供的接口返回值，但如果接口的实现不安全，导致世界实体被卸载或死亡，那么依赖这个世界实体的功能就会出现未定义的行为或直接得到错误的结果。
> 因此，在实现世界实体的接口时必须保证它的安全性，主要包括：维度安全、区块安全、实体安全等。并在每次调用完毕后都将世界实体放到一个安全的位置。
>
> 在选择世界实体的UUID时，为了避免被其他包借用，我们可以使用一个看起来更加随机，但违反UUID规范的UUID（自然生成的实体不会有这样的UUID）。但出于教程的目的，我们这里直接使用从0-0-0-0-0开始的UUID来作为我们世界实体的UUID。

> 小技巧
> 在nbt中使用 `uuid("带连字符的十六进制格式UUID")` 可以将其自动转换为整数数组格式的UUID，比如 `{UUID:uuid("dab4d1cd-223b-41bd-8084-59d890d935e4")}` 会自动转换为 `{UUID:[I;-625684019,574308797,-2138809896,-1864813084]}` ，这种写法在 Datapack Helper Plus 中似乎未被承认，但在 Minecraft 1.21.5+ $^\text{(需要验证)}$中是完全合法的。

这里的操作需要保证世界实体不被过多占用，不留在可能被卸载的区块，所以我们必须在 we:mouse_event 内完成依赖鼠标指针位置的所有操作，并将其放回安全位置。如果只是普通的位置指示器，可以省略对安全性的严格保证。

对鼠标指针类实现下面的方法：

- `mouse:destroy`
- `mouse:method/update_location`
- ...

## 主循环调度

实现了上面的所有类后，我们就可以在主循环用唯一的 `@e` 入口来处理各个事件了

```mcfunction
# #tick
# 这里提供了唯一 @e 入口，如果在内部不再使用 @e 那么整个系统的实体访问效率就会非常高效
execute as @e[...] run function app:main
```

```mcfunction
# app:main
# 让摄像机对象抓取玩家的输入事件
execute as @s[tag=CameraObject] run function camera:method/pull_event
# 让角色对象抓取玩家的输入事件
execute as @s[tag=CharacterObject] run function character:method/pull_event
```

```mcfunction
# camera:method/pull_event

# 抓取玩家鼠标的偏移量
...

# 更新鼠标指针的位置
    # （通用方案）先索引到可能存在的目标角色，再通过角色对象的指针访问到鼠标指针实体
    execute on passengers if entity @s[tag=TracingTarget] on origin \
        on passengers if entity @s[tag=MouseTarget] on origin \
        run function camera:method/update_location
    
    ...

    # （世界实体方案）
    execute as 0-0-0-0-0 run function we:mouse_event
```

```mcfunction
# character:method/pull_event
# 抓取玩家的输入事件, 先索引到可能存在的摄像机，再通过摄像机索引到玩家
execute on passengers if entity @s[tag=CharacterController] on origin \
    on passengers if entity @s[tag=CameraEntity] on origin \
    if entity @s[predicate=(玩家移动事件的谓词)] run function character:method/move

...
```

这里仅是一个示例，实际上我们可以自由地根据场景调用对象的不同方法。

## 多人兼容性

上面的所有实现都只将玩家看做了对象的一部分，由于我们的对象本来就是由同一个类派生出的不同实例，整个系统理论上自然兼容多人。

但要注意，当玩家被绑定到摄像机后，玩家的下线会导致整个摄像机树消失，无法被索引。因此我们必须将 ObjectID 内有记录但无法被找到的树视作一种特殊情况，并进行处理。

## 总结

本篇文章主要分享了一种基于 `passenger` 和 `origin` 指针访问实体的方式，并在此基础上提出了 **实体树** 和 **世界实体** 的概念和使用方法。在文章中利用了面向对象的思想来简化问题，这样的思想能够使复杂的场景变得十分简洁，并且十分有利于进行多人兼容（在考虑对象之间的关系时就已经包含了玩家之间的关系）

使用 `execute on` 和 `UUID` 访问都比 `@e` 高效，其中 `UUID` 是最高效的，在项目中引入这些指针将极大地提升实体访问的效率，一些复杂的依赖关系可能不再需要频繁使用 @e 互指，从而大大提升性能。

但由于 `passenger` 指针将实体的位置绑定的同时，还将nbt进行了绑定。在对根实体的nbt进行序列化/反序列化时会造成严重的性能瓶颈，建议将大量的信息存储在叶子实体上，这样就不需要访问其他节点的信息。