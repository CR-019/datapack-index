/**
 * 投稿摄取流水线（设计文档 §9.4）。
 *
 *   ① 收包            → 由路由层负责（写入 inbox，隔离区）
 *   ② 预检            → zip.mjs（大小 / 条目数 / 路径安全 / 炸弹）
 *   ③ 解压到隔离区     → zip.mjs（内存中）
 *   ④ 归一化          → 本文件：清平台垃圾、折叠唯一项目根、丢弃空文件
 *   ⑤ 校验            → 本文件：模板版本 / 必填字段 / 素材规格 / 引用格式
 *   ⑥ 素材哈希        → 本文件：内容哈希命名所需的 sha256 与 mime
 *   ⑦ 成档            → 本文件输出 revision snapshot 的数据结构
 *   ⑧ 发布            → 路由与审核层（移动 publishedRevisionId）
 *
 * 设计取舍：**校验收集全部问题，而不是抛第一个**。
 * 投稿工作台要一次性告诉作者哪里不对，逐个报错会让人来回试很多遍。
 * 结构性错误（不是 zip、路径穿越）仍然直接抛 ZipError。
 */

import crypto from "node:crypto";
import path from "node:path";

import { parseFrontmatter } from "./frontmatter.mjs";
import { ZIP_LIMITS, ZipError, extractZip, looksLikeZip } from "./zip.mjs";

export const TEMPLATE_VERSION = 1;
export const SUPPORTED_TEMPLATES = new Set([1]);
export const KINDS = new Set(["project", "event", "index"]);
export const MAIN_FILE = "project.md";
export const RELATIONS_FILE = "relations.json";

/** 这些文件是元数据，不是素材（否则会被当成本文不支持的图片类型拒掉） */
export const METADATA_FILES = new Set([RELATIONS_FILE]);

export const ASSET_MIME = Object.freeze({
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
});

export const LIMITS = Object.freeze({
  maxBodyBytes: 200 * 1024,
  maxAssetBytes: 2 * 1024 * 1024,
  maxSummaryLength: 120,
  maxTags: 24,
  maxLinks: 24,
  maxRecruit: 12,
});

/* ───────────────── ④ 归一化 ───────────────── */

/** 平台垃圾：macOS / Windows / 版本控制 / 编辑器产物（§9.2 宽容度矩阵） */
const PLATFORM_JUNK = [
  /(^|\/)__MACOSX(\/|$)/i,
  /(^|\/)\.DS_Store$/i,
  /(^|\/)\._[^/]*$/, // AppleDouble
  /(^|\/)Thumbs\.db$/i,
  /(^|\/)desktop\.ini$/i,
  /(^|\/)\.git(\/|$)/i,
  /(^|\/)\.svn(\/|$)/i,
  /(^|\/)\.hg(\/|$)/i,
  /(^|\/)\.idea(\/|$)/i,
  /(^|\/)\.vscode(\/|$)/i,
  /(^|\/)node_modules(\/|$)/i,
  /(^|\/)\.tavern(\/|$)/i, // 平台自己生成的目录，作者不该打包进来
];

export function isPlatformJunk(relativePath) {
  return PLATFORM_JUNK.some((pattern) => pattern.test(relativePath));
}

/** 丢弃平台垃圾与空文件；返回 { kept, dropped } */
export function normalizeFiles(files) {
  const kept = [];
  const dropped = [];
  for (const file of files) {
    if (isPlatformJunk(file.path)) {
      dropped.push({ path: file.path, reason: "platform_junk" });
      continue;
    }
    if (file.size === 0) {
      dropped.push({ path: file.path, reason: "empty_file" });
      continue;
    }
    kept.push(file);
  }
  return { kept, dropped };
}

/**
 * 折叠到"唯一项目根"：若所有文件都在同一个顶层目录下，就去掉这一层。
 * slug **不由文件名决定**（文件名会撞、会乱码），而是由表单给出。
 */
export function foldProjectRoot(files) {
  if (!files.length) return { files, foldedRoot: null };
  const roots = new Set(files.map((file) => file.path.split("/")[0]));
  if (roots.size !== 1) return { files, foldedRoot: null };

  const root = [...roots][0];
  // 只有当"该名字本身不是一个文件"时才折叠
  const rootIsFile = files.some((file) => file.path === root);
  if (rootIsFile) return { files, foldedRoot: null };

  return {
    foldedRoot: root,
    files: files.map((file) => ({ ...file, path: file.path.slice(root.length + 1) })),
  };
}

