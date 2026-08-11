---
title: 'TheSkyBlessingdata pack analysis part two'
---
<FeatureHead
    title="TheSkyBlessingdata pack analysis part two"
    authorName="Ling"
    cover = '../../../../../feature/archive/202601/_assets/a.png'
/>

# Preface

OhMyDat is a wheel attached to the TSB project for processing entity private data. It uses a complexity of`O(1)`The algorithm allocates an independent freely readable and writable data space for each execution entity. Its important roles in maps include:

- Back up entity data and identify the data time of a certain game based on a timestamp to avoid high-frequency use`data`command reads entity data
- Use concepts similar to programming objects to store some customized entity data, such as buffs defined in the game and panel data such as the entity's attack power resistance.

Let’s do a quick chant before officially starting this article. TSB is a map work with high playability and technical content. Interested readers are recommended to play it on their own. It involves third-party works, so the source data pack will not be fully attached. These contents and the data pack tutorial provided by the map production team can be found in TSB’s warehouse.

# data pack introduction

How to understand private data storage? In a programming language that supports object-oriented programming, the data owned by each instance object is independent. Although each instance object has the same data format, each other's data is stored separately on the instance.

In MCdata pack, there are similar features like

- Scoring items of scoreboard. The mapping relationship of "entity - score" can be realized. The score can be regarded as the private data of the entity, but the format must be an integer and cannot store complex structures.
- NBT data of entity, supporting complex structures and`data`command operation, but high-frequency reading and writing will significantly consume performance.

So there is OhMyDat's solution, whose function is described in one sentence - **Construct a unique mapping relationship of "entity-command storage", thereby allocating exclusive and independent command storage space to each entity**. As a wheel data pack (or tool data pack), its exposed usage is very simple. It has been briefly introduced in the previous analysis, and I will mention it again here:

```mcfunction
#Execute pleasefunction before use (the executor of the function must be the entity to store data)
function #oh_my_dat:please

#Get data storage
data get storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].DataName

#Modify data storage
data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].DataName set value DataValue

#Delete data store
data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].DataName
```
The main structure can be summarized into three parts

-`OhMyDayID`scoreboard
  - In the system, each entity has an independent ID used to find its data space. The score on the scoreboard is the data space ID assigned to the entity.
- An array of ids in command storage
  - It can also be called the ID queue. The IDs in the ID scoreboard will also be stored in this array for the allocation of new IDs. The newly allocated IDs will be added to the end of the array. It should be noted that the scoreboard and the data in this array are not necessarily synchronized.
- An eight-dimensional array in command storage
  - The location where the entity data space is stored. All entities that have been assigned IDs have their own data space in this multi-dimensional array. The index number of this data space can be obtained by calculating the entity ID.

The main functions include the following

-`please.mcfunction`- Assign an ID to the function executor and obtain the data space, or obtain the existing data space based on the ID
-`allocate.mcfunction`- Assign an ID to an entity without an ID
-`gc.mcfunction`- Clean up invalid IDs and corresponding data spaces in the system when allocating IDs
-`provide.mcfunction`- After an entity ID is passed in, locate the corresponding data space by ID

The workflow of the system's modules is shown below. The following sections also introduce the three modules of ID allocation, ID cleanup, and data-space lookup by ID.

![omdworkflow.drawio.png](../../../../../feature/archive/202601/a/img/omd%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.drawio.png)

<br>

# Assign new ID

When you first enter the game, the id scoreboard is empty, and there is only one 0 in the id array. Execute for player`please`function, since the player does not have an id on the id scoreboard, you need to assign an id to the player first, using the existing id in the id array as the standard. The process of assigning id is as follows

1. Move the first bit of the array to the end
2. Get the new id according to the formula of (the first digit of the array + the last digit of the array)/2
3. Add the new id to the end of the array
4. Synchronize the id to the player's scoreboard score

When there are enough ids allocated, the ids will get smaller and smaller according to the above formula. However, since the new ids are calculated based on the existing ids, all ids will not be repeated. When the end of the array is`0`, this bit will be replaced by the maximum value of the assignable ID`65536`Make the new id larger to ensure that it does not exceed the maximum value`65536`. Let’s further understand this process with examples from just entering the game.

