# 一条命令值多少钱：原版数据包性能优化的源码级参考


**摘要：** 数据包的性能优化，本质上是一门在不同介质之间搬运数据的生意，而不同介质的价钱差着好几个数量级。本文不谈某个具体功能，而是把最常用的四种操作：计分板、命令存储（storage）、宏、实体 NBT 触碰，各自的底层开销，从官方去混淆的源码里逐一挖出来，给出一把可复用的“尺子”。它们的相对开销次序是 `计分板 ≈ 单层存储 ≪ 宏 ≪ 实体 NBT`，且这次序由源码结构决定、稳定可依赖。文末据此提炼几条通用设计准则。任何在原版数据包里追求性能的项目，都可以拿这份参考直接套用。

本文源码取自经 Fabric（loom）拉取的**官方 26.1.2 游戏 jar**（类名、方法名即官方名）。为省篇幅，贴出的代码段做了裁剪，只留核心的几行。

---

## 1. 为什么先要一把尺子

在动手写任何数据包逻辑之前，最好先知道每种操作大概"多贵"。因为搞错了价钱，架构就会长歪：把本可以用计分板表达的中间量塞进实体 NBT，或者用一条参数发散的宏去每 tick 驱动几十个对象，都会让一个逻辑上很简单的功能，跑出几个数量级的额外开销。

麻烦在于，这些开销从命令语法上完全看不出来。`scoreboard players set` 和 `data modify entity` 写起来同样是一行，但底层一个是改内存里一个整数，一个是把整只实体拆了又装。要看清差距，只能下到源码。下面四节，就把四种操作各自的底层动作挖出来。

## 2. 计分板：一次哈希查找加一个整数

计分板是开销最低的一档。每一名"分数持有者"的全部分数，保存在一张以目标（Objective）为键的哈希表中；而每个 `Score` 对象的核心，只是一个 `int` 字段：

```java
// PlayerScores —— 每个分数持有者一张表,键是 Objective,值是 Score
class PlayerScores {
   private final Reference2ObjectOpenHashMap<Objective, Score> scores = new Reference2ObjectOpenHashMap(16, 0.5F);
   ...
}

// Score —— 一个分数的本体就是一个 int
public class Score implements ReadOnlyScoreInfo {
   private int value;
   public int value()            { return this.value; }
   public void value(int score)  { this.value = score; }
}
```

因此 `scoreboard players set` / `add` / `operation` 这类操作，在底层不过是一次哈希查找加一次 `int` 读写：没有序列化，没有对象拷贝，没有文本解析，是内存里最朴素的取数与存数。**凡是能用整数表达的量，都优先落在计分板上运算。**

## 3. 命令存储：内存里的一张表，按引用存取

storage（命令存储）只比计分板略贵。它同样是一张常驻内存的哈希表，区别只在于：计分板的值是一个 `int`，storage 的值是一整棵 NBT 树（`CompoundTag`）。取存这棵树本身依旧廉价，真正花钱的是在树上按路径寻址、改写节点那一步。源码如下：

```java
// CommandStorage —— get 直接返回内存里那棵 NBT 树的引用;set 就是 put + 标记待存盘
public CompoundTag get(Identifier id) {
   CommandStorage.Container container = this.getContainer(id.getNamespace());
   return container != null ? container.get(id.getPath()) : new CompoundTag();
}
public void set(Identifier id, CompoundTag contents) {
   this.getOrCreateContainer(id.getNamespace()).put(id.getPath(), contents);
}

// Container.put —— 放进 HashMap,只是"标脏"等世界保存时才落盘,并不在这里序列化
public void put(String id, CompoundTag contents) {
   if (contents.isEmpty()) this.storage.remove(id);
   else                    this.storage.put(id, contents);
   this.setDirty();
}
```

