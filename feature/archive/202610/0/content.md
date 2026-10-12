---
title: 'model-on-datapack — 用 26.3 的 /compute 在数据包里跑微型中文对话 Transformer'
---

<FeaturedHead
  title="model-on-datapack — 用 26.3 的 /compute 在数据包里跑微型中文对话 Transformer"
  authorName="古镇天Gugle"
/>

# model-on-datapack — 用 26.3 的 /compute 在数据包里跑微型中文对话 Transformer

在**纯原版数据包**中实现一个字节级（byte-level）微型 Transformer 的**真实前向推理**：
所有矩阵乘、LayerNorm、softmax 均由 26.3 新增的 `/compute` 命令对
`context_float_provider` 数值提供器求值完成，激活值以定点小数（floor(v×10000)×0.0001）
存入命令存储（command storage），KV cache 逐位置 append，逐 token 由 `schedule` 驱动生成。

## 模型

| 项 | 值 |
|---|---|
| 架构 | 2 层 decoder-only Transformer，d_model=64，2 头（d_head=32），FFN=128，ReLU |
| 词表 | 256（UTF-8 字节，token 0 = EOS） |
| 上下文 | 64 token |
| 参数 | 87,552（嵌入与输出头权重绑定，学习式位置编码，LayerNorm） |
| 训练 | `tools/train.py`：numpy 手写反向传播（含梯度检查），在 `corpus.txt` 的 38 条中文问答上过拟合 |

语料是 38 条短问答（见 `corpus.txt`），模型把它们**背了下来**——
对语料中的问题（逐字或几乎逐字）能给出正确回答；对没见过的表述会输出乱码。
这是演示 `/compute` 推理链路的可行性实验，不是实用聊天机器人。

## 文件

```
corpus.txt              训练语料（问<TAB>答）
weights.json            训练产物（train.py 导出）
tools/train.py          训练 + 数据包语义推理模拟器（float32 + 1e-4 floor 量化 + KV cache + 掩码）
tools/gen_datapack.py   权重 -> 数据包编译器
tools/check_datapack.py 静态自检
tools/chat.py           文本 <-> 字节 token 编解码辅助
out/nnchat/             生成的数据包（16 MB，2775 个提供器 + 8 个函数）
```

## 在游戏中使用（Java 版 26.3）

1. 把 `out/nnchat` 放进世界的 `datapacks/` 目录，启用（如提示不兼容，选"仍然启用"）。
2. `/reload`（首次加载 16 MB 提供器 JSON 会卡几秒到几十秒，属正常）。
   数据包通过 `minecraft:load` 标签**自动执行 `nnchat:init`**——进世界/重载时
   权重自动注入、推理 HUD（sidebar 计分板 `nnh`）自动挂到屏幕右侧。
   如需手动重新初始化，随时可再跑 `/function nnchat:init`。
3. 推理期间右侧 sidebar 实时显示进度：`状态`（0 空闲 / 1 读提示词 / 2 生成中 / 3 完成）、
   `总长`（提示词 token 数）、`位置`（当前处理位置）、`生成`（已生成 token 数）。
   若生成失控（如没加载权重导致 EOS 判断失效），用 `/function nnchat:stop` 紧急停止。
   想关掉侧边栏：`/scoreboard objectives setdisplay sidebar`。
   提示：`/data get storage nnchat:s out` 可以随时查看当前输出 token 列表。
4. **方式 A（纯游戏内，推荐）**：直接用文本提问（`|` 代表换行）：
   ```
   /function nnchat:ask {text:"问:你好|答:"}
   ```
   数据包内置编解码器（`enc_*`/`dec_*` 函数）会把文本逐字转成 UTF-8 字节
   （基于 `data modify ... set string` 子串截取 + NBT 匹配分派），
   推理完成后自动把输出字节渲染成中文打在聊天栏。
   未知字符会被编成 `?`（模型本来也只认识语料里的 215 个汉字 + ASCII）。
5. **方式 B（完整字符集）**：用 `py -3 tools/chat.py encode 问:你好\n答:` 生成
   `function nnchat:chat {tokens:[233,174,...]}` 命令粘贴执行；输出用
   `py -3 tools/chat.py decode <列表>` 解码。
6. 每 tick 推理一个 token（每 token 2775 次 `/compute`，实测单 token 约 2.4 秒、
   一次短对话几分钟——属于正常现象）。

可试的提示词（与语料逐字一致时效果最好）：
`问:你好|答:`、`问:你是谁|答:`、`问:什么是红石|答:`、`问:讲个笑话|答:`、`问:再见|答:`。

## 实现要点

- **提供器即计算图**：每个需要落盘的标量 = 一个命名提供器 + 一次
  `data modify storage ... set compute default float <id>`（26.3 原生写法，
  直接存 float32，无量化损失；仅 argmax 的 logit 比较仍走
  `execute store result score ... run compute ... 10000` 取整）。
  提供器之间不互相引用（避免重复求值），只读 storage 与常量。
- **游戏内编解码**（`ask`/`enc_*`/`dec_*`）：`data modify ... set string`
  按宏代入的下标截取单字符，`execute if data` 做 NBT 匹配分派到 UTF-8 字节；
  输出侧按字节组（ASCII 单字节 / CJK 三字节）匹配回字符，拼成文本组件数组后用
  `tellraw` 的 `interpret:true` 渲染。**注意 `set string` 越界会抛异常**——
  编码循环靠"先置空再截取"来检测字符串结束（越界失败时 ch 保持 `""`）。
- **动态索引不可行**（NBT 路径必须是字面量），所以：
  - 词嵌入查表 = mcfunction 里 256 行 `execute if score #btok matches N run data modify ...`（一分支执行）；
  - KV cache 用 `data modify ... append from` 追加，注意力提供器按 0..63 静态路径展开；
  - 因果/长度掩码 = `conditional` 提供器 + `int_value_check` 谓词（比较 `#t` 分数与槽位 j），
    未激活槽位输出 -1e30，softmax 中 `pow(e, -1e30-max)` 自然归零；
  - argmax = 256 次 logit 求值写入计分板 + 逐 token 比较 + 宏函数记录最优。
- **生成循环**：`feed`/`gen` 函数每个 tick 处理一个位置（`schedule function ... 1t`），
  避免超长命令链；提示词逐 token 喂入以填充 KV cache。
- **精度**：提供器内部 float32，落盘精度 1e-4。`tools/train.py` 里的 `simulate_chat`
  完全复刻这套语义（包括 floor 量化与 argmax 整数比较），离线验证 5 条提示全部
  逐字节复现语料答案。

## 已知限制 / 备注

- 模型只会"背诵"语料；想要泛化需要更大的模型与语料（参数量受 JSON 体积限制，
  经验上每参数 ≈ 一个 mul 节点 ≈ 160 字节）。
- 每 token 约 2775 次 `/compute`，游戏内一次短对话约需几十 tick 的满载运算，
  服务器会有可见卡顿——这是演示，不是生产方案。
- `pack.mcmeta` 使用 `min_format`/`max_format`（26.x 新格式），宽兼容区间。
- 谓词内联格式注意：26.3 中谓词类型键已从 `condition` 改为 `type`
  （`LootItemCondition.DIRECT_CODEC` 按默认 `"type"` 键 dispatch），
  例如 `{"type":"int_value_check","value":...,"test":{"min":0}}`。
- 已经过一次真实游戏实测排错（提供器目录 `context_float_provider` 已验证正确）。
- `tools/check_datapack.py` 已通过 JSON 解析、20 万处 storage 路径、
  提供器引用完整性等静态检查。
