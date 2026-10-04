/**
 * 秘密扫描的规则与实现（纯函数，便于单测）。
 * CLI 入口在 scripts/check-secrets.mjs。
 */

/** 只扫文本类文件，跳过大体积素材 */
export const TEXT_EXT = new Set([
  ".mjs", ".cjs", ".js", ".ts", ".mts", ".vue", ".json", ".yml", ".yaml",
  ".md", ".txt", ".html", ".css", ".sql", ".sh", ".py", ".toml", ".ini", ".env",
]);

export const SKIP_PATH = [/^public\//, /^tavern-server\/data\//, /^\.vitepress\/cache\//, /^node_modules\//];

export const MAX_FILE_BYTES = 512 * 1024;

export const RULES = [
  { id: "private-key", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, why: "私钥内容" },
  { id: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/, why: "GitHub 令牌" },
  { id: "aws-key", re: /\bAKIA[0-9A-Z]{16}\b/, why: "AWS Access Key" },
  { id: "slack-token", re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/, why: "Slack 令牌" },
  // 注意：这里**故意不设** "开发默认胡椒" 规则 —— 该字面量本来就在公开源码里
  // （它是个占位符，不是秘密）。"生产不许用它"由 config.mjs 的 assertSecureConfig()
  // 以 fail-closed 方式强制，而不是靠扫描文本。
  {
    id: "assigned-secret",
    // 赋值式的长随机串：password = "…" / token: '…' / apiKey = "…"
    re: /\b(?:password|passwd|secret|api[_-]?key|bearer|access[_-]?token|auth[_-]?token)\b\s*[:=]\s*["'`][A-Za-z0-9+/_=-]{20,}["'`]/i,
    why: "疑似硬编码凭证",
  },
];

/** 允许的例外：示例文件与占位符 */
export const ALLOW = [
  /\.env\.example$/,
  /\bCHANGE[-_]?ME\b/i,
  /\bxxx+\b/i,
  /\bexample\b/i,
  /\bplaceholder\b/i,
  /\byour[-_]?token\b/i,
];

/**
 * 行内豁免标记。用于"这里必须长得像真凭证"的场合（测试夹具、文档示例）。
 * 用它必须同时说明理由，否则审查者无法判断是真豁免还是在掩盖泄露。
 */
export const ALLOW_MARKER = "secret-scan:allow";

/** 扫描一段文本，返回命中列表 */
export function scanText(text, file = "<text>", { rules = RULES, allow = ALLOW } = {}) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    if (line.includes(ALLOW_MARKER)) continue;
    if (allow.some((pattern) => pattern.test(line))) continue;
    for (const rule of rules) {
      if (rule.re.test(line)) {
        hits.push({
          file,
          line: index + 1,
          rule: rule.id,
          why: rule.why,
          excerpt: line.trim().slice(0, 100),
        });
      }
    }
  }
  return hits;
}