/* ───────────────── ⑤ 校验辅助 ───────────────── */

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const asString = (value) => (typeof value === "string" ? value.trim() : "");
const asArray = (value) => (Array.isArray(value) ? value : value === "" || value == null ? [] : [value]);

function toIdSlug(value) {
  const text = asString(value);
  if (!text) return null;
  if (text.includes(":")) return text;
  return null;
}

function checkLinks(links, errors, where = "links") {
  return links.map((entry, index) => {
    if (!isPlainObject(entry)) {
      errors.push({ code: "bad_link", message: `${where}[${index}] 必须是 {label, url} 形式`, where });
      return null;
    }
    const label = asString(entry.label) || asString(entry.url);
    const url = asString(entry.url);
    if (!url) {
      errors.push({ code: "bad_link", message: `${where}[${index}] 缺少 url`, where });
      return null;
    }
    const safe = /^https?:\/\//i.test(url) || url.startsWith("/") || url.startsWith("mailto:");
    if (!safe) {
      errors.push({ code: "unsafe_link", message: `${where}[${index}] 只允许 http(s)、站内绝对路径或 mailto：${url}`, where });
      return null;
    }
    return { label, url };
  }).filter(Boolean);
}

function checkRecruit(entries, errors) {
  return entries.map((entry, index) => {
    if (!isPlainObject(entry)) {
      errors.push({ code: "bad_recruit", message: `recruit[${index}] 必须是映射（含 role 字段）`, where: "recruit" });
      return null;
    }
    const role = asString(entry.role);
    if (!role) errors.push({ code: "recruit_missing_role", message: `recruit[${index}] 缺少 role（岗位名）`, where: "recruit" });
    const status = asString(entry.status) || "open";
    if (!["open", "filled", "closed"].includes(status)) {
      errors.push({ code: "bad_recruit_status", message: `recruit[${index}] 的 status 只能是 open/filled/closed`, where: "recruit" });
    }
    const headcount = entry.headcount;
    return {
      role,
      skills: asArray(entry.skills).map(asString).filter(Boolean),
      headcount: typeof headcount === "number" ? headcount : (asString(headcount) || null),
      status,
      deadline: asString(entry.deadline) || null,
      contact: asString(entry.contact) || null,
      body: "",
    };
  }).filter(Boolean);
}

/* ───────────────── 主体：把解压结果变成项目 ───────────────── */

/**
 * @param {Array<{path:string,data:Buffer}>} files 来自 extractZip
 * @param {{ slug?: string, locale?: string }} options
 */
