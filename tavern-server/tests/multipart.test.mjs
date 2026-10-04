import assert from "node:assert/strict";
import test from "node:test";

import { MultipartError, parseBoundary, parseMultipart, requireFile } from "../src/multipart.mjs";

const BOUNDARY = "----TavernTestBoundary1234";

function buildForm(parts) {
  const chunks = [];
  for (const part of parts) {
    chunks.push(Buffer.from(`--${BOUNDARY}\r\n`));
    if (part.filename != null) {
      chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"; filename="${part.filename}"\r\n`));
      chunks.push(Buffer.from(`Content-Type: ${part.contentType ?? "application/octet-stream"}\r\n\r\n`));
    } else {
      chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"\r\n\r\n`));
    }
    chunks.push(Buffer.isBuffer(part.value) ? part.value : Buffer.from(String(part.value), "utf8"));
    chunks.push(Buffer.from("\r\n"));
  }
  chunks.push(Buffer.from(`--${BOUNDARY}--\r\n`));
  return Buffer.concat(chunks);
}

const CT = `multipart/form-data; boundary=${BOUNDARY}`;

test("解析文本字段与文件字段", () => {
  const body = buildForm([
    { name: "slug", value: "my-project" },
    { name: "archive", filename: "submission.zip", contentType: "application/zip", value: Buffer.from("PK\u0003\u0004binary") },
  ]);
  const parsed = parseMultipart(body, CT);
  assert.equal(parsed.fields.slug, "my-project");
  assert.equal(parsed.files.length, 1);
  assert.equal(parsed.files[0].name, "archive");
  assert.equal(parsed.files[0].filename, "submission.zip");
  assert.equal(parsed.files[0].contentType, "application/zip");
  assert.equal(parsed.files[0].data.toString("latin1"), "PK\u0003\u0004binary");
});

test("二进制内容不被 CRLF 处理破坏（含 NULL 与 0x0d0a）", () => {
  const binary = Buffer.from([0x00, 0x0d, 0x0a, 0xff, 0x1a, 0x0d, 0x0a, 0x50, 0x4b]);
  const body = buildForm([{ name: "archive", filename: "a.zip", value: binary }]);
  const parsed = parseMultipart(body, CT);
  assert.deepEqual([...parsed.files[0].data], [...binary]);
});

test("boundary 带引号也能解析", () => {
  assert.equal(parseBoundary(`multipart/form-data; boundary="${BOUNDARY}"`), BOUNDARY);
  assert.equal(parseBoundary(`multipart/form-data; boundary=${BOUNDARY}`), BOUNDARY);
});

test("非 multipart 的 Content-Type 明确报错", () => {
  assert.throws(() => parseBoundary("application/json"), (error) => error instanceof MultipartError && error.code === "not_multipart");
  assert.throws(() => parseBoundary("multipart/form-data"), (error) => error.code === "missing_boundary");
});

test("请求体被截断时报错而不是静默返回半个文件", () => {
  const full = buildForm([{ name: "archive", filename: "a.zip", value: Buffer.alloc(500, 7) }]);
  const truncated = full.subarray(0, full.length - 60); // 砍掉结尾的 boundary
  assert.throws(() => parseMultipart(truncated, CT), (error) => error instanceof MultipartError);
});

test("不支持的 Content-Transfer-Encoding 被拒绝（不猜）", () => {
  const bad = Buffer.concat([
    Buffer.from(`--${BOUNDARY}\r\n`),
    Buffer.from('Content-Disposition: form-data; name="archive"; filename="a.zip"\r\n'),
    Buffer.from("Content-Transfer-Encoding: base64\r\n\r\n"),
    Buffer.from("UEsDBAo=\r\n"),
    Buffer.from(`--${BOUNDARY}--\r\n`),
  ]);
  assert.throws(() => parseMultipart(bad, CT), (error) => error.code === "unsupported_encoding");
});

test("part 数量超限被拒绝", () => {
  const many = Array.from({ length: 5 }, (_, index) => ({ name: `f${index}`, value: "x" }));
  assert.throws(() => parseMultipart(buildForm(many), CT, { maxParts: 3 }), (error) => error.code === "too_many_parts");
});

test("空请求体与空文件被拒绝", () => {
  assert.throws(() => parseMultipart(Buffer.alloc(0), CT), (error) => error.code === "empty_body");
  const empty = buildForm([{ name: "archive", filename: "a.zip", value: Buffer.alloc(0) }]);
  assert.throws(() => requireFile(parseMultipart(empty, CT), "archive"), (error) => error.code === "empty_file");
});

test("缺文件字段时给出可读提示", () => {
  const body = buildForm([{ name: "slug", value: "x" }]);
  const parsed = parseMultipart(body, CT);
  assert.throws(() => requireFile(parsed, "archive"), (error) => {
    assert.equal(error.code, "missing_file");
    assert.match(error.message, /slug/);
    return true;
  });
});

test("filename 里的中文按 UTF-8 原样保留", () => {
  const body = buildForm([{ name: "archive", filename: "我的项目.zip", value: Buffer.from("data") }]);
  assert.equal(parseMultipart(body, CT).files[0].filename, "我的项目.zip");
});
