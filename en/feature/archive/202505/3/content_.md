---
title: 'Spyglass (Dahan Batch) Advanced Instructions for Use'
---
<!-- markdownlint-disable MD033 MD041 -->
<FeatureHead
    title = "Spyglass (Dahanbatch) Advanced Instructions"
    authorName = "Dahesor"
/>


## What is Spyglass

Spyglass (i.e. Datapack Helper Plus, DHP or DHP, hereinafter referred to as`Spyglass`) is a plug-in developed by members of the Minecraft Java Edition community. It mainly supports Vscode and can provide vanilla mod writers with IntelliSense-like support, such as code completion, vulnerability reporting, syntax highlighting, link jumping and other functions. Its founder is SPGoding, and it is now updated and maintained by multiple community members. Don’t tell me you’re not using this plugin—get it installed now!

*Identifier:`spgoding.datapack-language-server`*[Github page](https://github.com/SpyglassMC/Spyglass)
* [Vscode Marketplace](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
*[Official Document](https://spyglassmc.com/)

## Spyglass.json file`spyglass.json`is the configuration file of Spyglass. You can create this JSON file in the root directory to customize the behavior of Spyglass in the current workspace, such as whether to leave spaces in NBT. If you are interested, you can read the documentation.

Our main focus today is the environment`env`The two parameters below: game version`gameVersion`and dependency file paths`dependencies`.

Let’s take a look first`gameVersion`. example:

```json
{
	"env": {
		"gameVersion": "1.21.5"
	}
}
```
By default, Spyglass checks`pack.mcmeta`File, inside`pack_format`and`supported_formats`Find the highest version number among them and regard it as the game version. All grammatical corrections and completions provided by Spyglass will be based on this version.

But as long as you create it in the root directory`spyglass.json`file and write the JSON in the above example, then no matter how you fill in`pack_format`, Spyglass will use`1.21.5`as version.

A little digression here. After changing the configuration file, you need to reload Vscode to make it take effect. This requires you to press`Ctrl+P`(on Mac`Cmd+P`) in the pop-up window above, enter`>Developer: Reload Window`,turn up`Developer: Reload Window`Press Enter to execute this command. Sometimes, Spyglass will have bugs, such as being unable to read the correct version. At this time, you can use the same method to find command`>Spyglass: Reset Project Cache`Try to execute.

——But compared to`gameVersion`more useful is`dependencies`. This list allows you to list a series of file paths, and Spyglass will try to read the contents of these paths as a running environment for the data pack you are writing.

For example, sometimes you may decide to use libraries written by others and stuff these libraries into the datapacks folder. However, Spyglass does not know that these libraries provide you with a lot of additional functions, so every time you try to call functions in these libraries, you will see ugly yellow wavy lines to remind you that this function does not exist. What to do? Do this:

```json
{
	"env": {
		"dependencies": [
			"file:///C:/path/.minecraft/saves/WorldName/datapacks/library.zip",
			"@vanilla-datapack",
			"@vanilla-resourcepack",
			"@vanilla-mcdoc"
		],
		"gameVersion": "1.21.5"
	}
}
```
Just write the path to the target library into`dependencies`, Spyglass will read all the functions, advancement, loot table, scoreboard, storage, team...anything you can think of in this package and feed them to the current environment. That is to say, you will be able to get the completion, error correction, etc. of all the content provided by the library in the current data pack. You can even Ctrl+click the link to jump to see what is written in each file, just like this library is stuffed into the current data pack.

By the way, the following`@vanilla-XXX`It is the default data, including all vanilla tags, loot tables, items, entities, blah blah... it must be retained.

By the way, the above path is for Windows. Linux generally does not have a drive letter, similar to`file:///path/to/libs.zip`.

One more thing, Chinese characters and spaces are allowed in the path.

Of course, this data pack, which is regarded as a dependent environment, does not have to be zip-packed; you can also point it directly to a folder.

--and more! After Spyglass was updated not long ago, support for most resource pack contents was officially added, and now the data pack can be completed with resource pack contents! If you are used to`assets`and`data`Put it in a folder. You may have discovered it. Now there is a similar text component in the data pack.`translate`Or item stack component`item_model`It is now possible to obtain the language files in the resource pack and the completion of itemmodel mapping!

But I am more accustomed to putting the resource pack in`resourcepacks`Next, is there anything wrong?`assets`and`data`Is there a way to let data pack get these completions even if I put them once? Of course! Just write the path to the resource pack into`dependencies`Just fine inside:

```json
{
	"env": {
		"dependencies": [
			"file:///C:/path/.minecraft/saves/WorldName/datapacks/library.zip",
			"file:///C:/path/.minecraft/resourcepacks/my_pack/",
			"@vanilla-datapack",
			"@vanilla-resourcepack",
			"@vanilla-mcdoc"
		],
		"gameVersion": "1.21.5"
	}
}
```
Now you can get the translation keys, fonts, item models of the resource pack in the data pack, etc. Help! Unfortunately this is not real-time - the runtime environment is only updated once when Spyglass is initialized. Whenever you modify the resource pack, you need to update the data pack environment`Developer: Reload Window`one time.

## Powerful mcdoc file`mcdoc`Is a specification file that describes what should be included in JSON or SNBT in different places in Minecraft vanilla data pack and resource pack. For example, mcdoc told Spyglass that zombies have an NBT called`DrownedConversionTime`, the type is`int`;item modifier`set_lore`There is a parameter called`entity`, is a string and must be specific content; or it is in the font file`providers`It’s a list…

A collection of mcdoc files specifying vanilla content is maintained by the Spyglass team at [SpyglassMC/vanilla-mcdoc](https://github.com/SpyglassMC/vanilla-mcdoc). Spyglass will also save a copy on your computer. The default location for Windows is`%localappdata%/spyglassmc-nodejs/Cache/downloader/mc-je/vanilla-mcdoc.tar.gz`. Other operating systems can execute command`Spyglass: Open Cache Folder`later found`./downloader/mc-je/vanilla-mcdoc.tar.gz`。

`mcdoc`It is a powerful function - by creating a custom mcdoc file, we can customize components for our own Storage and items`custom_data`, marked`data`The custom NBT structure etc. provided under it provide completion and error correction. As long as you are willing to spend a little time writing a mcdoc document for your own data structure, then when you operate these NBTs in the data pack, you can get the various supports provided by Spyglass just like operating vanillaNBT.

Next, this article will briefly introduce how to implement:

First, you need to install the Mcdoc Syntax Highlighting plug-in, whose identifier is`misodee.vscode-mcdoc`（[Marketplace](https://marketplace.visualstudio.com/items?itemName=Misodee.vscode-mcdoc)).

Secondly, copy a collection of mcdoc files with vanilla content from the above Github or local file, decompress it and open it in a separate Vscode window. These files will become important references for our custom files.

Next, you can create a folder in your own data pack root directory`mcdoc`. Generally speaking this folder will be the same as your`data`Folder sibling (if the data pack is opened directly by Vscode).

Next, you can create a customized one in the mcdoc folder`.mcdoc`file, for example, we create a`test.mcdoc`.

## .mcdoc syntax

Due to space limitations, we will not go too deep into how to write mcdoc files, but will only briefly introduce the commonly used parts; for detailed instructions, you can read [Official Documents] (https://spyglassmc.com/user/mcdoc/) or reference`vanilla-mcdoc`content.

Define compound tags:

```mcdoc
struct myStruct{
}
```
This defines a function called`myStruct`The compound tag has nothing in it.

If you want to add a key-value pair to a composite tag, you can write it as`key name: value type`form. Accepted base types include`boolean`(Boolean value),`byte`(byte type),`short`(short shaping),`int`(plastic surgery),`long`(long plastic surgery),`float`(single precision floating point),`double`(double precision floating point),`string`(string).

Use commas between different tags`,`Separate:

```mcdoc
struct myStruct{
	myInt: int,
	myShort: short,
	myString: string,
}
```
This mcdoc will allow you to write something like`{myInt:4, myShort: 7s, myString:"Dahesor"}`NBTtag.
 * All tags are required by default. To make a tag optional, you need to add it after the key name.`?`.
 * If you want to limit the range of values, you can add`@ min..max`.
 * Add before type`#[]`You can specify specific rules that the value must comply with. for example`#[id="function"] string`Specifies that this string must be the namespaceID of a function. After use, Spyglass will also pop up the completion window for all functions when providing completion, just like writing`function`Like when commanding. There are many specific rules such as these, which can be customized in`vanilla-mcdoc`Find in.

```mcdoc
struct myStruct{
	myInt: int @ 5..,
	myShort?: short,
	myFunction: #[id="function"] string,
}
```
here`myShort`is an optional tag,`myInt`should be at least 5,`myFunction`Must be the namespaceID of a function.

If the value is of any type, you can write`any`. If the value is a list, you can use`[]`Surrounds a single element of a list. Support use`@ min..max`Limit list length.

if the value is another`struct`You can quote its name, or you can write it directly and support anonymity.

To put a`struct`content embedded within another`struct`inside, use`...structName`format:

```mcdoc
struct myStruct{
	anyThing: any,
	ListOfInt: [int],
	struct_anonymous: struct{
		AnotherList: [short @ ..3] @ 4,
	},
	struct_reference: StructTwo,
	...StructThree
}

struct StructTwo{}
struct StructThree{
	myInt: int,
	myShort: short,
}
```


`type`Type allows you to choose one of multiple value types. written in brackets`()`within, with`|`separated. You can also write directly in`struct`in:

```mcdoc
type myType = (int|string)

struct myStruct{
	value: myType,
	children: (struct{} | boolean)
}
```


`enum`The type requires a selection from multiple given values. Before the parentheses`()`The type of value declared within. Each option starts with`name=value`given in the form. in`value`is the actual typed content,`name`is just a label, like a pronoun.
It can be declared outside, or written inside and anonymous.

Key names are allowed to reference enums. The format is`[enum]`：

```mcdoc
enum(string) myFood{
	Apple = "apple",
	Bread = "bread",
	Dried_Kelp = "dried_kelp",
}

struct myStruct{
	favorite: myFood,
	[myFood]: struct{
		saturation: int
	}
}
```
To reference content declared in other files, use`use`, use two double quotes`::`to enter a folder or module. You can quote content from other custom files of your own, or you can quote`vanilla-mcdoc`content in. For example, if you want to quote the file in my mcdoc folder`utils.mcdoc`in`enum(string) ItemNames`, it is necessary to write`use::mcdoc::utils::ItemNames`.

You can use vscode to open`vanilla-mcdoc`. With the Mcdoc Syntax Highlighting plug-in installed, place the cursor in a module and the path to the module should be displayed above.

![module path](../../../../../feature/archive/202505/3/png/image.png)

For example, here is the mcdoc path of the 1.21.5+ text component.

```mcdoc
use::java::util::text::Text

struct myStruct{
	CustomText: Text
}
```
here`ItemName`The value is defined as the text component, which is the referenced Text.

The last and most important question is how to tell Spyglass what the Struct we specified is used for? Used here`dispatch`. The syntax is`dispatch project[subproject] to type`.

A commonly used item (formally called`dispatcher key`But it doesn’t matter so much here) Yes`minecraft:storage`, that is, custom command storage storage. At this time`subproject`It is a Storage namespace:

```mcdoc
use::java::util::text::Text

dispatch minecraft:storage["foo:bar"] to myStruct

struct myStruct{
	CustomText: Text
}
```
If you did everything right, then you are now`foo:bar`down`CustomText`You can get it completed while working. Spyglass will`CustomText`The value is used as a text component to complete and correct errors. (try it`data modify storage foo:bar CustomText set value ...`! )

Want to customize items`custom_data`Or any mob after 1.21.5`data`, the project name used is`mcdoc:custom_data`. The subproject is`custom_data`or`data`The key name of the first level NBT is:

Want to define a marker entity before 1.21.5`data`,use`mcdoc:marker_data`。

```mcdoc
dispatch mcdoc:custom_data["weapon_type"] to string
dispatch mcdoc:custom_data["att_lock"] to byte
dispatch mcdoc:custom_data["crafted"] to byte
dispatch mcdoc:custom_data["data"] to struct{
	someting?: any
}
dispatch mcdoc:custom_data["why"] to MyStruct

struct MyStruct{}
```
There's a lot more to mcdoc syntax. For example, deciding which keys are allowed to appear based on the value of a specific key, such as providing comments for each key-value pair, etc... Readers are asked to read the document or flip through it.`vanilla-mcdoc`The author also summarized his experience in the same way.

## Conclusion

The mcdoc folder can be released with the data pack, or it can be read as dependencies once as an environment. It might be interesting if all libraries provide mcdoc, and their public functions, scoreboards, etc., are made into specially crafted dependency.zip files for Spyglass to read efficiently.

At least now I can't do without the convenience provided by mcdoc and dependencies. I hope readers can benefit from this article to some extent, making the data pack development that has been exhausted by Mojang~ (April Fool's Day) a little easier.