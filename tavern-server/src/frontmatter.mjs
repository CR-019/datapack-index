/**
 * 极简 YAML 子集解析器（够投稿模板用，不引入依赖）。
 *
 * 支持：`key: value`、内联数组 `[a, b]`、块数组 `- item`、
 * 两级嵌套映射、以及"数组里放映射"（`- label: x` + 缩进的 `url: y`）。
 *
 * 关键约定：**除 true/false/null 外一律保持字符串**。
 * 因为 `gameversion: 1.21.9` 这类值一旦被解析成数字就会变成 `1.21`，
 * 静默毁掉数据 —— 宁可后面按需转换，也不在这里猜。
 */

const QUOTED = /^"(.*)"$|^'(.*)'$/;

function stripQuotes(value) {
  const match = QUOTED.exec(value);
  if (!match) return value;
  return (match[1] ?? match[2] ?? "").replace(/\\"/g, '"');
}

export function parseScalar(raw) {
  const value = String(raw).trim();

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => stripQuotes(item.trim())).filter((item) => item !== "");
  }

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~" || value === "") return value === "" ? "" : null;

  return stripQuotes(value);
}

const isListLine = (line) => line.text === "-" || line.text.startsWith("- ");
const isMapLine = (text) => /^[^:[\]]+:(\s|$)/.test(text);

/** 解析 YAML 子集文本为对象 */
export function parseYamlSubset(source) {
  const lines = String(source)
    .split(/\r?\n/)
    .map((raw) => ({ indent: /^ */.exec(raw)[0].length, text: raw.trim() }))
    .filter((line) => line.text !== "" && !line.text.startsWith("#"));

  let index = 0;
  const peek = () => lines[index];

  function parseBlock(indent) {
    const first = peek();
    if (!first || first.indent < indent) return null;
    return isListLine(first) ? parseList(indent) : parseMap(indent);
  }

  function parseMap(indent) {
    const result = {};
    while (index < lines.length) {
      const line = peek();
      if (line.indent !== indent || isListLine(line)) break;
      const separator = line.text.indexOf(":");
      if (separator < 0) { index += 1; continue; }

      const key = line.text.slice(0, separator).trim();
      const rest = line.text.slice(separator + 1).trim();
      index += 1;

      if (rest === "") {
        const child = peek() && peek().indent > indent ? parseBlock(peek().indent) : null;
        result[key] = child ?? "";
      } else {
        result[key] = parseScalar(rest);
      }
    }
    return result;
  }

  function parseList(indent) {
    const result = [];
    while (index < lines.length) {
      const line = peek();
      if (line.indent !== indent || !isListLine(line)) break;

      const inline = line.text.replace(/^-\s*/, "");
      index += 1;

      if (inline === "") {
        const child = peek() && peek().indent > indent ? parseBlock(peek().indent) : null;
        result.push(child);
        continue;
      }

      if (isMapLine(inline)) {
        const separator = inline.indexOf(":");
        const key = inline.slice(0, separator).trim();
        const rest = inline.slice(separator + 1).trim();
        const item = {};

        if (rest === "") {
          const child = peek() && peek().indent > indent ? parseBlock(peek().indent) : null;
          item[key] = child ?? "";
        } else {
          item[key] = parseScalar(rest);
          if (peek() && peek().indent > indent) Object.assign(item, parseMap(peek().indent));
        }
        result.push(item);
        continue;
      }

      result.push(parseScalar(inline));
    }
    return result;
  }

  return parseBlock(lines[0]?.indent ?? 0) ?? {};
}

/**
 * 拆出 frontmatter 与正文。
 * 返回 { data, body, hasFrontmatter }；没有 frontmatter 时 data 为空对象。
 */
export function parseFrontmatter(text) {
  const source = String(text);
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/.exec(source);
  if (!match) return { data: {}, body: source, hasFrontmatter: false };
  return {
    data: parseYamlSubset(match[1]),
    body: source.slice(match[0].length),
    hasFrontmatter: true,
  };
}
