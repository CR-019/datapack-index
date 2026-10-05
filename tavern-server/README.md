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

### 想看阶段条与事件流？铺一份演示数据

既有数据里**没有阶段也没有事件**，所以两条新 UI 在真实数据上只能渲染空态——能证明"没报错"，证明不了"能用"。
演示数据走**独立的库**（不要写进主库，理由见下）：

```bash
TAVERN_DB=data/demo.db npm run seed          # 先铺基础数据
TAVERN_DB=data/demo.db npm run seed:demo     # 再加演示阶段与事件
TAVERN_DB=data/demo.db TAVERN_PORT=9880 npm run dev
```

| 演示项目 | 展示什么 |
| --- | --- |
| `project:demo-alpha` | 四个阶段，其中 **v1.0 开发 与 社区运营 并列**处于进行中 → `facets.phases` 是两个元素的集合，不是单值；另有一条 `internal` 事件用来验证它不会出现在公开接口里 |
| `project:demo-beta` | 两个阶段之间**刻意留了 4–6 月的空隙** → 验证"允许留白"，不会被当成数据错误 |

⚠️ **演示数据默认拒绝写主库**（要用 `--force` 才行）：进了 `data/tavern.db` 会让 `npm run snapshot:check`
失败，而且 `public/tavern-snapshot.json` 是**要上线的离线兜底文件**，不能混进编造内容。
脚本也刻意**不碰任何真实项目**——演示数据必须一眼就能认出来。

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
| 迁移 | `001_init.sql` 13 张表 → `002` 修订来源 → `003` 事件表并把 `kind` 枚举放进新的 `nodes` 表（迁移期关外键、迁移后 `foreign_key_check` 兜底） |
| 种子 | 80 作者 + 55 条目 + 73 标签 + 65 `authored` 边 + 55 `maintains` 边 + 112 标签成员 |
| 引导 | 第一个 staff 账号创建，并**认领了既有作者档案** `CR_019`（不是新建节点） |
| 公开接口 | `/healthz`、`/v1/status`、`/v1/nodes`（分页 / 筛选）、`/v1/nodes/:id`、`/v1/nodes/:id/events`、`/v1/authors/:id`、`/v1/tags`、`/v1/tags/:id/members`、`/v1/timeline` 全通 |
| 认证 | `pin + token` → `HttpOnly` cookie → `/v1/me` 返回身份与 `maintains` 列表 |
| 安全 | 错误 pin 与错误 token 返回**同一条**错误信息（无法探测 pin 是否存在）；失败计数与锁定生效；令牌只存哈希 |
| 重名 | `person:bookshelf` 与 `project:bookshelf` 共存互不干扰 |
| 回归测试 | `npm test` 185/185 |

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
| `GET` | `/v1/authors`、`/v1/authors/:id` | 作者公开 profile + 其署名/维护/团队作品与成员（`:id` 需带 `kind:` 前缀，如 `person:Alumopper`） |
| `GET` | `/v1/tags` | 标签列表（**零成员不进列表**） |
| `GET` | `/v1/tags/:id` | 标签详情（含成员数） |
| `GET` | `/v1/tags/:id/members` | 标签成员（读物化表） |
| `GET` | `/v1/nodes/:id/events` | 某条目的事件流（**只返回 `visibility='public'`**，`limit` ≤ 100） |
| `GET` | `/v1/timeline` | 时间轴（优先边级 `since`，否则退回创建时间） |

**需会话**（同源，不加通配 CORS）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/v1/auth/session` | `pin + token` → `HttpOnly` 会话 cookie |
| `DELETE` | `/v1/auth/session` | 退出（清会话，令牌不受影响） |
| `GET` | `/v1/me` | 我是谁 + 我维护哪些条目 |

**需工作组权限**（`staff` 会话；**不加通配 CORS**）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/v1/credentials` | 凭证管理台一屏：所有主体 + 每枚令牌的状态（签发时间 / 最后使用 / 是否吊销）+ 最近凭证类审计。**永不返回哈希，也永不返回明文** |
| `POST` | `/v1/authors` | **建主体并签发首枚凭证**（设计 §12 的接口表就是这条路径）：`pin` + `name` + `kind`(person/team) + `role`(author/staff) + `label` + `reason`。已存在但未认领的主体走**认领**（既有档案与条目归属一个字都不动）。返回体里的 `token.plaintext` 是明文令牌**唯一一次**出现的地方 |
| `POST` | `/v1/credentials/:id/tokens` | 给已有主体**补发**一枚令牌（换设备、团队里再加一个人）。旧令牌不受影响 |
| `POST` | `/v1/credentials/:id/tokens/:tokenId/rotate` | **轮换**：签发新的 + 吊销旧的一步到位（旧凭证已泄露时用）。默认做法仍是两步：先补发、确认本人能用，再吊销旧的 |
| `DELETE` | `/v1/credentials/:id/tokens/:tokenId` | **吊销**，立即生效并连带清除由它派生的会话。拒绝吊销**最后一枚**工作组凭证（否则谁也进不来了） |
| `POST` | `/v1/credentials/:id/status` | **停用 / 恢复账号**（`{"status":"suspended"\|"active"}`）。停用会当场清掉名下会话，但**令牌保留** —— 恢复即可继续用；已上架内容不受影响（人离开了，作品还在）。拒绝停用**最后一个有效的工作组成员** |

