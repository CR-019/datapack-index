<FeatureHead
    title = '实例·新快照把玩之潜影盒显示与物品展示与复合输入'
    authorName = Rainbow_
    avatarUrl = '../../_authors/Rainbow_.png'
    :socialLinks="[
        { name: 'BiliBili', url: 'https://space.bilibili.com/11313906' }
    ]"
/>

## 前言

众所周知 25w32a 更新了 object 文本组件嘛，就乘兴写了点小玩具。纯写着玩的所以既没有完善也没有封装。也就是说，我并没有使其自动化，也没有写进 G 键菜单等快捷入口，需要手动调用。命名空间、路径等也完全不符合任何规范。
这个玩意儿最大的好处就是不需要安装资源包，不需要将贴图处理成字体。除此之外，由于不是直接显示物品模型，而是拉取纹理贴图，导致小问题多多。能用字黑还是尽量用字黑吧。

## 内容

· 藉由将物品 id 与 纹理贴图路径的大致对应，能够显示很大一部分物品方块，但仍有大量物品方块的纹理路径需要针对性处理，譬如一部分物品需要添加 `_front` 的后缀，一部分需要添加 `_side` 后缀。
· 总之，我写了：
一. 将潜影盒的物品显示物品提示框 tooltip 的 Lore。稍微改改也能显示在 actionbar 和聊天框。
二. 想做物品展示，同时为了解决自动处理的贴图总是时不时有紫黑块的问题，干脆写了一个复合输入系统，可以通过一个对话框往聊天框里打复杂一些的内容。
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754865769-902201-image.png)
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754865681-651505-image.png)
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754865881-466170-image.png)
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754865920-291448-image.png)
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754866055-743588-image.png)

### 使用

#### 潜影盒显示：

```mcfunction
function _:shulker_show/a
```

可以更新手上潜影盒的 Lore
更新之后， storage 中会缓存最新的数据，通过以下命令可以打印到对话框中

```mcfunction
tellraw @a [{"storage":"_","nbt":"List[1]",interpret:1},"\n",{"storage":"_","nbt":"List[2]",interpret:1},"\n",{"storage":"_","nbt":"List[3]",interpret:1}]
```

或者也可以点击复合输入界面的快捷展示按钮来显示。

#### 复合输入界面

```mcfunction
function _:_cplx_typing
```

呼出界面。
插入文本：字面义。
插入文本组件：可以插入一些像是悬浮事件、NBT组件、彩色文本之类的组件。但是由于宏的特性和引号来回套的问题，可能会有bug。如果有不符合语法的地方会报错，需要重新打开页面。
插入物品：字面义。如果有输入，会用输入覆盖纹理贴图路径（组件中的sprite）。
删除：字面义。如果有输入，删除指定序号的元素。没有则删除最后一个元素。
快速展示：直接将物品信息以特定格式展示到对话框。如果有输入同样会覆盖。快速展示不会调用已经输入好的文本，也不会将其重置。
![Image description](https://etis.vcsofficial.site/assets/files/2025-08-10/1754866767-803703-image.png)
发送：发送文本。如果输入为 '#' 则不会重置已输入好的文本。