这段代码有两个要点。其一，`get` 返回的是那棵 NBT 树**本身的引用**，而非一份拷贝；`set` 也只是把引用放回表里并 `setDirty()`。因此每一条 storage 命令都**不触发序列化**，真正的序列化（经 Codec 写入磁盘）只发生在世界存盘的那一刻。其二，单条命令的实际开销约等于“哈希查找一次 + 在树上按路径改写一处”，与整棵树有多大无关，只与被触碰的那条路径深浅有关。

由此可得两个可直接用于设计的结论：**单层、浅路径的 storage 读写，开销与计分板同级**；而路径越深、被改写的子树越大，开销越高。需要额外留意的是 `merge`——它在合并前会把目标整体复制一份：

```java
// DataCommands.mergeData —— old.copy():合并前先把目标那棵树整体复制一份
CompoundTag old = accessor.getData();
CompoundTag result = old.copy().merge(nbt);
```

这里被复制的“目标树”，就是该存储 ID 底下的整个复合标签。因此把单个存储 ID 的内容保持浅而小，`copy()` 便廉价；若在一个存储 ID 下堆积大量数据再对其 `merge`，复制成本将随之线性膨胀。**把工作区拆散到互不嵌套的浅地址上**，是用 storage 的基本纪律。

## 4. 宏：字符串替换、逐宏行重解析，与一个八格缓存

宏比前两者贵得多，但它的开销并非恒定，而是取决于一个容量为 8 的缓存是否命中。宏函数每次被调用时，先要“实例化”，其核心逻辑如下：

```java
public class MacroFunction<T ...> implements CommandFunction<T> {
   private static final int MAX_CACHE_ENTRIES = 8;
   // 缓存:键是"这次代入的参数值列表",值是已经解析好的函数;LRU,容量 8
   private final Object2ObjectLinkedOpenHashMap<List<String>, InstantiatedFunction<T>> cache
         = new Object2ObjectLinkedOpenHashMap(8, 0.25F);

   public InstantiatedFunction<T> instantiate(CompoundTag arguments, ...) {
      List<String> parameterValues = new ArrayList<>(this.parameters.size());
      for (String argument : this.parameters)
         parameterValues.add(stringify(arguments.get(argument)));   // ① 每个参数各转成字符串

      InstantiatedFunction<T> cachedFunction = this.cache.getAndMoveToLast(parameterValues);
      if (cachedFunction != null) return cachedFunction;             // ② 命中:直接返回,不再解析

      if (this.cache.size() >= 8) this.cache.removeFirst();          // ③ 未命中:淘汰最旧的一个
      InstantiatedFunction<T> function = this.substituteAndParse(this.parameters, parameterValues, dispatcher);
      this.cache.put(parameterValues, function);
      return function;
   }
}
```

在解释机制前，先分清两个容易混淆的词。**宏行**，指单独一条以 \$ 开头、带 \$(...) 占位符的命令（即形如 `data` 前面挂个 \$ 的那种）。**宏函数**，指一个**含有至少一条宏行**的函数文件。这两者的区别很关键，因为函数在加载时会按行分流（见 `CommandFunction.fromLines`）：普通行当场就解析成成品命令、以后只复用；唯有宏行被留成"模板"，把解析推迟到运行时。

理清了词，再说清两件事：什么叫“实例化”，以及那个“缓存”怎么运作。

先说实例化。一条普通命令（比如 `say hello`）在函数加载时就被解析成了一棵“可执行命令树”。服务器读一次文本、建好结构，之后每次执行都直接跑这棵树，不必再碰文本。但宏命令做不到这一点：它长着 `$(...)` 这样的空位，真正要跑的命令，得等参数到位、把空位填上之后才能确定。于是宏每次被调用，都要临时走一遍“把参数填进空位 → 得到一条完整的命令文本 → 把这条文本解析成命令树”的流程。这个“填空 + 解析”就是实例化，也正是宏比普通命令贵的根源。普通命令的解析在加载期一次付清，宏的解析却被推迟到了每次运行时。

