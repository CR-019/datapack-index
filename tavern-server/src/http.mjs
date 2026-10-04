/**
 * 极简 HTTP 路由与响应工具（零依赖原型）。
 * 生产若接入 Fastify（ADR-007），这一层可直接替换，路由表与 handler 形状保持不变。
 */

import { config } from "./config.mjs";

/**
 * 解码路径段。
 * 绝不能让它抛异常：畸形百分号编码（如 /v1/nodes/%E4%B8%8D）会让 decodeURIComponent
 * 抛 URIError，而路由匹配发生在请求处理的 try/catch 之外 —— 曾经因此整进程崩溃。
 */
export function safeDecode(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function createRouter() {
  const routes = [];

  const add = (method, pattern, handler) => {
    routes.push({
      method,
      pattern,
      segments: pattern.split("/").filter(Boolean),
      handler,
    });
  };

  return {
    get: (pattern, handler) => add("GET", pattern, handler),
    post: (pattern, handler) => add("POST", pattern, handler),
    put: (pattern, handler) => add("PUT", pattern, handler),
    patch: (pattern, handler) => add("PATCH", pattern, handler),
    delete: (pattern, handler) => add("DELETE", pattern, handler),
    routes,

    /** 返回 { handler, params }，路径匹配但方法不符时返回 { allowed: [...] } */
    match(method, pathname) {
      const parts = pathname.split("/").filter(Boolean);
      const allowed = [];
      for (const route of routes) {
        if (route.segments.length !== parts.length) continue;
        const params = {};
        let ok = true;
        for (let i = 0; i < parts.length; i += 1) {
          const seg = route.segments[i];
          if (seg.startsWith(":")) params[seg.slice(1)] = safeDecode(parts[i]);
          else if (seg !== parts[i]) { ok = false; break; }
        }
        if (!ok) continue;
        if (route.method === method) return { handler: route.handler, params };
        allowed.push(route.method);
      }
      return allowed.length ? { allowed } : null;
    },
  };
}

export function sendJson(res, status, body, headers = {}) {
  const payload = `${JSON.stringify(body, null, 2)}\n`;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...headers,
  });
  res.end(payload);
}

export function sendText(res, status, text, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(text);
}

/** 公开只读接口的 CORS（与 MCFPM 现行做法一致：GET/HEAD/OPTIONS + 通配来源） */
export const PUBLIC_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "If-None-Match",
};

export function readBody(req, limitBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("请求体过大"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export async function readJson(req, limitBytes) {
  const raw = await readBody(req, limitBytes);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    throw new Error("请求体不是合法 JSON");
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  const out = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

export function serializeCookie(name, value, { maxAge, secure = false, httpOnly = true, sameSite = "Lax", path = "/" } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`];
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  if (typeof maxAge === "number") parts.push(`Max-Age=${maxAge}`);
  return parts.join("; ");
}

/**
 * 取客户端 IP。
 *
 * ⚠️ 部署相关：服务前面一定有反向代理（Caddy/Nginx 终止 HTTPS），
 * 此时 `req.socket.remoteAddress` 永远是 127.0.0.1。若直接拿它当限流键，
 * "按 pin + IP 锁定" 就退化成"按 pin 锁定" —— **任何人都能故意失败 5 次，
 * 把某个作者锁在门外**（DoS）。
 *
 * 因此只有在明确配置了 TAVERN_TRUST_PROXY=1（即确实有可信反代、且服务只绑回环）
 * 时才采信 X-Forwarded-For，并取最左边的地址（最初的客户端）。
 */
export function clientIp(req, { trustProxy = config.trustProxy } = {}) {
  if (trustProxy) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
      const first = forwarded.split(",")[0].trim();
      if (first) return first;
    }
    const real = req.headers["x-real-ip"];
    if (typeof real === "string" && real.trim()) return real.trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}
