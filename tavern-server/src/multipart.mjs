/**
 * 零依赖 multipart/form-data 解析器。
 *
 * 只做我们需要的：把 `FormData`（字段 + 一个 zip 文件）解成 { fields, files }。
 * 刻意不追求完整规范（不做嵌套 multipart、不做 base64 传输编码），
 * 遇到不认识的东西**明确报错**而不是猜——这是收投稿的入口，宁可严一点。
 *
 * 与 http.readBody 配合：调用方负责限制总大小（zip 上限 20MB + 少量表单字段）。
 */

const CRLF = Buffer.from("\r\n");
/** 头块与内容之间的空行 —— 必须找这个，而不是第一个 CRLF */
const HEADER_TERMINATOR = Buffer.from("\r\n\r\n");
const MAX_BOUNDARY_LENGTH = 200;
const MAX_PARTS = 16;
const MAX_HEADER_BYTES = 8 * 1024;

export class MultipartError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "MultipartError";
    this.code = code;
  }
}

const fail = (code, message) => {
  throw new MultipartError(code, message);
};

/** 从 Content-Type 头里取出 boundary */
export function parseBoundary(contentType) {
  const type = String(contentType ?? "");
  if (!/^multipart\/form-data/i.test(type)) {
    fail("not_multipart", `Content-Type 必须是 multipart/form-data，收到「${type.split(";")[0] || "空"}」`);
  }
  // boundary 可能带引号，也可能不带
  const match = /;\s*boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(type);
  const boundary = match?.[1] ?? match?.[2];
  if (!boundary) fail("missing_boundary", "multipart 请求缺少 boundary");
  if (boundary.length > MAX_BOUNDARY_LENGTH) fail("boundary_too_long", "boundary 过长");
  return boundary;
}

function parsePartHeaders(block) {
  const headers = {};
  for (const line of block.toString("utf8").split("\r\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    headers[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
  }
  return headers;
}

/** 从 Content-Disposition 里取 name / filename（filename 可能不存在） */
function parseDisposition(value) {
  const text = String(value ?? "");
  const name = /;\s*name=(?:"([^"]*)"|([^;\s]+))/i.exec(text);
  const filename = /;\s*filename=(?:"([^"]*)"|([^;\s]+))/i.exec(text);
  return {
    name: name?.[1] ?? name?.[2] ?? null,
    filename: filename?.[1] ?? filename?.[2] ?? null,
  };
}

/**
 * 解析 multipart 请求体。
 * @returns {{ fields: Record<string,string>, files: Array<{name,filename,contentType,size,data}> }}
 */
export function parseMultipart(body, contentType, { maxParts = MAX_PARTS } = {}) {
  if (!Buffer.isBuffer(body) || body.length === 0) fail("empty_body", "请求体为空");
  const boundary = parseBoundary(contentType);

  const delimiter = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = [];

  // 必须以分隔符开头
  if (body.indexOf(delimiter) !== 0) fail("bad_multipart", "multipart 请求体没有以 boundary 开头");

  let cursor = 0;
  let partCount = 0;

  while (cursor < body.length) {
    // 定位本次分隔符
    const boundaryStart = body.indexOf(delimiter, cursor);
    if (boundaryStart < 0) break;
    let after = boundaryStart + delimiter.length;

    // 结束标记：--boundary--
    if (body[after] === 0x2d && body[after + 1] === 0x2d) break;
    // 分隔符后必须是 CRLF
    if (body[after] !== 0x0d || body[after + 1] !== 0x0a) fail("bad_multipart", "boundary 之后缺少换行");
    after += 2;

    const nextBoundary = body.indexOf(delimiter, after);
    if (nextBoundary < 0) fail("bad_multipart", "找不到下一个 boundary（请求体被截断？）");

    // 内容区 = [after, nextBoundary)，去掉尾部的 CRLF
    let contentEnd = nextBoundary;
    if (body[contentEnd - 2] === 0x0d && body[contentEnd - 1] === 0x0a) contentEnd -= 2;

    // 头块与内容以**空行**分隔（找 CRLFCRLF，不是第一个 CRLF —— 否则会把
    // 后面的 Content-Type 头当成文件内容，这是个真实踩过的 bug）
    const headerEnd = body.indexOf(HEADER_TERMINATOR, after);
    if (headerEnd < 0 || headerEnd > contentEnd) fail("bad_multipart", "part 缺少头部与内容之间的空行");
    if (headerEnd - after > MAX_HEADER_BYTES) fail("headers_too_large", "part 头部过大");

    const headers = parsePartHeaders(body.subarray(after, headerEnd));
    const { name, filename } = parseDisposition(headers["content-disposition"]);
    const content = body.subarray(headerEnd + HEADER_TERMINATOR.length, contentEnd);

    if (headers["content-transfer-encoding"] && !/^(binary|8bit|7bit)$/i.test(headers["content-transfer-encoding"])) {
      fail("unsupported_encoding", `不支持的 Content-Transfer-Encoding：${headers["content-transfer-encoding"]}`);
    }

    partCount += 1;
    if (partCount > maxParts) fail("too_many_parts", `part 数量超过上限（${maxParts}）`);

    if (filename != null) {
      files.push({
        name: name ?? "file",
        filename: filename || null,
        contentType: headers["content-type"] ?? "application/octet-stream",
        size: content.length,
        data: Buffer.from(content),
      });
    } else if (name) {
      // 同名重复字段：后来的覆盖前面的（我们只用标量字段）
      fields[name] = content.toString("utf8").trim();
    }

    cursor = nextBoundary;
  }

  if (!partCount) fail("bad_multipart", "没有解析到任何 part");
  return { fields, files };
}

/** 取指定字段名的文件；缺失时报错，并把收到的字段一并列出（便于排查表单写错） */
export function requireFile(parsed, name = "archive") {
  const file = parsed.files.find((entry) => entry.name === name);
  if (!file) {
    const available = [
      parsed.files.length ? `文件：${parsed.files.map((entry) => entry.name).join(", ")}` : null,
      Object.keys(parsed.fields).length ? `字段：${Object.keys(parsed.fields).join(", ")}` : null,
    ].filter(Boolean).join("；");
    fail("missing_file", `缺少文件字段「${name}」（收到 ${available || "空上传"}）`);
  }
  if (!file.size) fail("empty_file", `文件字段「${name}」是空的`);
  return file;
}
