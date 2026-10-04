# 酒馆看板 · 部署与运维

面向「复用现有镜像站那台服务器」这一决策（设计文档 ADR-003）。本目录只放**部署产物**，
代码与设计说明在 `tavern-server/README.md` 与内部设计文档里。

---

## 0. 上线自检清单（照着做一遍）

| # | 检查 | 命令 / 判据 |
| --- | --- | --- |
| 1 | 服务只绑回环 | `ss -ltnp \| grep 9878` 应显示 `127.0.0.1:9878`，不是 `0.0.0.0` |
| 2 | **配了 `TAVERN_TRUST_PROXY=1`** | 见 §3；不配的话限流键退化成"只有 pin"，**任何人失败 5 次就能锁住某个作者** |
| 3 | 生产胡椒已换 | `TAVERN_TOKEN_PEPPER` ≥ 32 字符；用默认值会**拒绝启动**（这是故意的） |
| 4 | HTTPS 与 cookie | `curl -si https://<域名>/v1/status` 正常；登录响应里 `Set-Cookie` 带 `Secure` |
| 5 | CORS 只开给只读面 | `curl -si https://<域名>/v1/nodes` 有 `Access-Control-Allow-Origin: *`；`/v1/auth/session` **没有** |
| 6 | 上传不被 413 挡 | 投一个接近 20MB 的包，或确认 `client_max_body_size` ≥ 25m |
| 7 | 限流生效 | 连错 5 次 pin/token → 返回 429 且带剩余秒数 |
| 8 | 投稿闭环 | 用真包跑一次「投稿 → 未上架公开不可见 → 上架 → 公开可见」 |
| 9 | 快照可访问 | `https://<站点>/datapack-index/tavern-snapshot.json` 能取到 JSON |
| 10 | **备份演练通过** | §5 的恢复演练，最后一行必须是"记账 与清单一致 ✓" |
| 11 | 资源隔离 | `systemd-cgtop` 里看板的 CPU/内存受限；镜像站不受影响 |
| 12 | 秘密没进仓库 | `cd tavern-server && npm run check:secrets` |

---

## 1. 代码与用户

```bash
# 独立用户：不用 root 跑，也不和镜像站共用账号
useradd --system --home /opt/tavern-server --shell /usr/sbin/nologin tavern

# 代码放到 /opt/tavern-server（部署脚本或 git archive 都行）
# 这个目录对服务是**只读**的（ProtectSystem=strict）
install -d -o root -g tavern -m 755 /opt/tavern-server

# 数据目录：数据库、投稿原件、快照、备份暂存
install -d -o tavern -g tavern -m 750 /var/lib/tavern-server
install -d -o tavern -g tavern -m 750 /var/lib/tavern-server/snapshot
```

Node 需要 **24 或更高**（用到内置的 `node:sqlite` 与 `zlib.crc32`）：`node -v`。

---

## 2. 秘密文件（进 /etc，不进仓库）

```bash
install -d -o root -g tavern -m 750 /etc/tavern
cat > /etc/tavern/tavern.env <<'EOF'
TAVERN_HOST=127.0.0.1
TAVERN_PORT=9878
TAVERN_DB=/var/lib/tavern-server/tavern.db
TAVERN_INBOX=/var/lib/tavern-server/inbox
TAVERN_TOKEN_PEPPER=<粘贴 ≥32 字符的随机串>
TAVERN_TRUST_PROXY=1
NODE_ENV=production
EOF
chown root:tavern /etc/tavern/tavern.env
chmod 640 /etc/tavern/tavern.env

# 生成胡椒：
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

> `NODE_ENV=production` 会让服务**强制**要求强胡椒、并给会话 cookie 加 `Secure`。
> 这也意味着本地 HTTP 调试时不要设它（或用 `TAVERN_SESSION_SECURE=0` 覆盖）。

首次引导工作组账号（**只能在服务器本机跑**）：

```bash
cd /opt/tavern-server
sudo -u tavern env $(grep -v '^#' /etc/tavern/tavern.env | xargs) \
  node scripts/seed.mjs            # 导入既有 80 位作者 / 55 条前置馆条目
sudo -u tavern env $(grep -v '^#' /etc/tavern/tavern.env | xargs) \
  node scripts/bootstrap.mjs --pin cr019 --name CR_019 --label "服务器引导"
