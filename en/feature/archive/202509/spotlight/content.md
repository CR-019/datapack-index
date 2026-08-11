<SpotlightHead
    title = "Vanilla News - Λojang Spotlight - September 2025"
    authorName = "Alumopper"
    cover='../../../../../feature/archive/202509/_assets/spotlight.png'
    type=1
/>

Here is ***Vanilla*** news, the most ***Vanilla*** technical snapshot news in Minecraft. Our reporter *Vanilla Fox* reports the latest snapshot news for you~

This month Mojang released a total of six snapshots: 25w34a-37a, all belonging to 1.21.9. The data packversion number came to **87.0**, and the resource packversion number came to **69.0**.

Let’s talk about the conclusion first. This month’s update is less destructive and of average practicality. Overall, it is at the upper level of **Big Cup**.

The important thing to watch this month is the player model, a new technical entity. Unfortunately, the current player model cannot do anything useful. We can only wait for further updates from Mojang.

>Did you know that this month Mojang had the rare release of two`b`Snapshot -`25w36b`and`25w34b`.

<ColorLine />

> [!TIP]
>
> For more important destructive changes, they will be marked with 💥

## player model

In 25w36a, a new technical entity - **player model** (`mannequin`). The player model can be regarded as a playerentity without player control. It does not have the item column or the NBT fields owned by other players, but it has the basic NBT fields of the entity and mob, and also has basic mob behaviors. In addition, it also has some NBT fields that control rendering, which can define whether the player is left-handed or right-handed, or whether a cloak is displayed, etc.

At present, the player model does not have any other functions except for display, and it is under its name, that is`below_name`The scoreboard will display a non-removable`NPC`words.

## 💥player file format

In 25w34a, some changes were made to the player profile. me first`profile`The component's parsing behavior has changed. in the past,`profile`The component will be automatically parsed when loaded, and the parsing results will be stored in the component. Now, the content of this component will no longer be changed during parsing, that is, the game will no longer write parsed data to the component. According to the definition of fields in the component,`profile`The behavior of components is now divided into two types:

* If only defined`properties`field, or three fields exist at the same time, it will be parsed as it is and will not be changed due to changes in the files of the corresponding player (if it exists) in the online server.

* If not defined`properties`field, and`name`and`id`If only one of the fields is defined, the game will obtain the current data of the corresponding player in real time. There may be a delay in this process, with the default skin being displayed during loading.

At the same time, a new command is also added: [**`/fetchprofile`**](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/fetchprofile), used to obtain player files **asynchronously**. After the command is obtained, a text component containing the obtained results will be output in the chat bar. But since Minecraft's command system is **synchronous**, use`store`or`return`When obtaining the return value of this command through a method like this, it will not block the running of the command. On the contrary, it will always return`1`, and will always succeed.

## Miscellaneous

In addition, there are many smaller updated changes.

* for`object`Text component added`object`Field, there is`atlas`and`player`Two optional values. The former is the previous`object`component, which renders a player avatar based on a player profile component.
* Added a series of rules. Some of them replace the ones that originally existed in`server.properties`Configuration items in the file:
  *`pvp`: Whether to allow players to attack other players
  *`allowEnteringNetherUsingPortals`: Whether the entity can enter the Nether through the Nether Portal
  *`enableCommandBlocks`: Whether to enable command block
  *`spawnMonsters`: Whether to generate hostile mobs
  *`spawnerBlocksEnabled`: Whether to enable monster spawner
* 💥 will`enableCommandBlocks`Game rules renamed to`commandBlocksEnabled`, to match Bedrock Edition