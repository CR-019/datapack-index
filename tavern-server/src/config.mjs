import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** tavern-server/ 目录 */
export const SERVER_ROOT = path.resolve(here, "..");
/** 仓库根（datapack-index）—— 仅用于种子脚本单向读取既有数据 */
export const REPO_ROOT = process.env.TAVERN_REPO_ROOT ?? path.resolve(SERVER_ROOT, "..");

/**
 * 极简 .env 加载器（零依赖）。
 * 约定与主流实现一致：**已存在的环境变量优先**，文件只补空缺。
 * 这样部署时用真实环境变量、本地用 .env，互不打架。
 */
function loadDotEnv(file) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return; // 没有 .env 是完全正常的情况
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv(path.join(SERVER_ROOT, ".env"));

/** 开发用的默认胡椒。生产环境绝不允许使用它（见 assertSecureConfig）。 */
export const DEV_PEPPER = "dev-pepper-CHANGE-ME";

const pepper = process.env.TAVERN_TOKEN_PEPPER ?? DEV_PEPPER;
const host = process.env.TAVERN_HOST ?? "127.0.0.1";
const isProduction = process.env.NODE_ENV === "production" || process.env.TAVERN_STRICT === "1";
const isLoopback = ["127.0.0.1", "::1", "localhost"].includes(host);

export const config = {
  host,
  // 注意：Windows 的 Hyper-V/WSL 会保留若干端口段（本机上是 8664–8963 等），
  // 落在其中的端口会直接 EACCES。8787 正好中招，故默认用 9878。
  port: Number(process.env.TAVERN_PORT ?? 9878),

  dbPath: process.env.TAVERN_DB ?? path.join(SERVER_ROOT, "data", "tavern.db"),

  /** 投稿原始包的隔离区（§9.4 ①：绝不在最终路径解压；内容寻址命名） */
  inboxDir: process.env.TAVERN_INBOX ?? path.join(SERVER_ROOT, "data", "inbox"),

  /** 令牌哈希的胡椒（fail-closed：生产缺失或过弱直接拒绝启动） */
  tokenPepper: pepper,

  /** 会话有效期（天） */
  sessionTtlDays: Number(process.env.TAVERN_SESSION_TTL_DAYS ?? 30),

  /** 会话 cookie 是否带 Secure（HTTPS 下必须为 true） */
  sessionSecure: process.env.TAVERN_SESSION_SECURE
    ? process.env.TAVERN_SESSION_SECURE === "1"
    : isProduction,

  /**
   * 是否采信 X-Forwarded-For。
   * 生产一定在反向代理之后，必须为 1 —— 否则限流键会退化成"只有 pin"，
   * 任何人都能靠故意失败把别人锁在门外（见 http.mjs 的 clientIp）。
   * 直连（本地开发）时必须为 0，否则客户端可以随便伪造来源 IP 绕过限流。
   */
  trustProxy: process.env.TAVERN_TRUST_PROXY === "1",

  /** 会话 cookie 名 */
  sessionCookie: "tavern_session",

  /** 未审内容是否允许被公开接口读到 —— 永远为 false（ADR-006） */
  exposeUnpublished: false,

  isProduction,

  rateLimit: {
    maxFailures: 5,
    lockMs: 60_000,
    windowMs: 10 * 60_000,
  },
};

/**
 * 配置自检：宁可起不来，也不要带着可预测的密钥对外服务。
 * 开源仓库里任何人都能看到 DEV_PEPPER 的字面量 —— 一旦它被用在生产，
 * 所有令牌哈希都等于裸奔（可以离线爆破）。
 */
export function assertSecureConfig({ strict = isProduction, bindHost = host, pepperValue = pepper } = {}) {
  const problems = [];
  if (pepperValue === DEV_PEPPER) problems.push("TAVERN_TOKEN_PEPPER 仍是开发默认值");
  if (String(pepperValue).length < 32) problems.push("TAVERN_TOKEN_PEPPER 太短（要求 ≥ 32 字符）");

  const exposed = !["127.0.0.1", "::1", "localhost"].includes(bindHost);
  if (exposed && pepperValue === DEV_PEPPER) problems.push(`绑定了非回环地址 ${bindHost}，却仍在使用开发默认胡椒`);

  if (problems.length && (strict || exposed)) {
    throw new Error(
      `拒绝启动（安全配置不合格）：\n  - ${problems.join("\n  - ")}\n\n` +
      "生成一个强胡椒并写进 tavern-server/.env（该文件已被 gitignore，且会被自动加载）：\n" +
      "  node -e \"console.log('TAVERN_TOKEN_PEPPER=' + require('crypto').randomBytes(32).toString('base64url'))\" > tavern-server/.env\n",
    );
  }
  return problems;
}

/** 开发模式下给出提醒，但不阻止启动 */
export function warnInsecureConfig() {
  const problems = assertSecureConfig({ strict: false, bindHost: host });
  if (problems.length && !isProduction) {
    process.stderr.write(`[warning] ${problems.join("；")}（仅开发可接受）\n`);
  }
}

export function nowIso(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString();
}