1. Just enter the game and the data pack is initialized. The id array is [0]
2. Execute with player as executor`please`function, get the first place`0`and the last one`0`, the last one is`0`So it was replaced by`65536`3. Calculate the player’s id as$(0 + 65536) / 2 = 32768$4. Update the player's id score item and add it to the id array. At this time, the id array is`[0, 32768]`5. Synchronize the id to the player's scoreboard score

![image.png](../../../../../feature/archive/202601/a/img/edac258c-e7fc-44d1-9a5e-ebc94ee08d6d.png)

Since the array has only one element, there is no need to shift. At this time, the execution continues for another entity.`please`function

1. First move the first 0 to the end to get the first digit`32768`and the last one`0`，`0`is replaced by`65536`2. Calculate the id of the entity as$(32768 + 65536) / 2 = 49152$3. Update the id score item of the entity and add it to the id array. At this time, the id array is`[32768, 0, 49152]`4. Synchronize the id to the scoreboard score of the entity

![image.png](../../../../../feature/archive/202601/a/img/image.png)

Then execute for another entity`please`function, repeat the above process

![image.png](../../../../../feature/archive/202601/a/img/image%201.png)

Execute again

![image.png](../../../../../feature/archive/202601/a/img/image%202.png)

The above has vividly demonstrated how the system allocates IDs to mobs. There is only one person responsible for allocating IDs.`allocate`function, its content is also very simple, the queue rotation part is in`gc`function, which is completed in the part of recycling invalid ids.

```mcfunction
——————allocate.mcfunction——————

function oh_my_dat:sys/gc

#Get the first and last digit of the id array as a reference value for the new id
    execute store result score $ OhMyDatID run data get storage oh_my_dat: id[-1]
    execute store result score $ OhMyDat run data get storage oh_my_dat: id[0]

#If the last digit is 0, change it to 65536
    execute if score $ OhMyDatID matches 0 run scoreboard players set $ OhMyDatID 65536

#The new id is the sum of the first and last digits of the array divided by 2
    scoreboard players operation $ OhMyDatID += $ OhMyDat
    scoreboard players set $ OhMyDat 2
    scoreboard players operation $ OhMyDatID /= $ OhMyDat

#Synchronize the new id to the id array and the score item of the executor
    data modify storage oh_my_dat: id append value -1
    execute store result storage oh_my_dat: id[-1] int 1 run scoreboard players get $ OhMyDatID
    scoreboard players operation @s OhMyDatID = $ OhMyDatID

```


`id`It will be added to the array and the scoreboard score of the entity at the same time, but as mentioned earlier, the scores of the two are not synchronized. The scoreboard score of the entity will be removed after the entity is cleared, but the id array is in the command storage. At this time, the id array generates a redundant id. If there is data in the entity's data space, these data will become useless data. For this purpose we have introduced the following module function for recycling IDs

# Recycle invalid ids

The function of recycling invalid IDs will be executed every time before allocating an ID to a new entity. In order to facilitate understanding of its function, this function is executed separately for demonstration.

Three IDs have now been assigned to three entities:`32768`、`16384`and`49152`, these IDs are also recorded in the player`ID`on the scoreboard and added to the ID queue.

Now the kill ID is`16384`entity, entity in`ID`The scores on the scoreboard will be cleared, but`16384`This ID still exists in the ID queue, and this ID is an invalid ID at this time.

Execute now`gc`function (Garbage Collection, abbreviation for garbage collection), the ID queue is rotated in the same way as when allocating new IDs, invalid IDs`16384`It was pushed to the head of the queue and was detected as an invalid ID, so it was removed from the ID queue and its corresponding data space was also cleared. After a series of operations, the calculated new entity ID is added to the end of the queue:

![image.png](../../../../../feature/archive/202601/a/img/image%203.png)

The above process sounds complicated, but there is actually only one core idea, which is how to identify an invalid ID when it is pushed to the top of the queue. To further simplify our needs, the essence of invalid ID is that the original entity does not exist.`ID`The data in the scoreboard and ID queues are out of sync, so the question becomes how to determine whether an ID is still on the scoreboard.

Due to the limitations of MCcommand, it is cumbersome to directly traverse the entire list like a programming language. However, MC's scoreboard still has some functions that are convenient for operating on the entire list. For example, the asterisk (\*) can operate on all targets being tracked by the scoreboard. Combined with`operation`With the comparison operator in command, we can quickly find the largest or smallest score from the scoreboard:

