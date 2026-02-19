---
title: 'Patrick的流处理前置'
---

<FeatureHead
    title='Patrick的流处理前置'
    authorName='Patrick'
    cover = '../_assets/7.png'
    ResourceLink = '../_assets/流处理前置.zip'
/>

## 摘要
该前置模仿Java，提供了对数组（此处称为流）中的对象进行处理的一些常用方法，以及批处理的途径。（不提供mapper方法）
此文档中**大部分**内容都可以在项目注释中找到。

### 该前置涉及的记分项和命令存储

此处罗列数据包使用的记分项和命令存储。在不清楚后果之前请勿随意改动其值。
该前置涉及一个记分项：stream
stream下包含下列虚拟玩家：
如果你需要的话，通常你可以随意访问其值，但请不要更改它们

·**catche**：在求最大值、最小值时使用的缓存下标以及在批处理时暂存结果
·**index**：在foreach的时候用于记录当前迭代的下标
·**length**：在foreach的时候用于记录当前流的长度
·**size**：在limit、skip的时候用于记录将要被保留/跳过的参数数量
·**result**：在某些读取函数输出（如比较或者filter）的时候用于暂存输出结果的虚拟玩家

该前置涉及5个命令存储。

·**patrickstool:stream/constant_stream** 运行过程中创建的新的流。通常用于稍后覆盖原地址，内部的value为流
·**patrickstool:stream/operated** 运行过程中被单独拿出来的一个元素，通常是被操作的元素，内部的value为元素，index作为下标，address为地址
·**patrickstool:stream/compared** 运行过程中被单独拿出来的一个元素，通常用于和上一条作比较，内部的value为元素，index作为下标，address为地址
·**patrickstool:stream/record** 被用于给宏函数传参的命令存储
·**patrickstool:stream/command** 被batch方法用于暂存命令

在使用时，通常只访问**patrickstool:stream/record**命令存储即可。

### 传参说明

**每一个**流处理函数都需要$(address)指定流的地址，**该地址应包含一个NBT对象的来源和一个用于在其中搜索的指向流的NBT路径。**
举例：假若你想传入命令存储 foo:bar下的流value，那么你需要传入"storage foo:bar value"
假若你想传入玩家Steve的背包作为流，你需要传入"entity Steve Inventory"（注意本前置的函数仍不能直接修改玩家数据）

某些函数需要指定使用的函数，在没有特殊要求的情况下，被指定的函数应当是宏函数，接受的参数见下文。

由于被传入所使用的函数的参数被放在了命令存储patrickstool:stream/record中，因此如果想额外传参，可以将参数放入patrickstool:stream/record当中，但不要占用**value，index，function，length，address，result，resultBatch，first，second和size**这些关键字！（若有功能相似的参数想要传入，建议加上前缀）

被foreach和filter使用的函数函数可以接受value参数、address参数、index参数和length参数。value参数为被执行的对象本身，address为流的地址，index则为对象在流中的下标，而length参数为该流的长度。

被max、min和sort指定的比较器函数不接受value参数，而改为接受first和second参数，这两个参数为流中的两个将要被比较的元素（注意有先后之分）。除此之外可以接受的参数同上。

#### 以下操作可能导致严重的bug产生：

·胡乱操作上述提到的命令存储和记分项。
·输入的地址不是流。

### 流处理函数说明
此处所描述的流处理函数均为 **patrickstool:stream/** 路径下的函数
例：count函数表示函数"patrickstool:stream/count"
**所有**流处理函数都需要传入address参数指明处理的流的地址，该地址应包含一个NBT对象的来源和一个用于在其中搜索的指向流的NBT路径。下面提到的函数不再额外写出这一点。

#### 1、count
用于获取流中元素个数。
输入：不需额外传参。
输出：流中元素个数。

#### 2、distinct
对流中的对象进行去重
输入：不需额外传参，**但要求address指定的流是对象流**（即流中的元素均为对象）
输出：无。

#### 3、filter
用指定规则过滤流，需要一个function参数指定用于当作条件的函数,若该函数返回1则该元素可以保留，否则该元素从流中被剔除。
输入：需要一个字符串function指定使用的条件函数。
输出：无。

#### 4、foreach
对流中的每一个元素都应用一次指定的函数。
输入：需要一个字符串function指定使用的函数。
输出：无。

#### 5、limit
保留流中前几个元素，剩余的部分舍去。
输入：需要一个整数size指定保留几个元素。
输出：无。

#### 6、max_index
按照指定的比较规则，找出流中的最大元素。
输入：需要一个字符串function指定使用的函数。该函数作为比较器，接受first和second两个参数，返回1表示前者比后者大。
输出：最大元素的下标。

#### 7、min_index
按照指定的比较规则，找出流中的最小元素。
输入：需要一个字符串function指定使用的函数。该函数作为比较器，接受first和second两个参数，返回1表示前者比后者大。
输出：最小元素的下标。

#### 8、reverse
前后颠倒流中的元素顺序。
输入：不需额外传参。
输出：无

#### 9、skip
剔除流中前几个元素，剩余的部分保留。
输入：需要一个整数size指定跳过几个元素。
输出：无

#### 10、sort
按照指定的比较规则，将流顺序排序（从小到大）。
输入：需要一个字符串function指定使用的函数。该函数作为比较器，接受first和second两个参数，返回1表示前者比后者大。
输出：无

### 流的批处理

为了避免输入过多重复的字段，该前置提供一种批量执行流处理函数的方法。

#### 11、batch
批量执行流处理函数
输入：一个字符串数组command指定要执行的批处理函数（省略"patrickstool:stream/"前缀），一个字符串整型混合数组argus指定每一步的参数，与command中的内容一一对应。
输出：所有执行的批处理函数输出之和

argus中的参数会被同时转化成function和size，因此无需用户自行区分。

### private方法
private方法，又称私有方法，是private文件夹下的方法，用于流处理函数的中间执行过程。不建议用户使用private文件夹下的方法。所有私有方法均不支持批处理。
如果要使用的话，有一个方法可能会发挥作用：

#### 12、private/get_from_index
用于将流中指定位置的元素提取到record中
输入：需要一个整数index指明下标
输出：不返回值，自动用目标流中指定下标的元素覆盖patrickstool:stream/record中的value键。