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
	assert.equal(
		validateRuntimeMarkdown('<picture><source media="(prefers-color-scheme: dark)" srcset="dark.png"><img src="light.png"></picture>'),
		'<picture><source media="(prefers-color-scheme: dark)" srcset="dark.png"><img src="light.png"></picture>',
	);
	assert.throws(() => validateRuntimeMarkdown('<source srcset="safe.png 1x, javascript:alert(1) 2x">'), /unsafe URL/);
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

test("preserves the NBT tree wrapper and node controls", () => {
	const html = renderRuntimeMarkdown(`::: details View [mcdoc](/feature/mcdoc)
<div class="nbttree">

<node type="compound" name="root" /> Root value
- <node type="string" name="name" required=true /> Required name
</div>
:::`, { baseUrl: "/datapack-index/" });
	assert.match(html, /<details class="details custom-block"><summary>View <a href="\/datapack-index\/feature\/mcdoc">mcdoc<\/a><\/summary>/);
	assert.match(html, /<div class="nbttree">\s*<node type="compound" name="root" \/>/);
	assert.doesNotMatch(html, /<div class="nbttree">\s*<p>/);
	assert.match(html, /<node type="compound" name="root" \/>/);
	assert.match(html, /<node type="string" name="name" required \/>/);
	assert.match(html, /<ul>/);
});

test("renders fenced code with the same single wrapper structure as VitePress", () => {
	const highlighter = {
		getLoadedLanguages: () => ["mcfunction"],
		codeToHtml: (code) => `<pre class="shiki"><code>${code}</code></pre>`,
	};
	const html = renderRuntimeMarkdown("```mcfunction\nsay hi\n```", { highlighter });
	assert.match(html, /^<div class="language-mcfunction vp-adaptive-theme">/);
	assert.match(html, /<pre v-pre class="shiki vp-code"><code>say hi<\/code><\/pre><\/div>$/);
	assert.doesNotMatch(html, /<pre><code class="language-mcfunction">/);
});

test("resolves GitHub README links and images against the repository", () => {
	const html = renderRuntimeMarkdown(
		`[Guide](docs/guide.md) ![Diagram](assets/diagram.png) [License](/LICENSE)

<picture><source srcset="assets/dark.png 1x, assets/dark@2x.png 2x"><img src="assets/light.png"></picture>`,
		{ documentPath: "https://github.com/Example/Demo/blob/main/README.md" },
	);
	assert.match(html, /href="https:\/\/github\.com\/Example\/Demo\/blob\/main\/docs\/guide\.md"/);
	assert.match(html, /src="https:\/\/raw\.githubusercontent\.com\/Example\/Demo\/main\/assets\/diagram\.png"/);
	assert.match(html, /href="https:\/\/github\.com\/Example\/Demo\/blob\/main\/LICENSE"/);
	assert.match(html, /srcset="https:\/\/raw\.githubusercontent\.com\/Example\/Demo\/main\/assets\/dark\.png 1x, https:\/\/raw\.githubusercontent\.com\/Example\/Demo\/main\/assets\/dark@2x\.png 2x"/);
	assert.match(html, /src="https:\/\/raw\.githubusercontent\.com\/Example\/Demo\/main\/assets\/light\.png"/);
});
