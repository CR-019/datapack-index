---
name: Player Data Expansion
author:
    -
        name: 七柏
        char: 作者
description: 在storage中创建玩家专有数据空间
tags: [玩家数据, 数据]
version: 1.0.0
gameversion: [1.20.2+]
aside: left
wheel: true
repo: Bybycyann/PlayerDataExpansion
---

<InfoCard />

以 UUID 作为唯一身份识别码创建的一套玩家数据系统,，旨在便利数据包编写顺带兼顾部分性能需求。

阅读其官方说明文件 ([Github](https://github.com/Bybycyann/PlayerDataExpansion)) 以获取更多信息。

以下给出简单使用方法，可能过时。


## 函数

|        函数        |                             功能                             |           参数            |
| :----------------: | :----------------------------------------------------------: | :-----------------------: |
| `#pde:data.cache`  | 读取玩家数据至 `pde:io output[-1].data` 并检查时间戳标记, 若不在同一tick则更新 `pde:io player.data.<index>.data.CACHE.data` 并同步至 `pde:io output[-1].data.CAHCE.data` | {player: ("this"\|index)} |
|   `#pde:data.or`   |           读取玩家数据至 `pde:io output[-1].data`            | {player: ("this"\|index)} |
|   `#pde:data.rw`   | 同时创建两个目标玩家数据的备份在 `pde:io input[-1].data` 和 `pde:io output[-1].data` | {player: ("this"\|index)} |
| `#pde:data.update` | 立即更新 `pde:input[-1]` 的数据, 而非统一在 1tick 后更新.<br />**安全检查**: 为防止越界操作, 仅当执行者与 `input[-1]` 操作对应目标的索引号一致时允许推送数据 |             -             |
| `#pde:data.reset`  |                 重置索引与所有玩家数据(危险)                 |             -             |

## 示例

- **读取玩家UUID和Name**

  ```mcfunction
  # As player:

  function #pde:data.or {player: "this"}
  	data modify storage xxx:xxx uuid set from storage pde:io output[-1].data.CONST.uuid
  	data modify storage xxx:xxx name set from storage pde:io output[-1].data.CONST.name
  ```

- **向索引为2的玩家存储中修改数据和写入数据**

  ```mcfunction
  function #pde:data.rw {player: 2}
  	data modify storage pde:io input[-1].example set value "test"
  	data modify storage pde:io input[-1] merge {aaa: "bbb"}
  ```

- **向自己的存储中写入新数据并立即更新**

  ```mcfunction
  function #pde:data.rw {player: "this"}
  	data modify storage pde:io input[-1] merge {new: 1b}
  function #pde:data.update
  ```

- **访问玩家数据缓存**

  ```mcfunction
  function #pde:data.cache {player: "this"}
  	data get modify storage pde:io output[-1].data.CACHE.data.Health
  ```