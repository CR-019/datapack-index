import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";

import { useKatex } from "../../markdown/katex.mjs";

const ALLOWED_COMPONENTS = new Set([
	"Badge",
	"BugList",
	"ClientOnly",
	"ColorLine",
	"FeatureHead",
	"FeaturedHead",
	"InfoCard",
	"JournalHead",
	"JournalIndex",
	"RepoCard",
	"SpotlightHead",
	"node",
]);
const SAFE_HTML_TAGS = new Set([
	"a", "abbr", "address", "article", "aside", "b", "blockquote", "br", "caption", "cite", "code",
	"col", "colgroup", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "figcaption", "figure",
	"h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "mark", "ol", "p",
	"picture", "pre", "q", "s", "samp", "small", "source", "span", "strong", "sub", "summary", "sup", "table",
	"tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul", "var", "wbr",
]);
const VOID_HTML_TAGS = new Set(["br", "col", "hr", "img", "source", "wbr"]);
const BLOCKED_HTML_TAGS = new Set([
	"base", "button", "component", "embed", "form", "iframe", "input", "keep-alive", "link", "math", "meta",
	"object", "option", "script", "select", "style", "suspense", "svg", "teleport", "textarea", "transition",
]);
const EVENT_ATTRIBUTE = /\son[a-z]+\s*=/i;
const VUE_DIRECTIVE = /\s(?:v-(?!pre\b)|@|#)[\w:[\].-]*(?:\s*=|\s|(?=\/?>))/i;
const BOUND_ATTRIBUTE = /\s:([A-Za-z_][\w-]*)\s*=\s*(["'])(.*?)\2/gs;
const SAFE_BOUND_VALUE = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')$/s;
const DANGEROUS_URL_ATTRIBUTE = /\s(?:href|src|srcset)\s*=\s*(?:["']\s*)?(?:javascript|data|vbscript):/i;
const QUOTED_URL_ATTRIBUTE = /\s(href|src|srcset)\s*=\s*(["'])(.*?)\2/gis;
const DANGEROUS_URL_SCHEME = /^(?:javascript|data|vbscript):/i;
const GITHUB_ALERT_MARKER = /^\[!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\]([^\n\r]*)/i;

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
	return escapeHtml(value).replaceAll("'", "&#39;");
}

function transformHtmlTags(fragment, transform) {
	const source = String(fragment || "");
	let output = "";
	let cursor = 0;
	while (cursor < source.length) {
		const start = source.indexOf("<", cursor);
		if (start < 0) return output + source.slice(cursor);
		output += source.slice(cursor, start);
		if (source.startsWith("<!--", start)) {
			const end = source.indexOf("-->", start + 4);
			if (end < 0) throw new Error("Package documentation contains an unterminated HTML comment");
			output += source.slice(start, end + 3);
			cursor = end + 3;
			continue;
		}
		let quote = "";
		let end = start + 1;
		for (; end < source.length; end += 1) {
			const character = source[end];
			if (quote) {
				if (character === quote) quote = "";
			} else if (character === '"' || character === "'") {
				quote = character;
			} else if (character === ">") {
				break;
			}
		}
		if (end === source.length) throw new Error("Package documentation contains an unterminated HTML tag");
		output += transform(source.slice(start, end + 1));
		cursor = end + 1;
	}
	return output;
}

function validateAndSanitizeHtmlTag(rawTag) {
	const match = rawTag.match(/^<\s*(\/?)\s*([A-Za-z][A-Za-z0-9-]*)([\s\S]*?)(\/?)\s*>$/);
	if (!match) throw new Error("Package documentation contains unsupported HTML syntax");
	const [, closing, tagName, rawAttributes, selfClosing] = match;
	const lowerName = tagName.toLowerCase();
	const component = ALLOWED_COMPONENTS.has(tagName);
	const html = SAFE_HTML_TAGS.has(lowerName);

	if (BLOCKED_HTML_TAGS.has(lowerName)) {
		throw new Error(`Package documentation uses blocked HTML element ${tagName}`);
	}
	if (!component && !html) {
		const placeholder = !rawAttributes.trim()
			&& !selfClosing
			&& (/^[a-z][a-z0-9_-]*$/.test(tagName) || /^[A-Z][A-Z0-9_]*$/.test(tagName));
		if (placeholder) return escapeHtml(rawTag);
		throw new Error(`Package documentation uses unsupported component ${tagName}`);
	}
	if (closing) {
		if (rawAttributes.trim() || selfClosing) throw new Error("Package documentation contains malformed closing HTML");
		return rawTag;
	}

	const remaining = ` ${rawAttributes}`.replace(BOUND_ATTRIBUTE, (attribute, name, _quote, expression) => {
		if (!SAFE_BOUND_VALUE.test(expression.trim())) {
			throw new Error(`Package documentation has an unsafe bound property :${name}`);
		}
		return "";
	});
	if (/\s:[^\s=>/]+/.test(remaining) || /\s\.[A-Za-z_][\w-]*(?:\s*=|\s|$)/.test(remaining)) {
		throw new Error("Package documentation has an unsafe bound property");
	}
	if (EVENT_ATTRIBUTE.test(remaining) || VUE_DIRECTIVE.test(remaining) || DANGEROUS_URL_ATTRIBUTE.test(remaining)) {
		throw new Error("Package documentation contains unsafe HTML or Vue directives");
	}
	for (const [, name, , value] of remaining.matchAll(QUOTED_URL_ATTRIBUTE)) {
		const urls = name.toLowerCase() === "srcset"
			? value.split(",").map((candidate) => candidate.trim().split(/\s+/, 1)[0])
			: [value.trim()];
		if (urls.some((url) => DANGEROUS_URL_SCHEME.test(url))) {
			throw new Error("Package documentation contains an unsafe URL");
		}
	}
	if (html && VOID_HTML_TAGS.has(lowerName) && !selfClosing) {
		return rawTag.replace(/>$/, " />");
	}
	if (tagName === "node") {
		return rawTag.replace(/\s(required|store|colon)=(true|false)(?=\s|\/?>)/gi, (_attribute, name, value) => (
			value.toLowerCase() === "true" ? ` ${name}` : ` :${name}="false"`
		));
	}
	return rawTag;
}

function rewriteHtmlUrlAttributes(rawTag, documentPath, baseUrl) {
	const tag = rawTag.match(/^<\s*([A-Za-z][A-Za-z0-9-]*)\b/);
	if (!tag || !SAFE_HTML_TAGS.has(tag[1].toLowerCase())) return rawTag;
	const lowerName = tag[1].toLowerCase();
	return rawTag.replace(QUOTED_URL_ATTRIBUTE, (attribute, name, quote, value) => {
		const lowerAttribute = name.toLowerCase();
		if (lowerAttribute === "href" && lowerName !== "a") return attribute;
		if ((lowerAttribute === "src" || lowerAttribute === "srcset") && !["img", "source"].includes(lowerName)) {
			return attribute;
		}
		const rewritten = lowerAttribute === "srcset"
			? value.split(",").map((candidate) => {
				const parts = candidate.trim().split(/\s+/);
				const url = parts.shift();
				return [rewriteUrl(url, documentPath, baseUrl, true), ...parts].join(" ");
			}).join(", ")
			: rewriteUrl(value, documentPath, baseUrl, lowerAttribute === "src");
		return ` ${name}=${quote}${escapeAttribute(rewritten)}${quote}`;
	});
}

function sanitizeHtmlFragment(fragment, documentPath = "", baseUrl = "/") {
	return transformHtmlTags(fragment, (rawTag) => rewriteHtmlUrlAttributes(
		validateAndSanitizeHtmlTag(rawTag),
		documentPath,
		baseUrl,
	));
}

function walkHtmlTokens(tokens, visitor) {
	for (const token of tokens) {
		if (token.type === "html_inline" || token.type === "html_block") visitor(token);
		if (token.children) walkHtmlTokens(token.children, visitor);
	}
}

function useTrustedHtml(markdown, documentPath, baseUrl) {
	for (const ruleName of ["html_inline", "html_block"]) {
		const defaultRenderer = markdown.renderer.rules[ruleName];
		markdown.renderer.rules[ruleName] = (tokens, index, options, env, self) => {
			const rendered = defaultRenderer
				? defaultRenderer(tokens, index, options, env, self)
				: tokens[index].content;
			return sanitizeHtmlFragment(rendered, documentPath, baseUrl);
		};
	}
}

function slugify(value) {
	return String(value)
		.toLocaleLowerCase()
		.trim()
		.replace(/<[^>]+>/g, "")
		.replace(/[^\p{Letter}\p{Number}\s_-]/gu, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "") || "section";
}

function transformContainers(source, english, renderTitle = escapeHtml) {
	const labels = english
		? { info: "Info", tip: "Tip", warning: "Warning", danger: "Danger", details: "Details" }
		: { info: "信息", tip: "提示", warning: "警告", danger: "危险", details: "详细信息" };
	const output = [];
	const stack = [];
	let fence = "";

	for (const line of String(source).replaceAll("\r\n", "\n").split("\n")) {
		const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
		if (fenceMatch) {
			const marker = fenceMatch[1][0];
			if (!fence) fence = marker;
			else if (fence === marker) fence = "";
			output.push(line);
			continue;
		}
		if (!fence) {
			const open = line.match(/^(:{3,})\s*(info|tip|warning|danger|details)\b\s*(.*?)\s*$/);
			if (open) {
				const type = open[2];
				const title = renderTitle(open[3] || labels[type]);
				if (type === "details") {
					output.push(`<details class="details custom-block"><summary>${title}</summary>`, "");
					stack.push("details");
				} else {
					output.push(`<div class="${type} custom-block"><p class="custom-block-title">${title}</p>`, "");
					stack.push("div");
				}
				continue;
			}
			if (/^:{3,}\s*$/.test(line) && stack.length) {
				output.push("", stack.pop() === "details" ? "</details>" : "</div>", "");
				continue;
			}
		}
		output.push(line);
	}
	while (stack.length) output.push("", stack.pop() === "details" ? "</details>" : "</div>", "");
	return output.join("\n");
}

function useGitHubAlerts(markdown) {
	const titles = {
		tip: "TIP",
		note: "NOTE",
		info: "INFO",
		important: "IMPORTANT",
		warning: "WARNING",
		caution: "CAUTION",
		danger: "DANGER",
	};
	markdown.core.ruler.after("block", "github-alerts", (state) => {
		for (let index = 0; index < state.tokens.length; index += 1) {
			const open = state.tokens[index];
			if (open.type !== "blockquote_open") continue;
			let end = index + 1;
			while (end < state.tokens.length && (state.tokens[end].type !== "blockquote_close" || state.tokens[end].level !== open.level)) end += 1;
			if (end === state.tokens.length) continue;
			const firstContent = state.tokens.slice(index, end + 1).find((token) => token.type === "inline");
			const match = firstContent?.content.match(GITHUB_ALERT_MARKER);
			if (!match) continue;
			const type = match[1].toLowerCase();
			const title = match[2].trim() || titles[type];
			firstContent.content = firstContent.content.slice(match[0].length).trimStart();
			open.type = "github_alert_open";
			open.tag = "div";
			open.meta = { title, type };
			state.tokens[end].type = "github_alert_close";
			state.tokens[end].tag = "div";
		}
	});
	markdown.renderer.rules.github_alert_open = (tokens, index) => {
		const { title, type } = tokens[index].meta;
		return `<div class="${type} custom-block github-alert"><p class="custom-block-title">${escapeHtml(title)}</p>\n`;
	};
}

function githubDocumentRoot(documentUrl) {
	if (!["github.com", "www.github.com"].includes(documentUrl.hostname.toLowerCase())) return null;
	const parts = documentUrl.pathname.split("/").filter(Boolean);
	if (parts.length < 5 || parts[2] !== "blob") return null;
	return `${documentUrl.origin}/${parts.slice(0, 4).join("/")}/`;
}

function githubRawImageUrl(url) {
	if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) return url.toString();
	const parts = url.pathname.split("/").filter(Boolean);
	if (parts.length < 5 || parts[2] !== "blob") return url.toString();
	return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts.slice(3).join("/")}${url.search}${url.hash}`;
}

function rewriteUrl(raw, documentPath, baseUrl, image = false) {
	if (!raw || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(raw) || /^(?:#|mailto:|tel:)/i.test(raw)) return raw;
	if (/^(?:javascript|data|vbscript):/i.test(raw)) return "#";
	if (/^https:\/\//i.test(documentPath)) {
		try {
			const documentUrl = new URL(documentPath);
			if (documentUrl.protocol !== "https:") return "#";
			const root = raw.startsWith("/") ? githubDocumentRoot(documentUrl) : null;
			const resolved = new URL(raw.replace(/^\/+/, ""), root || documentUrl);
			return image ? githubRawImageUrl(resolved) : resolved.toString();
		} catch {
			return "#";
		}
	}
	const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	if (raw.startsWith(base)) return raw;
	if (raw.startsWith("/")) return `${base}${raw.replace(/^\/+/, "")}`;
	const folder = String(documentPath || "").replaceAll("\\", "/").replace(/[^/]*$/, "");
	return new URL(raw, `https://runtime.invalid${base}${folder.replace(/^\/+/, "")}`).pathname;
}

function renderContainerTitle(value, documentPath, baseUrl) {
	const markdown = new MarkdownIt({ html: false, linkify: true, typographer: false });
	const defaultLinkOpen = markdown.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
	markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
		const href = rewriteUrl(tokens[index].attrGet("href"), documentPath, baseUrl);
		tokens[index].attrSet("href", href);
		if (/^https:\/\//i.test(href)) {
			tokens[index].attrSet("target", "_blank");
			tokens[index].attrSet("rel", "noopener noreferrer");
		}
		return defaultLinkOpen(tokens, index, options, env, self);
	};
	return markdown.renderInline(String(value || ""));
}

function normalizeNbtTreeMarkup(html) {
	return String(html).replace(
		/(<div\b[^>]*\bclass=(['"])[^'"]*\bnbttree\b[^'"]*\2[^>]*>\s*)<p>((?:(?!<\/?div\b)[\s\S])*?)<\/p>/gi,
		"$1$3",
	);
}

function codeBlock(code, language, highlighter, english) {
	const requested = String(language || "text").split(/[\s{[]/, 1)[0].toLowerCase() || "text";
	const aliases = { js: "javascript", ts: "typescript", yml: "yaml", sh: "bash", text: "plaintext", txt: "plaintext" };
	const normalized = aliases[requested] || requested;
	const loaded = highlighter?.getLoadedLanguages?.() || [];
	const resolved = loaded.includes(normalized) ? normalized : "plaintext";
	const highlighted = highlighter
		? highlighter.codeToHtml(code.trimEnd(), {
			lang: resolved,
			themes: { light: "github-light", dark: "github-dark" },
			defaultColor: false,
		}).replace(/<pre class="([^"]*)"/, '<pre v-pre class="$1 vp-code"')
		: `<pre v-pre class="shiki vp-code"><code>${escapeHtml(code.trimEnd())}</code></pre>`;
	return `<div class="language-${escapeAttribute(requested)} vp-adaptive-theme"><button title="${english ? "Copy code" : "复制代码"}" class="copy" type="button"></button><span class="lang">${escapeHtml(requested)}</span>${highlighted}</div>`;
}

export function validateRuntimeMarkdown(source) {
	const value = String(source || "");
	if (value.length > 1_000_000) throw new Error("Package documentation exceeds the rendering limit");
	const markdown = new MarkdownIt({ html: true });
	walkHtmlTokens(markdown.parse(value, {}), (token) => sanitizeHtmlFragment(token.content));
	return value;
}

export function renderRuntimeMarkdown(source, { highlighter = null, english = false, documentPath = "", baseUrl = "/" } = {}) {
	const trusted = validateRuntimeMarkdown(source);
	const markdown = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: false,
	});
	markdown.renderer.rules.fence = (tokens, index) => codeBlock(
		tokens[index].content,
		tokens[index].info,
		highlighter,
		english,
	);
	markdown.use(footnote);
	useKatex(markdown);
	useGitHubAlerts(markdown);
	useTrustedHtml(markdown, documentPath, baseUrl);

	const defaultHeading = markdown.renderer.rules.heading_open;
	markdown.renderer.rules.heading_open = (tokens, index, options, env, self) => {
		const inline = tokens[index + 1];
		const id = slugify(inline?.content || "section");
		tokens[index].attrSet("id", id);
		tokens[index].attrSet("tabindex", "-1");
		return defaultHeading ? defaultHeading(tokens, index, options, env, self) : self.renderToken(tokens, index, options);
	};
	const defaultHeadingClose = markdown.renderer.rules.heading_close;
	markdown.renderer.rules.heading_close = (tokens, index, options, env, self) => {
		const opening = tokens[index - 2];
		const id = opening?.attrGet("id") || "section";
		const closing = defaultHeadingClose ? defaultHeadingClose(tokens, index, options, env, self) : self.renderToken(tokens, index, options);
		return `<a class="header-anchor" href="#${escapeAttribute(id)}" aria-label="Permalink to this section">​</a>${closing}`;
	};
	const defaultImage = markdown.renderer.rules.image;
	markdown.renderer.rules.image = (tokens, index, options, env, self) => {
		tokens[index].attrSet("src", rewriteUrl(tokens[index].attrGet("src"), documentPath, baseUrl, true));
		tokens[index].attrSet("data-md-img", "");
		return defaultImage(tokens, index, options, env, self);
	};
	const defaultLinkOpen = markdown.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
	markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
		const href = rewriteUrl(tokens[index].attrGet("href"), documentPath, baseUrl);
		tokens[index].attrSet("href", href);
		if (/^https:\/\//i.test(href)) {
			tokens[index].attrSet("target", "_blank");
			tokens[index].attrSet("rel", "noopener noreferrer");
		}
		return defaultLinkOpen(tokens, index, options, env, self);
	};

	return normalizeNbtTreeMarkup(markdown.render(transformContainers(
		trusted,
		english,
		(title) => renderContainerTitle(title, documentPath, baseUrl),
	)))
		.replaceAll("{{", "&#123;&#123;")
		.replaceAll("}}", "&#125;&#125;");
}

export const runtimeMarkdownComponents = Object.freeze([...ALLOWED_COMPONENTS]);