```mcfunction
#Increase the score of all tracked targets on the Scoreboard by 100
scoreboard players add * A 100

#Assign the smallest score on the scoreboard to Steve
scoreboard players operation Steve A < * A
```
These simple functions plus some ingenuity of the original author resulted in the following method for determining whether an ID is still on the scoreboard.

1. Subtract the ID to be detected`2147483647`as reference value
2. Right`ID`All scores on the scoreboard minus the reference value
3. Get`ID`The biggest score on the scoreboard
4. Add the maximum score obtained back to the reference value to obtain the restored ID.`ID`All scores on the scoreboard perform the same operation
5. Determine whether the ID to be detected is greater than the restored ID. If so, the ID to be detected is an invalid ID.

![omd invalid ID detection process.drawio.png](../../../../../feature/archive/202601/a/img/omd%E6%97%A0%E6%95%88ID%E6%A3%80%E6%B5%8B%E6%B5%81%E7%A8%8B.drawio.png)

`2147483647`It is the integer upper limit of the scoreboard score. According to the rules of integer overflow, when the value exceeds this upper limit, it will become a negative number:$$2147483647 + 1 = -2147483646$$Now assuming that the scoreboard has the ID we want to detect, then the score will change as follows during the operation of the entire scoreboard:$$id - ( id - 2147483647 ) = 2147483647$$Since no fraction can be greater than`2147483647`, so at this time** as long as the maximum score of the scoreboard obtained is equal to`2147483647`It can be considered that the ID to be detected exists on the scoreboard**. This part of the function is implemented as follows

```mcfunction
——————gc.mcfunction——————

#Take the first position in the queue as the verification ID
    execute store result score $ OhMyDat run data get storage oh_my_dat: id[0]

#Subtract 2147483647 as reference value
    scoreboard players remove $ OhMyDat 2147483647

scoreboard players set $ OhMyDatID 0

#All scoring items on the scoreboard minus the reference value
    scoreboard players operation * OhMyDatID -= $ OhMyDat

#Find the maximum value of all scoreboard items
    scoreboard players operation $ OhMyDatID > * OhMyDatID

#Restore scoreboard
    scoreboard players operation * OhMyDatID += $ OhMyDat
    scoreboard players operation $ OhMyDat >< $ OhMyDatID

#Compare the ID to be verified with the maximum value of the scoreboard just found. If it is greater than this maximum value, it means that this is an invalid ID and perform cleanup.
    execute store result score $ OhMyDatID run data get storage oh_my_dat: id[0]
    execute if score $ OhMyDatID > $ OhMyDat run function oh_my_dat:sys/gc_loop
```
On the contrary, if the maximum value obtained is not`2147483647`, then there are two situations. The ID before transforming the scoreboard may be greater or less than the ID to be detected, which are recorded as$( id + n )$and$(id - n)$, the results after the two ID transformations are as follows$$ ( id + n ) - ( id - 2147483647 ) = n - 2147483647$$
$$( id - n ) - ( id - 2147483647 ) = 2147483647 - n$$Since the range of ID allocation is the same as in the above formula$n$The range is in$0$ ~ $65536$, so according to the above results, it can be known that an ID larger than the ID to be detected will become a negative number close to the limit, and an ID smaller than the ID to be detected will become a positive number close to the limit.

If the ID to be detected is not on the scoreboard, then the maximum value of the scoreboard found at this time corresponds to the ID in the ID array that is one smaller than the ID to be detected. At this time, it can be determined that the ID to be detected is not in the scoreboard and should be cleared. At the same time, other IDs larger than this value in the ID array should also be cleared (otherwise the highest value found does not correspond to it). So in`gc_loop`In the function part, in addition to cleaning up invalid ids and their corresponding data spaces, the same operation will be performed recursively on the next bit in the queue:

```mcfunction
——————gc_loop.mcfunction——————

#Clean up the data space corresponding to the id and remove it from the id queue
	function oh_my_dat:sys/provide
	data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4] set value {}
	data remove storage oh_my_dat: id[0]

#Recursively search for the next position in the queue
	execute store result score $ OhMyDatID run data get storage oh_my_dat: id[0]
	execute if score $ OhMyDatID > $ OhMyDat run function oh_my_dat:sys/gc_loop
```
<br>

