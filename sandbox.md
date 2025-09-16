# 沙盒

香草图书馆御用沙盒及涂鸦墙

---

最近收录：
- [bookshelf中文文档](https://docs.mcbookshelf.dev/zh-cn/master/)

---

↓暂时弃用的狐狐版nbt树

<NBTTree code='
@Desc<"这是一个测试数据结构">
data Test: floating_ui:Item {
    @Desc<"这是一个测试元素">
    a as int;
    b as (string|float);
    @Desc<"这也是一个测试元素">
    c as floating_ui:Item; 
    @Desc<"这是一个测试嵌套元素">
    d as data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
        d as data {
            @Desc<"这是一个测试嵌套子元素">
            child as int;
            qwq as float;
        };
    };
    @Desc<"这是一个测试列表">
    e as list<floating_ui:Item>;
    f as list<data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
    }>;
}'
/>

可以使用自定义vue控件`NBTTree`实现：

```vue
<NBTTree code='
@Desc<"这是一个测试数据结构">
data Test: floating_ui:Item {
    @Desc<"这是一个测试元素">
    a as int;
    b as (string|float);
    @Desc<"这也是一个测试元素">
    c as floating_ui:Item; 
    @Desc<"这是一个测试嵌套元素">
    d as data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
        d as data {
            @Desc<"这是一个测试嵌套子元素">
            child as int;
            qwq as float;
        };
    };
    e as list<floating_ui:Item>;
    f as list<data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
    }>;
}'/>
```

`code`中是NBT数据结构的格式。这既不是mcdoc也不是snbt，而是`mcfpp`。有关Project MCFPP中NBT数据模板的详细介绍可以查看[数据模板](https://www.mcfpp.top/zh/quickstart/09template/01define-and-instantiate.html)。这里仅仅讲解最基础的内容。

在`NBTTree`控件的`code`中编写MCFPP代码。其中，`data <名称> (: 继承模板) {...}`定义了一个NBT数据模板。名称只能是大小写字母、下划线和数字。其后的`: 继承模板`可选，可以让这个模板继承一个或**多个**数据模板的成员，具体会渲染为一个可折叠的"xxx共通标签"。之后的花括号里面定义数据模板的成员，格式是`名称 as 类型`。如果使用`(类型1|类型2|类型3|...)`则代表一个联合类型，具体渲染为多个并列的类型图标。

::: details NBT类型（点击展开）

解析器使用了枚举变量了来渲染NBT树中的NBT类型图标。具体的对应关系如下：

<NBTTree code='
data Example {
    @Name<"NBTType.Byte">
    Byte as byte;
    @Name<"NBTType.Short">
    Short as short;
    @Name<"NBTType.Int">
    Int as int;
    @Name<"NBTType.Long">
    Long as long;
    @Name<"NBTType.Float">
    Float as float;
    @Name<"NBTType.Double">
    Double as double;
    @Name<"NBTType.ByteArray">
    ba as ByteArray;
    @Name<"NBTType.IntArray">
    ia as IntArray;
    @Name<"NBTType.LongArray">
    la as LongArray;
    @Name<"NBTType.String">
    String as string;
    @Name<"NBTType.List">
    List as list<byte>;
    @Name<"NBTType.Compound">
    Compound as compound;
    @Name<"NBTType.Boolean">
    Boolean as bool;
}
'/>

香草图书馆支持解析的所有NBT类型，具体的对应关系如下：

|标识符|类型枚举变量|标识符|类型枚举变量|
|-|-|-|-|
|`byte`|`[NBTType.Byte]`|`short`|`[NBTType.Short]`|
|`int`|`[NBTType.Int]`|`long`|`[NBTType.Long]`|
|`float`|`[NBTType.Float]`|`double`|`[NBTType.Double]`|
|`ByteArray`|`[NBTType.ByteArray]`|`IntArray`|`[NBTType.IntArray]`|
|`LongArray`|`[NBTType.LongArray]`|`string`|`[NBTType.String]`|
|`list`*注1|`[NBTType.List]`|`compound`|`[NBTType.Compound]`|
|`bool`|`[NBTType.Boolean]`|`text`|`[NBTType.String, NBTType.Compound, NBTType.List]`|
|`UUID`|`[NBTType.IntArray]`|`any`|`[NBTType.Other]`|

注1：列表需要有一个泛型参数，即`list<T>`。详细见下文。

:::

使用`xxx as data {...}`的方法定义一个嵌套的复合标签。使用`xxx as list<data {...}>`表示一个列表里面的所有元素都是特定格式的复合标签。

`@xxx<xxx>`是MCFPP中的注解。`@Desc<"描述">`定义了随后的NBT数据模板或者元素的描述信息。`@Name<"名字">`则定义了这个元素实际上会渲染的名字，可以用于当元素的名字和MCFPP关键字冲突的时候（比如`if`之类的）。

使用`namespace:id`的命名空间ID的形式可以在继承或者定义类型的时候引用其他模板。除了香草图书馆默认提供的一些模板以外，你可以在Markdown文档的开头使用`script`代码块和`compileToCache`方法定义你需要的数据模板。

```vue
<script setup>
  import {compileToCache} from "/.vitepress/MCFPPNBTParser";

//第一个参数是数据模板的命名空间ID，第二个是要解析的代码，和NBTTree中的格式一致
  compileToCache('sklibs:command',`
@Desc<"函数对象">
data CommandObj {
    @Desc<"需要执行的函数"> cmd as string;
    @Desc<"函数参数"> args as compound;
}
`);

</script>
```

随后，你就可以在后续同一页面的`NBTTree`中使用这个数据模板。

```vue
<NBTTree code='
@Desc<"函数参数">
data config {
    @Desc<"升空时间（tick）"> life as int;
    @Desc<"升空时间延迟结束后执行的命令"> cmdv as list<sklibs:command>;
}
'/>
```

::: danger
在使用NBTTree渲染的时候，`code`字段中的内容**不能**包含空行，否则会导致页面渲染错误。
:::
