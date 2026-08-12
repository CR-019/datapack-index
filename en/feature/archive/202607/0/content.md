---
title: 'Using data pack for DES-like encryption and decryption'
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<FeaturedHead
title='Using data pack for DES-like encryption and decryption'
authorName='Hong Qi'
    resourceLink = 'https://wwbip.lanzoum.com/iovDh3tpew1a'
/>

***

**summary**
This article introduces an implementation plan for simulating the DES encryption and decryption algorithm in the "Minecraft" data pack. In view of the limitation in the number of instructions of the 16-round Feistel network of the original DES algorithm, this scheme simplifies it to 2 rounds of iteration, removes the compressed transposition operation, uniformly adopts the key scheduling strategy of shifting one bit to the left, and specializes the round functionF into the XOR operation of the right half and the sub-key. In order to adapt to the in-game data storage format, an encoding scheme containing 64 characters (numbers, upper and lower case letters, spaces, and newlines) was designed. The characters were mapped into 6-bit binary through base64, and the XOR operation was cleverly implemented using the return value feature of the execute store success command. The decryption process takes full advantage of the reversibility of the Feistel network and only needs to use the subkeys in reverse order to restore the plaintext. In addition, this article also implements functions such as random key generation, custom key input, and variable length keys, and provides corresponding UI interfaces. Although the encryption strength of this project is limited, as a data pack programming exercise, it demonstrates the feasibility and creativity of implementing cryptographic algorithms in a restricted environment.