# Get data space based on id

### Introduction to multidimensional arrays

As mentioned earlier, an eight-dimensional array in command storage is responsible for managing all entity data spaces. \
First, let’s introduce the concept of multidimensional arrays. To give the simplest example of an array,`arr`The array is`[100, 101, 102, 103]`, index number`0`arrive`3`Each corresponds to an element in an array,`arr[0]`The corresponding data is`100`.

![omd array introduction 1.drawio.png](../../../../../feature/archive/202601/a/img/omd%E6%95%B0%E7%BB%84%E4%BB%8B%E7%BB%8D1.drawio.png)

After turning the array into a multi-dimensional one, the index number of each layer of the array will correspond to a new array, and the data will be stored in the end array. Taking a two-dimensional array as an example, a two-dimensional array`arr`The definition format is`[[100, 101, 102, 103],[],[],[104, 105, 106, 107]]`. Perhaps it would be more intuitive to write it in the following tree shape:

```snbt
[
    [100, 101, 102, 103],
    [],
    [],
    [104, 105, 106, 107]
]
```
In this two-dimensional array,`arr[0]`and`arr[3]`is an array with four elements,`arr[1]`and`arr[2]`are two empty arrays. If I want to get`100`For this data, its index number is`arr[0][0]`，`107`Then it is`arr[3][3]`![omd array introduction 2.drawio.png](../../../../../feature/archive/202601/a/img/omd%E6%95%B0%E7%BB%84%E4%BB%8B%E7%BB%8D2.drawio.png)

In the above array example, an empty array is inserted. The number of elements in each layer of the multi-dimensional array is different. The multi-dimensional array at this time is a non-rectangular array, and the eight-dimensional array used by OhMyDat is a rectangular array, which means that each layer of the array has the same number of elements. For a rectangular array, the maximum amount of data stored is the square of the number of elements in each layer and the array dimension.

In the above introduction of assigning IDs to entities, we already know that the upper limit of IDs assigned to entities is$65536$, the special meaning of this number is that it can also be written as$4^8$. The eight-dimensional array to be used to store the data space conforms to the matrix array rules and the elements of each layer are$4$, so its maximum storage quantity is also$4^8$, which corresponds to the maximum ID that can be allocated, so that each entity that has been allocated an ID can have a completely independent data space in the eight-dimensional array.

### Convert ID to array index

After understanding how multi-dimensional arrays work and the correspondence between ID and multi-dimensional arrays, the next task is how to find the corresponding data space in this eight-dimensional array based on the entity ID. In order to avoid confusion, let's get used to the way eight-dimensional arrays are written.

![omd array introduction 3.drawio.png](../../../../../feature/archive/202601/a/img/omd%E6%95%B0%E7%BB%84%E4%BB%8B%E7%BB%8D3.drawio.png)

When the program to find the address is running, the decimal ID of the entity will first be converted into a quaternary ID, and the first ID assigned when entering the game will be used.`327689`For example, the corresponding quaternary number is`2000,0000`, the corresponding address in the eight-dimensional array is as follows. Similar logic, the maximum value of entity ID is`65535`, then its address in the eight-dimensional array is`arr[3][3][3][3][3][3][3][3]`.

![omd address conversion introduction.drawio.png](../../../../../feature/archive/202601/a/img/omd%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2%E4%BB%8B%E7%BB%8D.drawio.png)

The above introduction is very vivid, but the implementation through MC instructions is not as direct as the diagram. The actual digital decomposition process is as follows:

1. Multiply the ID value by`65536`（$4^8$), get the first layer offset
2. Multiply the result by$4$, get the second layer offset
3. Multiply the result by$4$, get the third layer offset
4.…
5. Multiply the result by$4$, get the eighth layer offset

The value range of Minecraftscoreboard score is`-2147483648` ~ `2147483647`（$-2^{31}$ ~  $2^{31} - 1$), the baseline value for ID allocation is`65536`（$2^{16}=4^8$),Will`ID`After multiplying the value by the base value, the value can be enlarged to the entire value range. At the same time, the value range can be divided into four core intervals, each interval corresponding to a digit offset of the quaternary number (that is, the value of the corresponding digit of the quaternary number, and also the index value of the corresponding dimension in the eight-dimensional array)

