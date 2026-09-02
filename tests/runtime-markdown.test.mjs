import assert from "node:assert/strict";
import test from "node:test";

import { renderRuntimeMarkdown, validateRuntimeMarkdown } from "../.vitepress/vue/wheel/runtimeMarkdown.mjs";

test("renders the site's footnote, KaTeX, container, table, and custom-component syntax", () => {
	const source = `# Title

::: tip Notice
Inline $x^2$ and a note.[^1]
:::

| A | B |
| - | - |
| 1 | 2 |

<ColorLine :height="4" />

[^1]: Footnote text`;
	const html = renderRuntimeMarkdown(source, { english: true, baseUrl: "/datapack-index/" });
	assert.match(html, /class="tip custom-block"/);
	assert.match(html, /class="katex"/);
	assert.match(html, /class="footnotes"/);
	assert.match(html, /<table>/);
	assert.match(html, /<ColorLine :height="4" \/>/);
});

test("keeps package prose in its source language", () => {
	assert.match(renderRuntimeMarkdown("这是前置原文。", { english: true }), /这是前置原文。/);
});

test("renders VitePress GitHub alerts with the site's classes", () => {
	const html = renderRuntimeMarkdown(`> [!IMPORTANT]
> Install the dependency first.

> [!TIP] Custom title
> Keep the ordinary source prose.`);
	assert.match(html, /<div class="important custom-block github-alert"><p class="custom-block-title">IMPORTANT<\/p>/);
	assert.match(html, /Install the dependency first\./);
	assert.match(html, /<div class="tip custom-block github-alert"><p class="custom-block-title">Custom title<\/p>/);
	assert.doesNotMatch(html, /\[!IMPORTANT\]|\[!TIP\]/);
});

test("allows only registered components and inert bound values", () => {
	assert.equal(validateRuntimeMarkdown("<RepoCard repo=\"Example/Pack\" />"), "<RepoCard repo=\"Example/Pack\" />");
	assert.equal(validateRuntimeMarkdown("<node type=\"string\" name=\"value\" required=true />"), "<node type=\"string\" name=\"value\" required=true />");
	assert.throws(() => validateRuntimeMarkdown("<UnknownWidget />"), /unsupported component/);
	assert.throws(() => validateRuntimeMarkdown("<ColorLine :height=\"globalThis.fetch('https:\/\/evil.test')\" />"), /unsafe bound property/);
	assert.throws(() => validateRuntimeMarkdown("<ColorLine :height=globalThis />"), /unsafe bound property/);
	assert.throws(() => validateRuntimeMarkdown("<img src=x onerror=alert(1)>"), /unsafe HTML/);
	assert.match(renderRuntimeMarkdown("<ColorLine @click=\"attack\" />"), /&lt;ColorLine @click=/);
	assert.throws(() => validateRuntimeMarkdown("<a href=\"javascript:alert(1)\">x</a>"), /unsafe HTML/);
});

test("does not interpret Minecraft syntax in prose or code as Vue directives", () => {
	const html = renderRuntimeMarkdown(`Selectors such as \`@e[tag=\`<tag>\`]\` can appear in imperfect upstream Markdown.

\`\`\`mcfunction
execute as @s if score #input value matches 1 run function #example:tick
scoreboard players set #input value <INPUT1>
\`\`\``);
	assert.match(html, /@e\[tag=/);
	assert.match(html, /&lt;tag&gt;/);
	assert.match(html, /@s/);
	assert.match(html, /#example:tick/);
	assert.match(html, /&lt;INPUT1&gt;/);
});

test("escapes prose placeholders while preserving trusted raw HTML", () => {
	const html = renderRuntimeMarkdown("Use <INPUT1> and <value> here.<br><InfoCard />");
	assert.match(html, /Use &lt;INPUT1&gt; and &lt;value&gt; here\.<br \/><InfoCard \/>/);
});