export function buildProject(files, { locale = "zh" } = {}) {
  const errors = [];
  const warnings = [];

  const { kept, dropped } = normalizeFiles(files);
  const { files: folded, foldedRoot } = foldProjectRoot(kept);
  if (foldedRoot) warnings.push({ code: "folded_root", message: `已折叠掉多余的顶层目录「${foldedRoot}/」` });
  for (const item of dropped) {
    warnings.push({ code: `dropped_${item.reason}`, message: `已忽略：${item.path}（${item.reason === "platform_junk" ? "系统生成的垃圾文件" : "空文件"}）` });
  }

  const byPath = new Map(folded.map((file) => [file.path, file]));
  const mainFile = byPath.get(MAIN_FILE);
  if (!mainFile) {
    errors.push({
      code: "missing_project_md",
      message: `压缩包根目录缺少 ${MAIN_FILE}（当前顶层是：${[...new Set(folded.map((file) => file.path.split("/")[0]))].slice(0, 5).join(", ") || "空"}）`,
    });
    return { project: null, errors, warnings, dropped };
  }

  const { data, body, hasFrontmatter } = parseFrontmatter(mainFile.data.toString("utf8"));
  if (!hasFrontmatter) {
    errors.push({ code: "missing_frontmatter", message: `${MAIN_FILE} 顶部缺少 --- 包裹的元数据块` });
  }

  // 模板版本
  const templateRaw = data.template;
  const template = Number.parseInt(String(templateRaw ?? ""), 10);
  if (!Number.isFinite(template)) {
    errors.push({ code: "missing_template", message: "frontmatter 缺少 template（模板版本号，当前为 1）" });
  } else if (!SUPPORTED_TEMPLATES.has(template)) {
    errors.push({ code: "unsupported_template", message: `不支持的模板版本 ${template}（本服务支持：${[...SUPPORTED_TEMPLATES].join(", ")}）` });
  }

  // 必填
  const name = asString(data.name);
  const summary = asString(data.summary);
  if (!name) errors.push({ code: "missing_name", message: "frontmatter 缺少 name（显示名）" });
  if (!summary) errors.push({ code: "missing_summary", message: "frontmatter 缺少 summary（一句话简介）" });
  if (summary.length > LIMITS.maxSummaryLength) {
    errors.push({ code: "summary_too_long", message: `summary 过长（${summary.length} 字 > ${LIMITS.maxSummaryLength} 字）` });
  }

  // kind
  const kind = asString(data.kind) || "project";
  if (!KINDS.has(kind)) errors.push({ code: "bad_kind", message: `kind 只能是 ${[...KINDS].join(" / ")}，收到「${kind}」` });

  // 平台字段不许出现（防止作者手写引起冲突）
  const forbidden = ["id", "publishedRevisionId", "maintains", "state", "revision"];
  for (const key of forbidden) {
    if (key in data) {
      errors.push({ code: "platform_field", message: `frontmatter 不应包含平台字段「${key}」——它由服务端维护` });
    }
  }

  // 时间窗
  let time = null;
  if (isPlainObject(data.time)) {
    const start = asString(data.time.start);
    const end = asString(data.time.end);
    time = { start: start || null, end: end || null, deadline: asString(data.time.deadline) || null };
    if (!start || !end) errors.push({ code: "bad_time", message: "time 需要同时给出 start 与 end" });
    else if (!(new Date(end) > new Date(start))) errors.push({ code: "bad_time_range", message: `time.end 必须晚于 time.start（${start} → ${end}）` });
  } else if (kind === "event") {
    errors.push({ code: "missing_time", message: "赛事（kind: event）必须提供 time.start 与 time.end" });
  }

  // 标签
  const tags = asArray(data.tags).map(asString).filter(Boolean);
  if (tags.length > LIMITS.maxTags) errors.push({ code: "too_many_tags", message: `标签过多（${tags.length} > ${LIMITS.maxTags}）` });

  // 链接
  const links = checkLinks(asArray(data.links).filter(isPlainObject), errors);

  // 正文体积
  const bodyBytes = Buffer.byteLength(body, "utf8");
  if (bodyBytes > LIMITS.maxBodyBytes) {
    errors.push({ code: "body_too_long", message: `正文过大（${(bodyBytes / 1024).toFixed(1)} KB > ${LIMITS.maxBodyBytes / 1024} KB）` });
  }

  // 素材
  const mdFiles = folded.filter((file) => file.path.toLowerCase().endsWith(".md"));
  const assetFiles = folded.filter((file) => !file.path.toLowerCase().endsWith(".md") && !METADATA_FILES.has(file.path));
  const assets = [];
  for (const file of assetFiles) {
    const extension = path.extname(file.path).toLowerCase();
    const mime = ASSET_MIME[extension];
    if (!mime) {
      errors.push({ code: "bad_asset_type", message: `不支持的素材类型：${file.path}（只允许 ${Object.keys(ASSET_MIME).join(" / ")}）` });
      continue;
    }
    if (file.size > LIMITS.maxAssetBytes) {
      errors.push({ code: "asset_too_large", message: `素材过大：${file.path}（${(file.size / 1024).toFixed(0)} KB > ${LIMITS.maxAssetBytes / 1024} KB）` });
      continue;
    }
    assets.push({
      path: file.path,
      sha256: crypto.createHash("sha256").update(file.data).digest("hex"),
      size: file.size,
      mime,
    });
  }

  // 封面：frontmatter 指定 or assets/cover.*
  const declaredCover = asString(data.cover);
  let cover = null;
  if (declaredCover) {
    if (!assets.some((asset) => asset.path === declaredCover)) {
      errors.push({ code: "cover_missing", message: `frontmatter 指定的封面不存在于压缩包中：${declaredCover}` });
    } else {
      cover = declaredCover;
    }
  } else {
    const guessed = assets.find((asset) => /(^|\/)cover\.[a-z0-9]+$/i.test(asset.path));
    cover = guessed?.path ?? null;
    if (!cover) warnings.push({ code: "no_cover", message: "没有找到封面（assets/cover.*），列表卡片会显示占位图" });
  }

  // 语言变体：project.<lang>.md
  const i18n = {};
  const localePattern = /^project\.([A-Za-z]{2}(?:-[A-Za-z]{2})?)\.md$/;
  for (const file of mdFiles) {
    const match = localePattern.exec(file.path);
    if (!match) continue;
    const language = match[1].toLowerCase();
    const parsed = parseFrontmatter(file.data.toString("utf8"));
    i18n[language] = {
      title: asString(parsed.data.name) || name,
      summary: asString(parsed.data.summary) || summary,
      body: parsed.body,
    };
  }
  if (!errors.some((error) => error.code === "missing_name")) {
    i18n[locale] = { title: name, summary, body };
  }

  // 招募：recruit/<岗位>.md
  const recruitFiles = mdFiles.filter((file) => file.path.startsWith("recruit/"));
  const recruit = checkRecruit(
    recruitFiles.map((file) => {
      const parsed = parseFrontmatter(file.data.toString("utf8"));
      return { ...parsed.data, body: parsed.body };
    }),
    errors,
  );
  for (const [index, entry] of recruit.entries()) {
    entry.body = parseFrontmatter(recruitFiles[index].data.toString("utf8")).body.trim();
  }
  if (recruit.length > LIMITS.maxRecruit) errors.push({ code: "too_many_recruit", message: `招募岗位过多（${recruit.length} > ${LIMITS.maxRecruit}）` });

  // 关联意图
  const relations = { requests: [], related: [], depends: [] };
  const relationsFile = byPath.get(RELATIONS_FILE);
  if (relationsFile) {
    try {
      const parsed = JSON.parse(relationsFile.data.toString("utf8"));
      for (const key of ["related", "depends"]) {
        relations[key] = asArray(parsed?.[key]).map(toIdSlug).filter(Boolean);
      }
      relations.requests = asArray(parsed?.requests).map((entry, index) => {
        if (!isPlainObject(entry)) {
          errors.push({ code: "bad_request", message: `relations.requests[${index}] 必须是 {rel, to} 形式` });
          return null;
        }
        const rel = asString(entry.rel);
        const to = toIdSlug(entry.to);
        if (!["parent", "includes"].includes(rel)) {
          errors.push({ code: "bad_request_rel", message: `relations.requests[${index}].rel 只能是 parent 或 includes` });
          return null;
        }
        if (!to) {
          errors.push({ code: "bad_request_target", message: `relations.requests[${index}].to 必须是 kind:slug 形式（如 event:autumn-jam-2026）` });
          return null;
        }
        return { rel, to, note: asString(entry.note) || null };
      }).filter(Boolean);
    } catch {
      errors.push({ code: "bad_relations_json", message: `${RELATIONS_FILE} 不是合法 JSON` });
    }
  }

  const project = {
    template: Number.isFinite(template) ? template : null,
    kind: KINDS.has(kind) ? kind : null,
    name,
    summary,
    tags,
    gameversion: asArray(data.gameversion).map(asString).filter(Boolean),
    repo: asString(data.repo) || null,
    license: asString(data.license) || null,
    links,
    cover,
    time,
    i18n,
    recruit,
    relations,
    assets,
    extraFiles: mdFiles.filter((file) => file.path !== MAIN_FILE && !file.path.startsWith("recruit/") && !localePattern.test(file.path)).map((file) => file.path),
  };

  if (project.extraFiles.length) {
    warnings.push({ code: "extra_markdown", message: `这些 Markdown 不会被展示：${project.extraFiles.join(", ")}` });
  }

  return { project, errors, warnings, dropped, foldedRoot };
}

/* ───────────────── 对外入口 ───────────────── */

/**
 * 摄取一个 zip 投稿。
 * 结构性错误（不是 zip / 路径穿越 / 炸弹）抛 ZipError；内容问题收集在 errors 里。
 */
export function ingestZip(buffer, { locale = "zh", limits = ZIP_LIMITS } = {}) {
  if (!Buffer.isBuffer(buffer) || !looksLikeZip(buffer)) {
    throw new ZipError("not_a_zip", "上传的内容不是 zip 压缩包");
  }
  const extracted = extractZip(buffer, limits);
  const { project, errors, warnings, dropped, foldedRoot } = buildProject(extracted.files, { locale });
  return {
    project,
    errors,
    warnings,
    stats: { ...extracted.stats, droppedCount: dropped.length, foldedRoot },
    files: extracted.files,
  };
}

/** 内容哈希：用于乐观锁 baseRevisionId 与漂移检测 */
export function projectContentHash(project, files) {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify({ ...project, assets: project.assets.map((asset) => asset.sha256).sort() }));
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) hash.update(file.data);
  return hash.digest("hex");
}