![OMD digital decomposition introduction.drawio.png](../../../../../feature/archive/202601/a/img/omd%E6%95%B0%E4%BD%8D%E5%88%86%E8%A7%A3%E4%BB%8B%E7%BB%8D.drawio.png)

every time`ID`To perform multiplication by four, essentially multiply`ID`The quaternary number is shifted one bit to the left, even if the operation result exceeds$32$The bit integer range triggers numerical overflow, and the final result will still fall within the four preset intervals. pass judgment`ID`The interval to which it belongs can determine the offset size of the current digit, and then map the offset to the index of the corresponding level in the eight-dimensional array. This method was also used in the previous article when dealing with experience bars:

to`ID`for`9999`For example, it is known that the decimal to quaternary number is`2130033`. The digital decomposition operation process is as follows:

1.$9999 \times 65536 = 655294464$, in$0$ ~ $2^{30}$interval, corresponding offset`0`
2. $655294464 \times 4 = -1673789440$, in$-2^{31}$ ~ $-2^{30}$interval, the corresponding offset is`2`
3. $-1673789440 \times 4 = 1894776832$, in$2^{30}$ ~ $-2^{31}$interval, corresponding offset`1`
4. $1894776832 \times 4 = -1010827264$, in$-2^{30}$ ~ $0$interval, corresponding offset`3`5. (Other digits can be deduced by analogy)

### Get the data space based on the index

Through the above digital decomposition process, we have obtained the index number of the entity ID in the eight-dimensional array after conversion. By passing the index number into the array, we can get the entity data space we want to obtain. However, unless a macro is used, the MC instruction does not provide a method of directly passing the index into the array. Therefore, there is the following method of locating elements through negative indexes:

![OMD index positioning introduction.drawio.png](../../../../../feature/archive/202601/a/img/omd%E7%B4%A2%E5%BC%95%E5%AE%9A%E4%BD%8D%E4%BB%8B%E7%BB%8D.drawio.png)

`arr[-4]`Represents the fourth element of the array from back to front. Without changing the original array data, you can add empty elements at the end of the array, and add a specified number of empty elements according to the index number you need to obtain, so`arr[-4]`This allows us to accurately point to the element we want to locate.

Still with`ID`for`9999`Take the entity as an example. We already know that its quaternary system is`2130033`, then the corresponding array index is`arr[0][2][1][3][0][0][3][3]`(Note to complete the$8$bit), the process of obtaining the data space is as follows:

1. The first one is`0`, then no empty elements will be appended, the first level`arr[-4]`point to`arr[0]`2. The first one is`2`, then towards`arr[-4]`This array appends two empty elements, and the second level`arr[-4][-4]`Point to the original`arr[0][2]`3. The first one is`1`, then towards`arr[-4][-4]`This array appends an empty element, and the second level`arr[-4][-4][-4]`Point to the original`arr[0][2][1]`4. The first one is`3`, then towards`arr[-4][-4][-4]`This array appends three empty elements, and the second level`arr[-4][-4][-4][-4]`Point to the original`arr[0][2][1][3]`5. (Other digits can be deduced by analogy)

It should be noted that since adding empty elements is performed in the entire eight-dimensional array, if you switch the object to obtain the data space, you must first clean up the previously added empty elements each time, so in`provide`You can see such a long paragraph at the beginning of the function. Its function is to clean up the last three empty elements without changing the first four bits of each layer of the array.

```mcfunction
——————provide.mcfunction——————

#Clean empty elements
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][4]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][4]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][-4][4]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][-4][-4][4]
	data remove storage oh_my_dat: _[-4][-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][-4][4]
	data remove storage oh_my_dat: _[-4][-4][6]
	data remove storage oh_my_dat: _[-4][-4][5]
	data remove storage oh_my_dat: _[-4][-4][4]
	data remove storage oh_my_dat: _[-4][6]
	data remove storage oh_my_dat: _[-4][5]
	data remove storage oh_my_dat: _[-4][4]
	data remove storage oh_my_dat: _[6]
	data remove storage oh_my_dat: _[5]
	data remove storage oh_my_dat: _[4]
```
The other parts are performed layer by layer for a total of eight times just like the analysis. There is an extra step to copy the structure of initial (an empty eight-dimensional array defined during initialization) to prevent the element corresponding to the index from being found.