# ⚠️ 令牌只显示一次，当场保存好
```

---

## 3. 为什么必须有 `TAVERN_TRUST_PROXY=1`

反代之后 `req.socket.remoteAddress` 永远是 `127.0.0.1`。限流键是 `pin + IP`，
如果不采信 `X-Forwarded-For`，键就退化成**只有 pin**：

> 攻击者只要对着某位作者的 pin 故意失败 5 次，就能把他锁在门外 —— 一个成本极低的 DoS。

所以：**有反代时必须设 1**；直连（本地开发）时必须设 0，否则客户端可以随便伪造来源 IP 绕过限流。
两种情况的差别有专门的用例钉住（`tests/client-ip.test.mjs`）。

---

## 4. 反代

- Nginx（宝塔/常规）：`nginx/tavern-api.conf`
- Caddy（与 MCFPM 同款）：`caddy/Caddyfile.fragment`

要点：

- **独立子域**（如 `api.vanillalibrary.mcfpp.top`）：作者中心与写接口必须同源，会话 cookie 才不跨站。
- `client_max_body_size` 必须 **> 20MB**，否则投稿在到达 Node 之前就被 413 挡掉。
- 加 `X-Robots-Tag: noindex`：这个域名不该被搜索引擎收录。
- 别在同机上让 Caddy 和宝塔的 Nginx 抢 80/443。

---

## 5. systemd

```bash
install -m 644 deploy/systemd/tavern-api.service        /etc/systemd/system/
install -m 644 deploy/systemd/tavern-snapshot.service   /etc/systemd/system/
install -m 644 deploy/systemd/tavern-snapshot.timer     /etc/systemd/system/
install -m 644 deploy/systemd/tavern-backup.service     /etc/systemd/system/
install -m 644 deploy/systemd/tavern-backup.timer       /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now tavern-api.service
systemctl enable --now tavern-snapshot.timer tavern-backup.timer

systemctl status tavern-api --no-pager
journalctl -u tavern-api -n 50 --no-pager
systemctl list-timers 'tavern-*'
```

单元里已经做了两件与这台机器有关的事：

- **文件系统加固**：代码目录只读，只有 `/var/lib/tavern-server` 可写；
- **资源上限**：`MemoryMax=512M`、`CPUQuota=50%` —— 同机还有镜像站在跑，看板不许把它拖垮。

---

## 6. 备份与恢复演练（**每季度至少做一次**）

备份由 `tavern-backup.timer` 每天跑，产出「数据库 + 投稿原件 + 快照 + 清单」。
**必须把 `--dest` 指向异地**（对象存储挂载或另一台机器）：留在同一块盘只防误删，不防磁盘故障。

### 演练步骤

```bash
cd /opt/tavern-server
BUNDLE=$(ls -d /mnt/offsite/tavern/tavern-* | tail -1)

# 1) 校验清单（sha256 全对上）
node scripts/restore.mjs "$BUNDLE"            # 默认就是演练：还原到临时目录

# 预期输出里必须出现：
#   校验     ✓ 通过
#   完整性   PRAGMA integrity_check = ok
#   记账     与清单一致 ✓
```

演练**不碰线上数据**。要真恢复（确认无误之后）：

```bash
# 2) 先把当前数据兜住 —— 恢复本身也可能出错
sudo -u tavern env $(grep -v '^#' /etc/tavern/tavern.env | xargs) \
  node scripts/backup.mjs --dest /mnt/offsite/tavern --label "恢复前兜底"

# 3) 覆盖线上（要显式 --force），然后重启
sudo -u tavern env $(grep -v '^#' /etc/tavern/tavern.env | xargs) \
  node scripts/restore.mjs "$BUNDLE" --to /var/lib/tavern-server --force
systemctl restart tavern-api
# 4) 再跑一遍 §0 自检清单的 1/4/8/9
```

**演练通过的标准**：`integrity_check = ok`、计数与清单一致、投稿原件数量一致。
只要有一条不符，就当备份不可用处理 —— 去查备份任务是不是一直在失败。

> 备份里**包含令牌哈希**（这是故意的）：不带私域表的话，恢复后所有人都要重新签发令牌。
> 也正因如此，备份目录的权限要收紧，异地副本同样要当敏感数据对待。

---

## 7. 回仓与镜像

- L1 快照由 `tavern-snapshot.timer` 写到 `/var/lib/tavern-server/snapshot/`。
  由 bot 或维护者把它提交到仓库 `public/tavern-snapshot.json`（CI 会校验它与代码/数据一致）。
- 镜像站（`vanillalibrary.mcfpp.top`、红石中继站）展示只读看板时，走的是**静态快照**，
  不依赖 API 实时可用 —— 这正是设计文档 §11.2 要求的降级路径。

---

## 8. 出事了怎么办

| 症状 | 先查 |
| --- | --- |
| 服务起不来，日志说"拒绝启动（安全配置不合格）" | 胡椒没配或太短；见 §2 |
| 所有人都登不上，429 | 有人在对某个 pin 爆破；看 `audit_log` 里的 `auth.failed`。**先确认 TRUST_PROXY 是否配了**，没配的话锁定会误伤 |
| 投稿返回 413 | 反代的 `client_max_body_size` 太小（§4） |
| 投稿返回 422 且列出多条错误 | 这是设计如此：一次报全部问题，把清单转给作者即可 |
| 公开页看不到刚上架的条目 | 检查 `nodes.published_revision_id`；公开面只认它 |
| 看板页面显示"静态快照…数据可能不是最新" | 后端不可用，前端已降级（正常行为）。先恢复服务，再确认快照是不是太久没更新 |
| 磁盘满 | `pruneBackups` 的保留份数、`inbox` 体积、以及那台机器上的镜像站产物 |
