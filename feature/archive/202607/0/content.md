---
title: '利用数据包进行类DES加密解密'
---

<FeaturedHead
    title='利用数据包进行类DES加密解密'
    authorName='洪旗'
    resourceLink = 'https://wwbip.lanzoum.com/iovDh3tpew1a'
/>

***

**摘要**
本文介绍了一种在《Minecraft》数据包中模拟DES加密解密算法的实现方案。针对原始DES算法16轮Feistel网络在指令数量上的限制，本方案将其简化为2轮迭代，去除压缩型换位操作，统一采用左移一位的密钥调度策略，并将轮函数F特例化为右半部分与子密钥的异或运算。为适应游戏内数据存储形式，设计了一个包含64个字符（数字、大小写字母、空格及换行符）的编码方案，通过base64方式将字符映射为6位二进制，并利用execute store success指令的返回值特性巧妙实现了异或运算。解密过程充分利用Feistel网络的可逆性，仅需倒序使用子密钥即可还原明文。此外，本文还实现了随机密钥生成、自定义密钥输入以及可变长度密钥等功能，并提供了相应的UI界面。该项目虽然加密强度有限，但作为数据包编程练习，展现了在受限环境中实现密码算法的可行性与创造性。

## 1.引言
DES（数据加密标准）是一种经典的对称密钥分组加密算法，由IBM在20世纪70年代初研发。它采用56位密钥对64位的数据块进行加密，核心结构是Feistel网络，通过16轮相同的迭代运算（每轮包含扩展置换、与子密钥异或、S盒非线性替换和P盒置换）实现数据的充分混淆和扩散，从而将明文转换为密文。
其核心结构，即Feistel网络的组成单位如下图所示：
![Feistel网络](https://i-blog.csdnimg.cn/blog_migrate/993220ae629eac6f8dca407fa3c9dbe8.png)
其将输入等分为两段，分别作为LE和RE，其中，RE与密钥K经过处理F后，再与LE进行异或[^1] (⊕)计算，得到的结果作为下一轮的RE，而本轮的RE则将直接作为下一轮的LE。
在Feistel网络的最后，需要将最后一轮得出的LE与RE交换，在组合成输出，即密文。
![Feistel的可逆性](https://i-blog.csdnimg.cn/blog_migrate/02fd7607a9c862d2d6212845cedab50f.png)
可以证明，将密文作为输入，倒序使用网络中的密钥(即以K16到K1顺序使用)，就能够还原明文，这一性质源于Feistel网络每次计算的可逆性，节省了单独开发解密系统的成本。
DES算法除了Feistel网络，其密钥的生成也颇有设计，出于性能和指令数量限制的考虑，这一部分在本包内进行了简化，这里只给出示意图，以供参考
![DES的加密](https://img-blog.csdnimg.cn/67aac123ec0f471fb381572b519e90f1.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAMTVhc3o=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

## 2.加密过程
由于指令数量的限制，严格按照DES算法制作加解密是较为困难的，因此，在这里，16轮简化为2轮，去除了压缩型换位，统一将循环的移动改为左移一位。同时，将处理F特例化为RE⊕K。

### 2.1 编码处理
由于涉及了异或处理，需要将字符转化为二进制形式便于计算。在确定至少包含0-9，大小写字母后，加入了空格和换行符两个字符，将支持字符数量填充至64个。此时，再进行base64编码，将这64个字符用6位二进制形式表示，就完成了字符二进制化
```mcfunction
data modify storage code:base place set value \
[\
    0,1,2,3,4,5,6,7,8,9,\
    a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,\
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,\
    " ","\n"\
]
```
考虑到空格和换行符在进行打印显示时，不是很美观，加入以下用于打印密钥密文的数组(原数组用于打印明文)
```mcfunction
data modify storage code:base place_pass set value \
[\
    0,1,2,3,4,5,6,7,8,9,\
    a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,\
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,\
    "_","#"\
]
```
在该数组中，` `替换为了`_`，换行符`\n`替换为了`#`。
第一行为数字，对应编号0-9；第二行为小写字母，对应编号10-35；第三行为大写字母，对应编号为36-61；第四行为空格和换行符，分别对应62和63

### 2.2 明文的写入
考虑到便利性和容量，书与笔是明文的良好载体，其内容可以通过读取玩家手持物数据获得：
```mcfunction
data modify storage code:code raw set from entity @s SelectedItem.components."minecraft:written_book_content".pages[0].raw
```
此时，`raw`内的字符串就是明文的初始态，为了便于后续处理，需要将其转化为已经编码好的二进制形式并保存在`list`数组中
```mcfunction
##如果已经没有,则终止
execute if data storage code:code {raw:""} run return fail
##如果还有,则继续进程
#获取首个字符
data modify storage code:code code set string storage code:code raw 0 1
#转化为6位
data modify storage code:code bit set from storage code:base model
function code:data_get/change/list
#存入list
data modify storage code:code list append from storage code:code bit
##之后,去除raw的首位
data modify storage code:code raw set string storage code:code raw 1
##检查是否还有,若有,重复该流程
execute unless data storage code:code {raw:""} run return run function code:data_get/change/start
```
每次执行这段指令时，会将`raw`的首个字符与已编码的内容进行匹配，若匹配成功，则将对应的二进制形式传入`list`数组中，若没有匹配到，则强制转为空格，并传入空格对应的二进制形式。这之后，`raw`的首位会被移除，原第二位将作为新的首位进行相同的流程，直到`raw`已经变为空字符串为止

### 2.3 密钥的生成
密钥可以通过random指令在0,1之间随机生成一定次数来形成，这里，默认密钥长度为12个字符，也就是72个0与1。
```mcfunction
#随机1,0
execute store result storage code:code bit int 1 run random value 0..1
#插入password
data modify storage code:code password append from storage code:code bit
#每插入一次,剩余次数减一
scoreboard players remove #password code_use 1
#如果还有,继续插入
execute if score #password code_use matches 1.. run return run function code:data_get/password/create
```
这里，`#password`在`code_use`中的初值为72，由指令`scoreboard players set #password code_use 72`控制

### 2.4 加密
此前提到，出于指令数量的限制，16轮简化为2轮，去除了压缩型换位，统一将循环的移动改为左移一位。同时，将处理F特例化为RE⊕K。
![alt text](https://i-blog.csdnimg.cn/blog_migrate/993220ae629eac6f8dca407fa3c9dbe8.png)
根据单轮Feistel的结构以及所进行的简化，需要将每个字符平分为左右两侧各3个比特，同时，K每次也取前三个比特用于异或计算
```mcfunction
#初始化数组
data modify storage code:code LE set value [0,0,0]
data modify storage code:code RE set value [0,0,0]
#载入数据
data modify storage code:code LE[0] set from storage code:code list[0][0]
data modify storage code:code LE[1] set from storage code:code list[0][1]
data modify storage code:code LE[2] set from storage code:code list[0][2]
data modify storage code:code RE[0] set from storage code:code list[0][3]
data modify storage code:code RE[1] set from storage code:code list[0][4]
data modify storage code:code RE[2] set from storage code:code list[0][5]
```
- 这里，`LE`为前三个比特，`RE`为后三个比特

取初始密钥`k`:
```mcfunction
#初始密钥(password前三位)
data modify storage code:code k set value [0,0,0]
data modify storage code:code k[0] set from storage code:code password[0]
data modify storage code:code k[1] set from storage code:code password[1]
data modify storage code:code k[2] set from storage code:code password[2]
```
`k`与`RE`进行异或[^1]操作
```mcfunction
#与RE异或,得到f
data modify storage code:code f set value [0,0,0]
execute store success storage code:code f[0] int 1 run data modify storage code:code k[0] set from storage code:code RE[0]
execute store success storage code:code f[1] int 1 run data modify storage code:code k[1] set from storage code:code RE[1]
execute store success storage code:code f[2] int 1 run data modify storage code:code k[2] set from storage code:code RE[2]
```
摘出第一次异或进行讨论
`execute store success storage code:code f[0] int 1 run data modify storage code:code k[0] set from storage code:code RE[0]`
在《minecraft》中，若试图将一个值修改为其本身，将会返回0的成功值；否则，返回的成功值为1。这里，如果`k[0]`和`RE[0]`相同，则`f[0]`会被记录为0；否则为1。
这就是异或计算。
将`f`与`LE`进行异或操作，存入`RE1`中
```mcfunction
#f与LE进行异或,得到RE1
data modify storage code:code RE1 set value [0,0,0]
execute store success storage code:code RE1[0] int 1 run data modify storage code:code f[0] set from storage code:code LE[0]
execute store success storage code:code RE1[1] int 1 run data modify storage code:code f[1] set from storage code:code LE[1]
execute store success storage code:code RE1[2] int 1 run data modify storage code:code f[2] set from storage code:code LE[2]
```
再将`LE1`设置为`RE`，并用`LE1`和`RE1`分别替代`LE`和`RE`
```mcfunction
data modify storage code:code LE1 set from storage code:code RE
data modify storage code:code LE set from storage code:code LE1
data modify storage code:code RE set from storage code:code RE1
```
至此，已经得到了下一轮Feistel需要用到的`LE`和`RE`，将`password`左移一位，得到新的`password`
```mcfunction
data modify storage code:code password append from storage code:code password[0]
data remove storage code:code password[0]
```
将以上流程再重复一次，就完成了两轮的Feistel操作。
最后，将`LE`和`RE`交换，并拼接为新的6位二进制
```mcfunction
data modify storage code:code bit set value [0,0,0,0,0,0]
data modify storage code:code bit[0] set from storage code:code RE[0]
data modify storage code:code bit[1] set from storage code:code RE[1]
data modify storage code:code bit[2] set from storage code:code RE[2]
data modify storage code:code bit[3] set from storage code:code LE[0]
data modify storage code:code bit[4] set from storage code:code LE[1]
data modify storage code:code bit[5] set from storage code:code LE[2]
```
- 这里直接采用填入的方式

至此，加密的过程结束

### 2.5 编码
加密结束后，需要将密钥和密文进行打印，需要先将其转化为字符串形式。
先看密钥的打印过程。
此时，密钥还是一个72比特的一维数组，为了将其格式变为与密文相同，需要将其转化为12*6的二维数组。
```mcfunction
#初始数组
data modify storage code:code bit set from storage code:base model
#前六位获取并删除
data modify storage code:code bit[0] set from storage code:code password[0]
data remove storage code:code password[0]
data modify storage code:code bit[1] set from storage code:code password[0]
data remove storage code:code password[0]
data modify storage code:code bit[2] set from storage code:code password[0]
data remove storage code:code password[0]
data modify storage code:code bit[3] set from storage code:code password[0]
data remove storage code:code password[0]
data modify storage code:code bit[4] set from storage code:code password[0]
data remove storage code:code password[0]
data modify storage code:code bit[5] set from storage code:code password[0]
data remove storage code:code password[0]
#插入password末位
data modify storage code:code password append from storage code:code bit
#如果还有次数,重复该过程
execute unless data storage code:code password[0][0] run return run function code:data_get/transcode/password/change
```
经过这一操作，password成功转化为了二维数组。
在进行base64操作时，`code:base`中的`place`已经按照编号排列，我们将每一个6位二进制的值计算，并替换为相应的字符
```mcfunction
#取第一个
data modify storage code:code bit set from storage code:code to_trans[0]
#计算对应的序号
scoreboard players set #place code_use 0
execute store result score #add code_use run data get storage code:code bit[0] 32
scoreboard players operation #place code_use += #add code_use
execute store result score #add code_use run data get storage code:code bit[1] 16
scoreboard players operation #place code_use += #add code_use
execute store result score #add code_use run data get storage code:code bit[2] 8
scoreboard players operation #place code_use += #add code_use
execute store result score #add code_use run data get storage code:code bit[3] 4
scoreboard players operation #place code_use += #add code_use
execute store result score #add code_use run data get storage code:code bit[4] 2
scoreboard players operation #place code_use += #add code_use
execute store result score #add code_use run data get storage code:code bit[5] 1
scoreboard players operation #place code_use += #add code_use
#确定序号
execute store result storage code:code place int 1 run scoreboard players get #place code_use
function code:data_get/transcode/transcode/add with storage code:code
#如果还有,重复该流程
execute if data storage code:code to_trans[0] run return run function code:data_get/transcode/transcode/place
```
在这里，`to_trans`是待转化二维数组，函数`code:data_get/transcode/transcode/add`则是用于给字符串的末尾加上新增的字符。在加密过程中，` `替换为了`_`，换行符`\n`替换为了`#`保证看起来较为舒适。
对于密文`ciphertext`，其本身即为二维数组，可以直接进行该操作：
```mcfunction
data modify storage code:code to_trans set from storage code:code ciphertext
function code:data_get/transcode/transcode/start
```
这里就略去。
再将两者进行打印，即可得到密钥密文。
![待加密内容](https://i1.hdslb.com/bfs/album/f1bf713f3e7d19d19006ceb23efd712b1808971083.png@1052w_!web-dynamic.avif)
上图是待加密内容。

![密文](https://i1.hdslb.com/bfs/album/d60ea8a4cbef24b3182eca10d07480e41808971083.png@1052w_!web-dynamic.avif)
上图是加密得到的密文

![密钥](https://i1.hdslb.com/bfs/album/4450e445ae94539878b437343f46acce1808971083.png@1052w_!web-dynamic.avif)
上图是加密后的密钥

## 3 解密过程
由于Feistel网络的可逆性，解密过程相当简单

### 3.1 读取密钥及密文
这一部分和`2.2 写入明文`的操作基本一致，只不过还需要将密钥写入`password_en`中再进行编码存入`password`中作为密钥。
由于此时`password`仍为二维数组，需要对其进行`2.5 编码`中对`password`的逆操作，将其拆解为一维数组：
```mcfunction
#分解第一组至password末端
data modify storage code:code password append from storage code:code password[0][0]
data modify storage code:code password append from storage code:code password[0][1]
data modify storage code:code password append from storage code:code password[0][2]
data modify storage code:code password append from storage code:code password[0][3]
data modify storage code:code password append from storage code:code password[0][4]
data modify storage code:code password append from storage code:code password[0][5]
#去除password[0]
data remove storage code:code password[0]
#如果还有,重复该流程
execute if data storage code:code password[0][0] run return run function code:decode/passwword/de_group
```
### 3.2 解码
已知Feistel的可逆性，只需要找出倒序的密钥即可
```mcfunction
#密钥右移一位
data modify storage code:code password prepend from storage code:code password[-1]
data remove storage code:code password[-1]
#初始密钥(password前三位)
data modify storage code:code k set value [0,0,0]
data modify storage code:code k[0] set from storage code:code password[0]
data modify storage code:code k[1] set from storage code:code password[1]
data modify storage code:code k[2] set from storage code:code password[2]
```
由于加密的最后，`password`又执行了一次左移，因此，右移`password`的操作放在获取前三位之前。
然后，进行和加密完全相同的操作即可复原出每个字符的明文。
再以相同的方式进行转化和打印(当然，打印明文时没有将` `替换为`_`，换行符`\n`替换为`#`)即可得到可视的明文
![解密得到的明文](https://i1.hdslb.com/bfs/album/f1bf713f3e7d19d19006ceb23efd712b1808971083.png@1052w_!web-dynamic.avif)

## 4 进一步的思考
此前，密钥为固定的随机12字符，那么，是否可以改变密钥的长度，甚至自定义密钥呢？据此，制作了UI界面：
![ui](https://i1.hdslb.com/bfs/album/f563c79951677e0a1c958a678d8b27ea1808971083.png@720w_382h_1e_1c.webp)
由于两者本质上只影响了密钥的生成，因此这里只讨论这一部分

### 4.1 随机密钥长度
这一部分相对简单，将原有的`scoreboard players set #password code_use 72`修改为：
```mcfunction
scoreboard players operation #password code_use = @s code_trigger
scoreboard players operation #password code_use += #password code_use
scoreboard players operation #password code_use += #password code_use
scoreboard players operation #password code_use += @s code_trigger
scoreboard players operation #password code_use += @s code_trigger
```
即可控制`#password`的值进而控制密钥长度

### 4.2 自定义密钥
由于自定义密钥与原有函数冲突，需要单独使用一个函数。在对话框中，可以输入想要的密钥，该密钥将作为宏参数传入：
```mcfunction
##记录密钥
$data modify storage code:code password_en set value "$(password)"
data modify storage code:code password set value []
function code:decode/change/password
##将密钥从二阶数组调整为一阶数组
function code:decode/password/de_group
```
其中的`code:decode/change/password`就是将密钥转化为二维数组的函数。
但是，在加密过程中，密钥会进行两倍于明文长度的左移，为了最后的密钥即为输入的内容，需要提前将密钥进行等量次数的右移。
```mcfunction
#右移密钥两次
data modify storage code:code password prepend from storage code:code password[-1]
data remove storage code:code password[-1]
data modify storage code:code password prepend from storage code:code password[-1]
data remove storage code:code password[-1]
#剩余次数
scoreboard players remove #length code_use 1
#如果还有次数,重复此流程
execute if score #length code_use matches 1.. run return run function code:data_get/wind
```
其中，`length`由指令`execute store result score #length code_use run data get storage code:code list`获得

## 5 结语
实际上，本项目的实用性相当一般，用于解密地图，解密难度过大，并不适合；用于保护自己的东西，又太过夸张。但是本包作为数据包制作的练习还是相当不错的。
本项目通过构建类Feistel网络，实现了对DES加密解密算法的模拟，算法核心在于异或的计算，字符与二进制之间的多次转化。
通过本次项目，对对称密钥加密的核心思想——Feistel网络的可逆性——有了更直观的理解。而用execute store success实现异或运算，这种创造性地利用游戏机制完成计算任务的过程，本身比最终的加密效果更有价值。
此外，编码方案的设计也带来一些启示。将64个字符映射到6位二进制，本质上是构建了一个微型字符集。这种“从零开始定义编码规则”的经历，加深了对计算机底层字符表示的理解。
本项目也存在一些不足之处，首先，将16轮缩减为2轮，去除了S盒替换以及压缩置换之后，安全性大幅缩水，难以抵抗已知明文攻击(尽管对于minecraft基本已经足够)；字符集受到的限制较大，仅支持64个不同的符号，很多符号不能使用，会被强行替换为空格。

[^1]:异或，指两个比特串每一位进行比较，相同则为0，不同则为1