---
name: Player Data Expansion
author:
    -
        name: Qipai
        char: author
description: Create a player-specific data space in storage
tags: [player data, data]
version: 1.0.0
gameversion: [1.20.2+]
aside: left
wheel: true
repo: Bybycyann/PlayerDataExpansion
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::


<InfoCard />

A player data system created with UUID as a unique identification code, designed to facilitate data pack writing and take into account some performance requirements.

Read its official documentation ([Github](https://github.com/Bybycyann/PlayerDataExpansion)) for more information.

The following is a simple usage method, which may be outdated.


## function

| function | function | parameters |
| :----------------: | :----------------------------------------------------------: | :-----------------------: |
| `#pde:data.cache`| Read player data to`pde:io output[-1].data`And check the timestamp mark, if not in the same tick, update it`pde:io player.data.&lt;index&gt;.data.CACHE.data`and sync to`pde:io output[-1].data.CAHCE.data` | {player: ("this"\|index)} |
|   `#pde:data.or`| Read player data to`pde:io output[-1].data`            | {player: ("this"\|index)} |
|   `#pde:data.rw`| Create backups of two target player data at the same time`pde:io input[-1].data`and`pde:io output[-1].data` | {player: ("this"\|index)} |
| `#pde:data.update`| Update now`pde:input[-1]`data instead of updating uniformly after 1tick.<br />**Security Check**: To prevent out-of-bounds operations, only when the executor and`input[-1]`Data is allowed to be pushed when the index numbers of the corresponding targets of the operations are consistent | - |
| `#pde:data.reset`| Reset index and all player data (dangerous) | - |

## Example

- **Read playerUUID and Name**

  ```mcfunction
  # As player:

  function #pde:data.or {player: "this"}
  	data modify storage xxx:xxx uuid set from storage pde:io output[-1].data.CONST.uuid
  	data modify storage xxx:xxx name set from storage pde:io output[-1].data.CONST.name
  ```


- **Modify and write data to the player storage with index 2**

  ```mcfunction
  function #pde:data.rw {player: 2}
  	data modify storage pde:io input[-1].example set value "test"
  	data modify storage pde:io input[-1] merge {aaa: "bbb"}
  ```


- **Write new data to own storage and update immediately**

  ```mcfunction
  function #pde:data.rw {player: "this"}
  	data modify storage pde:io input[-1] merge {new: 1b}
  function #pde:data.update
  ```


- **Access player data cache**

  ```mcfunction
  function #pde:data.cache {player: "this"}
  	data get modify storage pde:io output[-1].data.CACHE.data.Health
  ```
