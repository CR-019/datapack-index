# tavern-server · 酒馆看板后端

酒馆看板（`/tavern/`）的后端原型。设计依据：`notes/tavern-board/README.md`（内部设计文档，不进仓库）。

**当前定位：跑通模型，不是跑通业务。** 目标是把「节点 + 边 + 修订 + 身份」这套结构在真实数据上跑起来，验证它站得住，而不是先堆功能。

---

## 为什么先不做成独立仓库

| 考虑 | 说明 |
| --- | --- |
| **共享校验规则** | 设计里前端 / 后端 / CI 共用一份 schema（工作台要在浏览器里预校验）。同仓库内是相对 `import`；拆出去就得发 npm 包或 submodule |
| **复用 CI** | 现有 `pnpm test`、`verify-*.yml` 的 PR 门禁模式可以直接扩展 |
| **少一套运维** | 独立仓库 = 多一套 issue / PR / 权限 / 备份 / 分支保护，对 1–2 人团队是纯成本 |
| **提取成本极低** | 本目录**不反向 import 主仓库任何代码**（`scripts/seed.mjs` 只是单向读取 `../public`、`../wheel`，路径可用 `TAVERN_REPO_ROOT` 覆盖）。将来要拆，`mv tavern-server ../tavern-server` 即可 |

**该拆的判据**：后端出现独立贡献者、或独立发布节奏、或需要私有化时。

---

## 技术选型

| 项 | 选择 | 为什么 |
| --- | --- | --- |
| 运行时 | **Node 24**（`>=24`） | 与 CI 一致 |
| 数据库 | **`node:sqlite`（内置）** | 零原生依赖——不需要 `better-sqlite3` 的编译步骤（本仓库 `pnpm-workspace.yaml` 的 `allowBuilds` 关掉了原生构建）。单机单写入者、数据量以 MB 计、一个文件即可备份 |
| HTTP | **`node:http` + 极简路由** | 原型阶段不引框架；handler 形状与路由表保持不变，将来接 Fastify（ADR-007）是替换传输层，不是重写业务 |
| 依赖 | **零依赖** | `package.json` 的 `dependencies` 是空的，`node src/server.mjs` 直接能跑 |

> SQLite 目前会打印一条 `ExperimentalWarning`；npm scripts 里已用 `--disable-warning=ExperimentalWarning` 静音。

---

## 快速开始

```bash
cd tavern-server

# 1) 建库 + 导入既有数据（80 位作者、55 条前置馆条目、标签物化）
npm run seed

# 2) 引导第一个工作组账号（明文令牌只显示一次）
npm run bootstrap -- --pin cr019 --name CR_019 --label "服务器引导"

# 3) 起服务
npm run dev
```

数据库落在 `data/tavern.db`（已 gitignore）。想重来一遍：

```bash
npm run reset && npm run seed
```

---

## 命名空间：为什么 id 一定是 `kind:slug`

节点 id 是**全局**命名空间，但不同类型的实体真的会重名。既有数据里就有现成例子：

```
public/authors/bookshelf.json     →  作者 Bookshelf
wheel/resources/bookshelf.md      →  条目 Bookshelf
```

第一次跑 `npm run seed` 时这两者撞成同一个节点，后者把前者覆盖了。所以 id 一律带类型前缀：

| 类型 | id 形式 | 例 |
| --- | --- | --- |
| 项目 | `project:<slug>` | `project:Floating_UI` |
| 作者 / 团队 | `person:<name>` / `team:<name>` | `person:Alumopper`、`person:CR_019` |
| 标签 | `tag:<规范化文本>` | `tag:ui`（原文 `UI`） |
| 赛事 / 索引 | `event:<slug>` / `index:<slug>` | `event:autumn-jam-2026` |

slug 允许中文（本站既有 URL 就是中文，如 `/index/绪论`），所以 `person:古镇天Gugle` 合法。

---

## 本地已验证（2026-10-04）

