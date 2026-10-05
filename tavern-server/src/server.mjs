import http from "node:http";

import { assertSecureConfig, config, warnInsecureConfig } from "./config.mjs";
import { openDatabase } from "./db.mjs";
import { PUBLIC_CORS, isPublicRead, sendJson, sendText } from "./http.mjs";
import { HttpError, buildRouter } from "./routes.mjs";

// 配置自检：宁可起不来，也不要带着可预测的密钥对外服务（开源仓库里
// DEV_PEPPER 的字面量人人可见，用在生产等于令牌哈希裸奔）
assertSecureConfig();
warnInsecureConfig();

const db = openDatabase();
const router = buildRouter(db);

const server = http.createServer(async (req, res) => {
  let isPublic = true;
  try {
    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
    } catch {
      return sendText(res, 400, "bad request");
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204, isPublicRead(req, url.pathname) ? PUBLIC_CORS : {});
      return res.end();
    }

    isPublic = isPublicRead(req, url.pathname);
    const headers = isPublic ? PUBLIC_CORS : {};

    // 路由匹配也在 try 内 —— 任何匹配期的异常都不允许打掉进程
    const matched = router.match(req.method, url.pathname);
    if (!matched) return sendJson(res, 404, { error: "not_found", path: url.pathname }, headers);
    if (matched.allowed) {
      return sendJson(res, 405, { error: "method_not_allowed", allowed: matched.allowed }, { ...headers, Allow: matched.allowed.join(", ") });
    }

    await matched.handler({ req, res, url, params: matched.params, db, isPublic });
  } catch (error) {
    const headers = isPublic ? PUBLIC_CORS : {};
    // 领域错误自带状态码；压缩包/多部分格式问题属于"客户端给的东西不对"
    const status = error instanceof HttpError
      ? error.status
      : typeof error?.status === "number"
        ? error.status
        : error?.name === "ZipError"
          ? 422
          : error?.name === "MultipartError"
            ? 400
            : 500;

    if (status >= 500) {
      process.stderr.write(`[error] ${error?.stack ?? error}\n`);
      if (res.headersSent) return res.end();
      // 内部错误不外泄细节
      return sendJson(res, 500, { error: "internal_error", message: "服务器内部错误" }, headers);
    }

    if (res.headersSent) return res.end();
    return sendJson(res, status, { error: error.code ?? "invalid_request", message: error.message }, headers);
  }
});

server.listen(config.port, config.host, () => {
  process.stdout.write(`酒馆看板后端  →  http://${config.host}:${config.port}\n`);
  process.stdout.write(`  数据库: ${config.dbPath}\n`);
  process.stdout.write(`  试一下: curl -s http://${config.host}:${config.port}/v1/status\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