**需维护者权限**（`canEdit`：staff 通吃，否则查 `maintains` 边）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `PATCH` | `/v1/nodes/:id` | **收敛型直通**（ADR-009）：白名单 `state` / `recruit` / `note`；自动追写事件、同步 `facets.state` 投影、并留一条 `rev_conv_*` 修订供回滚。扩张型字段（正文等）返回 `not_convergent`，必须走投稿 |
| `POST` | `/v1/nodes/:id/stages` | 新建阶段子节点（ADR-010）：`name` + `start`/`end` 必填，**不许嵌套**（父节点不能是 stage）；名称与时间窗属事实，直通生效 |
| `DELETE` | `/v1/nodes/:parentId/stages/:stageId` | 删阶段（连带删其 `parent` 边与事件） |

验证一下：

```bash
curl -s http://127.0.0.1:9878/v1/status
curl -s 'http://127.0.0.1:9878/v1/nodes?kind=project&limit=3'
curl -s 'http://127.0.0.1:9878/v1/tags' | head -30
# 作者页的 :id 必须带 kind: 前缀（裸名有歧义：person:X 与 team:X 可能同名）
curl -s http://127.0.0.1:9878/v1/authors/person:Alumopper

# 事件流（只含 public 事件；新种子数据里是空数组，属正常）
curl -s 'http://127.0.0.1:9878/v1/nodes/project:Floating_UI/events'

# 换取会话（把 pin/token 换成 bootstrap 打印的那对）
curl -i -c /tmp/tavern.jar -X POST http://127.0.0.1:9878/v1/auth/session \
  -H 'Content-Type: application/json' -d '{"pin":"cr019","token":"<TOKEN>"}'
curl -s -b /tmp/tavern.jar http://127.0.0.1:9878/v1/me

# 签发一对凭证（工作组）：明文 token 只在这里出现一次
curl -s -b /tmp/tavern.jar -X POST http://127.0.0.1:9878/v1/authors \
  -H 'Content-Type: application/json' \
  -d '{"pin":"alumopper","name":"Alumopper","role":"author","label":"阿罗的笔记本"}'
# 本人拿这对凭证登录（投稿工作台第 0 步做的就是这件事）
curl -i -c /tmp/author.jar -X POST http://127.0.0.1:9878/v1/auth/session \
  -H 'Content-Type: application/json' -d '{"pin":"alumopper","token":"<上一步打印的那串>"}'
# 管理台一屏；吊销一枚令牌（连带掐掉由它派生的会话）
curl -s -b /tmp/tavern.jar http://127.0.0.1:9878/v1/credentials
curl -s -b /tmp/tavern.jar -X DELETE \
  http://127.0.0.1:9878/v1/credentials/person:Alumopper/tokens/<tokenId>
```