| 检查 | 结果 |
| --- | --- |
| 迁移 | `001_init.sql` 13 张表建好 |
| 种子 | 80 作者 + 55 条目 + 73 标签 + 65 `authored` 边 + 55 `maintains` 边 + 112 标签成员 |
| 引导 | 第一个 staff 账号创建，并**认领了既有作者档案** `CR_019`（不是新建节点） |
| 公开接口 | `/healthz`、`/v1/status`、`/v1/nodes`（分页 / 筛选）、`/v1/nodes/:id`、`/v1/authors/:id`、`/v1/tags`、`/v1/tags/:id/members`、`/v1/timeline` 全通 |
| 认证 | `pin + token` → `HttpOnly` cookie → `/v1/me` 返回身份与 `maintains` 列表 |
| 安全 | 错误 pin 与错误 token 返回**同一条**错误信息（无法探测 pin 是否存在）；失败计数与锁定生效；令牌只存哈希 |
| 重名 | `person:bookshelf` 与 `project:bookshelf` 共存互不干扰 |
| 回归测试 | `npm test` 4/4 |

### 跑起来当场抓到的两个真 bug

1. **畸形百分号编码打挂进程**（已修 + 已加测试）
   `/v1/nodes/%E4%B8%8D` → `decodeURIComponent` 抛 `URIError`，而**路由匹配发生在 `try` 之外** → 整个进程退出。任何人一个坏请求就能打掉服务。修法：`safeDecode()` + 把 `router.match()` 移进 `try`。
2. **作者键与条目 slug 重名**（已修 + 已写进设计文档不变量）
   见上一节。这条同时暴露了设计文档里「id 只允许 `[a-z0-9-]`」与示例中 `event:autumn-jam-2026` 的自相矛盾，现已统一为 `kind:slug`。

### 环境坑

Windows 的 Hyper-V/WSL 保留了若干端口段（本机为 `8664–8963` 等），落在其中的端口会直接 `EACCES`。**8787 正落在里面**，所以默认端口改成了 `9878`（`TAVERN_PORT` 可覆盖）。

### 配置与 `.env`

`src/config.mjs` 内置了一个**零依赖的 `.env` 加载器**（已存在的环境变量优先，文件只补空缺）。本地开发：

```bash
node -e "console.log('TAVERN_TOKEN_PEPPER=' + require('crypto').randomBytes(32).toString('base64url'))" > .env
echo 'TAVERN_SESSION_SECURE=0' >> .env   # 本地是 HTTP；生产删掉这行
```

⚠️ 注意两点：

1. **换掉胡椒会让已有令牌全部失效**（哈希是基于胡椒算的）。改完要 `npm run reset && npm run seed && npm run bootstrap` 重新引导。
2. 若环境里带着 `NODE_ENV=production`（本机确实如此），`assertSecureConfig()` 会**拒绝用开发胡椒启动**——这是设计如此：开源仓库里 `DEV_PEPPER` 的字面量人人可见，用在生产等于令牌哈希裸奔。

---

## 已实现的接口

**公开只读**（`Access-Control-Allow-Origin: *`，与 MCFPM 现行做法一致；只返回已发布修订）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/healthz` | 健康检查（对齐 MCFPM 的形态） |
| `GET` | `/v1/status` | 节点/边/修订计数 + 私域计数 |
| `GET` | `/v1/nodes` | 列表：`kind` / `tag` / `state` / `q` / `limit` / `cursor` |
| `GET` | `/v1/nodes/:id` | 详情（含出边与入边） |
| `GET` | `/v1/nodes/:id/edges` | 只要边 |
| `GET` | `/v1/authors`、`/v1/authors/:id` | 作者公开 profile + 其维护/署名/团队成员 |
| `GET` | `/v1/tags` | 标签列表（**零成员不进列表**） |
| `GET` | `/v1/tags/:id` | 标签详情（含成员数） |
| `GET` | `/v1/tags/:id/members` | 标签成员（读物化表） |
| `GET` | `/v1/timeline` | 时间轴（优先边级 `since`，否则退回创建时间） |

**需会话**（同源，不加通配 CORS）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/v1/auth/session` | `pin + token` → `HttpOnly` 会话 cookie |
| `DELETE` | `/v1/auth/session` | 退出（清会话，令牌不受影响） |
| `GET` | `/v1/me` | 我是谁 + 我维护哪些条目 |

