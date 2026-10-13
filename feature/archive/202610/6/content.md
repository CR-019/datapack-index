---
title: 'Model-On-Datapack — 用新的 /compute 跑微型中文对话'
---

<FeatureHead
  title="Model-On-Datapack — 用新的 /compute 跑微型中文对话"
  authorName="古镇天Gugle"
  resourceLink = ../_assets/model-on-datapack.zip
/>

我们在纯原版数据包中实现了一个字节级微型Transformer的真实前向推理。\
所有矩阵乘法和计算均由26.3新增的<cmd c="compute"/>和上下文浮点数提供器完成。

## 模型

| 项 | 值 |
|------------|---|
| 架构 | 两层仅解码器Transformer, d_model=64, d_head=32, FFN=128，Activation=ReLU |
| 词表 | 256 |
| 上下文 | 64 token |
| 参数 | 87,552（嵌入与输出头权重绑定，学习式位置编码，LayerNorm） |
| 训练 | `tools/train.py`：numpy 手写反向传播，在`corpus.txt`中的38条中文问答上过拟合 |

模型背下了38条短问答作为语料。对语料中的问题能给出正确回答；但如果没见过就会输出乱码。

## 文件

```
corpus.txt              训练语料
weights.json            训练产物
tools/train.py          训练 + 数据包语义推理模拟器
tools/gen_datapack.py   训练产物 -> 数据包编译器
tools/check_datapack.py 静态自检
tools/chat.py           文本 <-> 词元编解码辅助
out/nnchat/             生成的数据包（16 MB，2775 个数值提供器 + 8 个函数）
```

## 在游戏中使用（Java 版 26.3）

1. 加载数据包。由于含有越16MB的参数，因此可能会加载很长时间。
2. `/function nnchat:init`为初始化命令，会自动执行，不过也可以在想要重置时手动执行。
3. 推理期间记分板侧边栏会实时显示进度：
   1. `状态`（0 空闲 / 1 读提示词 / 2 生成中 / 3 完成）
   2. `总长`（提示词 token 数）
   3. `位置`（当前处理位置）
   4. `生成`（已生成 token 数）。
4. 若生成失控，可以用 `/function nnchat:stop` 紧急停止。
5. 可以阅读`storage nnchat:s out`随时查看当前输出 token 列表。
6. 可以直接用命令提问（使用`|`代表换行）：
   ```
   /function nnchat:ask {text:"问:你好|答:"}
   ```
   数据包会把文本逐字转成 UTF-8 字节，并在推理完成后自动把输出的字节恢复成中文打在聊天栏。\
   模型只认识语料里的215个汉字 + ASCII，所以未知字符会被编成 `?`。
7. 除了在游戏中提问以外，也可以用 `py -3 tools/chat.py encode 问:你好\n答:`生成一条命令
   `function nnchat:chat {tokens:[233,174,...]}`粘贴执行；输出用
   `py -3 tools/chat.py decode <列表>` 可以解码。

几个值得一试的提示词：
 - 问:你好|答:
 - 问:你是谁|答:
 - 问:什么是红石|答:
 - 问:讲个笑话|答:
 - 问:再见|答:

## 备注

- 现在的模型很小，只会"背诵"语料。若果想要泛化，需要更大的模型与语料（参数量受 JSON 体积限制，
  经验上每参数 ≈ 一个 mul 节点 ≈ 160 字节）。
- 现在每token需要约`2775`次<cmd c="compute"/>，游戏内进行哪怕一次简短的对话都需要几十刻的满载运算。