那个“缓存”就是为省下重复解析而设的。可以把它想象成一位翻译随身带的一本便签簿，只有 8 页：每译完一句，就把“原文 → 译文”记在一页上；下次再遇到**一模一样**的原文，直接照抄便签，不必重译；便签写满 8 页后，再来新句子就擦掉最旧的一页腾地方。宏的缓存一样：它以“这一次代入的那组参数值”为索引，记住“这组参数对应的、已经解析好的命令树”。下次调用时，先看当前这组参数在不在便签簿里。在，就是**命中**，直接取用现成的命令树，连填空带解析全省了；不在，就是**未命中**，老老实实走一遍完整实例化，再把结果记进便签簿。

未命中时调用的 `substituteAndParse` 是真正的重活：它遍历函数体的所有行，只对其中的**宏行**做字符串替换、再交给 Brigadier 重新解析（普通行早在加载期就解析好了，这里只取用预编译结果）：

```java
private InstantiatedFunction<T> substituteAndParse(...) {
   for (MacroFunction.Entry<T> entry : this.entries) {   // 遍历每条 entry
      lookupValues(values, entry.parameters(), entryArguments);
      newEntries.add(entry.instantiate(entryArguments, dispatcher, this.id));   // 宏行:substitute+parse;普通行:返回预编译结果
   }
   ...
}
// MacroEntry.instantiate —— 拼出命令字符串,再整条重新解析
String command = this.template.substitute(substitutions);
return CommandFunction.parseCommand(dispatcher, this.compilationContext, new StringReader(command));
```

据此可以把影响宏开销的因素从大到小排成三档：

1. **缓存命不命中**——量级最大的一档，命中几乎免费、未命中才付解析的钱，由“不同参数组合的数量”决定（≤8 就基本常驻缓存）。
2. **宏行的条数**——未命中时逐条宏行重解析，两条约是一条的两倍。（也因此，两条宏行拆进两个函数、还是并进一个函数，重解析的宏行总数不变、成本相当。）
3. **单条宏行的长度**——只在未命中时作为每条的系数，对寻常命令影响微乎其微、基本可忽略；唯一的例外是行内塞了大段 SNBT，那本就是该避免的写法。

于是宏真正管用的优化几乎**只有一条：想尽办法命中缓存**（把不同参数组合压到 ≤8）。若实在做不到，那就只剩退一步：**能不用宏就不用，非用不可就压到最少的宏行数**；至于把单行写短，除了别堆大 SNBT，不值得费心。

## 5. 实体 NBT：每碰一下都拆装整只实体

开销最高的一档，是读写实体身上的 NBT。要讲清它为何最贵，得先解释两个词：**序列化**与**反序列化**。

序列化，是把一个活在内存里的对象，摊平成一段自我完备、可存可传的数据（在这里就是一棵 NBT 树）。好比把一台组装好的机器拆成一堆贴好标签的零件、装箱打包，箱子里的清单足以让人在别处照单重装。反序列化则是反过来：照着那段数据，从零把对象重新造出来，字段一个个填回去，嵌套结构一层层重建，即照着清单把零件重新组装成机器。二者之所以贵，是因为它们都**不是“复制一个引用”那种一步到位的操作**，而要逐字段遍历、逐个新建对象，还要做类型转换与合法性校验。对一只实体而言，这意味着它的坐标、动量、血量、每一条属性、每一个状态效果、身上的装备，乃至那颗记着仇恨目标与记忆的 AI大脑、连同它驮着的乘客，全都要被完整地写出去（序列化）或重新造一遍（反序列化）。

原因在源码中清晰可见：读操作是把整只实体序列化成一棵 NBT 树，写操作是从一棵 NBT 树把整只实体反序列化重建：

```java
// EntityDataAccessor —— data 命令访问实体数据的读与写
public CompoundTag getData() {
   return NbtPredicate.getEntityTagToCompare(this.entity);   // 读 = 整只实体 saveWithoutId(...)
}
public void setData(CompoundTag tag) {
   ...
   this.entity.load(TagValueInput.create(reporter, this.entity.registryAccess(), tag));  // 写 = 整只实体 load(...)
   this.entity.setUUID(uuid);
}
```