验证一下：

```bash
curl -s http://127.0.0.1:9878/v1/status
curl -s 'http://127.0.0.1:9878/v1/nodes?kind=project&limit=3'
curl -s 'http://127.0.0.1:9878/v1/tags' | head -30
curl -s http://127.0.0.1:9878/v1/authors/Alumopper

# 换取会话（把 pin/token 换成 bootstrap 打印的那对）
curl -i -c /tmp/tavern.jar -X POST http://127.0.0.1:9878/v1/auth/session \
  -H 'Content-Type: application/json' -d '{"pin":"cr019","token":"<TOKEN>"}'
curl -s -b /tmp/tavern.jar http://127.0.0.1:9878/v1/me
```

---

## 已经落到代码里的设计决定

| 决定 | 落点 |
| --- | --- |
| **公开 / 私域物理分表**（ADR-008） | `nodes` 只存 `profile_json`；账户、令牌、会话、恢复码各自独立表。公开接口的 SQL 不触及私域表 |
| **令牌只存哈希**（ADR-004） | `hashToken()` = `sha256(token + pepper)`；明文只在 bootstrap 输出里出现一次 |
| **常量时间比对 + 统一错误** | `timingSafeEqual`；pin 不存在与 token 错都返回同一条信息（否则错误信息就成了 pin 探测器） |
| **按 pin + IP 限流锁定** | 内存表 + 指数退避；连续失败 5 次即锁 |
| **吊销令牌连带吊销会话** | `revokeToken()` 同时清 `sessions` |
| **公开面只认已发布修订** | 所有公开查询都带 `published_revision_id IS NOT NULL`（§5.5 不变量 8） |
| **标签成员是算出来的** | `tag_members` 是唯一的派生表，可随时由 `nodes.tags` 重算；`/v1/tags` 用 `HAVING members > 0` 实现"零成员不进公开列表" |
| **权限由 `maintains` 边说话** | `canEdit()`：staff 通吃，否则查边——不由身份类型决定（ADR-005） |
| **主体即节点** | bootstrap 同时建 `person` 节点与 `accounts` 行，`accounts.id` 外键指向 `nodes.id`（1:1） |

---

## 还没做的（下一步）

- 投稿闭环：`POST /v1/submissions`（multipart zip）→ 解包流水线（§9.4 八步）
- 修订与审核：`PATCH /v1/nodes/:id`、`/v1/reviews/*`、批量上架、驳回
- 申请与邀请：`applications` / `invitations` 的接口与一次性激活页
- 工作台页面（§7.7）与 `/author` 验证页
- L1 快照导出 + `tag_members` 物化落盘 + bot PR
- 素材处理：接 `sharp` / `svgo`（届时需要决定是复用主仓库的 `scripts/optimize-images.mjs` 还是本目录自带一份——会影响"能否一条 `mv` 拆走"）

---

## 目录

```
tavern-server/
├── migrations/001_init.sql   # 13 张表（对应设计文档 §16 附录 B）
├── src/
│   ├── config.mjs            # 环境变量与默认值
│   ├── db.mjs                # 打开 + 自动迁移 + 查询包装
│   ├── http.mjs              # 路由、响应、cookie、CORS
│   ├── auth.mjs              # 令牌哈希、限流、会话、审计、权限判定
│   ├── routes.mjs            # 全部 handler
│   └── server.mjs            # 组装与启动
├── scripts/
│   ├── bootstrap.mjs         # 首个 staff 账号（仅本机）
│   ├── seed.mjs              # 导入既有资产
│   └── reset.mjs             # 清空本地库
└── data/                     # 运行时数据（gitignore）
```