网页版的同一条链路在 `tavern/admin`（签发）→ `tavern/submit`（填写）两个页面，
走查用例见 `tests/e2e/cases/06-credential-chain.mjs`（接口）与 `07-credential-chain-browser.mjs`（界面）。

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
| **事件是真相、状态是投影**（ADR-009） | `node_events` 只增不改；`facets.state` 由事件 `recomputeState()` 推出，可随时重算。收敛型直通与「有历史」因此同时成立——不是绕过审计的快捷方式 |
| **阶段是子节点、时间是算出来的**（ADR-010） | 阶段是一个 `kind=stage` 的节点 + 一条 `child → parent` 的 `parent` 边（**至多一条**）；`facets.phases` 是从阶段时间窗与当前时间**算出来的派生字段**，允许并列、允许空隙、可为空 |
| **不变量 13 落在读模型**（ADR-010） | `listPublishedNodes()` 自带 `NOT EXISTS (… rel='parent')`，看板列表天然只含顶层。前端不必再实现一遍，也不会因为忘记过滤而漏出阶段 |
| **签发是一条真接口，不是"手工插一行"**（§7.4 / FR-16） | `src/credentials.mjs`：建主体 + 账号 + 首枚令牌走同一个事务；每笔都写 `audit_log`（谁签发了谁必须可查）；明文只在响应体里出现一次，库里只有 `sha256(token+pepper)` —— 与 bootstrap 共用 `hashToken()`，没有第二份哈希实现 |
| **最后一枚工作组凭证不许吊销** | 没有密码找回，且 bootstrap 见到已有 staff 会拒绝执行：吊销光了就真的没人进得来。所以宁可当场拒绝，让人先签新的再吊销旧的。同理**不许停用最后一个有效的工作组成员** —— 那是账号级封锁，连"换一枚令牌登录"的退路都没有 |
| **停用账号与吊销令牌是两档** | 停用（`accounts.status='suspended'`）断的是"这个人现在能不能进系统"，与手里有几枚令牌无关，且**不动令牌**：恢复时改一个字段就行，不必重新签发、重新交付。吊销是收回某一枚写权限。两者都连带清会话（`readSession` 本来就会因 `status != 'active'` 拒绝，停用时再把会话行删掉，不留永远不会被认领的行） |
| **通配 CORS 只给公开只读面** | 判据从"路径前缀"改成"**方法**"（`http.mjs` 的 `isPublicRead`）：写接口（投稿、审核、签发、收敛型 PATCH）与身份/私域路径一律不带 `Access-Control-Allow-Origin`。写接口只服务同源前端（§7.7），没有一个调用方需要它 |
| **公开读模型是表级白名单**（ADR-011） | 公开 SQL 只允许碰 `nodes` / `edges` / `tag_members` / `node_events` 四张表，且 `node_events` 必须带 `visibility='public'`。私域表不是「记得别查」，而是**不在白名单里** |

---

## zip ↔ 目录：双向可逆（§9.5）

```bash
npm run pack   -- <目录> [输出.zip]      # 目录 → 可投稿的 zip
npm run unpack -- <投稿.zip> [目标目录]   # zip → 项目目录（并顺手校验内容）
```

为什么这个性质重要：**zip 是输入形态，仓库归档目录是同一个形态**。任何一份归档都能
重新打包成可投稿的 zip，任何 zip 也能直接落进仓库；否则每次同步都要做一次有损翻译。

三条已落实的保证：

| 保证 | 说明 |
| --- | --- |
| **确定性** | 条目按路径排序、时间戳固定 → 同样输入产出**逐字节相同**的 zip |
| **对称安全** | 打包前复用读取器的路径校验：我们不但不读危险路径，也绝不*产出*危险路径 |
| **可被摄取** | `pack` 出来的包必须能被 `ingestZip()` 零错误接受（有专门用例钉住） |

`npm test` 里的 round-trip 用例就是这套约定的**保险丝**：模板改版时它会立刻告诉你旧包还能不能读。
CI（`.github/workflows/verify-tavern.yml`）另有一条快照同步检查。

## L1 快照

```bash
npm run snapshot        # 生成 public/tavern-snapshot.json（站点静态兜底）
npm run snapshot:check  # 校验仓库里的快照与当前代码+数据是否一致（CI 用）
```

快照形状与前端 `api.mjs` 的约定一致：`{schema, generatedAt, status, nodes, edges, tags, tagMembers, timeline}`。
后端不可用时前端自动回退到它，并显示降级提示。

**种子数据的时间戳是固定的**（`TAVERN_SEED_TIME`，默认 `2026-01-01T00:00:00.000Z`），
所以"种子 → 快照"这一整条链是可复现的：CI 能重新生成并与仓库里的那份做**逐字节**比对。
这也是为什么 `read-model.mjs` 的时间轴查询额外带了 `id` 作为次序打断 —— 时间全部相同时，
只按时间排序会让 SQLite 返回未定义顺序，快照就不可复现了。

---

## 备份与恢复（§11.4）