## 1. Introduction
DES (Data Encryption Standard) is a classic symmetric key block encryption algorithm developed by IBM in the early 1970s. It uses a 56-bit key to encrypt a 64-bit data block. The core structure is a Feistel network. Through 16 rounds of the same iterative operation (each round includes extended permutation, XOR with subkeys, S-box nonlinear replacement and P-box permutation), the data is fully confused and diffused, thereby converting plaintext into ciphertext.
Its core structure, the constituent units of the Feistel network, is shown in the figure below:
![Feistel Network](https://i-blog.csdnimg.cn/blog_migrate/993220ae629eac6f8dca407fa3c9dbe8.png)
It divides the input into two equal parts, respectively as LE and RE. After RE and key K are processed F, they are then XORed [^1] (⊕) with LE. The result is used as the RE of the next round, and the RE of this round will be directly used as the LE of the next round.
At the end of the Feistel network, the LE and RE obtained in the last round need to be exchanged and combined into the output, that is, the ciphertext.
![Feistel’s reversibility](https://i-blog.csdnimg.cn/blog_migrate/02fd7607a9c862d2d6212845cedab50f.png)
It can be proved that by taking the ciphertext as input and using the keys in the network in reverse order (that is, using them in the order of K16 to K1), the plaintext can be restored. This property stems from the reversibility of each calculation of the Feistel network and saves the cost of developing a separate decryption system.
In addition to the Feistel network, the DES algorithm also has a well-designed key generation. For the sake of performance and the limitation of the number of instructions, this part has been simplified in this package. Only the diagram is given here for reference.
![DES encryption](https://img-blog.csdnimg.cn/67aac123ec0f471fb381572b519e90f1.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAMTVhc3o=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

## 2. Encryption process
Due to the limitation in the number of instructions, it is difficult to produce encryption and decryption strictly according to the DES algorithm. Therefore, here, 16 rounds are simplified to 2 rounds, the compressed transposition is removed, and the movement of the cycle is uniformly changed to a left shift by one position. At the same time, specialize processing F as RE⊕K.

### 2.1 Encoding processing
Since XOR processing is involved, the characters need to be converted into binary form for calculation. After confirming that it contains at least 0-9 uppercase and lowercase letters, two characters, a space and a newline character, were added to fill the number of supported characters to 64. At this time, base64 encoding is performed again, and these 64 characters are expressed in 6-bit binary form to complete the character binarization.
```mcfunction
data modify storage code:base place set value \
[\
    0,1,2,3,4,5,6,7,8,9,\
    a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,\
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,\
    " ","\n"\
]
```

Considering that spaces and newlines are not very beautiful when printed and displayed, add the following array for printing the key ciphertext (the original array is used for printing plaintext)
```mcfunction
data modify storage code:base place_pass set value \
[\
    0,1,2,3,4,5,6,7,8,9,\
    a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,\
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,\
    "_","#"\
]
```

In this array,` `replaced by`_`, newline character`\n`replaced by`#`。
The first line is numbers, corresponding to numbers 0-9; the second line is lowercase letters, corresponding to numbers 10-35; the third line is capital letters, corresponding numbers are 36-61; the fourth line is spaces and newlines, corresponding to 62 and 63 respectively.

### 2.2 Writing plain text
Considering convenience and capacity, books and pens are good carriers of plain text, and their content can be obtained by reading the player's handheld object data:
```mcfunction
data modify storage code:code raw set from entity @s SelectedItem.components."minecraft:written_book_content".pages[0].raw
```

at this time,`raw`The string inside is the initial state of the plaintext. In order to facilitate subsequent processing, it needs to be converted into an encoded binary form and saved in`list`in array
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

Each time this instruction is executed, the`raw`The first character of is matched with the encoded content. If the match is successful, the corresponding binary form is passed in.`list`In the array, if there is no match, it will be forced to a space and the binary form corresponding to the space will be passed in. After this,`raw`The first position will be removed, and the original second position will be used as the new first position to go through the same process until`raw`until it becomes an empty string

### 2.3 Key generation
The key can be formed by randomly generating a certain number of times between 0 and 1 through the random command. Here, the default key length is 12 characters, which is 72 0s and 1s.
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

here,`#password`exist`code_use`The initial value in is 72, determined by the instruction`scoreboard players set #password code_use 72`control

### 2.4 Encryption
As mentioned before, due to the limitation of the number of instructions, the 16 rounds were simplified to 2 rounds, the compressed transposition was removed, and the movement of the cycle was uniformly changed to a left shift by one position. At the same time, specialize processing F as RE⊕K.
![alt text](https://i-blog.csdnimg.cn/blog_migrate/993220ae629eac6f8dca407fa3c9dbe8.png)
According to the structure of the single-round Feistel and the simplification, each character needs to be divided into 3 bits on the left and right sides. At the same time, K also takes the first three bits each time for XOR calculation.
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

- here,`LE`are the first three bits,`RE`for the last three bits

Get initial key`k`:
```mcfunction
#初始密钥(password前三位)
data modify storage code:code k set value [0,0,0]
data modify storage code:code k[0] set from storage code:code password[0]
data modify storage code:code k[1] set from storage code:code password[1]
data modify storage code:code k[2] set from storage code:code password[2]
```

`k`and`RE`Perform XOR[^1] operation
```mcfunction
#与RE异或,得到f
data modify storage code:code f set value [0,0,0]
execute store success storage code:code f[0] int 1 run data modify storage code:code k[0] set from storage code:code RE[0]
execute store success storage code:code f[1] int 1 run data modify storage code:code k[1] set from storage code:code RE[1]
execute store success storage code:code f[2] int 1 run data modify storage code:code k[2] set from storage code:code RE[2]
```

Extract the first XOR for discussion
`execute store success storage code:code f[0] int 1 run data modify storage code:code k[0] set from storage code:code RE[0]`
In "Minecraft", if you try to modify a value to itself, a success value of 0 will be returned; otherwise, a success value of 1 will be returned. Here, if`k[0]`and`RE[0]`are the same, then`f[0]`Will be recorded as 0; otherwise it will be 1.
This is the XOR calculation.
Will`f`and`LE`Perform XOR operation and save`RE1`middle
```mcfunction
#f与LE进行异或,得到RE1
data modify storage code:code RE1 set value [0,0,0]
execute store success storage code:code RE1[0] int 1 run data modify storage code:code f[0] set from storage code:code LE[0]
execute store success storage code:code RE1[1] int 1 run data modify storage code:code f[1] set from storage code:code LE[1]
execute store success storage code:code RE1[2] int 1 run data modify storage code:code f[2] set from storage code:code LE[2]
```

Will again`LE1`set to`RE`, and use`LE1`and`RE1`Replace respectively`LE`and`RE`
```mcfunction
data modify storage code:code LE1 set from storage code:code RE
data modify storage code:code LE set from storage code:code LE1
data modify storage code:code RE set from storage code:code RE1
```

At this point, we have obtained what we need for the next round of Feistel`LE`and`RE`,Will`password`Shift left one bit to get new`password`
```mcfunction
data modify storage code:code password append from storage code:code password[0]
data remove storage code:code password[0]
```

Repeat the above process again to complete two rounds of Feistel operations.
Finally, add`LE`and`RE`Swap and concatenate into a new 6-bit binary
```mcfunction
data modify storage code:code bit set value [0,0,0,0,0,0]
data modify storage code:code bit[0] set from storage code:code RE[0]
data modify storage code:code bit[1] set from storage code:code RE[1]
data modify storage code:code bit[2] set from storage code:code RE[2]
data modify storage code:code bit[3] set from storage code:code LE[0]
data modify storage code:code bit[4] set from storage code:code LE[1]
data modify storage code:code bit[5] set from storage code:code LE[2]
```

- Here we directly fill in the

At this point, the encryption process ends

### 2.5 Encoding
After the encryption is completed, the key and ciphertext need to be printed, and they need to be converted into string form first.
Let’s look at the key printing process first.
At this time, the key is still a 72-bit one-dimensional array. In order to change its format to the same as the ciphertext, it needs to be converted into a 12*6 two-dimensional array.
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

After this operation, password was successfully converted into a two-dimensional array.
When performing base64 operations,`code:base`in`place`Already arranged according to number, we calculate each 6-digit binary value and replace it with the corresponding character
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

here,`to_trans`is the two-dimensional array to be converted, function`code:data_get/transcode/transcode/add`It is used to add new characters to the end of the string. During the encryption process,` `replaced by`_`, newline character`\n`replaced by`#`Guaranteed to look more comfortable.
For cipher text`ciphertext`, itself is a two-dimensional array, and this operation can be performed directly:
```mcfunction
data modify storage code:code to_trans set from storage code:code ciphertext
function code:data_get/transcode/transcode/start
```

Omit it here.
Then print the two to get the key ciphertext.
![Content to be encrypted](https://i1.hdslb.com/bfs/album/f1bf713f3e7d19d19006ceb23efd712b1808971083.png@1052w_!web-dynamic.avif)
The picture above shows the content to be encrypted.

![Secret text](https://i1.hdslb.com/bfs/album/d60ea8a4cbef24b3182eca10d07480e41808971083.png@1052w_!web-dynamic.avif)
The picture above is the encrypted ciphertext

![Key](https://i1.hdslb.com/bfs/album/4450e445ae94539878b437343f46acce1808971083.png@1052w_!web-dynamic.avif)
The picture above is the encrypted key

## 3 Decryption process
Due to the reversibility of the Feistel network, the decryption process is quite simple

### 3.1 Read the key and ciphertext
This part and`2.2 写入明文`The operation is basically the same, except that the key needs to be written into`password_en`and then encode and store it in`password`as the key.
Because at this time`password`It is still a two-dimensional array and needs to be`2.5 编码`middle pair`password`The inverse operation of , disassemble it into a one-dimensional array:
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

### 3.2 Decoding
Knowing Feistel's reversibility, we only need to find the reverse key
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

Due to the encryption at the end,`password`Another left shift is performed, so the right shift`password`The operation is placed before obtaining the first three digits.
Then, perform exactly the same operation as encryption to recover the plaintext of each character.
Then convert and print in the same way (of course, when printing the plain text, the` `Replace with`_`, newline character`\n`Replace with`#`) to obtain visible plaintext
![Decrypted plaintext](https://i1.hdslb.com/bfs/album/f1bf713f3e7d19d19006ceb23efd712b1808971083.png@1052w_!web-dynamic.avif)

## 4 Further thoughts
Previously, the key was a fixed random 12 characters. So, is it possible to change the length of the key or even customize the key? Based on this, the UI interface was made:
![ui](https://i1.hdslb.com/bfs/album/f563c79951677e0a1c958a678d8b27ea1808971083.png@720w_382h_1e_1c.webp)
Since the two essentially only affect the generation of keys, only this part is discussed here.

### 4.1 Random key length
This part is relatively simple, converting the original`scoreboard players set #password code_use 72`Modify to:
```mcfunction
scoreboard players operation #password code_use = @s code_trigger
scoreboard players operation #password code_use += #password code_use
scoreboard players operation #password code_use += #password code_use
scoreboard players operation #password code_use += @s code_trigger
scoreboard players operation #password code_use += @s code_trigger
```

can be controlled`#password`The value of

### 4.2 Custom keys
Since the custom key conflicts with the original function, a separate function needs to be used. In the dialog, you can enter the desired key, which will be passed in as a macro parameter:
```mcfunction
##记录密钥
$data modify storage code:code password_en set value "$(password)"
data modify storage code:code password set value []
function code:decode/change/password
##将密钥从二阶数组调整为一阶数组
function code:decode/password/de_group
```

of which`code:decode/change/password`It is the function that converts the key into a two-dimensional array.
However, during the encryption process, the key will be shifted to the left twice the length of the plaintext. In order for the final key to be the input content, the key needs to be shifted to the right an equal number of times in advance.
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

in,`length`by instruction`execute store result score #length code_use run data get storage code:code list`get

## 5 Conclusion
In fact, the practicality of this project is quite average. It is not suitable for decrypting maps because it is too difficult. It is too exaggerated for protecting one's own things. But this package is quite good as an exercise in data pack production.
This project realizes the simulation of the DES encryption and decryption algorithm by constructing a Feistel-like network. The core of the algorithm lies in the calculation of XOR and multiple conversions between characters and binary.
Through this project, we have a more intuitive understanding of the core idea of ​​symmetric key encryption—the reversibility of Feistel networks. Using execute store success to implement XOR operations, this process of creatively using game mechanics to complete computing tasks, is more valuable in itself than the final encryption effect.
In addition, the design of the coding scheme also brings some enlightenment. Mapping 64 characters into a 6-bit binary essentially builds a miniature character set. This experience of "defining encoding rules from scratch" deepens the understanding of the underlying character representation of computers.
This project also has some shortcomings. First of all, after reducing 16 rounds to 2 rounds and removing S-box replacement and compression replacement, the security is greatly reduced and it is difficult to resist known plaintext attacks (although it is basically sufficient for Minecraft); the character set is greatly restricted, only supporting 64 different symbols. Many symbols cannot be used and will be forcibly replaced with spaces.

[^1]: XOR, refers to comparing each bit of two bit strings. If they are the same, they will be 0, if they are different, they will be 1.