其中读操作深入下去便是 `entity.saveWithoutId(output)`，它把实体的属性、状态效果、装备、AI 大脑等全部写入 NBT。而修改单个字段所走的路径，代价更重：

```java
// DataCommands.manipulateData —— 这是 data modify entity ... 的主流程
CompoundTag targetData = target.getData();                 // ① 整只序列化出来
int result = manipulator.modify(context, targetData, targetPath, source);   // ② 在树上改那一处
...
target.setData(targetData);                                // ③ 整只反序列化回去
```

即便只想改实体的一个字段，流程也必须先将整只实体序列化为 NBT，在树上改写该字段，再从 NBT 将整只实体反序列化重建一次。改动落在单个字段，支付的却是“序列化整只加反序列化整只”的成本。实体的 NBT 越庞大（装备多、效果多、AI 复杂），这一成本越高——这正是它比前三者高出一个数量级的结构性根源。

::: tip 题外话：Mojang 祖传的屎山代码
NBT 本身没毛病，它就是个存档格式，老老实实存在硬盘上的，慢点也没人在乎。问题是 `data modify entity` 这个脑子有坑的设计：不过是改一个字段，Mojang 直接把“存盘 / 读档”那套老管线整个搬来复用，于是你碰它一下，就得把整只实体拆了又装一遍。人家插件服务端老早就把各种字段单拎出来、想改哪个改哪个，快得很。
:::

## 6. 开销阶梯

把四段源码归纳成一张阶梯：

<div align="center"><b>表 1</b>：四种操作的底层动作与相对量级</div>

| 操作 | 底层动作（源码） | 量级 |
|---|---|---|
| 计分板读写 | 哈希查一次 + 读写一个 `int` | 极低 |
| 单层 storage 读写 | 哈希查一次 + 在内存 NBT 树上按路径改一处（不序列化） | 与计分板同级 |
| 宏（命中缓存） | 每参数一次 `stringify` + 查 8 格缓存 | 低 |
| 宏（未命中） | 函数体**逐宏行**字符串替换 + Brigadier 重解析 | 高（随宏行数） |
| 实体 NBT 触碰 | 整只实体序列化（读）/ 反序列化（写），改一字段两者都做 | 最高 |

$$\text{计分板} \approx \text{单层存储} \;\ll\; \text{宏} \;\ll\; \text{实体 NBT 触碰}$$

本文不给出具体的倍数关系：真实倍数随实体大小、函数行数、缓存命中率大幅波动，任何精确数字都会失真。但上表所示的相对次序由源码结构决定，是稳定可依赖的。

## 7. 通用设计准则

1. **能提前算的，绝不留到运行期。** 凡是与运行时状态无关的重活（预计算的表、常量、离线就能定死的结构），全部挪到加载期或离线工具里做完，运行期只做“和当前状态有关”的那一点点。

2. **用计分板和单层 storage 当免费草稿纸。** 复杂的中间运算全在这两种介质上翻来覆去地做，做到结果成型，才一次性写给昂贵的目标（实体 NBT / 深层结构）。绝不在贵介质上反复涂改。

3. **实体 NBT 触碰压到绝对最少。** 每个实体每刻的写入次数是硬成本。写一次是下限，此外一次都不多碰。读也要合批：每刻开头把整只实体快照进 storage 一次，后续要什么都从快照里拿，而不是反复 `data get entity`。

4. **宏保命中、少用。** 让宏的不同参数组合控制在 8 组以内（吃满 LRU 缓存），并把宏函数的宏行数压到最少；参数天然发散、无法命中缓存时，优先改用非宏方案。

这四条几乎涵盖了原版数据包性能优化的绝大部分：把工作从贵介质挪到便宜介质、从运行期挪到离线、从未命中挪到命中。具体项目里的种种技巧，多半只是它们的推论。

## 参考文献

[1] Minecraft（Mojang）. 官方 26.1.2 游戏 jar，经 Fabric loom 拉取、Vineflower 反编译。