```bash
npm run backup                                  # 生成备份包（数据 + 投稿原件 + 快照 + 清单）
npm run backup -- --dest /mnt/offsite/tavern    # 异地目标（生产必须这样）
npm run restore -- <备份目录>                    # **演练**：还原到临时目录并做完整性检查
npm run restore -- <备份目录> --to <目录> --force # 真恢复（覆盖线上要显式确认）
```

三点设计：

- **一致性快照**：用 SQLite 的 `VACUUM INTO` 取库（等价 `.backup`）。WAL 模式下直接复制文件会拿到损坏或过期的库。
- **可验证**：每个文件记 sha256，恢复前先校验。**备份不可验证等于没有备份**。
- **默认演练**：`restore` 不碰线上数据，只还原到临时目录并跑 `PRAGMA integrity_check` + 计数比对。
  没演练过的备份不算备份。

备份里**包含令牌哈希**（故意的）：不带私域表的话，恢复后所有人都要重新签发令牌。
也正因如此，备份目录与异地副本都要当敏感数据对待。

## 部署

部署产物在仓库根目录的 `deploy/`：systemd 单元（API + 每日快照 + 每日备份，带文件系统加固与
资源上限）、Nginx 与 Caddy 反代片段、以及**上线自检清单 + 恢复演练步骤**。

`tests/deploy.test.mjs` 会拦住"部署产物与代码漂移"这类问题：单元里出现的每个 `TAVERN_*`
变量都必须被 `config.mjs` 真正读取、`ExecStart` 必须指向真实入口、反代端口必须与代码默认值一致、
上传上限必须大于投稿 zip 上限 —— 手写的第二份真相最容易悄悄对不上。

---

## 还没做的（下一步）

- **阶段编辑**：目前只有「新建」与「删除」，改时间窗要删了重建
- **申请与邀请**：`applications` / `invitations` 的接口与一次性激活页
- **审核台界面**：审核目前只有接口（`GET /v1/reviews/queue` + `POST /v1/reviews/:id`），还没有队列/差异视图页面 —— 工作组成员要审稿得用 curl
- **`/author` 会话验证页**：`/v1/me` 有了，但还没有那个"我到底登录了没有"的页面
- **素材处理**：尚未接 `sharp` / `svgo`（届时需决定复用主仓库的 `scripts/optimize-images.mjs` 还是自带一份——会影响"能否一条 `mv` 拆走"）
- **bot PR 回仓**：L1 快照定期写回仓库（目前是手动 `npm run snapshot`）
- **部署产物**：systemd 单元、反代配置、备份脚本

---

## 目录

```
tavern-server/
├── migrations/
│   ├── 001_init.sql          # 13 张表（对应设计文档 §16 附录 B）
│   ├── 002_revision_source.sql
│   └── 003_events_and_stages.sql
├── src/
│   ├── config.mjs            # 环境变量、.env 加载、安全配置自检
│   ├── db.mjs                # 打开 + 自动迁移 + 查询包装
│   ├── http.mjs              # 路由、响应、cookie、CORS
│   ├── auth.mjs              # 令牌哈希、限流、会话、审计、权限判定
│   ├── read-model.mjs        # 公开读模型（表级白名单）+ 快照序列化
│   ├── events.mjs            # 事件追加 / 作废 / 状态重算（ADR-009）
│   ├── timeline.mjs          # 阶段解析、facets 派生、时间轴合并
│   ├── changes.mjs           # 收敛型直通批处理（白名单 + 自动事件 + 可回滚修订）
│   ├── stages.mjs            # 阶段子节点：建/删与四条专属校验
│   ├── zip.mjs               # 零依赖 ZIP 读取器 + 安全闸门
│   ├── zip-write.mjs         # 零依赖 ZIP 写入器（确定性）
│   ├── archive.mjs           # pack/unpack（§9.5 双向可逆）
│   ├── multipart.mjs         # multipart/form-data 解析
│   ├── frontmatter.mjs       # YAML 子集解析（版本号保持字符串）
│   ├── ingest.mjs            # 摄取流水线：归一化 + 校验 + 哈希
│   ├── submissions.mjs       # 投稿/审核的存储逻辑
│   ├── scan-secrets.mjs      # 秘密扫描规则
│   ├── routes.mjs            # 全部 handler
│   └── server.mjs            # 组装与启动
├── scripts/                  # bootstrap / seed / seed-demo / reset / snapshot / pack / unpack / check-secrets / backup / restore
├── tests/                    # 185 个用例（node:test，零测试框架依赖）
└── data/                     # 运行时数据（gitignore）
```