```mcfunction
——————provide.mcfunction——————

#first floor
	scoreboard players operation $ OhMyDatID *= $65536 OhMyDatConst
	execute if score $ OhMyDatID matches 1073741824.. run data modify storage oh_my_dat: _ append value []
	execute if score $ OhMyDatID matches ..-1073741825 run data modify storage oh_my_dat: _ append from storage oh_my_dat: two_empty_lists[]
	execute if score $ OhMyDatID matches -1073741824..-1 run data modify storage oh_my_dat: _ append from storage oh_my_dat: three_empty_lists[]

#second floor
	execute unless data storage oh_my_dat: _[-4][0] run data modify storage oh_my_dat: _[-4] set from storage oh_my_dat: initial[0]
	scoreboard players operation $ OhMyDatID *= $4 OhMyDatConst
	execute if score $ OhMyDatID matches 1073741824.. run data modify storage oh_my_dat: _[-4] append value []
	execute if score $ OhMyDatID matches ..-1073741825 run data modify storage oh_my_dat: _[-4] append from storage oh_my_dat: two_empty_lists[]
	execute if score $ OhMyDatID matches -1073741824..-1 run data modify storage oh_my_dat: _[-4] append from storage oh_my_dat: three_empty_lists[]
	execute unless data storage oh_my_dat: _[-4][-4][0] run data modify storage oh_my_dat: _[-4][-4] set from storage oh_my_dat: initial[0][0]

#third floor
	scoreboard players operation $ OhMyDatID *= $4 OhMyDatConst
	execute if score $ OhMyDatID matches 1073741824.. run data modify storage oh_my_dat: _[-4][-4] append value []
	execute if score $ OhMyDatID matches ..-1073741825 run data modify storage oh_my_dat: _[-4][-4] append from storage oh_my_dat: two_empty_lists[]
	execute if score $ OhMyDatID matches -1073741824..-1 run data modify storage oh_my_dat: _[-4][-4] append from storage oh_my_dat: three_empty_lists[]
	execute unless data storage oh_my_dat: _[-4][-4][-4][0] run data modify storage oh_my_dat: _[-4][-4][-4] set from storage oh_my_dat: initial[0][0][0]

#And so on...
```
After the above steps, finally`arr[-4][-4][-4][-4][-4][-4][-4][-4]`The address of is the address of the data space corresponding to the entity ID. The above series of steps have been encapsulated, so when used in the end, it will look like the initial demonstration.

```
function oh_my_dat:please
data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].Data set from entity @s
```
# unsolvedmystery

While debugging and writing, I also suffered from AI illusion many times. The inverse algorithm is indeed a big project, so the technical ideas of the original map team were really too ruthless. The above summary of good ideas is enough for reproduction, but in`gc`There is also a piece of leftover content in the function that is used to control whether the function is recursive. I have never been able to see the idea, especially a calculation formula. If there are readers who can understand this algorithm, please contact me to modify it.

```mcfunction
execute store result score $ OhMyDat run data get storage oh_my_dat: id[-1]

execute if score $ OhMyDat matches 0 run scoreboard players add $ OhMyDat 65536
execute if score $ OhMyDatID matches 0 run scoreboard players add $ OhMyDat 65536
execute if score $ OhMyDatID matches 0 run scoreboard players add $ OhMyDatID 65536
scoreboard players operation $ OhMyDat += $ OhMyDat
scoreboard players operation $ OhMyDat -= $ OhMyDatID
scoreboard players operation $ OhMyDat -= $ OhMyDatID
scoreboard players operation $ OhMyDatID -= $ OhMyDat
execute store result score $ OhMyDat run data get storage oh_my_dat: id[1]
scoreboard players operation $ OhMyDatID -= $ OhMyDat

execute if score $ OhMyDatID matches -1.. run function oh_my_dat:sys/gc
```


![image.png](../../../../../feature/archive/202601/a/img/image%204.png)

# Appendix

### **TheSkyBlessing Map Project Warehouse**

[GitHub - ProjectTSB/TheSkyBlessing: TheSkyBlessing のベース Datapack のリポジトリ](https://github.com/ProjectTSB/TheSkyBlessing)

### OhMyDat wheel data pack warehouse

[GitHub - Ai-Akaishi/OhMyDat: Minecraft Private Storage Datapack](https://github.com/Ai-Akaishi/OhMyDat)
